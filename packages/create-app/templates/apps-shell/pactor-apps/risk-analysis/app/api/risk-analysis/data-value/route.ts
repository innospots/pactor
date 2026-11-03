import { createDataValueResponse } from "@/server/api/data-value";

export const dynamic = "force-dynamic";

/**
 * 数据源价值页数据：KPI / 特征分布 / IV-KS 散点 / PSI Top。
 *
 * 该路由仅服务 standalone 运行；模块打包后由 module/server.ts 的
 * /api/risk-analysis/data-value handler 经 Shell 的
 * /api/modules/<moduleId>/* 统一分发，二者共用同一响应实现。
 */
export function GET(request: Request) {
  return createDataValueResponse(new URL(request.url).searchParams);
}
