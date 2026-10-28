import { useCallback } from "react";
import { SitemapApp } from "pactor-app";

import { withClientDemo } from "../i18n/demo";
import { LocaleSelector, useLocale } from "../i18n/locale";
import { messages } from "../i18n/messages";
import { apiBaseUrl, sitemapSources } from "./config";

export function App() {
  const { locale, changeLocale } = useLocale();
  const fetcher = useCallback<typeof fetch>(async (input, init) => {
    const response = await fetch(input, init);
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (!locale || !response.ok || new URL(url, window.location.origin).pathname !== "/api/sitemap") return response;
    const site: unknown = await response.json();
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.delete("content-encoding");
    return new Response(JSON.stringify(withClientDemo(site, locale)), {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }, [locale]);

  if (!locale) return null;
  return (
    <>
      <LocaleSelector locale={locale} onChange={changeLocale} />
      <SitemapApp
        key={locale}
        locale={locale}
        defaultLocale="zh-CN"
        messages={messages}
        fetcher={fetcher}
        sources={sitemapSources}
        baseUrl={apiBaseUrl}
      />
    </>
  );
}
