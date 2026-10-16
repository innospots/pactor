// @vitest-environment jsdom
/**
 * 扩展按钮组件（spec: extended-button-components）测试：
 * 组件族导出、统一适配约定（className/data-slot）、ActionButton /
 * SplitButton / CopyButton / IconMorph / ConfirmMorph /
 * FloatingButtonGroup / ExpandingButtonGroup 全部 Scenario。
 * jsdom 无真实布局：滑动高亮的测量逻辑经实例级 offset 桩验证 DOM
 * 结构与状态，不测像素。
 */
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveIcon, TrashIcon, XIcon } from 'lucide-react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as ui from '../../src/ui/index.js';
import {
  ActionButton,
  ConfirmMorph,
  CopyButton,
  ExpandingButtonGroup,
  FloatingButtonGroup,
  IconMorph,
  SplitButton,
} from '../../src/ui/index.js';
import '../components/setup.js';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const FLOATING_OPTIONS = [
  { value: 'list', label: '列表' },
  { value: 'grid', label: '网格' },
];

describe('组件族与导出', () => {
  it('ui 子路径可导入全部 7 个扩展按钮组件', () => {
    for (const name of [
      'ActionButton',
      'SplitButton',
      'FloatingButtonGroup',
      'ExpandingButtonGroup',
      'CopyButton',
      'IconMorph',
      'ConfirmMorph',
    ] as const) {
      expect(
        (ui as Record<string, unknown>)[name],
        `缺少导出符号 ${name}`,
      ).toBeTypeOf('function');
    }
  });

  it('根入口结构不变：未新增 ui 层直接导出', async () => {
    const root = (await import('../../src/index.js')) as Record<
      string,
      unknown
    >;
    for (const name of [
      'ActionButton',
      'SplitButton',
      'FloatingButtonGroup',
      'ExpandingButtonGroup',
      'CopyButton',
      'IconMorph',
      'ConfirmMorph',
    ]) {
      expect(root[name], `根入口不应导出 ${name}`).toBeUndefined();
    }
  });
});

describe('统一适配约定', () => {
  it('className 经 cn() 合并到根节点（保留默认样式类）', () => {
    const { container } = render(
      <>
        <ActionButton
          icon={<XIcon />}
          aria-label="关闭"
          className="x-custom-action"
        />
        <CopyButton value="v" className="x-custom-copy" />
        <IconMorph morph="menu-close" state="a" className="x-custom-morph" />
        <SplitButton
          options={[{ value: 'a', label: 'A' }]}
          className="x-custom-split"
        >
          主操作
        </SplitButton>
        <FloatingButtonGroup
          options={FLOATING_OPTIONS}
          className="x-custom-floating"
        />
        <ExpandingButtonGroup
          options={[{ value: 'a', label: 'A', icon: <XIcon /> }]}
          className="x-custom-expanding"
        />
        <ConfirmMorph label="删除" className="x-custom-confirm" />
      </>,
    );
    const roots: [string, string][] = [
      ['[data-slot="action-button"]', 'x-custom-action'],
      ['[data-slot="copy-button"]', 'x-custom-copy'],
      // 独立渲染的 IconMorph（CopyButton 内部也有一个，取带自定义类的那个）
        ['[data-slot="icon-morph"].x-custom-morph', 'x-custom-morph'],
      ['[data-slot="split-button"]', 'x-custom-split'],
      ['[data-slot="floating-button-group"]', 'x-custom-floating'],
      ['[data-slot="expanding-button-group"]', 'x-custom-expanding'],
      ['[data-slot="confirm-morph"]', 'x-custom-confirm'],
    ];
    for (const [selector, custom] of roots) {
      const el = container.querySelector(selector);
      expect(el, selector).not.toBeNull();
      expect(el!.className, selector).toContain(custom);
      // 默认样式类仍在（cn 合并而非覆盖）
      expect(el!.className.length, selector).toBeGreaterThan(custom.length);
    }
  });
});

describe('ActionButton 紧凑工具栏按钮', () => {
  it('仅图标渲染：不渲染文字节点', () => {
    render(<ActionButton icon={<XIcon />} aria-label="关闭" />);
    const button = screen.getByRole('button', { name: '关闭' });
    expect(button.textContent).toBe('');
    expect(button.querySelector('svg')).not.toBeNull();
    // icon-only 缺省回退 icon-sm 方形尺寸
    expect(button.className).toContain('size-8');
  });

  it('带 label 渲染文字且默认 size=sm', () => {
    render(<ActionButton icon={<SaveIcon />} label="保存" />);
    const button = screen.getByRole('button', { name: '保存' });
    expect(button.className).toContain('h-8');
  });

  it('tooltip：悬浮显示提示浮层', async () => {
    const user = userEvent.setup();
    render(
      <ActionButton icon={<SaveIcon />} aria-label="保存" tooltip="保存更改" />,
    );
    await user.hover(screen.getByRole('button', { name: '保存' }));
    const content = (await screen.findByText('保存更改')).closest(
      '[data-slot="tooltip-content"]',
    );
    expect(content).not.toBeNull();
  });
});

describe('SplitButton 分体式按钮', () => {
  const options = [
    { value: 'save-draft', label: '存为草稿' },
    { value: 'save-copy', label: '另存副本' },
  ];

  it('主操作与备选操作分离：点击主按钮只触发 onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSelect = vi.fn();
    render(
      <SplitButton options={options} onClick={onClick} onSelect={onSelect}>
        保存
      </SplitButton>,
    );
    await user.click(screen.getByRole('button', { name: '保存' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('选择备选操作：onSelect 以语义值调用且菜单关闭', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SplitButton options={options} onSelect={onSelect}>
        保存
      </SplitButton>,
    );
    await user.click(screen.getByRole('button', { name: '更多选项' }));
    await user.click(await screen.findByText('存为草稿'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('save-draft');
    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeNull();
    });
  });

  it('整体禁用：主按钮与下拉触发按钮均不可交互', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SplitButton options={options} onClick={onClick} disabled>
        保存
      </SplitButton>,
    );
    const main = screen.getByRole('button', { name: '保存' });
    const trigger = screen.getByRole('button', { name: '更多选项' });
    expect((main as HTMLButtonElement).disabled).toBe(true);
    expect((trigger as HTMLButtonElement).disabled).toBe(true);
    await user.click(main);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('相连表面：下拉触发钮并入去圆角与边框重叠规则（左侧不显圆角）', () => {
    const { container } = render(
      <SplitButton options={options}>保存</SplitButton>,
    );
    const group = container.querySelector('[data-slot="split-button"]');
    expect(group).not.toBeNull();
    // 触发钮 data-slot 为 dropdown-menu-trigger（非 button），
    // 需同按钮规则并入 ButtonGroup 相连表面，否则保留四角 rounded-md
    const cls = group!.className;
    expect(cls).toContain('[&>[data-slot=dropdown-menu-trigger]]:rounded-none');
    expect(cls).toContain('[&>[data-slot=dropdown-menu-trigger]]:last:rounded-r-md');
    expect(cls).toContain('[&>[data-slot=dropdown-menu-trigger]:not(:first-child)]:-ml-px');
  });
});

describe('CopyButton 复制确认按钮', () => {
  function mockClipboard(writeText: ReturnType<typeof vi.fn>) {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
  }

  it('复制成功反馈并还原：copied 态（check 图标）→ resetDelay 后还原', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    const onCopy = vi.fn();
    render(
      <CopyButton value="hello" label="复制" copiedLabel="已复制" onCopy={onCopy} />,
    );
    const button = screen.getByRole('button', { name: '复制' });
    expect(button.dataset.state).toBe('idle');

    await user.click(button);
    await act(async () => {});
    expect(writeText).toHaveBeenCalledWith('hello');
    expect(onCopy).toHaveBeenCalledWith('hello');
    expect(button.dataset.state).toBe('copied');
    // copied 态：check 图标层激活 + copiedLabel
    const active = button.querySelector('svg[data-state="active"]');
    expect(active?.getAttribute('class')).toContain('lucide-check');
    expect(screen.getByText('已复制')).toBeDefined();

    // 默认 resetDelay=1500ms 后还原
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(button.dataset.state).toBe('idle');
    const restored = button.querySelector('svg[data-state="active"]');
    expect(restored?.getAttribute('class')).toContain('lucide-copy');
  });

  it('剪贴板写入失败：保持初始态且 onError 被调用', async () => {
    const user = userEvent.setup();
    const error = new Error('denied');
    const writeText = vi.fn().mockRejectedValue(error);
    mockClipboard(writeText);
    const onError = vi.fn();
    const onCopy = vi.fn();
    render(<CopyButton value="v" label="复制" onError={onError} onCopy={onCopy} />);
    const button = screen.getByRole('button', { name: '复制' });
    await user.click(button);
    await act(async () => {});
    expect(onError).toHaveBeenCalledWith(error);
    expect(onCopy).not.toHaveBeenCalled();
    expect(button.dataset.state).toBe('idle');
  });

  it('剪贴板不可用（非安全上下文）：onError 被调用且不进 copied 态', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });
    const onError = vi.fn();
    render(<CopyButton value="v" label="复制" onError={onError} />);
    const button = screen.getByRole('button', { name: '复制' });
    await user.click(button);
    await act(async () => {});
    expect(onError).toHaveBeenCalledTimes(1);
    expect(button.dataset.state).toBe('idle');
  });
});

describe('IconMorph 图标形变', () => {
  it('受控状态切换：menu → close（同一挂载点内过渡）', () => {
    const { container, rerender } = render(
      <IconMorph morph="menu-close" state="a" />,
    );
    const root = container.querySelector<HTMLElement>(
      '[data-slot="icon-morph"]',
    )!;
    expect(root.dataset.state).toBe('a');
    let active = root.querySelector('svg[data-state="active"]')!;
    expect(active.getAttribute('class')).toContain('lucide-menu');
    // 双图层堆叠 + 过渡类
    expect(root.querySelectorAll('svg')).toHaveLength(2);
    expect(active.getAttribute('class')).toContain('transition-all');
    expect(active.getAttribute('class')).toContain(
      'motion-reduce:transition-none',
    );

    rerender(<IconMorph morph="menu-close" state="b" />);
    active = root.querySelector('svg[data-state="active"]')!;
    expect(active.getAttribute('class')).toContain('lucide-x');
    // 同一挂载点：未卸载重建
    expect(container.querySelector('[data-slot="icon-morph"]')).toBe(root);
  });

  it('未知名对渲染占位图标并 dev 告警，不抛错', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<IconMorph morph="no-such-pair" state="a" />);
    const root = container.querySelector<HTMLElement>(
      '[data-slot="icon-morph"]',
    )!;
    expect(root.dataset.unknown).toBe('no-such-pair');
    expect(root.querySelector('svg')).not.toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe('FloatingButtonGroup 托盘式按钮组', () => {
  it('选择抛出语义值：点击 value=grid 的按钮', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <FloatingButtonGroup options={FLOATING_OPTIONS} onSelect={onSelect} />,
    );
    await user.click(screen.getByRole('button', { name: '网格' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('grid');
  });

  it('共享高亮块存在且带滑动过渡类', () => {
    const { container } = render(
      <FloatingButtonGroup options={FLOATING_OPTIONS} />,
    );
    const highlight = container.querySelector(
      '[data-slot="floating-button-group-highlight"]',
    )!;
    expect(highlight).not.toBeNull();
    expect(highlight.className).toContain('transition-[transform,width,opacity]');
  });

  it('高亮跟随指针：从按钮 A 滑到按钮 B（同一节点移动而非重建）', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FloatingButtonGroup options={FLOATING_OPTIONS} />,
    );
    const [btnA, btnB] = screen.getAllByRole('button');
    // jsdom 无布局：实例级 offset 桩模拟测量值
    for (const [el, x] of [
      [btnA, 4],
      [btnB, 84],
    ] as const) {
      Object.defineProperty(el, 'offsetLeft', { value: x, configurable: true });
      Object.defineProperty(el, 'offsetWidth', { value: 72, configurable: true });
    }
    const highlight = container.querySelector(
      '[data-slot="floating-button-group-highlight"]',
    ) as HTMLElement;

    await user.hover(btnA);
    expect(highlight.style.transform).toBe('translateX(4px)');
    expect(highlight.style.width).toBe('72px');
    expect(highlight.className).toContain('opacity-100');

    await user.hover(btnB);
    // 同一高亮节点移动，而非消失重建
    expect(
      container.querySelector('[data-slot="floating-button-group-highlight"]'),
    ).toBe(highlight);
    expect(highlight.style.transform).toBe('translateX(84px)');

    await user.unhover(btnB);
    expect(highlight.className).toContain('opacity-0');
  });

  it('受控 value：高亮恒定位于该项（0 尺寸测量防御不抛错）', () => {
    const { container } = render(
      <FloatingButtonGroup options={FLOATING_OPTIONS} value="grid" />,
    );
    // jsdom 下 offsetWidth=0 → 防御路径：节点存在但隐藏，不抛错
    const highlight = container.querySelector(
      '[data-slot="floating-button-group-highlight"]',
    ) as HTMLElement;
    expect(highlight).not.toBeNull();
    expect(highlight.className).toContain('opacity-0');
    const active = container.querySelector('[data-value="grid"]')!;
    expect(active.hasAttribute('data-active')).toBe(true);
  });
});

describe('ExpandingButtonGroup 展开式按钮组', () => {
  const options = [
    { value: 'edit', label: '编辑', icon: <SaveIcon /> },
    { value: 'delete', label: '删除', icon: <TrashIcon />, confirm: true },
  ];

  it('悬停展开 label（0fr → 1fr 过渡），移出收起', async () => {
    const user = userEvent.setup();
    render(<ExpandingButtonGroup options={options} />);
    const edit = screen.getByRole('button', { name: '编辑' });
    const grid = () =>
      edit.querySelector('.grid') as HTMLElement;

    expect(edit.hasAttribute('data-expanded')).toBe(false);
    expect(grid().style.gridTemplateColumns).toBe('0fr');

    await user.hover(edit);
    expect(edit.hasAttribute('data-expanded')).toBe(true);
    expect(grid().style.gridTemplateColumns).toBe('1fr');
    // 相邻按钮保持图标态
    const del = screen.getByRole('button', { name: '删除' });
    expect(del.hasAttribute('data-expanded')).toBe(false);

    await user.unhover(edit);
    expect(edit.hasAttribute('data-expanded')).toBe(false);
  });

  it('无 confirm 选项：单次点击即抛出语义值', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ExpandingButtonGroup options={options} onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: '编辑' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('edit');
  });

  it('confirm 选项：先进入确认态，再点击确认，onSelect 恰好一次', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ExpandingButtonGroup options={options} onSelect={onSelect} />);
    const del = screen.getByRole('button', { name: '删除' });

    await user.click(del);
    expect(del.hasAttribute('data-confirming')).toBe(true);
    expect(onSelect).not.toHaveBeenCalled();

    await user.click(del);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('delete');
    expect(del.hasAttribute('data-confirming')).toBe(false);
  });
});

describe('ConfirmMorph 内联确认按钮', () => {
  it('完整确认流程：confirming → pending → success，onConfirm 恰好一次', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup();
    // 可手动 resolve 的 Promise，确保 pending 段可被观测
    let resolveConfirm!: () => void;
    const onConfirm = vi.fn(
      () => new Promise<void>((resolve) => (resolveConfirm = resolve)),
    );
    const states: string[] = [];
    render(
      <ConfirmMorph
        label="删除"
        onConfirm={onConfirm}
        onStateChange={(s) => states.push(s)}
      />,
    );
    const button = screen.getByRole('button', { name: '删除' });
    expect(button.dataset.state).toBe('idle');

    await user.click(button);
    expect(button.dataset.state).toBe('confirming');

    await user.click(screen.getByRole('button', { name: '确认' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(button.dataset.state).toBe('pending');

    await act(async () => {
      resolveConfirm();
    });
    expect(button.dataset.state).toBe('success');
    expect(states).toEqual(['confirming', 'pending', 'success']);

    // success 段停留后自动回 idle
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(button.dataset.state).toBe('idle');
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('确认超时回退：confirmTimeout 内未确认自动回 idle', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmMorph label="删除" confirmTimeout={2000} onConfirm={onConfirm} />,
    );
    const button = screen.getByRole('button', { name: '删除' });
    await user.click(button);
    expect(button.dataset.state).toBe('confirming');

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(button.dataset.state).toBe('idle');
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('失败后撤销：reject 进入 error，点击 undo 回 idle 并触发 onUndo', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockRejectedValue(new Error('fail'));
    const onUndo = vi.fn();
    render(<ConfirmMorph label="删除" onConfirm={onConfirm} onUndo={onUndo} />);
    const button = screen.getByRole('button', { name: '删除' });

    await user.click(button);
    await user.click(screen.getByRole('button', { name: '确认' }));
    await act(async () => {});
    expect(button.dataset.state).toBe('error');

    await user.click(screen.getByRole('button', { name: '撤销' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(button.dataset.state).toBe('idle');
  });

  it('各段内容同格堆叠：非激活段 opacity-0，尺寸由最宽段决定', () => {
    render(<ConfirmMorph label="删除" />);
    const segments = document.querySelectorAll('[data-segment]');
    expect(segments.length).toBe(5);
    for (const segment of segments) {
      expect(segment.className).toContain('col-start-1');
      expect(segment.className).toContain('row-start-1');
    }
    const idle = document.querySelector('[data-segment="idle"]')!;
    const confirming = document.querySelector('[data-segment="confirming"]')!;
    expect(idle.className).toContain('opacity-100');
    expect(confirming.className).toContain('opacity-0');
  });
});
