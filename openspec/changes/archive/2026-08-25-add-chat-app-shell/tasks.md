# Tasks: add-chat-app-shell

## 1. AppShell 组件

- [x] 1.1 `packages/chat/src/view/AppShell.tsx`：`<AppShell sidebar children brand? locationKey?>` + SidebarDrawerContext + `useSidebarDrawer()`；CSS 媒体查询断点（767px）；JS 只管 drawerOpen；Escape/遮罩/locationKey 关闭；inert；aria 标注
- [x] 1.2 `styles.css` 新增 shell 区块（`.pactor-chat-shell*`：flex 壳、侧栏抽屉过渡、遮罩、移动端顶栏），令牌化 + 暗色覆盖
- [x] 1.3 测试（TDD）：桌面/移动结构、菜单开合、Escape/遮罩/locationKey 关闭、inert、useSidebarDrawer 壳内/壳外
- [x] 1.4 `src/index.ts` 导出 `AppShell` / `AppShellProps` / `useSidebarDrawer`

## 2. 示例接入

- [x] 2.1 `examples/chat`：App 以 AppShell 承载，侧栏为 mock 会话列表（新建对话 + 历史会话项，active 高亮，点击经 useSidebarDrawer 关抽屉），brand 注入移动端顶栏，locationKey 传当前会话 id
- [x] 2.2 验证：packages/chat 测试与 typecheck 全绿；example-chat build 通过；playwright 双视口（桌面/移动抽屉）截图确认
- [x] 2.3 文档：packages/chat/README.md、docs 站 chat 章节、examples/chat/README.md 补 AppShell 说明；`openspec validate add-chat-app-shell` 通过
