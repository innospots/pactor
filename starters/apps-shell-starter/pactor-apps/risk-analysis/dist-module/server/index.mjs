// src/shared/data-value.ts
var DATA_VALUE_KPIS = [
  { key: "total", label: "\u7279\u5F81\u603B\u91CF", value: "256", unit: "\u4E2A", footnote: "\u6279\u6B21\u5171 256 \u4E2A" },
  { key: "active", label: "\u4F7F\u7528\u4E2D\u7279\u5F81\u91CF", value: "225", unit: "\u4E2A", footnote: "-" },
  { key: "abnormal", label: "\u5F02\u5E38\u7279\u5F81\u91CF", value: "18", unit: "\u4E2A", footnote: "-" },
  { key: "valued", label: "\u6709\u503C\u7279\u5F81\u91CF", value: "248", unit: "\u4E2A", footnote: "-" }
];
var DATA_SOURCE_ROWS = [
  { source: "\u7528\u6237\u57FA\u7840\u4FE1\u606F", count: 42, iv: 0.32, ks: 0.28, psi: 0.012, nullRate: 3.2, abnormalRate: 1.1, cost: "\u4F4E" },
  { source: "\u8BBE\u5907\u73AF\u5883", count: 28, iv: 0.45, ks: 0.36, psi: 8e-3, nullRate: 1.8, abnormalRate: 0.6, cost: "\u4E2D" },
  { source: "\u4EA4\u6613\u884C\u4E3A", count: 24, iv: 0.52, ks: 0.41, psi: 0.021, nullRate: 4.5, abnormalRate: 2.3, cost: "\u9AD8" },
  { source: "\u4FE1\u8D37\u8BB0\u5F55", count: 21, iv: 0.61, ks: 0.47, psi: 0.015, nullRate: 2.1, abnormalRate: 1.4, cost: "\u9AD8" },
  { source: "\u5173\u7CFB\u7F51\u7EDC", count: 18, iv: 0.27, ks: 0.22, psi: 0.031, nullRate: 6.8, abnormalRate: 3.9, cost: "\u4E2D" },
  { source: "\u5730\u7406\u4F4D\u7F6E", count: 16, iv: 0.24, ks: 0.19, psi: 5e-3, nullRate: 0.9, abnormalRate: 0.3, cost: "\u4F4E" },
  { source: "\u98CE\u9669\u540D\u5355", count: 14, iv: 0.58, ks: 0.44, psi: 0.018, nullRate: 1.2, abnormalRate: 0.8, cost: "\u4E2D" },
  { source: "\u8425\u9500\u54CD\u5E94", count: 12, iv: 0.12, ks: 0.09, psi: 0.042, nullRate: 8.1, abnormalRate: 5.2, cost: "\u4F4E" },
  { source: "\u652F\u4ED8\u884C\u4E3A", count: 11, iv: 0.49, ks: 0.38, psi: 9e-3, nullRate: 1.5, abnormalRate: 0.7, cost: "\u4E2D" },
  { source: "\u8D26\u6237\u5B89\u5168", count: 10, iv: 0.55, ks: 0.43, psi: 0.014, nullRate: 2.4, abnormalRate: 1.2, cost: "\u9AD8" },
  { source: "\u5BA2\u670D\u8BB0\u5F55", count: 9, iv: 0.18, ks: 0.14, psi: 0.027, nullRate: 5.2, abnormalRate: 2.8, cost: "\u4F4E" },
  { source: "\u5916\u90E8\u6570\u636E", count: 8, iv: 0.36, ks: 0.29, psi: 6e-3, nullRate: 0.7, abnormalRate: 0.2, cost: "\u4E2D" },
  { source: "\u767B\u5F55\u65E5\u5FD7", count: 7, iv: 0.22, ks: 0.17, psi: 0.011, nullRate: 1.1, abnormalRate: 0.4, cost: "\u4F4E" },
  { source: "\u6D4F\u89C8\u884C\u4E3A", count: 6, iv: 0.15, ks: 0.11, psi: 0.019, nullRate: 3.8, abnormalRate: 1.6, cost: "\u4F4E" },
  { source: "\u7533\u8BF7\u4FE1\u606F", count: 6, iv: 0.41, ks: 0.33, psi: 4e-3, nullRate: 0.6, abnormalRate: 0.2, cost: "\u4E2D" },
  { source: "\u6388\u4FE1\u8BB0\u5F55", count: 5, iv: 0.57, ks: 0.45, psi: 0.013, nullRate: 1.9, abnormalRate: 0.9, cost: "\u9AD8" },
  { source: "\u8FD8\u6B3E\u884C\u4E3A", count: 5, iv: 0.53, ks: 0.42, psi: 0.01, nullRate: 1.3, abnormalRate: 0.5, cost: "\u4E2D" },
  { source: "\u50AC\u6536\u8BB0\u5F55", count: 4, iv: 0.47, ks: 0.37, psi: 0.016, nullRate: 2.7, abnormalRate: 1.8, cost: "\u9AD8" },
  { source: "\u793E\u4EA4\u4E92\u52A8", count: 4, iv: 0.13, ks: 0.1, psi: 0.035, nullRate: 7.3, abnormalRate: 4.6, cost: "\u4F4E" },
  { source: "\u7535\u5546\u6D88\u8D39", count: 3, iv: 0.29, ks: 0.23, psi: 7e-3, nullRate: 0.8, abnormalRate: 0.3, cost: "\u4F4E" },
  { source: "\u51FA\u884C\u8F68\u8FF9", count: 2, iv: 0.26, ks: 0.21, psi: 0.024, nullRate: 3.1, abnormalRate: 1.5, cost: "\u4E2D" },
  { source: "\u516C\u5171\u8BB0\u5F55", count: 1, iv: 0.34, ks: 0.27, psi: 3e-3, nullRate: 0.4, abnormalRate: 0.1, cost: "\u4F4E" }
];
var FEATURE_CATEGORIES = [
  { key: "BEHAVIOR", pct: 34, count: 50 },
  { key: "DEVICE", pct: 26, count: 38 },
  { key: "ORDER", pct: 25, count: 31 },
  { key: "LOCATION", pct: 23, count: 31 },
  { key: "PRODUCT", pct: 23, count: 21 },
  { key: "USER", pct: 23, count: 22 },
  { key: "RISK_DECISION", pct: 21, count: 35 },
  { key: "NETWORK", pct: 20, count: 44 },
  { key: "ACCOUNT", pct: 15, count: 19 },
  { key: "REGISTRATION", pct: 20, count: 18 },
  { key: "LIST", pct: 14, count: 12 },
  { key: "CARD_MEDIUM", pct: 12, count: 11 }
];
function makeRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}
function buildScatterPoints(status, count, ivRange, ksRange, random) {
  return Array.from({ length: count }, (_, index) => ({
    name: `${status}-${index + 1}`,
    status,
    iv: Number((ivRange[0] + random() * (ivRange[1] - ivRange[0])).toFixed(3)),
    ks: Number((ksRange[0] + random() * (ksRange[1] - ksRange[0])).toFixed(3))
  }));
}
var scatterRandom = makeRandom(20260831);
var SCATTER_POINTS = [
  ...buildScatterPoints("abnormal", 8, [0.56, 0.92], [0.52, 0.9], scatterRandom),
  ...buildScatterPoints("healthy", 10, [0.16, 0.54], [0.18, 0.58], scatterRandom),
  ...buildScatterPoints("unused", 8, [0.02, 0.18], [0.02, 0.18], scatterRandom),
  ...buildScatterPoints("warning", 8, [0.34, 0.7], [0.42, 0.72], scatterRandom)
];
var PSI_TOP = [
  { name: "\u8BBE\u5907\u6307\u7EB9", value: 0.182 },
  { name: "\u4FE1\u7528\u8BC4\u5206", value: 0.146 },
  { name: "\u8FD130\u5929\u8BA2\u5355\u91D1\u989D", value: 0.121 },
  { name: "\u767B\u5F55\u5931\u8D25\u6B21\u6570", value: 0.094 },
  { name: "\u6D4F\u89C8\u6DF1\u5EA6", value: 0.078 },
  { name: "\u98CE\u9669\u540D\u5355\u547D\u4E2D", value: 0.061 },
  { name: "\u8D26\u6237\u5E74\u9F84", value: 0.043 },
  { name: "\u4F4D\u7F6E\u71B5", value: 0.027 }
];
function rangeDays(start, end) {
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return 1;
  const days = Math.round((endMs - startMs) / 864e5) + 1;
  return Math.min(365, Math.max(1, days));
}
function hashSeed(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function createRangeRandom(part, start, end) {
  return makeRandom(hashSeed(`${part}|${start}|${end}`) || 1);
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function round(value, digits) {
  return Number(value.toFixed(digits));
}
function rangeScale(start, end) {
  return 1 + Math.log2(rangeDays(start, end)) * 0.12;
}
function buildFeatureSourceRows(start, end) {
  const random = createRangeRandom("source", start, end);
  const scale = rangeScale(start, end);
  return DATA_SOURCE_ROWS.map((row) => ({
    ...row,
    count: Math.max(
      1,
      Math.round(row.count * scale * (0.85 + random() * 0.3))
    ),
    iv: round(clamp(row.iv * (0.75 + random() * 0.5), 1e-3, 0.999), 3),
    ks: round(clamp(row.ks * (0.75 + random() * 0.5), 1e-3, 0.999), 3),
    psi: round(clamp(row.psi * (0.4 + random() * 1.6), 1e-3, 0.999), 3),
    nullRate: round(clamp(row.nullRate * (0.5 + random()), 0.1, 100), 1),
    abnormalRate: round(
      clamp(row.abnormalRate * (0.5 + random()), 0, 100),
      1
    )
  }));
}
function buildDataValue(start, end) {
  const rows = buildFeatureSourceRows(start, end);
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  const random = createRangeRandom("value", start, end);
  const scale = rangeScale(start, end);
  const active = Math.round(total * (0.84 + random() * 0.07));
  const abnormal = Math.max(
    1,
    Math.round(total * (0.05 + random() * 0.04))
  );
  const valued = Math.round(total * (0.94 + random() * 0.04));
  const [totalKpi, activeKpi, abnormalKpi, valuedKpi] = DATA_VALUE_KPIS;
  const kpis = [
    { ...totalKpi, value: String(total), footnote: `\u6279\u6B21\u5171 ${total} \u4E2A` },
    { ...activeKpi, value: String(active) },
    { ...abnormalKpi, value: String(abnormal) },
    { ...valuedKpi, value: String(valued) }
  ];
  const categories = FEATURE_CATEGORIES.map((category) => ({
    key: category.key,
    pct: Math.round(clamp(category.pct * (0.8 + random() * 0.4), 1, 99)),
    count: Math.max(
      1,
      Math.round(category.count * scale * (0.85 + random() * 0.3))
    )
  }));
  const points = SCATTER_POINTS.map((point) => ({
    ...point,
    iv: round(clamp(point.iv * (0.8 + random() * 0.4), 1e-3, 0.999), 3),
    ks: round(clamp(point.ks * (0.8 + random() * 0.4), 1e-3, 0.999), 3)
  }));
  const psi = PSI_TOP.map((item) => ({
    name: item.name,
    value: round(
      clamp(item.value * (0.7 + random() * 0.6), 1e-3, 0.999),
      3
    )
  })).sort((a, b) => b.value - a.value);
  return { kpis, categories, points, psi };
}

// src/server/api/data-value.ts
function createDataValueResponse(params) {
  const start = params.get("start") ?? "";
  const end = params.get("end") ?? "";
  const value = buildDataValue(start, end);
  const data = {
    ...value,
    categories: value.categories.map((category) => ({
      ...category,
      bg: `color-mix(in srgb, var(--primary) ${Math.round(
        10 + category.pct * 0.7
      )}%, var(--card))`
    })),
    // 图表类目轴默认自下而上排列：反序后最高 PSI 落在图表顶部。
    // 稳定 / 漂移拆为两组数值字段，由 BarChart 堆叠系列分色渲染。
    psi: [...value.psi].reverse().map((item) => ({
      name: item.name,
      value: item.value,
      "\u7A33\u5B9A": item.value > 0.1 ? 0 : item.value,
      "\u6F02\u79FB": item.value > 0.1 ? item.value : 0
    })),
    range: { start, end }
  };
  return Response.json(
    { code: 0, data, message: "ok" },
    { headers: { "cache-control": "no-store" } }
  );
}

// src/server/api/feature-source-summary.ts
var COST_CLASS = {
  \u4F4E: "low",
  \u4E2D: "mid",
  \u9AD8: "high"
};
function createFeatureSourceSummaryResponse(params) {
  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.min(
    50,
    Math.max(5, Number(params.get("pageSize")) || 20)
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
    costClass: COST_CLASS[row.cost]
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
        range: { start, end }
      },
      message: "ok"
    },
    { headers: { "cache-control": "no-store" } }
  );
}

// module/server.ts
var handlers = {
  "/api/risk-analysis/data-value": {
    GET: (_request, context) => createDataValueResponse(context.url.searchParams)
  },
  "/api/risk-analysis/feature-source-summary": {
    GET: (_request, context) => createFeatureSourceSummaryResponse(context.url.searchParams)
  }
};
export {
  handlers
};
//# sourceMappingURL=index.mjs.map
