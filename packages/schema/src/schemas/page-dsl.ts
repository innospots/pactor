import { ACTION_CONFIG_SCHEMA_ID, DSL_NODE_SCHEMA_ID } from './dsl-node.js';

/**
 * Page DSL 根结构 JSON Schema（设计文档第 10、37 节）。
 */

export const PAGE_DSL_SCHEMA_ID = 'pactor:page-dsl';

const permissionSchema = {
  anyOf: [
    { type: 'string', minLength: 1 },
    { type: 'array', items: { type: 'string', minLength: 1 } },
  ],
} as const;

const actionOrArraySchema = {
  anyOf: [
    { $ref: ACTION_CONFIG_SCHEMA_ID },
    { type: 'array', items: { $ref: ACTION_CONFIG_SCHEMA_ID } },
  ],
} as const;

const dataSourceSchema = {
  type: 'object',
  required: ['type'],
  properties: {
    type: { enum: ['http', 'service', 'static', 'computed', 'resource'] },
    service: { type: 'string', minLength: 1 },
    autoLoad: { type: 'boolean' },
    params: { type: 'object' },
    request: {
      type: 'object',
      required: ['url'],
      properties: {
        method: { type: 'string' },
        url: { type: 'string', minLength: 1 },
        params: { type: 'object' },
        headers: { type: 'object', additionalProperties: { type: 'string' } },
        body: true,
      },
      additionalProperties: false,
    },
    pagination: {
      type: 'object',
      properties: {
        page: true,
        pageSize: true,
      },
      additionalProperties: false,
    },
    value: true,
  },
  additionalProperties: false,
} as const;

export const pageDslSchema = {
  $id: PAGE_DSL_SCHEMA_ID,
  type: 'object',
  required: ['dsl', 'page'],
  properties: {
    /** DSL Specification Version，如 "1.0" */
    dsl: { type: 'string', minLength: 1 },
    requires: {
      type: 'object',
      properties: {
        /** Runtime 版本范围（semver range 字符串），如 ">=1.0.0" */
        runtime: { type: 'string', minLength: 1 },
        /** 组件 API 版本要求：组件名 → semver range 字符串 */
        components: {
          type: 'object',
          additionalProperties: { type: 'string', minLength: 1 },
        },
      },
      additionalProperties: false,
    },
    page: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', minLength: 1 },
        title: { type: 'string' },
        type: { type: 'string' },
        permission: permissionSchema,
      },
      additionalProperties: false,
    },
    state: { type: 'object' },
    dataSources: {
      type: 'object',
      additionalProperties: dataSourceSchema,
    },
    lifecycle: {
      type: 'object',
      properties: {
        onInit: actionOrArraySchema,
        onLoad: actionOrArraySchema,
        onReady: actionOrArraySchema,
        onShow: actionOrArraySchema,
        onHide: actionOrArraySchema,
        onDestroy: actionOrArraySchema,
      },
      additionalProperties: false,
    },
    body: { $ref: DSL_NODE_SCHEMA_ID },
  },
  additionalProperties: false,
} as const;
