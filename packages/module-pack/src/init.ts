import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { CONFIG_DEFAULTS, CONFIG_FILE } from './config.js';
import { DEFAULT_TARGET } from './profiles/index.js';

/**
 * `initModule`：目标工程接入面的一次性初始化（幂等、只新增不破坏）：
 * - 生成 pactor.module.json（已存在则跳过）；
 * - 扫描 src/pactor 生成 module/client.ts（已存在则跳过）；
 * - 向 package.json 注入 files / exports / scripts / peerDependencies
 *   （已存在的字段不覆盖，冲突时 warning）。
 * 绝不修改目标工程 app/、src/ 下的任何现有文件。
 */

export interface InitModuleOptions {
  /** 目标工程根（默认 cwd） */
  dir?: string;
  /**
   * 覆盖已存在的初始化文件（pactor.module.json / module/client.ts）。
   * 缺省 false 时跳过已存在文件；由 CLI 负责询问用户后传入。
   */
  overwrite?: boolean;
}

export interface InitModuleResult {
  created: string[];
  /** overwrite 时重新生成（覆盖）的文件 */
  overwritten: string[];
  skipped: string[];
  warnings: string[];
}

interface ActionSource {
  /** 工程相对导入路径（无扩展名，如 ../src/pactor/risk-actions） */
  specifier: string;
  /** 具名导出（如 riskActions） */
  exports: string[];
}

/** 执行初始化，返回创建 / 覆盖 / 跳过 / 告警清单 */
export function initModule(options: InitModuleOptions = {}): InitModuleResult {
  const projectDir = resolve(options.dir ?? process.cwd());
  const overwrite = options.overwrite ?? false;
  const result: InitModuleResult = { created: [], overwritten: [], skipped: [], warnings: [] };

  const pkgFile = join(projectDir, 'package.json');
  if (!existsSync(pkgFile)) {
    throw new Error(`未找到 package.json: ${projectDir}（请在目标工程根执行）`);
  }
  const pkg = JSON.parse(readFileSync(pkgFile, 'utf8')) as Record<string, unknown>;

  const id = deriveModuleId(pkg.name);
  const actions = discoverActions(projectDir);
  const hasComponents = discoverComponents(projectDir);

  // 1) pactor.module.json
  const configFile = join(projectDir, CONFIG_FILE);
  const renderConfig = (): Record<string, unknown> => ({
    id,
    name: typeof pkg.name === 'string' ? pkg.name : id,
    basePath: `/${id}`,
    yamlRoot: CONFIG_DEFAULTS.yamlRoot,
    clientEntry: CONFIG_DEFAULTS.clientEntry,
    actions: actions.map((action) => action.specifier.replace(/^\.\.\//, '')),
    publicDir: CONFIG_DEFAULTS.publicDir,
    target: DEFAULT_TARGET,
  });
  const configExisted = existsSync(configFile);
  if (configExisted && !overwrite) {
    result.skipped.push(`${CONFIG_FILE}（已存在）`);
  } else {
    writeFileSync(configFile, `${JSON.stringify(renderConfig(), null, 2)}\n`, 'utf8');
    if (configExisted) {
      result.overwritten.push(CONFIG_FILE);
    } else {
      result.created.push(CONFIG_FILE);
    }
  }

  // 2) module/client.ts
  const clientFile = join(projectDir, CONFIG_DEFAULTS.clientEntry);
  if (existsSync(clientFile) && !overwrite) {
    result.skipped.push(`${CONFIG_DEFAULTS.clientEntry}（已存在）`);
  } else {
    mkdirSync(join(projectDir, 'module'), { recursive: true });
    const existed = existsSync(clientFile);
    writeFileSync(clientFile, renderClientEntry(hasComponents, actions), 'utf8');
    if (existed) {
      result.overwritten.push(CONFIG_DEFAULTS.clientEntry);
    } else {
      result.created.push(CONFIG_DEFAULTS.clientEntry);
    }
  }

  // 3) package.json 注入（不覆盖已有字段，冲突 warning）
  injectPackageJson(pkg, result);
  writeFileSync(pkgFile, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  result.created.push('package.json（注入 files / exports / scripts / peerDependencies）');

  return result;
}

/** 模块 id 统一前缀（缺省自动补齐，已有则不重复添加） */
export const MODULE_ID_PREFIX = 'pactor-app-';

/** 从包名推导模块 id：去 scope、kebab 化、补 pactor-app- 前缀 */
export function deriveModuleId(name: unknown): string {
  const base = typeof name === 'string' && name.length > 0 ? name : 'module';
  const withoutScope = base.startsWith('@') ? base.slice(base.indexOf('/') + 1) : base;
  const kebab = withoutScope
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const id = kebab.length > 0 ? kebab : 'module';
  return id.startsWith(MODULE_ID_PREFIX) ? id : `${MODULE_ID_PREFIX}${id}`;
}

/** 扫描 src/pactor/*-actions.ts 的具名导出（export const xxx） */
export function discoverActions(projectDir: string): ActionSource[] {
  const dir = join(projectDir, 'src/pactor');
  if (!existsSync(dir)) return [];
  const sources: ActionSource[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    if (!entry.isFile() || !entry.name.endsWith('-actions.ts')) continue;
    const file = join(dir, entry.name);
    const content = readFileSync(file, 'utf8');
    const exports = [...content.matchAll(/export\s+const\s+([A-Za-z_$][\w$]*)/g)].map(
      (match) => match[1]!,
    );
    if (exports.length === 0) continue;
    sources.push({
      specifier: `../src/pactor/${entry.name.replace(/\.ts$/, '')}`,
      exports,
    });
  }
  return sources;
}

/** 检测 src/pactor/components/index.ts 是否导出 pactorComponents */
export function discoverComponents(projectDir: string): boolean {
  const file = join(projectDir, 'src/pactor/components/index.ts');
  if (!existsSync(file)) return false;
  return /export\s+(const|\{[^}]*)\s*pactorComponents/.test(readFileSync(file, 'utf8'));
}

/** 生成 module/client.ts 内容（export const extensions = { components, actions }） */
export function renderClientEntry(hasComponents: boolean, actions: ActionSource[]): string {
  const imports: string[] = [];
  const spreads: string[] = [];
  if (hasComponents) {
    imports.push("import { pactorComponents } from '../src/pactor/components';");
  }
  for (const action of actions) {
    imports.push(
      `import { ${action.exports.join(', ')} } from '${action.specifier}';`,
    );
    spreads.push(...action.exports.map((name) => `...${name}`));
  }
  const components = hasComponents ? 'pactorComponents' : '{}';
  const actionsExpr = spreads.length > 0 ? `{ ${spreads.join(', ')} }` : '{}';
  return `// 由 \`pactor module init\` 生成：模块 client 入口。
// Shell 装配器生成 client-registry.ts 时静态 import "<pkg>/client"，
// 要求此处具名导出 extensions（components / actions 注册表）。
${imports.join('\n')}

export const extensions = {
  components: ${components},
  actions: ${actionsExpr},
};
`;
}

/** 向 package.json 注入模块打包所需字段（幂等，冲突告警不覆盖） */
function injectPackageJson(pkg: Record<string, unknown>, result: InitModuleResult): void {
  const outDir = CONFIG_DEFAULTS.outDir;

  // files
  const files = Array.isArray(pkg.files) ? (pkg.files as unknown[]) : [];
  if (!files.includes(outDir)) {
    pkg.files = [...files, outDir];
  }

  // exports
  const exportsMap = isRecord(pkg.exports) ? { ...pkg.exports } : {};
  const wantedExports: Record<string, string> = {
    './manifest': `./${outDir}/manifest.json`,
    './client': `./${outDir}/client/index.js`,
    './styles.css': `./${outDir}/client/index.css`,
  };
  for (const [key, value] of Object.entries(wantedExports)) {
    if (exportsMap[key] === undefined) {
      exportsMap[key] = value;
    } else if (exportsMap[key] !== value) {
      result.warnings.push(`package.json exports["${key}"] 已存在且与建议值不同，未覆盖（当前: ${JSON.stringify(exportsMap[key])}）`);
    }
  }
  pkg.exports = exportsMap;

  // scripts
  const scripts = isRecord(pkg.scripts) ? { ...pkg.scripts } : {};
  const wantedScripts: Record<string, string> = {
    'build:module': 'pactor module build',
    'pack:module': 'pactor module pack',
    'publish:module': 'pactor module publish',
  };
  for (const [key, value] of Object.entries(wantedScripts)) {
    if (scripts[key] === undefined) {
      scripts[key] = value;
    } else if (scripts[key] !== value) {
      result.warnings.push(`package.json scripts["${key}"] 已存在，未覆盖（当前: ${JSON.stringify(scripts[key])}）`);
    }
  }
  pkg.scripts = scripts;

  // peerDependencies：优先沿用工程自身 dependencies 中的版本范围
  const peers = isRecord(pkg.peerDependencies) ? { ...pkg.peerDependencies } : {};
  const dependencies = isRecord(pkg.dependencies) ? pkg.dependencies : {};
  const defaults: Record<string, string> = {
    react: '^18.0.0 || ^19.0.0',
    'react-dom': '^18.0.0 || ^19.0.0',
    next: '^14.0.0 || ^15.0.0',
    'pactor-app': '^1.54.0',
  };
  for (const [name, fallback] of Object.entries(defaults)) {
    if (peers[name] !== undefined) continue;
    const declared = dependencies[name];
    peers[name] = typeof declared === 'string' && declared.length > 0 ? declared : fallback;
  }
  pkg.peerDependencies = peers;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
