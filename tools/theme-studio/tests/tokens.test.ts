/**
 * 令牌元数据防漂移测试（spec: theme-studio / 令牌清单与 ui 包对齐）：
 * 解析 packages/ui/src/styles.css 的 `:root` 自定义属性集合，
 * 与 src/tokens.ts 清单双向比对——缺失或多余即失败。
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { TOKEN_GROUPS, TOKEN_NAMES } from '../src/tokens';

const stylesPath = fileURLToPath(
  new URL('../../../packages/ui/src/styles.css', import.meta.url),
);

/** 提取顶层 `:root { ... }` 块（brace 配对）声明的自定义属性名集合 */
function extractRootCustomProperties(css: string): Set<string> {
  const start = css.search(/^:root\s*\{/m);
  if (start < 0) {
    throw new Error('styles.css 中未找到 :root 块');
  }
  const open = css.indexOf('{', start);
  let depth = 0;
  let end = open;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') {
      depth += 1;
    } else if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const block = css.slice(open + 1, end);
  const names = new Set<string>();
  for (const match of block.matchAll(/(--[\w-]+)\s*:/g)) {
    names.add(match[1]!);
  }
  return names;
}

describe('tokens.ts 与 styles.css :root 令牌清单一致性', () => {
  const actual = extractRootCustomProperties(readFileSync(stylesPath, 'utf8'));

  it('tokens.ts 不含 styles.css 缺失的令牌（多余即失败）', () => {
    const extra = TOKEN_NAMES.filter((name) => !actual.has(name));
    expect(extra).toEqual([]);
  });

  it('styles.css 不含 tokens.ts 缺失的令牌（缺失即失败）', () => {
    const missing = [...actual].filter((name) => !TOKEN_NAMES.includes(name));
    expect(missing).toEqual([]);
  });

  it('tokens.ts 清单无重复令牌', () => {
    expect(new Set(TOKEN_NAMES).size).toBe(TOKEN_NAMES.length);
  });

  it('每个令牌都属于且仅属于一个分组', () => {
    const grouped = TOKEN_GROUPS.flatMap((group) =>
      group.tokens.map((token) => token.name),
    );
    expect(grouped.sort()).toEqual([...TOKEN_NAMES].sort());
  });
});
