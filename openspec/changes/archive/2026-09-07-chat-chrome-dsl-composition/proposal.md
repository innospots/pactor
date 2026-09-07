# Proposal: chat-chrome-dsl-composition

## Why

`@pactor-app/chat` 的视图层全部手写（约 1700 行私有 CSS + 每个 chrome 区域 bespoke JSX），与 `@pactor-app/ui` 注册表已有组件（Button / Tooltip / Icon / Empty / Alert / Card / Badge / Text 等）大量重复：同一套视觉与交互维护两份，ui 组件迭代不会传导到 chat chrome，皮肤契约也被迫分裂（`--pactor-chat-*` 与 shadcn 语义令牌）。方向确立：chat 内部的通用 UI **优先以 DSL 组合 `@pactor-app/ui` 现有组件**构建，chat 包只保留 chat-domain 核心呈现与行为。

## What Changes

- 新增 **chat chrome DSL 渲染层**：chrome 区域以包内 DSL 片段（DslNode）表达，经 ambient 页面运行时 renderer（`useRenderer().renderChildren`）渲染宿主 registry 中的 `@pactor-app/ui` 组件；**不新增对 `@pactor-app/ui` 的运行时依赖**（守零依赖契约）
- chrome DSL 的交互经 `chat.*` 内建动作接回包内行为：ambient renderer 可用时 chat 向页面运行时 `context.actions` 注册内建动作（不覆盖宿主同名动作），行为实现仍在 chat 包内
- **受控回退**：无 DslRenderer 上下文（纯 React 直连 / 测试）或 ambient registry 缺所需组件类型时，回退现有手写实现（现有实现即 fallback，DOM 契约仅在该环境保留）
- 首批迁移（高贴合、机制验证）：空态区（Empty / Typography / Button）、PartRenderer 的 error 警示条 / status 弱提示 / dsl-pending 占位 / artifact 卡片（Alert / Text / Card / Badge / Button）、消息操作条按钮组（Button / Tooltip / Icon）
- **keep bespoke**（不迁移）：MessageBubble 气泡、PartRenderer 流式核心（SmoothText/SmoothMarkdown/dsl part 挂载）、ActivityTrace 全部、Composer 行为层（IME/@检测/拖放）、安全降级链（guardChatDsl / DslSlotGuard / ArtifactDslGuard）、组合层（ChatComposition/store 自持）、AppShell drawer context
- 后续批次（本变更不做）：ModelChip→Select、ChatSidebarMenu→Menu（需 ui Menu 扩展 badge/dot/group/disabled）、AnchoredPopover→Popover、AppShell→Sidebar、ArtifactPanel→Resizable、上下文 chips→Badge（closable）

## Capabilities

### New Capabilities

- `chat-chrome-dsl`: chat chrome DSL 渲染层——包内 chrome DSL 片段经 ambient renderer 渲染、组件类型齐备性校验、`chat.*` 内建动作注册、无 renderer / 类型缺失时的受控回退、chrome 容器上的令牌映射约定

### Modified Capabilities

- `chat-empty-state`: 空态问候与起始建议在 DSL 环境下优先经 ui 组件（Empty / Typography / Button）DSL 组合渲染，无 renderer 环境回退内建实现；行为契约（居中组、点击发送、空数组不渲染）不变
- `chat-view`: PartRenderer 的 error / status / 占位 / artifact 卡片与消息操作条在 DSL 环境下优先经 ui 组件 DSL 组合渲染，回退约定同上；「消息列表渲染」补充 chrome 组合的样式令牌来源约定（不放松 `--pactor-chat-*` 契约）

## Impact

- **代码**：`packages/chat/src/view/`（EmptyState / PartRenderer / MessageActions + 新增 chrome DSL 渲染层模块）、`packages/chat/tests/`（新增机制与回退测试，DOM 断言按环境分流）
- **规格**：新增 `chat-chrome-dsl`；修改 `chat-empty-state`、`chat-view`
- **依赖**：不变（`@pactor-app/ui` 仍为 devDependency；chrome 组件解析自宿主页面运行时 registry）
- **宿主可见变化**：DSL 环境下上述 chrome 区域的 DOM 结构与类名变为 ui 组件输出（视觉由 shadcn 令牌经 chrome 容器映射承担）；纯 React 直连环境无变化
- **不影响**：chat-domain 核心渲染、ChatServices API、页面 DSL 契约、examples
