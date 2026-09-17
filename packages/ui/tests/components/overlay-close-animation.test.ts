// @vitest-environment node
/**
 * 弹层关闭动画回归（Dialog 关闭回闪同类缺陷的统一防护）：
 * 退出动画 data-closed:animate-out 必须配 data-closed:fill-mode-forwards——
 * 缺省时动画结束到 Base UI 卸载之间元素回到自然样式（opacity 1），
 * 遮罩/弹层会闪一下才消失。
 */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const uiDir = join(
  dirname(dirname(dirname(fileURLToPath(import.meta.url)))),
  'src/ui',
);

describe('弹层关闭动画 fill-mode 契约', () => {
  it('src/ui 中每个 data-closed:animate-out 都带 data-closed:fill-mode-forwards', () => {
    const files = readdirSync(uiDir).filter((name) => name.endsWith('.tsx'));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const content = readFileSync(join(uiDir, file), 'utf8');
      const animateOut = content.match(/data-closed:animate-out/g)?.length ?? 0;
      const fillMode = content.match(/data-closed:fill-mode-forwards/g)?.length ?? 0;
      expect(
        fillMode,
        `${file} 有 ${animateOut} 处 animate-out 但仅 ${fillMode} 处 fill-mode-forwards`,
      ).toBe(animateOut);
    }
  });
});
