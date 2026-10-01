"use client";

/**
 * 页面 DSL 引用的自定义组件注册表（页面级自定义组件
 * `components={{...}}`），经 SitemapApp 的 `components` prop 全局注册。
 */
import { ChipNode } from "./chip-node";
import { ChipFilter } from "./chip-filter";
import { StatusBadge } from "./status-badge";
import { LogStatus } from "./log-status";
import { DebugChat } from "./debug-chat";
import { CardLink, StatusToggleIcon, TextLink } from "./card-links";
import { ThemeSwitcher } from "./theme-switcher";

export const pactorComponents: Record<string, unknown> = {
  ChipNode,
  ChipFilter,
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
