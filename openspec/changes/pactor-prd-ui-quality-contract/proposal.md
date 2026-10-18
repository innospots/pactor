# Proposal: pactor-prd-ui-quality-contract

## Why

模板干净并不等于生成项目好用或美观。当前技能从 PRD 直接进入组件映射和 YAML 生成，缺少逐页的布局、间距、组件语义和状态决策；references 中部分经验还存在字段契约不准确或与示例不一致的问题。结果是页面可能“能渲染”，但布局拥挤、表单间距不一致、组件选型不合适或交互只完成静态外观。

## What Changes

- 在页面生成前增加逐页 UI 计划，保存到生成项目 `docs/prd/ui-plan.md`，明确页面类型、布局、区域组件、Form/Field 间距、状态和窄屏行为。
- 新增 `references/ui-quality.md`，定义布局/间距/组件语义/视觉状态的生成规则和验收 rubric。
- 修正并沉淀九项实战经验：Tabs extra、两类按钮组、聚合样式入口、isOpaque、Flex/Button 合法值、Select 宽度、接口字段、Empty CTA；不再把不同组件的 props 混为统一 key/value/label。
- 同步标准 YAML 示例、正式组件文档和验收清单；单页签 Tabs 不作为默认分区手段，组件选择必须说明语义依据。
- 后续通过 `pactor-prd-generated-project-acceptance` 用真实生成项目验证这些契约，而不是以文档存在代替质量。

## Capabilities

### Modified Capabilities

- `skill-prd-to-yaml-app`: 增加逐页 UI 计划和页面体验质量要求，完善 references 的准确性与使用时机。

## Impact

- `skills/pactor-prd/{SKILL.md,references/**,template/src/server/yaml/**}`。
- `docs/src/content/docs/components/` 中相关组件文档。
- 依赖 `pactor-prd-experience-distill` 提供的干净正确模板；不修改框架组件行为。
