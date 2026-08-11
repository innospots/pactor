# Proposal: add-radix-shell-kits

## Why

add-radix-ui-kit 为 components 层建立了"契约/实现分离 + 配置切换"的模式，但 pactor-interaction（Modal/Drawer/message/confirm）与 pactor-layout（AdminLayout 等外壳）仍是 antd 实现——切换 Radix 后弹层与外壳外观不一致，去 antd 化不完整。本变更把同样的处理逻辑推广到这两个包：Radix 实现 + 配置切换。

## What Changes

- 新增 `pactor-interaction-radix` 包（`packages/interaction-radix`）：
  - `RadixOverlayHost`：与 pactor-interaction `OverlayHostProps` 同契约——modal 用 @radix-ui/react-dialog，drawer 用自绘侧边面板（Radix 无 drawer 原语），取消语义（X/蒙层/Escape → `{ success: false }`）一致；content/page 渲染复用 pactor-interaction 的机制（OverlayManager、runtime 渲染上下文、params/parent 作用域）。
  - `RadixInteractionProvider`：实现 pactor-interaction 的 `UiBridge` 契约（`UiModal.confirm` / `UiMessage` 四态）——自绘 promise 化 Confirm 对话框 + toast 消息栈（无 antd）。
  - 自带 `.pcr-*` 样式表（exports 暴露 `./styles.css`）。
- 新增 `pactor-layout-radix` 包（`packages/layout-radix`）：
  - `RadixAdminLayout`：与 `AdminLayoutProps` 同契约——Header/Sidebar/Breadcrumb/Tabs/内容出口、布局开关、菜单权限过滤与 activeMenu 高亮、bridge 导航、访问页签；菜单组用 @radix-ui/react-accordion，其余为 `.pcr-*` 语义 class 原生元素。
  - Radix 版 Blank/Login（center/split）/Landing 布局；`createRadixLayoutRegistry()` / `registerRadixLayouts(registry)`，布局类型名一致（admin/blank/login/landing）。
  - 自带 `.pcr-*` 样式表。
- **pactor-app（扩展，向后兼容）**：新增 `layoutRegistry?: () => LayoutRegistry` 与 `interactionKit?: { Provider, OverlayHost }` 两个配置项（缺省 antd 版），与既有 `componentRegistry` 组合即可完成整站 UI 库切换。
- 契约一致性测试（props 类型复用、行为场景对齐）+ pactor-app 整站切换测试。
- 文档站新增两个模块页并更新切换指南。

## Capabilities

### New Capabilities

- `radix-interaction`: OverlayHost 与 InteractionProvider 的 Radix 实现（Dialog/Drawer/Confirm/Toast），UiBridge 契约兼容。
- `radix-layout`: Admin/Blank/Login/Landing 布局的 Radix 实现与注册表，AdminLayoutProps 契约兼容。
- `shell-ui-kit-selection`: pactor-app 的 layoutRegistry / interactionKit 切换配置。

### Modified Capabilities

（无——`application-bootstrap` 的选项扩展以新能力 `shell-ui-kit-selection` 表达；ui-kit-selection 尚未归档同步，本变更不改其内容。）

## Impact

- **新增代码**：`packages/interaction-radix`、`packages/layout-radix`；**修改**：`packages/app`（两个选项 + 测试）。
- **新依赖**：`@radix-ui/react-dialog`（interaction-radix）、`@radix-ui/react-accordion`（layout-radix）。
- **不修改** pactor-interaction / pactor-layout（antd 版保持默认与现状）；UiBridge/OverlayHostProps/AdminLayoutProps 等契约均已导出，直接复用。
- 完成后，整站 antd-free 运行路径可用：`componentRegistry` + `layoutRegistry` + `interactionKit` 全部切 Radix。
