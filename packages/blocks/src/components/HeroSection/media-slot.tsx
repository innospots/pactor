import { useRenderer } from '@pactor-app/runtime';
import type { ReactNode } from 'react';

/**
 * 媒体槽渲染：plain DslNode（无 $$typeof 且带 type）经 Renderer 渲染，
 * 其余（已渲染 ReactNode）直渲。Renderer 缺失（非 DSL 环境）时降级直渲。
 */
export function HeroMediaSlot({ media }: { media: ReactNode }) {
  let renderer: ReturnType<typeof useRenderer> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    renderer = useRenderer();
  } catch {
    renderer = null;
  }
  if (
    renderer !== null &&
    typeof media === 'object' &&
    media !== null &&
    !('$$typeof' in media) &&
    'type' in media
  ) {
    return <>{renderer.renderChildren([media as never])}</>;
  }
  return <>{media}</>;
}
