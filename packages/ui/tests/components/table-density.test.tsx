// @vitest-environment jsdom
import './setup.js';

import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { renderDsl } from './helpers.js';

const columns = [{ title: '姓名', dataIndex: 'name' }];
const dataSource = [{ id: 1, name: 'Alice' }];

afterEach(() => {
  cleanup();
});

describe('Table 密度', () => {
  it('size=small 覆盖行高与单元格 padding（局部档优先）', () => {
    renderDsl({ type: 'Table', props: { columns, dataSource, size: 'small' } });
    const cell = screen.getByText('Alice').closest('td');
    expect(cell?.className).toContain('py-1');
    const head = screen.getByText('姓名').closest('th');
    expect(head?.className).toContain('h-8');
  });

  it('size=large 覆盖行高与单元格 padding', () => {
    renderDsl({ type: 'Table', props: { columns, dataSource, size: 'large' } });
    expect(screen.getByText('Alice').closest('td')?.className).toContain('py-2.5');
    expect(screen.getByText('姓名').closest('th')?.className).toContain('h-12');
  });

  it('size 缺省（middle）不加覆盖类，跟随全局密度令牌', () => {
    renderDsl({ type: 'Table', props: { columns, dataSource } });
    const cell = screen.getByText('Alice').closest('td');
    expect(cell?.className).toContain('py-(--pactor-table-cell-padding-y)');
    expect(cell?.className).not.toContain(' py-1');
  });
});
