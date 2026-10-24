import { readSync } from 'node:fs';
import { isatty } from 'node:tty';

/**
 * TTY 同步确认提示：打印问题后阻塞读取一行，y/yes 视为确认。
 *
 * 注意：不能用 process.stdin.isTTY 判断——访问 process.stdin 会让 libuv
 * 把 fd 0 置为非阻塞，随后的 readSync 直接抛 EAGAIN。tty.isatty(0)
 * 不触碰 stdin 流，fd 保持阻塞模式。
 *
 * CLI 全链路为同步设计（见 args.ts），故不用 readline 的异步接口；
 * 非 TTY（管道 / CI）或读取失败一律返回 false，由调用方走安全默认。
 */
export function confirm(question: string): boolean {
  if (!isatty(0)) return false;
  // 橙色（256 色 208 号）；confirm 只在 TTY 下走到这里，无需再判断
  process.stdout.write(`\x1b[38;5;208m${question}\x1b[39m [y/N] `);
  const buffer = Buffer.alloc(128);
  try {
    const bytesRead = readSync(0, buffer, 0, 128, null);
    const answer = buffer.subarray(0, bytesRead).toString().trim().toLowerCase();
    return answer === 'y' || answer === 'yes';
  } catch {
    return false;
  }
}
