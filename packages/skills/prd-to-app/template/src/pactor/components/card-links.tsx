"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CirclePlay, Ban } from "lucide-react";

/**
 * 卡片链接与行内操作组件（列表页卡片常用内联定义，
 * ProviderCardLink / ModelCardLink / RouteCardLink / TemplateCardLink 四份
 * 实现完全相同，此处合并为一个 CardLink 并以别名注册）。
 */

/** DSL `type: "ProviderCardLink" | "ModelCardLink" | "RouteCardLink" | "TemplateCardLink"`：
 *  整卡点击跳详情（hover 手型/阴影见 globals.css .provider-card / .model-card）；
 *  内部按钮/开关/链接的点击经 closest 检测屏蔽，不触发跳转 */
export function CardLink({
  href,
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  const router = useRouter();
  return (
    <div
      className="h-full"
      onClick={(e) => {
        if (
          (e.target as HTMLElement).closest("button, a, input, [role='switch']")
        )
          return;
        if (href) router.push(href);
      }}
    >
      {children}
    </div>
  );
}

/** DSL `type: "StatusToggleIcon"`：启停状态图标（DSL Icon 白名单无 CirclePlay/Ban，
 *  故直接引 lucide-react）：启用 → CirclePlay（主色）；停用 → Ban（灰显） */
export function StatusToggleIcon({ enabled }: { enabled?: boolean }) {
  const ToggleIcon = !enabled ? CirclePlay : Ban;
  return (
    <ToggleIcon
      size={16}
      color={enabled ? "var(--primary)" : "var(--muted-foreground)"}
    />
  );
}

/** DSL `type: "TextLink"`：文本形态可点区域（Text 组件不挂事件，Renderer 会把
 *  events.onClick 注入 props，这里以 span 承接；stopPropagation 避免触发整卡跳转） */
export function TextLink({
  text,
  className,
  style,
  onClick,
}: {
  text?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  return (
    <span
      role="button"
      tabIndex={0}
      className={className}
      style={{ cursor: "pointer", ...style }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onClick?.();
        }
      }}
    >
      {text}
    </span>
  );
}
