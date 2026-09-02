# Spec: path-matcher

路径模式匹配与 RouteContext 构建（`@pactor-app/router`，设计文档第 31/32 节）。

### Requirement: 路径模式编译与匹配

SHALL 支持静态段与 `:param` 段的路径模式（如 `/customers/:id/edit`）：`match(pattern, pathname)` 命中返回 `{ params }`，否则返回 null。MUST 精确匹配整路径（段数一致）。V1 不支持 `*` 通配与可选段。

#### Scenario: 参数提取

- **WHEN** match('/customers/:id/edit', '/customers/123/edit')
- **THEN** 返回 `{ params: { id: '123' } }`

#### Scenario: 段数不同不匹配

- **WHEN** match('/customers/:id', '/customers/123/edit')
- **THEN** 返回 null

#### Scenario: 静态段不一致不匹配

- **WHEN** match('/customers/:id/edit', '/customers/123/view')
- **THEN** 返回 null

### Requirement: query 解析

`parseQuery(search)` SHALL 把 `?tab=risk&page=2` 形式解析为 `Record<string, string>`；空字符串与裸 `?` 返回空对象。

#### Scenario: 解析查询串

- **WHEN** parseQuery('?tab=risk&page=2')
- **THEN** 返回 `{ tab: 'risk', page: '2' }`

### Requirement: RouteContext 构建

`resolveRoute(registry, { pathname, search })` SHALL 返回 `{ path, params, query, pageId?, menuId?, activeMenu? }`：`activeMenu` 取菜单项 `activeMenu` 或自身 `id`；未命中返回 null。

#### Scenario: 详情页 activeMenu 指向列表页

- **WHEN** 隐藏编辑页配置 `activeMenu: 'customer-list'`，解析其路径
- **THEN** RouteContext 的 activeMenu 为 'customer-list'，pageId 为编辑页 pageId

#### Scenario: query 进入 route context

- **WHEN** 解析 `/customers?tab=risk`
- **THEN** RouteContext.query.tab 为 'risk'
