/**
 * 极简命令行参数解析（设计决策：手写，不引 commander/cac）。
 *
 * 支持形态：
 * - 位置参数：`pactor validate a.page.yaml b.page.yaml`
 * - 长 flag：`--flag`（布尔）或 `--flag=value`
 * - 短 flag：`-o value`（带值短选项，见 {@link SHORT_VALUE_FLAGS}）
 */

/** 可注入的输出通道：命令处理器经此输出，测试注入内存收集函数 */
export interface CliIo {
  /** 标准输出一行 */
  out(line: string): void;
  /** 标准错误一行 */
  err(line: string): void;
}

/** 解析结果：位置参数 + flag 表（布尔 flag 值为 true） */
export interface ParsedArgs {
  positionals: string[];
  flags: Record<string, string | boolean>;
}

/** 带值短选项（`-o <file>` / `-t <template>`）；其余短选项按布尔处理 */
const SHORT_VALUE_FLAGS = new Set(['o', 't']);

/** 参数用法错误：CLI 入口捕获后以退出码 2 处理 */
export class UsageError extends Error {}

/**
 * 解析 argv（已去除 node 与脚本名）。
 * `-o` / `-t` 缺值时抛 {@link UsageError}。
 */
export function parseArgs(argv: string[]): ParsedArgs {
  const positionals: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]!;

    if (token.startsWith('--')) {
      const body = token.slice(2);
      const eq = body.indexOf('=');
      if (eq >= 0) {
        flags[body.slice(0, eq)] = body.slice(eq + 1);
      } else {
        flags[body] = true;
      }
      continue;
    }

    if (token.startsWith('-') && token.length > 1) {
      const name = token.slice(1);
      if (SHORT_VALUE_FLAGS.has(name)) {
        const value = argv[i + 1];
        if (value === undefined) {
          throw new UsageError(`选项 -${name} 缺少值`);
        }
        flags[name] = value;
        i += 1;
      } else {
        flags[name] = true;
      }
      continue;
    }

    positionals.push(token);
  }

  return { positionals, flags };
}

/** 读取字符串型 flag（布尔 flag 视为未提供值） */
export function flagValue(
  args: ParsedArgs,
  name: string,
): string | undefined {
  const value = args.flags[name];
  return typeof value === 'string' ? value : undefined;
}
