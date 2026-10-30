import { describe, expect, it } from 'vitest';
import { GET, PATCH } from '../starters/next-app-starter/src/backend/mock/system-settings';

const url = 'http://localhost/api/d/system-settings';
const headers = { cookie: 'pactor_demo_session=admin', 'content-type': 'application/json' };

describe('starter system settings mock', () => {
  it('saves a valid setting and rejects invalid values without changing it', async () => {
    const patch = (value: string) => PATCH(new Request(url, {
      method: 'PATCH', headers, body: JSON.stringify({ key: 'language', value }),
    }));
    expect((await patch('en-US')).status).toBe(200);
    expect((await patch('invalid')).status).toBe(400);
    const settings = await (await GET(new Request(url, { headers }))).json();
    expect(settings.language).toBe('en-US');
    expect((await GET(new Request(url))).status).toBe(401);
  });
});
