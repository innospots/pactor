// @vitest-environment jsdom
import './setup.js';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createI18nContext } from '@pactor-app/core';
import { I18nContextProvider } from '@pactor-app/runtime';
import { useState, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  FormCardList,
  type FormCardListField,
  type FormCardListItem,
} from '../src/components/FormCardList/index.js';
import { expectEventState, renderDsl } from './helpers.js';

afterEach(cleanup);

const fields: FormCardListField[] = [
  { name: 'name', label: '姓名', placeholder: '请输入姓名' },
  { name: 'age', label: '年龄', type: 'number' },
  { name: 'role', label: '角色', type: 'select', options: [
    { label: '管理员', value: 'admin' },
    { label: '成员', value: 'member' },
  ] },
  { name: 'enabled', label: '启用', type: 'switch' },
];

/** 受控包装：模拟 DSL state 回写 */
function Stateful({
  initial,
  onChange,
  ...rest
}: {
  initial: FormCardListItem[];
  onChange?: (v: FormCardListItem[]) => void;
} & Omit<Parameters<typeof FormCardList>[0], 'value' | 'onChange'>) {
  const [v, setV] = useState<FormCardListItem[]>(initial);
  return (
    <FormCardList
      {...rest}
      value={v}
      onChange={(nv) => {
        setV(nv);
        onChange?.(nv);
      }}
    />
  );
}

describe('FormCardList', () => {
  it('按 value 渲染卡片：默认序号文字 + 字段值', () => {
    render(
      <FormCardList
        fields={fields}
        value={[{ name: '张三', age: 18 }, { name: '李四', age: 20 }]}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText('第 1 项')).toBeTruthy();
    expect(screen.getByText('第 2 项')).toBeTruthy();
    expect(screen.getByDisplayValue('张三')).toBeTruthy();
    expect(screen.getByDisplayValue('李四')).toBeTruthy();
    expect(screen.getByText('添加一项')).toBeTruthy();
  });

  it('itemLabel 自定义序号文字（{index} 占位从 1 开始）', () => {
    render(
      <FormCardList
        fields={fields}
        itemLabel="成员 {index}"
        value={[{}, {}]}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText('成员 1')).toBeTruthy();
    expect(screen.getByText('成员 2')).toBeTruthy();
  });

  it('点击添加按钮追加 defaultItem', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FormCardList
        fields={fields}
        value={[{ name: '张三' }]}
        defaultItem={{ name: '', enabled: true }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByText('添加一项'));
    expect(onChange).toHaveBeenLastCalledWith([
      { name: '张三' },
      { name: '', enabled: true },
    ]);
  });

  it('点击序号行右端删除按钮移除对应项', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FormCardList
        fields={fields}
        value={[{ name: '张三' }, { name: '李四' }]}
        onChange={onChange}
      />,
    );

    const deleteButtons = screen.getAllByLabelText('delete-item');
    expect(deleteButtons).toHaveLength(2);
    await user.click(deleteButtons[0]!);
    expect(onChange).toHaveBeenLastCalledWith([{ name: '李四' }]);
  });

  it('编辑字段 emit 更新后的整份列表（受控回路）', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Stateful fields={fields} initial={[{ name: '张三' }]} onChange={onChange} />);

    const input = screen.getByDisplayValue('张三');
    await user.clear(input);
    await user.type(input, '王五');
    expect(onChange).toHaveBeenLastCalledWith([{ name: '王五' }]);
  });

  it('switch 字段切换 emit 布尔值', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Stateful fields={fields} initial={[{ enabled: false }]} onChange={onChange} />,
    );

    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenLastCalledWith([{ enabled: true }]);
  });

  it('select 字段选择 emit 选项值', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Stateful fields={fields} initial={[{}]} onChange={onChange} />,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('管理员'));
    expect(onChange).toHaveBeenLastCalledWith([{ role: 'admin' }]);
  });

  it('minItems：达到下限隐藏删除按钮', () => {
    render(
      <FormCardList
        fields={fields}
        value={[{}, {}]}
        minItems={2}
        onChange={() => {}}
      />,
    );
    expect(screen.queryByLabelText('delete-item')).toBeNull();
  });

  it('maxItems：达到上限隐藏添加按钮', () => {
    render(
      <FormCardList
        fields={fields}
        value={[{}, {}]}
        maxItems={2}
        onChange={() => {}}
      />,
    );
    expect(screen.queryByText('添加一项')).toBeNull();
    expect(screen.getAllByLabelText('delete-item')).toHaveLength(2);
  });

  it('disabled：隐藏增删入口且控件禁用', () => {
    render(
      <FormCardList
        fields={fields}
        value={[{ name: '张三' }]}
        disabled
        onChange={() => {}}
      />,
    );
    expect(screen.queryByText('添加一项')).toBeNull();
    expect(screen.queryByLabelText('delete-item')).toBeNull();
    expect((screen.getByDisplayValue('张三') as HTMLInputElement).disabled).toBe(true);
  });

  it('空列表只渲染添加按钮', () => {
    render(<FormCardList fields={fields} value={[]} onChange={() => {}} />);
    expect(screen.queryByText('第 1 项')).toBeNull();
    expect(screen.getByText('添加一项')).toBeTruthy();
  });
});

describe('i18n 覆盖：FormCardList', () => {
  function withLocale(locale: string, children: ReactNode): ReactNode {
    const i18n = createI18nContext({ locale, messages: {} });
    return <I18nContextProvider value={i18n}>{children}</I18nContextProvider>;
  }

  it('en-US：Item 1 / Add item', () => {
    render(
      withLocale(
        'en-US',
        <FormCardList fields={fields} value={[{}]} onChange={() => {}} />,
      ),
    );
    expect(screen.getByText('Item 1')).toBeTruthy();
    expect(screen.getByText('Add item')).toBeTruthy();
  });
});

describe('FormCardList DSL', () => {
  it('DSL 渲染 + onChange 经 ${event} 回写 state（受控回路）', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl(
      {
        type: 'FormCardList',
        props: {
          value: '${state.items}',
          itemLabel: '成员 {index}',
          fields: [
            { name: 'name', label: '姓名' },
          ],
        },
        events: {
          onChange: {
            action: 'setState',
            params: { items: '${event}' },
          },
        },
      },
      { state: { items: [{ name: '张三' }] } },
    );

    expect(screen.getByText('成员 1')).toBeTruthy();
    expect(screen.getByDisplayValue('张三')).toBeTruthy();

    // 编辑字段 → onChange 回写 state → 受控渲染新值
    const input = screen.getByDisplayValue('张三');
    await user.clear(input);
    await user.type(input, '李四');
    await expectEventState(context, 'items', [{ name: '李四' }]);
    expect(screen.getByDisplayValue('李四')).toBeTruthy();

    // 添加一项
    await user.click(screen.getByText('添加一项'));
    await expectEventState(context, 'items', [{ name: '李四' }, {}]);
    expect(screen.getByText('成员 2')).toBeTruthy();

    // 删除第一项
    await user.click(screen.getAllByLabelText('delete-item')[0]!);
    await expectEventState(context, 'items', [{}]);
  });

  it('DSL children 列表项模板：${row} 读值，updateItem 回写整份列表', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl(
      {
        type: 'FormCardList',
        props: {
          value: '${state.items}',
          itemLabel: '成员 {index}',
        },
        children: [
          {
            type: 'Input',
            props: { value: '${row.name}' },
            events: {
              onChange: {
                action: 'setState',
                params: { items: '${updateItem({ name: event })}' },
              },
            },
          },
        ],
      },
      { state: { items: [{ name: '张三' }, { name: '李四' }] } },
    );

    // 模板逐项渲染
    expect(screen.getByText('成员 1')).toBeTruthy();
    expect(screen.getByText('成员 2')).toBeTruthy();
    expect(screen.getByDisplayValue('张三')).toBeTruthy();
    expect(screen.getByDisplayValue('李四')).toBeTruthy();

    // 编辑第二项 → updateItem 只 patch 当前项
    const input = screen.getByDisplayValue('李四');
    await user.clear(input);
    await user.type(input, '王五');
    await expectEventState(context, 'items', [{ name: '张三' }, { name: '王五' }]);
  });

  it('itemBody props DSL 子树作为列表项模板', () => {
    renderDsl(
      {
        type: 'FormCardList',
        props: {
          value: '${state.items}',
          itemBody: [
            { type: 'Text', props: { text: '姓名：${row.name}' } },
          ],
        },
      },
      { state: { items: [{ name: '张三' }, { name: '李四' }] } },
    );

    expect(screen.getByText('姓名：张三')).toBeTruthy();
    expect(screen.getByText('姓名：李四')).toBeTruthy();
  });

  it('React 直用 renderItem 渲染列表项（不依赖 Renderer 上下文）', () => {
    render(
      <FormCardList
        value={[{ name: '张三' }]}
        onChange={() => {}}
        renderItem={(item) => <span>自定义 {String(item.name)}</span>}
      />,
    );
    expect(screen.getByText('自定义 张三')).toBeTruthy();
  });

  it('itemForm 模式：Grid 复杂布局 + name 表单项（label 生效），编辑自动同步列表项', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl(
      {
        type: 'FormCardList',
        props: {
          value: '${state.items}',
          itemLabel: '成员 {index}',
          itemForm: true,
        },
        children: [
          {
            type: 'Grid',
            props: { columns: 2, gap: 12 },
            children: [
              {
                type: 'Input',
                props: { name: 'name', label: '姓名', value: '${row.name}' },
              },
              {
                type: 'Select',
                props: {
                  name: 'role',
                  label: '角色',
                  value: '${row.role}',
                  options: [
                    { label: '管理员', value: 'admin' },
                    { label: '成员', value: 'member' },
                  ],
                },
              },
            ],
          },
        ],
        events: {
          onChange: { action: 'setState', params: { items: '${event}' } },
        },
      },
      { state: { items: [{ name: '张三', role: 'admin' }, { name: '李四', role: 'member' }] } },
    );

    // 复杂布局：每项一个两列 Grid，表单项 label 生效
    const grids = container.querySelectorAll('[data-slot=grid][data-columns="2"]');
    expect(grids.length).toBe(2);
    expect(screen.getAllByText('姓名')).toHaveLength(2);
    expect(screen.getAllByText('角色')).toHaveLength(2);
    expect(screen.getByDisplayValue('张三')).toBeTruthy();

    // 声明 name 的字段编辑：经 Form onValuesChange 自动合并回列表项（无需 updateItem）
    const input = screen.getByDisplayValue('李四');
    await user.clear(input);
    await user.type(input, '王五');
    await expectEventState(context, 'items', [
      { name: '张三', role: 'admin' },
      { name: '王五', role: 'member' },
    ]);
  });

  it('itemForm 模式：每项 Form 名唯一（同页多个列表不冲突）', () => {
    renderDsl(
      {
        type: 'Flex',
        props: { direction: 'vertical' },
        children: [
          {
            type: 'FormCardList',
            props: { value: '${state.a}', itemForm: true },
            children: [{ type: 'Input', props: { name: 'x', label: 'X' } }],
          },
          {
            type: 'FormCardList',
            props: { value: '${state.b}', itemForm: true },
            children: [{ type: 'Input', props: { name: 'y', label: 'Y' } }],
          },
        ],
      },
      { state: { a: [{}], b: [{}] } },
    );

    // 两个列表各渲染一个表单项，重名注册未抛错
    expect(screen.getByText('X')).toBeTruthy();
    expect(screen.getByText('Y')).toBeTruthy();
  });
});
