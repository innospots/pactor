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
    App.tsx                # 薄壳：框架 SitemapApp + 宿主路由（pathname / navigate）
  server/
    accounts.ts            # 演示账号与会话 cookie
    cors.ts                # CORS 头（演示放开跨源，含预检响应）
    sitemap.ts             # mock sitemap 数据源（layouts / pages / menus 按角色裁剪；
                           # 登录 / 登出在 DSL 中用内置 request 动作表达）
    yaml/                  # DSL 文件：sitemap.yaml（入口元数据 + 布局 + 页面/菜单全量声明）
      pages/               # 页面 DSL（每页一个 *.page.yaml，按 id 约定加载）
```

`App.tsx` 全部内容即：

```tsx
const httpHooks = createHttpHooks();

<SitemapApp
  sources={sitemapSources}
  baseUrl={apiBaseUrl}
  pathname={pathname}
  query={query}
  navigate={(to) => router.push(to)}
  httpAdapter={httpHooks}
/>
```

> 依赖说明：`SitemapApp` 于 `@pactor-app/app` v1.19.0 引入。本模板开发期间
> pactor 依赖经 `link:../../packages/*` 指向本仓；`v1.19.0` 发布到 npm 后
> 改回 `^1.19.0` 版本号即可独立使用。

## 接入真实后端

1. 把 `src/pactor/config.ts` 的 `sitemapSources` 改成你的接口 URL（可多个，
   冲突后源覆盖前源；相对路径由 `apiBaseUrl` 补全，见「跨域与 HTTP 钩子」）。
2. 服务端按 `SitemapResource`（自 `pactor-app` 导入类型）返回 JSON：
   - `layouts`：DSL 布局（`PageOutlet` 为页面出口，`SitemapMenu` 渲染导航，
     `${data.session.*}` 读会话数据）
   - `pages`：页面定义（`pageDsl` 内联或缺省，`version` 参与缓存键 `id@version`）
   - `menus`：导航 / 路由树（`pageId` 引用页面、`layout` 引用布局、
     `public` 免登录；`path` / `title` 缺省从引用页面继承）
   - `auth.loginPath`：未登录重定向目标
3. 懒加载页：实现 `GET /api/pages/{id}` 返回 PageResource envelope
   （路径为框架缺省；需自定义时给 `SitemapApp` 传 `pageEndpoint` prop）。
4. 登录 / 登出等接口调用直接在 DSL 中用内置 `request` 动作表达（参考
   `src/server/sitemap.ts` 的登录页 / 布局 DSL，URL 指向你的真实接口）；
   有客户端服务层时可用内置 `service.call` 动作桥接，`session.context`
   会话桥由框架内置，均无需自行注册。

## 跨域与 HTTP 钩子

模板的外部接口以 `apiBaseUrl`（`src/pactor/config.ts`，缺省
`http://localhost:9011`）为基准：`sitemapSources`
只写相对路径，由 `SitemapApp` 的 `baseUrl` 补全为外部绝对地址。
**假定服务端已开通 CORS，浏览器直连，无需项目内代理**——本模板的
mock API 已在路由层放开跨源（`src/server/cors.ts`：Allow-Origin 回显
请求源 + Allow-Credentials，POST 预检经 `OPTIONS` 响应；cookie 会话
跨源可达，框架 fetch 均带 `credentials: 'include'`）。

**HTTP 钩子**（框架默认实现 `createHttpHooks`，`src/pactor/App.tsx`）：
接入框架的全部 HTTP 出口（sitemap 源、页面懒加载端点、DSL `request`
动作、http 类型 dataSource、动态 DSL 引用）——
- `request`：缺省不改写地址（CORS 直连）；服务端不开 CORS 时传
  `proxyPrefix`，把跨域地址改写到项目内代理前缀（需自行配置
  Next rewrites / nginx 转发）；可注入公共头（Authorization 等）
- `response`：`{ code, data, message }` 包裹结构拆包为 `data`，业务错误码
  抛错（DSL 动作按失败处理）；后端包裹协议不同传 `envelope: false`
  或自行实现 `PactorHttpHooks`

## 与设计文档的差异

`design/dynamic-page.md` 的目标态是布局 / 页面 DSL 直接读 `${user}` /
`${app}` / `${menus}` 作用域（框架尚未原生开放）。当前由 `SitemapApp` 内置的
`session.context` 服务桥接，DSL 中写作 `${data.session.user.name}`、
`${data.session.menus}`；框架支持原生作用域后可平滑迁回。

## 国际化

示例支持 `zh-CN` 和 `en-US`。右下角语言选择器保存 `locale` Cookie、同步 URL 的 `locale` 参数与文档 `lang`，切换时重新加载 sitemap、布局和页面。`SitemapApp` 当前不会自动按语言重取 sitemap，因此宿主按语言重挂载它；路由、查询参数与登录会话保留。

- `src/server/i18n/locales/<locale>/app.yaml`：服务端词条；`src/server/i18n/index.ts` 配置版本清单与 `YamlMessageProvider`。
- 页面 YAML 使用 `$i18n{key:default}` 引用词条；带动态参数时使用对象式 `$i18n.params`，支持运行时参数，服务端下发 `$localizedText`，浏览器只插值，不查找业务语言包。
- `/api/sitemap` 和 `/api/pages/{id}` 依次按 URL `locale`、Cookie、`Accept-Language` 选择语言；页面接口下发 `representation: localized` 和版本信息，响应不缓存。权限裁剪发生在本地化之前。
- 本 starter 的登录、注册、首页、用户与月报示例、菜单和外壳演示两种语言。业务数据接口返回的内容由数据服务负责翻译。
- 扩展页面时为字段增加绑定并在两个语言包中补充对应 key；扩展布局时在已注册的可翻译字段内添加简写。引用独立词条或内联 `$i18n` 时，还需要按 `@pactor-app/i18n` 的可翻译字段注册表注册相应组件字段。

语言包目录属于应用源码；正式部署时应随服务端产物发布，修改语言包后更新清单版本。切换语言时服务端错误会显示为资源加载失败；生产环境可进一步接入版本化发布与失败回滚。
