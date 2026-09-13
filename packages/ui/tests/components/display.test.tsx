// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Alert, Card, Flex, Grid } from '../../src/components/index.js';
import { renderDsl } from './helpers.js';

describe('Button', () => {
  it('variant 映射：variant: primary 渲染 shadcn default 变体（bg-primary）', () => {
    renderDsl({
      type: 'Button',
      props: { text: '保存', variant: 'primary' },
    });

    const button = screen.getByRole('button', { name: '保存' });
    expect(button.className).toContain('bg-primary');
  });

  it('size / disabled 通用 props 映射', () => {
    renderDsl({
      type: 'Button',
      props: { text: '删除', size: 'small', disabled: true },
    });

    const button = screen.getByRole('button', { name: '删除' });
    expect(button.className).toContain('h-8');
    expect(button).toHaveProperty('disabled', true);
  });

  it('danger 映射 destructive 变体', () => {
    renderDsl({
      type: 'Button',
      props: { text: '删除', danger: true },
    });

    const button = screen.getByRole('button', { name: '删除' });
    expect(button.className).toContain('bg-destructive');
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
  it('variant: success 渲染 success 语义类与文本（role=alert）', () => {
    render(<Alert message="操作成功" variant="success" />);

    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('text-success');
    expect(screen.getByText('操作成功')).toBeTruthy();
  });

  it('variant: error 映射 destructive 语义类', () => {
    render(<Alert message="失败" description="请重试" variant="error" />);

    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('text-destructive');
    expect(screen.getByText('请重试')).toBeTruthy();
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

  it('Flex direction 映射 flex-col', () => {
    const { container } = render(
      <Flex direction="vertical" gap={8}>
        <span>a</span>
        <span>b</span>
      </Flex>,
    );

    const flex = container.firstElementChild;
    expect(flex?.className).toContain('flex-col');
    expect((flex as HTMLElement).style.gap).toBe('8px');
  });
});

describe('Grid', () => {
  it('columns: 2 时两个子项以两列网格渲染', () => {
    const { container } = render(
      <Grid columns={2}>
        <span>左</span>
        <span>右</span>
      </Grid>,
    );

    const grid = container.querySelector('[data-slot=grid]');
    expect(grid?.getAttribute('data-columns')).toBe('2');
    expect((grid as HTMLElement).style.gridTemplateColumns).toContain(
      'repeat(2',
    );
    expect(container.querySelectorAll('[data-slot=grid-item]')).toHaveLength(2);
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
  it('Renderer 渲染 Card + Button 组合为对应内置组件', () => {
    renderDsl({
      type: 'Card',
      props: { title: '面板' },
      children: [
        { type: 'Button', props: { text: '确定', variant: 'primary' } },
      ],
    });

    expect(screen.getByText('面板')).toBeTruthy();
    expect(screen.getByRole('button', { name: '确定' }).className).toContain(
      'bg-primary',
    );
  });
});

describe('Card 圆角档位（rounded）', () => {
  it('缺省为 rounded-lg（--radius 基准）', () => {
    const { container } = renderDsl({ type: 'Card', props: { title: '默认' } });
    const card = container.querySelector('[data-slot=card]')!;
    expect(card.className).toContain('rounded-lg');
  });

  it('rounded: sm 时根节点类名为 rounded-sm', () => {
    const { container } = renderDsl({
      type: 'Card',
      props: { title: '紧凑卡片', rounded: 'sm' },
    });
    const card = container.querySelector('[data-slot=card]')!;
    expect(card.className).toContain('rounded-sm');
    expect(card.className).not.toContain('rounded-lg');
  });
});
