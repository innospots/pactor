/**
 * 皮肤 store：主色 / 暗黑 / 圆角，localStorage 持久化 + 订阅通知。
 * SkinProvider 经 useSyncExternalStore 订阅，SkinSettings 经 setSkin 写入。
 */

export interface Skin {
  /** 主色（antd token.colorPrimary） */
  colorPrimary: string;
  /** 暗黑模式（antd darkAlgorithm + 页面底色） */
  dark: boolean;
  /** 圆角（antd token.borderRadius，px） */
  borderRadius: number;
}

export const DEFAULT_SKIN: Skin = {
  colorPrimary: '#1677ff',
  dark: false,
  borderRadius: 6,
};

const STORAGE_KEY = 'pactor-antd-skin';

let skin: Skin = loadSkin();

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
      colorPrimary:
        typeof record['colorPrimary'] === 'string'
          ? record['colorPrimary']
          : DEFAULT_SKIN.colorPrimary,
      dark: typeof record['dark'] === 'boolean' ? record['dark'] : DEFAULT_SKIN.dark,
      borderRadius:
        typeof record['borderRadius'] === 'number'
          ? record['borderRadius']
          : DEFAULT_SKIN.borderRadius,
    };
  } catch {
    return { ...DEFAULT_SKIN };
  }
}

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

/** 局部更新皮肤：持久化并通知订阅者 */
export function setSkin(partial: Partial<Skin>): void {
  skin = { ...skin, ...partial };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(skin));
  } catch {
    // 存储不可用时仅本次会话生效
  }
  for (const listener of [...listeners]) {
    listener();
  }
}
