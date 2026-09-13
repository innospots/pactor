/**
 * 皮肤令牌颜色纯解析器（无 DOM 探针，避免与 iframe 皮肤注入的时序竞态）：
 * 令牌有效值 = 用户 overrides ∪ 预置主题 tokens ∪ tokens.ts 默认值，
 * var() 引用沿该表递归解析；oklch 相对颜色（oklch(from var(--x) …)）
 * 先把源色换算为 OKLab 三通道再代入通道表达式。
 */
import { TOKEN_GROUPS } from './tokens';

/** oklch(L C H) → sRGB hex（OKLab → 线性 sRGB → gamma；超色域截断） */
export function oklchToHex(L: number, C: number, H: number): string | null {
  const hr = (H * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  const l3 = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m3 = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s3 = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const toSrgb = (c: number) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  const channels = [
    4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
  ].map((c) => Math.round(Math.min(1, Math.max(0, toSrgb(c))) * 255));
  if (channels.some((c) => Number.isNaN(c))) {
    return null;
  }
  return `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

/** 把颜色字符串归一为 #rrggbb（hex/rgb()/color(srgb)/oklch()） */
export function normalizeComputedColor(computed: string): string | null {
  if (/^#[0-9a-fA-F]{6}$/.test(computed)) {
    return computed;
  }
  if (/^#[0-9a-fA-F]{8}$/.test(computed)) {
    return computed.slice(0, 7);
  }
  const rgb = computed.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (rgb) {
    return `#${[rgb[1], rgb[2], rgb[3]]
      .map((v) => Math.round(Number(v)).toString(16).padStart(2, '0'))
      .join('')}`;
  }
  const srgb = computed.match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (srgb) {
    return `#${[srgb[1], srgb[2], srgb[3]]
      .map((v) => Math.round(Number(v) * 255).toString(16).padStart(2, '0'))
      .join('')}`;
  }
  const oklch = computed.match(
    /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.%]+)?\s*\)$/,
  );
  if (oklch) {
    const L = oklch[1]!.endsWith('%') ? parseFloat(oklch[1]!) / 100 : Number(oklch[1]);
    return oklchToHex(L, Number(oklch[2]), Number(oklch[3]));
  }
  return null;
}

/** 令牌默认值表（tokens.ts 元数据即契约清单；皮肤合成与颜色解析共用） */
export const TOKEN_DEFAULTS: Record<string, string> = Object.fromEntries(
  TOKEN_GROUPS.flatMap((group) =>
    group.tokens.map((token) => [token.name, token.defaultValue] as const),
  ),
);

/** sRGB hex → oklch 三通道 [L, C, H] */
export function hexToOklch(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!m) {
    return null;
  }
  const toLinear = (v: number) =>
    v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  const [r, g, b] = [1, 3, 5].map((i) =>
    toLinear(parseInt(m[1]!.slice(i - 1, i + 1), 16) / 255),
  );
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m_ - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m_ + 0.4505937099 * s;
  const b2 = 0.0259040371 * l + 0.7827717662 * m_ - 0.808675766 * s;
  let H = (Math.atan2(b2, a) * 180) / Math.PI;
  if (H < 0) {
    H += 360;
  }
  return [L, Math.hypot(a, b2), H];
}

/** 沿有效值表递归解析 var() 引用（带环保护） */
function resolveRaw(
  name: string,
  effective: Record<string, string>,
  seen: Set<string>,
): string | null {
  if (seen.has(name)) {
    return null;
  }
  seen.add(name);
  const raw = effective[name] ?? TOKEN_DEFAULTS[name];
  if (raw === undefined) {
    return null;
  }
  const ref = /^var\((--[\w-]+)\)$/.exec(raw.trim());
  if (ref) {
    return resolveRaw(ref[1]!, effective, seen);
  }
  return raw.trim();
}

/** 计算 oklch(from …) 的通道表达式：数字 / l / c / h / calc(x * n) */
function evalChannel(
  expr: string,
  origin: { l: number; c: number; h: number },
): number | null {
  const text = expr.trim().replace(/^calc\((.*)\)$/, '$1').trim();
  const term = /^([lch])$/.exec(text);
  if (term) {
    return origin[term[1] as 'l' | 'c' | 'h'];
  }
  if (/^[\d.]+%?$/.test(text)) {
    return text.endsWith('%') ? parseFloat(text) / 100 : Number(text);
  }
  const mul = /^([lch])\s*\*\s*([\d.]+)$/.exec(text);
  if (mul) {
    return origin[mul[1] as 'l' | 'c' | 'h'] * Number(mul[2]);
  }
  return null;
}

/**
 * 解析令牌的有效颜色为 #rrggbb。
 * effective = 预置主题 tokens ∪ 用户 overrides（与合成皮肤 CSS 同源）。
 */
export function resolveTokenColor(
  name: string,
  effective: Record<string, string>,
): string | null {
  const raw = resolveRaw(name, effective, new Set());
  if (!raw) {
    return null;
  }
  // oklch 相对颜色：oklch(from var(--x) L' C' H')
  const relative =
    /^oklch\(\s*from\s+var\((--[\w-]+)\)\s+(\S+)\s+(\S+(?:\s*\*\s*[\d.]+)?|\S*\([^)]*\))\s+(\S+(?:\s*\*\s*[\d.]+)?|\S*\([^)]*\))\s*\)$/.exec(
      raw,
    );
  if (relative) {
    const originRaw = resolveRaw(relative[1]!, effective, new Set());
    if (!originRaw) {
      return null;
    }
    let origin: [number, number, number] | null = null;
    const originOklch =
      /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/.exec(originRaw);
    if (originOklch) {
      const L = originOklch[1]!.endsWith('%')
        ? parseFloat(originOklch[1]!) / 100
        : Number(originOklch[1]);
      origin = [L, Number(originOklch[2]), Number(originOklch[3])];
    } else {
      origin = hexToOklch(originRaw);
    }
    if (!origin) {
      return null;
    }
    const [l, c, h] = origin;
    const L2 = evalChannel(relative[2]!, { l, c, h });
    const C2 = evalChannel(relative[3]!, { l, c, h });
    const H2 = evalChannel(relative[4]!, { l, c, h });
    if (L2 === null || C2 === null || H2 === null) {
      return null;
    }
    return oklchToHex(L2, C2, H2);
  }
  return normalizeComputedColor(raw);
}
