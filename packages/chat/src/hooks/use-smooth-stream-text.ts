import { useEffect, useRef, useState } from 'react';

/**
 * useSmoothStreamText（技术选型参考 DeepTutor web 同名 hook，独立实现）：
 * 把"可见文本"的增长速率与流式 delta 的到达节奏解耦——上游 chunk 再
 * 突发，用户看到的都是平滑的打字机揭示。
 *
 * 机制：
 * - isStreaming 且 content 长于已揭示部分时，以 requestAnimationFrame
 *   循环推进游标；每帧揭示 max(minCharsPerFrame, backlog / catchUpDivisor)，
 *   封顶 maxCharsPerFrame（长时间积压的大 chunk 不会龟速打字半分钟）；
 * - isStreaming 翻 false 时立即对齐全文（短消息不留残尾）；
 * - content 回缩（重新生成 / 分支切换）时立即回退游标，不显示幽灵尾巴；
 * - enabled: false 时直通原文（调用方可对 streaming / 非 streaming 走同一
 *   渲染路径）。
 */

export interface UseSmoothStreamTextOptions {
  /** 每帧揭示上限（字符），默认 120 */
  maxCharsPerFrame?: number;
  /** 每帧揭示下限（字符），默认 2 */
  minCharsPerFrame?: number;
  /** 积压除数：越大揭示越慢，约 5 比较自然，默认 5 */
  catchUpDivisor?: number;
  /** false 时直通原文，默认 true */
  enabled?: boolean;
}

export function useSmoothStreamText(
  content: string,
  isStreaming: boolean,
  options: UseSmoothStreamTextOptions = {},
): string {
  const {
    maxCharsPerFrame = 120,
    minCharsPerFrame = 2,
    catchUpDivisor = 5,
    enabled = true,
  } = options;

  const [shown, setShown] = useState(content);
  const shownLengthRef = useRef(content.length);
  const rafRef = useRef(0);

  useEffect(() => {
    // 直通 / 流停止 / 内容回缩：立即对齐目标长度
    if (!enabled || !isStreaming || shownLengthRef.current > content.length) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      if (shownLengthRef.current !== content.length) {
        shownLengthRef.current = content.length;
        setShown(content);
      }
      return;
    }

    if (shownLengthRef.current >= content.length) {
      // 已追平，等下一批 delta 再启动
      return;
    }

    const step = (): void => {
      rafRef.current = 0;
      const target = content.length;
      const current = shownLengthRef.current;
      if (current >= target) {
        return;
      }
      const backlog = target - current;
      const advance = Math.min(
        maxCharsPerFrame,
        Math.max(minCharsPerFrame, Math.ceil(backlog / catchUpDivisor)),
      );
      const next = Math.min(target, current + advance);
      shownLengthRef.current = next;
      setShown(content.slice(0, next));
      if (next < target) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(step);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
    // shown 刻意不入依赖：入依赖会在每次推进后重启循环、丢掉 rAF 链
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, isStreaming, enabled, maxCharsPerFrame, minCharsPerFrame, catchUpDivisor]);

  return shown;
}
