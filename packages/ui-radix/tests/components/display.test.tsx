// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Alert, Card, Flex, Grid } from '../../src/components/index.js';
import { renderDsl } from './helpers.js';

describe('Button', () => {
  it('variant 映射：variant: primary 渲染 pcr-btn-primary 按钮', () => {
    renderDsl({
      type: 'Button',
      props: { text: '保存', variant: 'primary' },
    });

    const button = screen.getByRole('button', { name: '保存' });
    expect(button.className).toContain('pcr-btn');
    expect(button.className).toContain('pcr-btn-primary');
  });

  it('size / disabled 通用 props 映射', () => {
    renderDsl({
      type: 'Button',
      props: { text: '删除', size: 'small', disabled: true },
    });

    const button = screen.getByRole('button', { name: '删除' });
    expect(button.className).toContain('pcr-btn-small');
    expect(button).toHaveProperty('disabled', true);
  });

  it('onClick 事件触发动作', async () => {
    const { context } = renderDsl({
      type: 'Button',
      props: { text: '点我' },
      events: { onClick: { action: 'setState', params: { clicked: true } } },
    });

    screen.getByRole('button', { name: '点我' }).click();
    await vi.waitFor(() => {
      expect(context.state.get('clicked')).toBe(true);
    });
  });
});

describe('Alert', () => {
  it('variant: success 渲染 success 语义 class 与文本', () => {
    const { container } = render(
      <Alert message="操作成功" variant="success" />,
    );

    const alert = container.querySelector('.pcr-alert');
    expect(alert?.className).toContain('pcr-alert-success');
    expect(screen.getByText('操作成功')).toBeTruthy();
  });
});

describe('Page / Card / Flex', () => {
  it('Page 渲染标题与内容区', () => {
    renderDsl({
      type: 'Page',
      props: { title: '客户列表' },
      children: [{ type: 'Button', props: { text: '新建' } }],
    });

    expect(screen.getByText('客户列表')).toBeTruthy();
    expect(screen.getByRole('button', { name: '新建' })).toBeTruthy();
  });

  it('Card 渲染标题与 children', () => {
    render(
      <Card title="概览">
        <span>内容</span>
      </Card>,
    );

    expect(screen.getByText('概览')).toBeTruthy();
    expect(screen.getByText('内容')).toBeTruthy();
  });

  it('Flex direction 映射 vertical class', () => {
    const { container } = render(
      <Flex direction="vertical" gap={8}>
        <span>a</span>
        <span>b</span>
      </Flex>,
    );

    const flex = container.firstElementChild;
    expect(flex?.className).toContain('pcr-flex-vertical');
  });
});

describe('Grid', () => {
  it('columns: 2 时两个子项以两列布局 class 渲染', () => {
    const { container } = render(
      <Grid columns={2}>
        <span>左</span>
        <span>右</span>
      </Grid>,
    );

    const grid = container.querySelector('.pcr-grid');
    expect(grid?.className).toContain('pcr-grid-cols-2');
    expect(container.querySelectorAll('.pcr-grid-item')).toHaveLength(2);
  });
});

describe('Statistic', () => {
  it('value 支持表达式解析后的数值', async () => {
    const { context } = renderDsl(
      {
        type: 'Statistic',
        props: { title: '总数', value: '${data.summary.total}' },
      },
      {
        dataSources: {
          summary: { type: 'static', value: { total: 128 }, autoLoad: true },
        },
      },
    );

    // 未经 PageRuntime 时手动触发 autoLoad
    await act(async () => {
      await context.data.init();
    });

    await vi.waitFor(() => {
      expect(screen.getByText('128')).toBeTruthy();
    });
    expect(screen.getByText('总数')).toBeTruthy();
  });
});

describe('Renderer 组合渲染', () => {
  it('Renderer 渲染 Card + Button 组合为对应 Radix kit 组件', () => {
    renderDsl({
      type: 'Card',
      props: { title: '面板' },
      children: [
        { type: 'Button', props: { text: '确定', variant: 'primary' } },
      ],
    });

    expect(screen.getByText('面板')).toBeTruthy();
    expect(screen.getByRole('button', { name: '确定' }).className).toContain(
      'pcr-btn-primary',
    );
  });
});
