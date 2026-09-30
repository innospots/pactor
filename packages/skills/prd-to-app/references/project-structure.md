# 目标项目目录结构约定

基于 `pnpm create pactor-app`（next-app 模板）扩展。加 ✅ 的是模板自带，➕ 的是本流程新增/改造。

```
<project>/
├── app/
│   ├── [[...slug]]/            ✅ pactor 动态路由承载页（不改）
│   ├── api/
│   │   ├── sitemap/route.ts           ✅ 返回 sitemap 入口数据（由 src/server/sitemap.ts 组装）
│   │   ├── public/pages/[id]/route.ts ➕ 懒加载页面端点，返回单页 envelope（id/resourceType/version/dslVersion/schema/updatedAt）
│   │   ├── auth/ · users/             ✅ 模板自带（演示账号，按需保留）
│   │   └── data/[...path]/route.ts    ➕ mock 数据统一入口（见 mock-data-routes.md）
│   ├── globals.css             ✅ 全局样式（皮肤导入处）
│   ├── layout.tsx              ✅ 根布局（自定义页面 CSS 在这里挂载）
│   └── theme.css               ✅ 主题令牌（样式移植的主战场）
├── src/
│   ├── pactor/
│   │   ├── config.ts           ✅ pactor 运行时配置（sitemapSources / baseUrl / pageEndpoint）
│   │   └── App.tsx             ✅ 客户端入口（SitemapApp 接线、注册自定义组件/动作处）
│   └── server/
│       ├── sitemap.ts          ➕ 递归收集 yaml/ 模块子目录建 id→路径索引、按会话裁剪（只加过滤，不拼接业务字段）
│       └── yaml/
│           ├── sitemap.yaml    ✅ 布局 DSL：app / auth / layouts / pages / menus
│           └── <模块>/         ➕ 页面按 PRD 模块分目录存放（如 user/ order/ project/）
│               └── <id>.yaml      每页一个文件，页面 id = 文件名（不含 .yaml）
└── package.json
```

## sitemap.yaml 骨架

```yaml
# 页面 DSL 按模块分目录存放：yaml/<模块>/<id>.yaml，页面 id = 文件名；
# src/server/sitemap.ts 递归收集各模块目录建 id→路径索引；
# lazy: true 不随 sitemap 内联下发，客户端经 /api/public/pages/{id} 懒加载
id: site
resourceType: sitemap
version: 1
dslVersion: "1.0"
app: { name: <产品名，取自 PRD> }
layout: admin
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
      - { id: projects, type: page, pageId: project-list, title: 项目, icon: folder }
      - { id: project-detail, type: page, pageId: project-detail, title: 项目详情, hidden: true, activeMenu: projects }

layouts:
  admin:
    dsl: "1.0"
    body: # 管理端外壳（侧边导航 + PageOutlet），模板自带，按需调整
  login:
    dsl: "1.0"
    body: # 登录页布局（居中单栏），与原产品登录页结构对齐
```

## 约定

- 页面按 PRD 模块树分目录：`yaml/<模块>/<id>.yaml`（如 `yaml/user/user-list.yaml`）；模块目录名用 kebab-case 英文域，按 PRD 模块树划分（如 user / order / report）
- 页面 id kebab-case，= 文件名（不含 `.yaml`）；`pages:` 注册、`menus:` 引用、文件名三者一致
- 模板自带的 `yaml/pages/*.page.yaml` 平铺写法仅适合页面极少的 demo；模块 ≥2 或页面 >5 时一律按模块分目录（模板目录可整体替换）
- 列表/详情/编辑成组路径：`/projects`、`/projects/:code`、`/projects/:code/edit`、`/projects/new`
- 详情/编辑页不进菜单（`hidden: true`），用 `activeMenu` 保持列表菜单高亮
- 菜单图标用 pactor Icon 白名单 kebab-case 名
- 登录/注册页 `public: true` + `layout: login`；其余默认需登录
- `src/server/sitemap.ts` 只按会话过滤（public/permission），不要在代码里拼接业务字段——数据归 yaml
- 懒加载页面端点放 `app/api/public/pages/[id]/route.ts`；框架缺省请求 `/api/pages/{id}`，因此**必须**在 `src/pactor/config.ts` 显式配置并传给 SitemapApp，否则客户端请求错路径：

```ts
// src/pactor/config.ts
export const pageEndpoint = (pageId: string) => `/api/public/pages/${pageId}`;

// src/pactor/App.tsx
<SitemapApp ... pageEndpoint={pageEndpoint} />
```
