# Spec: shadcn-extended-components

shadcn/ui 组件目录扩展：在既有 20 个 DSL 类型之外，将 shadcn/ui 组件目录的其余组件以框架级 props 协议纳入 DSL。


### Requirement: 扩展组件注册入口

`shadcnComponents` 注册表与 `createShadcnComponentRegistry()` SHALL 在既有 20 个类型之外注册全部扩展组件类型：展示类（Badge、Avatar、Skeleton、Separator、Kbd、Spinner、Empty、AspectRatio、Tooltip、HoverCard、Progress）、导航类（Breadcrumb、Pagination、Menubar、NavigationMenu、DropdownMenu、ContextMenu）、表单类（Textarea、Checkbox、RadioGroup、Switch、Slider、Label、Field、Calendar、InputOTP、Combobox）、反馈与弹层类（Dialog、AlertDialog、Drawer、Sheet、Popover、Sonner、Accordion、Collapsible）、复合类（Carousel、Command、Resizable、ScrollArea、Toggle、ToggleGroup、ButtonGroup、InputGroup、Item、Typography）、页面级组合类（Sidebar、DataTable、Chart）。扩展类型 MUST NOT 与既有 20 个类型重名冲突（重名者沿用既有实现，如 Alert/Card/Tabs）。

#### Scenario: 注册后全部扩展类型可解析

- **WHEN** 调用 `createShadcnComponentRegistry()` 后逐一查询上述扩展类型名
- **THEN** 每个 `has(type)` 均为 `true`

#### Scenario: 既有类型不受影响

- **WHEN** 对比注册表中既有 20 个类型的组件实现
- **THEN** 与本变更前完全一致

### Requirement: 统一适配约定

全部扩展组件 MUST 遵循与 `builtin-components` 一致的适配约定：DSL 只暴露框架级 props，适配器负责映射到 shadcn/Base UI 原生 props，MUST NOT 把底层库专有 props 名直接作为 DSL 协议暴露；事件回调 MUST 传递 DSL 层语义值（如 Switch.onChange 传 boolean、Slider.onChange 传 number、Pagination.onChange 传页码）；全部扩展组件 SHALL 支持通用 props `className` 与 `style`（挂载根节点）。

#### Scenario: 事件值规范化

- **WHEN** DSL 渲染 `{ type: 'Switch', props: { name: 'enabled' }, events: { onChange: ... } }` 且用户切换开关
- **THEN** 动作执行时 `${event}` 为布尔值而非 DOM 事件

#### Scenario: 通用 props 作用于根节点

- **WHEN** 任意扩展组件声明 `props: { className: 'x', style: { margin: 8 } }`
- **THEN** 渲染结果根节点 class 包含 `x` 且内联样式含 `margin: 8`

### Requirement: 展示类组件

SHALL 提供以下展示类 DSL 组件：

- **Badge**：`text` / `variant`（default/secondary/destructive/outline）。
- **Avatar**：`src` / `alt` / `fallback`（加载失败或缺省时的占位文本或首字母）。
- **Skeleton**：`shape`（line/circle/rect）与 `width` / `height`。
- **Separator**：`orientation`（horizontal/vertical）。
- **Kbd**：`text`，渲染键盘按键样式。
- **Spinner**：加载指示器，`size` 可选。
- **Empty**：空状态，`title` / `description` / 可选 children（操作区）。
- **AspectRatio**：`ratio`（如 16/9），children 按比例约束渲染。
- **Tooltip**：`content` + children（触发元素），悬浮显示提示。
- **HoverCard**：`content` + children（触发元素），悬浮显示富内容卡片。
- **Progress**：`value`（0-100，可为表达式解析后的数字）。

#### Scenario: Badge 变体渲染

- **WHEN** DSL 为 `{ type: 'Badge', props: { text: '草稿', variant: 'secondary' } }`
- **THEN** 渲染 secondary 样式的 Badge 且文本为"草稿"

#### Scenario: Progress 表达式值

- **WHEN** Progress 的 `value` 为 `"${data.progress}"` 且数据已加载
- **THEN** 渲染对应百分比的进度条

#### Scenario: Tooltip 触发

- **WHEN** DSL 为 `{ type: 'Tooltip', props: { content: '删除' }, children: [Button] }` 且用户悬浮按钮
- **THEN** 显示内容为"删除"的提示浮层

### Requirement: 导航类组件

SHALL 提供以下导航类 DSL 组件：

- **Breadcrumb**：`items`（`Array<{ label, href? }>`），末项渲染为当前页纯文本。
- **Pagination**：`total` / `pageSize` / `page`（受控当前页）/ `onChange`（传页码 number）。
- **Menubar**：`menus`（嵌套 `{ label, items: [{ label, value, disabled? }] }`），`onSelect` 传选中项 value。
- **NavigationMenu**：`items`（`{ label, href? , children?: [{ label, href, description? }] }`）。
- **DropdownMenu**：`items`（`{ label, value, disabled?, danger? }`）+ children（触发元素），`onSelect` 传 value。
- **ContextMenu**：`items`（同 DropdownMenu）+ children（右键作用区域），`onSelect` 传 value。

#### Scenario: Breadcrumb 渲染路径

- **WHEN** DSL 为 `{ type: 'Breadcrumb', props: { items: [{ label: '首页', href: '/' }, { label: '列表' }] } }`
- **THEN** 渲染可点击的"首页"链接与纯文本"列表"

#### Scenario: DropdownMenu 选中

- **WHEN** 用户点击触发元素并选择 value 为 `edit` 的菜单项
- **THEN** `onSelect` 动作执行时 `${event}` 为 `'edit'`

#### Scenario: Pagination 翻页

- **WHEN** Pagination 配置 `total: 95, pageSize: 10` 且用户点击第 3 页
- **THEN** `onChange` 动作执行时 `${event}` 为 `3`

### Requirement: 表单类组件

SHALL 提供以下表单类 DSL 组件，全部 MUST 可在 Form 内按 `name` 参与表单值收集与校验（与 Input/Select 既有行为一致），也可独立使用：

- **Textarea**：`name` / `placeholder` / `rows`，onChange 传 string。
- **Checkbox**：`name` / `label`，onChange 传 boolean。
- **RadioGroup**：`name` / `options`（`Array<{ label, value }>`），onChange 传选中 value。
- **Switch**：`name` / `label?`，onChange 传 boolean。
- **Slider**：`name` / `min` / `max` / `step`，onChange 传 number。
- **Label**：`text`，独立使用的表单标签。
- **Field**：通用表单项容器（`label` / `description` / `error`），children 为控件 DSL 子树。
- **Calendar**：`name` / `mode`（single），onChange 传 ISO 日期字符串。
- **InputOTP**：`name` / `length`，onChange 传当前字符串，`onComplete` 传完整 OTP。
- **Combobox**：`name` / `options` / `placeholder` / `searchable`，onChange 传选中 value。

#### Scenario: Form 内 Checkbox 收集

- **WHEN** Form 内 Checkbox 配置 `{ name: 'agree', label: '同意协议' }` 且用户勾选后提交
- **THEN** onSubmit 的 values.agree 为 `true`

#### Scenario: RadioGroup 选项渲染与选中

- **WHEN** DSL 为 `{ type: 'RadioGroup', props: { name: 'size', options: [{ label: '大', value: 'l' }, { label: '小', value: 's' }] } }` 且用户选择"小"
- **THEN** onChange 动作执行时 `${event}` 为 `'s'`

#### Scenario: InputOTP 完成回调

- **WHEN** InputOTP 配置 `length: 6` 且用户输入完整 6 位
- **THEN** `onComplete` 动作执行时 `${event}` 为 6 位字符串

### Requirement: 反馈与弹层类组件

SHALL 提供以下反馈与弹层类 DSL 组件：

- **Accordion**：`items`（`Array<{ key, title, children?: DslNode[] }>`）/ `collapsible` / `multiple`，pane 内容经 Renderer children 机制渲染。`collapsible` 为契约兼容字段：single 模式天然允许收起，适配器不消费该 prop。
- **Collapsible**：`title` + children（折叠内容）/ `open`（受控）。
- **Dialog**：`title` / `description` / `open`（受控）/ `onClose`，children 为内容 DSL 子树，可含触发元素写法 `trigger`。
- **AlertDialog**：`title` / `description` / `confirmText` / `cancelText` / `onConfirm` / `onCancel`。
- **Drawer**：`title` / `open` / `placement` / children。
- **Sheet**：`title` / `open` / `side`（left/right/top/bottom）/ children。
- **Popover**：`content`（DSL 子树）+ children（触发元素）。
- **Sonner**：全局 toast 能力，经动作调用（如 `toast` action 或 `notify`），DSL 组件形态仅作为挂载点 `<Sonner />`。

弹层类组件（Dialog/AlertDialog/Drawer/Sheet）在 DSL 内联声明时 MUST 与交互层 OverlayHost 渲染的 overlay 视觉一致（同一套 vendored 原语）。

#### Scenario: Accordion 渲染 DSL 子树

- **WHEN** Accordion 某 item 的 children 为含 Button 的 DslNode 数组
- **THEN** 展开该 pane 时渲染出 Button

#### Scenario: Dialog 受控开关

- **WHEN** DSL 为 `{ type: 'Dialog', props: { open: '${state.showDialog}', title: '编辑' } }` 且 `state.showDialog` 变为 true
- **THEN** 弹出标题为"编辑"的对话框；用户关闭时触发 `onClose`

#### Scenario: AlertDialog 确认链路

- **WHEN** 用户在 AlertDialog 中点击确认按钮
- **THEN** `onConfirm` 动作执行且弹层关闭

### Requirement: 复合类组件

SHALL 提供以下复合类 DSL 组件：

- **Carousel**：`items`（DSL 子树数组或图片 `{ src, alt }` 数组）/ `loop` / `autoplay`。
- **Command**：`groups`（`{ heading, items: [{ label, value, icon? }] }`）/ `placeholder` / `onSelect`，支持搜索过滤。
- **Resizable**：`panels`（`Array<{ children: DslNode[], defaultSize? }>`）/ `direction`，面板间可拖拽调整。
- **ScrollArea**：`maxHeight` 等尺寸约束 + children，自定义滚动条。
- **Toggle**：`text` / `pressed` / `onChange`（传 boolean）。
- **ToggleGroup**：`options` / `value` / `multiple` / `onChange`（传选中值或值数组）。
- **ButtonGroup**：children 为若干 Button，渲染为相连的按钮组。
- **InputGroup**：children 为 Input 与前后缀元素（Text/Button），渲染为组合输入框。
- **Item**：列表项 `title` / `description` / `media?` / `actions?`（DSL 子树）。
- **Typography**：`variant`（h1/h2/h3/h4/p/blockquote/list/inline-code/lead/muted/small）/ `text`，排版样式文本。

#### Scenario: Carousel 图片轮播

- **WHEN** DSL 为 `{ type: 'Carousel', props: { items: [{ src: '/a.png', alt: 'A' }] , loop: true } }`
- **THEN** 渲染可循环切换的轮播

#### Scenario: Command 搜索选中

- **WHEN** Command 配置含 value 为 `create` 的项且用户搜索并选中
- **THEN** `onSelect` 动作执行时 `${event}` 为 `'create'`

#### Scenario: Typography 变体

- **WHEN** DSL 为 `{ type: 'Typography', props: { variant: 'h2', text: '标题' } }`
- **THEN** 渲染 h2 级别样式的文本

### Requirement: 页面级组合组件

SHALL 提供以下页面级组合 DSL 组件，MUST 以受限的框架级 props 暴露（MUST NOT 透传底层库自由组合 API）：

- **Sidebar**：`brand`（`{ title, logo? }`）/ `items`（导航项 `{ label, href?, icon?, children? }`）/ `collapsible` / children（主内容区）；渲染完整的侧栏+内容布局。
- **DataTable**：`columns`（`{ key, title, sortable?, filterable?, children? }`，cell 模板字段为 `children: DslNode[]`，`renderChildren` 保留为兼容别名）/ `rows` / `pagination` / `sort`（初始排序，点击表头后内部维护）/ `onSort` / `onPageChange`，提供排序/筛选/分页的一体化封装。
- **Chart**：`chartType`（line/bar/area/pie）/ `data` / `xKey` / `yKeys` / `colors?`，渲染基于 chart 令牌（`chart-1..5`）配色的图表。

#### Scenario: Sidebar 布局渲染

- **WHEN** DSL 为 `{ type: 'Sidebar', props: { brand: { title: '后台' }, items: [{ label: '概览', href: '/' }] }, children: [Page] }`
- **THEN** 渲染含品牌区、导航项的侧栏与主内容区

#### Scenario: DataTable 排序回调

- **WHEN** DataTable 列配置 `sortable: true` 且用户点击该列表头
- **THEN** `onSort` 动作执行时 `${event}` 含 `{ key, order }`

#### Scenario: Chart 渲染

- **WHEN** DSL 为 `{ type: 'Chart', props: { chartType: 'bar', data: '${data.sales}', xKey: 'month', yKeys: ['amount'] } }` 且数据已加载
- **THEN** 渲染按月分组的柱状图
