/**
 * 生成结果解析测试（spec: theme-studio-ai-generate / 生成结果解析与应用）。
 */
import { describe, expect, it } from 'vitest';

import { parseSkinCss } from '../src/ai/parse';

const VALID = `
这里是说明文字。
\`\`\`css
:root {
  --primary: oklch(0.5 0.2 250);
  --background: oklch(0.98 0.01 250);
  --radius: 8px;
}
[data-pactor-theme='dark'] {
  --primary: oklch(0.7 0.2 250);
  --background: oklch(0.2 0.01 250);
}
\`\`\`
`;

describe('parseSkinCss', () => {
  it('提取 css 代码块并拆分亮/暗两块', () => {
    const parsed = parseSkinCss(VALID);
    expect(parsed).not.toBeNull();
    expect(parsed!.light['--primary']).toBe('oklch(0.5 0.2 250)');
    expect(parsed!.light['--radius']).toBe('8px');
    expect(parsed!.dark['--background']).toBe('oklch(0.2 0.01 250)');
  });

  it('幻觉令牌被白名单过滤', () => {
    const parsed = parseSkinCss(
      '```css\n:root { --primary: red; --not-a-token: 1px; --evil-xss: url(x); }\n```',
    );
    expect(parsed!.light).toEqual({ '--primary': 'red' });
  });

  it('无 css 块或亮色块为空时返回 null', () => {
    expect(parseSkinCss('没有任何代码')).toBeNull();
    expect(parseSkinCss('```css\nbody { color: red; }\n```')).toBeNull();
  });

  it('暗色块允许缺省', () => {
    const parsed = parseSkinCss('```css\n:root { --primary: red; }\n```');
    expect(parsed).toEqual({ light: { '--primary': 'red' }, dark: {} });
  });

  it('无代码块标记但含令牌声明时以全文为候选', () => {
    const parsed = parseSkinCss(':root { --primary: red; }');
    expect(parsed!.light['--primary']).toBe('red');
  });
});
