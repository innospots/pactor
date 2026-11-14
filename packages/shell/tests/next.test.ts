import { describe, expect, it } from 'vitest';

import { withShell } from '../src/next.js';

describe('withShell', () => {
  it('合并并去重 transpilePackages', () => {
    const config = withShell(
      { transpilePackages: ['risk-analysis'] },
      { transpilePackages: ['risk-analysis', 'risk-decision'] },
    );
    expect(config.transpilePackages).toEqual(['risk-analysis', 'risk-decision']);
  });

  it('无既有配置时产出空数组', () => {
    expect(withShell({}).transpilePackages).toEqual([]);
  });

  it('其余字段原样透传', () => {
    expect(withShell({ reactStrictMode: true }).reactStrictMode).toBe(true);
  });
});
