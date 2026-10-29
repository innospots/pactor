# 目标项目目录结构约定

以脚手架（`create-pactor-app` next-app 模板）生成工程的实际文件为准。下面列出关键接线；构建配置、锁文件和 workspace 文件随模板完整保留。

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
│   │   │   ├── page-access/         页面访问校验转发
│   │   │   ├── public/page-access/  原型页面访问校验实现
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

## sitemap.yaml 骨架

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
- 详情/编辑页不进菜单（`hidden: true`），用 `activeMenu` 保持列表菜单高亮。
- 菜单图标仅一级菜单配置（目录 group 与「首页」这类独立页面项都要配），用 pactor Icon 白名单 kebab-case 名；二级及以下菜单项一律不配图标。
- 登录/注册页 `public: true` + `layout: login`；其余默认需登录。
- `src/backend/resources/sitemap.ts` 只按会话过滤（public/permission），不要在代码里拼接业务字段——数据归 YAML。
- 懒加载页面端点固定为 `src/app/api/pages/[id]/route.ts`，与框架缺省请求 `/api/pages/{id}` 对齐；无需额外配置 `pageEndpoint`。
