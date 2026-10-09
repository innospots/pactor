/**
 * 业务组件分类组件（26 个）。
 * 来源：product-design/ui/component-design.md §3.10 业务组件（§11 首版验收矩阵：业务组件 = 17）
 * + packages/ui business 子目录真实实现（9 个：CardList / EntityCard / Login /
 * ExpressionEditor / FieldCondition / RuleConfig / RuleExpression / ScriptEditor /
 * SearchableSelect）。
 * 命名口径：文档以中文名为规范名，英文名列为建议英文标识（slug 依据）；
 * 高级表格/高级表单为业务复合组件，与基础 Table/Form 不冲突（职责与依赖不同）。
 * tokenRefs 本期全部留空：待样式 Token 接入后回填。
 */
import type { ComponentEntry } from '../types.ts';

export const businessComponents: ComponentEntry[] = [
  { id: 'component.advanced-filter', name: '高级筛选', category: 'business', purpose: '组合多条件、分组和已选条件', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：AdvancedFilter。' },
  { id: 'component.advanced-table', name: '高级表格', category: 'business', purpose: '集成查询、列配置、批量操作和视图保存', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：AdvancedTable。' },
  { id: 'component.advanced-form', name: '高级表单', category: 'business', purpose: '集成分组、联动、步骤和保存状态', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：AdvancedForm。' },
  { id: 'component.detail-panel', name: '详情面板', category: 'business', purpose: '组合摘要、属性、状态和关联信息', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：DetailPanel。' },
  { id: 'component.data-picker', name: '数据选择器', category: 'business', purpose: '从大规模数据集中检索和选择对象', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：DataPicker。' },
  { id: 'component.user-picker', name: '人员选择器', category: 'business', purpose: '按名称、角色或组织选择人员', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：UserPicker。' },
  { id: 'component.org-picker', name: '组织选择器', category: 'business', purpose: '从组织树中选择部门或团队', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：OrgPicker。' },
  { id: 'component.tag-picker', name: '标签选择器', category: 'business', purpose: '创建、搜索和批量选择标签', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：TagPicker。' },
  { id: 'component.cascade-resource-picker', name: '级联资源选择器', category: 'business', purpose: '按资源层级定位和选择对象', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：CascadeResourcePicker。' },
  { id: 'component.file-manager', name: '文件管理器', category: 'business', purpose: '浏览、上传、移动和管理文件', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：FileManager。' },
  { id: 'component.rich-text-editor', name: '富文本编辑器', category: 'business', purpose: '创建带格式、媒体和引用的内容', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：RichTextEditor。' },
  { id: 'component.code-editor', name: '代码编辑器', category: 'business', purpose: '编辑、校验和格式化代码', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：CodeEditor。' },
  { id: 'component.flow-designer', name: '流程设计器', category: 'business', purpose: '通过节点和连线配置流程', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：FlowDesigner。' },
  { id: 'component.rule-editor', name: '规则编辑器', category: 'business', purpose: '通过条件组配置判断规则', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：RuleEditor。' },
  { id: 'component.permission-configurator', name: '权限配置器', category: 'business', purpose: '配置主体、资源和操作权限', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：PermissionConfigurator。' },
  { id: 'component.import-export', name: '导入导出', category: 'business', purpose: '管理文件映射、校验、进度和结果', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：ImportExport。' },
  { id: 'component.bulk-action-bar', name: '批量操作栏', category: 'business', purpose: '对多个已选对象执行上下文操作', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：BulkActionBar。' },
  // 第十批 9 个组件（packages/ui business 子目录真实实现；中文惯用名见 description）
  { id: 'component.entity-card', name: 'EntityCard', category: 'business', purpose: '三层结构实体摘要卡：图标/标题/标签、描述与操作按钮', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：实体卡片。' },
  { id: 'component.card-list', name: 'CardList', category: 'business', purpose: '网格展示实体摘要卡片，附带新建占位与结果计数', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：卡片列表（基于 EntityCard 组合）。' },
  { id: 'component.login', name: 'Login', category: 'business', purpose: '登录整页：品牌区 + 认证表单 + 辅助入口', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：登录页（5 种布局形态）。' },
  { id: 'component.expression-editor', name: 'ExpressionEditor', category: 'business', purpose: '按模板占位符结构化编辑表达式，支持表达式文本与控件值双向解析', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：表达式编辑器。' },
  { id: 'component.field-condition', name: 'FieldCondition', category: 'business', purpose: '以字段+操作符+值行式编辑 AND/OR 条件组', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：字段条件（条件树与表达式字符串互转）。' },
  { id: 'component.rule-config', name: 'RuleConfig', category: 'business', purpose: '评分规则配置：权重与带操作符/取值/评分的条件列表', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：规则配置。' },
  { id: 'component.rule-expression', name: 'RuleExpression', category: 'business', purpose: '自由文本与特征字段 chip 混排的规则表达式输入', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：规则表达式。' },
  { id: 'component.script-editor', name: 'ScriptEditor', category: 'business', purpose: 'Ace 脚本编辑器：语法高亮与自定义函数/变量联想', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：脚本编辑器。' },
  { id: 'component.searchable-select', name: 'SearchableSelect', category: 'business', purpose: '带搜索下拉的选择器，支持单选/多选与清除', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：可搜索选择器。' },
];
