/**
 * EmptyState（spec: chat-empty-state，设计决策 D0/D1）：空会话欢迎页。
 *
 * 数据以接口注入：greeting / subtitle / suggestions 均为受控 props；
 * 点击建议经 `onSuggestionClick` 回调交还调用方（ChatView 接入时
 * 复用 Composer 的同一条发送路径）。
 */
export type ChatSuggestion = string | { label: string; prompt?: string };

export interface EmptyStateProps {
  /** 问候语（display 衬线字体栈渲染）；缺省用默认文案 */
  greeting?: string;
  /** 可选副标题 */
  subtitle?: string;
  /** 起始建议；空数组 / 未传时不渲染建议区 */
  suggestions?: ChatSuggestion[];
  /** 点击建议回调，入参为该建议的 `prompt ?? label` */
  onSuggestionClick?: (text: string) => void;
}

/** 默认问候语（可被 greeting prop 覆盖） */
export const DEFAULT_CHAT_GREETING = '你好，有什么可以帮你？';

function suggestionLabel(suggestion: ChatSuggestion): string {
  return typeof suggestion === 'string' ? suggestion : suggestion.label;
}

function suggestionPrompt(suggestion: ChatSuggestion): string {
  return typeof suggestion === 'string'
    ? suggestion
    : (suggestion.prompt ?? suggestion.label);
}

export function EmptyState({
  greeting = DEFAULT_CHAT_GREETING,
  subtitle,
  suggestions,
  onSuggestionClick,
}: EmptyStateProps) {
  return (
    <div className="pactor-chat-empty">
      <div className="pactor-chat-empty__greeting">{greeting}</div>
      {subtitle && <div className="pactor-chat-empty__subtitle">{subtitle}</div>}
      {suggestions && suggestions.length > 0 && (
        <div className="pactor-chat-empty__suggestions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestionLabel(suggestion)}
              type="button"
              className="pactor-chat-empty__suggestion"
              onClick={() => onSuggestionClick?.(suggestionPrompt(suggestion))}
            >
              {suggestionLabel(suggestion)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
