# Design: add-chat-app-shell

## Context

参照界面的 AppShell 与其技术栈耦合（next/image、next/link、usePathname、react-i18next、useDevice、Tailwind）。pactor-chat 版本必须框架无关：纯 React + DOM，样式走 `--pactor-chat-*` 令牌，数据/内容全部经 props 注入（D0 接口边界）。响应式断点沿用参考实现的关键决策：**布局切换由 CSS 媒体查询表达**（首帧即正确），JS 只拥有抽屉开合这一状态。

## Goals / Non-Goals

**Goals:**
- `<AppShell sidebar brand? locationKey?>`：桌面 flex 同行 / 移动端覆盖抽屉 + 遮罩 + 顶栏菜单按钮。
- `useSidebarDrawer()`：侧栏导航后可关闭抽屉；壳外返回 null。
- 无障碍：Escape 关闭、关闭时 inert、aria 标注。
- examples/chat 用 AppShell + mock 会话侧栏承载整个演示。

**Non-Goals:**
- 路由库集成（locationKey 由调用方给）。
- 侧栏内容组件（会话列表等由调用方实现）。
- 侧栏宽度拖拽、折叠记忆等增强。

## Decisions

### D1: CSS 表达断点，JS 只管抽屉开合
桌面/移动布局差异全部写在 styles.css 媒体查询（767px 界）中，不使用 JS 测量或 resize 监听——SSR/首帧正确且无闪烁。JS 状态只有 `drawerOpen`。

### D2: 路由解耦用 locationKey
参考实现用 usePathname 在路由变化时关抽屉。pactor 版接受 `locationKey?: string`，渲染期比较（setState-during-render 模式），变化即关抽屉。调用方传路由 path 或会话 id 均可。

### D3: 顶栏品牌区为插槽
移动端顶栏除菜单按钮外的内容经 `brand?: ReactNode` 注入，不内建 logo/链接。

### D4: inert 用 React 19 原生支持
`inert` 作为布尔 attribute 直接挂在抽屉容器上（React 19 支持），移动端关闭时焦点不可进入侧栏。peer 要求 react >= 18——inert 在 React 18 下不被识别为布尔，会退化为字符串属性仍生效（inert 是 presence-based 属性），无兼容风险。

## Risks / Trade-offs

- [jsdom 无法验证媒体查询分支] → 测试覆盖 JS 状态（开合/Escape/locationKey/inert 属性），视觉断点由 playwright 双视口截图验证。
- [与既有 ChatLayout 职责重叠] → AppShell 是更外层壳（侧栏 + 主区），ChatLayout 仍在主区内使用，两者组合而非替代。
