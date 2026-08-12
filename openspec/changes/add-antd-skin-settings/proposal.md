# Proposal: add-antd-skin-settings

## Why

example-admin-antd 目前跑 antd 默认主题，用户无法体验"皮肤设置"这一管理后台标配能力；同时框架缺少两个必要的注入点：antd 主题需要 ConfigProvider 进入应用树（运行时可切换），头部皮肤入口需要 headerExtra 注入。

## What Changes

- **pactor-app 新增两个通用槽位**：
  - `providers?: ComponentType<{ children?: ReactNode }>`——Router 之内、InteractionKit 之外的应用级包装（业务的 ConfigProvider / 全局 Context 由此进入应用树）；
  - `headerExtra?: ReactNode`——admin 布局头部右侧插槽（透传 AdminLayout 既有 prop）。
- **example-admin-antd 皮肤设置**：头部皮肤按钮 → Drawer 面板：主色预设色板 + 自定义取色、暗黑模式开关、圆角调节；`SkinProvider` 经 useSyncExternalStore 订阅皮肤 store（localStorage 持久化），实时构造 antd ThemeConfig（colorPrimary / borderRadius / darkAlgorithm），即时生效不刷新页面。
- 文档站 packages/app options 表同步。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `application-shell`: 新增 providers / headerExtra 应用级槽位
- `example-admin-antd`: 皮肤设置面板

## Impact

- `packages/app/src/application.ts`（options + handle）与 `app-shell.tsx`（槽位接线）+ 测试。
- `examples/admin-antd/src/`：skin.ts（store）、SkinProvider.tsx、SkinSettings.tsx、main.tsx 接入。
- 向后兼容：槽位均可选，缺省行为不变。
