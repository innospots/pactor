import type { ReactElement } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu.js';
import {
  Keys,
  MenuHeader,
  PreferenceRows,
  RowIcon,
  SignOutContent,
} from './parts.js';
import type {
  ThemePreference,
  UserMenuItem,
  UserMenuUser,
  UserStatus,
} from './types.js';

const itemRowClass =
  'group relative flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] text-foreground outline-hidden select-none focus:bg-foreground/[0.06] data-highlighted:bg-foreground/[0.06]';

export interface UserMenuDropdownProps {
  trigger: ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserMenuUser;
  items: UserMenuItem[];
  showStatus: boolean;
  showTheme: boolean;
  status: UserStatus;
  theme: ThemePreference;
  signingOut: boolean;
  align: 'start' | 'center' | 'end';
  side: 'top' | 'right' | 'bottom' | 'left';
  signOutKeys?: string[];
  onSelectItem: (item: UserMenuItem) => void;
  onStatusChange: (status: UserStatus) => void;
  onThemeChange: (theme: ThemePreference) => void;
  onSignOut: () => void;
}

/** 桌面下拉菜单（Base UI Menu） */
export function UserMenuDropdown({
  trigger,
  open,
  onOpenChange,
  user,
  items,
  showStatus,
  showTheme,
  status,
  theme,
  signingOut,
  align,
  side,
  signOutKeys,
  onSelectItem,
  onStatusChange,
  onThemeChange,
  onSignOut,
}: UserMenuDropdownProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent
        align={align}
        side={side}
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
                onClick={() => onSelectItem(item)}
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
            <PreferenceRows
              sheet={false}
              showStatus={showStatus}
              showTheme={showTheme}
              status={status}
              theme={theme}
              onStatusChange={onStatusChange}
              onThemeChange={onThemeChange}
            />
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          label="退出登录"
          closeOnClick={false}
          aria-busy={signingOut || undefined}
          onClick={onSignOut}
          className={itemRowClass}
        >
          <SignOutContent signingOut={signingOut} keys={signOutKeys} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
