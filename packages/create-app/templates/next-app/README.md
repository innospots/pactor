# __APP_NAME__

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

演示账号（登录页可见；具体用户名 / 密码在 `pnpm create pactor-app` 生成工程时
按模板 `placeholders.json` 的示例值或 `--values` 覆盖值渲染）：

| 账号 | 角色差异 |
| --- | --- |
| 管理员 | 可见「报表」菜单（`report:view`），月报页懒加载 |
| 访客 | 仅可见首页等无权限标记的页面 |

匿名访问任意非 public 路径会重定向到 `/login`；登录 / 登出后整页重载，
sitemap 端点按新会话重新裁剪内容。

## 语言切换（i18n）

页面 / 布局文案由服务端按请求语言本地化后下发（词条在
`src/server/i18n/locales/<locale>/app.yaml`，DSL 用 `$i18n` 引用），
宿主 `src/pactor/locale.tsx` 统一解析 URL `?locale=` / Cookie /
`Accept-Language`，右下角语言选择器写入 `locale` Cookie；切换时宿主以
`key={locale}` 重挂载 `SitemapApp`，sitemap、布局和页面携带新 `?locale=`
整体重拉。详见文末「国际化」。

## 数据转发层（/api/d）

页面 DSL 的 http 数据源可以写同源相对路径 `/api/d/<parts>`（如
`yaml/common/dashboard.yaml`、`yaml/provider/`、`yaml/route/` 中的页面）：
`app/api/d/[...parts]/route.ts` 按相同路径、方法、查询与请求体原样转发到
`serverBaseUrl`（`src/pactor/config.ts`，缺省 `http://localhost:9011/backend`，
仅服务端读取），并携带会话 cookie；匿名一律 401。

没有服务层接口时返回空数据（不 5xx）：上游不可达、接口 404 或返回非 JSON
时 GET 返回 `{}`、POST 返回 `{ ok: true }`，页面按空态渲染。接真实后端只需
把 `next.config.js` 的 `API_BASE_URLS` 换成真实地址，页面 yaml 与转发层零改动。
自转发保护：`serverBaseUrl` 与本应用同源时（如本地开发缺省指向自身），
转发层直接回退空数据，避免无限循环。

> 与 `apiBaseUrl` 的分工：`apiBaseUrl` 是客户端 http 数据源的基准地址
>（CORS 直连外部接口，如 `yaml/pages/users.page.yaml`）；`serverBaseUrl`
> 是服务端转发层的目标地址（浏览器不接触）。两套写法可共存，按页面需要选择。

## 页面骨架与参考模块

`src/server/yaml/` 除 `pages/`（每页一个 `*.page.yaml` 平铺约定）外，
还内置按模块分目录的参考页面（`<模块>/<id>.yaml` 约定，两种命名可混用，
由 `src/server/sitemap.ts` 递归收集，id 冲突报错）：

- `common/`：login（`type: Login` 业务组件登录页）、dashboard（仪表盘演示，
  日期范围随工程生成时的演示日期值渲染）
- `provider/`、`route/`：卡片式列表 + 详情 + 新增/编辑的参考模块
- `models/data-list.yaml`：数据列表标准骨架（搜索 + 表格 + 抽屉新建/编辑），
  可复制生成业务列表页

以上均为演示 / 骨架内容，不需要时可整目录删除（同步移除 sitemap.yaml 中的
pages / menus 注册即可）。

## 皮肤与品牌素材

- 默认皮肤 `public/skins/neutral.css`（Theme Studio 生成，含完整亮色 / 暗色
  语义令牌）由 `app/layout.tsx` 的首屏内联脚本注入（避免闪烁），运行时换肤
  见 `src/pactor/skin.ts` 与外壳 Header 的 ThemeSwitcher（明暗偏好持久化在
  localStorage `mc-skin` / `mc-mode`）。追加皮肤：放入 `public/skins/<key>.css`，
  在 `src/pactor/skin.ts` 的 `SKINS` 注册，并同步 layout 首屏脚本的皮肤允许值。
- 品牌素材：`public/logo.svg`（外壳 Sidebar 品牌区引用）、`app/icon.svg`
  （浏览器 icon，Next.js 文件约定），直接替换文件即可。

## 页面访问校验（grantGroup）

页面切换 / 首次打开之前，客户端先请求同源 `POST /api/page-access/verify`，
由 Next 服务端解析当前页面的页面 DSL：

- `pageKey` ← `page.name`（缺省回退页面 `id`）
- `grantGroup` ← `page.grantGroup`

然后转发平台接口（请求 / 响应与平台保持一致）：

```bash
curl {API_BASE}/api/public/page-access/verify \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "domainKey": "platform",
  "moduleKey": "organization",
  "pageKey": "pluginList",
  "grantGroup": "viewGroup"
}'
```

```json
{
  "success": true,
  "code": "OK",
  "message": "OK",
  "data": { "allowed": true, "reason": "OK" },
  "display": {}
}
```

`data.allowed === false` 时拦截：已登录用户展示 403 视图（含 `reason`），
匿名访问非 public 页由服务端返回 `redirectTo` 跳登录页。校验通过前内容区
停留在上一个已放行页面（URL 已随宿主路由变化，但页面不闪切），布局 state
不丢；平台不可用 / 响应异常按拒绝处理（fail-closed）。

页面 DSL 的 `page` 元数据（`grantGroup` 为 Page DSL 字段，见 `src/server/yaml/pages/*.page.yaml`）：

```yaml
page:
  id: users
  title: 用户列表
  name: users           # 平台 pageKey（缺省回退 id）
  grantGroup: userGroup # 页面权限分组
```

`grantGroup` 随 Page DSL 下发 Runtime（已纳入 Page DSL Schema），同时由
`src/server/page-access.ts` 在服务端读取用于访问校验与权限分组展示。

应用私有的页面数据放 `page.meta`（自由键值，Runtime 不消费）；`page` 顶层为
框架字段并保持封闭，未知字段会导致整页校验失败。

模板自带平台 mock（`app/api/public/page-access/verify/route.ts`），按
`grantGroup → 权限码` 演示：`userGroup → user:view`、
`reportGroup → report:view`，public 页匿名放行——admin 全部放行，
guest 仅首页放行。

配置（仅服务端读取，见 `src/server/page-access.ts`）：

| 环境变量 | 缺省值 | 说明 |
| --- | --- | --- |
| `PACTOR_DOMAIN_KEY` | `platform` | 平台域标识（`domainKey`） |
| `PACTOR_MODULE_KEY` | `organization` | 平台模块标识（`moduleKey`） |
| `PACTOR_PAGE_ACCESS_API_BASE_URL` | `NEXT_PUBLIC_API_BASE_URL` | 平台接口基准地址 |

接入真实平台时把以上变量指向实际环境即可，浏览器不接触平台地址与标识。

## 结构

```
app/
  layout.tsx               # PactorApp 挂载点（Next layout 跨导航常驻：
                           # 切换导航只刷新内容区，sitemap 不重复拉取）；
                           # 首屏皮肤 / 明暗注入内联脚本
  icon.svg                 # 浏览器 icon（Next.js 文件约定）
  [[...slug]]/page.tsx     # 可选 catch-all：匹配全部站内路径，渲染为空
  api/
    sitemap/route.ts       # sitemap 端点（会话感知：匿名 / 角色裁剪）
    pages/[id]/route.ts    # 懒加载页面端点（PageResource envelope，接口侧鉴权）
    d/[...parts]/route.ts  # 数据转发层（原样转发 serverBaseUrl，无后端回退空数据）
    page-access/verify/route.ts         # 页面访问校验（服务端转发平台接口）
    public/page-access/verify/route.ts  # 平台页面访问接口 mock（同契约）
    auth/login/route.ts    # 演示登录（写会话 cookie）
    auth/logout/route.ts   # 演示登出（清 cookie）
public/
  logo.svg                 # 品牌 logo（外壳 Sidebar 引用）
  skins/neutral.css        # 默认皮肤（Theme Studio 生成，亮 / 暗语义令牌）
src/
  pactor/
    config.ts              # ★ 入口配置：sitemapSources / pageAccessEndpoint /
                           # apiBaseUrl / serverBaseUrl
    App.tsx                # 薄壳：页面访问门禁 + 框架 SitemapApp + 宿主路由
                           #（注册自定义组件与 blocks 的 Login，向 SitemapApp
                           # 传 locale / defaultLocale）
    locale.tsx             # 宿主 locale 解析（URL / Cookie / 浏览器语言）、
                           # LocaleSelector 与 Cookie 持久化
    page-access.tsx        # 页面访问门禁（切换前校验 / 403 视图）
    skin.ts                # 皮肤清单与运行时换肤（link[data-pactor-skin] swap）
    i18n/                  # 宿主自身视图词条（messages.ts，页面访问门禁文案）
    components/            # 页面级自定义组件注册表（chat 展示组件 / ThemeSwitcher 等）
  server/
    accounts.ts            # 演示账号（模板为占位符，生成时渲染）与会话 cookie
    cors.ts                # CORS 头（演示放开跨源，含预检响应）
    sitemap.ts             # mock sitemap 数据源（layouts / pages / menus 按角色裁剪，
                           # 标题按 ?locale= 直出；登录 / 登出在 DSL 中用内置 request 动作表达）
    page-access.ts         # 页面访问校验代理（path → pageKey / grantGroup → 平台接口）
    yaml/                  # DSL 文件：sitemap.yaml（入口元数据 + 布局 + 页面/菜单全量声明）
      pages/               # 页面 DSL（每页一个 *.page.yaml，平铺约定）
      common/              # login / dashboard（模块目录约定：<模块>/<id>.yaml）
      provider/            # 参考模块：供应商（列表 + 详情 + 新增/编辑）
      route/               # 参考模块：路由（列表 + 详情 + 新增/编辑）
      models/              # 页面骨架：data-list 数据列表标准模型
```

`App.tsx` 的核心接线（页面访问门禁 + 框架 SitemapApp + 自定义组件）：

```tsx
const { committed, status, retry } = usePageAccessGate(
  pathname,
  search,
  replace,
  locale,
);

<SitemapApp
  key={locale}               // 切换语言时整体重取 sitemap / 布局 / 页面
  sources={sitemapSources}
  baseUrl={apiBaseUrl}
  pathname={committed.pathname}
  query={committedQuery}
  navigate={navigate}
  components={appComponents} // src/pactor/components/ + blocks 的 Login
  locale={locale}            // src/pactor/locale.tsx（URL / Cookie / 浏览器语言）
  defaultLocale="zh-CN"
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

**HTTP 钩子**（框架默认实现 `createHttpHooks`，`SitemapApp` 内置，本模板未覆盖）：
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
- 本 starter 的登录、注册、首页、仪表盘、用户与月报示例、菜单和外壳演示两种语言。业务数据接口返回的内容由数据服务负责翻译。
- 扩展页面时为字段增加绑定并在两个语言包中补充对应 key；扩展布局时在已注册的可翻译字段内添加简写。引用独立词条或内联 `$i18n` 时，还需要按 `@pactor-app/i18n` 的可翻译字段注册表注册相应组件字段。
- provider / route / data-list 参考模块保留中文原文，接入业务时按上述范式补 `$i18n` 与词条。
- 新增语言：在 `src/server/i18n/index.ts` 的 `localeConfig.supportedLocales` 与 `manifest.locales` 中登记，新增 `locales/<locale>/app.yaml`，并在 `src/pactor/locale.tsx` 的 `supported` / `LocaleSelector` 中加入该语言。

`src/pactor/i18n/messages.ts` 只保留宿主自身视图（页面访问门禁）的词条，不参与服务端本地化；页面 / 布局文案一律走 `$i18n` 与服务端词条，两种机制不要混用。

语言包目录属于应用源码；正式部署时应随服务端产物发布，修改语言包后更新清单版本。切换语言时服务端错误会显示为资源加载失败；生产环境可进一步接入版本化发布与失败回滚。
