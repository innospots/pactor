export { DSL_VERSION } from './version.js';

export {
  ACTION_CONFIG_SCHEMA_ID,
  actionConfigSchema,
  DSL_NODE_SCHEMA_ID,
  DSL_SOURCE_REF_SCHEMA_ID,
  dslNodeSchema,
  dslSourceRefSchema,
} from './schemas/dsl-node.js';

export { PAGE_DSL_SCHEMA_ID, AUTHOR_PAGE_DSL_SCHEMA_ID, authorPageDslSchema, LOCALIZED_PAGE_DSL_SCHEMA_ID, localizedPageDslSchema, pageDslSchema } from './schemas/page-dsl.js';

export {
  I18N_VALUE_DESCRIPTOR_SCHEMA_ID,
  i18nValueDescriptorSchema,
  LOCALIZED_TEXT_SCHEMA_ID,
  localizedTextSchema,
  pageI18nSchema,
} from './schemas/i18n.js';

export {
  DSL_FRAGMENT_PAYLOAD_SCHEMA_ID,
  dslFragmentPayloadSchema,
} from './schemas/dsl-fragment.js';

export { validateAuthorPageDsl, validateDslFragmentPayload, validateDslNode, validateDslNodes, validateDslSourceRef, validateLocalizedPageDsl, validatePageDsl } from './validate.js';
export type { DslValidationError, DslValidationResult } from './validate.js';
