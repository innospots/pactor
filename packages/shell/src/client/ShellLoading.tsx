import type { ReactNode } from 'react';

export interface ShellLoadingProps {
  /** 品牌 mark 字符（与 NavigationShell 的 brandMark 对齐），缺省 P */
  brandMark?: string;
  /** 加载文案，缺省「加载中…」；传 null 只显示 mark */
  text?: ReactNode;
}

/** 内置加载兜底：品牌 mark 呼吸动画 + 文案（bootstrap 等待期间的全屏态） */
export function ShellLoading({ brandMark = 'P', text = '加载中…' }: ShellLoadingProps) {
  return (
    <div className="pactor-shell-loading" role="status" aria-live="polite">
      <div className="pactor-shell-loading-mark" aria-hidden="true">
        {brandMark}
      </div>
      {text !== null && <div className="pactor-shell-loading-text">{text}</div>}
    </div>
  );
}
