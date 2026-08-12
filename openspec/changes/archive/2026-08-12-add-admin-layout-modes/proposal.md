# Proposal: add-admin-layout-modes

## Why

应用外壳的 admin 布局目前只有"顶部-侧边"一种结构 + 区域开关，无法表达 antd Layout 组件演示的经典布局形态（上-中-下、通栏侧边、两列侧边、固定区域、响应式、收起侧边栏），而这些是管理后台最常见的布局诉求。

## What Changes

- `AdminLayoutConfig`（bootstrap `layout` 字段，双 UI kit 契约一致）扩展：
  - `mode`：`'top-side'`（默认，现状）/ `'top-bottom'`（上-中-下）/ `'side-full'`（侧边通栏：sidebar 全高居左，header+content 居右）/ `'two-column'`（侧边两列：一级菜单窄列 + 当前组子菜单列）；
  - `fixedHeader` / `fixedSider`：固定顶部 / 固定侧边栏（内容区独立滚动）；
  - `collapsible`：sidebar 显示收起/展开 trigger，可配置初始 `collapsed`；
  - `breakpoint`：`'xs'|'sm'|'md'|'lg'|'xl'|'xxl'`，视口小于断点时 sidebar 自动收起（响应式）。
- pactor-ui-antd `AdminLayout` 与 pactor-ui-radix `RadixAdminLayout` 双实现（Radix 版样式入 styles.css，行为契约一致）。
- pactor-app `pickLayoutConfig` 透传新字段（无需改 bootstrap 协议——layout 字段本就是开放记录）。
- example-admin（双 kit）演示 `collapsible` 与 `mode` 配置；文档站 layout 相关页面同步。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `admin-layout`: 布局结构模式与固定/收起/响应式配置
- `radix-layout`: Radix 版布局的同等契约（若已有该能力则同步修改）

## Impact

- `packages/ui-antd/src/layout/**`（AdminLayout + 类型 + 测试）
- `packages/ui-radix/src/layout/**` 与 `styles.css`（Radix 实现 + 测试）
- `packages/app/src/application.ts`（pickLayoutConfig 透传）
- `examples/admin` / `examples/admin-antd`（bootstrap layout 配置演示）
- 文档站 `packages/app` / `packages/ui-antd` / `packages/ui-radix` 页面
- 向后兼容：缺省配置行为与现状完全一致（mode 缺省 top-side，其余缺省关）
