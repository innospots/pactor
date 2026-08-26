# Spec: chat-app-shell

应用外壳布局（`pactor-chat`）：侧栏插槽、响应式抽屉、drawer context、移动端顶栏。

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

### Requirement: 组件自持布局（嵌入契约）

`pactor-chat` 的外壳与工作区样式 SHALL 自持完整结构布局：调用方仅 `import 'pactor-chat/styles.css'`（无需任何调用端覆盖）即得到正确布局。高度语义 SHALL 为"填满父容器"（`height: 100%`，父级无定高时退化为内容高度），MUST NOT 硬编码视口高度（100vh/100dvh）；standalone 顶层挂载时宿主容器定高属宿主职责。shell content 区 SHALL 缺省为 flex 列布局并含内边距；其中对话工作区 SHALL 缺省限宽居中，列宽经 CSS 变量 `--pactor-chat-content-width` 可调（缺省 768px，置 `none` 关闭限宽）。

#### Scenario: 无定高嵌入

- **WHEN** 组件嵌入定高 flex 容器（如顶栏之下的剩余区域）且只导入包内样式
- **THEN** 外壳填满容器剩余高度，不溢出、不塌缩

#### Scenario: 对话列缺省居中

- **WHEN** shell content 区渲染对话工作区且无调用端 CSS
- **THEN** 对话列以 --pactor-chat-content-width 限宽并在 content 区内水平居中
