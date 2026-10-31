// @vitest-environment jsdom
import './setup.js';

import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { expectEventState, renderDsl } from './helpers.js';

const FORM_CHILDREN = [
  {
    type: 'Input',
    props: {
      name: 'username',
      label: '用户名',
      rules: [{ required: true, message: '请输入用户名' }],
    },
  },
  {
    type: 'Select',
    props: {
      name: 'role',
      label: '角色',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '成员', value: 'member' },
      ],
    },
  },
];

describe('FormModal DSL', () => {
  it('受控 open：渲染标题与 children 表单项，默认按钮文案', async () => {
    renderDsl(
      {
        type: 'FormModal',
        props: {
          open: '${state.open}',
          title: '新建成员',
          description: '填写成员信息',
        },
        children: FORM_CHILDREN,
      },
      { state: { open: true } },
    );

    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.getByText('新建成员')).toBeTruthy();
    expect(screen.getByText('填写成员信息')).toBeTruthy();
    expect(screen.getByText('用户名')).toBeTruthy();
    expect(screen.getByText('角色')).toBeTruthy();
    expect(screen.getByRole('button', { name: '取消' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '提交' })).toBeTruthy();
  });

  it('open 为 false 时不渲染弹层', () => {
    renderDsl(
      { type: 'FormModal', props: { open: '${state.open}', title: '新建成员' } },
      { state: { open: false } },
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('cancelText / submitText 自定义按钮文字', async () => {
    renderDsl(
      {
        type: 'FormModal',
        props: {
          open: true,
          title: '编辑',
          cancelText: '放弃',
          submitText: '保存',
        },
        children: FORM_CHILDREN,
      },
      { state: {} },
    );

    expect(await screen.findByRole('button', { name: '放弃' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '保存' })).toBeTruthy();
  });

  it('取消按钮触发 onCancel（${event} 无关，动作自行 setState 关闭）', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl(
      {
        type: 'FormModal',
        props: { open: '${state.open}', title: '新建成员' },
        children: FORM_CHILDREN,
        events: {
          onCancel: {
            action: 'setState',
            params: { open: false, cancelled: true },
          },
        },
      },
      { state: { open: true } },
    );

    await user.click(await screen.findByRole('button', { name: '取消' }));
    await expectEventState(context, 'cancelled', true);
    // 受控：setState open=false 后弹层关闭
    await expectEventState(context, 'open', false);
  });

  it('未绑定 onCancel 时取消按钮回退触发 onClose', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl(
      {
        type: 'FormModal',
        props: { open: true, title: '新建成员' },
        children: FORM_CHILDREN,
        events: {
          onClose: { action: 'setState', params: { closed: true } },
        },
      },
      { state: {} },
    );

    await user.click(await screen.findByRole('button', { name: '取消' }));
    await expectEventState(context, 'closed', true);
  });

  it('X 关闭按钮触发 onClose', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl(
      {
        type: 'FormModal',
        props: { open: true, title: '新建成员' },
        children: FORM_CHILDREN,
        events: {
          onClose: { action: 'setState', params: { closed: true } },
        },
      },
      { state: {} },
    );

    await user.click(await screen.findByRole('button', { name: 'Close' }));
    await expectEventState(context, 'closed', true);
  });

  it('提交校验失败：必填缺失时阻止提交并展示错误', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl(
      {
        type: 'FormModal',
        props: { open: true, title: '新建成员' },
        children: FORM_CHILDREN,
        events: {
          onSubmit: { action: 'setState', params: { submitted: '${event}' } },
        },
      },
      { state: {} },
    );

    await user.click(await screen.findByRole('button', { name: '提交' }));
    expect(await screen.findByText('请输入用户名')).toBeTruthy();
    expect(context.state.get('submitted')).toBeUndefined();
  });

  it('填写后提交：onSubmit 经 ${event} 传出 values', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl(
      {
        type: 'FormModal',
        props: { open: true, title: '新建成员' },
        children: FORM_CHILDREN,
        events: {
          onSubmit: { action: 'setState', params: { submitted: '${event}' } },
        },
      },
      { state: {} },
    );

    await user.type(await screen.findByRole('textbox'), '张三');
    await user.click(screen.getByRole('button', { name: '提交' }));
    await expectEventState(context, 'submitted', { username: '张三' });
  });

  it('非受控（defaultOpen）：取消内部关闭，不依赖事件', async () => {
    const user = userEvent.setup();
    renderDsl(
      { type: 'FormModal', props: { defaultOpen: true, title: '新建成员' } },
      { state: {} },
    );

    expect(await screen.findByRole('dialog')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: '取消' }));
    // Base UI 弹层关闭带动画，等 dialog 从 DOM 移除
    await screen.findByRole('button', { name: '取消' }).catch(() => null);
    await new Promise((r) => setTimeout(r, 300));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('i18n en-US：Cancel / Submit', async () => {
    renderDsl(
      { type: 'FormModal', props: { open: true, title: 'Add member' } },
      { state: {}, locale: 'en-US' },
    );

    expect(await screen.findByRole('button', { name: 'Cancel' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeTruthy();
  });

  it('initialValues 回填：打开弹层时表单字段带出默认数据（编辑场景）', async () => {
    renderDsl(
      {
        type: 'FormModal',
        props: {
          open: true,
          title: '编辑成员',
          initialValues: { username: '李四', role: 'admin' },
        },
        children: FORM_CHILDREN,
      },
      { state: {} },
    );

    expect(await screen.findByRole('dialog')).toBeTruthy();
    const username = screen.getByRole('textbox') as HTMLInputElement;
    expect(username.value).toBe('李四');
    // Select 选中项文案渲染
    expect(screen.getByText('管理员')).toBeTruthy();
  });

  it('重开取最新 initialValues：切换编辑记录后重新打开，表单重建为新值', async () => {
    const { context } = renderDsl(
      {
        type: 'FormModal',
        props: {
          open: '${state.open}',
          title: '编辑成员',
          initialValues: '${state.editing}',
        },
        children: FORM_CHILDREN,
      },
      { state: { open: false, editing: { username: '张三' } } },
    );

    expect(screen.queryByRole('dialog')).toBeNull();

    // 打开：回填记录 A
    act(() => context.state.set('open', true));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('张三');

    // 关闭并切换记录后重开：回填记录 B
    act(() => {
      context.state.set('open', false);
      context.state.set('editing', { username: '李四', role: 'member' });
    });
    await vi.waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
    act(() => context.state.set('open', true));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('李四');
  });

  it('开启期间 initialValues 变化：异步记录加载完成后同步写入表单', async () => {
    const { context } = renderDsl(
      {
        type: 'FormModal',
        props: {
          open: true,
          title: '编辑成员',
          initialValues: '${state.editing}',
        },
        children: FORM_CHILDREN,
      },
      { state: { editing: {} } },
    );

    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');

    // 模拟异步加载完成：editing 到达，表单字段同步
    act(() => context.state.set('editing', { username: '王五', role: 'admin' }));
    await vi.waitFor(() => {
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('王五');
    });
  });

  it('编辑后提交：修改回填值，onSubmit 传出合并后的 values', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl(
      {
        type: 'FormModal',
        props: {
          open: true,
          title: '编辑成员',
          initialValues: { username: '李四', role: 'admin' },
        },
        children: FORM_CHILDREN,
        events: {
          onSubmit: { action: 'setState', params: { submitted: '${event}' } },
        },
      },
      { state: {} },
    );

    const username = await screen.findByRole('textbox');
    await user.clear(username);
    await user.type(username, '李四改');
    await user.click(screen.getByRole('button', { name: '提交' }));
    await expectEventState(context, 'submitted', {
      username: '李四改',
      role: 'admin',
    });
  });

  it('复杂布局：children 内 Grid 多列表单项，提交传出全部 values', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl(
      {
        type: 'FormModal',
        props: { open: true, title: '新建成员' },
        children: [
          {
            type: 'Grid',
            props: { columns: 2, gap: 12 },
            children: [
              { type: 'Input', props: { name: 'firstName', label: '名' } },
              { type: 'Input', props: { name: 'lastName', label: '姓' } },
            ],
          },
          { type: 'Input', props: { name: 'email', label: '邮箱' } },
        ],
        events: {
          onSubmit: { action: 'setState', params: { submitted: '${event}' } },
        },
      },
      { state: {} },
    );

    // Grid 布局生效，表单项 label 渲染（Dialog portal 到 body，用 document 查询）
    expect(document.querySelector('[data-slot=grid][data-columns="2"]')).not.toBeNull();
    expect(screen.getByText('名')).toBeTruthy();
    expect(screen.getByText('姓')).toBeTruthy();
    expect(screen.getByText('邮箱')).toBeTruthy();

    const [first, last, email] = await screen.findAllByRole('textbox');
    await user.type(first!, '三');
    await user.type(last!, '张');
    await user.type(email!, 'zhangsan@example.com');
    await user.click(screen.getByRole('button', { name: '提交' }));
    await expectEventState(context, 'submitted', {
      firstName: '三',
      lastName: '张',
      email: 'zhangsan@example.com',
    });
  });
});
