// @vitest-environment jsdom
/**
 * 基础数据录入组件契约（第五批）：
 * Rate / TimePicker / ColorPicker / Upload / TreeSelect / Cascader /
 * Transfer / Mentions 的渲染冒烟、事件值规范化、Form 集成与通用 props。
 */
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { createComponentRegistry } from '../../src/components/index.js';
import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  renderDslWith,
  type RenderDslResult,
} from './helpers.js';

import type { DslNode } from '@pactor-app/core';

const COMMON_PROPS = COMMON_PROPS_PROBE;

function renderInput(node: DslNode): RenderDslResult {
  return renderDslWith(createComponentRegistry(), node);
}

/** 打开 Popover 浮层并等待内容挂载 */
async function openPopover(trigger: Element) {
  fireEvent.click(trigger);
  await vi.waitFor(() => {
    expect(document.querySelector('[data-slot=popover-content]')).not.toBeNull();
  });
}

function popoverContent(): HTMLElement {
  return document.querySelector('[data-slot=popover-content]') as HTMLElement;
}

describe('Rate', () => {
  it('渲染冒烟 + 点击第 4 星 onChange 传出 4', async () => {
    const { container, context } = renderInput({
      type: 'Rate',
      events: {
        onChange: { action: 'setState', params: { score: '${event}' } },
      },
    });

    expect(container.querySelector('[data-slot=rate]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '第 4 星' }));
    await expectEventState(context, 'score', 4);
  });

  it('allowHalf：点击左半传出半星值', async () => {
    const { context } = renderInput({
      type: 'Rate',
      props: { allowHalf: true },
      events: {
        onChange: { action: 'setState', params: { score: '${event}' } },
      },
    });

    fireEvent.click(screen.getByRole('button', { name: '第 2 星左半' }));
    await expectEventState(context, 'score', 1.5);
    fireEvent.click(screen.getByRole('button', { name: '第 2 星右半' }));
    await expectEventState(context, 'score', 2);
  });

  it('Form 内评分参与提交', async () => {
    const { container, context } = renderInput({
      type: 'Form',
      children: [
        { type: 'Rate', props: { name: 'score', label: '评分' } },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    expect(container.querySelector('[data-slot=form-item]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '第 3 星' }));
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({ score: 3 });
    });
  });

  it('通用 props 作用于根节点（独立渲染）', () => {
    const { container } = renderInput({
      type: 'Rate',
      props: { value: 2, ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=rate]'));
  });
});

describe('TimePicker', () => {
  it('渲染冒烟：value 显示在触发器上', () => {
    renderInput({ type: 'TimePicker', props: { value: '13:45:00' } });
    expect(screen.getByText('13:45:00')).toBeTruthy();
  });

  it('点选时列后确定：onChange 传出格式化时间字符串', async () => {
    const { context } = renderInput({
      type: 'TimePicker',
      props: { value: '13:45:00' },
      events: {
        onChange: { action: 'setState', params: { time: '${event}' } },
      },
    });

    await openPopover(document.querySelector('[data-slot=timepicker-trigger]')!);
    const hourColumn = popoverContent().querySelector(
      '[data-slot=timepicker-hour-column]',
    ) as HTMLElement;
    fireEvent.click(within(hourColumn).getByText('09'));
    fireEvent.click(within(popoverContent()).getByText('确定'));
    await expectEventState(context, 'time', '09:45:00');
  });

  it("format='HH:mm'：无秒列且值无秒", async () => {
    const { context } = renderInput({
      type: 'TimePicker',
      props: { value: '13:45', format: 'HH:mm' },
      events: {
        onChange: { action: 'setState', params: { time: '${event}' } },
      },
    });

    await openPopover(document.querySelector('[data-slot=timepicker-trigger]')!);
    expect(
      popoverContent().querySelector('[data-slot=timepicker-second-column]'),
    ).toBeNull();
    const minuteColumn = popoverContent().querySelector(
      '[data-slot=timepicker-minute-column]',
    ) as HTMLElement;
    fireEvent.click(within(minuteColumn).getByText('30'));
    fireEvent.click(within(popoverContent()).getByText('确定'));
    await expectEventState(context, 'time', '13:30');
  });

  it('通用 props 作用于触发器（独立渲染）', () => {
    renderInput({ type: 'TimePicker', props: { ...COMMON_PROPS } });
    expectCommonProps(document.querySelector('[data-slot=timepicker-trigger]'));
  });
});

describe('ColorPicker', () => {
  /** jsdom 无布局：为拖拽计算钉住元素矩形（100×100 便于百分比换算） */
  function mockRect(el: Element) {
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
  }

  it('渲染冒烟：预设色板渲染且触发器显示当前值', async () => {
    renderInput({
      type: 'ColorPicker',
      props: { value: '#1677ff', presets: ['#1677ff', '#ff0000'] },
    });

    expect(screen.getByText('#1677ff')).toBeTruthy();
    await openPopover(document.querySelector('[data-slot=colorpicker-trigger]')!);
    expect(
      within(popoverContent()).getByRole('button', { name: '#ff0000' }),
    ).toBeTruthy();
  });

  it('点击预设色板：onChange 传出 hex', async () => {
    const { context } = renderInput({
      type: 'ColorPicker',
      props: { presets: ['#1677ff', '#ff0000'] },
      events: {
        onChange: { action: 'setState', params: { color: '${event}' } },
      },
    });

    await openPopover(document.querySelector('[data-slot=colorpicker-trigger]')!);
    fireEvent.click(within(popoverContent()).getByRole('button', { name: '#ff0000' }));
    await expectEventState(context, 'color', '#ff0000');
  });

  it('饱和度面板点选：按坐标计算 s/v 并传出 hex', async () => {
    const { context } = renderInput({
      type: 'ColorPicker',
      events: {
        onChange: { action: 'setState', params: { color: '${event}' } },
      },
    });

    await openPopover(document.querySelector('[data-slot=colorpicker-trigger]')!);
    const panel = popoverContent().querySelector('[data-slot=colorpicker-saturation]')!;
    mockRect(panel);
    // h=0（缺省红）、s=0.5、v=0.75 → rgb(191, 96, 96)
    fireEvent.pointerDown(panel, { clientX: 50, clientY: 25 });
    await expectEventState(context, 'color', '#bf6060');
  });

  it('色相滑杆点选：红色拖到青色', async () => {
    const { context } = renderInput({
      type: 'ColorPicker',
      props: { value: '#ff0000' },
      events: {
        onChange: { action: 'setState', params: { color: '${event}' } },
      },
    });

    await openPopover(document.querySelector('[data-slot=colorpicker-trigger]')!);
    const bar = popoverContent().querySelector('[data-slot=colorpicker-hue]')!;
    mockRect(bar);
    fireEvent.pointerDown(bar, { clientX: 50, clientY: 0 });
    await expectEventState(context, 'color', '#00ffff');
  });

  it('透明度滑杆点选：a=0.5 时传出 8 位 hex', async () => {
    const { context } = renderInput({
      type: 'ColorPicker',
      props: { value: '#ff0000' },
      events: {
        onChange: { action: 'setState', params: { color: '${event}' } },
      },
    });

    await openPopover(document.querySelector('[data-slot=colorpicker-trigger]')!);
    const bar = popoverContent().querySelector('[data-slot=colorpicker-alpha]')!;
    mockRect(bar);
    fireEvent.pointerDown(bar, { clientX: 50, clientY: 0 });
    await expectEventState(context, 'color', '#ff000080');
  });

  it('RGBA 通道输入：R 通道改为 0 后提交', async () => {
    const { context } = renderInput({
      type: 'ColorPicker',
      props: { value: '#ff0000' },
      events: {
        onChange: { action: 'setState', params: { color: '${event}' } },
      },
    });

    await openPopover(document.querySelector('[data-slot=colorpicker-trigger]')!);
    const input = within(popoverContent()).getByLabelText('R 通道');
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await expectEventState(context, 'color', '#000000');
  });

  it('hex 输入：合法值 Enter 提交（3 位展开），非法值显示错误且不提交', async () => {
    const { context } = renderInput({
      type: 'ColorPicker',
      events: {
        onChange: { action: 'setState', params: { color: '${event}' } },
      },
    });

    await openPopover(document.querySelector('[data-slot=colorpicker-trigger]')!);
    const input = within(popoverContent()).getByLabelText('hex 颜色值');

    fireEvent.change(input, { target: { value: 'not-a-color' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(
      popoverContent().querySelector('[data-slot=colorpicker-error]'),
    ).not.toBeNull();
    expect(context.state.get('color')).toBeUndefined();

    fireEvent.change(input, { target: { value: '#0f0' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await expectEventState(context, 'color', '#00ff00');
  });

  it('通用 props 作用于触发器（独立渲染）', () => {
    renderInput({ type: 'ColorPicker', props: { ...COMMON_PROPS } });
    expectCommonProps(document.querySelector('[data-slot=colorpicker-trigger]'));
  });
});

describe('Upload', () => {
  function fileInput(): HTMLElement {
    return document.querySelector('[data-slot=upload-input]') as HTMLElement;
  }

  it('渲染冒烟 + 选择文件：列表渲染元数据，onChange 传出可序列化数组', async () => {
    const { container, context } = renderInput({
      type: 'Upload',
      props: { multiple: true },
      events: {
        onChange: { action: 'setState', params: { files: '${event}' } },
      },
    });

    expect(screen.getByText('选择文件')).toBeTruthy();
    fireEvent.change(fileInput(), {
      target: {
        files: [new File(['hello'], 'a.txt', { type: 'text/plain' })],
      },
    });

    expect(container.querySelector('[data-slot=upload-list]')?.textContent).toContain(
      'a.txt',
    );
    await expectEventState(context, 'files', [
      { name: 'a.txt', size: 5, type: 'text/plain' },
    ]);
  });

  it('maxSize / accept 校验：不合规文件不进列表并提示', async () => {
    const { container, context } = renderInput({
      type: 'Upload',
      props: { maxSize: 4, accept: '.png', multiple: true },
      events: {
        onChange: { action: 'setState', params: { files: '${event}' } },
      },
    });

    fireEvent.change(fileInput(), {
      target: {
        files: [
          new File(['12345'], 'big.png', { type: 'image/png' }),
          new File(['ok'], 'ok.txt', { type: 'text/plain' }),
        ],
      },
    });

    expect(context.state.get('files')).toBeUndefined();
    expect(container.querySelector('[data-slot=upload-list]')).toBeNull();
    expect(
      container.querySelector('[data-slot=upload-rejected]')?.textContent,
    ).toContain('2');
  });

  it('移除按钮把文件从列表去掉', async () => {
    const { context } = renderInput({
      type: 'Upload',
      props: { multiple: true },
      events: {
        onChange: { action: 'setState', params: { files: '${event}' } },
      },
    });

    fireEvent.change(fileInput(), {
      target: { files: [new File(['x'], 'a.txt', { type: 'text/plain' })] },
    });
    fireEvent.click(screen.getByRole('button', { name: '移除 a.txt' }));
    await expectEventState(context, 'files', []);
  });

  it('drag 形态渲染拖拽区，drop 文件进列表', async () => {
    const { container, context } = renderInput({
      type: 'Upload',
      props: { drag: true },
      events: {
        onChange: { action: 'setState', params: { files: '${event}' } },
      },
    });

    const dragger = container.querySelector('[data-slot=upload-dragger]')!;
    expect(dragger).not.toBeNull();
    fireEvent.drop(dragger, {
      dataTransfer: { files: [new File(['xy'], 'd.txt', { type: 'text/plain' })] },
    });
    await expectEventState(context, 'files', [
      { name: 'd.txt', size: 2, type: 'text/plain' },
    ]);
  });

  it('Form 内选择文件后提交：values 为元数据数组', async () => {
    const { container, context } = renderInput({
      type: 'Form',
      children: [
        { type: 'Upload', props: { name: 'attachments', label: '附件' } },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    expect(container.querySelector('[data-slot=form-item]')).not.toBeNull();
    fireEvent.change(fileInput(), {
      target: { files: [new File(['abc'], 'b.txt', { type: 'text/plain' })] },
    });
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({
        attachments: [{ name: 'b.txt', size: 3, type: 'text/plain' }],
      });
    });
  });
});

const TREE_OPTIONS = [
  {
    label: '父节点',
    value: 'parent',
    children: [
      { label: '子节点A', value: 'child-a' },
      { label: '子节点B', value: 'child-b' },
    ],
  },
  { label: '独立项', value: 'solo' },
];

describe('TreeSelect', () => {
  it('渲染冒烟 + 展开选中：onChange 传出节点 value，触发器回显 label', async () => {
    const { context } = renderInput({
      type: 'TreeSelect',
      props: { options: TREE_OPTIONS },
      events: {
        onChange: { action: 'setState', params: { node: '${event}' } },
      },
    });

    await openPopover(document.querySelector('[data-slot=treeselect-trigger]')!);
    fireEvent.click(screen.getByRole('button', { name: '展开 父节点' }));
    fireEvent.click(within(popoverContent()).getByText('子节点A'));
    await expectEventState(context, 'node', 'child-a');
    expect(
      document.querySelector('[data-slot=treeselect-trigger]')?.textContent,
    ).toContain('子节点A');
  });

  it('searchable：按 label 过滤，命中节点的祖先保留展开', async () => {
    const { context } = renderInput({
      type: 'TreeSelect',
      props: { options: TREE_OPTIONS, searchable: true },
      events: {
        onChange: { action: 'setState', params: { node: '${event}' } },
      },
    });

    await openPopover(document.querySelector('[data-slot=treeselect-trigger]')!);
    fireEvent.change(within(popoverContent()).getByLabelText('搜索'), {
      target: { value: '子节点B' },
    });

    const tree = popoverContent().querySelector('[data-slot=treeselect-tree]')!;
    expect(tree.textContent).toContain('子节点B');
    expect(tree.textContent).not.toContain('子节点A');
    expect(tree.textContent).not.toContain('独立项');

    fireEvent.click(within(popoverContent()).getByText('子节点B'));
    await expectEventState(context, 'node', 'child-b');
  });

  it('Form 内选中后提交：值为节点 value', async () => {
    const { context } = renderInput({
      type: 'Form',
      children: [
        {
          type: 'TreeSelect',
          props: { name: 'dept', label: '部门', options: TREE_OPTIONS },
        },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    await openPopover(document.querySelector('[data-slot=treeselect-trigger]')!);
    fireEvent.click(within(popoverContent()).getByText('独立项'));
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({ dept: 'solo' });
    });
  });
});

const CASCADE_OPTIONS = [
  {
    label: '浙江',
    value: 'zj',
    children: [
      { label: '杭州', value: 'hz' },
      { label: '宁波', value: 'nb' },
    ],
  },
  { label: '北京', value: 'bj' },
];

describe('Cascader', () => {
  it('渲染冒烟 + 逐级下钻：选完路径 onChange 传出 value 数组', async () => {
    const { context } = renderInput({
      type: 'Cascader',
      props: { options: CASCADE_OPTIONS },
      events: {
        onChange: { action: 'setState', params: { region: '${event}' } },
      },
    });

    await openPopover(document.querySelector('[data-slot=cascader-trigger]')!);
    expect(popoverContent().querySelectorAll('[data-slot=cascader-column]')).toHaveLength(1);

    fireEvent.click(within(popoverContent()).getByText('浙江'));
    expect(popoverContent().querySelectorAll('[data-slot=cascader-column]')).toHaveLength(2);

    fireEvent.click(within(popoverContent()).getByText('杭州'));
    await expectEventState(context, 'region', ['zj', 'hz']);
    expect(
      document.querySelector('[data-slot=cascader-trigger]')?.textContent,
    ).toContain('浙江 / 杭州');
  });

  it('受控 value 以 ` / ` 连接路径 label 回显', () => {
    renderInput({
      type: 'Cascader',
      props: { options: CASCADE_OPTIONS, value: ['zj', 'nb'] },
    });
    expect(
      document.querySelector('[data-slot=cascader-trigger]')?.textContent,
    ).toContain('浙江 / 宁波');
  });

  it('通用 props 作用于触发器（独立渲染）', () => {
    renderInput({
      type: 'Cascader',
      props: { options: CASCADE_OPTIONS, ...COMMON_PROPS },
    });
    expectCommonProps(document.querySelector('[data-slot=cascader-trigger]'));
  });
});

const TRANSFER_OPTIONS = [
  { label: '选项A', value: 'a' },
  { label: '选项B', value: 'b' },
  { label: '选项C', value: 'c', disabled: true },
];

describe('Transfer', () => {
  it('渲染冒烟：双列与标题渲染，目标侧项列于右列', () => {
    const { container } = renderInput({
      type: 'Transfer',
      props: {
        options: TRANSFER_OPTIONS,
        value: ['a'],
        titles: ['候选', '已选'],
      },
    });

    expect(screen.getByText('候选')).toBeTruthy();
    expect(screen.getByText('已选')).toBeTruthy();
    const left = container.querySelector('[data-slot=transfer-left-panel]')!;
    const right = container.querySelector('[data-slot=transfer-right-panel]')!;
    expect(left.textContent).toContain('选项B');
    expect(left.textContent).not.toContain('选项A');
    expect(right.textContent).toContain('选项A');
  });

  it('勾选后移到右侧：onChange 传出目标侧 value 数组', async () => {
    const { context } = renderInput({
      type: 'Transfer',
      props: { options: TRANSFER_OPTIONS, value: ['a'] },
      events: {
        onChange: { action: 'setState', params: { target: '${event}' } },
      },
    });

    fireEvent.click(screen.getByRole('checkbox', { name: '选项B' }));
    fireEvent.click(screen.getByRole('button', { name: '移到右侧' }));
    await expectEventState(context, 'target', ['a', 'b']);
  });

  it('列头全选仅选可用项，移回左侧还原', async () => {
    const { context } = renderInput({
      type: 'Transfer',
      props: { options: TRANSFER_OPTIONS },
      events: {
        onChange: { action: 'setState', params: { target: '${event}' } },
      },
    });

    fireEvent.click(screen.getByRole('checkbox', { name: '全选列表 1' }));
    fireEvent.click(screen.getByRole('button', { name: '移到右侧' }));
    await expectEventState(context, 'target', ['a', 'b']);

    fireEvent.click(screen.getByRole('checkbox', { name: '全选列表 2' }));
    fireEvent.click(screen.getByRole('button', { name: '移到左侧' }));
    await expectEventState(context, 'target', []);
  });
});

describe('Mentions', () => {
  const options = [
    { label: '张三', value: 'zhangsan' },
    { label: 'John', value: 'john' },
  ];

  it('渲染冒烟：textarea 渲染', () => {
    const { container } = renderInput({
      type: 'Mentions',
      props: { options, placeholder: '请输入' },
    });
    expect(container.querySelector('textarea')).not.toBeNull();
  });

  it('输入 trigger 后弹候选，点击候选在光标处插入 trigger+value+空格', async () => {
    const { context } = renderInput({
      type: 'Mentions',
      props: { options },
      events: {
        onChange: { action: 'setState', params: { text: '${event}' } },
      },
    });

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '@j' } });

    const popup = document.querySelector('[data-slot=mentions-popup]');
    expect(popup).not.toBeNull();
    expect(popup!.textContent).toContain('John');
    expect(popup!.textContent).not.toContain('张三');

    fireEvent.mouseDown(within(popup as HTMLElement).getByText('John'));
    await expectEventState(context, 'text', '@john ');
  });

  it('Enter 选中高亮候选', async () => {
    const { context } = renderInput({
      type: 'Mentions',
      props: { options },
      events: {
        onChange: { action: 'setState', params: { text: '${event}' } },
      },
    });

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'hi @' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    await expectEventState(context, 'text', 'hi @zhangsan ');
  });

  it('自定义 trigger 字符', async () => {
    const { context } = renderInput({
      type: 'Mentions',
      props: { options, trigger: '#' },
      events: {
        onChange: { action: 'setState', params: { text: '${event}' } },
      },
    });

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '#z' } });
    const popup = document.querySelector('[data-slot=mentions-popup]');
    expect(popup).not.toBeNull();
    fireEvent.mouseDown(within(popup as HTMLElement).getByText('张三'));
    await expectEventState(context, 'text', '#zhangsan ');
  });

  it('通用 props 作用于控件包裹节点（独立渲染）', () => {
    const { container } = renderInput({
      type: 'Mentions',
      props: { options, ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('textarea')?.parentElement ?? null);
  });
});
