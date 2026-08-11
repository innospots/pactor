import type { AlertProps } from 'pactor-ui-antd/components';

/** Alert 适配器（Radix kit）：variant 映射 `.pcr-alert-<variant>` 语义 class */
export function Alert({ message, description, variant = 'info' }: AlertProps) {
  return (
    <div className={`pcr-alert pcr-alert-${variant}`} role="alert">
      {message ? <div className="pcr-alert-message">{message}</div> : null}
      {description ? (
        <div className="pcr-alert-description">{description}</div>
      ) : null}
    </div>
  );
}
