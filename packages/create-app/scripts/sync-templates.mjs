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

/** starter 源 → 模板：renamePackage 为 true 时 package.json name 替换为 __APP_NAME__
 * （单应用模板）；多工程模板（apps-shell）各子包名互相引用，必须保留 */
const SOURCES = [
  { source: 'starters/next-app-starter', template: 'next-app', renamePackage: true },
  { source: 'starters/spa-starter', template: 'spa', renamePackage: true },
  { source: 'starters/apps-shell-starter', template: 'apps-shell', renamePackage: false },
];

/** 目录级排除（任意深度，按名称匹配） */
const EXCLUDED_DIRS = new Set(['node_modules', '.next', 'dist', 'dist-module', '.generated']);
/** 文件级排除（lockfile / 构建缓存 / next 自动生成）。
 * pnpm-workspace.yaml 同步保留：其中 allowBuilds 是独立安装时
 * 批准原生依赖构建脚本的关键配置（避免 ERR_PNPM_IGNORED_BUILDS） */
const EXCLUDED_FILES = new Set([
  'pnpm-lock.yaml',
  'tsconfig.tsbuildinfo',
  'next-env.d.ts',
  'AGENTS.md',
  'CLAUDE.md',
]);

/** 是否排除该条目（.env* 一律排除，防敏感文件入库；模块打包产物 *.tgz 不进模板） */
function isExcluded(name, isDirectory) {
  if (name === '.env' || name.startsWith('.env.')) return true;
  if (!isDirectory && name.endsWith('.tgz')) return true;
  return isDirectory ? EXCLUDED_DIRS.has(name) : EXCLUDED_FILES.has(name);
}

/** 转换 package.json：link: → ^version + 移除 packageManager；单应用模板另占位应用名 */
function transformPackageJson(content, renamePackage) {
  const pkg = JSON.parse(content);
  if (renamePackage) {
    pkg.name = '__APP_NAME__';
  }
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

/** 递归同步目录（全量覆盖，目标先清空）。README 标题替换仅作用于模板根，
 * 多工程模板各子 README 保留原标题 */
function syncDir(src, dest, renamePackage, isRoot = true) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const from = join(src, entry);
    const to = join(dest, entry);
    const isDirectory = statSync(from).isDirectory();
    if (isExcluded(entry, isDirectory)) continue;
    if (isDirectory) {
      syncDir(from, to, renamePackage, false);
      continue;
    }
    if (entry === 'package.json') {
      writeFileSync(to, transformPackageJson(readFileSync(from, 'utf8'), renamePackage), 'utf8');
    } else if (entry === 'README.md' && isRoot) {
      writeFileSync(to, transformReadme(readFileSync(from, 'utf8')), 'utf8');
    } else if (src.startsWith(join(repoRoot, 'starters/next-app-starter')) && [
      'src/backend/fixtures/system-settings.json',
      'src/backend/pages/i18n/locales/en-US/app.yaml',
      'src/backend/pages/i18n/locales/zh-CN/app.yaml',
      'src/app/layout.tsx',
      'src/backend/pages/yaml/sitemap.yaml',
      'src/backend/pages/yaml/auth/login.page.yaml',
    ].includes(from.slice(join(repoRoot, 'starters/next-app-starter').length + 1))) {
      writeFileSync(to, readFileSync(from, 'utf8').replaceAll('Example Admin', '{{APP_TITLE}}'), 'utf8');
    } else {
      cpSync(from, to);
    }
  }
}

for (const { source, template, renamePackage } of SOURCES) {
  const src = join(repoRoot, source);
  const dest = join(packageDir, 'templates', template);
  if (!existsSync(src)) {
    console.error(`模板源不存在: ${src}`);
    process.exit(1);
  }
  rmSync(dest, { recursive: true, force: true });
  syncDir(src, dest, renamePackage);
  console.log(`已同步 ${source} → templates/${template}`);
}
console.log(`依赖版本: ^${pactorVersion}`);
