/**
 * SkinPreviewFrame（DSL 自定义组件）：右侧 iframe 预览（同源 /gallery）。
 *
 * 握手协议（spec: theme-studio / 工作室布局与预览隔离）：
 * gallery 挂载后 postMessage({ type: 'theme-studio:ready' }) → 本组件收到
 * ready 后才发送首次 { type: 'theme-studio:skin', css }；此后 store 中合成
 * CSS 每次变化即时发送。gallery 内 upsert `<style data-theme-studio>`，
 * 与宿主真实加载方式（在 pactor-ui/styles.css 之后级联覆盖）一致。
 */
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react';

import { getComposedCss, getStudioState, subscribeStudio } from '../store';

export const SKIN_MESSAGE_TYPE = 'theme-studio:skin';
export const READY_MESSAGE_TYPE = 'theme-studio:ready';

interface SkinPreviewFrameProps {
  style?: CSSProperties;
}

export function SkinPreviewFrame({ style }: SkinPreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [galleryReady, setGalleryReady] = useState(false);
  // 订阅 store 以在每次主题/令牌变化时重取合成 CSS
  useSyncExternalStore(subscribeStudio, getStudioState);

  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      if (
        event.source === iframeRef.current?.contentWindow &&
        (event.data as { type?: string } | null)?.type === READY_MESSAGE_TYPE
      ) {
        setGalleryReady(true);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    if (!galleryReady) {
      return;
    }
    iframeRef.current?.contentWindow?.postMessage(
      { type: SKIN_MESSAGE_TYPE, css: getComposedCss() },
      window.location.origin,
    );
  });

  return (
    <iframe
      ref={iframeRef}
      src="/gallery"
      title="组件画廊预览"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block',
        ...style,
      }}
    />
  );
}
