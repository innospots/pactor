import { corsHeaders } from "../cors";
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

export async function mockBusinessData(
  request: Request,
  parts: string[],
): Promise<Response> {
  // 数据列表页沿用标准列表骨架的保存路径；它不是资源组下的子路径。
  if (parts.join("/") === "ops/data-list-save") {
    if (request.method !== "POST") {
      return Response.json(
        { error: "不支持的请求方法" },
        { status: 405, headers: corsHeaders(request) },
      );
    }
    return dataList.POST(request);
  }

  const group = handlers[parts[0]];
  if (group) {
    const handler = group[request.method] as MockHandler | undefined;
    if (!handler) {
      return Response.json(
        { error: "不支持的请求方法" },
        { status: 405, headers: corsHeaders(request) },
      );
    }
    const response = await handler(request, parts.slice(1));
    if (response) return response;
  }

  const roleHandler = roles[request.method as keyof typeof roles] as
    | MockHandler
    | undefined;
  const roleResponse = await roleHandler?.(request, parts);
  if (roleResponse) return roleResponse;

  return Response.json(
    { error: "接口不存在" },
    { status: 404, headers: corsHeaders(request) },
  );
}
