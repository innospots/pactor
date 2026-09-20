/**
 * AI 与会话分类组件（15 个）。
 * 来源：product-design/ui/component-design.md §3.9 AI 与会话（§11 首版验收矩阵：AI 与会话 = 15）。
 * 命名口径：ChatMessage 表示会话消息，与反馈分类 Message（全局短时反馈）名称与职责
 * 严格区分；Prompt 为会话界面任务入口组件，与素材库「生成提示词」资产相互独立。
 * tokenRefs 本期全部留空：待样式 Token 接入后回填。
 */
import type { ComponentEntry } from '../types.ts';

export const aiChatComponents: ComponentEntry[] = [
  { id: 'component.chat-message', name: 'ChatMessage', category: 'ai-chat', purpose: '展示用户、助手或系统消息', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：会话消息；与反馈分类全局 Message 区分。' },
  { id: 'component.message-list', name: 'MessageList', category: 'ai-chat', purpose: '组织连续消息流和滚动定位', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：消息列表。' },
  { id: 'component.conversation-list', name: 'ConversationList', category: 'ai-chat', purpose: '浏览、搜索和管理历史会话', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：会话列表。' },
  { id: 'component.composer', name: 'Composer', category: 'ai-chat', purpose: '输入提示词、附件和发送操作', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：输入区。' },
  { id: 'component.prompt', name: 'Prompt', category: 'ai-chat', purpose: '展示可复用提示词或任务入口', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：提示词入口；可引用素材库提示词资产 ID。' },
  { id: 'component.suggestion', name: 'Suggestion', category: 'ai-chat', purpose: '提供追问、补全或下一步建议', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：建议项。' },
  { id: 'component.attachment', name: 'Attachment', category: 'ai-chat', purpose: '展示、上传和管理会话附件', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：附件。' },
  { id: 'component.citation', name: 'Citation', category: 'ai-chat', purpose: '标识回答中的来源与引用范围', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：引用标注。' },
  { id: 'component.thinking', name: 'Thinking', category: 'ai-chat', purpose: '表达推理或处理中状态', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：思考过程。' },
  { id: 'component.tool-call', name: 'ToolCall', category: 'ai-chat', purpose: '展示工具调用、参数、进度和结果', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：工具调用。' },
  { id: 'component.agent-status', name: 'AgentStatus', category: 'ai-chat', purpose: '表示智能体的运行和等待状态', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：智能体状态。' },
  { id: 'component.streaming-text', name: 'StreamingText', category: 'ai-chat', purpose: '渐进展示生成中的文本', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：流式文本。' },
  { id: 'component.welcome', name: 'Welcome', category: 'ai-chat', purpose: '展示会话空状态、能力和起始任务', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：欢迎页。' },
  { id: 'component.sender', name: 'Sender', category: 'ai-chat', purpose: '表示消息发送方和角色信息', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：发送者。' },
  { id: 'component.bubble', name: 'Bubble', category: 'ai-chat', purpose: '提供基础对话气泡容器', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：气泡。' },
];
