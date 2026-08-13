import type { TableProps } from 'pactor-ui-antd/components';
import { useI18n, useRenderer } from 'pactor-runtime';
import { useState } from 'react';

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
 * Table 适配器（Radix kit，语义对齐 antd 版）：原生 table 实现
 * columns / dataSource / rowKey（默认 'id'）/ loading / 简化分页（pageSize）/ 空态；
 * `cell` 行模板经 renderChildren 注入 `{ row, rowIndex }`（rowIndex 为当前页内序号）。
 */
export function Table({
  columns = [],
  dataSource = [],
  rowKey = 'id',
  loading,
  pagination,
  onChange,
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
    <div className="pcr-table">
      {loading ? (
        <div className="pcr-table-loading">{t('pactor.table.loading')}</div>
      ) : null}
      <table className="pcr-table-table">
        <thead>
          <tr className="pcr-table-head-row">
            {columns.map((column, index) => (
              <th
                key={column.dataIndex ?? String(index)}
                className="pcr-table-cell pcr-table-head-cell"
                style={column.width !== undefined ? { width: column.width } : undefined}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="pcr-table-body">
          {pageRows.length === 0 ? (
            <tr className="pcr-table-empty-row">
              <td colSpan={Math.max(1, columns.length)}>
                <div className="pcr-table-empty">{t('pactor.table.empty')}</div>
              </td>
            </tr>
          ) : (
            pageRows.map((row, rowIndex) => {
              const key = row[rowKey];
              return (
                <tr
                  key={key === undefined || key === null ? rowIndex : String(key)}
                  className="pcr-table-row"
                >
                  {columns.map((column, columnIndex) => (
                    <td
                      key={column.dataIndex ?? String(columnIndex)}
                      className="pcr-table-cell"
                    >
                      {column.cell
                        ? renderChildren([column.cell], { row, rowIndex })
                        : renderCellValue(
                            column.dataIndex === undefined
                              ? undefined
                              : row[column.dataIndex],
                          )}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {pageSize !== undefined && pageSize > 0 ? (
        <div className="pcr-table-pagination">
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                className={
                  page === current
                    ? 'pcr-table-page pcr-table-page-active'
                    : 'pcr-table-page'
                }
                aria-current={page === current ? 'page' : undefined}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
