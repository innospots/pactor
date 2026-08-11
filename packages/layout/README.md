# pactor-layout

[Pactor](https://github.com/426-330/pactor) 的布局包：应用外壳层（设计文档第 5、22–26 节）。提供 AdminLayout（管理后台外壳：Header / Sidebar / Breadcrumb / Tabs / Footer 开关 + 菜单导航）、BlankLayout / LoginLayout / LandingLayout 基础布局，以及 LayoutRegistry。布局只管外壳与导航，不感知 PageRuntime；内容区是 children 出口。

## 安装

```bash
npm install pactor-layout pactor-router pactor-permission antd react
# 或
pnpm add pactor-layout pactor-router pactor-permission antd react
```

`react >= 18`、`antd >= 5` 为 peer dependency（开发基准为 antd v6）。

## 示例

```tsx
import { MemoryNavigation, MenuRegistry } from 'pactor-router';
import { AdminLayout, createLayoutRegistry, resolveLayout } from 'pactor-layout';

const registry = new MenuRegistry(menus);
const bridge = new MemoryNavigation('/');

<AdminLayout
  config={{ header: true, sidebar: true, tabs: true, breadcrumb: true }}
  brand={{ title: '运营平台' }}
  registry={registry}
  bridge={bridge}
  permissionChecker={permissionStore} // 可选，过滤无权限菜单
  headerExtra={<UserMenu />}
>
  {pageContent}
</AdminLayout>;
```

按类型名解析布局（未命中回退 BlankLayout 并告警，不抛错）：

```ts
const layouts = createLayoutRegistry(); // 预注册 admin / blank / login / landing
const Layout = resolveLayout(layouts, 'admin');
layouts.register('workspace', MyWorkspaceLayout); // 自定义布局
```

## 布局一览

- **AdminLayout**：Header（brand + headerExtra）、Sidebar（MenuRegistry 可见树 → antd Menu：group → 子菜单、page/link → 菜单项、disabled 传递；提供 permissionChecker 时先经权限过滤）、可选 Breadcrumb（按 activeMenu 菜单链推导）、可选 Tabs（访问页签：去重、点击导航、可关闭，关闭当前回退到剩余最后一个；无 keepAlive）、可选 Footer。选中态取 `route.activeMenu`（props.route 优先，便于测试；生产由 bridge 订阅驱动）。点击 page 项经 `bridge.push(path)` 导航，link/external 项 `window.open` 新窗口。
- **BlankLayout**：直接渲染 children（最小页面容器），用于无壳页面与嵌入场景。
- **LoginLayout**：`variant: 'center' | 'split'`（缺省 center）+ `brand`（title / logo / description）；只负责品牌区与表单出口布局，不含认证逻辑。
- **LandingLayout**：可选 `navbar` / `footer` 插槽，children 为主内容区。

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
