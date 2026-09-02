# @pactor/router

[Pactor](https://github.com/426-330/pactor) 的路由模块：菜单模型与 MenuRegistry、极简路径匹配（PathMatcher）、导航桥接（NavigationBridge / MemoryNavigation）、@pactor/runtime RouterAdapter 桥接，以及 React Router 动态路由绑定（`<DynamicDslRoute>`）。

菜单声明 `path` + `pageId`（不绑定 React 组件），Dynamic Router 把 URL 解析为 pageId 与路由上下文；页面资源加载（pageId → loadPage）由应用组合层串联，不在本包。

## 安装

```bash
npm install @pactor/router
# 或
pnpm add @pactor/router
```

核心入口（`@pactor/router`）零 React 依赖，可纯 Node 使用与测试；React 绑定在独立子入口 `@pactor/router/react`，仅该子入口需要 peer 依赖 `react >=18` 与 `react-router-dom >=6`（开发基准为 react-router-dom v7，仅用 v6/v7 共有的稳定 API）。

## 示例

```ts
import {
  MenuRegistry,
  MemoryNavigation,
  createRouterAdapter,
  resolveRoute,
} from '@pactor/router';

const registry = new MenuRegistry([
  {
    id: 'customer',
    type: 'group',
    title: '客户管理',
    children: [
      { id: 'customer-list', type: 'page', title: '客户列表', path: '/customers', pageId: 'customer-list' },
      {
        id: 'customer-edit', type: 'page', title: '编辑客户',
        path: '/customers/:id/edit', pageId: 'customer-edit',
        hidden: true, activeMenu: 'customer-list',
      },
    ],
  },
]);

// 1. URL → RouteContext（隐藏详情页参与匹配，activeMenu 指向列表页）
const route = resolveRoute(registry, { pathname: '/customers/123/edit', search: '?tab=risk' });
// → { path, params: { id: '123' }, query: { tab: 'risk' }, pageId: 'customer-edit',
//     menuId: 'customer-edit', activeMenu: 'customer-list' }

// 2. 桥接 @pactor/runtime：DSL navigate 动作驱动导航
const navigation = new MemoryNavigation();
const runtime = createPageRuntime(pageDsl, {
  router: createRouterAdapter(navigation), // navigate(to) → bridge.push(to)
  route: { params: route.params, query: route.query }, // ${route.params.id} 可求值
});
```

React 绑定（`@pactor/router/react`）：

```tsx
import { DynamicDslRoute, useReactRouterBridge } from '@pactor/router/react';
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

## 功能一览

- **MenuItem**：对齐设计文档第 30 节字段（id/type/title/icon/order/path/pageId/permission/hidden/disabled/external/target/keepAlive/badge/activeMenu/defaultOpen/breadcrumb/tab/children），`permission` 用 @pactor/core 的 `PermissionConfig`。
- **MenuRegistry**：由菜单树构建可见菜单树（`tree()`，过滤 hidden）+ 扁平可路由条目列表（`list()`，非 group 且有 path，按 order 排序、未指定者保持声明顺序在后）；`findById`（含 group 与隐藏项）、`findByPath`（按 list() 顺序模式匹配，隐藏页参与，未命中 null）。
- **PathMatcher**：`match(pattern, pathname)` 仅支持静态段与 `:param` 段，整路径精确匹配（段数一致），不支持 `*` 与可选段；`parseQuery(search)` 解析查询串；`resolveRoute(registry, location)` 产出 `RouteContext`（path/params/query/pageId/menuId/activeMenu，activeMenu 取菜单项 activeMenu ?? 自身 id）。
- **NavigationBridge / MemoryNavigation**：`getLocation` / `push` / `replace` / `subscribe`（返回退订函数）；MemoryNavigation 为纯 Node 内存历史栈实现，另支持 `back()`。
- **`createRouterAdapter(bridge)`**：结构化兼容 @pactor/runtime `RouterAdapter`，`navigate(to)` → `bridge.push(to)`。
- **`<DynamicDslRoute>`**（子入口 `@pactor/router/react`）：useLocation 驱动重新解析——未命中渲染 `fallback`（404）、配置 `permissionChecker`（@pactor/permission `checkPagePermission` 守卫）且无权限渲染 `forbidden`（403），否则 `render({ pageId, route })`。
- **`useReactRouterBridge()`**：把 useNavigate / useLocation 包装为 NavigationBridge（React Router 自身驱动重渲染，subscribe 为 no-op）。

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
