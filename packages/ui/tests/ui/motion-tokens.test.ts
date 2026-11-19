/**
 * 动效令牌与减弱动效基线（ratchet）：styles.css 是消费方应用基线，
 * 令牌与 scoped reduced-motion 一旦回退，组件动画会重新失去统一曲线 /
 * 降级策略。这里用源码文本断言锁住约定，不依赖构建产物。
 */
import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('../../src/styles.css', import.meta.url), 'utf8');

describe('styles.css 动效基线', () => {
  it('定义统一缓动与时长令牌', () => {
    expect(css).toContain('--ease-ui-out:');
    expect(css).toContain('--ease-ui-in-out:');
    expect(css).toContain('--duration-ui-fast:');
    expect(css).toContain('--duration-ui-base:');
    expect(css).toContain('--duration-ui-slow:');
  });

  it('prefers-reduced-motion 只作用于 pactor 组件，并支持 essential 子树豁免', () => {
    const start = css.indexOf('@media (prefers-reduced-motion: reduce)');
    const end = css.indexOf('\n}', start);
    const block = css.slice(start, end + 2);
    expect(block).toContain("[data-slot]:not([data-motion='essential'], [data-motion='essential'] *)");
    expect(block).toContain("[data-slot] :not([data-motion='essential'], [data-motion='essential'] *)");
    // 不允许全局 * 兜底：styles.css 是宿主应用基线
    expect(block).not.toContain('* {');
  });
});
