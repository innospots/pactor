// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionEngine } from '@pactor-app/runtime';
import { describe, expect, it, vi } from 'vitest';

import { Input } from '../../src/components/index.js';
import { renderDsl } from './helpers.js';

describe('表单联动 form.setValues', () => {
  it('按 name 寻址写入字段值，不触发 onValuesChange 与校验', async () => {
    const { context } = renderDsl({
      type: 'Form',
      props: { name: 'edit' },
      events: {
        onValuesChange: { action: 'setState', params: { touched: true } },
      },
      children: [
        {
          type: 'Input',
          props: {
            name: 'city',
            label: '城市',
            value: '杭州',
            rules: [{ required: true, message: '必填' }],
          },
        },
      ],
    });

    expect(screen.getByLabelText('城市')).toHaveProperty('value', '杭州');

    const engine = new ActionEngine(context);
    const result = await engine.execute({
      action: 'form.setValues',
      params: { form: 'edit', values: { city: '' } },
    });

    expect(result.ok).toBe(true);
    await vi.waitFor(() => {
      expect(screen.getByLabelText('城市')).toHaveProperty('value', '');
    });
    // 不触发 onValuesChange（避免联动循环）
    expect(context.state.get('touched')).toBeUndefined();
    // 不触发校验错误展示
    expect(screen.queryByText('必填')).toBeNull();
  });

  it('卸载后句柄注销，动作受控失败', async () => {
    const { context, unmount } = renderDsl({
      type: 'Form',
      children: [{ type: 'Input', props: { name: 'city' } }],
    });

    expect(context.forms.has('default')).toBe(true);
    unmount();
    expect(context.forms.has('default')).toBe(false);

    const engine = new ActionEngine(context);
    const result = await engine.execute({
      action: 'form.setValues',
      params: { values: { city: 'x' } },
    });
    expect(result.ok).toBe(false);
  });
});

describe('表单提交桥 form.submit', () => {
  it('DOM 外按钮经 form.submit 触发校验与 onSubmit 链路', async () => {
    const { context } = renderDsl({
      type: 'Flex',
      props: { direction: 'vertical', gap: 8 },
      children: [
        {
          type: 'Form',
          props: { name: 'edit' },
          events: {
            onSubmit: { action: 'setState', params: { saved: true } },
          },
          children: [
            {
              type: 'Input',
              props: {
                name: 'city',
                label: '城市',
                rules: [{ required: true, message: '必填' }],
              },
            },
          ],
        },
        // 提交按钮在 <form> DOM 外（Drawer footer 槽位场景）
        {
          type: 'Button',
          props: { text: '保存', variant: 'primary' },
          events: {
            onClick: { action: 'form.submit', params: { form: 'edit' } },
          },
        },
      ],
    });

    // 空值提交：显示校验错误，不触发 onSubmit
    fireEvent.click(screen.getByRole('button', { name: '保存' }));
    expect(await screen.findByText('必填')).toBeTruthy();
    expect(context.state.get('saved')).toBeUndefined();

    // 填值后提交：走 onSubmit 链路
    fireEvent.change(screen.getByLabelText('城市'), { target: { value: '杭州' } });
    fireEvent.click(screen.getByRole('button', { name: '保存' }));
    await vi.waitFor(() => {
      expect(context.state.get('saved')).toBe(true);
    });
  });

  it('目标表单未注册时受控失败', async () => {
    const { context } = renderDsl({
      type: 'Form',
      children: [{ type: 'Input', props: { name: 'city' } }],
    });

    const engine = new ActionEngine(context);
    const result = await engine.execute({
      action: 'form.submit',
      params: { form: 'ghost' },
    });
    expect(result.ok).toBe(false);
  });
});

describe('字段自动包装', () => {
  it('Form 内声明 name 的 Input 渲染为带标签的表单项', () => {
    const { container } = renderDsl({
      type: 'Form',
      children: [
        { type: 'Input', props: { name: 'keyword', label: '关键词' } },
      ],
    });

    expect(screen.getByText('关键词')).toBeTruthy();
    expect(container.querySelector('[data-slot=form-item]')).not.toBeNull();
    // label 与控件关联（label htmlFor ↔ input id，useId 生成）
    expect(screen.getByLabelText('关键词')).toBeTruthy();
  });

  it('独立 Input 以受控值渲染，输入触发 onChange 事件', async () => {
    const { context } = renderDsl({
      type: 'Input',
      props: { value: '初始值', placeholder: '请输入' },
      events: {
        onChange: { action: 'setState', params: { text: '${event}' } },
      },
    });

    const input = screen.getByPlaceholderText('请输入');
    expect(input).toHaveProperty('value', '初始值');

    fireEvent.change(input, { target: { value: '新值' } });
    await vi.waitFor(() => {
      expect(context.state.get('text')).toBe('新值');
    });
  });

  it('不在 Form 内的 Input 不包装表单项', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Input value="x" onChange={(v) => onChange(v)} />,
    );

    expect(container.querySelector('[data-slot=form-item]')).toBeNull();
    fireEvent.change(container.querySelector('input')!, {
      target: { value: 'y' },
    });
    // 事件回调收到 string 而非原生 event
    expect(onChange).toHaveBeenCalledWith('y');
  });

  it('rules 含 required 时 label 自动渲染必填星号（Field 语义）', () => {
    const { container } = renderDsl({
      type: 'Form',
      children: [
        {
          type: 'Input',
          props: {
            name: 'keyword',
            label: '关键词',
            rules: [{ required: true, message: '必填' }],
          },
        },
        { type: 'Input', props: { name: 'remark', label: '备注' } },
      ],
    });

    const [requiredItem, plainItem] = [
      ...container.querySelectorAll('[data-slot=form-item]'),
    ];
    // 必填项：label 同级前有 aria-hidden 星号；非必填项无
    expect(
      requiredItem!.querySelector('[aria-hidden]')?.textContent,
    ).toBe('*');
    expect(plainItem!.querySelector('[aria-hidden]')).toBeNull();
    // label 文本不受星号干扰（htmlFor 关联仍可 getByLabelText）
    expect(screen.getByLabelText('关键词')).toBeTruthy();
    expect(screen.getByLabelText('备注')).toBeTruthy();
    // 星号与 label 同字号同行高（text-sm leading-normal），label 行高度
    // 不因必填星号而高于非必填项
    const star = requiredItem!.querySelector('[aria-hidden]')!;
    const requiredLabel = requiredItem!.querySelector('label')!;
    for (const cls of ['text-sm', 'leading-normal']) {
      expect(star.className).toContain(cls);
      expect(requiredLabel.className).toContain(cls);
    }
    expect(plainItem!.querySelector('label')!.className).toContain(
      'leading-normal',
    );
    // 根节点为 Base UI Field Root（自动嵌套 Field，保留 form-item 槽名）
    expect(requiredItem!.getAttribute('data-slot')).toBe('form-item');
  });

  it('手动 Field 嵌套（旧写法）升级兼容：label 不重复、外层间距不叠加、校验错误照常', async () => {
    const { container } = renderDsl({
      type: 'Form',
      props: { name: 'nested' },
      children: [
        {
          type: 'Field',
          props: { label: '金额', description: '单位：元' },
          children: [
            {
              type: 'Input',
              props: {
                name: 'amount',
                placeholder: '请输入金额',
                rules: [{ required: true, message: '请输入金额' }],
              },
            },
          ],
        },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    // label 只渲染一次（Field 的；控件未声明 label，内层 form-item 无 label）
    expect(screen.getAllByText('金额').length).toBe(1);
    expect(screen.getByText('单位：元')).toBeTruthy();
    // 内层自动 form-item 检测到手Field 后去掉 mb-2 外层间距（防叠加）
    const inner = container.querySelector('[data-slot=form-item]')!;
    expect(inner.className).not.toContain('mb-2');

    // 校验错误仍在内层 form-item 展示
    fireEvent.click(screen.getByText('提交'));
    await vi.waitFor(() => {
      expect(screen.getByText('请输入金额')).toBeTruthy();
    });
  });

  it('layout: horizontal 时手动 Field 的 label 与控件同行展示（逐行排布）', () => {
    const { container } = renderDsl({
      type: 'Form',
      props: { layout: 'horizontal' },
      children: [
        {
          type: 'Field',
          props: { label: '类型' },
          children: [{ type: 'Input', props: { placeholder: 'x' } }],
        },
        {
          type: 'Field',
          props: { label: '关键字' },
          children: [{ type: 'Input', props: { placeholder: 'y' } }],
        },
      ],
    });

    // 同行排布：Field 根节点覆盖默认 flex-col 为 flex-row；逐行带 mb-2
    const fields = [...container.querySelectorAll('[data-slot=field]')];
    expect(fields).toHaveLength(2);
    for (const field of fields) {
      expect(field!.className).toContain('flex-row');
      expect(field!.className).toContain('items-center');
      expect(field!.className).toContain('mb-2');
    }
  });
});

describe('输入类型 type', () => {
  it('缺省渲染明文文本输入', () => {
    renderDsl({
      type: 'Form',
      children: [
        { type: 'Input', props: { name: 'keyword', label: '关键词' } },
      ],
    });

    const input = screen.getByLabelText('关键词');
    expect(input).toHaveProperty('type', 'text');
  });

  it('Form 内 type: password 渲染 type="password" 的 input', () => {
    const { container } = renderDsl({
      type: 'Form',
      children: [
        {
          type: 'Input',
          props: { name: 'password', label: '密码', type: 'password' },
        },
      ],
    });

    expect(container.querySelector('input[type="password"]')).not.toBeNull();
    expect(screen.getByLabelText('密码')).toHaveProperty('type', 'password');
  });

  it('独立 type: password 掩码渲染且 onChange 传 string', async () => {
    const { container, context } = renderDsl({
      type: 'Input',
      props: { type: 'password', placeholder: '请输入密码' },
      events: {
        onChange: { action: 'setState', params: { secret: '${event}' } },
      },
    });

    const input = container.querySelector('input[type="password"]')!;
    expect(input).not.toBeNull();
    fireEvent.change(input, { target: { value: 's3cret' } });
    await vi.waitFor(() => {
      expect(context.state.get('secret')).toBe('s3cret');
    });
  });
});

describe('校验规则', () => {
  it('required 校验失败：显示错误且不触发 onSubmit', async () => {
    const { context } = renderDsl({
      type: 'Form',
      events: {
        onSubmit: { action: 'setState', params: { submitted: true } },
      },
      children: [
        {
          type: 'Input',
          props: {
            name: 'keyword',
            label: '关键词',
            rules: [{ required: true, message: '必填' }],
          },
        },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await screen.findByText('必填');
    expect(context.state.get('submitted')).toBeUndefined();
    expect(context.state.get('form')).toBeUndefined();
  });
});

describe('提交事件与 form 作用域', () => {
  it('提交成功：onSubmit 收到 values（event 作用域），values 写入 state.form', async () => {
    const { context } = renderDsl({
      type: 'Form',
      events: {
        onSubmit: {
          action: 'setState',
          params: { submitted: '${event.keyword}' },
        },
      },
      children: [
        { type: 'Input', props: { name: 'keyword', label: '关键词' } },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    fireEvent.change(screen.getByLabelText('关键词'), {
      target: { value: '手机' },
    });
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('submitted')).toBe('手机');
    });
    expect(context.state.get('form')).toEqual({ keyword: '手机' });
  });

  it('提交后 ${form.keyword} 表达式在页面其他组件可用', async () => {
    renderDsl({
      type: 'Page',
      children: [
        {
          type: 'Form',
          children: [
            { type: 'Input', props: { name: 'keyword', label: '关键词' } },
            { type: 'Button', props: { text: '提交', submit: true } },
          ],
        },
        { type: 'Alert', props: { message: '已提交：${form.keyword}' } },
      ],
    });

    fireEvent.change(screen.getByLabelText('关键词'), {
      target: { value: '手机' },
    });
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await screen.findByText('已提交：手机');
  });
});

describe('Form 初始值', () => {
  it('字段级初始值：Form 内 Input 的 value 作为初始显示值', () => {
    renderDsl({
      type: 'Form',
      children: [
        {
          type: 'Input',
          props: { name: 'name', label: '客户名称', value: '云栖科技' },
        },
      ],
    });

    expect(screen.getByLabelText('客户名称')).toHaveProperty(
      'value',
      '云栖科技',
    );
  });

  it('initialValues 回填：字段初始显示 initialValues[name]', () => {
    renderDsl({
      type: 'Form',
      props: { initialValues: { phone: '13800000001' } },
      children: [
        { type: 'Input', props: { name: 'phone', label: '联系电话' } },
      ],
    });

    expect(screen.getByLabelText('联系电话')).toHaveProperty(
      'value',
      '13800000001',
    );
  });

  it('Select 字段级初始值：未打开下拉时触发器显示选中项 label', () => {
    renderDsl({
      type: 'Form',
      children: [
        {
          type: 'Select',
          props: {
            name: 'level',
            label: '等级',
            value: 'A',
            options: [
              { label: 'A 级', value: 'A' },
              { label: 'B 级', value: 'B' },
            ],
          },
        },
      ],
    });

    // Base UI Select 经 Root items 做 value→label 映射：未渲染过 popup 的
    // 选中项也能在触发器显示 label（原 Radix Select.Value 坑的对应场景）
    expect(screen.getByRole('combobox').textContent).toContain('A 级');
  });

  it('字段级优先：字段 value 覆盖 initialValues[name]', () => {
    renderDsl({
      type: 'Form',
      props: { initialValues: { name: 'A' } },
      children: [
        {
          type: 'Input',
          props: { name: 'name', label: '客户名称', value: 'B' },
        },
      ],
    });

    expect(screen.getByLabelText('客户名称')).toHaveProperty('value', 'B');
  });

  it('初始值参与提交与 required 校验：未触碰字段以初始值提交', async () => {
    const { context } = renderDsl({
      type: 'Form',
      props: { initialValues: { phone: '13800000001' } },
      children: [
        {
          type: 'Input',
          props: {
            name: 'phone',
            label: '联系电话',
            rules: [{ required: true, message: '必填' }],
          },
        },
        { type: 'Input', props: { name: 'name', label: '客户名称' } },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    // 只修改客户名称；phone 未触碰但带初始值，required 校验应通过
    fireEvent.change(screen.getByLabelText('客户名称'), {
      target: { value: '云栖科技' },
    });
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({
        phone: '13800000001',
        name: '云栖科技',
      });
    });
  });
});

describe('Select 选项', () => {
  const manyOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `城市${i + 1}号`,
    value: `c${i + 1}`,
  }));

  it('选项 > 10 时默认展示搜索框，输入过滤选项；过滤后仍可选择', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'Select',
      props: { options: manyOptions },
      events: {
        onChange: { action: 'setState', params: { picked: '${event}' } },
      },
    });

    await user.click(screen.getByRole('combobox'));
    const search = await screen.findByLabelText('搜索选项');
    await user.type(search, '城市12');

    expect(screen.queryByRole('option', { name: '城市1号' })).toBeNull();
    await user.click(screen.getByRole('option', { name: '城市12号' }));
    await vi.waitFor(() => {
      expect(context.state.get('picked')).toBe('c12');
    });
  });

  it('选项 ≤ 10 时默认不展示搜索框', async () => {
    const user = userEvent.setup();
    renderDsl({
      type: 'Select',
      props: {
        options: [
          { label: '选项一', value: 'a' },
          { label: '选项二', value: 'b' },
        ],
      },
    });

    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('option', { name: '选项一' });
    expect(screen.queryByLabelText('搜索选项')).toBeNull();
  });

  it('showSearch: true 少数选项也展示；showSearch: false 多数选项也不展示', async () => {
    const user = userEvent.setup();
    const few = renderDsl({
      type: 'Select',
      props: {
        showSearch: true,
        options: [{ label: '选项一', value: 'a' }],
      },
    });
    await user.click(screen.getByRole('combobox'));
    expect(await screen.findByLabelText('搜索选项')).toBeTruthy();
    few.unmount();

    renderDsl({
      type: 'Select',
      props: { showSearch: false, options: manyOptions },
    });
    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('option', { name: '城市1号' });
    expect(screen.queryByLabelText('搜索选项')).toBeNull();
  });

  it('搜索无匹配时展示空文案', async () => {
    const user = userEvent.setup();
    renderDsl({
      type: 'Select',
      props: { options: manyOptions },
    });

    await user.click(screen.getByRole('combobox'));
    const search = await screen.findByLabelText('搜索选项');
    // 弹层打开动画期间 popup 短暂 pointer-events: none，直接走 change 事件
    fireEvent.change(search, { target: { value: '不存在的城市' } });
    expect(await screen.findByText('无匹配结果')).toBeTruthy();
  });

  it('渲染 options 并在选择后经 onChange 传出 value', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'Select',
      props: {
        placeholder: '请选择',
        options: [
          { label: '选项一', value: 'a' },
          { label: '选项二', value: 'b' },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { picked: '${event}' } },
      },
    });

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: '选项二' }));

    await vi.waitFor(() => {
      expect(context.state.get('picked')).toBe('b');
    });
  });

  it('onChange 传出原始 value 类型（number 不退化为 string）', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'Select',
      props: {
        options: [
          { label: '一档', value: 1 },
          { label: '二档', value: 2 },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { level: '${event}' } },
      },
    });

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: '二档' }));

    await vi.waitFor(() => {
      expect(context.state.get('level')).toBe(2);
    });
  });

  it('disabled 选项标记 data-disabled 且点击不触发 onChange', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'Select',
      props: {
        options: [
          { label: '可选', value: 'a' },
          { label: '禁用项', value: 'b', disabled: true },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { picked: '${event}' } },
      },
    });

    await user.click(screen.getByRole('combobox'));
    const disabledOption = await screen.findByRole('option', { name: '禁用项' });
    expect(disabledOption.hasAttribute('data-disabled')).toBe(true);

    await user.click(disabledOption);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(context.state.get('picked')).toBeUndefined();
  });

  it('Form 内声明 name 的 Select 自动包装为表单项', () => {
    const { container } = renderDsl({
      type: 'Form',
      children: [
        {
          type: 'Select',
          props: {
            name: 'city',
            label: '城市',
            options: [{ label: '杭州', value: 'hz' }],
          },
        },
      ],
    });

    expect(screen.getByText('城市')).toBeTruthy();
    expect(container.querySelector('[data-slot=form-item]')).not.toBeNull();
  });

  it('items 映射：选中值对应 item 未渲染过 popup 时触发器显示 label（独立受控值）', () => {
    // 独立于 Form 的受控值场景：number 值经 items 映射出 label，
    // 全程未打开下拉（popup 从未渲染）
    renderDsl({
      type: 'Select',
      props: {
        value: 2,
        options: [
          { label: '一档', value: 1 },
          { label: '二档', value: 2 },
        ],
      },
    });

    const trigger = screen.getByRole('combobox');
    expect(trigger.textContent).toContain('二档');
    expect(document.querySelector('[data-slot=select-content]')).toBeNull();
  });

  it('表单项 label 经 htmlFor 与触发器 id 关联', () => {
    const { container } = renderDsl({
      type: 'Form',
      children: [
        {
          type: 'Select',
          props: {
            name: 'city',
            label: '城市',
            options: [{ label: '杭州', value: 'hz' }],
          },
        },
      ],
    });

    const formItem = container.querySelector('[data-slot=form-item]')!;
    const formLabel = formItem.querySelector('label')!;
    const trigger = formItem.querySelector('[data-slot=select-trigger]')!;
    expect(formLabel.getAttribute('for')).toBeTruthy();
    expect(formLabel.getAttribute('for')).toBe(trigger.id);
  });

  it('表单项 label 经 htmlFor 与 input id 关联', () => {
    const { container } = renderDsl({
      type: 'Form',
      children: [
        { type: 'Input', props: { name: 'keyword', label: '关键词' } },
      ],
    });

    const formItem = container.querySelector('[data-slot=form-item]')!;
    const formLabel = formItem.querySelector('label')!;
    const input = formItem.querySelector('input')!;
    expect(formLabel.getAttribute('for')).toBeTruthy();
    expect(formLabel.getAttribute('for')).toBe(input.id);
  });
});

describe('Select 宽度', () => {
  it('Form 内控件占满整行（w-full），独立渲染保持内容自然宽度', () => {
    const { container } = renderDsl({
      type: 'Form',
      children: [
        {
          type: 'Select',
          props: {
            name: 'type',
            label: '类型',
            options: [{ label: 'X', value: 'x' }],
          },
        },
      ],
    });

    const trigger = container.querySelector('[data-slot=select-trigger]');
    expect(trigger?.className).toContain('w-full');
    expect(trigger?.closest('span')?.className).toContain('w-full');

    const standalone = renderDsl({
      type: 'Select',
      props: { options: [{ label: 'X', value: 'x' }] },
    });
    const standaloneTrigger = standalone.container.querySelector(
      '[data-slot=select-trigger]',
    );
    // 触发器恒为 w-full（tailwind-merge 覆盖基类 w-fit）；独立渲染时
    // 外层包裹节点为内容尺寸（inline-flex），w-full 退化为自然宽度
    expect(standaloneTrigger?.className).toContain('w-full');
    expect(standaloneTrigger?.className).not.toContain('w-fit');
    expect(standaloneTrigger?.closest('span')?.className).toContain(
      'inline-flex',
    );
  });
});

describe('Input maxLength', () => {
  it('独立渲染透传原生 maxLength', () => {
    renderDsl({
      type: 'Input',
      props: { maxLength: 12, placeholder: '限长输入' },
    });
    const input = screen.getByPlaceholderText('限长输入') as HTMLInputElement;
    expect(input.maxLength).toBe(12);
  });

  it('Form 内透传 maxLength 并限制输入长度', async () => {
    renderDsl({
      type: 'Form',
      children: [
        { type: 'Input', props: { name: 'code', label: '编码', maxLength: 4 } },
      ],
    });
    const input = screen.getByLabelText('编码') as HTMLInputElement;
    expect(input.maxLength).toBe(4);
    await userEvent.type(input, 'abcdef');
    expect(input.value).toBe('abcd');
  });
});
