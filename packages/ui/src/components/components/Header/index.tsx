import { useI18n } from '@pactor-app/runtime';
import { ChevronDownIcon } from 'lucide-react';
import { useState, type CSSProperties, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar.js';
import {
  DropdownMenu as DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu.js';
import { Icon } from '../Icon/index.js';
import {
  renderDropdownItems,
  type DropdownMenuItemData,
} from '../DropdownMenu/index.js';

/** 品牌区位置（缺省 'left'） */
export type HeaderBrandPosition = 'left' | 'right';

/** 通用下拉项（复用 DropdownMenu 菜单项：支持 icon/trailing/selected/separator/children） */
export type HeaderDropdownItem = DropdownMenuItemData;

/** 通用下拉区配置 */
export interface HeaderDropdown {
  label: string;
  items: HeaderDropdownItem[];
  /** 渲染位置（缺省 'left'） */
  position?: 'left' | 'right';
}

/** 菜单项；`children` 为弹出式子菜单 */
export interface HeaderMenuItem {
  key: string;
  label: string;
  /** 图标名（Icon 白名单，kebab/Pascal 均可），渲染于文字前 */
  icon?: string;
  children?: HeaderMenuItem[];
}

/** 用户区菜单项（复用 DropdownMenu 菜单项：支持 icon/trailing/selected/separator/children） */
export type HeaderUserItem = DropdownMenuItemData;

/** 用户区配置；`items` 缺省或为空时退化为纯展示（无下拉） */
export interface HeaderUser {
  name: string;
  avatar?: string;
  items?: HeaderUserItem[];
}

/** 语言选项 */
export interface HeaderLocale {
  label: string;
  value: string;
}

/** 深浅色主题（themeToggle 切换结果） */
export type HeaderTheme = 'light' | 'dark';

export interface HeaderProps {
  /** 品牌区 logo 图片地址（可含表达式） */
  logo?: string;
  /** 品牌区标题文本 */
  title?: string;
  /** 品牌区位置（缺省 'left'） */
  brandPosition?: HeaderBrandPosition;
  /** 通用下拉区 */
  dropdown?: HeaderDropdown;
  /** 横向菜单（可含表达式），语义复用 horizontal Menu（含子菜单） */
  menu?: HeaderMenuItem[];
  /** 用户区 */
  user?: HeaderUser;
  /** 国际化切换选项 */
  locales?: HeaderLocale[];
  /** 右侧展示深浅色切换按钮（缺省 false）；点击切换 documentElement 的 data-pactor-theme */
  themeToggle?: boolean;
  /** 主题切换事件，传出切换后的主题（'light' | 'dark'） */
  onThemeChange?: (theme: HeaderTheme) => void;
  /** 菜单选中事件，传出选中项 key */
  onMenuSelect?: (key: string) => void;
  /** 通用下拉选中事件，传出选中项 value */
  onDropdownSelect?: (value: string) => void;
  /** 用户区菜单选中事件，传出选中项 value */
  onUserSelect?: (value: string) => void;
  /** 语言切换事件，传出选中的 locale 值 */
  onLocaleChange?: (locale: string) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  children?: ReactNode;
}

/** 与 horizontal Menu 对齐的菜单项类名 */
const menuItemClass =
  'flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors text-muted-foreground hover:bg-accent/50 hover:text-foreground';

/**
 * Header 顶部区域（shadcn kit，语义对齐 antd Layout.Header）：
 * 横向 flex、垂直居中、默认下边框。除 children 外可携带六个可选结构
 * 区域（品牌区 / 通用下拉 / 横向菜单 / 深浅色切换 / 用户区 / 国际化切换）；
 * 全部区域 props 缺省时退化为纯容器。
 *
 * 排布固定：左区（品牌?→下拉?→菜单?）— flex-1 中区（children）—
 * 右区（下拉?→品牌?→主题切换?→locales→user）。区域内部直接组合 src/ui 原语
 * （dropdown-menu / avatar），事件值透传给 Header 自身的事件 props。
 */
export function Header({
  logo,
  title,
  brandPosition = 'left',
  dropdown,
  menu,
  user,
  locales,
  themeToggle = false,
  onThemeChange,
  onMenuSelect,
  onDropdownSelect,
  onUserSelect,
  onLocaleChange,
  className,
  style,
  children,
}: HeaderProps) {
  const hasBrand = logo !== undefined || title !== undefined;
  const brandLeft = hasBrand && brandPosition === 'left';
  const brandRight = hasBrand && brandPosition === 'right';
  const dropdownLeft = dropdown !== undefined && (dropdown.position ?? 'left') === 'left';
  const dropdownRight = dropdown !== undefined && dropdown.position === 'right';
  const hasMenu = menu !== undefined && menu.length > 0;
  const hasLocales = locales !== undefined && locales.length > 0;
  const hasUser = user !== undefined;

  const rootClass = cn(
    'flex h-14 shrink-0 items-center gap-4 border-b bg-card px-4',
    className,
  );

  // 纯容器回归：全部区域缺省时输出与变更前一致
  if (!hasBrand && !dropdown && !hasMenu && !hasUser && !hasLocales && !themeToggle) {
    return (
      <header data-slot="layout-header" className={rootClass} style={style}>
        {children}
      </header>
    );
  }

  const brandNode = hasBrand && (
    <div data-slot="header-brand" className="flex items-center gap-2">
      {logo !== undefined && (
        <img
          data-slot="header-brand-logo"
          src={logo}
          alt={title ?? ''}
          className="size-6 shrink-0 object-contain"
        />
      )}
      {title !== undefined && (
        <span data-slot="header-brand-title" className="text-base font-semibold">
          {title}
        </span>
      )}
    </div>
  );
  const dropdownNode = dropdown !== undefined && (
    <HeaderDropdownArea dropdown={dropdown} onSelect={onDropdownSelect} />
  );

  const showLeft = brandLeft || dropdownLeft || hasMenu;
  const showRight = dropdownRight || brandRight || hasLocales || hasUser || themeToggle;

  return (
    <header data-slot="layout-header" className={rootClass} style={style}>
      {showLeft && (
        <div data-slot="header-left" className="flex items-center gap-4">
          {brandLeft && brandNode}
          {dropdownLeft && dropdownNode}
          {hasMenu && <HeaderMenuArea items={menu} onSelect={onMenuSelect} />}
        </div>
      )}
      <div data-slot="header-center" className="flex flex-1 items-center gap-4">
        {children}
      </div>
      {showRight && (
        <div data-slot="header-right" className="flex items-center gap-4">
          {dropdownRight && dropdownNode}
          {brandRight && brandNode}
          {themeToggle && <HeaderThemeToggle onSelect={onThemeChange} />}
          {hasLocales && (
            <HeaderLocalesArea locales={locales} onSelect={onLocaleChange} />
          )}
          {hasUser && <HeaderUserArea user={user} onSelect={onUserSelect} />}
        </div>
      )}
    </header>
  );
}

/** 通用下拉区：label 触发器（含展开指示）+ items，选中透传 value */
function HeaderDropdownArea({
  dropdown,
  onSelect,
}: {
  dropdown: HeaderDropdown;
  onSelect?: (value: string) => void;
}) {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger
        data-slot="header-dropdown"
        className={cn(menuItemClass, 'outline-hidden cursor-pointer')}
      >
        {dropdown.label}
        <ChevronDownIcon className="size-3.5" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {renderDropdownItems(dropdown.items, onSelect)}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

/** 横向菜单区：叶子项直选，含 children 的项弹出子菜单（可嵌套） */
function HeaderMenuArea({
  items,
  onSelect,
}: {
  items: HeaderMenuItem[];
  onSelect?: (key: string) => void;
}) {
  return (
    <nav data-slot="header-menu" className="flex items-center gap-1">
      {items.map((item) =>
        item.children !== undefined && item.children.length > 0 ? (
          <DropdownMenuRoot key={item.key}>
            <DropdownMenuTrigger
              data-slot="header-menu-item"
              data-key={item.key}
              className={cn(menuItemClass, 'outline-hidden cursor-pointer')}
            >
              {item.icon ? <Icon name={item.icon} size="sm" /> : null}
              {item.label}
              <ChevronDownIcon className="size-3.5" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {item.children.map((child) => (
                <HeaderMenuEntry key={child.key} item={child} onSelect={onSelect} />
              ))}
            </DropdownMenuContent>
          </DropdownMenuRoot>
        ) : (
          <button
            key={item.key}
            type="button"
            data-slot="header-menu-item"
            data-key={item.key}
            className={menuItemClass}
            onClick={() => onSelect?.(item.key)}
          >
            {item.icon ? <Icon name={item.icon} size="sm" /> : null}
            {item.label}
          </button>
        ),
      )}
    </nav>
  );
}

/** 弹出层内的菜单项：嵌套 children 经 Submenu 递归 */
function HeaderMenuEntry({
  item,
  onSelect,
}: {
  item: HeaderMenuItem;
  onSelect?: (key: string) => void;
}) {
  if (item.children !== undefined && item.children.length > 0) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger data-key={item.key} className="cursor-pointer">
          {item.icon ? <Icon name={item.icon} size="sm" /> : null}
          {item.label}
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          {item.children.map((child) => (
            <HeaderMenuEntry key={child.key} item={child} onSelect={onSelect} />
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  }
  return (
    <DropdownMenuItem data-key={item.key} onClick={() => onSelect?.(item.key)}>
      {item.icon ? <Icon name={item.icon} size="sm" /> : null}
      {item.label}
    </DropdownMenuItem>
  );
}

/** 用户区：头像（缺省用户名首字符占位）+ 用户名；items 非空时为下拉 */
function HeaderUserArea({
  user,
  onSelect,
}: {
  user: HeaderUser;
  onSelect?: (value: string) => void;
}) {
  const identity = (
    <>
      <Avatar className="size-7">
        {user.avatar !== undefined && (
          <AvatarImage src={user.avatar} alt={user.name} />
        )}
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-sm">{user.name}</span>
    </>
  );

  if (user.items === undefined || user.items.length === 0) {
    return (
      <div data-slot="header-user" className="flex items-center gap-2">
        {identity}
      </div>
    );
  }

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger
        data-slot="header-user"
        className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors outline-hidden hover:bg-accent/50 cursor-pointer"
      >
        {identity}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {renderDropdownItems(user.items, onSelect)}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

/** 国际化切换：触发器显示当前 locale 对应 label（未命中显示 value），只发事件 */
function HeaderLocalesArea({
  locales,
  onSelect,
}: {
  locales: HeaderLocale[];
  onSelect?: (locale: string) => void;
}) {
  const { locale } = useI18n();
  const current = locales.find((option) => option.value === locale);
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger
        data-slot="header-locales"
        className={cn(menuItemClass, 'outline-hidden cursor-pointer')}
      >
        {current?.label ?? locale}
        <ChevronDownIcon className="size-3.5" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSelect?.(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

/** 读取当前主题（documentElement 的 data-pactor-theme，缺省 light） */
function readCurrentTheme(): HeaderTheme {
  if (typeof document === 'undefined') {
    return 'light';
  }
  return document.documentElement.getAttribute('data-pactor-theme') === 'dark'
    ? 'dark'
    : 'light';
}

/**
 * 深浅色切换：点击时按 documentElement 当前值翻转 data-pactor-theme
 *（dark ↔ 移除），图标随状态切换（dark 显 sun / light 显 moon）；
 * 与 chat 包 WorkspaceHeader 的内建 theme 操作同款语义。
 */
function HeaderThemeToggle({
  onSelect,
}: {
  onSelect?: (theme: HeaderTheme) => void;
}) {
  const { t } = useI18n();
  const [theme, setTheme] = useState<HeaderTheme>(readCurrentTheme);

  const handleToggle = (): void => {
    const next = readCurrentTheme() === 'dark' ? 'light' : 'dark';
    if (next === 'dark') {
      document.documentElement.setAttribute('data-pactor-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-pactor-theme');
    }
    setTheme(next);
    onSelect?.(next);
  };

  return (
    <button
      type="button"
      data-slot="header-theme-toggle"
      className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
      title={theme === 'dark' ? t('pactor.header.themeToLight') : t('pactor.header.themeToDark')}
      aria-label={t('pactor.header.themeToggle')}
      onClick={handleToggle}
    >
      {theme === 'dark' ? (
        <Icon name="sun" size="sm" />
      ) : (
        <Icon name="moon" size="sm" />
      )}
    </button>
  );
}
