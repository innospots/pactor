# Spec Delta: layout-components

## MODIFIED Requirements

### Requirement: Header / Content / Footer 语义容器

`Header` SHALL 渲染顶部区域容器（横向 flex、垂直居中、默认下边框）；除 children 外，Header 可携带可选结构区域（品牌区、通用下拉、横向菜单、用户区、国际化切换，见"Header 结构区域" requirement），全部区域 props 缺省时退化为纯容器。`Content` SHALL 渲染主内容区容器（`flex: 1` 占据剩余空间）；`Footer` SHALL 渲染底部区域容器（默认居中、弱化的辅助文本样式）。`Content` 与 `Footer` MUST NOT 内置导航、品牌或业务逻辑，内容完全由 children DSL 声明；`Header` 的内置逻辑 MUST 仅限上述五个可选结构区域。

#### Scenario: Content 占据剩余空间

- **WHEN** Layout（vertical）含 Header 与 Content
- **THEN** Content 的 computed flex-grow 非 0，占据 Header 之外的剩余高度

#### Scenario: Footer 渲染在底部

- **WHEN** Layout（vertical）的 children 为 `[Header, Content, Footer]`
- **THEN** Footer 渲染于 Content 之后，位于布局底部

#### Scenario: 缺省退化为纯容器

- **WHEN** Header 未声明任何结构区域 props
- **THEN** 渲染为仅含 children 的顶部容器，与本变更前行为一致

## ADDED Requirements

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

### Requirement: Header 区域排布与 children 共存

Header 的结构区域 SHALL 按固定规则排布：左侧区域 = 品牌区（`brandPosition: 'left'` 时）→ 通用下拉（`position: 'left'` 时）→ 横向菜单；右侧区域 = 通用下拉（`'right'` 时）→ 品牌区（`'right'` 时）→ 国际化切换 → 用户区；左右区域之间以弹性空间分隔。children MUST 继续渲染，置于左右区域之间的弹性区。全部区域 props 与 children 可任意组合，均可选。

#### Scenario: 全区域组合排布

- **WHEN** Header 同时声明 logo+title（left）、menu、dropdown（right）、locales、user 与 children
- **THEN** 左侧依次为品牌区、菜单，右侧依次为下拉、国际化切换、用户区，children 渲染于中间弹性区

#### Scenario: 与 children 共存

- **WHEN** Header 声明 `title` 且 children 含一个 Button
- **THEN** 品牌区与 Button 均渲染
