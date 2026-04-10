import {
  API_BASE_URL,
  getAuthToken,
  httpDelete,
  httpGet,
  httpPut,
} from "@/api/http";

export type NotificationTypeApi = "PROFILE" | "DOCUMENT" | "SOP" | "SYSTEM";

export interface CounselorNotificationApi {
  id: number;
  counselorId: number;
  studentId: number;
  activityEventId: number | null;
  type: NotificationTypeApi;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  student?: {
    id: number;
    fullName: string;
    email: string;
  };
}

interface CounselorNotificationsResponse {
  status: "success" | "error";
  notifications: CounselorNotificationApi[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface MarkNotificationResponse {
  status: "success" | "error";
  notification: CounselorNotificationApi;
}

interface MarkAllNotificationsResponse {
  status: "success" | "error";
  message?: string;
  updatedCount: number;
}

interface DeleteNotificationResponse {
  status: "success" | "error";
  message?: string;
}

export interface CounselorNotificationQuery {
  page?: number;
  limit?: number;
  read?: "all" | "true" | "false";
  type?: "all" | NotificationTypeApi;
}

function toQueryString(query: CounselorNotificationQuery = {}) {
  const params = new URLSearchParams();

  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.read) params.set("read", query.read);
  if (query.type) params.set("type", query.type);

  const value = params.toString();
  return value ? `?${value}` : "";
}

export async function getCounselorNotifications(
  query: CounselorNotificationQuery = {},
) {
  return httpGet<CounselorNotificationsResponse>(
    `/counselor/notifications${toQueryString(query)}`,
  );
}

export async function markNotificationRead(notificationId: number | string) {
  return httpPut<MarkNotificationResponse>(
    `/counselor/notifications/${notificationId}/read`,
  );
}

export async function markAllNotificationsRead() {
  return httpPut<MarkAllNotificationsResponse>(
    "/counselor/notifications/read-all",
  );
}

export async function deleteNotification(notificationId: number | string) {
  return httpDelete<DeleteNotificationResponse>(
    `/counselor/notifications/${notificationId}`,
  );
}

interface StreamHandler {
  onConnected?: (payload: unknown) => void;
  onNotification?: (payload: CounselorNotificationApi) => void;
  onError?: (error: Error) => void;
}

function parseSseEvent(chunk: string) {
  const lines = chunk.split("\n");
  let event = "message";
  const data: string[] = [];

  for (const line of lines) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
      continue;
    }

    if (line.startsWith("data:")) {
      data.push(line.slice(5).trim());
    }
  }

  return {
    event,
    data: data.join("\n"),
  };
}

export function startCounselorNotificationStream(handler: StreamHandler) {
  const token = getAuthToken();
  const controller = new AbortController();

  const headers: HeadersInit = {
    Accept: "text/event-stream",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  (async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/counselor/notifications/stream`,
        {
          method: "GET",
          headers,
          signal: controller.signal,
        },
      );

      if (!response.ok || !response.body) {
        throw new Error("Could not connect notification stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (!controller.signal.aborted) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() || "";

        for (const chunk of chunks) {
          const parsed = parseSseEvent(chunk);
          if (!parsed.data) continue;

          let payload: unknown = parsed.data;
          try {
            payload = JSON.parse(parsed.data);
          } catch {
            payload = parsed.data;
          }

          if (parsed.event === "connected") {
            handler.onConnected?.(payload);
            continue;
          }

          if (parsed.event === "notification") {
            handler.onNotification?.(payload as CounselorNotificationApi);
          }
        }
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        const streamError =
          error instanceof Error
            ? error
            : new Error("Notification stream failed");
        handler.onError?.(streamError);
      }
    }
  })();

  return () => controller.abort();
}
