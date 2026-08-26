import type { ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Card as ShadcnCard,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../ui/card.js';

export interface CardProps {
  /** 卡片标题，可选 */
  title?: string;
  /** 是否有边框，默认 true（false 去边框与阴影） */
  bordered?: boolean;
  children?: ReactNode;
}

/** Card 适配器（shadcn kit）：可选标题 + 边框开关（bordered=false 去边框与阴影） */
export function Card({ title, bordered = true, children }: CardProps) {
  return (
    <ShadcnCard
      className={cn('gap-4 py-4', !bordered && 'border-transparent shadow-none')}
    >
      {title ? (
        <CardHeader className="px-4">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className="px-4">{children}</CardContent>
    </ShadcnCard>
  );
}
