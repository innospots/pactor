# Design: add-shadcn-dsl-components

## Context

`@pactor-app/ui` 是 vendored shadcn 风格 UI kit：`src/ui/` 为 vendored 原语（基于 `@base-ui/react` + cva + tailwind-merge + lucide-react），`src/components/` 为 DSL 适配器（框架级 props → 原语 props，Form 上下文集成、事件值规范化），`register.ts` 把适配器按 DSL 类型名注册进 `ComponentRegistry`。目前仅 20 个类型。硬约束：MUST NOT 依赖 antd 与 `@radix-ui/react-*`；Tailwind 仅在包构建期运行，产出预建 `styles.css`；暗色经 `data-pactor-theme` 切换。

shadcn/ui 组件目录约 50+ 组件，本变更将其中未覆盖的组件分批纳入 DSL（见 proposal 与 specs/shadcn-extended-components）。

## Goals / Non-Goals

**Goals:**

- 扩展组件全部走既有两层架构（ui 原语 + components 适配器），DSL 协议为框架级 props。
- 表单类组件与既有 Form 上下文机制无缝集成（声明 `name` 即成表单项）。
- 容器类组件经 `useRenderer().renderChildren` 渲染 DSL 子树。
- 预建样式覆盖全部新增组件，消费方仍零配置。
- 注册表契约从"三 kit 同构"调整为"shadcn ⊇ builtin 20 类型 + 扩展集"。

**Non-Goals:**

- 不为 antd / Radix kit 补齐同名扩展组件（仅 shadcn kit 扩展）。
- 不透传底层库自由组合 API（如 DataTable 不暴露 tanstack-table 全量配置）。
- 不做可视化主题编辑器、不做组件的自定义 slot 任意嵌套（超出 spec 声明的 props 即不支持）。
- Chart 仅支持 line/bar/area/pie 四种；DataTable 不做虚拟滚动。

## Decisions

### D1: 原语层选型 —— 优先 @base-ui/react，缺口引入 shadcn 官方同源社区库

Base UI 已覆盖的原语直接 vendored 实现：Accordion、AlertDialog、Avatar、Checkbox、Collapsible、ContextMenu、Dialog、Field、Menu（DropdownMenu）、Menubar、NavigationMenu、Popover、PreviewCard（HoverCard）、Progress、Radio（RadioGroup）、ScrollArea、Separator、Slider、Switch、Toast（Sonner 后端）、Toggle、ToggleGroup、Tooltip、Combobox（Combobox 基础）。

Base UI 没有的，引入 shadcn 官方文档采用的同一社区库，仍 vendored 封装在 `src/ui/`：

| 组件 | 依赖 |
| --- | --- |
| Calendar | `react-day-picker` + `date-fns` |
| Carousel | `embla-carousel-react` |
| Command | `cmdk` |
| Drawer | `vaul`（Base UI 无 Drawer） |
| InputOTP | `input-otp` |
| Resizable | `react-resizable-panels` |
| Chart | `recharts` |
| Sonner | 自实现薄封装（Base UI Toast），不引 `sonner` 库 |

理由：与 shadcn 官方实现保持同源，降低 vendored 移植成本与行为偏差；全部依赖均为无 radix 的独立库，满足约束。备选方案"全部自实现"被否：日历/轮播/图表的交互与无障碍成本高、收益低。

### D2: 适配器模式 —— 每组件一个目录，契约类型就近导出

沿用既有结构：`src/components/components/<Name>/index.tsx` 导出适配器与 `XxxProps`；表单类复用 `Form/context.js` 的 `useFormContext` / `registerField` / `formItemClass` 机制（参考 Select 适配器）；容器类（Accordion/Tabs 式 items、Dialog/Popover 的 content、Sidebar 的 children）经 `useRenderer().renderChildren` 渲染 DSL 子树。新增组件的 props 类型直接定义在 shadcn kit（扩展组件无 antd 契约可复用），但命名与语义向既有契约对齐（`variant` / `size` / `disabled` / `className` / `style`）。

### D3: DSL 协议粒度 —— items 数据声明优先，children 子树仅用于富内容

列表型内容（Breadcrumb/Pagination/Menu/DropdownMenu/Command/NavigationMenu）用 `items`/`options`/`groups` 纯数据声明（可表达式绑定）；富内容区（Accordion pane、Dialog 内容、Tooltip 触发元素、Sidebar 主内容）用 `children` 或 items 内的 `children: DslNode[]`。理由：与既有 Tabs/Table/Menu 的协议保持一致，schema 校验与表达式绑定成本最低。

### D4: 弹层双路径统一

DSL 内联 Dialog/AlertDialog/Drawer/Sheet 与交互层 OverlayHost 复用同一套 `src/ui/` 原语，保证视觉与动画一致；内联弹层为受控组件（`open` + `onClose`），不接管 OverlayManager 队列。AlertDialog 的 onConfirm/onCancel 语义对齐 overlay 结果（confirm ≈ success）。

### D5: 样式与动画

新增原语的 class 全部在 `src/ui/`、`src/components/` 源码内，Tailwind 构建扫描自动覆盖；新增关键帧（drawer 滑入、accordion 已有、toast 进退场、spinner 旋转）补入 `src/styles.css` 动画层；新增语义令牌不需要（chart-1..5 与 sidebar 系列已存在，Sidebar/Chart 直接复用）。

### D6: 分批实施顺序

按依赖与风险分四批，每批独立可测可交付：

1. **展示类 + 表单类**（Badge/Avatar/Skeleton/Separator/Kbd/Spinner/Empty/AspectRatio/Progress/Textarea/Checkbox/RadioGroup/Switch/Slider/Label/Field）—— 纯 Base UI，无新依赖，先建立模式。
2. **导航类 + 反馈弹层类**（Breadcrumb/Pagination/Menubar/NavigationMenu/DropdownMenu/ContextMenu/Dialog/AlertDialog/Drawer/Sheet/Popover/Sonner/Accordion/Collapsible/Tooltip/HoverCard）—— 引入 vaul，打通弹层双路径。
3. **复合类**（Calendar/Carousel/Command/InputOTP/Resizable/ScrollArea/Toggle/ToggleGroup/ButtonGroup/InputGroup/Item/Typography/Combobox）—— 引入 react-day-picker、embla、cmdk、input-otp、react-resizable-panels。
4. **页面级组合**（Sidebar/DataTable/Chart）—— 引入 recharts，DataTable 复用既有 Table 适配器扩展。

## Risks / Trade-offs

- [新增 8+ 运行时依赖，包体积与维护面扩大] → 依赖全部隔离在 `src/ui/` vendored 层；Chart/DataTable 所在的第 4 批最后交付，若需裁剪可单独降级；锁定到 minor 版本。
- [Base UI 与 shadcn Radix 版 API 有差异，vendored 移植出现行为偏差] → 每组件配契约测试（渲染、交互、事件值），以 spec 场景为验收。
- [预建 styles.css 随组件数增长变大] → Tailwind 按需扫描仅产出用到的工具类；动画关键帧手工控制在个位数。
- [扩展组件无 antd 对照契约，props 设计漂移] → spec 先行冻结 props 集合；命名向既有契约对齐；评审以 spec 为准。
- [Sonner 自实现与社区 sonner 行为差异] → 仅承诺 toast 基本能力（success/error/info + description），不承诺 promise toast 等高级特性。

## Migration Plan

纯增量变更，无既有行为修改：既有 20 类型不动；唯一"破坏"是契约测试断言从"三 kit list() 相等"改为"超集"，同步修改 `packages/ui/tests/` 中对应断言。回滚：按批 revert，批次间无耦合。

## Open Questions

- Combobox 与既有 Select 的边界：Combobox 支持搜索，是否最终替代 Select？当前决策：并存，DSL 层两者独立类型。
- Sidebar 与既有 Layout/Menu 组合的关系：并存（Sidebar 是整页组合方案，Layout 是自由拼装方案），后续可考虑统一。
