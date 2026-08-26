# Delta: radix-theme（整个 capability 移除）

## REMOVED Requirements

### Requirement: 设计 token 层

**Reason**: `pactor-ui-radix` 包删除。
**Migration**: pactor-ui 的 shadcn 语义令牌（`--background`/`--primary` 等，`[data-pactor-theme='dark']` 约定不变）。

### Requirement: 默认 light 皮肤

**Reason**: 同上。
**Migration**: pactor-ui 默认 light 主题。

### Requirement: 内置 dark 皮肤

**Reason**: 同上。
**Migration**: pactor-ui 暗色经 `[data-pactor-theme='dark']`。

### Requirement: 换肤契约

**Reason**: 同上。
**Migration**: 覆盖 pactor-ui 令牌（CSS 变量方式一致）。

### Requirement: 零回归

**Reason**: 同上。
**Migration**: 无需迁移。
