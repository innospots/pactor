# 数据接口层（纯转发 + 空数据约定）

页面 DSL 的 http 数据源统一入口：`app/api/d/[...parts]/route.ts`（**纯转发层，不含任何路径映射**）。**路径即契约**：DSL 中的 url（如 `/api/d/providers`）就是服务端接口路径；转发层按相同路径、方法、查询与请求体原样转发到 `$NEXT_PUBLIC_API_BASE_URL/api/d/<parts>`（携带会话 cookie，匿名 401）。

**没有服务层接口时返回空数据（不报错）**：上游不可达（连接失败）、接口不存在（404）或返回非 JSON（如命中前端兜底 HTML）时，GET 返回 `{}`、POST 返回 `{ ok: true }`，页面按空态渲染。接真实后端只需把 `NEXT_PUBLIC_API_BASE_URL`（next.config.js 的 `API_BASE_URLS`）换成真实地址，页面 yaml 与转发层零改动。

## 命名约定

- **单段路径**：`/api/d/projects`、`/api/d/project-members`——列表/选项类一律单段 kebab-case
- **禁止** `/api/d/project/members` 这种两段写法：`[...parts]` 会把第二段当详情 id 解析（`project/detail?id=members`），踩过的坑
- 详情：`/api/d/<resource>/<code|id>`；子资源：`/api/d/<resource>/<code>/<sub>`；写操作：`/api/d/ops/<action>`（POST）
- 数据源 url 与页面 id 语义对应：`project-list` 页 → `/api/d/projects`

## 转发层结构

```text
浏览器（同源 /api/d/*）
  → app/api/d/[...parts]/route.ts   纯转发：会话鉴权（匿名 401）→
                                     fetch $NEXT_PUBLIC_API_BASE_URL/api/d/<parts>
                                     不可达 / 404 / 非 JSON → 空数据（GET {} / POST { ok: true }）
  → 服务端接口                        真实后端（与 DSL 同路径契约）
```

完整实现见模板工程 `app/api/d/[...parts]/route.ts`。

## 对页面 yaml 的要求

- dataSources 一律 `type: http`，url 按命名约定直接写最终接口路径
- 列表接口返回形状约定 `{ items, total, filters? }`；详情接口对空 id 返回空对象而非 404（新建预填链路依赖）
- 选项类接口（如下拉的操作人列表）用单段路径，页面 `options: ${data.xxx}` 绑定
- 写操作走 `ops/` 前缀 POST，页面提交闭环（request → message → reload）不依赖返回体内容

## 替换为真实接口

把 `NEXT_PUBLIC_API_BASE_URL` 换成真实后端基准地址即可——页面 yaml 与转发层代码零改动。页面 dataSources 声明在无后端/真实后端两种状态下都无需改动，这就是必须 `type: http` 且路径即契约的原因。
