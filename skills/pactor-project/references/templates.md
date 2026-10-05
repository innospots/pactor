# 官方模板：next-app 与 spa

由 `create-pactor-app`（`packages/create-app/templates`）与仓库 `starters/` 提供，内容同步。

## 对比

| | next-app | spa |
| --- | --- | --- |
| 模板 id | `next-app` | `spa` |
| 栈 | Next.js App Router + React | Vite + React |
| dev 端口 | 9011 | 9012 |
| 自带 mock API | 是（`/api/sitemap`、`/api/pages/[id]`、登录 cookie） | 否（默认连 :9011） |
| 路由 | Next 可选 catch-all + `SitemapApp` 内容区 | 框架内置 History 路由（不传 pathname/navigate） |
| 适用 | 全栈起步、会话、sitemap 裁剪 | 纯前端部署、API 独立团队 |

## next-app 目录要点

```text
app/
  layout.tsx                 # Pactor 壳常驻
  [[...slug]]/page.tsx       # catch-all（可为空）
  api/
    sitemap/route.ts         # 会话感知 sitemap
    pages/[id]/route.ts      # 页面 DSL 懒加载（PageResource envelope）
    auth/login|logout/       # 演示登录
src/
  pactor/
    config.ts                # sitemapSources、apiBaseUrl（通常相对本机）
    App.tsx                  # SitemapApp + Next pathname/navigate
  server/
    accounts.ts              # 演示账号
    sitemap.ts               # mock 数据组装
    yaml/
      sitemap.yaml           # 布局、菜单、页面 id 声明
      pages/*.page.yaml      # 页面 DSL（官方脚手架默认：平铺模式 A）
```

### YAML 布局：平铺 vs 模块目录

| 模式 | 路径 | 何时用 |
| --- | --- | --- |
| **A 平铺** | `yaml/pages/<id>.page.yaml` | 本模板 / `create-pactor-app -t next-app` 默认；少量页面 |
| **B 模块目录** | `yaml/<模块>/<id>.yaml` | 多模块后台；**`pactor-prd` 模板**；页面 >5 时建议从 A 迁到 B |

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
  pactor/
    config.ts                # sitemapSources + apiBaseUrl（默认 http://localhost:9011）
    App.tsx                  # SitemapApp + createHttpHooks（跨域 + envelope 拆包）
index.html
vite.config.ts               # 通常无 pactor vite-plugin（页面由 API 下发）
```

本地联调：**先** `next-app`（或等价后端）**:9011`，**再** spa `:9012`。

## 生成后首要修改点

### 所有模板

- `package.json` 的 `name`（脚手架已用目录名替换 `__APP_NAME__`）
- 品牌与标题：`src/server/yaml/sitemap.yaml`（next-app）内 `app.name`、菜单文案
- 换真实后端：保持端点契约不变，替换 `app/api/*` 或 spa 的 `apiBaseUrl`（见 `@pactor-app/resource` 文档）

### 仅 next-app

- 新增页面：模式 A 在 `yaml/pages/` 增加 `*.page.yaml`；模式 B 在 `yaml/<模块>/` 增加 `<id>.yaml`；均在 `sitemap.yaml` 注册 `pages` / `menus`（见 page-catalog-and-layout.md）
- 权限演示：改 `accounts.ts` 与 sitemap 里菜单的 permission 字段

### 仅 spa

- 部署生产：把 `apiBaseUrl` 改为生产 API 原点；确保 sitemap / pages 接口 CORS 与 cookie 策略与宿主一致

## API 契约（简记）

前端 `SitemapApp` / `createPactorApplication({ api })` 期望：

- **Sitemap 源**：返回合并后的 sitemap 对象（layouts、pages 元数据、menus、app、user、permissions…）
- **页面懒加载**：`GET .../pages/{id}` 返回 PageResource envelope（含页面 DSL 正文）

next-app 模板的 route 实现即参考契约；对接自有 Java/Go 等服务时按同样 JSON 形状实现即可。
