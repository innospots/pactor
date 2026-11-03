// @vitest-environment jsdom
/**
 * Input search 契约：
 * - search: true 时控件前置搜索图标，文本左留图标位（pl-9! 抗聚合样式后段 px-3）
 * - 回车经 DSL onSearch 传出当前值；onChange 仍照常驱动受控值
 */
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderDsl } from './helpers.js';

describe('search Input', () => {
  it('前置搜索图标并保留图标位内边距', () => {
    renderDsl({
      type: 'Input',
      props: { search: true, placeholder: '请输入关键词' },
    });

    const input = document.querySelector('[data-slot="input"]') as HTMLInputElement;
    // 加 !important：聚合样式中后段 px-3 会覆盖普通 pl-9
    expect(input.className).toContain('pl-9!');
    expect(input.getAttribute('placeholder')).toBe('请输入关键词');
    expect(
      document.querySelector('[data-slot="input-search"] svg[aria-hidden="true"]'),
    ).not.toBeNull();
  });

  it('回车经 onSearch 传出当前值', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'Input',
      props: { search: true, value: '${state.keyword}' },
      events: {
        onChange: [{ action: 'setState', params: { keyword: '${event}' } }],
        onSearch: [{ action: 'setState', params: { submitted: '${event}' } }],
      },
    });
    const input = document.querySelector('[data-slot="input"]') as HTMLInputElement;

    await user.type(input, 'pactor{Enter}');
    expect(context.state.get('keyword')).toBe('pactor');
    expect(context.state.get('submitted')).toBe('pactor');
  });

  it('未开启 search 时不渲染图标', () => {
    renderDsl({ type: 'Input', props: { placeholder: '普通输入' } });

    expect(document.querySelector('[data-slot="input-search"]')).toBeNull();
    expect(document.querySelector('[data-slot="input"] svg')).toBeNull();
  });
});
