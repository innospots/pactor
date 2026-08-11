import { describe, expect, it } from 'vitest';
import type { ModuleNode, Plugin, ViteDevServer } from 'vite';

import { pactor } from './index.js';
import type { PactorPluginOptions } from './index.js';

/** 合法 page DSL fixture */
const VALID_PAGE_YAML = `dsl: '1.0'
page:
  id: user-list
  title: 用户列表
state:
  keyword: ''
body:
  type: Page
`;

/** 缺少 page.id 的非法 page DSL */
const INVALID_PAGE_YAML = `dsl: '1.0'
page:
  title: 缺少 id
body:
  type: Page
`;

const VALID_FRAGMENT_YAML = `dsl: '1.0'
fragment:
  id: user-card
body:
  type: Card
`;

/** mock 的 Rollup plugin context：this.error 直接抛错便于断言 */
function createPluginContext() {
  return {
    error(message: string): never {
      throw new Error(message);
    },
  };
}

type TransformFn = (
  this: ReturnType<typeof createPluginContext>,
  code: string,
  id: string,
) => { code: string } | null | undefined;

/** 取出插件钩子函数（兼容函数与 { handler } 两种形态） */
function resolveHook<T>(hook: unknown): T {
  const fn =
    typeof hook === 'function'
      ? hook
      : hook && typeof hook === 'object'
        ? (hook as { handler?: unknown }).handler
        : undefined;
  if (typeof fn !== 'function') throw new Error('插件钩子未定义');
  return fn as T;
}

/** 取出插件的 transform 钩子函数 */
function getTransform(options?: PactorPluginOptions): TransformFn {
  const plugin: Plugin = pactor(options);
  return resolveHook<TransformFn>(plugin.transform);
}

function runTransform(code: string, id: string, options?: PactorPluginOptions) {
  return getTransform(options).call(createPluginContext(), code, id);
}

describe('pactor vite 插件', () => {
  it('插件名称为 pactor 且 enforce 为 pre', () => {
    const plugin = pactor();
    expect(plugin.name).toBe('pactor');
    expect(plugin.enforce).toBe('pre');
  });

  it('合法 page 转换：default 导出 PageDsl 对象，dslVersion 为 dsl 字段', () => {
    const result = runTransform(VALID_PAGE_YAML, '/src/user-list.page.yaml');
    expect(result).not.toBeNull();
    expect(result?.code).toContain('export default page;');
    expect(result?.code).toContain('export const dslVersion = page.dsl;');
    expect(result?.code).toContain('"id":"user-list"');
    expect(result?.code).toContain('"dsl":"1.0"');
  });

  it('.yml 后缀同样匹配', () => {
    const result = runTransform(VALID_PAGE_YAML, '/src/user-list.page.yml');
    expect(result?.code).toContain('"id":"user-list"');
  });

  it('普通 yaml 不处理：返回空', () => {
    expect(runTransform('foo: bar', '/src/config.yaml')).toBeNull();
    expect(runTransform('foo: bar', '/src/config.yml')).toBeNull();
  });

  it('缺少 page.id 报错：信息含文件标识与 /page/id', () => {
    expect(() => runTransform(INVALID_PAGE_YAML, '/src/bad.page.yaml')).toThrowError(
      /\/src\/bad\.page\.yaml/,
    );
    expect(() => runTransform(INVALID_PAGE_YAML, '/src/bad.page.yaml')).toThrowError(
      /\/page\/id: .+ \(required\)/,
    );
  });

  it('YAML 语法错误：报错信息含位置', () => {
    const broken = 'dsl: "1.0"\npage:\n  id: [unclosed\n';
    expect(() => runTransform(broken, '/src/broken.page.yaml')).toThrowError(/行 \d+ 列 \d+/);
    expect(() => runTransform(broken, '/src/broken.page.yaml')).toThrowError(
      /\/src\/broken\.page\.yaml/,
    );
  });

  it('fragment 转换：default 导出 FragmentDsl，dslVersion 为 fragment.dsl', () => {
    const result = runTransform(VALID_FRAGMENT_YAML, '/src/user-card.fragment.yaml');
    expect(result?.code).toContain('export default fragment;');
    expect(result?.code).toContain('export const dslVersion = fragment.dsl;');
    expect(result?.code).toContain('"id":"user-card"');
  });

  it('fragment 缺少 body 报错', () => {
    const broken = `dsl: '1.0'\nfragment:\n  id: x\n`;
    expect(() => runTransform(broken, '/src/x.fragment.yaml')).toThrowError(/dsl 与 body/);
  });

  it('validate: false 时缺少 page.id 也转换成功', () => {
    const result = runTransform(INVALID_PAGE_YAML, '/src/bad.page.yaml', { validate: false });
    expect(result?.code).toContain('export default page;');
  });

  it('自定义 include：匹配 .dsl.yaml，默认后缀不再匹配', () => {
    const options: PactorPluginOptions = { include: /\.dsl\.yaml$/ };
    const result = runTransform(VALID_PAGE_YAML, '/src/user-list.dsl.yaml', options);
    expect(result?.code).toContain('"id":"user-list"');
    // 默认后缀被覆盖，不再匹配
    expect(runTransform(VALID_PAGE_YAML, '/src/user-list.page.yaml', options)).toBeNull();
  });

  it('include 支持正则数组', () => {
    const options: PactorPluginOptions = { include: [/\.dsl\.yaml$/, /\.page\.yaml$/] };
    expect(runTransform(VALID_PAGE_YAML, '/a.dsl.yaml', options)).not.toBeNull();
    expect(runTransform(VALID_PAGE_YAML, '/a.page.yaml', options)).not.toBeNull();
  });

  describe('handleHotUpdate', () => {
    function createServer() {
      const sent: unknown[] = [];
      const server = {
        ws: { send: (payload: unknown) => sent.push(payload) },
      } as unknown as ViteDevServer;
      return { server, sent };
    }

    function getHmr(options?: PactorPluginOptions) {
      const plugin = pactor(options);
      return resolveHook<(ctx: {
        file: string;
        server: ViteDevServer;
        modules: ModuleNode[];
        timestamp: number;
      }) => unknown>(plugin.handleHotUpdate);
    }

    it('DSL 文件变更且有模块记录：返回相关模块列表', () => {
      const { server, sent } = createServer();
      const modules = [{} as ModuleNode];
      const result = getHmr()({
        file: '/src/user-list.page.yaml',
        server,
        modules,
        timestamp: Date.now(),
      });
      expect(result).toBe(modules);
      expect(sent).toHaveLength(0);
    });

    it('DSL 文件变更但无模块记录：触发 full-reload', () => {
      const { server, sent } = createServer();
      const result = getHmr()({
        file: '/src/user-list.page.yaml',
        server,
        modules: [],
        timestamp: Date.now(),
      });
      expect(result).toEqual([]);
      expect(sent).toEqual([{ type: 'full-reload' }]);
    });

    it('非 DSL 文件：不干预热更新', () => {
      const { server, sent } = createServer();
      const result = getHmr()({
        file: '/src/main.ts',
        server,
        modules: [],
        timestamp: Date.now(),
      });
      expect(result).toBeUndefined();
      expect(sent).toHaveLength(0);
    });
  });
});
