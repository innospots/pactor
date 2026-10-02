# chat-conversation-icon-rail 实施任务

## 1. Header 缺省图标移除

- [x] 1.1 ChatPage（packages/ui/src/components/chat/ChatPage/index.tsx）header 右侧：未配置 `conversationHeaderAction` 时渲染为空，删除缺省产物开关按钮分支
- [x] 1.2 更新受影响的既有测试（依赖 header 缺省开关的用例改走图标栏产物项）

## 2. 对话图标栏（conversation rail）

- [x] 2.1 新增 `ConversationRailItem` 类型与 props：`conversationRailItems` / `hideArtifactRailItem` / `activeConversationRailKey` / `onConversationRailChange`
- [x] 2.2 主区域布局改为 header + 横向 flex（conversation body + rail 列），rail 宽令牌 `--pactor-chat-rail-width`（缺省 40px），图标自上而下 + tooltip
- [x] 2.3 显隐逻辑：conversationRailItems 为空且 hideArtifactRailItem 时不渲染图标栏
- [x] 2.4 active 状态机：非受控 activeRailKey（toggle / 切换 / 收起），受控 prop + change 事件闭环

## 3. 产物入口迁移

- [x] 3.1 图标栏首位内置 artifact 项（图标随 open 态切换 panel-right-open/close），点击接既有 open/setOpen 与受控 artifactOpen 闭环
- [x] 3.2 `hideArtifactRailItem: true` 时不渲染该项；产物面板（预览 / 目录树 / 下载 / Resizable）行为回归验证

## 4. panel 形态

- [x] 4.1 `display: 'panel'` 激活项的 content 渲染进右侧分栏位（复用 PanelGroup 第二栏结构）
- [x] 4.2 panel 项与产物区互斥：激活 panel 项关闭产物区（受控宿主经 onArtifactOpenChange(false) 闭环），反之亦然

## 5. popover 形态

- [x] 5.1 `display: 'popover'`（缺省）激活项 content 渲染为绝对定位浮层（rail 左侧、header 下缘之下），宽令牌 `--pactor-chat-rail-popover-width`（缺省 320px）+ max-width 约束，不占布局空间
- [x] 5.2 关闭交互：Esc / 点击外部 / 再次点击图标

## 6. 内容槽位与边界

- [x] 6.1 content 复用 renderSlot 路径（React 元素直接渲染，DslNode 经 renderChildren）
- [x] 6.2 无 content 项：激活仅触发 change 事件，不渲染空 panel / popover
- [x] 6.3 新增令牌（--pactor-chat-rail-width / --pactor-chat-rail-popover-width）登记进 ui styles.css 与皮肤令牌契约测试

## 7. 测试与回归

- [x] 7.1 新增测试：header 无缺省图标 / 配置 headerAction 生效；rail 显隐；产物项 toggle（受控/非受控）；activeRailKey toggle 与切换；panel 互斥；popover 定位与 Esc/外点关闭；DSL content 渲染；无 content 项
- [x] 7.2 `pnpm --filter @pactor-app/ui test` 全绿 + typecheck + build
- [x] 7.3 examples/chat（或 vite-starter）浏览器实测：图标栏交互、产物面板回归、深浅色
