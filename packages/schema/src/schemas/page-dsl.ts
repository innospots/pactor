import {
  ACTION_CONFIG_SCHEMA_ID,
  DSL_NODE_SCHEMA_ID,
  DSL_SOURCE_REF_SCHEMA_ID,
  dslChildrenSchema,
} from './dsl-node.js';
import { pageI18nSchema } from './i18n.js';

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

/** DataSource 配置 Schema（页面 dataSources 与片段载荷 dataSources 共用） */
export const dataSourceSchema = {
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
    /** 页面级命名组件定义（子树复用；值可为 DslSourceRef 远端惰性加载） */
    components: {
      type: 'object',
      additionalProperties: {
        anyOf: [{ $ref: DSL_NODE_SCHEMA_ID }, { $ref: DSL_SOURCE_REF_SCHEMA_ID }],
      },
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
     * UI 树根（节点数组形态，或 DslSourceRef 动态引用）：`body` 缺失时作为替代，
     * 用于 DSL 描述页面局部（无需 Page 等包装节点）
     */
    children: dslChildrenSchema,
  },
  additionalProperties: false,
} as const;

export const AUTHOR_PAGE_DSL_SCHEMA_ID = 'pactor:author-page-dsl';

/** 作者态页面 Schema：在 Page DSL 基础上允许顶层 i18n 字段（设计文档第 4.2 节） */
export const authorPageDslSchema = {
  ...pageDslSchema,
  $id: AUTHOR_PAGE_DSL_SCHEMA_ID,
  properties: {
    ...pageDslSchema.properties,
    i18n: pageI18nSchema,
  },
} as const;

export const LOCALIZED_PAGE_DSL_SCHEMA_ID = 'pactor:localized-page-dsl';

/**
 * 下发态页面 Schema：结构与 Page DSL 一致；作者态 i18n 字段编译后移除，
 * 由 additionalProperties: false 拒绝；残留 $i18n 由 validateLocalizedPageDsl 遍历检查
 */
export const localizedPageDslSchema = {
  ...pageDslSchema,
  $id: LOCALIZED_PAGE_DSL_SCHEMA_ID,
} as const;
