# Design: chat-icon-convergence

## Context

chat 图标三套并存（直接 lucide / 包内名称白名单 / chrome 语义映射），ui Icon 是统一白名单（`normalizeIconName`：PascalCase/kebab/下划线 → kebab 命中 `ICONS` 表；未知名渲染 CircleQuestionMark 占位，与 chat 占位语义一致）。chat 直接引用的 17 个图标中 6 个不在 ui 白名单（ChevronsUpDown / FileText / PanelLeft / PanelRightOpen / Square / X），名称白名单另有 4 个缺（History / RotateCcw / Quote / HelpCircle）；chat 的 `chat` / `share` 两个契约图标名在 ui 无同名键。

已核实：`Icon` / `ICONS` / `normalizeIconName` 经 `@pactor-app/ui/components` 导出；ui `sideEffects: ["./styles.css"]`，ESM tree-shakable；无 spec 强制 chat 对 ui 零依赖（`grep openspec/specs` 仅 core 零依赖与各包 antd 禁令）。

## Goals / Non-Goals

**Goals:**

- ui Icon 白名单补齐 chat 全部所需图标（含别名直通）；chat 图标用法全量替换为 ui Icon；三套映射表删除
- 图标名公开契约值（menu.icon / messageActions[].icon）不变；未知名占位语义不变

**Non-Goals:**

- 不动 chrome fallback 双路径架构（chat→ui 依赖使简化成为可能，另行评估）
- 不改 ui Icon 的 API（size / strokeWidth / 占位行为保持）
- 不动 lucide-react 在 chat 的 devDependencies 之外残留（替换后从 dependencies 移除 lucide-react——它在 chat dependencies 中，替换完毕即移除）

## Decisions

### D1：ui 白名单 +10 与别名键

`ICONS` 增加：`chevrons-up-down` / `file-text` / `panel-left` / `panel-right-open` / `square` / `x` / `history` / `rotate-ccw` / `quote` / `help-circle`；别名键 `chat: MessageSquare`（chat 菜单契约名）、`share: Share2`（消息操作契约名）。别名放 ui 而非 chat 映射——名称直通后 chat 侧零映射表。

### D2：chat 直接依赖 ui（取向决策）

`@pactor-app/ui` 移入 chat dependencies；lucide-react 从 chat dependencies 移除（替换后无直接引用）。理由：定位（chat 是 pactor-app 实例）+ 用户明确指令；零依赖原为注释级约定且无 spec 强制。备选（保零依赖、fallback 继续 lucide）放弃：与"都提炼并替换"的指令冲突，且永久维持三套图标体系。

### D3：替换模式

- 直接引用：`<Download size={15} />` → `<Icon name="download" size={15} />`（strokeWidth / className 原样透传——ui Icon 均支持）；
- 名称白名单：`MENU_ICONS` / `MESSAGE_ACTION_ICONS` 删除——`<Icon name={item.icon} size={15} />`（icon 缺失时不渲染 Icon 的分支保留；未知名由 ui 占位）；
- `chrome/icons.ts` 删除：menu.tsx / message-actions.tsx 片段的 `toUiIconName(x)` 调用改为直接传名；
- 统一封装非必需：尺寸各异（12–16px），直接各处 `<Icon name size>`，不引入 ChatIcon 包装（避免第四层抽象）。

### D4：注释与文档同步

AnchoredPopover.tsx / ChatLayout.tsx 的"零运行时依赖"注释改为新取向（chat 依赖 ui kit）；chat package.json description 提及自包含处同步。ui 组件参考 Icon 小节如列白名单则补新图标。

## Risks / Trade-offs

- [chat 不再 kit 无关，第三方单独使用 chat 需连 ui 一并安装] → 既定取向（实例定位）；README/注释注明
- [ui Icon 占位形态（CircleQuestionMark）与 chat 原占位（圆点/HelpCircle）的视觉差] → 语义等价且更一致；冒烟核对
- [别名键 'chat'/'share' 污染 ui 白名单语义] → 键即契约值直通，文档注明别名来源
- [tsup 构建 chat 时 ui 解析] → dependencies 均 external，运行期由宿主解析；pnpm install 后 typecheck/build 验证

## Migration Plan

ui 白名单 → 依赖调整 + install → 逐文件替换（按 grep 清单 17 处 + 两表）→ 既有测试零回归 → 根级验证 + examples 冒烟。回滚 = git revert。

## Open Questions

（无）
