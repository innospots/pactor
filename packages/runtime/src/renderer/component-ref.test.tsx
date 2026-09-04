// @vitest-environment jsdom
/**
 * 命名组件引用（PageDsl.components + DslNode.component）：
 * 按 key 解析子树、继承引用处作用域、props 覆盖、循环守卫
 */
import type { DslNode } from '@pactor-app/core';
import { cleanup, render, screen } from '@testing-library/react';
import type { CSSProperties, ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createRuntimeContext } from '../context/context.js';
import { useRenderer } from './renderer-context.js';
import { DslRenderer } from './renderer.js';

afterEach(cleanup);

const Item = ({ text }: { text?: string }) => <span>{text}</span>;
const Box = ({ children }: { children?: ReactNode }) => (
  <div>{children}</div>
);

/** 模拟 Table 行渲染：对每行以 renderChildren 注入 row / rowIndex */
function Rows({ dslChildren }: { dslChildren?: DslNode[] }) {
  const { renderChildren } = useRenderer();
  return (
    <>
      {[{ id: 1 }, { id: 2 }].map((row, rowIndex) => (
        <div key={row.id}>{renderChildren(dslChildren, { row, rowIndex })}</div>
      ))}
    </>
  );
}

function setup(
  pageComponents: Record<string, DslNode>,
  node: DslNode,
) {
  const context = createRuntimeContext({ pageComponents });
  context.components.register('Item', Item);
  context.components.register('Box', Box);
  context.components.register('Rows', { component: Rows, withScope: true });
  render(<DslRenderer context={context} node={node} />);
  return context;
}

describe('命名组件引用（component 字段）', () => {
  it('按 component key 渲染页面级命名子树', () => {
    setup(
      { pageHeader: { type: 'Item', props: { text: '页头' } } },
      {
        type: 'Box',
        children: [
          { component: 'pageHeader' },
          { type: 'Item', props: { text: '正文' } },
        ],
      },
    );

    expect(screen.getByText('页头')).toBeDefined();
    expect(screen.getByText('正文')).toBeDefined();
  });

  it('继承引用处局部作用域（行模板内 ${row.x} 逐行求值）', () => {
    setup(
      {
        rowTitle: { type: 'Item', props: { text: '行${row.id}' } },
      },
      {
        type: 'Rows',
        // withScope 组件经 dslChildren prop 接收原始子树（renderer 注入）
        children: [{ component: 'rowTitle' }],
      },
    );

    const texts = screen.getAllByText(/^行\d$/).map((el) => el.textContent);
    expect(texts).toEqual(['行1', '行2']);
  });

  it('引用处 props 覆盖子树根节点同名字段', () => {
    setup(
      { panel: { type: 'Item', props: { text: '默认' } } },
      { component: 'panel', props: { text: '覆盖' } },
    );

    expect(screen.getByText('覆盖')).toBeDefined();
    expect(screen.queryByText('默认')).toBeNull();
  });

  it('透传 style 等布局 prop 到子树根组件', () => {
    const Styled = ({
      style,
      children,
    }: {
      style?: CSSProperties;
      children?: ReactNode;
    }) => (
      <div data-testid="panel" style={style}>
        {children}
      </div>
    );
    const context = createRuntimeContext({
      pageComponents: { panel: { type: 'Styled' } },
    });
    context.components.register('Styled', Styled);

    render(
      <DslRenderer
        context={context}
        node={{ component: 'panel', props: { style: { flex: 1 } } }}
      />,
    );

    // jsdom 会把 flex: 1 规范化为 "1 1 0%"，断言展开后的 flexGrow
    expect(screen.getByTestId('panel').style.flexGrow).toBe('1');
  });

  it('component 未定义时渲染 UnsupportedComponent 占位，不抛错', () => {
    setup({}, { component: 'ghost' });

    expect(screen.getByText(/component\(ghost\)/)).toBeDefined();
  });

  it('间接循环引用（a → b → a）受控：不渲染且不抛错', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    setup(
      {
        a: { component: 'b' },
        b: { component: 'a' },
      },
      { component: 'a' },
    );

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('循环'),
    );
    warn.mockRestore();
  });
});
