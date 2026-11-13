// @vitest-environment jsdom
/**
 * SearchInput 契约：
 * - 渲染「左输入框 + 右搜索按钮」一体化组合框，按钮贴右缘
 * - 仅图标按钮以内置「搜索」为无障碍名称，且不显示 tooltip
 * - Form 内点击按钮触发表单提交；独立渲染点击 / 回车调用 onSearch
 * - 值非空时可 hover 清除
 */
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderDsl } from './helpers.js';

describe('SearchInput', () => {
  it('仅图标按钮：组合框内置按钮，名称为内置「搜索」，无 tooltip', () => {
    renderDsl({
      type: 'SearchInput',
      props: { placeholder: '请输入关键词' },
    });

    const group = document.querySelector('[data-slot="input-group"]');
    expect(group).not.toBeNull();
    expect(
      group!.querySelector('[data-slot="input"]'),
      '输入框应位于组合框内',
    ).not.toBeNull();

    const button = screen.getByRole('button', { name: '搜索' });
    expect(button.textContent).toBe('');
    expect(document.querySelector('[data-slot="tooltip-trigger"]')).toBeNull();
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('buttonText 形态：按钮显示文案并以其为无障碍名称', () => {
    renderDsl({ type: 'SearchInput', props: { buttonText: '查询' } });

    const button = screen.getByRole('button', { name: '查询' });
    expect(button.textContent).toContain('查询');
  });

  it('Form 内点击按钮触发表单提交并回调 onSearch', async () => {
    const { context } = renderDsl({
      type: 'Form',
      events: {
        onSubmit: {
          action: 'setState',
          params: { submitted: '${event.keyword}' },
        },
      },
      children: [
        {
          type: 'SearchInput',
          props: { name: 'keyword' },
          events: {
            onSearch: [
              { action: 'setState', params: { searched: '${event}' } },
            ],
          },
        },
      ],
    });

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '智能体' },
    });
    fireEvent.click(screen.getByRole('button', { name: '搜索' }));

    await screen.findByDisplayValue('智能体');
    await vi.waitFor(() => {
      expect(context.state.get('submitted')).toBe('智能体');
    });
    expect(context.state.get('searched')).toBe('智能体');
    expect(context.state.get('form')).toEqual({ keyword: '智能体' });
  });

  it('Form 校验失败时点击按钮不触发 onSubmit', async () => {
    const { context } = renderDsl({
      type: 'Form',
      events: {
        onSubmit: { action: 'setState', params: { submitted: true } },
      },
      children: [
        {
          type: 'SearchInput',
          props: {
            name: 'keyword',
            rules: [{ required: true, message: '必填' }],
          },
        },
      ],
    });

    fireEvent.click(screen.getByRole('button', { name: '搜索' }));

    await screen.findByText('必填');
    expect(context.state.get('submitted')).toBeUndefined();
    expect(context.state.get('form')).toBeUndefined();
  });

  it('独立渲染点击按钮调用 onSearch', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'SearchInput',
      props: { value: '${state.keyword}' },
      events: {
        onChange: [{ action: 'setState', params: { keyword: '${event}' } }],
        onSearch: [{ action: 'setState', params: { submitted: '${event}' } }],
      },
    });

    await user.type(screen.getByRole('textbox'), 'pactor');
    await user.click(screen.getByRole('button', { name: '搜索' }));

    expect(context.state.get('submitted')).toBe('pactor');
  });

  it('回车经 onSearch 传出当前值', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'SearchInput',
      props: { value: '${state.keyword}' },
      events: {
        onChange: [{ action: 'setState', params: { keyword: '${event}' } }],
        onSearch: [{ action: 'setState', params: { submitted: '${event}' } }],
      },
    });

    await user.type(screen.getByRole('textbox'), 'pactor{Enter}');
    expect(context.state.get('submitted')).toBe('pactor');
  });

  it('有值时清除按钮把值置空', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'SearchInput',
      props: { value: '${state.keyword}' },
      events: {
        onChange: [{ action: 'setState', params: { keyword: '${event}' } }],
      },
    });

    await user.type(screen.getByRole('textbox'), 'pactor');
    await user.click(screen.getByRole('button', { name: '清除' }));

    expect(context.state.get('keyword')).toBe('');
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
  });
});
