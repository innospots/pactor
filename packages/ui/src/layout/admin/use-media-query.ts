import type { AdminLayoutBreakpoint } from '../types.js';
import { useEffect, useState } from 'react';

/** 断点像素映射（对齐 antd Grid：视口 < 断点值时命中） */
const BREAKPOINT_PX: Record<AdminLayoutBreakpoint, number> = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

/**
 * useMediaQuery：matchMedia 监听（jsdom 环境无 matchMedia 时恒 false）。
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent): void => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/**
 * 响应式断点命中：视口宽度小于断点时返回 true（sidebar 自动收起）。
 * 未传断点恒 false。
 */
export function useBreakpointBelow(breakpoint?: AdminLayoutBreakpoint): boolean {
  // 未配置断点时挂一个恒真的无害查询，经 null 守卫恒返回 false
  const matches = useMediaQuery(
    breakpoint ? `(max-width: ${BREAKPOINT_PX[breakpoint] - 1}px)` : '(min-width: 0px)',
  );
  return breakpoint !== undefined && matches;
}
