import type { CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import type { UserStatus } from './types.js';

/** 在线状态点：实心圆点（可用）、横杠（忙碌）、圆环（离开 / 离线） */
export function PresenceDot({
  status,
  className,
  style,
}: {
  status: UserStatus | 'offline';
  className?: string;
  style?: CSSProperties;
}) {
  const tone =
    status === 'busy'
      ? 'bg-destructive'
      : status === 'away'
        ? 'bg-warning'
        : status === 'offline'
          ? 'bg-muted-foreground'
          : 'bg-success';
  // 内孔 / 横杠用周围表面色遮盖，形成圆环与横杠；由祖先 --presence-surface 提供
  const surface = { backgroundColor: 'var(--presence-surface, var(--popover))' };
  return (
    <span
      data-slot="presence-dot"
      data-status={status}
      aria-hidden="true"
      className={cn(
        'relative inline-block size-2.5 shrink-0 rounded-full transition-colors duration-200',
        tone,
        className,
      )}
      style={style}
    >
      {/* 圆环：内孔放大盖住中心 */}
      <span
        className={cn(
          'absolute inset-0 m-auto size-[46%] rounded-full transition-transform duration-300 ease-out motion-reduce:transition-none',
          status === 'away' || status === 'offline'
            ? 'scale-100'
            : 'scale-0',
        )}
        style={surface}
      />
      {/* 忙碌：横杠 */}
      <span
        className={cn(
          'absolute inset-0 m-auto h-[22%] min-h-[1.5px] w-[58%] rounded-[1px] transition-transform duration-300 ease-out motion-reduce:transition-none',
          status === 'busy' ? 'scale-x-100' : 'scale-x-0',
        )}
        style={surface}
      />
    </span>
  );
}
