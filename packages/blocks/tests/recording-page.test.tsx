// @vitest-environment jsdom
/**
 * RecordingPage 录音工作区契约：左列列表（标题 / 过滤 pills / 状态横幅 /
 * 新建钮 / 分组条目）+ 右列详情（头部 / 页签 / 说话人段落 / 播放条）；
 * 过滤、选中录音与页签缺省非受控，可经受控 prop + change 事件闭环。
 */
import { fireEvent, screen, within } from '@testing-library/react';
import type { DslNode } from '@pactor-app/core';
import { describe, expect, it, vi } from 'vitest';

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
    shareOptions: [
      { key: 'summary', label: '详细纪要', disabled: true },
      { key: 'audio', label: '录音' },
      { key: 'insight', label: 'AI 解读' },
      { key: 'transcript', label: '原文转写 · 含发言人' },
    ],
    defaultShareSelectedKeys: ['summary', 'audio', 'insight'],
    shareLink: 'https://hojo.app/share/q3-product-review',
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
    speakers: [
      { name: '王原', role: '产品负责人 · Hojo', tag: '参会人' },
      { name: '李珂', role: '产品设计 · Hojo', tag: '参会人' },
      { name: '王悦', role: '交付负责人 · Acme', tag: '自动识别' },
      { name: '陈致远', role: '客户成功 · Acme', tag: '用户创建' },
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
        onMindmapAction: { action: 'setState', params: { mindmap: true } },
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

    fireEvent.click(screen.getByText('查看思维导图'));
    await expectEventState(context, 'mindmap', true);

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

  it('待办事项：点击组件内切换选中态，onTodoSelectionChange 传出完整选中列表', async () => {
    const { container, context } = renderRecordingPage(
      { defaultActiveTabKey: 'summary' },
      {
        onTodoClick: { action: 'setState', params: { clicked: '${event}' } },
        onTodoSelectionChange: { action: 'setState', params: { selected: '${event}' } },
      },
    );

    const pressedStates = () =>
      [...container.querySelectorAll('[data-slot=recording-todo]')].map((el) =>
        el.getAttribute('aria-pressed'),
      );
    // 初始：done=true 的 t1 选中
    expect(pressedStates()).toEqual(['true', 'false']);

    // 选中 t2：传出完整列表 [t1, t2]，onTodoClick 仍传出当前 id
    fireEvent.click(screen.getByText('更新试点客户邀请名单'));
    await expectEventState(context, 'clicked', 't2');
    await expectEventState(context, 'selected', ['t1', 't2']);
    expect(pressedStates()).toEqual(['true', 'true']);

    // 再点 t1 取消选中：传出 [t2]
    fireEvent.click(screen.getByText('对齐财务定价口径'));
    await expectEventState(context, 'clicked', 't1');
    await expectEventState(context, 'selected', ['t2']);
    expect(pressedStates()).toEqual(['false', 'true']);
  });

  it('transcript 改名铅笔打开修改发言人弹层：列表选人应用并传出事件', async () => {
    const { container, context } = renderRecordingPage(
      {},
      {
        onSpeakerChange: {
          action: 'setState',
          params: { idx: '${event.index}', prev: '${event.previous}', name: '${event.name}' },
        },
      },
    );

    // 点第一段的改名铅笔打开弹层
    fireEvent.click(container.querySelector('[data-slot=recording-speaker-edit]')!);
    await screen.findByText('修改发言人');
    expect(
      screen.getByText('选择参会信息、已识别人员或你曾手动创建的联系人。'),
    ).toBeTruthy();
    // 当前发言人（王原）预选中
    const options = document.querySelectorAll('[data-slot=recording-speaker-option]');
    expect(options).toHaveLength(4);
    expect(options[0].getAttribute('aria-pressed')).toBe('true');

    // 改选李珂 → 应用姓名：组件内更新展示名 + 事件传出
    fireEvent.click(screen.getByText('李珂'));
    fireEvent.click(screen.getByRole('button', { name: '应用姓名' }));
    await expectEventState(context, 'idx', 0);
    await expectEventState(context, 'prev', '王原');
    await expectEventState(context, 'name', '李珂');
    await vi.waitFor(() => {
      expect(screen.queryByText('修改发言人')).toBeNull();
    });
    expect(screen.getByText('李珂')).toBeTruthy();
    expect(screen.queryByText('王原')).toBeNull();
  });

  it('transcript 修改发言人弹层：自由输入姓名优先于列表，X 关闭丢弃草稿', async () => {
    const { container, context } = renderRecordingPage(
      {},
      {
        onSpeakerChange: { action: 'setState', params: { name: '${event.name}' } },
      },
    );

    // 第二段（发言人 1）输入自定义姓名后应用
    const editButtons = container.querySelectorAll('[data-slot=recording-speaker-edit]');
    fireEvent.click(editButtons[1]);
    await screen.findByText('修改发言人');
    // 未选选项且未输入时应用按钮禁用
    expect(
      (screen.getByRole('button', { name: '应用姓名' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    fireEvent.change(
      document.querySelector('[data-slot=recording-speaker-dialog] input')!,
      { target: { value: '张产品' } },
    );
    fireEvent.click(screen.getByRole('button', { name: '应用姓名' }));
    await expectEventState(context, 'name', '张产品');
    expect(screen.getByText('张产品')).toBeTruthy();

    // 再打开选人后 X 关闭：不应用、展示名不变
    fireEvent.click(container.querySelectorAll('[data-slot=recording-speaker-edit]')[1]);
    await screen.findByText('修改发言人');
    fireEvent.click(screen.getByText('王悦'));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await vi.waitFor(() => {
      expect(screen.queryByText('修改发言人')).toBeNull();
    });
    expect(screen.queryByText('王悦')).toBeNull();
    expect(screen.getByText('张产品')).toBeTruthy();
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

  it('翻译语种弹层：点语言选择器打开，确定提交 onLanguageChange 并关闭', async () => {
    const { context } = renderRecordingPage(
      {
        defaultActiveTabKey: 'translation',
        translation: {
          ...baseProps().translation as Record<string, unknown>,
          sourceLanguages: [
            { key: 'auto', label: '自动判断' },
            { key: 'zh', label: '中文' },
            { key: 'en', label: '英语' },
          ],
          targetLanguages: [
            { key: 'zh', label: '中文' },
            { key: 'en', label: 'English' },
            { key: 'ja', label: '日本語' },
          ],
        },
      },
      {
        onLanguageChange: {
          action: 'setState',
          params: {
            source: '${event.source}',
            target: '${event.target}',
            targetLabel: '${event.targetLabel}',
          },
        },
      },
    );

    fireEvent.click(screen.getByText('自动判断 → English'));
    await screen.findByText('选择翻译语言');
    expect(screen.getByText('原文语言识别')).toBeTruthy();
    expect(screen.getByText('译文语言选择')).toBeTruthy();
    // 缺省非受控选中各列首项
    const options = document.querySelectorAll('[data-slot=recording-language-option]');
    expect(options).toHaveLength(6);
    expect(options[0].getAttribute('aria-pressed')).toBe('true');
    expect(options[3].getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByText('日本語'));
    fireEvent.click(screen.getByRole('button', { name: '确定' }));
    await expectEventState(context, 'source', 'auto');
    await expectEventState(context, 'target', 'ja');
    await expectEventState(context, 'targetLabel', '日本語');
    await vi.waitFor(() => {
      expect(screen.queryByText('选择翻译语言')).toBeNull();
    });
  });

  it('翻译语种弹层：取消丢弃草稿，再次打开回到已提交选中', async () => {
    const { context } = renderRecordingPage(
      {
        defaultActiveTabKey: 'translation',
        translation: {
          ...baseProps().translation as Record<string, unknown>,
          defaultTargetLanguage: 'en',
          sourceLanguages: [
            { key: 'auto', label: '自动判断' },
            { key: 'en', label: '英语' },
          ],
          targetLanguages: [
            { key: 'en', label: 'English' },
            { key: 'ja', label: '日本語' },
          ],
        },
      },
      {
        onLanguageChange: { action: 'setState', params: { changed: true } },
      },
    );

    fireEvent.click(screen.getByText('自动判断 → English'));
    await screen.findByText('选择翻译语言');
    // 草稿改为「英语」后取消：不提交、不触发事件
    fireEvent.click(screen.getByText('英语'));
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    await vi.waitFor(() => {
      expect(screen.queryByText('选择翻译语言')).toBeNull();
    });
    expect(context.state.get('changed')).toBeUndefined();

    // 再次打开：草稿回到已提交值（auto / en）
    fireEvent.click(screen.getByText('自动判断 → English'));
    await screen.findByText('选择翻译语言');
    const options = document.querySelectorAll('[data-slot=recording-language-option]');
    expect(options[0].getAttribute('aria-pressed')).toBe('true');
    expect(options[2].getAttribute('aria-pressed')).toBe('true');
  });

  it('解读身份弹层：点「修改」打开，应用提交 onPerspectiveApply 并关闭', async () => {
    const { context } = renderRecordingPage(
      {
        defaultActiveTabKey: 'ai',
        insight: {
          ...baseProps().insight as Record<string, unknown>,
          defaultPerspectiveInput: '我是产品负责人，关注产品战略、团队目标和关键业务决策。',
        },
      },
      {
        onPerspectiveApply: { action: 'setState', params: { identity: '${event}' } },
      },
    );

    fireEvent.click(screen.getByText('修改'));
    await screen.findByText('修改解读身份');
    expect(screen.getByText('用自然语言说明你在本次会议中的身份与关注点。')).toBeTruthy();
    const textarea = document.querySelector(
      '[data-slot=recording-perspective-dialog] textarea',
    ) as HTMLTextAreaElement;
    expect(textarea.value).toBe('我是产品负责人，关注产品战略、团队目标和关键业务决策。');

    fireEvent.change(textarea, { target: { value: '我是销售负责人，关注试点名单。' } });
    fireEvent.click(screen.getByRole('button', { name: '应用身份' }));
    await expectEventState(context, 'identity', '我是销售负责人，关注试点名单。');
    await vi.waitFor(() => {
      expect(screen.queryByText('修改解读身份')).toBeNull();
    });

    // 非受控提交后再次打开：草稿为已提交文本
    fireEvent.click(screen.getByText('修改'));
    await screen.findByText('修改解读身份');
    expect(
      (document.querySelector('[data-slot=recording-perspective-dialog] textarea') as HTMLTextAreaElement).value,
    ).toBe('我是销售负责人，关注试点名单。');
  });

  it('解读身份弹层：取消丢弃草稿，不触发 onPerspectiveApply', async () => {
    const { context } = renderRecordingPage(
      {
        defaultActiveTabKey: 'ai',
        insight: {
          ...baseProps().insight as Record<string, unknown>,
          defaultPerspectiveInput: '初始身份',
        },
      },
      {
        onPerspectiveApply: { action: 'setState', params: { identity: '${event}' } },
      },
    );

    fireEvent.click(screen.getByText('修改'));
    await screen.findByText('修改解读身份');
    fireEvent.change(
      document.querySelector('[data-slot=recording-perspective-dialog] textarea')!,
      { target: { value: '改过的身份' } },
    );
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    await vi.waitFor(() => {
      expect(screen.queryByText('修改解读身份')).toBeNull();
    });
    expect(context.state.get('identity')).toBeUndefined();

    // 再次打开：草稿回到初始文本
    fireEvent.click(screen.getByText('修改'));
    await screen.findByText('修改解读身份');
    expect(
      (document.querySelector('[data-slot=recording-perspective-dialog] textarea') as HTMLTextAreaElement).value,
    ).toBe('初始身份');
  });

  it('分享：点「分享」弹出选择分享内容 Popover，确定传出选中列表并打开分享对话框', async () => {
    const { context } = renderRecordingPage(
      {},
      {
        onShareConfirm: { action: 'setState', params: { shareKeys: '${event}' } },
        onShareChannel: { action: 'setState', params: { channel: '${event}' } },
      },
    );

    fireEvent.click(screen.getAllByRole('button', { name: '分享' })[0]);
    await screen.findByText('选择分享内容');
    const options = document.querySelectorAll('[data-slot=recording-share-option]');
    expect(options).toHaveLength(4);
    // 初始选中前三个；详细纪要禁用锁定
    expect(options[0].getAttribute('aria-pressed')).toBe('true');
    expect((options[0] as HTMLButtonElement).disabled).toBe(true);
    expect(options[3].getAttribute('aria-pressed')).toBe('false');

    // 禁用项点击不改变勾选
    const popover = () =>
      within(document.querySelector('[data-slot=recording-share-popover]') as HTMLElement);
    fireEvent.click(popover().getByText('详细纪要'));
    expect(options[0].getAttribute('aria-pressed')).toBe('true');

    // 勾选「原文转写 · 含发言人」后确定：按选项顺序传出完整列表
    fireEvent.click(popover().getByText('原文转写 · 含发言人'));
    fireEvent.click(popover().getByRole('button', { name: '确定' }));
    await expectEventState(context, 'shareKeys', ['summary', 'audio', 'insight', 'transcript']);

    // 确定后打开分享对话框
    await screen.findByText('分享会议内容');
    expect(screen.getByText('https://hojo.app/share/q3-product-review')).toBeTruthy();
    // 复制链接：真实写剪贴板 + 按钮短暂变为「已复制」+ 渠道事件
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    fireEvent.click(screen.getByRole('button', { name: '复制链接' }));
    expect(writeText).toHaveBeenCalledWith('https://hojo.app/share/q3-product-review');
    expect(screen.getByRole('button', { name: '已复制' })).toBeTruthy();
    await expectEventState(context, 'channel', 'copyLink');
    fireEvent.click(screen.getByRole('button', { name: '邮件' }));
    await expectEventState(context, 'channel', 'mail');
    fireEvent.click(screen.getByRole('button', { name: '系统分享' }));
    await expectEventState(context, 'channel', 'system');
  });

  it('分享 Popover：取消丢弃草稿，重开回到已提交选中', async () => {
    renderRecordingPage();

    fireEvent.click(screen.getAllByRole('button', { name: '分享' })[0]);
    await screen.findByText('选择分享内容');
    const popover = () =>
      within(document.querySelector('[data-slot=recording-share-popover]') as HTMLElement);
    // 取消勾选「录音」后点取消
    fireEvent.click(popover().getByText('录音'));
    fireEvent.click(popover().getByRole('button', { name: '取消' }));
    await vi.waitFor(() => {
      expect(screen.queryByText('选择分享内容')).toBeNull();
    });

    fireEvent.click(screen.getAllByRole('button', { name: '分享' })[0]);
    await screen.findByText('选择分享内容');
    const options = document.querySelectorAll('[data-slot=recording-share-option]');
    expect(options[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('多选模式：点「选择」进入，勾选/全选/删除传出事件，「完成」退出', async () => {
    const { container, context } = renderRecordingPage(
      {},
      {
        onSelectClick: { action: 'setState', params: { selecting: true } },
        onRecordingSelectionChange: { action: 'setState', params: { sel: '${event}' } },
        onDeleteRecordings: { action: 'setState', params: { deleted: '${event}' } },
      },
    );
    const list = () =>
      within(container.querySelector('[data-slot=recording-page-list]') as HTMLElement);

    // 进入多选模式
    fireEvent.click(list().getByText('选择'));
    await expectEventState(context, 'selecting', true);
    expect(list().getByText('完成')).toBeTruthy();
    expect(list().getByText('已选 0 条')).toBeTruthy();
    expect(list().getByText('全选')).toBeTruthy();
    // 过滤 pills / 处理横幅 / 新建钮收起，底部出现删除
    expect(list().queryByText('开始新录音')).toBeNull();
    expect(container.querySelector('[data-slot=recording-page-filters]')).toBeNull();
    expect(container.querySelector('[data-slot=recording-page-processing]')).toBeNull();
    expect(list().getByRole('button', { name: '删除' })).toBeTruthy();
    // 条目 aria-pressed 进入可选态
    expect(container.querySelectorAll('[data-slot=recording-item][aria-pressed]')).toHaveLength(2);

    // 逐条勾选：传出完整选中列表 + 计数更新
    fireEvent.click(list().getByText('Q3 产品定价策略评审会议'));
    await expectEventState(context, 'sel', ['r1']);
    fireEvent.click(list().getByText('走廊讨论记录'));
    await expectEventState(context, 'sel', ['r1', 'r2']);
    expect(list().getByText('已选 2 条')).toBeTruthy();

    // 全选：已全部选中时再点清空；再点重新全选
    fireEvent.click(list().getByText('全选'));
    await expectEventState(context, 'sel', []);
    expect(list().getByText('已选 0 条')).toBeTruthy();
    fireEvent.click(list().getByText('全选'));
    await expectEventState(context, 'sel', ['r1', 'r2']);

    // 删除：先弹二次确认，取消不触发事件
    fireEvent.click(list().getByRole('button', { name: '删除' }));
    await screen.findByText('删除录音');
    expect(screen.getByText('确定删除选中的 2 条录音吗？删除后不可恢复。')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    await vi.waitFor(() => {
      expect(screen.queryByText('删除录音')).toBeNull();
    });
    expect(context.state.get('deleted')).toBeUndefined();

    // 再次删除并确认：传出选中 id 列表
    fireEvent.click(list().getByRole('button', { name: '删除' }));
    await screen.findByText('删除录音');
    fireEvent.click(screen.getByRole('alertdialog').querySelector('[data-slot=alert-dialog-action]')!);
    await expectEventState(context, 'deleted', ['r1', 'r2']);
    await vi.waitFor(() => {
      expect(screen.queryByText('删除录音')).toBeNull();
    });

    // 完成退出多选模式
    fireEvent.click(list().getByText('完成'));
    expect(list().getByText('选择')).toBeTruthy();
    expect(list().queryByText('全选')).toBeNull();
    expect(list().getByText('开始新录音')).toBeTruthy();
  });
});
