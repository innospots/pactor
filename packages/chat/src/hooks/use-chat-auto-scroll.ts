import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/**
 * useChatAutoScroll（技术选型参考 DeepTutor web 同名 hook，独立实现）：
 * "钉在底部"的流式自动滚动。
 *
 * 机制：
 * - 跟随时，唯一写者在 useLayoutEffect 里执行
 *   `scrollTop = scrollHeight`（避免多路写 scrollTop 造成的抖动）；
 * - 用户上翻超过 RELEASE_THRESHOLD（80px）释放跟随，可安静翻历史；
 *   回到距底 REENGAGE_THRESHOLD（40px）内自动恢复跟随；
 * - 释放跟随期间由调用方展示"回到底部"入口（isFollowing=false），
 *   并可用 newMessageCount 展示「N 条新消息」计数；恢复跟随时清零；
 * - 滚动容器需配合 `overflow-anchor: none`（styles.css 已内置），
 *   防止浏览器滚动锚定与跟随互相拉扯。
 */

export interface UseChatAutoScrollOptions {
  /** 消息总数（变化触发一次跟随判定 / 新消息计数） */
  messageCount: number;
  /** 最后一条消息的文本总长度（流式增长触发跟随） */
  lastContentLength: number;
  /** 是否处于流式中（仅流式中才需要高频跟随） */
  isStreaming: boolean;
}

export interface UseChatAutoScrollResult {
  containerRef: RefObject<HTMLDivElement | null>;
  /** 是否处于跟随状态（false 时调用方应显示"回到底部"入口） */
  isFollowing: boolean;
  /** 释放跟随以来新增的消息数（跟随中恒为 0） */
  newMessageCount: number;
  /** 恢复跟随并立即滚到底部 */
  scrollToBottom: () => void;
}

/** 距底超过该值视为用户主动上翻，释放跟随 */
const RELEASE_THRESHOLD = 80;
/** 距底小于该值视为回底，恢复跟随 */
const REENGAGE_THRESHOLD = 40;

export function useChatAutoScroll({
  messageCount,
  lastContentLength,
  isStreaming,
}: UseChatAutoScrollOptions): UseChatAutoScrollResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const followRef = useRef(true);
  const [isFollowing, setIsFollowing] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);
  // 释放跟随时消息基线与最新消息数（滚动回调里读取）
  const releaseBaselineRef = useRef(0);
  const messageCountRef = useRef(messageCount);
  messageCountRef.current = messageCount;

  const setFollow = (follow: boolean, baseline?: number): void => {
    const wasFollowing = followRef.current;
    followRef.current = follow;
    setIsFollowing(follow);
    if (!follow) {
      releaseBaselineRef.current = baseline ?? messageCountRef.current;
      setNewMessageCount(0);
    } else if (!wasFollowing) {
      setNewMessageCount(0);
    }
  };

  // 跟随时钉底：依赖消息数量与末条长度（流式增长）；释放期间累计新消息
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (followRef.current) {
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
      setNewMessageCount(0);
      return;
    }
    setNewMessageCount(
      Math.max(0, messageCount - releaseBaselineRef.current),
    );
  }, [messageCount, lastContentLength, isStreaming]);

  // 挂载滚动监听：释放 / 恢复跟随
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const onScroll = (): void => {
      const distance =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      if (followRef.current && distance > RELEASE_THRESHOLD) {
        setFollow(false);
      } else if (!followRef.current && distance < REENGAGE_THRESHOLD) {
        setFollow(true);
      }
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToBottom = useCallback((): void => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
    setFollow(true);
  }, []);

  return { containerRef, isFollowing, newMessageCount, scrollToBottom };
}
