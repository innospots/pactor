import type { CardProps } from 'pactor-ui-antd/components';

/** Card 适配器（Radix kit）：可选标题 + 边框开关，语义 class 原生元素 */
export function Card({ title, bordered = true, children }: CardProps) {
  const className = bordered ? 'pcr-card pcr-card-bordered' : 'pcr-card';
  return (
    <div className={className}>
      {title ? <h3 className="pcr-card-title">{title}</h3> : null}
      <div className="pcr-card-content">{children}</div>
    </div>
  );
}
