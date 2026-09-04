# @pactor-app/app

[Pactor](https://github.com/426-330/pactor) 的一站式组合层（设计文档第 86–89 节）。业务工程只调 `createPactorApplication({ appId, api }).mount('#root')` 即可完成：DSL 资源加载（loader）→ bootstrap 编排（权限 / 菜单 / 布局）→ 共享 registries（内置组件 + 交互动作 + 业务扩展）→ react-router 动态路由 → 布局外壳 → PageRuntime 页面渲染 → Overlay/Provider 集成 → 启动与页面错误兜底。

## 安装

```bash
npm install @pactor-app/app @pactor-app/ui react react-dom react-router-dom
# 或
pnpm add @pactor-app/app @pactor-app/ui react react-dom react-router-dom
```

`react >= 18`、`react-dom >= 18`、`react-router-dom >= 6` 为 peer dependency（开发基准为 react-router-dom v7）。内置 UI kit 为 `@pactor-app/ui`（shadcn，传递依赖），需导入其预建样式表 `import '@pactor-app/ui/styles.css'`。

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
- 跳转为自然导航：`Link` 组件渲染原生 `<a href>`，`navigate` 动作退化为 `location.assign`——不注入宿主路由对象
- `route.params` / `route.query` 经 props 纯数据注入（如 Next.js 的 `searchParams`）

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
