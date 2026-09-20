/**
 * 数据录入分类组件（19 个）。
 * 来源：product-design/ui/component-design.md §3.4 数据录入（§11 首版验收矩阵：数据录入 = 19）。
 * tokenRefs 本期全部留空：待样式 Token 接入后回填。
 */
import type { ComponentEntry } from '../types.ts';

export const dataEntryComponents: ComponentEntry[] = [
  { id: 'component.input', name: 'Input', category: 'data-entry', purpose: '输入单行文本', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：输入框。' },
  { id: 'component.textarea', name: 'Textarea', category: 'data-entry', purpose: '输入多行长文本', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：多行输入框。' },
  { id: 'component.input-number', name: 'InputNumber', category: 'data-entry', purpose: '输入受约束的数值', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：数字输入框。' },
  { id: 'component.select', name: 'Select', category: 'data-entry', purpose: '从候选项中选择一个或多个值', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：选择器。' },
  { id: 'component.tree-select', name: 'TreeSelect', category: 'data-entry', purpose: '从层级候选项中选择', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：树选择器。' },
  { id: 'component.cascader', name: 'Cascader', category: 'data-entry', purpose: '按层级逐步完成选择', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：级联选择。' },
  { id: 'component.autocomplete', name: 'Autocomplete', category: 'data-entry', purpose: '输入并匹配建议值', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：自动补全。' },
  { id: 'component.checkbox', name: 'Checkbox', category: 'data-entry', purpose: '独立确认或多项选择', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：复选框。' },
  { id: 'component.radio', name: 'Radio', category: 'data-entry', purpose: '从互斥选项中选择一项', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：单选框。' },
  { id: 'component.switch', name: 'Switch', category: 'data-entry', purpose: '即时切换二元状态', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：开关。' },
  { id: 'component.slider', name: 'Slider', category: 'data-entry', purpose: '在连续或分段范围内选值', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：滑动条。' },
  { id: 'component.rate', name: 'Rate', category: 'data-entry', purpose: '输入评分', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：评分。' },
  { id: 'component.date-picker', name: 'DatePicker', category: 'data-entry', purpose: '选择日期、区间或周期', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：日期选择器。' },
  { id: 'component.time-picker', name: 'TimePicker', category: 'data-entry', purpose: '选择时间或时间范围', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：时间选择器。' },
  { id: 'component.color-picker', name: 'ColorPicker', category: 'data-entry', purpose: '选择或输入颜色', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：颜色选择器。' },
  { id: 'component.upload', name: 'Upload', category: 'data-entry', purpose: '选择并上传文件', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：上传。' },
  { id: 'component.transfer', name: 'Transfer', category: 'data-entry', purpose: '在两个集合之间移动条目', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：穿梭框。' },
  { id: 'component.mentions', name: 'Mentions', category: 'data-entry', purpose: '输入并引用用户或对象', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：提及。' },
  { id: 'component.form', name: 'Form', category: 'data-entry', purpose: '组织字段、校验和提交过程', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：表单。' },
];
