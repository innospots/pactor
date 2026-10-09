// @vitest-environment jsdom
/**
 * Row / Col 栅格契约（对齐 antd Grid）：Row gutter/justify/align/wrap；
 * Col 24 分栏 span/offset/order/pull/push/flex + xs~xxl 响应式档位。
 */
import './setup.js';

import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Col, Row } from '../../src/components/index.js';
import { renderDsl } from './helpers.js';

afterEach(cleanup);

describe('Row', () => {
  it('gutter 经上下文传递，Col 对半拆分为 padding', () => {
    const { container } = renderDsl({
      type: 'Row',
      props: { gutter: [16, 8] },
      children: [
        { type: 'Col', props: { span: 12 }, children: [{ type: 'Text', props: { text: 'a' } }] },
        { type: 'Col', props: { span: 12 }, children: [{ type: 'Text', props: { text: 'b' } }] },
      ],
    });

    const cols = container.querySelectorAll('[data-slot=col]');
    expect(cols.length).toBe(2);
    expect((cols[0] as HTMLElement).style.padding).toBe('4px 8px');
    // Row 根节点负 margin 抵消首尾留白
    expect((container.querySelector('[data-slot=row]') as HTMLElement).style.margin).toBe(
      '0px -8px -4px 0px',
    );
  });

  it('justify / align / wrap 映射 flex 属性', () => {
    const { container } = renderDsl({
      type: 'Row',
      props: { justify: 'space-between', align: 'middle', wrap: false },
      children: [{ type: 'Col', props: {}, children: [{ type: 'Text', props: { text: 'x' } }] }],
    });

    const row = container.querySelector('[data-slot=row]') as HTMLElement;
    expect(row.style.justifyContent).toBe('space-between');
    expect(row.style.alignItems).toBe('center');
    expect(row.style.flexWrap).toBe('nowrap');
  });
});

describe('Col', () => {
  it('span 按 24 分栏换算宽度；span 0 隐藏', () => {
    const { container } = renderDsl({
      type: 'Row',
      props: {},
      children: [
        { type: 'Col', props: { span: 6 }, children: [{ type: 'Text', props: { text: 'a' } }] },
        { type: 'Col', props: { span: 0 }, children: [{ type: 'Text', props: { text: 'b' } }] },
      ],
    });

    const cols = container.querySelectorAll('[data-slot=col]');
    expect((cols[0] as HTMLElement).style.width).toBe('25%');
    expect((cols[1] as HTMLElement).style.display).toBe('none');
  });

  it('offset / order / pull / push / flex 内联样式（number flex 展开 0 0 Npx）', () => {
    const { container } = renderDsl({
      type: 'Row',
      props: {},
      children: [
        {
          type: 'Col',
          props: { span: 12, offset: 6, order: 2, pull: 3, push: 3, flex: 100 },
          children: [{ type: 'Text', props: { text: 'a' } }],
        },
      ],
    });

    const col = container.querySelector('[data-slot=col]') as HTMLElement;
    expect(col.style.width).toBe('50%');
    expect(col.style.marginLeft).toBe('25%');
    expect(col.style.order).toBe('2');
    expect(col.style.position).toBe('relative');
    expect(col.style.right).toBe('12.5%');
    expect(col.style.left).toBe('12.5%');
    expect(col.style.flex).toBe('0 0 100px');
  });

  it('响应式档位生成媒体查询类并注入 style 标签（md: 6 覆盖基础 span）', () => {
    const { container } = renderDsl({
      type: 'Row',
      props: {},
      children: [
        {
          type: 'Col',
          props: { span: 24, md: { span: 6, offset: 3 } },
          children: [{ type: 'Text', props: { text: 'a' } }],
        },
      ],
    });

    const col = container.querySelector('[data-slot=col]') as HTMLElement;
    expect(col.className).toContain('pactor-col-md-span-6');
    expect(col.className).toContain('pactor-col-md-offset-3');
    const styles = [...document.head.querySelectorAll('style[data-pactor-col]')].map(
      (s) => s.textContent,
    );
    expect(
      styles.some(
        (css) =>
          css!.includes('@media (min-width: 768px)') &&
          css!.includes('width:25% !important'),
      ),
    ).toBe(true);
    expect(
      styles.some((css) => css!.includes('margin-left:12.5% !important')),
    ).toBe(true);
  });

  it('纯 React 用法：Row/Col 直接渲染（gutter 上下文生效）', () => {
    const { container } = render(
      <Row gutter={20}>
        <Col span={8}>左</Col>
        <Col span={16}>右</Col>
      </Row>,
    );

    const cols = container.querySelectorAll('[data-slot=col]');
    expect((cols[0] as HTMLElement).style.padding).toBe('10px');
    expect((cols[0] as HTMLElement).style.width).toBe('33.33333333333333%');
    expect((cols[1] as HTMLElement).style.width).toBe('66.66666666666666%');
  });
});
