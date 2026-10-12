// @vitest-environment jsdom
/**
 * RecordingPage 录音工作区契约：左列列表（标题 / 过滤 pills / 状态横幅 /
 * 新建钮 / 分组条目）+ 右列详情（头部 / 页签 / 说话人段落 / 播放条）；
 * 过滤、选中录音与页签缺省非受控，可经受控 prop + change 事件闭环。
 */
import { fireEvent, screen } from '@testing-library/react';
import type { DslNode } from '@pactor-app/core';
import { describe, expect, it } from 'vitest';

import { expectEventState, renderDsl } from './helpers.js';

function baseProps(): Record<string, unknown> {
  return {
    selectLabel: '选择',
    filters: [
      { key: 'all', label: '全部' },
      { key: 'meeting', label: '会议' },
    ],
    processingText: '3 条录音处理中',
    processingHint: '另有 3 条处理失败',
    defaultActiveRecordingId: 'r1',
    groups: [
      {
        label: '今天',
        items: [
          { id: 'r1', title: 'Q3 产品定价策略评审会议', time: '07 月 28 日 14:02', duration: '42:18', status: '纪要已生成', statusType: 'success' },
          { id: 'r2', title: '走廊讨论记录', time: '07 月 28 日 11:20', duration: '06:42', status: '上传失败', statusType: 'danger' },
        ],
      },
    ],
    title: 'Q3 产品定价策略评审会议',
    meta: '07 月 28 日 14:02 · 42:18',
    editLabel: '编辑',
    shareLabel: '分享',
    tabs: [
      { key: 'transcript', label: '原文转写' },
      { key: 'summary', label: '详细纪要' },
      { key: 'ai', label: 'AI 解读' },
      { key: 'knowledge', label: '知识记忆' },
      { key: 'translation', label: '翻译' },
      { key: 'custom', label: '自定义', content: { type: 'Text', props: { text: '自定义占位' } } },
    ],
    segments: [
      { speaker: '王原', avatarText: '王', time: '00:42', content: '定价试点先按席位费推进。' },
      { speaker: '发言人 1', time: '02:18', marked: true, content: '制造业客户更关注预算锁定。' },
    ],
    player: { currentTime: '14:22', totalTime: '42:18', progress: 34 },
    summary: {
      mindmapActionLabel: '查看思维导图',
      mindmap: { center: 'Q3 产品评审', left: ['定价试点'], right: ['交付准备', '资源缺口'] },
      overview: '本次评审围绕 Q3 产品路线图 v3 展开。',
      topics: [{ title: '定价试点范围', content: '收窄至制造和医疗。' }],
      conclusions: [{ item: '定价试点', conclusion: '首轮仅覆盖制造、医疗', owner: '李珂' }],
      followUpTitle: '资源缺口与后续',
      followUp: '结论回补前第二批客户暂不进入承诺名单。',
      materials: [{ id: 'm1', title: '上周评审纪要', meta: '7 月 21 日 · 文档' }],
      todos: [
        { id: 't1', title: '对齐财务定价口径', owner: '李珂 · 本周', done: true },
        { id: 't2', title: '更新试点客户邀请名单', owner: '王原 · 周五' },
      ],
      actions: [{ key: 'copy', icon: 'copy' }, { key: 'like', icon: 'thumbs-up' }],
    },
    insight: {
      perspectiveTitle: 'AI 判断你负责产品战略与关键业务决策',
      perspectiveActionLabel: '修改',
      perspectiveHint: '本页会从决策者视角解读会议。',
      basics: '产品团队季度评审会。核心是用范围收窄换取口径一致。',
      chapters: [{ time: '00:05', title: '定点价格', content: '团队先把讨论拉回到价格锚点。' }],
      viewpoints: [
        { speaker: '李珂', label: '数据优先', content: '数据可比性优先于推进速度。' },
        { speaker: '王悦', label: '交付优先', content: '接受顺延，但要求先锁定人力。' },
      ],
      actions: [{ key: 'copy', icon: 'copy' }],
    },
    memory: {
      groups: [
        {
          label: '客观事实',
          items: [
            { title: '企业版交付日期', content: '顺延至 9 月 28 日。' },
            { title: '首轮试点行业', content: '首轮只覆盖制造与医疗。' },
          ],
        },
        {
          label: '决策',
          items: [{ title: '采用双轨定价', content: '试点期间只提醒超额。' }],
        },
      ],
      actions: [{ key: 'copy', icon: 'copy' }],
    },
    translation: {
      languageLabel: '自动判断 → English',
      targetLabel: '译文 · 英语',
      segments: [
        { speaker: '王原', avatarText: '王', source: '从平台现状来看，企业入驻流程已经基本完整。', target: 'The platform now covers company onboarding.' },
        { speaker: '李珂', avatarText: '李', source: '企业版交付前还需要完成安全合规评审。', target: 'Before the enterprise release, we still need to finish the security review.' },
      ],
      actions: [{ key: 'copy', icon: 'copy' }],
    },
  };
}

function renderRecordingPage(
  overrides: Record<string, unknown> = {},
  events?: DslNode['events'],
) {
  return renderDsl({
    type: 'RecordingPage',
    props: { ...baseProps(), ...overrides },
    events,
  });
}

describe('RecordingPage 录音工作区', () => {
  it('整体渲染：左列列表 + 右列详情（头部 / 页签 / 转写段落 / 播放条）', () => {
    const { container } = renderRecordingPage();

    expect(container.querySelector('[data-slot=recording-page]')).not.toBeNull();
    expect(screen.getByText('录音记录列表')).toBeTruthy();
    expect(screen.getByText('全部')).toBeTruthy();
    expect(screen.getByText('3 条录音处理中')).toBeTruthy();
    expect(screen.getByText('开始新录音')).toBeTruthy();
    expect(screen.getByText('纪要已生成')).toBeTruthy();
    // 右列：页签 / 说话人段落 / 已标记徽标 / 播放条
    expect(screen.getByRole('tab', { name: '原文转写' })).toBeTruthy();
    expect(screen.getByText('定价试点先按席位费推进。')).toBeTruthy();
    expect(screen.getByText('⚑ 已标记')).toBeTruthy();
    expect(screen.getByText('14:22')).toBeTruthy();
    expect(container.querySelector('[data-slot=recording-page-player]')).not.toBeNull();
    // 缺省选中 defaultActiveRecordingId 的条目
    expect(
      container.querySelector('[data-slot=recording-item][data-active]')?.textContent,
    ).toContain('Q3 产品定价策略评审会议');
  });

  it('条目点击：非受控切换选中态；受控仅经 onSelectRecording 上报', async () => {
    const { container, context } = renderRecordingPage(
      {},
      { onSelectRecording: { action: 'setState', params: { rec: '${event}' } } },
    );

    fireEvent.click(screen.getByText('走廊讨论记录'));
    await expectEventState(context, 'rec', 'r2');
    expect(
      container.querySelector('[data-slot=recording-item][data-active]')?.textContent,
    ).toContain('走廊讨论记录');
  });

  it('页签切换：transcript 页签渲染 segments，其余页签渲染 content 槽', async () => {
    renderRecordingPage();

    fireEvent.click(screen.getByRole('tab', { name: '自定义' }));
    expect(screen.getByText('自定义占位')).toBeTruthy();
    expect(screen.queryByText('定价试点先按席位费推进。')).toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: '原文转写' }));
    expect(screen.getByText('定价试点先按席位费推进。')).toBeTruthy();
  });

  it('summary 页签内建渲染详细纪要：思维导图 / 概况 / 议题 / 结论表 / 材料 / 待办 / 操作条', async () => {
    const { container, context } = renderRecordingPage(
      { defaultActiveTabKey: 'summary' },
      {
        onMaterialClick: { action: 'setState', params: { material: '${event}' } },
        onTodoClick: { action: 'setState', params: { todo: '${event}' } },
        onSummaryAction: { action: 'setState', params: { op: '${event}' } },
      },
    );

    expect(container.querySelector('[data-slot=recording-summary]')).not.toBeNull();
    expect(screen.getByText('思维导图')).toBeTruthy();
    expect(screen.getByText('Q3 产品评审')).toBeTruthy();
    expect(screen.getByText('会议概况')).toBeTruthy();
    expect(screen.getByText('本次评审围绕 Q3 产品路线图 v3 展开。')).toBeTruthy();
    expect(screen.getByText('定价试点范围')).toBeTruthy();
    expect(screen.getByText('评审结论与后续安排')).toBeTruthy();
    expect(screen.getByText('首轮仅覆盖制造、医疗')).toBeTruthy();
    expect(screen.getByText('结论回补前第二批客户暂不进入承诺名单。')).toBeTruthy();
    expect(screen.getByText('相关材料')).toBeTruthy();
    expect(screen.getByText('待办事项')).toBeTruthy();
    expect(container.querySelector('[data-slot=recording-summary-actions]')).not.toBeNull();
    // transcript 内容不在 summary 页签
    expect(screen.queryByText('定价试点先按席位费推进。')).toBeNull();

    fireEvent.click(screen.getByText('上周评审纪要'));
    await expectEventState(context, 'material', 'm1');

    fireEvent.click(screen.getByText('更新试点客户邀请名单'));
    await expectEventState(context, 'todo', 't2');

    const copyBtn = container.querySelector(
      '[data-slot=recording-summary-actions] button',
    )!;
    fireEvent.click(copyBtn);
    await expectEventState(context, 'op', 'copy');
  });

  it('insight 页签内建渲染 AI 解读：视角横幅 / 基础信息 / 章节速览 / 观点分析 / 操作条', async () => {
    const { container, context } = renderRecordingPage(
      { defaultActiveTabKey: 'ai' },
      {
        onPerspectiveEdit: { action: 'setState', params: { edit: true } },
        onInsightAction: { action: 'setState', params: { op: '${event}' } },
      },
    );

    expect(container.querySelector('[data-slot=recording-insight]')).not.toBeNull();
    expect(screen.getByText('AI 判断你负责产品战略与关键业务决策')).toBeTruthy();
    expect(screen.getByText('本页会从决策者视角解读会议。')).toBeTruthy();
    expect(screen.getByText('基础信息')).toBeTruthy();
    expect(screen.getByText('章节速览与解读')).toBeTruthy();
    expect(screen.getByText('定点价格')).toBeTruthy();
    expect(screen.getByText('00:05')).toBeTruthy();
    expect(screen.getByText('观点分析')).toBeTruthy();
    expect(screen.getByText('李珂')).toBeTruthy();
    expect(screen.getByText('数据优先：')).toBeTruthy();
    expect(screen.getAllByText('自动识别')).toHaveLength(2);
    expect(container.querySelector('[data-slot=recording-insight-actions]')).not.toBeNull();

    fireEvent.click(screen.getByText('修改'));
    await expectEventState(context, 'edit', true);

    const copyBtn = container.querySelector(
      '[data-slot=recording-insight-actions] button',
    )!;
    fireEvent.click(copyBtn);
    await expectEventState(context, 'op', 'copy');
  });

  it('memory 页签内建渲染知识记忆：分组标题自动拼接计数 + 卡片 + 操作条', async () => {
    const { container, context } = renderRecordingPage(
      { defaultActiveTabKey: 'knowledge' },
      { onMemoryAction: { action: 'setState', params: { op: '${event}' } } },
    );

    expect(container.querySelector('[data-slot=recording-memory]')).not.toBeNull();
    expect(screen.getByText('客观事实 · 2')).toBeTruthy();
    expect(screen.getByText('决策 · 1')).toBeTruthy();
    expect(screen.getByText('企业版交付日期')).toBeTruthy();
    expect(screen.getByText('首轮只覆盖制造与医疗。')).toBeTruthy();
    expect(screen.getByText('采用双轨定价')).toBeTruthy();
    expect(container.querySelectorAll('[data-slot=recording-memory-item]')).toHaveLength(3);
    expect(container.querySelector('[data-slot=recording-memory-actions]')).not.toBeNull();

    const copyBtn = container.querySelector(
      '[data-slot=recording-memory-actions] button',
    )!;
    fireEvent.click(copyBtn);
    await expectEventState(context, 'op', 'copy');
  });

  it('translation 页签内建渲染翻译：语言选择器 + 双语对照段落 + 操作条', async () => {
    const { container, context } = renderRecordingPage(
      { defaultActiveTabKey: 'translation' },
      {
        onLanguageClick: { action: 'setState', params: { lang: true } },
        onTranslationAction: { action: 'setState', params: { op: '${event}' } },
      },
    );

    expect(container.querySelector('[data-slot=recording-translation]')).not.toBeNull();
    expect(screen.getByText('自动判断 → English')).toBeTruthy();
    expect(screen.getAllByText('译文 · 英语')).toHaveLength(2);
    expect(screen.getByText('从平台现状来看，企业入驻流程已经基本完整。')).toBeTruthy();
    expect(
      screen.getByText('Before the enterprise release, we still need to finish the security review.'),
    ).toBeTruthy();
    expect(container.querySelectorAll('[data-slot=recording-translation-segment]')).toHaveLength(2);

    fireEvent.click(screen.getByText('自动判断 → English'));
    await expectEventState(context, 'lang', true);

    const copyBtn = container.querySelector(
      '[data-slot=recording-translation-actions] button',
    )!;
    fireEvent.click(copyBtn);
    await expectEventState(context, 'op', 'copy');
  });

  it('过滤与新建事件传出；player 缺省不渲染播放条', async () => {
    const { container, context } = renderRecordingPage(
      { player: undefined },
      {
        onFilterChange: { action: 'setState', params: { filter: '${event}' } },
        onNewRecording: { action: 'setState', params: { created: true } },
      },
    );

    fireEvent.click(screen.getByText('会议'));
    await expectEventState(context, 'filter', 'meeting');

    fireEvent.click(screen.getByText('开始新录音'));
    await expectEventState(context, 'created', true);

    expect(container.querySelector('[data-slot=recording-page-player]')).toBeNull();
  });
});
