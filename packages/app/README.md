# @pactor-app/app

[Pactor](https://github.com/426-330/pactor) 的一站式组合层（设计文档第 86–89 节）。业务工程只调 `createPactorApplication({ appId, api }).mount('#root')` 即可完成：DSL 资源加载（loader）→ bootstrap 编排（权限 / 菜单 / 布局）→ 共享 registries（内置组件 + 交互动作 + 业务扩展）→ react-router 动态路由 → 布局外壳 → PageRuntime 页面渲染 → Overlay/Provider 集成 → 启动与页面错误兜底。

## 安装

```bash
npm install @pactor-app/app @pactor-app/ui react react-dom react-router-dom
# 或
pnpm add @pactor-app/app @pactor-app/ui react react-dom react-router-dom
```

`react >= 18`、`react-dom >= 18`、`react-router-dom >= 6` 为 peer dependency（开发基准为 react-router-dom v7）。内置默认 UI 为 `@pactor-app/ui`（shadcn 风格，传递依赖），需导入其预建样式表 `import '@pactor-app/ui/styles.css'`。

## 一站式用法

```tsx
import { createPactorApplication } from '@pactor-app/app';

createPactorApplication({
  appId: 'risk-admin',
  api: { baseURL: '/api/runtime' }, // 缺省即 '/api/runtime'
  authTokenProvider: () => getToken(), // 可选，注入 Authorization: Bearer
}).mount('#root');
```

服务端需提供 `{baseURL}/bootstrap` 与 `{baseURL}/pages/{id}` 端点（@pactor-app/resource Envelope 协议）；bootstrap 期望字段（全部可选）：`app.name`、`user`、`permissions`、`menus`、`layout.type` 与布局开关（`header`/`sidebar`/`tabs`/`breadcrumb`/`footer`）、`pageVersions`。

## Options

| 字段 | 说明 |
| --- | --- |
| `appId`（必填） | 应用 id：app 作用域缺省 `id`、brand 缺省标题回退 |
| `api.baseURL` | DSL 资源 API 基础路径（缺省 `/api/runtime`），未注入 loader 时创建 `HttpDslResourceLoader` |
| `loader` | 自定义 `DslResourceLoader`（优先于 api；测试/本地用 `StaticDslLoader`） |
| `layout` | 布局类型覆盖（优先级：`options.layout` > `bootstrap.layout.type` > `'admin'`） |
| `brand` | 品牌区覆盖（缺省取 `bootstrap.app.name`，再回退 `appId`） |
| `router` | `{ type?: 'browser' \| 'hash', basename?: string }`（V1 支持 browser + basename） |
| `components` / `actions` / `services` / `capabilities` | 业务扩展，写入应用级共享 registry（同名覆盖内置） |
| `authTokenProvider` | 认证令牌：注入 DSL 资源请求与页面 HTTP 出口（`Authorization: Bearer`） |

## 启动编排

mount 后依次：加载 bootstrap（全屏 loading）→ `PermissionStore` 写入 `permissions`（缺省 `[]`）→ `MenuRegistry(menus)`（缺省 `[]`）→ 解析布局 → 组装共享 registries 与 adapters。bootstrap 失败渲染含**重试**按钮的启动错误页，不白屏。

应用级共享 registries 被所有页面 PageRuntime 共享：内置组件（@pactor-app/ui components 层）+ 交互动作（overlay.open / overlay.close / confirm / message，应用级 OverlayManager / UiBridge 单例）+ navigate 动作 + options 扩展。页面运行时创建时注入 permission / router / http adapters 与 route context（`route.params` / `route.query`）、`user`（bootstrap.user）、`app`（bootstrap.app）。

## 扩展注册 API

```ts
const app = createPactorApplication({ appId: 'risk-admin', api: { baseURL: '/api/runtime' } });

app.registerComponent('StrategyFlow', StrategyFlow);
app.registerAction('strategy.export', exportStrategy);
app.registerService('strategy', strategyService);
app.registerCapability('strategy.backtest', backtestCapability);

app.mount('#root');
```

写入应用级共享 registry（同名覆盖）；新创建/重建的页面即可用（当前已创建页面下次重建后生效）。`app.unmount()` 卸载根；重复 `mount` 会先卸载旧根。

## 页面加载与错误兜底

- 页面切换：`pageId` 或 `route.params`/`query` 变化即销毁旧运行时重建（V1 无 keepAlive）；
- 加载中渲染 loading 态；加载/校验失败渲染含重试的受控错误页；渲染期异常由 ErrorBoundary 捕获显示错误页，外壳不崩溃；
- 未命中路径渲染 404，命中但无权限渲染 403（菜单项 `permission` 配置）；
- `overlay.open` 的 page 类型 overlay 经 loader 加载页面 DSL，子运行时共享应用级 registries。

## 嵌入式使用（PactorPage / createPactorPage）

存量项目（已有自己的路由，或 Next.js 等框架）中局部嵌入 DSL 页面，不接管路由：

```tsx
import { createPactorPage } from '@pactor-app/app';
import '@pactor-app/ui/styles.css';

// 工厂：组装一次（registries / 交互层 / i18n），多页面实例共享
const Page = createPactorPage({ loader, services, permissions: ['customer:view'] });

<Page pageId="customer-detail" route={{ params: { id } }} />
// 或直接传 PageDsl：<Page page={pageDsl} />
```

- 交互层（confirm / message / overlay）与整应用模式一致；多实例状态互相隔离
- 站内导航：`Link` / `Breadcrumb` 渲染原生 `<a href>` 并拦截站内左键点击，`navigate` 动作与链接点击共用同一实现——缺省退化为 `location.assign` 整页跳转，可经工厂选项 `navigate` 注入宿主路由（SPA 导航）：

```tsx
// Next.js（App Router）
const router = useRouter();
const Page = createPactorPage({ navigate: (to) => router.push(to) });

// React Router
const navigate = useNavigate();
const Page = createPactorPage({ navigate: (to) => navigate(to) });
```

需要完全自定义链接渲染（prefetch、scroll restoration 等）时，可经 `components` 注册表覆盖同名组件，样式子组件从 `@pactor-app/ui/ui` 导入（`BreadcrumbLink` 支持 `render` prop 换成宿主路由组件）。
- `route.params` / `route.query` 经 props 纯数据注入（如 Next.js 的 `searchParams`）

## Sitemap 动态页面（SitemapApp）

`design/dynamic-page.md` 的框架实现：一个 sitemap 对象（页面 url / 名称 / 结构 / DSL / DSL 布局）驱动整个应用。两种路由模式：**纯前端 SPA** 不传路由 props（内置浏览器路由：History API 导航 + popstate 前进后退）；**宿主路由**（Next.js App Router、react-router 等）注入 `pathname` / `navigate`：

```tsx
import { SitemapApp } from '@pactor-app/app';

// 纯前端 SPA：只配 sitemap 源即可
<SitemapApp
  sources={['/api/sitemap']}
  services={{ 'auth.login': login }}
/>

// Next.js（App Router）：挂在 layout.tsx（跨导航常驻，切换导航只刷新内容区）
<SitemapApp
  sources={['/api/sitemap']}        // sitemap 接口 URL（可多源合并）
  baseUrl="https://api.example.com" // 可选：sources / pageEndpoint 相对路径基准
  pathname={usePathname()}
  navigate={(to) => router.push(to)}
  services={{ 'auth.login': login }} // 业务服务（session.context 自动注册）
  httpAdapter={httpHooks}            // 可选：跨域改写 / 响应拆包
/>
```

内置能力（无需自行拼装）：多源拉取合并（冲突后源覆盖前源）、`menus × pages` 继承（`path` / `title` 缺省自引用页面）、MenuRegistry 路由解析（含 `:param`）、访问守卫（缺省匿名守卫：非 `public` 且无 user → `navigate(auth.loginPath)`，`guard` prop 可替换为角色鉴权等策略）、DSL 布局渲染（`PageOutlet` 页面出口、`SitemapMenu` 选中态与 `activeMenu` 高亮）、页面内联 / 懒加载（`id@version` 缓存，`pageEndpoint` 可配）、`session.context` 服务桥（DSL 经 `${data.session.*}` 读 user / app / menus）、缺省动作（`app.reload` 整页重载、`service.call` 服务调用，宿主 `actions` 同名覆盖）、布局常驻（同布局名切换导航仅内容区重建）。布局名解析链：`menu.layout` → 顶层 `layout` → `layouts` 首键。

| Props | 说明 |
| --- | --- |
| `sources`（必填） | sitemap 接口 URL 列表（相对路径以 `baseUrl` 补全） |
| `baseUrl` | 接口基准地址：`sources` / `pageEndpoint` 只写相对路径时以此为基准补全 |
| `pathname` / `navigate` | 宿主路由注入；缺省用内置浏览器路由（纯前端 SPA 零配置）；http(s) 外链自动新标签打开 |
| `query` | 当前 query（`${route.query.x}` 可读）；缺省自 `location.search` 解析 |
| `pageEndpoint` | 懒加载页面端点（缺省 `/api/pages/{id}`） |
| `services` / `components` | 业务扩展（`components` 中 `PageOutlet` / `SitemapMenu` 为布局保留名） |
| `actions` | 业务动作；内置 `app.reload` / `service.call` 默认值，同名覆盖 |
| `guard` | 访问守卫（缺省 `defaultSitemapGuard`：匿名访问非 `public` 页 → 重定向 `auth.loginPath`） |
| `httpAdapter` | `PactorHttpHooks`：所有 HTTP 出口（sitemap 源 / 页面端点 / 页面运行时）的 request / response 统一加工；`createHttpHooks()` 为默认实现（`{ code, data, message }` 拆包；可选 `proxyPrefix` 代理改写 / `headers` 公共头） |
| `fetcher` | fetch 实现注入（SSR / 测试） |
| `sessionService` | 会话桥服务名（缺省 `session.context`） |
| `loading` / `renderError` / `renderNotFound` | 状态视图定制 |

配套导出（高级用法）：`fetchSitemap`、`createSitemapLoader`、`mergeSitemapMenus`、`toSitemapNavItems`、`resolveSitemapRoute`、`defaultSitemapGuard`、`defaultSitemapActions`、`createHttpHooks`、`withHttpHooks`、`createSitemapSessionServices` 与类型 `SitemapResource` / `SitemapMenuItem` / `SitemapPageEntry` / `LayoutDsl` / `SitemapRouteMatch` / `SitemapRouteResolution` / `SitemapGuard` / `SitemapSessionContext`。完整示例工程见 `starters/next-app-starter`（宿主路由模式）与 `starters/spa-starter`（纯前端内置路由模式）。

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
