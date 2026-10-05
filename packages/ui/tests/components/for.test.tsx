// @vitest-environment jsdom
/**
 * For 循环渲染组件契约：逐项渲染 DSL 模板并注入 { row, rowIndex } 作用域、
 * 网格模式（columns/gap/before）、keyField、非数组容错、行内事件作用域。
 */
import './setup.js';

import type { DslNode } from '@pactor-app/core';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { expectEventState, renderDsl } from './helpers.js';

const ITEMS = [
  { code: 'openai', name: 'OpenAI' },
  { code: 'deepseek', name: 'DeepSeek' },
];

/** 最小可用模板：文本 + 触发 setState 的按钮（验证行作用域事件） */
function listNode(forProps: Record<string, unknown>): DslNode {
  return {
    type: 'For',
    props: { items: ITEMS, keyField: 'code', ...forProps },
    children: [
      {
        type: 'Button',
        props: { text: '${row.name}' },
        events: {
          onClick: [{ action: 'setState', params: { picked: '${row.code}' } }],
        },
      },
    ],
  } as unknown as DslNode;
}

describe('For', () => {
  it('平铺模式：逐项渲染模板，${row.x} 在行作用域求值', () => {
    renderDsl(listNode({}));

    expect(screen.getByText('OpenAI')).toBeTruthy();
    expect(screen.getByText('DeepSeek')).toBeTruthy();
  });

  it('items 非数组时不渲染', () => {
    const { container } = renderDsl({
      type: 'For',
      props: { items: 'not-an-array' },
      children: [{ type: 'Text', props: { text: 'x' } }],
    } as unknown as DslNode);

    expect(container.textContent).toBe('');
  });

  it('网格模式：columns/gap 生成与 Grid 一致的容器', () => {
    const { container } = renderDsl(listNode({ columns: 3, gap: 16 }));

    const grid = container.querySelector('[data-slot=grid]');
    expect(grid).not.toBeNull();
    expect(grid!.getAttribute('data-columns')).toBe('3');
    expect((grid as HTMLElement).style.gap).toBe('16px');
    expect(container.querySelectorAll('[data-slot=grid-item]').length).toBe(2);
  });

  it('before 槽位：静态内容渲染为网格首格', () => {
    const node = {
      type: 'For',
      props: {
        items: ITEMS,
        columns: 2,
        before: [{ type: 'Text', props: { text: '新建卡' } }],
      },
      children: [{ type: 'Text', props: { text: '${row.name}' } }],
    } as unknown as DslNode;
    const { container } = renderDsl(node);

    const cells = container.querySelectorAll('[data-slot=grid-item]');
    expect(cells.length).toBe(3);
    expect(cells[0].textContent).toBe('新建卡');
    expect(cells[1].textContent).toBe('OpenAI');
  });

  it('行内事件在 row 作用域求值（onClick 携带当前行数据）', async () => {
    const { context } = renderDsl(listNode({}));

    fireEvent.click(screen.getByText('DeepSeek'));
    await expectEventState(context, 'picked', 'deepseek');
  });
});
