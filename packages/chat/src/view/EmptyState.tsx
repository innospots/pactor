import { useI18n } from '@pactor-app/runtime';

import { Suggestion } from '../components/Suggestion/index.js';
import { Welcome } from '../components/Welcome/index.js';

import { ChromeSlot } from './chrome/ChromeSlot.js';
import { buildEmptyStateFragment } from './chrome/empty-state.js';

/**
 * EmptyState（spec: chat-empty-state，设计决策 D0/D1）：空会话欢迎页。
 *
 * 数据以接口注入：greeting / subtitle / suggestions 均为受控 props；
 * 点击建议经 `onSuggestionClick` 回调交还调用方（ChatView 接入时
 * 复用 Composer 的同一条发送路径）。
 *
 * 展示由 @pactor-app/ui 的 Welcome + Suggestion 组合承载（回退路径；
 * greeting 经 titleClassName 复用 chat 皮肤的 display 衬线字体栈）。
 * chrome DSL 渲染层（spec: chat-chrome-dsl）：元素层在页面运行时内
 * 优先经 ChromeSlot 以宿主组件（Typography / Text / Suggestion）DSL
 * 组合渲染，建议点击经 chat.sendSuggestion 内建动作接回同一发送路径；
 * 无 renderer 环境或类型缺失时回退 ui 组合实现（EmptyStateFallback）。
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

/** ui Welcome + Suggestion 组合实现：无 renderer / 类型缺失环境的回退路径 */
function EmptyStateFallback({
  subtitle,
  suggestions,
  onSuggestionClick,
  greeting,
}: Required<Pick<EmptyStateProps, 'greeting'>> & EmptyStateProps) {
  return (
    <>
      <Welcome
        title={greeting}
        description={subtitle}
        icon={null}
        titleClassName="pactor-chat-empty__greeting"
        descriptionClassName="pactor-chat-empty__subtitle"
      />
      {suggestions && suggestions.length > 0 && (
        <Suggestion
          items={suggestions.map((suggestion) => ({
            label: suggestionLabel(suggestion),
            value: suggestionPrompt(suggestion),
          }))}
          justify="center"
          className="pactor-chat-empty__suggestions"
          onSelect={(value) => onSuggestionClick?.(value)}
        />
      )}
    </>
  );
}

export function EmptyState({
  greeting,
  subtitle,
  suggestions,
  onSuggestionClick,
}: EmptyStateProps) {
  const { t } = useI18n();
  const resolvedGreeting = greeting ?? t('pactor.chat.welcome.greeting');
  return (
    <div className="pactor-chat-empty">
      <ChromeSlot
        fragment={buildEmptyStateFragment({
          greeting: resolvedGreeting,
          subtitle,
          suggestions,
        })}
        fallback={
          <EmptyStateFallback
            greeting={resolvedGreeting}
            subtitle={subtitle}
            suggestions={suggestions}
            onSuggestionClick={onSuggestionClick}
          />
        }
      />
    </div>
  );
}
