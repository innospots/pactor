import referenceText from './generated/reference.js';

export interface ReferenceSection {
  /** 章节编号标题，如 "5. Expressions and scopes" */
  title: string;
  content: string;
}

const sections: ReferenceSection[] = (() => {
  const lines = referenceText.split('\n');
  const result: ReferenceSection[] = [];
  let current: ReferenceSection | null = null;
  for (const line of lines) {
    const match = line.match(/^## (.+)$/);
    if (match) {
      current = { title: match[1].trim(), content: '' };
      result.push(current);
    } else if (current) {
      current.content += `${line}\n`;
    }
  }
  return result.map((s) => ({ title: s.title, content: s.content.trim() }));
})();

export const REFERENCE_URI = 'pactor://reference/dsl-authoring';

export function getFullReference(): string {
  return referenceText;
}

export function listReferenceSections(): string[] {
  return sections.map((s) => s.title);
}

/** 大小写不敏感 + 子串匹配：优先标题前缀/编号匹配，其次子串 */
export function getReferenceSection(query: string): ReferenceSection | undefined {
  const key = query.trim().toLowerCase();
  if (!key) return undefined;
  return (
    sections.find((s) => s.title.toLowerCase().startsWith(key)) ??
    sections.find((s) => s.title.toLowerCase().includes(key)) ??
    sections.find((s) => s.content.toLowerCase().includes(key))
  );
}
