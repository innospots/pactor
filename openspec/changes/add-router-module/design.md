# Design: add-router-module

## Context

设计文档第 28–32 节：菜单声明 `path` + `pageId`（不绑定 React 组件），Dynamic Router 把 URL → pageId + route context。现状：pactor-runtime 有 `RouterAdapter`（navigate，默认 no-op）与 `route` 作用域；pactor-permission 有 `checkPagePermission` / `filterMenusByPermission` 纯函数。本包实现菜单注册、路径匹配与导航桥接。

约束：

- 核心（registry/matcher/memory navigation）零 React 依赖，可纯 Node 测试；React 绑定隔离在独立子入口。
- 与 pactor-runtime 结构化兼容（不依赖其运行时值），devDep 类型断言（同 pactor-permission 的做法）。
- React Router 是设计文档选定的路由库（第 8 节），但核心逻辑不绑死它。

## Goals / Non-Goals

**Goals:**

- `MenuItem` 模型 + `MenuRegistry`：findByPath（含 `:param` 模式）、findById、排序、隐藏页可匹配但不出现在可见菜单。
- `PathMatcher`：模式编译、params、query。
- `RouteContext`：`{ path, params, query, pageId?, menuId?, activeMenu? }`。
- `NavigationBridge` + `MemoryNavigation`；`createRouterAdapter` 桥接 runtime navigate。
- React 绑定：`<DynamicDslRoute>`（React Router）、React Router 版 bridge、守卫辅助。
- 测试 + 文档。

**Non-Goals:**

- 不加载页面资源（pageId → loadPage 是 app 组合层的串联）。
- 不做 Tabs/Breadcrumb/KeepAlive 的 UI（pactor-layout；本包只保留 MenuItem 字段与 activeMenu 解析）。
- 不做嵌套路由布局、路由懒加载代码分割。
- HashRouter/BrowserRouter 的选择由宿主决定。

## Decisions

### D1: MenuItem 模型对齐第 30 节

`MenuItem` 字段照第 30 节定义（id/type/title/icon/order/path/pageId/permission/hidden/disabled/external/target/keepAlive/badge/activeMenu/defaultOpen/breadcrumb/tab/children），`permission` 类型用 core 的 `PermissionConfig`。

### D2: MenuRegistry 扁平化 + 双索引

- 构建时深度遍历菜单树，产出：可见菜单树（过滤 `hidden`，供 layout 渲染）+ 扁平 page/link 条目列表（`type !== 'group'` 且有 path）。
- `findByPath(pathname)`：按注册顺序（order 排序后）逐个 PathMatcher 匹配，返回 `{ menu, params }`；隐藏页参与匹配（详情页场景，第 30 节）。
- `findById(id)`；`list()` 返回排序后的扁平条目。

### D3: PathMatcher 极简编译

- 模式语法仅支持静态段与 `:param` 段（`/customers/:id/edit`）；不支持通配 `*`、可选段——V1 够用，避免引入 path-to-regexp 依赖。
- `match(pattern, pathname): { params } | null`；`parseQuery(search): Record<string, string>`。
- 构建 `resolveRoute(registry, location): RouteContext | null`：匹配 → `{ path, params, query, pageId, menuId, activeMenu }`（activeMenu 取菜单项 activeMenu 或自身 id）。

### D4: NavigationBridge 抽象

```ts
interface NavigationBridge {
  getLocation(): { pathname: string; search: string };
  push(to: string): void;
  replace(to: string): void;
  subscribe(listener: (location) => void): () => void;
}
```

`MemoryNavigation`：内存栈实现，纯 Node 可测。`createRouterAdapter(bridge)` → `{ navigate(to) { bridge.push(to) } }`，结构化兼容 runtime RouterAdapter。

### D5: React 绑定独立子入口 `pactor-router/react`

- 独立 entry（tsup 多入口：`src/index.ts` + `src/react.ts`），package.json exports 增加 `./react`；react / react-router-dom 为 peerDependencies，核心入口不 import 它们。
- `<DynamicDslRoute>` props：`registry`、`render(page: { pageId, route })`、`fallback?`（404）、`forbidden?`（403）、`permissionChecker?`。内部 `useLocation` → resolveRoute → 未命中渲染 fallback；有 checker 且 page 无权限渲染 forbidden；否则 `render({ pageId, route })`。
- `useReactRouterBridge()`：把 useNavigate/useLocation 包装为 NavigationBridge。

### D6: 依赖

dependencies：`pactor-core`、`pactor-permission`（workspace:*）。devDependencies：`pactor-runtime`（类型断言）、react、react-dom、react-router-dom、@testing-library/react、jsdom、@types/*。

## Risks / Trade-offs

- [PathMatcher 不支持 `*` 通配，特殊路由表达力有限] → V1 明确不支持；需要时扩展编译器（预留 match 返回结构）。
- [react-router-dom v6/v7 API 差异] → peer 写 `>=6`，仅用 useNavigate/useLocation 等稳定 API，开发基准以 pnpm 解析版本为准并注明。
- [React 绑定与核心同包可能误引 react] → exports 分子入口 + 构建后 grep 检查核心入口 dist 无 react/react-router 引用。

## Migration Plan

无（全新包）。顺序：MenuItem/PathMatcher → MenuRegistry → NavigationBridge/adapter → React 绑定 → 测试 → 文档。

## Open Questions

- KeepAlive/Tabs 语义在 pactor-layout 落地时可能需要 RouteContext 扩展（如 matched menu chain 供面包屑）——预留 `menu` 字段在匹配结果中，layout 可自行推导。
