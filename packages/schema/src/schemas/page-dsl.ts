import { ACTION_CONFIG_SCHEMA_ID, DSL_NODE_SCHEMA_ID } from './dsl-node.js';

/**
 * Page DSL 根结构 JSON Schema（设计文档第 10、37 节）。
 */

export const PAGE_DSL_SCHEMA_ID = 'pactor:page-dsl';

const permissionSchema = {
  anyOf: [
    { type: 'string', minLength: 1 },
    { type: 'array', items: { type: 'string', minLength: 1 } },
    {
      type: 'object',
      required: ['code'],
      properties: {
        code: {
          anyOf: [
            { type: 'string', minLength: 1 },
            { type: 'array', items: { type: 'string', minLength: 1 } },
          ],
        },
        denied: { enum: ['hidden', 'disabled', 'readonly'] },
      },
      additionalProperties: false,
    },
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
    /** 选项字段映射（该数据源用作选项源时声明） */
    valueField: { type: 'string', minLength: 1 },
    labelField: { type: 'string', minLength: 1 },
    /** 选项禁用标记字段 */
    disabledField: { type: 'string', minLength: 1 },
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
        /** 页面名称（标识用途） */
        name: { type: 'string' },
        /** 页面描述 */
        description: { type: 'string' },
        type: { type: 'string' },
        permission: permissionSchema,
      },
      additionalProperties: false,
    },
    /** 页面扩展元数据（自由键值，如 version / author），Runtime 不消费 */
    meta: { type: 'object' },
    state: { type: 'object' },
    dataSources: {
      type: 'object',
      additionalProperties: dataSourceSchema,
    },
    /** 页面级命名动作定义（供 call 动作按名引用复用） */
    actions: {
      type: 'object',
      additionalProperties: actionOrArraySchema,
    },
    /** 页面级命名组件定义（Fragment 子树复用） */
    components: {
      type: 'object',
      additionalProperties: { $ref: DSL_NODE_SCHEMA_ID },
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
    /**
     * UI 树根（节点数组形态）：`body` 缺失时作为替代，
     * 用于 DSL 描述页面局部（无需 Page 等包装节点）
     */
    children: {
      type: 'array',
      items: { $ref: DSL_NODE_SCHEMA_ID },
    },
  },
  additionalProperties: false,
} as const;
