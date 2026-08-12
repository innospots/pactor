# Spec: builtin-components

V1 基础组件目录与 antd 适配约定（`pactor-ui-antd` components 层）。DSL 只暴露框架级 props，不直接暴露 antd 原生 API。

### Requirement: 组件注册入口

模块 SHALL 提供 `registerBuiltinComponents(registry)` 与 `createBuiltinComponentRegistry()`，按 DSL 类型名注册全部 V1 组件：Page、Grid、Flex、Card、Button、Alert、Statistic、Tabs、Table、Form、Input、Select。

#### Scenario: 注册后全部类型可解析

- **WHEN** 调用 `createBuiltinComponentRegistry()` 后查询上述 12 个类型名
- **THEN** 每个 `has(type)` 均为 `true`

#### Scenario: 与 Renderer 端到端渲染

- **WHEN** 在 PageRuntime 中注册内置组件并渲染含 Button/Card 的 PageDsl body
- **THEN** 页面中出现对应 antd 组件

### Requirement: DSL props 到 antd 的适配映射

组件 MUST 以框架级 props 为 DSL 协议，由适配器映射到 antd props；MUST NOT 把 antd 专有 props 名直接作为 DSL 协议暴露。

#### Scenario: Button variant 映射

- **WHEN** DSL 为 `{ type: 'Button', props: { text: '保存', variant: 'primary' } }`
- **THEN** 渲染为 antd primary 按钮且文本为"保存"

#### Scenario: 尺寸与禁用等通用 props

- **WHEN** DSL props 含 `size: 'small'`、`disabled: true`
- **THEN** 组件以对应 antd 尺寸与禁用态渲染

### Requirement: 事件值规范化

组件触发事件时 MUST 向事件回调传递 DSL 层有意义的值而非原生 DOM 事件：Input 传 `value: string`，Select 传选中 `value`，Form 传 `values`，Table 分页传 pagination 信息。

#### Scenario: Input onChange 传值

- **WHEN** Input 配置了 `events.onChange` 动作且用户输入文本
- **THEN** 动作执行时 `event` 作用域的值（`${event}`）为输入的字符串

#### Scenario: Button onClick 触发动作

- **WHEN** Button 配置 `events.onClick` 动作并点击
- **THEN** 动作被执行

### Requirement: 展示与布局组件

- **Page**：SHALL 渲染可选 `title` 与 children 内容区。
- **Card**：SHALL 支持 `title`、`bordered` 与 children。
- **Alert**：SHALL 支持 `message`、`description`、`variant`（success/info/warning/error）。
- **Statistic**：SHALL 支持 `title`、`value`（可为表达式解析后的数字）、`precision`、`suffix`。
- **Grid**：SHALL 按 `columns`（默认 1）与 `gap` 把 children 均分栏渲染。
- **Flex**：SHALL 支持 `direction`、`gap`、`justify`、`align`。

#### Scenario: Alert 渲染变体

- **WHEN** DSL 为 `{ type: 'Alert', props: { message: '操作成功', variant: 'success' } }`
- **THEN** 渲染 success 样式的 Alert

#### Scenario: Grid 两列布局

- **WHEN** Grid 配置 `columns: 2` 且有两个 children
- **THEN** 两个子组件各占半行渲染

#### Scenario: Statistic 表达式值

- **WHEN** Statistic 的 `value` 为 `"${data.summary.total}"` 且数据已加载
- **THEN** 渲染该数值

### Requirement: Tabs 容器

Tabs SHALL 接受 `items` prop（`Array<{ key, label, children?: DslNode[] }>`），每个 pane 的内容经 Renderer children 机制渲染。

#### Scenario: Tabs pane 渲染 DSL 子树

- **WHEN** Tabs 某 item 的 children 为含 Button 的 DslNode 数组
- **THEN** 该 pane 中渲染出 Button

### Requirement: Input 输入类型

Input SHALL 支持框架级 `type` prop，取值为 `'text' | 'password'`，缺省 `text`；`password` 时输入内容 MUST 以掩码呈现（Form 内表单项与独立控件行为一致）。DSL MUST NOT 直接暴露 antd 原生类型名以外的自由 HTML type。

#### Scenario: 缺省为文本输入

- **WHEN** DSL 为 `{ type: 'Input', props: { name: 'keyword' } }`（未声明 type）
- **THEN** 渲染普通文本输入框，输入内容明文可见

#### Scenario: Form 内密码输入

- **WHEN** Form 内 Input 配置 `{ name: 'password', label: '密码', type: 'password' }`
- **THEN** 渲染为密码输入框，输入内容以掩码显示，提交时 values.password 为实际字符串

#### Scenario: 独立密码输入

- **WHEN** Input 不在 Form 内且 props 含 `type: 'password'`
- **THEN** 渲染掩码输入框，onChange 仍传出 string 值
