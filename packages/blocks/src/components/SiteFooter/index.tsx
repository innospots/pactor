import type { CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import { Link } from '@pactor-app/ui/components';

/** 页脚链接：有 href 渲染 Link（SPA 语义），无 href 渲染 button 并触发 onLinkClick */
export interface SiteFooterLink {
  /** 链接文案 */
  text: string;
  /** 链接地址；配置后渲染为 <a>（站内 SPA 跳转 / 站外新窗口由 Link 语义处理） */
  href?: string;
}

/** 链接列组：标题 + 组内链接列表 */
export interface SiteFooterLinkGroup {
  /** 组标题（如「产品」「资源」） */
  title: string;
  /** 组内链接 */
  links: SiteFooterLink[];
}

/** 品牌区配置（左列：logo / 名称 / 描述） */
export interface SiteFooterBrand {
  /** Logo 图片地址 */
  logo?: string;
  /** 品牌名称 */
  name?: string;
  /** 品牌描述 / 副文案 */
  description?: string;
}

export interface SiteFooterProps {
  /** 品牌区配置；未配置不渲染品牌列 */
  brand?: SiteFooterBrand;
  /** 链接列组；未配置不渲染链接区 */
  groups?: SiteFooterLinkGroup[];
  /** 底部栏版权文案（如「© 2026 Pactor」） */
  copyright?: string;
  /** 底部栏辅助链接（备案号 / 隐私协议 / 服务条款等） */
  bottomLinks?: SiteFooterLink[];
  /** 链接点击（仅无 href 的链接），回传 { key, text }（key 缺省取 text，对齐 EntityCardAction 约定） */
  onLinkClick?: (event: { key: string; text: string }) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * SiteFooter 站点页脚（business 级组合组件）：
 * 上层左侧品牌区（logo / 名称 / 描述）+ 右侧链接列组（标题 + 链接），
 * 底部版权栏（copyright 左、辅助链接右，border 分隔）；
 * 与 Layout 子区域 Footer 区分（后者为页面骨架槽位，本组件为独立站点页脚资产）。
 * 布局响应式：窄屏上下堆叠（主区 flex-col、底部栏居中堆叠），宽屏左右分栏。
 */
export function SiteFooter({
  brand,
  groups,
  copyright,
  bottomLinks,
  onLinkClick,
  className,
  style,
}: SiteFooterProps) {
  const renderLink = (link: SiteFooterLink) => {
    if (link.href) {
      return (
        <Link
          href={link.href}
          text={link.text}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        />
      );
    }
    return (
      <button
        type="button"
        data-slot="site-footer-link"
        className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => onLinkClick?.({ key: link.text, text: link.text })}
      >
        {link.text}
      </button>
    );
  };

  const hasBrand = Boolean(brand && (brand.logo || brand.name || brand.description));
  const hasGroups = Boolean(groups && groups.length > 0);
  const hasBottom = Boolean(copyright || (bottomLinks && bottomLinks.length > 0));
  if (!hasBrand && !hasGroups && !hasBottom) {
    return null;
  }

  return (
    <footer
      data-slot="site-footer"
      className={cn('border-t bg-muted/40', className)}
      style={style}
    >
      {hasBrand || hasGroups ? (
        <div
          data-slot="site-footer-main"
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:justify-between"
        >
          {hasBrand ? (
            <div data-slot="site-footer-brand" className="flex max-w-xs flex-col gap-3">
              {brand!.logo || brand!.name ? (
                <div className="flex items-center gap-2">
                  {brand!.logo ? (
                    <img
                      src={brand!.logo}
                      alt={brand!.name ?? ''}
                      className="size-8 rounded-md object-contain"
                    />
                  ) : null}
                  {brand!.name ? (
                    <span className="text-base font-semibold">{brand!.name}</span>
                  ) : null}
                </div>
              ) : null}
              {brand!.description ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {brand!.description}
                </p>
              ) : null}
            </div>
          ) : null}
          {hasGroups ? (
            <div
              data-slot="site-footer-groups"
              className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 md:justify-items-end"
            >
              {groups!.map((group) => (
                <div
                  key={group.title}
                  data-slot="site-footer-group"
                  className="flex min-w-24 flex-col gap-3"
                >
                  <span className="text-sm font-medium">{group.title}</span>
                  <div className="flex flex-col gap-2">
                    {group.links.map((link) => (
                      <div key={link.text}>{renderLink(link)}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      {hasBottom ? (
        <div data-slot="site-footer-bottom" className="border-t">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-6 py-4 text-xs text-muted-foreground sm:flex-row sm:justify-between">
            {copyright ? <span>{copyright}</span> : <span />}
            {bottomLinks && bottomLinks.length > 0 ? (
              <div data-slot="site-footer-bottom-links" className="flex items-center gap-4">
                {bottomLinks.map((link) => (
                  <div key={link.text}>{renderLink(link)}</div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </footer>
  );
}
