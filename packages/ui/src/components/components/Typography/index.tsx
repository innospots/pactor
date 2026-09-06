import type { CSSProperties } from 'react';

import {
  Typography as ShadcnTypography,
  type typographyVariants,
} from '../../../ui/typography.js';
import type { VariantProps } from 'class-variance-authority';

/** Typography 排版变体 */
export type TypographyVariant = NonNullable<
  VariantProps<typeof typographyVariants>['variant']
>;

export interface TypographyProps {
  /** 排版变体（缺省 p） */
  variant?: TypographyVariant;
  /** 文本内容（可含表达式） */
  text?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** Typography 适配器（shadcn kit）：按 variant 渲染排版样式文本 */
export function Typography({
  variant = 'p',
  text,
  className,
  style,
}: TypographyProps) {
  return (
    <ShadcnTypography variant={variant} className={className} style={style}>
      {text}
    </ShadcnTypography>
  );
}
