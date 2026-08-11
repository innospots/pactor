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

    const rows = container.querySelectorAll('.pcr-table-body tr.pcr-table-row');
    expect(rows).toHaveLength(2);
    expect(screen.getByText('张三')).toBeTruthy();
    expect(screen.getByText('32')).toBeTruthy();
  });

  it('空数据渲染空态而非报错', () => {
    const { container } = renderTable({ dataSource: [] });

    expect(container.querySelector('.pcr-table-empty')).not.toBeNull();
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

    const rows = container.querySelectorAll('.pcr-table-body tr.pcr-table-row');
    expect(rows).toHaveLength(1);
    expect(screen.getByText('张三')).toBeTruthy();
    expect(screen.queryByText('李四')).toBeNull();
    expect(container.querySelector('.pcr-table-pagination')).not.toBeNull();
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

    expect(container.querySelector('.pcr-table-pagination')).toBeNull();
  });

  it('loading: true 展示加载态', () => {
    const { container } = renderTable({ loading: true });

    expect(container.querySelector('.pcr-table-loading')).not.toBeNull();
  });
});
