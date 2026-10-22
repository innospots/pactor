import type { RouteContext } from '@pactor-app/router';
import { PageRuntimeView, useI18n, type PageRuntime } from '@pactor-app/runtime';
import { useEffect, useState } from 'react';

import type { PactorApplicationHandle } from './application.js';
import { PageErrorBoundary } from './error-boundary.js';
import { BootstrapSpinner, PrimaryButton, ResultView } from './feedback.js';

/** DslPageLoader props */
export interface DslPageLoaderProps {
  app: PactorApplicationHandle;
  pageId: string;
  route: RouteContext;
}

type PageState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'ready'; runtime: PageRuntime };

/**
 * DslPageLoader（决策 D3）：pageId → loadPage → createPageRuntime →
 * PageRuntimeView。
 *
 * - 组件以 pageId + route.params/query 为 key（见 Application），
 *   key 变化即整体重建：旧运行时 destroy，新页面重新加载（V1 无 keepAlive）；
 * - 加载中渲染 loading 态；加载/校验失败渲染含重试的受控错误页；
 * - PageRuntimeView 经 PageErrorBoundary 包裹，渲染异常不白屏；
 * - OverlayHost（app.interactionKit 所选实现，缺省内置实现）作为
 *   PageRuntimeView children（共享当前页面 Renderer 上下文；page overlay
 *   经 resolvePage 接 loader，子运行时共享应用级 registries——由
 *   interaction host 内部实现）。
 */
export function DslPageLoader({ app, pageId, route }: DslPageLoaderProps) {
  const { t } = useI18n();
  const [state, setState] = useState<PageState>({ status: 'loading' });
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let runtime: PageRuntime | null = null;
    void (async () => {
      try {
        const pageDsl = await app.resolvePage(pageId);
        if (cancelled) {
          return;
        }
        runtime = app.createPageRuntime(pageDsl, route);
        setState({ status: 'ready', runtime });
        // 宿主生命周期（决策：Router 触发 onReady / onShow）
        void runtime.ready();
        void runtime.show();
      } catch (cause) {
        if (!cancelled) {
          setState({
            status: 'error',
            error: cause instanceof Error ? cause : new Error(String(cause)),
          });
        }
      }
    })();
    return () => {
      cancelled = true;
      if (runtime !== null && !runtime.destroyed) {
        void runtime.hide();
        void runtime.destroy();
      }
    };
    // route 由 key 保证稳定；retryTick 驱动失败重试
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app, pageId, retryTick]);

  if (state.status === 'loading') {
    return (
      <div className="pactor-app-page-loading">
        <BootstrapSpinner style={{ minHeight: 0, padding: 48 }} />
      </div>
    );
  }
  if (state.status === 'error') {
    return (
      <ResultView
        className="pactor-app-page-load-error"
        title={t('pactor.page.loadFailed')}
        subTitle={state.error.message}
        extra={
          <PrimaryButton onClick={() => setRetryTick((n) => n + 1)}>
            {t('pactor.page.retry')}
          </PrimaryButton>
        }
      />
    );
  }
  const OverlayHostView = app.interactionKit.OverlayHost;
  return (
    <PageErrorBoundary>
      <PageRuntimeView runtime={state.runtime}>
        <OverlayHostView
          manager={app.overlayManager}
          resolvePage={app.resolvePage}
        />
      </PageRuntimeView>
    </PageErrorBoundary>
  );
}
