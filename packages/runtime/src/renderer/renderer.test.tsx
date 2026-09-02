// @vitest-environment jsdom
import type { DslNode } from '@pactor-app/core';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ActionEngine,
  createRuntimeContext,
  registerBuiltinActions,
  type RuntimeContext,
} from '../index.js';
import { DslRenderer } from './renderer.js';
import { useRenderer } from './renderer-context.js';

afterEach(cleanup);

function setup(
  node: DslNode,
  options: Parameters<typeof createRuntimeContext>[0] = {},
): RuntimeContext {
  const context = createRuntimeContext(options);
  render(<DslRenderer context={context} node={node} />);
  return context;
}

describe('基于 Registry 的组件解析', () => {
  it('渲染已注册组件并收到 props', () => {
    const Button = ({ text }: { text?: string }) => <button>{text}</button>;
    const context = createRuntimeContext();
    context.components.register('Button', Button);

    render(
      <DslRenderer
        context={context}
        node={{ type: 'Button', props: { text: '保存' } }}
      />,
    );

    expect(screen.getByRole('button').textContent).toBe('保存');
  });

  it('未注册组件渲染 UnsupportedComponent 占位并展示类型名', () => {
    setup({ type: 'Ghost' });

    const placeholder = screen.getByText(/Unsupported component/);
    expect(placeholder.textContent).toContain('Ghost');
    expect(placeholder.getAttribute('data-pactor-unsupported')).toBe('Ghost');
  });
});

describe('props 深度表达式解析', () => {
  it('表达式 props 求值：混合文本拼接为 string，整体单表达式保留原始类型', () => {
    const received: Record<string, unknown> = {};
    const Probe = (props: Record<string, unknown>) => {
      Object.assign(received, props);
      return <div>probe</div>;
    };
    const context = createRuntimeContext({ state: { count: 42 } });
    context.components.register('Probe', Probe);

    render(
      <DslRenderer
        context={context}
        node={{
          type: 'Probe',
          props: {
            text: '共 ${state.count} 条',
            count: '${state.count}',
            list: ['${state.count}', 'plain'],
            nested: { value: '${state.count}' },
            raw: 7,
          },
        }}
      />,
    );

    expect(received['text']).toBe('共 42 条');
    expect(received['count']).toBe(42);
    expect(received['list']).toEqual([42, 'plain']);
    expect(received['nested']).toEqual({ value: 42 });
    expect(received['raw']).toBe(7);
  });

  it('on* 字符串 prop 不按表达式处理', () => {
    const received: Record<string, unknown> = {};
    const Probe = (props: Record<string, unknown>) => {
      Object.assign(received, props);
      return <div>probe</div>;
    };
    const context = createRuntimeContext({ state: { x: 1 } });
    context.components.register('Probe', Probe);

    render(
      <DslRenderer
        context={context}
        node={{ type: 'Probe', props: { onCustom: '${state.x}' } }}
      />,
    );

    expect(received['onCustom']).toBe('${state.x}');
  });

  it('state 变化触发重渲染，组件收到新 props', async () => {
    const Label = ({ text }: { text?: string }) => <span>{text}</span>;
    const context = createRuntimeContext({ state: { count: 1 } });
    context.components.register('Label', Label);

    render(
      <DslRenderer
        context={context}
        node={{ type: 'Label', props: { text: '共 ${state.count} 条' } }}
      />,
    );
    expect(screen.getByText('共 1 条')).toBeTruthy();

    // 经 setState 动作修改被表达式引用的 state
    registerBuiltinActions(context.actions);
    const engine = new ActionEngine(context);
    await act(async () => {
      await engine.execute({
        action: 'setState',
        params: { count: '${state.count + 1}' },
      });
    });

    expect(screen.getByText('共 2 条')).toBeTruthy();
  });

  it('数据源状态变化触发重渲染', async () => {
    const List = ({ text }: { text?: string }) => <span>{text}</span>;
    const context = createRuntimeContext({
      dataSources: { total: { type: 'static', value: 3 } },
    });
    context.components.register('List', List);

    render(
      <DslRenderer
        context={context}
        node={{ type: 'List', props: { text: '共 ${data.total} 条' } }}
      />,
    );
    expect(screen.getByText('共 条')).toBeTruthy();

    await act(async () => {
      await context.data.load('total');
    });

    expect(screen.getByText('共 3 条')).toBeTruthy();
  });

  it('内嵌 DslNode 子树（带 type 字段）不在父作用域求值，原样保留', () => {
    const received: Record<string, unknown> = {};
    const Probe = (props: Record<string, unknown>) => {
      Object.assign(received, props);
      return <div>probe</div>;
    };
    const context = createRuntimeContext({ state: { x: 1 } });
    context.components.register('Probe', Probe);

    const cell = {
      type: 'Button',
      props: { text: '${row.name}' },
      events: { onClick: { action: 'setState' } },
    };
    render(
      <DslRenderer
        context={context}
        node={{
          type: 'Probe',
          props: {
            columns: [{ title: '共 ${state.x} 条', cell }],
            items: [{ key: 'a', children: [cell] }],
          },
        }}
      />,
    );

    // 列定义本身在父作用域求值
    const columns = received['columns'] as Record<string, unknown>[];
    expect(columns[0]?.['title']).toBe('共 1 条');
    // 内嵌 DslNode 子树原样保留（留待 renderChildren 以局部作用域解析）
    expect(columns[0]?.['cell']).toEqual(cell);
    const items = received['items'] as Record<string, unknown>[];
    expect((items[0]?.['children'] as unknown[])[0]).toEqual(cell);
  });
});

describe('when 条件渲染', () => {
  it('when 为 false 不渲染该节点及其子树', () => {
    const Label = ({ text }: { text?: string }) => <span>{text}</span>;
    const context = createRuntimeContext({ state: { visible: false } });
    context.components.register('Label', Label);

    render(
      <DslRenderer
        context={context}
        node={{
          type: 'Label',
          props: { text: 'hidden' },
          when: '${state.visible}',
        }}
      />,
    );

    expect(screen.queryByText('hidden')).toBeNull();
  });

  it('when 求值为 true 时正常渲染', () => {
    const Label = ({ text }: { text?: string }) => <span>{text}</span>;
    const context = createRuntimeContext({ state: { visible: true } });
    context.components.register('Label', Label);

    render(
      <DslRenderer
        context={context}
        node={{
          type: 'Label',
          props: { text: 'shown' },
          when: { expression: '${state.visible}' },
        }}
      />,
    );

    expect(screen.getByText('shown')).toBeTruthy();
  });
});

describe('events 绑定', () => {
  it('点击触发动作并把事件对象放入 event 作用域', async () => {
    const Button = ({ onClick }: { onClick?: (e: unknown) => void }) => (
      <button onClick={() => onClick?.({ type: 'click' })}>go</button>
    );
    const context = createRuntimeContext({ state: {} });
    context.components.register('Button', Button);
    registerBuiltinActions(context.actions);

    render(
      <DslRenderer
        context={context}
        node={{
          type: 'Button',
          events: {
            onClick: { action: 'setState', params: { last: '${event.type}' } },
          },
        }}
      />,
    );

    screen.getByRole('button').click();
    await vi.waitFor(() => {
      expect(context.state.get('last')).toBe('click');
    });
  });

  it('onClick 多动作按声明顺序串行执行', async () => {
    const order: string[] = [];
    const Button = ({ onClick }: { onClick?: () => void }) => (
      <button onClick={() => onClick?.()}>go</button>
    );
    const context = createRuntimeContext();
    context.components.register('Button', Button);
    context.actions.register('mark', async (action) => {
      const name = String(action.params?.['name']);
      await new Promise((r) => setTimeout(r, name === 'a' ? 20 : 0));
      order.push(name);
      return { ok: true };
    });

    render(
      <DslRenderer
        context={context}
        node={{
          type: 'Button',
          events: {
            onClick: [
              { action: 'mark', params: { name: 'a' } },
              { action: 'mark', params: { name: 'b' } },
            ],
          },
        }}
      />,
    );

    screen.getByRole('button').click();
    await vi.waitFor(() => {
      expect(order).toEqual(['a', 'b']);
    });
  });
});

describe('子作用域扩展', () => {
  it('withScope 组件经 renderChildren 注入行作用域，仅作用于该子树', () => {
    const Cell = ({ text }: { text?: string }) => <span>{text}</span>;
    // 模拟 Table 行渲染：对每行以 renderChildren 注入 row / rowIndex
    const Table = ({ dslChildren }: { dslChildren?: DslNode[] }) => {
      const { renderChildren } = useRenderer();
      const rows = [{ name: '张三' }, { name: '李四' }];
      return (
        <div>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} data-row={rowIndex}>
              {renderChildren(dslChildren, { row, rowIndex })}
            </div>
          ))}
        </div>
      );
    };
    const context = createRuntimeContext();
    context.components.register('Cell', Cell);
    context.components.register('Table', { component: Table, withScope: true });

    render(
      <DslRenderer
        context={context}
        node={{
          type: 'Table',
          children: [
            { type: 'Cell', props: { text: '${row.name} (${rowIndex})' } },
          ],
        }}
      />,
    );

    expect(screen.getByText('张三 (0)')).toBeTruthy();
    expect(screen.getByText('李四 (1)')).toBeTruthy();
  });
});

describe('children 递归渲染', () => {
  it('嵌套 children 按声明顺序渲染', () => {
    const Item = ({ text }: { text?: string }) => <span>{text}</span>;
    const Box = ({ children }: { children?: React.ReactNode }) => (
      <div>{children}</div>
    );
    const context = createRuntimeContext();
    context.components.register('Item', Item);
    context.components.register('Box', Box);

    const { container } = render(
      <DslRenderer
        context={context}
        node={{
          type: 'Box',
          children: [
            { type: 'Item', props: { text: 'first' } },
            {
              type: 'Box',
              children: [{ type: 'Item', props: { text: 'second' } }],
            },
            { type: 'Item', props: { text: 'third' } },
          ],
        }}
      />,
    );

    const texts = Array.from(container.querySelectorAll('span')).map(
      (el) => el.textContent,
    );
    expect(texts).toEqual(['first', 'second', 'third']);
  });
});

describe('permission 组件权限（Component Guard）', () => {
  const Button = (props: { text?: string; disabled?: boolean; readOnly?: boolean }) => (
    <button disabled={props.disabled} data-readonly={props.readOnly}>
      {props.text}
    </button>
  );

  function setupWithPermission(
    node: DslNode,
    granted: string[],
  ): RuntimeContext {
    const context = createRuntimeContext({
      permission: {
        check(permission) {
          const codes = Array.isArray(permission)
            ? permission
            : typeof permission === 'object'
              ? Array.isArray(permission.code)
                ? permission.code
                : [permission.code]
              : [permission];
          return codes.some((code) => granted.includes(code));
        },
      },
    });
    context.components.register('Button', Button);
    render(<DslRenderer context={context} node={node} />);
    return context;
  }

  it('默认隐藏：无权限的节点不出现在渲染结果中', () => {
    setupWithPermission(
      { type: 'Button', props: { text: '编辑' }, permission: 'customer:edit' },
      [],
    );

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('disabled 策略：渲染且注入 disabled: true，优先于 DSL props', () => {
    setupWithPermission(
      {
        type: 'Button',
        props: { text: '编辑', disabled: false },
        permission: { code: 'customer:edit', denied: 'disabled' },
      },
      [],
    );

    const button = screen.getByRole('button');
    expect(button.textContent).toBe('编辑');
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it('readonly 策略：渲染且注入 readOnly: true', () => {
    setupWithPermission(
      {
        type: 'Button',
        props: { text: '编辑' },
        permission: { code: 'customer:edit', denied: 'readonly' },
      },
      [],
    );

    const button = screen.getByRole('button');
    expect(button.getAttribute('data-readonly')).toBe('true');
  });

  it('有权限时正常渲染，无额外注入', () => {
    setupWithPermission(
      {
        type: 'Button',
        props: { text: '编辑' },
        permission: { code: 'customer:edit', denied: 'disabled' },
      },
      ['customer:edit'],
    );

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('data-readonly')).toBeNull();
  });

  it('对象形式未指定 denied 时缺省 hidden', () => {
    setupWithPermission(
      {
        type: 'Button',
        props: { text: '编辑' },
        permission: { code: 'customer:edit' },
      },
      [],
    );

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('数组形式任一命中即放行（hasAny 语义）', () => {
    setupWithPermission(
      {
        type: 'Button',
        props: { text: '编辑' },
        permission: ['customer:delete', 'customer:edit'],
      },
      ['customer:edit'],
    );

    expect(screen.getByRole('button').textContent).toBe('编辑');
  });

  it('默认适配器行为不变：配置 permission 的节点照常渲染', () => {
    const context = createRuntimeContext();
    context.components.register('Button', Button);

    render(
      <DslRenderer
        context={context}
        node={{
          type: 'Button',
          props: { text: '编辑' },
          permission: { code: 'customer:edit', denied: 'disabled' },
        }}
      />,
    );

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.textContent).toBe('编辑');
    expect(button.disabled).toBe(false);
  });
});
