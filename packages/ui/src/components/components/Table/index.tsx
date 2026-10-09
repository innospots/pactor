import type { DslNode } from '@pactor-app/core';
import { useI18n, useRenderer } from '@pactor-app/runtime';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
} from 'react';

import { cn } from '../../../lib/utils.js';
import { Button as ShadcnButton } from '../../../ui/button.js';
import { Checkbox as ShadcnCheckbox } from '../../../ui/checkbox.js';
import { Spinner as ShadcnSpinner } from '../../../ui/spinner.js';
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../ui/table.js';
import { Icon } from '../Icon/index.js';
import {
  childrenOf,
  collectParentKeys,
  flattenRows,
  moveRow,
  sortTreeRows,
  type FlatRow,
} from './row-dnd.js';

/**
 * 列定义；`cell` 为行模板 DSL 子树，每个单元格经 Renderer 子作用域
 * 机制渲染，作用域注入 `row`（当前行记录）与 `rowIndex`（设计决策 D4）。
 */
export interface TableColumn {
  title?: string;
  dataIndex?: string;
  width?: number | string;
  /** 列内容水平对齐（表头与单元格同时生效），默认 left */
  align?: 'left' | 'center' | 'right';
  /** 列固定（sticky）：right 常用于操作列固定最右；单侧仅支持一列 */
  fixed?: 'left' | 'right';
  /** 可排序列：表头带 ⇅/↑/↓ 图标，点击三态循环 asc → desc → 取消（单例排序） */
  sorter?: boolean;
  /** 默认排序方向（仅 sorter 列；页面初始序） */
  defaultSortOrder?: SortOrder;
  cell?: DslNode;
}

/** 排序方向 */
export type SortOrder = 'ascend' | 'descend';

/** DSL 分页配置：false 关闭，`{ pageSize }` 简化映射 */
export type TablePagination = false | { pageSize?: number };

/** 分页 / 排序变化事件参数 */
export interface TablePaginationInfo {
  current?: number;
  pageSize?: number;
  total?: number;
  /** 当前排序字段（取消排序为 undefined） */
  field?: string;
  /** 当前排序方向（取消排序为 undefined） */
  order?: SortOrder;
}

/** 行拖拽放下事件参数（同级排序：目标前 / 目标后） */
export interface TableRowDropInfo {
  dragKey: string | number;
  dropKey: string | number;
  position: 'before' | 'after';
}

export interface TableProps {
  columns?: TableColumn[];
  /** 数据行（通常为 `${data.xxx}` 表达式解析结果） */
  dataSource?: Record<string, unknown>[];
  /** 行 key 字段，默认 'id' */
  rowKey?: string;
  loading?: boolean;
  pagination?: TablePagination;
  /** 空态文案（缺省走 i18n「暂无数据」）；空态同时展示图标 */
  emptyText?: string;
  /** 行多选：首列渲染 Checkbox（表头为当前页全选），选中变化经 onSelectChange 传出 */
  rowSelection?: boolean;
  /** 行数据字段名：该字段值为 true 的行禁用选择（如无选择权限的内置行） */
  selectionDisabledField?: string;
  /** 选中行 key 数组（受控；rowSelection 开启时生效，缺省内部管理） */
  selectedRowKeys?: (string | number)[];
  /** 选中变化事件，传出选中行 key 数组（rowSelection 开启时生效） */
  onSelectChange?: (keys: (string | number)[]) => void;
  /** 分页 / 排序变化事件，传出 pagination 信息 */
  onChange?: (pagination: TablePaginationInfo) => void;
  /**
   * 树形数据的子级字段名，默认 'children'：行数据含该字段（非空数组）时
   * 自动展示为树形表格（首列带展开箭头与层级缩进）；设为 false 禁用树形
   */
  childrenColumnName?: string | false;
  /** 树形表格每一层的缩进宽度（px），默认 16 */
  indentSize?: number;
  /** 树形表格初始展开全部行（缺省为全部收起，点击箭头 toggle） */
  defaultExpandAllRows?: boolean;
  /** 行拖拽排序：首列渲染拖拽手柄（仅手柄可拖），同级内排序；变化经 onRowDrop 传出 */
  rowDraggable?: boolean;
  /** 行拖拽放下事件，传出 { dragKey, dropKey, position } */
  onRowDrop?: (info: TableRowDropInfo) => void;
  /** 表体最大高度（px）：超过后表体纵向滚动、表头固定（sticky），便于一页展示大量数据 */
  scrollY?: number;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

function renderCellValue(value: unknown): string {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

/** 列水平对齐 → text-align 类（left 为表格默认，无需加类） */
const columnAlignClass = {
  left: undefined,
  center: 'text-center',
  right: 'text-right',
} as const;

/** 列固定（sticky）类：底色覆盖横向滚动经过的内容；默认无分隔线 */
const columnFixedClass = {
  left: 'sticky left-0 z-10 bg-card transition-shadow',
  right: 'sticky right-0 z-10 bg-card transition-shadow',
} as const;

/** 横向滚动后 fixed 列的阴影（inset 投在列内侧边缘，色值走 --shadow-color 令牌；回滚到边缘后消失） */
const columnFixedShadowClass = {
  left: 'shadow-[inset_-10px_0_8px_-8px_var(--shadow-color)]',
  right: 'shadow-[inset_10px_0_8px_-8px_var(--shadow-color)]',
} as const;

/** 行拖拽落点指示线（投在行内所有单元格的上 / 下边缘） */
const rowDropIndicatorClass = {
  before: 'shadow-[inset_0_2px_0_0_var(--color-primary)]',
  after: 'shadow-[inset_0_-2px_0_0_var(--color-primary)]',
} as const;

/** 表头/单元格共有列类（对齐 + 固定 + 滚动阴影 + 排序浅底色） */
function columnClass(
  column: TableColumn,
  scrolledX: boolean,
  sorted: boolean,
): string | undefined {
  return cn(
    column.align ? columnAlignClass[column.align] : undefined,
    column.fixed ? columnFixedClass[column.fixed] : undefined,
    // fixed 右侧列：滚动条离开最左（右侧有内容被遮）时投左阴影
    column.fixed === 'right' && scrolledX ? columnFixedShadowClass.right : undefined,
    // 当前排序列：浅底色区分（表头与单元格同效）
    sorted ? 'bg-muted/50' : undefined,
  );
}

/** 列宽样式：width + minWidth 同设，避免 table auto 布局把 width 压缩为建议值 */
function columnWidthStyle(column: TableColumn): CSSProperties | undefined {
  return column.width !== undefined
    ? { width: column.width, minWidth: column.width }
    : undefined;
}

/**
 * Table 适配器（shadcn kit，语义对齐 antd 版）：vendored shadcn Table 原语
 * 实现 columns / dataSource / rowKey（默认 'id'）/ loading / 简化分页
 * （pageSize）/ 空态；`cell` 行模板经 renderChildren 注入
 * `{ row, rowIndex }`（rowIndex 为当前页内序号）。
 *
 * 增强能力：
 * - 树形数据：行数据含 childrenColumnName（默认 children）字段时自动树形，
 *   首列展开箭头 + indentSize 层级缩进，排序按层递归、分页按顶层行计；
 * - 行拖拽排序（rowDraggable）：手柄拖拽，同级内 before/after 落点，
 *   内部维护行副本即时更新，onRowDrop 传出；
 * - 固定表头（scrollY）：表体超高纵向滚动，表头 sticky 固定。
 */
export function Table({
  columns = [],
  dataSource = [],
  rowKey = 'id',
  loading,
  pagination,
  emptyText,
  rowSelection,
  selectionDisabledField,
  selectedRowKeys,
  onSelectChange,
  onChange,
  childrenColumnName = 'children',
  indentSize = 16,
  defaultExpandAllRows,
  rowDraggable,
  onRowDrop,
  scrollY,
  className,
  style,
}: TableProps) {
  const { renderChildren } = useRenderer();
  const { t } = useI18n();
  const [current, setCurrent] = useState(1);

  const childrenField = childrenColumnName;
  const treeOptions = useMemo(
    () => ({ rowKey, childrenField }),
    [rowKey, childrenField],
  );

  // 行拖拽：内部维护行副本即时反映排序；dataSource 变化（JSON 签名）时回同步
  const signature = JSON.stringify(dataSource);
  const [innerRows, setInnerRows] = useState(dataSource);
  const signatureRef = useRef(signature);
  if (signatureRef.current !== signature) {
    signatureRef.current = signature;
    setInnerRows(dataSource);
  }
  const rowsSource = rowDraggable ? innerRows : dataSource;

  // 树形展开：内部管理展开行 key 集合（默认收起，点击箭头 toggle；
  // defaultExpandAllRows 时初始展开所有含子级的行）
  const [expandedKeys, setExpandedKeys] = useState<ReadonlySet<string | number>>(
    () =>
      defaultExpandAllRows
        ? new Set(collectParentKeys(dataSource, { rowKey, childrenField }))
        : new Set(),
  );
  const toggleExpand = (key: string | number) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };
  /** 数据中是否存在任意子级（决定首列是否渲染缩进/展开区） */
  const hasTreeData = useMemo(() => {
    const walk = (rows: Record<string, unknown>[]): boolean =>
      rows.some(
        (row) =>
          childrenOf(row, childrenField) !== undefined ||
          walk(childrenOf(row, childrenField) ?? []),
      );
    return childrenField !== false && walk(rowsSource);
  }, [rowsSource, childrenField]);

  // 行多选：受控（selectedRowKeys）优先，否则内部管理；变化统一经 emitSelect 传出
  const [innerKeys, setInnerKeys] = useState<(string | number)[]>([]);
  const selectedKeys = selectedRowKeys ?? innerKeys;
  const emitSelect = (next: (string | number)[]) => {
    if (selectedRowKeys === undefined) setInnerKeys(next);
    onSelectChange?.(next);
  };
  /** 行是否禁用选择（selectionDisabledField 指定的行数据字段为 true） */
  const isRowSelectionDisabled = (row: Record<string, unknown>): boolean =>
    selectionDisabledField !== undefined && row[selectionDisabledField] === true;
  const toggleRow = (flat: FlatRow) => {
    if (isRowSelectionDisabled(flat.row)) return;
    emitSelect(
      selectedKeys.includes(flat.key)
        ? selectedKeys.filter((k) => k !== flat.key)
        : [...selectedKeys, flat.key],
    );
  };
  const togglePageAll = () => {
    emitSelect(
      pageAllSelected
        ? selectedKeys.filter((k) => !selectablePageKeys.includes(k))
        : [
            ...selectedKeys,
            ...selectablePageKeys.filter((k) => !selectedKeys.includes(k)),
          ],
    );
  };

  // 单例排序：{ dataIndex, order } | null；初始取声明 defaultSortOrder 的列
  const [sort, setSort] = useState<{ dataIndex: string; order: SortOrder } | null>(
    () => {
      const col = columns.find((c) => c.sorter && c.defaultSortOrder && c.dataIndex);
      return col ? { dataIndex: col.dataIndex!, order: col.defaultSortOrder! } : null;
    },
  );

  const emitChange = (info: TablePaginationInfo) => {
    onChange?.({
      ...info,
      field: sort?.dataIndex,
      order: sort?.order,
    });
  };

  /** 三态循环：asc → desc → 取消；切换列时从 asc 开始；排序变更回第 1 页 */
  const toggleSort = (column: TableColumn) => {
    if (!column.sorter || !column.dataIndex) return;
    const dataIndex = column.dataIndex;
    const next =
      sort?.dataIndex !== dataIndex
        ? { dataIndex, order: 'ascend' as SortOrder }
        : sort.order === 'ascend'
          ? { dataIndex, order: 'descend' as SortOrder }
          : null;
    setSort(next);
    setCurrent(1);
    onChange?.({
      current: 1,
      pageSize,
      total,
      field: next?.dataIndex,
      order: next?.order,
    });
  };

  // 排序作用于全量数据（分页切片之前）：数字按数值、其余按字符串本地化比较；
  // 树形数据按层递归排序（层级结构不变）
  const sortedRows = useMemo(() => {
    if (!sort) return rowsSource;
    return sortTreeRows(rowsSource, sort.dataIndex, sort.order, childrenField);
  }, [rowsSource, sort, childrenField]);

  // fixed 列滚动阴影：监听 vendored Table 的横向滚动容器，
  // 滚动条离开最左（scrollLeft > 0）时 fixed 右列投左阴影，回滚到最左消失
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [scrolledX, setScrolledX] = useState(false);
  useEffect(() => {
    const scrollRoot = rootRef.current?.querySelector<HTMLElement>(
      '[data-slot=table-container]',
    );
    if (!scrollRoot) return undefined;
    const update = () => setScrolledX(scrollRoot.scrollLeft > 0);
    update();
    scrollRoot.addEventListener('scroll', update, { passive: true });
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(scrollRoot);
    return () => {
      scrollRoot.removeEventListener('scroll', update);
      ro?.disconnect();
    };
  }, []);

  const pageSize = pagination === false ? undefined : pagination?.pageSize;
  // 分页按顶层行计数 / 切片（树形子级随顶层行整体进出页）
  const total = rowsSource.length;
  const pageCount =
    pageSize !== undefined && pageSize > 0
      ? Math.max(1, Math.ceil(total / pageSize))
      : 1;
  const pagedRows =
    pageSize !== undefined && pageSize > 0
      ? sortedRows.slice((current - 1) * pageSize, current * pageSize)
      : sortedRows;

  // 拍平为渲染行：仅展开的行带出子级；level/parentKey 供缩进与拖拽判定
  const flatRows = useMemo(
    () => flattenRows(pagedRows, expandedKeys, treeOptions),
    [pagedRows, expandedKeys, treeOptions],
  );
  const flatByKey = useMemo(() => {
    const map = new Map<string | number, FlatRow>();
    flatRows.forEach((flat) => map.set(flat.key, flat));
    return map;
  }, [flatRows]);

  // 行拖拽：手柄 dragstart 记录 dragKey；dragover 判定同父级后给出落点指示
  const [dragKey, setDragKey] = useState<string | number | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    key: string | number;
    position: 'before' | 'after';
  } | null>(null);
  const resetDrag = () => {
    setDragKey(null);
    setDropIndicator(null);
  };
  const handleDragStart = (
    flat: FlatRow,
    event: DragEvent<HTMLButtonElement>,
  ) => {
    event.dataTransfer.setData('text/plain', String(flat.key));
    event.dataTransfer.effectAllowed = 'move';
    setDragKey(flat.key);
  };
  const handleRowDragOver = (
    flat: FlatRow,
    event: DragEvent<HTMLTableRowElement>,
  ) => {
    if (dragKey === null || dragKey === flat.key) return;
    // 仅允许同父级内排序（平铺数据 parentKey 均为 null，天然同级）
    const dragFlat = flatByKey.get(dragKey);
    if (!dragFlat || dragFlat.parentKey !== flat.parentKey) {
      if (dropIndicator !== null) setDropIndicator(null);
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    const rect = event.currentTarget.getBoundingClientRect();
    const position =
      event.clientY < rect.top + rect.height / 2 ? ('before' as const) : ('after' as const);
    setDropIndicator((prev) =>
      prev && prev.key === flat.key && prev.position === position
        ? prev
        : { key: flat.key, position },
    );
  };
  const handleRowDrop = (
    flat: FlatRow,
    event: DragEvent<HTMLTableRowElement>,
  ) => {
    event.preventDefault();
    if (dragKey !== null && dropIndicator && dropIndicator.key === flat.key) {
      const next = moveRow(
        rowsSource,
        dragKey,
        flat.key,
        dropIndicator.position,
        treeOptions,
      );
      if (next) {
        setInnerRows(next);
        onRowDrop?.({
          dragKey,
          dropKey: flat.key,
          position: dropIndicator.position,
        });
      }
    }
    resetDrag();
  };
  const dropIndicatorClass = (key: string | number): string | undefined =>
    dropIndicator && dropIndicator.key === key
      ? rowDropIndicatorClass[dropIndicator.position]
      : undefined;

  // 全选/半选仅统计可选行（禁用行不参与）
  const selectablePageKeys = flatRows
    .filter((flat) => !isRowSelectionDisabled(flat.row))
    .map((flat) => flat.key);
  const pageSelectedCount = selectablePageKeys.filter((k) =>
    selectedKeys.includes(k),
  ).length;
  const pageAllSelected =
    selectablePageKeys.length > 0 && pageSelectedCount === selectablePageKeys.length;
  const pageIndeterminate = pageSelectedCount > 0 && !pageAllSelected;

  const goToPage = (page: number) => {
    setCurrent(page);
    emitChange({ current: page, pageSize, total });
  };

  // 固定表头：scrollY 为表体最大高度，超高后表体滚动、表头 sticky
  const stickyHeader = scrollY !== undefined && scrollY > 0;
  /** 固定表头的表头单元格类：置顶 + 实底色遮盖滚动经过的行；fixed 列需更高层级 */
  const stickyHeadClass = (column: TableColumn | null, sorted: boolean) =>
    stickyHeader
      ? cn(
          'sticky top-0',
          column?.fixed ? 'z-30' : 'z-20',
          sorted ? 'bg-muted' : 'bg-card',
        )
      : undefined;

  const colSpan = Math.max(
    1,
    columns.length + (rowSelection ? 1 : 0) + (rowDraggable ? 1 : 0),
  );

  return (
    <div
      ref={rootRef}
      data-slot="dsl-table"
      className={cn('relative', className)}
      style={style}
    >
      {loading ? (
        <div
          data-slot="table-loading"
          className="absolute inset-0 z-40 flex items-center justify-center bg-card/60"
        >
          <ShadcnSpinner className="size-6 text-muted-foreground" />
        </div>
      ) : null}
      <ShadcnTable
        containerClassName={stickyHeader ? 'overflow-y-auto' : undefined}
        containerStyle={stickyHeader ? { maxHeight: scrollY } : undefined}
      >
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {rowDraggable ? (
              <TableHead
                data-slot="table-drag-head"
                className={stickyHeadClass(null, false)}
                style={{ width: 36, minWidth: 36 }}
              />
            ) : null}
            {rowSelection ? (
              <TableHead
                data-slot="table-selection-head"
                className={stickyHeadClass(null, false)}
                style={{ width: 36, minWidth: 36 }}
              >
                <ShadcnCheckbox
                  aria-label={t('pactor.table.selectAll')}
                  className="inline-flex items-center justify-center"
                  checked={pageAllSelected}
                  indeterminate={pageIndeterminate}
                  onCheckedChange={togglePageAll}
                />
              </TableHead>
            ) : null}
            {columns.map((column, index) => {
              const sortable = column.sorter === true && column.dataIndex !== undefined;
              const isSortedColumn =
                sort !== null &&
                column.dataIndex !== undefined &&
                sort.dataIndex === column.dataIndex;
              const activeOrder = sortable && isSortedColumn ? sort.order : null;
              return (
                <TableHead
                  key={column.dataIndex ?? String(index)}
                  className={cn(
                    columnClass(column, scrolledX, isSortedColumn),
                    stickyHeadClass(column, isSortedColumn),
                  )}
                  style={columnWidthStyle(column)}
                  aria-sort={
                    activeOrder === 'ascend'
                      ? 'ascending'
                      : activeOrder === 'descend'
                        ? 'descending'
                        : undefined
                  }
                >
                  {sortable ? (
                    <button
                      type="button"
                      data-slot="table-sorter"
                      onClick={() => toggleSort(column)}
                      className="inline-flex cursor-pointer items-center gap-1 font-medium"
                    >
                      {column.title}
                      <Icon
                        name={
                          activeOrder === 'ascend'
                            ? 'arrow-up'
                            : activeOrder === 'descend'
                              ? 'arrow-down'
                              : 'chevrons-up-down'
                        }
                        size="sm"
                        className={
                          activeOrder ? 'text-foreground' : 'text-muted-foreground'
                        }
                      />
                    </button>
                  ) : (
                    column.title
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {flatRows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={colSpan}>
                <div
                  data-slot="table-empty"
                  className="flex flex-col items-center gap-2 py-8 text-muted-foreground"
                >
                  <Icon name="inbox" size="lg" />
                  <div className="text-sm">{emptyText ?? t('pactor.table.empty')}</div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            flatRows.map((flat, rowIndex) => (
              <TableRow
                key={String(flat.key)}
                className={cn(dragKey === flat.key ? 'opacity-50' : undefined)}
                onDragOver={
                  rowDraggable ? (event) => handleRowDragOver(flat, event) : undefined
                }
                onDrop={
                  rowDraggable ? (event) => handleRowDrop(flat, event) : undefined
                }
              >
                {rowDraggable ? (
                  <TableCell
                    data-slot="table-drag-cell"
                    className={dropIndicatorClass(flat.key)}
                  >
                    <button
                      type="button"
                      data-slot="table-drag-handle"
                      aria-label={t('pactor.table.dragRow')}
                      draggable
                      onDragStart={(event) => handleDragStart(flat, event)}
                      onDragEnd={resetDrag}
                      className="inline-flex size-4 cursor-move items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="grip-vertical" size="sm" />
                    </button>
                  </TableCell>
                ) : null}
                {rowSelection ? (
                  <TableCell
                    data-slot="table-selection-cell"
                    className={dropIndicatorClass(flat.key)}
                  >
                    <ShadcnCheckbox
                      aria-label={t('pactor.table.selectRow')}
                      className="inline-flex items-center justify-center"
                      checked={selectedKeys.includes(flat.key)}
                      disabled={isRowSelectionDisabled(flat.row)}
                      onCheckedChange={() => toggleRow(flat)}
                    />
                  </TableCell>
                ) : null}
                {columns.map((column, columnIndex) => {
                  const cellContent = column.cell
                    ? renderChildren([column.cell], { row: flat.row, rowIndex })
                    : renderCellValue(
                        column.dataIndex === undefined
                          ? undefined
                          : flat.row[column.dataIndex],
                      );
                  const withTree = hasTreeData && columnIndex === 0;
                  return (
                    <TableCell
                      key={column.dataIndex ?? String(columnIndex)}
                      className={cn(
                        columnClass(
                          column,
                          scrolledX,
                          sort !== null &&
                            column.dataIndex !== undefined &&
                            sort.dataIndex === column.dataIndex,
                        ),
                        dropIndicatorClass(flat.key),
                      )}
                      style={columnWidthStyle(column)}
                    >
                      {withTree ? (
                        <div
                          className="flex items-center gap-1"
                          style={{ paddingLeft: flat.level * indentSize }}
                        >
                          {flat.hasChildren ? (
                            <button
                              type="button"
                              data-slot="table-expand"
                              aria-label={
                                expandedKeys.has(flat.key)
                                  ? t('pactor.table.collapseRow')
                                  : t('pactor.table.expandRow')
                              }
                              aria-expanded={expandedKeys.has(flat.key)}
                              onClick={() => toggleExpand(flat.key)}
                              className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
                            >
                              <Icon
                                name="chevron-right"
                                size="sm"
                                className={cn(
                                  'transition-transform',
                                  expandedKeys.has(flat.key) && 'rotate-90',
                                )}
                              />
                            </button>
                          ) : (
                            <span className="inline-block size-4 shrink-0" />
                          )}
                          <div className="min-w-0">{cellContent}</div>
                        </div>
                      ) : (
                        cellContent
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </ShadcnTable>
      {pageSize !== undefined && pageSize > 0 ? (
        <div data-slot="table-pagination" className="mt-3 flex justify-end gap-1">
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (page) => (
              <ShadcnButton
                key={page}
                type="button"
                size="sm"
                variant={page === current ? 'default' : 'outline'}
                aria-current={page === current ? 'page' : undefined}
                onClick={() => goToPage(page)}
              >
                {page}
              </ShadcnButton>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
