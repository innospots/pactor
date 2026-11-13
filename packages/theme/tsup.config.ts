import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'es2020',
  dts: true,
  clean: true,
  // CSS 作为字符串按皮肤切分到独立 chunk；CJS 也要动态 chunk，
  // 因此必须显式 splitting 并关闭 treeshake（tsup 仅在此时走 ESM→sucrase 路径）。
  splitting: true,
  treeshake: false,
  loader: { '.css': 'text' },
});
