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
  // vaul 必须内联进产物：仓库用 pnpm patch 修正了 vaul 1.1.2 不把
  // modal={false} 透传给底层 Radix Dialog 的问题（patch 见
  // patches/vaul@1.1.2.patch）。pnpm patch 只作用于本仓库安装的依赖，
  // 不会随 npm 发布物下发；若继续 external，消费方拿到的是原版 vaul，
  // Drawer 打开时 Radix 仍按模态处理给 body 挂 pointer-events:none，
  // 抽屉内 Select 等 portal 弹层无法点击。内联后发布产物自带修复。
  noExternal: ['vaul'],
});
