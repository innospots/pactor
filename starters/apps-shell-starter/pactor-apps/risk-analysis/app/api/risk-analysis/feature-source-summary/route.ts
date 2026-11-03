import { createFeatureSourceSummaryResponse } from "@/server/api/feature-source-summary";

export const dynamic = "force-dynamic";

/**
 * 特征来源汇总：表格专用接口，与 /api/risk-analysis/data-value 解耦。
 *
 * 该路由仅服务 standalone 运行；模块打包后由 module/server.ts 的
 * /api/risk-analysis/feature-source-summary handler 经 Shell 的
 * /api/modules/<moduleId>/* 统一分发，二者共用同一响应实现。
 */
export function GET(request: Request) {
  return createFeatureSourceSummaryResponse(new URL(request.url).searchParams);
}
