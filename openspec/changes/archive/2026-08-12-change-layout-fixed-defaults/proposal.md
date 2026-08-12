# Proposal: change-layout-fixed-defaults

## Why

管理后台的主流形态是顶部与侧边栏固定、内容区独立滚动；每次配置 `fixedHeader` / `fixedSider` 是重复样板。将两者缺省值改为 true 更贴合默认预期。

## What Changes

- `AdminLayoutConfig.fixedHeader` / `fixedSider` 缺省值 false → **true**（antd 与 Radix 双实现一致）；显式 `false` 可关闭。
- 文档与 spec 同步。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `admin-layout`: 固定区域缺省值调整
- `radix-layout`: Radix 版同步

## Impact

- `packages/ui-antd` / `packages/ui-radix` AdminLayout 缺省行为变化（**行为变更**，未显式配置的现有应用 header/sider 将固定）。
- 测试与文档站同步。
