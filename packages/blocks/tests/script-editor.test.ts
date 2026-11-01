// @vitest-environment jsdom
import { CompletionContext } from '@codemirror/autocomplete';
import { EditorState } from '@codemirror/state';
import { describe, expect, it } from 'vitest';

import {
  buildCompletionSource,
  buildFunctionSnippet,
  buildScriptCompletions,
} from '../src/components/ScriptEditor/index.js';

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

/** info 回调惰性返回文档节点（jsdom 下可直接调用取 DOM 断言） */
function infoText(info: unknown): string {
  expect(typeof info).toBe('function');
  return (info as () => Node)().textContent ?? '';
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
  it('函数以 snippet 补全，type 为 function，info 文档含描述与参数', () => {
    const completions = buildScriptCompletions(functions, []);
    const sum = completions.find((c) => c.label === 'SUM');
    expect(sum).toBeTruthy();
    expect(sum?.type).toBe('function');
    // snippetCompletion：apply 为 snippet 展开函数
    expect(typeof sum?.apply).toBe('function');
    const doc = infoText(sum?.info);
    expect(doc).toContain('计算总和');
    expect(doc).toContain('field');
    expect(doc).toContain('需要计算总和的字段');
  });

  it('变量直接补全名称，type 为 variable，info 文档含类型与描述', () => {
    const completions = buildScriptCompletions([], variables);
    const code = completions.find((c) => c.label === 'featureCode');
    expect(code).toBeTruthy();
    expect(code?.type).toBe('variable');
    // 无 apply：按 label 直接插入
    expect(code?.apply).toBeUndefined();
    const doc = infoText(code?.info);
    expect(doc).toContain('string');
    expect(doc).toContain('特征编码');
  });

  it('函数与变量同时返回', () => {
    expect(buildScriptCompletions(functions, variables)).toHaveLength(
      functions.length + variables.length,
    );
  });

  it('空配置返回空候选', () => {
    expect(buildScriptCompletions()).toHaveLength(0);
    expect(buildScriptCompletions([], [])).toHaveLength(0);
  });

  it('info 文档转义 HTML 特殊字符', () => {
    const completions = buildScriptCompletions([
      { name: 'F', description: '<b>desc</b> & "quoted"' },
    ]);
    const doc = infoText(completions[0]!.info);
    // 作为文本呈现而非解析为标签
    expect(doc).toContain('<b>desc</b>');
  });
});

describe('buildCompletionSource', () => {
  const options = buildScriptCompletions(functions, variables);
  const source = buildCompletionSource(options);

  function run(doc: string, explicit = false) {
    const state = EditorState.create({ doc });
    return source(new CompletionContext(state, doc.length, explicit));
  }

  it('词元命中：从词起点返回全部候选', () => {
    const result = run('SU');
    expect(result).toBeTruthy();
    expect(result!.from).toBe(0);
    expect(result!.options).toHaveLength(options.length);
  });

  it('空词且非显式触发返回 null；显式触发（Ctrl-Space）返回候选', () => {
    expect(run('')).toBeNull();
    const explicit = run('', true);
    expect(explicit).toBeTruthy();
    expect(explicit!.options).toHaveLength(options.length);
  });
});
