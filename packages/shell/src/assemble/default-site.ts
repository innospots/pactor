/**
 * 包内默认站点（assets/site）定位：优先从宿主依赖解析
 * `@pactor-app/shell/styles.css`（exports 中稳定存在的入口），
 * 回退到本模块自身相对路径（仓库内源码 / dist 运行均为包根向上两级）。
 */
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

export function resolveDefaultSiteDir(rootDir?: string): string | null {
  try {
    const stylesPath = require.resolve('@pactor-app/shell/styles.css', {
      paths: [rootDir ?? process.cwd()],
    });
    const dir = join(dirname(stylesPath), 'assets/site');
    if (existsSync(dir)) return dir;
  } catch {
    // 未作为宿主依赖安装（仓库内直接跑源码）：走自身路径回退
  }
  const selfDir = join(dirname(fileURLToPath(import.meta.url)), '../../assets/site');
  return existsSync(selfDir) ? selfDir : null;
}
