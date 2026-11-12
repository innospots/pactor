import { describe, expect, it } from 'vitest';

import {
  CONTROL_SIZE_AREA,
  CONTROL_SIZE_BOX,
  CONTROL_SIZE_BOX_GROW,
  CONTROL_SIZE_TRIGGER_TEXT,
} from '../../src/components/control-size.js';
import { cn } from '../../src/lib/utils.js';

describe('control-size 令牌映射', () => {
  it('盒式控件高度与字号引用全局密度令牌', () => {
    expect(CONTROL_SIZE_BOX.small).toContain('h-(--pactor-control-height-sm)');
    expect(CONTROL_SIZE_BOX.middle).toContain('h-(--pactor-control-height-md)');
    expect(CONTROL_SIZE_BOX.large).toContain('h-(--pactor-control-height-lg)');
    expect(CONTROL_SIZE_BOX.small).toContain('text-[length:var(--pactor-control-text-sm)]');
    expect(CONTROL_SIZE_BOX.large).toContain('text-[length:var(--pactor-control-text-lg)]');
    expect(CONTROL_SIZE_BOX_GROW.middle).toContain('min-h-(--pactor-control-height-md)');
    expect(CONTROL_SIZE_AREA.large).toContain('text-[length:var(--pactor-control-text-lg)]');
    expect(CONTROL_SIZE_TRIGGER_TEXT.middle).toContain(
      'text-[length:var(--pactor-control-text-md)]',
    );
  });

  it('cn 合并时令牌类覆盖 vendored 基类（h-9 / text-sm 被去重）', () => {
    // tailwind-merge 须把 h-(--x) 归 h 组、text-[length:...] 归 font-size 组，
    // 否则基类与令牌类并存、胜负取决于样式表顺序。
    // 注：断言的是精确字符串；若 twMerge 版本导致输出顺序不同（语义等价），
    // 以实际稳定输出为准调整本断言，关键是不再残留 h-9 / text-sm
    expect(cn('h-9 px-3 text-sm', CONTROL_SIZE_BOX.small)).toBe(
      'h-(--pactor-control-height-sm) px-2.5 text-[length:var(--pactor-control-text-sm)]',
    );
  });
});
