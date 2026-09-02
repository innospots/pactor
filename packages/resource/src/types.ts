import type { FragmentDsl, PageDsl, RequiresConfig } from '@pactor-app/core';

/**
 * DSL 资源模型（设计文档附录 C）：Envelope 与加载器接口。
 */

/** 资源类型；V1 内置 page / fragment / bootstrap，允许服务端扩展其他类型 */
export type DslResourceType = 'page' | 'fragment' | 'bootstrap' | (string & {});

/** DSL 资源 Envelope：服务端传输 DSL 的统一包装 */
export interface DslResourceEnvelope<T> {
  id: string;
  resourceType: DslResourceType;
  /** 服务端递增版本号，用于缓存键 `id@version` */
  version: number;
  /** DSL Specification Version，如 "1.0" */
  dslVersion: string;
  etag?: string;
  requires?: RequiresConfig;
  /** DSL 本体（PageDsl / FragmentDsl） */
  schema: T;
  updatedAt?: string;
}

/** 页面资源 */
export type PageResource = DslResourceEnvelope<PageDsl>;

/** Fragment 资源 */
export type FragmentResource = DslResourceEnvelope<FragmentDsl>;

/**
 * Bootstrap 资源：应用启动时的聚合数据。
 * 字段宽松可选，以服务端实际返回为准；`pageVersions`（pageId → version）用于缓存版本控制。
 */
export interface BootstrapResource {
  id: string;
  resourceType: DslResourceType;
  version: number;
  dslVersion: string;
  etag?: string;
  updatedAt?: string;
  app?: Record<string, unknown>;
  user?: Record<string, unknown>;
  permissions?: string[];
  menus?: unknown[];
  /** 页面版本表：pageId → 当前版本号 */
  pageVersions?: Record<string, number>;
  /** 允许服务端返回其他扩展字段 */
  [key: string]: unknown;
}

/** 统一资源加载器接口 */
export interface DslResourceLoader {
  loadPage(pageId: string): Promise<PageResource>;
  loadFragment(fragmentId: string): Promise<FragmentResource>;
  loadBootstrap(): Promise<BootstrapResource>;
}

/** 宽容解析选项：id 与 resourceType 由调用方（端点）提供 */
export interface ParseEnvelopeOptions {
  /** 服务端缺省 id 时的回退值（通常为请求的资源 id） */
  id: string;
  /** 服务端缺省 resourceType 时由端点推断 */
  resourceType: DslResourceType;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * 宽容解析 envelope：字段缺失时给默认值，不做强行校验。
 * DSL 本体校验留给 PageRuntime（@pactor-app/schema）；服务端直接返回裸 DSL（无 schema 字段）时整体作为 schema。
 */
export function parseEnvelope<T>(
  raw: unknown,
  options: ParseEnvelopeOptions,
): DslResourceEnvelope<T> {
  const data = isRecord(raw) ? raw : {};
  const schema = ('schema' in data ? data.schema : raw) as T;
  const dslVersion =
    typeof data.dslVersion === 'string'
      ? data.dslVersion
      : isRecord(schema) && typeof schema.dsl === 'string'
        ? schema.dsl
        : '1.0';

  return {
    id: typeof data.id === 'string' ? data.id : options.id,
    resourceType:
      typeof data.resourceType === 'string'
        ? data.resourceType
        : options.resourceType,
    version: typeof data.version === 'number' ? data.version : 1,
    dslVersion,
    etag: typeof data.etag === 'string' ? data.etag : undefined,
    requires: data.requires as RequiresConfig | undefined,
    schema,
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
  };
}

/** 宽容解析 Bootstrap 资源：字段全部可选，保留服务端扩展字段 */
export function parseBootstrapResource(raw: unknown): BootstrapResource {
  const data = isRecord(raw) ? raw : {};
  return {
    ...data,
    id: typeof data.id === 'string' ? data.id : 'bootstrap',
    resourceType:
      typeof data.resourceType === 'string' ? data.resourceType : 'bootstrap',
    version: typeof data.version === 'number' ? data.version : 1,
    dslVersion: typeof data.dslVersion === 'string' ? data.dslVersion : '1.0',
    etag: typeof data.etag === 'string' ? data.etag : undefined,
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
    pageVersions: isRecord(data.pageVersions)
      ? (data.pageVersions as Record<string, number>)
      : undefined,
  };
}
