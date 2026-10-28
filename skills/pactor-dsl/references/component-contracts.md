# Pactor 常用组件 DSL 契约

> 基线：2026-10-27。本文是随技能分发的离线组件说明书，覆盖建页时最常用的布局、导航、表单、表格、反馈、浮层、业务区块、图表和聊天组件。完整 175 个 DSL 类型及逐项在线链接见 [`component-catalog.md`](component-catalog.md)。

## 1. 共同规则

### 1.1 节点结构

```yaml
- type: Button                 # 组件注册名，大小写必须完全一致
  props:                       # 组件 props，可含 ${...}
    text: 保存
    variant: primary
  children: []                 # 节点级子树，不放在 props 内
  events:
    onClick:                   # 单个 ActionConfig 或 ActionConfig[]
      - action: message
        params: { messageType: success, text: 保存成功 }
  when: ${state.editable}      # 条件渲染
  permission: customer:edit    # 权限策略
```

- `type` 与 `component` 二选一；`component` 引用页面顶层 `components` 的命名子树。
- `children`、`events`、`when`、`permission` 都是节点级字段，不要塞进 `props`。
- `className`、`style` 是组件 props，不是节点级字段。
- `events.<eventName>` 对应组件源码中的 `on<EventName>` 回调；参数进入 `${event}` 作用域。
- 不要把函数、ReactNode、`File`、类实例写入 DSL props。需要运行时能力时通过组件事件、Action 或宿主服务桥接。

### 1.2 内容槽

部分 props 接受一个 DslNode（不是数组），例如 `Dialog.children` 是普通 children，`Card.extra` 是 `DslNode[]`，`Tabs.items[].extra` 也是 `DslNode[]`：

```yaml
props:
  extra:
    - type: Button
      props: { text: 刷新, variant: link }
      events:
        onClick:
          - action: reload
```

插槽内可以继续使用任何已注册组件。页面运行时之外（纯 React 宿主）可以改传 ReactNode，但 DSL 文件里必须使用 DslNode。

### 1.3 表单控件的两种 label 写法

推荐让控件自己拥有字段壳：

```yaml
- type: Input
  props:
    name: name
    label: 名称
    rules:
      - { required: true, message: 请输入名称 }
```

只在需要说明、提示、错误展示或分组时使用显式 `Field`；此时内层控件不要再写 `label`：

```yaml
- type: Field
  props:
    label: 名称
    required: true
    description: 名称会展示在列表和详情页
  children:
    - type: Input
      props:
        name: name
        rules:
          - { required: true, message: 请输入名称 }
```

`Field.required` 只负责红色星号；真正的校验仍来自控件 `rules`。

## 2. 注册与样式

```tsx
import { createPactorApplication } from '@pactor-app/app';
import { createComponentRegistry } from '@pactor-app/ui/components';
import { registerBlockComponents } from '@pactor-app/blocks';
import { registerChartComponents } from '@pactor-app/chart';
import { registerChatComponent } from '@pactor-app/chat';

import '@pactor-app/ui/styles.css';
import '@pactor-app/blocks/styles.css';
import '@pactor-app/chart/styles.css';
import '@pactor-app/chat/styles.css';

const componentRegistry = () => {
  const registry = createComponentRegistry();
  registerBlockComponents(registry);
  registerChartComponents(registry);
  registerChatComponent(registry);
  return registry;
};

createPactorApplication({
  appId: 'my-app',
  componentRegistry,
}).mount('#root');
```

| 组件层 | 注册方式 | 未注册时 |
| --- | --- | --- |
| `@pactor-app/ui` 124 个内置组件 | 默认 `createComponentRegistry()` | 不应发生；使用应用默认注册表 |
| `@pactor-app/blocks` 11 个区块 | `registerBlockComponents(registry)` | 页面显示 `Unsupported` |
| `@pactor-app/chart` 17 个图表 | `registerChartComponents(registry)` | 页面显示 `Unsupported` |
| `@pactor-app/chat` 19 个展示组件 | `registerChatComponents(registry)` 或 `createChatComponentRegistry()` | 展示组件不可用 |
| `Chat` / `ChatShell` | `registerChatComponent(registry)` | 聊天入口不可用 |
| `PageOutlet` / `SitemapMenu` | 由 `SitemapApp` 布局运行时注入 | 不应在普通页面使用 |

## 3. 页面与布局

| DSL type | 关键 props | 用法约束 |
| --- | --- | --- |
| `Page` | `title?`、`className?`、`style?` | `body` 根容器；页面标题只出现一次，不要和页头 `Typography` 重复表达同一标题 |
| `Container` | `size`、`centered`、`id` | 限宽内容区；后台内容通常由全局 layout 提供留白，不要层层嵌套 Container |
| `Flex` | `direction`、`gap`、`wrap`、`justify`、`align` | 一维排列首选；两端布局写 `justify: space-between` |
| `Grid` | `columns`、`gap` | 等宽网格；卡片或表单项数量固定、无需断点精细控制时使用 |
| `Row` / `Col` | `gutter`、`span`、`offset`、`xs`…`xxl` | 24 栏响应式栅格；成对表单项常用 `xs: 24, md: 12` |
| `Space` | `direction`、`size`、`align`、`wrap` | 一组相邻控件的一致间距；较复杂布局用 Flex |
| `Card` | `title`、`extra`、`loading`、`bordered`、`hoverable`、`contentClassName` | `extra` 是 DslNode 数组；加载时优先用 `loading`，不要在外面再叠一个 Skeleton |
| `Tabs` | `items`、`activeKey`、`variant`、`tabPosition`、`contentClassName` | `items[].children` 是同层内容；切 Tabs 不换路由 |
| `Resizable` | 面板配置见在线文档 | 文档中的 `Splitter` 对应 DSL `Resizable`，不得写 `type: Splitter` |
| `ScrollArea` | 高度/滚动约束看在线文档 | 只约束内容滚动；页面整体不应横向滚动 |
| `Layout` / `Header` / `Sider` / `Content` / `Footer` | 低层组合 props | 常规业务页运行在全局 layout 内，不重复外壳 |
| `Sidebar` | `brand`、`items`、`content`、`sidebarFooter`、`collapsible`、`children` | 完整应用侧栏外壳；新项目优先用全局 layout + `PageOutlet` |

布局选型：

1. 页面区块之间：`Page > Flex(direction: vertical, gap: 16)`。
2. 指标卡、卡片墙：`Row + Col`（需要断点）或 `Grid`（严格等宽）。
3. 左右工作区：`Row + Col`；确实需要拖动改宽再用 `Resizable`。
4. 表格工具栏：`Flex(justify: space-between)`；移动端加 `wrap: true`。

## 4. 通用操作与状态

| DSL type | 关键 props | 事件 |
| --- | --- | --- |
| `Button` | `text`、`icon`、`variant`、`danger`、`size`、`loading`、`disabled`、`submit` | `onClick` |
| `ActionButton` | 图标工具按钮，见在线文档 | `onClick` |
| `ButtonGroup` | 关联按钮组合 | 子按钮各自处理事件 |
| `Typography` | `text`、`variant` | 页面标题/段落/弱化文字 |
| `Text` | `text`、`type`、`size`、`strong`、`delete`、`underline`、`italic` | 行内文本与表达式文本 |
| `Link` | `href`、`text`、`target` | 静态跳转；业务动作优先用 `Button + navigate` |
| `Icon` | `name` 白名单名称 | 未知名称显示占位图 |
| `Avatar` | `src`、`alt`、`fallback` | 用户/组织身份 |
| `Tag` | `text`、`color: default/success/warning/error/info`、`closable`、`icon` | `onClose` |
| `Badge` | `text`、`variant` | 数量/附着状态 |
| `Status` | `status: success/processing/error/warning/default`、`text` | 业务状态圆点 |
| `Tooltip` | `content`、`side` | 短说明；不要承载表单或长内容 |
| `Popconfirm` | `title`、`description`、`confirmText`、`cancelText`、`danger` | `onConfirm` / `onCancel` |

按钮规则：

- `Button.submit: true` 只提交其所在的 `<form>`；Drawer footer 等表单外场景用 `form.submit` 动作。
- 主操作每个区域只保留一个 `primary`；删除用 `danger: true` 并先确认。
- 异步保存必须绑定 `loading` 与 `disabled`，防止重复提交。
- 行内低风险操作用 `link` / `text`，不要在一行中堆多个高强调主按钮。

## 5. 表单与数据录入

### 5.1 Form 契约

```yaml
- type: Form
  props:
    name: edit                    # 缺省 default；同页多个表单必须命名
    layout: vertical              # vertical | horizontal | inline
    initialValues: ${data.record}
  events:
    onSubmit:
      - id: saveResult
        action: service.call
        params:
          service: record.update
          params: ${event}
  children: []
```

- `onSubmit` 只在必填校验通过后触发，`${event}` 是完整 values。
- `onValuesChange` 只传本次变化字段，不要把它当完整表单值。
- `initialValues` 在 Form 首次创建时读取。编辑页应在详情加载完成后才挂载 Form（`when`），否则后到数据不会回填。
- 字段级 `value` 是首次注册时的初始值，优先级高于 `initialValues[name]`。
- 提交成功时表单 values 写入 runtime `${form}`；多个表单共享页面 state.form 路径时，用命名表单与显式回填区分。
- Dialog / Drawer 内的 Form 只在弹层打开时挂载。打开动作应把业务数据写入 draft state，并将该 state 传给 `initialValues`；不要在同一动作数组中先 `setState(open)` 再立即 `form.setValues`，否则 Form 可能尚未注册。

### 5.2 常用控件

| DSL type | 关键 props | `${event}` |
| --- | --- | --- |
| `Input` | `name`、`label`、`rules`、`value`、`type: text/password`、`placeholder`、`maxLength`、`allowClear`、`disabled` | string |
| `Textarea` | `name`、`label`、`rules`、`rows`、`autoSize`、`maxLength` | string |
| `NumberInput` | `name`、`label`、`rules`、`min`、`max`、`step`、`precision` | number / undefined |
| `Select` | `name`、`label`、`rules`、`options`、`showSearch`、`allowClear` | 选项 value |
| `DatePicker` | `name`、`label`、`rules`、`mode: single/range`、`value`、`showTime?` | string 或 `{ start, end }` |
| `TimePicker` | `name`、`label`、`format: HH:mm/HH:mm:ss` | string |
| `Checkbox` | `name`、`label`、`rules`、`value` | boolean |
| `RadioGroup` | `name`、`label`、`rules`、`options`、`direction` | 选项 value |
| `Switch` | `name`、`label`、`rules`、`value` | boolean |
| `Slider` | `name`、`label`、`rules`、范围 props | number 或范围值 |
| `Cascader` | `options`、`name`、`label`、`rules` | 路径 value 数组 |
| `TreeSelect` | `options`、`searchable`、`name`、`label` | 单节点 value |
| `Combobox` | `options`、`name`、`label` | 输入/选中值 |
| `Transfer` | 数据与目标 keys props | 移动后的 keys |
| `Upload` | `name`、`multiple`、`accept`、`maxSize`、`maxCount`、`drag`、`tip` | 可序列化文件元数据数组；不发起上传 |
| `Mentions` | `options`、`name`、`label` | 带提及的文本值 |

通用控件规则：

- Form 内宽度优先使用 `controlClassName`，尤其是在 inline 表单里给 Select / DatePicker 设置宽度。
- `Field.required` 只是视觉星号；校验必须写 `rules`。
- 当前 `required` 仅把 `undefined` / `null` / `''` 判为空，布尔 `false` 会通过。协议确认、同意条款等布尔条件必须用 `onChange → state` 控制提交，并由服务端复验。
- `Select` / `TreeSelect` / `Cascader` 的 value 在候选中必须唯一。
- Upload 只是 UI 采集，真正上传由 `onChange` 后的服务/请求动作完成。
- 日期范围值统一为 `{ start, end }`；时间格式必须与 API 约定一致。

## 6. 表格与数据展示

### 6.1 Table

```yaml
- type: Table
  props:
    dataSource: ${data.records}
    rowKey: id
    loading: ${dataStatus.records.loading}
    pagination: { pageSize: 10 }
    emptyText: 没有符合条件的数据
    columns:
      - { title: 名称, dataIndex: name, sorter: true }
      - title: 状态
        dataIndex: status
        cell:
          type: Status
          props:
            status: "${row.status === 'active' ? 'success' : 'default'}"
            text: "${row.status === 'active' ? '启用' : '停用'}"
      - title: 操作
        fixed: right
        cell:
          type: Button
          props: { text: 编辑, variant: link, size: small }
          events:
            onClick:
              - action: navigate
                params: { to: "/records/${row.id}/edit" }
```

- `dataSource` 必须绑表达式，不得写数据源名称。
- 列模板键是 `cell`，行作用域为 `${row}`、`${rowIndex}`。
- `pagination: false` 关闭内置客户端分页；服务端分页配合独立 `Pagination`。
- `rowSelection: true` 开启多选；`selectedRowKeys` 受控，事件为 `onSelectChange`。
- 树表格由行数据 `children` 自动识别，可用 `childrenColumnName` 改字段名。
- `rowDraggable` 的 `onRowDrop` 返回 `{ dragKey, dropKey, position }`，组件内部已更新显示树，动作负责持久化。
- 表格可横向滚动，但页面不能整体横向滚动。

### 6.2 其他展示组件

| DSL type | 关键 props | 使用场景 |
| --- | --- | --- |
| `Descriptions` | `items: [{ label, value }]`、`column`、`bordered` | 只读详情字段 |
| `List` | `items: [{ title, description, avatar, extra }]`、`split`、`bordered` | 简单纵向对象集合 |
| `Tree` | `treeData`、`selectedKeys`、`expandedKeys`、`checkedKeys`、`checkable`、`draggable` | 层级选择/配置；事件 `onSelect` 等传 keys 数组 |
| `Statistic` | `title`、`value`、`precision`、`suffix` | 单个数值指标 |
| `Empty` | `title`、`description`、`children` CTA | 成功加载且集合为空 |
| `Skeleton` | 形状 props | 结构已知但数据未到 |
| `Timeline` | `items: [{ content, time, color, icon }]`、`pending` | 时间顺序事件 |
| `Accordion` | `items: [{ key, title, children }]`、`multiple` | 内容分组折叠 |
| `Collapsible` | `title`、`open` | 单组折叠 |
| `Image` | `src`、`alt`、`preview`、`fallback` | 图片展示 |

## 7. 导航

| DSL type | 数据形态 | 事件 / 行为 |
| --- | --- | --- |
| `Breadcrumb` | `items: [{ label, href? }]` | 末项无 href；用于层级返回 |
| `NavigationMenu` | `items: [{ label, href?, icon?, children? }]` | 链接导航；children 显示下拉链接面板，不产生 `onSelect` |
| `Menu` | `items: [{ key, label, icon, badge, dot, group, disabled, trailing, actions, children }]` | `onSelect` 传 key；`onItemAction` 传 `{ key, action }` |
| `Tabs` | `items: [{ key, label, children, extra }]` | `onChange` 传 key；同页视图切换 |
| `DropdownMenu` | `items: [{ label, value, icon, danger, separator, children }]` | `onSelect` 传 value；必须提供触发 children |
| `UserMenu` | `user`、`items`、`status`、`theme`、`language` 等 | `onSelect` / `onThemeChange` / `onStatusChange` / `onSignOut` |
| `Pagination` | `total`、`page`、`pageSize`、`pageSizeOptions` | `onChange(page)` / `onPageSizeChange(size)`；切换 pageSize 后还会固定触发 `onChange(1)`，只在一侧执行 `reload` 以避免双请求 |
| `Steps` | `items`、`current`、`direction` | 流程阶段，不是导航菜单 |

选择规则：

- 进入另一个路由：`NavigationMenu`、`Menu + navigate`、`Breadcrumb`。
- 同一路由内切换内容：`Tabs`。
- 线性流程：`Steps`。
- 临时操作集合：`DropdownMenu`。
- `Menu` 本身不读取路由；必须用 `selectedKey + onChange/onSelect` 与路由或 state 闭环。

## 8. 反馈与浮层

### 8.1 常驻反馈

| DSL type | 关键 props | 用途 |
| --- | --- | --- |
| `Alert` | `message`、`description`、`variant: success/info/warning/error`、`showIcon` | 页面内持续提示与错误重试 |
| `Message` | 动作/组件配置，见在线文档 | 全局短时反馈；动作通常用 `message` action |
| `Notification` | 标题/描述等，见在线文档 | 更完整的全局通知 |
| `Result` | `status`、`title`、`subTitle`、`children` | 完成/失败结果页 |
| `Progress` | 百分比/状态 props | 任务进度 |
| `Spinner` | 局部加载 | 小区域处理中 |
| `LoadingOverlay` | 覆盖层加载 | 阻断式加载，必须说明取消策略 |

### 8.2 Dialog

```yaml
- type: Dialog
  props:
    title: 编辑记录
    description: 修改后立即生效
    open: ${state.dialogOpen}
    style: { width: 560, maxWidth: 'none' }
  events:
    onClose:
      - action: setState
        params: { dialogOpen: false }
  children:
    - type: Form
      children: []
```

- `open` 缺省时可由 `trigger` DslNode 自管理；业务编辑弹窗推荐受控 `open + onClose`。
- `children` 是弹层内容；没有默认 footer，操作按钮放 children 内。
- Dialog 内表单的提交按钮写 `submit: true`。

### 8.3 Drawer

```yaml
- type: Drawer
  props:
    title: 编辑记录
    open: ${state.drawerOpen}
    placement: right              # left | right | top | bottom
    draggable: false
    closable: true
    okText: 保存
    cancelText: 取消
    style: { width: 480, maxWidth: 'none' }
  events:
    onClose:
      - action: setState
        params: { drawerOpen: false }
    onOk:
      - action: form.submit
  children:
    - type: Form
      props: { name: edit }
      events:
        onSubmit: []
      children: []
```

- 默认 footer 为 `[取消, 确定]`；取消走 `onClose`，确定走 `onOk`。
- footer 在 `<form>` 外部，所以 `onOk` 必须用 `form.submit`，不能写 `submit: true`。
- `footer: false` 去掉默认栏；也可传一个 DslNode 自定义。
- 可通过 `overlay.open` 命名动作打开，也可用受控节点模式；不要同时维护两套开关状态。

### 8.4 AlertDialog / Sheet / Popover / HoverCard

| DSL type | 关键 props | 事件 |
| --- | --- | --- |
| `AlertDialog` | `title`、`description`、`confirmText`、`cancelText`、`open`、`trigger` | `onConfirm` / `onCancel`；受控模式两者都要关闭 |
| `Sheet` | `title`、`open`、`side`、`onClose` | 受控开关 |
| `Popover` | `content` DslNode 或 string、`side`、`align`、children 触发器 | 适合悬浮筛选或补充说明 |
| `HoverCard` | `content`、children 触发器 | 仅悬停预览，不承载关键操作 |
| `Tooltip` | `content`、`side`、children | 短文本提示 |

`AlertDialog` 用于破坏性确认；普通表单编辑用 Dialog/Drawer，不要把所有弹窗都做成 AlertDialog。

## 9. Business blocks

所有区块都在 `@pactor-app/blocks`，必须先注册。

### 9.1 Login

```yaml
- type: Login
  props:
    layout: split                 # split | centered | brand-card | overlap | backdrop
    brandSide: left               # left | right
    brandRatio: 0.48              # 0.2–0.8，仅 split
    authVariant: card             # plain | card | float
    brand:
      logo: /logo.svg
      name: Pactor
      title: 动态应用运行时
      description: 用 YAML 构建企业应用
    title: 欢迎回来
    subtitle: 登录以继续
    registerLink: { text: 注册账号, href: /register }
    forgotLink: { text: 忘记密码, href: /forgot-password }
    footer: © 2026 Pactor
  events:
    onSubmit: []
    onRegisterClick: []
    onForgotClick: []
```

- 内置表单字段为 `username`、`password`，`onSubmit` 收到 `{ username, password }`。
- 传 children 时替换内置表单，但保留标题、副标题和辅助链接；此时表单提交由 children 内的 Form 负责，Login 的 `onSubmit` 不触发。
- `registerLink.href` / `forgotLink.href` 存在时直接链接跳转；没有 href 才使用对应事件。
- 注册页没有独立 `Register` 类型；用 `Login + children 自定义 Form`。

### 9.2 其他 blocks

| DSL type | 关键 props | 事件 |
| --- | --- | --- |
| `EntityCard` | `icon/logo`、`title`、`subtitle`、`tags`、`description`、`meta`、`actions`、`expandingActions`、`hoverable` | `onClick` / `onAction` / `onExpandingAction` |
| `CardList` | `items`、`columns`、`gap`、`createText`、`createIcon`、`showCount`、`emptyText` | `onItemClick` / `onItemAction` / `onItemExpandingAction` / `onCreateClick` |
| `HeroSection` | 公告、标题、CTA、媒体/客户标记 | CTA 事件 |
| `SiteFooter` | 品牌、链接组、版权 | 链接 |
| `RecordingPage` | 记录列表、筛选、转写/纪要/记忆面板 | 多种业务事件 |
| `FieldCondition` | 条件组 value/onChange | 受控 |
| `ExpressionEditor` | 表达式文本/映射 | 受控 |
| `RuleConfig` | 规则权重与条件 | 受控 |
| `RuleExpression` | 自由文本与特征 chip | 受控 |
| `ScriptEditor` | 脚本、函数与变量提示 | 受控 |

CardList 的 `items` 字段与 EntityCard 同形，可携带额外业务字段，事件会回传完整 `item` 与 `index`。

## 10. 图表

所有图表在 `@pactor-app/chart`，必须先注册；`Chart` 不是组件类型。

| DSL type | 主要 props |
| --- | --- |
| `MetricCard` | `title`、`value`、`prefix`、`suffix`、`trend`、`trendLabel` |
| `LineChart` | `data`、`xKey`、`yKeys`、`smooth`、`showArea`、`stacked`、`height` |
| `ColumnChart` | `data`、`xKey`、`yKeys`、`stacked`、`height` |
| `BarChart` | `data`、`yKey`、`xKeys`、`stacked`、`height` |
| `AreaChart` | `data`、`xKey`、`yKeys`、`stacked`、`fillOpacity` |
| `PieChart` / `DonutChart` | `data`、`nameKey`、`valueKey`、`showLabel`；Donut 另有中心值 |
| `ScatterChart` / `BubbleChart` | `data`、`xKey`、`yKey`、序列/大小字段 |
| `RadarChart` | `data`、`indicatorKey`、`yKeys` |
| `FunnelChart` | `data`、`nameKey`、`valueKey`、`sort` |
| `GaugeChart` | `value`、`min`、`max`、`thresholds`、`unit` |
| `Heatmap` | `data`、`xKey`、`yKey`、`valueKey` |
| `TreeChart` | `data`、`orient`、`edgeShape`、`initialTreeDepth` |
| `SankeyChart` | `nodes`、`links` |
| `MapChart` | `mapName`、`data`、`nameKey`、`valueKey`、`geoJson/geoJsonUrl` |
| `ComposedChart` | `data`、`xKey`、`series` |

图表点击统一使用 `events.onSelect`，事件为 `{ name?, value?, seriesName?, dataIndex? }`。用 `Card.loading` 或页面骨架处理加载，不要把无数据时传 0 当成真实值。

## 11. Chat / ChatPage / ChatShell

聊天的服务依赖不能写进 DSL；宿主必须在组件树外层注入 `ChatServicesProvider`，至少提供 `transport`。`callService(name, params)` 用于解析 `contexts[].service` 和自定义消息动作服务。

### 11.1 选型

| 场景 | 组件 |
| --- | --- |
| 完整聊天产品页，含左导航、会话、消息、Composer、产物面板 | `ChatPage` |
| 嵌入现有页面的单个对话 | `Chat` |
| 菜单驱动的多页面聊天外壳 | `ChatShell` |
| 只组合消息/输入等局部 UI | `MessageList`、`Composer`、`Welcome` 等 |

### 11.2 Chat 关键 props

| 分组 | 关键 props |
| --- | --- |
| 空态 | `greeting`、`subtitle`、`suggestions` |
| 会话 | `conversationId`、`params` |
| 头部 | `title`、`showHeader`、`headerExtra`、`headerActions`、`editableTitle` |
| Composer | `toolbarStart`、`toolbarEnd`、`composerFooter`、`composerBottom`、`hideToolbar` |
| 模型 | `models`、`model`、`modelPlacement: composer/header` |
| 上下文 | `contexts`、`onContextsChange` |
| 消息动作 | `messageActions`、`onMessageAction` |
| 产物 | `artifact`、`panelOpen`、`inspector`、`onArtifact`、`onOpenArtifact`、`onPanelClose` |
| 菜单 | `menu`、`activeMenuKey`、`onMenuSelect` |

### 11.3 ChatPage 关键 props

- 导航：`brand`、`railItems`、`railFooterItems`、`menuItems`、`activeMenuKey`、`onMenuSelect`。
- 会话：`conversations`、`activeConversationId`、`onSelectConversation`、`onDeleteConversation`。
- 消息：`messages`、`conversationTitle`、`sending`、`onSend`、`onMessageAction`。
- Composer：`composerPlaceholder`、`models`、`model`、`contexts`、`attachments`、`composerFooter`、`composerBottom`。
- 产物：`artifacts`、`activeArtifactId`、`artifactOpen`、`onArtifactOpenChange`、`onSelectArtifact`。
- 内容替换：`content` 提供后替换右侧整个主体，但保留最左图标栏和菜单。

受控 prop 必须形成 state 闭环，例如：

```yaml
props:
  model: ${state.model}
  artifactOpen: ${state.artifactOpen}
events:
  onModelChange:
    - action: setState
      params: { model: ${event} }
  onArtifactOpenChange:
    - action: setState
      params: { artifactOpen: ${event} }
```

## 12. 四态与交互验收

| 状态 | 页面信号 | 推荐写法 |
| --- | --- | --- |
| loading | `${dataStatus.x.loading}` | `Table.loading`、`Card.loading`、按钮 loading |
| error | `${dataStatus.x.error != null}` | 保留页头的 Alert + reload 按钮 |
| empty | 加载完成、无错误、集合为空 | Table emptyText 或 Empty + CTA |
| disabled | 权限、状态、提交中 | `disabled: ${...}` 或 permission denied disabled |

保存/删除等写操作必须同时具备：

1. 提交中 loading + disabled。
2. 命名 action 保存结果。
3. 成功反馈与列表/详情刷新或路由跳转。
4. 失败反馈并保留用户输入。
5. 破坏性操作先 `confirm` 或 AlertDialog。

## 13. 在线复核

- 组件总览：<https://pactor.innospots.com/components/overview/>
- 通用：<https://pactor.innospots.com/components/general/>
- 布局：<https://pactor.innospots.com/components/layout/>
- 导航：<https://pactor.innospots.com/components/navigation/>
- 数据录入：<https://pactor.innospots.com/components/data-entry/>
- 数据展示：<https://pactor.innospots.com/components/data-display/>
- 反馈：<https://pactor.innospots.com/components/feedback/>
- 图表：<https://pactor.innospots.com/components/charts/>
- AI 会话：<https://pactor.innospots.com/components/ai-chat/>
- 业务区块：<https://pactor.innospots.com/components/blocks/>
- 源码仓库：<https://github.com/innospots/pactor>

只有在技能内说明与安装版本不一致时，才通过在线文档或 GitHub 源码复核；不要把在线查询作为生成页面的前置步骤。
