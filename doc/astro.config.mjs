import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

import { generateBuildInfo } from './scripts/build-info.ts';
import { validate } from './scripts/validate.ts';

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
});
