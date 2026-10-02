# Spec: asset-library-data

## ADDED Requirements

### Requirement: 稳定规范 ID 体系

所有资产 MUST 使用稳定的规范 ID，与展示名称分离；展示名称可本地化或调整，MUST NOT 作为引用键。ID MUST 带对象类型前缀：Token 使用路径式 ID（如 `color.brand.500`），组件使用 `component.<name>`，模板使用 `template.<name>`，主题色系与主题分别使用 `family.<name>` 与 `theme.<name>` 前缀，素材使用独立素材 ID。跨文档、跨分类引用 MUST 使用规范 ID。

#### Scenario: 改名不断引用

- **WHEN** 某组件的展示名称调整而 `component_id` 不变
- **THEN** 所有引用该组件的模板、主题与文档页面无需修改且引用保持有效

### Requirement: 资产数据基座字段

所有资产条目 SHALL 共享基座字段：`id`、`name`、`maturity`（stable/experimental/deprecated）、`change`（new/updated/无）、`integration`（integrated/pending）、`replacedBy`（废弃时必填）、`description`。面向外部资源的条目 MUST 扩展 `availability` 字段（available/needs-review/restricted/broken）。素材类条目的权利信息 MUST 拆分为独立字段（provenance、license、attributionRequired、commercialUse、modification、redistribution、deliveryMode、reviewState），MUST NOT 合并为单一「授权状态」字段。

#### Scenario: 废弃条目完整性

- **WHEN** 构建数据中存在 `maturity: deprecated` 的条目
- **THEN** 该条目必须带有指向现存资产的 `replacedBy`，否则构建失败

#### Scenario: 待接入不冒充实数据

- **WHEN** 某条目 `integration: pending`
- **THEN** 其页面与卡片显示「待资产接入」，且不展示任何模拟数值或模拟内容

### Requirement: Git 静态内容管线

资产内容 SHALL 以结构化数据文件形式经 Git 手动维护，构建期内嵌于站点；站点 MUST 只展示当前构建版本的内容，MUST NOT 提供在线编辑、审核、权限、发布或历史版本切换能力。所有复制、下载与外链 MUST 针对当前构建版本。

#### Scenario: 内容更新流程

- **WHEN** 维护者修改资产数据文件并提交 Git 触发构建
- **THEN** 新构建版本的站点展示更新后内容，页脚同步新的构建版本与 Git 提交号

### Requirement: 构建期校验

构建 MUST 在产出页面前执行资产数据校验，校验失败 MUST 阻断构建。校验规则至少包括：规范 ID 全局唯一且符合前缀规范；跨文件引用（组件→Token、模板→component_id、主题→色系、素材引用）全部可达；废弃条目具有有效 `replacedBy`；外链条目具有 `availability`；页面展示的条目数量与覆盖矩阵 MUST 由构建期统计生成，MUST NOT 在内容中手写。

#### Scenario: 引用断裂阻断构建

- **WHEN** 某模板数据引用了不存在的 `component_id`
- **THEN** 构建失败并输出缺失引用的具体位置

#### Scenario: 数量自动统计

- **WHEN** 组件总览页展示各分类组件数量
- **THEN** 数字来自构建期对组件数据的统计，与数据文件实际条目一致

### Requirement: 首批内容接入

本变更 SHALL 优先完整接入「组件」与「主题」两个分类的真实内容：组件目录清单（覆盖通用、布局、导航、数据录入、数据展示、反馈、图表、媒体与内容、AI 与会话、业务组件十个二级分类，合计 137 个组件作为验收矩阵，含总览页覆盖矩阵与分类集合页）；主题 16 个色系（family.*：朱砂、胭脂、海棠、缃叶、栀子、秋香、竹青、松花、天青、孔雀蓝、群青、黛蓝、藤萝、檀色、月白、玄青）与主题数据契约（theme.* 前缀、OKLCH 色阶、modeSupport、差量/完整复制输出结构），含色系集合页与主题详情页骨架及代表性主题详情。「样式」「模板」「素材」三个分类本期 SHALL 仅提供导航入口与总览骨架，全部条目标注「待资产接入」，MUST NOT 填充模拟内容。

#### Scenario: 组件验收矩阵

- **WHEN** 用户打开「组件总览」
- **THEN** 可查看 10 个分类入口与合计 137 个组件的覆盖矩阵，数量与构建数据一致

#### Scenario: 主题色系可查

- **WHEN** 用户打开「主题总览」
- **THEN** 可查看 16 个色系入口卡片与主题构成链路说明，进入任一色系可见该色系主题卡片与色域展示

#### Scenario: 待接入分类不展示模拟内容

- **WHEN** 用户打开「样式」「模板」或「素材」的总览页
- **THEN** 页面显示该分类导航与「待资产接入」标注，不出现任何模拟资产数据
