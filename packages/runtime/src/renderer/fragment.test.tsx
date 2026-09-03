// @vitest-environment jsdom
import type { DslNode } from '@pactor-app/core';
import { cleanup, render, screen } from '@testing-library/react';
import type { CSSProperties, ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createRuntimeContext } from '../context/context.js';
import { FragmentComponent } from './fragment.js';
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
  context.components.register('Fragment', FragmentComponent);
  render(<DslRenderer context={context} node={node} />);
  return context;
}

describe('Fragment 页面级命名组件引用', () => {
  it('按 name 渲染页面级组件子树', () => {
    setup(
      { pageHeader: { type: 'Item', props: { text: '页头' } } },
      {
        type: 'Box',
        children: [
          { type: 'Fragment', props: { name: 'pageHeader' } },
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
        children: [{ type: 'Fragment', props: { name: 'rowTitle' } }],
      },
    );

    const texts = screen.getAllByText(/^行\d$/).map((el) => el.textContent);
    expect(texts).toEqual(['行1', '行2']);
  });

  it('name 不存在时渲染 UnsupportedComponent 占位，不抛错', () => {
    setup({}, { type: 'Fragment', props: { name: 'ghost' } });

    expect(screen.getByText(/Unsupported component: Fragment\(ghost\)/)).toBeDefined();
  });

  it('缺少 name 时渲染占位', () => {
    setup({}, { type: 'Fragment' });

    expect(screen.getByText(/Fragment\(missing name\)/)).toBeDefined();
  });

  it('name 之外的 props 透传到子树根节点（引用处覆盖定义处）', () => {
    setup(
      { panel: { type: 'Item', props: { text: '默认' } } },
      { type: 'Fragment', props: { name: 'panel', text: '覆盖' } },
    );

    expect(screen.getByText('覆盖')).toBeDefined();
    expect(screen.queryByText('默认')).toBeNull();
  });

  it('透传 style 等布局 prop 到子树根组件', () => {
    const context = createRuntimeContext({
      pageComponents: {
        panel: { type: 'Box' },
      },
    });
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
    context.components.register('Box', Styled);
    context.components.register('Fragment', FragmentComponent);

    render(
      <DslRenderer
        context={context}
        node={{
          type: 'Fragment',
          props: { name: 'panel', style: { flex: 1 } },
        }}
      />,
    );

    // jsdom 会把 flex: 1 规范化为 "1 1 0%"，断言展开后的 flexGrow
    expect(screen.getByTestId('panel').style.flexGrow).toBe('1');
  });

  it('间接循环引用（a → b → a）受控：不渲染且不抛错', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    setup(
      {
        a: { type: 'Fragment', props: { name: 'b' } },
        b: { type: 'Fragment', props: { name: 'a' } },
      },
      { type: 'Fragment', props: { name: 'a' } },
    );

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('循环引用'),
    );
    warn.mockRestore();
  });
});
