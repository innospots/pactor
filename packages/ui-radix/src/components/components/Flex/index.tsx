import type { FlexProps } from 'pactor-ui-antd/components';

/** Flex 布局（Radix kit）：方向 / 对齐映射语义 class，数字 gap 内联 */
export function Flex({
  direction = 'horizontal',
  gap,
  justify,
  align,
  children,
}: FlexProps) {
  const className = [
    'pcr-flex',
    direction === 'vertical' ? 'pcr-flex-vertical' : '',
    typeof gap === 'string' ? `pcr-flex-gap-${gap}` : '',
    justify ? `pcr-flex-justify-${justify}` : '',
    align ? `pcr-flex-align-${align}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      style={typeof gap === 'number' ? { gap } : undefined}
    >
      {children}
    </div>
  );
}
