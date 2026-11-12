// @vitest-environment jsdom
/**
 * MultiSelect 契约（spec: shadcn-extended-components / 表单类组件）：
 * multiple 弹层连续勾选、触发器标签、max 置灰、Form 集成（name 即成表单项、
 * 必填按「至少选中一个」判断、值收集）与通用 props / 尺寸映射。
 */
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  renderDsl,
} from './helpers.js';

const OPTIONS = [
  { label: '销售额', value: 'revenue' },
  { label: '订单量', value: 'orders' },
  { label: '客户数', value: 'customers' },
];

describe('MultiSelect', () => {
  it('独立渲染：缺省「请选择」，勾选后 onChange 传出原始 value 数组', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'MultiSelect',
      props: { options: OPTIONS },
      events: {
        onChange: { action: 'setState', params: { picked: '${event}' } },
      },
    });

    expect(
      container.querySelector('[data-slot=multi-select-placeholder]')?.textContent,
    ).toBe('请选择');

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: '订单量' }));

    await expectEventState(context, 'picked', ['orders']);
  });

  it('显式 placeholder 生效；max 达到上限后未选中项置灰、已选项保持可点', async () => {
    const user = userEvent.setup();
    renderDsl({
      type: 'MultiSelect',
      props: {
        options: OPTIONS,
        value: ['revenue', 'orders'],
        max: 2,
        placeholder: '选择指标',
      },
    });

    expect(
      document.querySelector('[data-slot=multi-select-placeholder]'),
    ).toBeNull();

    await user.click(screen.getByRole('combobox'));
    const selectedA = await screen.findByRole('option', { name: '销售额' });
    const selectedB = await screen.findByRole('option', { name: '订单量' });
    const overLimit = await screen.findByRole('option', { name: '客户数' });
    expect(selectedA.hasAttribute('data-disabled')).toBe(false);
    expect(selectedB.hasAttribute('data-disabled')).toBe(false);
    expect(overLimit.hasAttribute('data-disabled')).toBe(true);
  });

  it('Form 内声明 name 自动成为表单项：标签随选择更新，提交收集数组', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'Form',
      children: [
        {
          type: 'MultiSelect',
          props: { name: 'metrics', label: '指标', options: OPTIONS },
        },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    const formItem = container.querySelector('[data-slot=form-item]')!;
    const formLabel = formItem.querySelector('label')!;
    const trigger = formItem.querySelector('[data-slot=select-trigger]')!;
    expect(formLabel.getAttribute('for')).toBe(trigger.id);

    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: '销售额' }));
    await user.click(await screen.findByRole('option', { name: '客户数' }));

    const tags = container.querySelectorAll('[data-slot=multi-select-tag]');
    expect([...tags].map((tag) => tag.textContent)).toEqual(['销售额', '客户数']);

    fireEvent.click(screen.getByRole('button', { name: '提交' }));
    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({
        metrics: ['revenue', 'customers'],
      });
    });
  });

  it('hover 标签显示单项删除入口：点击只移除该项、不展开弹层', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'Form',
      children: [
        {
          type: 'MultiSelect',
          props: { name: 'metrics', label: '指标', options: OPTIONS },
        },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    const trigger = container.querySelector('[data-slot=select-trigger]')!;
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: '销售额' }));
    await user.click(await screen.findByRole('option', { name: '订单量' }));
    await user.keyboard('{Escape}');

    const firstTag = container.querySelector('[data-slot=multi-select-tag]')!;
    const remove = firstTag.querySelector('[data-slot=multi-select-tag-remove]')!;
    expect(remove).toBeTruthy();
    await user.hover(firstTag);
    await user.click(remove);

    // 删除点击不应冒泡到触发器展开弹层
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    const tags = container.querySelectorAll('[data-slot=multi-select-tag]');
    expect([...tags].map((tag) => tag.textContent)).toEqual(['订单量']);

    fireEvent.click(screen.getByRole('button', { name: '提交' }));
    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({ metrics: ['orders'] });
    });
  });

  it('disabled 时不渲染单项删除入口', () => {
    const { container } = renderDsl({
      type: 'MultiSelect',
      props: { options: OPTIONS, value: ['revenue'], disabled: true },
    });
    expect(
      container.querySelector('[data-slot=multi-select-tag]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[data-slot=multi-select-tag-remove]'),
    ).toBeNull();
  });

  it('必填按「至少选中一个」校验：空提交拦截；全部取消后再次拦截', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'Form',
      events: {
        onSubmit: { action: 'setState', params: { submitted: true } },
      },
      children: [
        {
          type: 'MultiSelect',
          props: {
            name: 'metrics',
            label: '指标',
            options: OPTIONS,
            rules: [{ required: true, message: '请至少选择一个指标' }],
          },
        },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    fireEvent.click(screen.getByRole('button', { name: '提交' }));
    expect(await screen.findByText('请至少选择一个指标')).toBeTruthy();
    expect(context.state.get('submitted')).toBeUndefined();
    const trigger = container.querySelector('[data-slot=select-trigger]')!;
    expect(trigger.getAttribute('aria-invalid')).toBe('true');

    // 选一项后提交通过，错误清除
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: '订单量' }));
    // 弹层在 multiple 下保持打开；先关闭再提交（避免后续点击触发器变成「关闭」）
    await user.keyboard('{Escape}');
    expect(screen.queryByText('请至少选择一个指标')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '提交' }));
    await vi.waitFor(() => {
      expect(context.state.get('submitted')).toBe(true);
    });

    // 取消唯一一项后再次提交：空数组写回 undefined，必填重新拦截
    context.state.set('submitted', undefined);
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: '订单量' }));
    await user.keyboard('{Escape}');
    fireEvent.click(screen.getByRole('button', { name: '提交' }));
    expect(await screen.findByText('请至少选择一个指标')).toBeTruthy();
    expect(context.state.get('submitted')).toBeUndefined();
  });

  it('通用 props 作用于根节点（独立渲染）', () => {
    const { container } = renderDsl({
      type: 'MultiSelect',
      props: { options: OPTIONS, ...COMMON_PROPS_PROBE },
    });
    expectCommonProps(container.querySelector('[data-slot=multi-select]'));
  });

  it('尺寸映射到 vendored trigger 的 data-size 与文本类', () => {
    const { unmount } = renderDsl({
      type: 'MultiSelect',
      props: { options: OPTIONS },
    });
    expect(
      document.querySelector('[data-slot=select-trigger]')!.getAttribute('data-size'),
    ).toBe('default');
    unmount();

    renderDsl({
      type: 'MultiSelect',
      props: { options: OPTIONS, size: 'large' },
    });
    const trigger = document.querySelector('[data-slot=select-trigger]')!;
    expect(trigger.getAttribute('data-size')).toBe('lg');
    expect(trigger.className).toContain('text-base');
  });
});
