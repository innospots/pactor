# Proposal: chat-icon-convergence

## Why

`@pactor-app/chat` 的图标用法目前是三套并存：17 处直接 `lucide-react` 引用、两个包内名称白名单（`MENU_ICONS` / `MESSAGE_ACTION_ICONS` 名称→组件映射）、chrome 片段的 `chrome/icons.ts` 语义就近映射（chat 名 → ui Icon 名）。`@pactor-app/ui` 的 `Icon` 组件本就是统一的图标白名单（归一化名称 + 未知名占位）。定位已确立——chat 是用 pactor-app 构建的实例、组件优先复用 ui——图标应收敛到 ui Icon 一处：ui 白名单补齐 chat 所需图标，chat 的全部图标用法（含 fallback 与 bespoke 路径）替换为 ui Icon，三套映射表全部删除。

## What Changes

- **`@pactor-app/ui` Icon 白名单补齐**（+10）：`ChevronsUpDown` / `FileText` / `PanelLeft` / `PanelRightOpen` / `Square` / `X` / `History` / `RotateCcw` / `Quote` / `HelpCircle`；并为 chat 既有图标名加别名键（`chat` → MessageSquare、`share` → Share2），使 chat 图标名 100% 直通命中（配置契约值不变）
- **依赖调整（BREAKING 架构取向）**：`@pactor-app/ui` 从 chat 的 devDependencies 移入 dependencies——chat 作为 pactor-app 实例正式依赖 ui kit（此前"零运行时依赖"只是代码注释级约定，无 spec 强制；spec 仅禁止 antd）
- **chat 图标全量替换**：17 处直接 lucide 引用 → ui Icon（`name` + `size` 数字 px + `strokeWidth`，API 等价）；`MENU_ICONS` / `MESSAGE_ACTION_ICONS` 组件映射表删除（图标名直传，未知名由 ui Icon 渲染占位——与 chat 占位语义一致）；`chrome/icons.ts` 语义映射删除（ui 别名后名称直通）；AnchoredPopover / ChatLayout 的零依赖注释同步更新
- chat 侧统一薄包装 `ChatIcon`（可选）：集中 size 默认值与 className 约定，避免各处重复

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `chat-view`: 新增需求「图标统一经 ui Icon」——视图（含 fallback 与 bespoke 路径）的图标一律经 `@pactor-app/ui` Icon 渲染（白名单名 + 未知名占位），不再直接依赖 lucide-react

## Impact

- **代码**：`packages/ui/src/components/components/Icon/`（白名单扩充）、`packages/chat/src/view/`（17 处替换 + 两个映射表删除）、`packages/chat/src/view/chrome/icons.ts`（删除）、`packages/chat/package.json`（依赖调整）
- **依赖**：chat → ui 新增运行时依赖（无循环：ui 不依赖 chat；ui/components 为 ESM tree-shakable，仅 Icon 进入 chat 运行时图）
- **规格**：`chat-view` 增量
- **视觉**：未知名图标的占位形态由"圆点/HelpCircle"统一为 ui 的 CircleQuestionMark（语义等价）；其余图标同库（lucide）同形，无视觉变化
- **不影响**：Chat props 中图标名的公开契约值（menu.icon / messageActions icon）、DSL 片段路径（名称直通后行为不变）、chrome fallback 双路径架构（后续可凭此依赖简化，非本变更范围）
