---
title: "@pactor-app/app"
description: 一站式组合层——createPactorApplication 启动编排（loader/bootstrap/权限/菜单/布局）、共享 registries、react-router 动态路由、页面加载与错误兜底、mount/unmount 与扩展注册 API
---

`@pactor-app/app` 是框架的一站式组合层。业务工程不再需要逐包组装：一个 `createPactorApplication` 调用完成 DSL 资源加载、bootstrap 编排、共享 registries、动态路由、布局外壳、页面运行时、Overlay/Provider 集成与错误兜底。

```bash
pnpm add @pactor-app/app react react-dom react-router-dom
```

`react >= 18`、`react-dom >= 18`、`react-router-dom >= 6` 为 peer dependency（开发基准为 react-router-dom v7）。

**默认 UI 为 @pactor-app/ui 内置实现**（随 @pactor-app/app 传递依赖）。组件样式为构建期预编译的 Tailwind 工具类，**必须导入预建样式表**（消费方无需 Tailwind 配置）：

```ts
import '@pactor-app/ui/styles.css';
```

如需自定义组件 / 布局 / 交互层实现，使用 `componentRegistry` / `layoutRegistry` / `interactionKit` 覆盖点（见 [@pactor-app/ui](/packages/ui/)）。

## 一站式用法

```tsx
import { createPactorApplication } from '@pactor-app/app';
import '@pactor-app/ui/styles.css'; // 内置 UI 的预建样式（必需）

createPactorApplication({
  appId: 'risk-admin',
  api: { baseURL: '/api/runtime' }, // 缺省即 '/api/runtime'
}).mount('#root');
```

业务代码目录可以非常薄——页面完全动态化时甚至不需要 `pages/*.tsx`：

```text
src/
├── services/
├── extensions/
├── components/
└── main.tsx
```

服务端按 @pactor-app/resource Envelope 协议提供 `{baseURL}/bootstrap` 与 `{baseURL}/pages/{id}` 端点。bootstrap 字段全部可选（缺省按空处理）：

| 字段 | 说明 |
| --- | --- |
| `app.name` | 应用名，作为布局品牌区标题（回退 `appId`） |
| `user` | 当前用户，注入页面表达式作用域 `${user.*}` |
| `permissions` | 权限码数组（缺省 `[]`），写入 PermissionStore |
| `menus` | 菜单树（缺省 `[]`），构建 MenuRegistry 驱动动态路由 |
| `layout.type` / `layout.{header,sidebar,tabs,breadcrumb,footer}` | 布局类型与区域开关 |
| `layout.mode` | 结构模式：`top-side`（缺省，顶部-侧边）/ `top-bottom`（上-中-下，无侧边栏）/ `side-full`（侧边通栏全高，品牌区入侧边栏）/ `two-column`（侧边两列：一级菜单窄列 + 当前组子菜单列） |
| `layout.fixedHeader` / `layout.fixedSider` | 固定顶部 / 固定侧边栏（内容区独立滚动），缺省 true，显式 false 关闭 |
| `layout.collapsible` / `layout.collapsed` | 侧边栏收起 trigger / 初始收起（two-column 模式不叠加 trigger） |
| `layout.breakpoint` | 响应式断点 `xs/sm/md/lg/xl/xxl`，视口小于断点时侧边栏自动收起 |
| `pageVersions` | 页面版本表，用于 loader 缓存版本控制 |

## Options

| 字段 | 说明 |
| --- | --- |
| `appId`（必填） | 应用 id：app 作用域缺省 `id`、brand 缺省标题回退 |
| `api.baseURL` | DSL 资源 API 基础路径（缺省 `/api/runtime`）；未注入 loader 时创建 `HttpDslResourceLoader` |
| `loader` | 自定义 `DslResourceLoader`（优先于 api；测试/本地用 `StaticDslLoader`） |
| `layout` | 布局类型覆盖（优先级：`options.layout` > `bootstrap.layout.type` > `'admin'`） |
| `brand` | `{ title, logo? }`，品牌区覆盖 |
| `router` | `{ type?: 'browser' \| 'hash', basename?: string }`；当前版本支持 browser + basename |
| `components` | 业务组件（写入应用级共享 registry，可覆盖同名内置组件） |
| `actions` | 业务动作（可覆盖同名内置/交互动作） |
| `services` / `capabilities` | 业务服务与能力扩展 |
| `providers` | 应用级包装组件（Router 之内、InteractionKit 之外）：业务 ConfigProvider / 全局 Context 由此进入应用树（message / modal / overlay 均消费其上下文），缺省不包装 |
| `headerExtra` | admin 布局头部右侧插槽（透传 AdminLayout `headerExtra`） |
| `authTokenProvider` | `() => string \| undefined \| Promise<string \| undefined>`；注入 DSL 资源请求与页面 HTTP 出口（`Authorization: Bearer`） |

```tsx
createPactorApplication({
  appId: 'risk-admin',
  loader: new StaticDslLoader({ bootstrap, pages }), // 本地/测试注入
  layout: 'admin',
  brand: { title: '风控平台' },
  router: { basename: '/console' },
  components: { RiskScore },
  authTokenProvider: () => getToken(),
});
```

## 启动编排

mount 后依次：加载 bootstrap（全屏 loading）→ `PermissionStore` 写入 permissions → `MenuRegistry(menus)` → 解析布局 → 组装共享 registries 与 adapters。bootstrap 失败渲染含**重试**按钮的启动错误页，不白屏。

应用级共享 registries 被所有页面 PageRuntime 共享：

- **components**：全部内置组件（缺省 @pactor-app/ui 内置实现）+ `options.components` + 运行期注册；
- **actions**：runtime 内置动作（setState / request / if 等，页面运行时创建时注册）+ 交互动作（`overlay.open` / `overlay.close` / `confirm` / `message`，应用级 OverlayManager / UiBridge 单例）+ `navigate` 动作（经 react-router 导航）+ `options.actions`；
- **services / capabilities**：`options` 扩展 + 运行期注册。

页面运行时创建时注入 permission / router / http adapters 与 route context（`${route.params.*}` / `${route.query.*}`）、`user`（bootstrap.user）、`app`（bootstrap.app）。同 `pageId` 导航往返或 `route.params` 变化时销毁重建（当前版本无 keepAlive）。

## React 组合结构

```tsx
<BrowserRouter basename={...}>
  <RouterBridgeSync />                {/* react-router → NavigationBridge */}
  <Providers>                         {/* options.providers，可选应用级包装 */}
    <InteractionProvider bridge={uiBridge}>
      <AdminLayout brand registry bridge route permissionChecker headerExtra={...}>
        <Routes>
          <Route path="*" element={
            <DynamicDslRoute
              render={({ pageId, route }) => <DslPageLoader ... />}
              fallback={<NotFound />}     // 未命中 404
              forbidden={<Forbidden />}   // 无权限 403
              permissionChecker={store}
            />
          } />
        </Routes>
      </AdminLayout>
    </InteractionProvider>
  </Providers>
</BrowserRouter>
```

`DslPageLoader`：pageId → loadPage → createPageRuntime → PageRuntimeView；加载中渲染 loading 态，失败渲染含重试的受控错误页，渲染期异常由 ErrorBoundary 捕获（外壳不崩溃）。OverlayHost 作为 PageRuntimeView 的 children（共享当前页面 Renderer 上下文）；page 类型 overlay 经 loader 加载页面 DSL，子运行时共享应用级 registries。

## 扩展注册 API

```ts
const app = createPactorApplication({ appId: 'risk-admin', api: { baseURL: '/api/runtime' } });

app.registerComponent('StrategyFlow', StrategyFlow);
app.registerAction('strategy.export', exportStrategy);
app.registerService('strategy', strategyService);
app.registerCapability('strategy.backtest', backtestCapability);

app.mount('#root');
// app.unmount();  // 卸载根；重复 mount 会先卸载旧根
```

注册写入应用级共享 registry（同名覆盖）：新创建/重建的页面即可用，当前已创建页面下次重建后生效。

:::note
当前版本边界（暂未支持）：登录流程/auth.login 动作、Theme、i18n、telemetry/audit、灰度多租户、页面 keepAlive。布局类型未命中时回退 BlankLayout 并告警（@pactor-app/ui layout 层 resolveLayout 行为）。
:::
