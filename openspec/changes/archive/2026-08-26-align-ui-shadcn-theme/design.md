# Design: align-ui-shadcn-theme

## Context

`pactor-ui` 的预建样式（`src/styles.css` → 构建期 Tailwind v4 CLI → 包根 `styles.css`）在 add-ui-shadcn-kit 时决策 **D1：preflight 关闭**（只引入 theme + utilities 两层），目标是宿主全局样式零影响。

实测该决策是"样式丑"的根因（playwright + computed style 验证）：

- shadcn 组件大量渲染原生 `<button>`，其工具类不设 border —— 无 preflight 时 UA 默认样式 `border: 2px outset black` 泄漏，菜单项/页签/折叠钮全部带丑陋黑框；
- preflight 缺失 → `html` 无 `font-family` → 全局退化为 Arial，标题衬线，无抗锯齿；
- 官方主题脚手架的 `@layer base`（`* { border-border outline-ring/50 }`、`body { bg-background text-foreground }`）缺失；
- 官方推荐动画层 `tw-animate-css` 未引入 → Dialog/Select/Popover 的 `animate-in/out`、`fade-in-0`、`zoom-in-95` 类无定义，弹层无进退场动画；Accordion 的 `animate-[accordion-down/up_*]` 任意值类缺 `@keyframes`；
- 令牌组落后于官方当前文档：radius 派生为旧式加减法（±px），官方现为乘法比例（0.6/0.8/1/1.4/1.8/2.2/2.6）；缺 `chart-1..5` 与 `sidebar` 系列令牌；
- ShadcnLoginLayout 内容区无间距，Alert 与表单字段挤压（截图可见）。

参考：[shadcn theming 文档](https://ui.shadcn.com/docs/theming)（默认 neutral 主题完整脚手架）。

## Goals / Non-Goals

**Goals:**

- 预建样式表与官方默认 neutral 主题脚手架逐项对齐（preflight、base layer、令牌组、radius 比例、动画层）；
- 暗色仍走全仓约定 `[data-pactor-theme='dark']`（不引入官方 `.dark` class 约定）；
- 保留 Alert 四态补充令牌 `--success/--warning/--info`；
- 三个示例视觉回归验证（截图评审）；
- spec / README / 文档同步。

**Non-Goals:**

- 不更换 vendored 组件源码版本（组件 class 已是 Tailwind v4 形态，无需升级）；
- 不引入 shadcn CLI / components.json / `shadcn/tailwind.css` registry 机制；
- 不做品牌色定制（示例皮肤机制已覆盖）；
- 不追求 preflight 作用域化（见 D1 备选方案）。

## Decisions

### D1：preflight 反转为开启（完整 `@import 'tailwindcss'`）

官方主题假设 preflight 存在；手工补"等效 reset"（button/input/h1…）本质是把 preflight 重写一遍且必然遗漏。**备选方案**：
- (a) 保持关闭、逐元素补 reset —— 否决：与官方持续漂移，维护成本高；
- (b) preflight 作用域限定（`.pactor-root *`）—— 否决：Tailwind v4 不支持预建 preflight 的作用域编译，且 radix portal 挂在 body 下，作用域覆盖不到；
- (c) 完整 preflight —— **采用**。消费方是"pactor 应用"（pactor-ui 即其 UI 基线），与任何 shadcn 应用一致；示例自有 CSS（theme.css/app.css）均在 styles.css 之后导入，层叠顺序安全。

### D2：令牌组对齐官方默认 neutral 主题

`:root` / `[data-pactor-theme='dark']` 补齐 `chart-1..5`、`sidebar` 系列；`--radius` 保持 `0.625rem`，派生改乘法比例并补 `2xl/3xl/4xl`；`@theme inline` 桥接全部新增令牌。`--destructive-foreground` 与四态补充色保留（本包契约扩展）。

### D3：动画层 = `tw-animate-css` 依赖 + 本地 accordion keyframes

`tw-animate-css` 为纯 CSS 包（官方文档当前推荐），提供 `animate-in/out`、`fade-*`、`zoom-*`、`slide-*` 工具类；构建期随 Tailwind CLI 一并编译进预建产物，消费方无感知。Accordion 的 `--radix-accordion-content-height` keyframes 官方原本在 tailwind config 里定义，这里以 `@keyframes accordion-down/up` 写进样式源。

### D4：布局间距修复

ShadcnLoginLayout 等内容区容器补 `flex flex-col gap-*`（或等效），修复 Alert 与表单贴死；其余布局若有同类挤压一并处理（以截图回归为准，不扩大范围）。

## Risks / Trade-offs

- [preflight 全局 reset 影响宿主页面的非 pactor 区域] → 三示例截图回归验证；文档明确"导入 styles.css 即接受 shadcn 基线样式"的契约；宿主如需隔离可不导入样式表（但组件将无样式，属非支持场景）。
- [chat 示例自有皮肤（pactor-chat/styles.css）与 preflight 叠加产生视觉变化] → 截图对比，若有挤压/边框回归在示例或 chat 皮肤层修，不动 preflight 决策。
- [新增依赖 tw-animate-css 增加构建面] → 纯 CSS 零运行时风险；版本锁定经 pnpm-lock。

## Migration Plan

`pnpm --filter pactor-ui build`（tailwind + tsup）重建预建样式 → 三示例截图回归 → 全量测试（register.test.ts 断言反转）→ spec 同步归档。无对外 API 变化，无需迁移指南；仅文档措辞更新。
