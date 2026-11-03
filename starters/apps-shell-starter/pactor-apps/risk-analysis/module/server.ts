import { createDataValueResponse } from "@/server/api/data-value";
import { createFeatureSourceSummaryResponse } from "@/server/api/feature-source-summary";

/**
 * 模块服务端契约。
 *
 * 与 Shell 侧 @/server/modules/types 保持结构一致，但不跨仓库 import，
 * 避免模块工程依赖宿主路径。路径键使用模块逻辑路径（原始 /api/...），
 * 由 Shell 的 /api/modules/<moduleId>/* 分发器还原后匹配。
 */
export type ModuleApiMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export interface ModuleApiContext {
  moduleId: string;
  /** 逻辑 URL：原始 /api/... 路径 + query（不是 /api/modules/... 挂载 URL） */
  url: URL;
  /** :param 段解析结果 */
  params: Record<string, string>;
}

export type ModuleApiHandler = (
  request: Request,
  context: ModuleApiContext,
) => Response | Promise<Response>;

export type ModuleApiHandlers = Record<
  string,
  Partial<Record<ModuleApiMethod, ModuleApiHandler>>
>;

export const handlers: ModuleApiHandlers = {
  "/api/risk-analysis/data-value": {
    GET: (_request, context) =>
      createDataValueResponse(context.url.searchParams),
  },
  "/api/risk-analysis/feature-source-summary": {
    GET: (_request, context) =>
      createFeatureSourceSummaryResponse(context.url.searchParams),
  },
};
