import { Drawer, DrawerContent, DrawerTitle } from '../drawer.js';
import { Separator } from '../separator.js';
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

const sheetRowClass =
  'group relative flex h-[46px] w-full items-center gap-2.5 rounded-md px-2 text-left text-base text-foreground outline-hidden select-none transition-colors focus-visible:bg-foreground/[0.06] active:bg-foreground/[0.06]';

export interface UserMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserMenuUser;
  items: UserMenuItem[];
  showStatus: boolean;
  showTheme: boolean;
  status: UserStatus;
  theme: ThemePreference;
  signingOut: boolean;
  sheetMenuId: string;
  onSelectItem: (item: UserMenuItem) => void;
  onStatusChange: (status: UserStatus) => void;
  onThemeChange: (theme: ThemePreference) => void;
  onSignOut: () => void;
}

/** 窄屏底部抽屉面板（vaul Drawer） */
export function UserMenuSheet({
  open,
  onOpenChange,
  user,
  items,
  showStatus,
  showTheme,
  status,
  theme,
  signingOut,
  sheetMenuId,
  onSelectItem,
  onStatusChange,
  onThemeChange,
  onSignOut,
}: UserMenuSheetProps) {
  return (
    <Drawer
      direction="bottom"
      modal={false}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerContent
        data-slot="user-menu-sheet"
        className="rounded-t-2xl border-x-0 border-b-0 px-2 pt-0 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-2xl data-[vaul-drawer-direction=bottom]:max-h-[88dvh] data-[vaul-drawer-direction=bottom]:rounded-t-2xl [--presence-surface:var(--popover)]"
        overlayProps={{
          'data-slot': 'user-menu-scrim',
          'aria-hidden': true,
          className: 'animate-in fade-in-0 duration-200',
          onClick: () => onOpenChange(false),
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
                  onClick={() => onSelectItem(item)}
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
              <PreferenceRows
                sheet
                showStatus={showStatus}
                showTheme={showTheme}
                status={status}
                theme={theme}
                onStatusChange={onStatusChange}
                onThemeChange={onThemeChange}
              />
            </>
          ) : null}
          <Separator className="my-1" />
          <button
            type="button"
            role="menuitem"
            aria-busy={signingOut || undefined}
            className={sheetRowClass}
            onClick={onSignOut}
          >
            <SignOutContent signingOut={signingOut} />
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
