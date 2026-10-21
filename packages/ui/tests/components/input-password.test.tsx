// @vitest-environment jsdom
/**
 * Input password 明文切换契约：
 * password 类型有值时右缘浮出眼睛按钮，点击在掩码 / 明文之间切换；
 * 清除按钮同时存在时左移避让；值清空后复位为掩码并隐藏眼睛按钮。
 */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderDsl } from './helpers.js';

const CLEAR_LABEL = '清除';
const SHOW_LABEL = '显示密码';
const HIDE_LABEL = '隐藏密码';

function passwordDsl(props: Record<string, unknown> = {}) {
  return renderDsl({
    type: 'Input',
    props: {
      type: 'password',
      value: '${state.v}',
      ...props,
    },
    events: { onChange: [{ action: 'setState', params: { v: '${event}' } }] },
  });
}

describe('password Input 明文切换', () => {
  it('有值后浮出眼睛按钮，点击切换明文 / 掩码且不清空值', async () => {
    const user = userEvent.setup();
    passwordDsl();
    const input = document.querySelector('input') as HTMLInputElement;

    expect(input.type).toBe('password');
    expect(screen.queryByLabelText(SHOW_LABEL)).toBeNull();

    await user.type(input, 'secret');
    const toggle = screen.getByLabelText(SHOW_LABEL);
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    // 清除与眼睛并排：清除左移，文本预留双按钮内边距
    expect(screen.getByLabelText(CLEAR_LABEL).className).toContain('right-8');
    expect(input.className).toContain('pr-14!');

    await user.click(toggle);
    expect(input.type).toBe('text');
    expect(input.value).toBe('secret');
    expect(screen.getByLabelText(HIDE_LABEL).getAttribute('aria-pressed')).toBe(
      'true',
    );

    await user.click(screen.getByLabelText(HIDE_LABEL));
    expect(input.type).toBe('password');
    expect(input.value).toBe('secret');
  });

  it('点击清除后值清空：眼睛按钮隐藏、恢复掩码与单按钮内边距', async () => {
    const user = userEvent.setup();
    passwordDsl();
    const input = document.querySelector('input') as HTMLInputElement;

    await user.type(input, 'secret');
    await user.click(screen.getByLabelText(SHOW_LABEL));
    expect(input.type).toBe('text');

    await user.click(screen.getByLabelText(CLEAR_LABEL));
    expect(input.value).toBe('');
    expect(input.type).toBe('password');
    expect(screen.queryByLabelText(SHOW_LABEL)).toBeNull();
    expect(screen.queryByLabelText(HIDE_LABEL)).toBeNull();
    expect(input.className).toContain('pr-8!');
    expect(input.className).not.toContain('pr-14!');
  });

  it('allowClear: false 时仍提供眼睛按钮，清除按钮不渲染', async () => {
    const user = userEvent.setup();
    passwordDsl({ allowClear: false });
    const input = document.querySelector('input') as HTMLInputElement;

    await user.type(input, 'secret');
    expect(screen.getByLabelText(SHOW_LABEL)).not.toBeNull();
    expect(screen.queryByLabelText(CLEAR_LABEL)).toBeNull();
    expect(input.className).toContain('pr-8!');
    expect(input.className).not.toContain('pr-14!');
  });

  it('禁用时不渲染眼睛按钮', () => {
    passwordDsl({ value: 'secret', disabled: true });
    expect(screen.queryByLabelText(SHOW_LABEL)).toBeNull();
    expect(screen.queryByLabelText(HIDE_LABEL)).toBeNull();
  });
});
