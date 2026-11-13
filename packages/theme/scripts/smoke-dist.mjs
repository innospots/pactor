#!/usr/bin/env node
/**
 * 产物冒烟：构建后用 ESM import() 与 CJS require() 分别载入 dist，
 * 逐个调用 14 个 loader，确认返回的 CSS 与 skins/<name>.css 一致。
 *
 * 重点防住 tsup 的 CSS text chunk 在 CJS 下失效、以及空 CSS 被发布。
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(
  readFileSync(join(packageRoot, 'themes.json'), 'utf8'),
);
const expectedNames = manifest.themes.map((theme) => theme.name);

function normalize(css) {
  return css.replace(/^﻿/, '').replace(/\r\n/g, '\n');
}

function readSkin(name) {
  return normalize(readFileSync(join(packageRoot, 'skins', `${name}.css`), 'utf8'));
}

async function verify(label, module) {
  assert.equal(
    module.THEME_NAMES.length,
    expectedNames.length,
    `${label}: THEME_NAMES length`,
  );
  assert.deepEqual(
    [...module.THEME_NAMES],
    expectedNames,
    `${label}: THEME_NAMES order`,
  );

  for (const name of expectedNames) {
    assert.equal(
      typeof module.THEME_LOADERS[name],
      'function',
      `${label}: missing loader for ${name}`,
    );
    const css = await module.THEME_LOADERS[name]();
    assert.equal(typeof css, 'string', `${label}: ${name} CSS must be a string`);
    assert.ok(css.length > 0, `${label}: ${name} CSS must not be empty`);
    assert.ok(!/@import\b/.test(css), `${label}: ${name} CSS must not @import`);
    assert.equal(
      normalize(css),
      readSkin(name),
      `${label}: ${name} CSS must match skins/${name}.css`,
    );
  }

  console.log(`[smoke-dist] ${label}: ${expectedNames.length} loaders ok`);
}

const esm = await import(pathToFileURL(join(packageRoot, 'dist', 'index.js')).href);
await verify('ESM', esm);

const require = createRequire(import.meta.url);
const cjs = require(join(packageRoot, 'dist', 'index.cjs'));
await verify('CJS', cjs);

console.log('[smoke-dist] all checks passed');
