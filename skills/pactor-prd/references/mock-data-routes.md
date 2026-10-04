# mock 数据路由模板

页面 DSL 的 http 数据源统一入口：`app/api/data/[...path]/route.ts`。目标：原型阶段零后端依赖；接真实后端时只改这一层，页面 yaml 不动。

## 命名约定

- **单段路径**：`/api/data/projects`、`/api/data/project-members`——列表/选项类一律单段 kebab-case
- **禁止** `/api/data/project/members` 这种两段写法：`[...path]` 会把第二段当详情 id 解析（`project/detail?id=members`），踩过的坑
- 详情：`/api/data/<resource>/<code|id>`；子资源：`/api/data/<resource>/<code>/<sub>`
- 数据源 url 与页面 id 语义对应：`project-list` 页 → `/api/data/projects`

## 路由模板

```ts
// app/api/data/[...path]/route.ts
/**
 * 页面数据接口（mock）：页面 DSL 的 http 数据源统一入口。
 * 接入真实后端时改写 ROUTE_TABLE 的实现（或调整 baseUrl 直连后端）。
 */

/** 单段路径 → mock handler */
const ROUTE_TABLE: Record<string, (params: Record<string, unknown>) => unknown> = {
  projects: (params) => filterProjects(params),   // mock 函数就近定义或放 src/server/mocks/
  "project-members": () => PROJECT_MEMBERS,
};

/** 详情：<resource>/<id> */
const DETAIL_TABLE: Record<string, (id: string) => unknown> = {
  projects: (code) => PROJECTS.find((p) => p.code === code) ?? null,
};

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const params = Object.fromEntries(new URL(request.url).searchParams.entries());

  if (path.length === 1) {
    const handler = ROUTE_TABLE[path[0]!];
    if (!handler) return Response.json({ error: `未知数据接口: /api/data/${path.join("/")}` }, { status: 404 });
    return Response.json(handler(params) ?? null);
  }
  if (path.length === 2) {
    const handler = DETAIL_TABLE[path[0]!];
    if (!handler) return Response.json({ error: "未知详情接口" }, { status: 404 });
    return Response.json(handler(path[1]!) ?? null);
  }
  return Response.json({ error: "不支持的接口路径" }, { status: 404 });
}
```

注意：`context.params` 的具体类型以目标项目的 Next 版本为准（Next 15+ 为 Promise）。

## mock 数据要求

- 字段名与线框图「区域说明/字段说明」逐一对齐，不臆造字段
- 每类数据至少覆盖：正常多条、触发告警/特殊态的条目（如「待填密钥」）、以及空态可被演示（如筛选到无结果）
- 筛选参数在 handler 内真实过滤（列表页筛选闭环依赖它），不是返回全量
- 选项类接口（如下拉的操作人列表）单独注册单段路径，页面 `options: ${data.xxx}` 绑定

## 替换为真实接口

1. 直接把 ROUTE_TABLE handler 改为 `fetch` 真实后端（服务端转发，带鉴权头）
2. 或调整 pactor 数据源 baseUrl 直连后端，`/api/data/*` 层整体退役
页面 yaml 的 dataSources 声明两种方案下都无需改动——这就是必须 `type: http` 的原因。
