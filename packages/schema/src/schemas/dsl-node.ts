/**
 * DslNode 与 Action 的 JSON Schema（对应 @pactor-app/core 的 DslNode / ActionConfig）。
 *
 * 通过 $id 引用实现 children 递归。
 */

export const ACTION_CONFIG_SCHEMA_ID = 'pactor:action-config';
export const DSL_NODE_SCHEMA_ID = 'pactor:dsl-node';

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

const conditionSchema = {
  anyOf: [
    { type: 'string' },
    {
      type: 'object',
      required: ['expression'],
      properties: {
        expression: { type: 'string' },
      },
      additionalProperties: false,
    },
  ],
} as const;

/** ActionConfig：动作名必填，params 任意键值；id 为命名动作结果标识（设计文档第 48 节） */
export const actionConfigSchema = {
  $id: ACTION_CONFIG_SCHEMA_ID,
  type: 'object',
  required: ['action'],
  properties: {
    id: { type: 'string', minLength: 1 },
    action: { type: 'string', minLength: 1 },
    params: { type: 'object' },
    condition: conditionSchema,
    permission: permissionSchema,
  },
  additionalProperties: false,
} as const;

/** 事件 / 生命周期挂载：单个 Action 或 Action 数组 */
const actionOrArraySchema = {
  anyOf: [
    { $ref: ACTION_CONFIG_SCHEMA_ID },
    { type: 'array', items: { $ref: ACTION_CONFIG_SCHEMA_ID } },
  ],
} as const;

/** DslSourceRef：动态 DSL 引用（service / http 二选一）+ 可选占位子树 */
export const DSL_SOURCE_REF_SCHEMA_ID = 'pactor:dsl-source-ref';

export const dslSourceRefSchema = {
  $id: DSL_SOURCE_REF_SCHEMA_ID,
  type: 'object',
  required: ['source'],
  properties: {
    source: {
      anyOf: [
        {
          type: 'object',
          required: ['type', 'service'],
          properties: {
            type: { const: 'service' },
            service: { type: 'string', minLength: 1 },
            params: { type: 'object' },
          },
          additionalProperties: false,
        },
        {
          type: 'object',
          required: ['type', 'request'],
          properties: {
            type: { const: 'http' },
            request: {
              type: 'object',
              required: ['url'],
              properties: {
                method: { type: 'string' },
                url: { type: 'string', minLength: 1 },
                params: { type: 'object' },
                headers: { type: 'object', additionalProperties: { type: 'string' } },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
      ],
    },
    placeholder: { $ref: DSL_NODE_SCHEMA_ID },
  },
  additionalProperties: false,
} as const;

/** 子树声明：内联数组（元素可为节点或动态引用混排）或整体动态引用（节点级 / 根级 children 共用） */
export const dslChildrenSchema = {
  anyOf: [
    {
      type: 'array',
      items: {
        anyOf: [{ $ref: DSL_NODE_SCHEMA_ID }, { $ref: DSL_SOURCE_REF_SCHEMA_ID }],
      },
    },
    { $ref: DSL_SOURCE_REF_SCHEMA_ID },
  ],
} as const;

/** DslNode：type（组件节点）或 component（引用页面级命名组件）二选一，children 递归 */
export const dslNodeSchema = {
  $id: DSL_NODE_SCHEMA_ID,
  type: 'object',
  anyOf: [{ required: ['type'] }, { required: ['component'] }],
  properties: {
    id: { type: 'string' },
    type: { type: 'string', minLength: 1 },
    /** 引用节点：页面级命名组件（PageDsl.components）的 key */
    component: { type: 'string', minLength: 1 },
    props: { type: 'object' },
    children: dslChildrenSchema,
    events: {
      type: 'object',
      additionalProperties: actionOrArraySchema,
    },
    permission: permissionSchema,
    when: conditionSchema,
  },
  additionalProperties: false,
} as const;
