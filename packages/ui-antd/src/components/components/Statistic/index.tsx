import { Statistic as AntStatistic } from 'antd';

export interface StatisticProps {
  /** 指标标题 */
  title?: string;
  /** 指标数值（通常为表达式解析后的数字） */
  value?: number | string;
  /** 小数精度 */
  precision?: number;
  /** 后缀（如单位） */
  suffix?: string;
}

/** Statistic 适配器（设计决策 D1） */
export function Statistic({ title, value, precision, suffix }: StatisticProps) {
  return (
    <AntStatistic
      title={title}
      value={value}
      precision={precision}
      suffix={suffix}
    />
  );
}
