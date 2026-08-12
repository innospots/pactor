# Spec Delta: admin-layout（固定区域缺省值）

## MODIFIED Requirements

### Requirement: 固定区域

config `fixedHeader` 为 true 时 Header SHALL 固定于视口顶部（内容滚动不跟随）；config `fixedSider` 为 true 时 Sidebar SHALL 固定且自身独立滚动。**缺省均为 true**（贴合管理后台主流形态）；显式配置 false 关闭。

#### Scenario: 固定顶部

- **WHEN** config.fixedHeader 为 true
- **THEN** Header 容器带固定定位样式（sticky/fixed），内容区独立滚动

#### Scenario: 缺省固定

- **WHEN** 未配置 fixedHeader / fixedSider
- **THEN** Header 与 Sidebar 均呈固定态

#### Scenario: 显式关闭

- **WHEN** config.fixedHeader 为 false
- **THEN** Header 不固定，随内容滚动
