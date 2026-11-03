import dictionariesFixture from "../fixtures/dictionaries.json";
import { requestCookies } from "../auth/cookies";
import { findUserBySession, SESSION_COOKIE } from "../mock/accounts";
import { corsHeaders } from "../cors";

type Item = { itemValue: string; itemName: string };
type Dictionary = { id: string; code: string; name: string; status: string; items: Item[] };

const state = globalThis as typeof globalThis & {
  starterDictionaries?: Dictionary[];
};
state.starterDictionaries ??= structuredClone(dictionariesFixture);

function authorized(request: Request): boolean {
  const cookies = requestCookies(request);
  return !!findUserBySession(cookies.get(SESSION_COOKIE));
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "未登录" }, { status: 401, headers: corsHeaders(request) });
  }
  const params = new URL(request.url).searchParams;
  const keyword = (params.get("keyword") ?? "").trim().toLowerCase();
  const status = params.get("status") ?? "";
  const filtered = state.starterDictionaries!.filter((row) =>
    (!status || row.status === status) && `${row.name} ${row.code}`.toLowerCase().includes(keyword),
  );
  const page = Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1);
  const result = params.has("page")
    ? { records: filtered.slice((page - 1) * 10, page * 10), total: filtered.length, page, pageSize: 10 }
    : filtered;
  return Response.json(result, {
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
