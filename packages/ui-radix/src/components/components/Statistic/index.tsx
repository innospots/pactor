import type { StatisticProps } from 'pactor-ui-antd/components';

/** Statistic 适配器（Radix kit）：标题 + 数值（precision 精度 / suffix 后缀） */
export function Statistic({ title, value, precision, suffix }: StatisticProps) {
  const display =
    typeof value === 'number' && precision !== undefined
      ? value.toFixed(precision)
      : value;
  return (
    <div className="pcr-statistic">
      {title ? <div className="pcr-statistic-title">{title}</div> : null}
      <div className="pcr-statistic-value">
        {display}
        {suffix ? <span className="pcr-statistic-suffix">{suffix}</span> : null}
      </div>
    </div>
  );
}
