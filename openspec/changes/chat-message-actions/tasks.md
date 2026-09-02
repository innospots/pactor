# Tasks: chat-message-actions

## 1. 类型与图标白名单

- [x] 1.1 `packages/chat/src/model.ts` 新增 `BuiltinMessageAction`（`'copy' | 'regenerate' | 'retry' | 'edit'`）与 `ChatMessageAction`（`id` / `builtin?` / `label?` / `icon?` / `roles?` / `visibleWhen?` / `service?`）类型，并从 `index.ts` 导出
- [x] 1.2 `packages/chat/src/view/MessageActions.tsx`（或新文件）新增 `MESSAGE_ACTION_ICONS` 白名单映射（copy/check/rotate-ccw/pencil + quote/thumbs-up/thumbs-down/share/bookmark），未知名渲染占位图标

## 2. MessageActions 数据驱动重构

- [x] 2.1 定义内建动作默认描述表（copy=assistant+completed；regenerate=assistant+completed 且仅末条且 transport；retry=assistant+error 且 transport；edit=user+completed），配置项按字段覆盖默认
- [x] 2.2 `MessageActions` 改为按解析后的动作数组渲染：缺省用 `['copy','regenerate','retry','edit']`（渲染与现状一致）；传入数组时严格按数组，未列内建动作不出现；可见性按 roles + visibleWhen + 附加约束集中求值
- [x] 2.3 自定义动作点击经 `ChatServices.callService(service, { actionId, message })` 派发（未注入时 console.warn 跳过不抛错）；全部动作点击并行触发 `onMessageAction(actionId, message)` 通知回调
- [x] 2.4 `MessageBubble` / `ChatView` 透传 `messageActions` 与 `onMessageAction`；既有 regenerableMessageId / handleRegenerate / onEditResend 链路保持不变

## 3. 组合层与 DSL 透传

- [x] 3.1 `ChatComposition` / `ChatWorkspace` 新增 `messageActions` 与 `onMessageAction` 可选 props 并逐层下传
- [x] 3.2 `Chat`（DSL 组件）接受 `messageActions` prop；`ChatDslAdapter` 将 `onMessageAction` 折算为 DSL 事件（event 作用域含 `action` 与 `message`）

## 4. 测试

- [x] 4.1 缺省回归：未配置时复制/重新生成/重试/编辑的渲染条件与行为测试（对齐现有语义）
- [x] 4.2 配置语义测试：数组即真相（未列内建不出现、顺序一致）、内建字段覆盖（label/roles/visibleWhen）、末条约束不可覆盖
- [x] 4.3 自定义动作测试：callService 派发参数、缺失 callService 时 warn 不抛错、onMessageAction 通知（含内建动作）、未知图标占位、visibleWhen 'always' 流式可见
- [x] 4.4 DSL 层测试：Chat 组件 messageActions 渲染 + onMessageAction 事件折算

## 5. 示例与文档

- [x] 5.1 examples/chat 的 `chat.page.yaml` 配置 `messageActions` 演示：一个内建覆盖（如 edit 改 label）+ 一个自定义动作（quote，service 派发，宿主注册 quoteMessage 服务）+ `events.onMessageAction` 事件
- [x] 5.2 更新 `packages/chat/README.md` 与 `examples/chat/README.md` 的 messageActions 章节

## 6. 验收

- [x] 6.1 `pnpm --filter @pactor/chat build && pnpm --filter example-chat build` 通过；chat 包测试全绿
- [x] 6.2 playwright 目检 examples/chat：默认渲染无回归；配置后操作条按数组渲染；自定义动作点击闭环（service + 事件）
