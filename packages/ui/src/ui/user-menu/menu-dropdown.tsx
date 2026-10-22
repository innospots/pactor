import { useI18n } from '@pactor-app/runtime';
import { Check, Languages } from 'lucide-react';
import type { ReactElement } from 'react';

import { cn } from '../../lib/utils.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../dropdown-menu.js';
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

const itemRowClass =
  'group relative flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] text-foreground outline-hidden select-none focus:bg-foreground/[0.06] data-highlighted:bg-foreground/[0.06]';

/** 语言子菜单：点击触发项向右展开语言单选（键盘 → 亦可展开） */
function LanguageSubmenu({
  language,
  languages,
  onLanguageChange,
}: {
  language: LanguagePreference;
  languages: LanguageOption[];
  onLanguageChange: (language: LanguagePreference) => void;
}) {
  const { t } = useI18n();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger
        label={t('pactor.userMenu.language')}
        aria-label={t('pactor.userMenu.languageWithCurrent', {
          language: languageLabel(language, languages),
        })}
        openOnHover={false}
        className={itemRowClass}
      >
        <RowIcon>
          <Languages size={16} strokeWidth={1.75} />
        </RowIcon>
        <span className="min-w-0 flex-1 truncate">
          {t('pactor.userMenu.language')}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">
          {languageLabel(language, languages)}
        </span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent
        data-slot="user-menu-language"
        className="max-h-(--available-height) min-w-[9.5rem] max-w-[calc(100vw-24px)] overflow-x-hidden overflow-y-auto rounded-[10px] border-[0.5px] p-1 text-left text-[13px] shadow-lg [--presence-surface:var(--popover)]"
      >
        <DropdownMenuRadioGroup
          value={language}
          onValueChange={(next) => onLanguageChange(next)}
          aria-label={t('pactor.userMenu.language')}
        >
          {languages.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              label={option.label}
              closeOnClick={false}
              className={itemRowClass}
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
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

export interface UserMenuDropdownProps {
  trigger: ReactElement;
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
  align: 'start' | 'center' | 'end';
  side: 'top' | 'right' | 'bottom' | 'left';
  signOutKeys?: string[];
  onSelectItem: (item: UserMenuItem) => void;
  onStatusChange: (status: UserStatus) => void;
  onThemeChange: (theme: ThemePreference) => void;
  onLanguageChange: (language: LanguagePreference) => void;
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
  showLanguage,
  status,
  theme,
  language,
  languages,
  signingOut,
  align,
  side,
  signOutKeys,
  onSelectItem,
  onStatusChange,
  onThemeChange,
  onLanguageChange,
  onSignOut,
}: UserMenuDropdownProps) {
  const { t } = useI18n();
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
        {showLanguage || showTheme || showStatus ? (
          <>
            <DropdownMenuSeparator />
            {showLanguage ? (
              <LanguageSubmenu
                language={language}
                languages={languages}
                onLanguageChange={onLanguageChange}
              />
            ) : null}
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
          label={t('pactor.userMenu.signOut')}
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
