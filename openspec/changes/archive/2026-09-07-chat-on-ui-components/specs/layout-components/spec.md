# Delta: layout-components

## MODIFIED Requirements

### Requirement: Menu 导航菜单组件

`Menu` SHALL 渲染导航菜单：prop `items` 为 `{ key, label, icon?, badge?, dot?, group?, disabled?, children? }[]`（可含表达式，如 `${data.menus}`；`icon` 为图标名（Icon 白名单），渲染于 label 前；`badge` 为 label 后的角标（string | number）；`dot` 为 label 右侧的 danger 系状态圆点（与 badge 可共存）；`group` 为分组标题（相邻同组项只渲染一次）；`disabled` 项置灰不可选，点击 MUST NOT 触发 onSelect）；`mode` 为 `inline`（Sider 内，缺省）或 `horizontal`（Header 内）；`selectedKey` 为受控 prop；选中变化触发事件 `onSelect`（传出 key）。Menu MUST NOT 直接读取应用外壳层的 MenuRegistry——菜单数据经表达式注入。

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
