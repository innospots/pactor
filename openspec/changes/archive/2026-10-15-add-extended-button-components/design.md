# Design: add-extended-button-components

## Context

`@pactor-app/ui` 是 vendored shadcn/ui 风格 UI kit：Base UI 原语 + cva + Tailwind v4（构建期预编译 `styles.css`，消费方零配置），动画层用 `tw-animate-css`，图标用 `lucide-react`。现有按钮体系只有 `Button`（`buttonVariants`：default/destructive/outline/secondary/ghost/link × default/xs/sm/lg/icon*）和纯样式组合的 `ButtonGroup`。

参考的 [arc-library](https://github.com/kuratlielia/arc-library) 技术栈不同：CSS modules + 自有 design tokens + `motion`（spring 动画库）。其 Actions > Buttons 分组共 9 个组件，其中 Button / ButtonGroup 我们已有等价物，其余 7 个是本次要引入的扩展形态。

约束：
- 不新增运行时依赖（尤其不引入 `motion`）——UI kit 保持依赖收敛，且已有 `tw-animate-css`。
- 所有新类名必须能被 `packages/ui` 的 Tailwind 预编译扫描到（`pnpm --filter @pactor-app/ui build` 重新生成 `styles.css`）。
- 遵循 vendored 约定：`data-slot`、`cn()`、cva 变体、Base UI `render` 模式。

## Goals / Non-Goals

**Goals:**
- 在 `packages/ui/src/ui/` 新增 ActionButton、SplitButton、FloatingButtonGroup、ExpandingButtonGroup、CopyButton、IconMorph、ConfirmMorph 共 7 个组件，从 `ui/index.ts` 与包根入口导出。
- props 契约与既有 Button 对齐（`variant`/`size`/`className`/`disabled`/事件回调语义化），文档级 JSDoc 注明设计来源。
- 每个组件有 vitest 测试（渲染、交互、状态流转），全套测试通过 + `astro build`（doc 消费方）不回归。

**Non-Goals:**
- 不搬运 arc 源码/CSS modules/design tokens，不引入 `motion` 依赖。
- 不做 DSL 注册（`builtinComponents` 新增类型）——后续单独变更。
- 不在 doc 站组件目录登记展示——后续单独变更。
- 不含 arc Gestures 组（HoldToConfirm、SwipeActions、Reactions）与其余分组组件。
- 不改动既有 `Button`/`ButtonGroup` 的 API 与样式。

## Decisions

### D1：借鉴交互设计，用 Tailwind transition 实现，不引入 motion 库

arc 的 spring 手感来自 `motion` 库；引入它会让 UI kit 增加一个贯穿所有消费方的运行时依赖。替代方案：CSS `transition`（transform/width/opacity，150–250ms，ease-out/自定义 cubic-bezier）+ `tw-animate-css` 的 enter/exit 工具类，可达 80% 的视觉效果；`motion-reduce:transition-none motion-reduce:transform-none` 提供降级路径。若未来需要真实 spring，再单独立项评估 motion/framer-motion。

### D2：复用 `buttonVariants` 与既有原语组合，而非另起样式体系

- **ActionButton** = `buttonVariants({ variant, size })` 的薄封装：icon + 可选 label，默认 `size="sm"`，提供 `tooltip` 可选 props（复用现有 Tooltip）。
- **SplitButton** = `ButtonGroup` 包两个 `Button` + 现有 `DropdownMenu`（trigger 为右半 chevron 按钮）。备选操作通过 `options: { value, label, icon?, disabled? }[]` + `onSelect(value)` 暴露，主操作走原生 `onClick`。
- **CopyButton / ConfirmMorph** 主体同样是 `Button`，内部管状态。

保证主题 token（primary/destructive/radius 等）自动一致，dark mode 零额外工作。

### D3：滑动高亮用"测量 + transform"而非 spring 物理

FloatingButtonGroup 的共享高亮块、ExpandingButtonGroup 的展开让位：
- 容器 `relative`，高亮块 `absolute`，用 ref 测量目标按钮的 `offsetLeft/offsetWidth`，`transform: translateX()` + `width` 过渡驱动。无 JS 动画帧循环，无依赖。
- 高亮跟随 hover，也跟随 `focus-visible`（键盘可达）；组内无激活项时高亮淡出。
- ExpandingButtonGroup：按钮 label 用 `grid-template-columns: 0fr → 1fr`（或 max-width）过渡展开，icon 恒显；激活的 action 原地切换为确认反馈（参考 arc 的 confirm-in-place）。

### D4：IconMorph 用预设图标对 + 双图层交叉过渡

`morph` prop 指定预设对（`menu-close` / `play-pause` / `copy-check` / `plus-minus` / `chevron-up-down` 等），`state: 'a' | 'b'` 受控切换；两图标绝对定位堆叠，切换时一个 rotate+scale+fade 出、另一个入。未知名对直接抛 dev 警告并渲染占位——与 Icon 组件白名单约定一致。静态导入 lucide 图标，可 tree-shake。

### D5：CopyButton / ConfirmMorph 的内部状态机

- **CopyButton**：`value: string`，点击 → `navigator.clipboard.writeText` → copied 态（IconMorph copy→check + 可选文字反馈）→ `resetDelay`（默认 1500ms）后还原。非安全上下文/写入失败 → `onError` 回调 + 不进入 copied 态。`onCopy(value)` 对外抛事件。
- **ConfirmMorph**：`idle → confirming → pending → success / error`，error 后可 undo 回 idle。`confirmLabel`/`confirmVariant`（默认 destructive）定制确认段；`onConfirm` 返回 Promise 时自动进入 pending，resolve→success、reject→error；非 Promise 直接 success。`onUndo`、`onStateChange` 外抛。尺寸在状态间保持稳定（以最长段测量或 min-width），避免布局跳动。

### D6：文件与测试组织

- 每组件一个文件：`packages/ui/src/ui/{action-button,split-button,floating-button-group,expanding-button-group,copy-button,icon-morph,confirm-morph}.tsx`，与现有命名一致。
- 统一从 `src/ui/index.ts` 导出（`@pactor-app/ui/ui` 子路径）；根 `src/index.ts` 仅 re-export components/layout/interaction 三层，本变更不改动（DSL 层包装登记属后续变更）。
- 测试集中在 `packages/ui/tests/ui/extended-buttons.test.tsx`（若无 `tests/ui/` 目录则放入 `tests/components/`，沿用就近约定）：user-event 驱动交互，fake timers 验证 CopyButton 还原与 ConfirmMorph 状态流转，jsdom 下 mock `navigator.clipboard`。

## Risks / Trade-offs

- [CSS transition 手感弱于 arc 的 spring] → 用自定义 cubic-bezier 与较短时长补偿；交互语义（确认、反馈、还原）完整保留，这是功能核心。
- [jsdom 无真实布局，滑动高亮的测量逻辑测不准] → 测量代码做 null/0 防御；测试聚焦状态与 DOM 结构，视觉由 doc 站后续人工验证。
- [新增类名未进预编译 styles.css 导致消费方样式缺失] → 任务含显式 `pnpm --filter @pactor-app/ui build` 并以 doc 站 `astro build` 回归。
- [clipboard API 仅限安全上下文] → 失败路径显式回调，不静默吞错。
- [7 个组件一次交付面较大] → tasks.md 按"基础 3 个（Action/Copy/Split）→ 组 2 个（Floating/Expanding）→ 形变 2 个（IconMorph/ConfirmMorph）"分批，每批可独立验收。

## Migration Plan

纯新增、无 BREAKING。发布后消费方按需 import；回滚 = 删除导出与文件。

## Open Questions

- 无（DSL 注册与 doc 登记已明确排除，留给后续变更）。
