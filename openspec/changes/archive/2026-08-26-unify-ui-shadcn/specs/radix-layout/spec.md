# Delta: radix-layout（整个 capability 移除）

## REMOVED Requirements

### Requirement: RadixAdminLayout

**Reason**: `pactor-ui-radix` 包删除。
**Migration**: `ShadcnAdminLayout`（pactor-ui/layout），AdminLayoutProps 契约不变。

### Requirement: Radix 基础布局

**Reason**: 同上。
**Migration**: ShadcnBlankLayout / ShadcnLoginLayout / ShadcnLandingLayout。

### Requirement: 布局注册表

**Reason**: 同上。
**Migration**: `createShadcnLayoutRegistry` / `registerShadcnLayouts`。

### Requirement: 不依赖 antd

**Reason**: 同上。
**Migration**: 无需迁移。
