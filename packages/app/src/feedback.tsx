import type { CSSProperties, ReactNode } from 'react';

/**
 * 应用外壳的轻量反馈组件（加载占位 / 结果页 / 主按钮）：
 * @pactor/app 不依赖任何 UI 库的成品组件，这些占位只用内联样式 +
 * className 钩子（pactor-app-*），不消费 @pactor/ui 的样式表。
 */

const centerStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/** 加载占位：内联 SVG 旋转 spinner（不依赖样式表） */
export function BootstrapSpinner({
  style,
}: {
  style?: CSSProperties;
}): ReactNode {
  return (
    <div className="pactor-app-spin" style={{ ...centerStyle, ...style }}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        role="status"
        aria-label="加载中"
      >
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="#1677ff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="56"
          strokeDashoffset="28"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 16 16"
            to="360 16 16"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}

/** 结果页（启动失败 / 页面加载失败 / 渲染异常 / 404 / 403） */
export function ResultView({
  className,
  title,
  subTitle,
  extra,
}: {
  className?: string;
  title: ReactNode;
  subTitle?: ReactNode;
  extra?: ReactNode;
}): ReactNode {
  return (
    <div className={className} style={{ ...centerStyle, padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
          {title}
        </div>
        {subTitle !== undefined && (
          <div style={{ color: 'rgba(0, 0, 0, 0.45)', marginBottom: 16 }}>
            {subTitle}
          </div>
        )}
        {extra}
      </div>
    </div>
  );
}

/** 主按钮（重试等操作） */
export function PrimaryButton({
  onClick,
  children,
}: {
  onClick?: () => void;
  children?: ReactNode;
}): ReactNode {
  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      style={{
        padding: '6px 16px',
        border: 'none',
        borderRadius: 6,
        background: '#1677ff',
        color: '#fff',
        fontSize: 14,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
