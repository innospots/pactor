export type ThemeLoader = () => Promise<string>;

/**
 * 预置皮肤加载器。每个导入必须是字面量，bundler 才能把对应 CSS
 * 切成独立 chunk；`?.css` 由 tsup 的 `loader: { '.css': 'text' }` 转成字符串模块。
 */
export const THEME_LOADERS = {
  'zhu-cao': () => import('../skins/zhu-cao.css').then((m) => m.default),
  'jin-yun': () => import('../skins/jin-yun.css').then((m) => m.default),
  'qiu-xiang': () => import('../skins/qiu-xiang.css').then((m) => m.default),
  'bi-shan': () => import('../skins/bi-shan.css').then((m) => m.default),
  'tian-shui': () => import('../skins/tian-shui.css').then((m) => m.default),
  'qing-ming': () => import('../skins/qing-ming.css').then((m) => m.default),
  'qing-hui': () => import('../skins/qing-hui.css').then((m) => m.default),
  'ning-ye': () => import('../skins/ning-ye.css').then((m) => m.default),
  'lian-hong': () => import('../skins/lian-hong.css').then((m) => m.default),
  'li-ke': () => import('../skins/li-ke.css').then((m) => m.default),
  'wan-yan': () => import('../skins/wan-yan.css').then((m) => m.default),
  'yue-po': () => import('../skins/yue-po.css').then((m) => m.default),
  'jin-yu': () => import('../skins/jin-yu.css').then((m) => m.default),
  portal: () => import('../skins/portal.css').then((m) => m.default),
} as const satisfies Record<string, ThemeLoader>;

export type ThemeName = keyof typeof THEME_LOADERS;

export type ThemeLoaderMap = Partial<Record<ThemeName, ThemeLoader>>;
