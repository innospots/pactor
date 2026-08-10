/**
 * 运行时作用域层级（设计文档第 15 节），自外向内排列。
 */
export const RUNTIME_SCOPES = [
  'global',
  'app',
  'page',
  'overlay',
  'form',
  'component',
  'row',
  'event',
] as const;

export type RuntimeScope = (typeof RUNTIME_SCOPES)[number];
