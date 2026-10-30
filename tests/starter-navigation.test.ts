import { describe, expect, it } from 'vitest';
import { createNavigationRegistry, findNavigationMenu, type NavMenu } from '../starters/next-app-starter/src/frontend/components/layout/navigation-shell';

describe('starter navigation registry', () => {
  const menus: NavMenu[] = [
    { id: 'workspace', type: 'page', path: '/workspace' },
    { id: 'analytics', type: 'group', children: [
      { id: 'monthly', type: 'page', path: '/reports/monthly' },
    ] },
    { id: 'monthly-detail', type: 'page', path: '/reports/monthly/:id', hidden: true, activeMenu: 'monthly' },
    { id: 'roles', type: 'group', children: [{ id: 'role-list', path: '/settings/roles' }] },
    { id: 'role-detail', type: 'page', path: '/settings/roles/:roleId', hidden: true, activeMenu: 'role-list' },
  ];

  it('matches server routes and resolves hidden detail pages to their parent menu', () => {
    const registry = createNavigationRegistry(menus);
    expect(registry.findByPath('/workspace')?.menu.id).toBe('workspace');
    expect(registry.findByPath('/reports/monthly/2026-10')?.menu.activeMenu).toBe('monthly');
    expect(registry.findByPath('/settings/roles/demo-admin')?.menu.activeMenu).toBe('role-list');
    expect(registry.tree().some((item) => item.id === 'role-detail')).toBe(false);
    expect(registry.findByPath('/reports/monthly/2026-10/extra')).toBeNull();
  });

  it('highlights visible parents when the session menu omits hidden routes', () => {
    const registry = createNavigationRegistry([
      { key: '/workspace', label: 'Workspace' },
      { key: 'analytics', label: 'Analytics', children: [{ key: '/reports/monthly', label: 'Reports' }] },
      { key: 'system', label: 'System', children: [{ key: '/settings/roles', label: 'Roles' }] },
    ]);
    expect(findNavigationMenu(registry, '/reports/monthly/2026-10')?.id).toBe('/reports/monthly');
    expect(findNavigationMenu(registry, '/settings/roles/demo-admin')?.id).toBe('/settings/roles');
    expect(findNavigationMenu(registry, '/workspace')?.id).toBe('/workspace');
  });
});
