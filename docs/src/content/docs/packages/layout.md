---
title: pactor-layout
description: 布局——应用外壳（AdminLayout / BlankLayout / LoginLayout / LandingLayout）与 LayoutRegistry，基于 MenuRegistry + NavigationBridge 的菜单渲染与导航
---

`pactor-layout` 实现设计文档第 5、22–26 节的应用外壳层。布局只管外壳与导航，不感知 PageRuntime；内容区是 children 出口。可复用 pactor-router 的 `MenuRegistry`（可见树 / findById / activeMenu 解析）与 `NavigationBridge`，以及 pactor-permission 的 `filterMenusByPermission`。

```bash
pnpm add pactor-layout pactor-router pactor-permission antd react
```

`react >= 18`、`antd >= 5` 为 peer dependency（开发基准为 antd v6）。

## AdminLayout

标准管理后台外壳：`config` 开关控制 `header` / `sidebar` / `tabs` / `breadcrumb` / `footer` 显隐（缺省 header/sidebar 开，tabs/breadcrumb/footer 关）。

```tsx
import { MemoryNavigation, MenuRegistry } from 'pactor-router';
import { AdminLayout } from 'pactor-layout';

const registry = new MenuRegistry(menus);
const bridge = new MemoryNavigation('/');

<AdminLayout
  config={{ tabs: true, breadcrumb: true }}
  brand={{ title: '运营平台' }}
  registry={registry}
  bridge={bridge}
  permissionChecker={permissionStore} // 可选
  headerExtra={<UserMenu />}
>
  {pageContent}
</AdminLayout>;
```

| prop | 说明 |
| --- | --- |
| `config` | 区域开关：`header` / `sidebar` / `tabs` / `breadcrumb` / `footer` |
| `brand` | `{ title, logo? }`，Header 品牌区 |
| `registry` | pactor-router `MenuRegistry` |
| `bridge` | pactor-router `NavigationBridge`，布局内部订阅它解析当前路由 |
| `route?` | 当前 `RouteContext`，优先用于选中态（测试友好）；未传时由 bridge 订阅驱动 |
| `permissionChecker?` | 提供时菜单先经 `filterMenusByPermission` 过滤 |
| `headerExtra?` | Header 右侧插槽（用户区等） |
| `children` | 内容出口 |

### Sidebar 菜单

MenuRegistry 可见树（hidden 已过滤）递归转换为 antd Menu items：`group` → 子菜单、`page` / `link` → 菜单项、`disabled` 原样传递、`defaultOpen` 归入 `defaultOpenKeys`。选中态取当前路由的 `activeMenu`（隐藏详情页高亮其指向的可见项）。点击 `page` 项经 `bridge.push(path)` 导航；`link` / `external` 项 `window.open` 新窗口打开。菜单点击只经过 NavigationBridge 抽象，不直接依赖具体路由库。

### Breadcrumb

`breadcrumb: true` 时按 `activeMenu` 的菜单链渲染（`findMenuChain(registry, activeMenuId)`，group → page）。

### Tabs（访问页签）

`tabs: true` 时订阅 bridge 维护访问页签：导航到 `page` 项新增页签（按 path 去重，首页不可关），点击页签导航回对应路径，关闭当前页签时回退导航到剩余最后一个页签。V1 不做 keepAlive——切换页签会重新渲染页面、丢失页面状态。

## 基础布局

| 布局 | props | 说明 |
| --- | --- | --- |
| `BlankLayout` | `children` | 直接渲染 children（最小页面容器），用于无壳页面与嵌入场景 |
| `LoginLayout` | `variant: 'center' \| 'split'`（缺省 center）、`brand: { title, logo?, description? }`、`children` | center 为居中卡片式品牌区 + 表单出口；split 为左品牌区右表单区。不含认证逻辑 |
| `LandingLayout` | `navbar?`、`footer?`、`children` | 可选顶部导航与底部插槽，children 为主内容区 |

## LayoutRegistry

复用 pactor-core 的 `Registry<ComponentType>`：

```ts
import { createLayoutRegistry, resolveLayout } from 'pactor-layout';

const layouts = createLayoutRegistry(); // 预注册 admin / blank / login / landing
const Layout = resolveLayout(layouts, 'admin'); // 命中返回组件
resolveLayout(layouts, 'unknown'); // 未命中返回 BlankLayout 并 console.warn（不抛错）
layouts.register('workspace', MyWorkspaceLayout); // 业务可注册自定义布局类型
```

:::note
`MenuItem.icon` 字符串到 antd 图标的映射 V1 不做（留待图标协议设计）；响应式折叠 Sidebar 与主题/暗色亦为后续工作（见 design.md Open Questions）。
:::
