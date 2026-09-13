## MODIFIED Requirements

### Requirement: 扩展组件注册入口

`builtinComponents` 注册表与 `createComponentRegistry()` SHALL 在既有 20 个类型之外注册全部扩展组件类型：展示类（Badge、Avatar、Skeleton、Separator、Kbd、Spinner、Empty、AspectRatio、Tooltip、HoverCard、Progress、Icon）、导航类（Breadcrumb、Pagination、Menubar、NavigationMenu、DropdownMenu、ContextMenu）、表单类（Textarea、Checkbox、RadioGroup、Switch、Slider、Label、Field、Calendar、DatePicker、InputOTP、Combobox）、反馈与弹层类（Dialog、AlertDialog、Drawer、Sheet、Popover、Sonner、Accordion、Collapsible）、复合类（Carousel、Command、Resizable、ScrollArea、Toggle、ToggleGroup、ButtonGroup、InputGroup、Item、Typography）、页面级组合类（Sidebar、DataTable、Chart）。扩展类型 MUST NOT 与既有 20 个类型重名冲突（重名者沿用既有实现，如 Alert/Card/Tabs）。

#### Scenario: 注册后全部扩展类型可解析

- **WHEN** 调用 `createComponentRegistry()` 后逐一查询上述扩展类型名
- **THEN** 每个 `has(type)` 均为 `true`

#### Scenario: 既有类型不受影响

- **WHEN** 对比注册表中既有 20 个类型的组件实现
- **THEN** 与本变更前完全一致

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
