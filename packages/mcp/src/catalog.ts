import actionsData from './generated/actions.js';
import componentsData from './generated/components.js';

export interface ComponentEntry {
  name: string;
  package: string;
  category: string;
  summary: string;
  link?: string;
  keyProps?: string;
  notes?: string;
  example?: string;
}

export interface ActionEntry {
  name: string;
  params: string;
  summary: string;
}

export const components: ComponentEntry[] = componentsData;
export const actions: ActionEntry[] = actionsData;

const normalize = (name: string): string => name.trim().toLowerCase();

/** 简单编辑距离（用于候选建议，上限 3） */
function distance(a: string, b: string, max = 3): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const up = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = up;
    }
  }
  return prev[b.length];
}

export function findComponent(name: string): ComponentEntry | undefined {
  const key = normalize(name);
  return components.find((c) => c.name.toLowerCase() === key);
}

export function suggestComponents(name: string, limit = 3): ComponentEntry[] {
  const key = normalize(name);
  return components
    .map((c) => {
      const cn = c.name.toLowerCase();
      const score = cn.includes(key) || key.includes(cn) ? 0 : distance(key, cn);
      return { c, score };
    })
    .filter(({ score }) => score <= 3)
    .sort((a, b) => a.score - b.score || a.c.name.localeCompare(b.c.name))
    .slice(0, limit)
    .map(({ c }) => c);
}

export function findAction(name: string): ActionEntry | undefined {
  const key = normalize(name);
  return actions.find((a) => a.name.toLowerCase() === key);
}
