import { buildDataValue } from "@/shared/data-value";

/**
 * 数据源价值页数据：KPI / 特征分布 / IV-KS 散点 / PSI Top。
 *
 * 与 Next 路由解耦，standalone 的 app/api/risk-analysis/data-value 与
 * 模块 server entry 共用同一实现。特征来源汇总表由独立接口
 * /api/risk-analysis/feature-source-summary 供给，便于单独分页与后续接入
 * 真实服务。数据按日期区间（start / end）生成：同一区间结果稳定，切换区间
 * 后 KPI / 分布 / 图表随之变化。
 */
export function createDataValueResponse(params: URLSearchParams): Response {
  const start = params.get("start") ?? "";
  const end = params.get("end") ?? "";

  const value = buildDataValue(start, end);
  const data = {
    ...value,
    categories: value.categories.map((category) => ({
      ...category,
      bg: `color-mix(in srgb, var(--primary) ${Math.round(
        10 + category.pct * 0.7,
      )}%, var(--card))`,
    })),
    // 图表类目轴默认自下而上排列：反序后最高 PSI 落在图表顶部。
    // 稳定 / 漂移拆为两组数值字段，由 BarChart 堆叠系列分色渲染。
    psi: [...value.psi].reverse().map((item) => ({
      name: item.name,
      value: item.value,
      "稳定": item.value > 0.1 ? 0 : item.value,
      "漂移": item.value > 0.1 ? item.value : 0,
    })),
    range: { start, end },
  };

  return Response.json(
    { code: 0, data, message: "ok" },
    { headers: { "cache-control": "no-store" } },
  );
}
