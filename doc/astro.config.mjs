import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

import { generateBuildInfo } from './scripts/build-info.ts';
import { validate } from './scripts/validate.ts';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

/**
 * pnpm 对带 peer 的 workspace 包会生成 .pnpm 注入副本（与 packages/* 源
 * 是同内容的两条物理路径），rolldown 按路径判定模块导致同一包被打包两次，
 * React Context 跨副本失效（Form/Table 等 useRenderer 取到 null）。
 * 这里把 @pactor-app/* 统一别名到 packages/* 源路径，保证单实例。
 */
const PACTOR_ALIAS = [
  { find: '@pactor-app/ui/styles.css', replacement: r('../packages/ui/styles.css') },
  { find: /^@pactor-app\/ui$/, replacement: r('../packages/ui/dist/index.js') },
  { find: /^@pactor-app\/ui\/components$/, replacement: r('../packages/ui/dist/components/index.js') },
  { find: /^@pactor-app\/ui\/interaction$/, replacement: r('../packages/ui/dist/interaction/index.js') },
  { find: /^@pactor-app\/ui\/layout$/, replacement: r('../packages/ui/dist/layout/index.js') },
  { find: /^@pactor-app\/ui\/ui$/, replacement: r('../packages/ui/dist/ui/index.js') },
  { find: '@pactor-app/runtime', replacement: r('../packages/runtime/dist/index.js') },
  { find: '@pactor-app/core', replacement: r('../packages/core/dist/index.js') },
  { find: '@pactor-app/expression', replacement: r('../packages/expression/dist/index.js') },
  { find: '@pactor-app/schema', replacement: r('../packages/schema/dist/index.js') },
  { find: '@pactor-app/permission', replacement: r('../packages/permission/dist/index.js') },
  { find: '@pactor-app/markdown', replacement: r('../packages/markdown/dist/index.js') },
  { find: '@pactor-app/router', replacement: r('../packages/router/dist/index.js') },
];

/**
 * 资产数据校验 + 构建信息注入（双保险）。
 * pnpm build 串行执行 validate / build:info 后才会运行 astro build；
 * 此处 astro:build:start 再执行一次同样校验，即使绕过脚本直接执行
 * astro build，数据非法也会抛错阻断构建。
 */
function assetValidate() {
  return {
    name: 'asset-validate',
    hooks: {
      'astro:build:start': async () => {
        generateBuildInfo();
        const { errors } = validate();
        if (errors.length > 0) {
          throw new Error(
            `资产数据校验失败（${errors.length} 个错误）：\n` +
              errors.map((e) => `  - ${e}`).join('\n'),
          );
        }
      },
    },
  };
}

export default defineConfig({
  integrations: [react(), assetValidate()],
  vite: {
    resolve: {
      alias: PACTOR_ALIAS,
      // pnpm peer 解析会产生多个 react/react-dom 物理路径，强制去重到单一路径
      dedupe: ['react', 'react-dom'],
    },
  },
});
