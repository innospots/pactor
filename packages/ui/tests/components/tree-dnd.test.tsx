// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Tree, type TreeNodeData } from '../../src/components/components/Tree/index.js';
import {
  isWithinKey,
  moveTreeNode,
  removeTreeNode,
} from '../../src/components/components/Tree/dnd.js';

const DATA: TreeNodeData[] = [
  { key: 'home', title: '首页' },
  {
    key: 'system',
    title: '系统管理',
    children: [
      { key: 'menu', title: '菜单管理' },
      { key: 'role', title: '角色管理' },
    ],
  },
  { key: 'help', title: '帮助中心' },
];

describe('Tree dnd helpers', () => {
  it('before/after 同级排序', () => {
    const before = moveTreeNode(DATA, 'help', 'home', 'before')!;
    expect(before.map((n) => n.key)).toEqual(['help', 'home', 'system']);

    const after = moveTreeNode(DATA, 'home', 'system', 'after')!;
    expect(after.map((n) => n.key)).toEqual(['system', 'home', 'help']);
  });

  it('inside 移入为子级', () => {
    const next = moveTreeNode(DATA, 'help', 'system', 'inside')!;
    const system = next.find((n) => n.key === 'system')!;
    expect(system.children?.map((n) => n.key)).toEqual(['menu', 'role', 'help']);
    expect(next.map((n) => n.key)).toEqual(['home', 'system']);
  });

  it('拖到自身或自身后代返回 null', () => {
    expect(moveTreeNode(DATA, 'system', 'system', 'inside')).toBeNull();
    expect(moveTreeNode(DATA, 'system', 'menu', 'before')).toBeNull();
    expect(moveTreeNode(DATA, 'ghost', 'home', 'before')).toBeNull();
  });

  it('不改动传入数组（不可变）', () => {
    const snapshot = JSON.stringify(DATA);
    moveTreeNode(DATA, 'home', 'help', 'after');
    expect(JSON.stringify(DATA)).toBe(snapshot);
  });

  it('isWithinKey / removeTreeNode', () => {
    expect(isWithinKey(DATA, 'system', 'role')).toBe(true);
    expect(isWithinKey(DATA, 'system', 'help')).toBe(false);
    const [next, removed] = removeTreeNode(DATA, 'menu');
    expect(removed?.title).toBe('菜单管理');
    expect(
      next.find((n) => n.key === 'system')?.children?.map((n) => n.key),
    ).toEqual(['role']);
  });
});

function rowOf(container: HTMLElement, key: string): HTMLElement {
  return container.querySelector(`[data-key=${key}]`)!.firstElementChild as HTMLElement;
}

function handleOf(container: HTMLElement, key: string): HTMLElement {
  return rowOf(container, key).querySelector('[data-slot=tree-drag-handle]') as HTMLElement;
}

function titles(container: HTMLElement): string[] {
  return [...container.querySelectorAll('[data-slot=tree-node-title]')].map(
    (el) => el.textContent ?? '',
  );
}

function mockRect(el: HTMLElement) {
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    top: 0,
    bottom: 30,
    height: 30,
    left: 0,
    right: 200,
    width: 200,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
}

function makeDataTransfer() {
  return {
    effectAllowed: '',
    dropEffect: '',
    setData: vi.fn(),
    getData: vi.fn(),
  };
}

/**
 * jsdom 无 DragEvent/DataTransfer，且 RTL fireEvent.dragXxx 经 init 传 clientY
 * 会被忽略（plain Event 回退）；直接构造原生 Event 并显式挂载
 * dataTransfer / clientY（type 必须小写，React 按原生事件名代理监听）
 */
function fireDrag(
  type: 'dragstart' | 'dragover' | 'drop',
  el: HTMLElement,
  dt: ReturnType<typeof makeDataTransfer>,
  clientY = 0,
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', { value: dt });
  Object.defineProperty(event, 'clientY', { value: clientY });
  fireEvent(el, event);
}

describe('Tree 拖拽调整位置', () => {
  it('draggable 时行左侧显示拖拽手柄，仅手柄可拖', () => {
    const { container } = render(
      <Tree treeData={DATA} draggable defaultExpandedKeys={['system']} />,
    );
    const row = rowOf(container, 'home');
    // 行本身不可拖、不带抓手光标
    expect(row.getAttribute('draggable')).toBe('false');
    expect(row.className).not.toContain('cursor-move');
    // hover 手柄：draggable + 抓手光标
    const handle = row.querySelector('[data-slot=tree-drag-handle]')!;
    expect(handle.getAttribute('draggable')).toBe('true');
    expect(handle.className).toContain('cursor-move');
    expect(handle.className).toContain('group-hover:opacity-100');
  });

  it('非 draggable 时行为不变（不可拖）', () => {
    const { container } = render(<Tree treeData={DATA} />);
    expect(rowOf(container, 'home').getAttribute('draggable')).toBe('false');
  });

  it('拖到目标上边缘：同级 before 排序并触发 onDrop', () => {
    const onDrop = vi.fn();
    const { container } = render(
      <Tree treeData={DATA} draggable defaultExpandedKeys={['system']} onDrop={onDrop} />,
    );
    const dt = makeDataTransfer();
    const target = rowOf(container, 'home');
    mockRect(target);

    fireDrag('dragstart', handleOf(container, 'help'), dt);
    fireDrag('dragover', target, dt, 3);
    fireDrag('drop', target, dt, 3);

    expect(onDrop).toHaveBeenCalledWith({
      dragKey: 'help',
      dropKey: 'home',
      position: 'before',
    });
    expect(titles(container)[0]).toBe('帮助中心');
  });

  it('拖到目标中部：inside 移入为子级', () => {
    const onDrop = vi.fn();
    const { container } = render(
      <Tree treeData={DATA} draggable defaultExpandedKeys={['system']} onDrop={onDrop} />,
    );
    const dt = makeDataTransfer();
    const target = rowOf(container, 'system');
    mockRect(target);

    fireDrag('dragstart', handleOf(container, 'help'), dt);
    fireDrag('dragover', target, dt, 15);
    fireDrag('drop', target, dt, 15);

    expect(onDrop).toHaveBeenCalledWith({
      dragKey: 'help',
      dropKey: 'system',
      position: 'inside',
    });
    // 帮助中心移入系统管理下（展开态可见于其子级之后）
    expect(titles(container)).toEqual([
      '首页',
      '系统管理',
      '菜单管理',
      '角色管理',
      '帮助中心',
    ]);
  });

  it('拖到自身后代被拒绝：不触发 onDrop、结构不变', () => {
    const onDrop = vi.fn();
    const { container } = render(
      <Tree treeData={DATA} draggable defaultExpandedKeys={['system']} onDrop={onDrop} />,
    );
    const dt = makeDataTransfer();
    const target = rowOf(container, 'menu');
    mockRect(target);
    const before = titles(container);

    fireDrag('dragstart', handleOf(container, 'system'), dt);
    fireDrag('dragover', target, dt, 15);
    fireDrag('drop', target, dt, 15);

    expect(onDrop).not.toHaveBeenCalled();
    expect(titles(container)).toEqual(before);
  });
});

const ACTIONS = [
  { value: 'addChild', icon: 'plus', label: '新建子级' },
  { value: 'delete', icon: 'trash', label: '删除', danger: true },
];

describe('Tree 行级操作（右端图标按钮 / 下拉）', () => {
  it('节点 actions 以 inline 图标按钮渲染，点击触发 onNodeAction 且不选中节点', () => {
    const onNodeAction = vi.fn();
    const onSelect = vi.fn();
    const data: TreeNodeData[] = [
      { key: 'system', title: '系统管理', actions: ACTIONS },
    ];
    const { container } = render(
      <Tree treeData={data} onNodeAction={onNodeAction} onSelect={onSelect} />,
    );

    const buttons = container.querySelectorAll('[data-slot=tree-node-action]');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]!.getAttribute('data-value')).toBe('addChild');

    fireEvent.click(buttons[0]!);
    expect(onNodeAction).toHaveBeenCalledWith({ value: 'addChild', key: 'system' });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('Tree 级 nodeActions 作为缺省，节点 actions 优先', () => {
    const onNodeAction = vi.fn();
    const data: TreeNodeData[] = [
      { key: 'a', title: 'A' },
      { key: 'b', title: 'B', actions: [{ value: 'edit', icon: 'settings', label: '编辑' }] },
    ];
    const { container } = render(
      <Tree treeData={data} nodeActions={ACTIONS} onNodeAction={onNodeAction} />,
    );

    // A 行：Tree 级 2 个；B 行：节点级 1 个
    expect(
      container.querySelector('[data-key=a]')!.querySelectorAll('[data-slot=tree-node-action]'),
    ).toHaveLength(2);
    const bButtons = container
      .querySelector('[data-key=b]')!
      .querySelectorAll('[data-slot=tree-node-action]');
    expect(bButtons).toHaveLength(1);

    fireEvent.click(bButtons[0]!);
    expect(onNodeAction).toHaveBeenCalledWith({ value: 'edit', key: 'b' });
  });

  it('nodeActionDisplay: dropdown 时收进 ⋯ 菜单，菜单项点击触发 onNodeAction', async () => {
    const onNodeAction = vi.fn();
    const data: TreeNodeData[] = [
      { key: 'system', title: '系统管理', actions: ACTIONS },
    ];
    const { container } = render(
      <Tree
        treeData={data}
        nodeActionDisplay="dropdown"
        onNodeAction={onNodeAction}
      />,
    );

    // inline 按钮不渲染，仅 ⋯ 触发器
    expect(container.querySelectorAll('[data-slot=tree-node-action]')).toHaveLength(0);
    const trigger = screen.getByRole('button', { name: '节点操作' });
    fireEvent.click(trigger);

    const item = await screen.findByText('删除');
    fireEvent.click(item);
    expect(onNodeAction).toHaveBeenCalledWith({ value: 'delete', key: 'system' });
  });

  it('disabled 的动作不可点击', () => {
    const onNodeAction = vi.fn();
    const data: TreeNodeData[] = [
      {
        key: 'system',
        title: '系统管理',
        actions: [{ value: 'delete', icon: 'trash', label: '删除', disabled: true }],
      },
    ];
    const { container } = render(
      <Tree treeData={data} onNodeAction={onNodeAction} />,
    );
    const button = container.querySelector('[data-slot=tree-node-action]')!;
    expect((button as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(button);
    expect(onNodeAction).not.toHaveBeenCalled();
  });
});

const OP_ACTIONS = [
  { value: 'addSibling', icon: 'plus', label: '同级', op: 'addSibling' as const },
  { value: 'addChild', icon: 'plus', label: '子级', op: 'addChild' as const },
  {
    value: 'delete',
    icon: 'trash',
    label: '删除',
    danger: true,
    op: 'delete' as const,
    separatorBefore: true,
  },
];

describe('Tree 行级操作 op 静态编辑（外部传入）', () => {
  function openMenuAndClick(container: HTMLElement, key: string, itemText: string) {
    const row = rowOf(container, key);
    fireEvent.click(
      row.querySelector('[data-slot=tree-node-actions] button')!,
    );
    const items = screen.getAllByText(itemText);
    fireEvent.click(items[items.length - 1]!);
  }

  const EDIT_DATA: TreeNodeData[] = [
    { key: 'home', title: '首页' },
    {
      key: 'system',
      title: '系统管理',
      children: [{ key: 'menu', title: '菜单管理' }],
    },
  ];

  function renderOp(onNodeAction?: (info: unknown) => void) {
    return render(
      <Tree
        treeData={EDIT_DATA}
        nodeActions={OP_ACTIONS}
        nodeActionDisplay="dropdown"
        defaultExpandedKeys={['system']}
        defaultSelectedKeys={['system']}
        onNodeAction={onNodeAction}
      />,
    );
  }

  it('op: addChild 追加「新节点」并自动展开，onNodeAction 按外部 value 传出且带 newKey', () => {
    const onNodeAction = vi.fn();
    const { container } = renderOp(onNodeAction);
    openMenuAndClick(container, 'system', '子级');

    const info = onNodeAction.mock.calls[0]![0];
    expect(info).toMatchObject({ value: 'addChild', key: 'system' });
    expect(info.newKey).toBeTruthy();
    expect(screen.getAllByText('新节点')).toHaveLength(1);
  });

  it('op: addSibling 插入到目标之后', () => {
    const onNodeAction = vi.fn();
    const { container } = renderOp(onNodeAction);
    openMenuAndClick(container, 'home', '同级');

    expect(titles(container)[1]).toBe('新节点');
    expect(onNodeAction.mock.calls[0]![0]).toMatchObject({
      value: 'addSibling',
      key: 'home',
    });
  });

  it('op: delete 连带子树移除并清理选中态', () => {
    const onNodeAction = vi.fn();
    const { container } = renderOp(onNodeAction);
    expect(titles(container)).toContain('菜单管理');
    openMenuAndClick(container, 'system', '删除');

    expect(titles(container)).toEqual(['首页']);
    expect(onNodeAction).toHaveBeenCalledWith({ value: 'delete', key: 'system' });
    expect(
      container.querySelector('[data-key=home] > div')!.className,
    ).not.toContain('font-medium');
  });

  it('无 op 的动作只传事件不改树', () => {
    const onNodeAction = vi.fn();
    const { container } = render(
      <Tree
        treeData={EDIT_DATA}
        nodeActions={[{ value: 'rename', label: '重命名' }]}
        nodeActionDisplay="dropdown"
        onNodeAction={onNodeAction}
      />,
    );
    openMenuAndClick(container, 'home', '重命名');
    expect(onNodeAction).toHaveBeenCalledWith({ value: 'rename', key: 'home' });
    // 未传 defaultExpandedKeys，系统管理收起：仅顶层两行且结构未变
    expect(titles(container)).toEqual(['首页', '系统管理']);
  });

  it('separatorBefore 在菜单项前渲染分隔线', async () => {
    const { container } = renderOp();
    const row = rowOf(container, 'home');
    fireEvent.click(row.querySelector('[data-slot=tree-node-actions] button')!);
    const item = await screen.findByText('删除');
    const menu = item.closest('[role=menu]')!;
    expect(menu.querySelectorAll('[role=separator]').length).toBeGreaterThan(0);
  });
});
