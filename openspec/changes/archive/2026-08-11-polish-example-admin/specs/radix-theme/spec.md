# Spec: radix-theme

## MODIFIED Requirements

### Requirement: 默认 light 皮肤

默认皮肤 SHALL 提供完整状态反馈：按钮 hover/active/disabled/focus-visible；表单 focus 与错误态；表格条纹/悬停；Card 阴影与 hover 质感；Modal/Drawer 开合动画（data-state）；Tabs 激活指示；菜单悬停/激活；Toast 四态语义色。细节质感要求：Statistic 数值 28px/700、标题 13px muted、suffix 弱化；Page 标题与内容区有明确间距节奏；Table 视觉密度适中。

#### Scenario: 状态规则存在

- **WHEN** 检查样式表
- **THEN** 存在 `.pcr-btn-primary:hover`、`[data-state='open']` 动画、`.pcr-tabs-trigger[data-state='active']` 等状态规则

#### Scenario: Statistic 层次

- **WHEN** 检查 `.pcr-statistic-*` 规则
- **THEN** 数值字号/字重显著大于标题（28px/700 vs 13px muted）

#### Scenario: class 与 DOM 结构不变

- **WHEN** 对比微调前后
- **THEN** 无新增/删除 class 名，组件 DOM 结构不变
