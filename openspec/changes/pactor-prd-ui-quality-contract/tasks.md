# Tasks: pactor-prd-ui-quality-contract

## 1. 契约与 references

- [x] 1.1 新增 `references/ui-quality.md`：定义四层体验质量、逐页 UI 计划表格格式、标准骨架/允许变体、Form/Field 间距、组件语义、响应式和状态 rubric。
- [x] 1.2 修正 component-mapping/page-templates/data-api/theme-and-style 中九项经验：区分两种按钮组、限定 isOpaque 子树与适用修复、写准 ChipFilter/CardList/Tabs/Segmented 字段、补充 Select 宽度和聚合样式顺序。
- [x] 1.3 同步模板与标准示例：data-list 使用 kind，Select 使用当前 className/controlClassName 宽度方式，Empty CTA 有真实示例；不把单页签 Tabs 设为默认布局。

## 2. 工作流与正式文档

- [x] 2.1 更新 SKILL.md：阶段 1 输出页面清单后、阶段 3 生成 YAML 前必须完成 `docs/prd/ui-plan.md`；阶段 5 同时执行静态与视觉验收。
- [x] 2.2 更新 acceptance-checklist：新增布局/间距、组件语义、窄屏、状态视觉检查及 UI 计划一致性；结果表增加 UI 质量列，换肤数量不写死。
- [x] 2.3 更新正式组件文档中 Tabs.extra、ExpandingButtonGroup/FloatingButtonGroup、Select 宽度等对应条目，确保与 packages 当前 props 一致，并同步相关 doc/DSL 配置示例。

## 3. 验证

- [x] 3.1 用代表性页面分别评审 list/detail/form/dashboard/login 的 UI 计划：字段齐全、组件选择有理由、空/错/加载态和窄屏行为明确，无非法 props 或模糊“适当调整”表述。
- [x] 3.2 运行 `pnpm -C skills validate`、文档构建、相关 YAML/DSL 校验、`openspec validate pactor-prd-ui-quality-contract --strict` 和 `git diff --check`；确认 references 与模板/正式文档无相互矛盾。
