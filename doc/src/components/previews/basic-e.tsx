/**
 * 组件运行态预览注册表（AI 与会话批）：chat 展示组件（@pactor-app/chat/components）
 * 的代表形态；统一以 DslPreview 真实 DSL 渲染（Composer / ChatInput
 * 的 DSL 槽位需 Renderer 上下文，纯 React 宿主可直接传 React 元素槽）。
 */
import { useState, type ReactElement } from 'react';
import {
  AgentStatus,
  Attachment,
  Bubble,
  ChatMessage,
  Citation,
  ConversationList,
  MessageList,
  Prompt,
  Sender,
  StreamingText,
  Suggestion,
  Thinking,
  ToolCall,
  Welcome,
} from '@pactor-app/chat/components';
import DslPreview from './DslPreview';

const columnStyle = { display: 'flex', flexDirection: 'column', gap: 12 } as const;
const noteStyle = { fontSize: 12, color: 'var(--muted-text)' } as const;

function BubblePreview() {
  return (
    <div style={columnStyle}>
      <Bubble variant="muted">
        <span style={{ fontSize: 14 }}>你好，我是助手（muted / start）。</span>
      </Bubble>
      <Bubble variant="default" align="end">
        <span style={{ fontSize: 14 }}>你好，请帮我写一份月报（default / end）。</span>
      </Bubble>
    </div>
  );
}

function SenderPreview() {
  return (
    <div style={columnStyle}>
      <Sender name="小 P" role="AI 助手" time="10:24" />
      <Sender name="我" time="10:25" align="end" />
    </div>
  );
}

function ThinkingPreview() {
  return (
    <div style={columnStyle}>
      <Thinking content={'1. 用户要月报，需要先取数\n2. 调用 search_docs 检索模板\n3. 汇总后输出'} />
      <Thinking status="done" content="已完成的推理（默认折叠，点击展开）" />
    </div>
  );
}

function AgentStatusPreview() {
  return (
    <div style={columnStyle}>
      <AgentStatus status="running" text="检索文档" elapsed={3} />
      <AgentStatus status="waiting" text="等待用户确认" />
      <AgentStatus status="done" text="任务完成" />
      <AgentStatus status="error" text="检索超时" />
    </div>
  );
}

function StreamingTextPreview() {
  return (
    <div style={columnStyle}>
      <div>
        <StreamingText content="正在生成回答（数据源推送模式）" streaming />
      </div>
      <div>
        <StreamingText content="打字机模式：这段文字会逐字显现，适合回放场景。" typing speed={3} />
      </div>
    </div>
  );
}

function SuggestionPreview() {
  return (
    <div style={columnStyle}>
      <Suggestion
        items={['换个角度分析', { label: '生成表格', value: 'to-table', icon: 'list' }, '展开第三点']}
      />
      <span style={noteStyle}>点击 chip 经 onSelect 传出 value（预览未绑定动作）。</span>
    </div>
  );
}

function PromptPreview() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 560 }}>
      <Prompt title="生成月报" description="汇总本月数据并输出报告" icon="chart-column" />
      <Prompt title="翻译文档" description="中英互译，保留格式" icon="languages" />
    </div>
  );
}

function WelcomePreview() {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8 }}>
      <Welcome
        description="可以问答、写作、分析你的数据"
        prompts={[
          { title: '写周报', description: '基于本周工作生成周报', value: 'weekly', icon: 'file-text' },
          { title: '分析数据', description: '解读指标变化原因', value: 'analyze', icon: 'chart-column' },
        ]}
      />
    </div>
  );
}

function CitationPreview() {
  return (
    <p style={{ fontSize: 14, margin: 0 }}>
      动态页面由 DSL 描述并经运行时渲染
      <Citation
        items={[
          { title: '动态页面设计规范', url: 'https://example.com/spec', snippet: '页面以 DSL 描述结构，由运行时渲染为真实组件……' },
          { title: '组件注册指南', snippet: '在组件注册表登记适配器后即可在 DSL 中引用。' },
        ]}
      />
      ，组件可通过注册表扩展。
    </p>
  );
}

function AttachmentPreview() {
  return (
    <Attachment
      items={[
        { id: 'f1', name: '需求文档.md', fileSize: 2048 },
        { id: 'f2', name: '演示录屏.mp4', fileSize: 8388608, status: 'uploading', progress: 42 },
        { id: 'f3', name: '数据包.zip', fileSize: 102400, status: 'error' },
      ]}
    />
  );
}

function ToolCallPreview() {
  return (
    <div style={columnStyle}>
      <ToolCall name="search_docs" status="running" params={{ query: '月报模板', topK: 3 }} />
      <ToolCall
        name="calc_sum"
        status="done"
        durationMs={1200}
        params={{ values: [1, 2, 3] }}
        result={'6'}
      />
    </div>
  );
}

function ChatMessagePreview() {
  return (
    <ChatMessage
      role="assistant"
      agent={{ name: '小 P' }}
      time="10:24"
      parts={[
        { type: 'thinking', content: '用户要月报：先检索模板，再汇总数据。' },
        { type: 'markdown', content: '已为你生成本月月报要点：\n\n- **新增用户** 1,280（+12%）\n- **活跃率** 43%\n\n需要完整报告可以说「展开」。' },
        { type: 'tool-call', name: 'search_docs', status: 'done', result: '找到 3 个模板' },
      ]}
      actions={[
        { name: 'copy', label: '复制', icon: 'copy' },
        { name: 'retry', label: '重新生成', icon: 'refresh-ccw' },
      ]}
    />
  );
}

function MessageListPreview() {
  return (
    <div style={{ height: 320, border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
      <MessageList
        messages={[
          { id: 'm1', role: 'user', time: '10:24', parts: [{ type: 'text', content: '帮我总结一下这份文档' }] },
          {
            id: 'm2',
            role: 'assistant',
            agent: { name: '小 P' },
            time: '10:24',
            parts: [{ type: 'markdown', content: '文档要点如下：\n\n1. 动态页面以 DSL 驱动\n2. 组件经注册表扩展' }],
            actions: [{ name: 'copy', label: '复制', icon: 'copy' }],
          },
          { id: 'm3', role: 'user', time: '10:26', parts: [{ type: 'text', content: '再压缩成一句话' }] },
        ]}
      />
    </div>
  );
}

function ComposerPreview() {
  return (
    <DslPreview
      node={{
        type: 'Composer',
        props: {
          placeholder: '输入消息，Enter 发送',
          attachments: [
            { id: 'a1', name: '需求文档.md', fileSize: 2048 },
            { id: 'a2', name: '录屏.mp4', status: 'uploading', progress: 65 },
          ],
        },
      }}
    />
  );
}

function ConversationListPreview() {
  const [active, setActive] = useState('c1');
  return (
    <div style={{ maxWidth: 280 }}>
      <ConversationList
        searchable
        activeId={active}
        onSelect={setActive}
        items={[
          { id: 'c1', title: '月报讨论', description: '已生成初稿，待确认口径', time: '09:30' },
          { id: 'c2', title: '架构评审', description: '方案 B 待补充性能数据', time: '昨天' },
          { id: 'c3', title: '发布 checklist', description: '剩余 3 项', time: '周一' },
        ]}
      />
    </div>
  );
}

export const PREVIEWS_E: Record<string, () => ReactElement> = {
  'component.bubble': BubblePreview,
  'component.sender': SenderPreview,
  'component.thinking': ThinkingPreview,
  'component.agent-status': AgentStatusPreview,
  'component.streaming-text': StreamingTextPreview,
  'component.suggestion': SuggestionPreview,
  'component.prompt': PromptPreview,
  'component.welcome': WelcomePreview,
  'component.citation': CitationPreview,
  'component.attachment': AttachmentPreview,
  'component.tool-call': ToolCallPreview,
  'component.chat-message': ChatMessagePreview,
  'component.message-list': MessageListPreview,
  'component.composer': ComposerPreview,
  'component.conversation-list': ConversationListPreview,
};
