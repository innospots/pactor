import { useI18n } from '@pactor-app/runtime';
import { Component, type ErrorInfo, type ReactNode } from 'react';

import { PrimaryButton, ResultView } from './feedback.js';

interface PageErrorBoundaryProps {
  children?: ReactNode;
}

interface PageErrorBoundaryState {
  error: Error | null;
}

interface PageErrorBoundaryImplProps extends PageErrorBoundaryProps {
  title: string;
  retryLabel: string;
}

/**
 * 错误页渲染实现（class）：错误边界必须为 class 组件，
 * 文案经 props 注入（由函数包装层从 i18n 解析）。
 */
class PageErrorBoundaryImpl extends Component<
  PageErrorBoundaryImplProps,
  PageErrorBoundaryState
> {
  override state: PageErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): PageErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[@pactor-app/app] 页面渲染异常', error, info.componentStack);
  }

  override render(): ReactNode {
    const { error } = this.state;
    if (error !== null) {
      return (
        <ResultView
          className="pactor-app-page-render-error"
          title={this.props.title}
          subTitle={error.message}
          extra={
            <PrimaryButton onClick={() => this.setState({ error: null })}>
              {this.props.retryLabel}
            </PrimaryButton>
          }
        />
      );
    }
    return this.props.children;
  }
}

/**
 * PageErrorBoundary（决策 D3）：捕获页面 DSL 渲染期异常，
 * 显示受控错误页（可重试重新渲染），应用外壳不崩溃、不白屏。
 */
export function PageErrorBoundary({ children }: PageErrorBoundaryProps): ReactNode {
  const { t } = useI18n();
  return (
    <PageErrorBoundaryImpl
      title={t('pactor.app.renderError')}
      retryLabel={t('pactor.page.retry')}
    >
      {children}
    </PageErrorBoundaryImpl>
  );
}
