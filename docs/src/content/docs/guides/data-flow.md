---
title: 数据流
description: DSL 如何加载、数据在框架里怎么流、什么时候重渲染——读懂 ${state.x} / ${data.x} / ${actions.x} 的来龙去脉
---

读 DSL 时最常见的问题是"这个 `${data.todos}` 从哪来、什么时候更新、更新后谁重渲染"。本页把数据通路一次讲清。

## 加载链路

```text
createPactorApplication({ loader | api })
        │  mount()
        ▼
bootstrap 资源 ── app 信息 / user / permissions / menus / layout / pageVersions
        │
        ▼  路由命中菜单项（path → pageId）
页面 DSL（pageId + version，经 loader 加载、带缓存）
        │
        ▼  createPageRuntime
PageRuntime ── state 初始化 → dataSources（autoLoad）加载 → 生命周期 onInit / onLoad
        │
        ▼
React Renderer 渲染 body 子树
```

- **bootstrap**：应用的"目录"——有哪些页面、什么布局、用户有什么权限。真实项目由服务端下发；本地开发用 `StaticDslLoader` 直接喂入。
- **页面 DSL**：`pageId@version` 经 ResourceLoader 加载（HTTP 或静态），带 ETag 缓存与 inflight 去重（见 [@pactor/resource](/packages/resource/)）。
- **PageRuntime**：每个页面实例持有独立的 StateStore 与 DataStore。

## 四条数据通路

| 作用域键 | 谁写入 | 何时更新 | 典型消费方 |
| --- | --- | --- | --- |
| `${state.x}` | DSL `state:` 初始值；`setState` / `form.setValues` 之外的写入都走动作 | 动作执行时同步更新 | 任何 props 表达式（选项、禁用、显隐、文案） |
| `${data.x}` | `dataSources:` 声明的源（service / http / static） | `autoLoad` 页面初始化、显式 `reload` 动作 | Table dataSource、Select options、统计数值 |
| `${actions.x}` | 命名动作（带 `id` 的动作）的返回结果 | 该动作执行完成时 | 后续动作的 `if` 条件、payload 判断 |
| `${params.x}` | 路由 params；overlay 打开时注入的 params | 路由变化 / overlay.open 时 | 详情页取 id、overlay 回填初始值 |

局部作用域（覆盖同名全局键）：

| 键 | 产生的上下文 |
| --- | --- |
| `${event}` | 事件回调：Input onChange 传 string、Select onChange 传 value、Form onSubmit 传 values、Button onClick 无参 |
| `${row}` / `${rowIndex}` | Table 列的 `cell` 行模板（由 Table 经 renderChildren 注入） |
| `${form.x}` | `state.form` 别名，Form 提交时写入 |
| `${parent.x}` | overlay 内容中访问父页面作用域快照 |

## 重渲染模型

规则只有一条：**Renderer 根节点订阅 StateStore 与 DataStore 的版本号，任一变化重渲染整棵 DSL 子树**（OverlayHost 同样订阅，所以抽屉/弹层里的表达式也随 state/data 更新）。

推论：

- 想让界面某处更新，就写 state（`setState`）或刷新数据（`reload`）——表达式会在下一轮渲染自动取到新值，**不需要**手动操作组件；
- 动作执行本身不触发重渲染，动作**产生的 state/data 变化**才触发；
- `form.setValues` 写表单值不写 state，不触发校验与 `onValuesChange`；若希望选项联动反映在界面，配合 `setState` 更新选项源。

## 走查一：查询表单提交

```yaml
events:
  onSubmit:
    - action: setState
      params: { keyword: ${event.keyword} }
    - action: reload
      params: { dataSource: todos }
```

1. Form 校验通过 → 动作引擎执行 onSubmit 动作数组，`event` = 表单 values（同时写入 `state.form`）；
2. `setState` 把 `${event.keyword}` 求值后合并进 StateStore → **触发重渲染**；
3. `reload` 重新调用 `todo.list`（params 里 `${state.keyword}` 此时已是新值）→ DataStore 版本+1 → **再次触发重渲染**，Table 的 `${data.todos}` 拿到新数据。

## 走查二：抽屉编辑保存

```yaml
- id: editResult
  action: overlay.open
  params:
    overlay:
      type: drawer
      params: { id: ${row.id}, name: ${row.name} }
      content: { type: Form, ... }
- action: if
  params:
    condition: ${actions.editResult.success}
    then: [{ action: reload, params: { dataSource: customers } }]
```

1. 行内按钮 onClick：`overlay.open` 以 **命名动作**（`id: editResult`）挂起，等待 overlay 关闭；
2. 抽屉内 Form 的 props 经 `${params.name}` 取到打开时注入的行数据（回填初始值）；
3. 抽屉内提交 → `service.call` 更新成功 → `overlay.close` 带 payload `{ success: true }`；
4. payload 成为 `editResult` 的结果，`${actions.editResult.success}` 为真 → `reload` 刷新列表。

要点：**命名动作的结果是后续动作的数据源**；overlay 是"异步动作"，其 close payload 即返回值。

## 与服务端的关系

框架不规定后端形态，只有两条 HTTP 约定：

- DSL 资源：`api.baseURL` + ResourceLoader 协议（bootstrap / 页面 DSL / ETag 缓存）；
- 业务数据：`type: http` 数据源或 `request` 动作（经 HttpAdapter，`authTokenProvider` 注入令牌）；业务 service（`type: service`）则是纯前端函数注入，发不发 HTTP 由你的 handler 决定。
