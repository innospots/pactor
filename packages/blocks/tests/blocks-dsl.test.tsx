// @vitest-environment jsdom
/**
 * blocks 区块组件的 DSL 注册与渲染契约：
 * 类型名经 createBlockComponentRegistry 注册可解析；渲染经
 * registerBlockComponents 合并进 ui 的 createComponentRegistry 后按类型名
 * 解析，事件经 events.onChange + ${event} 回写状态。
 */
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createBlockComponentRegistry } from '../src/index.js';
import { renderDsl } from './helpers.js';

const BUSINESS_TYPES = [
  'Login',
  'EntityCard',
  'EntityCardList',
  'FieldCondition',
  'FormCardList',
  'FormModal',
  'ExpressionEditor',
  'RuleConfig',
  'RuleExpression',
  'ScriptEditor',
];

describe('blocks 组件 DSL 注册', () => {
  it('全部区块组件类型名注册后可解析', () => {
    const registry = createBlockComponentRegistry();
    for (const type of BUSINESS_TYPES) {
      expect(registry.has(type), type).toBe(true);
    }
  });
});

describe('blocks 表单类组件 DSL 渲染', () => {
  it('FieldCondition：DSL fields 渲染候选字段', async () => {
    renderDsl({
      type: 'FieldCondition',
      props: {
        fields: [
          { featureCode: 'age', featureName: '年龄', fieldType: 'NUMBER' },
          { featureCode: 'name', featureName: '姓名', fieldType: 'STRING' },
        ],
      },
    });

    // 第一行条件的首个 combobox 是字段选择（操作符 Select 同为 combobox 角色）
    fireEvent.click(screen.getAllByRole('combobox')[0]!);
    expect(await screen.findByText('年龄')).toBeTruthy();
    expect(screen.getByText('姓名')).toBeTruthy();
  });

  it('RuleConfig：DSL value 渲染权重与条件行', () => {
    renderDsl({
      type: 'RuleConfig',
      props: {
        value: {
          score: 5,
          ruleConditions: [{ key: 1, opt: 'EQUAL', value: 'vip', score: 10 }],
        },
      },
    });

    expect(screen.getByDisplayValue('5')).toBeTruthy();
    expect(screen.getByDisplayValue('vip')).toBeTruthy();
    expect(screen.getByDisplayValue('10')).toBeTruthy();
  });

  it('RuleExpression：DSL value 重建字段 chip 与文本', () => {
    const { container } = renderDsl({
      type: 'RuleExpression',
      props: {
        options: [{ label: '年龄', value: 'age' }],
        value: {
          expression: 'age > 18',
          expressionLabel: '年龄 > 18',
          sourceField: ['age'],
        },
      },
    });

    const chip = container.querySelector('[data-value=age]');
    expect(chip).not.toBeNull();
    expect(chip!.textContent).toContain('年龄');
  });

  it('ExpressionEditor：DSL valueTemplate + valueMapping 渲染表达式文本框', () => {
    // 占位符用 {{key}} 写法：${ 与 DSL 表达式语法冲突（无转义机制），{{ 不冲突
    renderDsl({
      type: 'ExpressionEditor',
      props: {
        label: '提成公式',
        valueTemplate: 'return ft.period({{a}}, {{b}})',
        valueMapping: {
          a: { label: '起始', type: 'number', default: 1 },
          b: { label: '结束', type: 'number', default: 12 },
        },
      },
    });

    expect(screen.getByText('提成公式')).toBeTruthy();
    expect(
      screen.getByDisplayValue('return ft.period(1, 12)'),
    ).toBeTruthy();
  });
});
