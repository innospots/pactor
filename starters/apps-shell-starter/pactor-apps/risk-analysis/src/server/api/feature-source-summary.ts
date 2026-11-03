import {
  buildFeatureSourceRows,
  type CostLevel,
} from "@/shared/data-value";

const COST_CLASS: Record<CostLevel, string> = {
  低: "low",
  中: "mid",
  高: "high",
};

/**
 * 特征来源汇总：表格专用接口，与 /api/risk-analysis/data-value 解耦。
 *
 * 与 Next 路由解耦，standalone 路由与模块 server entry 共用同一实现。按日期
 * 区间（start / end）与分页参数返回各来源的特征数量、区分能力与稳定性指标。
 * 行数据由区间种子生成：同一区间结果稳定，切换区间则特征数量与质量指标随之
 * 变化（接入真实分析服务后在此替换数据源即可）。表格数值在接口侧预格式化
 * （保留小数 / 百分比），页面 Table 零映射直渲。
 */
export function createFeatureSourceSummaryResponse(
  params: URLSearchParams,
): Response {
  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.min(
    50,
    Math.max(5, Number(params.get("pageSize")) || 20),
  );
  const start = params.get("start") ?? "";
  const end = params.get("end") ?? "";

  const sourceRows = buildFeatureSourceRows(start, end);
  const total = sourceRows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const offset = (safePage - 1) * pageSize;
  const rows = sourceRows.slice(offset, offset + pageSize).map((row) => ({
    ...row,
    ivText: row.iv.toFixed(3),
    ksText: row.ks.toFixed(3),
    psiText: row.psi.toFixed(3),
    nullRateText: `${row.nullRate.toFixed(1)}%`,
    abnormalRateText: `${row.abnormalRate.toFixed(1)}%`,
    costClass: COST_CLASS[row.cost],
  }));

  return Response.json(
    {
      code: 0,
      data: {
        rows,
        total,
        page: safePage,
        pageSize,
        pageCount,
        range: { start, end },
      },
      message: "ok",
    },
    { headers: { "cache-control": "no-store" } },
  );
}
