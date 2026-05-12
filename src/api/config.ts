const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!rawApiBaseUrl) {
  throw new Error("VITE_API_BASE_URL is not configured. Add it to .env.");
}

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");

export const AUTH_TOKEN_STORAGE_KEY =
  import.meta.env.VITE_AUTH_TOKEN_STORAGE_KEY ?? "token";
