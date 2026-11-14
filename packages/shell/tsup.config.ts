import { defineConfig } from 'tsup';

const shared = {
  format: ['esm', 'cjs'] as ('esm' | 'cjs')[],
  target: 'es2020' as const,
  dts: true,
};

export default defineConfig([
  {
    ...shared,
    clean: true,
    entry: { 'client/index': 'src/client/index.ts' },
    banner: { js: '"use client";' },
  },
  {
    ...shared,
    clean: false,
    entry: {
      'server/index': 'src/server/index.ts',
      'server/routes': 'src/server/routes.ts',
      next: 'src/next.ts',
      'bin/cli': 'src/bin/cli.ts',
    },
  },
]);
