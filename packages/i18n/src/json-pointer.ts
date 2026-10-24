import { I18nError } from './errors.js';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** JSON Pointer 数组下标：具体非负整数，禁止通配符、`-` 与前导零 */
const ARRAY_INDEX_RE = /^(0|[1-9]\d*)$/;

/** 转义单个 JSON Pointer 段（`~` → `~0`、`/` → `~1`） */
export function escapeJsonPointerSegment(segment: string): string {
  return segment.replace(/~/g, '~0').replace(/\//g, '~1');
}

/**
 * 解析 JSON Pointer（RFC 6901）为段数组。
 * 空串返回 `[]`（指整个文档）；`~0`/`~1` 之外的转义、非 `/` 开头均抛 BINDING_INVALID。
 */
export function parseJsonPointer(pointer: string): string[] {
  if (pointer === '') {
    return [];
  }
  if (typeof pointer !== 'string' || !pointer.startsWith('/')) {
    throw new I18nError('BINDING_INVALID', `bindings 键必须是 JSON Pointer（/ 开头或空串）: ${String(pointer)}`, {
      pointer,
    });
  }
  return pointer
    .slice(1)
    .split('/')
    .map((raw) => {
      if (/~(?![01])/.test(raw)) {
        throw new I18nError('BINDING_INVALID', `JSON Pointer 含非法转义: ${pointer}`, { pointer });
      }
      return raw.replace(/~1/g, '/').replace(/~0/g, '~');
    });
}

/** bindings 定位结果：父容器、末段键与当前值 */
export interface ResolvedJsonPointer {
  parent: Record<string, unknown> | unknown[];
  key: string | number;
  value: unknown;
}

function missing(pointer: string): never {
  throw new I18nError('BINDING_INVALID', `bindings 目标不存在: ${pointer}`, { pointer });
}

function parseArrayIndex(segment: string, pointer: string): number {
  if (!ARRAY_INDEX_RE.test(segment)) {
    throw new I18nError(
      'BINDING_INVALID',
      `bindings 数组路径必须是具体下标（不支持通配符与 -）: ${pointer}`,
      { pointer, segment },
    );
  }
  return Number(segment);
}

function childAt(container: unknown, segment: string, pointer: string): unknown {
  if (Array.isArray(container)) {
    const index = parseArrayIndex(segment, pointer);
    if (index >= container.length) {
      missing(pointer);
    }
    return container[index];
  }
  if (isPlainObject(container)) {
    if (!Object.prototype.hasOwnProperty.call(container, segment)) {
      missing(pointer);
    }
    return container[segment];
  }
  missing(pointer);
}

/**
 * 按段数组定位目标字段。空指针（指整个文档）、中间段或末段不存在、
 * 数组下标非法均抛 BINDING_INVALID。
 */
export function resolveJsonPointer(
  root: unknown,
  segments: readonly string[],
  pointer: string,
): ResolvedJsonPointer {
  if (segments.length === 0) {
    throw new I18nError('BINDING_INVALID', 'bindings 不能指向整个文档（目标必须为字符串字段）', {
      pointer,
    });
  }
  let current: unknown = root;
  for (let i = 0; i < segments.length - 1; i += 1) {
    current = childAt(current, segments[i]!, pointer);
  }
  const last = segments[segments.length - 1]!;
  if (Array.isArray(current)) {
    const index = parseArrayIndex(last, pointer);
    if (index >= current.length) {
      missing(pointer);
    }
    return { parent: current, key: index, value: current[index] };
  }
  if (isPlainObject(current)) {
    if (!Object.prototype.hasOwnProperty.call(current, last)) {
      missing(pointer);
    }
    return { parent: current, key: last, value: current[last] };
  }
  missing(pointer);
}
