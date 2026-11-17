import { corsHeaders } from "./http";
import * as auditLogs from "./audit-logs";
import * as dashboard from "./dashboard";
import * as dataList from "./data-list";
import * as dictionaries from "./dictionaries";
import * as monitoring from "./monitoring";
import * as roles from "./roles";
import * as systemSettings from "./system-settings";
import * as users from "./users";

const handlers: Record<string, Record<string, unknown>> = {
  dashboard,
  monitoring,
  "data-list": dataList,
  users,
  dictionaries,
  "audit-logs": auditLogs,
  "system-settings": systemSettings,
};

type MockHandler = (
  request: Request,
  parts: string[],
) => Promise<Response | undefined> | Response | undefined;

export async function dispatchBusinessData(
  request: Request,
  parts: string[],
): Promise<Response> {
  // 模块分发器对 HEAD 会复用 GET handler，但 request.method 仍是 HEAD；
  // 内部分发统一按 GET 处理（响应体由运行层按 HEAD 语义丢弃）。
  const method = request.method === "HEAD" ? "GET" : request.method;
  // 数据列表页沿用标准列表骨架的保存路径；它不是资源组下的子路径。
  if (parts.join("/") === "ops/data-list-save") {
    if (method !== "POST") {
      return Response.json(
        { error: "不支持的请求方法" },
        { status: 405, headers: corsHeaders(request) },
      );
    }
    return dataList.POST(request);
  }

  const group = handlers[parts[0]];
  if (group) {
    const handler = group[method] as MockHandler | undefined;
    if (!handler) {
      return Response.json(
        { error: "不支持的请求方法" },
        { status: 405, headers: corsHeaders(request) },
      );
    }
    const response = await handler(request, parts.slice(1));
    if (response) return response;
  }

  const roleHandler = roles[method as keyof typeof roles] as
    | MockHandler
    | undefined;
  const roleResponse = await roleHandler?.(request, parts);
  if (roleResponse) return roleResponse;

  return Response.json(
    { error: "接口不存在" },
    { status: 404, headers: corsHeaders(request) },
  );
}
