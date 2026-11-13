import {
  THEME_LOADERS,
  type ThemeLoaderMap,
  type ThemeName,
} from './loaders.js';
import { isThemeName, resolveTheme } from './registry.js';

export const THEME_STORAGE_KEY = 'pactor.theme';
export const THEME_ATTR = 'data-pactor-skin';
export const THEME_REQUESTED_ATTR = 'data-requested-skin';
export const THEME_STYLE_ATTR = 'data-pactor-theme-style';
export const THEME_EVENT = 'pactor:theme-change';
export const CHART_SKIN_EVENT = 'pactor:skin-change';

export interface ThemeRuntimeOptions {
  document?: Document;
  storage?: Storage | null;
  storageKey?: string;
}

export interface ApplyThemeOptions extends ThemeRuntimeOptions {
  /** 默认 true；只有显式 false 才不写 localStorage。 */
  persist?: boolean;
  /** CSP style-src nonce。 */
  nonce?: string;
  loaders?: ThemeLoaderMap;
}

export type ThemeChangeSource = 'apply' | 'custom' | 'storage';

export interface ThemeChangeDetail {
  theme: string;
  source: ThemeChangeSource;
}

export type ThemeListener = (
  theme: string,
  detail: ThemeChangeDetail,
) => void;

const cssCache = new Map<ThemeName, Promise<string>>();
let applySequence = 0;

function assertCss(name: ThemeName, css: unknown): string {
  if (typeof css !== 'string' || css.length === 0) {
    throw new Error(`[@pactor-app/theme] empty CSS for theme "${name}"`);
  }
  return css;
}

/**
 * 按需加载皮肤 CSS。内置 loader 的结果按皮肤名缓存；自定义 loader 不缓存，
 * 便于测试或宿主替换资源地址。加载失败会清掉缓存，允许下一次重试。
 */
export function loadThemeCss(
  name: ThemeName,
  loaders?: ThemeLoaderMap,
): Promise<string> {
  if (!isThemeName(name)) {
    return Promise.reject(
      new Error(`[@pactor-app/theme] unknown theme "${String(name)}"`),
    );
  }
  const custom = loaders?.[name];
  if (custom) {
    return custom().then((css) => assertCss(name, css));
  }
  const cached = cssCache.get(name);
  if (cached) return cached;
  const pending = THEME_LOADERS[name]().then((css) => assertCss(name, css));
  cssCache.set(name, pending);
  pending.catch(() => {
    if (cssCache.get(name) === pending) cssCache.delete(name);
  });
  return pending;
}

function resolveDocument(options?: ThemeRuntimeOptions): Document | undefined {
  if (options?.document) return options.document;
  return typeof document === 'undefined' ? undefined : document;
}

function resolveStorage(options?: ThemeRuntimeOptions): Storage | null {
  if (options?.storage !== undefined) return options.storage;
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

function writeStorage(
  storage: Storage | null,
  key: string,
  value: string,
): void {
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch {
    // 隐私模式 / 存储被禁用：换肤仍然生效，只是不持久化。
  }
}

function ensureStyleElement(
  doc: Document,
  name: string,
  nonce?: string,
): HTMLStyleElement {
  const existing = doc.querySelector<HTMLStyleElement>(
    `style[${THEME_STYLE_ATTR}]`,
  );
  const style = existing ?? doc.createElement('style');
  style.setAttribute(THEME_STYLE_ATTR, name);
  if (nonce) style.setAttribute('nonce', nonce);
  if (!existing) doc.head.appendChild(style);
  return style;
}

function applyCss(
  doc: Document,
  name: string,
  css: string,
  options: ApplyThemeOptions,
): void {
  const style = ensureStyleElement(doc, name, options.nonce);
  style.textContent = css;
  doc.documentElement.setAttribute(THEME_ATTR, name);
}

function dispatchThemeChange(
  doc: Document,
  theme: string,
  source: ThemeChangeSource,
): void {
  const view = doc.defaultView;
  if (!view) return;
  // 注入的 Document（jsdom / iframe）可能来自没有全局 CustomEvent 的运行时，
  // 优先使用该窗口自己的构造器。
  const EventCtor =
    (view as unknown as { CustomEvent?: typeof CustomEvent }).CustomEvent ??
    (typeof CustomEvent === 'undefined' ? undefined : CustomEvent);
  if (!EventCtor) return;
  const detail: ThemeChangeDetail = { theme, source };
  view.dispatchEvent(new EventCtor(THEME_EVENT, { detail }));
  view.dispatchEvent(new EventCtor(CHART_SKIN_EVENT, { detail }));
}

/**
 * 应用内置皮肤。非法名称回退到默认皮肤；SSR 下不触碰 DOM，直接返回解析结果。
 * 连续调用时只有最后一次生效，避免较慢的旧 CSS 覆盖新选择。
 */
export async function applyTheme(
  name: string,
  options: ApplyThemeOptions = {},
): Promise<ThemeName> {
  const resolved = resolveTheme(name);
  const doc = resolveDocument(options);
  if (!doc) return resolved;

  const seq = ++applySequence;
  doc.documentElement.setAttribute(THEME_REQUESTED_ATTR, resolved);

  const css = await loadThemeCss(resolved, options.loaders);
  if (seq !== applySequence) {
    // 已被更新的调用取代：返回实际生效的内置皮肤；若生效的是自定义皮肤，
    // 则返回本次解析结果（自定义名字不属于 ThemeName）。
    const applied = readAppliedTheme(options);
    return isThemeName(applied) ? applied : resolved;
  }

  applyCss(doc, resolved, css, options);
  if (options.persist !== false) {
    writeStorage(
      resolveStorage(options),
      options.storageKey ?? THEME_STORAGE_KEY,
      resolved,
    );
  }
  dispatchThemeChange(doc, resolved, 'apply');
  return resolved;
}

/**
 * 同步应用一段自定义 CSS。默认不持久化，并且会让尚未完成的 applyTheme 失效。
 */
export function applyCustomTheme(
  name: string,
  css: string,
  options: ApplyThemeOptions = {},
): string {
  const doc = resolveDocument(options);
  if (!doc) return name;
  if (typeof css !== 'string' || css.length === 0) {
    throw new Error('[@pactor-app/theme] custom theme CSS must not be empty');
  }

  ++applySequence;
  doc.documentElement.setAttribute(THEME_REQUESTED_ATTR, name);
  applyCss(doc, name, css, options);
  if (options.persist === true) {
    writeStorage(
      resolveStorage(options),
      options.storageKey ?? THEME_STORAGE_KEY,
      name,
    );
  }
  dispatchThemeChange(doc, name, 'custom');
  return name;
}

export function readAppliedTheme(
  options?: ThemeRuntimeOptions,
): string | null {
  const doc = resolveDocument(options);
  return doc?.documentElement.getAttribute(THEME_ATTR) ?? null;
}

export function readStoredTheme(
  options?: ThemeRuntimeOptions,
): string | null {
  const storage = resolveStorage(options);
  if (!storage) return null;
  try {
    const value = storage.getItem(options?.storageKey ?? THEME_STORAGE_KEY);
    return isThemeName(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * 订阅应用内换肤与其他标签页通过 storage 事件同步的换肤。
 * SSR 返回空取消函数。
 */
export function subscribeTheme(
  listener: ThemeListener,
  options: ThemeRuntimeOptions = {},
): () => void {
  const doc = resolveDocument(options);
  const view = doc?.defaultView;
  if (!view) return () => {};

  const key = options.storageKey ?? THEME_STORAGE_KEY;
  const onTheme = (event: Event) => {
    const detail = (event as CustomEvent<ThemeChangeDetail>).detail;
    if (detail && typeof detail.theme === 'string') {
      listener(detail.theme, detail);
    }
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== key || !isThemeName(event.newValue)) return;
    listener(event.newValue, { theme: event.newValue, source: 'storage' });
  };

  view.addEventListener(THEME_EVENT, onTheme);
  view.addEventListener('storage', onStorage);
  return () => {
    view.removeEventListener(THEME_EVENT, onTheme);
    view.removeEventListener('storage', onStorage);
  };
}
