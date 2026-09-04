# Design: add-layout-components

## Context

当前布局是应用外壳层概念：`@pactor-app/app` 按 bootstrap `layout.type` 从 LayoutRegistry 解析整体布局（admin/blank/login/landing），页面 DSL 渲染在外壳的 content 槽里。页面自身无法声明布局结构——想做一个「左侧导航 + 顶部栏 + 内容区」或更自由的组合（双栏、无壳沉浸页、嵌套分区），只能新增一整个外壳布局类型。

框架已有前提条件：`DslNode` 是通用节点（`children` / `className` / `style` / `when` / `permission` / `events`），容器组件经 `renderChildren` 渲染 DSL 子树，`components` + `Fragment` 支持命名子树复用。布局组件只是又一个容器组件族。

## Goals / Non-Goals

**Goals:**

- DSL 页面可在 `body` 中直接声明布局结构：`Layout` / `Header` / `Sider` / `Content` 自由组合、嵌套
- 布局组件与普通组件同权：通用 props、表达式绑定、权限、条件渲染、Fragment 复用全部可用
- 与现有外壳布局（LayoutRegistry）正交共存，不破坏任何现有页面

**Non-Goals:**

- 不改动 LayoutRegistry / bootstrap `layout.type` 外壳机制（向后兼容）
- 不做固定定位（fixed/sticky header/sider）——用 `style` 逃逸口可自行实现
- 不做栅格系统的替换（Grid 组件保持均分栏定位）
- Sider 不做内置菜单渲染（菜单由 MenuRegistry/外壳负责；DSL 内 Sider 内容完全由 DSL 声明）

## Decisions

### D1：布局组件注册进 ComponentRegistry，不做特殊渲染路径

`Layout` / `Header` / `Sider` / `Content` 是普通容器组件（`children` 经 renderChildren 渲染），注册进 shadcn 组件表。不引入「布局节点」新节点种类。

*备选：在 Renderer 加布局特殊分支——违反决策 D5（组件一律经 Registry 解析），否决。*

### D2：Layout 方向推导——含 Sider 直接子节点则 horizontal，否则 vertical

对齐 antd Layout 语义：`Layout` 是 flex 容器，遍历直接子 DSL 节点，存在 `type: 'Sider'` 即 `flex-direction: row`，否则 `column`。推导基于 DSL 节点类型名（渲染前可知），不依赖 React 子元素检查。

*备选：显式 `direction` prop——多一步心智负担；antd 用户已习惯自动推导。保留 `direction` prop 作为显式覆盖。*

### D3：Sider 折叠——`collapsible` + 受控 `collapsed` + `onCollapse` 事件

`Sider` 支持 `width`（默认 200）、`collapsible`（底部折叠触发器）、`collapsed`（受控，可绑 `${state.x}`）、`collapsedWidth`（默认 64）、事件 `onCollapse`（传出 boolean）。受控闭环与框架其它组件一致（props 绑 state + 事件回写）。

*备选：Sider 自持折叠状态——DSL 无法感知/持久化折叠态，否决。*

### D4：Header / Content / Footer 是纯语义容器

`Header`（`display: flex; align-items: center`、默认高度与下边框）、`Content`（`flex: 1` 主内容区）、`Footer`（底部区域，默认居中、弱化的辅助文本样式）不内置任何导航/品牌逻辑，内容完全由 children DSL 声明。样式细节走 shadcn 语义令牌（`bg-background` / `border-border`），换肤契约与现有组件一致。

### D5：Menu 组件——数据经表达式注入，不直接读 MenuRegistry

`Menu` 是哑渲染组件：`items`（`{ key, label, icon?, children? }[]`，可含表达式，如 `${data.menus}`）、`mode: 'inline' | 'horizontal'`（Sider 内用 inline、Header 内用 horizontal）、受控 `selectedKey`、事件 `onSelect`（传出 key，通常接 `navigate` 动作）。

**不**直接绑定外壳层的 MenuRegistry：页面 RuntimeContext 没有菜单注册表（它属于应用外壳层），让 Menu 读注册表会把外壳概念泄漏进页面组件层。菜单数据经 dataSource（http/service）或宿主注入 state 获得；「bootstrap 菜单自动进 DSL 作用域」留作后续增量。

*备选：Menu 直接消费 MenuRegistry——耦合外壳层、且页面级上下文拿不到该注册表，否决。*

### D6：与外壳布局的选用规则

- 要应用级外壳（菜单、用户区、多页签）→ 继续用 bootstrap `layout.type`
- 页面要自己掌控整页结构 → 外壳用 `blank`，页面 `body` 以 `Layout` 起手自由组合
- 两者混用（外壳 admin + 页内 Layout）合法但通常意味着设计问题，文档中给出指引

## Risks / Trade-offs

- [DSL 作者在外壳 admin 布局内又嵌套 Layout+Sider，出现双层导航] → 文档明确 D5 选用规则；示例只演示 blank 外壳下的自由布局
- [Layout 方向推导遇 Fragment 引用 Sider 时不可见（引用处 type 是 Fragment）] → 推导只看直接子节点类型名；Fragment 包裹 Sider 的场景推导失效，文档说明此限制（或显式 `direction` 覆盖）
- [命名混淆：LayoutRegistry 的"布局"（外壳）与 Layout 组件] → 文档统一术语：外壳布局（shell layout）vs 布局组件（layout components）

## Migration Plan

纯新增能力，无迁移。现有页面与外壳布局行为不变。

## Open Questions

- Sider 是否需要 `breakpoint` 响应式自动折叠（antd 语义）？V1 不做，观察实际需求
