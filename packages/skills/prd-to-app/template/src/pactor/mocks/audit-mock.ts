/**
 * 审计日志（系统管理）演示数据服务（MVP mock，静态页面）。
 * audit.list / audit.detail 注册为 Pactor service；接入真实后端后替换为
 * http / service 数据源，DSL 绑定路径保持不变。
 * 数据形态对齐 PRD《系统管理/02-审计》：列表（Timestamp / Operator / Operation /
 * Resource Type / Resource ID / IP）+ 详情（变更前 / 变更后 / Diff / 操作上下文
 * 四个 Tab，敏感数据脱敏显示）。
 * 审计范围覆盖 Provider / Model / Alias / Route / Client / Quota / RateLimit /
 * Pricing / 服务设置 / AppKey 创建停用 / Secret Rotation。
 * Diff 行与复合文案全部在 mock 层预计算（表达式引擎不支持数组方法与函数调用）。
 */

export interface AuditDiffLine {
  type: "add" | "remove" | "same";
  text: string;
}

export interface AuditContextRow {
  label: string;
  value: string;
}

export interface AuditRecord {
  id: string;
  /** ISO 日期（yyyy-MM-dd），时间范围过滤用 */
  date: string;
  /** 完整时间戳（UTC+8 展示口径） */
  timeUtc: string;
  /** 列表短格式 MM-DD HH:mm */
  timeShort: string;
  operator: string;
  /** 操作展示名（修改 / 创建AppKey / Rotate Secret …） */
  operation: string;
  /** 操作类型过滤值 */
  operationType: string;
  /** 资源类型展示名（Route Policy / API Client …） */
  resourceType: string;
  /** 资源类型过滤值 */
  resourceTypeKey: string;
  resourceId: string;
  ip: string;
  requestId: string;
  userAgent: string;
  /** null = 该操作无此侧快照（创建无变更前 / 删除无变更后） */
  beforeJson: string | null;
  afterJson: string | null;
  diffLines: AuditDiffLine[];
  context: AuditContextRow[];
}

const OPERATION_LABELS: Record<string, string> = {
  create: "创建",
  update: "修改",
  delete: "删除",
  enable: "启用",
  disable: "停用",
  "appkey-create": "创建AppKey",
  "appkey-disable": "停用AppKey",
  "secret-rotate": "Rotate Secret",
  "settings-update": "修改服务设置",
};

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  provider: "Provider",
  model: "Model",
  alias: "Model Alias",
  route: "Route",
  "route-policy": "Route Policy",
  client: "API Client",
  appkey: "AppKey",
  quota: "Quota Policy",
  ratelimit: "RateLimit Policy",
  pricing: "Pricing",
  settings: "服务设置",
};

export const OPERATOR_OPTIONS = [
  { label: "全部操作人", value: "all" },
  { label: "张三", value: "张三" },
  { label: "李四", value: "李四" },
  { label: "王五", value: "王五" },
  { label: "管理员", value: "管理员" },
];

export const OPERATION_OPTIONS = [
  { label: "全部操作类型", value: "all" },
  ...Object.entries(OPERATION_LABELS).map(([value, label]) => ({
    label,
    value,
  })),
];

export const RESOURCE_TYPE_OPTIONS = [
  { label: "全部资源类型", value: "all" },
  ...Object.entries(RESOURCE_TYPE_LABELS).map(([value, label]) => ({
    label,
    value,
  })),
];

/** 原始条目：[日期时间, 操作人, 操作类型, 资源类型, Resource ID, IP, 变更前, 变更后] */
type RawEntry = [
  string,
  string,
  string,
  string,
  string,
  string,
  Record<string, unknown> | null,
  Record<string, unknown> | null,
];

const RAW: RawEntry[] = [
  [
    "2026-09-18 14:20:03",
    "张三",
    "update",
    "route-policy",
    "reasoning-def",
    "10.0.1.5",
    { policy: "fallback", maxRetries: 2, timeoutMs: 30000 },
    { policy: "fallback", maxRetries: 3, timeoutMs: 60000 },
  ],
  [
    "2026-09-18 10:00:41",
    "李四",
    "appkey-create",
    "client",
    "agent-app",
    "10.0.1.8",
    null,
    {
      appKeyId: "ak-2f8c1d9e",
      secret: "sk-****3f9a",
      client: "agent-app",
      status: "active",
    },
  ],
  [
    "2026-09-17 17:42:19",
    "管理员",
    "settings-update",
    "settings",
    "service-settings",
    "10.0.0.2",
    { promptPolicy: "masked", logRetentionDays: 90, currency: "USD" },
    { promptPolicy: "masked", logRetentionDays: 120, currency: "USD" },
  ],
  [
    "2026-09-17 11:05:52",
    "王五",
    "update",
    "pricing",
    "gpt-5-pro",
    "10.0.1.12",
    { inputPer1M: 12.0, outputPer1M: 48.0, currency: "USD" },
    { inputPer1M: 14.0, outputPer1M: 56.0, currency: "USD" },
  ],
  [
    "2026-09-16 16:33:08",
    "张三",
    "create",
    "route",
    "code-assist",
    "10.0.1.5",
    null,
    {
      code: "code-assist",
      targetModel: "claude-sonnet-4",
      fallback: ["gpt-5-pro"],
      status: "enabled",
    },
  ],
  [
    "2026-09-16 09:12:47",
    "李四",
    "disable",
    "provider",
    "azure-openai-east",
    "10.0.1.8",
    { status: "enabled", weight: 50, region: "eastus" },
    { status: "disabled", weight: 50, region: "eastus" },
  ],
  [
    "2026-09-15 15:58:26",
    "王五",
    "update",
    "quota",
    "agent-app-monthly",
    "10.0.1.12",
    { metric: "TOTAL_TOKEN", limit: 5000000, cycle: "month" },
    { metric: "TOTAL_TOKEN", limit: 8000000, cycle: "month" },
  ],
  [
    "2026-09-15 10:21:33",
    "张三",
    "secret-rotate",
    "appkey",
    "ak-7b31c904",
    "10.0.1.5",
    { appKeyId: "ak-7b31c904", secret: "sk-****a1c2" },
    { appKeyId: "ak-7b31c904", secret: "sk-****e7d4" },
  ],
  [
    "2026-09-14 18:44:09",
    "管理员",
    "update",
    "model",
    "gpt-5-pro",
    "10.0.0.2",
    { contextWindow: 272000, maxOutput: 32768, capabilities: ["tools"] },
    {
      contextWindow: 272000,
      maxOutput: 65536,
      capabilities: ["tools", "reasoning"],
    },
  ],
  [
    "2026-09-14 09:37:55",
    "李四",
    "appkey-disable",
    "appkey",
    "ak-9d20f153",
    "10.0.1.8",
    { appKeyId: "ak-9d20f153", client: "expired-trial", status: "active" },
    { appKeyId: "ak-9d20f153", client: "expired-trial", status: "disabled" },
  ],
  [
    "2026-09-13 14:02:18",
    "王五",
    "create",
    "ratelimit",
    "agent-app-rpm",
    "10.0.1.12",
    null,
    { metric: "REQUEST", limit: 600, window: "1m", mode: "hard" },
  ],
  [
    "2026-09-13 08:59:44",
    "张三",
    "update",
    "alias",
    "smart-default",
    "10.0.1.5",
    { alias: "smart-default", pointsTo: "gpt-5-pro" },
    { alias: "smart-default", pointsTo: "claude-sonnet-4" },
  ],
  [
    "2026-09-12 19:26:31",
    "管理员",
    "delete",
    "client",
    "legacy-bot",
    "10.0.0.2",
    {
      code: "legacy-bot",
      name: "Legacy Bot",
      appKeyId: "ak-00c4de11",
      status: "disabled",
    },
    null,
  ],
  [
    "2026-08-29 11:15:07",
    "李四",
    "enable",
    "provider",
    "openai-main",
    "10.0.1.8",
    { status: "disabled", weight: 100, region: "us-east-1" },
    { status: "enabled", weight: 100, region: "us-east-1" },
  ],
  [
    "2026-08-21 16:48:53",
    "张三",
    "settings-update",
    "settings",
    "service-settings",
    "10.0.1.5",
    { timezone: "UTC", currencyDecimals: 4 },
    { timezone: "Asia/Shanghai", currencyDecimals: 4 },
  ],
];

function pretty(obj: Record<string, unknown> | null): string | null {
  return obj ? JSON.stringify(obj, null, 2) : null;
}

/** 行级对齐 diff：同位相同 → same；仅变更后 → add；仅变更前 → remove；均不同 → remove+add */
function diffLines(before: string | null, after: string | null): AuditDiffLine[] {
  const b = before?.split("\n") ?? [];
  const a = after?.split("\n") ?? [];
  const lines: AuditDiffLine[] = [];
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const al = a[i];
    const bl = b[i];
    if (al === bl) {
      lines.push({ type: "same", text: `  ${al ?? ""}` });
    } else {
      if (bl !== undefined) lines.push({ type: "remove", text: `- ${bl}` });
      if (al !== undefined) lines.push({ type: "add", text: `+ ${al}` });
    }
  }
  return lines;
}

function build(): AuditRecord[] {
  return RAW.map((raw, i) => {
    const [time, operator, opType, resType, resourceId, ip, before, after] =
      raw;
    const beforeJson = pretty(before);
    const afterJson = pretty(after);
    const id = `aud-${String(1000 + i)}`;
    return {
      id,
      date: time.slice(0, 10),
      timeUtc: `${time} (UTC+8)`,
      timeShort: time.slice(5, 16),
      operator,
      operation: OPERATION_LABELS[opType],
      operationType: opType,
      resourceType: RESOURCE_TYPE_LABELS[resType],
      resourceTypeKey: resType,
      resourceId,
      ip,
      requestId: `req-audit-${(92140 + i * 37).toString(16)}`,
      userAgent: "GateWeave Console/1.0 (Chrome 139; macOS)",
      beforeJson,
      afterJson,
      diffLines: diffLines(beforeJson, afterJson),
      context: [
        { label: "操作人", value: operator },
        { label: "操作类型", value: OPERATION_LABELS[opType] },
        { label: "资源", value: `${RESOURCE_TYPE_LABELS[resType]} / ${resourceId}` },
        { label: "来源", value: "管理控制台" },
        { label: "User-Agent", value: "GateWeave Console/1.0 (Chrome 139; macOS)" },
        { label: "会话", value: `sess-${(5520 + i * 13).toString(16)}` },
        { label: "结果", value: "成功" },
      ],
    };
  });
}

const AUDITS = build();

export const AUDIT_IDS = AUDITS.map((r) => r.id);

export interface AuditQuery {
  start?: string;
  end?: string;
  operator?: string;
  operation?: string;
  resourceType?: string;
  resourceId?: string;
}

export function queryAudits(q: AuditQuery): {
  items: AuditRecord[];
  filteredText: string;
} {
  const items = AUDITS.filter((r) => {
    if (q.start && r.date < q.start) return false;
    if (q.end && r.date > q.end) return false;
    if (q.operator && q.operator !== "all" && r.operator !== q.operator)
      return false;
    if (
      q.operation &&
      q.operation !== "all" &&
      r.operationType !== q.operation
    )
      return false;
    if (
      q.resourceType &&
      q.resourceType !== "all" &&
      r.resourceTypeKey !== q.resourceType
    )
      return false;
    if (
      q.resourceId &&
      !r.resourceId.toLowerCase().includes(q.resourceId.toLowerCase())
    )
      return false;
    return true;
  });
  return {
    items,
    filteredText: items.length.toLocaleString("en-US"),
  };
}

export function getAudit(id: string): AuditRecord | undefined {
  return AUDITS.find((r) => r.id === id);
}

/** 操作人筛选项（Select options）：「全部」+ 记录中去重的操作人 */
export function listAuditOperators(): { label: string; value: string }[] {
  const names = [...new Set(AUDITS.map((r) => r.operator))];
  return [
    { label: "全部操作人", value: "all" },
    ...names.map((name) => ({ label: name, value: name })),
  ];
}
