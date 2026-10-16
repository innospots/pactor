// @vitest-environment jsdom
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderDsl } from './helpers.js';

const steps = [
  { title: '解析需求', status: 'done', duration: '2s' },
  { title: '生成页面', status: 'running', description: '正在渲染组件树' },
  { title: '发布上线', status: 'pending' },
];

describe('StepsPanel 执行步骤面板', () => {
  it('渲染标题与步骤列表（状态图标 + 描述 + 耗时）', () => {
    const { container } = renderDsl({
      type: 'StepsPanel',
      props: { steps },
    });

    expect(screen.getByText('执行步骤')).toBeTruthy();
    expect(screen.getByText('解析需求')).toBeTruthy();
    expect(screen.getByText('生成页面')).toBeTruthy();
    expect(screen.getByText('正在渲染组件树')).toBeTruthy();
    expect(screen.getByText('2s')).toBeTruthy();

    const items = container.querySelectorAll('li');
    expect(items.length).toBe(3);
    expect(items[0].getAttribute('data-status')).toBe('done');
    expect(items[1].getAttribute('data-status')).toBe('running');
    expect(items[2].getAttribute('data-status')).toBe('pending');
    // done/running 渲染图标，pending 渲染圆点
    expect(items[0].querySelector('[data-slot=icon]')).not.toBeNull();
    expect(items[1].querySelector('[data-slot=icon]')).not.toBeNull();
    expect(items[2].querySelector('[data-slot=icon]')).toBeNull();
  });

  it('空列表展示空态文案，title/emptyText 可覆盖', () => {
    renderDsl({
      type: 'StepsPanel',
      props: { title: '任务进度', emptyText: '暂无任务', steps: [] },
    });
    expect(screen.getByText('任务进度')).toBeTruthy();
    expect(screen.getByText('暂无任务')).toBeTruthy();
  });

  it('缺省 pending：未声明 status 的步骤按待执行渲染', () => {
    const { container } = renderDsl({
      type: 'StepsPanel',
      props: { steps: [{ title: '等待执行' }] },
    });
    expect(
      container.querySelector('li')!.getAttribute('data-status'),
    ).toBe('pending');
  });
});
