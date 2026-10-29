import { requestCookies } from "../auth/cookies";
import { findUserBySession, SESSION_COOKIE } from "../auth/accounts";
import { corsHeaders } from "../cors";

type Item = { itemValue: string; itemName: string };
type Dictionary = { id: string; code: string; name: string; status: string; items: Item[] };

const state = globalThis as typeof globalThis & {
  starterDictionaries?: Dictionary[];
};
state.starterDictionaries ??= [
  { id: "status", code: "STATUS", name: "通用状态", status: "ENABLED", items: [{ itemValue: "ENABLED", itemName: "启用" }, { itemValue: "DISABLED", itemName: "禁用" }] },
  { id: "priority", code: "PRIORITY", name: "优先级", status: "ENABLED", items: [{ itemValue: "HIGH", itemName: "高" }, { itemValue: "MEDIUM", itemName: "中" }, { itemValue: "LOW", itemName: "低" }] },
  { id: "category", code: "CATEGORY", name: "业务分类", status: "ENABLED", items: [{ itemValue: "OPERATION", itemName: "运营" }, { itemValue: "TECH", itemName: "技术" }, { itemValue: "MANAGEMENT", itemName: "管理" }] },
  { id: "notice_type", code: "NOTICE_TYPE", name: "通知类型", status: "DISABLED", items: [{ itemValue: "SYSTEM", itemName: "系统通知" }, { itemValue: "TASK", itemName: "任务提醒" }] },
];

function authorized(request: Request): boolean {
  const cookies = requestCookies(request);
  return !!findUserBySession(cookies.get(SESSION_COOKIE));
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "未登录" }, { status: 401, headers: corsHeaders(request) });
  }
  return Response.json(state.starterDictionaries, {
    headers: { "cache-control": "no-store", ...corsHeaders(request) },
  });
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "未登录" }, { status: 401, headers: corsHeaders(request) });
  }
  let input: Dictionary;
  try {
    input = (await request.json()) as Dictionary;
  } catch {
    return Response.json({ error: "请求格式无效" }, { status: 400 });
  }
  const valid =
    input &&
    typeof input.name === "string" &&
    typeof input.code === "string" &&
    input.name.trim() &&
    /^[A-Za-z][A-Za-z0-9_]*$/.test(input.code) &&
    Array.isArray(input.items) &&
    input.items.every(
      (item) => item && typeof item.itemValue === "string" && typeof item.itemName === "string" && item.itemValue.trim() && item.itemName.trim(),
    );
  if (!valid) {
    return Response.json({ error: "请填写有效的字典名称、编码和字典项" }, { status: 400 });
  }
  const rows = state.starterDictionaries!;
  if (rows.some((row) => row.code.toLowerCase() === input.code.trim().toLowerCase() && row.id !== input.id)) {
    return Response.json({ error: "字典编码已存在" }, { status: 409 });
  }
  const index = rows.findIndex((row) => row.id === input.id);
  const row: Dictionary = {
    id: index >= 0 ? rows[index].id : crypto.randomUUID(),
    name: input.name.trim(),
    code: input.code.trim(),
    status: input.status === "DISABLED" ? "DISABLED" : "ENABLED",
    items: input.items.map((item) => ({
      itemValue: item.itemValue.trim(),
      itemName: item.itemName.trim(),
    })),
  };
  if (index >= 0) rows[index] = row;
  else rows.unshift(row);
  return Response.json(row, { headers: corsHeaders(request) });
}
