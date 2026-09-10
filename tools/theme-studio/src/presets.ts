/**
 * 预置主题（spec: theme-studio / 预置主题选择与应用）。
 *
 * 每套主题只覆盖语义令牌子集（primary / accent / ring / chart / sidebar 等），
 * 组件级令牌靠 styles.css 默认 var() 回退自动跟随；背景/前景成对覆盖。
 *
 * 中国传统色系列数据取自 china_colors.md（384 色按节气分组）的代表色：
 * 珊瑚赫（立春）/ 碧山（雨水）/ 梔子（驚蟄）/ 青冥（春分）/ 齊紫（清明），
 * 辅色同源（海天霞 / 歐碧 / 柘黃 / 青雘 / 紫蒲）。hex 直接作令牌值
 * （浏览器原生支持），前景配对按明暗手工给值。
 * 另含 石墨灰 / 莫兰迪 两套非中国色对照主题。
 */

export interface SkinPreset {
  /** 主题 key（选中态标识） */
  key: string;
  /** 主题名（列表展示） */
  name: string;
  /** 来源说明（节气 / 风格） */
  description: string;
  /** 色板缩略（主题列表展示，取 tokens 的代表色） */
  swatches: string[];
  /** 语义令牌子集覆盖（令牌名 → CSS 值） */
  tokens: Record<string, string>;
}

export const SKIN_PRESETS: SkinPreset[] = [
  {
    key: 'shanhuhe',
    name: '珊瑚赫 · 红',
    description: '立春 · 珊瑚赫 #c12c1f / 海天霞 #f3a694',
    swatches: ['#c12c1f', '#f3a694', '#ee7959'],
    tokens: {
      '--primary': '#c12c1f',
      '--primary-foreground': '#fdf3f2',
      '--accent': '#f3a694',
      '--accent-foreground': '#4a1a12',
      '--ring': '#c12c1f',
      '--chart-1': '#c12c1f',
      '--chart-2': '#ee7959',
      '--chart-3': '#f3a694',
      '--chart-4': '#ba5140',
      '--chart-5': '#ecd452',
      '--sidebar-primary': '#c12c1f',
      '--sidebar-primary-foreground': '#fdf3f2',
      '--sidebar-accent': '#fbe4de',
      '--sidebar-accent-foreground': '#4a1a12',
    },
  },
  {
    key: 'qingming',
    name: '青冥 · 蓝',
    description: '春分 · 青冥 #3271ae / 青雘 #007175',
    swatches: ['#3271ae', '#007175', '#6fa8d0'],
    tokens: {
      '--primary': '#3271ae',
      '--primary-foreground': '#f4f9fd',
      '--accent': '#007175',
      '--accent-foreground': '#eefafa',
      '--ring': '#3271ae',
      '--chart-1': '#3271ae',
      '--chart-2': '#007175',
      '--chart-3': '#6fa8d0',
      '--chart-4': '#3aa6a0',
      '--chart-5': '#1f4e79',
      '--sidebar-primary': '#3271ae',
      '--sidebar-primary-foreground': '#f4f9fd',
      '--sidebar-accent': '#e3eef7',
      '--sidebar-accent-foreground': '#1f3a56',
    },
  },
  {
    key: 'bishan',
    name: '碧山 · 绿',
    description: '雨水 · 碧山 #779649 / 歐碧 #c0d695',
    swatches: ['#779649', '#c0d695', '#4f6f46'],
    tokens: {
      '--primary': '#779649',
      '--primary-foreground': '#f7faf0',
      '--accent': '#c0d695',
      '--accent-foreground': '#2e3d1a',
      '--ring': '#779649',
      '--chart-1': '#779649',
      '--chart-2': '#c0d695',
      '--chart-3': '#4f6f46',
      '--chart-4': '#a9be7b',
      '--chart-5': '#e5a84b',
      '--sidebar-primary': '#779649',
      '--sidebar-primary-foreground': '#f7faf0',
      '--sidebar-accent': '#eef4e0',
      '--sidebar-accent-foreground': '#2e3d1a',
    },
  },
  {
    key: 'zhizi',
    name: '梔子 · 黄',
    description: '驚蟄 · 梔子 #fac03d / 柘黃 #c67915',
    swatches: ['#fac03d', '#c67915', '#e18a3b'],
    tokens: {
      '--primary': '#fac03d',
      '--primary-foreground': '#3f2d04',
      '--accent': '#c67915',
      '--accent-foreground': '#fdf8ec',
      '--ring': '#c67915',
      '--chart-1': '#fac03d',
      '--chart-2': '#c67915',
      '--chart-3': '#e18a3b',
      '--chart-4': '#ba5b49',
      '--chart-5': '#b6a014',
      '--sidebar-primary': '#fac03d',
      '--sidebar-primary-foreground': '#3f2d04',
      '--sidebar-accent': '#fdefc8',
      '--sidebar-accent-foreground': '#3f2d04',
    },
  },
  {
    key: 'qizi',
    name: '齊紫 · 紫',
    description: '清明 · 齊紫 #6c216d / 紫蒲 #a6559d',
    swatches: ['#6c216d', '#a6559d', '#d8a7d1'],
    tokens: {
      '--primary': '#6c216d',
      '--primary-foreground': '#faf2fa',
      '--accent': '#a6559d',
      '--accent-foreground': '#fdf6fc',
      '--ring': '#6c216d',
      '--chart-1': '#6c216d',
      '--chart-2': '#a6559d',
      '--chart-3': '#d8a7d1',
      '--chart-4': '#a76283',
      '--chart-5': '#7c5ba7',
      '--sidebar-primary': '#6c216d',
      '--sidebar-primary-foreground': '#faf2fa',
      '--sidebar-accent': '#f2e0f0',
      '--sidebar-accent-foreground': '#40113f',
    },
  },
  {
    key: 'graphite',
    name: '石墨灰（对照）',
    description: '中性灰对照主题（非中国色）',
    swatches: ['#3f3f46', '#71717a', '#d4d4d8'],
    tokens: {
      '--primary': '#3f3f46',
      '--primary-foreground': '#fafafa',
      '--accent': '#e4e4e7',
      '--accent-foreground': '#27272a',
      '--ring': '#52525b',
      '--chart-1': '#3f3f46',
      '--chart-2': '#71717a',
      '--chart-3': '#a1a1aa',
      '--chart-4': '#52525b',
      '--chart-5': '#d4d4d8',
      '--sidebar-primary': '#3f3f46',
      '--sidebar-primary-foreground': '#fafafa',
    },
  },
  {
    key: 'morandi',
    name: '莫兰迪（对照）',
    description: '低饱和灰调对照主题（非中国色）',
    swatches: ['#8a99a8', '#c9a7a0', '#8fa39a'],
    tokens: {
      '--primary': '#8a99a8',
      '--primary-foreground': '#22292f',
      '--accent': '#d8c3b0',
      '--accent-foreground': '#43352a',
      '--ring': '#8a99a8',
      '--chart-1': '#8a99a8',
      '--chart-2': '#c9a7a0',
      '--chart-3': '#8fa39a',
      '--chart-4': '#d9c7a7',
      '--chart-5': '#a08fa8',
      '--sidebar-primary': '#8a99a8',
      '--sidebar-primary-foreground': '#22292f',
      '--sidebar-accent': '#ece4dc',
      '--sidebar-accent-foreground': '#43352a',
    },
  },
];

export function getPreset(key: string | null): SkinPreset | null {
  if (key === null) {
    return null;
  }
  return SKIN_PRESETS.find((preset) => preset.key === key) ?? null;
}
