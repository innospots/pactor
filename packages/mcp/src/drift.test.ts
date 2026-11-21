import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { actions, components, findAction, findComponent } from './catalog.js';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const readRepo = (path: string): string => readFileSync(join(repoRoot, path), 'utf8');

/** packages/ui builtinComponents 对象的全部 DSL 类型名 */
function registeredComponentTypes(): string[] {
  const source = readRepo('packages/ui/src/components/register.ts');
  const block = source.split('export const builtinComponents = {')[1]?.split('} as const;')[0] ?? '';
  const names: string[] = [];
  for (const line of block.split('\n')) {
    const match = line.match(/^ {2}([A-Z][A-Za-z0-9]*)(?::|,)/);
    if (match) names.push(match[1]);
  }
  return names;
}

/** runtime / ui-interaction / app 三处注册的标准 action 名 */
function registeredActionNames(): string[] {
  const names = new Set<string>();
  const files = [
    'packages/runtime/src/action/builtins.ts',
    'packages/ui/src/interaction/actions.ts',
    'packages/app/src/assembly.ts',
  ];
  for (const file of files) {
    const source = readRepo(file);
    for (const match of source.matchAll(/register\('([\w.]+)'/g)) names.add(match[1]);
    for (const match of source.matchAll(/upsert\(actions, '([\w.]+)'/g)) names.add(match[1]);
  }
  return [...names];
}

describe('catalog 防漂移', () => {
  it('ui 注册的全部组件类型都在 catalog 中', () => {
    const missing = registeredComponentTypes().filter((name) => !findComponent(name));
    expect(missing, `catalog 缺失组件: ${missing.join(', ')}`).toEqual([]);
  });

  it('runtime/ui/app 注册的全部标准 action 都在 catalog 中', () => {
    const missing = registeredActionNames().filter((name) => !findAction(name));
    expect(missing, `catalog 缺失 action: ${missing.join(', ')}`).toEqual([]);
  });

  it('catalog 无重复组件名', () => {
    const names = components.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('catalog 无重复 action 名', () => {
    const names = actions.map((a) => a.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('每个组件都有分类与一句话说明', () => {
    const incomplete = components.filter((c) => !c.category || !c.summary || !c.package);
    expect(incomplete.map((c) => c.name)).toEqual([]);
  });
});
