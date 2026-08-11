// @vitest-environment jsdom
import type { PageDsl } from 'pactor-core';
import { createPageRuntime, PageRuntimeView } from 'pactor-runtime';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { createBuiltinComponentRegistry } from '../../src/components/index.js';
import './helpers.js';

/**
 * 端到端：PageRuntime + 内置组件渲染完整 PageDsl。
 * 链路：dataSource autoLoad → Table 渲染 → Form 提交 → state.form / ${form.x}
 * → Table cell 按钮点击 → state.editing 更新。
 */
describe('PageRuntime + 内置组件端到端', () => {
  it('Form 提交 → form 作用域 → Table cell 按钮 → state 更新', async () => {
    const pageDsl: PageDsl = {
      dsl: '1.0',
      page: { id: 'user-list', title: '用户列表' },
      dataSources: {
        users: {
          type: 'static',
          autoLoad: true,
          value: [
            { id: 1, name: '张三' },
            { id: 2, name: '李四' },
          ],
        },
      },
      body: {
        type: 'Page',
        props: { title: '用户列表' },
        children: [
          {
            type: 'Form',
            events: {
              onSubmit: {
                action: 'setState',
                params: { submittedBy: '${event.keyword}' },
              },
            },
            children: [
              { type: 'Input', props: { name: 'keyword', label: '关键词' } },
              { type: 'Button', props: { text: '搜索', submit: true } },
            ],
          },
          { type: 'Alert', props: { message: '当前筛选：${form.keyword}' } },
          {
            type: 'Table',
            props: {
              dataSource: '${data.users}',
              columns: [
                { title: '姓名', dataIndex: 'name' },
                {
                  title: '操作',
                  cell: {
                    type: 'Button',
                    props: { text: '编辑 ${row.name}' },
                    events: {
                      onClick: {
                        action: 'setState',
                        params: { editing: '${row.id}' },
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    };

    const runtime = createPageRuntime(pageDsl, {
      components: createBuiltinComponentRegistry(),
    });
    render(<PageRuntimeView runtime={runtime} />);
    await runtime.initialized;

    // dataSource autoLoad → Table 渲染两行（cell 模板注入 row）
    await screen.findByText('张三');
    expect(screen.getByRole('button', { name: '编辑 李四' })).toBeTruthy();

    // Form 提交 → onSubmit(values) + values 写入 state.form
    fireEvent.change(screen.getByLabelText('关键词'), {
      target: { value: '手机' },
    });
    fireEvent.click(screen.getByRole('button', { name: /搜\s*索/ }));

    await vi.waitFor(() => {
      expect(runtime.context.state.get('form')).toEqual({ keyword: '手机' });
    });
    expect(runtime.context.state.get('submittedBy')).toBe('手机');
    // form 作用域：页面其他组件的 ${form.keyword} 随之更新
    await screen.findByText('当前筛选：手机');

    // Table cell 按钮 → state 更新
    fireEvent.click(screen.getByRole('button', { name: '编辑 李四' }));
    await vi.waitFor(() => {
      expect(runtime.context.state.get('editing')).toBe(2);
    });

    await runtime.destroy();
  });
});
