/**
 * 区块组件分类（9 个，全部为 @pactor-app/blocks 包真实实现）。
 * 原 product-design/ui/component-design.md §3.10 的 17 个规划条目（高级筛选 /
 * 高级表格 / 高级表单等）尚无对应实现，已按「只收录真实实现」口径移除，
 * 待实现后按同批模式回填。
 * tokenRefs 本期全部留空：待样式 Token 接入后回填。
 */
import type { ComponentEntry } from '../types.ts';

export const blocksComponents: ComponentEntry[] = [
  { id: 'component.entity-card', name: 'EntityCard', category: 'blocks', purpose: '三层结构实体摘要卡：图标/标题/标签、描述与操作按钮', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：实体卡片。' },
  { id: 'component.card-list', name: 'CardList', category: 'blocks', purpose: '网格展示实体摘要卡片，附带新建占位与结果计数', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：卡片列表（基于 EntityCard 组合）。' },
  { id: 'component.login', name: 'Login', category: 'blocks', purpose: '登录整页：品牌区 + 认证表单 + 辅助入口', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：登录页（5 种布局形态）。' },
  { id: 'component.expression-editor', name: 'ExpressionEditor', category: 'blocks', purpose: '按模板占位符结构化编辑表达式，支持表达式文本与控件值双向解析', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：表达式编辑器。' },
  { id: 'component.field-condition', name: 'FieldCondition', category: 'blocks', purpose: '以字段+操作符+值行式编辑 AND/OR 条件组', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：字段条件（条件树与表达式字符串互转）。' },
  { id: 'component.rule-config', name: 'RuleConfig', category: 'blocks', purpose: '评分规则配置：权重与带操作符/取值/评分的条件列表', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：规则配置。' },
  { id: 'component.rule-expression', name: 'RuleExpression', category: 'blocks', purpose: '自由文本与特征字段 chip 混排的规则表达式输入', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：规则表达式。' },
  { id: 'component.script-editor', name: 'ScriptEditor', category: 'blocks', purpose: 'Ace 脚本编辑器：语法高亮与自定义函数/变量联想', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：脚本编辑器。' },
  { id: 'component.site-footer', name: 'SiteFooter', category: 'blocks', purpose: '站点页脚：品牌区 + 多列链接组 + 底部版权栏', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：站点页脚（与 Layout 子区域 Footer 区分）。' },
];
