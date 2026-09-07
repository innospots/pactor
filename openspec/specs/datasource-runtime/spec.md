# Spec: datasource-runtime

## Purpose

DataSource 运行时：按类型加载数据并维护 `loading / error / data` 状态（`@pactor-app/runtime`）。


## Requirements

### Requirement: DataStore 状态管理

DataStore SHALL 按数据源名维护 `{ loading, error, data }` 状态，提供 `get(name)` / `getData(name)` / `subscribe(listener)` / `refresh(name)` / `reload(name)`。加载开始 MUST 置 `loading: true` 且清空 `error`；成功写入 `data`；失败写入 `error` 且 MUST NOT 抛出到调用方渲染层。

#### Scenario: 加载成功的状态流转

- **WHEN** 触发某数据源加载并成功返回
- **THEN** 期间 `loading` 为 `true`，完成后 `loading` 为 `false`、`data` 为返回值、`error` 为 undefined

#### Scenario: 加载失败写入 error

- **WHEN** 数据源加载抛错或 reject
- **THEN** `loading` 为 `false`，`error` 包含该错误，Promise 不向渲染层抛出未捕获异常

### Requirement: static 类型数据源

`type: static` 的数据源 SHALL 以配置中的 `value` 作为数据，加载立即完成。

#### Scenario: static 数据立即可用

- **WHEN** 定义 `static` 数据源且 `value` 为任意 JSON 值，触发加载
- **THEN** `getData(name)` 返回该 `value`

### Requirement: service 类型数据源

`type: service` 的数据源 SHALL 通过 ServiceRegistry 解析 `service` 名（如 `customer.list`）并调用，调用参数为 `params` 经当前表达式作用域求值后的结果。服务未注册时 MUST 以受控错误写入 `error` 状态。

#### Scenario: 调用已注册服务

- **WHEN** 注册 `customer.list` 服务，数据源 params 含 `keyword: '${state.keyword}'`，state.keyword 为 `'张'`，触发加载
- **THEN** 服务被以 `{ keyword: '张' }` 调用，返回值写入 `data`

#### Scenario: 服务未注册

- **WHEN** 加载一个 service 名未注册的数据源
- **THEN** `error` 状态包含受控错误，不抛出

### Requirement: http 类型数据源

`type: http` 的数据源 SHALL 通过 HttpAdapter 发起请求：`method` / `url` / `params` / `headers` / `body` 来自配置的 `request` 字段，其中表达式在每次加载前求值。

#### Scenario: http 请求参数求值

- **WHEN** request.params 含 `${state.page}`，触发加载
- **THEN** HttpAdapter 收到的 config 中该参数为当前 state.page 的值

### Requirement: autoLoad 与手动刷新

PageRuntime 初始化时 MUST 触发所有 `autoLoad: true` 的数据源。`refresh(name)` / `reload(name)` MUST 重新执行加载（reload 语义同 refresh，供 Action 引擎调用；`reload()` 缺省参数刷新全部 autoLoad 源）。

#### Scenario: autoLoad 数据源自动加载

- **WHEN** PageDsl 中某数据源 `autoLoad: true`，PageRuntime 完成初始化
- **THEN** 该数据源已触发一次加载

#### Scenario: 缺省 reload 全部 autoLoad 源

- **WHEN** 调用 `reload()` 且存在两个 autoLoad 数据源与一个非 autoLoad 数据源
- **THEN** 两个 autoLoad 源重新加载，非 autoLoad 源不加载

### Requirement: 选项字段映射

dataSource 声明 `valueField` / `labelField` / `disabledField` 时，DataStore SHALL 在加载结果为数组时对每项归一化：`label` 取 `labelField`（缺省 `label`）、`value` 取 `valueField`（缺省 `value`）、`disabled` 取 `disabledField` 的真值（未声明时取项自身 `disabled`）；原字段 MUST 经展开保留。未声明任一映射字段、或加载结果非数组时 MUST 原样返回。

#### Scenario: 声明映射后归一化

- **WHEN** 数据源声明 `valueField: code`、`labelField: name`、`disabledField: off`，加载返回 `[{ code, name, off }]`
- **THEN** `data` 中每项为原字段加 `{ label, value, disabled }` 归一化键

#### Scenario: 未声明映射时原样返回

- **WHEN** 数据源未声明任何映射字段
- **THEN** `data` 与加载结果完全一致（引用不变）
