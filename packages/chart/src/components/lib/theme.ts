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

/** 解析当前皮肤令牌为图表主题（结果缓存，经 subscribeChartTheme 订阅换肤失效） */
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

/**
 * 换肤通知事件名：宿主经非 DOM 途径换肤（如 CSSStyleSheet /
 * adoptedStyleSheets API 替换令牌）时可 dispatch 该事件强制图表刷新；
 * 常规换肤路径（data-pactor-theme 属性切换、style 注入、link 替换）
 * 由订阅机制的 MutationObserver / load 监听自动覆盖，无需手动派发。
 */
export const CHART_SKIN_CHANGE_EVENT = 'pactor:skin-change';

type ChartThemeListener = () => void;

const listeners = new Set<ChartThemeListener>();
let observer: MutationObserver | null = null;
let scheduled = false;

function scheduleNotify(): void {
  if (scheduled) return;
  scheduled = true;
  const enqueue =
    typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : (cb: () => void) => setTimeout(cb, 0);
  enqueue(() => {
    scheduled = false;
    resetChartTheme();
    for (const listener of [...listeners]) {
      listener();
    }
  });
}

/** link / style 加载完成（捕获阶段，load 不冒泡）：外链皮肤表此刻才真正生效 */
function handleResourceLoad(event: Event): void {
  const target = event.target;
  if (target instanceof HTMLLinkElement || target instanceof HTMLStyleElement) {
    scheduleNotify();
  }
}

/**
 * 订阅皮肤变更（useChartTheme 的 store 侧）：首个订阅者挂载时开始监听
 * documentElement 属性（data-pactor-theme / style / class 切换）、
 * document.head 子树（style 注入 upsert、皮肤 link 增删、href 变更）、
 * 样式表 load 事件与 CHART_SKIN_CHANGE_EVENT；末个订阅者卸载后停止。
 * 通知经 rAF 合帧，连发变更（预览拖拽取色）只触发一轮重渲染。
 */
export function subscribeChartTheme(listener: ChartThemeListener): () => void {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
    return () => {};
  }
  listeners.add(listener);
  if (!observer) {
    observer = new MutationObserver(scheduleNotify);
    observer.observe(document.documentElement, { attributes: true });
    observer.observe(document.head, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });
    document.addEventListener('load', handleResourceLoad, true);
    window.addEventListener(CHART_SKIN_CHANGE_EVENT, scheduleNotify);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && observer) {
      observer.disconnect();
      observer = null;
      document.removeEventListener('load', handleResourceLoad, true);
      window.removeEventListener(CHART_SKIN_CHANGE_EVENT, scheduleNotify);
    }
  };
}
