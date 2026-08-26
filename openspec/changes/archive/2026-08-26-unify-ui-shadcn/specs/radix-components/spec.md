# Delta: radix-components（整个 capability 移除）

## REMOVED Requirements

### Requirement: 契约一致性

**Reason**: `pactor-ui-radix` 包删除，UI 收敛为唯一 shadcn kit。
**Migration**: 组件契约由 `pactor-ui` 实现（`createShadcnComponentRegistry`）。

### Requirement: 展示与布局组件

**Reason**: 同上。
**Migration**: 使用 pactor-ui 对应组件。

### Requirement: 表单组件（Radix Form）

**Reason**: 同上。
**Migration**: 使用 pactor-ui 对应组件。

### Requirement: Tabs 与 Table

**Reason**: 同上。
**Migration**: 使用 pactor-ui 对应组件。

### Requirement: 样式表

**Reason**: 同上。
**Migration**: `pactor-ui/styles.css`。

### Requirement: Input 输入类型（Radix 复现）

**Reason**: 同上。
**Migration**: pactor-ui Input 支持相同语义。
