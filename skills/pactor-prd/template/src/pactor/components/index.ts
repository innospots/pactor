"use client";

/**
 * 页面 DSL 引用的自定义组件注册表（页面级自定义组件
 * `components={{...}}`），经 SitemapApp 的 `components` prop 全局注册。
 * ChipFilter / ChipNode 快筛组件已内置在 @pactor-app/ui，无需在此注册。
 */
import { StatusBadge } from "./status-badge";
import { LogStatus } from "./log-status";
import { DebugChat } from "./debug-chat";
import { CardLink, StatusToggleIcon, TextLink } from "./card-links";
import { ThemeSwitcher } from "./theme-switcher";

export const pactorComponents: Record<string, unknown> = {
  StatusBadge,
  LogStatus,
  DebugChat,
  ProviderCardLink: CardLink,
  ModelCardLink: CardLink,
  RouteCardLink: CardLink,
  TemplateCardLink: CardLink,
  TextLink,
  StatusToggleIcon,
  ThemeSwitcher,
};
