import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/components/index.ts',
    'src/interaction/index.ts',
    'src/layout/index.ts',
    'src/ui/index.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
});
