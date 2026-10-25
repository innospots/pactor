# 数据接口层（接口文档优先 + 纯转发空数据约定）

**接口文档驱动（优先）**：PRD/产品文档含接口文档或接口说明时，页面 dataSources 的 url 直接取文档中的接口地址——方法、参数、返回形状均以文档为准，不再使用下述 `/api/d/...` 命名约定。同源相对路径直接写；跨域绝对地址写完整 URL（`type: http` 原生支持）。转发层与命名约定仅在**无接口文档**时兜底。

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

完整实现见脚手架生成工程 `app/api/d/[...parts]/route.ts`。

## 对页面 yaml 的要求

- dataSources 一律 `type: http`；有接口文档时 url 取文档接口地址（方法/返回形状对齐），否则按命名约定写 `/api/d/...` 最终路径
- 列表接口返回形状约定 `{ items, total, filters? }`；详情接口对空 id 返回空对象而非 404（新建预填链路依赖）
- 需要预整形的编辑表单（如 `route-edit`）由详情接口整体返回 `form` 对象，DSL 只写 `initialValues: ${data.detail.form}`。`route` 详情的 `form` 必须完整包含 `code/name/type/alias/tagsText/description/path/protocol/operation/strategy/stickySession/healthFilter`；其中 `stickySession/healthFilter` 由接口预先转换为字符串 `on/off`。必须保留后端 `type`，不要在 `initialValues` 下用含 `type` 的对象字面量逐字段拼接；整体单表达式模式与 ActionEngine params 的边界见下节
- 选项类接口（如下拉的操作人列表）用单段路径，页面 `options: ${data.xxx}` 绑定
- 写操作走 `ops/` 前缀 POST。`request` 必须命名 `id`，只有 `actions.<id>.ok == true` 时才执行 success message 与 navigate/reload；请求失败、返回空数据或 `ok != true` 时留在当前页面/表单并 message error
- ops 上游成功响应必须为 HTTP 2xx，且经默认 `{ code, data, message }` 拆包后是 JSON `{ "ok": true }`：可直接返回 `{ "ok": true }`，或返回 `{ "code": 0, "data": { "ok": true } }`。2xx 空响应、`{}`、`{ "ok": false }` 都不算成功；500 及其他非 2xx 响应即使携带 `{ "ok": true }` 也按失败处理

## ActionEngine params 的 isOpaque 边界

`resolveDeep` 本身只在调用方显式提供 `isOpaque` 回调时跳过对象子树，**没有**默认的 `type` 跳过行为。本条只描述 ActionEngine 执行动作、解析 `action.params` 时注入的回调：它逐个检查普通对象，只要对象的 `action`、`type` 或 `component` 任一字段是字符串，就把**该对象及整棵子树原样保留**。`${...}` 表达式字符串也是 string，因此 `type: ${event.type}` 同样命中。

这意味着 `request.params.body` 或 `form.setValues.params.values` 中，含后端 `type` 的对象字面量会让兄弟 `${...}` 不再求值。后端字段名必须保留时，不改字段名，改为由接口或 Form 事件预先组成完整对象，再用**整体单表达式**绑定：

- Form 回填：`initialValues: ${data.detail.form}`。
- `form.setValues`：`params: { form: routeForm, values: ${data.detail.form} }`。
- Form 提交：`body: ${event}`，整体 event 一次求值并保留 `event.type`，不要在 body 下逐字段拼含 `type` 的对象。
- `message` 参数使用 `messageType`，让 `text` 中的表达式仍按 ActionEngine 规则求值。

```yaml
- type: Form
  props:
    name: routeForm
    initialValues: ${data.detail.form}   # 完整 form 含后端 type
  events:
    onSubmit:
      - id: saveResult
        action: request
        params:
          method: POST
          url: /api/d/ops/route-save
          body: ${event}                 # 整体提交，含 event.type
      - action: if
        params:
          condition: ${actions.saveResult != null && actions.saveResult.ok == true}
          then:
            - action: message
              params: { messageType: success, text: 已保存 }
          else:
            - action: message
              params: { messageType: error, text: 保存失败 }
```

## 组件数据预整形契约

接口按消费组件分别返回字段；不要把某个组件的选项数组直接交给另一个组件。

| 消费方 | 精确字段契约 | 验收点 |
| --- | --- | --- |
| `CardList.items` | `CardListItem` 按 EntityCard：`icon/logo/title/subtitle/tags/description/meta/actions/expandingActions` 均可选；可携带额外业务字段。没有统一必填 key | `onItemClick` / `onItemAction` 回传的 item 保留扩展字段；`tags` 项用 text/color，`actions` 项用 text/key?/variant?/danger? |
| `ChipFilter.items` | `ChipFilterItem` 为 `{ value, text, dot? }`；value/text 必填，dot 为可选 CSS 颜色值 | text 是最终展示文案，计数预先写入 text；组件没有 label、key 或 count 字段，也不会替接口计数 |
| `Tabs.items` | 每项必填 `{ key, label }`，可选 `children/extra/className/style` | key 用于 activeKey/onChange；label 是页签文案；extra 行为见 component-mapping |
| `Segmented.options` | 每项必填 `{ label, value }`，value 为 string/number；可选 `icon/disabled` | onChange 传出所选 value；不把 ChipFilter 的 text 或 Tabs 的 key 写进来 |

### ChipFilter 计数由数据侧计算

计数范围是 **keyword + chip**，不是组件能力。设当前 `keyword=支付`：

- `all` 的计数 = 只应用 `keyword=支付` 的记录数；本例为 8。
- `ENABLED` 的计数 = 同时应用 `keyword=支付` 与该 chip 的记录数；本例为 5。
- `DISABLED` 的计数 = 同时应用 `keyword=支付` 与该 chip 的记录数；本例为 3。
- 当前列表再按 `keyword + 当前选中 chip` 查询。各 chip 计数独立预计算，不能把当前列表 total 复制到每个 chip。

```yaml
filters:
  statusChips:
    - { value: all, text: "全部 8" }
    - { value: ENABLED, text: "启用 5", dot: "var(--primary)" }
    - { value: DISABLED, text: "停用 3", dot: "var(--muted-foreground)" }
```

ChipFilter 只渲染 `value/text/dot` 并在 onChange 抛出新 value；关键词、chip 过滤和计数都在数据侧完成。

## 替换为真实接口

把 `NEXT_PUBLIC_API_BASE_URL` 换成真实后端基准地址即可——页面 yaml 与转发层代码零改动。页面 dataSources 声明在无后端/真实后端两种状态下都无需改动，这就是必须 `type: http` 且路径即契约的原因。
