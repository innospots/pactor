import { useI18n } from '@pactor-app/runtime';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { useState } from 'react';

import { cn } from '../../lib/utils.js';
import { Drawer, DrawerContent, DrawerTitle } from '../drawer.js';
import { Separator } from '../separator.js';
import {
  Keys,
  MenuHeader,
  PreferenceRows,
  RowIcon,
  SignOutContent,
} from './parts.js';
import { languageLabel } from './options.js';
import type {
  LanguageOption,
  LanguagePreference,
  ThemePreference,
  UserMenuItem,
  UserMenuUser,
  UserStatus,
} from './types.js';

const sheetRowClass =
  'group relative flex h-[46px] w-full items-center gap-2.5 rounded-md px-2 text-left text-base text-foreground outline-hidden select-none transition-colors focus-visible:bg-foreground/[0.06] active:bg-foreground/[0.06]';

/** 抽屉内的语言行：点击展开展示语言单选（抽屉不支持悬浮子菜单） */
function LanguageDisclosure({
  language,
  languages,
  onLanguageChange,
}: {
  language: LanguagePreference;
  languages: LanguageOption[];
  onLanguageChange: (language: LanguagePreference) => void;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('pactor.userMenu.languageWithCurrent', {
          language: languageLabel(language, languages),
        })}
        className={sheetRowClass}
        onClick={() => setOpen((value) => !value)}
      >
        <RowIcon>
          <Languages size={16} strokeWidth={1.75} />
        </RowIcon>
        <span className="min-w-0 flex-1 truncate">
          {t('pactor.userMenu.language')}
        </span>
        <span className="shrink-0 text-sm text-muted-foreground">
          {languageLabel(language, languages)}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
          className={cn(
            'shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      {open ? (
        <div role="group" aria-label={t('pactor.userMenu.language')}>
          {languages.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={option.value === language}
              className={cn(sheetRowClass, 'h-10 pl-8')}
              onClick={() => onLanguageChange(option.value)}
            >
              <span className="min-w-0 flex-1 truncate">{option.label}</span>
              <Check
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className={cn(
                  'shrink-0',
                  option.value === language ? 'opacity-100' : 'opacity-0',
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}

export interface UserMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserMenuUser;
  items: UserMenuItem[];
  showStatus: boolean;
  showTheme: boolean;
  showLanguage: boolean;
  status: UserStatus;
  theme: ThemePreference;
  language: LanguagePreference;
  languages: LanguageOption[];
  signingOut: boolean;
  sheetMenuId: string;
  onSelectItem: (item: UserMenuItem) => void;
  onStatusChange: (status: UserStatus) => void;
  onThemeChange: (theme: ThemePreference) => void;
  onLanguageChange: (language: LanguagePreference) => void;
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
  showLanguage,
  status,
  theme,
  language,
  languages,
  signingOut,
  sheetMenuId,
  onSelectItem,
  onStatusChange,
  onThemeChange,
  onLanguageChange,
  onSignOut,
}: UserMenuSheetProps) {
  const { t } = useI18n();
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
        <DrawerTitle className="sr-only">
          {t('pactor.userMenu.title')}
        </DrawerTitle>
        <div
          id={sheetMenuId}
          role="menu"
          aria-label={t('pactor.userMenu.trigger', { name: user.name })}
          data-slot="user-menu-panel"
          className="min-h-0 overflow-y-auto text-left text-[13px] text-foreground"
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
          {showLanguage || showTheme || showStatus ? (
            <>
              <Separator className="my-1" />
              {showLanguage ? (
                <LanguageDisclosure
                  language={language}
                  languages={languages}
                  onLanguageChange={onLanguageChange}
                />
              ) : null}
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
