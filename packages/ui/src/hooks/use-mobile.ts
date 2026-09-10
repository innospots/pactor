import { useEffect, useState } from 'react';

/** 767px 界与 Tailwind md 断点一致 */
const MOBILE_MEDIA_QUERY = '(max-width: 767px)';

/**
 * 移动视口判定（shadcn use-mobile hook 的本地版）：
 * 监听 matchMedia 变化，首帧即正确。
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia(MOBILE_MEDIA_QUERY).matches,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }
    const media = window.matchMedia(MOBILE_MEDIA_QUERY);
    const onChange = (event: MediaQueryListEvent): void => {
      setIsMobile(event.matches);
    };
    setIsMobile(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
