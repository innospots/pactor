---
title: "@pactor-app/router"
description: 路由模块——菜单注册（MenuRegistry）、路径匹配（PathMatcher）、导航桥接（NavigationBridge）与 React Router 动态路由绑定
---

`@pactor-app/router` 解决「URL → pageId + route context」：菜单声明 `path` + `pageId`（不绑定 React 组件），Dynamic Router 把当前 URL 解析为 pageId 与路由上下文，交给应用组合层加载页面资源并交给 @pactor-app/runtime 渲染。

```bash
pnpm add @pactor-app/router
```

核心入口零 React 依赖（仅 @pactor-app/core / @pactor-app/permission），可纯 Node 使用与测试；React 绑定隔离在独立子入口 `@pactor-app/router/react`，仅该子入口需要 peer 依赖 `react >=18` 与 `react-router-dom >=6`（开发基准为 react-router-dom v7，仅用 v6/v7 共有的稳定 API）。

## MenuRegistry

```ts
import { MenuRegistry } from '@pactor-app/router';

const registry = new MenuRegistry([
  {
    id: 'customer',
    type: 'group',
    title: '客户管理',
    children: [
      { id: 'customer-list', type: 'page', title: '客户列表', path: '/customers', pageId: 'customer-list', order: 1 },
      {
        id: 'customer-edit', type: 'page', title: '编辑客户',
        path: '/customers/:id/edit', pageId: 'customer-edit',
        hidden: true, activeMenu: 'customer-list', permission: 'customer:edit',
      },
    ],
  },
]);
```

`MenuItem` 字段一览（id/type/title/icon/order/path/pageId/permission/hidden/disabled/external/target/keepAlive/badge/activeMenu/defaultOpen/breadcrumb/tab/children），`permission` 为 @pactor-app/core 的 `PermissionConfig`。

- **`tree()`**：可见菜单树（过滤 `hidden` 项连同子树），供 layout 渲染。
- **`list()`**：扁平可路由条目（`type` 非 group 且有 `path`），按 `order` 升序，未指定 order 的保持声明顺序置于其后。
- **`findById(id)`**：按 id 查找（含 group 与隐藏项），未找到返回 `undefined`。
- **`findByPath(pathname)`**：按 `list()` 顺序逐个模式匹配，命中返回 `{ menu, params }`；隐藏页参与匹配（详情页场景），未命中返回 `null`。

## PathMatcher 与 RouteContext

```ts
import { match, parseQuery, resolveRoute } from '@pactor-app/router';

match('/customers/:id/edit', '/customers/123/edit'); // { params: { id: '123' } }
match('/customers/:id', '/customers/123/edit');      // null（段数须一致）
parseQuery('?tab=risk&page=2');                      // { tab: 'risk', page: '2' }

const route = resolveRoute(registry, {
  pathname: '/customers/123/edit',
  search: '?tab=risk',
});
// { path: '/customers/123/edit', params: { id: '123' }, query: { tab: 'risk' },
//   pageId: 'customer-edit', menuId: 'customer-edit', activeMenu: 'customer-list' }
```

模式语法仅支持静态段与 `:param` 段，整路径精确匹配；当前版本不支持 `*` 通配与可选段。`activeMenu` 取菜单项 `activeMenu ?? id`（隐藏详情页高亮列表页）；未命中返回 `null`。

## 导航桥接

```ts
import { MemoryNavigation, createRouterAdapter } from '@pactor-app/router';

const navigation = new MemoryNavigation(); // 纯 Node 内存历史栈
const off = navigation.subscribe((location) => console.log(location));
navigation.push('/customers?tab=risk');
navigation.replace('/customers');
navigation.back();
off(); // 退订
```

`NavigationBridge` 定义 `getLocation` / `push` / `replace` / `subscribe`（返回退订函数），核心逻辑与具体路由库解耦。`createRouterAdapter(bridge)` 返回结构化兼容 @pactor-app/runtime `RouterAdapter` 的对象（`navigate(to)` → `bridge.push(to)`）：

```ts
const runtime = createPageRuntime(pageDsl, {
  router: createRouterAdapter(navigation),
  route: { params: route.params, query: route.query },
});
// DSL navigate 动作 → runtime route.navigate → adapter → bridge.push；
// ${route.params.id} / ${route.query.tab} 在表达式中可求值。
```

## React 绑定（`@pactor-app/router/react`）

```tsx
import { DynamicDslRoute, useReactRouterBridge } from '@pactor-app/router/react';
import { Route, Routes } from 'react-router-dom';

<Routes>
  <Route
    path="*"
    element={
      <DynamicDslRoute
        registry={registry}
        render={({ pageId, route }) => <DslPage pageId={pageId} route={route} />}
        fallback={<NotFound />}
        forbidden={<Forbidden />}
        permissionChecker={permissionStore}
      />
    }
  />
</Routes>
```

`<DynamicDslRoute>` 经 `useLocation` 驱动：useLocation 变化时重新解析——未命中（或命中项无 `pageId`）渲染 `fallback`（404）；配置了 `permissionChecker` 且页面无权限（@pactor-app/permission `checkPagePermission` 守卫）渲染 `forbidden`（403），不调用 `render`；否则 `render({ pageId, route })`。`useReactRouterBridge()` 把 `useNavigate` / `useLocation` 包装为 `NavigationBridge`（React Router 自身驱动重渲染，`subscribe` 为 no-op）。

:::note
页面资源加载（`pageId` → `loadPage`，@pactor-app/resource）不在本包，由应用组合层在 `render` 中串联。HashRouter / BrowserRouter 的选择由宿主决定；KeepAlive / Tabs / Breadcrumb 的 UI 语义由 @pactor-app/ui 的 layout 层消费 MenuItem 字段实现。
:::
