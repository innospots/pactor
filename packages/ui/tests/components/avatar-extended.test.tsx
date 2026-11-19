// @vitest-environment jsdom
/**
 * Avatar 扩展契约：kind（user / agent）、在线状态点、AvatarGroup
 * 重叠展示与 +N 聚合、尺寸与通用 props。
 */
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Avatar, AvatarGroup } from '../../src/components/index.js';
import { COMMON_PROPS_PROBE, expectCommonProps } from './helpers.js';

afterEach(cleanup);

describe('Avatar kind / status', () => {
  it('缺省 user：圆形；agent：方形（根节点与占位）', () => {
    const { container, rerender } = render(<Avatar fallback="张" />);
    const user = container.querySelector('[data-slot=avatar]')!;
    expect(user.getAttribute('data-kind')).toBe('user');
    expect(user.className).not.toContain('rounded-md');

    rerender(<Avatar fallback="AI" kind="agent" />);
    const agent = container.querySelector('[data-slot=avatar]')!;
    expect(agent.getAttribute('data-kind')).toBe('agent');
    expect(agent.className).toContain('rounded-md');
    expect(screen.getByText('AI').className).toContain('rounded-md');
  });

  it('status：右下角状态点带 role=img 与可读标签，悬出裁剪', () => {
    const { container } = render(<Avatar fallback="李" status="busy" />);
    expect(container.querySelector('[data-slot=avatar]')!.className).toContain(
      'overflow-visible',
    );
    const dot = screen.getByRole('img', { name: '忙碌' });
    expect(dot.getAttribute('data-slot')).toBe('avatar-status');
    expect(dot.getAttribute('data-status')).toBe('busy');
    expect(dot.className).toContain('bg-destructive');
  });

  it.each([
    ['online', 'bg-success', '在线'],
    ['away', 'bg-warning', '离开'],
    ['offline', 'bg-muted-foreground', '离线'],
  ] as const)('status: %s 映射语义色与文案', (status, expectedClass, label) => {
    render(<Avatar fallback="王" status={status} />);
    const dot = screen.getByRole('img', { name: label });
    expect(dot.className).toContain(expectedClass);
  });

  it('未提供 status 不渲染状态点', () => {
    render(<Avatar fallback="赵" />);
    expect(document.querySelector('[data-slot=avatar-status]')).toBeNull();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = render(<Avatar fallback="张" {...COMMON_PROPS_PROBE} />);
    expectCommonProps(container.querySelector('[data-slot=avatar]'));
  });
});

describe('AvatarGroup', () => {
  const ITEMS = ['A', 'B', 'C', 'D', 'E'].map((text) => ({ fallback: text }));

  it('重叠展示前 max 个，溢出聚合为 +N（装饰性 aria-hidden）', () => {
    render(<AvatarGroup items={ITEMS} max={4} />);

    expect(screen.getByRole('group')).toBeTruthy();
    expect(
      document.querySelectorAll('[data-slot=avatar-group-item]'),
    ).toHaveLength(4);
    const more = document.querySelector('[data-slot=avatar-group-more]')!;
    expect(more.textContent).toBe('+1');
    expect(more.getAttribute('aria-hidden')).toBe('true');
    expect(screen.queryByText('E')).toBeNull();
  });

  it('max=0 全部聚合；不溢出时不渲染 +N', () => {
    const { rerender } = render(<AvatarGroup items={ITEMS} max={0} />);
    expect(
      document.querySelectorAll('[data-slot=avatar-group-item]'),
    ).toHaveLength(0);
    expect(
      document.querySelector('[data-slot=avatar-group-more]')!.textContent,
    ).toBe('+5');

    rerender(<AvatarGroup items={ITEMS.slice(0, 2)} />);
    expect(document.querySelector('[data-slot=avatar-group-more]')).toBeNull();
    expect(
      document.querySelectorAll('[data-slot=avatar-group-item]'),
    ).toHaveLength(2);
  });

  it('size 映射到每个头像尺寸；项级 className 合并', () => {
    render(
      <AvatarGroup
        items={[{ fallback: 'A', className: 'item-probe' }]}
        size="sm"
      />,
    );
    const avatar = document.querySelector('[data-slot=avatar]')!;
    expect(avatar.className).toContain('size-6');
    expect(avatar.className).toContain('item-probe');
  });

  it('通用 props 作用于根节点', () => {
    const { container } = render(
      <AvatarGroup items={ITEMS} {...COMMON_PROPS_PROBE} />,
    );
    expectCommonProps(container.querySelector('[data-slot=avatar-group]'));
  });
});
