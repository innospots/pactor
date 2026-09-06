/**
 * 生成 Icon 文档网格数据：解析 @pactor-app/ui 的 Icon 白名单
 *（packages/ui/src/components/components/Icon/index.tsx 的 ICONS 映射），
 * 用 lucide-react 真实渲染每个图标为静态 SVG，写入 docs/src/data/icon-grid.json。
 *
 * 用法：node docs/scripts/gen-icon-grid.mjs
 * 时机：Icon 白名单（ICONS 映射）变更后重新运行。
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');

// react / react-dom / lucide-react 均从 packages/ui 的依赖解析（docs 不持有这些依赖）
const uiRequire = createRequire(resolve(repoRoot, 'packages/ui/package.json'));
const { createElement } = uiRequire('react');
const { renderToStaticMarkup } = uiRequire('react-dom/server');
const lucide = uiRequire('lucide-react');

const iconSourcePath = resolve(
  repoRoot,
  'packages/ui/src/components/components/Icon/index.tsx',
);
const source = readFileSync(iconSourcePath, 'utf8');
const mapBlock = source.match(/export const ICONS[^=]*= \{([\s\S]*?)\n\};/);
if (!mapBlock) {
  throw new Error('未能在 Icon/index.tsx 中定位 ICONS 映射');
}

const entries = [
  ...mapBlock[1].matchAll(/^\s*(?:'([\w-]+)'|(\w+)):\s*(\w+),/gm),
].map((m) => ({ key: m[1] ?? m[2], name: m[3] }));

if (entries.length === 0) {
  throw new Error('ICONS 映射解析为空');
}

const data = entries.map(({ key, name }) => {
  const component = lucide[name];
  if (!component) {
    throw new Error(`lucide-react 中不存在图标组件: ${name}（key: ${key}）`);
  }
  const svg = renderToStaticMarkup(createElement(component, { size: 24 }));
  return { key, name, svg };
});

const outPath = resolve(repoRoot, 'docs/src/data/icon-grid.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n');
console.log(`已生成 ${data.length} 个图标 → ${outPath}`);
