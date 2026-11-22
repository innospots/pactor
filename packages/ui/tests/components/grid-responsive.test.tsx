// @vitest-environment jsdom
/**
 * Grid 窄视口收列（responsive）：视口 <576px 时 2 列收为 1 列、≥3 列收为 2 列；
 * responsive: false 显式关闭。
 */
import './setup.js';

import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { renderDsl } from './helpers.js';

afterEach(cleanup);

const narrowMatchMedia = ((query: string) => ({
  matches: query.includes('max-width'),
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})) as typeof window.matchMedia;

function renderGrid(props: Record<string, unknown>) {
  return renderDsl({
    type: 'Grid',
    props,
    children: [
      { type: 'Text', props: { text: 'a' } },
      { type: 'Text', props: { text: 'b' } },
      { type: 'Text', props: { text: 'c' } },
      { type: 'Text', props: { text: 'd' } },
    ],
  });
}

describe('Grid responsive', () => {
  it('窄视口：4 列收为 2 列', () => {
    const original = window.matchMedia;
    window.matchMedia = narrowMatchMedia;
    try {
      const { container } = renderGrid({ columns: 4 });
      const grid = container.querySelector('[data-slot=grid]') as HTMLElement;
      expect(grid.getAttribute('data-columns')).toBe('2');
      expect(grid.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
    } finally {
      window.matchMedia = original;
    }
  });

  it('窄视口：2 列收为 1 列', () => {
    const original = window.matchMedia;
    window.matchMedia = narrowMatchMedia;
    try {
      const { container } = renderGrid({ columns: 2 });
      expect(
        container.querySelector('[data-slot=grid]')?.getAttribute('data-columns'),
      ).toBe('1');
    } finally {
      window.matchMedia = original;
    }
  });

  it('窄视口：responsive: false 保持原列数', () => {
    const original = window.matchMedia;
    window.matchMedia = narrowMatchMedia;
    try {
      const { container } = renderGrid({ columns: 4, responsive: false });
      expect(
        container.querySelector('[data-slot=grid]')?.getAttribute('data-columns'),
      ).toBe('4');
    } finally {
      window.matchMedia = original;
    }
  });

  it('宽视口（无 matchMedia / 不命中）：保持原列数', () => {
    const { container } = renderGrid({ columns: 4 });
    expect(container.querySelector('[data-slot=grid]')?.getAttribute('data-columns')).toBe(
      '4',
    );
  });
});
