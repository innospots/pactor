import { describe, expect, it } from 'vitest';

import { HELP_TEXT, runCli } from './cli.js';
import { createTestIo } from './test-utils.js';

describe('CLI 入口', () => {
  it('--help 输出六个命令，退出码 0', () => {
    const { io, out, err } = createTestIo();
    const code = runCli(['--help'], io);
    expect(code).toBe(0);
    expect(err).toEqual([]);
    const text = out.join('\n');
    for (const command of ['validate', 'inspect', 'lint', 'schema', 'build', 'create']) {
      expect(text).toContain(command);
    }
  });

  it('无参数等同 --help，退出码 0', () => {
    const { io } = createTestIo();
    expect(runCli([], io)).toBe(0);
  });

  it('未知命令报错，退出码 2', () => {
    const { io, err } = createTestIo();
    const code = runCli(['nope'], io);
    expect(code).toBe(2);
    expect(err.join('\n')).toContain('未知命令: nope');
  });

  it('帮助文本含退出码语义', () => {
    expect(HELP_TEXT).toContain('退出码');
  });
});
