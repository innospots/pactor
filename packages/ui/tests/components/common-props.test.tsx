// @vitest-environment jsdom
/**
 * 通用 props 契约：所有内置组件支持 className / style，
 * 作用于各自根节点（className 与内置样式合并，style 直接内联）。
 */
import type { DslNode } from '@pactor-app/core';
import { describe, expect, it } from 'vitest';

import { COMMON_PROPS_PROBE, expectCommonProps, renderDsl } from './helpers.js';

const COMMON_PROPS = COMMON_PROPS_PROBE;

describe('通用 props 契约（className / style）', () => {
  it('Page', () => {
    const { container } = renderDsl({ type: 'Page', props: { ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('[data-slot=page]'));
  });

  it('Grid', () => {
    const { container } = renderDsl({ type: 'Grid', props: { ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('[data-slot=grid]'));
  });

  it('Flex', () => {
    const { container } = renderDsl({ type: 'Flex', props: { ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('[data-slot=flex]'));
  });

  it('Card', () => {
    const { container } = renderDsl({ type: 'Card', props: { ...COMMON_PROPS } });
    // Card 根为 shadcn Card（无 data-slot 约定时取首个 div）
    const root = container.firstElementChild;
    expectCommonProps(root);
  });

  it('Button', () => {
    const { container } = renderDsl({
      type: 'Button',
      props: { text: '确定', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('button'));
  });

  it('Alert', () => {
    const { container } = renderDsl({
      type: 'Alert',
      props: { message: '提示', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[role=alert]') ?? container.firstElementChild);
  });

  it('Statistic', () => {
    const { container } = renderDsl({
      type: 'Statistic',
      props: { title: '总数', value: 42, ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=statistic]'));
  });

  it('Tabs', () => {
    const { container } = renderDsl({
      type: 'Tabs',
      props: {
        items: [{ key: 'a', label: '页签A' }],
        ...COMMON_PROPS,
      },
    });
    expectCommonProps(container.firstElementChild);
  });

  it('Table', () => {
    const { container } = renderDsl({
      type: 'Table',
      props: { columns: [], dataSource: [], ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=dsl-table]'));
  });

  it('Form', () => {
    const { container } = renderDsl({ type: 'Form', props: { ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('form'));
  });

  it('Input（独立渲染）', () => {
    const { container } = renderDsl({ type: 'Input', props: { ...COMMON_PROPS } });
    // allowClear 缺省开启，根节点为清除按钮的包裹节点（group + relative）
    expectCommonProps(container.firstElementChild);
  });

  it('Select（独立渲染）', () => {
    const { container } = renderDsl({ type: 'Select', props: { ...COMMON_PROPS } });
    expectCommonProps(container.firstElementChild);
  });

  it('DatePicker（独立渲染为触发器）', () => {
    renderDsl({ type: 'DatePicker', props: { ...COMMON_PROPS } });
    expectCommonProps(document.querySelector('[data-slot=datepicker-trigger]'));
  });

  it('Input / Select 在 Form 内：通用 props 挂在 form-item 容器', () => {
    const node: DslNode = {
      type: 'Form',
      children: [
        { type: 'Input', props: { name: 'a', label: 'A', ...COMMON_PROPS } },
        { type: 'Select', props: { name: 'b', label: 'B', options: [], ...COMMON_PROPS } },
      ],
    };
    const { container } = renderDsl(node);

    const items = container.querySelectorAll('[data-slot=form-item]');
    expect(items).toHaveLength(2);
    for (const item of items) {
      expect(item.classList.contains('biz-probe')).toBe(true);
      expect((item as HTMLElement).style.flexGrow).toBe('1');
    }
  });

  it('Layout / Header / Sider / Content / Footer / Menu', () => {
    for (const [type, selector] of [
      ['Layout', '[data-slot=layout]'],
      ['Header', '[data-slot=layout-header]'],
      ['Sider', '[data-slot=layout-sider]'],
      ['Content', '[data-slot=layout-content]'],
      ['Footer', '[data-slot=layout-footer]'],
      ['Menu', '[data-slot=menu]'],
      ['Link', '[data-slot=link]'],
    ] as const) {
      const { container } = renderDsl({ type, props: { ...COMMON_PROPS } });
      expectCommonProps(container.querySelector(selector));
    }
  });
});
