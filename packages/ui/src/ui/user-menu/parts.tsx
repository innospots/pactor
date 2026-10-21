import { LogOut, SunMoon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '../../lib/utils.js';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar.js';
import { Badge } from '../badge.js';
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../dropdown-menu.js';
import { Kbd } from '../kbd.js';
import { Spinner } from '../spinner.js';
import { themes, userStatuses } from './options.js';
import { PresenceDot } from './presence-dot.js';
import type { ThemePreference, UserMenuUser, UserStatus } from './types.js';

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function Face({
  user,
  status,
  size,
}: {
  user: UserMenuUser;
  status?: UserStatus;
  size: 'sm' | 'md';
}) {
  return (
    <span
      className={cn(
        'relative inline-grid shrink-0',
        size === 'sm' ? 'size-8' : 'size-[34px]',
      )}
    >
      <Avatar className="size-full">
        {user.avatarSrc ? (
          <AvatarImage
            src={user.avatarSrc}
            srcSet={user.avatarSrcSet}
            alt=""
            className="bg-muted object-cover object-[50%_15%] outline -outline-offset-1 outline-foreground/10"
          />
        ) : null}
        <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
          {initialsOf(user.name)}
        </AvatarFallback>
      </Avatar>
      {status ? (
        <PresenceDot
          status={status}
          className="absolute -right-px -bottom-px"
          style={{
            boxShadow:
              '0 0 0 2px var(--presence-surface, var(--popover))',
          }}
        />
      ) : null}
    </span>
  );
}

export function Keys({ keys }: { keys: string[] }) {
  return (
    <span
      className="ml-auto inline-flex shrink-0 items-center gap-0.5"
      aria-hidden="true"
    >
      {keys.map((key, index) => (
        <Kbd
          key={`${key}-${index}`}
          className="h-auto min-w-0 rounded-none bg-transparent p-0 font-[inherit] text-xs leading-none text-muted-foreground/80 tabular-nums"
        >
          {key}
        </Kbd>
      ))}
    </span>
  );
}

export function RowIcon({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-grid w-4 shrink-0 place-items-center text-muted-foreground transition-colors group-data-[highlighted]:text-foreground group-focus-visible:text-foreground group-active:text-foreground"
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

export function MenuHeader({
  user,
  status,
  sheet = false,
}: {
  user: UserMenuUser;
  status?: UserStatus;
  sheet?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 px-2 py-2',
        sheet && 'pt-1 pb-3',
      )}
    >
      <Face user={user} status={status} size="md" />
      <div className="grid min-w-0 flex-1 gap-0.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="min-w-0 shrink truncate text-[13px] font-medium leading-tight">
            {user.name}
          </span>
          {user.plan ? (
            <Badge
              variant="outline"
              className="max-w-[55%] min-w-0 shrink truncate px-1 py-0 text-[11px] leading-4 font-medium"
            >
              {user.plan}
            </Badge>
          ) : null}
        </div>
        <span
          title={user.email}
          className="truncate text-xs leading-snug text-muted-foreground"
        >
          {user.email}
        </span>
      </div>
    </div>
  );
}

/** 分段切换：桌面走 MenuRadioGroup 的菜单键盘语义，窄屏抽屉用原生按钮 */
function Segmented<T extends string>({
  label,
  icon,
  value,
  options,
  onChange,
  sheet,
}: {
  label: string;
  icon: ReactNode;
  value: T;
  options: { value: T; label: string; icon: ReactNode }[];
  onChange: (value: T) => void;
  sheet: boolean;
}) {
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const rowClass = cn(
    'relative flex items-center gap-2.5 rounded-md px-2 text-[13px]',
    sheet
      ? 'h-[52px] text-base'
      : 'h-9 outline-hidden select-none [&:has([data-highlighted])]:bg-foreground/[0.06]',
  );
  const track = (
    <span
      className={cn(
        'relative inline-grid h-[26px] shrink-0 grid-flow-col auto-cols-[28px] rounded-[7px] bg-foreground/[0.05] p-0.5',
        sheet && 'h-[34px] auto-cols-[40px]',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-0.5 bottom-0.5 left-0.5 w-[28px] rounded-[5px] bg-background shadow-sm ring-1 ring-border/60 transition-transform duration-300 ease-out motion-reduce:transition-none',
          sheet && 'w-[40px]',
        )}
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {options.map((option) =>
        sheet ? (
          <button
            key={option.value}
            type="button"
            role="menuitemradio"
            aria-checked={option.value === value}
            aria-label={option.label}
            title={option.label}
            className="relative z-10 grid cursor-pointer place-items-center rounded-[5px] text-muted-foreground outline-hidden transition-colors duration-150 hover:text-foreground active:text-foreground aria-checked:text-foreground"
            onClick={() => onChange(option.value)}
          >
            {option.icon}
          </button>
        ) : (
          <DropdownMenuRadioItem
            key={option.value}
            value={option.value}
            label={option.label}
            aria-label={option.label}
            title={option.label}
            closeOnClick={false}
            className="relative z-10 grid cursor-pointer place-items-center rounded-[5px] p-0 text-muted-foreground outline-hidden transition-colors duration-150 hover:text-foreground focus:bg-transparent focus:text-foreground data-checked:text-foreground"
          >
            {option.icon}
          </DropdownMenuRadioItem>
        ),
      )}
    </span>
  );

  const content = (
    <>
      <span
        className="inline-grid w-4 shrink-0 place-items-center text-muted-foreground"
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className={cn('flex-1', !sheet && 'text-foreground')} aria-hidden="true">
        {label}
      </span>
      {track}
    </>
  );

  return sheet ? (
    <div className={rowClass} role="group" aria-label={label}>
      {content}
    </div>
  ) : (
    <DropdownMenuRadioGroup
      className={rowClass}
      value={value}
      onValueChange={(next) => onChange(next as T)}
      aria-label={label}
    >
      {content}
    </DropdownMenuRadioGroup>
  );
}

/** 主题 / 在线状态两行内联切换；sheet 切换为抽屉样式 */
export function PreferenceRows({
  sheet,
  showStatus,
  showTheme,
  status,
  theme,
  onStatusChange,
  onThemeChange,
}: {
  sheet: boolean;
  showStatus: boolean;
  showTheme: boolean;
  status: UserStatus;
  theme: ThemePreference;
  onStatusChange: (status: UserStatus) => void;
  onThemeChange: (theme: ThemePreference) => void;
}) {
  if (!showStatus && !showTheme) return null;
  return (
    <>
      {showStatus ? (
        <Segmented
          label="状态"
          icon={<PresenceDot status={status} />}
          value={status}
          onChange={onStatusChange}
          options={userStatuses.map((option) => ({
            ...option,
            icon: (
              <PresenceDot
                status={option.value}
                className="size-[9px]"
              />
            ),
          }))}
          sheet={sheet}
        />
      ) : null}
      {showTheme ? (
        <Segmented
          label="主题"
          icon={<SunMoon size={16} strokeWidth={1.75} aria-hidden="true" />}
          value={theme}
          onChange={onThemeChange}
          options={themes}
          sheet={sheet}
        />
      ) : null}
    </>
  );
}

/** 退出登录行内容：异步退出时以 Spinner + 文案切换呈现进度 */
export function SignOutContent({
  signingOut,
  keys,
}: {
  signingOut: boolean;
  keys?: string[];
}) {
  return (
    <>
      <RowIcon>
        {signingOut ? (
          <Spinner aria-hidden="true" className="size-4" />
        ) : (
          <LogOut size={16} strokeWidth={1.75} />
        )}
      </RowIcon>
      <span className="min-w-0 flex-1 truncate">
        <span
          key={signingOut ? 'signing' : 'idle'}
          className="inline-block animate-in whitespace-nowrap fade-in-0 duration-150 motion-reduce:animate-none"
        >
          {signingOut ? '正在退出' : '退出登录'}
        </span>
      </span>
      {keys ? <Keys keys={keys} /> : null}
    </>
  );
}
