import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { PageDsl } from '@pactor-app/core';
import { parseDocument } from 'yaml';

import { resolveGeneratedDir, type ShellGeneratedOptions } from './registry.js';

export function readGeneratedDsl(
  relativePath: string,
  options?: ShellGeneratedOptions,
): PageDsl {
  const abs = join(resolveGeneratedDir(options), relativePath);
  const doc = parseDocument(readFileSync(abs, 'utf8'));
  if (doc.errors.length > 0) {
    throw new Error(
      `${relativePath} 解析失败：${doc.errors.map((e) => e.message.split('\n')[0]).join('；')}`,
    );
  }
  return doc.toJS() as PageDsl;
}
