# Design: add-radix-shell-kits

## Context

add-radix-ui-kit 已建立模式：契约类型复用 + 独立实现包 + pactor-app 工厂注入切换。本变更推广到 interaction 与 layout。有利条件：pactor-interaction 的 `UiBridge`/`UiModal`/`UiMessage` 已是结构化 antd 无关接口，`OverlayManager`/`registerInteractionActions` 零 React；`OverlayHostProps`/`ResolvePageFn`/`InteractionProviderProps` 均已导出。pactor-layout 的 `AdminLayoutProps`/各布局 props/`LayoutRegistry` 类型均已导出。

约束：

- 契约一致：props 类型 `import type` 复用 antd 版包；行为语义对齐既有 spec（取消语义、activeMenu、页签等）。
- 不修改 pactor-interaction / pactor-layout；antd 版保持默认。
- 无对应 Radix 原语的（Drawer、Toast、菜单树）自绘，`.pcr-*` 语义 class + 极简样式表。

## Goals / Non-Goals

**Goals:**

- RadixOverlayHost（modal=Radix Dialog、drawer=自绘面板）+ RadixInteractionProvider（confirm 对话框 + toast 栈）。
- RadixAdminLayout + Radix Blank/Login/Landing + createRadixLayoutRegistry。
- pactor-app `layoutRegistry` / `interactionKit` 选项。
- 契约与切换测试；样式表；文档。

**Non-Goals:**

- Chat/Markdown 组件的 Radix 化（chat 视图用了少量 antd——Collapse/Alert/Spin，留后续）。
- 动画与转场细节、无障碍完整审计（用 Radix 原语获得基础 a11y）。
- AdminLayout 的响应式折叠、菜单图标体系（与 antd 版一致的边界）。

## Decisions

### D1: pactor-interaction-radix

- dependencies：`pactor-core`、`pactor-runtime`、`pactor-interaction`（workspace:*——复用 OverlayManager/动作/类型）+ `@radix-ui/react-dialog`；peer：`react >=18`。不依赖 antd。
- `RadixOverlayHost(props: OverlayHostProps)`：订阅 manager.stack；type modal → Radix Dialog（open 受控、onOpenChange(false) → 取消语义 close）；type drawer → 自绘固定右侧面板 + 遮罩（Escape/遮罩点击 → 取消语义）。content 渲染：与 antd host 相同——runtime `useRenderer().renderChildren` 注入 `{ params, parent }`；page overlay：props.resolvePage → 子 PageRuntime（共享宿主 registries，与 antd 版一致的做法——读 pactor-interaction/src/host.tsx 复刻其非 antd 部分）。
- `RadixInteractionProvider(props: InteractionProviderProps)`：mount 时向 bridge 注入自绘实现——`modal.confirm({ title, content, onOk, onCancel })`（门户渲染单个确认对话框，确定/取消回调后关闭）；`message.{success,error,info,warning}`（toast 栈，自动 3s 消失，容器固定右上角）；unmount 清空 bridge。
- `styles.css`：`.pcr-modal-*` / `.pcr-drawer-*` / `.pcr-confirm-*` / `.pcr-toast-*`。

### D2: pactor-layout-radix

- dependencies：`pactor-core`、`pactor-router`、`pactor-permission`、`pactor-layout`（workspace:*——复用 buildMenuItems/findMenuChain 工具与 props 类型）+ `@radix-ui/react-accordion`；peer：`react >=18`。不依赖 antd。
- `RadixAdminLayout(props: AdminLayoutProps)`：复刻 antd 版行为（布局开关、brand/headerExtra、菜单权限过滤——直接复用 pactor-layout 导出的 buildMenuItems/findMenuChain 若其不耦合 antd 类型，否则自行实现等价转换）；菜单：group → Radix Accordion 项，page/link → 按钮项；selectedKeys=activeMenu 高亮 class；点击 page → bridge.push；link/external → window.open；Breadcrumb 菜单链；Tabs 访问页签（去重/点击导航/关闭回退，与 antd 版语义一致）。
- RadixBlankLayout / RadixLoginLayout（center/split + brand）/ RadixLandingLayout（navbar/footer 插槽）：语义 class 原生元素，props 类型复用。
- `createRadixLayoutRegistry()` 预注册 admin/blank/login/landing（同名）；`registerRadixLayouts(registry)`。
- `styles.css`：`.pcr-admin-*` / `.pcr-menu-*` / `.pcr-tabs-*` / `.pcr-login-*` 等。

### D3: pactor-app 切换选项

```ts
interface PactorApplicationOptions {
  // 既有 componentRegistry?: () => Registry<unknown>
  layoutRegistry?: () => LayoutRegistry;            // 缺省 createLayoutRegistry（antd）
  interactionKit?: {
    Provider: ComponentType<InteractionProviderProps>;
    OverlayHost: ComponentType<OverlayHostProps>;
  };                                                 // 缺省 antd 版
}
```

- 组合层用所选 Provider/OverlayHost/布局注册表；类型直接复用 pactor-interaction / pactor-layout 的导出。
- 测试：缺省 antd 不变；全套切 Radix 后页面 + overlay.open + message 链路可用且出现 `.pcr-*` 元素、无 `.ant-*` 元素。

### D4: 契约一致性测试

- interaction-radix：OverlayHostProps/InteractionProviderProps 类型断言复用 antd 版类型；行为场景对齐 overlay-host / overlay-actions spec（渲染 modal/drawer、取消语义、content params 作用域、page overlay、未注入 resolvePage 受控提示、message/confirm 动作经 Radix Provider 生效）。
- layout-radix：AdminLayoutProps 类型断言；行为场景对齐 admin-layout / basic-layouts spec 关键项（开关、菜单渲染/权限过滤/高亮/导航、面包屑、页签、Blank/Login 变体/Landing 插槽、注册表解析与回退——回退语义走 resolveLayout，radix 注册表同样适用）。

## Risks / Trade-offs

- [自绘 Drawer/Toast/菜单的可访问性与细节弱于 antd] → Radix Dialog/Accordion 提供基础 a11y；其余语义 class 自绘，文档注明边界。
- [复刻 antd 版的 content/page 渲染逻辑存在两份实现 drift 风险] → 测试锁定行为；中期可把非 UI 部分下沉到 pactor-interaction（本次不做，保持零修改）。
- [样式表三套（components/interaction/layout）分散] → 统一 `.pcr-*` 前缀，文档说明全部引入方式；后续可出 pactor-theme-radix 汇总。

## Migration Plan

无（全新包 + app 向后兼容选项）。顺序：interaction-radix → layout-radix → app 选项 → 契约测试 → 文档。

## Open Questions

- chat 视图的 antd 依赖（Collapse/Alert）是否出 Radix 版：待反馈；量小，可后续顺手做。
