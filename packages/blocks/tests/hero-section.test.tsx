// @vitest-environment jsdom
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { COMMON_PROPS_PROBE, expectEventState, renderDsl } from './helpers.js';

const HERO_NODE = {
  type: 'HeroSection',
  props: {
    announcement: { text: 'v2.0 已发布', href: '/changelog' },
    title: '看见每一分收入的流动',
    description: 'Lumen 连接 Stripe、HubSpot 与数据仓库，在 MRR 变化发生的瞬间解释每一次变动。',
    actions: [
      { label: '开始免费试用', variant: 'primary' },
      { label: '预约演示', href: '/demo' },
    ],
    meta: '免费 14 天 · 约 4 分钟接入',
    media: {
      type: 'Card',
      props: { title: 'Revenue overview', className: 'probe-media-card' },
    },
    logos: [{ name: 'Acme' }, { name: 'Globex', logo: '/globex.svg' }],
  },
} as const;

describe('HeroSection 区块组件', () => {
  it('完整形态：公告条 + 标题 + 描述 + 双 CTA + 信心行 + 媒体槽 + 客户标记', () => {
    const { container } = renderDsl(HERO_NODE);

    const root = container.querySelector('[data-slot=hero-section]');
    expect(root).not.toBeNull();
    // 公告条（href 渲染 Link）
    expect(screen.getByText('v2.0 已发布')).toBeTruthy();
    expect(container.querySelector('[data-slot=hero-section-announcement] a[href="/changelog"]')).not.toBeNull();
    // 标题为 h1 语义
    expect(container.querySelector('h1[data-slot=hero-section-title]')!.textContent).toBe(
      '看见每一分收入的流动',
    );
    // 双 CTA：无 href 渲染 button，有 href 渲染按钮样式 <a>
    expect(screen.getByRole('button', { name: '开始免费试用' })).toBeTruthy();
    expect(container.querySelector('a[href="/demo"]')!.textContent).toBe('预约演示');
    // 信心行
    expect(screen.getByText('免费 14 天 · 约 4 分钟接入')).toBeTruthy();
    // 媒体槽：DSL 子树经 Renderer 渲染
    expect(container.querySelector('.probe-media-card')).not.toBeNull();
    // 客户标记
    expect(screen.getByText('Acme')).toBeTruthy();
    expect(container.querySelector('img[src="/globex.svg"]')).not.toBeNull();
  });

  it('无 href CTA 点击触发 onActionClick 且 doneLabel 短暂替换文案', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'HeroSection',
      props: {
        title: 'Hero',
        actions: [{ label: '开始', doneLabel: '已触发' }],
      },
      events: {
        onActionClick: { action: 'setState', params: { clicked: '${event}' } },
      },
    });

    await user.click(screen.getByRole('button', { name: '开始' }));
    await expectEventState(context, 'clicked', { key: '开始', label: '开始' });
    // doneLabel 短暂生效后恢复
    expect(screen.getByRole('button', { name: '已触发' })).toBeTruthy();
  });

  it('变体结构：centered 居中 / split 两栏 / minimal 无媒体区、客户标记贴底', () => {
    const base = { title: 'Hero', media: { type: 'Text', props: { text: 'M' } }, logos: [{ name: 'Acme' }] };
    const { container: c1 } = renderDsl({ type: 'HeroSection', props: { ...base } });
    expect(c1.querySelector('[data-slot=hero-section][data-variant=centered]')).not.toBeNull();
    expect(c1.querySelector('[data-slot=hero-section-media]')).not.toBeNull();

    const { container: c2 } = renderDsl({ type: 'HeroSection', props: { ...base, variant: 'split' } });
    expect(c2.querySelector('[data-slot=hero-section][data-variant=split]')).not.toBeNull();

    const { container: c3 } = renderDsl({ type: 'HeroSection', props: { ...base, variant: 'minimal' } });
    expect(c3.querySelector('[data-slot=hero-section][data-variant=minimal]')).not.toBeNull();
    // minimal 不渲染媒体区
    expect(c3.querySelector('[data-slot=hero-section-media]')).toBeNull();
    expect(c3.querySelector('[data-slot=hero-section-logos]')).not.toBeNull();
  });

  it('空配置渲染 null（无任何区块）', () => {
    const { container } = renderDsl({ type: 'HeroSection', props: {} });
    expect(container.querySelector('[data-slot=hero-section]')).toBeNull();
  });

  it('通用 props：className / style 挂根节点', () => {
    const { container } = renderDsl({
      type: 'HeroSection',
      props: { title: 'Hero', ...COMMON_PROPS_PROBE },
    });
    const root = container.querySelector('[data-slot=hero-section]');
    expect(root!.className).toContain('biz-probe');
    expect(root!.getAttribute('style')).toContain('opacity: 0.5');
  });
});
