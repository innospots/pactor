# Design: change-layout-fixed-defaults

单点改动：两处实现中 `config.fixedHeader` / `config.fixedSider` 的取值由直接判断改为 `?? true`（显式 false 关闭）。无新类型、无新配置。

- antd `AdminLayout`：header/sider 的 sticky 内联样式条件改为 `config.fixedHeader ?? true` / `config.fixedSider ?? true`；
- Radix `RadixAdminLayout`：修饰 class 条件同步；
- 测试：补"缺省即固定"与"显式 false 关闭"断言；
- 文档：packages/app、ui-antd、ui-radix 配置表缺省说明。

验证：双 kit 测试全绿 + 示例（5199/5299）滚动行为抽查。
