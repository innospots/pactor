# @pactor-app/runtime

[Pactor](https://github.com/426-330/pactor) 的运行时引擎包：把 PageDsl 运行起来——RuntimeContext 组装、StateStore、DataSource 运行时、Action 引擎、React Renderer 与 PageRuntime 完整链路。

## 安装

```bash
npm install @pactor-app/runtime react
# 或
pnpm add @pactor-app/runtime react
```

`react >= 18` 为 peer dependency。非 React 部分（context / state / datasource / action）零 React 依赖，可脱离 React 单独使用与测试。

## 示例

```tsx
import { createPageRuntime, PageRuntimeView } from '@pactor-app/runtime';

const runtime = createPageRuntime(pageDsl, {
  // 可选：注入自定义 Registry / Adapter
  // services / components / permission / router / http ...
});

// 注册组件与服务
runtime.context.components.register('Button', Button);
runtime.context.services.register('customer.list', async (params) => fetchList(params));

await runtime.initialized; // autoLoad + onInit + onLoad 完成

// React 渲染入口
<PageRuntimeView runtime={runtime} />;

// 宿主（Router）触发生命周期
await runtime.show();
await runtime.destroy();
```

## 功能一览

- **RuntimeContext**：`createRuntimeContext(options)` 组装 `app / page / state / data / route / user / services / components / actions / permission / capabilities`，支持注入自定义 Registry 与 Adapter（permission 默认放行、navigate 默认 no-op、http 默认基于全局 fetch，可替换）。
- **StateStore**：框架无关的最小状态容器，`getState() / get('a.b.c') / set(patch) / set('a.b', v) / reset() / subscribe()`，全部不可变更新。
- **DataSource 运行时**：`static / service / http` 三种类型，`autoLoad`、`loading / error / data` 状态、params 表达式求值、`refresh(name)` / `reload(name?)`；错误写入 `error` 状态，不抛到渲染层。
- **Action 引擎**：`condition` 跳过 → `permission` 拦截 → Registry 执行的管线，全程受控返回 `{ ok, data?, error?, skipped? }`；内置 UI 无关动作 `setState / resetState / reload / request / sequence / parallel / if / delay`。
- **React Renderer**：`<DslRenderer>` 递归渲染 DSL 树——props 深度表达式解析、`when` 条件渲染、`events` 绑定（事件对象注入 `event` 作用域）、未注册组件渲染 `UnsupportedComponent` 占位、`withScope` 子作用域机制（`useRenderer().renderChildren(children, { row, rowIndex })`）。
- **PageRuntime**：`createPageRuntime(pageDsl)` 完成 校验（失败抛 `PageRuntimeError`）→ 上下文组装 → autoLoad → 生命周期的完整链路。

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
