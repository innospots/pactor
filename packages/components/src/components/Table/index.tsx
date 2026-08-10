import { Table as AntTable } from 'antd';
import type { DslNode } from 'pactor-core';
import { useRenderer } from 'pactor-runtime';

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

/** 分页变化事件参数（antd pagination 信息） */
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
}

/**
 * Table 适配器（设计决策 D4）：列定义与数据绑定 +
 * `cell` 行模板（renderChildren 注入 `{ row, rowIndex }`）。
 */
export function Table({
  columns = [],
  dataSource,
  rowKey = 'id',
  loading,
  pagination,
  onChange,
}: TableProps) {
  const { renderChildren } = useRenderer();

  const antdColumns = columns.map((column, index) => ({
    key: column.dataIndex ?? String(index),
    title: column.title,
    dataIndex: column.dataIndex,
    width: column.width,
    render: column.cell
      ? (_value: unknown, row: Record<string, unknown>, rowIndex: number) =>
          renderChildren([column.cell as DslNode], { row, rowIndex })
      : undefined,
  }));

  return (
    <AntTable
      columns={antdColumns}
      dataSource={dataSource}
      rowKey={rowKey}
      loading={loading}
      pagination={
        pagination === false
          ? false
          : pagination
            ? { pageSize: pagination.pageSize }
            : undefined
      }
      onChange={(next) =>
        onChange?.({
          current: next.current,
          pageSize: next.pageSize,
          total: next.total,
        })
      }
    />
  );
}
