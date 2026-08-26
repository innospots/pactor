# Delta: example-admin-antd（整个 capability 移除）

## REMOVED Requirements

### Requirement: 可启动可构建

**Reason**: examples/admin-antd 示例随 antd kit 一并删除。
**Migration**: 使用 examples/admin（shadcn）。

### Requirement: 同一 DSL 结构双 kit 运行

**Reason**: 双 kit 对比场景随 kit 收敛消失。
**Migration**: 无需迁移；契约同构由 pactor-ui 测试保证。

### Requirement: 皮肤设置面板

**Reason**: 示例删除；皮肤面板能力并入 examples/admin。
**Migration**: 见 examples/admin。

### Requirement: 中英文切换

**Reason**: 示例删除。
**Migration**: 无需迁移。
