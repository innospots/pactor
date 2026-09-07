import { ChromeSlot } from './chrome/ChromeSlot.js';
import { buildEmptyStateFragment } from './chrome/empty-state.js';

/**
 * EmptyState（spec: chat-empty-state，设计决策 D0/D1）：空会话欢迎页。
 *
 * 数据以接口注入：greeting / subtitle / suggestions 均为受控 props；
 * 点击建议经 `onSuggestionClick` 回调交还调用方（ChatView 接入时
 * 复用 Composer 的同一条发送路径）。
 *
 * chrome DSL 渲染层（spec: chat-chrome-dsl）：元素层在页面运行时内
 * 优先经 ChromeSlot 以宿主组件（Typography / Text / Button）DSL 组合
 * 渲染，建议点击经 chat.sendSuggestion 内建动作接回同一发送路径；
 * 无 renderer 环境或类型缺失时回退下方手写实现（EmptyStateFallback）。
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

/** 手写实现：无 renderer / 类型缺失环境的回退路径 */
function EmptyStateFallback({
  subtitle,
  suggestions,
  onSuggestionClick,
  greeting,
}: Required<Pick<EmptyStateProps, 'greeting'>> & EmptyStateProps) {
  return (
    <>
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
    </>
  );
}

export function EmptyState({
  greeting = DEFAULT_CHAT_GREETING,
  subtitle,
  suggestions,
  onSuggestionClick,
}: EmptyStateProps) {
  return (
    <div className="pactor-chat-empty">
      <ChromeSlot
        fragment={buildEmptyStateFragment({ greeting, subtitle, suggestions })}
        fallback={
          <EmptyStateFallback
            greeting={greeting}
            subtitle={subtitle}
            suggestions={suggestions}
            onSuggestionClick={onSuggestionClick}
          />
        }
      />
    </div>
  );
}
