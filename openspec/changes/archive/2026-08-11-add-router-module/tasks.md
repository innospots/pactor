# Tasks: add-router-module

## 1. 包骨架

- [x] 1.1 创建 `packages/router`：dependencies `pactor-core`/`pactor-permission` workspace:*，peerDependencies `react >=18`/`react-router-dom >=6`（标注仅 react 子入口需要），devDependencies 加 pactor-runtime（类型断言）与 react 测试栈；tsconfig、tsup 多入口（index + react）、LICENSE、README；`pnpm install` 成功

## 2. MenuRegistry（spec: menu-registry）

- [x] 2.1 `MenuItem` 类型（对齐设计文档第 30 节字段，permission 用 core PermissionConfig）
- [x] 2.2 MenuRegistry：构建（可见树过滤 hidden + 扁平可路由列表）、list() order 排序、findById
- [x] 2.3 findByPath：按序模式匹配、params 返回、隐藏页参与、未命中 null

## 3. PathMatcher（spec: path-matcher）

- [x] 3.1 match(pattern, pathname)：静态段 + `:param`，整路径精确匹配
- [x] 3.2 parseQuery(search)
- [x] 3.3 resolveRoute(registry, location)：RouteContext（path/params/query/pageId/menuId/activeMenu）

## 4. 导航桥接（spec: dynamic-route）

- [x] 4.1 NavigationBridge 接口 + MemoryNavigation（push/replace/subscribe/历史栈）
- [x] 4.2 createRouterAdapter(bridge) 结构化兼容 runtime RouterAdapter + devDep 类型断言

## 5. React 绑定（spec: dynamic-route）

- [x] 5.1 子入口 `pactor-router/react`：useReactRouterBridge()
- [x] 5.2 `<DynamicDslRoute>`：registry/render/fallback/forbidden/permissionChecker，useLocation 驱动
- [x] 5.3 package.json exports 增加 `./react`；构建后 grep 验证核心入口 dist 无 react/react-router-dom

## 6. 测试

- [x] 6.1 单测覆盖三个 spec 全部 scenario（React 绑定用 jsdom + Testing Library + react-router-dom MemoryRouter；navigate/route 作用域集成用 pactor-runtime devDep）

## 7. 验收与文档

- [x] 7.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 7.2 文档站新增 `packages/router.md`，侧边栏与快速开始模块表同步，`pnpm docs:build` 通过
