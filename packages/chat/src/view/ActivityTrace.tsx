import { Icon } from '@pactor-app/ui/components';
import { MarkdownRenderer } from '@pactor-app/markdown';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import {
  detectStreamingMode,
  pairToolTraces,
  type StreamingMode,
  type ToolTraceEntry,
} from '../activity.js';
import type { ChatMessage, ChatPart } from '../model.js';
import { useThrottledValue } from '../hooks/use-throttled-value.js';

/**
 * ActivityTrace（spec: chat-activity-trace，设计决策 D1/D4）：
 * assistant 消息顶部的活动轨迹区。
 *
 * - 流式状态头（StreamingStatus）：动画图标 + 呼吸状态文案 + 秒级计时，
 *   模式由纯函数 detectStreamingMode 推导；消息结束后定格为完成态；
 *   状态头同时是外层容器的折叠开关，统一折叠/展开区内全部内容；
 * - 配对工具轨迹（TraceRow）：pairToolTraces 输出的单行可展开条目，
 *   与状态头同块、紧随其后；
 * - thinking 折叠卡（ThinkingCard）：与工具列表并排的独立块，
 *   markdown 正文，流式展开 + 进行中指示，
 *   答案阶段自动折叠，用户操作后 pin。
 *
 * 折叠状态机（每条消息独立，随组件实例记忆）：`auto | pinned-open |
 * pinned-closed`——auto 跟随流式阶段但带单向闩锁（自动折叠一次后
 * 不再自动展开，防止 mode 回跳引起展开/折叠闪烁）；用户点击后 pin，
 * 不再自动变更。
 */

export interface ActivityTraceProps {
  message: ChatMessage;
}

/** 折叠状态机（D4）：auto 跟随 autoOpen；pin 后不再自动变更 */
type TraceCollapse = 'auto' | 'pinned-open' | 'pinned-closed';

/**
 * auto 档单向闩锁：见过一次自动折叠后即锁定折叠——流式期间 mode 在
 * reasoning/tool/responding 间回跳（正文流式中又来工具调用 / 思考）时，
 * 展开 ↔ 折叠不反复切换（闪烁）；用户手动 toggle 仍可 pin 展开
 */
function usePinnedCollapse(autoOpen: boolean): {
  open: boolean;
  toggle: () => void;
} {
  const [state, setState] = useState<TraceCollapse>('auto');
  const autoCollapsedRef = useRef(false);
  if (state === 'auto' && !autoOpen) {
    autoCollapsedRef.current = true;
  }
  const open =
    state === 'auto'
      ? autoOpen && !autoCollapsedRef.current
      : state === 'pinned-open';
  const toggle = (): void => {
    setState(open ? 'pinned-closed' : 'pinned-open');
  };
  return { open, toggle };
}

const STREAMING_STATUS_TEXT: Record<StreamingMode, string> = {
  reasoning: '正在思考…',
  tool: '正在调用工具…',
  responding: '正在生成回复…',
};

/** 状态头文案：流式期间按模式，结束后定格完成态 */
function statusText(
  message: ChatMessage,
  mode: StreamingMode | null,
  toolCount: number,
): string {
  if (message.status === 'pending' || message.status === 'streaming') {
    return mode ? STREAMING_STATUS_TEXT[mode] : '正在响应…';
  }
  if (message.status === 'error') {
    return '出错了';
  }
  if (message.status === 'cancelled') {
    return '已停止';
  }
  return toolCount > 0 ? `已完成 · ${toolCount} 个工具调用` : '已完成';
}

/** 秒级已用时长：流式期间每秒钟跳动，结束后定格（interval 清除即冻结） */
function useElapsedSeconds(startedAt: number, active: boolean): number {
  const compute = (): number =>
    Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  const [elapsed, setElapsed] = useState(compute);
  useEffect(() => {
    // 定格：非活动态只做一次性对齐（结束时取到最终时长），不再跳动
    if (!active) {
      setElapsed(compute());
      return;
    }
    const tick = (): void => setElapsed(compute());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, startedAt]);
  return elapsed;
}

/** 工具状态图标：waiting 时钟、running 旋转、success 对勾、failed 叉 */
function TraceStatusIcon({ status }: { status: string }) {
  if (status === 'running') {
    return <Icon name="loading" size={13} className="pactor-chat-spin" />;
  }
  if (status === 'success') {
    return <Icon name="check-circle" size={13} />;
  }
  if (status === 'failed') {
    return <Icon name="x-circle" size={13} />;
  }
  return <Icon name="clock" size={13} />;
}

/** 参数摘要：单行压缩展示（CSS 负责超长省略） */
function summarizeArgs(args: unknown): string {
  if (args === undefined) {
    return '';
  }
  if (typeof args === 'string') {
    return args;
  }
  try {
    return JSON.stringify(args) ?? '';
  } catch {
    return String(args);
  }
}

function formatDetail(value: unknown): string {
  if (value === undefined) {
    return '（无返回）';
  }
  if (typeof value === 'string') {
    return value;
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/** 单行可展开轨迹条目：名称 + 参数摘要 + 状态图标；展开显示参数与结果/错误 */
function TraceRow({ entry }: { entry: ToolTraceEntry }) {
  const [open, setOpen] = useState(false);
  const summary = summarizeArgs(entry.args);
  return (
    <div
      className="pactor-chat-trace__entry"
      data-status={entry.status}
      data-open={open}
    >
      <button
        type="button"
        className="pactor-chat-trace__entry-header"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="pactor-chat-trace__chevron">
          <Icon name="chevron-right" size={12} />
        </span>
        <span className="pactor-chat-trace__entry-icon">
          <TraceStatusIcon status={entry.status} />
        </span>
        <span className="pactor-chat-trace__entry-title">
          {entry.title ?? entry.name}
        </span>
        {summary && (
          <span className="pactor-chat-trace__entry-args">{summary}</span>
        )}
      </button>
      {open && (
        <div className="pactor-chat-trace__entry-body">
          {entry.args !== undefined && (
            <pre className="pactor-chat-trace__entry-detail">
              {formatDetail(entry.args)}
            </pre>
          )}
          <pre className="pactor-chat-trace__entry-detail">
            {entry.status === 'failed'
              ? (entry.error ?? '执行失败')
              : formatDetail(entry.result)}
          </pre>
        </div>
      )}
    </div>
  );
}

type ThinkingPart = Extract<ChatPart, { type: 'thinking' }>;

/** thinking 折叠卡：markdown 正文；流式展开 + 进行中指示，答案阶段自动折叠，支持 pin。
 * 流式期间正文走节流纯文本（推理模型的 reasoning 可达数万 token，
 * 逐 token 全量 markdown 解析是 O(n²)，会卡顿甚至崩溃）；结束后回切 markdown */
function ThinkingCard({
  part,
  answerPhase,
}: {
  part: ThinkingPart;
  answerPhase: boolean;
}) {
  const partStreaming = part.status === 'streaming';
  const shown = useThrottledValue(part.content, 120, partStreaming);
  const { open, toggle } = usePinnedCollapse(partStreaming && !answerPhase);
  return (
    <div
      className="pactor-chat-thinking"
      data-open={open}
      data-streaming={partStreaming}
    >
      <button
        type="button"
        className="pactor-chat-thinking__header"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="pactor-chat-trace__chevron">
          <Icon name="chevron-right" size={12} />
        </span>
        <span className="pactor-chat-thinking__icon">
          {partStreaming ? (
            <Icon name="loading" size={13} className="pactor-chat-spin" />
          ) : (
            <Icon name="brain" size={13} />
          )}
        </span>
        <span>思考过程</span>
      </button>
      {open && (
        <div className="pactor-chat-thinking__body">
          {partStreaming ? (
            <div className="pactor-chat-thinking__text">{shown}</div>
          ) : (
            <MarkdownRenderer content={part.content} />
          )}
        </div>
      )}
    </div>
  );
}

export function ActivityTrace({ message }: ActivityTraceProps) {
  const mode = detectStreamingMode(message);
  const streaming =
    message.status === 'pending' || message.status === 'streaming';
  const entries = pairToolTraces(message.parts);
  const thinkingParts = message.parts.filter(
    (part): part is ThinkingPart => part.type === 'thinking',
  );
  // 答案阶段：正文开始流式（responding）或消息已结束 → 轨迹区自动折叠
  const answerPhase = mode === 'responding' || !streaming;
  const { open, toggle } = usePinnedCollapse(!answerPhase);
  // 外层统一折叠：工具列表或 thinking 任一存在即可折叠展开
  const collapsible = entries.length > 0 || thinkingParts.length > 0;

  // 计时起点：消息创建时间；缺省（直接 append 的历史消息）用组件挂载时刻
  const mountTimeRef = useRef(0);
  if (mountTimeRef.current === 0) {
    mountTimeRef.current = Date.now();
  }
  const elapsed = useElapsedSeconds(
    message.createdAt ?? mountTimeRef.current,
    streaming,
  );

  const header: ReactNode = (
    <>
      <span className="pactor-chat-trace__status-icon">
        {streaming ? (
          <Icon name="loading" size={13} className="pactor-chat-spin" />
        ) : (
          <Icon name="check-circle" size={13} />
        )}
      </span>
      <span
        className={`pactor-chat-trace__status-text${
          streaming ? ' pactor-chat-trace__status-text--breathing' : ''
        }`}
      >
        {statusText(message, mode, entries.length)}
      </span>
      <span className="pactor-chat-trace__elapsed">{elapsed}s</span>
      {collapsible && (
        <span className="pactor-chat-trace__chevron">
          <Icon name="chevron-right" size={12} />
        </span>
      )}
    </>
  );

  return (
    <div className="pactor-chat-trace" data-open={open}>
      {collapsible ? (
        <button
          type="button"
          className="pactor-chat-trace__header"
          aria-expanded={open}
          onClick={toggle}
        >
          {header}
        </button>
      ) : (
        <div className="pactor-chat-trace__header">{header}</div>
      )}
      {open && (
        <>
          {entries.length > 0 && (
            <div className="pactor-chat-trace__entries">
              {entries.map((entry) => (
                <TraceRow key={entry.callIndex} entry={entry} />
              ))}
            </div>
          )}
          {thinkingParts.map((part, index) => (
            <ThinkingCard
              key={part.id ?? index}
              part={part}
              answerPhase={answerPhase}
            />
          ))}
        </>
      )}
    </div>
  );
}
