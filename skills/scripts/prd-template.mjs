#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const manifestPath = join(dirname(scriptPath), '../pactor-prd/template-placeholders.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const placeholderKeys = Object.keys(manifest);
const placeholderKeySet = new Set(placeholderKeys);
const forbiddenRealData = [
  'Pactor Console',
  'GateWeave',
  'pactor123',
  'guest123',
  'chenwunaifu',
  'taijingshenlin',
  'xuanzhimoyun',
];
const scannedExtensions = new Set([
  '.yaml',
  '.yml',
  '.ts',
  '.tsx',
  '.json',
  '.md',
  '.css',
  '.js',
  '.mjs',
  '.svg',
]);
const skippedDirectories = new Set(['.git', 'node_modules', '.next']);
const usage = `Usage:
  node skills/scripts/prd-template.mjs render <dir> --values <json-file>
  node skills/scripts/prd-template.mjs check <dir> --source
  node skills/scripts/prd-template.mjs check <dir> --rendered

Values must be a flat JSON object containing exactly the 12 manifest keys,
with a string value for every key. Placeholders must be complete double-quoted
literals such as "{{APP_NAME}}".`;

function listTemplateFiles(root) {
  const files = [];

  function visit(directory) {
    const entries = readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!skippedDirectories.has(entry.name)) visit(path);
      } else if (entry.isFile() && scannedExtensions.has(extname(entry.name))) {
        files.push(path);
      }
    }
  }

  visit(root);
  return files;
}

function matches(text, pattern) {
  return Array.from(text.matchAll(pattern));
}

function location(root, file, text, index) {
  const before = text.slice(0, index);
  const line = before.split('\n').length;
  const lineStart = text.lastIndexOf('\n', index - 1) + 1;
  return `${relative(root, file)}:${line}:${index - lineStart + 1}`;
}

function issue(root, file, text, index, message) {
  return `${location(root, file, text, index)}: ${message}`;
}

function isEscaped(text, index) {
  let backslashes = 0;
  for (let cursor = index - 1; cursor >= 0 && text[cursor] === '\\'; cursor -= 1) {
    backslashes += 1;
  }
  return backslashes % 2 === 1;
}

function isCompleteLiteral(text, start, end) {
  const openingQuote = start - 1;
  const closingQuote = end;
  return (
    text[openingQuote] === '"' &&
    text[closingQuote] === '"' &&
    !isEscaped(text, openingQuote) &&
    !isEscaped(text, closingQuote)
  );
}

function placeholderMatches(text) {
  return matches(text, /\{\{[A-Z][A-Z0-9_]*\}\}/g);
}

function forbiddenDataIssues(root, file, text) {
  const issues = [];
  for (const value of forbiddenRealData) {
    let index = text.indexOf(value);
    while (index !== -1) {
      issues.push(issue(root, file, text, index, `forbidden real data: ${JSON.stringify(value)}`));
      index = text.indexOf(value, index + value.length);
    }
  }
  return issues;
}

export function checkSource(directory) {
  const root = resolve(directory);
  const issues = [];
  const seen = new Set();

  for (const file of listTemplateFiles(root)) {
    const text = readFileSync(file, 'utf8');
    for (const match of placeholderMatches(text)) {
      const token = match[0];
      const key = token.slice(2, -2);
      const index = match.index;
      if (!placeholderKeySet.has(key)) {
        issues.push(issue(root, file, text, index, `unknown placeholder ${token}`));
        continue;
      }
      seen.add(key);
      if (!isCompleteLiteral(text, index, index + token.length)) {
        issues.push(
          issue(root, file, text, index, `${token} must be a complete double-quoted literal`),
        );
      }
    }
    issues.push(...forbiddenDataIssues(root, file, text));
  }

  for (const key of placeholderKeys) {
    if (!seen.has(key)) issues.push(`missing required placeholder "{{${key}}}"`);
  }
  return issues;
}

function renderedFileIssues(root, file, text) {
  const issues = [];
  for (const match of placeholderMatches(text)) {
    const token = match[0];
    const key = token.slice(2, -2);
    if (placeholderKeySet.has(key)) {
      issues.push(issue(root, file, text, match.index, `residual placeholder ${token}`));
    }
  }
  issues.push(...forbiddenDataIssues(root, file, text));
  return issues;
}

export function checkRendered(directory) {
  const root = resolve(directory);
  const issues = [];

  for (const file of listTemplateFiles(root)) {
    const text = readFileSync(file, 'utf8');
    issues.push(...renderedFileIssues(root, file, text));
  }
  return issues;
}

function validateValues(values) {
  if (values === null || typeof values !== 'object' || Array.isArray(values)) {
    throw new Error('Values must be a flat JSON object.');
  }

  const problems = [];
  for (const key of placeholderKeys) {
    if (!Object.hasOwn(values, key)) problems.push(`missing key: ${key}`);
  }
  for (const key of Object.keys(values)) {
    if (!placeholderKeySet.has(key)) problems.push(`unknown key: ${key}`);
  }
  for (const key of placeholderKeys) {
    if (Object.hasOwn(values, key) && typeof values[key] !== 'string') {
      problems.push(`non-string value for ${key}; expected string, got ${typeof values[key]}`);
    }
  }
  if (problems.length > 0) {
    throw new Error(`Invalid values:\n${problems.map((problem) => `  - ${problem}`).join('\n')}`);
  }
}

function renderTemplate(directory, values) {
  validateValues(values);
  const root = resolve(directory);
  const sourceIssues = checkSource(root);
  if (sourceIssues.length > 0) {
    throw new Error(
      `Source validation failed:\n${sourceIssues.map((item) => `  - ${item}`).join('\n')}`,
    );
  }

  const files = listTemplateFiles(root);
  const changes = [];
  const outputIssues = [];

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const rendered = text.replace(
      /"\{\{([A-Z][A-Z0-9_]*)\}\}"/g,
      (literal, key, offset, source) => {
        const start = offset + 1;
        const end = start + key.length + 4;
        if (!placeholderKeySet.has(key) || !isCompleteLiteral(source, start, end)) {
          return literal;
        }
        return JSON.stringify(values[key]);
      },
    );
    outputIssues.push(...renderedFileIssues(root, file, rendered));
    if (rendered !== text) changes.push({ file, rendered });
  }

  if (outputIssues.length > 0) {
    throw new Error(
      `Rendered output validation failed:\n${outputIssues.map((item) => `  - ${item}`).join('\n')}`,
    );
  }

  for (const change of changes) writeFileSync(change.file, change.rendered, 'utf8');
  return { scannedFiles: files.length, changedFiles: changes.length };
}

function usageError(message) {
  const error = new Error(message);
  error.showUsage = true;
  return error;
}

function readValues(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read values file ${JSON.stringify(path)}: ${error.message}`);
  }
}

function runCli(args) {
  if (args.length === 1 && ['--help', '-h', 'help'].includes(args[0])) {
    console.log(usage);
    return;
  }

  if (args[0] === 'render') {
    if (args.length !== 4 || args[2] !== '--values') {
      throw usageError('Expected: render <dir> --values <json-file>');
    }
    const values = readValues(resolve(args[3]));
    const result = renderTemplate(args[1], values);
    console.log(
      `Rendered ${result.changedFiles} file(s); scanned ${result.scannedFiles} template file(s).`,
    );
    return;
  }

  if (args[0] === 'check') {
    if (args.length !== 3 || !['--source', '--rendered'].includes(args[2])) {
      throw usageError('Expected: check <dir> --source or check <dir> --rendered');
    }
    const source = args[2] === '--source';
    const issues = source ? checkSource(args[1]) : checkRendered(args[1]);
    if (issues.length > 0) {
      console.error(`${source ? 'Source' : 'Rendered'} check failed with ${issues.length} issue(s):`);
      for (const item of issues) console.error(`  - ${item}`);
      process.exitCode = 1;
      return;
    }
    console.log(`${source ? 'Source' : 'Rendered'} check passed: ${resolve(args[1])}`);
    return;
  }

  throw usageError(args.length === 0 ? 'Missing command.' : `Unknown command: ${args[0]}`);
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  try {
    runCli(process.argv.slice(2));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.showUsage) console.error(`\n${usage}`);
    process.exitCode = 1;
  }
}
