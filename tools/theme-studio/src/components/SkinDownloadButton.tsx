/**
 * SkinDownloadButton（DSL 自定义组件）：把当前合成皮肤 CSS（与预览
 * postMessage 同源）经 Blob + 临时 a[download] 下载为 pactor-theme.css。
 */
import { useSyncExternalStore, type CSSProperties } from 'react';

import { downloadText } from '../download';
import { getComposedCss, getStudioState, subscribeStudio } from '../store';

interface SkinDownloadButtonProps {
  style?: CSSProperties;
}

export function SkinDownloadButton({ style }: SkinDownloadButtonProps) {
  // 订阅 store：主题/令牌变化时按钮无需变化，但保持渲染一致性
  useSyncExternalStore(subscribeStudio, getStudioState);

  const download = (): void => {
    downloadText('pactor-theme.css', getComposedCss());
  };

  return (
    <button
      type="button"
      onClick={download}
      style={{
        padding: '4px 12px',
        borderRadius: 'var(--radius)',
        border: 'none',
        background: 'var(--primary)',
        color: 'var(--primary-foreground)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        flexShrink: 0,
        ...style,
      }}
    >
      下载皮肤 CSS
    </button>
  );
}
