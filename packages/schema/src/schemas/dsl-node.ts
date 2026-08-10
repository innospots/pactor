/**
 * DslNode 与 Action 的 JSON Schema（对应 pactor-core 的 DslNode / ActionConfig）。
 *
 * 通过 $id 引用实现 children 递归。
 */

export const ACTION_CONFIG_SCHEMA_ID = 'pactor:action-config';
export const DSL_NODE_SCHEMA_ID = 'pactor:dsl-node';

const permissionSchema = {
  anyOf: [
    { type: 'string', minLength: 1 },
    { type: 'array', items: { type: 'string', minLength: 1 } },
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

/** ActionConfig：动作名必填，params 任意键值 */
export const actionConfigSchema = {
  $id: ACTION_CONFIG_SCHEMA_ID,
  type: 'object',
  required: ['action'],
  properties: {
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

/** DslNode：type 必填，children 递归 */
export const dslNodeSchema = {
  $id: DSL_NODE_SCHEMA_ID,
  type: 'object',
  required: ['type'],
  properties: {
    id: { type: 'string' },
    type: { type: 'string', minLength: 1 },
    props: { type: 'object' },
    children: {
      type: 'array',
      items: { $ref: DSL_NODE_SCHEMA_ID },
    },
    events: {
      type: 'object',
      additionalProperties: actionOrArraySchema,
    },
    permission: permissionSchema,
    when: conditionSchema,
  },
  additionalProperties: false,
} as const;
