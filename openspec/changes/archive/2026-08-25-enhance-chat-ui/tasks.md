# Tasks: enhance-chat-ui

## 1. 核心模型与 Store 扩展

- [x] 1.1 `src/model.ts`：新增 `ChatAttachment`（id/name/mimeType/size?/url?）；`ChatMessage` 增加 `attachments?: ChatAttachment[]`
- [x] 1.2 `src/store.ts`：新增 `removeMessagesFrom(messageId)`（不可变截断，未知 id 告警忽略）
- [x] 1.3 测试：ChatAttachment 类型完备、removeMessagesFrom 截断与不可变性、未知 id 容错
- [x] 1.4 `src/index.ts`：导出 `ChatAttachment` 及后续新增的全部公开类型（含各组件 props 类型），保证"数据以接口注入"的契约可从包入口直接引用

## 2. Streaming 层：重新生成

- [x] 2.1 `src/transport.ts`：`RunChatTurnOptions` 增加 `skipUserMessage`；新增 `runRegenerateTurn(store, transport, options?)`（定位末条 user → removeMessagesFrom → 以同文本跑 turn，不追加 user 消息；无 user 消息告警返回；支持 signal）
- [x] 2.2 测试：runRegenerateTurn 正常重跑 / abort 取消 / 空 store 容错；skipUserMessage 不追加 user 消息

## 3. 活动轨迹纯函数

- [x] 3.1 新增 `src/activity.ts`（零 React）：`detectStreamingMode(message)` → reasoning/tool/responding/null；`pairToolTraces(parts)` → 按 name+顺序配对的轨迹条目（名称、参数摘要、状态、part 下标）
- [x] 3.2 测试：模式推导各分支、同名多 call 顺序配对、未完结 call 兜底

## 4. 视图：空状态

- [x] 4.1 新增 `src/view/EmptyState.tsx`：问候语（display 衬线字体）+ 副标题 + suggestions 列表（点击触发发送流程）
- [x] 4.2 ChatView 接入：store 为空渲染 EmptyState，有消息后隐藏；`greeting` / `suggestions` props
- [x] 4.3 测试：空会话渲染问候、点击建议触发 onSend、空 suggestions 不渲染建议区

## 5. 视图：活动轨迹组件

- [x] 5.1 新增 `src/view/ActivityTrace.tsx`：流式状态头（动画图标 + 呼吸文案 + 秒级计时，结束定格）+ 轨迹条目列表
- [x] 5.2 轨迹条目：单行可展开（名称 + 参数摘要 + 状态图标），展开显示参数与结果/错误
- [x] 5.3 折叠状态机：流式展开 → 答案阶段自动折叠 → 用户 pin（auto | pinned-open | pinned-closed，按消息记忆）
- [x] 5.4 PartRenderer 改造：tool-call/tool-result 移交 ActivityTrace 渲染；thinking 卡升级（markdown 正文、流式展开 + 进行中指示、答案阶段自动折叠 + pin）
- [x] 5.5 测试：配对渲染为单行、自动折叠时机、pin 后不再自动变更、thinking 升级行为

## 6. 视图：消息操作条

- [x] 6.1 新增 `src/view/MessageActions.tsx`：复制（沿用）+ 末条 completed assistant 重新生成 + user 消息编辑 + error 消息重试入口，hover 显现
- [x] 6.2 编辑重发：气泡内联编辑框（预填原文），确认 → removeMessagesFrom + 新文本 runChatTurn；取消不改 store
- [x] 6.3 重新生成/重试：接入 runRegenerateTurn（含 AbortController 管理）
- [x] 6.4 测试：复制反馈、重新生成移除旧回复且 user 数不变、编辑确认/取消、error 重试

## 7. Composer 重写

- [x] 7.1 IME 守卫：compositionstart/end + isComposing 兜底，合成中 Enter 不发送
- [x] 7.2 发送按钮状态机：disabled/ready/streaming 同元素切换，streaming 态带进行中光环（纯 CSS）
- [x] 7.3 附件：受控 `attachments` + `onAttachmentsChange`，图片缩略图/文档卡片渲染与移除；拖拽悬停态、粘贴与文件选择产出 File[] 经 `onAttachFiles` 回调；`onAttachmentClick` 通知
- [x] 7.4 扩展槽：`toolbarStart`/`toolbarEnd` 渲染槽；`@` 词边界触发 `onMentionTrigger(query, anchorRect)`；"+" 按钮触发 `onPlusMenu(anchorRect)`（无回调不渲染入口）
- [x] 7.5 测试：IME 守卫、按钮状态切换、附件卡片渲染/移除/粘贴回调、槽位渲染与触发

## 8. 视觉刷新（styles.css）

- [x] 8.1 令牌：新增圆角阶梯、`--pactor-chat-font-display`、mask 渐隐、细滚动条、quiet 图标按钮样式；保留旧令牌兼容
- [x] 8.2 动画：呼吸文案、发送按钮 streaming 光环、状态图标脉冲（纯 CSS keyframes）
- [x] 8.3 暗色主题 `[data-pactor-theme='dark']` 同步覆盖；视觉走查 light/dark

## 9. 示例与文档

- [x] 9.1 `examples/chat`：演示空状态 suggestions、活动轨迹、重新生成/编辑重发、附件（data-URL 伪上传）、工具栏槽位 chip——全部经导出接口注入数据，作为调用方参考实现
- [x] 9.2 `packages/chat/README.md` 与文档站 chat 章节：更新 API 一览与新 props，明确"数据由调用方经接口注入"的使用约定
- [x] 9.3 导出审计：确认 `src/index.ts` 导出所有新接口（组件 / 类型 / 纯函数 / hooks），包内无网络请求与框架专有 API
- [x] 9.4 全量验证：`pnpm -r test`、`pnpm -r build` 通过；`openspec validate enhance-chat-ui` 通过
