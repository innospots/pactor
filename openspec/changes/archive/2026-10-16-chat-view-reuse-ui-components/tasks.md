# Tasks: chat-view-reuse-ui-components

## 1. ui 侧补齐展示能力缺口

- [x] 1.1 ui `Composer` 补可选 props：`streaming` / `onStop`（发送/停止按钮状态机）及组合层所需其余缺口，补测试
- [x] 1.2 ui `ArtifactPanel` 并入 chat 版能力：inspector 槽、viewRequest 目录定位信号、拖拽调宽、整对象 `onSelectArtifact`；确认 `buildArtifactTree` / 下载 / dsl-preview 为唯一实现，补测试
- [x] 1.3 `pnpm --filter @pactor-app/ui test` 与 build 通过，doc 预览无回归

## 2. chat 侧替换 Composer 与 EmptyState

- [x] 2.1 ChatView 输入区改组合 ui Composer（props 映射：contextSources→contexts 等），保留 streaming/onStop、IME 守卫接线；chrome/composer.tsx 桥接适配
- [x] 2.2 删除 `view/Composer.tsx` 重复实现；根入口 `Composer`/`ComposerProps` 改指向组合后实现
- [x] 2.3 EmptyState 改由 ui Welcome + Suggestion 组合，保留 chrome DSL 回退路径；`EmptyState` 等导出不变
- [x] 2.4 更新 composer.test.tsx / composer-dsl.test.tsx / composer-slots.test.tsx / empty-state.test.tsx，全部通过

## 3. chat 侧替换 ArtifactPanel

- [x] 3.1 删除 `view/ArtifactPanel.tsx`；chat-composition 直接使用 ui ArtifactPanel + ArtifactStore 接线
- [x] 3.2 根入口 `ArtifactPanel`/`buildArtifactTree`/`ArtifactPanelProps`/`ArtifactTreeNode`/`ArtifactViewer`/`ArtifactViewers` 改为指向 ui 单一实现；chrome/panel-header.tsx 适配
- [x] 3.3 更新 artifact-panel.test.tsx，通过

## 4. chat 侧重构 MessageBubble

- [x] 4.1 MessageBubble 展示块（role 气泡/身份行/thinking/tool-call 段/时间戳）替换为 ui Bubble/Sender/Thinking/ToolCall/ChatMessage 组合；dsl/artifact part 仍走 PartRenderer；ActivityTrace/MessageActions 保留
- [x] 4.2 更新 view.test.tsx / message-actions.test.tsx / activity-trace.test.tsx 的 DOM 断言，通过

## 5. 样式清理

- [x] 5.1 逐类 grep 后删除 chat styles.css 中无引用的 `pactor-chat-composer` / `pactor-chat-inspector*` / `pactor-chat-message*` / `pactor-chat-empty` 等规则；chrome 层共用类（icon-button、chrome 等）与独有组件类保留
- [x] 5.2 `--pactor-chat-*` 令牌与暗色覆盖不动

## 6. 全仓验证

- [x] 6.1 packages/chat 全量测试通过；packages/ui 测试与 build 通过
- [x] 6.2 全仓 typecheck；examples/chat、examples/admin、tools/theme-studio 不改动源码且构建/测试通过（导出符号稳定验证）
- [x] 6.3 doc astro build 通过；浏览器实测 chat 相关详情页与 examples/chat 对话全流程（发送/流式/停止/产物面板/消息动作）无回归
- [x] 6.4 `openspec validate chat-view-reuse-ui-components --strict` 通过
