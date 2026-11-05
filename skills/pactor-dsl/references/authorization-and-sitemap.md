# 授权、页面元数据与 sitemap 集成

本参考用于存在服务端授权宿主的 Pactor 工程。当前落地基线是 Nexus/Console：

- Pactor 通用 Page DSL 只强制 `dsl: '1.0'` 与 `page.id`；
- `domain`、`module`、`grantGroup` 已由 Pactor schema 声明为可选页面元数据；
- `access-mode`、`pageKey` 是宿主页面扩展；Pactor Page schema 的 `page` 允许附加字段。节点级 `access` 同样是宿主 DSL 扩展，通用 schema 版本可能不接受它，因此不能只用通用 `pactor validate` 证明宿主页面有效；
- 是否强制、如何解释扩展字段由宿主决定。当前 Nexus/Console 宿主会读取并校验它们。

写页面前先识别工程属于哪一类：

| 工程形态 | 页面访问来源 | sitemap/导航 |
| --- | --- | --- |
| 纯 Pactor starter / `StaticDslLoader` | Pactor `page.permission`、菜单 `permission` 等前端守卫 | `sitemap.yaml` 可含 `pages` + `menus` + `layouts`，或由 `bootstrap.menus` 提供菜单 |
| Nexus/Console 集成宿主 | `page.access-mode` + `domain`/`module`/`pageKey`/`grantGroup`，服务端 page-access | 本地 `sitemap.yaml` 只提供 `pages` 与 `layouts`；导航来自后端，不在本地重复维护 `menus` |

不要因为宿主使用 `access-mode`，就把该字段写成 Pactor 通用 schema 的必填项；也不要因为通用 Pactor 已支持 `page.permission`，就假定它会自动执行宿主的 grant-group 规则。

## 1. Nexus 页面访问元数据

`access-mode` 必须在页面文件中声明，允许值只有：

| `access-mode` | 是否登录 | page-access | 必须配置 | 说明 |
| --- | --- | --- | --- | --- |
| `public` | 否 | **不调用** | 无 | 公开页直接下发 DSL；服务端移除仅供宿主过滤使用的 `access` 声明 |
| `authenticated` | 是 | Next.js 服务端调用 | 无强制 grant 字段 | 只要求有效会话；可同时声明 `domain`/`module` 以返回授权组、过滤操作 |
| `grant` | 是 | Next.js 服务端调用 | `domain`、`module`、`pageKey` | 还要求当前主体拥有目标页面的匹配浏览授权组 |

`grant` 模式规则：

- `domain` 必须与 catalog `domainKey` 一致；
- `module` 必须与 catalog `moduleKey` 一致；
- `pageKey` 必须与对应 catalog 模块的 `entryPageKey` 一致；
- `grantGroup` 缺省为 `view`；需要其他浏览组时显式配置；
- `group` 是兼容别名，当前宿主优先读取 `group`。新页面统一写 `grantGroup`，不要同时声明两者。

典型受控页面：

```yaml
dsl: '1.0'
page:
  id: role-list
  title: 角色管理
  access-mode: grant
  domain: operation
  module: role
  pageKey: platform-role-main
  grantGroup: view
body:
  type: Page
  children: []
```

详情、编辑和新建页通常复用模块入口页键，以便归属同一 catalog 模块：

```yaml
page:
  id: role-detail-members
  title: 角色成员
  access-mode: grant
  domain: operation
  module: role
  pageKey: platform-role-main
  grantGroup: view
```

只要求登录的页面：

```yaml
page:
  id: password-change
  access-mode: authenticated
```

公开页面：

```yaml
page:
  id: login
  access-mode: public
```

`public` 页面不应为了“方便”声明 grant 字段；公开页不会调用 page-access，也不会按操作请求结果裁剪 UI。公开页实际调用的后端接口仍会由真实接口过滤器独立鉴权。

## 2. 访问链路与安全边界

Nexus/Console 当前链路：

```text
Browser
  └─ GET /api/sitemap
       └─ Next.js 读取本地 pages/layouts
       └─ 有会话时请求后端 navigation/menus 并合并

Browser
  └─ GET /api/public/pages/{pageId}
       └─ Next.js 服务端解析 page 元数据与 YAML 中的请求清单
       └─ public: 不调用 page-access
       └─ authenticated/grant:
            POST /api/public/page-access/verify
       └─ 按 requestPermissions / grantGroups 裁剪页面 DSL
```

浏览器 **不直接调用 page-access**。页面访问检查发生在 Next.js 的懒加载页面路由中；浏览器只请求页面 DSL。

page-access 是后端公开 HTTP 校验入口，携带 Bearer 时仍会解析当前会话。统一请求体：

```json
{
  "accessMode": "grant",
  "domainKey": "operation",
  "moduleKey": "role",
  "pageKey": "platform-role-main",
  "grantGroup": "view",
  "requests": [
    { "method": "GET", "url": "/api/d/platform/roles" },
    { "method": "PUT", "url": "/api/d/platform/roles/${params.id}" }
  ]
}
```

成功响应的业务数据包含：

```json
{
  "allowed": true,
  "reason": null,
  "requestPermissions": {
    "GET:/api/d/platform/roles": true,
    "PUT:/api/d/platform/roles/${params.id}": false
  },
  "grantGroups": ["view", "operate", "create"]
}
```

调用方必须 fail closed：

- `allowed !== true`：拒绝页面；
- 返回缺字段、字段类型错误、page-access 不可用或超时：拒绝页面；
- `requests` 中任一请求在 `requestPermissions` 中没有布尔结果：相关 UI 不可用并显示权限检查失败提示。

前端过滤只影响 UI。后端接口过滤器始终是最终安全边界，直接请求 API、修改浏览器状态或手工拼接 URL 都不能绕过。

## 3. 后端 endpoint 授权约定

当前 Nexus 使用两层注解：

- `@EndpointModule` 位于 JAX-RS 实现类：设置 `value = moduleKey`、`domain = domainKey`，可设置模块级 `ignorePermission` / `ignoreAuth`；
- `@EndpointGrant` 位于 REST 方法或 console 契约接口方法：声明 `action`、稳定 `name`、可选 `group`、审计参数及跳过策略。

请求处理顺序：

```text
ResolvedEndpointGrantFilter（解析接口注解）
  → AuthenticationFilter（登录，ignoreAuth / 公共 API 可跳过）
  → ResourcePermissionFilter（资源权限，ignorePermission / 公共 API 可跳过）
  → 业务 endpoint
```

示例：

```java
@EndpointModule(value = "role", domain = "operation")
@Path("/api/d/platform/roles")
public class PlatformRoleEndpoint implements RoleEndpoint {
    // ...
}
```

```java
@POST
@EndpointGrant(
    action = EndpointGrantAction.CREATE,
    name = "role.create",
    group = CatalogOperationGroups.CREATE,
    auditLog = true
)
R<RoleVo> createRole(RoleCreateRequest request);
```

约束：

- `moduleKey`、`domainKey` 必须与 `plugin-declaration.yaml` 中 catalog 模块一致；
- 可变更操作应设置明确 `group`，并与模块 `operationGroups.group` 对齐；
- `group` 缺失时，`READ` / `EXPORT` 解析为 `view`，其他动作解析为 `operate`；
- 每条会被页面批量检查的业务接口都必须注册 `@EndpointGrant`；未注册、路径歧义或方法不匹配的请求按拒绝处理；
- `ignorePermission = true` 只跳过权限，不自动跳过登录；
- `ignoreAuth = true` 跳过认证；若要形成真正匿名接口，通常还需 `ignorePermission = true`；
- 模块级 ignore 与方法级 ignore 是 OR 关系；
- 公共 API 路径与真实业务接口使用同一授权语义时，页面过滤结果与直接请求应保持一致。

页面代码不应复制一套 permission 清单作为安全依据。统一鉴权服务会用 `METHOD` 与真实接口路径模板重新匹配 `@EndpointGrant`，然后调用与请求过滤器相同的资源授权器。

## 4. YAML 操作请求的收集与匹配

宿主从页面 DSL 收集：

- 所有 `action: request`；
- `action: call` 引用到的页面顶层命名 `actions`；
- 事件链、弹层内容、组件子树中的上述动作；
- 节点或自定义组件显式声明的 `access.requests`。

请求以 `METHOD:url` 去重后批量检查。`action: request` 的 `method` 缺省为 `GET`，输出时统一转为大写；显式 `access.requests` 中应同时写 method 与 url。

后端匹配规则：

- 按真实接口的 method + path template 匹配；
- `${row.id}`、`${params.id}` 等表达式只能占完整路径段；
- 查询串在判定路径时移除；
- 路径必须为 `/api/` 开头，拒绝 `..`、编码、反斜杠、重复斜杠等异常形式；
- 无法解析、未知接口或命中多个候选时返回 `false`；
- 单次最多接受 256 个请求；缺失结果同样由前端 fail closed。

写法：

```yaml
- type: PermissionGrantPanel
  access:
    mode: disable
    grantGroups: [update]
    requests:
      - method: PUT
        url: /api/d/platform/roles/${params.id}/permissions
```

自定义 React 组件、自定义 action 或组件内部自行发请求时，YAML 静态分析不到内部 URL。组件必须在承载节点显式声明：

```yaml
- type: CatalogSyncButton
  access:
    grantGroups: [execute]
    requests:
      - method: POST
        url: /api/d/nexus/catalog/sync
```

实际请求仍必须经过后端 endpoint 鉴权；`access.requests` 只是让服务端在页面下发前能同步裁剪入口。

## 5. 被拒绝时的 UI 处理

| YAML 组件/条件 | 当前宿主行为 |
| --- | --- |
| `Button` 的任一事件链含拒绝请求或无权限 grantGroup | 从页面树中移除整个 Button |
| `Form` 的字段、事件或显式请求要求不满足 | 禁用字段与提交按钮，移除不安全事件 |
| 普通组件的显式 `access.requests`/`access.grantGroups` 被拒绝 | 默认移除；`access.mode: disable` 时保留组件，清空事件并设置 `props.disabled: true` |
| 普通组件只有某个事件链被拒绝 | 删除该事件，组件保留 |
| 页面配置不完整、page-access 拒绝或不可用 | 整个懒加载页面被拒绝，不向浏览器下发 DSL |
| page-access 允许页面但请求结果不完整 | 隐藏/禁用相关操作，并在页首增加权限检查失败 Alert |

`access.grantGroups` 是“全部满足”语义，不是任一满足。`grantGroups` 包含 `*` 时视为全部通过。

可显式控制非 Button 组件：

```yaml
- type: RolePermissionEditor
  access:
    mode: disable
    grantGroups: [update]
    requests:
      - method: PUT
        url: /api/d/platform/roles/${params.id}/permissions
  props:
    roleId: ${params.id}
```

需要保留普通组件并显示禁用态时，必须显式写 `mode: disable`；省略时宿主会在直接依赖不满足时移除该组件。

服务端向页面 `state` 注入：

```yaml
state:
  grantGroupList: ['view', 'operate', 'update']
  grantGroups:
    view: true
    operate: true
    update: true
  grantGroupsAll: false
```

用 `when` 控制页面区块：

```yaml
- type: Card
  props: { title: 权限设置 }
  when: ${state.grantGroupsAll || state.grantGroups.update}
  children:
    - type: RolePermissionEditor
```

授权组只控制页面领域/模块内可见性。组件需要调用某个写接口时，仍应声明对应 `access.requests`；可见性和接口权限是两个独立条件。

## 6. 与 Pactor `permission` 的区别

通用 Pactor 仍支持：

```yaml
page:
  permission: customer:view

- type: Button
  permission:
    code: customer:edit
    denied: disabled
```

它由 `@pactor-app/permission` / PermissionStore 判定，适用于纯 Pactor 或自行实现该接线的宿主。Nexus 的 grant-group 页面授权使用 `access-mode` 与节点 `access`，不会因为写了 `page.permission` 就自动映射到 catalog grant。

在一个工程中先检查现有权限接线，再选择机制。不要混写两套看似等价、实际数据源不同的配置。

## 7. sitemap：通用 Pactor 与 Nexus 两种模式

### 通用 Pactor starter / SitemapApp

页面、菜单与布局可以由 `sitemap.yaml` 或 bootstrap/menu loader 提供：

```yaml
pages:
  - { id: user-list, path: /users, title: 用户列表, version: 1, lazy: true }

menus:
  - id: system
    type: group
    title: 系统管理
    children:
      - { id: nav-users, type: page, pageId: user-list, title: 用户 }

layouts:
  admin: { dsl: '1.0', body: { type: PageOutlet } }
```

纯前端菜单 `permission` 只控制是否展示入口，不能替代懒加载页面端点和业务 API 的鉴权。

### Nexus/Console 宿主

当前宿主职责固定：

- 本地 `sitemap.yaml` 提供 `app`、`auth`、`pages`、`layouts`；
- 不在本地 `sitemap.yaml` 再维护一份 `menus`；
- 后端 `meta-sitemap.yaml` / 持久化菜单提供导航领域、模块、浏览组、角色和 hidden 条件；
- Next.js `/api/sitemap` 读取后端 `navigation/menus`，再把后端菜单与本地 `pages`/`layouts` 合并；
- 后端导航接口失败时返回明确错误，不要静默回退到另一份本地菜单；
- `pages` 中的每个页面都必须 `lazy: true`，使页面 DSL 经 `/api/public/pages/{id}` 下发并执行服务端访问检查；
- `domain`、`module`、`access-mode`、`pageKey`、`grantGroup` 的单一事实源是对应页面 YAML，不在 sitemap 重复；
- 不在导航中出现的注册页面由宿主追加为 hidden 路由，保证详情页、编辑页和直接 URL 可达；
- `hidden: true` 只表示不进导航，不是访问控制。是否能打开仍由 page-access 与后端接口鉴权决定。

Nexus 风格片段：

```yaml
id: site
resourceType: sitemap
version: 1
dslVersion: '1.0'
app: { name: Nexus Console }
auth: { loginPath: /login }

pages:
  - { id: login, path: /login, title: 登录, version: 1, lazy: true, layout: login }
  - { id: role-list, path: /system/roles, title: 角色管理, version: 1, lazy: true }
  - { id: role-detail, path: /system/roles/:roleId, title: 角色详情, version: 1, lazy: true, activeMenu: nav-roles }

layouts:
  admin: { dsl: '1.0', body: { type: PageOutlet } }
  login: { dsl: '1.0', body: { type: PageOutlet } }
```

详情/编辑页的 `activeMenu` 指向后端菜单 **menu id**，不是 page id。后端没有返回该页面的菜单项时，宿主仍应根据本地 page 清单创建 hidden route；详情页据此保持列表菜单高亮。

导航的 catalog 浏览条件示例（后端 `meta-sitemap.yaml`）：

```yaml
menus:
  - id: nav-roles
    type: page
    pageId: role-list
    title: 角色管理
    domainKey: operation
    moduleKey: role
    viewGroup: view
```

后端按 nav 节点的 catalog `domainKey.moduleKey:viewGroup`、`roles` 与 `hidden` 裁剪，空 group 会被移除。菜单页面的 `pageKey` 对应本地 page id；对应页面自身再声明 catalog `pageKey`（通常是模块 `entryPageKey`）。

菜单标题本地化优先读取：

1. `common.menu.{menuId}.title`
2. `common.page.{pageId}.title`
3. 后端或 sitemap 配置的 `title`

页面静态 `title` 本地化使用 `common.page.{pageId}.title`。不要把中文 title 改造成 page id、权限键或 URL 的翻译。

## 8. 交付前检查

对 Nexus/Console 页面至少确认：

- `page.id`、文件名、`sitemap.pages[].id` 完全一致；
- `access-mode` 存在且为 `public` / `authenticated` / `grant`；
- 所有注册页面 `lazy: true`；
- `grant` 页面有 `domain`、`module`、`pageKey`，且 `pageKey` 命中 catalog 模块 `entryPageKey`；
- `grantGroup` 存在于模块 catalog；非 `view` 时显式配置；
- 所有写操作涉及的 endpoint 已注册 `@EndpointGrant`，group 与 catalog 的 `operationGroups` 一致；
- 页面中每个 `action: request` 的 method/url 可被唯一接口模板匹配；
- 自定义组件/action 的需求通过节点 `access` 显式声明；
- `public` 页面没有错误的 page-access 依赖；`authenticated`/`grant` 页面没有被客户端重复调用 page-access；
- 本地 sitemap 不含重复 `menus`；导航来自后端并按当前主体裁剪；
- hidden 详情/编辑页可直达、`activeMenu` 正确，且未登录/无权限时被服务端拒绝；
- 用有权限与无权限账号分别验证菜单、页面、按钮、表单和直接 API 请求；
- 运行项目支持的 DSL/宿主校验并在真实服务启动后验证首页、页面懒加载与导航 API。

当前 Nexus 宿主在加载页面时会强制校验 `id`、`access-mode`、grant 必填字段和 `lazy`。通用 `pactor validate` 主要验证 Pactor DSL；宿主扩展字段能否被当前 schema 接受取决于目标工程版本，不能把“命令通过”当成宿主授权接线已正确。
