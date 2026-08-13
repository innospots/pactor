/**
 * 皮肤 store：主色预设 / 暗黑 / 圆角，localStorage 持久化 + 订阅通知。
 *
 * 与 antd 示例的差异：Radix kit 的主题是 CSS 变量契约（见 guides/theming），
 * 应用皮肤 = 写 DOM（`data-pactor-theme` / `data-pactor-accent` 属性 +
 * `--pcr-radius-*` 内联变量），无需 React Provider 注入组件树。
 * store 模块加载时立即应用一次（main.tsx 顶部 import 副作用），
 * SkinSettings 面板经 useSyncExternalStore 读取当前值、setSkin 写入。
 */

export interface Skin {
  /** 主色预设 key（'default' = 样式表内置刻度，不设属性） */
  accent: string;
  /** 暗黑模式（<html data-pactor-theme="dark">） */
  dark: boolean;
  /** 控件圆角基准（--pcr-radius-sm，px；md/lg 由此派生） */
  radius: number;
}

export const DEFAULT_SKIN: Skin = {
  accent: 'default',
  dark: false,
  radius: 6,
};

/** 主色预设色板：key 对应 <html data-pactor-accent="...">，派生规则见 theme.css */
export const ACCENT_PRESETS = [
  { key: 'default', color: '#3C47DD', label: '默认靛蓝' },
  { key: 'blue', color: '#1677ff', label: '亮蓝' },
  { key: 'green', color: '#0e7a3d', label: '墨绿' },
  { key: 'purple', color: '#722ed1', label: '紫罗兰' },
  { key: 'magenta', color: '#eb2f96', label: '品红' },
  { key: 'orange', color: '#d4380d', label: '橙红' },
] as const;

const STORAGE_KEY = 'example-admin-skin';

function loadSkin(): Skin {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return { ...DEFAULT_SKIN };
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return { ...DEFAULT_SKIN };
    }
    const record = parsed as Record<string, unknown>;
    return {
      accent:
        typeof record['accent'] === 'string' ? record['accent'] : DEFAULT_SKIN.accent,
      dark: typeof record['dark'] === 'boolean' ? record['dark'] : DEFAULT_SKIN.dark,
      radius:
        typeof record['radius'] === 'number' ? record['radius'] : DEFAULT_SKIN.radius,
    };
  } catch {
    return { ...DEFAULT_SKIN };
  }
}

let skin: Skin = loadSkin();

/** 把皮肤写到 DOM：属性与内联变量即换肤契约的触发开关 */
function applySkin(next: Skin): void {
  const root = document.documentElement;
  if (next.dark) {
    root.setAttribute('data-pactor-theme', 'dark');
  } else {
    root.removeAttribute('data-pactor-theme');
  }
  if (next.accent === DEFAULT_SKIN.accent) {
    root.removeAttribute('data-pactor-accent');
  } else {
    root.setAttribute('data-pactor-accent', next.accent);
  }
  if (next.radius === DEFAULT_SKIN.radius) {
    root.style.removeProperty('--pcr-radius-sm');
    root.style.removeProperty('--pcr-radius-md');
    root.style.removeProperty('--pcr-radius-lg');
  } else {
    root.style.setProperty('--pcr-radius-sm', `${next.radius}px`);
    root.style.setProperty('--pcr-radius-md', `${next.radius + 2}px`);
    root.style.setProperty('--pcr-radius-lg', `${next.radius + 6}px`);
  }
}

// 模块加载即应用（首屏前生效，避免闪烁）
applySkin(skin);

const listeners = new Set<() => void>();

/** 读取当前皮肤（useSyncExternalStore 快照） */
export function getSkin(): Skin {
  return skin;
}

/** 订阅皮肤变化（返回退订函数） */
export function subscribeSkin(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** 局部更新皮肤：应用 DOM、持久化并通知订阅者 */
export function setSkin(partial: Partial<Skin>): void {
  skin = { ...skin, ...partial };
  applySkin(skin);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(skin));
  } catch {
    // 存储不可用时仅本次会话生效
  }
  for (const listener of [...listeners]) {
    listener();
  }
}
