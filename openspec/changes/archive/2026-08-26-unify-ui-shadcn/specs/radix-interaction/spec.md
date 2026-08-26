# Delta: radix-interaction（整个 capability 移除）

## REMOVED Requirements

### Requirement: RadixOverlayHost

**Reason**: `pactor-ui-radix` 包删除。
**Migration**: `ShadcnOverlayHost`（pactor-ui/interaction），props 契约不变。

### Requirement: RadixInteractionProvider

**Reason**: 同上。
**Migration**: `ShadcnInteractionProvider`。

### Requirement: 不依赖 antd

**Reason**: 同上（pactor-ui 本身即无 antd 依赖）。
**Migration**: 无需迁移。
