import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Result } from 'antd';

interface PageErrorBoundaryProps {
  children?: ReactNode;
}

interface PageErrorBoundaryState {
  error: Error | null;
}

/**
 * PageErrorBoundary（决策 D3）：捕获页面 DSL 渲染期异常，
 * 显示受控错误页（可重试重新渲染），应用外壳不崩溃、不白屏。
 */
export class PageErrorBoundary extends Component<
  PageErrorBoundaryProps,
  PageErrorBoundaryState
> {
  override state: PageErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): PageErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[pactor-app] 页面渲染异常', error, info.componentStack);
  }

  override render(): ReactNode {
    const { error } = this.state;
    if (error !== null) {
      return (
        <Result
          className="pactor-app-page-render-error"
          status="error"
          title="页面渲染异常"
          subTitle={error.message}
          extra={
            <Button
              type="primary"
              onClick={() => this.setState({ error: null })}
            >
              重试
            </Button>
          }
        />
      );
    }
    return this.props.children;
  }
}
