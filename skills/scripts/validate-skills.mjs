#!/usr/bin/env node
/**
 * Validates @pactor-app/skills layout: directory name === SKILL.md frontmatter name,
 * required references exist, pactor-prd ships template/.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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

let failed = false;

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
  }
}

if (failed) {
  process.exit(1);
}
console.log(`skills OK (${SKILL_DIRS.join(', ')})`);
