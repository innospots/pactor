#!/usr/bin/env node
/**
 * pactor-app 聚合样式构建（spec: unified-styles-entry / 单一样式入口）：
 * 按 ui → blocks → chart → chat 顺序读取各域包【已编译】styles.css，
 * 每段带来源 banner（包名 + 版本），内联拼接为单张自包含样式表
 * （不依赖消费方 bundler 的 css @import 解析）。
 *
 * 前置：各域包须先完成自身 build（pnpm 拓扑序保证）；产物缺失或为
 * 空即报错退出（防漂移）。顺序即级联约定：ui 基线（preflight +
 * 令牌值）最先，chat 语义类最后——与多表引用顺序逐字节对齐。
 *
 * utilities 层跨包合并重排：各包编译产物自带独立的 utilities 层，
 * 拼接后按 CSS 层规则合并为一个层，同层内优先级由出现顺序决定。
 * 若直接按包段拼接，blocks/chat 段的基础工具类（.hidden 等）会
 * 晚于 ui 段的响应式变体类（.md\:block 等），破坏 Tailwind 的包内
 * 级联约定。因此按各包原有的变体组顺序做拓扑合并：同组规则保持
 * 包序与包内顺序，基础类组先于变体组，sm/md、hover 及自定义
 * data-open 等变体不依赖类名字母排序。写盘前校验基础类位置与
 * 每个包的变体组相对顺序，违例即失败（防再生漂移）。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PACKAGES = [
  '@pactor-app/ui',
  '@pactor-app/blocks',
  '@pactor-app/chart',
  '@pactor-app/chat',
];

const parts = PACKAGES.map((name) => {
  const short = name.split('/')[1];
  const dir = fileURLToPath(new URL(`../../${short}/`, import.meta.url));
  const pkg = JSON.parse(readFileSync(`${dir}package.json`, 'utf8'));
  let css;
  try {
    css = readFileSync(`${dir}styles.css`, 'utf8');
  } catch {
    console.error(
      `[build-styles] ${name} 的编译产物 styles.css 不存在——先构建该包（pnpm --filter ${name} build）`,
    );
    process.exit(1);
  }
  if (css.trim().length === 0) {
    console.error(
      `[build-styles] ${name} 的 styles.css 为空——先构建该包（pnpm --filter ${name} build）`,
    );
    process.exit(1);
  }
  const banner = `/* ============================================================\n * ${name}@${pkg.version}（构建产物内联，源顺序：ui → blocks → chart → chat）\n * ============================================================ */\n`;
  return `${banner}${css.trimEnd()}\n`;
});

/** 在 css 文本中定位并抽取全部 `@layer utilities { ... }` 块，
 *  返回 { body: 移除这些块后的文本, contents: 各块内容的拼接 }。
 *  花括号配对扫描，跳过字符串字面量（构建产物中的字符串仅出现在
 *  @property / content 等短声明里，配对安全）。 */
function extractUtilitiesLayer(css) {
  const contents = [];
  let body = css;
  const re = /@layer\s+utilities\s*\{/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    let depth = 1;
    let i = m.index + m[0].length;
    let inString = null;
    for (; i < body.length && depth > 0; i++) {
      const ch = body[i];
      if (inString) {
        if (ch === '\\') i++;
        else if (ch === inString) inString = null;
        continue;
      }
      // 选择器内的转义引号（如 [class*=\'size-\']）不构成字符串
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === '"' || ch === "'") inString = ch;
      else if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    if (depth !== 0) {
      console.error('[build-styles] utilities 层花括号不配对，无法合并重排');
      process.exit(1);
    }
    contents.push(body.slice(m.index + m[0].length, i - 1));
    body = body.slice(0, m.index) + body.slice(i);
    re.lastIndex = m.index;
  }
  return { body, contents: contents.join('\n') };
}

/** 将 utilities 层内容按顶层规则切分，并去净前导空白与注释。 */
function splitTopLevel(content) {
  const rules = [];
  let depth = 0;
  let inString = null;
  let ruleStart = 0;
  let prevEnd = 0;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (inString) {
      if (ch === '\\') i++;
      else if (ch === inString) inString = null;
      continue;
    }
    // 选择器内的转义引号（如 [class*=\'size-\']）不构成字符串
    if (ch === '\\') {
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") inString = ch;
    else if (ch === '{') {
      if (depth === 0) ruleStart = prevEnd;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        rules.push(content.slice(ruleStart, i + 1));
        prevEnd = i + 1;
      }
    }
  }
  return rules
    .map((rule) => rule.replace(/^\s*(\/\*[\s\S]*?\*\/\s*)*/, '').trimEnd())
    .filter((rule) => rule.length > 0);
}

/** 取规则首个 class candidate 的变体前缀；任意值内的冒号不算变体分隔。 */
function candidateVariant(rule) {
  const brace = rule.indexOf('{');
  if (brace === -1) return '';
  const selector = rule.slice(0, brace);
  const match = selector.match(/\.((?:\\.|[-_a-zA-Z0-9])+)/);
  if (!match) return '';

  const candidate = match[1].replace(/\\(.)/g, '$1');
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < candidate.length; i++) {
    const ch = candidate[i];
    if (ch === '[' || ch === '(' || ch === '{') depth++;
    else if (ch === ']' || ch === ')' || ch === '}') depth--;
    else if (ch === ':' && depth === 0) {
      parts.push(candidate.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(candidate.slice(start));
  return parts.length > 1 ? parts.slice(0, -1).join(':') : '';
}

/** Tailwind 的变体组：包装 at-rule 还需包含内部 candidate 的变体，
 * 以区分同一个 @media (hover) 下的 group-hover / peer-hover / hover。 */
function ruleGroupKey(rule) {
  if (!rule.startsWith('@')) return `rule:${candidateVariant(rule)}`;
  const open = rule.indexOf('{');
  const close = rule.lastIndexOf('}');
  const nested = splitTopLevel(rule.slice(open + 1, close));
  const firstRule = nested.find((item) => !item.startsWith('@')) ?? '';
  return `at:${rule.slice(0, open).trim()}|${candidateVariant(firstRule)}`;
}

function utilityGroupSequence(rules) {
  const sequence = [];
  for (const rule of rules) {
    const key = ruleGroupKey(rule);
    if (sequence.at(-1) !== key) sequence.push(key);
  }
  return sequence;
}

/** 按各包 Tailwind 产物原有的变体组顺序做拓扑合并：
 * 同组规则保持 ui → blocks → chart → chat 及包内顺序，不做类名字母排序。 */
function mergeUtilities(contentsList) {
  const groups = new Map();
  const outgoing = new Map();
  const indegree = new Map();
  let order = 0;

  function ensureGroup(key) {
    if (groups.has(key)) return;
    groups.set(key, { order: order++, rules: [] });
    outgoing.set(key, new Set());
    indegree.set(key, 0);
  }

  for (const content of contentsList) {
    let previous = null;
    for (const rule of splitTopLevel(content)) {
      const key = ruleGroupKey(rule);
      ensureGroup(key);
      groups.get(key).rules.push(rule);
      if (previous !== null && previous !== key && !outgoing.get(previous).has(key)) {
        outgoing.get(previous).add(key);
        indegree.set(key, indegree.get(key) + 1);
      }
      previous = key;
    }
  }

  const ready = [...groups.keys()].filter((key) => indegree.get(key) === 0);
  const sorted = [];
  while (ready.length > 0) {
    ready.sort((a, b) => groups.get(a).order - groups.get(b).order);
    const key = ready.shift();
    sorted.push(key);
    for (const next of outgoing.get(key)) {
      indegree.set(next, indegree.get(next) - 1);
      if (indegree.get(next) === 0) ready.push(next);
    }
  }
  if (sorted.length !== groups.size) {
    throw new Error('[build-styles] utilities 变体组顺序存在环，无法合并');
  }

  const rules = sorted.flatMap((key) => groups.get(key).rules);
  return (
    `/* utilities（跨包合并：保持各包 Tailwind 变体组顺序） */\n` +
    `@layer utilities {\n${rules.join('\n')}\n}\n`
  );
}

const extracted = parts.map((part) => extractUtilitiesLayer(part));
const body = extracted.map((part) => part.body).join('\n');
const utilityContents = extracted.map((part) => part.contents);
const mergedUtilities = mergeUtilities(utilityContents);

const out = `/**\n * pactor-app 聚合样式表（构建产物，scripts/build-styles.mjs 生成，勿手改）：\n * 全量场景单一样式入口——宿主仅 import 'pactor-app/styles.css' 一次。\n * 按需场景仍可引用各域包分表（@pactor-app/<pkg>/styles.css）。\n */\n\n${body}\n${mergedUtilities}`;

// 自包含校验：不得残留未解析的域包 @import
const unresolved = out.match(/@import\s+['"]@pactor-app\/[^'"]+['"]/g);
if (unresolved) {
  console.error(
    `[build-styles] 聚合产物含未解析域包 @import：${unresolved.join(', ')}`,
  );
  process.exit(1);
}

// 不变量校验：真实基础类必须全部先于任何变体，且每个包原有的
// 变体组先后顺序在合并结果中保持不变（覆盖 sm/md 与自定义状态变体）。
{
  const recheck = extractUtilitiesLayer(out);
  const rules = splitTopLevel(recheck.contents);
  const lastBase = rules.reduce(
    (acc, rule, index) =>
      !rule.startsWith('@') && candidateVariant(rule) === '' ? index : acc,
    -1,
  );
  const firstVariant = rules.findIndex(
    (rule) => rule.startsWith('@') || candidateVariant(rule) !== '',
  );
  if (firstVariant !== -1 && lastBase > firstVariant) {
    throw new Error('[build-styles] 合并重排失败：基础工具类晚于变体规则');
  }

  const actualGroups = utilityGroupSequence(rules);
  for (const content of utilityContents) {
    let previous = -1;
    for (const key of utilityGroupSequence(splitTopLevel(content))) {
      const index = actualGroups.indexOf(key);
      if (index === -1 || index <= previous) {
        throw new Error(`[build-styles] 合并重排失败：变体组顺序漂移（${key}）`);
      }
      previous = index;
    }
  }
}

const target = fileURLToPath(new URL('../styles.css', import.meta.url));
writeFileSync(target, out);
console.log(
  `[build-styles] ${target} ← ${PACKAGES.length} 段聚合（${out.split('\n').length} 行，utilities 已跨包合并重排）`,
);
