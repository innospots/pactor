// @vitest-environment jsdom
/**
 * ExpressionEditor 业务组件：模板解析/组合纯函数（导出供单测）+ 两步编辑交互。
 * Base UI 弹层（Popover/Select）依赖 Pointer Capture / ResizeObserver /
 * scrollIntoView，jsdom 未实现，统一由 ./setup.js 补齐。
 */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import './setup.js';
import {
  buildDefaultValues,
  coerceMappingValue,
  composeExpression,
  ExpressionEditor,
  parseExpressionValues,
  parseTemplateSegments,
  resolveMappingOptions,
  textWidthCh,
  validateMappingValue,
} from '../src/components/ExpressionEditor/index.js';

afterEach(cleanup);

const TEMPLATE = 'return ft.period(${a}, ${b}, ${d})';

const mapping = {
  a: { label: '时间窗口', type: 'number', default: 30 },
  b: {
    label: '时间单位',
    type: 'select',
    default: 'DAY',
    options: [
      { label: '天', value: 'DAY' },
      { label: '周', value: 'WEEK' },
      { label: '月', value: 'MONTH' },
    ],
  },
};

describe('parseTemplateSegments', () => {
  it('mapped 占位符切分为 field 片段，未 mapped 保留为文本', () => {
    const segments = parseTemplateSegments(TEMPLATE, mapping);
    expect(segments).toEqual([
      { type: 'text', text: 'return ft.period(' },
      { type: 'field', key: 'a', config: mapping.a },
      { type: 'text', text: ', ' },
      { type: 'field', key: 'b', config: mapping.b },
      { type: 'text', text: ', ${d})' },
    ]);
  });

  it('无占位符时返回单一文本片段', () => {
    expect(parseTemplateSegments('return 1', mapping)).toEqual([
      { type: 'text', text: 'return 1' },
    ]);
  });

  it('{{key}} 占位符与 ${key} 等价（DSL props 内联书写用，避免表达式引擎求值）', () => {
    expect(parseTemplateSegments('return ft.period({{a}}, {{b}})', mapping)).toEqual([
      { type: 'text', text: 'return ft.period(' },
      { type: 'field', key: 'a', config: mapping.a },
      { type: 'text', text: ', ' },
      { type: 'field', key: 'b', config: mapping.b },
      { type: 'text', text: ')' },
    ]);
  });
});

describe('coerceMappingValue', () => {
  it('number 类型转换为数值', () => {
    expect(coerceMappingValue('30', 'number')).toBe(30);
    expect(coerceMappingValue(30, 'number')).toBe(30);
  });

  it('number 类型空串保持空串，非数值保留原串', () => {
    expect(coerceMappingValue('', 'number')).toBe('');
    expect(coerceMappingValue('abc', 'number')).toBe('abc');
  });

  it('其他类型原样返回', () => {
    expect(coerceMappingValue('DAY', 'select')).toBe('DAY');
    expect(coerceMappingValue(undefined, 'select')).toBe('');
  });
});

describe('composeExpression', () => {
  it('mapped 占位符替换为值，未 mapped 保留字面量', () => {
    expect(composeExpression(TEMPLATE, { a: 30, b: 'DAY' }, mapping)).toBe(
      'return ft.period(30, DAY, ${d})',
    );
  });

  it('缺失值替换为空串', () => {
    expect(composeExpression(TEMPLATE, {}, mapping)).toBe('return ft.period(, , ${d})');
  });

  it('{{key}} 占位符同样替换，未 mapped 保留字面量', () => {
    expect(
      composeExpression('return ft.period({{a}}, {{b}}, {{d}})', { a: 30, b: 'DAY' }, mapping),
    ).toBe('return ft.period(30, DAY, {{d}})');
  });
});

describe('buildDefaultValues', () => {
  it('按 default 初始化并按类型转换', () => {
    expect(buildDefaultValues(mapping)).toEqual({ a: 30, b: 'DAY' });
  });

  it('缺 default 时为空串', () => {
    expect(buildDefaultValues({ x: { type: 'input' } })).toEqual({ x: '' });
  });
});

describe('textWidthCh', () => {
  it('ASCII 按 1ch 计', () => {
    expect(textWidthCh('abc')).toBe(3);
  });

  it('CJK 字符按 2ch 计', () => {
    expect(textWidthCh('时间窗口')).toBe(8);
    expect(textWidthCh('a时')).toBe(3);
  });

  it('空串为 0', () => {
    expect(textWidthCh('')).toBe(0);
  });
});

const CYCLE_TEMPLATE =
  'return ft.period(${timeWindow}, "${timeUnit}", "${dimensionField}", "${calcMethod}", ["${calcField}"], "${timeField}", "${calcCondition}")';

const cycleMapping = {
  timeWindow: { label: '时间窗口', type: 'number' },
  timeUnit: {
    label: '时间单位',
    type: 'select',
    options: [
      { label: '分钟', value: 'minute' },
      { label: '小时', value: 'hour' },
      { label: '天', value: 'day' },
      { label: '月', value: 'month' },
    ],
  },
  dimensionField: { label: '周期维度', type: 'select', optionSource: 'fieldOptions' },
  calcMethod: {
    label: '计算方法',
    type: 'select',
    options: [
      { label: '次数', value: 'count' },
      { label: '相关系数', value: 'corr' },
    ],
  },
  calcField: { label: '计算字段', type: 'select', optionSource: 'fieldOptions' },
  timeField: { label: '时间字段', type: 'select', optionSource: 'fieldOptions' },
  calcCondition: { label: '计算条件', type: 'input' },
};

const CYCLE_VALUE =
  'return ft.period(1, "day", "registerIp", "count", ["registerIp"], "actionTime", "actionType == \'REGISTER\'")';

describe('parseExpressionValues', () => {
  it('按模板反向解析出各 mapping 值', () => {
    expect(parseExpressionValues(CYCLE_TEMPLATE, CYCLE_VALUE, cycleMapping)).toEqual({
      timeWindow: 1,
      timeUnit: 'day',
      dimensionField: 'registerIp',
      calcMethod: 'count',
      calcField: 'registerIp',
      timeField: 'actionTime',
      calcCondition: "actionType == 'REGISTER'",
    });
  });

  it('不匹配模板时返回 null', () => {
    expect(
      parseExpressionValues(CYCLE_TEMPLATE, 'return ft.other(1)', cycleMapping),
    ).toBeNull();
  });

  it('空值返回 null', () => {
    expect(parseExpressionValues(CYCLE_TEMPLATE, '', cycleMapping)).toBeNull();
  });

  it('{{key}} 模板可反向解析（round-trip）', () => {
    expect(
      parseExpressionValues(
        'return ft.period({{a}}, {{b}})',
        'return ft.period(30, DAY)',
        mapping,
      ),
    ).toEqual({ a: 30, b: 'DAY' });
  });
});

describe('validateMappingValue', () => {
  const config = {
    label: '时间窗口',
    type: 'number',
    validation: { pattern: '^\\d{1,3}$', message: '请输入 1-3 位数字' },
  };
  const fallback = '输入格式不正确';

  it('pattern 匹配时返回 null', () => {
    expect(validateMappingValue(30, config, fallback)).toBeNull();
    expect(validateMappingValue('7', config, fallback)).toBeNull();
  });

  it('pattern 不匹配时返回 message', () => {
    expect(validateMappingValue(1234, config, fallback)).toBe('请输入 1-3 位数字');
    expect(validateMappingValue('abc', config, fallback)).toBe('请输入 1-3 位数字');
  });

  it('空值跳过校验', () => {
    expect(validateMappingValue('', config, fallback)).toBeNull();
    expect(validateMappingValue(undefined, config, fallback)).toBeNull();
    expect(validateMappingValue(null, config, fallback)).toBeNull();
    expect(validateMappingValue(NaN, config, fallback)).toBeNull();
  });

  it('无 validation 时不校验', () => {
    expect(validateMappingValue('anything', { type: 'input' }, fallback)).toBeNull();
  });

  it('message 缺省时返回默认提示', () => {
    expect(
      validateMappingValue(
        'abc',
        {
          type: 'input',
          validation: { pattern: '^\\d+$' },
        },
        '输入格式不正确',
      ),
    ).toBe('输入格式不正确');
  });

  it('required 子字段留空时返回提示（外层表单无法替模板子字段判空）', () => {
    const requiredConfig = {
      label: '时间窗口',
      type: 'number',
      required: true,
      validation: { pattern: '^\\d{1,3}$', message: '请输入 1-3 位数字' },
    };
    expect(validateMappingValue('', requiredConfig, fallback)).toBe('请输入 1-3 位数字');
    expect(validateMappingValue(undefined, requiredConfig, fallback)).toBe('请输入 1-3 位数字');
    expect(validateMappingValue(null, requiredConfig, fallback)).toBe('请输入 1-3 位数字');
    // 有值时仍走 pattern 校验
    expect(validateMappingValue(30, requiredConfig, fallback)).toBeNull();
    expect(validateMappingValue(1234, requiredConfig, fallback)).toBe('请输入 1-3 位数字');
  });

  it('required 且未配 validation.message 时回退默认提示', () => {
    expect(validateMappingValue('', { required: true }, fallback)).toBe(fallback);
  });
});

describe('resolveMappingOptions', () => {
  const optionSources = {
    fieldOptions: {
      options: [{ label: '特征A', value: 'FA' }],
    },
    remoteOptions: {
      request: { uri: '/api/list', method: 'GET' },
      valueField: 'code',
      labelField: 'name',
    },
  };

  it('内联 options 优先', () => {
    expect(
      resolveMappingOptions(
        { type: 'select', options: [{ label: 'x', value: 'x' }], optionSource: 'fieldOptions' },
        optionSources,
      ),
    ).toEqual([{ label: 'x', value: 'x' }]);
  });

  it('optionSource 静态 options 匹配', () => {
    expect(
      resolveMappingOptions({ type: 'select', optionSource: 'fieldOptions' }, optionSources),
    ).toEqual([{ label: '特征A', value: 'FA' }]);
  });

  it('optionSource 为远程 request 时返回 null（本移植版无远程加载通道）', () => {
    expect(
      resolveMappingOptions({ type: 'select', optionSource: 'remoteOptions' }, optionSources),
    ).toBeNull();
  });

  it('optionSource 未命中时返回 null', () => {
    expect(
      resolveMappingOptions({ type: 'select', optionSource: 'missing' }, optionSources),
    ).toBeNull();
  });
});

describe('ExpressionEditor 两步编辑', () => {
  it('默认展示可编辑文本框（填充后的模板），不渲染控件，挂载时 emit 组合默认值', async () => {
    const onChange = vi.fn();
    render(
      <ExpressionEditor valueTemplate={TEMPLATE} valueMapping={mapping} onChange={onChange} />,
    );

    // display 为可编辑文本框，展示组合模板
    const box = screen.getByDisplayValue('return ft.period(30, DAY, ${d})') as HTMLTextAreaElement;
    expect(box.readOnly).toBe(false);
    // 不渲染编辑控件
    expect(screen.queryByLabelText('时间窗口')).toBeNull();
    // 挂载 emit 组合默认值
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('return ft.period(30, DAY, ${d})');
    });
  });

  it('默认状态可直接编辑表达式文本，实时 emit 原文', async () => {
    const onChange = vi.fn();
    render(
      <ExpressionEditor valueTemplate={TEMPLATE} valueMapping={mapping} onChange={onChange} />,
    );
    onChange.mockClear();

    const box = screen.getByDisplayValue('return ft.period(30, DAY, ${d})');
    fireEvent.change(box, {
      target: { value: 'return ft.period(7, WEEK, ${d})' },
    });

    expect(onChange).toHaveBeenLastCalledWith('return ft.period(7, WEEK, ${d})');
    // 文本框展示编辑后的原文
    expect(screen.getByDisplayValue('return ft.period(7, WEEK, ${d})')).toBeTruthy();
  });

  it('默认状态编辑文本后，点击编辑时表单控件显示反向解析的值', async () => {
    const user = userEvent.setup();
    render(<ExpressionEditor valueTemplate={TEMPLATE} valueMapping={mapping} />);

    fireEvent.change(screen.getByDisplayValue('return ft.period(30, DAY, ${d})'), {
      target: { value: 'return ft.period(7, WEEK, ${d})' },
    });

    await user.click(screen.getByText('编辑'));

    // 文本编辑的值映射到编辑表单：number 输入框与 select 均显示解析值
    expect((screen.getByLabelText('时间窗口') as HTMLInputElement).value).toBe('7');
    expect(screen.getByText('周')).toBeTruthy();
  });

  it('label 渲染在头部左侧，「编辑」按钮在最右侧', () => {
    render(
      <ExpressionEditor
        valueTemplate={TEMPLATE}
        valueMapping={mapping}
        label="计算表达式"
        required
      />,
    );
    const labelEl = screen.getByText('计算表达式');
    const editBtn = screen.getByText('编辑');
    expect(
      labelEl.compareDocumentPosition(editBtn) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('点击编辑后按模板顺序展示 label+控件，确定后切回只读并提交', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ExpressionEditor valueTemplate={TEMPLATE} valueMapping={mapping} onChange={onChange} />,
    );

    await user.click(screen.getByText('编辑'));

    // 表单项按模板顺序展示
    const labelA = screen.getByText('时间窗口');
    const labelB = screen.getByText('时间单位');
    expect(labelA.compareDocumentPosition(labelB) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    // 修改值并确定
    const input = screen.getByLabelText('时间窗口');
    await user.clear(input);
    await user.type(input, '7');
    await user.click(screen.getByText('确定'));

    expect(onChange).toHaveBeenLastCalledWith('return ft.period(7, DAY, ${d})');
    // 切回 display 文本框
    expect(screen.queryByLabelText('时间窗口')).toBeNull();
    expect(screen.getByDisplayValue('return ft.period(7, DAY, ${d})')).toBeTruthy();
  });

  it('编辑态取消丢弃草稿，不提交且展示值不变', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ExpressionEditor valueTemplate={TEMPLATE} valueMapping={mapping} onChange={onChange} />,
    );
    onChange.mockClear();

    await user.click(screen.getByText('编辑'));
    const input = screen.getByLabelText('时间窗口');
    await user.clear(input);
    await user.type(input, '99');
    await user.click(screen.getByText('取消'));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByDisplayValue('return ft.period(30, DAY, ${d})')).toBeTruthy();
  });

  it('编辑态 select 选择，确定后更新组合表达式', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ExpressionEditor valueTemplate={TEMPLATE} valueMapping={mapping} onChange={onChange} />,
    );

    await user.click(screen.getByText('编辑'));
    await user.click(screen.getByText('天'));
    await user.click(await screen.findByText('周'));
    await user.click(screen.getByText('确定'));

    expect(onChange).toHaveBeenLastCalledWith('return ft.period(30, WEEK, ${d})');
    expect(screen.getByDisplayValue('return ft.period(30, WEEK, ${d})')).toBeTruthy();
  });

  it('编辑态 select 候选可从 optionSource 静态 options 匹配', async () => {
    const user = userEvent.setup();
    render(
      <ExpressionEditor
        valueTemplate="return ft.relate(${node})"
        valueMapping={{
          node: { label: '起始节点', type: 'select', optionSource: 'fieldOptions' },
        }}
        optionSources={{
          fieldOptions: {
            options: [
              { label: '特征A', value: 'FA' },
              { label: '特征B', value: 'FB' },
            ],
          },
        }}
      />,
    );

    await user.click(screen.getByText('编辑'));
    await user.click(screen.getByRole('combobox'));
    expect(await screen.findByText('特征A')).toBeTruthy();
    expect(screen.getByText('特征B')).toBeTruthy();
  });

  it('optionSource 为远程 request 条目时按空候选渲染（本移植版无 fetchApi 通道）', async () => {
    const user = userEvent.setup();
    render(
      <ExpressionEditor
        valueTemplate="return ft.relate(${node})"
        valueMapping={{
          node: { label: '起始节点', type: 'select', optionSource: 'fieldOptions' },
        }}
        optionSources={{
          fieldOptions: {
            request: { uri: '/innospots/api/dp/saas/feature/base/list', method: 'GET' },
            valueField: 'code',
            labelField: 'name',
          },
        }}
      />,
    );

    await user.click(screen.getByText('编辑'));
    await user.click(screen.getByRole('combobox'));

    // 远程候选不加载，弹层展示空候选文案
    expect(await screen.findByText('无选项')).toBeTruthy();
  });

  it('外部已有值在挂载时反向解析：display 展示原值，编辑态控件显示解析值', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ExpressionEditor
        valueTemplate={CYCLE_TEMPLATE}
        valueMapping={cycleMapping}
        value={CYCLE_VALUE}
        onChange={onChange}
      />,
    );

    // display 展示外部值
    expect(screen.getByDisplayValue(CYCLE_VALUE)).toBeTruthy();
    // 解析成功时组合值与外部值一致，挂载不应 emit
    await new Promise((r) => setTimeout(r, 50));
    expect(onChange).not.toHaveBeenCalled();

    // 编辑态控件显示解析值
    await user.click(screen.getByText('编辑'));
    expect((screen.getByLabelText('时间窗口') as HTMLInputElement).value).toBe('1');
    expect(screen.getByText('天')).toBeTruthy();
    expect(screen.getByText('次数')).toBeTruthy();
    expect((screen.getByLabelText('计算条件') as HTMLInputElement).value).toBe(
      "actionType == 'REGISTER'",
    );
  });

  it('挂载后外部值变化（AI 填充）时解析更新', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <ExpressionEditor
        valueTemplate={CYCLE_TEMPLATE}
        valueMapping={cycleMapping}
        onChange={onChange}
      />,
    );

    rerender(
      <ExpressionEditor
        valueTemplate={CYCLE_TEMPLATE}
        valueMapping={cycleMapping}
        value={CYCLE_VALUE}
        onChange={onChange}
      />,
    );

    // display 更新为外部值
    expect(await screen.findByDisplayValue(CYCLE_VALUE)).toBeTruthy();

    // 编辑态控件同步解析值
    await user.click(screen.getByText('编辑'));
    expect((screen.getByLabelText('时间窗口') as HTMLInputElement).value).toBe('1');
    expect(screen.getByText('天')).toBeTruthy();
  });

  it('外部 value 重置为空时回退默认值', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <ExpressionEditor
        valueTemplate={TEMPLATE}
        valueMapping={mapping}
        value="return ft.period(99, MONTH, ${d})"
        onChange={onChange}
      />,
    );

    // 外部值被反向解析：display 展示 99
    expect(screen.getByDisplayValue('return ft.period(99, MONTH, ${d})')).toBeTruthy();

    rerender(
      <ExpressionEditor
        valueTemplate={TEMPLATE}
        valueMapping={mapping}
        value=""
        onChange={onChange}
      />,
    );

    // 回退默认值：编辑态输入框显示 30
    await user.click(screen.getByText('编辑'));
    expect((screen.getByLabelText('时间窗口') as HTMLInputElement).value).toBe('30');
  });

  it('选项超过 10 条时显示搜索框且全部展示', async () => {
    const user = userEvent.setup();
    const manyOptions = Array.from({ length: 12 }, (_, i) => ({
      label: `选项${i + 1}`,
      value: `V${i + 1}`,
    }));
    render(
      <ExpressionEditor
        valueTemplate="return f(${x})"
        valueMapping={{ x: { label: '字段', type: 'select', options: manyOptions } }}
      />,
    );

    await user.click(screen.getByText('编辑'));
    await user.click(screen.getByRole('combobox'));

    // 全部选项展示（含最后一条）
    expect(await screen.findByText('选项12')).toBeTruthy();
    expect(screen.getByText('选项1')).toBeTruthy();
    // 超过 10 条：显示搜索框（缺省占位「搜索…」）
    expect(screen.getByPlaceholderText('搜索…')).toBeTruthy();
  });

  it('选项不超过 10 条时不显示搜索框', async () => {
    const user = userEvent.setup();
    render(
      <ExpressionEditor
        valueTemplate="return f(${x})"
        valueMapping={{
          x: {
            label: '字段',
            type: 'select',
            options: [
              { label: '甲', value: '1' },
              { label: '乙', value: '2' },
            ],
          },
        }}
      />,
    );

    await user.click(screen.getByText('编辑'));
    await user.click(screen.getByRole('combobox'));

    expect(await screen.findByText('甲')).toBeTruthy();
    expect(screen.queryByPlaceholderText('搜索…')).toBeNull();
  });

  it('fieldCondition 类型渲染条件编辑器，确定后输出表达式字符串', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ExpressionEditor
        valueTemplate='return ft.period("${cond}")'
        valueMapping={{
          cond: {
            label: '计算条件',
            type: 'fieldCondition',
            optionSource: 'fieldOptions',
          },
        }}
        optionSources={{
          fieldOptions: {
            options: [{ label: '决策评分', value: 'decisionScore', fieldType: 'NUMBER' }],
          },
        }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByText('编辑'));

    // 选择字段（第一个 combobox 为字段下拉）
    await user.click(screen.getAllByRole('combobox')[0]);
    await user.click(await screen.findByText('决策评分'));

    // 选择操作符（第二个 combobox 为操作符下拉；缺省中文操作符文案）
    await user.click(screen.getAllByRole('combobox')[1]);
    await user.click(await screen.findByText('大于'));

    // 输入值
    await user.type(screen.getByLabelText('condition-value'), '60');

    await user.click(screen.getByText('确定'));

    expect(onChange).toHaveBeenLastCalledWith('return ft.period("decisionScore > 60")');
    // 切回 display 文本框
    expect(screen.getByDisplayValue('return ft.period("decisionScore > 60")')).toBeTruthy();
  });

  it('fieldCondition 进入编辑时反向解析已有字符串值并显示', async () => {
    const user = userEvent.setup();
    render(
      <ExpressionEditor
        valueTemplate='return ft.period("${cond}")'
        valueMapping={{
          cond: {
            label: '计算条件',
            type: 'fieldCondition',
            optionSource: 'fieldOptions',
          },
        }}
        optionSources={{
          fieldOptions: {
            options: [{ label: '决策评分', value: 'decisionScore', fieldType: 'NUMBER' }],
          },
        }}
        value={'return ft.period("decisionScore > 60")'}
      />,
    );

    await user.click(screen.getByText('编辑'));

    // 字段下拉显示解析后的字段 label
    expect(await screen.findByText('决策评分')).toBeTruthy();
    // 操作符与值输入框显示解析值
    expect(screen.getByText('大于')).toBeTruthy();
    expect((screen.getByLabelText('condition-value') as HTMLInputElement).value).toBe('60');
  });

  it('validation.pattern 不匹配时输入即提示，确定被阻断，修正后可提交', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ExpressionEditor
        valueTemplate={TEMPLATE}
        valueMapping={{
          ...mapping,
          a: {
            ...mapping.a,
            validation: { pattern: '^\\d{1,3}$', message: '请输入 1-3 位数字' },
          },
        }}
        onChange={onChange}
      />,
    );
    onChange.mockClear();

    await user.click(screen.getByText('编辑'));

    // 输入不匹配值：即时提示
    const input = screen.getByLabelText('时间窗口');
    await user.clear(input);
    await user.type(input, '1234');
    expect(screen.getByText('请输入 1-3 位数字')).toBeTruthy();

    // 确定被阻断：留在编辑态，不提交
    await user.click(screen.getByText('确定'));
    expect(screen.getByLabelText('时间窗口')).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();

    // 修正后提示消失，确定可提交
    await user.clear(input);
    await user.type(input, '99');
    expect(screen.queryByText('请输入 1-3 位数字')).toBeNull();
    await user.click(screen.getByText('确定'));

    expect(onChange).toHaveBeenLastCalledWith('return ft.period(99, DAY, ${d})');
    expect(screen.getByDisplayValue('return ft.period(99, DAY, ${d})')).toBeTruthy();
  });

  it('validation 对空值跳过校验，空值可正常提交', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ExpressionEditor
        valueTemplate={TEMPLATE}
        valueMapping={{
          ...mapping,
          a: {
            ...mapping.a,
            validation: { pattern: '^\\d{1,3}$', message: '请输入 1-3 位数字' },
          },
        }}
        onChange={onChange}
      />,
    );
    onChange.mockClear();

    await user.click(screen.getByText('编辑'));
    await user.clear(screen.getByLabelText('时间窗口'));
    await user.click(screen.getByText('确定'));

    expect(screen.queryByText('请输入 1-3 位数字')).toBeNull();
    expect(onChange).toHaveBeenLastCalledWith('return ft.period(, DAY, ${d})');
  });

  it('required 子字段留空时确定被阻断，且编辑态上报 invalid', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onValidityChange = vi.fn();
    render(
      <ExpressionEditor
        valueTemplate={TEMPLATE}
        valueMapping={{
          ...mapping,
          a: {
            ...mapping.a,
            required: true,
            validation: { pattern: '^\\d{1,3}$', message: '请输入 1-3 位数字' },
          },
        }}
        onChange={onChange}
        onValidityChange={onValidityChange}
      />,
    );
    onChange.mockClear();
    onValidityChange.mockClear();

    // 进入编辑态：初始值合法 → 上报 false
    await user.click(screen.getByText('编辑'));
    expect(onValidityChange).toHaveBeenLastCalledWith(false);

    // 清空（必填缺失）→ 上报 invalid=true，确定被阻断
    await user.clear(screen.getByLabelText('时间窗口'));
    expect(onValidityChange).toHaveBeenLastCalledWith(true);
    await user.click(screen.getByText('确定'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText('时间窗口')).toBeTruthy();

    // 填入合法值 → 上报复位 false，确定可提交
    await user.type(screen.getByLabelText('时间窗口'), '99');
    expect(onValidityChange).toHaveBeenLastCalledWith(false);
    await user.click(screen.getByText('确定'));
    expect(onChange).toHaveBeenLastCalledWith('return ft.period(99, DAY, ${d})');
  });

  it('valueTemplate 缺失时不渲染', () => {
    const { container } = render(<ExpressionEditor valueTemplate={''} valueMapping={mapping} />);
    expect(container.firstChild).toBeNull();
  });
});
