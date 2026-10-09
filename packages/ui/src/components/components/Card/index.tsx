import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Card as ShadcnCard,
  CardContent,
  CardHeader,
  CardTitle,
  type CardRounded,
} from '../../../ui/card.js';
import { Skeleton as ShadcnSkeleton } from '../../../ui/skeleton.js';

export interface CardProps {
  /** 卡片标题，可选 */
  title?: string;
  /** title 行右端内容（DSL 子树，如按钮/链接/分段切换；设置后标题行两端排布，经 card-action 槽位渲染） */
  extra?: DslNode[];
  /** 加载中：内容区以 Skeleton 骨架占位（标题行保持渲染），默认 false */
  loading?: boolean;
  /** 是否有边框，默认 true（false 去边框与阴影） */
  bordered?: boolean;
  /** 圆角档位，默认 'lg'（即 --radius 基准值） */
  rounded?: CardRounded;
  /** 可点击卡片：手型光标 + hover 边框/背景高亮，常配 events.onClick（如新建占位卡、整卡进详情） */
  hoverable?: boolean;
  /** 根节点 DOM id（配合 Anchor 锚点定位等场景） */
  id?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：内容区（CardContent）class，如 `flex flex-1 flex-col items-center justify-center` 做整卡居中 */
  contentClassName?: string;
  /** 通用：根节点内联样式（布局逃逸口，如 `{ flex: 1 }`） */
  style?: CSSProperties;
  /** 点击事件（Renderer 绑定 events.onClick） */
  onClick?: () => void;
  children?: ReactNode;
}

/** title 行右端槽位：独立子组件内调用 useRenderer，Card 作纯 React 组件使用时不受影响 */
function ExtraSlot({ extra }: { extra: DslNode[] }) {
  const { renderChildren } = useRenderer();
  return (
    <div data-slot="card-action" className="flex items-center justify-end gap-2">
      {renderChildren(extra)}
    </div>
  );
}

/** Card 适配器（shadcn kit）：可选标题 + 边框开关（bordered=false 去边框与阴影）+ 圆角档位 + hoverable 可点击卡 */
export function Card({
  title,
  extra,
  loading,
  bordered = true,
  rounded,
  hoverable,
  id,
  className,
  contentClassName,
  style,
  onClick,
  children,
}: CardProps) {
  return (
    <ShadcnCard
      rounded={rounded}
      id={id}
      className={cn(
        'gap-4 py-4',
        !bordered && 'border-transparent shadow-none',
        hoverable &&
          'cursor-pointer transition-colors hover:border-primary/50 hover:bg-accent/50',
        className,
      )}
      style={style}
      onClick={onClick}
    >
      {title || extra ? (
        <CardHeader className="px-4">
          {title ? <CardTitle>{title}</CardTitle> : null}
          {extra ? <ExtraSlot extra={extra} /> : null}
        </CardHeader>
      ) : null}
      {loading ? (
        <CardContent className={cn('px-4', contentClassName)}>
          <div data-slot="card-loading" className="flex flex-col gap-3">
            <ShadcnSkeleton className="h-4 w-full" />
            <ShadcnSkeleton className="h-4 w-3/4" />
            <ShadcnSkeleton className="h-24 w-full" />
          </div>
        </CardContent>
      ) : (
        <CardContent className={cn('px-4', contentClassName)}>{children}</CardContent>
      )}
    </ShadcnCard>
  );
}
