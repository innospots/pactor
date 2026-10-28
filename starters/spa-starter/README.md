# Pactor SPA Starter（纯前端）

`design/dynamic-page.md` 的纯前端（SPA）示例：Vite + React，无 Next.js 等
宿主框架。与 `next-app-starter` 的关键差异——**不向 `SitemapApp` 传
`pathname` / `navigate`**，框架内置浏览器路由（History API 导航 +
popstate 前进后退）接管全部路由：

```tsx
// src/pactor/App.tsx —— 全部装配
<SitemapApp
  sources={sitemapSources}    // sitemap 接口（相对路径）
  baseUrl={apiBaseUrl}        // 外部接口基准地址（相对路径补全）
  httpAdapter={httpHooks}     // 框架 createHttpHooks：跨域改写 + 响应拆包
/>
```

本模板不自带后端：接口复用 `next-app-starter` 的 mock API
（`apiBaseUrl` 缺省指向 `http://localhost:9011`，已开通 CORS）。

## 快速开始

```bash
# 1. 启动接口服务（mock API：sitemap / 页面懒加载 / 认证）
cd ../next-app-starter && pnpm install && pnpm dev   # :9011

# 2. 启动本模板
cd ../spa-starter && pnpm install && pnpm dev        # http://localhost:9012
```

演示账号：`admin / pactor123`（可见「报表」菜单，含懒加载月报页）、
`guest / guest123`（仅首页）。匿名访问自动跳转登录页（内置守卫）。

## 目录结构

```
src/
  main.tsx               # React 入口（导入 @pactor-app/ui/styles.css，必需）
  pactor/
    App.tsx              # SitemapApp 装配（纯前端模式：零路由配置；HTTP 钩子用框架 createHttpHooks）
    config.ts            # sitemapSources / apiBaseUrl
vite.config.ts           # react 插件（无代理：接口服务端已开通 CORS，直连）
```

## 纯前端模式说明

`SitemapApp` 两种路由模式（详见 `packages/app/README.md`）：

- **纯前端 SPA（本模板）**：不传路由 props。内置浏览器路由处理导航、
  前进 / 后退、地址栏同步与 query 解析（`${route.query.x}` 可读）；
  匿名守卫重定向同样走 `pushState`。
- **宿主路由（next-app-starter）**：注入 `pathname` / `navigate`，
  框架不持有路由。

登录 / 登出后 sitemap 需按新会话重新下发，模板用框架内置 `app.reload`
动作整页重载（`window.location.assign`），两种模式一致。登录 / 登出
本身是普通 HTTP 调用，由服务端下发的 DSL 用内置 `request` 动作直接
表达（见 next-app-starter 的 `src/server/sitemap.ts`），客户端零服务代码。

## 跨域与 HTTP 钩子

外部接口以 `apiBaseUrl`（`src/pactor/config.ts`，缺省
`http://localhost:9011`，即 next-app-starter 的 dev server）为基准：
`sitemapSources` 只写相对路径，由 `baseUrl` 补全为
外部绝对地址。**假定服务端已开通 CORS，浏览器直连，无需项目内代理**——
接口方（next-app-starter）已在路由层放开跨源并支持凭据
（Allow-Origin 回显 + Allow-Credentials + 预检响应），cookie 会话跨源
可达（框架 fetch 均带 `credentials: 'include'`）。

**HTTP 钩子**（框架默认实现 `createHttpHooks`，`src/pactor/App.tsx`）：
- `request`：缺省不改写地址（CORS 直连）；服务端不开 CORS 时传
  `proxyPrefix` 把跨域地址改写到项目内代理前缀（需自行配置
  Vite `server.proxy` / nginx 转发）；可注入公共头（Authorization 等）
- `response`：`{ code, data, message }` 包裹结构拆包（业务错误码抛错）；
  后端包裹协议不同传 `envelope: false` 或自行实现 `PactorHttpHooks`

## 接入真实后端

1. `src/pactor/config.ts`：`sitemapSources` 改为你的接口 URL（可多个），
   `apiBaseUrl` 改为接口基准地址。
2. 服务端按 `SitemapResource`（自 `pactor-app` 导入类型）返回 JSON：
   - `layouts`：DSL 布局（`PageOutlet` 为页面出口，`SitemapMenu` 渲染导航，
     `${data.session.*}` 读会话数据）
   - `pages`：页面定义（`pageDsl` 内联或缺省，`version` 参与缓存键 `id@version`）
   - `menus`：导航 / 路由树（`pageId` 引用页面、`layout` 引用布局、
     `public` 免登录；`path` / `title` 缺省从引用页面继承）
   - `auth.loginPath`：未登录重定向目标
3. 懒加载页：实现 `GET /api/pages/{id}` 返回 PageResource envelope
   （路径为框架缺省；需自定义时给 `SitemapApp` 传 `pageEndpoint` prop）。
4. 登录 / 登出等接口调用直接在 DSL 中用内置 `request` 动作表达（URL
   指向你的真实接口）；有客户端服务层时可用内置 `service.call` 动作
   桥接，`session.context` 会话桥由框架内置，均无需自行注册。

> 依赖说明：`SitemapApp` 于 `@pactor-app/app` v1.19.0 引入。本模板开发期间
> pactor 依赖经 `link:../../packages/*` 指向本仓；`v1.19.0` 发布到 npm 后
> 改回 `^1.19.0` 版本号即可独立使用。`react-router-dom` 是
> `@pactor-app/app` 的 peer 依赖（整应用模式需要），纯前端模式不会用到。

## 前端国际化

右下角选择器将语言保存在浏览器的 `localStorage`，并同步 URL `locale` 与文档 `lang`。`src/i18n/messages.ts` 是前端词条，`SitemapApp` 接收 `locale`、`defaultLocale` 和 `messages`；`src/i18n/demo.ts` 注册的 `/client-i18n` 页使用 `${t('demo.title')}` 与动态参数插值，可直接切换中英文。

本示例仍连接 next-app-starter 的后端：远端菜单和页面由该服务按请求 `locale` 本地化，`/client-i18n` 展示浏览器自主翻译的模式。语言变化会重挂载 `SitemapApp`，重取同一语言的远端 sitemap；如果业务接口返回的数据也需要翻译，应由对应服务或前端产品代码自行处理。扩展前端词条时同时维护两种语言；缺失 key 按默认语言回退。
