/**
 * 数据价值分析工作台演示数据与区间派生逻辑。
 * 基准数值来自线框；行数据 / 散点 / PSI 为示例，待接入真实分析服务后
 * 替换。接口按日期区间生成确定性样例（同一区间结果稳定，切换区间数据
 * 随之变化）：特征来源行由 /api/risk-analysis/feature-source-summary
 * 下发，KPI / 分布 / 图表由 /api/risk-analysis/data-value 下发。
 */

export type CostLevel = "低" | "中" | "高";

export interface FeatureSourceRow {
  source: string;
  count: number;
  iv: number;
  ks: number;
  psi: number;
  nullRate: number;
  abnormalRate: number;
  cost: CostLevel;
}

export interface FeatureCategory {
  key: string;
  pct: number;
  count: number;
}

export type ScatterStatus = "abnormal" | "healthy" | "unused" | "warning";

export interface ScatterPoint {
  name: string;
  iv: number;
  ks: number;
  status: ScatterStatus;
}

export interface RiskKpi {
  key: string;
  label: string;
  value: string;
  unit: string;
  footnote: string;
}

export const DATA_VALUE_KPIS: RiskKpi[] = [
  { key: "total", label: "特征总量", value: "256", unit: "个", footnote: "批次共 256 个" },
  { key: "active", label: "使用中特征量", value: "225", unit: "个", footnote: "-" },
  { key: "abnormal", label: "异常特征量", value: "18", unit: "个", footnote: "-" },
  { key: "valued", label: "有值特征量", value: "248", unit: "个", footnote: "-" },
];

export const DATA_SOURCE_ROWS: FeatureSourceRow[] = [
  { source: "用户基础信息", count: 42, iv: 0.32, ks: 0.28, psi: 0.012, nullRate: 3.2, abnormalRate: 1.1, cost: "低" },
  { source: "设备环境", count: 28, iv: 0.45, ks: 0.36, psi: 0.008, nullRate: 1.8, abnormalRate: 0.6, cost: "中" },
  { source: "交易行为", count: 24, iv: 0.52, ks: 0.41, psi: 0.021, nullRate: 4.5, abnormalRate: 2.3, cost: "高" },
  { source: "信贷记录", count: 21, iv: 0.61, ks: 0.47, psi: 0.015, nullRate: 2.1, abnormalRate: 1.4, cost: "高" },
  { source: "关系网络", count: 18, iv: 0.27, ks: 0.22, psi: 0.031, nullRate: 6.8, abnormalRate: 3.9, cost: "中" },
  { source: "地理位置", count: 16, iv: 0.24, ks: 0.19, psi: 0.005, nullRate: 0.9, abnormalRate: 0.3, cost: "低" },
  { source: "风险名单", count: 14, iv: 0.58, ks: 0.44, psi: 0.018, nullRate: 1.2, abnormalRate: 0.8, cost: "中" },
  { source: "营销响应", count: 12, iv: 0.12, ks: 0.09, psi: 0.042, nullRate: 8.1, abnormalRate: 5.2, cost: "低" },
  { source: "支付行为", count: 11, iv: 0.49, ks: 0.38, psi: 0.009, nullRate: 1.5, abnormalRate: 0.7, cost: "中" },
  { source: "账户安全", count: 10, iv: 0.55, ks: 0.43, psi: 0.014, nullRate: 2.4, abnormalRate: 1.2, cost: "高" },
  { source: "客服记录", count: 9, iv: 0.18, ks: 0.14, psi: 0.027, nullRate: 5.2, abnormalRate: 2.8, cost: "低" },
  { source: "外部数据", count: 8, iv: 0.36, ks: 0.29, psi: 0.006, nullRate: 0.7, abnormalRate: 0.2, cost: "中" },
  { source: "登录日志", count: 7, iv: 0.22, ks: 0.17, psi: 0.011, nullRate: 1.1, abnormalRate: 0.4, cost: "低" },
  { source: "浏览行为", count: 6, iv: 0.15, ks: 0.11, psi: 0.019, nullRate: 3.8, abnormalRate: 1.6, cost: "低" },
  { source: "申请信息", count: 6, iv: 0.41, ks: 0.33, psi: 0.004, nullRate: 0.6, abnormalRate: 0.2, cost: "中" },
  { source: "授信记录", count: 5, iv: 0.57, ks: 0.45, psi: 0.013, nullRate: 1.9, abnormalRate: 0.9, cost: "高" },
  { source: "还款行为", count: 5, iv: 0.53, ks: 0.42, psi: 0.01, nullRate: 1.3, abnormalRate: 0.5, cost: "中" },
  { source: "催收记录", count: 4, iv: 0.47, ks: 0.37, psi: 0.016, nullRate: 2.7, abnormalRate: 1.8, cost: "高" },
  { source: "社交互动", count: 4, iv: 0.13, ks: 0.1, psi: 0.035, nullRate: 7.3, abnormalRate: 4.6, cost: "低" },
  { source: "电商消费", count: 3, iv: 0.29, ks: 0.23, psi: 0.007, nullRate: 0.8, abnormalRate: 0.3, cost: "低" },
  { source: "出行轨迹", count: 2, iv: 0.26, ks: 0.21, psi: 0.024, nullRate: 3.1, abnormalRate: 1.5, cost: "中" },
  { source: "公共记录", count: 1, iv: 0.34, ks: 0.27, psi: 0.003, nullRate: 0.4, abnormalRate: 0.1, cost: "低" },
];

/** 使用特征分布：占比与数量取自线框，颜色深浅按占比映射。 */
export const FEATURE_CATEGORIES: FeatureCategory[] = [
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
  { key: "CARD_MEDIUM", pct: 12, count: 11 },
];

/** 确定性伪随机（静态演示每次渲染一致，避免 SSR / 客户端水合差异）。 */
function makeRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function buildScatterPoints(
  status: ScatterStatus,
  count: number,
  ivRange: [number, number],
  ksRange: [number, number],
  random: () => number,
): ScatterPoint[] {
  return Array.from({ length: count }, (_, index) => ({
    name: `${status}-${index + 1}`,
    status,
    iv: Number((ivRange[0] + random() * (ivRange[1] - ivRange[0])).toFixed(3)),
    ks: Number((ksRange[0] + random() * (ksRange[1] - ksRange[0])).toFixed(3)),
  }));
}

const scatterRandom = makeRandom(20260831);

export const SCATTER_POINTS: ScatterPoint[] = [
  ...buildScatterPoints("abnormal", 8, [0.56, 0.92], [0.52, 0.9], scatterRandom),
  ...buildScatterPoints("healthy", 10, [0.16, 0.54], [0.18, 0.58], scatterRandom),
  ...buildScatterPoints("unused", 8, [0.02, 0.18], [0.02, 0.18], scatterRandom),
  ...buildScatterPoints("warning", 8, [0.34, 0.7], [0.42, 0.72], scatterRandom),
];

export const PSI_TOP: { name: string; value: number }[] = [
  { name: "设备指纹", value: 0.182 },
  { name: "信用评分", value: 0.146 },
  { name: "近30天订单金额", value: 0.121 },
  { name: "登录失败次数", value: 0.094 },
  { name: "浏览深度", value: 0.078 },
  { name: "风险名单命中", value: 0.061 },
  { name: "账户年龄", value: 0.043 },
  { name: "位置熵", value: 0.027 },
];

/** 日期区间天数（含首尾）；非法或缺失按 1 天处理。 */
function rangeDays(start: string, end: string): number {
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return 1;
  const days = Math.round((endMs - startMs) / 86_400_000) + 1;
  return Math.min(365, Math.max(1, days));
}

/** FNV-1a 字符串哈希：把日期区间映射为稳定的随机种子。 */
function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** 按区间创建确定性伪随机序列：同一区间结果稳定，不同区间结果不同。 */
function createRangeRandom(
  part: string,
  start: string,
  end: string,
): () => number {
  return makeRandom(hashSeed(`${part}|${start}|${end}`) || 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits: number): number {
  return Number(value.toFixed(digits));
}

/** 区间越长，样例特征量越大（1 天 → 约 1.0，7 天 → 约 1.34）。 */
function rangeScale(start: string, end: string): number {
  return 1 + Math.log2(rangeDays(start, end)) * 0.12;
}

/**
 * 特征来源汇总行数据（未格式化）。
 *
 * 按日期区间缩放特征数量并抖动区分能力 / 稳定性指标；种子来自区间字符串，
 * 因此同一区间的结果稳定可复现，切换区间则整表数据随之变化。
 */
export function buildFeatureSourceRows(
  start: string,
  end: string,
): FeatureSourceRow[] {
  const random = createRangeRandom("source", start, end);
  const scale = rangeScale(start, end);

  return DATA_SOURCE_ROWS.map((row) => ({
    ...row,
    count: Math.max(
      1,
      Math.round(row.count * scale * (0.85 + random() * 0.3)),
    ),
    iv: round(clamp(row.iv * (0.75 + random() * 0.5), 0.001, 0.999), 3),
    ks: round(clamp(row.ks * (0.75 + random() * 0.5), 0.001, 0.999), 3),
    psi: round(clamp(row.psi * (0.4 + random() * 1.6), 0.001, 0.999), 3),
    nullRate: round(clamp(row.nullRate * (0.5 + random()), 0.1, 100), 1),
    abnormalRate: round(
      clamp(row.abnormalRate * (0.5 + random()), 0, 100),
      1,
    ),
  }));
}

export interface DataValuePayload {
  kpis: RiskKpi[];
  categories: FeatureCategory[];
  points: ScatterPoint[];
  psi: { name: string; value: number }[];
}

/**
 * 数据价值页 KPI / 分布 / 散点 / PSI 数据。
 *
 * 与特征来源行共用区间缩放：KPI 总量取各行特征数量之和，保证两个接口
 * 在同一天数区间下口径一致；其余指标按区间种子抖动。
 */
export function buildDataValue(
  start: string,
  end: string,
): DataValuePayload {
  const rows = buildFeatureSourceRows(start, end);
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  const random = createRangeRandom("value", start, end);
  const scale = rangeScale(start, end);

  const active = Math.round(total * (0.84 + random() * 0.07));
  const abnormal = Math.max(
    1,
    Math.round(total * (0.05 + random() * 0.04)),
  );
  const valued = Math.round(total * (0.94 + random() * 0.04));

  // 复用基准卡片的文案 / 单位，仅替换随区间变化的数值与脚注。
  const [totalKpi, activeKpi, abnormalKpi, valuedKpi] = DATA_VALUE_KPIS;
  const kpis: RiskKpi[] = [
    { ...totalKpi, value: String(total), footnote: `批次共 ${total} 个` },
    { ...activeKpi, value: String(active) },
    { ...abnormalKpi, value: String(abnormal) },
    { ...valuedKpi, value: String(valued) },
  ];

  const categories = FEATURE_CATEGORIES.map((category) => ({
    key: category.key,
    pct: Math.round(clamp(category.pct * (0.8 + random() * 0.4), 1, 99)),
    count: Math.max(
      1,
      Math.round(category.count * scale * (0.85 + random() * 0.3)),
    ),
  }));

  const points = SCATTER_POINTS.map((point) => ({
    ...point,
    iv: round(clamp(point.iv * (0.8 + random() * 0.4), 0.001, 0.999), 3),
    ks: round(clamp(point.ks * (0.8 + random() * 0.4), 0.001, 0.999), 3),
  }));

  // 抖动后按 PSI 降序重排，保证「PSI Top 排名」始终自高到低。
  const psi = PSI_TOP.map((item) => ({
    name: item.name,
    value: round(
      clamp(item.value * (0.7 + random() * 0.6), 0.001, 0.999),
      3,
    ),
  })).sort((a, b) => b.value - a.value);

  return { kpis, categories, points, psi };
}
