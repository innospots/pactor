import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { buttonVariants } from '../../../ui/button.js';
import {
  DropdownMenu as DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu.js';
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '../../../ui/pagination.js';
import { renderDropdownItems } from '../DropdownMenu/index.js';

export interface PaginationProps {
  /** 总条数（可绑表达式解析后的数字） */
  total?: number;
  /** 每页条数，缺省 10 */
  pageSize?: number;
  /** 受控当前页（可绑 `${state.x}`）；缺省内部自管理 */
  page?: number;
  /** 翻页事件，传出目标页码（number） */
  onChange?: (page: number) => void;
  /** 对齐方式：left / center / right（缺省 center） */
  align?: 'left' | 'center' | 'right';
  /** 展示总条数文案「共 n 条」（缺省 false） */
  showTotal?: boolean;
  /** 每页条数可选项（如 [10, 20, 50]）；给出时展示「每页 n 条」切换下拉 */
  pageSizeOptions?: number[];
  /** 每页条数变更事件，传出新的 pageSize（页码同时回到 1 并触发 onChange） */
  onPageSizeChange?: (pageSize: number) => void;
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
 * 与页码点击均走同一 onChange。可选扩展：align 对齐、showTotal
 * 「共 n 条」、pageSizeOptions「每页 n 条」切换（onPageSizeChange 传出）。
 */
export function Pagination({
  total = 0,
  pageSize = 10,
  page,
  onChange,
  align = 'center',
  showTotal = false,
  pageSizeOptions,
  onPageSizeChange,
  className,
  style,
}: PaginationProps) {
  const [innerPage, setInnerPage] = useState(1);
  const [innerPageSize, setInnerPageSize] = useState<number | null>(null);
  const effectivePageSize = innerPageSize ?? pageSize;
  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, effectivePageSize)));
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

  const changePageSize = (next: number) => {
    if (next === effectivePageSize) {
      return;
    }
    setInnerPageSize(next);
    if (page === undefined) {
      setInnerPage(1);
    }
    onPageSizeChange?.(next);
    onChange?.(1);
  };

  const sizes = (pageSizeOptions ?? []).map(Number).filter((n) => Number.isFinite(n) && n > 0);

  return (
    <ShadcnPagination
      className={cn(
        align === 'left' && 'justify-start',
        align === 'right' && 'justify-end',
        className,
      )}
      style={style}
    >
      <PaginationContent>
        {showTotal && (
          <PaginationItem>
            <span
              data-slot="pagination-total"
              className="px-2 text-sm whitespace-nowrap text-muted-foreground"
            >
              共 {total} 条
            </span>
          </PaginationItem>
        )}
        {sizes.length > 0 && (
          <PaginationItem>
            <DropdownMenuRoot>
              <DropdownMenuTrigger
                data-slot="pagination-page-size"
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'gap-1 px-2.5 whitespace-nowrap cursor-pointer outline-hidden',
                )}
              >
                每页 {effectivePageSize} 条
                <ChevronDownIcon className="size-3.5" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {renderDropdownItems(
                  sizes.map((s) => ({
                    label: `${s} 条/页`,
                    value: String(s),
                    selected: s === effectivePageSize,
                  })),
                  (v) => changePageSize(Number(v)),
                )}
              </DropdownMenuContent>
            </DropdownMenuRoot>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label="上一页"
            disabled={current <= 1}
            className="gap-1 px-2.5 sm:pl-2.5"
            onClick={(e) => {
              e.preventDefault();
              goTo(current - 1);
            }}
          >
            <ChevronLeftIcon />
            <span className="hidden sm:block">上一页</span>
          </PaginationLink>
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
          <PaginationLink
            href="#"
            aria-label="下一页"
            disabled={current >= pageCount}
            className="gap-1 px-2.5 sm:pr-2.5"
            onClick={(e) => {
              e.preventDefault();
              goTo(current + 1);
            }}
          >
            <span className="hidden sm:block">下一页</span>
            <ChevronRightIcon />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
}
