## MODIFIED Requirements

### Requirement: 展示与布局组件

- **Page**：SHALL 渲染可选 `title` 与 children 内容区。
- **Card**：SHALL 支持 `title`、`bordered`、`rounded`（圆角档位：`'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'`，缺省 `'lg'`——即 `--radius` 基准值，随皮肤令牌变化）与 children。
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

#### Scenario: Card 圆角档位

- **WHEN** DSL 为 `{ type: 'Card', props: { rounded: 'sm', title: '紧凑卡片' } }`
- **THEN** 卡片根节点类名含 `rounded-sm`；未声明 `rounded` 时为 `rounded-lg`（--radius 基准）
