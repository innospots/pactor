import { requestCookies } from "../auth/cookies";
import { findUserBySession, SESSION_COOKIE } from "../mock/accounts";
import { corsHeaders } from "../cors";
import usersFixture from "../fixtures/users.json";

type User = (typeof usersFixture)[number] & { status: string };
const state = globalThis as typeof globalThis & { starterUsers?: User[] };
state.starterUsers ??= usersFixture.map((user) => ({
  ...user,
  status: "status" in user ? String(user.status) : "ENABLED",
}));

function currentUser(request: Request) {
  const cookies = requestCookies(request);
  return findUserBySession(cookies.get(SESSION_COOKIE));
}

function authorized(request: Request) {
  const user = currentUser(request);
  return user != null && user.permissions.includes("user:view");
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "未登录或无权限" }, { status: 401, headers: corsHeaders(request) });
  }
  const url = new URL(request.url);
  const keyword = (url.searchParams.get("keyword") ?? "").trim().toLowerCase();
  const role = url.searchParams.get("role") ?? "";
  const rows = state.starterUsers!.filter((user) => {
    const matchesKeyword =
      !keyword ||
      user.name.toLowerCase().includes(keyword) ||
      user.username.toLowerCase().includes(keyword);
    return matchesKeyword && (!role || user.role === role);
  });
  return Response.json(rows, { headers: { "cache-control": "no-store", ...corsHeaders(request) } });
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "未登录或无权限" }, { status: 401, headers: corsHeaders(request) });
  }
  const input = (await request.json().catch(() => ({}))) as Partial<User>;
  if (!input.name?.trim() || !input.username?.trim() || !input.email?.trim()) {
    return Response.json({ ok: false, error: "姓名、用户名和邮箱不能为空" }, { status: 400 });
  }
  const rows = state.starterUsers!;
  if (rows.some((user) => user.username === input.username?.trim())) {
    return Response.json({ ok: false, error: "用户名已存在" }, { status: 409 });
  }
  const user: User = {
    id: crypto.randomUUID(),
    username: input.username.trim(),
    name: input.name.trim(),
    role: input.role === "admin" || input.role === "guest" ? input.role : "member",
    email: input.email.trim(),
    status: "ENABLED",
    createdAt: new Date().toISOString().slice(0, 10),
  };
  rows.unshift(user);
  return Response.json(user, { headers: corsHeaders(request) });
}

export async function PATCH(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "未登录或无权限" }, { status: 401, headers: corsHeaders(request) });
  }
  const input = (await request.json().catch(() => ({}))) as {
    id?: string;
    action?: string;
    name?: string;
    email?: string;
    role?: string;
    status?: string;
  };
  const user = state.starterUsers!.find((row) => row.id === input.id);
  if (!user) {
    return Response.json({ ok: false, error: "用户不存在" }, { status: 404 });
  }
  if (input.action === "status") {
    user.status = input.status === "DISABLED" ? "DISABLED" : "ENABLED";
  } else {
    if (input.name !== undefined) user.name = input.name.trim();
    if (input.email !== undefined) user.email = input.email.trim();
    if (input.role === "admin" || input.role === "member" || input.role === "guest") {
      user.role = input.role;
    }
  }
  return Response.json({ ok: true, item: user }, { headers: corsHeaders(request) });
}

export async function DELETE(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "未登录或无权限" }, { status: 401, headers: corsHeaders(request) });
  }
  const id = new URL(request.url).searchParams.get("id");
  const rows = state.starterUsers!;
  const index = rows.findIndex((user) => user.id === id);
  if (index < 0) {
    return Response.json({ ok: false, error: "用户不存在" }, { status: 404 });
  }
  rows.splice(index, 1);
  return Response.json({ ok: true }, { headers: corsHeaders(request) });
}
