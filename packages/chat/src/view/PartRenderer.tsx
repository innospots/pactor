import { CircleAlert } from 'lucide-react';
import { MarkdownRenderer } from 'pactor-markdown';
import { DslRenderer, useRenderer } from 'pactor-runtime';

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
 * - tool-call / tool-result / thinking → 不在此渲染（由 assistant 消息
 *   顶部的 ActivityTrace 配对 / 折叠呈现，见 chat-activity-trace）
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
    case 'tool-call':
    case 'tool-result':
      // 由 ActivityTrace 统一渲染（配对轨迹 / 思考折叠卡），此处不再输出
      return null;

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
