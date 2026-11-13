// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';

import {
  CHART_SKIN_EVENT,
  THEME_ATTR,
  THEME_EVENT,
  THEME_REQUESTED_ATTR,
  THEME_STORAGE_KEY,
  THEME_STYLE_ATTR,
  applyCustomTheme,
  applyTheme,
  loadThemeCss,
  readAppliedTheme,
  readStoredTheme,
  subscribeTheme,
  type ThemeChangeDetail,
  type ThemeLoaderMap,
} from '../src/index.js';

const cssOf = (name: string) => `.${name}{--marker:${name}}`;

const loaders = (name: string): ThemeLoaderMap => ({
  [name]: async () => cssOf(name),
});

function styleElement(): HTMLStyleElement | null {
  return document.querySelector<HTMLStyleElement>(
    `style[${THEME_STYLE_ATTR}]`,
  );
}

beforeEach(() => {
  document.head.innerHTML = '';
  document.documentElement.removeAttribute(THEME_ATTR);
  document.documentElement.removeAttribute(THEME_REQUESTED_ATTR);
  localStorage.clear();
});

describe('applyTheme', () => {
  it('injects CSS, sets the applied attribute and persists the choice', async () => {
    const applied = await applyTheme('zhu-cao', {
      loaders: loaders('zhu-cao'),
    });

    expect(applied).toBe('zhu-cao');
    expect(document.documentElement.getAttribute(THEME_ATTR)).toBe('zhu-cao');
    expect(document.documentElement.getAttribute(THEME_REQUESTED_ATTR)).toBe(
      'zhu-cao',
    );
    expect(styleElement()?.textContent).toBe(cssOf('zhu-cao'));
    expect(styleElement()?.getAttribute(THEME_STYLE_ATTR)).toBe('zhu-cao');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('zhu-cao');
    expect(readAppliedTheme()).toBe('zhu-cao');
    expect(readStoredTheme()).toBe('zhu-cao');
  });

  it('falls back to the default theme for unknown names', async () => {
    const applied = await applyTheme('not-a-theme', {
      loaders: loaders('qing-hui'),
    });

    expect(applied).toBe('qing-hui');
    expect(document.documentElement.getAttribute(THEME_ATTR)).toBe('qing-hui');
  });

  it('does not persist when persist is false', async () => {
    await applyTheme('jin-yun', {
      persist: false,
      loaders: loaders('jin-yun'),
    });

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
    expect(readStoredTheme()).toBeNull();
  });

  it('supports a custom storage key and an injected storage', async () => {
    const map = new Map<string, string>();
    const storage = {
      get length() {
        return map.size;
      },
      clear: () => map.clear(),
      getItem: (key: string) => map.get(key) ?? null,
      key: (index: number) => [...map.keys()][index] ?? null,
      removeItem: (key: string) => void map.delete(key),
      setItem: (key: string, value: string) => void map.set(key, value),
    } as Storage;

    await applyTheme('bi-shan', {
      storage,
      storageKey: 'mc-skin',
      loaders: loaders('bi-shan'),
    });

    expect(map.get('mc-skin')).toBe('bi-shan');
    expect(map.has(THEME_STORAGE_KEY)).toBe(false);
    expect(readStoredTheme({ storage, storageKey: 'mc-skin' })).toBe('bi-shan');
  });

  it('survives storage that throws', async () => {
    const denied = {
      get length(): number {
        throw new Error('denied');
      },
      clear: () => {
        throw new Error('denied');
      },
      getItem: () => {
        throw new Error('denied');
      },
      key: () => {
        throw new Error('denied');
      },
      removeItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
    } as Storage;

    await expect(
      applyTheme('tian-shui', {
        storage: denied,
        loaders: loaders('tian-shui'),
      }),
    ).resolves.toBe('tian-shui');
    expect(readStoredTheme({ storage: denied })).toBeNull();
  });

  it('ignores invalid stored values', async () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'not-a-theme');
    expect(readStoredTheme()).toBeNull();

    localStorage.setItem(THEME_STORAGE_KEY, 'yue-po');
    expect(readStoredTheme()).toBe('yue-po');
  });

  it('applies the nonce to the injected style element', async () => {
    await applyTheme('ning-ye', {
      nonce: 'abc123',
      loaders: loaders('ning-ye'),
    });

    expect(styleElement()?.getAttribute('nonce')).toBe('abc123');
  });

  it('marks the requested theme before the CSS resolves', async () => {
    let release!: (css: string) => void;
    const gate = new Promise<string>((resolve) => {
      release = resolve;
    });

    const pending = applyTheme('qing-ming', {
      loaders: { 'qing-ming': () => gate },
    });

    expect(document.documentElement.getAttribute(THEME_REQUESTED_ATTR)).toBe(
      'qing-ming',
    );
    expect(styleElement()).toBeNull();

    release(cssOf('qing-ming'));
    await pending;
    expect(styleElement()?.textContent).toBe(cssOf('qing-ming'));
  });

  it('keeps only the last selection during rapid switching', async () => {
    let releaseFirst!: (css: string) => void;
    const first = new Promise<string>((resolve) => {
      releaseFirst = resolve;
    });

    const slow = applyTheme('zhu-cao', {
      loaders: { 'zhu-cao': () => first },
    });
    const fast = applyTheme('jin-yun', {
      loaders: loaders('jin-yun'),
    });

    await fast;
    releaseFirst(cssOf('zhu-cao'));
    const slowResult = await slow;

    expect(slowResult).toBe('jin-yun');
    expect(document.documentElement.getAttribute(THEME_ATTR)).toBe('jin-yun');
    expect(styleElement()?.textContent).toBe(cssOf('jin-yun'));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('jin-yun');
  });

  it('reuses a single style element across switches', async () => {
    await applyTheme('zhu-cao', { loaders: loaders('zhu-cao') });
    await applyTheme('jin-yun', { loaders: loaders('jin-yun') });

    const styles = document.querySelectorAll(`style[${THEME_STYLE_ATTR}]`);
    expect(styles).toHaveLength(1);
    expect(styles[0].getAttribute(THEME_STYLE_ATTR)).toBe('jin-yun');
    expect(styles[0].textContent).toBe(cssOf('jin-yun'));
  });

  it('does not cache custom loaders', async () => {
    let calls = 0;
    const loaders: ThemeLoaderMap = {
      'li-ke': async () => {
        calls += 1;
        return cssOf('li-ke');
      },
    };

    await applyTheme('li-ke', { loaders });
    await applyTheme('li-ke', { loaders });

    expect(calls).toBe(2);
  });

  it('dispatches theme and chart skin events', async () => {
    const details: ThemeChangeDetail[] = [];
    const onTheme = (event: Event) => {
      details.push((event as CustomEvent<ThemeChangeDetail>).detail);
    };
    window.addEventListener(THEME_EVENT, onTheme);
    window.addEventListener(CHART_SKIN_EVENT, onTheme);

    await applyTheme('wan-yan', { loaders: loaders('wan-yan') });

    window.removeEventListener(THEME_EVENT, onTheme);
    window.removeEventListener(CHART_SKIN_EVENT, onTheme);

    expect(details).toEqual([
      { theme: 'wan-yan', source: 'apply' },
      { theme: 'wan-yan', source: 'apply' },
    ]);
  });
});

describe('applyCustomTheme', () => {
  it('applies arbitrary CSS without persisting by default', () => {
    const applied = applyCustomTheme('brand-x', '.brand-x{--primary:#123456}');

    expect(applied).toBe('brand-x');
    expect(document.documentElement.getAttribute(THEME_ATTR)).toBe('brand-x');
    expect(styleElement()?.textContent).toBe('.brand-x{--primary:#123456}');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('persists only when explicitly requested', () => {
    applyCustomTheme('brand-y', '.brand-y{}', { persist: true });
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('brand-y');
  });

  it('rejects empty CSS', () => {
    expect(() => applyCustomTheme('brand-z', '')).toThrow('must not be empty');
  });

  it('invalidates a pending applyTheme', async () => {
    let release!: (css: string) => void;
    const gate = new Promise<string>((resolve) => {
      release = resolve;
    });

    const pending = applyTheme('zhu-cao', {
      loaders: { 'zhu-cao': () => gate },
    });
    applyCustomTheme('brand-x', '.brand-x{}');
    release(cssOf('zhu-cao'));

    await expect(pending).resolves.toBe('zhu-cao');
    expect(styleElement()?.textContent).toBe('.brand-x{}');
    expect(document.documentElement.getAttribute(THEME_ATTR)).toBe('brand-x');
  });

  it('dispatches a custom event', () => {
    const details: ThemeChangeDetail[] = [];
    const onTheme = (event: Event) => {
      details.push((event as CustomEvent<ThemeChangeDetail>).detail);
    };
    window.addEventListener(THEME_EVENT, onTheme);

    applyCustomTheme('brand-x', '.brand-x{}');

    window.removeEventListener(THEME_EVENT, onTheme);
    expect(details).toEqual([{ theme: 'brand-x', source: 'custom' }]);
  });
});

describe('loadThemeCss', () => {
  it('rejects unknown theme names', async () => {
    await expect(loadThemeCss('nope' as never)).rejects.toThrow('unknown theme');
  });

  it('rejects empty CSS from a custom loader', async () => {
    await expect(
      loadThemeCss('zhu-cao', { 'zhu-cao': async () => '' }),
    ).rejects.toThrow('empty CSS');
  });
});

describe('subscribeTheme', () => {
  it('receives in-app theme changes and stops after unsubscribe', async () => {
    const seen: string[] = [];
    const off = subscribeTheme((theme) => seen.push(theme));

    await applyTheme('qiu-xiang', { loaders: loaders('qiu-xiang') });
    off();
    await applyTheme('yue-po', { loaders: loaders('yue-po') });

    expect(seen).toEqual(['qiu-xiang']);
  });

  it('receives storage events from other tabs', () => {
    const seen: string[] = [];
    const off = subscribeTheme((theme) => seen.push(theme));

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: THEME_STORAGE_KEY,
        newValue: 'lian-hong',
      }),
    );
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: THEME_STORAGE_KEY,
        newValue: 'not-a-theme',
      }),
    );
    off();

    expect(seen).toEqual(['lian-hong']);
  });

  it('reports where the change came from', async () => {
    const details: ThemeChangeDetail[] = [];
    const off = subscribeTheme((_theme, detail) => details.push(detail));

    await applyTheme('qiu-xiang', { loaders: loaders('qiu-xiang') });
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: THEME_STORAGE_KEY,
        newValue: 'yue-po',
      }),
    );
    off();

    expect(details).toEqual([
      { theme: 'qiu-xiang', source: 'apply' },
      { theme: 'yue-po', source: 'storage' },
    ]);
  });
});
