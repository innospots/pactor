# Spec: shadcn-extended-components

## MODIFIED Requirements

### Requirement: 扩展组件注册入口

`builtinComponents` 注册表与 `createComponentRegistry()` SHALL 在既有 20 个类型之外注册全部扩展组件类型：展示类（Badge、Avatar、Skeleton、Separator、Kbd、Spinner、Empty、AspectRatio、Tooltip、HoverCard、Progress、Icon）、导航类（Breadcrumb、Pagination、Menubar、NavigationMenu、DropdownMenu、ContextMenu）、表单类（Textarea、Checkbox、RadioGroup、Switch、Slider、NumberInput、Label、Field、Calendar、DatePicker、InputOTP、Combobox）、反馈与弹层类（Dialog、AlertDialog、Drawer、Sheet、Popover、Sonner、Accordion、Collapsible）、复合类（Carousel、Command、Resizable、ScrollArea、Toggle、ToggleGroup、ButtonGroup、InputGroup、Item、Typography）、页面级组合类（Sidebar、DataTable、Chart）、业务刚需类第五批（TreeSelect、Cascader、Rate、TimePicker、ColorPicker、Upload、Transfer、Mentions、List、Tree、Descriptions、Timeline、Image、QRCode、Segmented、Message、Notification、Popconfirm、Result、LoadingOverlay、Watermark、Tour）。扩展类型 MUST NOT 与既有 20 个类型重名冲突（重名者沿用既有实现，如 Alert/Card/Tabs）。

#### Scenario: 注册后全部扩展类型可解析

- **WHEN** 调用 `createComponentRegistry()` 后逐一查询上述扩展类型名
- **THEN** 每个 `has(type)` 均为 `true`

#### Scenario: 既有类型不受影响

- **WHEN** 对比注册表中既有 20 个类型的组件实现
- **THEN** 与本变更前完全一致

## ADDED Requirements

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
