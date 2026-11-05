# 目标项目目录结构约定

以目标工程的实际 loader 为准，先区分两种 profile：

- **通用 next-app starter**：本地 sitemap 可包含 `pages` + `menus` + `layouts`，前端可能有自己的 page-access 门禁；
- **Nexus/Console 集成**：Next.js 服务端在懒加载页面时调用后端 page-access；导航由后端 `/api/d/platform/navigation/menus` 提供，本地 sitemap 不重复 `menus`。

下面是通用脚手架的典型结构；接入 Nexus 时保留目标工程真实路径，不按本示例重命名目录。

```text
<project>/
├── public/
│   ├── logo.svg                     品牌 logo（sitemap 品牌区引用）
│   ├── themes/                      12 套主题 CSS
│   └── skins/neutral.css            基础语义令牌
├── scripts/
│   └── build.mjs                    按 APP_ENV 构建
├── src/
│   ├── app/
│   │   ├── [[...slug]]/             Pactor 动态路由承载页
│   │   ├── api/
│   │   │   ├── sitemap/route.ts     返回按会话裁剪、按 locale 本地化的 sitemap
│   │   │   ├── pages/[id]/route.ts  懒加载页面端点（PageResource envelope）
│   │   │   ├── auth/                登录、登出与演示会话
│   │   │   ├── page-access/         可选：本地/服务端页面访问校验转发
│   │   │   ├── public/page-access/  原型页面访问校验实现
│   │   │   ├── public/pages/[id]/   Nexus：懒加载 + 服务端 page-access
│   │   │   └── d/[...parts]/        prototype mock；其他环境原样转发
│   │   ├── globals.css              全局样式与通用后台 CSS
│   │   ├── icon.svg                 Next.js 浏览器 icon
│   │   └── layout.tsx               根布局、主题首屏注入、PactorApp 挂载
│   ├── backend/
│   │   ├── auth/                    演示账号与会话
│   │   ├── fixtures/                用户、角色、设置示例数据
│   │   ├── mock/                    prototype 数据接口
│   │   ├── config.ts                serverBaseUrl / prototype 判断
│   │   └── resources/
│   │       ├── i18n/                语言包与服务端本地化
│   │       ├── page-access.ts       pageKey / grantGroup 映射
│   │       ├── sitemap.ts           YAML 收集、权限裁剪与 lazy 页面索引
│   │       └── yaml/
│   │           ├── sitemap.yaml     布局 DSL：app / auth / layouts / pages / menus
│   │           └── <模块>/          页面按 PRD 模块分目录存放
│   │               └── <id>.page.yaml
│   └── frontend/
│       ├── App.tsx                  SitemapApp、页面门禁与自定义组件注册
│       ├── components/              自定义组件
│       ├── i18n/messages.ts         宿主 React 视图词条
│       ├── themes/                  主题注册表
│       ├── config.ts                sitemap / pageAccess / apiBaseUrl 配置
│       ├── locale.tsx               URL / Cookie / 浏览器语言
│       ├── page-access.tsx          页面访问门禁 UI
│       └── skin.ts                  换肤与偏好持久化
└── package.json                     工程名等占位由脚手架创建时写入
```

## 占位清单与安全替换

- 清单位于 **`skills/pactor-prd/template-placeholders.json`**，记录全部可用键、含义和冒烟示例值。values JSON 必须是 flat object，键恰好等于清单登记的全部键，且每个值都是字符串。
- 用 `create-pactor-app` 脚手架（next-app 模板）创建工程，values 随创建一次性写入；随后在包含 `skills/` 的仓库根目录执行 rendered check：

  ```bash
  pnpm dlx create-pactor-app@latest <project> -t next-app --values <values.json>
  node skills/scripts/prd-template.mjs check <project> --rendered
  ```

- 脚手架创建是唯一安全替换入口：values 在生成时一次写入，之后不要再对工程做占位替换。不要手工逐文件替换或只修改 `package.json`。
- rendered check 通过后才执行 install/dev 冒烟；冒烟通过后再生成页面。**任何占位未替换时禁止进入页面生成。**

## 通用 Pactor sitemap.yaml 骨架

```yaml
# 页面 DSL 按模块分目录存放：yaml/<模块>/<id>.page.yaml；
# 页面 id = 文件名去掉 .page；src/backend/resources/sitemap.ts 递归收集并建 id→路径索引；
# lazy: true 不随 sitemap 内联下发，客户端经 /api/pages/{id} 懒加载
id: site
resourceType: sitemap
version: 1
dslVersion: "1.0"
app: { name: <脚手架创建时写入的产品名> }
auth: { loginPath: /login }

pages:
  - { id: login, path: /login, title: 登录, version: 1, public: true }
  - { id: dashboard, path: /, title: 仪表盘, version: 1, lazy: true }
  # 每个 PRD 页面一条：id kebab-case、path 与线框图「页面路径」一致、lazy: true
  - { id: project-list, path: /projects, title: 项目, version: 1, lazy: true }
  - { id: project-detail, path: /projects/:code, title: 项目详情, version: 1, lazy: true }

menus:
  # 菜单分组与 PRD 模块树一一对应；详情/编辑页 hidden: true + activeMenu 指向列表项
  - id: assets
    type: group
    title: 资源管理
    icon: database
    order: 2
    children:
      - { id: projects, type: page, pageId: project-list, title: 项目 }
      - { id: project-detail, type: page, pageId: project-detail, title: 项目详情, hidden: true, activeMenu: projects }

layouts:
  admin:
    dsl: "1.0"
    body: # 管理端外壳（侧边导航 + PageOutlet），模板自带，按需调整
  login:
    dsl: "1.0"
    body: # 登录页布局，与 PRD 登录页结构对齐
```

## 约定

- 页面按 PRD 模块树分目录：`src/backend/resources/yaml/<模块>/<id>.page.yaml`（如 `src/backend/resources/yaml/project/project-list.page.yaml`）；模块目录名用 kebab-case 英文域。批量建文件与清单对齐见 **`page-inventory-and-files.md`**。
- 页面 id kebab-case，= 文件名去掉 `.page.yaml`；`pages:` 注册、`menus:` 引用、文件名三者一致。
- 列表/详情/编辑成组路径：`/projects`、`/projects/:code`、`/projects/:code/edit`、`/projects/new`。
- 通用 Pactor 中详情/编辑页不进菜单时可在本地菜单使用 `hidden: true` + `activeMenu`；Nexus 的导航项在后端，本地只登记页面路由。
- 菜单图标仅一级菜单配置（目录 group 与「首页」这类独立页面项都要配），用 pactor Icon 白名单 kebab-case 名；二级及以下菜单项一律不配图标。
- 通用 Pactor 登录/注册页可使 `public: true` + `layout: login`；Nexus 以页面 DSL 的 `access-mode: public` 为准，sitemap 不重复权限元数据。
- 通用 starter 的 `sitemap.ts` 可按 public/permission 过滤本地菜单；Nexus 由后端按 catalog 浏览组、`roles`、`hidden` 裁剪导航。把页面隐藏不等于拒绝直接访问。
- 通用 starter 常使用 `src/app/api/pages/[id]/route.ts`，与框架缺省 `/api/pages/{id}` 对齐；Nexus 实际使用 `/api/public/pages/{id}` 并在 `pageEndpoint` 显式配置。以目标工程代码为准。

## Nexus/Console sitemap 与页面元数据

Nexus 本地 sitemap 骨架：

```yaml
id: site
resourceType: sitemap
version: 1
dslVersion: '1.0'
app: { name: Nexus Console }
auth: { loginPath: /login }

pages:
  - { id: login, path: /login, title: 登录, version: 1, lazy: true, layout: login }
  - { id: role-list, path: /system/roles, title: 角色管理, version: 1, lazy: true, layout: admin }
  - { id: role-detail, path: /system/roles/:roleId, title: 角色详情, version: 1, lazy: true, layout: admin, activeMenu: nav-roles }

layouts:
  admin: { dsl: '1.0', body: { type: PageOutlet } }
  login: { dsl: '1.0', body: { type: PageOutlet } }
```

这里没有 `menus`。后端导航放在 `meta-sitemap.yaml`/持久化菜单：

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

对应页面：

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

Nexus 关键约束：

- 当前宿主加载时强制每个页面 `lazy: true`；
- `public` 页面不调用 page-access；`authenticated` / `grant` 在 Next.js 懒加载接口内检查；
- `grant` 必须有 `domain`、`module`、`pageKey`，`pageKey` 命中 catalog 模块 `entryPageKey`；
- 页面文件是访问元数据唯一事实源，不在 sitemap 重复 `access-mode`/grant 字段；
- Next.js `/api/sitemap` 先取页面与布局，再调用后端导航接口并按当前会话合并；后端失败应返回错误，不回退到伪造的本地菜单；
- 后端未返回的已注册页面由宿主追加 hidden route，`hidden` 只影响导航可见性。

动态 endpoint 使用 `@EndpointModule` + `@EndpointGrant` 注册。页面中的 `action: request`、命名 action 和显式 `access.requests` 会批量送 page-access；后端以 method + 路径模板复用真实接口授权。完整规则见 `pactor-dsl/references/authorization-and-sitemap.md`。
