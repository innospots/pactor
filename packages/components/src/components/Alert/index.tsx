import { Alert as AntAlert } from 'antd';

/** DSL Alert 变体（映射 antd `type`） */
export type AlertVariant = 'success' | 'info' | 'warning' | 'error';

export interface AlertProps {
  /** 提示主文案 */
  message?: string;
  /** 辅助说明文案 */
  description?: string;
  /** 变体，默认 info */
  variant?: AlertVariant;
}

/** Alert 适配器（设计决策 D1）：DSL `message` 映射 antd v6 的 `title` */
export function Alert({ message, description, variant = 'info' }: AlertProps) {
  return (
    <AntAlert title={message} description={description} type={variant} />
  );
}
