import type { Page, Route } from "@playwright/test";

function base64UrlEncode(input: string | Buffer) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf8");
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function buildUnsignedCounselorJwt() {
  const header = { alg: "none", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  const payload = {
    sub: "e2e-counselor",
    role: "counselor",
    exp,
    iat: Math.floor(Date.now() / 1000),
  };
  return `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}.`;
}

function isBackendApi(url: URL) {
  const host = url.hostname;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "[::1]" ||
    host === "::1"
  );
}

const jsonHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "*",
  "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    headers: { "content-type": "application/json", ...jsonHeaders },
    body: JSON.stringify(body),
  });
}

const mockStudent = {
  id: 1,
  fullName: "Jane Student",
  email: "jane@example.com",
  country: "Pakistan",
  gpa: 3.5,
  ieltsScore: 7,
  phoneNumber: null,
  program: "MSc Computer Science",
  status: "Active" as const,
  progress: 45,
  profileCompletion: 80,
  createdAt: new Date().toISOString(),
  lastActivityAt: new Date().toISOString(),
  documents: [],
  missingDocumentHints: [] as string[],
};

const studentsListBody = {
  status: "success" as const,
  message: "ok",
  students: [mockStudent],
  summary: {
    total: 1,
    active: 1,
    reviewNeeded: 0,
    completed: 0,
    availablePrograms: ["MSc Computer Science"],
  },
  pagination: { page: 1, limit: 100, total: 1, totalPages: 1 },
};

const profileBody = {
  status: "success" as const,
  message: "ok",
  profile: {
    user: {
      id: 1,
      fullName: "E2E Counselor",
      email: "counselor@example.com",
      role: "counselor",
    },
  },
};

const sopReviewsBody = {
  status: "success" as const,
  reviews: [] as unknown[],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

const notificationsBody = {
  status: "success" as const,
  notifications: [] as unknown[],
  unreadCount: 0,
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
};

export async function installCounselorDashboardMocks(
  page: Page,
  options?: { interceptCounselorLogin?: boolean },
) {
  await page.route("**/*", async (route) => {
    const req = route.request();
    const method = req.method();
    const url = new URL(req.url());

    if (method === "OPTIONS" && isBackendApi(url)) {
      await route.fulfill({ status: 204, headers: jsonHeaders });
      return;
    }

    if (!isBackendApi(url)) {
      await route.continue();
      return;
    }

    const pathname = url.pathname;

    if (
      options?.interceptCounselorLogin &&
      pathname === "/api/auth/login" &&
      method === "POST"
    ) {
      await fulfillJson(route, {
        status: "success",
        message: "ok",
        token: buildUnsignedCounselorJwt(),
        user: {
          id: 1,
          fullName: "E2E Counselor",
          email: "counselor@example.com",
          role: "counselor",
        },
      });
      return;
    }

    if (pathname === "/api/profile" && method === "GET") {
      await fulfillJson(route, profileBody);
      return;
    }

    if (
      pathname === "/api/counselor/students" ||
      pathname.startsWith("/api/counselor/students?")
    ) {
      if (method === "GET") {
        await fulfillJson(route, studentsListBody);
        return;
      }
    }

    if (
      pathname === "/api/counselor/sop-reviews" ||
      pathname.startsWith("/api/counselor/sop-reviews?")
    ) {
      if (method === "GET") {
        await fulfillJson(route, sopReviewsBody);
        return;
      }
    }

    if (
      pathname === "/api/counselor/notifications" ||
      pathname.startsWith("/api/counselor/notifications?")
    ) {
      if (method === "GET") {
        await fulfillJson(route, notificationsBody);
        return;
      }
    }

    await route.continue();
  });
}

export async function mockNonCounselorLogin(page: Page) {
  await page.route("**/*", async (route) => {
    const req = route.request();
    const method = req.method();
    const url = new URL(req.url());

    if (method === "OPTIONS" && isBackendApi(url)) {
      await route.fulfill({ status: 204, headers: jsonHeaders });
      return;
    }

    if (!isBackendApi(url)) {
      await route.continue();
      return;
    }

    if (url.pathname === "/api/auth/login" && method === "POST") {
      await fulfillJson(route, {
        status: "success",
        message: "ok",
        token: "student-token",
        user: {
          id: 2,
          fullName: "Student User",
          email: "student@example.com",
          role: "student",
        },
      });
      return;
    }

    await route.continue();
  });
}
