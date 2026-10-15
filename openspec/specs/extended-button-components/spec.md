# Spec: extended-button-components

## Purpose

`@pactor-app/ui` 的扩展按钮组件族：在基础 `Button`/`ButtonGroup` 之上，提供参考 arc-library Actions > Buttons 分组交互设计的 7 个扩展按钮组件（ActionButton、SplitButton、FloatingButtonGroup、ExpandingButtonGroup、CopyButton、IconMorph、ConfirmMorph），供上层组件与业务场景复用。

## Requirements

### Requirement: 组件族与导出

`@pactor-app/ui` SHALL 新增 7 个扩展按钮组件：`ActionButton`、`SplitButton`、`FloatingButtonGroup`、`ExpandingButtonGroup`、`CopyButton`、`IconMorph`、`ConfirmMorph`，全部 MUST 从 `@pactor-app/ui/ui` 子路径导出（ui 层独立子路径是既有架构；根入口只 re-export components/layout/interaction 三层，DSL 层包装登记属后续变更，本变更 MUST NOT 改动根入口导出结构）。交互设计参考 arc-library Actions > Buttons 分组，实现 MUST 复用本仓技术栈（Base UI 原语 + cva + Tailwind v4），MUST NOT 引入 `motion`/`framer-motion` 等动画运行时依赖。

#### Scenario: ui 子路径可导入全部组件

- **WHEN** 从 `@pactor-app/ui/ui` 导入上述 7 个组件名
- **THEN** 每个导入均为有效 React 组件函数，无 undefined

#### Scenario: 根入口结构不变

- **WHEN** 对比 `@pactor-app/ui` 根入口的导出层结构
- **THEN** 仍仅 re-export components / layout / interaction 三层，未新增 ui 层直接导出

### Requirement: 统一适配约定

全部扩展按钮组件 MUST 遵循既有 vendored 约定：根节点携带 `data-slot="<kebab-case 组件名>"`；支持 `className`（经 `cn()` 合并）与 `style` 并作用于根节点；`variant`/`size` 取值与既有 `buttonVariants` 对齐（含 `disabled` 态样式）；动画 MUST 提供 `prefers-reduced-motion` 降级路径（`motion-reduce:` 变体）；图标 MUST 使用 `lucide-react` 静态导入。

#### Scenario: className 合并到根节点

- **WHEN** 任意扩展按钮组件传入 `className="x-custom"`
- **THEN** 渲染结果根节点 class 包含 `x-custom` 且保留组件默认样式类

#### Scenario: data-slot 标记

- **WHEN** 渲染任意扩展按钮组件
- **THEN** 根节点（或组件约定的主干节点）携带对应 `data-slot` 属性

### Requirement: ActionButton 紧凑工具栏按钮

`ActionButton` SHALL 提供紧凑的工具栏按钮：`icon`（lucide 图标节点）+ 可选 `label`，无 label 时渲染 icon-only 方形按钮；`variant`/`size` 复用 `buttonVariants`，默认 `size="sm"`；可选 `tooltip` 字符串，提供时 MUST 包裹现有 Tooltip 在悬浮/聚焦时显示。

#### Scenario: 仅图标渲染

- **WHEN** DSL/调用方渲染 `<ActionButton icon={<X />} aria-label="关闭" />`
- **THEN** 渲染 icon-only 按钮且不渲染文字节点

#### Scenario: tooltip 显示

- **WHEN** `<ActionButton icon={...} tooltip="保存" />` 且用户悬浮按钮
- **THEN** 显示内容为"保存"的提示浮层

### Requirement: SplitButton 分体式按钮

`SplitButton` SHALL 由主操作按钮与相邻的下拉触发按钮组成一个相连表面（复用 ButtonGroup 样式）：主按钮点击触发原生 `onClick`；下拉部分 MUST 复用现有 DropdownMenu，备选操作经 `options: { value, label, icon?, disabled? }[]` 声明，选中经 `onSelect(value)` 回调语义化抛出；`variant`/`size`/`disabled` 同时作用于两段。

#### Scenario: 主操作与备选操作分离

- **WHEN** 用户点击 SplitButton 主按钮区域
- **THEN** 触发 `onClick` 且不触发 `onSelect`

#### Scenario: 选择备选操作

- **WHEN** 用户打开下拉并点击 `value: 'save-draft'` 的选项
- **THEN** `onSelect` 以 `'save-draft'` 为参数被调用且菜单关闭

#### Scenario: 整体禁用

- **WHEN** `disabled` 为 true
- **THEN** 主按钮与下拉触发按钮均不可交互

### Requirement: CopyButton 复制确认按钮

`CopyButton` SHALL 点击后将 `value: string` 写入剪贴板并即时反馈：成功后进入 copied 态（图标由 copy 切换为 check，可选 `copiedLabel` 文字），`resetDelay`（默认 1500ms）后自动还原；成功时 MUST 触发 `onCopy(value)`；剪贴板不可用或写入失败时 MUST NOT 进入 copied 态，MUST 触发 `onError`。`variant`/`size` 复用 `buttonVariants`。

#### Scenario: 复制成功反馈并还原

- **WHEN** 用户点击 CopyButton 且剪贴板写入成功
- **THEN** 按钮进入 copied 态（check 图标）、`onCopy` 携带 value 被调用，并在 `resetDelay` 后还原为初始态

#### Scenario: 剪贴板失败

- **WHEN** 剪贴板写入抛错
- **THEN** 按钮保持初始态且 `onError` 被调用

### Requirement: IconMorph 图标形变

`IconMorph` SHALL 在预设图标对的两个状态间形变切换：`morph` 指定预设对（至少含 `menu-close`、`play-pause`、`copy-check`、`plus-minus`），`state: 'a' | 'b'` 受控驱动；切换 MUST 以 rotate/scale/fade 组合过渡呈现；未知名对 MUST 渲染占位图标并在开发环境告警，不抛错。

#### Scenario: 受控状态切换

- **WHEN** `morph="menu-close"` 的 IconMorph 的 `state` 由 `'a'` 变为 `'b'`
- **THEN** 渲染目标由 menu 图标切换为 close 图标（同一挂载点内过渡）

#### Scenario: 未知名对占位

- **WHEN** `morph` 传入不在预设表的值
- **THEN** 渲染占位图标且不抛错

### Requirement: ConfirmMorph 内联确认按钮

`ConfirmMorph` SHALL 将危险操作折叠为按钮内状态机：`idle → confirming → pending → success / error`。idle 段渲染 `label`；首次点击进入 confirming 段（`confirmLabel`，默认 destructive 样式，`confirmTimeout` 超时未确认自动回 idle）；确认后若 `onConfirm` 返回 Promise 则进入 pending（spinner），resolve→success、reject→error；error 段 MUST 提供 undo 操作回 idle 并触发 `onUndo`。状态切换 MUST 保持按钮尺寸稳定，不产生布局跳动。

#### Scenario: 完整确认流程

- **WHEN** 用户先点击按钮进入 confirming、再在超时前点击确认且 `onConfirm` resolve
- **THEN** 状态依次经过 confirming → pending → success，且 `onConfirm` 恰好调用一次

#### Scenario: 确认超时回退

- **WHEN** 按钮进入 confirming 后在 `confirmTimeout` 内未确认
- **THEN** 自动回到 idle 且 `onConfirm` 未被调用

#### Scenario: 失败后撤销

- **WHEN** `onConfirm` reject 进入 error 态后用户点击 undo
- **THEN** 回到 idle 且 `onUndo` 被调用

### Requirement: FloatingButtonGroup 托盘式按钮组

`FloatingButtonGroup` SHALL 在托盘容器内渲染一组独立按钮，并以一个共享高亮块指示当前项：高亮块 MUST 在 hover 与键盘聚焦（focus-visible）的按钮间平滑滑动（transform/width 过渡），离开组后淡出；按下态 MUST 原地呈现（active 缩放或下沉）；选项经 `options: { value, label?, icon?, disabled? }[]` 声明，`onSelect(value)` 语义化抛出；受控 `value` 提供时高亮 MUST 恒定位于是项。

#### Scenario: 高亮跟随指针

- **WHEN** 用户将指针从组内按钮 A 移到按钮 B
- **THEN** 共享高亮块从 A 的位置/宽度平滑过渡到 B，而非消失重建

#### Scenario: 选择抛出语义值

- **WHEN** 用户点击 `value: 'grid'` 的组内按钮
- **THEN** `onSelect` 以 `'grid'` 为参数被调用

### Requirement: ExpandingButtonGroup 展开式按钮组

`ExpandingButtonGroup` SHALL 渲染紧凑的图标按钮组：hover 或聚焦的按钮 MUST 原地展开显示其文字 label，其余按钮保持图标态并让位（宽度平滑过渡）；每个按钮可声明 `confirm` 行为（点击后原地切换为确认反馈再触发回调）；选项经 `options: { value, label, icon, confirm?, disabled? }[]` 声明，`onSelect(value)` 语义化抛出。

#### Scenario: 悬停展开 label

- **WHEN** 用户 hover 组内某图标按钮
- **THEN** 该按钮宽度平滑展开并显示 label 文字，相邻按钮位置平滑让位

#### Scenario: 确认后回调

- **WHEN** 某选项 `confirm: true` 且用户先点击该按钮（进入确认态）再点击确认
- **THEN** `onSelect` 以该选项 value 被调用一次
