# Spec: chat-app-shell

## ADDED Requirements

### Requirement: 应用外壳布局

`pactor-chat` SHALL 导出 `<AppShell sidebar children brand? locationKey?>`：桌面视口（≥768px）侧栏与主区在 flex 行内同级排列；移动视口（<768px）侧栏退出文档流，变为左侧覆盖抽屉（带半透明遮罩），主区顶部渲染紧凑顶栏（菜单按钮 + `brand` 插槽）。桌面/移动布局切换 MUST 由 CSS 媒体查询表达（不依赖 JS 测量）；JS 仅维护抽屉开合状态。侧栏与 brand 内容 MUST 由调用方以 ReactNode 注入，组件 MUST NOT 内建导航项、logo 或路由逻辑。

#### Scenario: 桌面布局

- **WHEN** 视口宽度 ≥768px 渲染 AppShell
- **THEN** 侧栏与主内容同级排列，无遮罩与抽屉行为

#### Scenario: 移动端抽屉

- **WHEN** 移动视口下点击顶栏菜单按钮
- **THEN** 抽屉滑出并显示遮罩，再次关闭后遮罩消失

### Requirement: 抽屉关闭语义

抽屉打开时：按 Escape SHALL 关闭；点击遮罩 SHALL 关闭。`locationKey` prop 变化时 SHALL 在渲染期关闭抽屉。移动端抽屉关闭时其容器 SHALL 带 `inert`（焦点不可进入不可见侧栏）。菜单按钮 SHALL 带 aria-label 与 aria-expanded。

#### Scenario: Escape 与遮罩关闭

- **WHEN** 抽屉打开时按 Escape 或点击遮罩
- **THEN** 抽屉关闭

#### Scenario: locationKey 变化关闭

- **WHEN** 抽屉打开且 locationKey 变化
- **THEN** 抽屉在新一轮渲染中关闭

#### Scenario: 关闭时 inert

- **WHEN** 移动端抽屉处于关闭状态
- **THEN** 侧栏容器带 inert 属性

### Requirement: useSidebarDrawer

SHALL 导出 `useSidebarDrawer()` hook：在 AppShell 内返回 `{ close: () => void }`（供侧栏导航后关闭抽屉）；在 AppShell 外 SHALL 返回 `null`（调用方以可选链安全调用，不抛错）。

#### Scenario: 壳内关闭抽屉

- **WHEN** 侧栏内组件取得 useSidebarDrawer() 并调用 close()
- **THEN** 抽屉关闭

#### Scenario: 壳外安全返回 null

- **WHEN** 在 AppShell 外调用 useSidebarDrawer()
- **THEN** 返回 null，不抛错
