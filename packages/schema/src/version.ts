/**
 * DSL Specification Version（设计文档第 37 节）。
 *
 * DSL 文档根节点必须携带 `dsl` 字段声明其遵循的规范版本；
 * Runtime 加载前据此做 capability validation。
 */
export const DSL_VERSION = '1.0' as const;
