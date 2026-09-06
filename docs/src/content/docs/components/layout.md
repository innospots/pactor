---
title: 布局与页面组件
description: 页面容器与布局类 DSL 组件——Page / Layout / Header / Sider / Content / Footer / Grid / Flex / Card / Sidebar / Separator / ScrollArea / Resizable 的 props 契约与 DSL 示例
---

页面容器、布局容器与页面级结构组件：从整页骨架（Page / Sidebar / Layout 系列）到分栏与约束容器（Grid / Flex / Card / ScrollArea / Resizable / Separator）。

### Page

页面容器。内容区 children 纵向间距 20px。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `title` | string | 页面标题 |

### Layout

页面级布局组件（spec: layout-components），可在 `body` 中自由组合页面结构。**与外壳布局的关系**：应用级外壳（菜单/品牌/页签）继续由 bootstrap `layout.type` 承担；页面需要完全自控结构时外壳用 `blank`，body 以 `Layout` 起手组合——两者混用（admin 外壳里再套 Layout+Sider）通常意味着设计问题。

flex 容器；直接子节点含 `Sider` 时横向、否则纵向（`component` 引用的 Sider 子树同样计入推导），`direction` 显式覆盖。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `direction` | `horizontal` \| `vertical` | 主轴方向（缺省按子节点推导） |

### Header

顶部区域（横向 flex、垂直居中、下边框）。缺省为纯语义容器（仅渲染 children）；可选声明五个结构区域：品牌区、通用下拉、横向菜单、用户区、国际化切换，任意组合均可。

区域排布固定：**左区** = 品牌区（`brandPosition: 'left'` 时）→ 通用下拉（`position: 'left'` 时）→ 横向菜单；**右区** = 通用下拉（`'right'` 时）→ 品牌区（`'right'` 时）→ 国际化切换 → 用户区；children 渲染于左右区之间的弹性区（`flex-1`）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `logo` | string | — | 品牌区 logo 图片地址（可含表达式），与 `title` 可二选一或并存（并存时 logo 在前） |
| `title` | string | — | 品牌区标题文本 |
| `brandPosition` | `'left'` \| `'right'` | `'left'` | 品牌区位置 |
| `dropdown` | `{ label, items: Array<{ label, value, disabled?, icon? }>, position?: 'left' \| 'right' }` | — | 通用下拉；`position` 缺省 `'left'`；`icon` 为图标名（Icon 白名单），渲染于文字前 |
| `menu` | `Array<{ key, label, icon?, children? }>` | — | 横向菜单（可含表达式），语义复用 horizontal Menu（`children` 为弹出式子菜单，可嵌套）；`icon` 为图标名（Icon 白名单），渲染于文字前（叶子项与子菜单触发器/子项均生效） |
| `user` | `{ name, avatar?, items?: Array<{ label, value, icon? }> }` | — | 用户区（右侧）；`avatar` 缺省时以用户名首字符占位；`items` 缺省或为空时纯展示（无下拉）；`icon` 为图标名（Icon 白名单），渲染于文字前 |
| `locales` | `Array<{ label, value }>` | — | 国际化切换（右侧下拉）；触发器显示当前 locale 对应的 label（未命中显示 value 本身） |
| children | DslNode[] | — | 中部弹性区内容 |

| 事件 | `${event}` 载荷 | 说明 |
| --- | --- | --- |
| `onMenuSelect` | string（选中项 `key`） | 横向菜单选中 |
| `onDropdownSelect` | string（选中项 `value`） | 通用下拉选中 |
| `onUserSelect` | string（选中项 `value`） | 用户区菜单选中 |
| `onLocaleChange` | string（选中的 locale 值） | 语言切换；Header 只发事件，不改写全局 locale（生效接线见下方示例） |

全组合示例：

```yaml
- type: Header
  props:
    logo: /logo.svg
    title: 控制台
    menu:
      - { key: home, label: 首页 }
      - key: mgmt
        label: 管理
        children:
          - { key: user-list, label: 用户列表 }
    dropdown:
      label: 切换团队
      position: right
      items:
        - { label: 团队A, value: a }
        - { label: 团队B, value: b }
    locales:
      - { label: 中文, value: zh-CN }
      - { label: English, value: en-US }
    user:
      name: 张三
      items:
        - { label: 退出登录, value: logout }
  events:
    onMenuSelect:
      action: navigate
      params:
        to: ${event}
    onDropdownSelect:
      action: setState
      params:
        team: ${event}
    onUserSelect:
      action: setState
      params:
        op: ${event}
  children:
    - type: Button
      props: { text: 新建 }
```

国际化闭环接线（`onLocaleChange` → setState 回写 → 应用层切换 locale）：

```yaml
- type: Header
  props:
    locales:
      - { label: 中文, value: zh-CN }
      - { label: English, value: en-US }
  events:
    onLocaleChange:
      - action: setState
        params:
          locale: ${event}
      - action: service.call
        params:
          service: app.setLocale
          params:
            locale: ${event}
```

页面内其他组件可立即消费 `${state.locale}`；全局生效由应用层桥接（示例中的 `app.setLocale` 为应用层注册的 service，内部调用应用的 `setLocale`，当前版本为整页刷新策略，见[国际化指南](/guides/i18n/)）。i18n Provider 的 locale 由应用创建时（或 bootstrap）注入，Header 的 locales 触发器经 `useI18n` 读取的正是该上下文。

### Sider

侧边区域，折叠为受控闭环。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `width` | number（默认 200） | 展开宽度 |
| `collapsible` | boolean | 渲染底部折叠触发器 |
| `collapsed` | boolean | 受控折叠态（绑 `${state.x}`） |
| `collapsedWidth` | number（默认 64） | 折叠后宽度 |
| 事件 `onCollapse` | — | 折叠触发器点击，传出 boolean |

### Content

主内容区（`flex: 1`）。纯语义容器，无特有 props。

### Footer

底部区域（居中弱化文本）。纯语义容器，无特有 props。

### Grid

均分栏布局（CSS grid，列宽 `minmax(0, 1fr)`）。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `columns` | number（默认 1） | 列数 |
| `gap` | number | 栏间距 |

### Flex

| prop | 类型 | 说明 |
| --- | --- | --- |
| `direction` | `horizontal`（默认）\| `vertical` | 主轴方向 |
| `gap` | number \| `small` \| `middle` \| `large` | 间距 |
| `justify` | `start` \| `center` \| `end` \| `space-between` \| `space-around` \| `space-evenly` | 主轴对齐 |
| `align` | `start` \| `center` \| `end` \| `baseline` \| `stretch` | 交叉轴对齐 |

### Card

| prop | 类型 | 说明 |
| --- | --- | --- |
| `title` | string | 卡片标题 |
| `bordered` | boolean（默认 true） | 是否有边框 |

### Sidebar

整页侧栏布局：品牌区 + 嵌套导航（`href` 渲染为锚点、子菜单缩进展示）的侧栏与 children 主内容区；样式取 sidebar 系列语义令牌。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `brand` | `{ title: string, logo?: string }` | — | 品牌区（标题 + 可选 logo 图片地址） |
| `items` | `Array<{ label: string, href?: string, icon?: string, children?: [...] }>` | `[]` | 导航项（可含嵌套 `children`，可含表达式）；`icon` 为图标名（Icon 白名单），渲染于文字前 |
| `collapsible` | boolean | `false` | 渲染底部折叠触发器（折叠态内部维护，经 `onCollapse` 传出） |
| children | DslNode[] | — | 主内容区 |
| 事件 `onCollapse` | — | — | 折叠触发器点击时触发，`${event}` 为 boolean |

```yaml
- type: Sidebar
  props:
    brand: { title: 控制台 }
    collapsible: true
    items:
      - { label: 概览, href: / }
      - label: 设置
        children:
          - { label: 账号, href: /settings/account }
  children:
    - type: Text
      props: { text: 主内容区 }
```

### Separator

分割线。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `orientation` | `horizontal` \| `vertical` | `horizontal` | 方向 |

```yaml
- type: Separator
```

### ScrollArea

自定义滚动条容器（Base UI）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `maxHeight` | number \| string | — | 最大高度（px 或 CSS 长度），超出后出现自定义滚动条 |
| `maxWidth` | number \| string | — | 最大宽度（px 或 CSS 长度） |
| children | DslNode[] | — | 滚动内容 |

```yaml
- type: ScrollArea
  props: { maxHeight: 240 }
  children:
    - type: Text
      props: { text: 长内容…… }
```

### Resizable

可拖拽分栏（react-resizable-panels）：相邻面板间渲染拖拽手柄。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `panels` | `Array<{ children?: DslNode[], defaultSize?: number }>` | `[]` | 面板列表；`children` 为 DSL 子树，`defaultSize` 按百分比（0-100）解释 |
| `direction` | `horizontal` \| `vertical` | `horizontal` | 排列方向 |

```yaml
- type: Resizable
  props:
    panels:
      - defaultSize: 30
        children:
          - type: Menu
            props: { items: ${data.menus} }
      - children:
          - type: Text
            props: { text: 主内容 }
```
