import type { PageProps } from 'pactor-ui-antd/components';

/** Page 容器（Radix kit）：可选标题 + 内容区，语义 class 原生元素 */
export function Page({ title, children }: PageProps) {
  return (
    <div className="pcr-page">
      {title ? <h2 className="pcr-page-title">{title}</h2> : null}
      <div className="pcr-page-content">{children}</div>
    </div>
  );
}
