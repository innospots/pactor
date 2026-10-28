/**
 * 宿主侧文案（SitemapApp 之外的视图，如页面访问门禁）。
 *
 * 页面 / 布局 DSL 的文案不在这里：走服务端本地化（`$i18n{key:默认值}` +
 * `src/server/i18n/locales/<locale>/app.yaml`），客户端只消费已选语言的
 * 字符串或 `$localizedText`。本表只服务宿主自己的 React 视图，语言来自
 * `src/pactor/locale.tsx` 的 `useLocale`（Cookie + URL，与服务端同一来源）。
 */

import type { Locale } from "../locale";

const zhCN = {
  "gate.checking": "正在校验页面访问权限…",
  "gate.redirecting": "正在跳转登录页…",
  "gate.denied.title": "无访问权限",
  "gate.denied.retry": "重新校验",
  "gate.denied.back": "返回上一页",
  "gate.denied.home": "回到首页",
  "gate.denied.noAccess": "无页面访问权限",
  "gate.error.http": "页面权限校验失败：HTTP {{status}}",
  "gate.error.unavailable": "页面权限校验服务不可用：{{message}}",
} as const;

export type GateMessageKey = keyof typeof zhCN;

const enUS: Record<GateMessageKey, string> = {
  "gate.checking": "Checking page access…",
  "gate.redirecting": "Redirecting to sign in…",
  "gate.denied.title": "Access denied",
  "gate.denied.retry": "Retry",
  "gate.denied.back": "Back",
  "gate.denied.home": "Home",
  "gate.denied.noAccess": "No permission to access this page",
  "gate.error.http": "Page access check failed: HTTP {{status}}",
  "gate.error.unavailable": "Page access service unavailable: {{message}}",
};

const messages: Record<Locale, Record<GateMessageKey, string>> = {
  "zh-CN": zhCN,
  "en-US": enUS,
};

/** 宿主文案翻译（{{name}} 插值；locale 未就绪时回退默认语言，再回退 key 本身） */
export function translate(
  locale: Locale | null | undefined,
  key: GateMessageKey,
  params?: Record<string, string | number>,
): string {
  const active = locale ?? "zh-CN";
  const template = messages[active][key] ?? messages["zh-CN"][key] ?? key;
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (raw, name: string) =>
    params[name] !== undefined ? String(params[name]) : raw,
  );
}
