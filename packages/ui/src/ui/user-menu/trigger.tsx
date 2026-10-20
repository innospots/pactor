import { ChevronDown } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';

import { cn } from '../../lib/utils.js';
import { statusLabel } from './options.js';
import { Face } from './parts.js';
import type { UserStatus, UserMenuUser } from './types.js';

// 作为 Base UI DropdownMenuTrigger 的 render 目标：透传它合并进来的
// 事件 / aria 属性与 ref，否则桌面端无法展开
export interface UserMenuTriggerProps
  extends Omit<ComponentPropsWithRef<'button'>, 'children' | 'className'> {
  open: boolean;
  sheet: boolean;
  sidebar: boolean;
  revealName: boolean;
  showStatus: boolean;
  status: UserStatus;
  user: UserMenuUser;
  triggerId: string;
  sheetMenuId: string;
  setTriggerRef: (node: HTMLButtonElement | null) => void;
  triggerClassName?: string;
  onOpenChange: (open: boolean) => void;
}

/** 头像触发器：default 为胶囊按钮，sidebar 为整行账户行（折叠时收成头像圆钮） */
export function UserMenuTrigger({
  open,
  sheet,
  sidebar,
  revealName,
  showStatus,
  status,
  user,
  triggerId,
  sheetMenuId,
  setTriggerRef,
  triggerClassName,
  onOpenChange,
  ref: forwardedRef,
  ...rest
}: UserMenuTriggerProps) {
  // 合并外部 ref（DropdownMenuTrigger render 注入）与调用方 ref
  function setRef(node: HTMLButtonElement | null): void {
    setTriggerRef(node);
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) {
      (forwardedRef as { current: HTMLButtonElement | null }).current = node;
    }
  }

  return (
    <button
      {...rest}
      ref={setRef}
      id={triggerId}
      type="button"
      data-slot="user-menu-trigger"
      data-variant={sidebar ? 'sidebar' : 'default'}
      data-state={open ? 'open' : 'closed'}
      data-name={revealName || undefined}
      className={cn(
        'group/user-menu relative shrink-0 items-center text-sm outline-none transition-colors',
        sidebar
          ? cn(
              // 侧边栏账户行：整行宽、与 SidebarMenuButton lg 同高（h-12），
              // 头像 32 + 上下 p-2 恰好 48；姓名占满剩余宽度
              'flex h-12 w-full gap-2.5 rounded-md p-2 text-sidebar-foreground',
              '[--presence-surface:var(--sidebar)]',
              'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:[--presence-surface:var(--sidebar-accent)]',
              'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:[--presence-surface:var(--sidebar-accent)]',
              'focus-visible:ring-2 focus-visible:ring-sidebar-ring',
              // Sidebar 折叠为 icon（collapsible=icon）时收成 32px 头像圆钮：
              // 固定 size（而非 h-8）避免 Footer 内边距变化时被 w-full 拉成横条，
              // 姓名 / 箭头随同 group-data 隐藏
              'group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center',
              'group-data-[collapsible=icon]:gap-0! group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:p-0!',
            )
          : cn(
              'inline-flex h-10 gap-2 rounded-full p-1 text-foreground',
              '[--presence-surface:var(--background)]',
              'hover:bg-muted hover:[--presence-surface:var(--muted)]',
              'data-[state=open]:bg-muted data-[state=open]:[--presence-surface:var(--muted)]',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              revealName && 'pr-2.5 max-sm:pr-1',
            ),
        triggerClassName,
      )}
      aria-label={`账户菜单，${user.name}${showStatus ? `，${statusLabel(status)}` : ''}`}
      {...(sheet
        ? {
            'aria-haspopup': 'menu' as const,
            'aria-expanded': open,
            'aria-controls': open ? sheetMenuId : undefined,
            onClick: () => onOpenChange(!open),
          }
        : {})}
    >
      <Face user={user} status={showStatus ? status : undefined} size="sm" />
      {revealName ? (
        <>
          <span
            className={cn(
              'truncate font-medium leading-none',
              sidebar ? 'min-w-0 flex-1 text-left' : 'max-w-44 max-sm:hidden',
              // 折叠 rail 内只留头像；group-data 命中 Sidebar 外层 group
              'group-data-[collapsible=icon]:hidden',
            )}
          >
            {user.name}
          </span>
          <ChevronDown
            className={cn(
              'size-4 shrink-0 transition-transform duration-300 group-data-[state=open]/user-menu:rotate-180',
              sidebar
                ? 'ml-auto text-sidebar-foreground/60 group-hover/user-menu:text-sidebar-foreground group-data-[state=open]/user-menu:text-sidebar-foreground'
                : '-ml-0.5 text-muted-foreground group-hover/user-menu:text-foreground group-data-[state=open]/user-menu:text-foreground max-sm:hidden',
              'group-data-[collapsible=icon]:hidden',
            )}
            aria-hidden="true"
          />
        </>
      ) : null}
    </button>
  );
}
