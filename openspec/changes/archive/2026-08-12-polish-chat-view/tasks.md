# Tasks: polish-chat-view

## 1. runChatTurn AbortSignal

- [x] 1.1 `packages/chat/src/transport.ts`：RunChatTurnOptions 增加 `signal`，abort 时 assistant 消息以 cancelled 收尾并正常返回；补单测

## 2. pactor-markdown 增强

- [x] 2.1 接入 remark-math + rehype-katex 与 react-syntax-highlighter（Light 构建注册常用语言），MarkdownRenderer 增加 `math` / `codeHighlight` props（默认 true）；安全约束不变；补测试（GFM 表格 / 高亮 / 公式 / script 与 javascript: 仍拒绝）

## 3. pactor-chat 视图重构

- [x] 3.1 `styles.css`：`--pactor-chat-*` 变量（light + `[data-pactor-theme='dark']`）+ 全部 `pactor-chat-*` class 样式；package.json 增 `./styles.css` export、移除 antd peer、新增 lucide-react
- [x] 3.2 hooks：`useSmoothStreamText`（rAF 打字机）+ `useChatAutoScroll`（贴底/80px 释放/回底恢复），各配单测
- [x] 3.3 PartRenderer：thinking/tool/error 改自绘折叠卡与警示条（lucide 图标）；markdown/text part 接 smooth stream
- [x] 3.4 MessageBubble：user 右气泡 / assistant 通栏 + hover 复制操作条
- [x] 3.5 Composer：自适应 textarea + 发送/停止按钮；ChatView 接入 isStreaming/AbortController/auto-scroll/回底按钮；ChatLayout 去内联色值
- [x] 3.6 重写视图测试（原 antd 断言作废），保持 45+ 测试全绿

## 4. example-chat 适配与验收

- [x] 4.1 example-chat 引入 `pactor-chat/styles.css` 与 katex css，移除不再需要的 antd 依赖（若 safe registry 仍用 antd 组件则保留）
- [x] 4.2 浏览器走查：天气/报表/导出/普通提问四链路 + 流式停止 + 回到底部 + 暗色皮肤截图评审

## 5. 收尾

- [x] 5.1 文档站 packages/chat 与 packages/markdown 页面同步；MEMORY.md 更新（去 antd 债务一条改为已解决）
- [x] 5.2 根 `pnpm build / test / typecheck` 全绿
