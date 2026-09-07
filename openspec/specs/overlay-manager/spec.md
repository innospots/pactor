# Spec: overlay-manager

## Purpose

Overlay 堆栈状态与 Promise 模型（`pactor-ui-antd` interaction 层，零 React）。


## Requirements

### Requirement: Overlay 打开与堆栈

`OverlayManager.open(config)` SHALL 把条目（含生成的 id、type/title/width/content/page/params）压入堆栈并通知订阅者；支持连续打开多个（嵌套）。`stack()` 返回当前堆栈快照。

#### Scenario: 打开后堆栈可见

- **WHEN** open 一个 modal 与一个 drawer
- **THEN** stack() 含两个条目，顺序为打开顺序，各自有唯一 id

### Requirement: open 的 Promise 模型

`open` SHALL 返回 Promise；`close` 时以其 payload resolve。约定：主动 `close(id, payload)` 原样 resolve payload；UI 取消（X/蒙层）resolve `{ success: false }`。

#### Scenario: close 携带 payload

- **WHEN** open 后调用 close(id, { success: true, userId: 1001 })
- **THEN** open 返回的 Promise resolve 为该 payload，条目从堆栈移除

#### Scenario: 取消语义

- **WHEN** 以取消方式关闭（无 payload）
- **THEN** Promise resolve `{ success: false }`

#### Scenario: 缺省关闭栈顶

- **WHEN** 连续打开两个后调用 close()（不传 id）
- **THEN** 栈顶条目被关闭

### Requirement: 订阅

`subscribe(listener)` SHALL 在 open/close 时通知，返回退订函数。

#### Scenario: 通知与退订

- **WHEN** 订阅后 open、close，再退订后 open
- **THEN** 前两次各通知一次，退订后不再通知

### Requirement: parent 作用域

open 可携带 `parentScope`（打开时父页面作用域快照）；`parentScopeOf(id)` SHALL 返回该快照，供 overlay 内容以 `parent` 键访问（只读约定）。

#### Scenario: 记录并读取 parent 快照

- **WHEN** open 时传入 parentScope 含 state 快照
- **THEN** parentScopeOf(id) 返回该对象
