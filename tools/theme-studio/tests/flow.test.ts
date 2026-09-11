/**
 * 引导流程状态机测试（spec: theme-studio-ai-generate / 引导问题模板）。
 */
import { describe, expect, it } from 'vitest';

import {
  applyAnswer,
  detectAnswers,
  isVague,
  nextStep,
  PALETTE_OPTIONS,
  STYLE_OPTIONS,
} from '../src/ai/flow';

describe('选项内容', () => {
  it('风格 8 项、色系 10 项', () => {
    expect(STYLE_OPTIONS).toHaveLength(8);
    expect(PALETTE_OPTIONS).toHaveLength(10);
    expect(STYLE_OPTIONS).toContain('科技');
    expect(STYLE_OPTIONS).toContain('政务');
    expect(PALETTE_OPTIONS.map((p) => p.label)).toContain('青碧');
  });
});

describe('detectAnswers', () => {
  it('识别自由文本中的风格与色系（含别名）', () => {
    expect(detectAnswers('要一个科技感、青碧色系的主题')).toEqual({
      style: '科技',
      palette: '青碧（青冥）',
    });
    expect(detectAnswers('珊瑚赫那种红')).toEqual({ palette: '绯红（珊瑚赫）' });
    expect(detectAnswers('随便')).toEqual({});
  });
});

describe('nextStep', () => {
  it('缺风格先问风格，缺色系再问色系，齐全进 confirm', () => {
    expect(nextStep({})).toBe('askStyle');
    expect(nextStep({ style: '科技' })).toBe('askPalette');
    expect(nextStep({ style: '科技', palette: '青碧（青冥）' })).toBe('confirm');
  });
});

describe('isVague（需求是否需要澄清提问）', () => {
  it('泛化或过短描述视为不明确', () => {
    expect(isVague('帮我生成一个主题')).toBe(true);
    expect(isVague('好看点')).toBe(true);
    expect(isVague('深色')).toBe(true);
    expect(isVague('')).toBe(true);
  });

  it('命中风格/色系关键词或描述具体时视为明确', () => {
    expect(isVague('要一个科技感的主题')).toBe(false);
    expect(isVague('珊瑚赫主色，圆角大一点')).toBe(false);
    expect(isVague('深色背景、大圆角、高对比度的阅读型界面风格')).toBe(false);
  });
});

describe('applyAnswer', () => {
  it('按当前问题归位答案；空输入不改答案', () => {
    expect(applyAnswer({}, 'askStyle', '科技')).toEqual({ style: '科技' });
    expect(applyAnswer({ style: '科技' }, 'askPalette', '草绿（碧山）')).toEqual({
      style: '科技',
      palette: '草绿（碧山）',
    });
    expect(applyAnswer({ style: '科技' }, 'askPalette', '  ')).toEqual({ style: '科技' });
  });
});
