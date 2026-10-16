# Design: chat-view-reuse-ui-components

## Context

`packages/chat/src/view/` 与 `packages/ui/src/components/chat/` 存在四组重复/近重复实现：

| chat view | ui chat | 关系 |
|---|---|---|
| Composer（555 行） | Composer（396+536 行） | 近重复：chat 版多 streaming/onStop、IME 守卫、chrome DSL 桥接、toolbar/mention/plus 回调；ui 版多全受控输入、附件重试、mention chip |
| ArtifactPanel（561 行） | ArtifactPanel（345+186 行） | 同源移植：ui 版注释明示移植自 chat；`buildArtifactTree`/下载/dsl-preview 两份并存；chat 版多 inspector 槽、viewRequest、拖拽调宽 |
| MessageBubble（320 行） | ChatMessage + Bubble/Sender/Thinking/ToolCall | 近重复：chat 版接 ChatMessage 模型 + PartRenderer（dsl/artifact part）+ ActivityTrace + MessageActions；ui 版纯展示 |
| EmptyState（92 行） | Welcome + Suggestion | 近重复：chat 版多 chrome DSL 渲染路径 |

chat 独有（保留）：Chat/ChatShell/ChatLayout/AppShell/AnchoredPopover/context-sources/ModelChip/MessageActions/PartRenderer/chat-composition/chat-workspace/chrome 桥接层。ui 独有（不冲突）：AgentStatus/Bubble/Sender/Citation/Prompt/StreamingText/Suggestion/StepsPanel/ConversationList/MessageList/ChatPage/Attachment。

约束：依赖方向必须保持 `@pactor-app/chat` → `@pactor-app/ui` 单向（现状即如此）；`@pactor-app/chat` 导出面（`Composer`/`ArtifactPanel`/`buildArtifactTree`/`ChatView` 等）须对外稳定——唯一直接消费 view 组件的外部方是 theme-studio 的 `ChatView`。

## Goals / Non-Goals

**Goals:**
- chat 视图层的展示代码（输入区、产物面板、消息气泡、空态）单一来源，归属 ui chat 组件。
- chat 包保留运行时职责：ConversationStore/transport 接线、PartRenderer（dsl/artifact part）、ActivityTrace、MessageActions、chrome DSL 桥接、ChatComposition/ChatWorkspace 装配。
- `@pactor-app/chat` 导出符号不变，外部消费方零改动。
- 删除无引用的重复样式规则；视觉不回归。

**Non-Goals:**
- 不改动 ui 独有的 12 个组件与 chat 独有的运行时组件的行为。
- 不调整 `@pactor-app/chat` 导出名（不改名、不删除既有导出符号）。
- 不重构 chrome DSL 桥接层架构（仅适配新组件 props）。
- 不动 doc 站菜单/详情结构（仅必要时更新描述文案）。

## Decisions

### 复用方式：组合而非继承，运行时接线留在 chat

chat 的 view 组件改为薄组合层：展示部分渲染 ui 组件，运行时能力（store 订阅、transport 驱动、safeRegistry、chrome DSL）保留在 chat。ui 组件保持纯展示——不引入 store/transport 概念；chat 需要的展示能力缺口（Composer 的 `streaming`/`onStop`、ArtifactPanel 的 inspector 槽/拖拽调宽/`onSelectArtifact(对象)`）以**可选 props 补进 ui 组件**，而非在 chat 侧重写一份。

替代方案（chat 保留现有实现、仅"对齐"两侧行为）被否：这正是现状的痛点，两份实现必然继续漂移。

### Composer：ui Composer 补齐运行态 props 后整体替换

ui Composer 补 `streaming?: boolean` / `onStop?: () => void`（发送/停止按钮状态机）等缺口；chat `view/Composer` 删除，ChatView 直接组合 ui Composer + chat 的 chrome 桥接（`chrome/composer.tsx`）与 context-sources。props 映射（chat `contextSources`→ui `contexts` 等）在组合层完成。`@pactor-app/chat` 根入口的 `Composer`/`ComposerProps` 导出改为再导出组合后实现，签名保持兼容。

### ArtifactPanel：单一实现归属 ui，chat 保留 store 集成

ui ArtifactPanel 吸收 chat 版缺失能力（inspector 槽、viewRequest 定位信号、拖拽调宽、整对象 onSelectArtifact），成为全仓唯一实现；`buildArtifactTree`、artifact 模型适配、下载、dsl-preview 只留 ui 侧一份（chat `src/artifact.ts` 的 ArtifactStore 是数据层，保留）。chat `view/ArtifactPanel` 删除，`chat-composition` 直接使用 ui ArtifactPanel + ArtifactStore 接线；chat 根入口 `ArtifactPanel`/`buildArtifactTree`/`ArtifactPanelProps` 等改为再导出 ui 符号。

### MessageBubble：保留运行时壳，展示块替换为 ui 组件

MessageBubble 保留（它是 ChatMessage 模型 + PartRenderer + ActivityTrace + MessageActions 的唯一组合点，chat 独有职责），但其内部的 role 气泡、身份行、thinking/tool-call 段、时间戳等展示 markup 替换为 ui `Bubble`/`Sender`/`Thinking`/`ToolCall`/`ChatMessage` 的组合；dsl/artifact part 仍走 PartRenderer。替换后删除 chat styles.css 中不再引用的 `pactor-chat-message*` 等规则。

### EmptyState：ui Welcome + Suggestion 组合

chat EmptyState 改为 ui `Welcome`（greeting/subtitle）+ `Suggestion`（建议项）组合；chrome DSL 渲染路径（EmptyStateFallback 回退）保留。`EmptyState`/`ChatSuggestion`/`EmptyStateProps`/`DEFAULT_CHAT_GREETING` 导出不变。

### 样式：按引用清理，不按文件整体搬移

ui chat 组件全部使用 Tailwind 工具类（无 `.pactor-chat-*` 类），chat styles.css 全为 `.pactor-chat-*` 语义类，无同名冲突。替换完成后逐类 grep：被删组件独有的类（如 `pactor-chat-composer`、`pactor-chat-inspector*`、`pactor-chat-message*` 中无引用部分）删除；chrome 层与独有组件共用的类（`pactor-chat-icon-button`、`pactor-chat-chrome` 等）保留。`--pactor-chat-*` 令牌定义不动。

### 测试策略

直测被替换组件的测试（composer.test.tsx、artifact-panel.test.tsx）改为测组合后实现（契约为既有导出符号与行为）；经 ChatView 的集成测试（view/message-actions/activity-trace/empty-state/model-selector/context-sources）应保持绿，仅在 DOM 结构断言处适配。ui 侧为补 props 的组件增补测试。

## Risks / Trade-offs

- [ui Composer/ArtifactPanel 补 props 后与 doc 预览/DSL 注册的既有行为冲突] → 全部新增 props 可选且有默认值；ui 侧 807 个既有测试 + doc 预览实测兜底。
- [MessageBubble 展示块替换导致消息流视觉/交互回归（操作条、时间戳、system 居中态）] → 以 chat 现有测试为契约基线；替换后逐测试核对，doc/examples 浏览器实测。
- [chrome DSL 桥接层（chrome/composer.tsx 等 1070 行）与新组件 props 不匹配] → 桥接层仅在 props 映射处适配，DSL 字段契约不变；chrome-dsl/composer-dsl/composer-slots 测试覆盖。
- [样式删过头（chrome 层仍引用的类被删）] → 逐类 grep 引用后再删；examples/chat、examples/admin、theme-studio 三处实测。
- [范围蔓延：合并过程中顺手重构 chrome 层或统一 ChatPage/ChatView] → 明确 Non-Goals；ChatPage（ui 整页壳）与 ChatView（chat 运行时）的关系统一留待后续变更。

## Migration Plan

1. ui 侧：Composer / ArtifactPanel 补齐缺口 props（+测试），ui 构建通过。
2. chat 侧：Composer → EmptyState → ArtifactPanel → MessageBubble 依次替换（每步测试绿再下一步）。
3. 清理 chat styles.css 无引用类；导出适配。
4. 全仓 build + test；doc astro build；examples/theme-studio 浏览器实测。

回滚：按组件分步提交，任一步 revert 不影响其他步骤。
