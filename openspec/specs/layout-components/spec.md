# Spec: layout-components

## Purpose

DSL 布局组件（`@pactor-app/ui` components 层）：`Layout` / `Header` / `Sider` / `Content`，页面可在 DSL 中自由组合布局结构。
## Requirements
### Requirement: Layout 容器

`Layout` SHALL 渲染为 flex 容器：存在 `type: 'Sider'` 的直接子节点时主轴为 horizontal，否则为 vertical；`direction` prop 显式提供时 MUST 覆盖推导结果。children 经 Renderer children 机制渲染 DSL 子树。方向推导 MUST 跳过动态引用元素（DslSourceRef 无法静态判定是否为 Sider，混排数组中仅按内联元素推导；需要横向时显式声明 `direction`）。

#### Scenario: 含 Sider 子节点时横向排列

- **WHEN** Layout 的 children 为 `[Sider, Content]`
- **THEN** Sider 与 Content 在水平方向并列

#### Scenario: 无 Sider 时纵向排列

- **WHEN** Layout 的 children 为 `[Header, Content]`
- **THEN** Header 在上、Content 在下纵向排列

#### Scenario: 显式 direction 覆盖推导

- **WHEN** Layout 声明 `props: { direction: 'vertical' }` 且含 Sider 子节点
- **THEN** 子节点纵向排列

#### Scenario: 引用元素不参与方向推导

- **WHEN** Layout 的 children 为 `[{ source: {...} }, Content]`（引用内容实为 Sider）
- **THEN** 推导结果为 vertical（引用元素跳过）

### Requirement: Header / Content / Footer 语义容器

`Header` SHALL 渲染顶部区域容器（横向 flex、垂直居中、默认下边框）；除 children 外，Header 可携带可选结构区域（品牌区、通用下拉、横向菜单、深浅色切换、用户区、国际化切换，见各结构区域 requirement），全部区域 props 缺省时退化为纯容器。`Content` SHALL 渲染主内容区容器（`flex: 1` 占据剩余空间）；`Footer` SHALL 渲染底部区域容器（默认居中、弱化的辅助文本样式）。`Content` 与 `Footer` MUST NOT 内置导航、品牌或业务逻辑，内容完全由 children DSL 声明；`Header` 的内置逻辑 MUST 仅限上述六个可选结构区域。

#### Scenario: Content 占据剩余空间

- **WHEN** Layout（vertical）含 Header 与 Content
- **THEN** Content 的 computed flex-grow 非 0，占据 Header 之外的剩余高度

#### Scenario: Footer 渲染在底部

- **WHEN** Layout（vertical）的 children 为 `[Header, Content, Footer]`
- **THEN** Footer 渲染于 Content 之后，位于布局底部

#### Scenario: 缺省退化为纯容器

- **WHEN** Header 未声明任何结构区域 props
- **THEN** 渲染为仅含 children 的顶部容器，与本变更前行为一致

### Requirement: Header 品牌区

`Header` SHALL 支持品牌区 props：`logo`（图片地址字符串，可含表达式）、`title`（文本）、`brandPosition: 'left' | 'right'`（缺省 `'left'`）。`logo` 与 `title` MUST 可单独或同时声明（二选一或并存均合法）；同时声明时 logo 在前、标题在后。品牌区按 `brandPosition` 渲染于头部左侧或右侧。

#### Scenario: 仅标题

- **WHEN** DSL 为 `{ type: 'Header', props: { title: '控制台' } }`
- **THEN** 头部左侧渲染标题文本"控制台"，无 logo 图片

#### Scenario: logo + 标题靠右

- **WHEN** DSL 为 `{ type: 'Header', props: { logo: '/logo.svg', title: '控制台', brandPosition: 'right' } }`
- **THEN** 品牌区渲染于头部右侧，且 logo 在标题之前

### Requirement: Header 通用下拉

`Header` SHALL 支持 `dropdown` prop：`{ label, items: Array<{ label, value, disabled? }>, position?: 'left' | 'right' }`（position 缺省 `'left'`）。渲染为下拉触发器（label + 展开指示），选中某项触发事件 `onDropdownSelect`，事件载荷为该项 `value`。

#### Scenario: 下拉靠左渲染并选中

- **WHEN** DSL 为 `{ type: 'Header', props: { dropdown: { label: '切换团队', items: [{ label: '团队A', value: 'a' }] } } }` 且用户选中"团队A"
- **THEN** 下拉渲染于头部左侧，`onDropdownSelect` 动作执行时 `${event}` 为 `'a'`

#### Scenario: 下拉靠右渲染

- **WHEN** dropdown 声明 `position: 'right'`
- **THEN** 下拉渲染于头部右侧区域

### Requirement: Header 横向菜单

`Header` SHALL 支持 `menu` prop：`Array<{ key, label, icon?, children? }>`（可含表达式），语义复用 horizontal Menu（含子菜单）；渲染于头部左侧区域（品牌区之后）。选中触发事件 `onMenuSelect`，事件载荷为选中项 `key`。Header MUST NOT 读取 MenuRegistry——菜单数据仅来自 `menu` prop。

#### Scenario: 菜单渲染与选中

- **WHEN** DSL 为 `{ type: 'Header', props: { menu: [{ key: 'home', label: '首页' }, { key: 'list', label: '列表' }] } }` 且用户点击"列表"
- **THEN** 菜单项横向排列，`onMenuSelect` 动作执行时 `${event}` 为 `'list'`

### Requirement: Header 用户区

`Header` SHALL 支持 `user` prop：`{ name, avatar?, items?: Array<{ label, value }> }`。渲染于头部右侧区域：头像（`avatar` 缺省时以用户名首字符占位）+ 用户名；`items` 非空时下拉菜单可用，选中触发事件 `onUserSelect`（载荷为 `value`）；`items` 缺省或为空数组时 MUST 退化为纯展示（无下拉行为）。

#### Scenario: 用户菜单选中

- **WHEN** user 为 `{ name: '张三', items: [{ label: '退出登录', value: 'logout' }] }` 且用户选中"退出登录"
- **THEN** `onUserSelect` 动作执行时 `${event}` 为 `'logout'`

#### Scenario: 无菜单纯展示

- **WHEN** user 为 `{ name: '张三' }`（无 items）
- **THEN** 渲染头像占位与用户名"张三"，无可点击下拉

### Requirement: Header 国际化切换

`Header` SHALL 支持 `locales` prop：`Array<{ label, value }>`。渲染于头部右侧区域的下拉切换器，触发器显示当前 locale（取自 i18n 上下文）对应的 label；选中触发事件 `onLocaleChange`，事件载荷为选中的 locale 值。切换后的生效率 MUST 由应用层经 DSL 事件接线（如 setState 回写驱动 i18n Provider 的 locale），Header 自身 MUST NOT 直接改写全局 locale。

#### Scenario: 切换语言

- **WHEN** DSL 为 `{ type: 'Header', props: { locales: [{ label: '中文', value: 'zh-CN' }, { label: 'English', value: 'en-US' }] } }` 且当前 locale 为 zh-CN、用户选中 "English"
- **THEN** 触发器显示"中文"，`onLocaleChange` 动作执行时 `${event}` 为 `'en-US'`

### Requirement: Header 深浅色切换

`Header` SHALL 支持 `themeToggle: boolean` prop（缺省 false）：为 true 时在头部右侧区域（国际化切换之前）渲染深浅色切换按钮。点击时按 `document.documentElement` 当前 `data-pactor-theme` 翻转（dark ↔ 移除属性），图标随状态切换（dark 显示 sun，light 显示 moon）；切换触发事件 `onThemeChange`，事件载荷为切换后的主题（`'light' | 'dark'`）。

#### Scenario: 切换主题

- **WHEN** DSL 为 `{ type: 'Header', props: { themeToggle: true } }` 且用户点击切换按钮
- **THEN** `document.documentElement` 的 `data-pactor-theme` 在 `'dark'` 与移除之间翻转，`onThemeChange` 动作执行时 `${event}` 为切换后的主题

#### Scenario: 缺省不渲染

- **WHEN** Header 未声明 `themeToggle`
- **THEN** 不渲染切换按钮；其余区域 props 也缺省时仍退化为纯容器

### Requirement: Header 区域排布与 children 共存

Header 的结构区域 SHALL 按固定规则排布：左侧区域 = 品牌区（`brandPosition: 'left'` 时）→ 通用下拉（`position: 'left'` 时）→ 横向菜单；右侧区域 = 通用下拉（`'right'` 时）→ 品牌区（`'right'` 时）→ 深浅色切换 → 国际化切换 → 用户区；左右区域之间以弹性空间分隔。children MUST 继续渲染，置于左右区域之间的弹性区。全部区域 props 与 children 可任意组合，均可选。

#### Scenario: 全区域组合排布

- **WHEN** Header 同时声明 logo+title（left）、menu、dropdown（right）、locales、user 与 children
- **THEN** 左侧依次为品牌区、菜单，右侧依次为下拉、国际化切换、用户区，children 渲染于中间弹性区

#### Scenario: 与 children 共存

- **WHEN** Header 声明 `title` 且 children 含一个 Button
- **THEN** 品牌区与 Button 均渲染

### Requirement: Sider 侧边区域

`Sider` SHALL 渲染侧边区域：prop `width`（默认 200）控制宽度；`collapsible: true` 时渲染折叠触发器；`collapsed` 为受控 prop（缺省 false），折叠时宽度为 `collapsedWidth`（默认 64）；折叠状态变化触发事件 `onCollapse`（传出 boolean）。

#### Scenario: 受控折叠闭环

- **WHEN** Sider 声明 `collapsed: ${state.siderCollapsed}` 且 `events.onCollapse` 回写该 state，用户点击折叠触发器
- **THEN** Sider 宽度切换为 collapsedWidth，state 同步更新

#### Scenario: 自定义宽度

- **WHEN** Sider 声明 `props: { width: 240 }`
- **THEN** 渲染结果宽度为 240px

### Requirement: Menu 导航菜单组件

`Menu` SHALL 渲染导航菜单：prop `items` 为 `{ key, label, icon?, badge?, dot?, group?, disabled?, children? }[]`（可含表达式，如 `${data.menus}`；`icon` 为图标名（Icon 白名单），渲染于 label 前；`badge` 为 label 后的角标（string | number）；`dot` 为 label 右侧的 danger 系状态圆点（与 badge 可共存）；`group` 为分组标题（相邻同组项只渲染一次）；`disabled` 项置灰不可选，点击 MUST NOT 触发 onSelect）；`mode` 为 `inline`（Sider 内，缺省）或 `horizontal`（Header 内）；`selectedKey` 为受控 prop；选中变化触发事件 `onSelect`（传出 key）。Menu MUST NOT 直接读取应用外壳层的 MenuRegistry——菜单数据经表达式注入。

`collapsible`（缺省 `false`）为 `true` 且 `mode: 'inline'` 时，含 `children` 的目录项 SHALL 可折叠：点击目录项展开/收起其子菜单且 MUST NOT 触发 `onSelect`，目录项右端 SHALL 渲染 chevron 指示（展开时旋转）。折叠状态由组件内部维护，初始展开 `defaultExpandedKeys`（`string[]`，可选）与含 `selectedKey` 的祖先目录链，其余目录折叠。`collapsible: false`（缺省）时行为与现状一致（子菜单静态展开、目录项点击触发 `onSelect`)。horizontal 模式不受 `collapsible` 影响。

icon rail（侧栏折叠降级）下，含 `children` 的目录项 MUST 以右侧滑出浮层（flyout）展示子菜单：hover 短暂延迟打开、移出延迟关闭、点击目录按钮也可切换；浮层内子菜单以完整形态渲染（label / icon / badge / dot，选中态高亮），点选叶子项触发 `onSelect` 且浮层关闭。子菜单项 MUST NOT 以仅图标形式平铺在 rail 内。无 children 的项维持 RailTooltip 行为。

#### Scenario: Sider 内 inline 菜单

- **WHEN** Sider children 含 `{ type: 'Menu', props: { mode: 'inline', items: ${data.menus}, selectedKey: ${state.currentMenu} } }`
- **THEN** 渲染纵向菜单树，selectedKey 对应项高亮

#### Scenario: 点选触发 onSelect

- **WHEN** 用户点击 key 为 `settings` 的菜单项，且 `events.onSelect` 配置了 navigate 动作
- **THEN** 事件参数 `event` 为 `'settings'`，动作按序执行

#### Scenario: Header 内 horizontal 菜单

- **WHEN** Header children 含 `mode: 'horizontal'` 的 Menu
- **THEN** 菜单项横向排列

#### Scenario: 菜单项图标

- **WHEN** 菜单项声明 `icon: 'settings'`
- **THEN** 该项文字前渲染图标 svg

#### Scenario: 展示扩展字段

- **WHEN** 菜单项声明 `badge: 3`、`dot: true`、`group: '最近'` 或 `disabled: true`
- **THEN** badge 项渲染角标、dot 项渲染状态圆点、同组相邻项共享一次分组标题、disabled 项置灰且点击不触发 onSelect

#### Scenario: 目录项点击展开/收起

- **WHEN** `collapsible: true` 且存在含 children 的目录项（初始折叠），用户点击该目录项
- **THEN** 子菜单展开、chevron 旋转，且不触发 `onSelect`；再次点击子菜单收起

#### Scenario: 选中项祖先链自动展开

- **WHEN** `collapsible: true` 且 `selectedKey` 为某子菜单的叶子 key
- **THEN** 该叶子所在的祖先目录初始即为展开态，其余目录折叠

#### Scenario: defaultExpandedKeys

- **WHEN** `collapsible: true` 且声明 `defaultExpandedKeys: ['system']`
- **THEN** key 为 `system` 的目录初始展开（无论 selectedKey 是否在其中）

#### Scenario: 缺省保持现状

- **WHEN** 未声明 `collapsible`（或 `false`）且菜单项含 children
- **THEN** 子菜单静态展开渲染，目录项点击照常触发 `onSelect`

#### Scenario: icon rail 下子菜单经右侧滑出浮层展示

- **WHEN** Menu 处于 icon rail（侧栏折叠）且存在含 children 的目录项，用户 hover 该目录图标
- **THEN** 子菜单以右侧滑出浮层展示（菜单项含 label / icon / badge 完整形态），rail 内不平铺子菜单图标

#### Scenario: 浮层内点选叶子项

- **WHEN** icon rail 的 flyout 已打开且用户点击其中叶子项 `list`
- **THEN** `onSelect` 动作执行时 `${event}` 为 `'list'`，且浮层关闭

### Requirement: 布局组件与普通组件同权

布局组件 SHALL 支持全部节点级能力与通用 props：`className` / `style` / `permission` / `when` / `events`，且 MUST 可被页面级 `components` 定义并经 `component` 引用节点复用。

#### Scenario: 通用 props 生效

- **WHEN** Sider 声明 `props: { className: 'x', style: { background: 'red' } }`
- **THEN** 渲染根节点包含 class `x` 且内联 background 为 red

#### Scenario: component 引用布局子树

- **WHEN** 顶层 `components.sideNav` 定义为 Sider 子树，body 中 `{ component: 'sideNav' }` 引用
- **THEN** 引用处渲染该 Sider 子树

