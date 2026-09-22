import { normalizeColor } from './color.js';

/**
 * 图表语义主题：运行时从 CSS 令牌变量解析 echarts 可用的颜色值。
 * echarts 经 canvas 渲染，无法直接使用 var() 引用，需在初始化时
 * 读取计算样式得到具体颜色；oklch 语法令牌再经 normalizeColor 转为
 * rgb 函数字符串（echarts 内部色彩计算不支持 oklch，会退化为黑色）。
 * 变量缺失（jsdom / SSR / 未注入皮肤）时回退为 CSS 命名色。
 */

export interface ChartTheme {
  /** 系列调色板（按序循环取色） */
  palette: string[];
  /** 主文本色 */
  foreground: string;
  /** 弱化文本色（轴标签 / 图例） */
  muted: string;
  /** 边框 / 分割线 */
  border: string;
  /** 卡片底色（提示框等浮层） */
  card: string;
  /** 语义色 */
  success: string;
  warning: string;
  destructive: string;
  info: string;
}

/** 令牌变量缺失时的回退主题（CSS 命名色，仅兜底展示用） */
const FALLBACK_THEME: ChartTheme = {
  palette: ['steelblue', 'seagreen', 'darkorange', 'slateblue', 'tomato'],
  foreground: 'black',
  muted: 'gray',
  border: 'gainsboro',
  card: 'white',
  success: 'seagreen',
  warning: 'darkorange',
  destructive: 'tomato',
  info: 'steelblue',
};

let cached: ChartTheme | null = null;

/** 解析当前皮肤令牌为图表主题（结果缓存，主题切换需重新挂载图表生效） */
export function getChartTheme(): ChartTheme {
  if (cached) return cached;
  if (typeof document === 'undefined') return FALLBACK_THEME;
  try {
    const style = getComputedStyle(document.documentElement);
    const read = (name: string) => normalizeColor(style.getPropertyValue(name));
    const readColor = (name: string, fallback: string) => read(name) || fallback;
    const palette = [1, 2, 3, 4, 5].map((i, index) =>
      readColor(`--chart-${i}`, FALLBACK_THEME.palette[index]!),
    );
    cached = {
      palette,
      foreground: readColor('--foreground', FALLBACK_THEME.foreground),
      muted: readColor('--muted-foreground', FALLBACK_THEME.muted),
      border: readColor('--border', FALLBACK_THEME.border),
      card: readColor('--card', FALLBACK_THEME.card),
      success: readColor('--success', FALLBACK_THEME.success),
      warning: readColor('--warning', FALLBACK_THEME.warning),
      destructive: readColor('--destructive', FALLBACK_THEME.destructive),
      info: readColor('--info', FALLBACK_THEME.info),
    };
    return cached;
  } catch {
    return FALLBACK_THEME;
  }
}

/** 清空主题缓存（测试或皮肤热切换后使用） */
export function resetChartTheme(): void {
  cached = null;
}
