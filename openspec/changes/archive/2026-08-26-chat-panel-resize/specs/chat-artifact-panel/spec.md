# Delta: chat-artifact-panel

## MODIFIED Requirements

### Requirement: 面板布局与响应式

提供面板时（打开态）SHALL 在工作区右侧以固定宽栏渲染（宽度经 CSS 变量 `--pactor-chat-inspector-width` 可调，缺省约 320px）；桌面缺省布局 SHALL 为：host 占满可用宽度、面板贴视口（容器）右缘无留白、对话列在剩余空间内限宽居中（`--pactor-chat-content-width`）；窄屏（<768px，与 AppShell 断点一致）SHALL 退化为右侧覆盖抽屉（遮罩点击关闭）。面板关闭/未配置时 MUST NOT 渲染面板 DOM。

桌面形态下 SHALL 提供面板左缘拖拽手柄（`role="separator"` + `aria-orientation="vertical"` + aria-label）：pointer 拖拽实时改变面板宽度，宽度夹取在 [240px, 容器宽 70%] 区间；拖拽期间 MUST 禁用页面文本选择；拖拽结果为组件内部状态（inline 宽度覆盖令牌缺省），MUST NOT 要求受控 props；窄屏覆盖抽屉形态 MUST NOT 显示手柄。

#### Scenario: 桌面并排

- **WHEN** 桌面视口打开面板
- **THEN** 面板贴容器右缘，对话列在剩余空间内居中

#### Scenario: 拖拽调宽

- **WHEN** 桌面视口拖拽面板左缘手柄向左 100px
- **THEN** 面板宽度增加约 100px 且不超过容器宽 70%

#### Scenario: 拖拽夹取下限

- **WHEN** 向右拖拽手柄超过 240px 下限
- **THEN** 面板宽度保持 240px

#### Scenario: 窄屏覆盖

- **WHEN** 窄屏视口打开面板并点击遮罩
- **THEN** 面板关闭

#### Scenario: 窄屏无拖拽手柄

- **WHEN** 窄屏视口打开面板
- **THEN** 拖拽手柄不显示（CSS 媒体查询）

#### Scenario: 缺省不渲染

- **WHEN** 未配置 artifact 且面板未打开
- **THEN** DOM 中不存在面板节点
