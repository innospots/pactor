/**
 * 工作室 store 测试（spec: theme-studio / 单项令牌编辑与实时预览）：
 * - 单项重置（空串清除 override）
 * - 切换预置主题时清空全部已修改令牌
 */
import { beforeEach, describe, expect, it } from 'vitest';

import {
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
});
