import type { ChatMessage, ChatRole } from 'pactor-chat';

/**
 * 会话导出为 Markdown：序列化 store.getMessages() 的角色与
 * text / markdown part（thinking / tool / dsl 等结构性 part 不导出）。
 */

const ROLE_LABELS: Record<ChatRole, string> = {
  user: '用户',
  assistant: '助手',
  system: '系统',
};

/** 序列化消息列表为 Markdown 文本 */
export function serializeMessages(title: string, messages: ChatMessage[]): string {
  const lines: string[] = [`# ${title}`, ''];
  for (const message of messages) {
    const content = message.parts
      .filter(
        (part): part is Extract<typeof part, { content: string }> =>
          (part.type === 'text' || part.type === 'markdown') &&
          'content' in part,
      )
      .map((part) => part.content)
      .join('\n\n')
      .trim();
    if (!content) {
      continue;
    }
    lines.push(`## ${ROLE_LABELS[message.role]}`, '', content, '');
  }
  return lines.join('\n');
}

/** 序列化并触发 .md 文件下载（data URL / Blob，无网络） */
export function downloadMessagesAsMarkdown(title: string, messages: ChatMessage[]): void {
  const markdown = serializeMessages(title, messages);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${title || 'chat'}.md`;
  anchor.click();
  URL.revokeObjectURL(url);
}
