import { describe, expect, it } from 'vitest';

import { flagValue, parseArgs, UsageError } from './args.js';

describe('parseArgs', () => {
  it('解析位置参数', () => {
    const args = parseArgs(['a.yaml', 'b.yaml']);
    expect(args.positionals).toEqual(['a.yaml', 'b.yaml']);
    expect(args.flags).toEqual({});
  });

  it('解析长 flag：布尔与 = 值', () => {
    const args = parseArgs(['--force', '--out=dist']);
    expect(args.flags).toEqual({ force: true, out: 'dist' });
  });

  it('解析带值短 flag -o / -t', () => {
    const args = parseArgs(['src', '-o', 'dist', '-t', 'app']);
    expect(args.positionals).toEqual(['src']);
    expect(flagValue(args, 'o')).toBe('dist');
    expect(flagValue(args, 't')).toBe('app');
  });

  it('-o 缺值抛 UsageError', () => {
    expect(() => parseArgs(['-o'])).toThrow(UsageError);
  });

  it('解析带值长 flag --dir / --config（空格与 = 两种形态）', () => {
    const args = parseArgs(['build', '--dir', '/tmp/proj', '--config=custom.json']);
    expect(args.positionals).toEqual(['build']);
    expect(flagValue(args, 'dir')).toBe('/tmp/proj');
    expect(flagValue(args, 'config')).toBe('custom.json');
  });

  it('--dir 缺值抛 UsageError', () => {
    expect(() => parseArgs(['--dir'])).toThrow(UsageError);
  });

  it('flagValue 对布尔 flag 返回 undefined', () => {
    const args = parseArgs(['--force']);
    expect(flagValue(args, 'force')).toBeUndefined();
  });
});
