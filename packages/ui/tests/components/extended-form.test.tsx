// @vitest-environment jsdom
/**
 * 扩展表单类组件契约（spec: shadcn-extended-components / 表单类组件）：
 * Textarea / Checkbox / RadioGroup / Switch / Slider / NumberInput / Label / Field 的
 * Form 集成（name 即成表单项、值收集、错误展示）、事件值规范化与通用 props。
 */
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  renderDsl,
} from './helpers.js';

const COMMON_PROPS = COMMON_PROPS_PROBE;

describe('Textarea', () => {
  it('独立渲染：输入触发 onChange 且传出 string', async () => {
    const { context } = renderDsl({
      type: 'Textarea',
      props: { placeholder: '请输入备注' },
      events: {
        onChange: { action: 'setState', params: { note: '${event}' } },
      },
    });

    const textarea = screen.getByPlaceholderText('请输入备注');
    fireEvent.change(textarea, { target: { value: '多行文本' } });
    await expectEventState(context, 'note', '多行文本');
  });

  it('Form 内声明 name 自动包装为表单项，输入值参与提交', async () => {
    const { container, context } = renderDsl({
      type: 'Form',
      children: [
        { type: 'Textarea', props: { name: 'remark', label: '备注', rows: 3 } },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    expect(container.querySelector('[data-slot=form-item]')).not.toBeNull();
    const textarea = screen.getByLabelText('备注');
    expect(textarea.tagName).toBe('TEXTAREA');

    fireEvent.change(textarea, { target: { value: '加急' } });
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({ remark: '加急' });
    });
  });

  it('通用 props 作用于根节点（独立渲染）', () => {
    const { container } = renderDsl({
      type: 'Textarea',
      props: { ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('textarea'));
  });
});

describe('Checkbox', () => {
  it('独立渲染：勾选后 onChange 传出 boolean', async () => {
    const { context } = renderDsl({
      type: 'Checkbox',
      props: { label: '记住我' },
      events: {
        onChange: { action: 'setState', params: { checked: '${event}' } },
      },
    });

    fireEvent.click(screen.getByRole('checkbox'));
    await expectEventState(context, 'checked', true);
  });

  it('Form 内勾选后提交：values.agree 为 true', async () => {
    const { context } = renderDsl({
      type: 'Form',
      children: [
        { type: 'Checkbox', props: { name: 'agree', label: '同意协议' } },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    expect(screen.getByText('同意协议')).toBeTruthy();
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({ agree: true });
    });
  });

  it('Form 内声明 name 渲染为 form-item 且通用 props 挂在容器', () => {
    const { container } = renderDsl({
      type: 'Form',
      children: [
        { type: 'Checkbox', props: { name: 'agree', label: '同意协议', ...COMMON_PROPS } },
      ],
    });

    const item = container.querySelector('[data-slot=form-item]')!;
    expect(item).not.toBeNull();
    expect(item.classList.contains('biz-probe')).toBe(true);
    expect((item as HTMLElement).style.flexGrow).toBe('1');
  });

  it('通用 props 作用于根节点（独立渲染）', () => {
    const { container } = renderDsl({
      type: 'Checkbox',
      props: { label: '记住我', ...COMMON_PROPS },
    });
    expectCommonProps(container.firstElementChild);
  });
});

describe('Switch', () => {
  it('独立渲染：切换后 onChange 传出 boolean（非 DOM 事件）', async () => {
    const { context } = renderDsl({
      type: 'Switch',
      props: { label: '启用' },
      events: {
        onChange: { action: 'setState', params: { enabled: '${event}' } },
      },
    });

    fireEvent.click(screen.getByRole('switch'));
    await expectEventState(context, 'enabled', true);
  });

  it('Form 内切换后提交：values.enabled 为 true', async () => {
    const { context } = renderDsl({
      type: 'Form',
      children: [
        { type: 'Switch', props: { name: 'enabled', label: '启用' } },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    fireEvent.click(screen.getByRole('switch'));
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({ enabled: true });
    });
  });

  it('通用 props 作用于根节点（独立渲染）', () => {
    const { container } = renderDsl({
      type: 'Switch',
      props: { label: '启用', ...COMMON_PROPS },
    });
    expectCommonProps(container.firstElementChild);
  });
});

describe('RadioGroup', () => {
  it('渲染 options 且选中后 onChange 传出选中 value', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'RadioGroup',
      props: {
        options: [
          { label: '大', value: 'l' },
          { label: '小', value: 's' },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { size: '${event}' } },
      },
    });

    expect(screen.getByRole('radio', { name: '大' })).toBeTruthy();
    await user.click(screen.getByRole('radio', { name: '小' }));
    await expectEventState(context, 'size', 's');
  });

  it('Form 内选中后提交：值为选中项 value', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'Form',
      children: [
        {
          type: 'RadioGroup',
          props: {
            name: 'size',
            label: '尺寸',
            options: [
              { label: '大', value: 'l' },
              { label: '小', value: 's' },
            ],
          },
        },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    expect(container.querySelector('[data-slot=form-item]')).not.toBeNull();
    await user.click(screen.getByRole('radio', { name: '小' }));
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({ size: 's' });
    });
  });

  it('通用 props 作用于根节点（独立渲染）', () => {
    const { container } = renderDsl({
      type: 'RadioGroup',
      props: { options: [{ label: 'A', value: 'a' }], ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=radio-group]'));
  });

  it('direction=horizontal 时选项横向排列', () => {
    const { container } = renderDsl({
      type: 'RadioGroup',
      props: {
        direction: 'horizontal',
        options: [
          { label: '大', value: 'l' },
          { label: '小', value: 's' },
        ],
      },
    });
    const group = container.querySelector('[data-slot=radio-group]');
    expect(group?.className).toContain('flex');
    expect(group?.className).not.toContain('grid');
  });

  it('点击 label 文本选中对应选项', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'RadioGroup',
      props: {
        options: [
          { label: '大', value: 'l' },
          { label: '小', value: 's' },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { size: '${event}' } },
      },
    });

    const label = [...container.querySelectorAll('label')].find(
      (el) => el.textContent === '小',
    );
    expect(label).toBeTruthy();
    await user.click(label!);
    await expectEventState(context, 'size', 's');
  });
});

describe('Slider', () => {
  it('键盘步进后 onChange 传出 number', async () => {
    const { context } = renderDsl({
      type: 'Slider',
      props: { min: 0, max: 10, step: 1, value: 4 },
      events: {
        onChange: { action: 'setState', params: { volume: '${event}' } },
      },
    });

    const thumb = screen.getByRole('slider');
    expect(thumb.getAttribute('aria-valuenow')).toBe('4');

    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    await expectEventState(context, 'volume', 5);
  });

  it('Form 内声明 name 渲染为 form-item，值变化写入表单', async () => {
    const { container, context } = renderDsl({
      type: 'Form',
      children: [
        { type: 'Slider', props: { name: 'volume', label: '音量', min: 0, max: 10 } },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    expect(container.querySelector('[data-slot=form-item]')).not.toBeNull();

    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({ volume: 1 });
    });
  });

  it('通用 props 作用于根节点（独立渲染）', () => {
    const { container } = renderDsl({
      type: 'Slider',
      props: { value: 2, ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=slider]'));
  });
});

describe('NumberInput', () => {
  it('独立渲染：输入触发 onChange 且传出 number', async () => {
    const { context } = renderDsl({
      type: 'NumberInput',
      props: { placeholder: '请输入数量' },
      events: {
        onChange: { action: 'setState', params: { qty: '${event}' } },
      },
    });

    const input = screen.getByPlaceholderText('请输入数量');
    fireEvent.change(input, { target: { value: '42' } });
    await expectEventState(context, 'qty', 42);
  });

  it('输入越界按 min/max 钳制，precision 规整小数', async () => {
    const { context } = renderDsl({
      type: 'NumberInput',
      props: { min: 0, max: 10, precision: 1, placeholder: '数量' },
      events: {
        onChange: { action: 'setState', params: { qty: '${event}' } },
      },
    });

    const input = screen.getByPlaceholderText('数量');
    fireEvent.change(input, { target: { value: '99' } });
    await expectEventState(context, 'qty', 10);

    fireEvent.change(input, { target: { value: '3.26' } });
    await expectEventState(context, 'qty', 3.3);
  });

  it('Form 内声明 name 渲染为 form-item，输入值参与提交', async () => {
    const { container, context } = renderDsl({
      type: 'Form',
      children: [
        { type: 'NumberInput', props: { name: 'qty', label: '数量', min: 0 } },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    expect(container.querySelector('[data-slot=form-item]')).not.toBeNull();

    fireEvent.change(screen.getByLabelText('数量'), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({ qty: 5 });
    });
  });

  it('步进按钮按 step 增减并以 min/max 钳制，到达边界禁用对应按钮', async () => {
    const { context } = renderDsl(
      {
        type: 'NumberInput',
        props: { min: 0, max: 2, step: 1, value: '${state.qty}' },
        events: {
          onChange: { action: 'setState', params: { qty: '${event}' } },
        },
      },
      { state: { qty: 1 } },
    );

    fireEvent.click(screen.getByRole('button', { name: '增加' }));
    await expectEventState(context, 'qty', 2);

    // 到达 max 后增加按钮禁用；减少按钮仍可用
    await vi.waitFor(() => {
      expect(
        (screen.getByRole('button', { name: '增加' }) as HTMLButtonElement)
          .disabled,
      ).toBe(true);
    });
    fireEvent.click(screen.getByRole('button', { name: '减少' }));
    await expectEventState(context, 'qty', 1);
  });

  it('空值点击增加按钮以 0 为基准步进并经 min 钳制', async () => {
    const { context } = renderDsl({
      type: 'NumberInput',
      props: { min: 5, step: 2 },
      events: {
        onChange: { action: 'setState', params: { qty: '${event}' } },
      },
    });

    fireEvent.click(screen.getByRole('button', { name: '增加' }));
    await expectEventState(context, 'qty', 5);
  });

  it('小数步进按 step 推导精度，不出现浮点尾差', async () => {
    const { container, context } = renderDsl(
      {
        type: 'NumberInput',
        props: { step: 0.1, value: '${state.qty}' },
        events: {
          onChange: { action: 'setState', params: { qty: '${event}' } },
        },
      },
      { state: { qty: 0.1 } },
    );

    fireEvent.click(screen.getByRole('button', { name: '增加' }));
    await expectEventState(context, 'qty', 0.2);
    fireEvent.click(screen.getByRole('button', { name: '增加' }));
    await expectEventState(context, 'qty', 0.3);

    expect((container.querySelector('input') as HTMLInputElement).value).toBe('0.3');
  });

  it('通用 props 作用于根节点（独立渲染）', () => {
    const { container } = renderDsl({
      type: 'NumberInput',
      props: { value: 2, ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=number-input]'));
  });
});

describe('Label', () => {
  it('渲染 label 文本', () => {
    const { container } = renderDsl({ type: 'Label', props: { text: '用户名' } });

    const label = container.querySelector('label')!;
    expect(label.textContent).toBe('用户名');
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Label',
      props: { text: 'x', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('label'));
  });
});

describe('Field', () => {
  it('渲染 label / description / error 与 children 控件子树', () => {
    renderDsl({
      type: 'Field',
      props: { label: '邮箱', description: '用于接收通知', error: '格式不正确' },
      children: [{ type: 'Input', props: { placeholder: '请输入邮箱' } }],
    });

    expect(screen.getByText('邮箱')).toBeTruthy();
    expect(screen.getByText('用于接收通知')).toBeTruthy();
    expect(screen.getByText('格式不正确')).toBeTruthy();
    expect(screen.getByPlaceholderText('请输入邮箱')).toBeTruthy();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Field',
      props: { label: 'x', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=field]'));
  });

  it('required 在 label 前渲染必填星号', () => {
    const { container } = renderDsl({
      type: 'Field',
      props: { label: '邮箱', required: true },
    });

    const label = container.querySelector('[data-slot=field-label]');
    expect(label?.textContent).toBe('* 邮箱');
    const asterisk = label?.querySelector('span[aria-hidden]');
    expect(asterisk?.className).toContain('text-destructive');
  });

  it('labelHint 在 label 行右侧渲染提示文字', () => {
    const { container } = renderDsl({
      type: 'Field',
      props: { label: 'Provider Code', required: true, labelHint: '创建后不可修改' },
      children: [{ type: 'Input', props: { name: 'code' } }],
    });

    const label = container.querySelector('[data-slot=field-label]');
    expect(label?.textContent).toBe('* Provider Code');
    const hint = container.querySelector('[data-slot=field-label-hint]');
    expect(hint?.textContent).toBe('创建后不可修改');
    // 同一行 flex 两端排布
    expect(hint?.parentElement?.className).toContain('justify-between');
  });

  it('仅 labelHint（无 label）也渲染提示行', () => {
    const { container } = renderDsl({
      type: 'Field',
      props: { labelHint: '留空表示不修改' },
      children: [{ type: 'Input', props: { name: 'apiKey' } }],
    });

    expect(
      container.querySelector('[data-slot=field-label-hint]')?.textContent,
    ).toBe('留空表示不修改');
  });

  it('Input / Select 的 controlClassName 挂控件本体（Form 内不挂 form-item）', () => {
    const { container } = renderDsl({
      type: 'Form',
      children: [
        {
          type: 'Input',
          props: { name: 'a', label: 'A', controlClassName: 'ctrl-input' },
        },
        {
          type: 'Select',
          props: {
            name: 'b',
            label: 'B',
            options: [{ label: 'X', value: 'x' }],
            controlClassName: 'ctrl-select',
          },
        },
      ],
    });

    const formItem = container.querySelector('[data-slot=form-item]');
    expect(formItem?.className).not.toContain('ctrl-input');

    const input = container.querySelector('input');
    expect(input?.className).toContain('ctrl-input');

    const selectControl = container
      .querySelector('[data-slot=select-trigger]')
      ?.closest('span');
    expect(selectControl?.className).toContain('ctrl-select');
  });

  it('Input 独立渲染：controlClassName 与 className 同点合并', () => {
    const { container } = renderDsl({
      type: 'Input',
      props: { className: 'root-cls', controlClassName: 'ctrl-cls' },
    });

    const input = container.querySelector('input');
    expect(input?.className).toContain('root-cls');
    expect(input?.className).toContain('ctrl-cls');
  });
});

describe('表单类通用 props（Form 内）', () => {
  it('Textarea / RadioGroup / Slider 在 Form 内：通用 props 挂在 form-item 容器', () => {
    const { container } = renderDsl({
      type: 'Form',
      children: [
        { type: 'Textarea', props: { name: 'a', label: 'A', ...COMMON_PROPS } },
        {
          type: 'RadioGroup',
          props: { name: 'b', label: 'B', options: [], ...COMMON_PROPS },
        },
        { type: 'Slider', props: { name: 'c', label: 'C', ...COMMON_PROPS } },
      ],
    });

    const items = container.querySelectorAll('[data-slot=form-item]');
    expect(items).toHaveLength(3);
    for (const item of items) {
      expect(item.classList.contains('biz-probe')).toBe(true);
      expect((item as HTMLElement).style.flexGrow).toBe('1');
    }
  });
});

describe('Field 布局与节点样式', () => {
  it('有 label 时控件容器默认 mt-2；无 label 时不加', () => {
    const withLabel = renderDsl({
      type: 'Field',
      props: { label: '邮箱' },
      children: [{ type: 'Input', props: { placeholder: 'x' } }],
    });
    expect(
      withLabel.container.querySelector('[data-slot=field-control]')?.className,
    ).toContain('mt-2');

    const noLabel = renderDsl({
      type: 'Field',
      children: [{ type: 'Input', props: { placeholder: 'x' } }],
    });
    expect(
      noLabel.container.querySelector('[data-slot=field-control]')?.className,
    ).not.toContain('mt-2');
  });

  it('label / 控件容器 / description / error 各节点可独立加样式', () => {
    const { container } = renderDsl({
      type: 'Field',
      props: {
        label: '邮箱',
        description: '用于接收通知',
        error: '格式不正确',
        labelClassName: 'lbl-cls',
        controlClassName: 'ctrl-cls',
        descriptionClassName: 'desc-cls',
        errorClassName: 'err-cls',
        labelStyle: { fontSize: 13 },
        controlStyle: { width: 320 },
        descriptionStyle: { opacity: 0.6 },
        errorStyle: { marginTop: 4 },
      },
      children: [{ type: 'Input', props: { placeholder: 'x' } }],
    });

    const label = container.querySelector('[data-slot=field-label]') as HTMLElement;
    expect(label.className).toContain('lbl-cls');
    expect(label.style.fontSize).toBe('13px');

    const control = container.querySelector('[data-slot=field-control]') as HTMLElement;
    expect(control.className).toContain('ctrl-cls');
    expect(control.className).toContain('mt-2');
    expect(control.style.width).toBe('320px');

    expect(
      container.querySelector('[data-slot=field-description]')?.className,
    ).toContain('desc-cls');
    expect(
      (container.querySelector('[data-slot=field-description]') as HTMLElement)
        .style.opacity,
    ).toBe('0.6');
    expect(container.querySelector('[data-slot=field-error]')?.className).toContain(
      'err-cls',
    );
    expect(
      (container.querySelector('[data-slot=field-error]') as HTMLElement).style
        .marginTop,
    ).toBe('4px');
  });
});
