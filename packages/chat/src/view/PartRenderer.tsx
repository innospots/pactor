import {
  Brain,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock,
  Loader2,
  XCircle,
} from 'lucide-react';
import { MarkdownRenderer } from 'pactor-markdown';
import { DslRenderer, useRenderer } from 'pactor-runtime';
import { useState, type ReactNode } from 'react';

import { guardChatDsl } from '../dsl-guard.js';
import { useSmoothStreamText } from '../hooks/use-smooth-stream-text.js';
import type { ChatPart } from '../model.js';
import { buildChatScope, type ChatRuntime, type ChatScope } from '../scope.js';

/**
 * PartRenderer：按 part 类型渲染。
 *
 * - text → 文本段落；markdown → pactor-markdown 安全渲染器
 *   （streaming 期间经 useSmoothStreamText 打字机揭示）
 * - dsl → runtime DslRenderer（Safe Registry + chat 作用域），
 *   白名单外节点经 guardChatDsl 替换为受控"不允许"占位
 * - tool-call / tool-result / thinking → 自绘折叠卡（lucide 状态图标）
 * - error → 自绘警示条；status → 弱提示文本
 *
 * 视图零 antd 依赖，颜色经 `pactor-chat/styles.css` 的
 * `--pactor-chat-*` 变量表达。
 */
export interface PartRendererProps {
  part: ChatPart;
  /** dsl part 渲染运行时（缺省时 dsl part 渲染受控占位） */
  runtime?: ChatRuntime;
  /** dsl part 的 chat 作用域 */
  scope?: ChatScope;
  /** 所属消息是否流式中（text/markdown 启用平滑揭示） */
  streaming?: boolean;
}

/** 白名单外组件的受控占位（注册名 ChatDenied，见 dsl-guard） */
export function ChatDenied({ deniedType }: { deniedType?: string }) {
  return (
    <div className="pactor-chat-denied" data-pactor-chat-denied={deniedType}>
      该组件不允许在 Chat 中使用{deniedType ? `：${deniedType}` : ''}
    </div>
  );
}

/** 在 DslRenderer 上下文内注入 chat 局部作用域渲染 DSL 子树 */
function ChatDslNode({
  node,
  scope,
}: {
  node: NonNullable<ChatDslSchema>;
  scope?: ChatScope;
}) {
  const renderer = useRenderer();
  const extraScope = scope ? buildChatScope(scope) : undefined;
  return <>{renderer.renderChildren([node], extraScope)}</>;
}

type ChatDslSchema = Extract<ChatPart, { type: 'dsl' }>['schema'];

const TOOL_STATUS_TEXT: Record<string, string> = {
  waiting: '等待中',
  running: '执行中',
  success: '成功',
  failed: '失败',
};

/** 工具状态图标：running 旋转、success 对勾、failed 叉、waiting 时钟 */
function ToolStatusIcon({ status }: { status: string }) {
  if (status === 'running') {
    return <Loader2 size={14} className="pactor-chat-spin" />;
  }
  if (status === 'success') {
    return <CheckCircle2 size={14} />;
  }
  if (status === 'failed') {
    return <XCircle size={14} />;
  }
  return <Clock size={14} />;
}

/** 自绘折叠卡（thinking / tool-call / tool-result 共用） */
function CollapseCard({
  icon,
  title,
  status,
  defaultOpen = false,
  children,
}: {
  icon: ReactNode;
  title: ReactNode;
  /** 状态修饰（running/success/failed），着色用 */
  status?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="pactor-chat-collapse" data-open={open}>
      <button
        type="button"
        className="pactor-chat-collapse__header"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="pactor-chat-collapse__chevron">
          <ChevronRight size={13} />
        </span>
        <span
          className={
            status ? `pactor-chat-collapse__status--${status}` : undefined
          }
        >
          {icon}
        </span>
        <span>{title}</span>
      </button>
      {open && <div className="pactor-chat-collapse__body">{children}</div>}
    </div>
  );
}

/** streaming 期间的 text part：打字机揭示 */
function SmoothText({ content, streaming }: { content: string; streaming: boolean }) {
  const shown = useSmoothStreamText(content, streaming);
  return <div className="pactor-chat-text">{shown}</div>;
}

/** streaming 期间的 markdown part：打字机揭示 */
function SmoothMarkdown({ content, streaming }: { content: string; streaming: boolean }) {
  const shown = useSmoothStreamText(content, streaming);
  return <MarkdownRenderer content={shown} />;
}

export function PartRenderer({ part, runtime, scope, streaming = false }: PartRendererProps) {
  switch (part.type) {
    case 'text':
      return <SmoothText content={part.content} streaming={streaming} />;

    case 'markdown':
      return <SmoothMarkdown content={part.content} streaming={streaming} />;

    case 'thinking':
      return (
        <CollapseCard icon={<Brain size={14} />} title="思考过程">
          {part.content}
        </CollapseCard>
      );

    case 'dsl': {
      if (!part.schema || !runtime) {
        // dsl.start 占位阶段 / 未注入 Safe Registry 运行时
        return (
          <div className="pactor-chat-dsl-pending">
            {part.schema ? 'DSL 渲染不可用（未注入 Safe Registry）' : '内容生成中…'}
          </div>
        );
      }
      const guarded = guardChatDsl(part.schema, runtime.context.components);
      return (
        <div className="pactor-chat-dsl">
          <DslRenderer context={runtime.context} engine={runtime.engine}>
            <ChatDslNode node={guarded} scope={scope} />
          </DslRenderer>
        </div>
      );
    }

    case 'tool-call':
      return (
        <CollapseCard
          icon={<ToolStatusIcon status={part.status} />}
          title={`${part.title ?? part.name} · ${TOOL_STATUS_TEXT[part.status] ?? part.status}`}
          status={part.status}
        >
          工具：{part.name}
        </CollapseCard>
      );

    case 'tool-result':
      return (
        <CollapseCard
          icon={<ToolStatusIcon status={part.status} />}
          title={`${part.name} 结果 · ${TOOL_STATUS_TEXT[part.status] ?? part.status}`}
          status={part.status}
        >
          <pre>
            {part.status === 'failed'
              ? (part.error ?? '执行失败')
              : formatResult(part.result)}
          </pre>
        </CollapseCard>
      );

    case 'error':
      return (
        <div className="pactor-chat-error" role="alert">
          <CircleAlert size={14} />
          <span>{part.message}</span>
        </div>
      );

    case 'status':
      return <div className="pactor-chat-status">{part.text}</div>;

    default:
      return null;
  }
}

function formatResult(result: unknown): ReactNode | string {
  if (result === undefined) {
    return '（无返回）';
  }
  if (typeof result === 'string') {
    return result;
  }
  try {
    return JSON.stringify(result, null, 2);
  } catch {
    return String(result);
  }
}
