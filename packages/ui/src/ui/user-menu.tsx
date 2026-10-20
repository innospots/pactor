import {
  ChevronDown,
  LogOut,
  Monitor,
  Moon,
  Sun,
  SunMoon,
} from 'lucide-react';
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react';

import { cn } from '../lib/utils.js';
import { Avatar, AvatarFallback, AvatarImage } from './avatar.js';
import { Badge } from './badge.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu.js';
import { Drawer, DrawerContent, DrawerTitle } from './drawer.js';
import { Kbd } from './kbd.js';
import { Separator } from './separator.js';
import { Spinner } from './spinner.js';

export type UserStatus = 'available' | 'busy' | 'away';
export type ThemePreference = 'light' | 'dark' | 'system';

/** 在线状态（菜单顺序）；除颜色外每种状态还有独立图形：实心 / 横杠 / 圆环 */
export const userStatuses: { value: UserStatus; label: string }[] = [
  { value: 'available', label: '在线' },
  { value: 'busy', label: '忙碌' },
  { value: 'away', label: '离开' },
];

const themes: {
  value: ThemePreference;
  label: string;
  icon: ReactNode;
}[] = [
  {
    value: 'light',
    label: '浅色',
    icon: <Sun size={14} strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    value: 'dark',
    label: '深色',
    icon: <Moon size={14} strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    value: 'system',
    label: '跟随系统',
    icon: <Monitor size={14} strokeWidth={1.75} aria-hidden="true" />,
  },
];

export interface UserMenuUser {
  name: string;
  email: string;
  /** 身份徽标（如套餐 / 角色），展示在名字右侧 */
  plan?: string;
  avatarSrc?: string;
  avatarSrcSet?: string;
}

export interface UserMenuItem {
  label: string;
  icon?: ReactNode;
  /** 右侧快捷键提示，如 ['⌘', ','] */
  keys?: string[];
  onSelect?: () => void;
}

export interface UserMenuProps {
  user: UserMenuUser;
  /** 受控在线状态；与 onStatusChange 任一提供即显示状态点与内联状态切换 */
  status?: UserStatus;
  defaultStatus?: UserStatus;
  onStatusChange?: (status: UserStatus) => void;
  /** 受控主题偏好 */
  theme?: ThemePreference;
  defaultTheme?: ThemePreference;
  /** 仅上报选择；把主题应用到页面由调用方负责 */
  onThemeChange?: (theme: ThemePreference) => void;
  /** 显示内联浅色 / 深色 / 跟随系统切换（缺省 true） */
  showTheme?: boolean;
  /** 账户入口（建议 3–4 项） */
  items?: UserMenuItem[];
  /** 退出登录；返回 Promise 时菜单保持展开并显示进度，结束后关闭 */
  onSignOut?: () => void | Promise<unknown>;
  /** 退出项的快捷键提示 */
  signOutKeys?: string[];
  /** 面板相对触发器的对齐方式（缺省 end） */
  align?: 'start' | 'center' | 'end';
  /** 640px 以上在头像右侧展示姓名与箭头 */
  showName?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 触发器按钮 ref */
  ref?: Ref<HTMLButtonElement>;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  /** 额外挂在触发器上的 class */
  triggerClassName?: string;
}

const compactQuery = '(max-width: 639px)';

function subscribeCompact(change: () => void): () => void {
  const query = window.matchMedia(compactQuery);
  query.addEventListener('change', change);
  return () => query.removeEventListener('change', change);
}

const subscribeNothing = () => () => {};

const statusLabel = (status: UserStatus): string =>
  userStatuses.find((option) => option.value === status)?.label ?? status;

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

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

function Face({
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

function Keys({ keys }: { keys: string[] }) {
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

function RowIcon({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-grid w-4 shrink-0 place-items-center text-muted-foreground transition-colors group-data-[highlighted]:text-foreground group-focus-visible:text-foreground group-active:text-foreground"
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

function MenuHeader({
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

/**
 * UserMenu 账户菜单：头像触发器 + 账号信息头 / 账户入口 / 内联主题与
 * 在线状态切换 / 退出登录。视觉与交互设计参考 Arc UI
 * （https://uiarc.dev/components/user-menu），Tailwind 实现。
 *
 * - 桌面端复用 DropdownMenu（Base UI Menu）：定位翻转、外部关闭、焦点
 *   归还、方向键 / Home / End / 首字母跳转都由原语承担；
 * - 窄于 640px 时复用 Drawer（vaul）呈现底部抽屉与拖拽关闭；
 * - 主题与在线状态通过 MenuRadioGroup 保持菜单展开，其余项选择后关闭；
 * - onSignOut 返回 Promise 时退出项显示进度，结束后再关闭。
 */
export function UserMenu({
  user,
  status: statusProp,
  defaultStatus = 'available',
  onStatusChange,
  theme: themeProp,
  defaultTheme = 'system',
  onThemeChange,
  showTheme = true,
  items = [],
  onSignOut,
  signOutKeys,
  align = 'end',
  showName = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ref,
  className,
  style,
  triggerClassName,
}: UserMenuProps) {
  const id = useId();
  const triggerId = `${id}-trigger`;
  const sheetMenuId = `${id}-sheet-menu`;
  const hydrated = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const compact = useSyncExternalStore(
    subscribeCompact,
    () => window.matchMedia(compactQuery).matches,
    () => false,
  );
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [innerStatus, setInnerStatus] = useState(defaultStatus);
  const [innerTheme, setInnerTheme] = useState(defaultTheme);
  const [signingOut, setSigningOut] = useState(false);
  const pending = useRef(false);

  const open = openProp ?? innerOpen;
  const showStatus = statusProp !== undefined || onStatusChange !== undefined;
  const status = statusProp ?? innerStatus;
  const theme = themeProp ?? innerTheme;
  const sheet = hydrated && compact;

  // Drawer 以 modal={false} 接入（避免 Radix 把自绘遮罩 aria-hidden 且
  // pointer-events:none），页面滚动锁定在此补齐
  useEffect(() => {
    if (!open || !sheet) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [open, sheet]);

  function setTriggerRef(node: HTMLButtonElement | null): void {
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as { current: HTMLButtonElement | null }).current = node;
  }

  function changeOpen(next: boolean): void {
    if (next) setSigningOut(pending.current);
    setInnerOpen(next);
    onOpenChange?.(next);
  }

  function changeStatus(value: UserStatus): void {
    setInnerStatus(value);
    onStatusChange?.(value);
  }

  function changeTheme(value: ThemePreference): void {
    setInnerTheme(value);
    onThemeChange?.(value);
  }

  function signOut(): void {
    if (pending.current) return;
    const result = onSignOut?.();
    if (!result || typeof result.then !== 'function') {
      changeOpen(false);
      return;
    }
    // 异步退出：菜单保持展开并在该项上显示进度，Promise 落定后关闭
    pending.current = true;
    setSigningOut(true);
    const done = (): void => {
      pending.current = false;
      setSigningOut(false);
      changeOpen(false);
    };
    result.then(done, done);
  }

  const itemRowClass =
    'group relative flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] text-foreground outline-hidden select-none focus:bg-foreground/[0.06] data-highlighted:bg-foreground/[0.06]';
  const sheetRowClass =
    'group relative flex h-[46px] w-full items-center gap-2.5 rounded-md px-2 text-left text-base text-foreground outline-hidden select-none transition-colors focus-visible:bg-foreground/[0.06] active:bg-foreground/[0.06]';

  const signOutContent = (
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
      {signOutKeys && !sheet ? <Keys keys={signOutKeys} /> : null}
    </>
  );

  const trigger = (
    <button
      ref={setTriggerRef}
      id={triggerId}
      type="button"
      data-slot="user-menu-trigger"
      data-state={open ? 'open' : 'closed'}
      data-name={showName || undefined}
      className={cn(
        'group relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full p-1 text-sm text-foreground outline-none transition-colors',
        '[--presence-surface:var(--background)]',
        'hover:bg-muted hover:[--presence-surface:var(--muted)]',
        'data-[state=open]:bg-muted data-[state=open]:[--presence-surface:var(--muted)]',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        showName && 'pr-2.5 max-sm:pr-1',
        triggerClassName,
      )}
      aria-label={`账户菜单，${user.name}${showStatus ? `，${statusLabel(status)}` : ''}`}
      {...(sheet
        ? {
            'aria-haspopup': 'menu' as const,
            'aria-expanded': open,
            'aria-controls': open ? sheetMenuId : undefined,
            onClick: () => changeOpen(!open),
          }
        : {})}
    >
      <Face user={user} status={showStatus ? status : undefined} size="sm" />
      {showName ? (
        <>
          <span className="max-w-44 truncate font-medium leading-none max-sm:hidden">
            {user.name}
          </span>
          <ChevronDown
            className="-ml-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:text-foreground group-data-[state=open]:rotate-180 group-data-[state=open]:text-foreground max-sm:hidden"
            aria-hidden="true"
          />
        </>
      ) : null}
    </button>
  );

  return (
    <span
      data-slot="user-menu"
      className={cn('relative inline-flex flex-none align-middle', className)}
      style={style}
    >
      {sheet ? (
        <>
          {trigger}
          <Drawer
            direction="bottom"
            modal={false}
            open={open}
            onOpenChange={(next) => changeOpen(next)}
          >
            <DrawerContent
              data-slot="user-menu-sheet"
              className="rounded-t-2xl border-x-0 border-b-0 px-2 pt-0 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-2xl data-[vaul-drawer-direction=bottom]:max-h-[88dvh] data-[vaul-drawer-direction=bottom]:rounded-t-2xl [--presence-surface:var(--popover)]"
              overlayProps={{
                'data-slot': 'user-menu-scrim',
                'aria-hidden': true,
                className: 'animate-in fade-in-0 duration-200',
                onClick: () => changeOpen(false),
              }}
            >
              <DrawerTitle className="sr-only">账户菜单</DrawerTitle>
              <div
                id={sheetMenuId}
                role="menu"
                aria-label={`账户菜单，${user.name}`}
                data-slot="user-menu-panel"
                className="text-left text-[13px] text-foreground"
              >
                <MenuHeader
                  user={user}
                  status={showStatus ? status : undefined}
                  sheet
                />
                {items.length > 0 ? (
                  <>
                    <Separator className="my-1" />
                    {items.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        role="menuitem"
                        className={sheetRowClass}
                        onClick={() => {
                          changeOpen(false);
                          item.onSelect?.();
                        }}
                      >
                        <RowIcon>{item.icon}</RowIcon>
                        <span className="min-w-0 flex-1 truncate">
                          {item.label}
                        </span>
                        {item.keys ? <Keys keys={item.keys} /> : null}
                      </button>
                    ))}
                  </>
                ) : null}
                {showTheme || showStatus ? (
                  <>
                    <Separator className="my-1" />
                    {showStatus ? (
                      <Segmented
                        label="状态"
                        icon={<PresenceDot status={status} />}
                        value={status}
                        onChange={changeStatus}
                        options={userStatuses.map((option) => ({
                          ...option,
                          icon: (
                            <PresenceDot
                              status={option.value}
                              className="size-[9px]"
                            />
                          ),
                        }))}
                        sheet
                      />
                    ) : null}
                    {showTheme ? (
                      <Segmented
                        label="主题"
                        icon={
                          <SunMoon
                            size={16}
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                        }
                        value={theme}
                        onChange={changeTheme}
                        options={themes}
                        sheet
                      />
                    ) : null}
                  </>
                ) : null}
                <Separator className="my-1" />
                <button
                  type="button"
                  role="menuitem"
                  aria-busy={signingOut || undefined}
                  className={sheetRowClass}
                  onClick={signOut}
                >
                  {signOutContent}
                </button>
              </div>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <DropdownMenu
          open={open}
          onOpenChange={(next) => changeOpen(next)}
        >
          <DropdownMenuTrigger render={trigger} />
          <DropdownMenuContent
            align={align}
            sideOffset={8}
            collisionPadding={12}
            data-slot="user-menu-panel"
            data-align={align}
            className="w-[15.5rem] max-w-[calc(100vw-24px)] rounded-[10px] border-[0.5px] p-1 text-left text-[13px] shadow-lg [--presence-surface:var(--popover)]"
          >
            <MenuHeader
              user={user}
              status={showStatus ? status : undefined}
            />
            {items.length > 0 ? (
              <>
                <DropdownMenuSeparator />
                {items.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    label={item.label}
                    onClick={() => item.onSelect?.()}
                    className={itemRowClass}
                  >
                    <RowIcon>{item.icon}</RowIcon>
                    <span className="min-w-0 flex-1 truncate">
                      {item.label}
                    </span>
                    {item.keys ? <Keys keys={item.keys} /> : null}
                  </DropdownMenuItem>
                ))}
              </>
            ) : null}
            {showTheme || showStatus ? (
              <>
                <DropdownMenuSeparator />
                {showStatus ? (
                  <Segmented
                    label="状态"
                    icon={<PresenceDot status={status} />}
                    value={status}
                    onChange={changeStatus}
                    options={userStatuses.map((option) => ({
                      ...option,
                      icon: (
                        <PresenceDot
                          status={option.value}
                          className="size-[9px]"
                        />
                      ),
                    }))}
                    sheet={false}
                  />
                ) : null}
                {showTheme ? (
                  <Segmented
                    label="主题"
                    icon={
                      <SunMoon
                        size={16}
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    }
                    value={theme}
                    onChange={changeTheme}
                    options={themes}
                    sheet={false}
                  />
                ) : null}
              </>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              label="退出登录"
              closeOnClick={false}
              aria-busy={signingOut || undefined}
              onClick={signOut}
              className={itemRowClass}
            >
              {signOutContent}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </span>
  );
}
