# Tasks: add-chat-module

## 1. 包骨架

- [x] 1.1 创建 `packages/chat`：dependencies `pactor-core`/`pactor-runtime`/`pactor-markdown`/`pactor-permission` workspace:*，peerDeps `react >=18`/`antd >=5`，devDeps antd + react 测试栈（+ pactor-components 供 DSL part 测试）；tsconfig（jsx）、tsup、LICENSE、README、tests/setup.ts；`pnpm install` 成功

## 2. 消息模型与 Store（spec: chat-message-model）

- [x] 2.1 ChatMessage / ChatPart / 状态机类型
- [x] 2.2 ConversationStore：不可变更新 + 订阅
- [x] 2.3 store 单测

## 3. Streaming（spec: chat-streaming）

- [x] 3.1 事件联合类型
- [x] 3.2 applyChatEvent 纯 reducer（含乱序宽容）
- [x] 3.3 ChatTransport 接口 + runChatTurn + createManualDriver
- [x] 3.4 reducer 与 turn 单测

## 4. Safe Registry 与 capability（spec: chat-safe-registry）

- [x] 4.1 createSafeRegistry（get/has/list 交集）
- [x] 4.2 registerCapabilityAction（registry → permission → confirm → execute 链）
- [x] 4.3 chat 作用域组装（conversation/message/user/params）
- [x] 4.4 单测（含 runtime 引擎集成）

## 5. React 视图（spec: chat-view）

- [x] 5.1 MessageBubble + PartRenderer（text/markdown/dsl/tool/thinking/error/status）
- [x] 5.2 Composer（Enter 发送/Shift+Enter 换行/空文本不发送）
- [x] 5.3 ChatView（订阅 store，流式更新）
- [x] 5.4 registerChatLayout
- [x] 5.5 组件测试（jsdom 端到端：driver 推事件 → 流式渲染 → dsl part 白名单拦截 → thinking 折叠）

## 6. 验收与文档

- [x] 6.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 6.2 文档站新增 `packages/chat.md`，侧边栏与快速开始模块表同步，`pnpm docs:build` 通过
