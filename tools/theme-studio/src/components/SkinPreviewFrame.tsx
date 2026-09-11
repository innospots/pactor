/**
 * SkinPreviewFrame（DSL 自定义组件）：右侧 iframe 预览，Tab 切换
 * 组件画廊（/gallery）与示例页面（/demo）。
 *
 * 握手协议（spec: theme-studio / 工作室布局与预览隔离）：
 * 预览页挂载后 postMessage({ type: 'theme-studio:ready' }) → 本组件收到
 * ready 后才发送首次 { type: 'theme-studio:skin', css }；此后 store 中合成
 * CSS 每次变化即时发送。预览页内 upsert `<style data-theme-studio>`，
 * 与宿主真实加载方式（在 pactor-ui/styles.css 之后级联覆盖）一致。
 * 切换 Tab 时重置 ready，iframe 内新页面挂载后重新握手。
 */
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react';

import {
  getComposedCss,
  getStudioState,
  setMode,
  subscribeStudio,
} from '../store';
import { MODE_MESSAGE_TYPE } from '../gallery-bridge';
import { PreviewModeToggle } from './PreviewModeToggle';

export const SKIN_MESSAGE_TYPE = 'theme-studio:skin';
export const READY_MESSAGE_TYPE = 'theme-studio:ready';

/** 预览视图：组件画廊 + 示例页面 */
const PREVIEW_VIEWS = [
  { key: 'gallery', label: '组件画廊', src: '/gallery' },
  { key: 'demo', label: '示例页面', src: '/demo' },
] as const;

interface SkinPreviewFrameProps {
  style?: CSSProperties;
}

export function SkinPreviewFrame({ style }: SkinPreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewKey, setViewKey] = useState<string>(PREVIEW_VIEWS[0].key);
  const [galleryReady, setGalleryReady] = useState(false);
  // 订阅 store 以在每次主题/令牌/模式变化时重取合成 CSS 与模式
  const { mode } = useSyncExternalStore(subscribeStudio, getStudioState);

  const view = PREVIEW_VIEWS.find((v) => v.key === viewKey) ?? PREVIEW_VIEWS[0];

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
    iframeRef.current?.contentWindow?.postMessage(
      { type: MODE_MESSAGE_TYPE, mode },
      window.location.origin,
    );
  });

  return (
    <div
      data-skin-preview=""
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: 0,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: '0 12px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--card)',
          flexShrink: 0,
          alignItems: 'center',
        }}
      >
        {PREVIEW_VIEWS.map((v) => {
          const active = v.key === viewKey;
          return (
            <button
              key={v.key}
              type="button"
              onClick={() => {
                if (v.key === viewKey) {
                  return;
                }
                setGalleryReady(false);
                setViewKey(v.key);
              }}
              style={{
                padding: '8px 12px',
                background: 'none',
                border: 'none',
                borderBottom: active
                  ? '2px solid var(--primary)'
                  : '2px solid transparent',
                color: active ? 'var(--foreground)' : 'var(--muted-foreground)',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {v.label}
            </button>
          );
        })}
        <PreviewModeToggle style={{ marginLeft: 'auto' }} />
      </div>
      <iframe
        ref={iframeRef}
        src={view.src}
        title={`${view.label}预览`}
        style={{
          width: '100%',
          flex: 1,
          minHeight: 0,
          border: 'none',
          display: 'block',
        }}
      />
    </div>
  );
}
