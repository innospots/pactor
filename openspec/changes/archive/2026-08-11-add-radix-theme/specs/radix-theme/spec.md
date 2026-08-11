# Spec: radix-theme

pactor-ui-radix 的 token 化主题体系：默认 light 皮肤、内置 dark 皮肤、CSS 变量换肤契约。

## ADDED Requirements

### Requirement: 设计 token 层

样式表 SHALL 定义 `--pcr-*` CSS 变量三层结构：色板 token（accent 刻度基于 `#3C47DD`、slate 中性刻度、语义实体色）、语义 token（bg/fg/border/accent 各态/四语义色/focus-ring）、形状 token（radius/shadow/font）。组件规则 MUST 经由语义 token 取值，MUST NOT 在组件规则中直接写硬编码色值。

#### Scenario: token 定义存在

- **WHEN** 检查 styles.css
- **THEN** `:root` 中含 `--pcr-accent`、`--pcr-bg`、`--pcr-fg`、`--pcr-border`、`--pcr-radius-md`、`--pcr-shadow-md`、`--pcr-focus-ring` 等定义

#### Scenario: 组件规则经变量取值

- **WHEN** 检查组件规则区（token 定义之外）
- **THEN** 不存在硬编码 hex 色值

### Requirement: 默认 light 皮肤

默认皮肤 SHALL 提供完整状态反馈：按钮 hover/active/disabled/focus-visible；表单 focus 与错误态；表格条纹/悬停；Card 阴影；Modal/Drawer 开合动画（data-state）；Tabs 激活指示；菜单悬停/激活；Toast 四态语义色。

#### Scenario: 状态规则存在

- **WHEN** 检查样式表
- **THEN** 存在 `.pcr-btn-primary:hover`、`[data-state='open']` 动画、`.pcr-tabs-trigger[data-state='active']` 等状态规则

### Requirement: 内置 dark 皮肤

SHALL 提供 `[data-pactor-theme='dark']` 暗色皮肤：覆盖全部语义 token 与色板 token，挂在 html 或任意容器生效。

#### Scenario: dark token 覆盖

- **WHEN** 检查样式表
- **THEN** 存在 `[data-pactor-theme='dark']` 块且其内重定义 `--pcr-bg`、`--pcr-fg`、`--pcr-accent` 等同名 token

### Requirement: 换肤契约

用户换肤 MUST 支持三种方式（文档化）：覆盖 CSS 变量（可在只改主色等少数 token）；`data-pactor-theme='dark'`；直接覆盖 `.pcr-*` class（向后兼容）。MUST NOT 要求用户修改包内文件。

#### Scenario: 文档包含契约

- **WHEN** 阅读主题指南页
- **THEN** 含三种方式的示例与完整 token 清单

### Requirement: 零回归

整合 MUST NOT 改变任何 class 名与 DOM 结构：ui-radix 全部既有测试与 app 的 `.pcr-*` 断言原样通过。

#### Scenario: 既有测试全过

- **WHEN** 运行全量测试
- **THEN** 无失败
