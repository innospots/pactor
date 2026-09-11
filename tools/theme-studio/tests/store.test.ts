/**
 * 工作室 store 测试（spec: theme-studio / 单项令牌编辑与实时预览）：
 * - 单项重置（空串清除 override）
 * - 切换预置主题时清空全部已修改令牌
 */
import { beforeEach, describe, expect, it } from 'vitest';

import {
  applyAiTheme,
  getComposedCss,
  getStudioState,
  resetOverrides,
  selectPreset,
  setTokenOverride,
} from '../src/store';

beforeEach(() => {
  resetOverrides();
});

describe('studio store', () => {
  it('单项重置：空串清除该令牌的 override', () => {
    setTokenOverride('--radius', '1.5rem');
    setTokenOverride('--primary', '#ff0000');
    expect(Object.keys(getStudioState().overrides)).toHaveLength(2);
    setTokenOverride('--radius', '');
    expect(getStudioState().overrides['--radius']).toBeUndefined();
    expect(getStudioState().overrides['--primary']).toBe('#ff0000');
  });

  it('切换预置主题时清空全部已修改令牌', () => {
    selectPreset('chalk');
    setTokenOverride('--radius', '1.5rem');
    selectPreset('cream');
    expect(getStudioState().presetKey).toBe('cream');
    expect(getStudioState().overrides).toEqual({});
  });

  it('重置全部：resetOverrides 清空 overrides 但保留主题与模式', () => {
    selectPreset('cream');
    setTokenOverride('--radius', '1.5rem');
    resetOverrides();
    expect(getStudioState().overrides).toEqual({});
    expect(getStudioState().presetKey).toBe('cream');
  });

  it('应用 AI 生成结果：亮色进 overrides、暗色进 darkOverrides、preset 置空', () => {
    selectPreset('cream');
    applyAiTheme({ '--primary': 'red' }, { '--background': 'black' });
    const s = getStudioState();
    expect(s.presetKey).toBeNull();
    expect(s.overrides).toEqual({ '--primary': 'red' });
    expect(s.darkOverrides).toEqual({ '--background': 'black' });
    // 合成 CSS 同时包含两块
    const css = getComposedCss();
    expect(css).toContain('--primary: red;');
    expect(css).toContain("[data-pactor-theme='dark']");
    expect(css).toContain('--background: black;');
    // 切换主题后 AI 暗色令牌一并清空
    selectPreset('chalk');
    expect(getStudioState().darkOverrides).toEqual({});
  });
});
