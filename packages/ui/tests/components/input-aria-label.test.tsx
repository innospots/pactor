// @vitest-environment jsdom
/**
 * 独立渲染的 Input 可通过 ariaLabel 获得可访问名称（透传原生 aria-label）。
 * Form 内仍由 FieldShell 的 label htmlFor 关联；ariaLabel 用于外部 label
 * 无法关联（如自定义表单布局）时的补充。
 */
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderDsl } from './helpers.js';

describe('Input ariaLabel', () => {
  it('独立渲染时透传为原生 aria-label', () => {
    renderDsl({ type: 'Input', props: { value: 'x', ariaLabel: '关系名称' } });

    const input = document.querySelector('[data-slot="input"]');
    expect(input).not.toBeNull();
    expect(input!.getAttribute('aria-label')).toBe('关系名称');
    expect(screen.getByLabelText('关系名称')).toBe(input);
  });

  it('未传 ariaLabel 时不输出该属性（保持既有 DOM）', () => {
    renderDsl({ type: 'Input', props: { value: 'x' } });

    const input = document.querySelector('[data-slot="input"]');
    expect(input!.hasAttribute('aria-label')).toBe(false);
  });
});
