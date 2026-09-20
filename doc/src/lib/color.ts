/**
 * 颜色展示辅助：HEX → OKLCH 文本（与主题数据色阶格式一致）。
 * 优先匹配主题自身色阶条目（单一事实来源），未命中时用 culori 转换。
 */
import { converter } from 'culori';

const toOklch = converter('oklch');

/** 格式化 OKLCH 分量，输出形如 oklch(0.669 0.204 28.9) */
export function formatOklch(input: {
  l: number;
  c: number;
  h?: number | undefined;
}): string {
  const h = input.h ?? 0;
  return `oklch(${input.l.toFixed(3)} ${input.c.toFixed(3)} ${h.toFixed(1)})`;
}

/** HEX 转 OKLCH 文本；无法解析时返回 undefined */
export function hexToOklch(hex: string): string | undefined {
  const parsed = toOklch(hex);
  if (!parsed || typeof parsed.l !== 'number') return undefined;
  return formatOklch(parsed);
}
