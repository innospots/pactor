# Delta: ui-kit-antd-preset（整个 capability 移除）

## REMOVED Requirements

### Requirement: 聚合包导出

**Reason**: `pactor-ui-antd` 包删除，UI 收敛为唯一 shadcn kit（pactor-ui）。
**Migration**: 等价符号从 `pactor-ui` 导入（createShadcnComponentRegistry 等）。

### Requirement: antdUiKit 预设对象

**Reason**: antd kit 移除。
**Migration**: 使用 `shadcnUiKit`（唯一内置预设）。

### Requirement: 预设可用性

**Reason**: antd kit 移除。
**Migration**: `ui: shadcnUiKit`。
