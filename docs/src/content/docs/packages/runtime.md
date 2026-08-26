---
title: pactor-runtime
description: Runtime 引擎——RuntimeContext、StateStore、DataSource 运行时、Action 引擎、React Renderer 与 PageRuntime
---

`pactor-runtime` 是框架的核心引擎层：把 PageDsl 运行起来。它组装 RuntimeContext、管理状态与数据源、执行事件与动作，并驱动 React 渲染。

```bash
pnpm add pactor-runtime react
```

`react >= 18` 为 peer dependency。非 React 部分（context / state / datasource / action）不 import react，可脱离 React 单独使用与测试。

## PageRuntime：完整运行链路

`createPageRuntime(pageDsl, options)` 依次完成：Schema 校验 → 创建 RuntimeContext → 注册内置动作 → 初始化 dataSources（autoLoad）→ 执行 onInit / onLoad 生命周期。

```tsx
import { createPageRuntime, PageRuntimeView } from 'pactor-runtime';

const runtime = createPageRuntime(pageDsl, {
  // 可选注入：services / components / actions / permission / router / http
});

runtime.context.components.register('Button', Button);
runtime.context.services.register('customer.list', fetchCustomers);

await runtime.initialized; // autoLoad + onInit + onLoad 执行完毕

<PageRuntimeView runtime={runtime} />;
```

- 校验失败抛出 `PageRuntimeError`，`error.errors` 为结构化错误列表（`path` / `message` / `keyword`）。
- 生命周期：`onInit` / `onLoad` 创建后自动执行；`ready()` / `show()` / `hide()` / `destroy()` 由宿主（Router）触发；`destroy()` 执行 `onDestroy` 并清理订阅。
- 渲染入口：`runtime.render()` 返回 React 元素，或直接使用 `<PageRuntimeView />`；未配置 `body` 时渲染为空。

## RuntimeContext 与 StateStore

```ts
import { createRuntimeContext } from 'pactor-runtime';

const context = createRuntimeContext({
  page: { id: 'customer-list' },
  state: { keyword: '' },
  permission: myPermissionAdapter, // 默认放行
  router: myRouterAdapter,         // 默认 no-op 并告警
  http: myHttpAdapter,             // 默认基于全局 fetch
});

context.state.set('user.name', 'Bob');   // 路径写入（不可变更新）
context.state.set({ count: 1 });         // 对象合并
context.state.get('user.name');          // 点路径读取
context.state.reset();                   // 恢复初始值
const off = context.state.subscribe(() => {/* ... */});
```

表达式求值作用域由 `buildScope(context, local?)` 组装：`state` / `data` 取当前值，`form` 为 state 的 `form` 路径别名（Form 提交后 `${form.x}` 可用），另含 `app` / `page` / `route` / `user` / `params`；局部作用域（`row` / `rowIndex` / `event` / `item`）覆盖同名全局键。

适配接口（`PermissionAdapter` / `RouterAdapter` / `HttpAdapter`）只定义最小契约，真实实现由 pactor-permission / pactor-router / 宿主应用注入。

## DataSource 运行时

支持 `static` / `service` / `http` 三种类型（`computed` / `resource` 留待后续迭代）：

```ts
const { data } = context;

data.get('customers');        // { loading, error, data }
data.getData('customers');    // 仅数据
await data.refresh('customers');
await data.reload();          // 缺省刷新全部 autoLoad 源
```

- `params` / `request` 中的表达式在每次加载前按当前作用域求值。
- 加载失败写入 `error` 状态，**不向渲染层抛出**。
- `service` 类型经 ServiceRegistry 解析服务名（如 `customer.list`），未注册时写入受控错误。
- `http` 类型经 HttpAdapter 发请求，测试时可注入 mock adapter。

## Action 引擎

执行管线：`condition` 求值（false 则跳过，返回 `{ ok: true, skipped: true }`）→ `permission` 检查（拒绝返回 `{ ok: false }`）→ ActionRegistry 执行。未注册动作返回受控失败，任何异常收敛为 `{ ok: false, error }`，不抛到 UI 层。

内置 8 个 UI 无关标准动作：

| 动作 | 说明 |
| --- | --- |
| `setState` | params 求值后合并进 StateStore |
| `resetState` | 重置 StateStore 到初始值 |
| `reload` | 刷新 `params.dataSource` 指定数据源，缺省刷新全部 autoLoad 源 |
| `request` | 经 HttpAdapter 发请求，结果写入 `params.target` 指定的 state 路径 |
| `sequence` | 串行执行 `params.actions`，任一失败中断 |
| `parallel` | 并行执行 `params.actions`，全部完成后返回 |
| `if` | 按 `params.condition` 执行 `then` / `else` |
| `delay` | 等待 `params.ms` 毫秒 |

`navigate` / `message` / `confirm` / `overlay.*` 依赖上层模块，由 pactor-router / pactor-ui 的 interaction 层注册。

## React Renderer

`<DslRenderer context={...} node={...} />` 把 DslNode 树渲染为 React 元素：

- 组件一律经 ComponentRegistry 解析；未注册类型渲染 `UnsupportedComponent` 占位（展示类型名），不抛错。
- props 深度表达式解析：字符串经模板求值（整体单表达式保留原始类型），对象 / 数组递归；`on*` 字符串 prop 原样保留。
- `when` 为 false 时渲染 null。
- `events.onClick` 等绑定为同名 prop，事件对象放入 `event` 作用域，动作数组串行执行。
- 任一 state / data 变化重渲染整棵 DSL 树（V1 简化策略）。

子作用域：以 `{ component, withScope: true }` 注册的组件经 `useRenderer().renderChildren` 自行渲染 children 并注入局部作用域（Table 行、Repeat 项等）：

```tsx
import { useRenderer } from 'pactor-runtime';

function Table({ dslChildren }) {
  const { renderChildren } = useRenderer();
  return rows.map((row, rowIndex) => (
    <div key={rowIndex}>{renderChildren(dslChildren, { row, rowIndex })}</div>
  ));
}

context.components.register('Table', { component: Table, withScope: true });
```

另提供 `useRuntimeState(path?)` / `useDataSource(name)` hooks（基于 `useSyncExternalStore`）供组件直接订阅状态。

:::note
本包不内置任何具体组件。Level 1+ 组件由 pactor-ui 的 components 层提供，经 ComponentRegistry 注册即可被 Renderer 渲染。
:::
