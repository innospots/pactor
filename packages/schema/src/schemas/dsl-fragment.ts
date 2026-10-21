import { dslChildrenSchema } from './dsl-node.js';
import { dataSourceSchema } from './page-dsl.js';

/**
 * DslFragmentPayload JSON Schema（对应 @pactor-app/core 的 DslFragmentPayload）：
 * DslSourceRef 动态引用解析结果的扩展形态——除 `children` 子树外可携带
 * `dataSources` 与 `state`，由渲染边界注册进当前页面运行时。
 */

export const DSL_FRAGMENT_PAYLOAD_SCHEMA_ID = 'pactor:dsl-fragment-payload';

export const dslFragmentPayloadSchema = {
  $id: DSL_FRAGMENT_PAYLOAD_SCHEMA_ID,
  type: 'object',
  required: ['children'],
  properties: {
    /** 子树声明（元素可为 DslNode 或 DslSourceRef 混排） */
    children: dslChildrenSchema,
    /** 片段携带的数据源，渲染边界解析成功后运行时注册 */
    dataSources: {
      type: 'object',
      additionalProperties: dataSourceSchema,
    },
    /** 片段携带的初始 state，解析成功后合并进页面 state */
    state: { type: 'object' },
  },
  additionalProperties: false,
} as const;
