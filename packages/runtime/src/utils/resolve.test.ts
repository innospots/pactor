import { afterEach, describe, expect, it, vi } from 'vitest';

import { LocalizationProtocolError, resolveDeep } from './resolve.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('resolveDeep $localizedText 分支', () => {
  it('静态 template + 标量 params 完成插值，返回终值字符串', () => {
    const result = resolveDeep(
      {
        $localizedText: {
          template: '你好，{{name}}！共 {{count}} 条',
          params: { name: '世界', count: 3 },
        },
      },
      {},
    );

    expect(result).toBe('你好，世界！共 3 条');
  });

  it('params 中的 ${state.x} 表达式按传入 scope 求值', () => {
    const result = resolveDeep(
      {
        $localizedText: {
          template: '共 {{count}} 条',
          params: { count: '${state.count + 1}' },
        },
      },
      { state: { count: 41 } },
    );

    expect(result).toBe('共 42 条');
  });

  it('无 params 时原样返回 template', () => {
    const result = resolveDeep(
      { $localizedText: { template: '纯静态文案' } },
      {},
    );

    expect(result).toBe('纯静态文案');
  });

  it('未知参数保留 {{name}} 占位符并记录诊断', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = resolveDeep(
      {
        $localizedText: {
          template: '你好，{{name}}，编号 {{id}}',
          params: { name: '世界' },
        },
      },
      {},
    );

    expect(result).toBe('你好，世界，编号 {{id}}');
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[@pactor-app/runtime]'),
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('{{id}}'));
  });

  it('template 含 ${ 形态时不进入表达式引擎（防注入）', () => {
    const result = resolveDeep(
      {
        $localizedText: {
          template: '${state.secret} 你好，{{name}}',
          params: { name: '世界' },
        },
      },
      { state: { secret: '不应出现' } },
    );

    expect(result).toBe('${state.secret} 你好，世界');
  });

  it('插值结果中的 $ / ${ 不二次求值', () => {
    const result = resolveDeep(
      {
        $localizedText: {
          template: '值：{{value}}',
          // 该表达式求值结果为字面量字符串 "${1+1}"
          params: { value: '${state.raw}' },
        },
      },
      { state: { raw: '${1+1}' } },
    );

    expect(result).toBe('值：${1+1}');
  });

  it('server 模式下 $localizedText 正常解析', () => {
    const result = resolveDeep(
      {
        $localizedText: {
          template: '你好，{{name}}',
          params: { name: '${state.name}' },
        },
      },
      { state: { name: '世界' } },
      { localizationMode: 'server' },
    );

    expect(result).toBe('你好，世界');
  });

  it('数组与嵌套对象中的 $localizedText 同样解析', () => {
    const result = resolveDeep(
      {
        items: [
          { $localizedText: { template: '第 {{n}} 项', params: { n: 1 } } },
        ],
      },
      {},
    );

    expect(result).toEqual({ items: ['第 1 项'] });
  });
});

describe('resolveDeep $i18n 协议保护', () => {
  const descriptor = { $i18n: { key: 'menu.home' } };

  it('默认（client）模式行为不变：$i18n 按普通对象递归', () => {
    const result = resolveDeep(
      { $i18n: { key: 'menu.home', params: { n: '${state.n}' } } },
      { state: { n: 2 } },
    );

    expect(result).toEqual({ $i18n: { key: 'menu.home', params: { n: 2 } } });
  });

  it('显式 client 模式行为不变', () => {
    const result = resolveDeep(descriptor, {}, { localizationMode: 'client' });

    expect(result).toEqual(descriptor);
  });

  it('server 模式遇到 $i18n 抛 LocalizationProtocolError', () => {
    expect(() =>
      resolveDeep(descriptor, {}, { localizationMode: 'server' }),
    ).toThrow(LocalizationProtocolError);
    expect(() =>
      resolveDeep(descriptor, {}, { localizationMode: 'server' }),
    ).toThrow(/\$i18n/);
  });

  it('server 模式嵌套在数组 / params 内的 $i18n 同样被拒绝', () => {
    expect(() =>
      resolveDeep({ items: [descriptor] }, {}, { localizationMode: 'server' }),
    ).toThrow(LocalizationProtocolError);
  });
});
