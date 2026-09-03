import type { DslNode } from '@pactor-app/core';
import { useI18n, useRenderer } from '@pactor-app/runtime';
import { useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Button as ShadcnButton } from '../../../ui/button.js';
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../ui/table.js';

/**
 * 列定义；`cell` 为行模板 DSL 子树，每个单元格经 Renderer 子作用域
 * 机制渲染，作用域注入 `row`（当前行记录）与 `rowIndex`（设计决策 D4）。
 */
export interface TableColumn {
  title?: string;
  dataIndex?: string;
  width?: number | string;
  cell?: DslNode;
}

/** DSL 分页配置：false 关闭，`{ pageSize }` 简化映射 */
export type TablePagination = false | { pageSize?: number };

/** 分页变化事件参数 */
export interface TablePaginationInfo {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface TableProps {
  columns?: TableColumn[];
  /** 数据行（通常为 `${data.xxx}` 表达式解析结果） */
  dataSource?: Record<string, unknown>[];
  /** 行 key 字段，默认 'id' */
  rowKey?: string;
  loading?: boolean;
  pagination?: TablePagination;
  /** 分页 / 排序变化事件，传出 pagination 信息 */
  onChange?: (pagination: TablePaginationInfo) => void;
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

/**
 * Table 适配器（shadcn kit，语义对齐 antd 版）：vendored shadcn Table 原语
 * 实现 columns / dataSource / rowKey（默认 'id'）/ loading / 简化分页
 * （pageSize）/ 空态；`cell` 行模板经 renderChildren 注入
 * `{ row, rowIndex }`（rowIndex 为当前页内序号）。
 */
export function Table({
  columns = [],
  dataSource = [],
  rowKey = 'id',
  loading,
  pagination,
  onChange,
  className,
  style,
}: TableProps) {
  const { renderChildren } = useRenderer();
  const { t } = useI18n();
  const [current, setCurrent] = useState(1);

  const pageSize = pagination === false ? undefined : pagination?.pageSize;
  const total = dataSource.length;
  const pageCount =
    pageSize !== undefined && pageSize > 0
      ? Math.max(1, Math.ceil(total / pageSize))
      : 1;
  const pageRows =
    pageSize !== undefined && pageSize > 0
      ? dataSource.slice((current - 1) * pageSize, current * pageSize)
      : dataSource;

  const goToPage = (page: number) => {
    setCurrent(page);
    onChange?.({ current: page, pageSize, total });
  };

  return (
    <div data-slot="dsl-table" className={cn('relative', className)} style={style}>
      {loading ? (
        <div
          data-slot="table-loading"
          className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 text-sm text-muted-foreground"
        >
          {t('pactor.table.loading')}
        </div>
      ) : null}
      <ShadcnTable>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column, index) => (
              <TableHead
                key={column.dataIndex ?? String(index)}
                style={
                  column.width !== undefined ? { width: column.width } : undefined
                }
              >
                {column.title}
              </TableHead>
            ))}
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
                  {columns.map((column, columnIndex) => (
                    <TableCell key={column.dataIndex ?? String(columnIndex)}>
                      {column.cell
                        ? renderChildren([column.cell], { row, rowIndex })
                        : renderCellValue(
                            column.dataIndex === undefined
                              ? undefined
                              : row[column.dataIndex],
                          )}
                    </TableCell>
                  ))}
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
