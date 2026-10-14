// @vitest-environment jsdom
import './setup.js';

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  FieldCondition,
  conditionToStatement,
  defaultFieldConditionValue,
  getOperatorsByFieldType,
  isNoValueOperator,
  itemToStatement,
  statementToCondition,
} from '../src/components/FieldCondition/index.js';

afterEach(cleanup);

const fields = [
  { featureCode: 'productShelfTime', featureName: '产品上架时间', fieldType: 'DATE', recommended: false },
  { featureCode: 'decisionVersion', featureName: '决策版本', fieldType: 'STRING', recommended: false },
  { featureCode: 'decisionScore', featureName: '决策评分', fieldType: 'NUMBER', recommended: false },
  { featureCode: 'accountIsBlacklist', featureName: '是否黑名单', fieldType: 'BOOLEAN', recommended: false },
];

describe('getOperatorsByFieldType', () => {
  it('NUMBER 含比较/BETWEEN/IN 操作符，不含 TRUE/FALSE', () => {
    const ops = getOperatorsByFieldType('NUMBER').map((o) => o.value);
    expect(ops).toContain('GREATER');
    expect(ops).toContain('BETWEEN');
    expect(ops).toContain('IN');
    expect(ops).toContain('HASVAL');
    expect(ops).not.toContain('TRUE');
  });

  it('STRING 不含比较操作符，含 IN/NOT_IN', () => {
    const ops = getOperatorsByFieldType('STRING').map((o) => o.value);
    expect(ops).toContain('EQUAL');
    expect(ops).toContain('NOT_IN');
    expect(ops).not.toContain('GREATER');
    expect(ops).not.toContain('BETWEEN');
  });

  it('DATE 含 BETWEEN 不含 IN', () => {
    const ops = getOperatorsByFieldType('DATE').map((o) => o.value);
    expect(ops).toContain('BETWEEN');
    expect(ops).not.toContain('IN');
  });

  it('BOOLEAN 仅 TRUE/FALSE 及无值操作符', () => {
    const ops = getOperatorsByFieldType('BOOLEAN').map((o) => o.value);
    expect(ops).toContain('TRUE');
    expect(ops).toContain('FALSE');
    expect(ops).toContain('HASVAL');
    expect(ops).not.toContain('EQUAL');
  });

  it('无类型时返回全部操作符', () => {
    expect(getOperatorsByFieldType(undefined).length).toBeGreaterThan(10);
  });
});

describe('isNoValueOperator', () => {
  it('HASVAL/NOHASVAL/TRUE/FALSE 无需值输入', () => {
    expect(isNoValueOperator('HASVAL')).toBe(true);
    expect(isNoValueOperator('TRUE')).toBe(true);
    expect(isNoValueOperator('EQUAL')).toBe(false);
    expect(isNoValueOperator(undefined)).toBe(false);
  });
});

describe('defaultFieldConditionValue', () => {
  it('默认结构：OR 根 → AND 组 → 一条空条件', () => {
    const v = defaultFieldConditionValue();
    expect(v.relation).toBe('OR');
    expect(v.children).toHaveLength(1);
    expect(v.children[0].relation).toBe('AND');
    expect(v.children[0].children).toEqual([{ field: {}, term: {} }]);
  });
});

describe('itemToStatement / conditionToStatement', () => {
  it('STRING 值加单引号，NUMBER 原样', () => {
    expect(
      itemToStatement({
        field: { value: 'actionType', dataType: 'STRING' },
        term: { value: 'EQUAL' },
        value: 'REGISTER',
      }),
    ).toBe("actionType == 'REGISTER'");
    expect(
      itemToStatement({
        field: { value: 'score', dataType: 'NUMBER' },
        term: { value: 'GREATER' },
        value: 60,
      }),
    ).toBe('score > 60');
  });

  it('BETWEEN 渲染区间，HASVAL 无值，TRUE 布尔', () => {
    expect(
      itemToStatement({
        field: { value: 'score', dataType: 'NUMBER' },
        term: { value: 'BETWEEN' },
        value: [1, 10],
      }),
    ).toBe('score BETWEEN 1 AND 10');
    expect(
      itemToStatement({
        field: { value: 'addr', dataType: 'STRING' },
        term: { value: 'HASVAL' },
      }),
    ).toBe('addr HASVAL');
    expect(
      itemToStatement({
        field: { value: 'isBlack', dataType: 'BOOLEAN' },
        term: { value: 'TRUE' },
      }),
    ).toBe('isBlack == TRUE');
  });

  it('IN 逗号拆分并逐项格式化', () => {
    expect(
      itemToStatement({
        field: { value: 'channel', dataType: 'STRING' },
        term: { value: 'IN' },
        value: 'APP, H5',
      }),
    ).toBe("channel IN ('APP', 'H5')");
  });

  it('字段或操作符缺失返回 null', () => {
    expect(itemToStatement({ field: {}, term: {} })).toBeNull();
    expect(
      itemToStatement({ field: { value: 'a' }, term: {} }),
    ).toBeNull();
  });

  it('组内按组 relation 连接（多条加括号），组间按根 relation 连接', () => {
    const value = {
      relation: 'OR' as const,
      children: [
        {
          relation: 'AND' as const,
          children: [
            {
              field: { value: 'actionType', dataType: 'STRING' },
              term: { value: 'EQUAL' },
              value: 'REGISTER',
            },
            {
              field: { value: 'score', dataType: 'NUMBER' },
              term: { value: 'GREATER' },
              value: 60,
            },
          ],
        },
        {
          relation: 'AND' as const,
          children: [
            {
              field: { value: 'isBlack', dataType: 'BOOLEAN' },
              term: { value: 'TRUE' },
            },
          ],
        },
      ],
    };
    expect(conditionToStatement(value)).toBe(
      "(actionType == 'REGISTER' && score > 60) || isBlack == TRUE",
    );
  });

  it('空条件返回空串', () => {
    expect(conditionToStatement(undefined)).toBe('');
    expect(conditionToStatement(defaultFieldConditionValue())).toBe('');
  });
});

describe('statementToCondition', () => {
  it('空串/无法解析返回 null', () => {
    expect(statementToCondition('')).toBeNull();
    expect(statementToCondition('   ')).toBeNull();
    expect(statementToCondition('some random text!!')).toBeNull();
  });

  it('解析简单等值条件（AI 生成格式）', () => {
    const result = statementToCondition("actionType == 'REGISTER'", fields);
    expect(result).toEqual({
      relation: 'AND',
      children: [
        {
          relation: 'AND',
          children: [
            {
              field: { value: 'actionType', label: undefined, dataType: undefined },
              term: { value: 'EQUAL' },
              value: 'REGISTER',
            },
          ],
        },
      ],
    });
  });

  it('解析数字比较与布尔字面量', () => {
    expect(statementToCondition('score > 60')).toEqual({
      relation: 'AND',
      children: [
        {
          relation: 'AND',
          children: [
            {
              field: { value: 'score', label: undefined, dataType: undefined },
              term: { value: 'GREATER' },
              value: '60',
            },
          ],
        },
      ],
    });
    // x == TRUE → TRUE 操作符无值
    expect(statementToCondition('isBlack == TRUE')).toEqual({
      relation: 'AND',
      children: [
        {
          relation: 'AND',
          children: [
            {
              field: { value: 'isBlack', label: undefined, dataType: undefined },
              term: { value: 'TRUE' },
              value: undefined,
            },
          ],
        },
      ],
    });
  });

  it('解析 BETWEEN 与 IN', () => {
    expect(statementToCondition('score BETWEEN 1 AND 10')).toEqual({
      relation: 'AND',
      children: [
        {
          relation: 'AND',
          children: [
            {
              field: { value: 'score', label: undefined, dataType: undefined },
              term: { value: 'BETWEEN' },
              value: ['1', '10'],
            },
          ],
        },
      ],
    });
    expect(statementToCondition("channel IN ('APP', 'H5')")).toEqual({
      relation: 'AND',
      children: [
        {
          relation: 'AND',
          children: [
            {
              field: { value: 'channel', label: undefined, dataType: undefined },
              term: { value: 'IN' },
              value: 'APP, H5',
            },
          ],
        },
      ],
    });
  });

  it('解析括号包裹的单组表达式（生成器格式）', () => {
    const result = statementToCondition(
      "(actionType == 'REGISTER' && score > 60)",
    );
    expect(result).toEqual({
      relation: 'AND',
      children: [
        {
          relation: 'AND',
          children: [
            {
              field: { value: 'actionType', label: undefined, dataType: undefined },
              term: { value: 'EQUAL' },
              value: 'REGISTER',
            },
            {
              field: { value: 'score', label: undefined, dataType: undefined },
              term: { value: 'GREATER' },
              value: '60',
            },
          ],
        },
      ],
    });
  });

  it('顶层 || 连接的单条条件解析为单个 OR 组', () => {
    const result = statementToCondition('score > 60 || isBlack == TRUE');
    expect(result).toEqual({
      relation: 'OR',
      children: [
        {
          relation: 'OR',
          children: [
            {
              field: { value: 'score', label: undefined, dataType: undefined },
              term: { value: 'GREATER' },
              value: '60',
            },
            {
              field: { value: 'isBlack', label: undefined, dataType: undefined },
              term: { value: 'TRUE' },
              value: undefined,
            },
          ],
        },
      ],
    });
  });

  it('括号包裹的 OR 组解析为单个 OR 组', () => {
    const result = statementToCondition('(score > 60 || isBlack == TRUE)');
    expect(result?.children).toHaveLength(1);
    expect(result?.children[0].relation).toBe('OR');
    expect(result?.children[0].children).toHaveLength(2);
  });

  it('单层无法表示的混合表达式返回 null', () => {
    expect(
      statementToCondition("(actionType == 'REGISTER' && score > 60) || isBlack == TRUE"),
    ).toBeNull();
  });

  it('字段在候选列表中时补充 label 与 dataType', () => {
    const result = statementToCondition('decisionScore > 60', fields);
    expect(result?.children[0].children[0].field).toEqual({
      value: 'decisionScore',
      label: '决策评分',
      dataType: 'NUMBER',
    });
  });

  it('与 conditionToStatement 互逆（round-trip）', () => {
    const value = {
      relation: 'OR' as const,
      children: [
        {
          relation: 'AND' as const,
          children: [
            {
              field: { value: 'decisionVersion', dataType: 'STRING' },
              term: { value: 'EQUAL' },
              value: 'V1',
            },
            {
              field: { value: 'decisionScore', dataType: 'NUMBER' },
              term: { value: 'GREATER' },
              value: 60,
            },
          ],
        },
      ],
    };
    const statement = conditionToStatement(value);
    // 传入候选字段以还原 dataType（STRING 引号依赖 fieldType）
    const parsed = statementToCondition(statement, fields);
    expect(parsed?.children[0].children).toHaveLength(2);
    // 再次生成应得到相同字符串
    expect(conditionToStatement(parsed!)).toBe(statement);
  });
});

describe('FieldCondition', () => {
  it('value 缺省时渲染默认一条条件，且无「添加分组」入口', () => {
    render(<FieldCondition fields={fields} onChange={() => {}} />);
    // 字段下拉（SearchableSelect）与操作符下拉（Select）均为 combobox
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('添加分组')).toBeNull();
  });

  it('点击 relation 按钮切换组内 AND/OR 并 emit', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const initial = {
      relation: 'AND' as const,
      children: [
        {
          relation: 'AND' as const,
          children: [
            { field: { value: 'a', dataType: 'NUMBER' }, term: { value: 'GREATER' }, value: 1 },
            { field: { value: 'b', dataType: 'NUMBER' }, term: { value: 'LESS' }, value: 2 },
          ],
        },
      ],
    };
    render(<FieldCondition fields={fields} value={initial} onChange={onChange} />);

    await user.click(screen.getByText('且'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        children: [expect.objectContaining({ relation: 'OR' })],
      }),
    );
  });

  it('选择字段后按 fieldType 过滤操作符，且字段信息写入 value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FieldCondition fields={fields} onChange={onChange} />);

    await user.click(screen.getAllByRole('combobox')[0]);
    await user.click(await screen.findByText('决策评分'));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        children: [
          expect.objectContaining({
            children: [
              expect.objectContaining({
                field: { value: 'decisionScore', label: '决策评分', dataType: 'NUMBER' },
                term: {},
              }),
            ],
          }),
        ],
      }),
    );
  });

  it('选择操作符后渲染值输入；BETWEEN 渲染两个输入', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const initial = {
      relation: 'AND' as const,
      children: [
        {
          relation: 'AND' as const,
          children: [
            {
              field: { value: 'decisionScore', label: '决策评分', dataType: 'NUMBER' },
              term: { value: 'BETWEEN', label: '范围' },
              value: [1, 10],
            },
          ],
        },
      ],
    };
    // 受控组件需要 stateful 包装，否则输入会被重置
    function Stateful() {
      const [v, setV] = useState<any>(initial);
      return (
        <FieldCondition
          fields={fields}
          value={v}
          onChange={(nv) => {
            setV(nv);
            onChange(nv);
          }}
        />
      );
    }
    render(<Stateful />);

    const min = screen.getByLabelText('between-min') as HTMLInputElement;
    const max = screen.getByLabelText('between-max') as HTMLInputElement;
    expect(min.value).toBe('1');
    expect(max.value).toBe('10');

    await user.clear(min);
    await user.type(min, '5');
    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          children: [
            expect.objectContaining({
              children: [expect.objectContaining({ value: ['5', 10] })],
            }),
          ],
        }),
      );
    });
  });

  it('BOOLEAN 字段的 TRUE/FALSE 操作符不渲染值输入', () => {
    const value = {
      relation: 'AND' as const,
      children: [
        {
          relation: 'AND' as const,
          children: [
            {
              field: { value: 'accountIsBlacklist', label: '是否黑名单', dataType: 'BOOLEAN' },
              term: { value: 'TRUE', label: '为真' },
            },
          ],
        },
      ],
    };
    render(<FieldCondition fields={fields} value={value} onChange={() => {}} />);
    expect(screen.queryByLabelText('condition-value')).toBeNull();
    expect(screen.queryByLabelText('between-min')).toBeNull();
  });

  it('添加条件（单层结构，无添加分组）', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FieldCondition fields={fields} onChange={onChange} />);

    await user.click(screen.getByText('添加条件'));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        children: [
          expect.objectContaining({
            children: [{ field: {}, term: {} }, { field: {}, term: {} }],
          }),
        ],
      }),
    );
    expect(screen.queryByText('添加分组')).toBeNull();
  });
});
