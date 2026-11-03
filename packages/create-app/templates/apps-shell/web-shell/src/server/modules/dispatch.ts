import { moduleServers } from "@generated/pactor/server-registry";

import type {
  ModuleApiContext,
  ModuleApiHandler,
  ModuleApiHandlers,
  ModuleApiMethod,
  ModuleServerRegistryEntry,
} from "./types";

const MOUNT_PREFIX = "/api/modules/";

/** Next 16 的 catch-all params 是 Promise；path 仅用于类型，实际路径从原始 URL 还原 */
export type ModuleApiRouteContext = {
  params: Promise<{ moduleId: string; path?: string[] }>;
};

type ParsedRequest = {
  moduleId: string;
  /** 原始 /api/... 逻辑路径（保留百分号编码） */
  logicalPath: string;
  search: string;
};

type HandlerMatch = {
  handlers: Partial<Record<ModuleApiMethod, ModuleApiHandler>>;
  params: Record<string, string>;
};

function notFound(): Response {
  return jsonError(404, "not_found");
}

function jsonError(
  status: number,
  error: string,
  headers?: Record<string, string>,
): Response {
  return Response.json(
    { error },
    {
      status,
      headers: { "cache-control": "no-store", ...headers },
    },
  );
}

/**
 * 用原始 pathname 还原模块 id 与逻辑路径。
 * 不使用 route params.path：Next 会先解码，%2F 等编码会产生路径歧义。
 */
function parseRequest(requestUrl: string): ParsedRequest | null {
  let url: URL;
  try {
    url = new URL(requestUrl);
  } catch {
    return null;
  }

  const pathname = url.pathname;
  if (!pathname.startsWith(MOUNT_PREFIX)) return null;

  const rest = pathname.slice(MOUNT_PREFIX.length);
  if (!rest) return null;

  const slash = rest.indexOf("/");
  const rawModuleId = slash === -1 ? rest : rest.slice(0, slash);
  const rawRest = slash === -1 ? "" : rest.slice(slash);

  let moduleId: string;
  try {
    moduleId = decodeURIComponent(rawModuleId);
  } catch {
    return null;
  }
  if (!moduleId) return null;

  return {
    moduleId,
    logicalPath: rawRest ? `/api${rawRest}` : "/api",
    search: url.search,
  };
}

function isWithinPrefixes(path: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

function matchHandler(
  handlers: ModuleApiHandlers,
  logicalPath: string,
): HandlerMatch | null {
  const exact = handlers[logicalPath];
  if (exact) return { handlers: exact, params: {} };

  const pathSegments = logicalPath.split("/");
  for (const [pattern, methodMap] of Object.entries(handlers)) {
    if (!pattern.includes(":")) continue;

    const patternSegments = pattern.split("/");
    if (patternSegments.length !== pathSegments.length) continue;

    const params: Record<string, string> = {};
    let matched = true;
    for (let i = 0; i < patternSegments.length; i += 1) {
      const expected = patternSegments[i]!;
      const actual = pathSegments[i]!;
      if (expected.startsWith(":")) {
        if (!actual) {
          matched = false;
          break;
        }
        try {
          params[expected.slice(1)] = decodeURIComponent(actual);
        } catch {
          matched = false;
          break;
        }
        continue;
      }
      if (expected !== actual) {
        matched = false;
        break;
      }
    }

    if (matched) return { handlers: methodMap, params };
  }

  return null;
}

/** 稳定顺序的 Allow；GET 存在时补 HEAD，OPTIONS 始终可用 */
function allowedMethods(
  handlers: Partial<Record<ModuleApiMethod, ModuleApiHandler>>,
): string[] {
  const available = new Set<string>(Object.keys(handlers));
  if (available.has("GET")) available.add("HEAD");
  available.add("OPTIONS");
  return ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"].filter(
    (method) => available.has(method),
  );
}

function entryFor(moduleId: string): ModuleServerRegistryEntry | null {
  if (!Object.prototype.hasOwnProperty.call(moduleServers, moduleId)) {
    return null;
  }
  return moduleServers[moduleId] ?? null;
}

/**
 * 通用模块 API 分发器。
 *
 * 公开 URL：/api/modules/<moduleId>/<原 /api 之后的路径>
 * - 逻辑路径必须落在模块声明的 apiPrefixes 内；
 * - 先精确匹配 handlers 键，再匹配 :param 模式；
 * - 路径命中但方法不支持 → 405 + Allow；HEAD 无 handler 时回退 GET；
 * - OPTIONS 由分发器计算 Allow（不依赖 Next 按 route 文件导出生成）。
 *
 * 鉴权保持现状：不做隐式校验，原样传递 request；模块可读 cookie/header。
 */
export async function dispatchModuleApi(
  request: Request,
  context: ModuleApiRouteContext,
): Promise<Response> {
  const parsed = parseRequest(request.url);
  if (!parsed) return notFound();

  const routeParams = await context.params;
  if (routeParams.moduleId !== parsed.moduleId) return notFound();

  const entry = entryFor(parsed.moduleId);
  if (!entry) return notFound();

  const { logicalPath } = parsed;
  if (!isWithinPrefixes(logicalPath, entry.prefixes)) return notFound();

  const match = matchHandler(entry.handlers, logicalPath);
  if (!match) return notFound();

  const method = request.method.toUpperCase();
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        Allow: allowedMethods(match.handlers).join(", "),
        "cache-control": "no-store",
      },
    });
  }

  let handler =
    method in match.handlers
      ? match.handlers[method as ModuleApiMethod]
      : undefined;
  if (!handler && method === "HEAD") handler = match.handlers.GET;

  if (!handler) {
    return jsonError(405, "method_not_allowed", {
      Allow: allowedMethods(match.handlers).join(", "),
    });
  }

  const logicalUrl = new URL(logicalPath, "http://module.local");
  logicalUrl.search = parsed.search;

  const apiContext: ModuleApiContext = {
    moduleId: entry.moduleId,
    url: logicalUrl,
    params: match.params,
  };

  try {
    return await handler(request, apiContext);
  } catch (error) {
    console.error(
      `[module-api] ${entry.moduleId} ${method} ${logicalPath} 执行失败`,
      error,
    );
    return jsonError(500, "internal_error");
  }
}
