import { Fragment, type CSSProperties } from 'react';

import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../ui/breadcrumb.js';

/** 面包屑项；href 缺省时渲染为纯文本 */
export interface BreadcrumbItemData {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  /** 路径项（可含表达式解析后的数组）；末项始终为当前页纯文本 */
  items?: BreadcrumbItemData[];
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Breadcrumb 适配器（shadcn kit）：items 声明路径，带 href 的非末项
 * 渲染为可点击链接，末项渲染为当前页纯文本（aria-current="page"）。
 */
export function Breadcrumb({ items = [], className, style }: BreadcrumbProps) {
  return (
    <ShadcnBreadcrumb className={className} style={style}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
}
