import type { DslNode } from '@pactor-app/core';
import { useI18n, useRenderer } from '@pactor-app/runtime';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useMemo, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Button as ShadcnButton } from '../../../ui/button.js';
import { Input as ShadcnInput } from '../../../ui/input.js';
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../ui/table.js';

/**
 * 列定义；`children`（别名 `renderChildren`）为单元格自定义渲染 DSL 子树，
 * 经 Renderer 子作用域渲染，作用域注入 `row`（当前行记录）与 `rowIndex`
 * （当前页内序号），语义与 Table 的 `cell` 一致。
 */
export interface DataTableColumn {
  key: string;
  title?: string;
  /** 可排序：点击表头切换升/降序（客户端排序 + onSort 回调） */
  sortable?: boolean;
  /** 可筛选：表头提供筛选输入（客户端包含匹配） */
  filterable?: boolean;
  children?: DslNode[];
  /** 契约兼容别名：同 children */
  renderChildren?: DslNode[];
}

/** 排序方向 */
export type DataTableSortOrder = 'asc' | 'desc';

/** 排序状态（onSort 事件参数同形） */
export interface DataTableSort {
  key: string;
  order: DataTableSortOrder;
}

/** DSL 分页配置：false 关闭，`{ pageSize }` 简化映射 */
export type DataTablePagination = false | { pageSize?: number };

export interface DataTableProps {
  columns?: DataTableColumn[];
  /** 数据行（通常为 `${data.xxx}` 表达式解析结果） */
  rows?: Record<string, unknown>[];
  /** 行 key 字段，默认 'id' */
  rowKey?: string;
  pagination?: DataTablePagination;
  /** 受控初始排序（后续点击表头内部维护） */
  sort?: DataTableSort;
  /** 排序变化事件，传出 `{ key, order }` */
  onSort?: (sort: DataTableSort) => void;
  /** 分页变化事件，传出页码 number */
  onPageChange?: (page: number) => void;
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

function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  return String(a ?? '').localeCompare(String(b ?? ''));
}

/**
 * DataTable 适配器（shadcn kit）：在既有 Table 语义之上的一体化数据表——
 * sortable 列表头点击切换升/降序（客户端排序 + onSort 传 `{ key, order }`）、
 * filterable 列提供表头筛选输入（客户端包含匹配）、分页复用 Table 分页行为
 * （onPageChange 传页码）；cell 自定义渲染沿用 row/rowIndex 作用域语义。
 */
export function DataTable({
  columns = [],
  rows = [],
  rowKey = 'id',
  pagination,
  sort,
  onSort,
  onPageChange,
  className,
  style,
}: DataTableProps) {
  const { renderChildren } = useRenderer();
  const { t } = useI18n();
  const [sortState, setSortState] = useState<DataTableSort | undefined>(sort);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(1);

  const viewRows = useMemo(() => {
    const activeFilters = Object.entries(filters).filter(
      ([, keyword]) => keyword !== '',
    );
    const filtered =
      activeFilters.length === 0
        ? rows
        : rows.filter((row) =>
            activeFilters.every(([key, keyword]) =>
              renderCellValue(row[key])
                .toLowerCase()
                .includes(keyword.toLowerCase()),
            ),
          );
    if (!sortState) {
      return filtered;
    }
    const { key, order } = sortState;
    const factor = order === 'asc' ? 1 : -1;
    return filtered
      .map((row, index) => ({ row, index }))
      .sort(
        (a, b) =>
          factor * compareValues(a.row[key], b.row[key]) || a.index - b.index,
      )
      .map((entry) => entry.row);
  }, [rows, filters, sortState]);

  const pageSize = pagination === false ? undefined : pagination?.pageSize;
  const total = viewRows.length;
  const pageCount =
    pageSize !== undefined && pageSize > 0
      ? Math.max(1, Math.ceil(total / pageSize))
      : 1;
  const pageRows =
    pageSize !== undefined && pageSize > 0
      ? viewRows.slice((current - 1) * pageSize, current * pageSize)
      : viewRows;

  const toggleSort = (column: DataTableColumn) => {
    const order: DataTableSortOrder =
      sortState?.key === column.key && sortState.order === 'asc'
        ? 'desc'
        : 'asc';
    const next: DataTableSort = { key: column.key, order };
    setSortState(next);
    setCurrent(1);
    onSort?.(next);
  };

  const changeFilter = (key: string, keyword: string) => {
    setFilters((previous) => ({ ...previous, [key]: keyword }));
    setCurrent(1);
  };

  const goToPage = (page: number) => {
    setCurrent(page);
    onPageChange?.(page);
  };

  return (
    <div data-slot="data-table" className={cn('relative', className)} style={style}>
      <ShadcnTable>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column, index) => {
              const sorted = sortState?.key === column.key;
              return (
                <TableHead key={column.key ?? String(index)}>
                  <div className="flex flex-col gap-1">
                    {column.sortable ? (
                      <button
                        type="button"
                        data-slot="data-table-sort"
                        data-column={column.key}
                        aria-label={column.title ?? column.key}
                        className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                        onClick={() => toggleSort(column)}
                      >
                        {column.title}
                        {sorted ? (
                          sortState.order === 'asc' ? (
                            <ArrowUp aria-hidden className="size-3.5" />
                          ) : (
                            <ArrowDown aria-hidden className="size-3.5" />
                          )
                        ) : (
                          <ArrowUpDown
                            aria-hidden
                            className="size-3.5 text-muted-foreground"
                          />
                        )}
                      </button>
                    ) : (
                      <span>{column.title}</span>
                    )}
                    {column.filterable ? (
                      <ShadcnInput
                        data-slot="data-table-filter"
                        data-column={column.key}
                        aria-label={column.title ?? column.key}
                        value={filters[column.key] ?? ''}
                        className="h-7 text-xs"
                        onChange={(event) =>
                          changeFilter(column.key, event.target.value)
                        }
                      />
                    ) : null}
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={Math.max(1, columns.length)}>
                <div
                  data-slot="table-empty"
                  className="py-8 text-center text-muted-foreground"
                >
                  {t('pactor.table.empty')}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            pageRows.map((row, rowIndex) => {
              const key = row[rowKey];
              return (
                <TableRow
                  key={key === undefined || key === null ? rowIndex : String(key)}
                >
                  {columns.map((column, columnIndex) => {
                    const template = column.children ?? column.renderChildren;
                    return (
                      <TableCell key={column.key ?? String(columnIndex)}>
                        {template
                          ? renderChildren(template, { row, rowIndex })
                          : renderCellValue(row[column.key])}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
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
