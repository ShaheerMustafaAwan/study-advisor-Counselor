import type { Page } from "@playwright/test";

const TOKEN_KEY = "token";

function base64UrlEncode(input: string | Buffer) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf8");
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function buildUnsignedCounselorJwt() {
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

export async function seedCounselorSession(page: Page) {
  const token = buildUnsignedCounselorJwt();
  await page.addInitScript(
    ([key, value]) => {
      localStorage.setItem(key, value);
    },
    [TOKEN_KEY, token],
  );
}
