// @vitest-environment jsdom
/**
 * 扩展表单类组件契约（spec: shadcn-extended-components / 表单类组件）：
 * Textarea / Checkbox / RadioGroup / Switch / Slider / NumberInput / Label / Field 的
 * Form 集成（name 即成表单项、值收集、错误展示）、事件值规范化与通用 props。
 */
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../../src/components/components/Checkbox/index.js';
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
    // 默认 autoSize=false：固定行高，无 field-sizing（防横向撑爆），可拖拽调高
    expect(textarea.className).not.toContain('field-sizing');
    expect(textarea.className).toContain('w-full');
    expect(textarea.className).not.toContain('resize-none');
    expect(textarea.getAttribute('rows')).toBe('3');
    fireEvent.change(textarea, { target: { value: '多行文本' } });
    await expectEventState(context, 'note', '多行文本');
  });

  it('autoSize=true / 对象形态：不可拖拽调整，rows 属性保留', () => {
    const { container: c1 } = renderDsl({
      type: 'Textarea',
      props: { autoSize: true },
    });
    const t1 = c1.querySelector('textarea')!;
    expect(t1.className).toContain('resize-none');
    expect(t1.className).not.toContain('field-sizing');

    const { container: c2 } = renderDsl({
      type: 'Textarea',
      props: { autoSize: { minRows: 2, maxRows: 6 }, rows: 2 },
    });
    const t2 = c2.querySelector('textarea')!;
    expect(t2.className).toContain('resize-none');
    expect(t2.getAttribute('rows')).toBe('2');
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

  it('独立渲染透传原生 maxLength', () => {
    renderDsl({
      type: 'Textarea',
      props: { maxLength: 20, placeholder: '限长备注' },
    });
    const textarea = screen.getByPlaceholderText(
      '限长备注',
    ) as HTMLTextAreaElement;
    expect(textarea.maxLength).toBe(20);
  });

  it('Form 内透传 maxLength 并限制输入长度', async () => {
    renderDsl({
      type: 'Form',
      children: [
        {
          type: 'Textarea',
          props: { name: 'remark', label: '备注', maxLength: 5 },
        },
      ],
    });
    const textarea = screen.getByLabelText('备注') as HTMLTextAreaElement;
    expect(textarea.maxLength).toBe(5);
    await userEvent.type(textarea, 'abcdefgh');
    expect(textarea.value).toBe('abcde');
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

  it('点击选项文字选中对应选项', async () => {
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

    await user.click(screen.getByText('小'));
    await expectEventState(context, 'size', 's');
  });

  it('cards 变体：行式卡片 + description，点击行选中后 onChange 传出 value', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'RadioGroup',
      props: {
        variant: 'cards',
        value: '${state.plan}',
        options: [
          { label: 'Solo', value: 'solo', description: '一个席位' },
          { label: 'Team', value: 'team', description: '最多 20 席' },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { plan: '${event}' } },
      },
    });

    const group = container.querySelector('[data-slot=radio-group][data-variant=cards]');
    expect(group).not.toBeNull();
    expect(group!.getAttribute('role')).toBe('radiogroup');
    expect(screen.getByText('最多 20 席')).toBeTruthy();

    await user.click(screen.getByText('Team'));
    await expectEventState(context, 'plan', 'team');
    expect(
      container.querySelector('[data-slot=radio-group-card][data-checked]'),
    ).not.toBeNull();
  });

  it('cards 变体：原生 radio 同 name 分组，初始值命中选中行', () => {
    const { container } = renderDsl({
      type: 'RadioGroup',
      props: {
        variant: 'cards',
        value: 'team',
        options: [
          { label: 'Solo', value: 'solo' },
          { label: 'Team', value: 'team' },
        ],
      },
    });

    const radios = container.querySelectorAll('input[type=radio]');
    expect(radios.length).toBe(2);
    const names = new Set([...radios].map((radio) => radio.getAttribute('name')));
    expect(names.size).toBe(1);
    const checkedRow = container.querySelector('[data-slot=radio-group-card][data-checked]');
    expect(checkedRow?.textContent).toContain('Team');
  });

  it('cards 变体：trailing 行右端占位渲染 DSL 节点，点击占位区不切换选中', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'RadioGroup',
      props: {
        variant: 'cards',
        value: '${state.plan}',
        options: [
          {
            label: 'Solo',
            value: 'solo',
            trailing: { type: 'Badge', props: { text: '推荐' } },
          },
          { label: 'Team', value: 'team' },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { plan: '${event}' } },
      },
    });

    const slot = container.querySelector('[data-slot=radio-group-card-trailing]');
    expect(slot).not.toBeNull();
    expect(slot!.textContent).toContain('推荐');

    // 占位区为中立区域：点击不触发选中切换
    await user.click(screen.getByText('推荐'));
    expect(context.state.get('plan')).toBeUndefined();

    // 点击行文本正常选中
    await user.click(screen.getByText('Team'));
    await expectEventState(context, 'plan', 'team');
  });

  it('cards 变体：默认显示 border，bordered=false 隐藏', () => {
    const { container } = renderDsl({
      type: 'RadioGroup',
      props: {
        variant: 'cards',
        value: 'team',
        options: [
          { label: 'Solo', value: 'solo' },
          { label: 'Team', value: 'team' },
        ],
      },
    });

    const rows = container.querySelectorAll('[data-slot=radio-group-card]');
    expect(rows[0]!.className).toContain('border-border');
    // 选中行 border-primary 高亮
    expect(rows[1]!.className).toContain('border-primary');
  });

  it('cards 变体：bordered=false 隐藏行边框', () => {
    const { container } = renderDsl({
      type: 'RadioGroup',
      props: {
        variant: 'cards',
        bordered: false,
        options: [
          { label: 'Solo', value: 'solo' },
          { label: 'Team', value: 'team' },
        ],
      },
    });

    const rows = container.querySelectorAll('[data-slot=radio-group-card]');
    expect(rows[0]!.className).not.toContain('border-border');
    expect(rows[0]!.className).not.toContain('border-primary');
  });

  it('cards 变体：选项 clickable=false 禁用整卡点击（外观不变）', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'RadioGroup',
      props: {
        variant: 'cards',
        value: '${state.plan}',
        options: [
          { label: 'Solo', value: 'solo', clickable: false },
          { label: 'Team', value: 'team' },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { plan: '${event}' } },
      },
    });

    const soloRow = container.querySelectorAll('[data-slot=radio-group-card]')[0]!;
    // 不可点但外观不置灰
    expect(soloRow.className).not.toContain('opacity-50');
    expect(soloRow.className).not.toContain('cursor-pointer');

    await user.click(screen.getByText('Solo'));
    expect(context.state.get('plan')).toBeUndefined();

    await user.click(screen.getByText('Team'));
    await expectEventState(context, 'plan', 'team');
  });
});

describe('Checkbox 组模式（options）', () => {
  it('渲染 options，勾选后 onChange 传出完整 value 数组（toggle 语义）', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'Checkbox',
      props: {
        value: '${state.fruits}',
        options: [
          { label: '苹果', value: 'a' },
          { label: '香蕉', value: 'b' },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { fruits: '${event}' } },
      },
    });

    expect(screen.getByRole('checkbox', { name: '苹果' })).toBeTruthy();
    await user.click(screen.getByRole('checkbox', { name: '香蕉' }));
    await expectEventState(context, 'fruits', ['b']);
    await user.click(screen.getByRole('checkbox', { name: '苹果' }));
    await expectEventState(context, 'fruits', ['b', 'a']);
    await user.click(screen.getByRole('checkbox', { name: '香蕉' }));
    await expectEventState(context, 'fruits', ['a']);
  });

  it('Form 内勾选后提交：值为已勾选 value 数组', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'Form',
      children: [
        {
          type: 'Checkbox',
          props: {
            name: 'tags',
            label: '标签',
            options: [
              { label: '红', value: 'red' },
              { label: '蓝', value: 'blue' },
            ],
          },
        },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    expect(container.querySelector('[data-slot=form-item]')).not.toBeNull();
    await user.click(screen.getByRole('checkbox', { name: '蓝' }));
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({ tags: ['blue'] });
    });
  });

  it('通用 props 作用于根节点（独立渲染）', () => {
    const { container } = renderDsl({
      type: 'Checkbox',
      props: { options: [{ label: 'A', value: 'a' }], ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=checkbox-group]'));
  });

  it('direction=horizontal 时选项横向排列', () => {
    const { container } = renderDsl({
      type: 'Checkbox',
      props: {
        direction: 'horizontal',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    });
    const group = container.querySelector('[data-slot=checkbox-group]');
    expect(group?.className).toContain('flex');
    expect(group?.className).toContain('flex-wrap');
  });

  it('cards 变体：选中行各自高亮，勾选指示随选中态切换', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'Checkbox',
      props: {
        variant: 'cards',
        value: '${state.modules}',
        options: [
          { label: '基础报表', value: 'basic', description: '只读' },
          { label: '高级分析', value: 'pro', description: '含导出' },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { modules: '${event}' } },
      },
    });

    expect(
      container.querySelector('[data-slot=checkbox-group][data-variant=cards]'),
    ).not.toBeNull();
    expect(screen.getByText('含导出')).toBeTruthy();

    await user.click(screen.getByText('高级分析'));
    await expectEventState(context, 'modules', ['pro']);
    // 选中行带高亮，勾选指示随选中态切换
    const checkedRow = container.querySelector(
      '[data-slot=checkbox-group-card][data-checked]',
    );
    expect(checkedRow?.textContent).toContain('高级分析');

    await user.click(screen.getByText('基础报表'));
    await expectEventState(context, 'modules', ['pro', 'basic']);
    expect(
      container.querySelectorAll('[data-slot=checkbox-group-card][data-checked]').length,
    ).toBe(2);
  });

  it('cards 变体：trailing 行右端占位（DSL 节点），点击占位区不触发勾选', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'Checkbox',
      props: {
        variant: 'cards',
        value: '${state.modules}',
        options: [
          {
            label: '基础报表',
            value: 'basic',
            trailing: { type: 'Text', props: { text: '已含', type: 'secondary' } },
          },
          { label: '高级分析', value: 'pro' },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { modules: '${event}' } },
      },
    });

    const slot = container.querySelector('[data-slot=checkbox-group-card-trailing]');
    expect(slot).not.toBeNull();
    expect(slot!.textContent).toContain('已含');

    await user.click(screen.getByText('已含'));
    expect(context.state.get('modules')).toBeUndefined();

    await user.click(screen.getByText('高级分析'));
    await expectEventState(context, 'modules', ['pro']);
  });

  it('cards 变体：trailing 支持 ReactNode（纯 React 使用，不依赖 Renderer 上下文）', () => {
    render(
      <Checkbox
        variant="cards"
        options={[{ label: '基础报表', value: 'basic', trailing: <em>HOT</em> }]}
        value={[]}
        onChange={() => {}}
      />,
    );
    const slot = document.querySelector('[data-slot=checkbox-group-card-trailing]');
    expect(slot).not.toBeNull();
    expect(slot!.textContent).toContain('HOT');
  });

  it('cards 变体：默认显示 border，bordered=false 隐藏', () => {
    const { container, unmount } = renderDsl({
      type: 'Checkbox',
      props: {
        variant: 'cards',
        value: ['pro'],
        options: [
          { label: '基础报表', value: 'basic' },
          { label: '高级分析', value: 'pro' },
        ],
      },
    });

    const rows = container.querySelectorAll('[data-slot=checkbox-group-card]');
    expect(rows[0]!.className).toContain('border-border');
    // 选中行 border-primary 高亮
    expect(rows[1]!.className).toContain('border-primary');
    unmount();

    const again = renderDsl({
      type: 'Checkbox',
      props: {
        variant: 'cards',
        bordered: false,
        options: [{ label: '基础报表', value: 'basic' }],
      },
    });
    const row = again.container.querySelector('[data-slot=checkbox-group-card]')!;
    expect(row.className).not.toContain('border-border');
    expect(row.className).not.toContain('border-primary');
  });

  it('cards 变体：选项 clickable=false 禁用整卡点击（外观不变）', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'Checkbox',
      props: {
        variant: 'cards',
        value: '${state.modules}',
        options: [
          { label: '基础报表', value: 'basic', clickable: false },
          { label: '高级分析', value: 'pro' },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { modules: '${event}' } },
      },
    });

    const basicRow = container.querySelectorAll('[data-slot=checkbox-group-card]')[0]!;
    expect(basicRow.className).not.toContain('opacity-50');
    expect(basicRow.className).not.toContain('cursor-pointer');

    await user.click(screen.getByText('基础报表'));
    expect(context.state.get('modules')).toBeUndefined();

    await user.click(screen.getByText('高级分析'));
    await expectEventState(context, 'modules', ['pro']);
  });

  it('disabled 选项不可勾选', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'Checkbox',
      props: {
        options: [
          { label: '可选', value: 'y' },
          { label: '锁定', value: 'n', disabled: true },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { picked: '${event}' } },
      },
    });

    await user.click(screen.getByRole('checkbox', { name: '锁定' }));
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(context.state.get('picked')).toBeUndefined();
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

  it('Input 独立渲染：className 挂包裹节点（allowClear 缺省开启），controlClassName 挂 input 本体', () => {
    const { container } = renderDsl({
      type: 'Input',
      props: { className: 'root-cls', controlClassName: 'ctrl-cls' },
    });

    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain('root-cls');
    const input = container.querySelector('input');
    expect(input?.className).toContain('ctrl-cls');
    expect(input?.className).not.toContain('root-cls');
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
  it('控件容器不再带 mt-2（label 与控件间距由 Field 容器 flex-col gap-2 承担）', () => {
    const withLabel = renderDsl({
      type: 'Field',
      props: { label: '邮箱' },
      children: [{ type: 'Input', props: { placeholder: 'x' } }],
    });
    expect(
      withLabel.container.querySelector('[data-slot=field-control]')?.className,
    ).not.toContain('mt-2');

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
    expect(control.className).not.toContain('mt-2');
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

describe('Field 在 Form 内的布局间距', () => {
  it('控件容器为相邻按钮预留间距（[&>button+button]:ml-2）', () => {
    const { container } = renderDsl({
      type: 'Field',
      children: [
        { type: 'Button', props: { text: '查询', variant: 'primary', submit: true } },
        { type: 'Button', props: { text: '重置' } },
      ],
    });
    const control = container.querySelector('[data-slot=field-control]')!;
    expect(control.className).toContain('[&>button+button]:ml-2');
    expect(control.querySelectorAll('button')).toHaveLength(2);
  });

  it('inline Form 中 label 与控件同一行（flex-row + label 行 w-auto）', () => {
    const { container } = renderDsl({
      type: 'Form',
      props: { layout: 'inline' },
      children: [
        {
          type: 'Field',
          props: { label: '关键词' },
          children: [{ type: 'Input', props: { name: 'a' } }],
        },
      ],
    });
    const field = container.querySelector('[data-slot=field]')!;
    expect(field.className).toContain('flex-row');
    expect(field.className).toContain('items-center');
    const labelRow = field.querySelector('[data-slot=field-label]')!.parentElement!;
    expect(labelRow.className).not.toContain('w-full');
    expect(labelRow.className).toContain('shrink-0');
  });

  it('vertical Form 中的 Field 带 mb-2', () => {
    const { container } = renderDsl({
      type: 'Form',
      props: { layout: 'vertical' },
      children: [
        {
          type: 'Field',
          props: { label: '名称' },
          children: [{ type: 'Input', props: { name: 'a' } }],
        },
      ],
    });
    expect(container.querySelector('[data-slot=field]')?.className).toContain(
      'mb-2',
    );
  });

  it('inline Form 与 Form 外的 Field 不带 mb-2；horizontal 逐行排布带 mb-2', () => {
    for (const layout of ['inline'] as const) {
      const { container, unmount } = renderDsl({
        type: 'Form',
        props: { layout },
        children: [
          {
            type: 'Field',
            props: { label: '名称' },
            children: [{ type: 'Input', props: { name: 'a' } }],
          },
        ],
      });
      expect(
        container.querySelector('[data-slot=field]')?.className,
      ).not.toContain('mb-2');
      unmount();
    }

    // horizontal：label 与控件同行、逐行排布，Field 之间需要行距
    const horizontal = renderDsl({
      type: 'Form',
      props: { layout: 'horizontal' },
      children: [
        {
          type: 'Field',
          props: { label: '名称' },
          children: [{ type: 'Input', props: { name: 'a' } }],
        },
      ],
    });
    expect(
      horizontal.container.querySelector('[data-slot=field]')?.className,
    ).toContain('mb-2');

    const outside = renderDsl({
      type: 'Field',
      props: { label: '名称' },
      children: [{ type: 'Input', props: { name: 'a' } }],
    });
    expect(
      outside.container.querySelector('[data-slot=field]')?.className,
    ).not.toContain('mb-2');
  });
});
