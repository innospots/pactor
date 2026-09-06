# Design: extend-header-component

## Context

`Header`（`packages/ui/src/components/components/Header/index.tsx`）当前是纯语义容器：横向 flex、垂直居中、下边框，仅渲染 children。spec `layout-components` 原本禁止 Header 内置品牌/导航逻辑，本变更放宽为"可选结构区域"。可用的既有能力：horizontal `Menu` 适配器、`DropdownMenu` 适配器（items + onSelect）、`Avatar` 原语/适配器、`useI18n`（取当前 locale）。

## Goals / Non-Goals

**Goals:**

- 五个可选结构区域（品牌/通用下拉/菜单/用户区/国际化切换）以 props 声明，事件以 `${event}` 语义值传出。
- 全部区域缺省时行为与现状逐像素一致（纯容器）。
- 零新依赖；视觉对齐 shadcn 既有令牌与间距。

**Non-Goals:**

- 不改动 admin 外壳布局（`ShadcnAdminLayout`）的头部——那里有自己的品牌/用户区逻辑。
- 不做区域自由排序/任意位置插槽（固定排布规则见 spec"区域排布"）。
- 国际化切换只发事件，不直接改写全局 locale（无 runtime 改动）。
- 用户区不做徽章/状态点等扩展。

## Decisions

### D1: 适配器内部组合既有原语，而非复用 DSL 适配器组件

Header 内部直接组合 `src/ui/` 原语（avatar、dropdown-menu、navigation-menu 或 menubar）渲染各区域，而不是在适配器里渲染 DSL 适配器组件（Menu/DropdownMenu）。理由：DSL 适配器的事件签名（如 DropdownMenu 的 `events.onSelect` 经 Renderer 绑定）在 Header 内部不可复用——Header 收到的是自己的事件回调 props（`onDropdownSelect` 等，Renderer 已绑定好），直接调原语并把语义值透传给自己的事件 prop 最干净。菜单区域用 Base UI Menubar/NavigationMenu 原语而非复用 `Menu` 适配器（Menu 适配器的 onSelect 绑定机制同理不适用）；视觉类名对齐 horizontal Menu。

备选方案"Header 内部嵌套渲染 DSL 子节点"被否：品牌/用户区是结构化数据（name/avatar/items），不是 DSL 子树，数据声明成本更低、schema 更可校验（对齐 D3：items 数据声明优先）。

### D2: 事件命名加区域前缀

Header 节点级 `events` 携带多个同名语义的回调（菜单/下拉/用户区都是"选中"），必须用不同事件名区分：`onMenuSelect` / `onDropdownSelect` / `onUserSelect` / `onLocaleChange`。不复用单一 `onSelect` + 载荷带来源字段——事件名即路由，DSL 可读性更好。

### D3: 国际化切换的当前值取自 useI18n，生效留给应用层

`locales` 触发器显示 `useI18n().locale` 对应的 label（未命中时显示 value 本身）。`onLocaleChange` 只发事件；应用层用 `setState` 回写 + i18n Provider locale 绑定 state 完成闭环（docs 补示例）。Header 不引入对 runtime 的新 API 依赖。

### D4: 排布用 flex 三段式

左区（品牌?/下拉?/菜单?）— `flex-1` 中区（children）— 右区（下拉?/品牌?/locales/user）。保持根节点 `data-slot="layout-header"` 与既有 className/style 挂载点不变（通用 props 契约不受影响）。

## Risks / Trade-offs

- [Header 变"重"，与 admin 外壳头部能力部分重叠] → 两者服务不同场景（自由组合 DSL vs 应用外壳），文档中说明定位。
- [菜单区域用原语重写可能与 Menu 适配器视觉漂移] → 类名对齐 horizontal Menu 渲染结果，契约测试断言结构与交互（选中传 key）。
- [右侧多区域堆叠拥挤] → 固定顺序 + 间距令牌；不开放排序。

## Migration Plan

纯增量：既有 Header 用法（仅 children）不变。无迁移步骤；回滚即 revert。

## Open Questions

- 通用下拉后续若需要多实例（多个 dropdown），当前单例 `dropdown` prop 需升级为数组——本期不做，spec 保持单例。
