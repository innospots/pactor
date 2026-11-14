// @vitest-environment jsdom
/**
 * blocks 表单组件的控件尺寸契约：与基础表单组件共用 control-size 令牌
 *（经 @pactor-app/ui/components 导出的 CONTROL_SIZE_* 共享），
 * 同一 size 下高度 / 内边距 / 字号一致。
 */
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderDsl } from './helpers.js';

describe('blocks 控件尺寸 size 属性', () => {
  it('FieldCondition：行内控件统一按尺寸令牌渲染', () => {
    renderDsl({
      type: 'FieldCondition',
      props: {
        size: 'small',
        fields: [{ featureCode: 'age', featureName: '年龄', fieldType: 'NUMBER' }],
        value: {
          relation: 'AND',
          children: [
            {
              relation: 'AND',
              children: [
                {
                  field: { value: 'age', label: '年龄', dataType: 'NUMBER' },
                  term: { value: 'GREATER', label: '大于' },
                  value: 18,
                },
              ],
            },
          ],
        },
      },
    });

    // 字段下拉（min-height 令牌）与操作符 Select（data-size=sm）同尺寸
    const fieldTrigger = screen.getAllByRole('combobox')[0]!;
    expect(fieldTrigger.className).toContain('min-h-(--pactor-control-height-sm)');
    const opTrigger = document.querySelector('[data-slot=select-trigger]')!;
    expect(opTrigger.getAttribute('data-size')).toBe('sm');
    // 值输入框高度/字号令牌（small 档）
    const valueInput = document.querySelector('input[aria-label=condition-value]')!;
    expect(valueInput.className).toContain('h-(--pactor-control-height-sm)');
    expect(valueInput.className).toContain('text-[length:var(--pactor-control-text-sm)]');
  });

  it('RuleConfig：权重 / 评分输入与操作符下拉统一按尺寸渲染', () => {
    renderDsl({
      type: 'RuleConfig',
      props: {
        size: 'large',
        value: {
          score: 5,
          ruleConditions: [{ key: 1, opt: 'EQUAL', value: 'vip', score: 10 }],
        },
      },
    });

    expect(screen.getByDisplayValue('5').className).toContain(
      'h-(--pactor-control-height-lg)',
    );
    expect(screen.getByDisplayValue('10').className).toContain(
      'h-(--pactor-control-height-lg)',
    );
    expect(
      document.querySelector('[data-slot=select-trigger]')!.getAttribute('data-size'),
    ).toBe('lg');
  });

  it('RuleExpression：编辑区按尺寸调整内边距与字号', () => {
    renderDsl({
      type: 'RuleExpression',
      props: { size: 'small', options: [{ label: '年龄', value: 'age' }] },
    });
    const editor = document.querySelector('[role=textbox]')!;
    expect(editor.className).toContain('min-h-(--pactor-control-height-sm)');
    expect(editor.className).toContain('text-[length:var(--pactor-control-text-sm)]');
  });

  it('ExpressionEditor：display 文本框按尺寸渲染', () => {
    renderDsl({
      type: 'ExpressionEditor',
      props: {
        size: 'large',
        valueTemplate: 'return ft.period({{a}})',
        valueMapping: { a: { label: '周期', type: 'number', default: 1 } },
      },
    });
    const textarea = document.querySelector('textarea')!;
    expect(textarea.className).toContain('min-h-(--pactor-control-height-lg)');
    expect(textarea.className).toContain('text-[length:var(--pactor-control-text-lg)]');
  });
});
