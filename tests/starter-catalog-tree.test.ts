import { describe, expect, it } from 'vitest';
import { filterTree, mapCatalogNodes } from '../starters/next-app-starter/src/frontend/components/settings/catalog-tree';
import { updateGrantSelection } from '../starters/next-app-starter/src/frontend/components/settings/permission-grant-panel';

describe('starter permission catalog', () => {
  const source = [{
    resourceKey: 'system', displayName: { 'zh-CN': '系统管理', 'en-US': 'System' },
    children: [
      { resourceKey: 'users', displayName: { 'zh-CN': '用户', 'en-US': 'Users' } },
      { resourceKey: 'roles', displayName: { 'zh-CN': '角色', 'en-US': 'Roles' } },
    ],
  }];

  it('localizes catalog nodes and filters without retaining unrelated children', () => {
    const nodes = mapCatalogNodes(source, 'en-US', 'zh-CN');
    expect(nodes[0].title).toBe('System');
    expect(filterTree(nodes, 'users')[0].children?.map((child) => child.title)).toEqual(['Users']);
    expect(filterTree(nodes, 'system')[0].children).toBeUndefined();
    expect(filterTree(nodes, 'missing')).toEqual([]);
    expect(mapCatalogNodes(source, 'zh-CN', 'en-US')[0].children?.[1].title).toBe('角色');
  });

  it('retains unrelated grants and their constraints when changing a selection', () => {
    const grants = [{ resourceKey: 'unknown', constraintDefinition: 'owner-only' }, { resourceKey: 'users' }];
    expect(updateGrantSelection(grants, 'roles', true)).toEqual([...grants, { resourceKey: 'roles' }]);
    expect(updateGrantSelection(grants, 'users', false)).toEqual([grants[0]]);
    expect(updateGrantSelection(grants, 'unknown', true)).toEqual(grants);
  });
});
