import { ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui Breadcrumb（vendored 源码，纯语义元素，无原语依赖）。
 * 官方源码：https://ui.shadcn.com/r/styles/base-nova/breadcrumb.json
 * 末项以 BreadcrumbPage（aria-current="page"）渲染为纯文本。
 */
function Breadcrumb({ ...props }: React.ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        'flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5',
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  className,
  render,
  ...props
}: React.ComponentProps<'a'> & {
  /**
   * 以宿主元素替换默认 `<a>`（Base UI render 习惯用法，等价 Radix asChild）——
   * 如 Next.js `<Link>` / react-router `<Link>`；class 合并、其余 props 透传。
   */
  render?: React.ReactElement;
}) {
  const linkClassName = cn('transition-colors hover:text-foreground', className);
  if (render) {
    return React.cloneElement(render, {
      'data-slot': 'breadcrumb-link',
      ...props,
      className: cn(
        linkClassName,
        (render.props as { className?: string }).className,
      ),
    } as Partial<React.ComponentProps<'a'>>);
  }
  return (
    <a
      data-slot="breadcrumb-link"
      className={linkClassName}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('font-normal text-foreground', className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
