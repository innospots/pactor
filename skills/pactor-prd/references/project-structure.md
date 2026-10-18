# 目标项目目录结构约定

以 `skills/pactor-prd/template/` 的实际文件为准。下面列出关键接线；构建配置、锁文件和 workspace 文件随模板完整保留。

```
<project>/
├── app/
│   ├── [[...slug]]/                 pactor 动态路由承载页（不改）
│   ├── api/
│   │   ├── sitemap/route.ts         返回 sitemap 入口数据（由 src/server/sitemap.ts 组装）
│   │   ├── public/pages/[id]/route.ts  懒加载页面端点，返回单页 envelope
│   │   ├── auth/ · users/           登录、登出与用户接口（演示账号由 values 提供）
│   │   └── d/[...parts]/route.ts    数据统一入口（纯转发；无后端返回空数据，见 data-api.md）
│   ├── globals.css                  全局样式与模板通用 CSS
│   ├── icon.svg                     Next.js 文件约定的浏览器 icon
│   └── layout.tsx                   根布局；导入 pactor-app/styles.css，注入首屏皮肤与明暗脚本
├── public/
│   ├── logo.svg                     品牌 logo（sitemap 品牌区引用）
│   └── skins/
│       └── neutral.css              neutral 默认皮肤的亮色、暗色语义令牌
├── src/
│   ├── pactor/
│   │   ├── config.ts                pactor 运行时配置（sitemapSources / baseUrl / pageEndpoint）
│   │   ├── skin.ts                  已注册皮肤、默认皮肤与运行时换肤
│   │   └── App.tsx                  客户端入口（SitemapApp 接线、自定义组件/动作注册）
│   └── server/
│       ├── sitemap.ts               递归收集 yaml/ 模块子目录建 id→路径索引、按会话裁剪
│       └── yaml/
│           ├── sitemap.yaml         布局 DSL：app / auth / layouts / pages / menus
│           └── <模块>/              页面按 PRD 模块分目录存放（如 user/ order/ project/）
│               └── <id>.yaml        每页一个文件，页面 id = 文件名（不含 .yaml）
└── package.json                     工程名等占位由 render 写入
```

## 占位清单与安全替换

- 清单位于 **`skills/pactor-prd/template-placeholders.json`**，记录全部可用键、含义和冒烟示例值。values JSON 必须是 flat object，键恰好等于清单登记的全部键，且每个值都是字符串。
- 复制模板后，在包含 `skills/` 的仓库根目录执行：

  ```bash
  node skills/scripts/prd-template.mjs render <project> --values <values.json>
  node skills/scripts/prd-template.mjs check <project> --rendered
  ```

- `render` 是唯一安全替换入口：它先校验源模板和 values，再以 JSON 编码替换完整字符串字面量。不要手工逐文件替换或只修改 `package.json`。
- rendered check 通过后才执行 install/dev 冒烟；冒烟通过后再生成页面。**任何占位未替换时禁止进入页面生成。**

## sitemap.yaml 骨架

```yaml
# 页面 DSL 按模块分目录存放：yaml/<模块>/<id>.yaml，页面 id = 文件名；
# src/server/sitemap.ts 递归收集各模块目录建 id→路径索引；
# lazy: true 不随 sitemap 内联下发，客户端经 /api/public/pages/{id} 懒加载
id: site
resourceType: sitemap
version: 1
dslVersion: "1.0"
app: { name: <render 写入的产品名> }
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

- 页面按 PRD 模块树分目录：`src/server/yaml/<模块>/<id>.yaml`（如 `src/server/yaml/user/user-list.yaml`）；模块目录名用 kebab-case 英文域，按 PRD 模块树划分（如 user / order / report）。批量建文件与清单对齐见 **`page-inventory-and-files.md`**。
- 页面 id kebab-case，= 文件名（不含 `.yaml`）；`pages:` 注册、`menus:` 引用、文件名三者一致。
- 列表/详情/编辑成组路径：`/projects`、`/projects/:code`、`/projects/:code/edit`、`/projects/new`。
- 详情/编辑页不进菜单（`hidden: true`），用 `activeMenu` 保持列表菜单高亮。
- 菜单图标仅一级菜单配置（目录 group 与「首页」这类独立页面项都要配），用 pactor Icon 白名单 kebab-case 名；二级及以下菜单项一律不配图标。
- 登录/注册页 `public: true` + `layout: login`；其余默认需登录。
- `src/server/sitemap.ts` 只按会话过滤（public/permission），不要在代码里拼接业务字段——数据归 YAML。
- 懒加载页面端点放 `app/api/public/pages/[id]/route.ts`；框架缺省请求 `/api/pages/{id}`，因此**必须**在 `src/pactor/config.ts` 显式配置并传给 SitemapApp，否则客户端请求错路径：

```ts
// src/pactor/config.ts
export const pageEndpoint = (pageId: string) => `/api/public/pages/${pageId}`;

// src/pactor/App.tsx
<SitemapApp ... pageEndpoint={pageEndpoint} />
```
