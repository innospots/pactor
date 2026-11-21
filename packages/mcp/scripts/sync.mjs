// 单一数据流：skills/pactor-dsl → @pactor-app/mcp。
// 构建/测试前解析 skill 权威参考文档，生成包内静态产物（src/generated/*，不入库）：
//   reference.ts  — dsl-authoring.md 全文（get_dsl_reference / resource 用）
//   components.ts — 组件目录（component-catalog.md 为底，component-contracts.md 补充契约与示例）
//   actions.ts    — 标准 action 目录（dsl-authoring.md §6 action 表）
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const refsDir = resolve(here, '../../../skills/pactor-dsl/references');
const outDir = resolve(here, '../src/generated');

const readRef = (name) => readFileSync(join(refsDir, name), 'utf8');

const CATEGORY_SLUGS = {
  '页面、布局与循环': 'layout',
  导航: 'navigation',
  通用与操作: 'general',
  数据录入与表单: 'data-entry',
  数据展示: 'data-display',
  反馈与浮层: 'feedback',
  媒体与内容: 'media',
};

const COMPONENT_NAME = /^[A-Z][A-Za-z0-9]*$/;
const ACTION_NAME = /^[a-z][\w.]*$/;

const backtickNames = (cell) =>
  [...cell.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());

const extractLink = (cell) => {
  const m = cell.match(/\[[^\]]*\]\(([^)]+)\)/);
  return m ? m[1] : undefined;
};

/** 解析 component-catalog.md → 全量组件清单 */
function parseComponentCatalog(md) {
  const components = [];
  let pkg = null;
  let category = null;
  let inFence = false;

  for (const line of md.split('\n')) {
    if (line.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const pkgMatch = line.match(/^## `(@pactor-app\/[\w-]+)`/);
    if (pkgMatch) {
      pkg = pkgMatch[1];
      category = pkg.split('/')[1]; // chart / blocks / chat 无子分类
      continue;
    }
    if (/^## Sitemap/.test(line)) {
      pkg = '@pactor-app/app';
      category = 'sitemap-layout';
      continue;
    }
    if (/^## /.test(line)) {
      pkg = null; // 覆盖范围 / 使用规则 / 高频组件 DSL 契约 / 更新与校验
      category = null;
      continue;
    }
    const catMatch = line.match(/^### (.+?)（\d+）/);
    if (catMatch && pkg) {
      category = CATEGORY_SLUGS[catMatch[1]] ?? catMatch[1];
      continue;
    }
    if (!pkg || !line.startsWith('|')) continue;

    const cells = line.split(' | ').map((c) => c.replace(/^\||\|$/g, '').trim());
    if (cells.length < 3 || cells[0] === 'DSL type' || cells[0].startsWith('---')) continue;

    const names = backtickNames(cells[0]).filter((n) => COMPONENT_NAME.test(n));
    for (const name of names) {
      components.push({
        name,
        package: pkg,
        category,
        summary: cells[1],
        link: extractLink(cells[2]),
      });
    }
  }
  return components;
}

const EXAMPLE_HEADINGS = {
  '5.1': 'Form',
  '6.1': 'Table',
  '8.2': 'Dialog',
  '8.3': 'Drawer',
  '9.1': 'Login',
};

// 这 5 个组件的契约以完整 YAML 示例呈现（无表格行），keyProps 在此兜底
const EXAMPLE_KEY_PROPS = {
  Form: '`name`、`layout`、`initialValues`；`onSubmit` 收全部值、`onValuesChange` 只收变化字段',
  Table:
    '`dataSource: ${data.x}`、`columns`、`cell`、`rowKey`、`loading`、`pagination`、`emptyText`、`rowSelection`、`size`',
  Dialog: '`open`、`title`、`description`、`trigger`、`style`；内容放 children，无默认 footer',
  Drawer:
    '`open`、`title`、`placement`、`okText`、`cancelText`、`footer`、`closable`；`onClose` / `onOk`（footer 表单用 form.submit）',
  Login:
    '`layout`、`brandSide`、`brandRatio`、`authVariant`、`brand`、`title`、`subtitle`、`registerLink`、`forgotLink`、`footer`',
};

/** 解析 component-contracts.md → { [name]: { keyProps, notes, example } } */
function parseContracts(md) {
  const contracts = {};
  let inFence = false;
  let fenceLang = '';
  let heading = null;
  let exampleFor = null;
  let fenceLines = [];

  const flushFence = () => {
    if (exampleFor && fenceLang === 'yaml' && !contracts[exampleFor]?.example) {
      contracts[exampleFor] = {
        ...contracts[exampleFor],
        example: fenceLines.join('\n').trim(),
      };
    }
    fenceLines = [];
    exampleFor = null;
  };

  for (const line of md.split('\n')) {
    if (line.startsWith('```')) {
      if (inFence) flushFence();
      else fenceLang = line.slice(3).trim();
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      fenceLines.push(line);
      continue;
    }

    const h3 = line.match(/^### (\d+\.\d+)/);
    if (h3) {
      heading = h3[1];
      if (EXAMPLE_HEADINGS[heading]) exampleFor = EXAMPLE_HEADINGS[heading];
      continue;
    }
    if (!line.startsWith('|')) continue;

    const cells = line.split(' | ').map((c) => c.replace(/^\||\|$/g, '').trim());
    if (cells.length < 2 || cells[0] === 'DSL type' || cells[0].startsWith('---')) continue;

    const names = backtickNames(cells[0]).filter((n) => COMPONENT_NAME.test(n));
    if (names.length === 0) continue;
    const keyProps = cells[1];
    const notes = cells.length > 2 ? cells.slice(2).join(' | ') : undefined;
    for (const name of names) {
      // 先出现者优先（契约文件按使用频率组织，前面的说明更完整）
      if (!contracts[name]) contracts[name] = { keyProps, notes };
      else if (!contracts[name].keyProps) contracts[name].keyProps = keyProps;
    }
  }
  return contracts;
}

/** 解析 dsl-authoring.md §6 的 action 目录表 */
function parseActions(md) {
  const actions = [];
  const section = md.split(/^## 6\. /m)[1]?.split(/^## 7\. /m)[0] ?? '';
  const table = section.split('Action catalog:')[1] ?? '';
  for (const line of table.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line.split(' | ').map((c) => c.replace(/^\||\|$/g, '').trim());
    if (cells.length < 3 || cells[0] === 'Action' || cells[0].startsWith('---')) continue;
    const names = backtickNames(cells[0]).filter((n) => ACTION_NAME.test(n));
    for (const name of names) {
      actions.push({ name, params: cells[1], summary: cells[2] });
    }
  }
  return actions;
}

const authoring = readRef('dsl-authoring.md');
const components = parseComponentCatalog(readRef('component-catalog.md'));
const contracts = parseContracts(readRef('component-contracts.md'));
const actions = parseActions(authoring);

for (const c of components) {
  const contract = contracts[c.name];
  if (contract?.keyProps) c.keyProps = contract.keyProps;
  if (contract?.notes) c.notes = contract.notes;
  if (contract?.example) c.example = contract.example;
  if (!c.keyProps && EXAMPLE_KEY_PROPS[c.name]) c.keyProps = EXAMPLE_KEY_PROPS[c.name];
}

mkdirSync(outDir, { recursive: true });
const banner = '// 由 scripts/sync.mjs 生成，请勿手改；数据源：skills/pactor-dsl/references/\n';
writeFileSync(
  join(outDir, 'reference.ts'),
  `${banner}export default ${JSON.stringify(authoring)} as string;\n`,
);
writeFileSync(
  join(outDir, 'components.ts'),
  `${banner}import type { ComponentEntry } from '../catalog.js';\n\nexport default ${JSON.stringify(components, null, 2)} as ComponentEntry[];\n`,
);
writeFileSync(
  join(outDir, 'actions.ts'),
  `${banner}import type { ActionEntry } from '../catalog.js';\n\nexport default ${JSON.stringify(actions, null, 2)} as ActionEntry[];\n`,
);

console.log(
  `[sync] components=${components.length} contracts=${Object.keys(contracts).length} actions=${actions.length} reference=${authoring.length}chars`,
);
