import Ajv, { type ErrorObject, type ValidateFunction } from 'ajv';

import { actionConfigSchema, dslNodeSchema } from './schemas/dsl-node.js';
import { PAGE_DSL_SCHEMA_ID, pageDslSchema } from './schemas/page-dsl.js';

/** 结构化校验错误（不暴露 Ajv 原始错误对象） */
export interface DslValidationError {
  /** 字段路径，如 "/page/id"、"/body/children/0/type"；根级为 "/" */
  path: string;
  /** 人类可读描述 */
  message: string;
  /** Ajv 错误关键字，如 "required"、"type"、"enum" */
  keyword: string;
}

export interface DslValidationResult {
  valid: boolean;
  errors: DslValidationError[];
}

const ajv = new Ajv({ allErrors: true, strict: false });
ajv.addSchema(actionConfigSchema);
ajv.addSchema(dslNodeSchema);
ajv.addSchema(pageDslSchema);

function toStructuredErrors(errors: ErrorObject[]): DslValidationError[] {
  return errors.map((error) => {
    let path = error.instancePath || '/';
    // required 错误的 instancePath 指向父对象，补上缺失的字段名便于定位
    if (error.keyword === 'required') {
      const missing = (error.params as { missingProperty?: string }).missingProperty;
      if (missing) {
        path = `${path === '/' ? '' : path}/${missing}`;
      }
    }
    return {
      path,
      message: error.message ?? 'invalid',
      keyword: error.keyword,
    };
  });
}

function getValidator(): ValidateFunction {
  const validate = ajv.getSchema(PAGE_DSL_SCHEMA_ID);
  if (!validate) {
    throw new Error(`schema not registered: ${PAGE_DSL_SCHEMA_ID}`);
  }
  return validate;
}

/**
 * 校验 Page DSL 文档是否符合根结构 Schema。
 * 校验通过时 errors 为空数组。
 */
export function validatePageDsl(document: unknown): DslValidationResult {
  const validate = getValidator();
  const valid = validate(document) as boolean;
  return { valid, errors: valid ? [] : toStructuredErrors(validate.errors ?? []) };
}
