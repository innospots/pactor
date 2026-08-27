# Spec Delta: chat-app-shell

## ADDED Requirements

### Requirement: 桌面侧栏头部与折叠

AppShell SHALL 支持桌面端侧栏头部（设计决策 D3）：提供 `brand` 时，桌面视口在侧栏顶部渲染品牌行（brand 左对齐）；`collapsible?: boolean`（缺省 false）为 true 时品牌行右端渲染折叠按钮（aria-label 与 aria-expanded 标注）。点击折叠按钮切换内部非受控 `collapsed` 状态：折叠后桌面侧栏变为图标栏（icon rail，约 64px——菜单仅显图标，label / badge / 分组标题 / 底部区 / 品牌文案隐藏，图标以 title 属性兜底可访问名）；再次点击恢复。折叠状态 MUST NOT 影响移动端抽屉语义（移动端无折叠按钮，抽屉行为不变）。

#### Scenario: 折叠为图标栏

- **WHEN** 桌面视口、collapsible 为 true，点击折叠按钮
- **THEN** 侧栏收窄为图标栏，菜单项仅渲染图标，折叠按钮 aria-expanded 更新

#### Scenario: 缺省无折叠

- **WHEN** 未配置 collapsible
- **THEN** 不渲染折叠按钮，侧栏恒为完整宽度

#### Scenario: 移动端不受影响

- **WHEN** 移动视口且 collapsible 为 true
- **THEN** 不渲染折叠按钮，抽屉开合行为与既有语义一致

### Requirement: 侧栏底部槽

AppShell SHALL 支持 `sidebarFooter?: ReactNode`：渲染在侧栏滚动区之后的固定底部区（不随菜单滚动）。未提供时 MUST NOT 渲染底部区容器（零渲染承诺）。

#### Scenario: 底部卡片

- **WHEN** 传入 sidebarFooter 内容（如设备卡 / 用户卡）
- **THEN** 内容固定在侧栏底部渲染，菜单区独立滚动
