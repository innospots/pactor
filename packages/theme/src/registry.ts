import themesJson from '../themes.json';
import { THEME_LOADERS, type ThemeName } from './loaders.js';

export type ThemeKind = 'tokens' | 'full';

export interface ThemeDefinition {
  readonly name: ThemeName;
  readonly label: string;
  readonly labelEn: string;
  readonly family: string;
  readonly familyEn: string;
  readonly color: string;
  readonly source: string;
  readonly sourceEn: string;
  readonly kind: ThemeKind;
}

export interface ThemeManifest {
  readonly default: string;
  readonly themes: readonly ThemeDefinition[];
}

const manifest = themesJson as ThemeManifest;

/** 预置皮肤清单，顺序与 themes.json 一致。 */
export const THEMES: readonly ThemeDefinition[] = Object.freeze(
  manifest.themes.map((theme) => Object.freeze({ ...theme })),
);

export const THEME_NAMES: readonly ThemeName[] = Object.freeze(
  THEMES.map((theme) => theme.name),
);

export const DEFAULT_THEME = 'qing-hui' as const satisfies ThemeName;

const THEME_MAP = new Map<string, ThemeDefinition>(
  THEMES.map((theme) => [theme.name, theme]),
);

/** 运行时判断一个值是否为已注册的内置皮肤名。 */
export function isThemeName(value: unknown): value is ThemeName {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(THEME_LOADERS, value)
  );
}

/** 非法 / 空值回退到默认皮肤，语义与 starter 的 resolveSkin 一致。 */
export function resolveTheme(value: string | null | undefined): ThemeName {
  return isThemeName(value) ? value : DEFAULT_THEME;
}

export function getTheme(value: string): ThemeDefinition | undefined {
  return THEME_MAP.get(value);
}

export function themeText(
  theme: ThemeDefinition,
  locale: string,
): { label: string; family: string; source: string } {
  const english = locale.toLowerCase().startsWith('en');
  return {
    label: english ? theme.labelEn : theme.label,
    family: english ? theme.familyEn : theme.family,
    source: english ? theme.sourceEn : theme.source,
  };
}
