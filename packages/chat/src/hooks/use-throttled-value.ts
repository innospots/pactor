import { useEffect, useRef, useState } from 'react';

/**
 * useThrottledValue：高频变化值的时间节流——enabled 期间返回值最多每
 * intervalMs 更新一次（尾部变化经 trailing timeout 补齐）；enabled=false
 * 时直通（收尾立即对齐终值，不留残尾）。
 *
 * 用途：流式期间把"按 token / 按帧"的重渲染（如 MarkdownRenderer 全量
 * 解析）压到每秒数次，消除 O(n²) 解析成本。
 */
export function useThrottledValue<T>(
  value: T,
  intervalMs: number,
  enabled: boolean,
): T {
  const [shown, setShown] = useState(value);
  const lastUpdateRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
      setShown(value);
      return;
    }
    const now = Date.now();
    const elapsed = now - lastUpdateRef.current;
    if (elapsed >= intervalMs) {
      lastUpdateRef.current = now;
      setShown(value);
      return;
    }
    timerRef.current = setTimeout(() => {
      lastUpdateRef.current = Date.now();
      setShown(value);
      timerRef.current = undefined;
    }, intervalMs - elapsed);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [value, intervalMs, enabled]);

  return enabled ? shown : value;
}
