#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, extname, isAbsolute, join, relative, resolve, sep } from 'node:path';

const USAGE =
  'Usage: node tests/scripts/check-prd-project.mjs <project> --expected <expected-project.json>';
const SKIPPED_DIRECTORIES = new Set(['.git', 'node_modules', '.next']);
const LOCK_FILES = new Set([
  'pnpm-lock.yaml',
  'package-lock.json',
  'npm-shrinkwrap.json',
  'yarn.lock',
  'bun.lock',
  'bun.lockb',
]);
const SCREENSHOT_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.avif',
]);
const TEXT_EXTENSIONS = new Set([
  '.yaml',
  '.yml',
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.css',
  '.svg',
  '.html',
]);
const REFERENCE_DIRECTORIES = ['provider', 'route', 'models'];
const REFERENCE_PATH_RESIDUALS = ['yaml/provider', 'yaml/route', 'yaml/models'];
const LEGACY_ACCOUNT_PATTERN = /\busername\s*:\s*(?:["'](?:admin|guest)["']|(?:admin|guest)(?=\s*(?:$|[,}\];])))/gim;

function isLockFile(file) {
  return LOCK_FILES.has(basename(file)) || extname(file) === '.lock';
}

function walkFiles(root) {
  if (!existsSync(root)) return [];
  const files = [];
  const entries = readdirSync(root, { withFileTypes: true }).sort((left, right) =>
    left.name.localeCompare(right.name),
  );
  for (const entry of entries) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRECTORIES.has(entry.name)) files.push(...walkFiles(path));
    } else if (
      entry.isFile() &&
      !isLockFile(path) &&
      !SCREENSHOT_EXTENSIONS.has(extname(path).toLowerCase())
    ) {
      files.push(path);
    }
  }
  return files;
}

function isInside(root, file) {
  const path = relative(root, file);
  return path !== '' && path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

function displayPath(root, file) {
  return relative(root, file).split(sep).join('/') || '.';
}

function location(text, index) {
  const before = text.slice(0, index);
  const line = before.split('\n').length;
  const lineStart = before.lastIndexOf('\n') + 1;
  return { line, column: index - lineStart + 1 };
}

function readExpected(path) {
  const expected = JSON.parse(readFileSync(path, 'utf8'));
  if (!expected || typeof expected !== 'object' || !Array.isArray(expected.pages)) {
    throw new Error('Expected file must contain a pages array.');
  }
  if (
    !expected.brand ||
    !['packageName', 'appTitle', 'appDescription'].every(
      (key) => typeof expected.brand[key] === 'string' && expected.brand[key] !== '',
    )
  ) {
    throw new Error('Expected brand must define packageName, appTitle and appDescription.');
  }
  if (
    !Array.isArray(expected.forbiddenResiduals) ||
    expected.forbiddenResiduals.some((item) => typeof item !== 'string' || item === '')
  ) {
    throw new Error('Expected forbiddenResiduals must be a non-empty-string array.');
  }
  const ids = new Set();
  for (const page of expected.pages) {
    if (
      !page ||
      typeof page.id !== 'string' ||
      typeof page.path !== 'string' ||
      typeof page.menu !== 'string' ||
      typeof page.hidden !== 'boolean' ||
      !(page.activeMenu === null || typeof page.activeMenu === 'string')
    ) {
      throw new Error('Each expected page needs id/path/menu/hidden/activeMenu.');
    }
    if (ids.has(page.id)) throw new Error(`Duplicate expected page id: ${page.id}`);
    ids.add(page.id);
  }
  return expected;
}

function flattenMenus(nodes, issues, sourceLabel) {
  if (!Array.isArray(nodes)) {
    issues.push(`${sourceLabel}: menus must be an array`);
    return [];
  }
  const flattened = [];
  for (const [index, menu] of nodes.entries()) {
    if (!menu || typeof menu !== 'object' || Array.isArray(menu)) {
      issues.push(`${sourceLabel}: menus[${index}] must be an object`);
      continue;
    }
    flattened.push(menu);
    if (Object.hasOwn(menu, 'children')) {
      flattened.push(...flattenMenus(menu.children, issues, `${sourceLabel} menu ${menu.id ?? index}`));
    }
  }
  return flattened;
}

function compareSets(label, expectedValues, actualValues, issues) {
  for (const value of expectedValues) {
    if (!actualValues.has(value)) issues.push(`${label}: missing ${value}`);
  }
  for (const value of actualValues) {
    if (!expectedValues.has(value)) issues.push(`${label}: unexpected ${value}`);
  }
}

function run(projectDirectory, expectedPath) {
  const projectRoot = resolve(projectDirectory);
  if (!existsSync(projectRoot)) throw new Error(`Project does not exist: ${projectRoot}`);
  const packagePath = join(projectRoot, 'package.json');
  if (!existsSync(packagePath)) throw new Error(`Project package.json is missing: ${packagePath}`);

  const expected = readExpected(resolve(expectedPath));
  const requireFromProject = createRequire(packagePath);
  let yaml;
  try {
    yaml = requireFromProject('yaml');
  } catch (error) {
    throw new Error(`Cannot load the project's yaml dependency: ${error.message}`);
  }
  if (!yaml || typeof yaml.parse !== 'function') {
    throw new Error("The project's yaml dependency does not export parse().");
  }

  const issues = [];
  const allFiles = walkFiles(projectRoot);
  const yamlFiles = allFiles.filter((file) => ['.yaml', '.yml'].includes(extname(file)));
  const parsedYaml = new Map();
  const yamlText = new Map();
  for (const file of yamlFiles) {
    const label = displayPath(projectRoot, file);
    const text = readFileSync(file, 'utf8');
    yamlText.set(file, text);
    try {
      parsedYaml.set(file, yaml.parse(text));
    } catch (error) {
      issues.push(`${label}: YAML parse failed: ${error.message}`);
    }
  }

  const yamlRoot = join(projectRoot, 'src/server/yaml');
  const sitemapPath = join(yamlRoot, 'sitemap.yaml');
  if (!existsSync(sitemapPath)) issues.push('src/server/yaml/sitemap.yaml: file is missing');
  for (const directory of REFERENCE_DIRECTORIES) {
    const path = join(yamlRoot, directory);
    if (existsSync(path)) {
      issues.push(`${displayPath(projectRoot, path)}: reference YAML directory/file must be removed`);
    }
  }

  const pageFiles = allFiles.filter(
    (file) =>
      isInside(yamlRoot, file) &&
      file !== sitemapPath &&
      ['.yaml', '.yml'].includes(extname(file)),
  );
  const expectedById = new Map(expected.pages.map((page) => [page.id, page]));
  const expectedIds = new Set(expectedById.keys());
  const actualFileIds = new Set();
  const documentIds = new Set();
  const fileIdLocations = new Map();
  for (const file of pageFiles) {
    const label = displayPath(projectRoot, file);
    const fileId = basename(file, extname(file));
    actualFileIds.add(fileId);
    if (!expectedIds.has(fileId)) issues.push(`${label}: unregistered page YAML (${fileId})`);
    if (!parsedYaml.has(file)) continue;
    const document = parsedYaml.get(file);
    const dataSources = document?.dataSources;
    if (dataSources !== undefined) {
      if (!dataSources || typeof dataSources !== 'object' || Array.isArray(dataSources)) {
        issues.push(`${label}: dataSources must be an object`);
      } else {
        for (const [name, dataSource] of Object.entries(dataSources)) {
          if (dataSource?.type !== 'http') {
            issues.push(
              `${label}: dataSources.${name}.type must be http, got ${dataSource?.type}`,
            );
          }
        }
      }
    }
    const pageId = document?.page?.id;
    if (typeof pageId !== 'string' || pageId === '') {
      issues.push(`${label}: page.id must be a non-empty string`);
      continue;
    }
    if (fileId !== pageId) {
      issues.push(`${label}: filename id ${fileId} must equal page.id ${pageId}`);
    }
    if (documentIds.has(pageId)) {
      issues.push(`${label}: duplicate page.id ${pageId} (also ${fileIdLocations.get(pageId)})`);
    } else {
      documentIds.add(pageId);
      fileIdLocations.set(pageId, label);
    }
    if (!expectedIds.has(pageId)) issues.push(`${label}: page.id ${pageId} is not expected`);
  }
  compareSets('Page file set', expectedIds, actualFileIds, issues);

  let sitemap = null;
  if (parsedYaml.has(sitemapPath)) {
    sitemap = parsedYaml.get(sitemapPath);
  }
  const sitemapPages = Array.isArray(sitemap?.pages) ? sitemap.pages : [];
  if (sitemap && !Array.isArray(sitemap.pages)) {
    issues.push('src/server/yaml/sitemap.yaml: pages must be an array');
  }
  const sitemapIds = new Set();
  const sitemapPaths = new Set();
  const sitemapById = new Map();
  for (const [index, page] of sitemapPages.entries()) {
    const label = `src/server/yaml/sitemap.yaml: pages[${index}]`;
    if (!page || typeof page !== 'object' || Array.isArray(page)) {
      issues.push(`${label} must be an object`);
      continue;
    }
    if (typeof page.id !== 'string' || page.id === '') {
      issues.push(`${label}.id must be a non-empty string`);
    } else {
      if (sitemapIds.has(page.id)) issues.push(`${label}.id duplicates ${page.id}`);
      sitemapIds.add(page.id);
      sitemapById.set(page.id, page);
    }
    if (typeof page.path !== 'string' || page.path === '') {
      issues.push(`${label}.path must be a non-empty string`);
    } else {
      if (sitemapPaths.has(page.path)) issues.push(`${label}.path duplicates ${page.path}`);
      sitemapPaths.add(page.path);
    }
  }
  compareSets('Sitemap page set', expectedIds, sitemapIds, issues);
  for (const page of expected.pages) {
    const actual = sitemapById.get(page.id);
    if (actual && actual.path !== page.path) {
      issues.push(
        `src/server/yaml/sitemap.yaml: ${page.id} path must be ${page.path}, got ${actual.path}`,
      );
    }
  }

  const menus = sitemap ? flattenMenus(sitemap.menus, issues, 'src/server/yaml/sitemap.yaml') : [];
  const menuById = new Map();
  for (const menu of menus) {
    if (typeof menu.id === 'string' && menu.id !== '') {
      if (menuById.has(menu.id)) issues.push(`src/server/yaml/sitemap.yaml: duplicate menu id ${menu.id}`);
      menuById.set(menu.id, menu);
    }
    if (menu.type === 'page' && (typeof menu.pageId !== 'string' || menu.pageId === '')) {
      issues.push(`src/server/yaml/sitemap.yaml: menu ${menu.id ?? '(unknown)'} needs pageId`);
    }
    if (menu.pageId !== undefined && !sitemapIds.has(menu.pageId)) {
      issues.push(
        `src/server/yaml/sitemap.yaml: menu ${menu.id ?? '(unknown)'} has invalid pageId ${menu.pageId}`,
      );
    }
  }
  for (const menu of menus) {
    if (menu.activeMenu === undefined || menu.activeMenu === null) continue;
    const target = menuById.get(menu.activeMenu);
    if (!target) {
      issues.push(
        `src/server/yaml/sitemap.yaml: menu ${menu.id ?? '(unknown)'} activeMenu ${menu.activeMenu} does not exist`,
      );
    } else if (target.type !== 'page' || target.hidden === true) {
      issues.push(
        `src/server/yaml/sitemap.yaml: activeMenu ${menu.activeMenu} must reference a visible page menu`,
      );
    }
  }
  for (const page of expected.pages) {
    const matchingPageMenus = menus.filter((menu) => menu.pageId === page.id);
    if (matchingPageMenus.length !== 1) {
      issues.push(
        `src/server/yaml/sitemap.yaml: expected exactly one menu for ${page.id}, got ${matchingPageMenus.length}`,
      );
    }
    const menu = menuById.get(page.menu);
    if (!menu) {
      issues.push(`src/server/yaml/sitemap.yaml: missing expected menu ${page.menu}`);
      continue;
    }
    if (menu.pageId !== page.id) {
      issues.push(
        `src/server/yaml/sitemap.yaml: menu ${page.menu} pageId must be ${page.id}, got ${menu.pageId}`,
      );
    }
    const hidden = menu.hidden === true;
    if (hidden !== page.hidden) {
      issues.push(
        `src/server/yaml/sitemap.yaml: menu ${page.menu} hidden must be ${page.hidden}, got ${hidden}`,
      );
    }
    const activeMenu = menu.activeMenu ?? null;
    if (activeMenu !== page.activeMenu) {
      issues.push(
        `src/server/yaml/sitemap.yaml: menu ${page.menu} activeMenu must be ${page.activeMenu}, got ${activeMenu}`,
      );
    }
  }

  try {
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    if (packageJson.name !== expected.brand.packageName) {
      issues.push(
        `package.json: name must be ${expected.brand.packageName}, got ${packageJson.name}`,
      );
    }
  } catch (error) {
    issues.push(`package.json: JSON parse failed: ${error.message}`);
  }
  if (sitemap && sitemap.app?.name !== expected.brand.appTitle) {
    issues.push(
      `src/server/yaml/sitemap.yaml: app.name must be ${expected.brand.appTitle}, got ${sitemap.app?.name}`,
    );
  }
  const layoutPath = join(projectRoot, 'app/layout.tsx');
  if (!existsSync(layoutPath)) {
    issues.push('app/layout.tsx: file is missing for brand metadata check');
  } else {
    const layout = readFileSync(layoutPath, 'utf8');
    for (const value of [expected.brand.appTitle, expected.brand.appDescription]) {
      if (!layout.includes(value)) issues.push(`app/layout.tsx: missing brand text ${value}`);
    }
  }

  const scanFiles = new Set();
  for (const directory of ['app', 'src', 'public']) {
    for (const file of walkFiles(join(projectRoot, directory))) {
      if (TEXT_EXTENSIONS.has(extname(file))) scanFiles.add(file);
    }
  }
  for (const file of ['README.md', 'package.json', 'next.config.js']) {
    const path = join(projectRoot, file);
    if (existsSync(path)) scanFiles.add(path);
  }
  const residuals = [...expected.forbiddenResiduals, ...REFERENCE_PATH_RESIDUALS];
  for (const file of [...scanFiles].sort()) {
    const label = displayPath(projectRoot, file);
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(/\{\{[A-Z][A-Z0-9_]*\}\}/g)) {
      const point = location(text, match.index);
      issues.push(`${label}:${point.line}:${point.column}: residual placeholder ${match[0]}`);
    }
    for (const match of text.matchAll(LEGACY_ACCOUNT_PATTERN)) {
      const point = location(text, match.index);
      issues.push(`${label}:${point.line}:${point.column}: forbidden legacy account ${match[0]}`);
    }
    for (const residual of residuals) {
      if (label.includes(residual)) issues.push(`${label}: forbidden residual in path ${residual}`);
      let index = text.indexOf(residual);
      while (index !== -1) {
        const point = location(text, index);
        issues.push(`${label}:${point.line}:${point.column}: forbidden residual ${residual}`);
        index = text.indexOf(residual, index + residual.length);
      }
    }
  }

  return { issues, yamlFiles: yamlFiles.length, scanFiles: scanFiles.size };
}

function main(args) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log(USAGE);
    return;
  }
  if (args.length !== 3 || args[1] !== '--expected') {
    throw new Error(USAGE);
  }
  const result = run(args[0], args[2]);
  if (result.issues.length > 0) {
    console.error(`PRD project check failed with ${result.issues.length} issue(s):`);
    for (const issue of result.issues) console.error(`  - ${issue}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `PRD project check passed: ${result.yamlFiles} YAML files parsed; ${result.scanFiles} source files scanned.`,
  );
}

try {
  main(process.argv.slice(2));
} catch (error) {
  console.error(`PRD project check error: ${error.message}`);
  process.exitCode = 1;
}
