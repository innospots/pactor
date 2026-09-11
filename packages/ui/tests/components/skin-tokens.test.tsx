// @vitest-environment jsdom
import './setup.js';

import { cleanup, render } from '@testing-library/react';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { Menu } from '../../src/components/index.js';
import {
  Card,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  Progress,
  ProgressIndicator,
  ProgressTrack,
  RadioGroup,
  RadioGroupItem,
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  Switch,
} from '../../src/ui/index.js';

afterEach(cleanup);

const stylesSource = readFileSync(
  join(__dirname, '../../src/styles.css'),
  'utf8',
);

/**
 * 皮肤令牌契约（spec: theme-skin-css / ui-package-structure 全令牌化）：
 * 令牌清单齐备、暗色块同步覆盖、组件经令牌类引用、宿主内联覆盖生效、
 * 组件源码无硬编码颜色。
 */
describe('皮肤令牌契约', () => {
  it(':root 定义全部组件级皮肤令牌', () => {
    const tokens = [
      '--font-sans',
      '--background-image',
      '--card-shadow',
      '--shadow-color',
      '--overlay-background',
      '--switch-track',
      '--switch-track-checked',
      '--switch-thumb',
      '--slider-track',
      '--slider-range',
      '--slider-thumb',
      '--radio-border',
      '--radio-checked',
      '--progress-track',
      '--progress-indicator',
      '--pagination-active-background',
      '--pagination-active-border',
      '--pagination-active-radius',
      '--menu-hover-background',
      '--menu-hover-foreground',
      '--menu-active-background',
      '--menu-active-foreground',
      '--bubble-background',
      '--bubble-hover-background',
      '--calendar-day-hover-background',
      '--calendar-selected-background',
      '--calendar-selected-foreground',
      '--calendar-today-background',
      '--flex-gap',
      '--flex-gap-sm',
      '--flex-gap-md',
      '--flex-gap-lg',
      '--grid-gap',
    ];
    for (const token of tokens) {
      expect(stylesSource).toContain(`${token}:`);
    }
  });

  it('暗色块与跟随系统媒体查询块同步覆盖 bubble 令牌', () => {
    const darkBlock = stylesSource.match(
      /\[data-pactor-theme='dark'\]\s*\{([\s\S]*?)\n\}/,
    );
    const mediaBlock = stylesSource.match(
      /prefers-color-scheme:\s*dark[\s\S]*?:root:not\(\[data-pactor-theme='light'\]\):not\(\[data-pactor-theme='dark'\]\)\s*\{([\s\S]*?)\n\s*\}/,
    );
    for (const block of [darkBlock?.[1], mediaBlock?.[1]]) {
      expect(block).toBeTruthy();
      expect(block).toContain('--bubble-background:');
      expect(block).toContain('--bubble-hover-background:');
    }
  });

  it('组件级令牌默认值经 var() 回退到语义令牌', () => {
    expect(stylesSource).toContain('--switch-track-checked: var(--primary)');
    expect(stylesSource).toContain('--menu-hover-background: var(--accent)');
    expect(stylesSource).toContain('--menu-active-background: var(--accent)');
    expect(stylesSource).toContain('--progress-indicator: var(--primary)');
  });

  it('body 应用背景图与字体令牌', () => {
    expect(stylesSource).toContain('background-image: var(--background-image)');
    expect(stylesSource).toContain('font-family: var(--font-sans)');
  });
});

describe('组件经皮肤令牌渲染', () => {
  it('Switch 轨道与滑块引用 --switch-* 令牌', () => {
    const { container } = render(<Switch />);
    expect(container.querySelector('[data-slot="switch"]')?.className).toContain(
      'data-checked:bg-(--switch-track-checked)',
    );
    expect(
      container.querySelector('[data-slot="switch-thumb"]')?.className,
    ).toContain('bg-(--switch-thumb)');
  });

  it('Slider 轨道/进度/滑块引用 --slider-* 令牌', () => {
    const { container } = render(
      <Slider defaultValue={50}>
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
          </SliderTrack>
          <SliderThumb />
        </SliderControl>
      </Slider>,
    );
    expect(
      container.querySelector('[data-slot="slider-track"]')?.className,
    ).toContain('bg-(--slider-track)');
    expect(
      container.querySelector('[data-slot="slider-indicator"]')?.className,
    ).toContain('bg-(--slider-range)');
    expect(
      container.querySelector('[data-slot="slider-thumb"]')?.className,
    ).toContain('bg-(--slider-thumb)');
  });

  it('Radio 圆圈与选中点引用 --radio-* 令牌', () => {
    const { container } = render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" />
      </RadioGroup>,
    );
    const item = container.querySelector('[data-slot="radio-group-item"]');
    expect(item?.className).toContain('border-(color:--radio-border)');
    expect(item?.className).toContain(
      'data-checked:border-(color:--radio-checked)',
    );
    expect(
      container.querySelector('[data-slot="radio-group-indicator"] span')
        ?.className,
    ).toContain('bg-(--radio-checked)');
  });

  it('Progress 轨道与进度条引用 --progress-* 令牌', () => {
    const { container } = render(
      <Progress value={50}>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>,
    );
    expect(
      container.querySelector('[data-slot="progress-track"]')?.className,
    ).toContain('bg-(--progress-track)');
    expect(
      container.querySelector('[data-slot="progress-indicator"]')?.className,
    ).toContain('bg-(--progress-indicator)');
  });

  it('Pagination 当前页引用 --pagination-active-* 令牌', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink isActive href="#">
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    const link = document.querySelector('[data-slot="pagination-link"]');
    expect(link?.className).toContain(
      'bg-(--pagination-active-background)',
    );
    expect(link?.className).toContain(
      'border-(color:--pagination-active-border)',
    );
    expect(link?.className).toContain(
      'rounded-(--pagination-active-radius)',
    );
  });

  it('Menu 选中与 hover 引用 --menu-* 令牌', () => {
    render(
      <Menu
        items={[{ key: 'a', label: '甲' }, { key: 'b', label: '乙' }]}
        selectedKey="a"
      />,
    );
    const items = document.querySelectorAll('[data-slot="menu-item"]');
    expect(items[0]?.className).toContain('bg-(--menu-active-background)');
    expect(items[1]?.className).toContain(
      'hover:bg-(--menu-hover-background)/50',
    );
  });

  it('Card 阴影引用 --card-shadow 令牌', () => {
    const { container } = render(<Card />);
    expect(container.querySelector('[data-slot="card"]')?.className).toContain(
      'shadow-(--card-shadow)',
    );
  });
});

describe('宿主运行时覆盖令牌', () => {
  it('内联皮肤令牌覆盖在组件子树内生效（自定义属性沿继承链解析）', () => {
    const { container } = render(
      <div style={{ '--switch-track-checked': 'rgb(1, 2, 3)' } as React.CSSProperties}>
        <Switch defaultChecked />
      </div>,
    );
    const host = container.firstElementChild!;
    expect(
      getComputedStyle(host).getPropertyValue('--switch-track-checked').trim(),
    ).toBe('rgb(1, 2, 3)');
    const thumb = container.querySelector('[data-slot="switch-thumb"]')!;
    expect(
      getComputedStyle(thumb).getPropertyValue('--switch-track-checked').trim(),
    ).toBe('rgb(1, 2, 3)');
  });
});

describe('组件源码无硬编码颜色', () => {
  const srcRoot = join(__dirname, '../../src');

  function collectSources(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) {
        return collectSources(path);
      }
      return /\.(tsx?|css)$/.test(entry) ? [path] : [];
    });
  }

  it('组件源码（styles.css 令牌定义除外）不含硬编码颜色值', () => {
    const hardcoded =
      /oklch\(|rgba?\(|hsla?\(|#[0-9a-fA-F]{3,8}\b|(?:bg|text|border|fill|stroke)-(?:black|white|gray|slate|zinc|neutral|stone|red|green|blue|yellow|orange|purple|pink|indigo|sky|emerald|amber|cyan|teal|lime|rose|fuchsia|violet)-?\d{0,3}\b/;
    const offenders = collectSources(srcRoot)
      .filter((path) => !path.endsWith('styles.css'))
      .filter((path) => hardcoded.test(readFileSync(path, 'utf8')));
    expect(offenders).toEqual([]);
  });
});
