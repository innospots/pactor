# Spec: table-component

## Purpose

Table 组件：列定义、数据绑定、`cell` 行模板与 row/rowIndex 子作用域（`pactor-ui-antd` components 层）。


## Requirements

### Requirement: 列定义与数据绑定

Table SHALL 接受 `columns`（`Array<{ title, dataIndex?, width? }>`）与 `dataSource`（数组，通常为 `${data.xxx}` 表达式解析结果）props；`rowKey` 默认 `'id'`；`loading` 接受布尔值；`pagination` 接受 `false` 或 `{ pageSize }`。

#### Scenario: 渲染数据行

- **WHEN** dataSource 为两条记录且 columns 定义两列
- **THEN** 表格渲染两行两列，单元格为 record[dataIndex] 的值

#### Scenario: 空数据

- **WHEN** dataSource 为空数组
- **THEN** 渲染 antd 空态而非报错

### Requirement: cell 行模板

列定义支持可选 `cell: DslNode`；该列的每个单元格 MUST 经 Renderer 子作用域机制渲染，作用域注入 `row`（当前行记录）与 `rowIndex`。

#### Scenario: cell 模板访问 row

- **WHEN** 某列 cell 为 `{ type: 'Button', props: { text: '编辑' }, events: { onClick: { action: 'setState', params: { editing: '${row.id}' } } } }` 并点击第二行的该按钮
- **THEN** state.editing 被设为第二行记录的 id

#### Scenario: rowIndex 注入

- **WHEN** cell 模板 props 引用 `${rowIndex}`
- **THEN** 第一行单元格中该值为 0

### Requirement: 分页与加载态

配置 `pagination: { pageSize: 10 }` 时 SHALL 启用 antd 分页；`loading: true` 时 SHALL 展示加载态。

#### Scenario: 分页配置生效

- **WHEN** 配置 pageSize 为 1 且 dataSource 有两条记录
- **THEN** 仅渲染第一行，并出现分页器
