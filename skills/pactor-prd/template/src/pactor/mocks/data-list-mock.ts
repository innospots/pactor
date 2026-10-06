/**
 * 数据列表骨架示例 mock（对应 yaml/models/data-list.yaml）。
 * query / get / save 注册为 dataList.* 服务；生成业务列表页时复制本文件
 * 改名并替换字段；接入真实后端后删除。
 */

export interface DataListItem {
  id: string;
  name: string;
  code: string;
  /** 基础 | 高级（高级显示扩展说明字段，演示条件显隐） */
  type: string;
  extra: string;
  sort: number;
  /** 启用 | 禁用 */
  status: string;
}

const ITEMS: DataListItem[] = [
  { id: "1", name: "示例记录甲", code: "DEMO_ALPHA", type: "基础", extra: "", sort: 1, status: "启用" },
  { id: "2", name: "示例记录乙", code: "DEMO_BETA", type: "高级", extra: "高级类型的扩展配置", sort: 2, status: "启用" },
  { id: "3", name: "示例记录丙", code: "DEMO_GAMMA", type: "基础", extra: "", sort: 3, status: "禁用" },
  { id: "4", name: "示例记录丁", code: "DEMO_DELTA", type: "高级", extra: "", sort: 4, status: "启用" },
];

let seq = ITEMS.length;

export interface DataListQuery {
  keyword?: string;
  status?: string;
}

/** 列表查询：items + total + 筛选选项（filters 由接口下发，搜索栏/表单的 Select 直接消费） */
export function queryDataList(params: DataListQuery) {
  const keyword = (params.keyword ?? "").trim().toLowerCase();
  const status = params.status ?? "all";
  const items = ITEMS.filter(
    (it) =>
      (status === "all" || it.status === status) &&
      (keyword === "" ||
        it.name.toLowerCase().includes(keyword) ||
        it.code.toLowerCase().includes(keyword)),
  );
  return {
    items,
    total: items.length,
    filters: {
      status: [
        { label: "全部", value: "all" },
        { label: "启用", value: "启用" },
        { label: "禁用", value: "禁用" },
      ],
      type: [
        { label: "基础", value: "基础" },
        { label: "高级", value: "高级" },
      ],
    },
  };
}

/** 编辑预填；空 id（新建）返回空对象，Form initialValues 各字段即空 */
export function getDataListItem(id: string): Partial<DataListItem> {
  return ITEMS.find((it) => it.id === id) ?? {};
}

/** 新建 / 编辑保存（upsert，按 id 区分） */
export function saveDataListItem(body: Partial<DataListItem>) {
  if (body.id) {
    const idx = ITEMS.findIndex((it) => it.id === body.id);
    if (idx >= 0) ITEMS[idx] = { ...ITEMS[idx], ...body, id: body.id } as DataListItem;
    return { ok: true, id: body.id };
  }
  const id = String(++seq);
  ITEMS.push({
    id,
    name: body.name ?? "",
    code: body.code ?? "",
    type: body.type ?? "基础",
    extra: body.extra ?? "",
    sort: body.sort ?? 0,
    status: body.status ?? "启用",
  });
  return { ok: true, id };
}
