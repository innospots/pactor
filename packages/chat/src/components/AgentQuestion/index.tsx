import { useI18n } from '@pactor-app/runtime';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';

import { cn } from '../../lib/utils.js';
import { Button } from '@pactor-app/ui/ui';
import { Icon } from '@pactor-app/ui/components';

/** Agent 提问选项 */
export interface AgentQuestionOption {
  id: string;
  label: string;
  description?: string;
  /** 图标名（ui Icon 白名单） */
  icon?: string;
}

/** Agent 提问的推荐项 */
export interface AgentQuestionSuggestion {
  optionId: string;
  reason?: string;
}

/** 回答结果：选项 id 列表 + 其他自由输入 */
export interface AgentQuestionAnswer {
  optionIds: string[];
  other?: string;
}

/** 提问卡状态机 */
export type AgentQuestionStatus = 'pending' | 'answered' | 'delegated';

export interface AgentQuestionProps {
  /** 问题文本 */
  question: string;
  /** 问题补充说明 */
  description?: string;
  /** 选项列表 */
  options?: AgentQuestionOption[];
  /** 多选（缺省单选，单选点击即提交） */
  multiple?: boolean;
  /** 允许自由输入（展示「其他…」卡片） */
  allowOther?: boolean;
  /** agent 推荐项（高亮并展示理由） */
  suggested?: AgentQuestionSuggestion;
  /** 受控状态（提供即受控） */
  status?: AgentQuestionStatus;
  /** 受控选中的选项 id（提供即受控，主要用于多选） */
  selected?: string[];
  /** 选中项变化 */
  onSelectedChange?: (optionIds: string[]) => void;
  /** 受控回答（answered / delegated 展示用） */
  answer?: AgentQuestionAnswer;
  /** 提交回答（单选点击即提交；多选点击提交按钮） */
  onSubmit?: (answer: AgentQuestionAnswer) => void;
  /** 让 agent 自行决定 */
  onDelegate?: () => void;
  /** 撤销已回答 / 已委托状态，回到 pending */
  onUndo?: () => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * AgentQuestion：agent 向用户提问的交互卡。
 *
 * - 单选（`radiogroup`）点击选项即提交；多选（`group`）用提交按钮
 * - `suggested` 推荐项高亮并展示理由
 * - `allowOther` 提供「其他…」自由输入卡片
 * - 「让 agent 决定」进入 delegated；已回答 / 已委托可 Undo
 * - 方向键按网格实际列数移动焦点（roving tabindex）
 * - 状态跟读经 `role="status" aria-live="polite"` 播报
 *
 * 同时作为 DSL 组件注册（registerChatComponents），可被 LLM 生成的
 * DSL 直接使用。
 */
export function AgentQuestion({
  question,
  description,
  options = [],
  multiple = false,
  allowOther = false,
  suggested,
  status: statusProp,
  selected: selectedProp,
  onSelectedChange,
  answer: answerProp,
  onSubmit,
  onDelegate,
  onUndo,
  className,
  style,
}: AgentQuestionProps) {
  const { t } = useI18n();
  const titleId = useId();
  const descId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const [innerStatus, setInnerStatus] = useState<AgentQuestionStatus>('pending');
  const statusControlled = statusProp !== undefined;
  const status = statusControlled ? statusProp : innerStatus;

  const [innerSelected, setInnerSelected] = useState<string[]>([]);
  const selectedControlled = selectedProp !== undefined;
  const selected = selectedControlled ? selectedProp : innerSelected;

  const [other, setOther] = useState('');
  const [otherOpen, setOtherOpen] = useState(false);
  const [innerAnswer, setInnerAnswer] = useState<AgentQuestionAnswer | undefined>();
  const answer = answerProp ?? innerAnswer;
  const [announcement, setAnnouncement] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  // 选项总数（含「其他」卡片）用于 roving tabindex
  const optionCount = options.length + (allowOther ? 1 : 0);

  useEffect(() => {
    if (status === 'pending') {
      // 外部撤销后重置本地输入
      setOther('');
      setOtherOpen(false);
    }
  }, [status]);

  const setStatus = (next: AgentQuestionStatus): void => {
    if (!statusControlled) setInnerStatus(next);
  };

  const setSelected = (next: string[]): void => {
    if (!selectedControlled) setInnerSelected(next);
    onSelectedChange?.(next);
  };

  const submit = (next: AgentQuestionAnswer): void => {
    setInnerAnswer(next);
    setStatus('answered');
    onSubmit?.(next);
    const labels = next.optionIds
      .map((id) => options.find((option) => option.id === id)?.label ?? id)
      .concat(next.other ? next.other : [])
      .join(', ');
    setAnnouncement(t('pactor.chat.agentQuestion.answer', { answer: labels }));
  };

  const chooseOption = (option: AgentQuestionOption): void => {
    if (status !== 'pending') return;
    if (multiple) {
      const next = selected.includes(option.id)
        ? selected.filter((id) => id !== option.id)
        : [...selected, option.id];
      setSelected(next);
      setAnnouncement(
        t('pactor.chat.agentQuestion.selected', { option: option.label }),
      );
    } else {
      setSelected([option.id]);
      submit({ optionIds: [option.id] });
    }
  };

  const delegate = (): void => {
    if (status !== 'pending') return;
    setStatus('delegated');
    setAnnouncement(t('pactor.chat.agentQuestion.delegated'));
    onDelegate?.();
  };

  const undo = (): void => {
    setStatus('pending');
    setInnerAnswer(undefined);
    setSelected([]);
    setOther('');
    setOtherOpen(false);
    setAnnouncement('');
    onUndo?.();
  };

  /** 网格实际列数：首个 offsetTop 变化的下标（无法测量时回退 1） */
  const measureColumns = (): number => {
    const buttons = Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>(
        '[data-slot="agent-question-option"]',
      ) ?? [],
    );
    if (buttons.length === 0) return 1;
    const firstTop = buttons[0]!.offsetTop;
    for (let index = 1; index < buttons.length; index += 1) {
      if (buttons[index]!.offsetTop !== firstTop) return index;
    }
    return Math.max(buttons.length, 1);
  };

  const focusOption = (index: number): void => {
    const buttons = containerRef.current?.querySelectorAll<HTMLElement>(
      '[data-slot="agent-question-option"]',
    );
    const next = Math.min(Math.max(index, 0), (buttons?.length ?? 1) - 1);
    setActiveIndex(next);
    buttons?.[next]?.focus();
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ): void => {
    const columns = measureColumns();
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusOption(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusOption(index - 1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusOption(index + columns);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusOption(index - columns);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusOption(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusOption(optionCount - 1);
    }
  };

  const resolvedAnswer =
    answer ??
    (status === 'answered'
      ? { optionIds: selected, other: other || undefined }
      : undefined);

  const answerLabel = resolvedAnswer
    ? resolvedAnswer.optionIds
        .map((id) => options.find((option) => option.id === id)?.label ?? id)
        .concat(resolvedAnswer.other ? [resolvedAnswer.other] : [])
        .join(', ')
    : '';

  if (status !== 'pending') {
    return (
      <div
        data-slot="agent-question"
        data-status={status}
        className={cn(
          'flex flex-col gap-2 rounded-lg border border-border bg-card p-3 text-card-foreground',
          className,
        )}
        style={style}
      >
        <p className="sr-only" role="status" aria-live="polite">
          {announcement}
        </p>
        <div className="flex items-start gap-2">
          <Icon
            name={status === 'delegated' ? 'sparkles' : 'circle-check'}
            size={16}
            className={status === 'delegated' ? 'mt-0.5 text-info' : 'mt-0.5 text-success'}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{question}</p>
            <p className="mt-0.5 text-xs text-muted-foreground" data-slot="agent-question-result">
              {status === 'delegated'
                ? t('pactor.chat.agentQuestion.delegated')
                : answerLabel || t('pactor.chat.agentQuestion.answered')}
            </p>
          </div>
          {onUndo ? (
            <button
              type="button"
              data-slot="agent-question-undo"
              className="shrink-0 rounded-sm px-1.5 py-0.5 text-xs font-medium text-primary hover:bg-accent"
              onClick={undo}
            >
              {t('pactor.chat.agentQuestion.undo')}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const otherButton = allowOther ? (
    <div data-slot="agent-question-other" className="flex flex-col gap-1">
      <button
        type="button"
        role={multiple ? undefined : 'radio'}
        aria-checked={multiple ? undefined : otherOpen}
        data-slot="agent-question-option"
        data-option-id="__other__"
        tabIndex={activeIndex === options.length ? 0 : -1}
        className={cn(
          'flex flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left text-sm transition-colors',
          otherOpen
            ? 'border-primary bg-accent'
            : 'border-dashed border-border hover:bg-accent',
        )}
        onClick={() => {
          setOtherOpen(true);
          setActiveIndex(options.length);
        }}
        onFocus={() => setActiveIndex(options.length)}
        onKeyDown={(event) => handleOptionKeyDown(event, options.length)}
      >
        <span className="flex items-center gap-1.5 font-medium">
          <Icon name="plus" size="sm" />
          {t('pactor.chat.agentQuestion.other')}
        </span>
      </button>
      {otherOpen ? (
        <textarea
          autoFocus
          data-slot="agent-question-other-input"
          rows={2}
          aria-label={t('pactor.chat.agentQuestion.otherPlaceholder')}
          placeholder={t('pactor.chat.agentQuestion.otherPlaceholder')}
          value={other}
          className="w-full resize-none rounded-sm border border-input bg-background px-2 py-1 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          onChange={(event) => setOther(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              if (other.trim()) {
                submit(
                  multiple
                    ? { optionIds: selected, other: other.trim() }
                    : { optionIds: [], other: other.trim() },
                );
              }
            }
          }}
        />
      ) : null}
    </div>
  ) : null;

  return (
    <div
      ref={containerRef}
      data-slot="agent-question"
      data-status="pending"
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground',
        className,
      )}
      style={style}
    >
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-2">
          <Icon name="help-circle" size={16} className="mt-0.5 text-info" />
          <div className="min-w-0 flex-1">
            <p id={titleId} className="text-sm font-medium">
              {question}
            </p>
            {description ? (
              <p id={descId} className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {multiple ? (
          <p className="pl-6 text-xs text-muted-foreground">
            {t('pactor.chat.agentQuestion.multiple')}
          </p>
        ) : null}
      </div>

      <div
        role={multiple ? 'group' : 'radiogroup'}
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="grid gap-2 sm:grid-cols-2"
      >
        {options.map((option, index) => {
          const isSelected = selected.includes(option.id);
          const isSuggested = suggested?.optionId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role={multiple ? 'checkbox' : 'radio'}
              aria-checked={isSelected}
              data-slot="agent-question-option"
              data-option-id={option.id}
              data-suggested={isSuggested || undefined}
              tabIndex={activeIndex === index ? 0 : -1}
              className={cn(
                'relative flex flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                isSelected || isSuggested
                  ? 'border-primary bg-accent'
                  : 'border-border hover:bg-accent',
              )}
              onClick={() => chooseOption(option)}
              onFocus={() => setActiveIndex(index)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
            >
              <span className="flex w-full items-center gap-1.5 font-medium">
                {option.icon ? <Icon name={option.icon} size="sm" /> : null}
                <span className="min-w-0 flex-1">{option.label}</span>
                {isSuggested ? (
                  <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    {t('pactor.chat.agentQuestion.suggested')}
                  </span>
                ) : null}
              </span>
              {option.description ? (
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              ) : null}
              {isSuggested && suggested.reason ? (
                <span
                  data-slot="agent-question-suggested-reason"
                  className="text-xs text-primary/80"
                >
                  {t('pactor.chat.agentQuestion.suggestedReason', {
                    reason: suggested.reason,
                  })}
                </span>
              ) : null}
            </button>
          );
        })}
        {otherButton}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={delegate}>
          <Icon name="sparkles" size={14} />
          {t('pactor.chat.agentQuestion.delegate')}
        </Button>
        {multiple || otherOpen ? (
          <Button
            size="sm"
            disabled={selected.length === 0 && !other.trim()}
            onClick={() =>
              submit({
                optionIds: selected,
                other: other.trim() || undefined,
              })
            }
          >
            {t('pactor.chat.agentQuestion.submit')}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
