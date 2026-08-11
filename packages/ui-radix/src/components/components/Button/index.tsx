import type { ButtonProps } from 'pactor-ui-antd/components';

/**
 * Button 适配器（Radix kit）：原生 button + `.pcr-btn` 语义 class。
 * props 契约与 pactor-components（antd 版）一致；`submit: true` 时作为
 * Form 的提交按钮（type=submit）。
 */
export function Button({
  text,
  variant = 'default',
  danger,
  size = 'middle',
  loading,
  disabled,
  submit,
  onClick,
  children,
}: ButtonProps) {
  const className = [
    'pcr-btn',
    `pcr-btn-${variant}`,
    size !== 'middle' ? `pcr-btn-${size}` : '',
    danger ? 'pcr-btn-danger' : '',
    loading ? 'pcr-btn-loading' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={submit ? 'submit' : 'button'}
      className={className}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      onClick={() => onClick?.()}
    >
      {loading ? <span className="pcr-btn-spinner" aria-hidden /> : null}
      {text ?? children}
    </button>
  );
}
