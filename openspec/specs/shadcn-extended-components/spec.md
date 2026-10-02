# Spec: shadcn-extended-components

## Purpose

shadcn/ui 组件目录扩展：在既有 20 个 DSL 类型之外，将 shadcn/ui 组件目录的其余组件以框架级 props 协议纳入 DSL。
## Requirements
### Requirement: 扩展组件注册入口

`builtinComponents` 注册表与 `createComponentRegistry()` SHALL 在既有 20 个类型之外注册全部扩展组件类型：展示类（Badge、Avatar、Skeleton、Separator、Kbd、Spinner、Empty、AspectRatio、Tooltip、HoverCard、Progress、Icon）、导航类（Breadcrumb、Pagination、Menubar、NavigationMenu、DropdownMenu、ContextMenu）、表单类（Textarea、Checkbox、RadioGroup、Switch、Slider、NumberInput、Label、Field、Calendar、DatePicker、InputOTP、Combobox）、反馈与弹层类（Dialog、AlertDialog、Drawer、Sheet、Popover、Sonner、Accordion、Collapsible）、复合类（Carousel、Command、Resizable、ScrollArea、Toggle、ToggleGroup、ButtonGroup、InputGroup、Item、Typography）、页面级组合类（Sidebar、DataTable、Chart）、业务刚需类第五批（TreeSelect、Cascader、Rate、TimePicker、ColorPicker、Upload、Transfer、Mentions、List、Tree、Descriptions、Timeline、Image、QRCode、Segmented、Message、Notification、Popconfirm、Result、LoadingOverlay、Watermark、Tour）。扩展类型 MUST NOT 与既有 20 个类型重名冲突（重名者沿用既有实现，如 Alert/Card/Tabs）。

#### Scenario: 注册后全部扩展类型可解析

- **WHEN** 调用 `createComponentRegistry()` 后逐一查询上述扩展类型名
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
- **Icon**：`name`（图标名，kebab-case 或 PascalCase，取自内置 lucide 常用图标白名单）/ `size`（sm/default/lg 或数字 px）/ `color` / `strokeWidth`；未知名 MUST 渲染占位图标（不抛错）。白名单为静态导入（可 tree-shake），新增图标需显式补充映射。

#### Scenario: Badge 变体渲染

- **WHEN** DSL 为 `{ type: 'Badge', props: { text: '草稿', variant: 'secondary' } }`
- **THEN** 渲染 secondary 样式的 Badge 且文本为"草稿"

#### Scenario: Progress 表达式值

- **WHEN** Progress 的 `value` 为 `"${data.progress}"` 且数据已加载
- **THEN** 渲染对应百分比的进度条

#### Scenario: Tooltip 触发

- **WHEN** DSL 为 `{ type: 'Tooltip', props: { content: '删除' }, children: [Button] }` 且用户悬浮按钮
- **THEN** 显示内容为"删除"的提示浮层

#### Scenario: Icon 渲染与命名归一

- **WHEN** DSL 为 `{ type: 'Icon', props: { name: 'check-circle' } }` 或 `{ name: 'CheckCircle' }`
- **THEN** 两种命名均渲染出对应 lucide 图标（svg 根节点）

#### Scenario: Icon 未知名占位

- **WHEN** DSL 为 `{ type: 'Icon', props: { name: 'no-such-icon' } }`
- **THEN** 渲染占位图标（标记未知名），不抛错

### Requirement: 导航类组件

SHALL 提供以下导航类 DSL 组件：

- **Breadcrumb**：`items`（`Array<{ label, href? }>`），末项渲染为当前页纯文本。
- **Pagination**：`total` / `pageSize` / `page`（受控当前页）/ `onChange`（传页码 number）。
- **Menubar**：`menus`（嵌套 `{ label, items: [{ label, value, disabled?, icon? }] }`），`onSelect` 传选中项 value。
- **NavigationMenu**：`items`（`{ label, href?, icon?, children?: [{ label, href, description?, icon? }] }`）。
- **DropdownMenu**：`items`（`{ label, value, disabled?, danger?, icon? }`）+ children（触发元素），`onSelect` 传 value。
- **ContextMenu**：`items`（同 DropdownMenu）+ children（右键作用区域），`onSelect` 传 value。

以上 items 的 `icon` 字段均为图标名（Icon 白名单），声明时渲染于文字前。

#### Scenario: Breadcrumb 渲染路径

- **WHEN** DSL 为 `{ type: 'Breadcrumb', props: { items: [{ label: '首页', href: '/' }, { label: '列表' }] } }`
- **THEN** 渲染可点击的"首页"链接与纯文本"列表"

#### Scenario: DropdownMenu 选中

- **WHEN** 用户点击触发元素并选择 value 为 `edit` 的菜单项
- **THEN** `onSelect` 动作执行时 `${event}` 为 `'edit'`

#### Scenario: 菜单项图标

- **WHEN** DropdownMenu（或 ContextMenu / Menubar / NavigationMenu）的菜单项声明 `icon: 'settings'`
- **THEN** 该项文字前渲染图标 svg

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
- **NumberInput**：`name` / `min` / `max` / `step` / `precision`，右侧带增加/减少步进按钮（到达边界禁用），onChange 传 number（清空传 undefined）。
- **Label**：`text`，独立使用的表单标签。
- **Field**：通用表单项容器（`label` / `description` / `error`），children 为控件 DSL 子树。
- **Calendar**：`name` / `mode`（single），onChange 传 ISO 日期字符串。
- **DatePicker**：`name` / `mode`（single/range）/ `presets` / `placeholder`，onChange 在 single 模式传 ISO 日期字符串、range 模式传 `{ start, end }` ISO 对象——范围类字段值一律采用 `{ start, end }` 对象约定。
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

#### Scenario: DatePicker range 值契约

- **WHEN** DSL 为 `{ type: 'DatePicker', props: { name: 'period', mode: 'range' }, events: { onChange: ... } }` 且用户选定起点与终点
- **THEN** onChange 动作执行时 `${event}` 为 `{ start: '<起点ISO>', end: '<终点ISO>' }` 对象

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
- **Command**：`groups`（`{ heading, items: [{ label, value, icon? }] }`，`icon` 为图标名（Icon 白名单），渲染于 label 前）/ `placeholder` / `onSelect`，支持搜索过滤。
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

- **Sidebar**：`brand`（`{ title, logo? }`）/ `items`（导航项 `{ label, href?, icon?, children? }`，`icon` 为图标名（Icon 白名单），渲染于 label 前）/ `collapsible` / children（主内容区）；渲染完整的侧栏+内容布局。
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

### Requirement: ChatInput 聊天输入组件

registry SHALL 注册 `ChatInput` 组件：AI 对话输入框的通用结构构件，嵌套两层结构——外层圆角容器（focus-within 高亮）内依次承载自适应高度 textarea、工具栏行与可选底部区（footer，带上分隔线）。组件 SHALL 提供 DSL props：`value`（受控值）/ `placeholder` / `disabled` / `rows`（最小行数）/ `hideSend`，以及槽位 props `toolbarStart` / `toolbarEnd`（DslNode，分别渲染在工具栏行左端与右端、内建发送钮之前）与 `footer`（DslNode，提供时渲染底部区）——工具栏与底部区内容完全由 DSL 自定义。组件 SHALL 内建圆形发送钮（空文本或 disabled 时禁用；`hideSend` 时省略）。视觉 MUST 只定义结构，颜色 MUST 消费 shadcn 语义令牌，MUST NOT 引入字面色值。

#### Scenario: 注册并渲染结构

- **WHEN** 页面 DSL 声明 `{ type: 'ChatInput', props: { placeholder: '今天帮你做些什么？' } }`
- **THEN** 渲染圆角容器内的多行输入区与工具栏行（含内建发送钮），placeholder 生效

#### Scenario: 槽位自定义

- **WHEN** props 提供 `toolbarStart` / `toolbarEnd` / `footer`（DslNode）
- **THEN** 分别渲染在工具栏行左端、右端（发送钮之前）与底部区（带上分隔线）

### Requirement: ChatInput 值与发送语义

`ChatInput` SHALL 支持受控（`value` + `onChange(value)`，变更只传出、显示值取自 props）与非受控（内部 state）两种模式；`onChange` 传出 string。`onSubmit(value)` SHALL 在点击发送钮或按下 Enter 时触发；Shift+Enter 换行不触发；IME 合成进行中 Enter MUST NOT 触发；trim 后为空白时 MUST NOT 触发且发送钮禁用；非受控模式发送后 SHALL 自动清空，受控模式的清空由调用方经 onSubmit 闭环处理。

#### Scenario: Enter 发送

- **WHEN** 输入文本后按 Enter
- **THEN** onSubmit 以该文本触发；非受控模式下输入框清空

#### Scenario: IME 与换行守卫

- **WHEN** IME 合成进行中按 Enter，或按 Shift+Enter
- **THEN** 均不触发 onSubmit（后者换行）

#### Scenario: 空文本禁发

- **WHEN** 输入为空白
- **THEN** 发送钮禁用，按 Enter 不触发 onSubmit

#### Scenario: 受控闭环

- **WHEN** DSL 以 `value: ${state.draft}` + `events.onChange → setState` 受控绑定
- **THEN** 输入经 setState 回写后正常显示，onSubmit 后组件不自行清空

### Requirement: ChatInput 顶部槽

`ChatInput` SHALL 提供 `header` 槽位 prop（DslNode，经 Renderer children 机制渲染）：提供时渲染在 textarea 上方的独立区域（与 `footer` 底部槽对称）；未提供时不渲染。该区域内容完全由 DSL 自定义（如附件卡片、上下文 chips 等输入上下文展示）。

#### Scenario: header 槽渲染

- **WHEN** props 提供 `header`（DslNode）
- **THEN** 其内容渲染在 textarea 上方、工具栏行之前

#### Scenario: 未提供不渲染

- **WHEN** 未提供 `header`
- **THEN** 不渲染顶部区域，结构退化为 textarea + 工具栏行（+ 可选 footer）

### Requirement: 数据录入补齐组件（第五批）

SHALL 提供以下数据录入 DSL 组件，全部 MUST 可在 Form 内按 `name` 参与表单值收集与校验（与 Input/Select 既有行为一致），也可独立使用：

- **Rate**：`name` / `count`（缺省 5）/ `allowHalf` / `value` / `disabled`，onChange 传 number。
- **TimePicker**：`name` / `format`（'HH:mm:ss' 缺省 / 'HH:mm'）/ `value` / `placeholder`，弹层内按时/分（/秒）列选择，onChange 传时间字符串。
- **ColorPicker**：`name` / `value`（hex，支持 3/4/6/8 位）/ `presets`（hex 数组）/ `disabled`；弹层为 Sketch 风格取色面板（饱和度/明度二维面板 + 色相/透明度滑杆 + 当前色预览 + hex 与 R/G/B/A 通道输入 + 预设色板），拖拽实时提交，onChange 传 hex 字符串（透明度小于 1 时为 8 位 hex）。
- **Upload**：`name` / `multiple` / `accept` / `maxSize` / `maxCount` / `drag`（拖拽区形态）/ `tip` / `disabled`；组件 MUST 仅负责选择、校验、列表与移除，MUST NOT 发起网络上传；onChange 传可序列化的文件元数据数组 `Array<{ name, size, type }>`。
- **TreeSelect**：`name` / `options`（嵌套 `{ label, value, children? }`）/ `placeholder` / `searchable`，单选，onChange 传选中节点 value。
- **Cascader**：`name` / `options`（同 TreeSelect）/ `placeholder`，onChange 传选中路径的 value 数组。
- **Transfer**：`name` / `options`（`{ label, value, disabled? }`）/ `titles`（左右标题），onChange 传目标侧 value 数组。
- **Mentions**：`name` / `options`（`{ label, value }`）/ `trigger`（缺省 `'@'`）/ `rows` / `placeholder`，输入触发字符后弹出候选，选中插入，onChange 传完整字符串。

#### Scenario: Form 内 Rate 收集

- **WHEN** Form 内 Rate 配置 `{ name: 'score', count: 5 }` 且用户点选第 4 星后提交
- **THEN** onSubmit 的 values.score 为 `4`

#### Scenario: Cascader 路径值

- **WHEN** Cascader 配置三级 options 且用户完成逐级选择
- **THEN** onChange 动作执行时 `${event}` 为各级 value 组成的路径数组

#### Scenario: Upload 校验与元数据

- **WHEN** Upload 配置 `accept: '.png'`、`maxCount: 2` 且用户选择超限或超类型文件
- **THEN** 不合规文件不进入列表；合规选择后 onChange 传出 `{ name, size, type }` 数组

#### Scenario: Mentions 触发插入

- **WHEN** Mentions 配置 options 且用户输入 `@` 后从候选中选中一项
- **THEN** 文本中插入 `@<value> ` 且 onChange 传出完整字符串

### Requirement: 数据展示补齐组件（第五批）

SHALL 提供以下数据展示 DSL 组件：

- **List**：`items`（`Array<{ key?, title, description?, avatar?, extra? }>`）/ `split` / `bordered`，纵向行式列表。
- **Tree**：`treeData`（`{ key, title, children? }`）/ `expandedKeys` / `selectedKeys` / `checkable` / `checkedKeys`，onSelect / onExpand / onCheck 均传 key 数组。
- **Descriptions**：`title` / `items`（`Array<{ label, value }>`）/ `column`（缺省 3）/ `bordered`，标签—值栅格。
- **Timeline**：`items`（`Array<{ content, time?, color?, icon? }>`）/ `pending`，按时间顺序展示事件流。
- **Image**：`src` / `alt` / `width` / `height` / `fallback` / `preview`（缺省 true，点击经弹层放大查看）。
- **QRCode**：`value` / `size`（缺省 128）/ `color` / `bgColor` / `bordered`，将内容编码为内联 SVG 二维码。
- **Segmented**：`name` / `options`（`{ label, value, icon?, disabled? }`）/ `value` / `disabled`，少量互斥项切换，onChange 传选中 value；可在 Form 内按 `name` 收集。

#### Scenario: Tree 受控选中

- **WHEN** DSL 为 `{ type: 'Tree', props: { treeData: [...], selectedKeys: '${state.sel}' }, events: { onSelect: ... } }` 且用户点击节点
- **THEN** onSelect 动作执行时 `${event}` 为选中 key 数组

#### Scenario: Segmented 切换

- **WHEN** Segmented 配置三个 options 且用户点击第二项
- **THEN** onChange 动作执行时 `${event}` 为该项 value

#### Scenario: QRCode 渲染

- **WHEN** DSL 为 `{ type: 'QRCode', props: { value: 'https://example.com', size: 96 } }`
- **THEN** 渲染包含 SVG 二维码的 96px 方块

### Requirement: 反馈补齐组件（第五批）

SHALL 提供以下反馈 DSL 组件：

- **Message**：`content` / `variant`（success/error/info/warning）/ `duration`；声明式触发器——`content` 变为非空字符串时 MUST 发出一条全局短 toast，渲染不可见标记节点。
- **Notification**：`title` / `description` / `variant` / `duration`；声明式触发器——`title` 变为非空时 MUST 发出一条含标题与说明的全局通知 toast。
- **Popconfirm**：`title` / `description` / `confirmText` / `cancelText` / `danger` + children（触发元素），就近确认；onConfirm / onCancel 触发后浮层 MUST 关闭。
- **Result**：`status`（success/error/info/warning/404/403/500）/ `title` / `subTitle` + children（操作区），汇总任务最终结果。
- **LoadingOverlay**：`loading` / `text` + children（被覆盖区块），loading 时以半透明层覆盖区块并居中显示加载指示。
- **Watermark**：`content`（string 或 string[]）/ `rotate` / `gap` + children，以平铺水印覆盖内容表面，MUST NOT 影响内容交互（pointer-events none）。
- **Tour**：`open` / `steps`（`Array<{ target, title, content }>`，`target` 为 CSS selector）/ `current`，分步引导；目标元素缺失时 MUST 居中兜底展示，onChange 传步骤序号，onClose 结束引导。

Message / Notification 的全局反馈 MUST 复用 vendored toast 原语（与 Sonner 同一 ToastManager），toast 原语 SHALL 支持 success/error/info/warning 四种 variant。

#### Scenario: Message 声明式触发

- **WHEN** DSL 为 `{ type: 'Message', props: { content: '${state.flash}', variant: 'success' } }` 且 `state.flash` 由空变为 `'已保存'`
- **THEN** 出现一条 success 全局短 toast

#### Scenario: Popconfirm 确认

- **WHEN** 用户点击 Popconfirm 触发元素后点击确认按钮
- **THEN** onConfirm 动作执行且浮层关闭

#### Scenario: Tour 目标缺失兜底

- **WHEN** Tour 某 step 的 `target` 选择器在页面中无匹配元素
- **THEN** 该步骤卡片居中展示，不抛错

