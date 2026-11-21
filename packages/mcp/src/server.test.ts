import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createPactorMcpServer } from './server.js';

const VALID_DSL = `dsl: '1.0'
page: { id: demo, title: Demo }
body:
  type: Page
  children: []
`;

const INVALID_DSL = `dsl: '1.0'
page: { title: NoId }
body:
  type: Page
`;

let client: Client;

beforeAll(async () => {
  const server = createPactorMcpServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  client = new Client({ name: 'test-client', version: '0.0.1' });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
});

afterAll(async () => {
  await client.close();
});

describe('协议握手', () => {
  it('tools/list 恰好返回 5 个工具', async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([
      'get_component',
      'get_dsl_reference',
      'list_actions',
      'list_components',
      'validate_dsl',
    ]);
  });
});

describe('validate_dsl', () => {
  it('合法 DSL 返回 valid: true', async () => {
    const result = await client.callTool({
      name: 'validate_dsl',
      arguments: { dsl: VALID_DSL },
    });
    expect(result.isError).toBeFalsy();
    expect(result.structuredContent).toMatchObject({ valid: true, errors: [] });
  });

  it('缺少 page.id 返回结构化 required 错误', async () => {
    const result = await client.callTool({
      name: 'validate_dsl',
      arguments: { dsl: INVALID_DSL },
    });
    expect(result.isError).toBe(true);
    const content = result.structuredContent as {
      valid: boolean;
      errors: { path: string; keyword: string }[];
    };
    expect(content.valid).toBe(false);
    expect(content.errors.some((e) => e.path === '/page/id' && e.keyword === 'required')).toBe(
      true,
    );
  });

  it('不可解析输入返回解析错误', async () => {
    const result = await client.callTool({
      name: 'validate_dsl',
      arguments: { dsl: '[unclosed' },
    });
    expect(result.isError).toBe(true);
    const content = result.content as { text: string }[];
    expect(content[0].text).toContain('解析失败');
  });
});

describe('get_component', () => {
  it('大小写不敏感命中，返回完整契约', async () => {
    const result = await client.callTool({
      name: 'get_component',
      arguments: { name: 'table' },
    });
    const entry = result.structuredContent as Record<string, unknown>;
    expect(entry.name).toBe('Table');
    expect(entry.keyProps).toBeTruthy();
    expect(entry.example).toBeTruthy();
  });

  it('未命中时给出相近候选', async () => {
    const result = await client.callTool({
      name: 'get_component',
      arguments: { name: 'tabl' },
    });
    expect(result.isError).toBe(true);
    const content = result.content as { text: string }[];
    expect(content[0].text).toContain('Table');
  });
});

describe('get_dsl_reference', () => {
  it('不带参数返回章节目录与首章', async () => {
    const result = await client.callTool({ name: 'get_dsl_reference', arguments: {} });
    const content = result.structuredContent as { sections: string[] };
    expect(content.sections.length).toBeGreaterThanOrEqual(10);
    expect(content.sections.some((t) => t.includes('Expressions'))).toBe(true);
  });

  it('模糊匹配返回指定章节', async () => {
    const result = await client.callTool({
      name: 'get_dsl_reference',
      arguments: { section: 'expressions' },
    });
    const section = result.structuredContent as { title: string; content: string };
    expect(section.title).toContain('Expressions');
    expect(section.content).toContain('scope');
  });

  it('未知章节返回错误与目录', async () => {
    const result = await client.callTool({
      name: 'get_dsl_reference',
      arguments: { section: 'no-such-section-xyz' },
    });
    expect(result.isError).toBe(true);
  });
});

describe('list_components / list_actions', () => {
  it('list_components 按分类分组且覆盖核心组件', async () => {
    const result = await client.callTool({ name: 'list_components', arguments: {} });
    const content = result.structuredContent as {
      total: number;
      components: { name: string; category: string }[];
    };
    expect(content.total).toBeGreaterThan(150);
    for (const name of ['Table', 'Form', 'Button', 'Chat', 'LineChart', 'Login']) {
      expect(content.components.some((c) => c.name === name)).toBe(true);
    }
  });

  it('list_actions 覆盖标准 action，name 过滤返回单个详情', async () => {
    const all = await client.callTool({ name: 'list_actions', arguments: {} });
    const list = (all.structuredContent as { actions: { name: string }[] }).actions.map(
      (a) => a.name,
    );
    for (const name of ['setState', 'reload', 'request', 'navigate', 'message', 'if', 'sequence', 'parallel']) {
      expect(list).toContain(name);
    }

    const single = await client.callTool({ name: 'list_actions', arguments: { name: 'navigate' } });
    const entry = single.structuredContent as { name: string; params: string };
    expect(entry.name).toBe('navigate');
    expect(entry.params).toContain('to');
  });
});

describe('resource', () => {
  it('pactor://reference/dsl-authoring 返回完整 Markdown', async () => {
    const result = await client.readResource({ uri: 'pactor://reference/dsl-authoring' });
    expect(result.contents).toHaveLength(1);
    const content = result.contents[0] as { text?: string; mimeType?: string };
    expect(content.mimeType).toBe('text/markdown');
    expect(content.text).toContain('Page skeleton');
    expect(content.text?.length).toBeGreaterThan(10_000);
  });
});
