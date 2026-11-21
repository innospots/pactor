import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

const pkgDir = join(dirname(fileURLToPath(import.meta.url)), '..');

interface JsonRpcMessage {
  id?: number;
  result?: unknown;
  error?: unknown;
}

/** 以 stdio 启动真实 server 进程，走完整协议流程（需要先构建 dist） */
describe('stdio 协议冒烟', () => {
  const child = spawn('node', [join(pkgDir, 'dist/cli.js')], {
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const pending = new Map<number, (msg: JsonRpcMessage) => void>();
  let buffer = '';

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (chunk: string) => {
    buffer += chunk;
    let index = buffer.indexOf('\n');
    while (index >= 0) {
      const line = buffer.slice(0, index).trim();
      buffer = buffer.slice(index + 1);
      index = buffer.indexOf('\n');
      if (!line) continue;
      const msg = JSON.parse(line) as JsonRpcMessage & { id?: number };
      if (msg.id !== undefined && pending.has(msg.id)) {
        pending.get(msg.id)!(msg);
        pending.delete(msg.id);
      }
    }
  });

  afterAll(() => {
    child.kill();
  });

  const request = (id: number, method: string, params?: unknown): Promise<JsonRpcMessage> =>
    new Promise((resolvePromise, reject) => {
      pending.set(id, resolvePromise);
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
      setTimeout(() => reject(new Error(`timeout waiting for ${method}`)), 10_000);
    });

  it('initialize → tools/list → resources/read', async () => {
    const init = await request(1, 'initialize', {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: { name: 'stdio-smoke', version: '0.0.1' },
    });
    const serverInfo = (init.result as { serverInfo: { name: string } }).serverInfo;
    expect(serverInfo.name).toBe('pactor');

    child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })}\n`);

    const tools = await request(2, 'tools/list');
    const toolNames = (tools.result as { tools: { name: string }[] }).tools.map((t) => t.name);
    expect(toolNames.sort()).toEqual([
      'get_component',
      'get_dsl_reference',
      'list_actions',
      'list_components',
      'validate_dsl',
    ]);

    const resource = await request(3, 'resources/read', {
      uri: 'pactor://reference/dsl-authoring',
    });
    const contents = (resource.result as { contents: { mimeType?: string; text?: string }[] })
      .contents;
    expect(contents[0].mimeType).toBe('text/markdown');
    expect(contents[0].text).toContain('Page skeleton');
  }, 15_000);
});
