import type { TemplateEntry } from '../types.ts';
import { wireframeTemplates } from '../wireframe-templates/index.ts';

/**
 * 模板条目。线框模板由内容目录 doc/src/content/wireframe-templates/*.md
 * 构建期收集（放入 markdown 即自动接入），此处映射为资产条目。
 */
export const templates: TemplateEntry[] = wireframeTemplates.map((t) => ({
  id: `template.wireframe-${t.slug}`,
  name: t.title,
  maturity: 'stable',
  integration: 'integrated',
  description: t.summary,
  category: 'wireframe',
  slug: t.slug,
  summary: t.summary,
  order: t.order,
  sourceRef: t.sourceRef,
  patternCount: t.patternCount,
}));
