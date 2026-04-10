export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export const AUTH_TOKEN_STORAGE_KEY =
  import.meta.env.VITE_AUTH_TOKEN_STORAGE_KEY ?? "token";

export interface AuthTokenPayload {
  id?: number;
  email?: string;
  role?: string;
  exp?: number;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken")
  );
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
}

export function decodeAuthToken(token: string | null): AuthTokenPayload | null {
  if (!token) return null;

  try {
    const [, payloadPart] = token.split(".");
    if (!payloadPart) return null;

    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const decoded = atob(padded);
    return JSON.parse(decoded) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: AuthTokenPayload | null): boolean {
  if (!payload || typeof payload.exp !== "number") return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

async function httpRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const method = options.method ?? "GET";
  const token = getAuthToken();
  const headers = new Headers(options.headers ?? {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: hasBody
      ? isFormData
        ? (options.body as FormData)
        : JSON.stringify(options.body)
      : undefined,
  });

  const text = await response.text();
  let payload: unknown = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message?: string }).message || "Request failed")
        : "Request failed";
    throw new ApiError(message, response.status);
  }

  return payload as T;
}

export async function httpGet<T>(path: string): Promise<T> {
  return httpRequest<T>(path, { method: "GET" });
}

export async function httpPost<T>(path: string, body?: unknown): Promise<T> {
  return httpRequest<T>(path, { method: "POST", body });
}

export async function httpPut<T>(path: string, body?: unknown): Promise<T> {
  return httpRequest<T>(path, { method: "PUT", body });
}

export async function httpDelete<T>(path: string): Promise<T> {
  return httpRequest<T>(path, { method: "DELETE" });
}
