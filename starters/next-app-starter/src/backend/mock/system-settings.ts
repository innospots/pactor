import { requestCookies } from "../auth/cookies";
import { findUserBySession, SESSION_COOKIE } from "../auth/accounts";
import { corsHeaders } from "../cors";
import defaults from "../fixtures/system-settings.json";

type Settings = typeof defaults;
const state = globalThis as typeof globalThis & { starterSystemSettings?: Settings };
state.starterSystemSettings = { ...defaults, ...state.starterSystemSettings };

function authorized(request: Request): boolean {
  const cookies = requestCookies(request);
  return !!findUserBySession(cookies.get(SESSION_COOKIE));
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "未登录" }, { status: 401, headers: corsHeaders(request) });
  }
  return Response.json(state.starterSystemSettings, {
    headers: { "cache-control": "no-store", ...corsHeaders(request) },
  });
}

export async function PATCH(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "未登录" }, { status: 401, headers: corsHeaders(request) });
  }
  let input: { key?: unknown; value?: unknown };
  try {
    input = (await request.json()) as { key?: unknown; value?: unknown };
  } catch {
    return Response.json({ error: "请求格式无效" }, { status: 400 });
  }
  if (
    typeof input.key !== "string" ||
    !Object.hasOwn(defaults, input.key) ||
    typeof input.value !== "string"
  ) {
    return Response.json({ error: "设置项无效" }, { status: 400 });
  }
  const key = input.key as keyof Settings;
  const value = input.value.trim();
  const valid =
    (key === "siteName" && !!value && value.length <= 80) ||
    (key === "description" && value.length <= 200) ||
    (key === "timezone" && ["Asia/Shanghai", "UTC", "America/New_York"].includes(value)) ||
    (key === "language" && ["zh-CN", "en-US"].includes(value)) ||
    (key === "pageSize" && ["10", "20", "50"].includes(value)) ||
    (key === "sessionTimeout" && ["15", "30", "60", "120"].includes(value));
  if (!valid) {
    return Response.json({ error: "设置值无效" }, { status: 400 });
  }
  state.starterSystemSettings![key] = value;
  return Response.json({ key, value }, { headers: corsHeaders(request) });
}
