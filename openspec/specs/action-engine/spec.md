# Spec: action-engine

Action 引擎：Action Registry、动作编排执行、内置标准动作、condition/permission 前置拦截（`@pactor-app/runtime`）。

### Requirement: Action 注册与执行

引擎 SHALL 基于 Registry 管理 ActionHandler，提供 `execute(action, options?)`。执行流程 MUST 为：求值 `condition`（false 则跳过，返回 `{ ok: true, skipped: true }`）→ 检查 `permission`（拒绝则返回 `{ ok: false }`）→ 查找并执行 handler。未注册动作 MUST 返回受控失败结果 `{ ok: false, error }`，MUST NOT 抛出未捕获异常到 UI 层。`permission` 检查 MUST 支持 `PermissionConfig` 的三种形态：权限码字符串、权限码数组（数组语义为 hasAny，任一命中即放行）、对象形式 `{ code, denied }`（仅判定 `code`，`denied` 策略由 Renderer 层处理，引擎不参与）。

#### Scenario: 执行已注册动作

- **WHEN** 注册动作 `my.action` 后执行 `{ action: 'my.action', params: {...} }`
- **THEN** handler 被调用，params 中的表达式已按当前作用域求值

#### Scenario: 未注册动作受控失败

- **WHEN** 执行未注册的 `ghost.action`
- **THEN** 返回 `{ ok: false }` 且 error 指明动作未注册，不抛出

#### Scenario: condition 为 false 跳过

- **WHEN** 动作配置 `condition: "${state.ready}"` 且 state.ready 为 false
- **THEN** handler 不被调用，返回 `skipped: true`

#### Scenario: permission 拒绝拦截

- **WHEN** PermissionAdapter 对某权限码返回 false，且动作配置该 permission
- **THEN** handler 不被调用，返回 `{ ok: false }`

### Requirement: 命名动作结果作用域

配置 `id` 的动作执行完成后，引擎 SHALL 将结果数据记录到表达式作用域 `actions.<id>`：成功时为返回数据，失败时为 `{ ok: false, error }`。未配置 `id` 的动作 MUST 保持原有行为，不写入 `actions` 作用域。

#### Scenario: 命名动作结果写入作用域

- **WHEN** 执行 `{ id: 'loadDetail', action: 'request', params: { url: '/api/detail' } }` 且请求成功返回 `{ id: 1 }`
- **THEN** 后续动作与节点表达式可通过 `${actions.loadDetail.id}` 取得 `1`

#### Scenario: 命名动作失败记录错误

- **WHEN** 命名动作 `loadDetail` 执行失败
- **THEN** `actions.loadDetail` 为 `{ ok: false, error }`，表达式可读取 error 信息

### Requirement: setState / resetState 动作

`setState` SHALL 将 `params`（不含保留字段）经表达式求值后合并进 StateStore；`resetState` SHALL 重置 StateStore 到初始值。

#### Scenario: setState 合并求值后的参数

- **WHEN** 执行 `{ action: 'setState', params: { count: '${state.count + 1}' } }`
- **THEN** state.count 增加 1

### Requirement: reload 动作

`reload` SHALL 刷新 `params.dataSource` 指定的数据源；缺省时刷新全部 autoLoad 数据源。

#### Scenario: 指定数据源 reload

- **WHEN** 执行 `{ action: 'reload', params: { dataSource: 'users' } }`
- **THEN** 仅 `users` 数据源重新加载

### Requirement: request 动作

`request` SHALL 通过 HttpAdapter 发起请求（`params.method` / `url` / `params` / `body`），成功结果写入 `params.target` 指定的 state 路径；失败返回 `{ ok: false }` 且 MUST NOT 抛出。

#### Scenario: 请求结果写入 state

- **WHEN** 执行 `{ action: 'request', params: { url: '/api/x', target: 'state.detail' } }` 且 adapter 返回 `{ id: 1 }`
- **THEN** `state.detail` 为 `{ id: 1 }`

### Requirement: 编排动作 sequence / parallel / if / delay

- `sequence`：SHALL 串行执行 `params.actions`，任一失败 MUST 中断并返回失败。
- `parallel`：SHALL 并行执行 `params.actions`，全部完成后返回。
- `if`：SHALL 求值 `params.condition`，为真执行 `params.then` 否则执行 `params.else`（均可为单个或数组）。
- `delay`：SHALL 等待 `params.ms` 毫秒后返回成功。

#### Scenario: sequence 遇失败中断

- **WHEN** sequence 的第二个动作失败
- **THEN** 后续动作不执行，返回 `{ ok: false }`

#### Scenario: if 分支

- **WHEN** `if` 的 condition 求值为 false 且配置了 else
- **THEN** 仅 else 分支动作执行

### Requirement: 事件动作数组串行

Renderer 触发的 `events` 中 Action 数组 MUST 按声明顺序串行执行。

#### Scenario: onClick 多动作顺序执行

- **WHEN** 某节点 `events.onClick` 配置两个动作
- **THEN** 第一个完成后再执行第二个
