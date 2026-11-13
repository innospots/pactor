import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { THEME_NAMES } from '../src/index.js';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, 'package.json'), 'utf8'),
);
const loadersSource = readFileSync(
  join(packageRoot, 'src', 'loaders.ts'),
  'utf8',
);

describe('package metadata', () => {
  it('publishes dist, skins and the manifest', () => {
    expect(packageJson.name).toBe('@pactor-app/theme');
    expect(packageJson.type).toBe('module');
    expect(packageJson.files).toEqual(['dist', 'skins', 'themes.json']);
    expect(packageJson.sideEffects).toEqual(['**/*.css']);
  });

  it('exposes the runtime, static skins and the manifest', () => {
    expect(packageJson.exports['.']).toBeDefined();
    expect(packageJson.exports['./skins/*.css']).toBe('./skins/*.css');
    expect(packageJson.exports['./themes.json']).toBe('./themes.json');
  });

  it('has no runtime dependencies', () => {
    expect(packageJson.dependencies).toBeUndefined();
    expect(packageJson.peerDependencies).toBeUndefined();
  });

  it('declares a literal dynamic import for every theme', () => {
    const imports = [
      ...loadersSource.matchAll(
        /import\('\.\.\/skins\/([a-z0-9-]+)\.css'\)/g,
      ),
    ].map((match) => match[1]);

    expect(imports).toEqual([...THEME_NAMES]);
  });
});
