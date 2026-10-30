import { expect, it } from 'vitest';
import { GET, PUT } from '../starters/next-app-starter/src/backend/mock/roles';

it('preserves grant constraints when saving and reloading role permissions', async () => {
  const parts = ['platform', 'roles', 'demo-admin', 'permissions'];
  const request = new Request('http://localhost/api/d/platform/roles/demo-admin/permissions', {
    method: 'PUT', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ grants: [{ resourceKey: 'view:dashboard', constraintDefinition: 'owner-only' }] }),
  });
  const saved = await PUT(request, parts);
  expect(saved?.status).toBe(200);
  const loaded = await GET(new Request(request.url), parts);
  expect((await loaded?.json()).grants).toEqual([
    { resourceKey: 'view:dashboard', displayName: 'view:dashboard', constraintDefinition: 'owner-only' },
  ]);
});
