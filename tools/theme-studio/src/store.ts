/**
 * 工作室共享状态（模块级 store，设计决策 1）：
 * 选中的预置主题 + 用户令牌 overrides + 合成 CSS。
 * 自定义组件（ThemePresetList / TokenEditor / SkinPreviewFrame /
 * SkinDownloadButton）经 useSyncExternalStore 订阅，避免经 DSL props 穿透。
 */
import { getPreset } from './presets';
import { composeSkinCss } from './skin';

export interface StudioState {
  /** 选中的预置主题 key；null = 无预置主题（从零开始） */
  presetKey: string | null;
  /** 用户单项令牌修改（叠加在预置主题之上；空串视为未修改） */
  overrides: Record<string, string>;
  /** AI 生成的暗色令牌（并入合成 CSS 的暗色块） */
  darkOverrides: Record<string, string>;
  /** 预览模式（gallery 的 data-pactor-theme；编辑器只编辑亮色令牌） */
  mode: 'light' | 'dark';
  /** AI 生成滑层开关 */
  aiDrawerOpen: boolean;
}

let state: StudioState = {
  presetKey: 'chalk',
  overrides: {},
  darkOverrides: {},
  mode: 'light',
  aiDrawerOpen: false,
};

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function getStudioState(): StudioState {
  return state;
}

export function subscribeStudio(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** 选中预置主题；切换主题时清空用户 overrides（新主题从零开始叠加） */
export function selectPreset(presetKey: string | null): void {
  state = { ...state, presetKey, overrides: {}, darkOverrides: {} };
  emit();
}

/** 写入单项令牌修改；空串表示清除该项修改 */
export function setTokenOverride(name: string, value: string): void {
  const overrides = { ...state.overrides };
  if (value.trim() === '') {
    delete overrides[name];
  } else {
    overrides[name] = value;
  }
  state = { ...state, overrides };
  emit();
}

/** 清空全部用户修改（保留所选预置主题） */
export function resetOverrides(): void {
  state = { ...state, overrides: {} };
  emit();
}

/** 切换预览亮/暗模式 */
export function setMode(mode: 'light' | 'dark'): void {
  state = { ...state, mode };
  emit();
}

/** 开关 AI 生成滑层 */
export function setAiDrawerOpen(open: boolean): void {
  state = { ...state, aiDrawerOpen: open };
  emit();
}

/**
 * 应用 AI 生成结果（spec: theme-studio-ai-generate / 生成结果解析与应用）：
 * 亮色令牌进 overrides、暗色进 darkOverrides，preset 置为自定义（null）。
 */
export function applyAiTheme(
  light: Record<string, string>,
  dark: Record<string, string>,
): void {
  state = { ...state, presetKey: null, overrides: { ...light }, darkOverrides: { ...dark } };
  emit();
}

/** 当前合成 CSS（预览 postMessage 与下载共用的单一来源） */
export function getComposedCss(): string {
  return composeSkinCss(getPreset(state.presetKey), state.overrides, state.darkOverrides);
}
