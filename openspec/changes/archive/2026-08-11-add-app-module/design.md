# Design: add-app-module

## Context

组合层（设计文档第 86–89 节）。全部零件已就绪：loader（resource）、PermissionStore/adapter（permission）、MenuRegistry/NavigationBridge/DynamicDslRoute（router）、LayoutRegistry/AdminLayout（layout）、createPageRuntime（runtime）、内置组件（components）、OverlayHost/InteractionProvider/交互动作（interaction）。

约束：

- 一站式：业务只调 `createPactorApplication({ appId, api }).mount('#root')`。
- loader 可替换：生产 HttpDslResourceLoader（baseURL），测试/本地 StaticDslLoader。
- 页面级 PageRuntime 共享应用级 registries（组件/动作/服务全局注册一次，所有页面可用）。
- react-router-dom 为真实路由（MemoryNavigation 仅测试）；React 18/19 createRoot。

## Goals / Non-Goals

**Goals:**

- createPactorApplication 启动编排 + mount/unmount + 扩展注册 API。
- Application React 组合：DynamicDslRoute → 页面加载（loading/error）→ PageRuntime → 布局包裹 → Overlay/Provider → ErrorBoundary。
- 端到端测试（StaticDslLoader 全链路）。
- 文档。

**Non-Goals:**

- 登录流程/auth.login 动作、Theme、i18n、telemetry/audit、灰度多租户、keepAlive。
- 服务端 bootstrap 协议未提供的字段不做假设（menus 缺省为空数组时渲染空菜单 + 404 语义）。

## Decisions

### D1: options 与启动编排

```ts
interface PactorApplicationOptions {
  appId: string;
  api?: { baseURL?: string };          // 默认 '/api/runtime'
  loader?: DslResourceLoader;          // 优先于 api
  layout?: string;                     // 覆盖 bootstrap.layout.type
  brand?: { title: string; logo?: ReactNode };  // 覆盖 bootstrap.app.name
  components?: Record<string, unknown>;
  actions?: Record<string, ActionHandler>;
  services?: Record<string, ServiceFn>;
  capabilities?: Record<string, unknown>;
  authTokenProvider?: () => string | undefined | Promise<string | undefined>;
}
```

- loader：options.loader ?? new HttpDslResourceLoader({ baseUrl: api?.baseURL, headers 注入 authTokenProvider })。
- bootstrap 失败：渲染受控启动错误页（含重试按钮），不白屏。
- menus 缺省 `[]`；permissions 缺省 `[]`；layout type 优先级 options.layout > bootstrap.layout?.type > 'admin'。

### D2: 共享 registries 与页面运行时工厂

- 应用级 `components` registry = createBuiltinComponentRegistry() + options.components + 运行期 registerComponent。
- `actions` registry = 内置（runtime 注册）+ 交互动作（registerInteractionActions，manager/ui 应用级单例）+ options.actions + 运行期 registerAction。
- `services` registry = options.services + 运行期 registerService；capabilities 同。
- `createPageRuntimeForPage(pageDsl, route)`：注入共享 registries、permissionAdapter(store)、routerAdapter(bridge)、httpAdapter（同 loader 的 token 注入）、route context（path/params/query）、user（bootstrap.user）、app（bootstrap.app）。
- PageRuntime 缓存：同 pageId 导航往返时销毁重建（V1 无 keepAlive）；route.params 变化时重建。

### D3: React 组合结构

```tsx
<BrowserRouter>            // 或宿主传入 router 组件/基础路径 basename
  <InteractionProvider bridge={uiBridge}>
    <LayoutComponent ...>   // resolveLayout 结果；admin 传 brand/registry/bridge/route/headerExtra
      <Routes>
        <Route path="*" element={
          <DynamicDslRoute registry render={({pageId, route}) => <DslPageLoader .../>}
                           fallback={<NotFound/>} forbidden={<Forbidden/>}
                           permissionChecker={...} />
        }/>
      </Routes>
    </LayoutComponent>
    <OverlayHost manager={overlayManager} resolvePage={...} />
  </InteractionProvider>
</BrowserRouter>
```

- `DslPageLoader`：pageId 变化 → loadPage → createPageRuntimeForPage → PageRuntimeView；loading 渲染 Spin 容器；加载/运行错误渲染受控错误页；ErrorBoundary 包裹 PageRuntimeView。
- OverlayHost 的 resolvePage：loader.loadPage(pageId) → PageDsl（子运行时在 host 内部创建，共享 registries——interaction 的 host 已支持传入共享注册表，若不支持则在 app 层包装 resolvePage 返回预渲染内容或最小扩展 interaction，允许并注明）。
- NavigationBridge：用 router 的 `useReactRouterBridge` 适配 react-router（AdminLayout 菜单导航与 DSL navigate 动作都经它）；OverlayHost 放在 Layout 外、Provider 内，能访问页面 Renderer 上下文（runtime 已支持 PageRuntimeView children——若结构不允许，把 OverlayHost 作为 DslPageLoader 内 PageRuntimeView 的 children，取实现可行者并注明）。

### D4: mount/unmount 与扩展 API

- `mount(selector)`：querySelector → createRoot → render `<Application/>`；重复 mount 先 unmount。
- `unmount()`：root.unmount。
- `registerComponent/Action/Service/Capability`：写入应用级共享 registry（注册后新创建/重建的页面即可用；当前页面刷新后生效——文档注明）。

### D5: 依赖与结构

dependencies：`pactor-core`、`pactor-schema`、`pactor-expression`、`pactor-runtime`、`pactor-components`、`pactor-permission`、`pactor-resource`、`pactor-router`、`pactor-interaction`、`pactor-layout`（workspace:*）；peer：`react >=18`、`react-dom >=18`、`react-router-dom >=6`、`antd >=5`。源码：`application.ts`（编排 + app 实例）、`Application.tsx`（React 组合）、`page-loader.tsx`、`error-boundary.tsx`、`index.ts`。

## Risks / Trade-offs

- [组合层涉及全部模块，集成坑集中爆发（context 层级、registry 共享、OverlayHost 位置）] → 端到端测试驱动；允许对既有包做最小向后兼容补充并逐项注明。
- [jsdom 中 createRoot + react-router + antd 全栈测试较慢] → 端到端测试控制在少数关键链路。
- [bootstrap 协议字段假设] → 全部按可选处理并给缺省；文档列出期望字段。

## Migration Plan

无（全新包）。顺序：编排骨架（loader/permission/menu/registries）→ Application 组合 → DslPageLoader → ErrorBoundary/loading → 端到端 → 文档。

## Open Questions

- 设计文档示例 API 名 `createDslApplication` → `createPactorApplication`（已定）；设计文档后续统一替换。
- basename/HashRouter 支持：options 预留 `router?: { type: 'browser'|'hash', basename?: string }`，V1 至少支持 browser + basename。
