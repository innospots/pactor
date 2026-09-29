---
title: 导航组件
description: 导航类 DSL 组件——Menu / Link / Breadcrumb / Pagination / Tabs / Menubar / NavigationMenu / DropdownMenu / ContextMenu 的 props 契约与 DSL 示例
---

导航与菜单组件：页内导航（Menu / Tabs / Breadcrumb / Pagination）、链接（Link）与菜单族（Menubar / NavigationMenu / DropdownMenu / ContextMenu）。

### Menu

导航菜单（哑渲染：items 经表达式注入，不读外壳层 MenuRegistry）。在 Sidebar 内且侧栏折叠（icon rail）时自动降级为仅图标（label / badge / dot / 分组隐藏），hover 图标显示 Tooltip 提示；含 `children` 的目录项则以 hover 右侧滑出浮层（flyout）展示子菜单（完整形态：label / icon / badge / dot / 选中态，点选叶子触发 `onSelect` 并关闭浮层，点击目录按钮也可切换），不在 rail 内平铺子菜单图标。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `items` | `{ key, label, icon?, badge?, dot?, group?, disabled?, children? }[]` | 菜单树（如 `${data.menus}`；`icon` 为图标名（Icon 白名单，kebab/Pascal 均可），渲染于文字前；`badge` 为角标、`dot` 为 danger 系状态圆点、`group` 为分组标题（相邻同组只渲染一次）、`disabled` 置灰不可选） |
| `mode` | `inline`（默认）\| `horizontal` | inline 用于 Sider，horizontal 用于 Header |
| `selectedKey` | string | 受控选中项 |
| `collapsible` | boolean（默认 `false`） | 仅 inline 模式生效：含 `children` 的目录项可折叠——点击只展开/收起（不触发 `onSelect`），右端 chevron 指示（展开时旋转 180°）；展开状态组件内部维护，初始为 `defaultExpandedKeys` ∪ `selectedKey` 的祖先目录链（挂载时算一次，`selectedKey` 后续变化不重置手动状态） |
| `defaultExpandedKeys` | string[] | 初始额外展开的目录 key |
| 事件 `onSelect` | — | 点选传出 key（典型接 `navigate` 或 `setState`） |

可折叠子菜单示例：

```yaml
- type: Menu
  props:
    collapsible: true
    defaultExpandedKeys: [system]
    selectedKey: ${state.currentMenu}
    items:
      - { key: home, label: 首页, icon: home }
      - key: customer
        label: 客户管理
        icon: users
        children:
          - { key: customer-list, label: 客户列表 }
      - key: system
        label: 系统管理
        icon: settings
        children:
          - { key: system-user, label: 用户管理 }
  events:
    onSelect:
      - action: setState
        params: { currentMenu: ${event} }
```

自由组合示例（见 `examples/admin/src/pages/layout-demo.page.yaml`）：

```yaml
body:
  type: Layout                   # 含 Sider 子节点 → 自动横向
  children:
    - type: Sider
      props:
        collapsible: true
        collapsed: ${state.siderCollapsed}
      events:
        onCollapse:
          - action: setState
            params: { siderCollapsed: ${event} }
      children:
        - type: Menu
          props:
            items: ${data.menus}
            selectedKey: ${state.currentMenu}
          events:
            onSelect:
              - action: setState
                params: { currentMenu: ${event} }
    - type: Layout               # 无 Sider → 纵向
      children:
        - type: Header
          children: [...]
        - type: Content
          children: [...]
        - type: Footer
          children: [...]
```

### Link

原生锚点链接（嵌入模式的主要跳转方式，见[两种使用形态](/guides/manual-setup/#两种使用形态)）。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `href` | string | 链接地址（可含表达式插值，如 `/items/${row.id}`） |
| `text` | string | 链接文本（也可用 children） |
| `target` | `_self`（默认）\| `_blank` \| `_parent` \| `_top` | 打开方式；`_blank` 自动带 `rel="noreferrer"` |

### Breadcrumb

面包屑路径导航：带 `href` 的非末项渲染为可点击链接（原生锚点），末项与无 `href` 项渲染为纯文本（末项 `aria-current="page"`）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `items` | `Array<{ label: string, href?: string }>` | `[]` | 路径项（可含表达式解析后的数组）；末项始终为当前页纯文本 |

```yaml
- type: Breadcrumb
  props:
    items:
      - { label: 首页, href: / }
      - { label: 客户列表 }
```

### Pagination

分页器：`total` / `pageSize` 推页数；页码序列总数 ≤7 全显，否则按当前页位置取 7 项窗口（含省略标记）。上一页 / 下一页与页码点击均走同一 `onChange`。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `total` | number | `0` | 总条数（可绑表达式解析后的数字） |
| `pageSize` | number | `10` | 每页条数 |
| `page` | number | — | 受控当前页（可绑 `${state.x}`）；缺省内部自管理 |
| 事件 `onChange` | — | — | 翻页时触发，`${event}` 为目标页码（number） |

```yaml
- type: Pagination
  props:
    total: ${data.total}
    pageSize: 10
    page: ${state.page}
  events:
    onChange:
      action: setState
      params:
        page: ${event}
```

### Tabs

| prop | 类型 | 说明 |
| --- | --- | --- |
| `items` | `{ key, label, children?: DslNode[], className?, style? }[]` | 页签列表，pane 内容为 DSL 子树；`className` / `style` 为该页签内容区样式（叠加在 `contentClassName` / `contentStyle` 之后） |
| `activeKey` | string | 当前激活 key（可绑表达式） |
| `variant` | `default`（缺省）\| `line` | 页签栏样式：胶囊 / 下划线（`line` 页签栏默认通栏，下划线轨道占满容器宽） |
| `contentClassName` | string | 页签内容区 class（全部 pane 共用，与内置样式合并） |
| `contentStyle` | CSSProperties | 页签内容区内联样式（同 `contentClassName` 的挂载规则） |
| 事件 `onChange` | — | 切换时传出新 key |

### Menubar

桌面式菜单栏：一级菜单 + 下拉叶子项，叶子项点击触发 `onSelect`。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `menus` | `Array<{ label: string, items: Array<{ label: string, value: string, disabled?: boolean, icon?: string }> }>` | `[]` | 菜单组（可含表达式解析后的数组）；叶子项 `value` 为 `onSelect` 传出值；`icon` 为图标名（Icon 白名单），渲染于文字前 |
| 事件 `onSelect` | — | — | 叶子项点击触发，`${event}` 为选中项 `value`（string） |

```yaml
- type: Menubar
  props:
    menus:
      - label: 文件
        items:
          - { label: 新建, value: create }
          - { label: 导出, value: export }
  events:
    onSelect:
      action: setState
      params:
        op: ${event}
```

### NavigationMenu

顶部导航菜单：仅含 `href` 的项渲染为直链，含 `children` 的项渲染为触发器 + 下拉面板（链接可带 `description`）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `items` | `Array<{ label: string, href?: string, icon?: string, children?: Array<{ label: string, href: string, description?: string, icon?: string }> }>` | `[]` | 导航项（可含表达式解析后的数组）；`icon` 为图标名（Icon 白名单），渲染于文字前 |

```yaml
- type: NavigationMenu
  props:
    items:
      - { label: 概览, href: / }
      - label: 产品
        children:
          - { label: 客户管理, href: /customers, description: 客户列表与详情 }
```

### DropdownMenu

下拉菜单：children 为触发元素（以 span 包装接入 Base UI Trigger，避免按钮嵌套按钮）；`danger: true` 的项以 destructive 语义呈现。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `items` | `Array<{ label: string, value: string, disabled?: boolean, danger?: boolean, icon?: string }>` | `[]` | 菜单项（可含表达式解析后的数组）；`icon` 为图标名（Icon 白名单），渲染于文字前 |
| children | DslNode[] | — | 触发元素（DSL 子树，经 Renderer children 机制渲染） |
| 事件 `onSelect` | — | — | 菜单项点击触发，`${event}` 为选中项 `value`（string） |

`className` / `style` 挂在弹出内容根节点（非触发元素）。

```yaml
- type: DropdownMenu
  props:
    items:
      - { label: 编辑, value: edit }
      - { label: 删除, value: delete, danger: true }
  events:
    onSelect:
      action: setState
      params:
        op: ${event}
  children:
    - type: Button
      props: { text: 更多操作 }
```

### ContextMenu

右键上下文菜单：children 为右键作用区域，菜单项语义同 DropdownMenu。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `items` | `Array<{ label: string, value: string, disabled?: boolean, danger?: boolean, icon?: string }>` | `[]` | 菜单项（可含表达式解析后的数组）；`danger` 项以 destructive 语义呈现；`icon` 为图标名（Icon 白名单），渲染于文字前 |
| children | DslNode[] | — | 右键作用区域（DSL 子树，经 Renderer children 机制渲染） |
| 事件 `onSelect` | — | — | 菜单项点击触发，`${event}` 为选中项 `value`（string） |

`className` / `style` 挂在弹出内容根节点。

```yaml
- type: ContextMenu
  props:
    items:
      - { label: 重命名, value: rename }
  events:
    onSelect:
      action: setState
      params:
        op: ${event}
  children:
    - type: Card
      props: { title: 在此区域右键 }
```
