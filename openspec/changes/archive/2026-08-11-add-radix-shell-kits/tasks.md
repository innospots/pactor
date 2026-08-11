# Tasks: add-radix-shell-kits

## 1. pactor-interaction-radix（spec: radix-interaction）

- [x] 1.1 包骨架：`packages/interaction-radix`（dependencies `pactor-core`/`pactor-runtime`/`pactor-interaction` workspace:* + `@radix-ui/react-dialog`，peerDeps `react >=18`，devDeps react 测试栈 + pactor-components-radix 供 content 测试）、tsconfig、tsup、LICENSE、README、tests/setup.ts；`pnpm install`
- [x] 1.2 styles.css（`.pcr-modal-*`/`.pcr-drawer-*`/`.pcr-confirm-*`/`.pcr-toast-*`）+ exports `./styles.css`
- [x] 1.3 RadixOverlayHost：modal=Radix Dialog、drawer=自绘面板；取消语义；content `{ params, parent }` 作用域渲染；page overlay（resolvePage 子运行时）；未注入受控提示（复刻 pactor-interaction host 的非 antd 逻辑）
- [x] 1.4 RadixInteractionProvider：自绘 confirm 对话框（promise 化 onOk/onCancel）+ toast 栈（自动消失），注入/清空 UiBridge
- [x] 1.5 测试：overlay-host 与 overlay-actions 关键场景 + 无 antd 依赖检查

## 2. pactor-layout-radix（spec: radix-layout）

- [x] 2.1 包骨架：`packages/layout-radix`（dependencies `pactor-core`/`pactor-router`/`pactor-permission`/`pactor-layout` workspace:* + `@radix-ui/react-accordion`，peerDeps `react >=18`，devDeps react 测试栈）、tsconfig、tsup、LICENSE、README、tests/setup.ts；`pnpm install`
- [x] 2.2 styles.css（`.pcr-admin-*`/`.pcr-menu-*`/`.pcr-tabs-*`/`.pcr-login-*` 等）+ exports `./styles.css`
- [x] 2.3 RadixAdminLayout：布局开关、Header/brand/headerExtra、菜单（group 折叠/page/link/disabled/权限过滤/activeMenu 高亮/bridge 导航/external 新窗口）、Breadcrumb、Tabs 访问页签（复用 pactor-layout 的 buildMenuItems/findMenuChain，若耦合 antd 则等价自实现）
- [x] 2.4 RadixBlankLayout / RadixLoginLayout（center/split）/ RadixLandingLayout
- [x] 2.5 createRadixLayoutRegistry / registerRadixLayouts（类型名一致）
- [x] 2.6 测试：admin-layout 与 basic-layouts 关键场景 + 无 antd 依赖检查

## 3. pactor-app 切换选项（spec: shell-ui-kit-selection）

- [x] 3.1 options 增加 `layoutRegistry?: () => LayoutRegistry` 与 `interactionKit?: { Provider, OverlayHost }`（缺省 antd 版），组合层接线
- [x] 3.2 测试：缺省 antd 不变；全套 Radix 切换（页面 + overlay.open + message + 无 `.ant-*` 元素）

## 4. 验收与文档

- [x] 4.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 4.2 文档站新增 `packages/interaction-radix.md` 与 `packages/layout-radix.md`，更新 components-radix 页的切换指南为整站 recipe，侧边栏与快速开始模块表同步，`pnpm docs:build` 通过
