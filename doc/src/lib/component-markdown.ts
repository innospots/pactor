/**
 * 组件详情页 markdown 源码生成（复制此页用）：
 * 构建期把组件条目 + 详情内容组装为与页面章节一致的 markdown 文档
 * （frontmatter + 何时用 / 变体 / API 属性 / 使用规范 / DSL 结构）。
 * 未接入详情的组件渲染对应「不适用」说明，与页面骨架口径一致。
 */
import type { ComponentDetailContent } from '../assets-data/details/component-details';
import type { ComponentEntry } from '../assets-data/types';

export function buildComponentMarkdown(
  component: ComponentEntry,
  detail: ComponentDetailContent | undefined,
): string {
  const lines: string[] = [];

  lines.push('---');
  lines.push(`title: ${component.name}`);
  lines.push(`slug: ${component.id.slice('component.'.length)}`);
  lines.push(`category: ${component.category}`);
  lines.push(`summary: ${component.purpose}`);
  lines.push('---');
  lines.push('');
  lines.push(`# ${component.name}`);
  lines.push('');
  lines.push(`${component.purpose}。${component.description}`);
  lines.push('');

  lines.push('## 何时使用');
  lines.push('');
  lines.push(
    detail?.whenToUse ??
      '「何时使用 / 何时不用」内容待资产接入；接入前请参考分类集合页的选型规则。',
  );
  lines.push('');

  lines.push('## 变体');
  lines.push('');
  if (detail) {
    lines.push('| 变体 | 视觉形态 | 适用场景 |');
    lines.push('| --- | --- | --- |');
    for (const v of detail.variants) {
      lines.push(`| ${v.name} | ${v.visual} | ${v.scene} |`);
    }
  } else {
    lines.push('类型与视觉变体内容待资产接入。');
  }
  lines.push('');

  lines.push('## API 属性');
  lines.push('');
  if (detail) {
    lines.push('| 属性 | 类型 | 默认值 | 说明 |');
    lines.push('| --- | --- | --- | --- |');
    for (const p of detail.apiProps) {
      lines.push(`| \`${p.name}\` | \`${p.type}\` | ${p.defaultValue} | ${p.description} |`);
    }
  } else {
    lines.push('属性 / 事件 / 插槽内容待资产接入。');
  }
  lines.push('');

  lines.push('## 使用规范');
  lines.push('');
  if (detail) {
    lines.push(detail.guidelines);
    lines.push('');
    lines.push('**正例**');
    lines.push('');
    for (const e of detail.examplesDo) lines.push(`- ✓ ${e}`);
    lines.push('');
    lines.push('**反例**');
    lines.push('');
    for (const e of detail.examplesDont) lines.push(`- ✕ ${e}`);
  } else {
    lines.push('使用规范 / 正反例内容待资产接入。');
  }
  lines.push('');

  lines.push('## DSL 结构');
  lines.push('');
  if (detail?.dsl) {
    lines.push('```json');
    lines.push(JSON.stringify(detail.dsl, null, 2));
    lines.push('```');
  } else {
    lines.push('DSL 调用结构待资产接入；接入前请参考「API 属性」章节与运行时 DSL 文档。');
  }

  return lines.join('\n') + '\n';
}
