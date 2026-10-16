import { useState, type CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import { Icon } from '@pactor-app/ui/components';

/** 思考状态：thinking 进行中（图标脉冲动画）、done 已完成 */
export type ThinkingStatus = 'thinking' | 'done';

export interface ThinkingProps {
  /** 推理内容 */
  content?: string;
  /** 状态，默认 thinking */
  status?: ThinkingStatus;
  /** 标题，缺省按状态：思考中… / 思考完成 */
  title?: string;
  /** 受控：是否展开内容；提供时折叠切换仅经 onToggle 上报 */
  expanded?: boolean;
  /** 非受控初始展开（缺省：thinking 展开、done 折叠） */
  defaultExpanded?: boolean;
  /** 折叠切换事件，传出目标展开态（Renderer 绑定 events.onToggle） */
  onToggle?: (expanded: boolean) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Thinking 适配器（shadcn kit）：推理 / 处理中状态——
 * 无边框无底色：头部（brain 图标 + 标题 + chevron 紧随其后）可折叠，
 * 进行中图标脉冲；展开后内容仅以浅色文字呈现。
 * 展开态非受控（defaultExpanded）或受控（expanded + onToggle）。
 */
export function Thinking({
  content,
  status = 'thinking',
  title,
  expanded,
  defaultExpanded,
  onToggle,
  className,
  style,
}: ThinkingProps) {
  const [innerExpanded, setInnerExpanded] = useState(defaultExpanded ?? status === 'thinking');
  const isExpanded = expanded ?? innerExpanded;
  const resolvedTitle = title ?? (status === 'thinking' ? '思考中…' : '思考完成');

  const toggle = () => {
    if (expanded === undefined) {
      setInnerExpanded(!isExpanded);
    }
    onToggle?.(!isExpanded);
  };

  return (
    <div
      data-slot="thinking"
      data-status={status}
      className={cn('w-full', className)}
      style={style}
    >
      <button
        type="button"
        data-slot="thinking-trigger"
        aria-expanded={isExpanded}
        className="flex w-full cursor-pointer items-center gap-2 py-1 text-left text-sm"
        onClick={toggle}
      >
        <span className={cn('text-muted-foreground', status === 'thinking' && 'animate-pulse motion-reduce:animate-none')}>
          <Icon name="brain" size="sm" />
        </span>
        <span data-slot="thinking-title" className="text-muted-foreground">
          {resolvedTitle}
        </span>
        <span className="text-muted-foreground">
          <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} size="sm" />
        </span>
      </button>
      {isExpanded && content ? (
        <div
          data-slot="thinking-content"
          className="py-1 pl-6 text-sm whitespace-pre-wrap text-muted-foreground"
        >
          {content}
        </div>
      ) : null}
    </div>
  );
}
