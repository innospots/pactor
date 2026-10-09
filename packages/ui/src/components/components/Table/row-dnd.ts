/** Table 树形数据与行拖拽的纯函数辅助（独立于组件，便于单测） */

export interface FlatRow {
  row: Record<string, unknown>;
  key: string | number;
  /** 层级（顶层为 0），用于缩进 */
  level: number;
  /** 父行 key（顶层为 null）；行拖拽只允许同父级内排序 */
  parentKey: string | number | null;
  /** 是否有子级（决定展开箭头；无子级渲染占位保持文字对齐） */
  hasChildren: boolean;
}

export interface RowTreeOptions {
  rowKey: string;
  /** 子级字段名；false 表示禁用树形（全部按平铺处理） */
  childrenField: string | false;
}

/** 行 key 取值：rowKey 字段缺失时回退为路径键（如 0 / 0-2），保证树内唯一 */
export function rowKeyOf(
  row: Record<string, unknown>,
  rowKey: string,
  fallback: string | number,
): string | number {
  const key = row[rowKey];
  return key === undefined || key === null ? fallback : (key as string | number);
}

/** 读取子级数组（childrenField 为 false 时视为无子级） */
export function childrenOf(
  row: Record<string, unknown>,
  childrenField: string | false,
): Record<string, unknown>[] | undefined {
  if (childrenField === false) return undefined;
  const children = row[childrenField];
  return Array.isArray(children) && children.length > 0
    ? (children as Record<string, unknown>[])
    : undefined;
}

/**
 * 把（可能含子级的）行数据按展开状态拍平为渲染行序列。
 * 仅展开的行（key 在 expandedKeys 中）会带出子级。
 */
export function flattenRows(
  rows: Record<string, unknown>[],
  expandedKeys: ReadonlySet<string | number>,
  options: RowTreeOptions,
): FlatRow[] {
  const flat: FlatRow[] = [];
  const walk = (
    list: Record<string, unknown>[],
    level: number,
    parentKey: string | number | null,
    keyPath: string,
  ) => {
    list.forEach((row, index) => {
      const path = keyPath === '' ? String(index) : `${keyPath}-${index}`;
      const key = rowKeyOf(row, options.rowKey, path);
      const children = childrenOf(row, options.childrenField);
      flat.push({
        row,
        key,
        level,
        parentKey,
        hasChildren: children !== undefined,
      });
      if (children && expandedKeys.has(key)) {
        walk(children, level + 1, key, path);
      }
    });
  };
  walk(rows, 0, null, '');
  return flat;
}

/** 收集所有含子级的行 key（用于「默认展开全部」的初始展开集合） */
export function collectParentKeys(
  rows: Record<string, unknown>[],
  options: RowTreeOptions,
): (string | number)[] {
  const keys: (string | number)[] = [];
  const walk = (list: Record<string, unknown>[], keyPath: string) => {
    list.forEach((row, index) => {
      const path = keyPath === '' ? String(index) : `${keyPath}-${index}`;
      const children = childrenOf(row, options.childrenField);
      if (children) {
        keys.push(rowKeyOf(row, options.rowKey, path));
        walk(children, path);
      }
    });
  };
  walk(rows, '');
  return keys;
}

/** 树形递归排序：每层内部按同一字段排序，层级结构不变 */
export function sortTreeRows(
  rows: Record<string, unknown>[],
  dataIndex: string,
  order: 'ascend' | 'descend',
  childrenField: string | false,
): Record<string, unknown>[] {
  const dir = order === 'ascend' ? 1 : -1;
  const compare = (a: Record<string, unknown>, b: Record<string, unknown>) => {
    const va = a[dataIndex];
    const vb = b[dataIndex];
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
    return String(va ?? '').localeCompare(String(vb ?? ''), 'zh-CN') * dir;
  };
  return [...rows]
    .map((row) => {
      const children = childrenOf(row, childrenField);
      return children
        ? { ...row, [childrenField as string]: sortTreeRows(children, dataIndex, order, childrenField) }
        : row;
    })
    .sort(compare);
}

function removeRow(
  rows: Record<string, unknown>[],
  key: string | number,
  options: RowTreeOptions,
): [Record<string, unknown>[], Record<string, unknown> | null] {
  let removed: Record<string, unknown> | null = null;
  const walk = (list: Record<string, unknown>[], keyPath: string) => {
    const next: Record<string, unknown>[] = [];
    list.forEach((row, index) => {
      const path = keyPath === '' ? String(index) : `${keyPath}-${index}`;
      if (rowKeyOf(row, options.rowKey, path) === key) {
        removed = row;
        return;
      }
      const children = childrenOf(row, options.childrenField);
      next.push(
        children
          ? { ...row, [options.childrenField as string]: walk(children, path) }
          : row,
      );
    });
    return next;
  };
  return [walk(rows, ''), removed];
}

function insertRow(
  rows: Record<string, unknown>[],
  node: Record<string, unknown>,
  targetKey: string | number,
  position: 'before' | 'after',
  options: RowTreeOptions,
): [Record<string, unknown>[], boolean] {
  const walk = (
    list: Record<string, unknown>[],
    keyPath: string,
  ): [Record<string, unknown>[], boolean] => {
    const next: Record<string, unknown>[] = [];
    let inserted = false;
    list.forEach((row, index) => {
      const path = keyPath === '' ? String(index) : `${keyPath}-${index}`;
      if (rowKeyOf(row, options.rowKey, path) === targetKey) {
        if (position === 'before') {
          next.push(node, row);
        } else {
          next.push(row, node);
        }
        inserted = true;
        return;
      }
      const children = childrenOf(row, options.childrenField);
      if (children) {
        const [nextChildren, childInserted] = insertRow(
          children,
          node,
          targetKey,
          position,
          options,
        );
        next.push(
          childInserted
            ? { ...row, [options.childrenField as string]: nextChildren }
            : row,
        );
        inserted = inserted || childInserted;
        return;
      }
      next.push(row);
    });
    return [inserted ? next : list, inserted];
  };
  return walk(rows, '');
}

/**
 * 行拖拽排序：把 dragKey 移到 dropKey 的 before / after（仅同级）。
 * 不同父级（树形跨层拖动）或键不存在时返回 null；入参数组不被改动。
 */
export function moveRow(
  rows: Record<string, unknown>[],
  dragKey: string | number,
  dropKey: string | number,
  position: 'before' | 'after',
  options: RowTreeOptions,
): Record<string, unknown>[] | null {
  if (dragKey === dropKey) return null;
  const [withoutDrag, dragNode] = removeRow(rows, dragKey, options);
  if (!dragNode) return null;
  const [next, inserted] = insertRow(withoutDrag, dragNode, dropKey, position, options);
  return inserted ? next : null;
}
