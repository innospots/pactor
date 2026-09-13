## MODIFIED Requirements

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
