type Item = {
  id: string;
  name: string;
  code: string;
  kind: string;
  extra: string;
  sort: number;
  status: string;
};

const state = globalThis as typeof globalThis & { starterDataList?: Item[] };

const filters = {
  kind: [
    { label: "标准", value: "标准" },
    { label: "高级", value: "高级" },
  ],
  status: [
    { label: "全部状态", value: "all" },
    { label: "启用", value: "启用" },
    { label: "停用", value: "停用" },
  ],
};

state.starterDataList ??= [
  { id: "dl-1", name: "每日运营汇总", code: "DAILY_DIGEST", kind: "标准", extra: "", sort: 10, status: "启用" },
  { id: "dl-2", name: "客户活跃度看板", code: "CLIENT_ACTIVITY", kind: "标准", extra: "", sort: 20, status: "启用" },
  { id: "dl-3", name: "接口异常清单", code: "API_FAILURES", kind: "高级", extra: "按错误码聚合", sort: 30, status: "启用" },
  { id: "dl-4", name: "月度成本分析", code: "MONTHLY_COST", kind: "高级", extra: "包含成本分摊", sort: 40, status: "启用" },
  { id: "dl-5", name: "模型调用统计", code: "MODEL_CALLS", kind: "标准", extra: "", sort: 50, status: "启用" },
  { id: "dl-6", name: "客户端用量排行", code: "CLIENT_RANK", kind: "标准", extra: "", sort: 60, status: "停用" },
  { id: "dl-7", name: "延迟分位监控", code: "LATENCY_PERCENTILE", kind: "高级", extra: "P50 / P95 / P99", sort: 70, status: "启用" },
  { id: "dl-8", name: "审核记录归档", code: "AUDIT_ARCHIVE", kind: "标准", extra: "", sort: 80, status: "停用" },
];

export function GET(request: Request, parts: string[]) {
  const rows = state.starterDataList!;
  if (parts.length > 0) {
    const item = rows.find((row) => row.id === parts[0]);
    return item
      ? Response.json(item)
      : Response.json({ error: "记录不存在" }, { status: 404 });
  }
  const url = new URL(request.url);
  const keyword = (url.searchParams.get("keyword") ?? "").trim().toLowerCase();
  const status = url.searchParams.get("status") ?? "all";
  const items = rows.filter((row) => {
    const matchesKeyword =
      !keyword ||
      row.name.toLowerCase().includes(keyword) ||
      row.code.toLowerCase().includes(keyword);
    const matchesStatus =
      !status ||
      status === "all" ||
      row.status === status;
    return matchesKeyword && matchesStatus;
  });
  return Response.json(
    { items, total: items.length, filters },
    { headers: { "cache-control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const input = (await request.json().catch(() => ({}))) as Partial<Item>;
  if (!input.name?.trim() || !input.code?.trim() || !input.kind) {
    return Response.json({ ok: false, error: "名称、编码与类型不能为空" }, { status: 400 });
  }
  const rows = state.starterDataList!;
  const index = rows.findIndex((row) => row.id === input.id);
  const item: Item = {
    id: index >= 0 ? rows[index].id : crypto.randomUUID(),
    name: input.name.trim(),
    code: input.code.trim(),
    kind: input.kind,
    extra: input.extra?.trim() ?? "",
    sort: Number.isFinite(input.sort) ? Number(input.sort) : 0,
    status: input.status === "停用" ? "停用" : "启用",
  };
  if (index >= 0) rows[index] = item;
  else rows.push(item);
  return Response.json({ ok: true, item });
}
