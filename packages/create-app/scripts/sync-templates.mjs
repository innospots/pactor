#!/usr/bin/env node
/**
 * 模板同步脚本（node 直接运行，无依赖）：
 * starters/next-app-starter → templates/next-app
 * starters/spa-starter      → templates/spa
 *
 * 转换规则：
 * - package.json：name → `__APP_NAME__`；`link:` 依赖 → `^<pactor-app 版本>`；删除 packageManager
 * - README.md：首行标题 → `# __APP_NAME__`
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = dirname(dirname(fileURLToPath(import.meta.url)));
const repoRoot = dirname(dirname(packageDir));

/** 家族版本：从 packages/pactor/package.json 动态读取，不硬编码 */
const pactorVersion = JSON.parse(
  readFileSync(join(repoRoot, 'packages/pactor/package.json'), 'utf8'),
).version;

/** starter 源目录 → 模板名 */
const SOURCES = [
  ['starters/next-app-starter', 'next-app'],
  ['starters/spa-starter', 'spa'],
];

/** 目录级排除（任意深度，按名称匹配） */
const EXCLUDED_DIRS = new Set(['node_modules', '.next', 'dist']);
/** 文件级排除（lockfile / 构建缓存 / next 自动生成）。
 * pnpm-workspace.yaml 同步保留：其中 onlyBuiltDependencies 是独立安装时
 * 批准原生依赖构建脚本的关键配置（避免 ERR_PNPM_IGNORED_BUILDS） */
const EXCLUDED_FILES = new Set([
  'pnpm-lock.yaml',
  'tsconfig.tsbuildinfo',
  'next-env.d.ts',
  'AGENTS.md',
  'CLAUDE.md',
]);

/** 是否排除该条目（.env* 一律排除，防敏感文件入库） */
function isExcluded(name, isDirectory) {
  if (name === '.env' || name.startsWith('.env.')) return true;
  return isDirectory ? EXCLUDED_DIRS.has(name) : EXCLUDED_FILES.has(name);
}

/** 转换 package.json：占位应用名 + link: → ^version + 移除 packageManager */
function transformPackageJson(content) {
  const pkg = JSON.parse(content);
  pkg.name = '__APP_NAME__';
  for (const field of ['dependencies', 'devDependencies']) {
    for (const [dep, range] of Object.entries(pkg[field] ?? {})) {
      if (range.startsWith('link:')) {
        pkg[field][dep] = `^${pactorVersion}`;
      }
    }
  }
  delete pkg.packageManager;
  return `${JSON.stringify(pkg, null, 2)}\n`;
}

/** 转换 README.md：首行标题替换为 `# __APP_NAME__`，正文不动 */
function transformReadme(content) {
  const newline = content.indexOf('\n');
  if (newline < 0) return '# __APP_NAME__\n';
  return `# __APP_NAME__${content.slice(newline)}`;
}

/** 递归同步目录（全量覆盖，目标先清空） */
function syncDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const from = join(src, entry);
    const to = join(dest, entry);
    const isDirectory = statSync(from).isDirectory();
    if (isExcluded(entry, isDirectory)) continue;
    if (isDirectory) {
      syncDir(from, to);
      continue;
    }
    if (entry === 'package.json') {
      writeFileSync(to, transformPackageJson(readFileSync(from, 'utf8')), 'utf8');
    } else if (entry === 'README.md') {
      writeFileSync(to, transformReadme(readFileSync(from, 'utf8')), 'utf8');
    } else {
      cpSync(from, to);
    }
  }
}

for (const [source, template] of SOURCES) {
  const src = join(repoRoot, source);
  const dest = join(packageDir, 'templates', template);
  if (!existsSync(src)) {
    console.error(`模板源不存在: ${src}`);
    process.exit(1);
  }
  rmSync(dest, { recursive: true, force: true });
  syncDir(src, dest);
  console.log(`已同步 ${source} → templates/${template}`);
}
console.log(`依赖版本: ^${pactorVersion}`);
