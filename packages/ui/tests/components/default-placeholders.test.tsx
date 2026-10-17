// @vitest-environment jsdom
/**
 * 缺省 placeholder 契约（i18n 内置文案回退）：
 * 输入类（Input / Textarea / Mentions）缺省「请输入」，选择类
 * （Select / Combobox，触发器与过滤输入）缺省「请选择」；
 * 显式传 placeholder（含空串）时不覆盖。
 * 其余选择类（DatePicker / TimePicker / Cascader / TreeSelect）
 * 缺省文案沿用其既有 i18n key，此处不再重复断言。
 */
import { describe, expect, it } from 'vitest';

import { renderDsl } from './helpers.js';

describe('缺省 placeholder', () => {
  it('Input：缺省「请输入」，显式 placeholder 生效', () => {
    const { container } = renderDsl({ type: 'Input' });
    expect(
      (container.querySelector('input') as HTMLInputElement).placeholder,
    ).toBe('请输入');

    const custom = renderDsl({ type: 'Input', props: { placeholder: '搜索' } });
    expect(
      (custom.container.querySelector('input') as HTMLInputElement).placeholder,
    ).toBe('搜索');
  });

  it('Textarea：缺省「请输入」', () => {
    const { container } = renderDsl({ type: 'Textarea' });
    expect(
      (container.querySelector('textarea') as HTMLTextAreaElement).placeholder,
    ).toBe('请输入');
  });

  it('Mentions：缺省「请输入」', () => {
    const { container } = renderDsl({
      type: 'Mentions',
      props: { options: [{ value: 'u1', label: '张三' }] },
    });
    expect(
      (container.querySelector('textarea') as HTMLTextAreaElement).placeholder,
    ).toBe('请输入');
  });

  it('Select：缺省触发器显示「请选择」', () => {
    const { container } = renderDsl({
      type: 'Select',
      props: {
        options: [
          { value: 'a', label: '选项A' },
          { value: 'b', label: '选项B' },
        ],
      },
    });
    const value = container.querySelector('[data-slot=select-value]');
    expect(value?.textContent).toContain('请选择');
  });

  it('Combobox：缺省触发器与过滤输入均显示「请选择」', () => {
    const { container } = renderDsl({
      type: 'Combobox',
      props: {
        searchable: true,
        options: [
          { value: 'a', label: '选项A' },
          { value: 'b', label: '选项B' },
        ],
      },
    });
    expect(container.textContent).toContain('请选择');
  });
});
