#!/usr/bin/env node
/**
 * Validates @pactor-app/skills layout and the pactor-prd placeholder-manifest contract.
 *
 * pactor-prd 不再自带 template/ 工程副本（新建工程经 create-pactor-app 脚手架，
 * 模板事实来源为 starters/next-app-starter）；技能侧只保留 template-placeholders.json
 * 占位符清单，其键集合必须与 starter 的 placeholders.json 一致。
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const skillsRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(skillsRoot, '..');
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

let failed = false;

function fail(message) {
  console.error(message);
  failed = true;
}

function validatePrdPlaceholders(skillDir) {
  if (existsSync(join(skillDir, 'template'))) {
    fail('pactor-prd: template/ 已移除，新建工程必须经 create-pactor-app 脚手架');
  }

  const manifestPath = join(skillDir, 'template-placeholders.json');
  if (!existsSync(manifestPath)) {
    fail('pactor-prd: missing template-placeholders.json');
    return;
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  for (const [key, entry] of Object.entries(manifest)) {
    if (typeof entry?.example !== 'string') {
      fail(`pactor-prd: template-placeholders.json 的 ${key} 缺少字符串 example`);
    }
  }

  // 与 starter 占位符清单键集合一致性（仓库上下文；发布包内无 starters 时跳过）
  const starterManifestPath = join(repoRoot, 'starters/next-app-starter/placeholders.json');
  if (existsSync(starterManifestPath)) {
    const starterKeys = Object.keys(JSON.parse(readFileSync(starterManifestPath, 'utf8'))).sort();
    const skillKeys = Object.keys(manifest).sort();
    if (JSON.stringify(starterKeys) !== JSON.stringify(skillKeys)) {
      fail(
        `pactor-prd: 占位符键集合与 starters/next-app-starter/placeholders.json 不一致\n` +
          `  skill: ${skillKeys.join(', ')}\n  starter: ${starterKeys.join(', ')}`,
      );
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
    validatePrdPlaceholders(dir);
  }
}

if (failed) {
  process.exit(1);
}
console.log(`skills OK (${SKILL_DIRS.join(', ')})`);
