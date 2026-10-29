"use client";

import { useI18n } from "@pactor-app/runtime";

type I18nValue = string | Record<string, string> | null | undefined;

/**
 * 从 API 返回的 I18nObject（或历史纯字符串）解析当前展示文案。
 */
export function resolveI18nText(
  value: I18nValue,
  locale: string,
  defaultLocale: string,
  preferredLocales: readonly string[] = [],
): string {
  if (value == null) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  const candidates = [
    ...preferredLocales,
    locale,
    locale.split("-")[0],
    defaultLocale,
    defaultLocale.split("-")[0],
  ];
  for (const preferredLocale of candidates) {
    const candidate = value[preferredLocale];
    if (candidate != null && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }
  for (const candidate of Object.values(value)) {
    if (candidate != null && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }
  return "";
}

export interface I18nTextProps {
  value?: I18nValue;
}

/** 表格/链接等只读场景下的国际化文案。 */
export function I18nText({ value }: I18nTextProps) {
  const { locale, defaultLocale } = useI18n();
  return <>{resolveI18nText(value, locale, defaultLocale)}</>;
}
