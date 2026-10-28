import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: '@pactor-app/i18n/node', replacement: path('../packages/i18n/src/node.ts') },
      { find: '@pactor-app/i18n', replacement: path('../packages/i18n/src/index.ts') },
      { find: '@pactor-app/schema', replacement: path('../packages/schema/src/index.ts') },
      { find: 'yaml', replacement: path('../packages/cli/node_modules/yaml/dist/index.js') },
    ],
  },
  test: { include: ['tests/starter-i18n.check.ts', 'packages/i18n/src/*.test.ts', 'packages/schema/src/validate-i18n.test.ts'], fileParallelism: false },
});
