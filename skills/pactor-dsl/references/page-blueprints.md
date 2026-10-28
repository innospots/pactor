# Pactor 页面蓝图与完整性验收

写页面 YAML 前先确定「页面类型 → 布局 → 区域 → 组件 → 数据 → 交互 → 状态 → 响应式」。本参考解决“页面能渲染但结构不完整”的问题；DSL 语法见 `dsl-authoring.md`，路由/目录见 `page-catalog-and-layout.md`，组件类型与链接见 `component-catalog.md`。

完整、已通过 Page DSL Schema 与表达式语法校验的生产列表基线：[`examples/search-list.page.yaml`](examples/search-list.page.yaml)。它覆盖面包屑、标题与权限、查询/重置、服务端分页、Table 行模板、加载/错误重试、多选、删除确认及成功/失败反馈。全部页面基线、数据契约和宿主注册方式见 [`examples/index.md`](examples/index.md)。

## 1. 完整页面的五层契约

| 层 | 必须明确的事实 | 证据 |
| --- | --- | --- |
| 路由 | 页面 `id`、path、params、是否 hidden | sitemap `pages` 或 `StaticDslLoader.pages` |
| 外壳 | 使用哪个全局布局；布局是否有 `PageOutlet` | bootstrap `layout.type` / sitemap `menus[].layout` / `layouts` |
| 页面 DSL | `dsl`、`page`、`state`、`dataSources`、`body` | 页面 YAML |
| 页面区域 | 面包屑、标题/说明、主操作、筛选、主体、分页、反馈 | 页面 `body` 子树 |
| 行为闭环 | 加载、查询、重置、新建、编辑、提交、删除、重试、状态与权限 | `events` + `actions` + 条件表达式 |

只有 YAML 文件、只有静态组件树、或只在菜单里出现，都不算完整页面。

## 2. 通用页面骨架

管理端页面运行在已有 `admin` 外壳内，通常**不要**在页面里重复 `Layout / Sidebar / Header`。使用 `Page` 组织内容区：

```yaml
dsl: '1.0'
page:
  id: example-list
  title: 示例列表
  type: list
  permission: example:view

state:
  keyword: ''

dataSources:
  records:
    type: http
    autoLoad: true
    request:
      url: /api/examples
      params: { keyword: ${state.keyword} }

body:
  type: Page
  children:
    - type: Breadcrumb
      props:
        items:
          - { label: 首页, href: / }
          - { label: 示例管理 }
    - type: Flex
      props: { justify: space-between, align: center }
      children:
        - type: Typography
          props: { text: 示例管理, variant: h3 }
        - type: Button
          props: { text: 新建, variant: primary, icon: plus }
          events:
            onClick:
              - action: navigate
                params: { to: /examples/new }
    - type: Card
      props: { title: 查询条件 }
      children: []              # Form + 带 name/label/rules 的控件
    - type: Card
      props: { title: 数据列表 }
      children: []              # Table / List / CardList 子树
```

约定：

- `Typography h3 + Text muted` 或 `Page props.title` 二选一，不能同时重复同一标题。
- 页头主操作放在标题行右端；不要把它塞进卡片标题或表格底部。
- 全局布局已经提供导航、账户和页面出口时，页面只负责 `PageOutlet` 以下的内容。
- `blank` / `landing` 页面可以在 `body` 中自行组合 `Layout`、`NavigationMenu`、`HeroSection`、`SiteFooter`。

## 3. 页面类型蓝图

在线模板总览：<https://pactor.innospots.com/templates/overview/>

| page type | 默认结构 | 技能内完整基线 | 在线蓝本 |
| --- | --- | --- | --- |
| `list` | Breadcrumb → 标题/新建 → 搜索 Card + inline Form → Table → 分页/批量操作 | [search-list](examples/search-list.page.yaml) · [customer-list](examples/customer-list.page.yaml) | [搜索列表页](https://pactor.innospots.com/templates/search-list/) |
| `card-list` | Breadcrumb → 标题/新建 → 筛选区 → CardList / EntityCard 网格 → 计数与空态 | [card-list](examples/card-list.page.yaml) | [卡片列表页](https://pactor.innospots.com/templates/card-list/) |
| `detail` | Breadcrumb → 标题/状态/操作 → 概览 Card → Descriptions / Tabs / 纵向区块 | [record-detail](examples/record-detail.page.yaml) | [Tab 详情](https://pactor.innospots.com/templates/detail-tabs/) · [纵向详情](https://pactor.innospots.com/templates/detail-sections/) |
| `form` | Breadcrumb → 标题 → Form 分区 → 取消/保存 → 成功/失败反馈 | [record-edit](examples/record-edit.page.yaml) | [独立表单页](https://pactor.innospots.com/templates/form-page/) |
| `dialog-form` | 列表上下文不变 → Dialog → Form → 取消/保存 | [dialog-form](examples/dialog-form.page.yaml) | [弹窗与确认框](https://pactor.innospots.com/templates/modal-confirm/) |
| `drawer-form` | 列表上下文不变 → Drawer → Form → footer 触发校验提交 | [drawer-form](examples/drawer-form.page.yaml) | [侧滑层表单](https://pactor.innospots.com/templates/drawer-form/) |
| `dashboard` | 页头/刷新 → 时间范围 → 指标卡 → 趋势 → 构成/排行 | [dashboard](examples/dashboard.page.yaml) | [仪表盘页](https://pactor.innospots.com/templates/dashboard/) |
| `tree-master-detail` | 左侧 Tree → 右侧 Form/Table → 保存与重新加载 | [tree-master-detail](examples/tree-master-detail.page.yaml) | [树形主从配置](https://pactor.innospots.com/templates/tree-master-detail/) |
| `grant-panel` | 左目录 → 右全量权限勾选 → 全量保存 | — | [双栏授权配置](https://pactor.innospots.com/templates/grant-panel/) |
| `login` | 全局 `login` 布局 → `Login` 业务组件 → 提交闭环 | [login](examples/login.page.yaml) · [register](examples/register.page.yaml) | [登录页布局](https://pactor.innospots.com/templates/login-layouts/) |
| `chat` | 全局 `chat` 布局或独立 `ChatPage` → 菜单/会话/消息/输入/产物 | [chat](examples/chat.page.yaml) | [聊天交互页](https://pactor.innospots.com/templates/chat-page/) |
| `navigation` | `blank` / `landing` 内的 Header / NavigationMenu / Menu / Content / SiteFooter | [navigation](examples/navigation.page.yaml) | [NavigationMenu](https://pactor.innospots.com/components/navigation/navigation-menu/) |
| `settings` | Breadcrumb → 分区 Card → 多个 Form → 分区保存 | — | [独立表单页](https://pactor.innospots.com/templates/form-page/) |
| `overlay` | 列表/详情保持上下文 → Dialog / AlertDialog / Drawer | [dialog-form](examples/dialog-form.page.yaml) · [drawer-form](examples/drawer-form.page.yaml) | [弹窗与确认框](https://pactor.innospots.com/templates/modal-confirm/) |
| `info` | Card → Alert / Typography / Markdown / RichText | — | [信息与文本卡片](https://pactor.innospots.com/templates/info-text-cards/) |
| shell | 全局布局中 `PageOutlet`；不要作为普通业务页面文件 | — | [控制台外壳](https://pactor.innospots.com/templates/admin-shell/) |

### 3.1 搜索列表页

必须包含：

1. `Breadcrumb`；末项是当前页且不给 `href`。
2. 标题、说明、主操作（新建/导入/导出）和权限。
3. `Card` 内的 `Form layout: inline`；控件使用自身 `name`、`label`、`rules`，查询/重置按钮作为 Form 直接子节点即可。只有需要 `description`、`labelHint`、声明式错误或按钮组时才手写 `Field`。
4. `Table` 的列、行操作、空态文案、`rowKey` 和分页策略。
5. 查询 `setState → reload`；重置 `form.setValues → resetState → reload`。
6. `Table.loading`、`Table.emptyText`、错误 `Alert + reload`、行操作禁用条件。

推荐数据源：

```yaml
state:
  keyword: ''
  status: ''
  page: 1
  pageSize: 10

dataSources:
  records:
    type: http
    autoLoad: true
    request:
      url: /api/examples
      params:
        keyword: ${state.keyword}
        status: ${state.status}
        page: ${state.page}
        pageSize: ${state.pageSize}
```

客户端分页使用 `Table.pagination: { pageSize: 10 }`；服务端分页使用 `pagination: false` + 独立 `Pagination`，并把 `${event}` 写回 state 后 `reload`。

### 3.2 详情页

必须包含：

1. 返回路径：`Breadcrumb` 的上级项带 `href`，或用返回 `Button` + `navigate`。
2. 实体标题、状态、关键元数据和操作（编辑/停用/删除）。
3. 只读字段优先 `Descriptions`；多个同层视图才使用 `Tabs`；单页签不要只为了右端 `extra` 使用 Tabs。
4. 详情加载：`Card.loading` 或 `Skeleton`；错误 `Alert + reload`；不存在时使用 `Empty` 或 `Result`，不要显示空白页。
5. 编辑入口按 `route.params.id` 导航，写操作后 `reload` 当前详情。

### 3.3 新建/编辑表单页

必须包含：

1. 新建与编辑复用同一个 `Form` 结构和字段顺序。
2. 编辑态用接口返回的 `initialValues` 或 `form.setValues` 预填；弹层内的 Form 在打开时才挂载，应先把数据写入 draft state，再把该 state 传给 `initialValues`，不要在同一条打开链路中提前调用 `form.setValues`。不要把每个字段绑定到 `${state.x}` 手工同步。
3. 常规字段把 `name`、`label`、`rules` 放在控件上，Form 会自动生成字段壳；需要 `description`、`labelHint`、声明式错误或自定义容器时再用显式 `Field`，且 label 只由其中一层拥有。
4. 取消返回列表；保存按钮使用 `submit: true` 或 `form.submit`；提交中有 `loading` + `disabled`。
5. 成功：`message` + `reload`/`navigate`/`overlay.close`；失败：`message` 并保留用户输入。
6. 布尔确认项（协议、条款、同意开关）不能用 `required` 单独校验，因其不把 `false` 判空；必须用事件写入 state 控制提交入口，并由服务端复验。

### 3.4 仪表盘

必须包含：

1. 标题、更新时间或时间范围、刷新操作。
2. 指标使用 `Statistic` + `Card`；展示变化时用 `Badge`/`Status`/`Text` 明确方向与单位。
3. 趋势和构成使用具体图表类型（如 `LineChart`、`ColumnChart`、`PieChart`），并注册 `@pactor-app/chart`。
4. 指标卡与图表使用 `Row + Col` 响应式栅格；窄屏改为单列，图表不能撑出整页横向滚动。
5. 加载、空数据、失败、刷新禁用四态齐全；空数据不能让指标静默显示为 0。

### 3.5 卡片列表与主从页面

- 卡片列表优先 `CardList` / `EntityCard`，不要手工 `For + Card` 重造业务卡片。
- 左侧树 + 右侧表单使用 `Row/Col`、`Tree`、`Form`；树选择后 `form.setValues` 回填。
- 左右工作区需要拖拽调整时使用 `Resizable`；文档里的 `Splitter` 不是 DSL 类型。
- 移动端默认改为纵向：左树/列表在上，右侧内容在下。

### 3.6 登录、聊天和落地页

- 登录页使用 `@pactor-app/blocks` 的 `Login`，按 PRD 选择 `layout`；不要再手写 `Card + Form` 登录页。
- 注册页没有独立 `Register` 类型：使用 `Login + children Form`；跨字段规则（如两次密码一致）必须由服务端或宿主扩展复验。
- 完整聊天工作区优先 `ChatPage`；嵌入已有页面的对话使用 `Chat`；菜单驱动的多页面聊天外壳使用 `ChatShell`。
- `Chat` / `ChatPage` 都需要宿主注入 `ChatServicesProvider`（至少 `transport`）。
- 落地页使用 `landing` 布局或 `HeroSection` + `NavigationMenu` + `SiteFooter`；业务 CTA 必须接 `navigate` 或真实动作。

### 3.7 弹层与导航

- Dialog 用于在当前上下文完成短表单；Drawer 用于需要更多纵向空间的编辑任务。两者都保持列表/详情页面可见。
- Drawer 默认 footer 在表单 DOM 外，保存按钮必须通过 `form.submit` 触发校验，不能依赖 `submit: true`。
- AlertDialog / `confirm` 只用于确认或破坏性操作；成功后仍需请求、反馈和刷新。
- 常规后台页面运行在 `admin` 外壳内，不要再放全局 `Sidebar / Header / PageOutlet`。
- `blank` / `landing` 门户页可以用 `Layout + Header + NavigationMenu + Content + SiteFooter`；跨路由使用 href / navigate，同路由章节切换用 Tabs，线性流程用 Steps。
- `Menu` 是受控数据组件，必须用 `selectedKey + onSelect` 与路由或 state 闭环。

## 4. 四态与反馈契约

| 状态 | 判断来源 | 推荐呈现 | 禁止 |
| --- | --- | --- | --- |
| loading | `${dataStatus.<name>.loading}` | `Table.loading`、`Card.loading`、`Skeleton`、`Spinner`、按钮 `loading` | 把 loading 渲染成 `Empty` |
| empty | 加载完成、无错误、集合为空 | `Table.emptyText`，或 `Empty` + 可执行 CTA | Table 内置空态与额外 `Empty` 叠加 |
| error | `${dataStatus.<name>.error != null}` | 保留页面骨架的 `Alert` + `reload` 重试 | 把请求失败写成“暂无数据” |
| disabled | 权限、状态、加载中或业务条件 | `disabled: ${...}`、`permission: { denied: disabled }` | 只隐藏而不说明原因；前端权限替代后端授权 |

操作反馈：

- 查询/刷新成功通常不弹全局提示；保存/删除/提交必须给出成功或失败反馈。
- 破坏性操作先 `confirm` 或 `AlertDialog`，确认后再请求。
- 请求结果命名 action `id`，用 `${actions.x...}` 分支；不要假设失败会抛到页面。
- 提交中防止重复点击；失败后保留表单值并允许重试。

## 5. 响应式与布局规则

- 桌面基准 `1440×900`，窄屏基准 `390×844`。
- 复杂页面先复制同类标准骨架，再替换字段；不要为单个页面发明新的间距体系。
- 栅格使用 `Row gutter` + `Col span/xs/md/xl`；成对表单字段桌面 `md: 12`，窄屏 `span: 24`。
- `Flex` 间距使用 `gap`；两端布局使用 `justify: space-between`，不要写 `between`。
- 表格允许自身横向滚动，但页面不能整体横向滚动；长文本、操作列和固定列要明确策略。
- `Drawer` / `Dialog` 在窄屏不得超出视口；内容区滚动、footer 操作保持可达。
- 浮层（Select、DatePicker、Popover）以根节点主题令牌渲染，亮/暗色都要可辨认。

## 6. 交互闭环模板

| 交互 | 最小动作链 |
| --- | --- |
| 查询 | `Form onSubmit → setState → reload(dataSource)` |
| 重置 | `form.setValues(defaults) → resetState → reload` |
| 新建/编辑 | `navigate`，或 `setState(draft + open/id) → 弹层内 Form 用 initialValues 挂载` |
| 保存 | `setState(submitting) → request/service.call(id) → if 成功 → message + refresh/close` |
| 删除 | `confirm(id) → if 确认 → request(id) → if 成功 → message + reload` |
| 重试 | `reload(dataSource)`，保留现有筛选与页面结构 |
| 下钻 | `navigate to=/resource/${row.id}`；目标页通过 `route.params.id` 加载 |
| 返回 | `navigate to=/list`，不要依赖浏览器历史作为唯一返回路径 |

## 7. 页面完成清单

交付每个页面之前逐项确认：

- [ ] **R1 文件与 id**：文件名与 `page.id` 符合项目 A/B 布局约定，且全局唯一。
- [ ] **R2 路由**：`sitemap.pages`（或 loader pages）有对应 path；参数页使用 `:param`。
- [ ] **R3 菜单**：可见页有菜单项；详情/编辑/新建等 hidden 页有 `activeMenu` 和真实入口。
- [ ] **R4 外壳**：layout 存在且包含 `PageOutlet`；页面没有重复全局导航/账户区。
- [ ] **R5 DSL 根结构**：`dsl: '1.0'`、`page`、`body` 正确；node 级 `children/events/permission/when` 不在 `props` 内。
- [ ] **R6 区域完整**：Breadcrumb（适用时）、标题/说明、主操作、主体、分页/尾部操作、反馈位置齐全。
- [ ] **R7 组件真实**：所有 `type` 出现在 `component-catalog.md`，所需包已注册，props 与当前源码一致。
- [ ] **R8 表单**：控件有 `name`、`label`、`rules`；显式 `Field` 与内层控件不重复 label；有提交按钮和失败保留；编辑/新建复用同一 Form。
- [ ] **R9 数据**：`Table.dataSource` 等使用 `${data.x}` 表达式；请求参数来自 state/route；无虚构接口字段。
- [ ] **R10 交互**：查询、重置、新建、编辑、提交、删除、重试均有动作链和成功/失败反馈。
- [ ] **R11 状态与权限**：loading / empty / error / disabled 互斥且可见；权限同时覆盖页面、菜单、操作和后端。
- [ ] **R12 响应式与主题**：1440/390、亮/暗色、浮层与表格滚动均通过目检。
- [ ] **R13 校验**：`npx pactor validate` / `npx pactor lint` 通过；真实页面的控制台、Network、交互与截图检查通过。

若从内置完整示例起步，先运行：

```bash
# 单文件
npx pactor validate src/server/yaml/pages/home.page.yaml

# 多文件 / 整个 DSL 目录
npx pactor lint src/server/yaml
```

该命令在消费项目中执行，要求已安装 `@pactor-app/cli`。Schema 校验只证明根结构与动作形状合法，不证明组件 props、路由、服务、响应式或交互闭环完整；后者按 R1–R13 在真实工程和浏览器中验收。
