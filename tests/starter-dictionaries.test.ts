import { describe, expect, it } from 'vitest';
import { GET, POST } from '../starters/next-app-starter/src/backend/mock/dictionaries';

const headers = { cookie: 'pactor_demo_session=admin', 'content-type': 'application/json' };
const endpoint = 'http://localhost/api/d/dictionaries';

describe('starter dictionary mock', () => {
  it('creates entries and filters and paginates the resulting list', async () => {
    for (let index = 0; index < 11; index++) {
      const response = await POST(new Request(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          id: '', code: `PAGINATION_TEST_${index}`, name: `Pagination test ${index}`,
          status: index === 0 ? 'DISABLED' : 'ENABLED', items: [{ itemValue: 'A', itemName: 'Example' }],
        }),
      }));
      expect(response.status).toBe(200);
    }

    const get = async (query: string) => (await GET(new Request(`${endpoint}?${query}`, { headers }))).json();
    const first = await get('keyword=PAGINATION_TEST&page=1');
    const second = await get('keyword=PAGINATION_TEST&page=2');
    expect(first.total).toBe(11);
    expect(first.records).toHaveLength(10);
    expect(second.records).toHaveLength(1);
    expect(first.records.some((row: { id: string }) => row.id === second.records[0].id)).toBe(false);
    const disabled = await get('keyword=PAGINATION_TEST&status=DISABLED&page=1');
    expect(disabled.total).toBe(1);
    expect(disabled.records[0].code).toBe('PAGINATION_TEST_0');
  });
});
