// @vitest-environment jsdom
/**
 * hover 清除（allowClear）契约：
 * 盒式表单项有值且未禁用时，悬停控件右缘浮出 × 清除按钮（专用类 pactor-clearable，
 * 见 clearable.tsx 的跨层冲突说明），本身有右侧图标的组件（Select 下拉箭头 /
 * DatePicker 日历 / TimePicker 时钟 / Cascader / TreeSelect 箭头、Combobox 上下箭头）
 * 在原图标位置替换（原图标带 group-hover:hidden；NumberInput 步进按钮列自带 flex，
 * 改用 visibility 隐藏的 pactor-clearable-ghost）；点击清空并传出空值。
 */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderDsl } from './helpers.js';

const CLEAR_LABEL = '清除';

describe('hover 清除 allowClear', () => {
  it('Input：有值时浮出清除按钮（覆盖控件内侧右缘），点击清空并 onChange("")', async () => {
    const user = userEvent.setup();
    renderDsl({
      type: 'Input',
      // 独立渲染 Input 为受控控件：value 绑 state、onChange 回写，
      // 点击 × 经 onChange('') → setState 联动清空
      props: { value: '${state.v}', allowClear: true },
      events: { onChange: [{ action: 'setState', params: { v: '${event}' } }] },
    });
    const input = document.querySelector('input')!;
    expect(input.className).toContain('pr-8');
    expect(screen.queryByLabelText(CLEAR_LABEL)).toBeNull();
    await user.type(input, 'hello');
    const clear = screen.getByLabelText(CLEAR_LABEL);
    expect(clear.className).toContain('pactor-clearable');
    await user.click(clear);
    expect((input as HTMLInputElement).value).toBe('');
    expect(screen.queryByLabelText(CLEAR_LABEL)).toBeNull();
  });

  it('NumberInput：有值悬停时步进按钮隐藏、原位替换为 ×，点击清空传出 undefined', async () => {
    const user = userEvent.setup();
    renderDsl({ type: 'NumberInput', props: { value: 42, allowClear: true } });
    const steppers = screen.getByLabelText('增加').parentElement!;
    expect(steppers.className).toContain('pactor-clearable-ghost');
    const clear = screen.getByLabelText(CLEAR_LABEL);
    expect(clear.className).toContain('pactor-clearable');
    await user.click(clear);
    expect((document.querySelector('input') as HTMLInputElement).value).toBe('');
    expect(screen.queryByLabelText(CLEAR_LABEL)).toBeNull();
  });

  it('Select：有选中值时下拉箭头 hover 隐藏，× 原位替换；点击清空选中', async () => {
    const user = userEvent.setup();
    renderDsl({
      type: 'Select',
      // 独立渲染为受控控件：value 绑 state、onChange 回写
      props: {
        value: '${state.v}',
        allowClear: true,
        options: [
          { label: '选项A', value: 'a' },
          { label: '选项B', value: 'b' },
        ],
      },
      events: { onChange: [{ action: 'setState', params: { v: '${event}' } }] },
    });
    const trigger = document.querySelector('[data-slot="select-trigger"]')!;
    expect(trigger.className).toContain('group');
    // 初始无选中：无清除按钮；选中后下拉箭头带 hover 隐藏类（× 是 ClearHoverButton 的 X 图标）
    expect(screen.queryByLabelText(CLEAR_LABEL)).toBeNull();
    await user.click(trigger);
    await user.click(await screen.findByText('选项A'));
    const chevron = trigger.querySelector('svg.lucide-chevron-down')!;
    expect(chevron.getAttribute('class')).toContain('group-hover:hidden');
    const clear = screen.getByLabelText(CLEAR_LABEL);
    await user.click(clear);
    // 清空后回占位态，清除按钮消失
    expect(screen.queryByLabelText(CLEAR_LABEL)).toBeNull();
    expect(
      trigger.querySelector('svg.lucide-chevron-down')!.getAttribute('class'),
    ).not.toContain('group-hover:hidden');
  });

  it('DatePicker：有值时日历图标 hover 隐藏，× 原位替换；点击清空', async () => {
    const user = userEvent.setup();
    renderDsl({ type: 'DatePicker', props: { value: '2026-10-01', allowClear: true } });
    const trigger = document.querySelector('[data-slot="datepicker-trigger"]')!;
    expect(trigger.textContent).toContain('2026-10-01');
    const clear = screen.getByLabelText(CLEAR_LABEL);
    await user.click(clear);
    expect(trigger.textContent).not.toContain('2026-10-01');
    expect(screen.queryByLabelText(CLEAR_LABEL)).toBeNull();
  });

  it('DatePicker range：区间值同样可 hover 清空', async () => {
    const user = userEvent.setup();
    renderDsl({
      type: 'DatePicker',
      props: {
        mode: 'range',
        value: { start: '2026-10-01', end: '2026-10-07' },
        allowClear: true,
      },
    });
    const trigger = document.querySelector('[data-slot="datepicker-trigger"]')!;
    expect(trigger.textContent).toContain('2026-10-01 ~ 2026-10-07');
    await user.click(screen.getByLabelText(CLEAR_LABEL));
    expect(trigger.textContent).not.toContain('2026-10-01');
  });

  it('TimePicker / Cascader / TreeSelect / Combobox：有值时均可 hover 清空', async () => {
    const user = userEvent.setup();
    const { unmount: u1 } = renderDsl({
      type: 'TimePicker',
      props: { value: '13:45:00', allowClear: true },
    });
    await user.click(screen.getByLabelText(CLEAR_LABEL));
    expect(
      document.querySelector('[data-slot="timepicker-trigger"]')!.textContent,
    ).not.toContain('13:45:00');
    u1();

    const { unmount: u2 } = renderDsl({
      type: 'Cascader',
      props: {
        value: ['zhejiang', 'hangzhou'],
        allowClear: true,
        options: [
          {
            label: '浙江',
            value: 'zhejiang',
            children: [{ label: '杭州', value: 'hangzhou' }],
          },
        ],
      },
    });
    expect(
      document.querySelector('[data-slot="cascader-trigger"]')!.textContent,
    ).toContain('浙江 / 杭州');
    await user.click(screen.getByLabelText(CLEAR_LABEL));
    expect(
      document.querySelector('[data-slot="cascader-trigger"]')!.textContent,
    ).not.toContain('浙江');
    u2();

    const { unmount: u3 } = renderDsl({
      type: 'TreeSelect',
      props: {
        value: 'hangzhou',
        allowClear: true,
        options: [
          {
            label: '浙江',
            value: 'zhejiang',
            children: [{ label: '杭州', value: 'hangzhou' }],
          },
        ],
      },
    });
    expect(
      document.querySelector('[data-slot="treeselect-trigger"]')!.textContent,
    ).toContain('杭州');
    await user.click(screen.getByLabelText(CLEAR_LABEL));
    expect(
      document.querySelector('[data-slot="treeselect-trigger"]')!.textContent,
    ).not.toContain('杭州');
    u3();

    renderDsl({
      type: 'Combobox',
      props: {
        value: 'a',
        allowClear: true,
        options: [{ label: '选项A', value: 'a' }],
      },
    });
    const comboTrigger = document.querySelector('[data-slot="combobox-trigger"]')!;
    expect(comboTrigger.textContent).toContain('选项A');
    await user.click(screen.getByLabelText(CLEAR_LABEL));
    expect(comboTrigger.textContent).not.toContain('选项A');
  });

  it('disabled 或无值时不渲染清除按钮', () => {
    renderDsl({ type: 'Input', props: { value: 'x', allowClear: true, disabled: true } });
    expect(screen.queryByLabelText(CLEAR_LABEL)).toBeNull();
  });

  it('Form 内清除走 form.setValue（字段值回归空）', async () => {
    const user = userEvent.setup();
    renderDsl({
      type: 'Form',
      props: { name: 'f', initialValues: { kw: 'abc' } },
      children: [{ type: 'Input', props: { name: 'kw', allowClear: true } }],
    });
    expect((document.querySelector('input') as HTMLInputElement).value).toBe('abc');
    await user.click(screen.getByLabelText(CLEAR_LABEL));
    expect((document.querySelector('input') as HTMLInputElement).value).toBe('');
  });
});
