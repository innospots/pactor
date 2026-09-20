/**
 * 主题数据模块（任务 4.2）。
 * - themeFamilies：16 个主色系（families.ts，简介与传统色参考逐系提炼自 theme-design.md §6）；
 * - themes：80 个主题（themes.ts，由 scripts/gen-theme-scales.mts 生成，含色阶与语义映射）；
 * - memberThemeIds 由 theme.* 数据推导，保证色系—主题引用单一事实来源。
 */
import type { ThemeFamily } from '../types.ts';
import { themeFamilies as familyMeta } from './families.ts';
import { themes } from './themes.ts';

export { themes } from './themes.ts';
export { themeDefs } from './theme-defs.ts';
export type { ThemeDef } from './theme-defs.ts';

/** 主题色系（memberThemeIds 由 theme.* 数据推导） */
export const themeFamilies: ThemeFamily[] = familyMeta.map((family) => ({
  ...family,
  memberThemeIds: themes
    .filter((theme) => `family.${theme.familyId}` === family.id)
    .map((theme) => theme.id),
}));
