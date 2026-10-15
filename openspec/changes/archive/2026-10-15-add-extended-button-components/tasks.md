# Tasks: add-extended-button-components

## 1. 基础组件（ActionButton / CopyButton / IconMorph）

- [x] 1.1 新建 `packages/ui/src/ui/icon-morph.tsx`：预设图标对白名单（`menu-close` / `play-pause` / `copy-check` / `plus-minus`），`state: 'a' | 'b'` 受控切换，双图层 rotate/scale/fade 过渡，未知名对渲染占位图标 + dev 告警，`motion-reduce:` 降级
- [x] 1.2 新建 `packages/ui/src/ui/action-button.tsx`：复用 `buttonVariants`（默认 `size="sm"`），`icon` + 可选 `label` + 可选 `tooltip`（包裹现有 Tooltip），icon-only 时要求 `aria-label`
- [x] 1.3 新建 `packages/ui/src/ui/copy-button.tsx`：`value` + `navigator.clipboard.writeText`，copied 态（复用 IconMorph copy→check，可选 `copiedLabel`），`resetDelay` 默认 1500ms 自动还原，`onCopy(value)` / `onError` 回调，失败不进 copied 态
- [x] 1.4 测试：三组件的渲染、className/data-slot 约定、IconMorph 受控切换与未知名占位、CopyButton 成功还原（fake timers）与失败路径（mock clipboard）

## 2. 组合组件（SplitButton / FloatingButtonGroup / ExpandingButtonGroup）

- [x] 2.1 新建 `packages/ui/src/ui/split-button.tsx`：ButtonGroup 包主 Button + DropdownMenu（chevron 触发），`options: { value, label, icon?, disabled? }[]` + `onSelect(value)`，`variant`/`size`/`disabled` 两段一致
- [x] 2.2 新建 `packages/ui/src/ui/floating-button-group.tsx`：托盘容器 + 绝对定位共享高亮块，ref 测量目标按钮 `offsetLeft/offsetWidth`，transform/width 过渡跟随 hover 与 focus-visible，离开淡出；受控 `value` 时高亮恒定；`onSelect(value)`；0 尺寸测量防御
- [x] 2.3 新建 `packages/ui/src/ui/expanding-button-group.tsx`：图标按钮组，hover/聚焦按钮经 grid-template-columns/max-width 过渡展开 label，邻位让位；选项可声明 `confirm`（原地确认后触发 `onSelect`）；键盘可达
- [x] 2.4 测试：SplitButton 主/备操作分流与整体禁用、FloatingButtonGroup 的 onSelect 语义值与高亮节点存在性、ExpandingButtonGroup 展开 class 切换与 confirm 两次点击只回调一次

## 3. 状态机组件（ConfirmMorph）

- [x] 3.1 新建 `packages/ui/src/ui/confirm-morph.tsx`：`idle → confirming → pending → success / error` 状态机；`confirmLabel`（默认 destructive 样式段）、`confirmTimeout` 超时回 idle；`onConfirm` 返回 Promise 时 pending → resolve/reject 分流；error 段 undo 回 idle 并触发 `onUndo`；各段尺寸稳定（min-width 或最长段测量）
- [x] 3.2 测试：完整确认流程（onConfirm 恰好一次）、确认超时回退、reject 后 undo 回 idle（fake timers + user-event）

## 4. 导出、构建与回归

- [x] 4.1 `packages/ui/src/ui/index.ts` 导出 7 个组件及其 props 类型；根 `src/index.ts` 保持仅 re-export components/layout/interaction 三层，不改动
- [x] 4.2 `pnpm --filter @pactor-app/ui build`（tsup + Tailwind 预编译 styles.css），确认新类名进入产物
- [x] 4.3 `pnpm --filter @pactor-app/ui test` 全套通过（含既有 782 个用例无回归）、`pnpm --filter @pactor-app/ui typecheck` 通过
- [x] 4.4 消费方回归：`cd doc && pnpm exec astro build` 通过；如有 doc dev server 在跑，重启使其依赖预构建刷新
- [x] 4.5 `openspec validate add-extended-button-components --strict` 通过
