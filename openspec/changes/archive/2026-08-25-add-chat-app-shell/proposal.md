# Proposal: add-chat-app-shell

## Why

`pactor-chat` 目前只有 `ChatLayout`（header + ChatView 区），没有应用外壳。参照界面的 `AppShell`（侧栏 + 主区、移动端抽屉）是聊天工作区的标准承载结构；示例与真实调用方都需要它。按接口边界原则，AppShell 作为纯布局组件定义在 `packages/chat` 中，侧栏等内容全部由调用方以 ReactNode 注入。

## What Changes

- **新增 `<AppShell>` 组件**（`packages/chat`）：`sidebar: ReactNode` + `children` 插槽；桌面（≥768px）侧栏与主区 flex 同行；移动端（<768px）侧栏退出文档流变为抽屉（遮罩 + 顶部紧凑栏含菜单按钮），断点由纯 CSS 媒体查询表达，JS 只管抽屉开合状态。
- **`useSidebarDrawer()` hook + context**：侧栏内容（如导航项）可在导航后调用 `close()` 关闭抽屉；不在 AppShell 内时返回 null（安全 no-op）。
- **`locationKey?` prop**：路由/会话切换时调用方传入变化的 key，AppShell 在渲染期比较并自动关闭抽屉（框架无关，替代参考实现里的 usePathname 耦合）。
- **`brand?` prop**：移动端顶栏的品牌区内容（替代参考实现里 Next.js Image/Link 耦合）。
- 无障碍：抽屉打开时 Escape 关闭；移动端抽屉关闭时容器 `inert`（焦点不进入不可见侧栏）；菜单按钮带 aria-label / aria-expanded。
- **examples/chat 接入**：用 AppShell 承载整个示例，侧栏为 mock 会话列表（新建对话 + 历史会话项，点击经 `useSidebarDrawer` 关闭抽屉）。

明确**不在本次范围**：真实路由集成、会话持久化、侧栏内容本身（会话列表组件属调用方实现，示例只给 mock 参考）。

## Capabilities

### New Capabilities
- `chat-app-shell`: 应用外壳布局——侧栏插槽、响应式抽屉、drawer context、移动端顶栏。

### Modified Capabilities
（无）

## Impact

- **代码**：`packages/chat/src/view/AppShell.tsx`（新增）、`styles.css`（新增 shell 区块）、`src/index.ts`（导出 AppShell / AppShellProps / useSidebarDrawer）、`packages/chat/tests/`、`examples/chat`（App 外壳改为 AppShell + mock 侧栏）。
- **API**：纯增量，无 BREAKING。
- **依赖**：无新增运行时依赖（lucide-react 已是依赖，用于菜单图标）；不引入路由或框架 API。
