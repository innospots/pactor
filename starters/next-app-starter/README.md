# next-app-starter（Pactor 动态页面模板）

按 `design/dynamic-page.md`（方案 B）实现的动态页面 starter：开发者在入口配置
一个或多个返回 **sitemap 对象**的接口 URL，应用的页面 url、页面名称、导航结构、
布局与页面 DSL 全部由该对象驱动。核心能力由框架 `@pactor-app/app` 的
**`SitemapApp`** 组件内置（路由解析 / 匿名守卫 / DSL 布局 / 页面加载 /
session 桥），模板只做宿主接线。

## 快速开始

```bash
pnpm install
pnpm dev   # http://localhost:9011
```

演示账号（登录页可见）：

| 账号 | 密码 | 角色差异 |
| --- | --- | --- |
| `admin` | `pactor123` | 可见「报表」菜单（`report:view`），月报页懒加载 |
| `guest` | `guest123` | 仅可见首页 |

匿名访问任意非 public 路径会重定向到 `/login`；登录 / 登出后整页重载，
sitemap 端点按新会话重新裁剪内容。

## 结构

```
app/
  layout.tsx               # PactorApp 挂载点（Next layout 跨导航常驻：
                           # 切换导航只刷新内容区，sitemap 不重复拉取）
  [[...slug]]/page.tsx     # 可选 catch-all：匹配全部站内路径，渲染为空
  api/
    sitemap/route.ts       # sitemap 端点（会话感知：匿名 / 角色裁剪）
    pages/[id]/route.ts    # 懒加载页面端点（PageResource envelope，接口侧鉴权）
    auth/login/route.ts    # 演示登录（写会话 cookie）
    auth/logout/route.ts   # 演示登出（清 cookie）
src/
  pactor/
    config.ts              # ★ 入口配置：sitemapSources 接口 URL 列表
    services.ts            # 演示服务（auth.login / auth.logout）+ 扩展动作
    http.ts                # PactorHttpHooks（跨域改写 + 响应拆包）
    App.tsx                # 薄壳：框架 SitemapApp + 宿主路由（pathname / navigate）
  server/
    accounts.ts            # 演示账号与会话 cookie
    sitemap.ts             # mock sitemap 数据源（layouts / pages / menus 按角色裁剪）
```

`App.tsx` 全部内容即：

```tsx
<SitemapApp
  sources={sitemapSources}
  pathname={pathname}
  query={query}
  navigate={(to) => router.push(to)}
  pageEndpoint={pageEndpoint}
  services={demoServices}
  actions={demoActions}
  httpAdapter={httpHooks}
/>
```

> 依赖说明：`SitemapApp` 于 `@pactor-app/app` v1.19.0 引入。本模板开发期间
> pactor 依赖经 `link:../../packages/*` 指向本仓；`v1.19.0` 发布到 npm 后
> 改回 `^1.19.0` 版本号即可独立使用。

## 接入真实后端

1. 把 `src/pactor/config.ts` 的 `sitemapSources` 改成你的接口 URL（可多个，
   冲突后源覆盖前源；相对路径由 `apiBaseUrl` 补全，见「跨域代理与 HTTP 钩子」）。
2. 服务端按 `SitemapResource`（自 `pactor-app` 导入类型）返回 JSON：
   - `layouts`：DSL 布局（`PageOutlet` 为页面出口，`SitemapMenu` 渲染导航，
     `${data.session.*}` 读会话数据）
   - `pages`：页面定义（`pageDsl` 内联或缺省，`version` 参与缓存键 `id@version`）
   - `menus`：导航 / 路由树（`pageId` 引用页面、`layout` 引用布局、
     `public` 免登录；`path` / `title` 缺省从引用页面继承）
   - `auth.loginPath`：未登录重定向目标
3. 懒加载页：实现 `GET {pageEndpoint}/{id}` 返回 PageResource envelope
   （缺省 `/api/pages/{id}`，可在 `config.ts` 调整）。
4. 替换 `services.ts` 的演示服务（`auth.login` / `auth.logout`）为真实实现；
   `session.context` 会话桥由框架内置，无需自行注册。

## 跨域代理与 HTTP 钩子

模板的外部接口以 `apiBaseUrl`（`src/pactor/config.ts`，缺省
`http://11.11.3.109:9011`）为基准：`sitemapSources` / `pageEndpoint`
只写相对路径，由 `SitemapApp` 的 `baseUrl` 补全为外部绝对地址。绝对地址
浏览器直连会跨域，模板内置两层机制：

1. **项目内代理**（`next.config.ts` rewrites）：httpHooks 把外部绝对地址
   改写到 `/api-external/*`，由 Next 服务端转发到 `EXTERNAL_API_BASE`
   （缺省同 `apiBaseUrl`，可用环境变量覆盖，见 `.env.example`），
   跨域变同源。
2. **HTTP 钩子**（`src/pactor/http.ts` 的 `PactorHttpHooks`）：接入框架的
   全部 HTTP 出口（sitemap 源、页面懒加载端点、DSL `request` 动作、
   http 类型 dataSource、动态 DSL 引用）——
   - `request`：外部绝对地址自动改写到代理前缀；可注入公共头
     （Authorization / 租户头等）
   - `response`：`{ code, data, message }` 包裹结构拆包为 `data`，业务错误码
     抛错（DSL 动作按失败处理）；后端协议不同改这里

## 与设计文档的差异

`design/dynamic-page.md` 的目标态是布局 / 页面 DSL 直接读 `${user}` /
`${app}` / `${menus}` 作用域（框架尚未原生开放）。当前由 `SitemapApp` 内置的
`session.context` 服务桥接，DSL 中写作 `${data.session.user.name}`、
`${data.session.menus}`；框架支持原生作用域后可平滑迁回。
