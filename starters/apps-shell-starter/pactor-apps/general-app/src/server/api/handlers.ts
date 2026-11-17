import { dispatchBusinessData } from "./index";
import type {
  ModuleApiHandler,
  ModuleApiHandlers,
  ModuleApiMethod,
} from "./types";

/** 模块 API 逻辑前缀（与 pactor.module.json 的 apiPrefixes 一致） */
export const API_PREFIX = "/api/general-app";

/**
 * 把任意深度的业务路径分发到统一实现。
 *
 * Shell 的模块分发器只支持精确路径与固定段数的 `:param` 模式，因此按
 * 0..maxDepth 段各注册一条通配路径，统一交给 `dispatchBusinessData`
 * 解析真实路径（与 next-app-starter 的 `/api/d/*` 做法一致）。
 */
export function createBusinessApiHandlers(maxDepth = 8): ModuleApiHandlers {
  const dispatch: ModuleApiHandler = (request, context) =>
    dispatchBusinessData(request, partsOf(new URL(context.url).pathname));

  const methods: ModuleApiMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  const handlers: ModuleApiHandlers = {};

  for (let depth = 0; depth <= maxDepth; depth += 1) {
    const key =
      depth === 0
        ? API_PREFIX
        : `${API_PREFIX}/${Array.from({ length: depth }, (_, i) => `:p${i}`).join("/")}`;
    const methodMap: ModuleApiHandlers[string] = {};
    for (const method of methods) methodMap[method] = dispatch;
    handlers[key] = methodMap;
  }

  return handlers;
}

function partsOf(pathname: string): string[] {
  const rest = pathname.startsWith(API_PREFIX)
    ? pathname.slice(API_PREFIX.length)
    : pathname;
  return rest.replace(/^\//, "").split("/").filter(Boolean);
}
