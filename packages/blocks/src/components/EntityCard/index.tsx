import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Button, type ButtonVariant } from '../../components/Button/index.js';
import { Card } from '../../components/Card/index.js';
import { Icon } from '../../components/Icon/index.js';
import { Tag, type TagColor } from '../../components/Tag/index.js';
import { Text } from '../../components/Text/index.js';

/** 上层右侧状态/分类标签 */
export interface EntityCardTag {
  text: string;
  /** 语义色，默认 default */
  color?: TagColor;
}

/** 下层操作按钮；key 缺省取 text */
export interface EntityCardAction {
  text: string;
  key?: string;
  variant?: ButtonVariant;
  danger?: boolean;
}

export interface EntityCardProps {
  /** 图标名（Icon 白名单）；与 logo 二选一，logo 优先 */
  icon?: string;
  /** Logo 图片地址 */
  logo?: string;
  /** 主标题 */
  title?: string;
  /** 标题下方辅助短文案（版本号、编码等） */
  subtitle?: string;
  /** 上层右侧标签组 */
  tags?: EntityCardTag[];
  /** 中层描述说明，固定两行高度、超出截断 */
  description?: string;
  /** 中层右侧维护信息（与描述平铺，如「平台组 · 更新于 2026-09-28」） */
  meta?: string;
  /** 下层操作按钮组（居右）；不配置则不渲染下层 */
  actions?: EntityCardAction[];
  /** 下层是否带浅底栏背景，默认 true */
  footerBackground?: boolean;
  /** 整卡可点：手型 + hover 边框/背景高亮，常配 events.onClick */
  hoverable?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：内容区 class */
  contentClassName?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  /** 整卡点击（actions 区域不触发） */
  onClick?: () => void;
  /** 操作按钮点击，参数 { key, text, index } */
  onAction?: (event: { key: string; text: string; index: number }) => void;
}

/**
 * EntityCard 实体摘要卡（business 目录）：上（图标+标题+副文案 / 标签组）、
 * 中（描述 / 维护信息）、下（浅底栏操作按钮组）三层结构；按钮点击独立于
 * 整卡点击（stopPropagation）。组件不内置请求，交互由 DSL events 编排。
 */
export function EntityCard({
  icon,
  logo,
  title,
  subtitle,
  tags,
  description,
  meta,
  actions,
  footerBackground = true,
  hoverable,
  className,
  contentClassName,
  style,
  onClick,
  onAction,
}: EntityCardProps) {
  return (
    <Card
      hoverable={hoverable}
      className={className}
      contentClassName={contentClassName}
      style={style}
      onClick={onClick}
    >
      <div data-slot="entity-card" className="flex flex-col gap-2">
        {/* 上层·平铺：左 图标+标题+副文案，右 标签组 */}
        <div data-slot="entity-card-header" className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {logo ? (
              <img src={logo} alt={title ?? ''} className="size-9 shrink-0 rounded-md" />
            ) : icon ? (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon name={icon} />
              </span>
            ) : null}
            {title || subtitle ? (
              <span className="flex min-w-0 flex-col gap-0.5">
                {title ? <Text text={title} strong className="truncate" /> : null}
                {subtitle ? <Text text={subtitle} type="secondary" size="small" /> : null}
              </span>
            ) : null}
          </div>
          {tags?.length ? (
            <span className="flex shrink-0 items-center gap-1">
              {tags.map((tag, i) => (
                <Tag key={`${tag.text}-${i}`} text={tag.text} color={tag.color} />
              ))}
            </span>
          ) : null}
        </div>
        {/* 中层：描述（固定两行高度，超出截断）；meta 存在时与描述平铺 */}
        {description || meta ? (
          <div data-slot="entity-card-body" className="flex items-center justify-between gap-4">
            {description ? (
              <Text
                text={description}
                type="secondary"
                size="small"
                className="line-clamp-2"
                style={{ minHeight: 32 }}
              />
            ) : null}
            {meta ? (
              <Text text={meta} type="secondary" size="small" className="shrink-0" />
            ) : null}
          </div>
        ) : null}
        {/* 下层·居右：操作按钮组（浅底栏可选） */}
        {actions?.length ? (
          <div
            data-slot="entity-card-footer"
            className={cn(
              'mt-1 flex items-center justify-end gap-1',
              footerBackground && '-mx-4 -mb-4 rounded-b-lg bg-muted px-4 py-2',
            )}
            onClick={(event) => event.stopPropagation()}
          >
            {actions.map((action, index) => (
              <Button
                key={`${action.key ?? action.text}-${index}`}
                text={action.text}
                variant={action.variant}
                danger={action.danger}
                onClick={() =>
                  onAction?.({ key: action.key ?? action.text, text: action.text, index })
                }
              />
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
