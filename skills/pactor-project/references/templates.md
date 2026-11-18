# 官方模板：next-app、spa 与 apps-shell

由 `create-pactor-app`（`packages/create-app/templates`）与仓库 `starters/` 提供，内容同步。

## 对比

| | next-app | spa | apps-shell |
| --- | --- | --- | --- |
| 模板 id | `next-app` | `spa` | `apps-shell` |
| 栈 | Next.js App Router + React | Vite + React | Next.js ×3（1 宿主 + 2 模块） |
| dev 端口 | 9011 | 9012 | 9020（模块独立 dev 8030/8021/8022） |
| 自带 mock API | 是（`/api/sitemap`、`/api/pages/[id]`、登录 cookie） | 否（默认连 :9011） | 是（模块 server entry 随 tgz 分发） |
| 路由 | Next 可选 catch-all + `SitemapApp` 内容区 | 框架内置 History 路由（不传 pathname/navigate） | Shell 构建期装配路由 + `PactorShellHost` |
| 适用 | 全栈起步、会话、sitemap 裁剪 | 纯前端部署、API 独立团队 | 多业务模块合一部署、模块独立交付 |

## next-app 目录要点

```text
src/
  app/                       # Next 路由（仅入口/薄适配）
    layout.tsx
    [[...slug]]/page.tsx
    api/{sitemap,pages,auth,d,page-access}/route.ts
  frontend/                  # App.tsx、components、i18n、locale、skin、config
  backend/                   # mock、fixtures、pages/{sitemap.ts,i18n,yaml}、config、cors
  shared/                    # 同构类型 / 纯函数（如 types/session.ts）
```

### YAML 布局：宿主分目录 vs 模块包

| 模式 | 路径 | 何时用 |
| --- | --- | --- |
| **A 宿主分目录** | `yaml/<area>/<id>.page.yaml` | `next-app-starter` / `create-pactor-app -t next-app` 默认（如 `auth/login.page.yaml`） |
| **B 模块分目录（宿主）** | `yaml/<module>/<id>.page.yaml` | PRD / 多模块宿主工程 |
| **C 模块包（apps-shell）** | `yaml/<module>/<id>.yaml` | 以 tgz 交付的模块；页面 id 即文件名（无 `.page` 后缀） |

规则与批量加页：`pactor-dsl/references/page-catalog-and-layout.md`。

演示账号：

| 账号 | 密码 | 说明 |
| --- | --- | --- |
| admin | pactor123 | 含 `report:view`，报表页懒加载 |
| guest | guest123 | 仅首页 |

## spa 目录要点

```text
src/
  main.tsx
  frontend/
    config.ts                # sitemapSources + apiBaseUrl（默认 http://localhost:9011）
    App.tsx                  # SitemapApp + createHttpHooks（跨域 + envelope 拆包）
    i18n/                    # locale / messages / demo
index.html
vite.config.ts               # 通常无 pactor vite-plugin（页面由 API 下发）
```

本地联调：**先** `next-app`（或等价后端）**:9011`，**再** spa `:9012`。

## apps-shell 目录要点

```text
web-shell/                     # 统一宿主（9020）
  src/app/                     # Next 路由 + /api/runtime/*、/api/modules/<id>/*
  src/frontend/                # WorkspaceShell（AppShell + PactorShellHost）
  src/backend/                 # 演示会话 / CORS
  src/shared/                  # 宿主同构类型（可选）
  src/shell/sitemap.yaml       # 全量导航（pageId 为 <moduleId>:<pageId>）
  src/modules/module-list.json # 模块启停与菜单接入模式（menuMode/access）
pactor-apps/
  general-app/                 # 完整示例（8030）：server entry + i18n
  data-analysis/               # 纯 DSL 页面示例（8021）
  product-center/              # 纯 DSL 页面示例（8022）
```

当前样板中三个模块的 `menuMode` 都是 `"hidden"`：模块自带菜单只保留隐藏路由，导航完全由 `src/shell/sitemap.yaml` 定义（跨模块页面必须显式写完整 `path`）。

生成后顺序（Shell 以 `file:` 引用模块 tgz）：三个模块各自 `pnpm install && pnpm pack:module`（`--no-bump`，tgz 文件名固定）→ `web-shell` `pnpm install && pnpm assemble:modules && pnpm dev`。改模块后重跑 `pack:module`，Shell 侧 `pnpm install --force && pnpm assemble:modules`。

**模块契约、CLI、`pactor.module.json`、双模式 next-app**：见 **`pactor-module` skill**（`skills/pactor-module/references/module-pack-contract.md`、`apps-shell-integration.md`）。

## 生成后首要修改点

### 所有模板

- `package.json` 的 `name`（单应用模板脚手架已用目录名替换 `__APP_NAME__`；apps-shell 各子包名互相引用，保持不变）
- 品牌与标题：`src/backend/pages/yaml/sitemap.yaml`（next-app）内 `app.name`、菜单文案
- 换真实后端：保持端点契约不变，替换 `src/app/api/*` 或 spa 的 `apiBaseUrl`（见 `@pactor-app/resource` 文档）

### 仅 apps-shell

- 替换业务模块：复制 `pactor-apps/` 下示例模块，改 `package.json` name、`pactor.module.json`（id/basePath/yamlRoot）、dev 端口，再在 web-shell `pnpm add` 新 tgz、`module-list.json` 启用、`src/shell/sitemap.yaml` 挂菜单
- 模块改名/删模块后必须重新 `assemble:modules`（`pnpm dev` 不自动装配）

### 仅 next-app

- 新增页面：模式 A 在 `yaml/<area>/` 增加 `*.page.yaml`；模式 B 在 `yaml/<模块>/` 增加 `<id>.yaml`；均在 `sitemap.yaml` 注册 `pages` / `menus`（见 page-catalog-and-layout.md）
- 权限演示：改 `accounts.ts` 与 sitemap 里菜单的 permission 字段

### 仅 spa

- 部署生产：把 `apiBaseUrl` 改为生产 API 原点；确保 sitemap / pages 接口 CORS 与 cookie 策略与宿主一致

## API 契约（简记）

前端 `SitemapApp` / `createPactorApplication({ api })` 期望：

- **Sitemap 源**：返回合并后的 sitemap 对象（layouts、pages 元数据、menus、app、user、permissions…）
- **页面懒加载**：`GET .../pages/{id}` 返回 PageResource envelope（含页面 DSL 正文）

next-app 模板的 route 实现即参考契约；对接自有 Java/Go 等服务时按同样 JSON 形状实现即可。
