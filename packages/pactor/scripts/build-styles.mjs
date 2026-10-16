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

const out = `/**\n * pactor-app 聚合样式表（构建产物，scripts/build-styles.mjs 生成，勿手改）：\n * 全量场景单一样式入口——宿主仅 import 'pactor-app/styles.css' 一次。\n * 按需场景仍可引用各域包分表（@pactor-app/<pkg>/styles.css）。\n */\n\n${parts.join('\n')}`;

// 自包含校验：不得残留未解析的域包 @import
const unresolved = out.match(/@import\s+['"]@pactor-app\/[^'"]+['"]/g);
if (unresolved) {
  console.error(
    `[build-styles] 聚合产物含未解析域包 @import：${unresolved.join(', ')}`,
  );
  process.exit(1);
}

const target = fileURLToPath(new URL('../styles.css', import.meta.url));
writeFileSync(target, out);
console.log(
  `[build-styles] ${target} ← ${PACKAGES.length} 段聚合（${out.split('\n').length} 行）`,
);
