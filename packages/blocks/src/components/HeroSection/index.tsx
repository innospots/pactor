import type { CSSProperties, ReactNode } from 'react';

import { Link } from '@pactor-app/ui/components';

import { cn } from '../../lib/utils.js';
import { HeroAction } from './action.js';
import { HeroMediaSlot } from './media-slot.js';
import { HeroMesh } from './mesh.js';

/** Hero 布局变体（对齐 Arc HeroSection 三种形态）：
 *  centered — 文案居中 + 媒体从下方展开（缺省）；split — 左文案右媒体两栏；
 *  minimal — 纯大字标题 + 底部客户标记行，无媒体区 */
export type HeroSectionVariant = 'centered' | 'split' | 'minimal';

/** 公告条（标题上方的 badge 式入口，如「v2.0 已发布 →」） */
export interface HeroSectionAnnouncement {
  /** 公告文案 */
  text: string;
  /** 链接地址；有则渲染 Link，无则纯展示 */
  href?: string;
}

/** CTA 动作：href 渲染按钮样式 Link；无 href 渲染 Button 并触发 onActionClick */
export interface HeroSectionAction {
  /** 按钮文案 */
  label: string;
  /** 视觉层级：primary 主按钮 / default 次级按钮（描边样式）；缺省首个 primary、其余 default */
  variant?: 'primary' | 'default';
  /** 链接地址（SPA 站内 / 站外由 Link 语义处理） */
  href?: string;
  /** 点击后短暂替换按钮文案（如「已复制」→ 恢复 label；仅无 href 的动作按钮生效） */
  doneLabel?: string;
}

/** 客户 / 集成方标记（名称 + 可选 logo） */
export interface HeroSectionLogo {
  /** 标记名称 */
  name: string;
  /** Logo 图片地址 */
  logo?: string;
}

export interface HeroSectionProps {
  /** 布局变体，缺省 centered */
  variant?: HeroSectionVariant;
  /** 公告条（badge 式链接 / 文案） */
  announcement?: HeroSectionAnnouncement;
  /** 主标题（渲染为 h1） */
  title?: string;
  /** 副标题 / 描述 */
  description?: string;
  /** CTA 动作区（主 / 次按钮；无 href 的经 onActionClick 回传） */
  actions?: HeroSectionAction[];
  /** 信心行（如「免费 14 天 · 约 4 分钟接入」），渲染在动作区下方弱化文案 */
  meta?: string;
  /** 媒体区（DSL 子树或 ReactNode）：centered 在文案下方，split 在右侧栏 */
  media?: ReactNode;
  /** 客户标记行（minimal 变体展示在底部，其余变体可选用） */
  logos?: HeroSectionLogo[];
  /** 动作点击（CTA 无 href 时），回传 { key, label } */
  onActionClick?: (event: { key: string; label: string }) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * HeroSection 落地页 Hero 区块（参考 Arc UI hero-section 的三形态结构）：
 * 公告条（可选）+ 大字标题 + 副标题 + 双 CTA + 信心行 + 媒体区 / 客户标记行，
 * 底层铺装饰网格（CSS 光斑漂移 + 点阵 + 胶片颗粒，无 WebGL）。
 * 内容按阅读顺序渐入、媒体从底部升起（均随 prefers-reduced-motion 静止）；
 * split 窄屏（<1024px）堆叠、动作区窄屏（<640px）全宽纵排；
 * 动作按钮支持 doneLabel 短暂完成态。
 *
 * 子部件拆分：HeroMesh（装饰网格）/ HeroMediaSlot（媒体 DSL 子树槽）/
 * HeroAction（单个 CTA）各自独立文件，本文件仅承载组合与公开契约。
 */
export function HeroSection({
  variant = 'centered',
  announcement,
  title,
  description,
  actions,
  meta,
  media,
  logos,
  onActionClick,
  className,
  style,
}: HeroSectionProps) {
  const hasActions = Array.isArray(actions) && actions.length > 0;
  const hasLogos = Array.isArray(logos) && logos.length > 0;
  if (
    !announcement &&
    !title &&
    !description &&
    !hasActions &&
    !meta &&
    !media &&
    !hasLogos
  ) {
    return null;
  }

  const split = variant === 'split';
  const minimal = variant === 'minimal';
  const centered = !split && !minimal;

  return (
    <section
      data-slot="hero-section"
      data-variant={variant}
      className={cn('relative overflow-hidden bg-background', className)}
      style={style}
    >
      <HeroMesh />

      <div
        data-slot="hero-section-content"
        className={cn(
          'relative mx-auto flex w-full flex-col px-4 py-14 sm:px-6 md:py-24',
          centered && 'max-w-3xl min-h-[var(--hero-min-h,80svh)] items-center justify-center text-center',
          split && 'max-w-6xl min-h-[var(--hero-min-h,80svh)] gap-12 lg:flex-row lg:items-center lg:justify-between',
          minimal && 'max-w-4xl min-h-[var(--hero-min-h,80svh)] items-center justify-center text-center',
        )}
      >
        <div
          className={cn(
            'flex w-full flex-col',
            centered && 'items-center',
            split && 'max-w-xl lg:w-1/2',
            minimal && 'items-center',
          )}
        >
          {announcement ? (
            <span
              data-slot="hero-section-announcement"
              className="mb-6 animate-[pactor-hero-fade-up_0.7s_ease-out_both] motion-reduce:animate-none"
            >
              {announcement.href ? (
                <Link
                  href={announcement.href}
                  className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {announcement.text}
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {announcement.text}
                </span>
              )}
            </span>
          ) : null}

          {title ? (
            <h1
              data-slot="hero-section-title"
              style={{ animationDelay: '80ms' }}
              className={cn(
                'animate-[pactor-hero-fade-up_0.7s_ease-out_both] motion-reduce:animate-none font-semibold tracking-tight text-balance',
                minimal ? 'text-5xl md:text-7xl' : 'text-4xl md:text-6xl',
              )}
            >
              {title}
            </h1>
          ) : null}

          {description ? (
            <p
              data-slot="hero-section-description"
              style={{ animationDelay: '160ms' }}
              className="mt-5 max-w-2xl animate-[pactor-hero-fade-up_0.7s_ease-out_both] motion-reduce:animate-none text-base leading-relaxed text-pretty text-muted-foreground md:text-xl"
            >
              {description}
            </p>
          ) : null}

          {hasActions ? (
            <div
              data-slot="hero-section-actions"
              style={{ animationDelay: '240ms' }}
              className={cn(
                'mt-8 flex w-full animate-[pactor-hero-fade-up_0.7s_ease-out_both] motion-reduce:animate-none flex-wrap gap-3 max-sm:flex-col max-sm:[&>*]:w-full',
                (centered || minimal) && 'justify-center',
              )}
            >
              {actions!.map((action, index) => (
                <HeroAction
                  key={action.label}
                  action={action}
                  index={index}
                  onActionClick={onActionClick}
                />
              ))}
            </div>
          ) : null}

          {meta ? (
            <p
              data-slot="hero-section-meta"
              style={{ animationDelay: '320ms' }}
              className="mt-4 animate-[pactor-hero-fade-up_0.7s_ease-out_both] motion-reduce:animate-none text-sm text-muted-foreground"
            >
              {meta}
            </p>
          ) : null}
        </div>

        {media !== undefined && media !== null && !minimal ? (
          <div
            data-slot="hero-section-media"
            style={{ animationDelay: '300ms' }}
            className={cn(
              'w-full animate-[pactor-hero-rise_0.9s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none',
              centered && 'mt-14 max-w-5xl',
              split && 'mt-0 max-w-2xl lg:w-1/2',
            )}
          >
            <HeroMediaSlot media={media} />
          </div>
        ) : null}
      </div>

      {hasLogos ? (
        <div
          data-slot="hero-section-logos"
          className={cn(
            'relative mx-auto flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-4 px-4 pb-12 sm:px-6',
            minimal ? 'mt-8 max-w-4xl border-t border-border/60 pt-8' : 'max-w-6xl',
          )}
        >
          {logos!.map((logo) => (
            <span
              key={logo.name}
              data-slot="hero-section-logo"
              className="flex items-center gap-2 text-sm text-muted-foreground/80"
            >
              {logo.logo ? (
                <img
                  src={logo.logo}
                  alt={logo.name}
                  className="size-5 object-contain opacity-70 grayscale"
                />
              ) : null}
              {logo.name}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
