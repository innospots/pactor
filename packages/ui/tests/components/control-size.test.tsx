// @vitest-environment jsdom
/**
 * 控件尺寸契约：size=small|middle|large（默认 middle = h-9），
 * 基础表单组件共用 control-size 令牌，
 * 同一 size 下高度 / 内边距 / 字号一致（blocks 表单组件的尺寸用例在 @pactor-app/blocks 包内）。
 */
import { describe, expect, it } from 'vitest';

import { renderDsl } from './helpers.js';

describe('控件尺寸 size 属性', () => {
  it('Input：默认 middle=h-9，small=h-8，large=h-10', () => {
    const { unmount } = renderDsl({ type: 'Input', props: {} });
    expect(document.querySelector('input')!.className).toContain('h-9');
    unmount();

    const { unmount: unmountSm } = renderDsl({
      type: 'Input',
      props: { size: 'small' },
    });
    expect(document.querySelector('input')!.className).toContain('h-8');
    expect(document.querySelector('input')!.className).toContain('text-xs');
    unmountSm();

    renderDsl({ type: 'Input', props: { size: 'large' } });
    expect(document.querySelector('input')!.className).toContain('h-10');
    expect(document.querySelector('input')!.className).toContain('text-base');
  });

  it('Select：尺寸映射到 vendored trigger 的 data-size 与文本类', () => {
    const { unmount } = renderDsl({
      type: 'Select',
      props: { options: [{ label: '甲', value: 'a' }] },
    });
    const trigger = document.querySelector('[data-slot=select-trigger]')!;
    expect(trigger.getAttribute('data-size')).toBe('default');
    unmount();

    renderDsl({
      type: 'Select',
      props: { size: 'large', options: [{ label: '甲', value: 'a' }] },
    });
    const lgTrigger = document.querySelector('[data-slot=select-trigger]')!;
    expect(lgTrigger.getAttribute('data-size')).toBe('lg');
    expect(lgTrigger.className).toContain('text-base');
  });

  it('DatePicker：触发器按尺寸渲染高度', () => {
    renderDsl({ type: 'DatePicker', props: { size: 'small' } });
    expect(
      document.querySelector('[data-slot=datepicker-trigger]')!.className,
    ).toContain('h-8');
  });
});
