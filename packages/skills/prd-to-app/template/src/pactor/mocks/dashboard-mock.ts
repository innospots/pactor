/**
 * Dashboard 演示数据服务（MVP mock）。
 * queryDashboard(start, end) 按任意日期区间确定性生成看板数据，
 * 注册为 Pactor service（dashboard.query）；接入真实后端后替换为
 * http / service 数据源，DSL 绑定路径保持不变。
 *
 * 时间桶规则（对齐 PRD §2）：≤2 天 → 2h 桶；3 天 → 6h 桶；
 * ≤16 天 → 天桶；更长 → 约 15 个多天桶。
 */

export interface TrendPoint {
  t: string;
  requests: number;
  tokens: number;
  cost: number;
  latency: number;
}

export interface DistributionItem {
  name: string;
  percent: number;
}

export interface DashboardStats {
  requests: string;
  activeClients: number;
  tokens: string;
  successRate: string;
  failures: string;
  errorRate: string;
  avgLatency: number;
  cost: string;
  avgCost: string;
}

export interface DashboardData {
  realtime: { rpm: number; tpm: string };
  /** Chart yKeys 需要数组，而表达式不支持数组字面量 → 预置映射按指标取 */
  metricKeys: Record<string, string[]>;
  stats: DashboardStats;
  trend: TrendPoint[];
  models: DistributionItem[];
  clients: DistributionItem[];
}

const DAY_MS = 86400000;
const pad = (n: number) => String(n).padStart(2, "0");

/** 本地日期 → ISO yyyy-MM-dd（与 DatePicker 的 format 约定一致） */
export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 默认分析范围：最近 7 天（含今天） */
export function defaultRange(): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end.getTime() - 6 * DAY_MS);
  return { start: isoDate(start), end: isoDate(end) };
}

function monthDay(d: Date): string {
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
}

/** 确定性伪随机（同一区间多次调用结果一致） */
function seededRandom(seedText: string): () => number {
  let a = 0;
  for (const ch of seedText) a = (a * 31 + ch.charCodeAt(0)) | 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

const MODEL_SHARES: Array<[string, number]> = [
  ["gpt-4o", 38],
  ["reasoning-v2", 28],
  ["claude-3.5", 18],
];

const CLIENT_SHARES: Array<[string, number]> = [
  ["app-mobile", 42],
  ["app-web", 31],
  ["internal-api", 16],
];

function buildDistribution(
  base: Array<[string, number]>,
  rand: () => number,
): DistributionItem[] {
  const items = base.map(([name, share]) => ({
    name,
    percent: Math.max(1, Math.round(share * (0.85 + rand() * 0.3))),
  }));
  items.sort((a, b) => b.percent - a.percent);
  const top = items.reduce((sum, it) => sum + it.percent, 0);
  items.push({ name: "其他", percent: Math.max(0, 100 - top) });
  return items;
}

/** 时间桶标签序列：按区间长度选择粒度（PRD：1~3 天小时桶，7~14 天 6h/天，30 天/周/月 天） */
function bucketLabels(start: Date, days: number): string[] {
  if (days <= 2) {
    return Array.from({ length: 12 }, (_, i) => `${pad(i * 2)}:00`);
  }
  if (days === 3) {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(start.getTime() + Math.floor(i / 4) * DAY_MS);
      return `${monthDay(d)} ${(i % 4) * 6}:00`;
    });
  }
  if (days <= 16) {
    return Array.from({ length: days }, (_, i) =>
      monthDay(new Date(start.getTime() + i * DAY_MS)),
    );
  }
  const step = Math.ceil(days / 15);
  const labels: string[] = [];
  for (let i = 0; i < days; i += step) {
    labels.push(monthDay(new Date(start.getTime() + i * DAY_MS)));
  }
  return labels;
}

export function queryDashboard(start: string, end: string): DashboardData {
  const rand = seededRandom(`${start}|${end}`);
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const valid =
    !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime());
  const days = valid
    ? Math.min(
        62,
        Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / DAY_MS) + 1),
      )
    : 7;
  const base = valid ? startDate : new Date(Date.now() - 6 * DAY_MS);

  const labels = bucketLabels(base, days);
  const bucketBase = (days * 18000) / labels.length;

  const trend: TrendPoint[] = labels.map((t) => {
    const requests = Math.round(bucketBase * (0.6 + rand() * 0.8));
    return {
      t,
      requests,
      tokens: Number(((requests * (320 + rand() * 60)) / 1_000_000).toFixed(2)),
      cost: Number((requests * 0.0069 * (0.9 + rand() * 0.2)).toFixed(2)),
      latency: Math.round(280 + rand() * 140),
    };
  });

  const totalRequests = trend.reduce((s, p) => s + p.requests, 0);
  const totalTokens = trend.reduce((s, p) => s + p.tokens, 0);
  const totalCost = trend.reduce((s, p) => s + p.cost, 0);
  const avgLatency = Math.round(
    trend.reduce((s, p) => s + p.latency, 0) / trend.length,
  );
  const successRate = 97 + rand() * 2.8;
  const failures = Math.round(totalRequests * (1 - successRate / 100));

  return {
    realtime: { rpm: 128, tpm: "2.1K" },
    metricKeys: {
      requests: ["requests"],
      tokens: ["tokens"],
      cost: ["cost"],
      latency: ["latency"],
    },
    stats: {
      requests: fmt(totalRequests),
      activeClients: 8 + Math.floor(rand() * 10),
      tokens: `${totalTokens.toFixed(1)}M`,
      successRate: successRate.toFixed(1),
      failures: fmt(failures),
      errorRate: (100 - successRate).toFixed(2),
      avgLatency,
      cost: `$${totalCost.toFixed(4)}`,
      avgCost: `$${(totalCost / totalRequests).toFixed(4)}`,
    },
    trend,
    models: buildDistribution(MODEL_SHARES, rand),
    clients: buildDistribution(CLIENT_SHARES, rand),
  };
}
