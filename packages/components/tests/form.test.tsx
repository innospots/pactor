// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Input } from '../src/index.js';
import { renderDsl } from './helpers.js';

describe('字段自动包装', () => {
  it('Form 内声明 name 的 Input 渲染为带标签的表单项', () => {
    const { container } = renderDsl({
      type: 'Form',
      children: [
        { type: 'Input', props: { name: 'keyword', label: '关键词' } },
      ],
    });

    expect(screen.getByText('关键词')).toBeTruthy();
    expect(container.querySelector('.ant-form-item')).not.toBeNull();
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

  it('不在 Form 内的 Input 不包装 Form.Item', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Input value="x" onChange={(v) => onChange(v)} />,
    );

    expect(container.querySelector('.ant-form-item')).toBeNull();
    fireEvent.change(container.querySelector('input')!, {
      target: { value: 'y' },
    });
    // 事件回调收到 string 而非原生 event
    expect(onChange).toHaveBeenCalledWith('y');
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

    fireEvent.click(screen.getByRole('button', { name: /提\s*交/ }));

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
    fireEvent.click(screen.getByRole('button', { name: /提\s*交/ }));

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
    fireEvent.click(screen.getByRole('button', { name: /提\s*交/ }));

    await screen.findByText('已提交：手机');
  });
});

describe('Select 选项', () => {
  it('渲染 options 并在选择后经 onChange 传出 value', async () => {
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

    fireEvent.mouseDown(screen.getByText('请选择'));
    fireEvent.click(await screen.findByText('选项二'));

    await vi.waitFor(() => {
      expect(context.state.get('picked')).toBe('b');
    });
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
    expect(container.querySelector('.ant-form-item')).not.toBeNull();
  });
});
