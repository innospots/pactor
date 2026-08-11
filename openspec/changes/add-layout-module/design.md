# Design: add-layout-module

## Context

应用外壳层（设计文档第 5、22–26 节）。可复用基础：pactor-router 的 MenuRegistry（可见树/findById/activeMenu 解析）与 NavigationBridge；pactor-permission 的 filterMenusByPermission。V1 布局：login / admin / landing / chat / blank（第 98 节）——chat 随 pactor-chat，本包做 admin / blank / login / landing。

约束：

- 布局只管外壳与导航，不感知 PageRuntime；内容区是 children 出口。
- 菜单点击经 NavigationBridge（router 的抽象），不直接依赖 react-router。
- antd >= 5 peer；组件测试用 jsdom。

## Goals / Non-Goals

**Goals:**

- AdminLayout：header / sidebar / breadcrumb / tabs / footer 开关，菜单渲染（权限过滤 + activeMenu 高亮 + 导航），内容出口。
- BlankLayout / LoginLayout（center/split）/ LandingLayout（navbar/footer 插槽）。
- LayoutRegistry + resolveLayout。
- 测试与文档。

**Non-Goals:**

- chat/dashboard/workspace 等其余布局类型；Tabs keepAlive；菜单图标体系（MenuItem.icon 字符串先原样忽略或留 TODO 插槽）；响应式折叠 Sidebar（V1 固定宽度，antd Sider 默认行为）；登录认证逻辑（pactor-app）。

## Decisions

### D1: AdminLayout props 设计

```tsx
interface AdminLayoutProps {
  config: { header?: boolean; sidebar?: boolean; tabs?: boolean; breadcrumb?: boolean; footer?: boolean };
  brand: { title: string; logo?: ReactNode };
  registry: MenuRegistry;
  bridge: NavigationBridge;
  route?: RouteContext;             // 当前路由（activeMenu 高亮）
  permissionChecker?: PermissionChecker;  // 可选，过滤菜单
  headerExtra?: ReactNode;          // 用户区等
  children: ReactNode;              // 内容出口
}
```

- antd Layout + Menu（items 由可见树递归转换：group → SubMenu、page/link → Item；disabled 传递）。
- 选中：`selectedKeys = [route?.activeMenu]`；`defaultOpenKeys` 处理 defaultOpen。
- 点击：page → `bridge.push(menu.path)`；external/link → `window.open`（测试环境 stub）。
- 订阅 bridge：route 可由宿主传入；AdminLayout 内部也订阅 bridge 自行 resolveRoute（props.route 优先，便于测试）。

### D2: Breadcrumb 由菜单链推导

`findMenuChain(registry, menuId): MenuItem[]`（本包工具函数，沿 tree 父链）；activeMenu 指向列表页时链到列表页为止。breadcrumb 开关关闭时不渲染。

### D3: Tabs 极简访问页签

- 订阅 bridge：每次导航到 page 项时 push `{ key: path, title, closable: true }`（去重，首页不可关）。
- 点击页签 → bridge.push；关闭 → 移除，若关闭当前页则导航到剩余最后一个。
- 不做状态保持（切换重新渲染页面），文档注明。

### D4: 基础布局

- `BlankLayout`：直接渲染 children（带最小页面容器样式）。
- `LoginLayout`：props `{ variant: 'center'|'split', brand: { title, logo?, description? }, children }`；center 为居中卡片，split 为左品牌右表单。
- `LandingLayout`：props `{ navbar?, footer?, children }`。

### D5: LayoutRegistry

复用 core `Registry<ComponentType>`：`createLayoutRegistry()` 预注册 admin/blank/login/landing；`resolveLayout(registry, type)` 未命中返回 BlankLayout 并 console.warn（不崩）。

### D6: 依赖与结构

dependencies：`pactor-core`、`pactor-router`、`pactor-permission`（workspace:*）；peer：`react >=18`、`antd >=5`；devDeps：antd + react 测试栈。源码：`admin/`（AdminLayout、menu-items、menu-chain、tabs）、`basic/`（blank/login/landing）、`layout-registry.ts`、`index.ts`。

## Risks / Trade-offs

- [antd Menu items 结构与自定义 MenuItem 模型的映射字段差异] → 转换函数集中一处 + 测试覆盖 group/page/disabled。
- [Tabs 无 keepAlive，切换页签丢失页面状态] → V1 接受并注明；keepAlive 需页面缓存设计，后续单独评估。
- [route 双来源（props vs bridge 订阅）可能不一致] → props.route 优先且文档注明测试用途；生产由 bridge 驱动。

## Migration Plan

无（全新包）。顺序：menu 转换/chain 工具 → AdminLayout（sidebar+header+breadcrumb）→ tabs → 基础布局 → LayoutRegistry → 测试 → 文档。

## Open Questions

- 图标：MenuItem.icon 字符串 → antd 图标的映射 V1 不做（引入 icons 协议需单独设计）。
- 主题/暗色：pactor-theme 后续。
