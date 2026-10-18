#!/usr/bin/env node
/**
 * Validates @pactor-app/skills layout and the pactor-prd source-template contract.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSource } from './prd-template.mjs';

const skillsRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILL_DIRS = ['pactor-dsl', 'pactor-project', 'pactor-prd'];

function readSkillName(skillDir) {
  const skillPath = join(skillDir, 'SKILL.md');
  const text = readFileSync(skillPath, 'utf8');
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!block) return null;
  for (const line of block[1].split('\n')) {
    if (line.startsWith('name:')) {
      return line.slice('name:'.length).trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return null;
}

function listMdReferences(skillDir) {
  const refDir = join(skillDir, 'references');
  if (!existsSync(refDir)) return [];
  return readdirSync(refDir).filter((f) => f.endsWith('.md'));
}

const FORBIDDEN_TEMPLATE_PATHS = [
  'public/file.svg',
  'public/globe.svg',
  'public/vercel.svg',
  'public/window.svg',
  'public/next.svg',
  'app/favicon.ico',
  'public/skins/chenwunaifu.css',
  'public/skins/taijingshenlin.css',
  'public/skins/xuanzhimoyun.css',
];

function isFile(path) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function findForbiddenGeneratedPaths(templateDir) {
  const found = [];

  function visit(directory, prefix = '') {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.name === 'node_modules' || entry.name === '.next') {
        found.push(relativePath);
        continue;
      }
      if (entry.name === '.git' && entry.isDirectory()) continue;
      if (entry.name === '.DS_Store' || entry.name.endsWith('.tsbuildinfo')) {
        found.push(relativePath);
      }
      if (entry.isDirectory()) visit(join(directory, entry.name), relativePath);
    }
  }

  visit(templateDir);
  return found;
}

function hasNeutralDefaultSkin(text) {
  const hasRegistration =
    /\bvalue\s*:\s*['"]neutral['"]/.test(text) || /\bneutral\b['"]?\s*:/.test(text);
  const hasExplicitDefault = /\bDEFAULT_SKIN\b[^\n=]*=\s*['"]neutral['"]/.test(text);
  const defaultsToFirst =
    /\bDEFAULT_SKIN\b[^\n=]*=\s*SKINS\[0\]\.value/.test(text) &&
    text.match(/\bvalue\s*:\s*['"]([^'"]+)['"]/)?.[1] === 'neutral';
  return hasRegistration && (hasExplicitDefault || defaultsToFirst);
}

let failed = false;

function fail(message) {
  console.error(message);
  failed = true;
}

function validatePrdTemplate(skillDir) {
  const templateDir = join(skillDir, 'template');

  try {
    for (const diagnostic of checkSource(templateDir)) {
      fail(`pactor-prd template: ${diagnostic}`);
    }
  } catch (error) {
    fail(`pactor-prd template: source check error: ${error.message}`);
  }

  try {
    for (const path of findForbiddenGeneratedPaths(templateDir)) {
      fail(`pactor-prd: forbidden template path ${path}`);
    }
  } catch (error) {
    fail(`pactor-prd template: path check error: ${error.message}`);
  }

  for (const path of FORBIDDEN_TEMPLATE_PATHS) {
    if (existsSync(join(templateDir, path))) {
      fail(`pactor-prd: forbidden template path ${path}`);
    }
  }

  if (!isFile(join(templateDir, 'public/skins/neutral.css'))) {
    fail('pactor-prd: missing template/public/skins/neutral.css');
  }

  const skinPath = join(templateDir, 'src/pactor/skin.ts');
  if (!isFile(skinPath)) {
    fail('pactor-prd: missing template/src/pactor/skin.ts');
  } else {
    try {
      if (!hasNeutralDefaultSkin(readFileSync(skinPath, 'utf8'))) {
        fail('pactor-prd: template/src/pactor/skin.ts missing neutral registration/default');
      }
    } catch (error) {
      fail(`pactor-prd template: skin check error: ${error.message}`);
    }
  }
}

for (const id of SKILL_DIRS) {
  const dir = join(skillsRoot, id);
  if (!existsSync(dir)) {
    console.error(`missing skill directory: ${id}`);
    failed = true;
    continue;
  }
  const name = readSkillName(dir);
  if (name !== id) {
    console.error(`${id}: frontmatter name "${name}" !== directory "${id}"`);
    failed = true;
  }
  const refs = listMdReferences(dir);
  for (const file of refs) {
    if (!existsSync(join(dir, 'references', file))) {
      console.error(`${id}: missing references/${file}`);
      failed = true;
    }
  }
  if (id === 'pactor-prd') {
    const tpl = join(dir, 'template', 'package.json');
    if (!existsSync(tpl)) {
      console.error('pactor-prd: missing template/package.json');
      failed = true;
    }
    validatePrdTemplate(dir);
  }
}

if (failed) {
  process.exit(1);
}
console.log(`skills OK (${SKILL_DIRS.join(', ')})`);
