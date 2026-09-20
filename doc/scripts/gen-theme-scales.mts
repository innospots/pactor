/**
 * 主题色阶生成器：读主题源数据（themes/theme-defs.ts，每主题一个 baseHex 字段），
 * 用 culori 以 OKLCH 生成 10 阶色阶（doc 要求：色阶以 OKLCH 生成，HEX/RGB/HSL 仅为
 * 展示与复制格式），并把 scale / resolvedTokens 静态落盘到 src/assets-data/themes/themes.ts
 * （Git 维护；本脚本保留用于重建）。
 *
 * 直接执行：node --experimental-strip-types scripts/gen-theme-scales.mts
 * 或在 doc/ 下执行：pnpm gen:theme-scales
 *
 * 生成规则：
 *  - 仅对 theme-defs.ts 中声明 baseHex 的主题生成 scale（本期 21 个：玄青系 5 个 +
 *    其余每系代表 1 个）；未声明 baseHex 的主题 scale / resolvedTokens 留空，
 *    integration 保持 'pending'（待设计确认基准色后补 baseHex 重新生成）。
 *  - 明度锚定：内置 10 阶明度曲线，将基准色明度对齐到曲线上最接近的阶，其余阶整体
 *    平移（clamp 到 [0.13, 0.985]），保证极浅（月白）与极深（玄青）色系都可用；
 *  - 色度：基准色度 × 阶位系数（5-6 阶主题识别最强，两端收敛），上限 0.33，
 *    色相保持基准色相，结果经 clampChroma 压缩到 sRGB 色域；
 *  - 记录精度：OKLCH l/c 三位小数、h 一位小数；hex / srgbFallback 为色域压缩后的
 *    sRGB 值（本期色阶全部落在 sRGB 色域内，二者一致）。
 *  - resolvedTokens：为已生成 scale 的主题填占位语义映射，键名对齐 @pactor-app/ui
 *    （packages/ui/src/styles.css）的 shadcn 语义令牌（省略 -- 前缀）；浅色主题以
 *    第 6 阶为 primary、白色背景，深色主题（玄青系）以第 5 阶为 primary、第 10 阶背景；
 *    destructive 等状态色跨主题语义稳定，引用全局固定值。正式语义映射待样式 Token
 *    接入后由设计校准回填。
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { clampChroma, formatHex, oklch } from 'culori';

import { themeDefs } from '../src/assets-data/themes/theme-defs.ts';
import type { ThemeEntry, ThemeScaleEntry } from '../src/assets-data/types.ts';

const DOC_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_PATH = join(DOC_ROOT, 'src', 'assets-data', 'themes', 'themes.ts');

/** 10 阶明度曲线（1 阶最高明度 → 10 阶最低明度，theme-design.md §8.1） */
const LIGHTNESS_CURVE = [0.97, 0.93, 0.86, 0.77, 0.68, 0.57, 0.47, 0.37, 0.28, 0.19];
/** 阶位色度系数：5-6 阶主题识别最强，向两端收敛 */
const CHROMA_FACTOR = [0.3, 0.45, 0.65, 0.85, 1.0, 1.0, 0.92, 0.84, 0.75, 0.65];
const CHROMA_CAP = 0.33;
const L_MIN = 0.13;
const L_MAX = 0.985;

const round = (value: number, digits: number): number =>
  Number(value.toFixed(digits));

interface FittedStep {
  l: number;
  c: number;
  h: number;
  hex: string;
}

/** 以基准传统色生成 10 阶 OKLCH 色阶（sRGB 色域压缩后落盘） */
function buildScale(baseHex: string): { scale: ThemeScaleEntry[]; fitted: FittedStep[] } {
  const base = oklch(baseHex);
  if (!base || !Number.isFinite(base.l) || !Number.isFinite(base.c)) {
    throw new Error(`无法解析基准色：${baseHex}`);
  }
  const hue = Number.isFinite(base.h) ? (base.h as number) : 0;
  // 明度锚定：曲线中与基准明度最接近的阶，整曲线平移使该阶命中基准明度
  let anchor = 0;
  for (let i = 1; i < LIGHTNESS_CURVE.length; i += 1) {
    if (Math.abs(LIGHTNESS_CURVE[i] - base.l) < Math.abs(LIGHTNESS_CURVE[anchor] - base.l)) {
      anchor = i;
    }
  }
  const shift = base.l - LIGHTNESS_CURVE[anchor];

  const fitted: FittedStep[] = [];
  const scale: ThemeScaleEntry[] = LIGHTNESS_CURVE.map((curveL, index) => {
    const l = Math.min(L_MAX, Math.max(L_MIN, curveL + shift));
    const c = Math.min(base.c * CHROMA_FACTOR[index], CHROMA_CAP);
    const inGamut = clampChroma({ mode: 'oklch', l, c, h: hue }, 'rgb');
    const fl = round(inGamut.l, 3);
    const fc = round(inGamut.c, 3);
    const fh = round(Number.isFinite(inGamut.h) ? (inGamut.h as number) : hue, 1);
    const hex = formatHex({ mode: 'oklch', l: inGamut.l, c: inGamut.c, h: inGamut.h });
    fitted.push({ l: fl, c: fc, h: fh, hex });
    return {
      step: index + 1,
      oklch: `oklch(${fl} ${fc} ${fh})`,
      srgbFallback: hex,
      hex,
    };
  });
  return { scale, fitted };
}

/** 低彩度中性变体：文字、边框等语义色降低彩度避免色偏（hue 保持基准色相） */
function neutralHex(step: FittedStep, chromaFactor: number): string {
  const c = Math.min(step.c * chromaFactor, CHROMA_CAP);
  return formatHex({ mode: 'oklch', l: step.l, c, h: step.h });
}

/**
 * 占位语义映射：键名对齐 @pactor-app/ui 的 shadcn 语义令牌（--primary 等，此处省略
 * -- 前缀）；浅色主题 white 背景 + 第 6 阶 primary，深色主题第 10 阶背景 + 第 5 阶
 * primary；destructive / destructive-foreground 引用跨主题稳定的全局语义值。
 */
function buildResolvedTokens(modeSupport: ThemeEntry['modeSupport'], fitted: FittedStep[]): Record<string, string> {
  const hex = (step: number): string => fitted[step - 1].hex;
  const isDark = modeSupport === 'dark';
  if (isDark) {
    return {
      background: hex(10),
      foreground: hex(1),
      card: hex(9),
      'card-foreground': hex(1),
      popover: hex(9),
      'popover-foreground': hex(1),
      primary: hex(5),
      'primary-foreground': hex(10),
      secondary: hex(8),
      'secondary-foreground': hex(1),
      muted: hex(8),
      'muted-foreground': neutralHex(fitted[3], 0.5),
      accent: hex(8),
      'accent-foreground': hex(1),
      destructive: '#ef4444',
      'destructive-foreground': '#ffffff',
      border: neutralHex(fitted[6], 0.3),
      input: neutralHex(fitted[6], 0.3),
      ring: hex(5),
      'chart-1': hex(5),
      'chart-2': hex(3),
      'chart-3': hex(7),
      'chart-4': hex(4),
      'chart-5': hex(8),
    };
  }
  return {
    background: '#ffffff',
    foreground: neutralHex(fitted[9], 0.4),
    card: '#ffffff',
    'card-foreground': neutralHex(fitted[9], 0.4),
    popover: '#ffffff',
    'popover-foreground': neutralHex(fitted[9], 0.4),
    primary: hex(6),
    'primary-foreground': fitted[5].l > 0.5 ? '#ffffff' : hex(1),
    secondary: hex(3),
    'secondary-foreground': neutralHex(fitted[9], 0.4),
    muted: hex(2),
    'muted-foreground': neutralHex(fitted[7], 0.45),
    accent: hex(2),
    'accent-foreground': neutralHex(fitted[9], 0.4),
    destructive: '#dc2626',
    'destructive-foreground': '#ffffff',
    border: neutralHex(fitted[3], 0.25),
    input: neutralHex(fitted[3], 0.25),
    ring: hex(6),
    'chart-1': hex(6),
    'chart-2': hex(4),
    'chart-3': hex(8),
    'chart-4': hex(5),
    'chart-5': hex(9),
  };
}

export function generateThemes(): ThemeEntry[] {
  const generated: ThemeEntry[] = [];
  let scaleCount = 0;
  for (const def of themeDefs) {
    const { baseHex, ...meta } = def;
    if (def.integration === 'integrated' && !baseHex) {
      throw new Error(`${def.id} 标记 integrated 但缺少 baseHex，无法生成色阶`);
    }
    if (def.integration === 'pending' && baseHex) {
      throw new Error(`${def.id} 标记 pending 但已声明 baseHex，状态不一致`);
    }
    if (!baseHex) {
      generated.push(meta);
      continue;
    }
    const { scale, fitted } = buildScale(baseHex);
    generated.push({
      ...meta,
      scale,
      resolvedTokens: buildResolvedTokens(def.modeSupport, fitted),
    });
    scaleCount += 1;
  }
  console.log(
    `主题色阶生成：共 ${generated.length} 个主题，已生成色阶 ${scaleCount} 个，待接入 ${generated.length - scaleCount} 个`,
  );
  return generated;
}

export function writeThemes(outPath: string = OUT_PATH): void {
  const themes = generateThemes();
  const source = `/**
 * 主题条目（80 个：16 色系 × 每系 5 主题）。
 * 本文件由 scripts/gen-theme-scales.mts 生成，请勿手改；修改主题元数据或补 baseHex 后
 * 重新执行 pnpm gen:theme-scales（生成规则与口径见脚本头注释及 themes/theme-defs.ts）。
 * scale 为 OKLCH 生成的 10 阶色阶（含 sRGB 回退与 HEX）；resolvedTokens 为占位语义映射
 * （键名对齐 @pactor-app/ui shadcn 语义令牌，省略 -- 前缀），正式语义映射待样式 Token
 * 接入后由设计校准回填。
 */
import type { ThemeEntry } from '../types.ts';

export const themes: ThemeEntry[] = ${JSON.stringify(themes, null, 2)};
`;
  writeFileSync(outPath, source, 'utf8');
  console.log(`已写入 ${outPath}（${themes.length} 个主题）`);
}

const entryPath = process.argv[1];
if (entryPath && import.meta.url === pathToFileURL(entryPath).href) {
  writeThemes();
}
