import { mockBusinessData } from "./index";

/** Shell 模块 API 与独立 Next /api/d 共用的原型数据分发 */
export type ModuleApiMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type ModuleApiContext = {
  moduleId: string;
  url: URL;
  params: Record<string, string>;
};

export type ModuleApiHandler = (
  request: Request,
  context: ModuleApiContext,
) => Response | Promise<Response>;

export type ModuleApiHandlers = Record<
  string,
  Partial<Record<ModuleApiMethod, ModuleApiHandler>>
>;

function parseApiDParts(pathname: string): string[] {
  const rest = pathname.startsWith("/api/d")
    ? pathname.slice("/api/d".length)
    : pathname;
  return rest.replace(/^\//, "").split("/").filter(Boolean);
}

function createDispatchHandler(): ModuleApiHandler {
  return async (request, context) => {
    const parts = parseApiDParts(context.url.pathname);
    return mockBusinessData(request, parts);
  };
}

const WRITE_METHODS: ModuleApiMethod[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
];

/**
 * 为 /api/d 下可变深度路径注册 handlers（Shell 仅支持精确与 :param 段匹配）。
 * 深度 0 = /api/d；1..maxDepth = /api/d/:p0/...
 */
export function createModuleDApiHandlers(maxDepth = 8): ModuleApiHandlers {
  const dispatch = createDispatchHandler();
  const handlers: ModuleApiHandlers = {};

  for (let depth = 0; depth <= maxDepth; depth += 1) {
    const paramPath =
      depth === 0
        ? "/api/d"
        : `/api/d/${Array.from({ length: depth }, (_, i) => `:p${i}`).join("/")}`;
    const methodMap: Partial<Record<ModuleApiMethod, ModuleApiHandler>> = {};
    for (const method of WRITE_METHODS) {
      methodMap[method] = dispatch;
    }
    handlers[paramPath] = methodMap;
  }

  return handlers;
}
