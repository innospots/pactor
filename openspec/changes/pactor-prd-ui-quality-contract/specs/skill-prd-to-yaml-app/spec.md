# Spec Delta: skill-prd-to-yaml-app

## MODIFIED Requirements

### Requirement: 参考材料完整性

Skill 的 references SHALL 包含页面模板、准确的组件映射、数据接口、主题样式、UI 质量和验收清单。组件 props、接口字段、动作行为 SHALL 与当前 packages 源码和正式文档一致，不得用统一 key/value/label 概括不同组件契约。

#### Scenario: 经验条目可执行

- **WHEN** 检索 Tabs extra、按钮组、isOpaque、Select 宽度、ChipFilter/CardList 或 Empty CTA
- **THEN** reference 给出当前真实字段、适用边界和可套用示例，模板/正式文档无相反写法

### Requirement: 页面体验质量与逐页 UI 计划

Skill SHALL 在 YAML 生成前为每个 P0/P1 页面编写 UI 计划，并在 `docs/prd/ui-plan.md` 保存页面类型、布局、区域组件及理由、Form/Field 间距、交互与状态、桌面和窄屏行为。页面 SHALL 优先使用同类标准骨架；布局变体 SHALL 有 PRD 依据和书面原因。

#### Scenario: 未做 UI 计划

- **WHEN** P0/P1 页面缺少 UI 计划或计划只写“适当布局/美化”
- **THEN** 不得进入该页 YAML 生成

#### Scenario: 组件语义不匹配

- **WHEN** 层级数据、可搜索大数据集、日期、空态或表单未使用对应语义组件
- **THEN** 静态验收不通过，修正组件选择后重验

### Requirement: 布局、主题与验收

Skill SHALL 将布局/间距、组件语义、主题和状态纳入验收。静态检查 SHALL 验证 DSL 与组件红线；浏览器验收 SHALL 覆盖桌面、窄屏、亮暗色及 empty/error/loading 状态，并对照 UI 计划检查实际页面。

#### Scenario: 视觉与布局验收

- **WHEN** 页面功能测试通过
- **THEN** 仍需确认信息层级、Field 间距、对齐、无异常溢出、暗色可读和状态无布局破坏，不能以功能通过代替 UI 质量通过
