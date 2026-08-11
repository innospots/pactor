import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { CliIo } from './args.js';

/** 内存收集 IO：测试注入命令处理器 */
export function createTestIo(): { io: CliIo; out: string[]; err: string[] } {
  const out: string[] = [];
  const err: string[] = [];
  return {
    io: {
      out: (line) => out.push(line),
      err: (line) => err.push(line),
    },
    out,
    err,
  };
}

/** 创建临时目录，返回路径与清理函数 */
export function createTempDir(): { dir: string; cleanup: () => void } {
  const dir = mkdtempSync(join(tmpdir(), 'pactor-cli-test-'));
  return { dir, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

/** 写文本文件（父目录需已存在或由调用方保证） */
export function writeText(file: string, content: string): void {
  writeFileSync(file, content, 'utf8');
}

/** 合法 Page DSL fixture（两个组件 + 一个 dataSource + 动作 + 权限 + 表达式） */
export const VALID_PAGE_YAML = `dsl: '1.0'
page:
  id: demo
  title: 演示页
  type: list
  permission: demo:view
state:
  keyword: ''
dataSources:
  customers:
    type: service
    service: customer.list
    autoLoad: true
body:
  type: Page
  props:
    title: \${state.keyword}
  children:
    - type: Button
      props:
        text: 搜索
      events:
        onClick:
          action: navigate
          params:
            to: /home
`;

/** 非法 Page DSL fixture（缺少 page.id） */
export const INVALID_PAGE_YAML = `dsl: '1.0'
page:
  title: 无 id
`;
