# Design: migrate-ui-base-ui

## Context

pactor-ui vendored 的 9 个组件（button/accordion/dialog/popover/select/tabs/separator/label + form 三适配件）全部基于 `@radix-ui/react-*`（9 个依赖）。shadcn 2026-07 起默认原语层切换为 Base UI（`@base-ui/react`，原 Radix 团队新作），官方每个组件现提供 base/radix/aria 三版源码，皮肤与 `data-slot` 钩子完全一致，差异在原语 API 与动画机制。

约束：DSL 契约（12 组件类型名 + props + 事件语义）MUST NOT 变；`data-slot` 结构钩子 MUST 保留（示例皮肤 theme.css 与测试依赖）；组件源码以 shadcn 官方 Base UI 版为准重新 vendor，不自行发明组合。

## Goals / Non-Goals

**Goals:**

- 全仓移除 `@radix-ui/react-*` 依赖（源码 + package.json + lockfile）；
- 9 个 vendored 组件替换为官方 Base UI 版，导出符号与 props 形态保持（适配层消化 API 差异）；
- Form 适配层（Form/Input/Select 三组件）在 Base UI 下保持契约语义：受控 values、required 校验拦截、onSubmit 写 form 作用域、onValuesChange 首参 `{field: value}`、initialValues/字段级 value 优先级；
- 三示例视觉/交互回归验证（含暗色、弹层、表单校验、admin 折叠菜单 flyout）。

**Non-Goals:**

- 不引入 React Aria 版；不跟随 base 版新增的组件 API 表面（保持我们既有导出契约）；
- 不改变 12 组件 DSL 契约与交互核心（OverlayManager/UiBridge 无原语依赖，不动）；
- 不做样式翻新（皮肤沿用 align-ui-shadcn-theme 后的官方令牌）。

## Decisions

### D1：组件源码以官方 Base UI registry 为准

从 shadcn 官方 base 版组件页（`https://ui.shadcn.com/docs/components/base/<name>`）/ registry JSON 取源码移植，保留 `data-slot` 与类名；仅在导出契约需要处做适配（如保持 `asChild` 语义的封装）。禁止凭记忆手写——逐组件对照官方源码。

### D2：关键 API 映射（实现时以官方源码核为准）

| Radix | Base UI | 备注 |
| --- | --- | --- |
| `Slot` / `asChild` | `render` prop / `useRender` | Button 的 asChild 契约保留，内部改实现 |
| Accordion Root/Item/Header/Trigger/Content | Accordion.Root/Item/Trigger/Panel | 动画从 `--radix-accordion-content-height` keyframes 改为 Base UI 面板机制（grid-rows 或高度过渡，以官方 base 版样式为准）；`type="multiple"` → `multiple` prop |
| Dialog Root/Portal/Overlay/Content | Dialog.Root/Portal/Backdrop/Popup | 动画类 animate-in/out → `[data-open]/[data-starting-style]` 过渡（官方 base 版源码自带） |
| Popover Root/Trigger/Content(sideOffset) | Popover.Root/Trigger/Portal/Positioner/Popup | sideOffset → Positioner 的 sideOffset |
| Select 全套 | Select.Root(items)/Trigger/Value/Portal/Positioner/Popup/Item | Base UI Select 需 `items` 做 value→label 映射；MEMORY 中 radix Select 空串回调坑随原语消失，重验 |
| Tabs Root/List/Trigger/Content | Tabs.Root/List/Tab/Panel | |
| Separator | Separator | |
| Label | 无独立原语 → 原生 `<label>` | |
| react-form Root/Field/Control/Label | **去原语化**：原生 `<form>` + `<div>` + `<label htmlFor>`（useId 关联） | 见 D3 |

### D3：Form 层去原语化（不引入 Base UI Field/Form）

我们的 Form 受控状态、校验、作用域写入全部自管于 Form context，`@radix-ui/react-form` 只提供了 DOM 结构与 label↔control 的 id 关联。Base UI 的 Field/Form 组件语义围绕其自身校验体系，贴合并无收益。**决策**：Form/Input/Select 适配件改用原生 `<form>`/`<div data-slot="form-item">`/`<label htmlFor>` + `useId` 关联，错误文案维持 `data-slot="form-error"`。DOM 钩子不变，测试与皮肤零影响。

### D4：动画层调整

accordion keyframes（`--radix-accordion-content-height`）按官方 base 版机制替换；dialog/popover/select 的 `animate-in/fade/zoom` 类若官方 base 版改用 data 属性过渡，则跟随官方源码；`tw-animate-css` 依赖在全部移植完成后评估——无引用则移除，有引用（或其他用途如 animate-pulse 为 Tailwind 内建不受影响）则保留。

### D5：回归验证基线

- 既有单测全绿（jsdom 下 Base UI 弹层默认关闭，断言 data-slot 结构不变为主）；
- 三示例 playwright 截图回归：admin（菜单手风琴展开/折叠 flyout、Tabs、Select、Dialog 确认框、登录表单校验报错、暗色）、chat（无原语使用，纯确认无破坏）、vite-starter（表单/表格）；
- MEMORY 坑 #7（radix Dialog body 滚动锁）按 Base UI 行为重验并更新记录。

## Risks / Trade-offs

- [Base UI Select 的 items 映射语义与我们的 options 模型差异] → 适配层把 `options` 转 `items`，单测覆盖"未渲染过 item 也能显示选中 label"（原 radix 坑的对应场景）。
- [jsdom 下 Base UI 组件兼容性问题（floating-ui 测量等）] → 弹层类测试以"触发后查询 DOM"为主，必要时 mock matchMedia/ResizeObserver（测试 setup 已有先例）。
- [官方 base 版源码与我们的类名微调（border-border 显式化等）冲突] → 以官方为准重移植后，皮肤回归截图裁决。
- [Base UI 版本策略（1.x 仍在快速演进）] → 锁 `^1.7.0`，升级走独立变更。

## Migration Plan

一次性切换，无渐进灰度（包未发布，无外部用户）：依赖替换 → 组件重 vendor → 适配层改造 → 测试修复 → 示例回归 → 文档/spec/MEMORY 更新 → 归档。回滚 = git 工作区还原（全程未提交）。
