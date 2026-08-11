import { Alert, Collapse } from 'antd';
import { MarkdownRenderer } from 'pactor-markdown';
import { DslRenderer, useRenderer } from 'pactor-runtime';
import type { ReactNode } from 'react';

import { guardChatDsl } from '../dsl-guard.js';
import type { ChatPart } from '../model.js';
import { buildChatScope, type ChatRuntime, type ChatScope } from '../scope.js';

/**
 * PartRenderer（设计决策 D6）：按 part 类型渲染。
 *
 * - text → 文本段落；markdown → pactor-markdown 安全渲染器
 * - dsl → runtime DslRenderer（Safe Registry + chat 作用域），
 *   白名单外节点经 guardChatDsl 替换为受控"不允许"占位
 * - tool-call / tool-result → antd Collapse 状态卡（设计文档第 71 节）
 * - thinking → 默认折叠（第 72 节，与正文分离）
 * - error → antd Alert；status → 弱提示文本
 */
export interface PartRendererProps {
  part: ChatPart;
  /** dsl part 渲染运行时（缺省时 dsl part 渲染受控占位） */
  runtime?: ChatRuntime;
  /** dsl part 的 chat 作用域 */
  scope?: ChatScope;
}

/** 白名单外组件的受控占位（注册名 ChatDenied，见 dsl-guard） */
export function ChatDenied({ deniedType }: { deniedType?: string }) {
  return (
    <div
      className="pactor-chat-denied"
      data-pactor-chat-denied={deniedType}
      style={{
        border: '1px dashed #d9d9d9',
        borderRadius: 4,
        padding: 8,
        color: '#8c8c8c',
        fontSize: 12,
      }}
    >
      该组件不允许在 Chat 中使用{deniedType ? `：${deniedType}` : ''}
    </div>
  );
}

/** 在 DslRenderer 上下文内注入 chat 局部作用域渲染 DSL 子树 */
function ChatDslNode({ node, scope }: { node: NonNullable<ChatDslSchema>; scope?: ChatScope }) {
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

export function PartRenderer({ part, runtime, scope }: PartRendererProps) {
  switch (part.type) {
    case 'text':
      return (
        <div className="pactor-chat-text" style={{ whiteSpace: 'pre-wrap' }}>
          {part.content}
        </div>
      );

    case 'markdown':
      return <MarkdownRenderer content={part.content} />;

    case 'thinking':
      return (
        <Collapse
          className="pactor-chat-thinking"
          ghost
          items={[
            {
              key: 'thinking',
              label: '思考过程',
              children: (
                <div style={{ whiteSpace: 'pre-wrap', color: '#8c8c8c' }}>
                  {part.content}
                </div>
              ),
            },
          ]}
        />
      );

    case 'dsl': {
      if (!part.schema || !runtime) {
        // dsl.start 占位阶段 / 未注入 Safe Registry 运行时
        return (
          <div className="pactor-chat-dsl-pending" style={{ color: '#8c8c8c', fontSize: 12 }}>
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
        <Collapse
          className="pactor-chat-tool"
          ghost
          items={[
            {
              key: 'tool',
              label: `${part.title ?? part.name} · ${TOOL_STATUS_TEXT[part.status] ?? part.status}`,
              children: (
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                  工具：{part.name}
                </div>
              ),
            },
          ]}
        />
      );

    case 'tool-result':
      return (
        <Collapse
          className="pactor-chat-tool"
          ghost
          items={[
            {
              key: 'tool-result',
              label: `${part.name} 结果 · ${TOOL_STATUS_TEXT[part.status] ?? part.status}`,
              children: (
                <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>
                  {part.status === 'failed'
                    ? (part.error ?? '执行失败')
                    : formatResult(part.result)}
                </pre>
              ),
            },
          ]}
        />
      );

    case 'error':
      // DSL 语义为 message；antd v6 对应 prop 为 title（同 components Alert 适配约定）
      return <Alert type="error" title={part.message} />;

    case 'status':
      return (
        <div className="pactor-chat-status" style={{ color: '#8c8c8c', fontSize: 12 }}>
          {part.text}
        </div>
      );

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
