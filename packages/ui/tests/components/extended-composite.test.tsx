// @vitest-environment jsdom
/**
 * 扩展复合类组件契约（spec: shadcn-extended-components / 复合类组件）
 * 与表单类 Calendar / InputOTP / Combobox：
 * Form 集成（name 即成表单项、值收集）、事件值规范化（ISO 日期字符串 /
 * OTP 字符串 / 选中 value / boolean / 值数组）与通用 props。
 */
import { fireEvent, screen } from '@testing-library/react';
import { format } from 'date-fns';
import { describe, expect, it, vi } from 'vitest';

import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  expectIconBeforeLabel,
  renderDsl,
} from './helpers.js';

const COMMON_PROPS = COMMON_PROPS_PROBE;

describe('Calendar', () => {
  // 点击当月 15 日（grid 头部最多回退 6 天，当月的 15 号一定是首个 "15" 文本）
  const expectedIso = `${format(new Date(), 'yyyy-MM')}-15`;

  it('独立渲染：选中日期后 onChange 传出 ISO 日期字符串', async () => {
    const { context } = renderDsl({
      type: 'Calendar',
      props: { mode: 'single' },
      events: {
        onChange: { action: 'setState', params: { day: '${event}' } },
      },
    });

    fireEvent.click(screen.getAllByText('15')[0]);
    await expectEventState(context, 'day', expectedIso);
  });

  it('Form 内声明 name：选中日期后提交收集 ISO 字符串', async () => {
    const { container, context } = renderDsl({
      type: 'Form',
      children: [
        { type: 'Calendar', props: { name: 'birthday', label: '生日' } },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    expect(container.querySelector('[data-slot=form-item]')).not.toBeNull();
    fireEvent.click(screen.getAllByText('15')[0]);
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({ birthday: expectedIso });
    });
  });

  it('通用 props 作用于根节点（独立渲染）', () => {
    const { container } = renderDsl({
      type: 'Calendar',
      props: { ...COMMON_PROPS },
    });
    expectCommonProps(container.firstElementChild);
  });
});

describe('InputOTP', () => {
  it('独立渲染：输入触发 onChange 传当前字符串，满位触发 onComplete 传完整 OTP', async () => {
    const { container, context } = renderDsl({
      type: 'InputOTP',
      props: { length: 6 },
      events: {
        onChange: { action: 'setState', params: { otp: '${event}' } },
        onComplete: { action: 'setState', params: { otpDone: '${event}' } },
      },
    });

    expect(container.querySelectorAll('[data-slot=input-otp-slot]')).toHaveLength(6);
    const input = container.querySelector('input')!;
    fireEvent.change(input, { target: { value: '123456' } });

    await expectEventState(context, 'otp', '123456');
    await expectEventState(context, 'otpDone', '123456');
  });

  it('Form 内声明 name：输入后提交收集字符串', async () => {
    const { container, context } = renderDsl({
      type: 'Form',
      children: [
        { type: 'InputOTP', props: { name: 'code', label: '验证码', length: 4 } },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    expect(container.querySelector('[data-slot=form-item]')).not.toBeNull();
    fireEvent.change(container.querySelector('input')!, { target: { value: '9527' } });
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({ code: '9527' });
    });
  });

  it('通用 props 作用于根节点（独立渲染）', () => {
    const { container } = renderDsl({
      type: 'InputOTP',
      props: { length: 4, ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=input-otp-field]'));
  });
});

describe('Combobox', () => {
  const options = [
    { label: '创建', value: 'create' },
    { label: '更新', value: 'update' },
  ];

  it('独立渲染：搜索过滤后选中，onChange 传出选中 value', async () => {
    const { context } = renderDsl({
      type: 'Combobox',
      props: { options, placeholder: '请选择操作' },
      events: {
        onChange: { action: 'setState', params: { picked: '${event}' } },
      },
    });

    const trigger = document.querySelector('[data-slot=combobox-trigger]')!;
    expect(trigger.textContent).toContain('请选择操作');
    fireEvent.click(trigger);

    const search = await screen.findByPlaceholderText('请选择操作');
    fireEvent.change(search, { target: { value: '更新' } });
    fireEvent.click(await screen.findByText('更新'));

    await expectEventState(context, 'picked', 'update');
    expect(trigger.textContent).toContain('更新');
  });

  it('Form 内声明 name：选中后提交收集 value', async () => {
    const { container, context } = renderDsl({
      type: 'Form',
      children: [
        { type: 'Combobox', props: { name: 'action', label: '操作', options } },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    expect(container.querySelector('[data-slot=form-item]')).not.toBeNull();
    fireEvent.click(document.querySelector('[data-slot=combobox-trigger]')!);
    fireEvent.click(await screen.findByText('创建'));
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({ action: 'create' });
    });
  });

  it('通用 props 作用于根节点（独立渲染为触发器）', () => {
    renderDsl({
      type: 'Combobox',
      props: { options, ...COMMON_PROPS },
    });
    expectCommonProps(document.querySelector('[data-slot=combobox-trigger]'));
  });
});

describe('Carousel', () => {
  it('图片 items 渲染轮播结构与 loop 配置', () => {
    const { container } = renderDsl({
      type: 'Carousel',
      props: {
        items: [
          { src: '/a.png', alt: 'A' },
          { src: '/b.png', alt: 'B' },
        ],
        loop: true,
      },
    });

    expect(container.querySelector('[data-slot=carousel]')).not.toBeNull();
    expect(container.querySelectorAll('[data-slot=carousel-item]')).toHaveLength(2);
    expect(screen.getByAltText('A')).toBeTruthy();
    expect(screen.getByAltText('B')).toBeTruthy();
    expect(container.querySelector('[data-slot=carousel-previous]')).not.toBeNull();
    expect(container.querySelector('[data-slot=carousel-next]')).not.toBeNull();
  });

  it('DSL 子树 items 经 renderChildren 渲染', () => {
    const { container } = renderDsl({
      type: 'Carousel',
      props: {
        items: [{ type: 'Text', props: { text: '第一页' } }],
      },
    });

    expect(screen.getByText('第一页')).toBeTruthy();
    expect(container.querySelectorAll('[data-slot=carousel-item]')).toHaveLength(1);
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Carousel',
      props: { items: [{ src: '/a.png', alt: 'A' }], ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=carousel]'));
  });
});

describe('Command', () => {
  const groups = [
    {
      heading: '操作',
      items: [
        { label: '创建记录', value: 'create' },
        { label: '删除记录', value: 'delete' },
      ],
    },
    {
      heading: '导航',
      items: [{ label: '返回首页', value: 'home' }],
    },
  ];

  it('渲染分组与搜索框；搜索过滤后选中，onSelect 传出 value', async () => {
    const { context } = renderDsl({
      type: 'Command',
      props: { groups, placeholder: '搜索命令' },
      events: {
        onSelect: { action: 'setState', params: { cmd: '${event}' } },
      },
    });

    expect(screen.getByText('操作')).toBeTruthy();
    expect(screen.getByText('导航')).toBeTruthy();

    const search = screen.getByPlaceholderText('搜索命令');
    fireEvent.change(search, { target: { value: '创建' } });
    fireEvent.click(await screen.findByText('创建记录'));

    await expectEventState(context, 'cmd', 'create');
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Command',
      props: { groups, ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=command]'));
  });

  it('命令项声明 icon 时在文字前渲染图标', () => {
    renderDsl({
      type: 'Command',
      props: {
        groups: [
          {
            heading: '操作',
            items: [{ label: '创建记录', value: 'create', icon: 'plus' }],
          },
        ],
      },
    });

    expectIconBeforeLabel(screen.getByText('创建记录'), '创建记录');
  });
});

describe('Resizable', () => {
  it('渲染多个面板（DSL 子树）与拖拽手柄', () => {
    const { container } = renderDsl({
      type: 'Resizable',
      props: {
        direction: 'horizontal',
        panels: [
          {
            defaultSize: 30,
            children: [{ type: 'Text', props: { text: '左面板' } }],
          },
          {
            defaultSize: 70,
            children: [{ type: 'Text', props: { text: '右面板' } }],
          },
        ],
      },
    });

    expect(screen.getByText('左面板')).toBeTruthy();
    expect(screen.getByText('右面板')).toBeTruthy();
    expect(container.querySelectorAll('[data-slot=resizable-panel]')).toHaveLength(2);
    expect(container.querySelector('[data-slot=resizable-handle]')).not.toBeNull();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Resizable',
      props: {
        panels: [{ children: [{ type: 'Text', props: { text: 'x' } }] }],
        ...COMMON_PROPS,
      },
    });
    expectCommonProps(container.querySelector('[data-slot=resizable-panel-group]'));
  });
});

describe('ScrollArea', () => {
  it('maxHeight 尺寸约束 + children 渲染', () => {
    const { container } = renderDsl({
      type: 'ScrollArea',
      props: { maxHeight: 120 },
      children: [{ type: 'Text', props: { text: '长内容' } }],
    });

    expect(screen.getByText('长内容')).toBeTruthy();
    const root = container.querySelector('[data-slot=scroll-area]') as HTMLElement;
    expect(root.style.maxHeight).toBe('120px');
    expect(
      container.querySelector('[data-slot=scroll-area-viewport]'),
    ).not.toBeNull();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'ScrollArea',
      props: { ...COMMON_PROPS },
      children: [{ type: 'Text', props: { text: 'x' } }],
    });
    expectCommonProps(container.querySelector('[data-slot=scroll-area]'));
  });
});

describe('Toggle', () => {
  it('点击后 onChange 传出 boolean', async () => {
    const { context } = renderDsl({
      type: 'Toggle',
      props: { text: '加粗' },
      events: {
        onChange: { action: 'setState', params: { bold: '${event}' } },
      },
    });

    fireEvent.click(screen.getByRole('button', { name: '加粗' }));
    await expectEventState(context, 'bold', true);
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Toggle',
      props: { text: '加粗', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=toggle]'));
  });
});

describe('ToggleGroup', () => {
  const options = [
    { label: '左', value: 'left' },
    { label: '中', value: 'center' },
    { label: '右', value: 'right' },
  ];

  it('单选：点击后 onChange 传出选中 value', async () => {
    const { context } = renderDsl({
      type: 'ToggleGroup',
      props: { options },
      events: {
        onChange: { action: 'setState', params: { align: '${event}' } },
      },
    });

    fireEvent.click(screen.getByRole('button', { name: '中' }));
    await expectEventState(context, 'align', 'center');
  });

  it('多选：onChange 传出选中值数组', async () => {
    const { context } = renderDsl({
      type: 'ToggleGroup',
      props: { options, multiple: true },
      events: {
        onChange: { action: 'setState', params: { aligns: '${event}' } },
      },
    });

    fireEvent.click(screen.getByRole('button', { name: '左' }));
    await vi.waitFor(() => {
      expect(context.state.get('aligns')).toEqual(['left']);
    });
    fireEvent.click(screen.getByRole('button', { name: '右' }));
    await vi.waitFor(() => {
      expect(context.state.get('aligns')).toEqual(['left', 'right']);
    });
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'ToggleGroup',
      props: { options, ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=toggle-group]'));
  });
});

describe('ButtonGroup', () => {
  it('children 若干 Button 渲染为相连按钮组', () => {
    const { container } = renderDsl({
      type: 'ButtonGroup',
      children: [
        { type: 'Button', props: { text: '上一页' } },
        { type: 'Button', props: { text: '下一页' } },
      ],
    });

    const group = container.querySelector('[data-slot=button-group]')!;
    expect(group).not.toBeNull();
    expect(group.querySelectorAll('[data-slot=button]')).toHaveLength(2);
    expect(screen.getByRole('button', { name: '上一页' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '下一页' })).toBeTruthy();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'ButtonGroup',
      props: { ...COMMON_PROPS },
      children: [{ type: 'Button', props: { text: 'x' } }],
    });
    expectCommonProps(container.querySelector('[data-slot=button-group]'));
  });
});

describe('InputGroup', () => {
  it('children 为 Input 与前后缀元素（Text/Button）组合渲染', () => {
    const { container } = renderDsl({
      type: 'InputGroup',
      children: [
        { type: 'Text', props: { text: 'https://' } },
        { type: 'Input', props: { placeholder: 'example.com' } },
        { type: 'Button', props: { text: '访问' } },
      ],
    });

    const group = container.querySelector('[data-slot=input-group]')!;
    expect(group).not.toBeNull();
    expect(screen.getByText('https://')).toBeTruthy();
    expect(screen.getByPlaceholderText('example.com')).toBeTruthy();
    expect(screen.getByRole('button', { name: '访问' })).toBeTruthy();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'InputGroup',
      props: { ...COMMON_PROPS },
      children: [{ type: 'Input', props: { placeholder: 'x' } }],
    });
    expectCommonProps(container.querySelector('[data-slot=input-group]'));
  });
});

describe('Item', () => {
  it('title / description / actions（DSL 子树）渲染', () => {
    const { container } = renderDsl({
      type: 'Item',
      props: {
        title: '系统更新',
        description: 'v2.0 已发布',
        actions: [{ type: 'Button', props: { text: '查看' } }],
      },
    });

    expect(container.querySelector('[data-slot=item]')).not.toBeNull();
    expect(screen.getByText('系统更新')).toBeTruthy();
    expect(screen.getByText('v2.0 已发布')).toBeTruthy();
    expect(screen.getByRole('button', { name: '查看' })).toBeTruthy();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Item',
      props: { title: 'x', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=item]'));
  });
});

describe('Typography', () => {
  it('variant=h2 渲染 h2 级别样式文本', () => {
    const { container } = renderDsl({
      type: 'Typography',
      props: { variant: 'h2', text: '标题' },
    });

    const el = container.querySelector('h2');
    expect(el).not.toBeNull();
    expect(el!.textContent).toBe('标题');
    expect(el!.getAttribute('data-variant')).toBe('h2');
  });

  it('其余变体渲染对应语义标签', () => {
    const { container } = renderDsl({
      type: 'Flex',
      children: [
        { type: 'Typography', props: { variant: 'blockquote', text: '引用' } },
        { type: 'Typography', props: { variant: 'inline-code', text: 'code' } },
        { type: 'Typography', props: { variant: 'small', text: '小字' } },
        { type: 'Typography', props: { variant: 'muted', text: '弱化' } },
      ],
    });

    expect(container.querySelector('blockquote')!.textContent).toBe('引用');
    expect(container.querySelector('code')!.textContent).toBe('code');
    expect(container.querySelector('small')!.textContent).toBe('小字');
    expect(screen.getByText('弱化')).toBeTruthy();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Typography',
      props: { variant: 'p', text: 'x', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=typography]'));
  });
});
