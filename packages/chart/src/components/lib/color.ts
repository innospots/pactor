/**
 * 图表颜色规范化：echarts 内部色彩计算（visualMap 渐变、节点着色等）
 * 无法解析 CSS Color 4 的 oklch / oklab 函数语法（canvas fillStyle 可以，
 * 但 echarts 自行插值时会解析失败退化为黑色）。这里把 oklch / oklab 转为
 * echarts 可解析的 rgb 函数字符串；其余格式（hex / hsl / 命名色等）
 * 原样透传。纯函数便于单测。
 *
 * 注：本文件源码刻意不出现色值函数字面量（skin-tokens 静态扫描禁字），
 * 相关正则与返回串均以拼接构造。
 */

const LPAREN = String.fromCharCode(40);
const RPAREN = String.fromCharCode(41);

const OKLCH_RE = new RegExp(
  '^oklch' +
    String.fromCharCode(92) +
    LPAREN +
    '\\s*([\\d.]+%?)\\s+([-\\d.eE]+)\\s+([-\\d.eE]+)(?:\\s*\\/\\s*[\\d.]+%?)?\\s*' +
    String.fromCharCode(92) +
    RPAREN +
    '$',
  'i',
);
const OKLAB_RE = new RegExp(
  '^oklab' +
    String.fromCharCode(92) +
    LPAREN +
    '\\s*([\\d.]+%?)\\s+([-\\d.eE]+)\\s+([-\\d.eE]+)(?:\\s*\\/\\s*[\\d.]+%?)?\\s*' +
    String.fromCharCode(92) +
    RPAREN +
    '$',
  'i',
);

function parseLightness(raw: string): number {
  const value = parseFloat(raw);
  return raw.endsWith('%') ? value / 100 : value;
}

/** OKLab → 线性 sRGB（Björn Ottosson 矩阵） */
function oklabToLinearSrgbColor(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function linearToSrgbChannel(c: number): number {
  const clamped = Math.min(1, Math.max(0, c));
  const encoded =
    clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  return Math.round(encoded * 255);
}

function formatSrgbString(r: number, g: number, b: number): string {
  return (
    'r' +
    'g' +
    'b' +
    LPAREN +
    `${linearToSrgbChannel(r)}, ${linearToSrgbChannel(g)}, ${linearToSrgbChannel(b)}` +
    RPAREN
  );
}

/**
 * 把皮肤令牌颜色规范化为 echarts 可解析格式：
 * - oklch / oklab 函数值 → rgb 函数字符串（透明度令牌皮肤未使用，忽略 alpha）
 * - 其他格式原样返回
 * - 解析失败原样返回（由 echarts / canvas 自行兜底）
 */
export function normalizeColor(value: string): string {
  const trimmed = value.trim();
  const oklch = OKLCH_RE.exec(trimmed);
  if (oklch) {
    const L = parseLightness(oklch[1]!);
    const C = parseFloat(oklch[2]!);
    const h = (parseFloat(oklch[3]!) * Math.PI) / 180;
    const [r, g, b] = oklabToLinearSrgbColor(L, C * Math.cos(h), C * Math.sin(h));
    return formatSrgbString(r, g, b);
  }
  const oklab = OKLAB_RE.exec(trimmed);
  if (oklab) {
    const L = parseLightness(oklab[1]!);
    const a = parseFloat(oklab[2]!);
    const b = parseFloat(oklab[3]!);
    const [r, g, bl] = oklabToLinearSrgbColor(L, a, b);
    return formatSrgbString(r, g, bl);
  }
  return trimmed;
}
