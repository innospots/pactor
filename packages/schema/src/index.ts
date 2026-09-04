export { DSL_VERSION } from './version.js';

export {
  ACTION_CONFIG_SCHEMA_ID,
  actionConfigSchema,
  DSL_NODE_SCHEMA_ID,
  DSL_SOURCE_REF_SCHEMA_ID,
  dslNodeSchema,
  dslSourceRefSchema,
} from './schemas/dsl-node.js';

export { PAGE_DSL_SCHEMA_ID, pageDslSchema } from './schemas/page-dsl.js';

export { validateDslNode, validateDslNodes, validateDslSourceRef, validatePageDsl } from './validate.js';
export type { DslValidationError, DslValidationResult } from './validate.js';
