/**
 * 作者态 i18n 协议与下发态动态文本的 JSON Schema（设计文档第 4 节）。
 *
 * `$i18n` 与 `$localizedText` 出现在组件 props 等自由对象中，Ajv 无法
 * 经节点 Schema 到达，由 validate.ts 遍历文档后按这里的 Schema 校验。
 */

export const I18N_VALUE_DESCRIPTOR_SCHEMA_ID = 'pactor:i18n-value-descriptor';
export const LOCALIZED_TEXT_SCHEMA_ID = 'pactor:localized-text';


/**
 * 翻译描述（`$i18n` 内层）：key 与 messages 必须且只能
 * 出现一个；messages 为 locale → string 扁平映射；params 为对象；
 * fallback 为可选字符串。
 */
const i18nTranslationDescriptorSchema = {
  type: 'object',
  oneOf: [{ required: ['key'] }, { required: ['messages'] }],
  properties: {
    /** 完整稳定键名（如 common.save），不解析表达式 */
    key: { type: 'string', minLength: 1 },
    /** 内联多语言：locale → 文案，禁止嵌套 */
    messages: {
      type: 'object',
      additionalProperties: { type: 'string' },
    },
    /** 参数对象（`{{name}}` 插值） */
    params: { type: 'object' },
    /** 词条回退失败后的兜底文案 */
    fallback: { type: 'string' },
  },
  additionalProperties: false,
} as const;

/** 作者态可翻译值：`$i18n` 包装对象不允许其他同级字段 */
export const i18nValueDescriptorSchema = {
  $id: I18N_VALUE_DESCRIPTOR_SCHEMA_ID,
  type: 'object',
  required: ['$i18n'],
  properties: {
    $i18n: i18nTranslationDescriptorSchema,
  },
  additionalProperties: false,
} as const;

/** 页面作者态 i18n 字段（设计文档第 4.2 节）；编译后移除，不下发 */
export const pageI18nSchema = {
  type: 'object',
  properties: {
    /** 语言包分组（namespace），不是 key 前缀 */
    namespaces: {
      type: 'array',
      items: { type: 'string', minLength: 1 },
    },
  },
  additionalProperties: false,
} as const;

/** 下发态动态文本：语言选择已完成，仅余 `{{name}}` 模板插值（设计文档第 4.3 节） */
export const localizedTextSchema = {
  $id: LOCALIZED_TEXT_SCHEMA_ID,
  type: 'object',
  required: ['$localizedText'],
  properties: {
    $localizedText: {
      type: 'object',
      required: ['template'],
      properties: {
        template: { type: 'string' },
        params: { type: 'object' },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
} as const;
