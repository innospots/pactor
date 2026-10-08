/**
 * 线框模板运行态预览岛：复用 DslPreview（真实 RuntimeContext + 内置注册表），
 * 外包错误边界——骨架含占位/未知节点导致渲染异常时回退为 ASCII 线框，
 * 不影响页面其余内容。client-only（与组件预览一致）。
 */
import { Component, type ReactElement, type ReactNode } from 'react';
import type { DslNode } from '@pactor-app/core';
import DslPreview from './DslPreview';
import { previewExtraComponents } from './preview-extras';

class PreviewBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(error: unknown, info: { componentStack?: string | null }): void {
    console.error('[TemplateDslPreview] 渲染失败', error);
    console.error('[TemplateDslPreview] componentStack:' + (info.componentStack ?? ''));
  }

  render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function TemplateDslPreview({
  node,
  state,
  wireframe,
  bare,
}: {
  node: DslNode;
  state?: Record<string, unknown>;
  /** 渲染异常时回退展示的 ASCII 线框 */
  wireframe?: string | null;
  /** 独立预览页：去掉预览盒边框/内边距，整视口渲染 */
  bare?: boolean;
}): ReactElement {
  const fallback = wireframe ? (
    <pre className="md-pre">
      <code>{wireframe}</code>
    </pre>
  ) : (
    <div className="preview-note">该结构的 DSL 骨架暂无法渲染预览。</div>
  );
  return (
    <div className={bare ? undefined : 'component-preview-box'}>
      <PreviewBoundary fallback={fallback}>
        <DslPreview node={node} state={state} extraComponents={previewExtraComponents} />
      </PreviewBoundary>
    </div>
  );
}
