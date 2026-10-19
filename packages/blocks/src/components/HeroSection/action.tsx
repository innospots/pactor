import { Button, Link } from '@pactor-app/ui/components';
import { buttonVariants } from '@pactor-app/ui/ui';
import { useEffect, useRef, useState } from 'react';

import type { HeroSectionAction } from './index.js';

/** DSL variant → shadcn variant（对齐 ui Button 映射：primary 实心、default 描边） */
const actionVariantClass = (variant: 'primary' | 'default') =>
  variant === 'primary'
    ? buttonVariants({ variant: 'default' })
    : buttonVariants({ variant: 'outline' });

/**
 * 单个 CTA：href → 按钮样式 Link（不嵌套 button）；无 href → Button
 * （primary / default），支持 doneLabel 点击后短暂替换文案（约 1.2s 恢复）。
 */
export function HeroAction({
  action,
  index,
  onActionClick,
}: {
  action: HeroSectionAction;
  index: number;
  onActionClick?: (event: { key: string; label: string }) => void;
}) {
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    },
    [],
  );

  const variant = action.variant ?? (index === 0 ? 'primary' : 'default');
  const label = done && action.doneLabel ? action.doneLabel : action.label;

  if (action.href) {
    return (
      <Link href={action.href} className={actionVariantClass(variant)}>
        {label}
      </Link>
    );
  }
  return (
    <Button
      text={label}
      variant={variant}
      onClick={() => {
        onActionClick?.({ key: action.label, label: action.label });
        if (action.doneLabel) {
          setDone(true);
          if (timerRef.current !== null) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setDone(false), 1200);
        }
      }}
    />
  );
}
