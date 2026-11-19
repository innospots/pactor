import { useId, useRef, type CSSProperties, type ReactNode } from 'react';

import { useI18n } from '@pactor-app/runtime';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@pactor-app/ui/ui';

import { cn } from '../../lib/utils.js';

/** 来源条目 */
export interface SourceItem {
  /** 稳定 id（claims.sourceIds 用它做映射；缺省按序号映射） */
  id?: string;
  /** 来源标题 */
  title: string;
  /** 来源链接 */
  url?: string;
  /** 引用片段 */
  snippet?: string;
  /** 站点名（面板变体分组用；缺省从 url hostname 推导） */
  site?: string;
}

/** 来源支撑的论断（面板变体展示 claims → sources 映射） */
export interface SourceClaim {
  id: string;
  text: string;
  /** 该论断引用的来源 id */
  sourceIds: string[];
}

/** 脚注文本切片：普通文本或 [n] / [n,m] marker */
export type SourceTextSegment =
  | { type: 'text'; text: string }
  | { type: 'markers'; text: string; numbers: number[] };

const MARKER_PATTERN = /\[(\d+(?:\s*,\s*\d+)*)\]/g;

/**
 * 纯函数：把含 `[1]` / `[2,3]` marker 的文本切分为片段。
 * 非法编号（0 / 负数 / 非数字）不匹配，原样保留为文本。
 */
export function parseSourceText(text: string): SourceTextSegment[] {
  const segments: SourceTextSegment[] = [];
  let cursor = 0;
  MARKER_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = MARKER_PATTERN.exec(text)) !== null) {
    if (match.index > cursor) {
      segments.push({ type: 'text', text: text.slice(cursor, match.index) });
    }
    const numbers = match[1]!
      .split(',')
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((value) => value > 0);
    if (numbers.length === 0) {
      segments.push({ type: 'text', text: match[0] });
    } else {
      segments.push({ type: 'markers', text: match[0], numbers });
    }
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) {
    segments.push({ type: 'text', text: text.slice(cursor) });
  }
  return segments;
}

/** 来源站点：显式 site > url hostname > 本地化兜底 */
function sourceSite(source: SourceItem, fallback: string): string {
  if (source.site) return source.site;
  if (source.url) {
    try {
      return new URL(source.url).hostname.replace(/^www\./, '');
    } catch {
      /* 非法 URL 走兜底 */
    }
  }
  return fallback;
}

export interface SourceListProps {
  /** 来源列表（编号从 1 起，与文本 marker 对应） */
  sources?: SourceItem[];
  /** footnotes：答案文本（含 [n] marker）+ 文末编号来源 */
  text?: string;
  /** panel：按站点分组的来源面板 + claims 映射 */
  variant?: 'footnotes' | 'panel';
  /** 面板变体的 claims（每个论断映射到来源 id） */
  claims?: SourceClaim[];
  /** 标题（缺省 i18n「来源」） */
  title?: string;
  /** marker / 来源点击（缺省 footnotes 滚动到对应脚注） */
  onSourceClick?: (source: SourceItem, index: number) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

interface SourceCardProps {
  source: SourceItem;
  index: number;
  onMarkerClick: () => void;
}

/** 悬浮来源卡（与 Citation 同一 HoverCard 形态） */
function SourceCard({ source, index, onMarkerClick }: SourceCardProps) {
  const { t } = useI18n();
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <button
            type="button"
            data-slot="source-list-marker"
            className="cursor-pointer rounded-sm border border-border px-1 text-xs leading-4 text-primary hover:bg-accent"
          />
        }
        aria-label={t('pactor.chat.sources.marker', {
          index: index + 1,
          title: source.title,
        })}
        onClick={onMarkerClick}
      >
        [{index + 1}]
      </HoverCardTrigger>
      <HoverCardContent data-slot="source-list-card" className="w-72">
        <div className="text-sm font-medium">{source.title}</div>
        {source.snippet ? (
          <div className="mt-1 line-clamp-3 text-xs text-muted-foreground">
            {source.snippet}
          </div>
        ) : null}
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block truncate text-xs text-primary hover:underline"
          >
            {source.url}
          </a>
        ) : null}
      </HoverCardContent>
    </HoverCard>
  );
}

/**
 * SourceList 适配器（shadcn kit）：来源清单。
 *
 * - `variant="footnotes"`：渲染带 `[n]` / `[n,m]` marker 的答案文本，
 *   marker 悬浮显示来源卡、点击跳到文末编号来源；
 * - `variant="panel"`：按站点分组的来源面板，每个来源展示其支撑的
 *   claims（`claims[].sourceIds` 映射；未命中任何 claim 时不展示）。
 *
 * marker 解析为纯函数 `parseSourceText`（无 markdown 依赖）；宿主已有
 * markdown 渲染时可直接用 panel 变体。
 */
export function SourceList({
  sources = [],
  text,
  variant = 'footnotes',
  claims = [],
  title,
  onSourceClick,
  className,
  style,
}: SourceListProps) {
  const { t } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const heading = title ?? t('pactor.chat.sources.title');

  const handleMarkerClick = (index: number): void => {
    const source = sources[index - 1];
    if (!source) return;
    if (onSourceClick) {
      onSourceClick(source, index - 1);
      return;
    }
    if (variant === 'footnotes') {
      rootRef.current
        ?.querySelector<HTMLElement>(`[data-source-index="${index}"]`)
        ?.scrollIntoView?.({ block: 'nearest' });
    }
  };

  const renderMarker = (number: number): ReactNode => {
    const source = sources[number - 1];
    if (!source) {
      return `[${number}]`;
    }
    return (
      <SourceCard
        key={number}
        source={source}
        index={number - 1}
        onMarkerClick={() => handleMarkerClick(number)}
      />
    );
  };

  const header = (
    <div
      data-slot="source-list-header"
      className="flex items-baseline justify-between gap-2"
    >
      <h3 id={headingId} className="text-sm font-medium">
        {heading}
      </h3>
      <span className="text-xs text-muted-foreground">
        {t('pactor.chat.sources.count', { count: sources.length })}
      </span>
    </div>
  );

  if (variant === 'panel') {
    // 按站点分组（保持首次出现顺序）
    const groups: Array<{
      site: string;
      entries: Array<{ source: SourceItem; index: number }>;
    }> = [];
    const groupBySite = new Map<
      string,
      Array<{ source: SourceItem; index: number }>
    >();
    sources.forEach((source, index) => {
      const site = sourceSite(source, t('pactor.chat.sources.otherSite'));
      let entries = groupBySite.get(site);
      if (!entries) {
        entries = [];
        groupBySite.set(site, entries);
        groups.push({ site, entries });
      }
      entries.push({ source, index });
    });

    const claimsFor = (source: SourceItem, index: number): SourceClaim[] => {
      const fallbackId = String(index + 1);
      return claims.filter((claim) =>
        claim.sourceIds.some(
          (ref) => ref === source.id || (source.id === undefined && ref === fallbackId),
        ),
      );
    };

    return (
      <section
        ref={rootRef}
        data-slot="source-list"
        data-variant="panel"
        aria-labelledby={headingId}
        className={cn(
          'flex w-full flex-col gap-3 rounded-md border border-border p-3',
          className,
        )}
        style={style}
      >
        {header}
        {sources.length === 0 ? (
          <div className="text-xs text-muted-foreground">
            {t('pactor.chat.sources.empty')}
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.site}
              data-slot="source-list-group"
              data-site={group.site}
            >
              <div className="mb-1 text-xs font-medium text-muted-foreground">
                {group.site}
              </div>
              <ul className="flex flex-col gap-2">
                {group.entries.map(({ source, index }) => {
                  const relatedClaims = claimsFor(source, index);
                  return (
                    <li
                      key={`${group.site}-${index}`}
                      data-slot="source-list-item"
                      data-source-index={index + 1}
                      className="rounded-sm border border-border/60 p-2"
                    >
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={t('pactor.chat.sources.open', {
                            title: source.title,
                          })}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {source.title}
                        </a>
                      ) : (
                        <span className="text-sm font-medium">
                          {source.title}
                        </span>
                      )}
                      {source.snippet ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {source.snippet}
                        </p>
                      ) : null}
                      {relatedClaims.length > 0 ? (
                        <div className="mt-2">
                          <div className="text-xs font-medium text-muted-foreground">
                            {t('pactor.chat.sources.claims')}
                          </div>
                          <ul
                            data-slot="source-list-claims"
                            className="mt-1 flex list-disc flex-col gap-0.5 pl-4 text-xs text-muted-foreground"
                          >
                            {relatedClaims.map((claim) => (
                              <li key={claim.id}>{claim.text}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </section>
    );
  }

  const segments = text ? parseSourceText(text) : [];

  return (
    <section
      ref={rootRef}
      data-slot="source-list"
      data-variant="footnotes"
      aria-labelledby={headingId}
      className={cn('flex w-full flex-col gap-3', className)}
      style={style}
    >
      {text ? (
        <p
          data-slot="source-list-text"
          className="text-sm leading-relaxed whitespace-pre-wrap"
        >
          {segments.map((segment, index) =>
            segment.type === 'text' ? (
              <span key={index}>{segment.text}</span>
            ) : (
              <span
                key={index}
                data-slot="source-list-markers"
                className="inline-flex gap-1 align-super"
              >
                {segment.numbers.map((number) =>
                  renderMarker(number),
                )}
              </span>
            ),
          )}
        </p>
      ) : null}
      {header}
      {sources.length === 0 ? (
        <div className="text-xs text-muted-foreground">
          {t('pactor.chat.sources.empty')}
        </div>
      ) : (
        <ol
          data-slot="source-list-items"
          className="flex list-decimal flex-col gap-2 pl-5"
        >
          {sources.map((source, index) => (
            <li
              key={source.id ?? `${source.title}-${index}`}
              data-slot="source-list-item"
              data-source-index={index + 1}
              className="text-xs"
            >
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t('pactor.chat.sources.open', {
                    title: source.title,
                  })}
                  className="font-medium text-primary hover:underline"
                >
                  {source.title}
                </a>
              ) : (
                <span className="font-medium">{source.title}</span>
              )}
              {source.snippet ? (
                <span className="ml-1 text-muted-foreground">
                  {source.snippet}
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
