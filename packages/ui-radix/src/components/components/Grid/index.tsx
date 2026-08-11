import type { GridProps } from 'pactor-ui-antd/components';
import { Children } from 'react';

/** Grid 均分栏布局（Radix kit）：CSS grid，`.pcr-grid-cols-<n>` 语义 class */
export function Grid({ columns = 1, gap, children }: GridProps) {
  const cols = Math.max(1, columns);
  return (
    <div
      className={`pcr-grid pcr-grid-cols-${cols}`}
      style={gap !== undefined ? { gap } : undefined}
    >
      {Children.map(children, (child, index) => (
        <div key={index} className="pcr-grid-item">
          {child}
        </div>
      ))}
    </div>
  );
}
