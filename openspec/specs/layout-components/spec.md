# Spec: layout-components

DSL 布局组件（`@pactor-app/ui` components 层）：`Layout` / `Header` / `Sider` / `Content`，页面可在 DSL 中自由组合布局结构。

### Requirement: Layout 容器

`Layout` SHALL 渲染为 flex 容器：存在 `type: 'Sider'` 的直接子节点时主轴为 horizontal，否则为 vertical；`direction` prop 显式提供时 MUST 覆盖推导结果。children 经 Renderer children 机制渲染 DSL 子树。

#### Scenario: 含 Sider 子节点时横向排列

- **WHEN** Layout 的 children 为 `[Sider, Content]`
- **THEN** Sider 与 Content 在水平方向并列

#### Scenario: 无 Sider 时纵向排列

- **WHEN** Layout 的 children 为 `[Header, Content]`
- **THEN** Header 在上、Content 在下纵向排列

#### Scenario: 显式 direction 覆盖推导

- **WHEN** Layout 声明 `props: { direction: 'vertical' }` 且含 Sider 子节点
- **THEN** 子节点纵向排列

### Requirement: Header / Content / Footer 语义容器

`Header` SHALL 渲染顶部区域容器（横向 flex、垂直居中、默认下边框）；`Content` SHALL 渲染主内容区容器（`flex: 1` 占据剩余空间）；`Footer` SHALL 渲染底部区域容器（默认居中、弱化的辅助文本样式）。三者 MUST NOT 内置导航、品牌或业务逻辑，内容完全由 children DSL 声明。

#### Scenario: Content 占据剩余空间

- **WHEN** Layout（vertical）含 Header 与 Content
- **THEN** Content 的 computed flex-grow 非 0，占据 Header 之外的剩余高度

#### Scenario: Footer 渲染在底部

- **WHEN** Layout（vertical）的 children 为 `[Header, Content, Footer]`
- **THEN** Footer 渲染于 Content 之后，位于布局底部

### Requirement: Sider 侧边区域

`Sider` SHALL 渲染侧边区域：prop `width`（默认 200）控制宽度；`collapsible: true` 时渲染折叠触发器；`collapsed` 为受控 prop（缺省 false），折叠时宽度为 `collapsedWidth`（默认 64）；折叠状态变化触发事件 `onCollapse`（传出 boolean）。

#### Scenario: 受控折叠闭环

- **WHEN** Sider 声明 `collapsed: ${state.siderCollapsed}` 且 `events.onCollapse` 回写该 state，用户点击折叠触发器
- **THEN** Sider 宽度切换为 collapsedWidth，state 同步更新

#### Scenario: 自定义宽度

- **WHEN** Sider 声明 `props: { width: 240 }`
- **THEN** 渲染结果宽度为 240px

### Requirement: Menu 导航菜单组件

`Menu` SHALL 渲染导航菜单：prop `items` 为 `{ key, label, icon?, children? }[]`（可含表达式，如 `${data.menus}`）；`mode` 为 `inline`（Sider 内，缺省）或 `horizontal`（Header 内）；`selectedKey` 为受控 prop；选中变化触发事件 `onSelect`（传出 key）。Menu MUST NOT 直接读取应用外壳层的 MenuRegistry——菜单数据经表达式注入。

#### Scenario: Sider 内 inline 菜单

- **WHEN** Sider children 含 `{ type: 'Menu', props: { mode: 'inline', items: ${data.menus}, selectedKey: ${state.currentMenu} } }`
- **THEN** 渲染纵向菜单树，selectedKey 对应项高亮

#### Scenario: 点选触发 onSelect

- **WHEN** 用户点击 key 为 `settings` 的菜单项，且 `events.onSelect` 配置了 navigate 动作
- **THEN** 事件参数 `event` 为 `'settings'`，动作按序执行

#### Scenario: Header 内 horizontal 菜单

- **WHEN** Header children 含 `mode: 'horizontal'` 的 Menu
- **THEN** 菜单项横向排列

### Requirement: 布局组件与普通组件同权

布局组件 SHALL 支持全部节点级能力与通用 props：`className` / `style` / `permission` / `when` / `events`，且 MUST 可被页面级 `components` 定义并经 `component` 引用节点复用。

#### Scenario: 通用 props 生效

- **WHEN** Sider 声明 `props: { className: 'x', style: { background: 'red' } }`
- **THEN** 渲染根节点包含 class `x` 且内联 background 为 red

#### Scenario: component 引用布局子树

- **WHEN** 顶层 `components.sideNav` 定义为 Sider 子树，body 中 `{ component: 'sideNav' }` 引用
- **THEN** 引用处渲染该 Sider 子树
