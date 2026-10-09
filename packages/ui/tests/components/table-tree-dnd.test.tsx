// @vitest-environment jsdom
import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  flattenRows,
  moveRow,
  sortTreeRows,
} from '../../src/components/components/Table/row-dnd.js';
import { renderDsl } from './helpers.js';

const TREE_DATA = [
  {
    id: 1,
    name: '系统管理',
    children: [
      { id: 11, name: '菜单管理' },
      {
        id: 12,
        name: '权限管理',
        children: [{ id: 121, name: '角色权限' }],
      },
    ],
  },
  { id: 2, name: '首页' },
];

const TREE_COLUMNS = [{ title: '名称', dataIndex: 'name' }];

function renderTable(props: Record<string, unknown>, events?: unknown) {
  return renderDsl({
    type: 'Table',
    props: { columns: TREE_COLUMNS, dataSource: TREE_DATA, ...props },
    ...(events ? { events: events as never } : {}),
  });
}

function rowTexts(container: HTMLElement): string[] {
  return [...container.querySelectorAll('tbody tr')].map(
    (tr) => tr.textContent ?? '',
  );
}

describe('row-dnd 纯函数', () => {
  const options = { rowKey: 'id', childrenField: 'children' as const };

  it('flattenRows：按展开集合拍平，携带 level/parentKey/hasChildren', () => {
    const collapsed = flattenRows(TREE_DATA, new Set(), options);
    expect(collapsed.map((f) => f.key)).toEqual([1, 2]);
    expect(collapsed[0]).toMatchObject({
      level: 0,
      parentKey: null,
      hasChildren: true,
    });
    expect(collapsed[1].hasChildren).toBe(false);

    const expanded = flattenRows(TREE_DATA, new Set([1, 12]), options);
    expect(expanded.map((f) => f.key)).toEqual([1, 11, 12, 121, 2]);
    expect(expanded[3]).toMatchObject({ level: 2, parentKey: 12 });
  });

  it('flattenRows：rowKey 缺失时回退路径键，childrenField=false 视为平铺', () => {
    const rows = [{ name: 'a', children: [{ name: 'b' }] }];
    const flat = flattenRows(rows, new Set(['0']), {
      rowKey: 'id',
      childrenField: 'children',
    });
    expect(flat.map((f) => f.key)).toEqual(['0', '0-0']);

    const plain = flattenRows(rows, new Set(['0']), {
      rowKey: 'id',
      childrenField: false,
    });
    expect(plain).toHaveLength(1);
    expect(plain[0].hasChildren).toBe(false);
  });

  it('sortTreeRows：每层内部排序，层级结构不变', () => {
    const data = [
      { id: 1, name: 'b', children: [{ id: 12, name: 'y' }, { id: 11, name: 'x' }] },
      { id: 2, name: 'a' },
    ];
    const asc = sortTreeRows(data, 'name', 'ascend', 'children');
    expect(asc.map((r) => r.name)).toEqual(['a', 'b']);
    expect(
      (asc[1].children as { name: string }[]).map((r) => r.name),
    ).toEqual(['x', 'y']);
  });

  it('moveRow：同级 before/after；跨父级由组件拦截，函数本身按键移动', () => {
    const before = moveRow(TREE_DATA, 2, 1, 'before', options)!;
    expect(before.map((r) => r.id)).toEqual([2, 1]);

    const after = moveRow(TREE_DATA, 1, 2, 'after', options)!;
    expect(after.map((r) => r.id)).toEqual([2, 1]);

    // 子级内排序
    const child = moveRow(TREE_DATA, 12, 11, 'before', options)!;
    const parent = child[0].children as { id: number }[];
    expect(parent.map((r) => r.id)).toEqual([12, 11]);

    expect(moveRow(TREE_DATA, 1, 1, 'before', options)).toBeNull();
    expect(moveRow(TREE_DATA, 99, 1, 'before', options)).toBeNull();
  });

  it('moveRow：不改动传入数组（不可变）', () => {
    const snapshot = JSON.stringify(TREE_DATA);
    moveRow(TREE_DATA, 2, 1, 'before', { rowKey: 'id', childrenField: 'children' });
    expect(JSON.stringify(TREE_DATA)).toBe(snapshot);
  });
});

describe('树形表格', () => {
  it('数据含 children 时自动树形：默认收起，点击箭头展开子级', () => {
    const { container } = renderTable({});
    // 默认仅顶层两行
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
    const expand = container.querySelector('[data-slot=table-expand]')!;
    expect(expand.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(expand);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(4);
    expect(rowTexts(container).join('')).toContain('菜单管理');

    // 展开第二层
    const expands = container.querySelectorAll('[data-slot=table-expand]');
    fireEvent.click(expands[1]);
    expect(rowTexts(container).join('')).toContain('角色权限');
  });

  it('defaultExpandAllRows：初始展开所有层级，仍可点击收起', () => {
    const { container } = renderTable({ defaultExpandAllRows: true });
    expect(container.querySelectorAll('tbody tr')).toHaveLength(5);
    expect(rowTexts(container).join('')).toContain('角色权限');
    expect(
      container
        .querySelector('[data-slot=table-expand]')!
        .getAttribute('aria-expanded'),
    ).toBe('true');

    fireEvent.click(container.querySelector('[data-slot=table-expand]')!);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('层级缩进：paddingLeft = level × indentSize，可配置', () => {
    const { container } = renderTable({ indentSize: 24 });
    fireEvent.click(container.querySelector('[data-slot=table-expand]')!);

    const wrappers = container.querySelectorAll('tbody tr td:first-child > div');
    expect((wrappers[0] as HTMLElement).style.paddingLeft).toBe('0px');
    expect((wrappers[1] as HTMLElement).style.paddingLeft).toBe('24px');
  });

  it('childrenColumnName 配置其他字段；false 禁用树形', () => {
    const custom = renderTable({
      childrenColumnName: 'sub',
      dataSource: [{ id: 1, name: '父', sub: [{ id: 2, name: '子' }] }],
    });
    expect(
      custom.container.querySelector('[data-slot=table-expand]'),
    ).not.toBeNull();

    const disabled = renderTable({ childrenColumnName: false });
    expect(disabled.container.querySelector('[data-slot=table-expand]')).toBeNull();
    expect(disabled.container.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('无 children 的平铺数据不渲染缩进与展开占位', () => {
    const { container } = renderTable({
      dataSource: [
        { id: 1, name: '甲' },
        { id: 2, name: '乙' },
      ],
    });
    expect(container.querySelector('[data-slot=table-expand]')).toBeNull();
    expect(container.querySelector('tbody tr td:first-child > div')).toBeNull();
  });

  it('树形数据排序按层递归：子级在父级内排序', () => {
    const { container } = renderTable({
      columns: [{ title: '名称', dataIndex: 'name', sorter: true }],
    });
    fireEvent.click(container.querySelector('[data-slot=table-sorter]')!);
    // 顶层：首页 < 系统管理（中文按本地化排序）
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
    fireEvent.click(container.querySelector('[data-slot=table-expand]')!);
    const texts = rowTexts(container);
    const menuIdx = texts.findIndex((t) => t.includes('菜单管理'));
    const permIdx = texts.findIndex((t) => t.includes('权限管理'));
    expect(menuIdx).toBeLessThan(permIdx);
  });
});

describe('行拖拽排序', () => {
  function makeDataTransfer() {
    return { effectAllowed: '', dropEffect: '', setData: vi.fn(), getData: vi.fn() };
  }

  /** jsdom 无 DragEvent/DataTransfer：构造原生 Event 并挂载 dataTransfer/clientY */
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

  function mockRect(el: HTMLElement) {
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 40,
      height: 40,
      left: 0,
      right: 200,
      width: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
  }

  it('rowDraggable 时渲染拖拽手柄列；关闭则无', () => {
    const { container } = renderTable({ rowDraggable: true });
    expect(container.querySelectorAll('[data-slot=table-drag-handle]')).toHaveLength(2);
    expect(container.querySelector('[data-slot=table-drag-head]')).not.toBeNull();

    const plain = renderTable({});
    expect(plain.container.querySelector('[data-slot=table-drag-handle]')).toBeNull();
  });

  it('拖到目标上半部：before 排序并触发 onRowDrop', async () => {
    const { context, container } = renderTable(
      {
        rowDraggable: true,
        dataSource: [
          { id: 1, name: '甲' },
          { id: 2, name: '乙' },
          { id: 3, name: '丙' },
        ],
      },
      { onRowDrop: { action: 'setState', params: { drop: '${event}' } } },
    );
    const dt = makeDataTransfer();
    const handles = container.querySelectorAll('[data-slot=table-drag-handle]');
    const targetRow = container.querySelectorAll('tbody tr')[0] as HTMLElement;
    mockRect(targetRow);

    fireDrag('dragstart', handles[2] as HTMLElement, dt);
    fireDrag('dragover', targetRow, dt, 5);
    fireDrag('drop', targetRow, dt, 5);

    await vi.waitFor(() => {
      expect(context.state.get('drop')).toEqual({
        dragKey: 3,
        dropKey: 1,
        position: 'before',
      });
    });
    expect(rowTexts(container)[0]).toContain('丙');
  });

  it('拖到目标下半部：after 排序', () => {
    const { container } = renderTable({
      rowDraggable: true,
      dataSource: [
        { id: 1, name: '甲' },
        { id: 2, name: '乙' },
      ],
    });
    const dt = makeDataTransfer();
    const handles = container.querySelectorAll('[data-slot=table-drag-handle]');
    const targetRow = container.querySelectorAll('tbody tr')[1] as HTMLElement;
    mockRect(targetRow);

    fireDrag('dragstart', handles[0] as HTMLElement, dt);
    fireDrag('dragover', targetRow, dt, 35);
    fireDrag('drop', targetRow, dt, 35);

    expect(rowTexts(container)[1]).toContain('甲');
  });

  it('树形数据：跨父级拖动被拦截（无落点、不重排）', async () => {
    const { context, container } = renderTable(
      { rowDraggable: true },
      { onRowDrop: { action: 'setState', params: { drop: '${event}' } } },
    );
    // 展开第一层，得到子级行
    fireEvent.click(container.querySelector('[data-slot=table-expand]')!);
    const rows = container.querySelectorAll('tbody tr');
    const topRow = rows[3] as HTMLElement; // 顶层「首页」（展开后顺序：系统管理/菜单/权限/首页）
    const handles = container.querySelectorAll('[data-slot=table-drag-handle]');
    mockRect(topRow);

    const dt = makeDataTransfer();
    // 子级「菜单管理」拖到顶层「首页」：parentKey 不同，不允许
    fireDrag('dragstart', handles[1] as HTMLElement, dt);
    fireDrag('dragover', topRow, dt, 5);
    fireDrag('drop', topRow, dt, 5);

    expect(context.state.get('drop')).toBeUndefined();
    expect(rowTexts(container)[0]).toContain('系统管理');
  });
});

describe('固定表头（scrollY）', () => {
  it('设置 scrollY 后：容器限高纵向滚动，表头 sticky 固定', () => {
    const { container } = renderTable({ scrollY: 200 });
    const scrollRoot = container.querySelector(
      '[data-slot=table-container]',
    ) as HTMLElement;
    expect(scrollRoot.style.maxHeight).toBe('200px');
    expect(scrollRoot.className).toContain('overflow-y-auto');

    const heads = container.querySelectorAll('thead th');
    expect(heads[0].className).toContain('sticky');
    expect(heads[0].className).toContain('top-0');
  });

  it('未设置 scrollY 时：容器不限高，表头不固定', () => {
    const { container } = renderTable({});
    const scrollRoot = container.querySelector(
      '[data-slot=table-container]',
    ) as HTMLElement;
    expect(scrollRoot.style.maxHeight).toBe('');
    expect(scrollRoot.className).not.toContain('overflow-y-auto');
    expect(container.querySelector('thead th')!.className).not.toContain('top-0');
  });

  it('fixed 列与固定表头叠加：表头 fixed 列层级更高', () => {
    const { container } = renderTable({
      scrollY: 200,
      columns: [
        { title: '名称', dataIndex: 'name' },
        { title: '操作', dataIndex: 'op', fixed: 'right' as const },
      ],
    });
    const heads = container.querySelectorAll('thead th');
    const fixedHead = heads[heads.length - 1];
    expect(fixedHead.className).toContain('sticky');
    expect(fixedHead.className).toContain('z-30');
  });
});
