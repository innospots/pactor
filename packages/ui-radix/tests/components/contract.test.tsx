// @vitest-environment jsdom
import { screen } from '@testing-library/react';
import { createBuiltinComponentRegistry } from 'pactor-ui-antd/components';
import type { DslNode } from 'pactor-core';
import { describe, expect, it, vi } from 'vitest';

import { createRadixComponentRegistry } from '../../src/components/index.js';
import { renderDslWith } from './helpers.js';

/** 同一份含 Button / Statistic 的 DSL，分别以 antd / Radix 两个注册表渲染 */
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

describe('契约一致性：DSL 零修改双实现运行', () => {
  it('antd 注册表：正常渲染且 Button onClick 行为一致', async () => {
    const { context } = renderDslWith(createBuiltinComponentRegistry(), dsl);

    expect(screen.getByText('契约页')).toBeTruthy();
    expect(screen.getByText('128')).toBeTruthy();
    screen.getByRole('button', { name: /点\s*我/ }).click();
    await vi.waitFor(() => {
      expect(context.state.get('clicked')).toBe(true);
    });
  });

  it('Radix 注册表：正常渲染（pcr 语义 class）且 Button onClick 行为一致', async () => {
    const { context, container } = renderDslWith(
      createRadixComponentRegistry(),
      dsl,
    );

    expect(screen.getByText('契约页')).toBeTruthy();
    expect(screen.getByText('128')).toBeTruthy();
    expect(container.querySelector('.pcr-btn-primary')).not.toBeNull();
    screen.getByRole('button', { name: '点我' }).click();
    await vi.waitFor(() => {
      expect(context.state.get('clicked')).toBe(true);
    });
  });
});
