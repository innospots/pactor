// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Kbd as UiKbd } from '../../src/ui/kbd.js';
import {
  Slider as UiSlider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from '../../src/ui/slider.js';
import { Switch as UiSwitch } from '../../src/ui/switch.js';
import { renderDsl } from './helpers.js';

describe('三期密度令牌化', () => {
  it('Switch 轨道走 switch-track 令牌，拇指跟随 control-box', () => {
    const { container } = render(<UiSwitch aria-label="开关" />);
    const track = container.querySelector('[data-slot=switch]');
    expect(track?.className).toContain('h-(--pactor-switch-track-h)');
    expect(track?.className).toContain('w-(--pactor-switch-track-w)');
    const thumb = container.querySelector('[data-slot=switch-thumb]');
    expect(thumb?.className).toContain('size-(--pactor-control-box)');
  });

  it('Slider 轨道厚度走 slider-track-size 令牌，拇指跟随 control-box', () => {
    const { container } = render(
      <UiSlider value={50}>
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
          </SliderTrack>
          <SliderThumb />
        </SliderControl>
      </UiSlider>,
    );
    expect(
      container.querySelector('[data-slot=slider-track]')?.className,
    ).toContain('h-(--pactor-slider-track-size)');
    expect(
      container.querySelector('[data-slot=slider-thumb]')?.className,
    ).toContain('size-(--pactor-control-box)');
  });

  it('Kbd 高度 / 最小宽走 kbd-size 令牌', () => {
    const { container } = render(<UiKbd>⌘K</UiKbd>);
    const kbd = container.querySelector('[data-slot=kbd]');
    expect(kbd?.className).toContain('h-(--pactor-kbd-size)');
    expect(kbd?.className).toContain('min-w-(--pactor-kbd-size)');
  });

  it('DSL Card 内边距走 card-padding 令牌', () => {
    const { container } = renderDsl({
      type: 'Card',
      props: { title: '标题' },
      children: [{ type: 'Text', props: { text: '正文' } }],
    });
    const card = container.querySelector('[data-slot=card]');
    expect(card?.className).toContain('py-(--pactor-card-padding)');
    expect(
      container.querySelector('[data-slot=card-content]')?.className,
    ).toContain('px-(--pactor-card-padding)');
  });

  it('DSL Menu 导航行走 menu-nav-padding-y 令牌', () => {
    renderDsl({
      type: 'Menu',
      props: { items: [{ key: 'a', label: '菜单 A' }] },
    });
    const item = screen.getByText('菜单 A').closest('[data-slot=menu-item]');
    expect(item?.className).toContain('py-(--pactor-menu-nav-padding-y)');
    expect(item?.className).toContain(
      'text-[length:var(--pactor-control-text-md)]',
    );
  });

  it('DSL Text small / large 字号跟随密度令牌', () => {
    renderDsl({
      type: 'Text',
      props: { text: '小字', size: 'small' },
    });
    expect(screen.getByText('小字').className).toContain(
      'text-[length:var(--pactor-control-text-sm)]',
    );
    renderDsl({
      type: 'Text',
      props: { text: '大字', size: 'large' },
    });
    expect(screen.getByText('大字').className).toContain(
      'text-[length:var(--pactor-control-text-lg)]',
    );
  });
});
