export { DSL_VERSION } from './version.js';

export {
  ACTION_CONFIG_SCHEMA_ID,
  actionConfigSchema,
  DSL_NODE_SCHEMA_ID,
  dslNodeSchema,
} from './schemas/dsl-node.js';

export { PAGE_DSL_SCHEMA_ID, pageDslSchema } from './schemas/page-dsl.js';

export { validatePageDsl } from './validate.js';
export type { DslValidationError, DslValidationResult } from './validate.js';
