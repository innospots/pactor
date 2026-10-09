import type { Ace } from 'ace-builds';
import { describe, expect, it } from 'vitest';

import {
  buildFunctionSnippet,
  buildScriptCompletions,
} from '../../src/components/business/ScriptEditor/index.js';

const functions = [
  {
    name: 'SUM',
    description: '计算总和',
    parameters: [
      { name: 'field', type: 'string', description: '需要计算总和的字段' },
    ],
  },
  { name: 'NOW', description: '当前时间' },
];

const variables = [
  { name: 'featureCode', type: 'string', description: '特征编码' },
  { name: 'featureType', type: 'string', description: '特征类型' },
];

function getCompletions(completer: Ace.Completer): Promise<Ace.Completion[]> {
  return new Promise((resolve, reject) => {
    completer.getCompletions(
      null as any,
      null as any,
      null as any,
      '',
      (err, completions) => (err ? reject(err) : resolve(completions)),
    );
  });
}

describe('buildFunctionSnippet', () => {
  it('无参函数生成 NAME()', () => {
    expect(buildFunctionSnippet({ name: 'NOW' })).toBe('NOW()');
  });

  it('有参函数生成带占位符的 snippet', () => {
    expect(buildFunctionSnippet(functions[0])).toBe('SUM(${1:field})');
  });

  it('多参数按顺序编号', () => {
    expect(
      buildFunctionSnippet({
        name: 'DATE_DIFF',
        parameters: [{ name: 'start' }, { name: 'end' }],
      }),
    ).toBe('DATE_DIFF(${1:start}, ${2:end})');
  });
});

describe('buildScriptCompletions', () => {
  it('函数以 snippet 补全，meta 为 function，docHTML 含描述与参数', async () => {
    const completions = await getCompletions(buildScriptCompletions(functions, []));
    const sum = completions.find((c) => c.caption === 'SUM');
    expect(sum).toBeTruthy();
    expect(sum?.snippet).toBe('SUM(${1:field})');
    expect(sum?.meta).toBe('function');
    expect(sum?.docHTML).toContain('计算总和');
    expect(sum?.docHTML).toContain('field');
    expect(sum?.docHTML).toContain('需要计算总和的字段');
  });

  it('变量直接补全名称，meta 为 variable，docHTML 含类型与描述', async () => {
    const completions = await getCompletions(buildScriptCompletions([], variables));
    const code = completions.find((c) => c.caption === 'featureCode');
    expect(code).toBeTruthy();
    expect(code?.value).toBe('featureCode');
    expect(code?.meta).toBe('variable');
    expect(code?.docHTML).toContain('string');
    expect(code?.docHTML).toContain('特征编码');
  });

  it('函数与变量同时返回', async () => {
    const completions = await getCompletions(
      buildScriptCompletions(functions, variables),
    );
    expect(completions).toHaveLength(functions.length + variables.length);
  });

  it('空配置返回空候选', async () => {
    expect(await getCompletions(buildScriptCompletions())).toHaveLength(0);
    expect(await getCompletions(buildScriptCompletions([], []))).toHaveLength(0);
  });

  it('docHTML 转义 HTML 特殊字符', async () => {
    const completions = await getCompletions(
      buildScriptCompletions([
        { name: 'F', description: '<b>desc</b> & "quoted"' },
      ]),
    );
    expect(completions[0].docHTML).not.toContain('<b>desc</b>');
    expect(completions[0].docHTML).toContain('&lt;b&gt;');
  });
});
