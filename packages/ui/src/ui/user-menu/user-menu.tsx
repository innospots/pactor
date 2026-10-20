import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';

import { cn } from '../../lib/utils.js';
import { UserMenuDropdown } from './menu-dropdown.js';
import { UserMenuSheet } from './menu-sheet.js';
import { UserMenuTrigger } from './trigger.js';
import type {
  ThemePreference,
  UserMenuItem,
  UserMenuProps,
  UserStatus,
} from './types.js';

const compactQuery = '(max-width: 639px)';

function subscribeCompact(change: () => void): () => void {
  const query = window.matchMedia(compactQuery);
  query.addEventListener('change', change);
  return () => query.removeEventListener('change', change);
}

const subscribeNothing = () => () => {};

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
 *
 * `variant="sidebar"` 适配侧栏（Sidebar / SidebarFooter）：
 * - 展开：整行账户行（头像 + 姓名 + chevron），面板缺省向右展开；
 * - Sidebar `collapsible="icon"` 折叠：经 `group-data-[collapsible=icon]`
 *   自动收成 32px 头像圆钮，仅保留头像（有无 Sidebar context 均可）。
 *
 * 内部按职责拆分：types（公开契约）/ options（状态与主题选项）/
 * presence-dot / parts（共用行件）/ trigger / menu-dropdown /
 * menu-sheet，本文件仅持有人菜单状态与组合。
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
  side,
  variant = 'default',
  showName,
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
  const sidebar = variant === 'sidebar';
  // sidebar 形态展开时默认展示姓名；折叠态由 Sidebar 的 group-data 收起
  const revealName = showName ?? sidebar;

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

  const selectItem = (item: UserMenuItem): void => {
    item.onSelect?.();
  };

  const trigger = (
    <UserMenuTrigger
      open={open}
      sheet={sheet}
      sidebar={sidebar}
      revealName={revealName}
      showStatus={showStatus}
      status={status}
      user={user}
      triggerId={triggerId}
      sheetMenuId={sheetMenuId}
      setTriggerRef={setTriggerRef}
      triggerClassName={triggerClassName}
      onOpenChange={changeOpen}
    />
  );

  return (
    <span
      data-slot="user-menu"
      data-variant={sidebar ? 'sidebar' : 'default'}
      className={cn(
        'relative inline-flex flex-none align-middle',
        // 展开时占满侧栏宽度；折叠为 icon rail 时收成头像宽度，
        // 由 SidebarFooter 的居中（DSL 折叠态 items-center）定位
        sidebar &&
          'w-full group-data-[collapsible=icon]:w-8',
        className,
      )}
      style={style}
    >
      {sheet ? (
        <>
          {trigger}
          <UserMenuSheet
            open={open}
            onOpenChange={changeOpen}
            user={user}
            items={items}
            showStatus={showStatus}
            showTheme={showTheme}
            status={status}
            theme={theme}
            signingOut={signingOut}
            sheetMenuId={sheetMenuId}
            onSelectItem={(item) => {
              changeOpen(false);
              item.onSelect?.();
            }}
            onStatusChange={changeStatus}
            onThemeChange={changeTheme}
            onSignOut={signOut}
          />
        </>
      ) : (
        <UserMenuDropdown
          trigger={trigger}
          open={open}
          onOpenChange={changeOpen}
          user={user}
          items={items}
          showStatus={showStatus}
          showTheme={showTheme}
          status={status}
          theme={theme}
          signingOut={signingOut}
          align={align}
          side={side ?? (sidebar ? 'right' : 'bottom')}
          signOutKeys={signOutKeys}
          onSelectItem={selectItem}
          onStatusChange={changeStatus}
          onThemeChange={changeTheme}
          onSignOut={signOut}
        />
      )}
    </span>
  );
}
