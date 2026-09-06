import { useState, type CSSProperties } from 'react';

import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../../ui/pagination.js';

export interface PaginationProps {
  /** 总条数（可绑表达式解析后的数字） */
  total?: number;
  /** 每页条数，缺省 10 */
  pageSize?: number;
  /** 受控当前页（可绑 `${state.x}`）；缺省内部自管理 */
  page?: number;
  /** 翻页事件，传出目标页码（number） */
  onChange?: (page: number) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** 页码序列（含省略标记）：总数 ≤7 全显；否则按当前页位置取 7 项窗口 */
function pageItems(current: number, count: number): (number | 'ellipsis')[] {
  if (count <= 7) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', count];
  }
  if (current >= count - 3) {
    return [1, 'ellipsis', count - 4, count - 3, count - 2, count - 1, count];
  }
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', count];
}

/**
 * Pagination 适配器（shadcn kit）：total/pageSize 推页数；page 受控
 * （缺省内部自管理）；onChange 传出目标页码 number。上一页/下一页
 * 与页码点击均走同一 onChange。
 */
export function Pagination({
  total = 0,
  pageSize = 10,
  page,
  onChange,
  className,
  style,
}: PaginationProps) {
  const [innerPage, setInnerPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const current = Math.min(Math.max(1, page ?? innerPage), pageCount);

  const goTo = (next: number) => {
    const target = Math.min(Math.max(1, next), pageCount);
    if (target === current) {
      return;
    }
    if (page === undefined) {
      setInnerPage(target);
    }
    onChange?.(target);
  };

  return (
    <ShadcnPagination className={className} style={style}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            disabled={current <= 1}
            onClick={(e) => {
              e.preventDefault();
              goTo(current - 1);
            }}
          />
        </PaginationItem>
        {pageItems(current, pageCount).map((item, index) => (
          <PaginationItem key={item === 'ellipsis' ? `ellipsis-${index}` : item}>
            {item === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={item === current}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(item);
                }}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            disabled={current >= pageCount}
            onClick={(e) => {
              e.preventDefault();
              goTo(current + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
}
