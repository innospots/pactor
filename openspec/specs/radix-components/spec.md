# Spec: radix-components

12 个 DSL 组件的 Radix Primitives 实现（`pactor-ui-radix` components 层），与 pactor-ui-antd（components 层，antd 版）契约一致。

### Requirement: 契约一致性

Radix 实现 SHALL 复用 pactor-ui-antd（components 层）导出的 props 契约类型（`ButtonProps` / `FormProps` / `TableProps` 等），注册类型名集合与 antd 版完全一致：Page、Grid、Flex、Card、Button、Alert、Statistic、Tabs、Form、Input、Select。事件值语义一致（Input onChange 传 string、Select 传 value、Form onSubmit 传 values、Button onClick 触发）。

#### Scenario: 类型名集合一致

- **WHEN** 比较 createRadixComponentRegistry() 与 createBuiltinComponentRegistry() 的 list()
- **THEN** 两个集合相等

#### Scenario: DSL 零修改双实现运行

- **WHEN** 同一份含 Button/Form/Table 的 PageDsl 分别以两个注册表渲染
- **THEN** 两者均正常渲染且事件行为一致

### Requirement: 展示与布局组件

Page（title + children）、Card（title/bordered）、Alert（message/description/variant 四态）、Statistic（title/value/precision/suffix）、Grid（columns/gap 均分栏）、Flex（direction/gap/justify/align）SHALL 以语义 class 原生元素实现，行为与 antd 版 spec 一致。

#### Scenario: Alert 变体 class

- **WHEN** 渲染 `{ message: '操作成功', variant: 'success' }`
- **THEN** 出现含 success 语义 class 的 alert 元素与文本

#### Scenario: Grid 两列

- **WHEN** Grid columns 为 2 且有两个 children
- **THEN** 两个子项以两列布局 class 渲染

### Requirement: 表单组件（Radix Form）

Form/Input/Select SHALL 复现 form-container spec 语义：Form 内声明 `name` 的字段自动成为表单项（label/规则生效）；`rules` 至少支持 required + message，校验失败阻止提交并展示错误；提交成功以 values 调 onSubmit 并写入 state `form` 路径；不在 Form 内的 Input/Select 独立受控渲染。

#### Scenario: required 拦截提交

- **WHEN** 必填字段未填写点击 submit 按钮
- **THEN** 显示错误文案，onSubmit 不触发

#### Scenario: 提交与 form 作用域

- **WHEN** 填写后提交
- **THEN** onSubmit 收到 values，且页面 `${form.<field>}` 表达式可用

#### Scenario: Select 选项与选择

- **WHEN** Select 配置两个 options 并选择其一
- **THEN** onChange 传出对应 value

### Requirement: Tabs 与 Table

Tabs SHALL 支持 `items`（key/label/children DslNode[]），pane 经 renderChildren 渲染。Table SHALL 支持 columns（title/dataIndex/width/cell）、dataSource、rowKey 默认 'id'、loading、简化分页（pageSize）；`cell` 行模板经 renderChildren 注入 `{ row, rowIndex }`；空数据渲染空态。

#### Scenario: Tabs pane 渲染 DSL 子树

- **WHEN** 某 item children 含 Button
- **THEN** 切换/渲染该 pane 时出现 Button

#### Scenario: Table cell 行模板

- **WHEN** 某列 cell 为按钮且 onClick 写 `${row.id}` 到 state，点击第二行
- **THEN** state 被设为第二行 id

### Requirement: 样式表

包 SHALL 提供 `styles.css`（`.pcr-*` 语义 class，token 化主题体系——组件规则经 `--pcr-*` CSS 变量取值，含默认 light 皮肤与 `[data-pactor-theme='dark']` 暗色皮肤，详见 radix-theme spec）并通过 exports 暴露；组件 MUST 使用语义 class 而非内联大样式。

#### Scenario: 样式入口可用

- **WHEN** 查看包 exports
- **THEN** 存在 `./styles.css` 入口

### Requirement: Input 输入类型（Radix 复现）

Radix Input SHALL 复现 builtin-components 的 `type` 语义：复用同一 `InputProps` 契约，`type: 'password'` 时原生 `<input>` 以 `type="password"` 渲染（Form 内外一致），缺省为文本输入；事件值语义不变（onChange 传 string）。

#### Scenario: 密码掩码渲染

- **WHEN** DSL 为 `{ type: 'Input', props: { name: 'password', type: 'password', label: '密码' } }` 置于 Form 内
- **THEN** 渲染出的 input 元素 `type` 属性为 `password`，输入内容掩码显示

#### Scenario: 缺省 text 与 antd 版一致

- **WHEN** 同一份未声明 type 的 Input DSL 分别以双 kit 渲染
- **THEN** 两者均为明文文本输入
