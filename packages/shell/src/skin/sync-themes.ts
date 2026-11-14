/**
 * 将 @pactor-app/theme 的预置皮肤同步到宿主 public/themes。
 *
 * 首屏防闪烁需要 <head> 中同步插入 <link href="/themes/<name>.css">；
 * node_modules 里的 CSS 不能直接作为 public URL，因此保留这份生成副本。
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

export interface SyncThemesOptions {
  /** 宿主工程根，缺省 process.cwd() */
  appRoot?: string;
  /** 缺省 <appRoot>/public/themes */
  outputDir?: string;
  checkOnly?: boolean;
}

export interface SyncThemesResult {
  synced: number;
  /** checkOnly 时经错误信息暴露，正常返回恒为空数组 */
  stale: string[];
}

interface ThemeManifestEntry {
  name: string;
}

function fail(message: string): never {
  throw new Error(`[theme-css] ${message}`);
}

export function syncThemes(options: SyncThemesOptions = {}): SyncThemesResult {
  const appRoot = options.appRoot ?? process.cwd();
  const outputDir = options.outputDir ?? join(appRoot, 'public', 'themes');
  const checkOnly = options.checkOnly === true;

  // @pactor-app/theme 是本包的依赖：从包内解析，不要求宿主直接依赖它
  const require = createRequire(import.meta.url);
  const manifestPath = require.resolve('@pactor-app/theme/themes.json');
  const packageRoot = dirname(manifestPath);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
    themes?: ThemeManifestEntry[];
  };
  if (!Array.isArray(manifest.themes)) {
    fail('themes.json must contain a themes array');
  }

  const expected = new Map<string, string>();
  for (const theme of manifest.themes) {
    if (!theme || !/^[a-z0-9-]+$/.test(theme.name)) {
      fail(`invalid theme name: ${JSON.stringify(theme?.name)}`);
    }
    const source = join(packageRoot, 'skins', `${theme.name}.css`);
    if (!existsSync(source)) {
      fail(`missing ${source}; run "pnpm --filter @pactor-app/theme build" first`);
    }
    expected.set(`${theme.name}.css`, readFileSync(source, 'utf8'));
  }

  if (!checkOnly) mkdirSync(outputDir, { recursive: true });
  const current = existsSync(outputDir)
    ? readdirSync(outputDir).filter((file) => file.endsWith('.css'))
    : [];

  const stale: string[] = [];
  for (const [file, content] of expected) {
    const target = join(outputDir, file);
    if (checkOnly) {
      if (!existsSync(target) || readFileSync(target, 'utf8') !== content) {
        stale.push(file);
      }
    } else {
      writeFileSync(target, content);
    }
  }
  for (const file of current) {
    if (expected.has(file)) continue;
    if (checkOnly) stale.push(`${file} (orphan)`);
    else rmSync(join(outputDir, file));
  }

  if (checkOnly && stale.length > 0) {
    fail(`public/themes is stale; run "pactor-shell theme sync" and commit: ${stale.join(', ')}`);
  }

  return { synced: expected.size, stale };
}
