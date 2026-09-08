// @vitest-environment jsdom
import { screen } from '@testing-library/react';
import type { DslNode } from '@pactor-app/core';
import { describe, expect, it, vi } from 'vitest';

import { createComponentRegistry } from '../../src/components/index.js';
import { renderDslWith } from './helpers.js';

/** 含 Button / Statistic 的 DSL，以内置注册表渲染 */
const dsl: DslNode = {
  type: 'Page',
  props: { title: '契约页' },
  children: [
    {
      type: 'Button',
      props: { text: '点我', variant: 'primary' },
      events: { onClick: { action: 'setState', params: { clicked: true } } },
    },
    { type: 'Statistic', props: { title: '总数', value: 128 } },
  ],
};

describe('DSL 渲染契约（内置组件）', () => {
  it('内置注册表：正常渲染（shadcn 工具类）且 Button onClick 生效', async () => {
    const { context } = renderDslWith(createComponentRegistry(), dsl);

    expect(screen.getByText('契约页')).toBeTruthy();
    expect(screen.getByText('128')).toBeTruthy();
    const button = screen.getByRole('button', { name: '点我' });
    // variant: primary → shadcn default 变体（bg-primary）
    expect(button.className).toContain('bg-primary');
    button.click();
    await vi.waitFor(() => {
      expect(context.state.get('clicked')).toBe(true);
    });
  });
});
