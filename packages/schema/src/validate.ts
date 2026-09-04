import Ajv, { type ErrorObject, type ValidateFunction } from 'ajv';

import {
  actionConfigSchema,
  DSL_NODE_SCHEMA_ID,
  DSL_SOURCE_REF_SCHEMA_ID,
  dslNodeSchema,
  dslSourceRefSchema,
} from './schemas/dsl-node.js';
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
  /** 提示级信息（不阻断校验），如 body 与根级 children 共存 */
  warnings: DslValidationError[];
}

const ajv = new Ajv({ allErrors: true, strict: false });
ajv.addSchema(actionConfigSchema);
ajv.addSchema(dslSourceRefSchema);
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
 * 校验通过时 errors 为空数组；warnings 为提示级信息（不阻断校验）。
 */
export function validatePageDsl(document: unknown): DslValidationResult {
  const validate = getValidator();
  const valid = validate(document) as boolean;
  return {
    valid,
    errors: valid ? [] : toStructuredErrors(validate.errors ?? []),
    warnings: collectWarnings(document),
  };
}

/** 收集提示级信息（与 Schema 校验正交，不影响 valid） */
function collectWarnings(document: unknown): DslValidationError[] {
  if (typeof document !== 'object' || document === null) {
    return [];
  }
  const doc = document as Record<string, unknown>;
  if (doc.body !== undefined && doc.children !== undefined) {
    return [
      {
        path: '/children',
        message: 'body 与根级 children 同时声明，children 将被忽略（body 优先）',
        keyword: 'conflict',
      },
    ];
  }
  return [];
}

/**
 * 校验单个 DslNode（如远端动态加载的子树），返回结构化错误列表（空数组为通过）。
 */
export function validateDslNode(value: unknown): DslValidationError[] {
  const validate = ajv.getSchema(DSL_NODE_SCHEMA_ID);
  if (!validate) {
    throw new Error(`schema not registered: ${DSL_NODE_SCHEMA_ID}`);
  }
  const valid = validate(value) as boolean;
  return valid ? [] : toStructuredErrors(validate.errors ?? []);
}

/** 校验单个 DslSourceRef（children 数组中的引用元素） */
export function validateDslSourceRef(value: unknown): DslValidationError[] {
  const validate = ajv.getSchema(DSL_SOURCE_REF_SCHEMA_ID);
  if (!validate) {
    throw new Error(`schema not registered: ${DSL_SOURCE_REF_SCHEMA_ID}`);
  }
  const valid = validate(value) as boolean;
  return valid ? [] : toStructuredErrors(validate.errors ?? []);
}

/**
 * 校验 DslChildrenItem 数组（如远端动态加载的根级/节点级 children），
 * 元素可为 DslNode 或 DslSourceRef 混排。返回结构化错误列表（空数组为通过）。
 */
export function validateDslNodes(value: unknown): DslValidationError[] {
  if (!Array.isArray(value)) {
    return [{ path: '/', message: '必须是 DslNode 数组', keyword: 'type' }];
  }
  return value.flatMap((item, index) => {
    // 含 source 字段按引用形态校验，否则按节点形态
    const isRef =
      typeof item === 'object' &&
      item !== null &&
      !Array.isArray(item) &&
      'source' in item;
    const errors = isRef ? validateDslSourceRef(item) : validateDslNode(item);
    return errors.map((error) => ({
      ...error,
      path: `/${index}${error.path === '/' ? '' : error.path}`,
    }));
  });
}
