import { useI18n } from '@pactor-app/runtime';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react';

import { cn } from '../../lib/utils.js';
import { Button } from '@pactor-app/ui/ui';
import { Icon } from '@pactor-app/ui/components';

/** 回答反馈：点赞 / 点踩 / 1–5 分 */
export type FeedbackRating = 'up' | 'down' | 1 | 2 | 3 | 4 | 5 | null;

/** 反馈原因项（id 随反馈提交，label 用于展示） */
export interface FeedbackReasonOption {
  id: string;
  label: string;
}

/** 一次反馈的完整数据 */
export interface FeedbackValue {
  rating: FeedbackRating;
  reasons: string[];
  note: string;
}

export type ResponseFeedbackVariant = 'inline' | 'detailed';

export interface ResponseFeedbackProps {
  /** 展示形态：inline 为点赞 / 点踩（缺省），detailed 额外常显 1–5 分与原因 */
  variant?: ResponseFeedbackVariant;
  /** 受控评分（提供即受控；null 表示未评分） */
  rating?: FeedbackRating;
  /** 受控原因（提供即受控） */
  reasons?: string[];
  /** 受控备注（提供即受控） */
  note?: string;
  /** 原因候选（缺省使用内置四项 i18n 文案；传 [] 隐藏原因区） */
  reasonOptions?: FeedbackReasonOption[];
  /** Undo 入口展示时长（毫秒），缺省 5000；0 表示不展示 Undo */
  undoMs?: number;
  /** 提交中 / 禁用交互 */
  disabled?: boolean;
  /** 评分变化（点赞 / 点踩 / 分数） */
  onRate?: (rating: FeedbackRating) => void;
  /** 提交反馈（inline 点赞会立即提交） */
  onSubmit?: (feedback: FeedbackValue) => void;
  /** 撤销已提交反馈 */
  onUndo?: () => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const DEFAULT_REASON_IDS = ['inaccurate', 'incomplete', 'offTopic', 'tooVerbose'] as const;
const RATING_SCORES: ReadonlyArray<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

function sameRating(a: FeedbackRating, b: FeedbackRating): boolean {
  return a === b;
}

/**
 * ResponseFeedback：回答反馈卡（inline / detailed）。
 *
 * - inline：👍 / 👎；点踩展开原因 chips（多选，`aria-pressed`）+ 备注 + 提交
 * - detailed：常显 1–5 分与原因区
 * - 提交后进入致谢（`role="status" aria-live="polite"`），`undoMs` 内可撤销
 * - 受控 / 非受控双模式；`onRate` / `onSubmit` / `onUndo` 分离
 *
 * 不改变 MessageActions 的内建动作；需要时由宿主显式渲染本组件。
 */
export function ResponseFeedback({
  variant = 'inline',
  rating: ratingProp,
  reasons: reasonsProp,
  note: noteProp,
  reasonOptions,
  undoMs = 5000,
  disabled = false,
  onRate,
  onSubmit,
  onUndo,
  className,
  style,
}: ResponseFeedbackProps) {
  const { t } = useI18n();
  const panelId = useId();
  const groupId = useId();

  const [innerRating, setInnerRating] = useState<FeedbackRating>(null);
  const ratingControlled = ratingProp !== undefined;
  const rating = ratingControlled ? ratingProp : innerRating;

  const [innerReasons, setInnerReasons] = useState<string[]>([]);
  const reasonsControlled = reasonsProp !== undefined;
  const selectedReasons = reasonsControlled ? reasonsProp : innerReasons;

  const [innerNote, setInnerNote] = useState('');
  const noteControlled = noteProp !== undefined;
  const note = noteControlled ? noteProp : innerNote;

  const [sent, setSent] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const reasons_: FeedbackReasonOption[] =
    reasonOptions ??
    DEFAULT_REASON_IDS.map((id) => ({
      id,
      label: t(`pactor.chat.feedback.reason.${id}`),
    }));

  const clearUndoTimer = (): void => {
    if (undoTimerRef.current !== null) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
  };

  useEffect(() => clearUndoTimer, []);

  const updateRating = (next: FeedbackRating): void => {
    if (!ratingControlled) setInnerRating(next);
    onRate?.(next);
  };

  const toggleReason = (id: string): void => {
    const next = selectedReasons.includes(id)
      ? selectedReasons.filter((item) => item !== id)
      : [...selectedReasons, id];
    if (!reasonsControlled) setInnerReasons(next);
    const option = reasons_.find((item) => item.id === id);
    setAnnouncement(
      t('pactor.chat.feedback.reasonSelected', {
        reason: option?.label ?? id,
      }),
    );
  };

  const submit = (nextRating: FeedbackRating = rating): void => {
    if (disabled || sent) return;
    const feedback: FeedbackValue = {
      rating: nextRating,
      reasons: selectedReasons,
      note,
    };
    onSubmit?.(feedback);
    setSent(true);
    setAnnouncement(t('pactor.chat.feedback.thanks'));
    if (undoMs > 0) {
      setShowUndo(true);
      clearUndoTimer();
      undoTimerRef.current = setTimeout(() => {
        setShowUndo(false);
        undoTimerRef.current = null;
      }, undoMs);
    }
  };

  const rate = (next: FeedbackRating): void => {
    updateRating(next);
    setSent(false);
    clearUndoTimer();
    setShowUndo(false);
    // inline 点赞立即提交；点踩 / 详细评分进入面板
    if (variant === 'inline' && next === 'up') {
      submit(next);
    }
  };

  const undo = (): void => {
    clearUndoTimer();
    setShowUndo(false);
    setSent(false);
    updateRating(null);
    if (!reasonsControlled) setInnerReasons([]);
    if (!noteControlled) setInnerNote('');
    setAnnouncement('');
    onUndo?.();
  };

  const panelOpen = !sent && (variant === 'detailed' || rating === 'down' || typeof rating === 'number');

  return (
    <div
      data-slot="response-feedback"
      data-variant={variant}
      data-status={sent ? 'sent' : panelOpen ? 'open' : 'idle'}
      className={cn('flex flex-col gap-2 text-sm', className)}
      style={style}
    >
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      {sent ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon name="check-circle" size="sm" className="text-success" />
            {t('pactor.chat.feedback.thanks')}
          </span>
          {showUndo ? (
            <button
              type="button"
              data-slot="response-feedback-undo"
              className="rounded-sm px-1.5 py-0.5 text-xs font-medium text-primary hover:bg-accent"
              onClick={undo}
            >
              {t('pactor.chat.feedback.undo')}
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-1">
            {variant === 'detailed'
              ? RATING_SCORES.map((score) => (
                  <button
                    key={score}
                    type="button"
                    data-slot="response-feedback-score"
                    aria-label={t('pactor.chat.feedback.ratingValue', { value: score })}
                    aria-pressed={sameRating(rating, score)}
                    disabled={disabled}
                    className={cn(
                      'rounded-sm px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground',
                      sameRating(rating, score) && 'bg-accent font-medium text-foreground',
                    )}
                    onClick={() => rate(score)}
                  >
                    {score}
                  </button>
                ))
              : null}
            <button
              type="button"
              data-slot="response-feedback-up"
              aria-label={t('pactor.chat.feedback.helpful')}
              aria-pressed={sameRating(rating, 'up')}
              disabled={disabled}
              className={cn(
                'rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-foreground',
                sameRating(rating, 'up') && 'bg-accent text-success',
              )}
              onClick={() => rate('up')}
            >
              <Icon name="thumbs-up" size="sm" />
            </button>
            <button
              type="button"
              data-slot="response-feedback-down"
              aria-label={t('pactor.chat.feedback.notHelpful')}
              aria-pressed={sameRating(rating, 'down')}
              aria-expanded={panelOpen}
              aria-controls={panelOpen ? panelId : undefined}
              disabled={disabled}
              className={cn(
                'rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-foreground',
                sameRating(rating, 'down') && 'bg-accent text-destructive',
              )}
              onClick={() => {
                if (sameRating(rating, 'down')) {
                  updateRating(null);
                  setSent(false);
                } else {
                  rate('down');
                }
              }}
            >
              <Icon name="thumbs-down" size="sm" />
            </button>
          </div>

          {panelOpen ? (
            <div
              id={panelId}
              data-slot="response-feedback-panel"
              className="flex flex-col gap-2 rounded-md border border-border bg-card p-2.5"
            >
              {reasons_.length > 0 ? (
                <div
                  role="group"
                  aria-labelledby={groupId}
                  className="flex flex-wrap gap-1.5"
                >
                  <span id={groupId} className="sr-only">
                    {t('pactor.chat.feedback.reasons')}
                  </span>
                  {reasons_.map((reason) => {
                    const pressed = selectedReasons.includes(reason.id);
                    return (
                      <button
                        key={reason.id}
                        type="button"
                        data-slot="response-feedback-reason"
                        aria-pressed={pressed}
                        disabled={disabled}
                        className={cn(
                          'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
                          pressed
                            ? 'border-transparent bg-primary text-primary-foreground'
                            : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground',
                        )}
                        onClick={() => toggleReason(reason.id)}
                      >
                        {reason.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
              <label className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  {t('pactor.chat.feedback.note')}
                </span>
                <textarea
                  data-slot="response-feedback-note"
                  rows={2}
                  value={note}
                  disabled={disabled}
                  placeholder={t('pactor.chat.feedback.notePlaceholder')}
                  className="w-full resize-none rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  onChange={(event) => {
                    if (!noteControlled) setInnerNote(event.target.value);
                  }}
                />
              </label>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    updateRating(null);
                    setSent(false);
                    if (!reasonsControlled) setInnerReasons([]);
                    if (!noteControlled) setInnerNote('');
                  }}
                >
                  {t('pactor.chat.feedback.cancel')}
                </Button>
                <Button
                  size="sm"
                  disabled={disabled || rating === null}
                  onClick={() => submit()}
                >
                  {t('pactor.chat.feedback.submit')}
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
