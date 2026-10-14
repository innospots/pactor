// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  RuleConfig,
  isRuleConfigComplete,
  normalizeBetweenValue,
} from '../../src/components/business/RuleConfig/index.js';

afterEach(cleanup);

// 后端返回的 ruleConfig：条件没有前端自增的 key 字段
const backendValue = {
  score: 100,
  ruleConditions: [
    { opt: 'EQUAL', value: 'a' },
    { opt: 'EQUAL', value: 'b' },
    { opt: 'GREATER', value: 10 },
  ],
} as any;

describe('RuleConfig', () => {
  it('编辑其中一条条件时，不影响其他条件（后端数据无 key 的场景）', () => {
    const onChange = vi.fn();
    render(<RuleConfig value={backendValue} onChange={onChange} />);

    // EQUAL 条件的两个文本输入框
    const textInputs = screen.getAllByRole('textbox');
    fireEvent.change(textInputs[0], { target: { value: 'x' } });

    expect(onChange).toHaveBeenCalledTimes(1);
    const next = onChange.mock.calls[0][0];
    expect(next.ruleConditions).toHaveLength(3);
    expect(next.ruleConditions[0].value).toBe('x');
    // 其他条件保持不变
    expect(next.ruleConditions[1].value).toBe('b');
    expect(next.ruleConditions[2].value).toBe(10);
  });

  it('为缺少 key 的条件补充唯一 key', () => {
    const onChange = vi.fn();
    render(<RuleConfig value={backendValue} onChange={onChange} />);

    const textInputs = screen.getAllByRole('textbox');
    fireEvent.change(textInputs[1], { target: { value: 'y' } });

    const next = onChange.mock.calls[0][0];
    const keys = next.ruleConditions.map((c: any) => c.key);
    expect(new Set(keys).size).toBe(3);
    expect(keys.every((k: any) => typeof k === 'number')).toBe(true);
  });

  it('disabled 时为展示状态：只读文本展示权重与条件，不渲染表单控件', () => {
    render(<RuleConfig value={backendValue} disabled />);

    // 无任何输入控件与按钮
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.queryByRole('spinbutton')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('combobox')).toBeNull();

    // 权重与条件以文本展示
    expect(screen.getByText('权重')).toBeTruthy();
    expect(screen.getByText('100')).toBeTruthy();
    expect(screen.getAllByText('等于')).toHaveLength(2);
    expect(screen.getByText('大于')).toBeTruthy();
    expect(screen.getByText('a')).toBeTruthy();
    expect(screen.getByText('b')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('BETWEEN 后端逗号字符串值拆分展示到两个区间输入框', () => {
    render(
      <RuleConfig
        value={
          {
            score: 82,
            ruleConditions: [{ opt: 'BETWEEN', value: '3,5', score: 82 }],
          } as any
        }
        onChange={vi.fn()}
      />,
    );

    // 权重输入框之外的两个 spinbutton 为区间输入
    const nums = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    const rangeInputs = nums.filter((n) => n.value === '3' || n.value === '5');
    expect(rangeInputs).toHaveLength(2);
  });

  it('BETWEEN 数组值正常展示到两个区间输入框', () => {
    render(
      <RuleConfig
        value={
          {
            score: 82,
            ruleConditions: [{ opt: 'BETWEEN', value: [3, 5], score: 82 }],
          } as any
        }
        onChange={vi.fn()}
      />,
    );

    const nums = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    const rangeInputs = nums.filter((n) => n.value === '3' || n.value === '5');
    expect(rangeInputs).toHaveLength(2);
  });

  it('BETWEEN 展示态：逗号字符串值显示为 a ~ b', () => {
    render(
      <RuleConfig
        value={
          {
            score: 82,
            ruleConditions: [{ opt: 'BETWEEN', value: '3,5', score: 82 }],
          } as any
        }
        disabled
      />,
    );

    expect(screen.getByText('3 ~ 5')).toBeTruthy();
  });

  it('权重可清空重新输入，失焦为空时回退默认值 1', () => {
    // 受控 Harness 模拟 react-hook-form 回写
    function Harness() {
      const [v, setV] = useState<any>({
        score: 100,
        ruleConditions: [{ opt: 'EQUAL', value: 'a' }],
      });
      return <RuleConfig value={v} onChange={setV} />;
    }
    render(<Harness />);
    const scoreInput = screen.getByPlaceholderText(
      '请输入权重',
    ) as HTMLInputElement;
    expect(scoreInput.value).toBe('100');

    // 清空后输入框保持空，不回弹默认值
    fireEvent.change(scoreInput, { target: { value: '' } });
    expect(scoreInput.value).toBe('');

    // 重新输入生效
    fireEvent.change(scoreInput, { target: { value: '5' } });
    expect(scoreInput.value).toBe('5');

    // 再次清空并失焦 → 回退默认值 1
    fireEvent.change(scoreInput, { target: { value: '' } });
    fireEvent.blur(scoreInput);
    expect(scoreInput.value).toBe('1');
  });
});

describe('normalizeBetweenValue', () => {
  it('逗号分隔字符串拆为二元组', () => {
    expect(normalizeBetweenValue('3,5')).toEqual(['3', '5']);
    expect(normalizeBetweenValue('3, 5')).toEqual(['3', '5']);
  });

  it('数组取前两项', () => {
    expect(normalizeBetweenValue([3, 5])).toEqual([3, 5]);
    expect(normalizeBetweenValue([3])).toEqual([3, undefined]);
    expect(normalizeBetweenValue([])).toEqual([undefined, undefined]);
  });

  it('单值与空值', () => {
    expect(normalizeBetweenValue(20)).toEqual([20, undefined]);
    expect(normalizeBetweenValue(undefined)).toEqual([undefined, undefined]);
    expect(normalizeBetweenValue('')).toEqual([undefined, undefined]);
  });
});

describe('isRuleConfigComplete（表单项必填校验）', () => {
  it('值为空时不通过', () => {
    expect(isRuleConfigComplete(undefined)).toBe(false);
    expect(isRuleConfigComplete(null)).toBe(false);
  });

  it('缺少权重时不通过', () => {
    expect(
      isRuleConfigComplete({ ruleConditions: [{ key: 1, opt: 'EQUAL' }] }),
    ).toBe(false);
  });

  it('没有任何条件时不通过', () => {
    expect(isRuleConfigComplete({ score: 100, ruleConditions: [] })).toBe(
      false,
    );
  });

  it('权重为 0 视为已填写', () => {
    expect(
      isRuleConfigComplete({
        score: 0,
        ruleConditions: [{ key: 1, opt: 'EQUAL' }],
      }),
    ).toBe(true);
  });

  it('包含权重及至少一组条件时通过', () => {
    expect(isRuleConfigComplete(backendValue)).toBe(true);
  });
});
