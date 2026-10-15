/**
 * 左侧分类导航顶栏（React 岛）：搜索框 + 分类 Tabs（小尺寸）。
 * - Tabs 复用 vendored ui Tabs（default 胶囊变体，size=sm 小尺寸），
 *   触发器 render 为 <a>：SSR 直出真实链接，水合前也可点击跳转；
 * - 搜索框实时过滤当前分类的菜单项（操作 SideNav.astro 服务端渲染的
 *   #sideMenu .menu-item DOM，按 data-search 匹配，同 FilterBar 渐进增强模式）。
 */
import { useCallback, useState } from 'react';
import { Input } from '@pactor-app/ui/ui';
import { Tabs, TabsList, TabsTrigger } from '@pactor-app/ui/ui';
import { Icon } from '@pactor-app/ui/components';

export interface SideNavTab {
  key: string;
  label: string;
  href: string;
  /** 图标名（Icon 白名单）；未激活页签仅展示图标，激活页签展示图标 + 文字 */
  icon: string;
}

interface Props {
  tabs: SideNavTab[];
  activeKey: string;
}

export default function SideNavBar({ tabs, activeKey }: Props) {
  const [query, setQuery] = useState('');

  const filterMenu = useCallback((value: string) => {
    setQuery(value);
    const keyword = value.trim().toLowerCase();
    // 平铺菜单项（非组件分类）
    document
      .querySelectorAll<HTMLElement>('#sideMenu > .menu-item')
      .forEach((item) => {
        const name = (item.dataset.search ?? '').toLowerCase();
        item.style.display = keyword === '' || name.includes(keyword) ? '' : 'none';
      });
    // 可折叠菜单组（组件分类）：组名或任一子项命中即展示整组；
    // 搜索时强制展开命中组，清空后恢复默认展开状态
    document
      .querySelectorAll<HTMLDetailsElement>('#sideMenu .menu-group')
      .forEach((group) => {
        const groupName = (group.dataset.search ?? '').toLowerCase();
        const groupHit = keyword !== '' && groupName.includes(keyword);
        let childHit = false;
        group.querySelectorAll<HTMLElement>('.menu-subitem').forEach((child) => {
          const hit =
            keyword === '' ||
            groupHit ||
            (child.dataset.search ?? '').toLowerCase().includes(keyword);
          child.style.display = hit ? '' : 'none';
          if (keyword !== '' && hit && !groupHit) childHit = true;
        });
        const show = keyword === '' || groupHit || childHit;
        group.style.display = show ? '' : 'none';
        group.open =
          keyword === '' ? group.dataset.defaultOpen === 'true' : show;
      });
  }, []);

  return (
    <div className="side-nav-bar">
      <Input
        value={query}
        onChange={(e) => filterMenu(e.target.value)}
        placeholder="搜索菜单…"
        aria-label="搜索当前分类菜单"
        className="h-8 text-xs"
      />
      <Tabs value={activeKey}>
        <TabsList size="sm" className="w-full">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className={tab.key === activeKey ? 'p-2 text-xs' : 'px-1 text-xs'}
              title={tab.label}
              render={<a href={tab.href} aria-label={tab.label} />}
            >
              <Icon name={tab.icon} size={14} />
              {tab.key === activeKey ? <span>{tab.label}</span> : null}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
