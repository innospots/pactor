// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderDsl } from './helpers.js';

const DATA = [
  { id: 1, name: '张三', age: 28 },
  { id: 2, name: '李四', age: 32 },
];

const COLUMNS = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' },
];

function renderTable(props: Record<string, unknown>, events?: unknown) {
  return renderDsl({
    type: 'Table',
    props: { columns: COLUMNS, dataSource: DATA, ...props },
    ...(events ? { events: events as never } : {}),
  });
}

describe('列定义与数据绑定', () => {
  it('两条记录两列：渲染两行，单元格为 record[dataIndex] 的值', () => {
    const { container } = renderTable({});

    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(2);
    expect(screen.getByText('张三')).toBeTruthy();
    expect(screen.getByText('32')).toBeTruthy();
  });

  it('空数据渲染空态而非报错', () => {
    const { container } = renderTable({ dataSource: [] });

    expect(container.querySelector('[data-slot=table-empty]')).not.toBeNull();
  });

  it('列 align/fixed：表头与单元格同时应用对齐与 sticky 固定类', () => {
    const { container } = renderTable({
      columns: [
        { title: '姓名', dataIndex: 'name' },
        { title: '操作', dataIndex: 'age', align: 'center', fixed: 'right', width: 200 },
      ],
    });

    const heads = container.querySelectorAll('thead th');
    const opHead = heads[heads.length - 1];
    expect(opHead.className).toContain('text-center');
    expect(opHead.className).toContain('sticky');
    expect(opHead.className).toContain('right-0');

    const firstRowCells = container.querySelectorAll('tbody tr:first-child td');
    const opCell = firstRowCells[firstRowCells.length - 1];
    expect(opCell.className).toContain('text-center');
    expect(opCell.className).toContain('sticky');
    expect(opCell.className).toContain('right-0');

    // 未声明 align/fixed 的列不带这些类
    expect(heads[0].className).not.toContain('sticky');
    expect(firstRowCells[0].className).not.toContain('sticky');
  });

  it('fixed 右列默认无阴影；横向滚动后出现左阴影，回滚到最左消失', () => {
    const { container } = renderTable({
      columns: [
        { title: '姓名', dataIndex: 'name' },
        { title: '操作', dataIndex: 'age', align: 'center', fixed: 'right' },
      ],
    });
    const opCell = () =>
      container.querySelector('tbody tr:first-child td:last-child') as HTMLElement;

    expect(opCell().className).not.toContain('shadow-[inset_10px_0_8px_-8px_var(--shadow-color)');

    const scrollRoot = container.querySelector('[data-slot=table-container]')!;
    fireEvent.scroll(scrollRoot, { target: { scrollLeft: 120 } });
    expect(opCell().className).toContain('shadow-[inset_10px_0_8px_-8px_var(--shadow-color)');

    fireEvent.scroll(scrollRoot, { target: { scrollLeft: 0 } });
    expect(opCell().className).not.toContain('shadow-[inset_10px_0_8px_-8px_var(--shadow-color)');
  });
});

describe('cell 行模板', () => {
  it('cell 模板经子作用域访问 row：点击第二行按钮写入该行 id', async () => {
    const { context } = renderDsl({
      type: 'Table',
      props: {
        dataSource: DATA,
        columns: [
          { title: '姓名', dataIndex: 'name' },
          {
            title: '操作',
            cell: {
              type: 'Button',
              props: { text: '编辑' },
              events: {
                onClick: {
                  action: 'setState',
                  params: { editing: '${row.id}' },
                },
              },
            },
          },
        ],
      },
    });

    const buttons = screen.getAllByRole('button', { name: '编辑' });
    expect(buttons).toHaveLength(2);
    fireEvent.click(buttons[1]!);

    await vi.waitFor(() => {
      expect(context.state.get('editing')).toBe(2);
    });
  });

  it('cell 模板 props 引用 ${rowIndex}：第一行单元格中该值为 0', () => {
    renderDsl({
      type: 'Table',
      props: {
        dataSource: DATA,
        columns: [
          {
            title: '序号',
            cell: { type: 'Button', props: { text: '第 ${rowIndex} 行' } },
          },
        ],
      },
    });

    expect(screen.getByRole('button', { name: '第 0 行' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '第 1 行' })).toBeTruthy();
  });
});

describe('分页与加载态', () => {
  it('pageSize: 1 且两条记录：仅渲染第一行并出现分页器', () => {
    const { container } = renderTable({ pagination: { pageSize: 1 } });

    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(1);
    expect(screen.getByText('张三')).toBeTruthy();
    expect(screen.queryByText('李四')).toBeNull();
    expect(
      container.querySelector('[data-slot=table-pagination]'),
    ).not.toBeNull();
  });

  it('切换分页触发 onChange 并渲染对应页数据', async () => {
    const { context } = renderTable(
      { pagination: { pageSize: 1 } },
      {
        onChange: {
          action: 'setState',
          params: { page: '${event.current}' },
        },
      },
    );

    fireEvent.click(screen.getByRole('button', { name: '2' }));
    await vi.waitFor(() => {
      expect(context.state.get('page')).toBe(2);
    });
    expect(screen.getByText('李四')).toBeTruthy();
    expect(screen.queryByText('张三')).toBeNull();
  });

  it('pagination: false 不渲染分页器', () => {
    const { container } = renderTable({ pagination: false });

    expect(container.querySelector('[data-slot=table-pagination]')).toBeNull();
  });

  it('loading: true 展示加载态', () => {
    const { container } = renderTable({ loading: true });

    expect(container.querySelector('[data-slot=table-loading]')).not.toBeNull();
  });
});

describe('排序列', () => {
  const SORT_DATA = [
    { id: 1, name: '王五', members: 5, createdAt: '2026-08-30' },
    { id: 2, name: '张三', members: 12, createdAt: '2026-09-12' },
    { id: 3, name: '李四', members: 3, createdAt: '2026-09-08' },
  ];
  const SORT_COLUMNS = [
    { title: '名称', dataIndex: 'name', sorter: true },
    { title: '成员数', dataIndex: 'members', sorter: true, align: 'right' },
    { title: '创建时间', dataIndex: 'createdAt', sorter: true, defaultSortOrder: 'descend' },
    { title: '状态', dataIndex: 'status' },
  ];

  function firstColumnValues() {
    return screen
      .getAllByRole('row')
      .slice(1)
      .map((r) => r.querySelector('td')!.textContent);
  }

  it('defaultSortOrder 生效：初始按创建时间降序', () => {
    renderTable({ columns: SORT_COLUMNS, dataSource: SORT_DATA });
    expect(firstColumnValues()).toEqual(['张三', '李四', '王五']);
  });

  it('点击排序表头三态循环：asc → desc → 取消（恢复原始顺序）', () => {
    renderTable({ columns: SORT_COLUMNS, dataSource: SORT_DATA });
    const sorter = screen.getByRole('button', { name: /成员数/ });

    fireEvent.click(sorter); // asc
    expect(firstColumnValues()).toEqual(['李四', '王五', '张三']);
    fireEvent.click(sorter); // desc
    expect(firstColumnValues()).toEqual(['张三', '王五', '李四']);
    fireEvent.click(sorter); // 取消 → 原始顺序
    expect(firstColumnValues()).toEqual(['王五', '张三', '李四']);
  });

  it('单例排序：切换排序列时从 asc 重新开始', () => {
    renderTable({ columns: SORT_COLUMNS, dataSource: SORT_DATA });
    fireEvent.click(screen.getByRole('button', { name: /成员数/ }));
    fireEvent.click(screen.getByRole('button', { name: /名称/ }));
    // 中文按拼音 asc：李(li) < 王(wang) < 张(zhang)
    expect(firstColumnValues()).toEqual(['李四', '王五', '张三']);
  });

  it('字符串列按本地化比较排序（中文按拼音）', () => {
    renderTable({ columns: SORT_COLUMNS, dataSource: SORT_DATA });
    const sorter = screen.getByRole('button', { name: /名称/ });
    fireEvent.click(sorter);
    expect(firstColumnValues()).toEqual(['李四', '王五', '张三']);
    fireEvent.click(sorter);
    expect(firstColumnValues()).toEqual(['张三', '王五', '李四']);
  });

  it('排序变化经 onChange 传出 field/order；取消排序时为 undefined', async () => {
    const { context } = renderTable(
      { columns: SORT_COLUMNS, dataSource: SORT_DATA },
      { onChange: { action: 'setState', params: { sortInfo: '${event}' } } },
    );
    fireEvent.click(screen.getByRole('button', { name: /成员数/ }));
    await vi.waitFor(() => {
      expect(context.state.get('sortInfo')).toMatchObject({
        current: 1,
        field: 'members',
        order: 'ascend',
      });
    });
    fireEvent.click(screen.getByRole('button', { name: /成员数/ }));
    fireEvent.click(screen.getByRole('button', { name: /成员数/ }));
    await vi.waitFor(() => {
      const info = context.state.get('sortInfo') as Record<string, unknown>;
      expect(info.field).toBeUndefined();
      expect(info.order).toBeUndefined();
    });
  });

  it('非排序列不渲染排序按钮', () => {
    renderTable({ columns: SORT_COLUMNS, dataSource: SORT_DATA });
    expect(screen.queryByRole('button', { name: /状态/ })).toBeNull();
  });
});

describe('行多选（rowSelection）', () => {
  it('开启后渲染选择列；点击行 Checkbox 经 onSelectChange 传出 keys', async () => {
    const { context, container } = renderTable(
      { rowSelection: true },
      { onSelectChange: { action: 'setState', params: { keys: '${event}' } } },
    );
    const rowChecks = container.querySelectorAll('tbody [data-slot=checkbox]');
    expect(rowChecks).toHaveLength(2);
    expect(container.querySelector('[data-slot=table-selection-head]')).not.toBeNull();

    fireEvent.click(rowChecks[1]);
    await vi.waitFor(() => {
      expect(context.state.get('keys')).toEqual([2]);
    });
  });

  it('表头全选当前页，再次点击取消全选', async () => {
    const { container } = renderTable(
      { rowSelection: true },
      { onSelectChange: { action: 'setState', params: { keys: '${event}' } } },
    );
    const headCheck = container.querySelector(
      '[data-slot=table-selection-head] [data-slot=checkbox]',
    )!;
    fireEvent.click(headCheck);
    await vi.waitFor(() => {
      const checked = container.querySelectorAll('tbody [data-slot=checkbox][data-checked]');
      expect(checked).toHaveLength(2);
    });
    fireEvent.click(headCheck);
    await vi.waitFor(() => {
      const checked = container.querySelectorAll('tbody [data-slot=checkbox][data-checked]');
      expect(checked).toHaveLength(0);
    });
  });

  it('受控 selectedRowKeys：初始选中与点击后传出新 keys', async () => {
    const { context, container } = renderTable(
      { rowSelection: true, selectedRowKeys: [1] },
      { onSelectChange: { action: 'setState', params: { keys: '${event}' } } },
    );
    const rowChecks = container.querySelectorAll('tbody [data-slot=checkbox]');
    expect(rowChecks[0].hasAttribute('data-checked')).toBe(true);
    expect(rowChecks[1].hasAttribute('data-checked')).toBe(false);

    // 受控模式下组件不改自身选中态，但会把 next keys 传出
    fireEvent.click(rowChecks[1]);
    await vi.waitFor(() => {
      expect(context.state.get('keys')).toEqual([1, 2]);
    });
  });

  it('空数据时空态 colSpan 包含选择列', () => {
    const { container } = renderTable({ rowSelection: true, dataSource: [] });
    const emptyCell = container.querySelector('[data-slot=table-empty]')!.closest('td')!;
    expect(emptyCell.getAttribute('colspan')).toBe(String(COLUMNS.length + 1));
  });
});

describe('行多选：禁用行与半选态', () => {
  const PERM_DATA = [
    { id: 1, name: '数据 A' },
    { id: 2, name: '数据 B', selectDisabled: true },
    { id: 3, name: '数据 C' },
  ];

  it('selectionDisabledField：禁用行 Checkbox 置灰且点击不传出 keys', async () => {
    const { context, container } = renderTable(
      { rowSelection: true, selectionDisabledField: 'selectDisabled', dataSource: PERM_DATA },
      { onSelectChange: { action: 'setState', params: { keys: '${event}' } } },
    );
    const rowChecks = container.querySelectorAll('tbody [data-slot=checkbox]');
    // Base UI span 复选框的禁用态为 data-disabled / aria-disabled
    expect(rowChecks[1].hasAttribute('data-disabled')).toBe(true);
    expect(rowChecks[0].hasAttribute('data-disabled')).toBe(false);

    fireEvent.click(rowChecks[1]);
    await new Promise((r) => setTimeout(r, 50));
    expect(context.state.get('keys')).toBeUndefined();
  });

  it('全选只覆盖可选行；部分选中时表头为 indeterminate', async () => {
    const { context, container } = renderTable(
      { rowSelection: true, selectionDisabledField: 'selectDisabled', dataSource: PERM_DATA },
      { onSelectChange: { action: 'setState', params: { keys: '${event}' } } },
    );
    const headCheck = () =>
      container.querySelector('[data-slot=table-selection-head] [data-slot=checkbox]')!;

    fireEvent.click(headCheck());
    await vi.waitFor(() => {
      expect(context.state.get('keys')).toEqual([1, 3]);
    });

    // 取消第 1 行 → 部分选中 → 表头 indeterminate
    fireEvent.click(container.querySelectorAll('tbody [data-slot=checkbox]')[0]);
    await vi.waitFor(() => {
      expect(headCheck().hasAttribute('data-indeterminate')).toBe(true);
    });

    // 全部取消 → indeterminate 消失
    fireEvent.click(container.querySelectorAll('tbody [data-slot=checkbox]')[2]);
    await vi.waitFor(() => {
      expect(headCheck().hasAttribute('data-indeterminate')).toBe(false);
    });
  });

  it('受控初始部分选中时表头即 indeterminate', () => {
    const { container } = renderTable({
      rowSelection: true,
      selectedRowKeys: [1],
      dataSource: DATA,
    });
    const headCheck = container.querySelector(
      '[data-slot=table-selection-head] [data-slot=checkbox]',
    )!;
    expect(headCheck.hasAttribute('data-indeterminate')).toBe(true);
  });
});

describe('排序列浅底色', () => {
  it('当前排序列的表头与单元格带 bg-muted/50，取消排序后移除', () => {
    const { container } = renderTable({
      columns: [
        { title: '名称', dataIndex: 'name', sorter: true },
        { title: '成员数', dataIndex: 'members', sorter: true },
      ],
      dataSource: [
        { id: 1, name: 'A', members: 2 },
        { id: 2, name: 'B', members: 1 },
      ],
    });
    const headBg = () =>
      [...container.querySelectorAll('thead th')].map((th) =>
        th.className.includes('bg-muted/50'),
      );
    const cellBg = () =>
      [...container.querySelectorAll('tbody tr:first-child td')].map((td) =>
        td.className.includes('bg-muted/50'),
      );

    expect(headBg()).toEqual([false, false]);
    fireEvent.click(screen.getByRole('button', { name: /成员数/ }));
    expect(headBg()).toEqual([false, true]);
    expect(cellBg()).toEqual([false, true]);

    fireEvent.click(screen.getByRole('button', { name: /名称/ }));
    expect(headBg()).toEqual([true, false]);

    // 连点三次回到取消排序 → 底色移除
    fireEvent.click(screen.getByRole('button', { name: /名称/ }));
    fireEvent.click(screen.getByRole('button', { name: /名称/ }));
    expect(headBg()).toEqual([false, false]);
  });

  it('defaultSortOrder 初始排序列即带浅底色', () => {
    const { container } = renderTable({
      columns: [
        { title: '名称', dataIndex: 'name', sorter: true },
        { title: '创建时间', dataIndex: 'createdAt', sorter: true, defaultSortOrder: 'descend' },
      ],
      dataSource: [{ id: 1, name: 'A', createdAt: '2026-09-12' }],
    });
    const headBg = [...container.querySelectorAll('thead th')].map((th) =>
      th.className.includes('bg-muted/50'),
    );
    expect(headBg).toEqual([false, true]);
  });
});

describe('空态', () => {
  it('空数据展示图标与默认文案', () => {
    const { container } = renderTable({ dataSource: [] });
    const empty = container.querySelector('[data-slot=table-empty]')!;
    expect(empty.querySelector('[data-slot=icon]')).not.toBeNull();
    expect(empty.textContent).toContain('暂无数据');
  });

  it('emptyText 由外部传入时优先展示', () => {
    const { container } = renderTable({ dataSource: [], emptyText: '暂无符合条件的角色' });
    const empty = container.querySelector('[data-slot=table-empty]')!;
    expect(empty.textContent).toContain('暂无符合条件的角色');
    expect(empty.textContent).not.toContain('暂无数据');
  });
});
