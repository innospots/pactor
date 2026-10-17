// @vitest-environment jsdom
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderDsl } from './helpers.js';

const INPUT_BACKGROUND = 'bg-(--input-background)';
const INPUT_FOREGROUND = 'text-(--input-foreground)';

function expectInputSurface(element: Element | null) {
  expect(element).not.toBeNull();
  expect(element!.className).toContain(INPUT_BACKGROUND);
  expect(element!.className).toContain(INPUT_FOREGROUND);
  expect(element!.className).not.toContain('bg-transparent');
}

describe('输入控件表面令牌', () => {
  const cases = [
    { type: 'Input', slot: 'input' },
    { type: 'NumberInput', slot: 'input' },
    { type: 'Textarea', slot: 'textarea' },
    { type: 'Mentions', slot: 'mentions', props: { options: [] } },
    { type: 'Select', slot: 'select-trigger', props: { options: [] } },
    {
      type: 'Combobox',
      slot: 'combobox-trigger',
      props: { value: 'a', options: [{ label: '选项 A', value: 'a' }] },
    },
    { type: 'DatePicker', slot: 'datepicker-trigger', props: { value: '2026-10-01' } },
    { type: 'TimePicker', slot: 'timepicker-trigger', props: { value: '13:45:00' } },
    {
      type: 'TreeSelect',
      slot: 'treeselect-trigger',
      props: { value: 'a', options: [{ label: '选项 A', value: 'a' }] },
    },
    {
      type: 'Cascader',
      slot: 'cascader-trigger',
      props: { value: ['a'], options: [{ label: '选项 A', value: 'a' }] },
    },
    { type: 'ColorPicker', slot: 'colorpicker-trigger', props: { value: '#1677ff' } },
    { type: 'Upload', slot: 'upload-button' },
  ];

  it.each(cases)('$type 使用统一的背景与前景令牌', ({ type, slot, props }) => {
    renderDsl({ type, props });
    expectInputSurface(document.querySelector(`[data-slot="${slot}"]`));
  });

  it('Select 弹层搜索框使用统一令牌', async () => {
    const user = userEvent.setup();
    renderDsl({
      type: 'Select',
      props: {
        showSearch: true,
        options: [{ label: '选项 A', value: 'a' }],
      },
    });

    await user.click(document.querySelector('[data-slot="select-trigger"]')!);
    expectInputSurface(document.querySelector('[data-slot="select-search"] input'));
  });

  it('InputGroup 外层与内部 Input 使用同一表面', () => {
    renderDsl({
      type: 'InputGroup',
      children: [{ type: 'Input' }],
    });

    expectInputSurface(document.querySelector('[data-slot="input-group"]'));
    expectInputSurface(document.querySelector('[data-slot="input"]'));
  });

  it('ChatInput 保持外层卡片表面，内部 Textarea 不叠加输入背景', () => {
    renderDsl({ type: 'ChatInput' });

    const textarea = document.querySelector('[data-slot="chat-input"] textarea')!;
    expect(textarea.className).toContain('bg-transparent');
    expect(textarea.className).toContain('text-card-foreground');
    expect(textarea.className).not.toContain(INPUT_BACKGROUND);
    expect(textarea.className).not.toContain(INPUT_FOREGROUND);
  });
});
