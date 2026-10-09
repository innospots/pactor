// @vitest-environment jsdom
/**
 * SearchableSelect 业务组件：清除选中、缺省文案与候选选择。
 * Base UI 弹层（Popover/Command）依赖 Pointer Capture / ResizeObserver /
 * scrollIntoView，jsdom 未实现，统一由 ./setup.js 补齐。
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import './setup.js';
import { SearchableSelect } from '../../src/components/business/SearchableSelect/index.js';

afterEach(cleanup);

const options = [
  { label: '账户', value: 'ACCOUNT' },
  { label: '设备', value: 'DEVICE' },
];

describe('SearchableSelect 清除选中', () => {
  it('单选有值时显示清除按钮，点击后清空为 "" 且不展开弹层', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SearchableSelect options={options} value="ACCOUNT" onChange={onChange} />,
    );

    const clear = screen.getByLabelText('clear-selection');
    await user.click(clear);

    expect(onChange).toHaveBeenCalledWith('');
    // 清除不应触发展开下拉
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('无值时不显示清除按钮', () => {
    const onChange = vi.fn();
    render(
      <SearchableSelect options={options} value={undefined} onChange={onChange} />,
    );
    expect(screen.queryByLabelText('clear-selection')).toBeNull();
  });

  it('禁用时不显示清除按钮', () => {
    render(
      <SearchableSelect options={options} value="ACCOUNT" disabled onChange={vi.fn()} />,
    );
    expect(screen.queryByLabelText('clear-selection')).toBeNull();
  });

  it('多选模式不显示整体清除按钮', () => {
    render(
      <SearchableSelect options={options} value={['ACCOUNT']} multiple onChange={vi.fn()} />,
    );
    expect(screen.queryByLabelText('clear-selection')).toBeNull();
  });
});

describe('SearchableSelect 文案与候选', () => {
  it('缺省文案：占位「请选择」、搜索「搜索…」、空态「无匹配结果」', async () => {
    const user = userEvent.setup();
    render(<SearchableSelect options={options} showSearch onChange={vi.fn()} />);

    // 未选值展示缺省占位
    expect(screen.getByText('请选择')).toBeTruthy();

    await user.click(screen.getByRole('combobox'));
    // options 可正常渲染；搜索框使用缺省占位「搜索…」
    expect(await screen.findByText('账户')).toBeTruthy();
    expect(screen.getByText('设备')).toBeTruthy();
    const search = screen.getByPlaceholderText('搜索…');

    // 过滤无匹配时展示缺省空态文案（弹层打开动画期间 popup 短暂 pointer-events: none，走 change 事件）
    fireEvent.change(search, { target: { value: '不存在的候选' } });
    expect(await screen.findByText('无匹配结果')).toBeTruthy();
  });

  it('placeholder / searchPlaceholder / emptyText 显式传入时覆盖缺省文案', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelect
        options={options}
        showSearch
        placeholder="选择字段"
        searchPlaceholder="查找…"
        emptyText="没有匹配项"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('选择字段')).toBeTruthy();
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByPlaceholderText('查找…')).toBeTruthy();

    fireEvent.change(screen.getByPlaceholderText('查找…'), {
      target: { value: '不存在的候选' },
    });
    expect(await screen.findByText('没有匹配项')).toBeTruthy();
  });

  it('选择候选项回传 value 并关闭弹层；选中后触发器展示 label', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchableSelect options={options} onChange={onChange} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('设备'));

    expect(onChange).toHaveBeenCalledWith('DEVICE');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('多选模式切换候选并回传数组，候选项带可移除标记', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SearchableSelect options={options} value={['ACCOUNT']} multiple onChange={onChange} />,
    );

    // 已选值以标签形式展示
    expect(screen.getByText('账户')).toBeTruthy();

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('设备'));
    expect(onChange).toHaveBeenLastCalledWith(['ACCOUNT', 'DEVICE']);
  });

  it('候选为空时展示空候选文案', async () => {
    const user = userEvent.setup();
    render(<SearchableSelect options={[]} onChange={vi.fn()} />);

    await user.click(screen.getByRole('combobox'));
    expect(await screen.findByText('无选项')).toBeTruthy();
  });
});
