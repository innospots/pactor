// @vitest-environment jsdom
/**
 * DatePicker 契约（spec: date-picker）：
 * 触发器 + Popover + Calendar 结构、single/range 值契约（ISO 字符串 /
 * `{ start, end }` 对象，仅两端齐备触发）、presets 三种形态与缺省规则、
 * Form 集成（值收集与必填校验）、pactor.datePicker.* i18n 与日历 locale。
 */
import type { DslNode } from '@pactor-app/core';
import {
  createRuntimeContext,
  DslRenderer,
  I18nContextProvider,
  registerBuiltinActions,
  type RuntimeContext,
} from '@pactor-app/runtime';
import { fireEvent, render, screen, within, type RenderResult } from '@testing-library/react';
import { addMonths, format, subDays } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { describe, expect, it, vi } from 'vitest';

import { createComponentRegistry } from '../../src/components/index.js';
import { expectEventState, renderDsl } from './helpers.js';

/** 以指定 locale / messages 渲染 DSL（I18nContextProvider 包裹，同 header.test.tsx 模式） */
function renderDslWithLocale(
  node: DslNode,
  locale?: string,
  messages?: Record<string, string>,
): RenderResult & { context: RuntimeContext } {
  const context = createRuntimeContext({
    locale,
    messages,
    components: createComponentRegistry(),
  });
  registerBuiltinActions(context.actions);
  const result = render(
    <I18nContextProvider value={context.i18n}>
      <DslRenderer context={context} node={node} />
    </I18nContextProvider>,
  );
  return { context, ...result };
}

const currentMonth = format(new Date(), 'yyyy-MM');
const nextMonth = format(addMonths(new Date(), 1), 'yyyy-MM');
const todayIso = format(new Date(), 'yyyy-MM-dd');

function trigger() {
  return document.querySelector('[data-slot=datepicker-trigger]')!;
}

async function openPicker() {
  fireEvent.click(trigger());
  await vi.waitFor(() => {
    expect(document.querySelector('[data-slot=popover-content]')).not.toBeNull();
  });
}

/** 点击浮层单日历中当月的某日（grid 头部最多回退 6 天，当月的 10/15 号是首个同名文本） */
async function clickDay(day: string) {
  fireEvent.click(screen.getAllByText(day)[0]);
}

function startPanel() {
  return document.querySelector('[data-slot=datepicker-start-panel]')!;
}

function endPanel() {
  return document.querySelector('[data-slot=datepicker-end-panel]')!;
}

/** 点击指定面板中面板所在月的某日（面板内首个同名文本即当月日期） */
function clickPanelDay(panel: Element, day: string) {
  fireEvent.click(within(panel as HTMLElement).getAllByText(day)[0]);
}

/** 面板的月份标题文本（DayPicker 对 zh-CN 等 year-first locale 用 Intl.DateTimeFormat 生成长月标题） */
function monthCaption(offsetMonths: number) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    year: 'numeric',
  }).format(addMonths(new Date(), offsetMonths));
}

/** 面板内某日所在的 td 单元格（面板内首个同名文本即面板所在月日期） */
function dayCell(panel: Element, day: string) {
  return within(panel as HTMLElement).getAllByText(day)[0].closest('td')!;
}

/** 面板内带端点选中样式的可见 td 列表（range 双面板不渲染邻月补齐格，
 * 残留的 rdp-outside 占位格虽带 modifier 类但不可见，不计入） */
function endpointCells(panel: Element) {
  return Array.from(panel.querySelectorAll('td')).filter(
    (td) =>
      td.className.includes('calendar-selected-background') &&
      !td.className.includes('rdp-outside'),
  );
}

/** showTime 时间列容器（data-slot） */
function timeColumn(slot: string) {
  return document.querySelector(`[data-slot=${slot}]`)!;
}

/** 点击时间列中的某项（列内为两位数字文本） */
function clickTime(slot: string, value: string) {
  fireEvent.click(within(timeColumn(slot) as HTMLElement).getByText(value));
}

describe('DatePicker', () => {
  it('点击触发器展开含日历的浮层；未选时显示 i18n placeholder', async () => {
    renderDsl({ type: 'DatePicker' });

    expect(trigger().textContent).toContain('选择日期');
    expect(document.querySelector('[data-slot=popover-content]')).toBeNull();

    await openPicker();
    expect(document.querySelector('[data-slot=popover-content]')).not.toBeNull();
  });

  it('single：点击某日 onChange 传出 ISO 日期字符串并回显触发器', async () => {
    const { context } = renderDsl({
      type: 'DatePicker',
      events: {
        onChange: { action: 'setState', params: { day: '${event}' } },
      },
    });

    await openPicker();
    await clickDay('15');

    await expectEventState(context, 'day', `${currentMonth}-15`);
    expect(trigger().textContent).toContain(`${currentMonth}-15`);
  });

  it('range 同一面板内两次点击完成范围选择（首击不触发）', async () => {
    const { context } = renderDsl({
      type: 'DatePicker',
      props: { mode: 'range' },
      events: {
        onChange: { action: 'setState', params: { period: '${event}' } },
      },
    });

    await openPicker();
    expect(startPanel()).not.toBeNull();
    expect(endPanel()).not.toBeNull();

    clickPanelDay(startPanel(), '10');
    // 首击（仅开始日）不触发 onChange
    expect(context.state.get('period')).toBeUndefined();

    clickPanelDay(startPanel(), '15');
    await expectEventState(context, 'period', {
      start: `${currentMonth}-10`,
      end: `${currentMonth}-15`,
    });
  });

  it('range 跨面板选择范围', async () => {
    const { context } = renderDsl({
      type: 'DatePicker',
      props: { mode: 'range' },
      events: {
        onChange: { action: 'setState', params: { period: '${event}' } },
      },
    });

    await openPicker();
    clickPanelDay(startPanel(), '10');
    clickPanelDay(endPanel(), '15');
    await expectEventState(context, 'period', {
      start: `${currentMonth}-10`,
      end: `${nextMonth}-15`,
    });
  });

  it('range 第二击早于开始日时重新开始（无 disabled 约束）', async () => {
    const { context } = renderDsl({
      type: 'DatePicker',
      props: { mode: 'range' },
      events: {
        onChange: { action: 'setState', params: { period: '${event}' } },
      },
    });

    await openPicker();
    clickPanelDay(startPanel(), '10');

    // 右面板回退到当月；早于开始日的 5 号可点（无禁用），点击即重新开始
    fireEvent.click(
      endPanel().querySelector('.rdp-button_previous')! as HTMLElement,
    );
    const day5 = within(endPanel() as HTMLElement)
      .getAllByText('5')[0]
      .closest('button')!;
    expect(day5.disabled).toBe(false);
    clickPanelDay(endPanel(), '5');
    expect(context.state.get('period')).toBeUndefined();

    // 新的开始日之后选结束日，按新开始日提交
    clickPanelDay(endPanel(), '15');
    await expectEventState(context, 'period', {
      start: `${currentMonth}-05`,
      end: `${currentMonth}-15`,
    });
  });

  it('range 完整区间后再点击开始新一轮（设开始日、清结束日，不触发）', async () => {
    const { context } = renderDsl({
      type: 'DatePicker',
      props: { mode: 'range' },
      events: {
        onChange: { action: 'setState', params: { period: '${event}' } },
      },
    });

    await openPicker();
    clickPanelDay(startPanel(), '10');
    clickPanelDay(startPanel(), '15');
    await expectEventState(context, 'period', {
      start: `${currentMonth}-10`,
      end: `${currentMonth}-15`,
    });

    clickPanelDay(startPanel(), '20');
    // 新一轮首击不触发 onChange，已提交值保持
    expect(context.state.get('period')).toEqual({
      start: `${currentMonth}-10`,
      end: `${currentMonth}-15`,
    });
    // 新开始日呈选中态，旧结束日与中间过渡样式清空
    expect(dayCell(startPanel(), '20').className).toContain(
      'calendar-selected-background',
    );
    expect(dayCell(startPanel(), '15').className).not.toContain(
      'calendar-selected-background',
    );
    expect(
      document.querySelectorAll('[class*="calendar-range-background"]'),
    ).toHaveLength(0);
  });

  it('range 面板月份独立导航：右面板下一月只改右面板', async () => {
    renderDsl({
      type: 'DatePicker',
      props: { mode: 'range' },
    });

    await openPicker();
    expect(within(startPanel() as HTMLElement).getByText(monthCaption(0))).toBeDefined();
    expect(within(endPanel() as HTMLElement).getByText(monthCaption(1))).toBeDefined();

    fireEvent.click(
      endPanel().querySelector('.rdp-button_next')! as HTMLElement,
    );

    // 左面板月份不变，右面板前移一个月
    expect(within(startPanel() as HTMLElement).getByText(monthCaption(0))).toBeDefined();
    expect(within(endPanel() as HTMLElement).getByText(monthCaption(2))).toBeDefined();
  });

  it('range 初始值回显：触发器显示 "start ~ end"，端点与中间日期呈选中态；同月值时右面板顺延下一月', async () => {
    const value = { start: `${currentMonth}-01`, end: `${currentMonth}-07` };
    renderDsl({
      type: 'DatePicker',
      props: { mode: 'range', value },
    });

    expect(trigger().textContent).toContain(
      `${value.start} ~ ${value.end}`,
    );

    await openPicker();
    // 同月值：左面板显示开始日所在月，两端点与中间日期在此面板呈选中态
    expect(
      within(startPanel() as HTMLElement).getByText(monthCaption(0)),
    ).toBeDefined();
    expect(dayCell(startPanel(), '1').className).toContain(
      'calendar-selected-background',
    );
    expect(dayCell(startPanel(), '7').className).toContain(
      'calendar-selected-background',
    );
    expect(dayCell(startPanel(), '4').className).toContain(
      'calendar-range-background',
    );
    // 右面板不显示同一月份（顺延下一月）
    expect(
      within(endPanel() as HTMLElement).getByText(monthCaption(1)),
    ).toBeDefined();
  });

  it('range 区间中间日期呈选中过渡样式（仅开始日已选时无）', async () => {
    const { context } = renderDsl({
      type: 'DatePicker',
      props: { mode: 'range' },
      events: {
        onChange: { action: 'setState', params: { period: '${event}' } },
      },
    });

    await openPicker();
    clickPanelDay(startPanel(), '10');
    // 仅开始日已选（pending）：端点有选中态，无中间过渡样式
    expect(dayCell(startPanel(), '10').className).toContain(
      'calendar-selected-background',
    );
    expect(
      document.querySelectorAll('[class*="calendar-range-background"]'),
    ).toHaveLength(0);

    clickPanelDay(startPanel(), '15');
    await expectEventState(context, 'period', {
      start: `${currentMonth}-10`,
      end: `${currentMonth}-15`,
    });

    // 两端齐备：左面板（开始日所在月）严格位于两端之间的日期带过渡样式；
    // 同月区间提交后右面板顺延下一月，不带过渡样式
    expect(dayCell(startPanel(), '12').className).toContain(
      'calendar-range-background',
    );
    expect(dayCell(endPanel(), '12').className).not.toContain(
      'calendar-range-background',
    );
  });

  it('range 左右面板不显示同一月份：单侧导航越界时对侧顺延/回退', async () => {
    renderDsl({
      type: 'DatePicker',
      props: { mode: 'range' },
    });

    await openPicker();
    // 初始：左当月、右下月
    expect(
      within(startPanel() as HTMLElement).getByText(monthCaption(0)),
    ).toBeDefined();
    expect(
      within(endPanel() as HTMLElement).getByText(monthCaption(1)),
    ).toBeDefined();

    // 左面板下一月追到右面板月份：右面板顺延
    fireEvent.click(
      startPanel().querySelector('.rdp-button_next')! as HTMLElement,
    );
    expect(
      within(startPanel() as HTMLElement).getByText(monthCaption(1)),
    ).toBeDefined();
    expect(
      within(endPanel() as HTMLElement).getByText(monthCaption(2)),
    ).toBeDefined();

    // 再点一次：左 +2，右顺延为 +3
    fireEvent.click(
      startPanel().querySelector('.rdp-button_next')! as HTMLElement,
    );
    expect(
      within(startPanel() as HTMLElement).getByText(monthCaption(2)),
    ).toBeDefined();
    expect(
      within(endPanel() as HTMLElement).getByText(monthCaption(3)),
    ).toBeDefined();

    // 右面板回退到左面板月份：左面板回退保持小一个月
    fireEvent.click(
      endPanel().querySelector('.rdp-button_previous')! as HTMLElement,
    );
    fireEvent.click(
      endPanel().querySelector('.rdp-button_previous')! as HTMLElement,
    );
    expect(
      within(endPanel() as HTMLElement).getByText(monthCaption(1)),
    ).toBeDefined();
    expect(
      within(startPanel() as HTMLElement).getByText(monthCaption(0)),
    ).toBeDefined();
  });

  it('range 缺省预设渲染「今天/本周/本月」；single 缺省无预设栏；presets:false 关闭', async () => {
    const { unmount } = renderDsl({
      type: 'DatePicker',
      props: { mode: 'range' },
    });
    await openPicker();
    const presets = document.querySelector('[data-slot=datepicker-presets]')!;
    expect(presets).not.toBeNull();
    expect(
      Array.from(presets.querySelectorAll('button')).map((b) => b.textContent),
    ).toEqual(['今天', '本周', '本月']);
    unmount();

    const { unmount: unmountSingle } = renderDsl({ type: 'DatePicker' });
    await openPicker();
    expect(document.querySelector('[data-slot=datepicker-presets]')).toBeNull();
    unmountSingle();

    renderDsl({
      type: 'DatePicker',
      props: { mode: 'range', presets: false },
    });
    await openPicker();
    expect(document.querySelector('[data-slot=datepicker-presets]')).toBeNull();
  });

  it('最近 N 天预设：{ label, days: 7 } 点击后载荷为 6 天前 ~ 今天', async () => {
    const { context } = renderDsl({
      type: 'DatePicker',
      props: { mode: 'range', presets: [{ label: '最近7天', days: 7 }] },
      events: {
        onChange: { action: 'setState', params: { period: '${event}' } },
      },
    });

    await openPicker();
    fireEvent.click(screen.getByText('最近7天'));

    await expectEventState(context, 'period', {
      start: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
      end: todayIso,
    });
  });

  it('「今天」预设（range，无既有选择）：仅今天一格呈端点选中态，无中间过渡样式', async () => {
    renderDsl({
      type: 'DatePicker',
      props: { mode: 'range' },
    });

    await openPicker();
    fireEvent.click(screen.getByText('今天'));

    // 恰好只有今天一个格子呈开始日端点选中态，无中间过渡样式
    expect(endpointCells(startPanel())).toHaveLength(1);
    expect(endpointCells(endPanel())).toHaveLength(0);
    expect(
      document.querySelectorAll('[class*="calendar-range-background"]'),
    ).toHaveLength(0);

    // 再点今天格完成同日区间（today ~ today）：仍只有端点选中态、无过渡样式
    clickPanelDay(startPanel(), format(new Date(), 'd'));
    expect(endpointCells(startPanel())).toHaveLength(1);
    expect(
      document.querySelectorAll('[class*="calendar-range-background"]'),
    ).toHaveLength(0);
  });

  it('「今天」预设（range）：定位型——清空范围、定位当前月、今天为开始日，不触发 onChange', async () => {
    const { context } = renderDsl({
      type: 'DatePicker',
      props: { mode: 'range' },
      events: {
        onChange: { action: 'setState', params: { period: '${event}' } },
      },
    });

    await openPicker();
    // 先提交一个完整区间，再翻页离开当前月
    clickPanelDay(startPanel(), '10');
    clickPanelDay(startPanel(), '15');
    await expectEventState(context, 'period', {
      start: `${currentMonth}-10`,
      end: `${currentMonth}-15`,
    });
    fireEvent.click(
      startPanel().querySelector('.rdp-button_next')! as HTMLElement,
    );
    expect(
      within(startPanel() as HTMLElement).getByText(monthCaption(1)),
    ).toBeDefined();

    fireEvent.click(screen.getByText('今天'));

    // 不触发 onChange，已提交值保持
    expect(context.state.get('period')).toEqual({
      start: `${currentMonth}-10`,
      end: `${currentMonth}-15`,
    });
    // 面板定位回当前月 / 下月
    expect(
      within(startPanel() as HTMLElement).getByText(monthCaption(0)),
    ).toBeDefined();
    expect(
      within(endPanel() as HTMLElement).getByText(monthCaption(1)),
    ).toBeDefined();
    // 今天呈开始日选中态（唯一端点），等待结束日
    const endpoints = endpointCells(startPanel());
    expect(endpoints).toHaveLength(1);
    expect(endpoints[0].textContent).toBe(format(new Date(), 'd'));
    expect(
      document.querySelectorAll('[class*="calendar-range-background"]'),
    ).toHaveLength(0);
  });

  it('「今天」预设（single）：选中今天并触发 onChange', async () => {
    const { context } = renderDsl({
      type: 'DatePicker',
      props: { presets: [{ key: 'today' }] },
      events: {
        onChange: { action: 'setState', params: { day: '${event}' } },
      },
    });

    await openPicker();
    fireEvent.click(screen.getByText('今天'));

    await expectEventState(context, 'day', todayIso);
  });

  it('selected / today 单元格 hover 时保持自身文字色（hover 文字不可见修复）', async () => {
    renderDsl({
      type: 'Calendar',
      props: { mode: 'single', value: `${currentMonth}-15` },
    });

    const selectedCell = Array.from(document.querySelectorAll('td')).find(
      (td) => td.className.includes('calendar-selected-background'),
    )!;
    expect(selectedCell).toBeDefined();
    expect(selectedCell.className).toContain(
      'hover:text-(--calendar-selected-foreground)',
    );

    const todayCell = Array.from(document.querySelectorAll('td')).find((td) =>
      td.className.includes('calendar-today-background'),
    )!;
    expect(todayCell).toBeDefined();
    expect(todayCell.className).toContain(
      'hover:text-(--calendar-today-foreground)',
    );
    // 今天日期的边框标识（--calendar-today-border 令牌）
    expect(todayCell.className).toContain(
      'border-(--calendar-today-border)',
    );
  });

  it('显式区间预设与 label 覆盖；点击预设不关浮层', async () => {
    const { context } = renderDsl({
      type: 'DatePicker',
      props: {
        mode: 'range',
        presets: [
          { key: 'thisMonth', label: '本月至今' },
          { label: 'Q3', range: { start: '2026-07-01', end: '2026-09-30' } },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { period: '${event}' } },
      },
    });

    await openPicker();
    fireEvent.click(screen.getByText('Q3'));

    await expectEventState(context, 'period', {
      start: '2026-07-01',
      end: '2026-09-30',
    });
    // 预设点击不自动关浮层
    expect(document.querySelector('[data-slot=popover-content]')).not.toBeNull();
    expect(screen.getByText('本月至今')).toBeDefined();
  });

  it('Form 内 range：选定后提交以 { start, end } 进入 values', async () => {
    const { container, context } = renderDsl({
      type: 'Form',
      children: [
        {
          type: 'DatePicker',
          props: { name: 'period', label: '周期', mode: 'range' },
        },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    expect(container.querySelector('[data-slot=form-item]')).not.toBeNull();
    await openPicker();
    clickPanelDay(startPanel(), '10');
    clickPanelDay(endPanel(), '15');
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({
        period: { start: `${currentMonth}-10`, end: `${nextMonth}-15` },
      });
    });
  });

  it('Form 内必填校验：未选择直接提交显示 message 且不提交', async () => {
    const { context } = renderDsl({
      type: 'Form',
      children: [
        {
          type: 'DatePicker',
          props: {
            name: 'day',
            label: '日期',
            rules: [{ required: true, message: '请选择日期' }],
          },
        },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    expect(await screen.findByText('请选择日期')).toBeDefined();
    expect(context.state.get('form')).toBeUndefined();
  });

  it('en-US locale：placeholder / 预设文案为英文，日历月份与星期标题为英文', async () => {
    renderDslWithLocale(
      { type: 'DatePicker', props: { mode: 'range' } },
      'en-US',
    );

    expect(trigger().textContent).toContain('Select date range');

    await openPicker();
    const presets = document.querySelector('[data-slot=datepicker-presets]')!;
    expect(
      Array.from(presets.querySelectorAll('button')).map((b) => b.textContent),
    ).toEqual(['Today', 'This Week', 'This Month']);

    // 日历月份标题（DayPicker caption 默认 "LLLL yyyy"）与星期标题为英文
    // （range 双面板：左当月、右下月，星期标题各一份）
    expect(
      screen.getByText(format(new Date(), 'LLLL yyyy', { locale: enUS })),
    ).toBeDefined();
    expect(screen.getAllByText('Su').length).toBeGreaterThan(0);
  });

  it('messages 覆盖内置预设文案（pactor.datePicker.today）', async () => {
    renderDslWithLocale(
      { type: 'DatePicker', props: { mode: 'range' } },
      'zh-CN',
      { 'pactor.datePicker.today': 'Today!' },
    );

    await openPicker();
    const first = document
      .querySelector('[data-slot=datepicker-presets]')!
      .querySelector('button')!;
    expect(first.textContent).toBe('Today!');
  });

  describe('showTime / timeFormat', () => {
    it('缺省关闭：浮层内无时间区与时间列', async () => {
      renderDsl({ type: 'DatePicker' });

      await openPicker();
      expect(document.querySelector('[data-slot=datepicker-time]')).toBeNull();
      expect(
        document.querySelector('[data-slot=datepicker-hour-column]'),
      ).toBeNull();
    });

    it('时间区位于日历右侧，背景与日历一致（single / range）', async () => {
      const { unmount } = renderDsl({
        type: 'DatePicker',
        props: { showTime: true },
      });
      await openPicker();

      const singleCalendar = document.querySelector('.rdp-root')!;
      const singleTime = timeColumn('datepicker-time');
      expect(singleCalendar.nextElementSibling).toBe(singleTime);
      expect(singleCalendar.className).toContain('bg-card');
      expect(singleTime.className).toContain('bg-card');
      // 时间列高度撑满日历区域（不再使用 TimePicker 的 max-h-40）
      const singleHourColumn = timeColumn('datepicker-hour-column');
      expect(singleHourColumn.className).toContain('h-full');
      expect(singleHourColumn.className).not.toContain('max-h-40');
      unmount();

      renderDsl({
        type: 'DatePicker',
        props: { mode: 'range', showTime: true },
      });
      await openPicker();

      // 起点时间位于左侧日历与右侧日历之间，终点时间位于右侧日历之后
      expect(startPanel().nextElementSibling).toBe(
        timeColumn('datepicker-start-time'),
      );
      expect(timeColumn('datepicker-start-time').nextElementSibling).toBe(
        endPanel(),
      );
      expect(endPanel().nextElementSibling).toBe(
        timeColumn('datepicker-end-time'),
      );
      for (const slot of ['datepicker-start-time', 'datepicker-end-time']) {
        expect(timeColumn(slot).className).toContain('bg-card');
      }
    });

    it('single：回显日期时间值，时间列激活对应时刻', async () => {
      const value = `${currentMonth}-20 09:30:45`;
      renderDsl({ type: 'DatePicker', props: { showTime: true, value } });

      expect(trigger().textContent).toContain(value);

      await openPicker();
      expect(document.querySelector('[data-slot=datepicker-time]')).not.toBeNull();
      expect(
        within(timeColumn('datepicker-hour-column') as HTMLElement).getByText('09')
          .className,
      ).toContain('bg-primary');
      expect(
        within(timeColumn('datepicker-minute-column') as HTMLElement).getByText(
          '30',
        ).className,
      ).toContain('bg-primary');
      expect(
        within(timeColumn('datepicker-second-column') as HTMLElement).getByText(
          '45',
        ).className,
      ).toContain('bg-primary');
    });

    it('single：点日期提交 00:00:00，时间列即时携带时间提交', async () => {
      const { context } = renderDsl({
        type: 'DatePicker',
        props: { showTime: true },
        events: {
          onChange: { action: 'setState', params: { day: '${event}' } },
        },
      });

      await openPicker();
      clickDay('15');
      await expectEventState(context, 'day', `${currentMonth}-15 00:00:00`);

      clickTime('datepicker-hour-column', '09');
      await expectEventState(context, 'day', `${currentMonth}-15 09:00:00`);

      clickTime('datepicker-minute-column', '45');
      await expectEventState(context, 'day', `${currentMonth}-15 09:45:00`);

      clickTime('datepicker-second-column', '30');
      await expectEventState(context, 'day', `${currentMonth}-15 09:45:30`);
      expect(trigger().textContent).toContain(`${currentMonth}-15 09:45:30`);
    });

    it('single + timeFormat HH:mm：无秒列，值无秒', async () => {
      const { context } = renderDsl({
        type: 'DatePicker',
        props: { showTime: true, timeFormat: 'HH:mm' },
        events: {
          onChange: { action: 'setState', params: { day: '${event}' } },
        },
      });

      await openPicker();
      expect(
        document.querySelector('[data-slot=datepicker-second-column]'),
      ).toBeNull();

      clickDay('15');
      await expectEventState(context, 'day', `${currentMonth}-15 00:00`);

      clickTime('datepicker-hour-column', '13');
      clickTime('datepicker-minute-column', '30');
      await expectEventState(context, 'day', `${currentMonth}-15 13:30`);
    });

    it('single：先点时间再点日期，提交时携带已选时间', async () => {
      const { context } = renderDsl({
        type: 'DatePicker',
        props: { showTime: true },
        events: {
          onChange: { action: 'setState', params: { day: '${event}' } },
        },
      });

      await openPicker();
      clickTime('datepicker-hour-column', '08');
      clickTime('datepicker-minute-column', '05');
      // 尚无日期：只暂存时间，不触发 onChange
      expect(context.state.get('day')).toBeUndefined();

      clickDay('15');
      await expectEventState(context, 'day', `${currentMonth}-15 08:05:00`);
    });

    it('single：「今天」预设提交今天 + 待选时间', async () => {
      const { context } = renderDsl({
        type: 'DatePicker',
        props: { showTime: true, presets: [{ key: 'today' }] },
        events: {
          onChange: { action: 'setState', params: { day: '${event}' } },
        },
      });

      await openPicker();
      fireEvent.click(screen.getByText('今天'));

      await expectEventState(context, 'day', `${todayIso} 00:00:00`);
    });

    it('range：两次点击提交默认起止时间 00:00:00 / 23:59:59', async () => {
      const { context } = renderDsl({
        type: 'DatePicker',
        props: { mode: 'range', showTime: true },
        events: {
          onChange: { action: 'setState', params: { period: '${event}' } },
        },
      });

      await openPicker();
      clickPanelDay(startPanel(), '10');
      clickPanelDay(startPanel(), '15');

      await expectEventState(context, 'period', {
        start: `${currentMonth}-10 00:00:00`,
        end: `${currentMonth}-15 23:59:59`,
      });
    });

    it('range + timeFormat HH:mm：两端无秒，默认 00:00 / 23:59', async () => {
      const { context } = renderDsl({
        type: 'DatePicker',
        props: { mode: 'range', showTime: true, timeFormat: 'HH:mm' },
        events: {
          onChange: { action: 'setState', params: { period: '${event}' } },
        },
      });

      await openPicker();
      expect(
        document.querySelector('[data-slot=datepicker-start-second-column]'),
      ).toBeNull();

      clickPanelDay(startPanel(), '10');
      clickPanelDay(startPanel(), '15');

      await expectEventState(context, 'period', {
        start: `${currentMonth}-10 00:00`,
        end: `${currentMonth}-15 23:59`,
      });
    });

    it('range：已提交区间调整起点/终点时间，立即重新提交且对端保持', async () => {
      const { context } = renderDsl({
        type: 'DatePicker',
        props: { mode: 'range', showTime: true },
        events: {
          onChange: { action: 'setState', params: { period: '${event}' } },
        },
      });

      await openPicker();
      clickPanelDay(startPanel(), '10');
      clickPanelDay(startPanel(), '15');
      await expectEventState(context, 'period', {
        start: `${currentMonth}-10 00:00:00`,
        end: `${currentMonth}-15 23:59:59`,
      });

      clickTime('datepicker-start-hour-column', '09');
      await expectEventState(context, 'period', {
        start: `${currentMonth}-10 09:00:00`,
        end: `${currentMonth}-15 23:59:59`,
      });

      clickTime('datepicker-end-minute-column', '30');
      await expectEventState(context, 'period', {
        start: `${currentMonth}-10 09:00:00`,
        end: `${currentMonth}-15 23:30:59`,
      });
    });

    it('range：新一轮选择沿用上一轮两端时间', async () => {
      const { context } = renderDsl({
        type: 'DatePicker',
        props: { mode: 'range', showTime: true },
        events: {
          onChange: { action: 'setState', params: { period: '${event}' } },
        },
      });

      await openPicker();
      clickPanelDay(startPanel(), '10');
      clickPanelDay(startPanel(), '15');
      await expectEventState(context, 'period', {
        start: `${currentMonth}-10 00:00:00`,
        end: `${currentMonth}-15 23:59:59`,
      });

      clickTime('datepicker-start-hour-column', '09');
      clickTime('datepicker-end-hour-column', '18');
      clickTime('datepicker-end-minute-column', '30');
      await expectEventState(context, 'period', {
        start: `${currentMonth}-10 09:00:00`,
        end: `${currentMonth}-15 18:30:59`,
      });

      // 新一轮首击不触发 onChange
      clickPanelDay(startPanel(), '20');
      expect(context.state.get('period')).toEqual({
        start: `${currentMonth}-10 09:00:00`,
        end: `${currentMonth}-15 18:30:59`,
      });

      clickPanelDay(startPanel(), '25');
      await expectEventState(context, 'period', {
        start: `${currentMonth}-20 09:00:00`,
        end: `${currentMonth}-25 18:30:59`,
      });
    });

    it('range：预设按整日语义使用默认起止时间', async () => {
      const { context } = renderDsl({
        type: 'DatePicker',
        props: {
          mode: 'range',
          showTime: true,
          presets: [{ label: '最近7天', days: 7 }],
        },
        events: {
          onChange: { action: 'setState', params: { period: '${event}' } },
        },
      });

      await openPicker();
      fireEvent.click(screen.getByText('最近7天'));

      await expectEventState(context, 'period', {
        start: `${format(subDays(new Date(), 6), 'yyyy-MM-dd')} 00:00:00`,
        end: `${todayIso} 23:59:59`,
      });
    });

    it('Form 内 showTime：提交值为日期时间字符串', async () => {
      const { context } = renderDsl({
        type: 'Form',
        children: [
          {
            type: 'DatePicker',
            props: { name: 'day', label: '时间', showTime: true },
          },
          { type: 'Button', props: { text: '提交', submit: true } },
        ],
      });

      await openPicker();
      clickDay('15');
      clickTime('datepicker-hour-column', '09');
      clickTime('datepicker-minute-column', '45');
      fireEvent.click(screen.getByRole('button', { name: '提交' }));

      await vi.waitFor(() => {
        expect(context.state.get('form')).toEqual({
          day: `${currentMonth}-15 09:45:00`,
        });
      });
    });
  });
});
