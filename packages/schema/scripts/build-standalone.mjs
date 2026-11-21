// 构建期生成 Ajv standalone 预编译校验器（dist/standalone.js）。
// 目的：禁代码生成的运行时（Cloudflare Workers / workerd）无法执行 Ajv compile，
// 预编译产物为静态 JS，不触发动态代码执行。
// schema 注册与 src/validate.ts 保持一致；二者输出的一致性由 standalone-parity 测试保证。
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const Ajv = require('ajv');
const standaloneCode = require('ajv/dist/standalone');

const here = dirname(fileURLToPath(import.meta.url));
const distDir = join(here, '../dist');
const schema = await import('../dist/index.js');

const ajv = new Ajv({ allErrors: true, strict: false, code: { source: true, esm: true } });
// 注册顺序与 src/validate.ts 的 getAjv() 一致
for (const s of [
  schema.actionConfigSchema,
  schema.dslSourceRefSchema,
  schema.dslNodeSchema,
  schema.pageDslSchema,
  schema.authorPageDslSchema,
  schema.localizedPageDslSchema,
  schema.i18nValueDescriptorSchema,
  schema.localizedTextSchema,
  schema.dslFragmentPayloadSchema,
]) {
  ajv.addSchema(s);
}
// 触发编译（standaloneCode 只导出已编译的校验器）
ajv.getSchema(schema.PAGE_DSL_SCHEMA_ID);

const code = standaloneCode(ajv, { pageDsl: schema.PAGE_DSL_SCHEMA_ID });
writeFileSync(join(distDir, 'standalone-validators.js'), code);

writeFileSync(
  join(distDir, 'standalone.js'),
  `// 由 scripts/build-standalone.mjs 生成，请勿手改
import { createPageDslValidator } from './index.js';
import { pageDsl } from './standalone-validators.js';

/** 预编译的 Page DSL 校验器：与 validatePageDsl 输出一致，但不依赖运行时代码生成 */
export const validatePageDslStandalone = createPageDslValidator(pageDsl);
`,
);

writeFileSync(
  join(distDir, 'standalone.d.ts'),
  `import type { DslValidationResult } from './index.js';
export declare const validatePageDslStandalone: (document: unknown) => DslValidationResult;
`,
);

console.log('[build-standalone] dist/standalone.js generated');
