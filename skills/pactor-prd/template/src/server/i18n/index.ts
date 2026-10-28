import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { PageDsl } from "@pactor-app/core";
import { isI18nError, localizePageDsl, resolveRequestLocale } from "@pactor-app/i18n";
import { YamlMessageProvider } from "@pactor-app/i18n/node";
import type { SitemapResource } from "pactor-app";

const appId = "pactor-example";
const release = "example-v1";
const defaultLocale = "zh-CN";
const localeConfig = {
  supportedLocales: ["zh-CN", "en-US"],
  defaultLocale,
  aliases: { zh: "zh-CN", en: "en-US" },
};
const provider = new YamlMessageProvider({
  manifest: {
    appId,
    release,
    locales: {
      "zh-CN": { app: { path: "locales/zh-CN/app.yaml", version: "1" } },
      "en-US": { app: { path: "locales/en-US/app.yaml", version: "1" } },
    },
  },
  readFile: (path) => readFile(join(process.cwd(), "src/server/i18n", path), "utf8"),
});

/** URL has priority over cookie and Accept-Language; duplicate/unsupported explicit values fail. */
export function requestLocale(request: Request, cookieLocale?: string) {
  const values = new URL(request.url).searchParams.getAll("locale");
  return resolveRequestLocale({
    queryLocale: values.length > 1 ? values : values[0],
    cookieLocale,
    acceptLanguage: request.headers.get("accept-language") ?? undefined,
  }, localeConfig);
}

export function localeError(error: unknown, headers: HeadersInit): Response {
  if (isI18nError(error) && ["INVALID_LOCALE", "UNSUPPORTED_LOCALE", "DUPLICATE_LOCALE_PARAM", "LOCALE_CONFLICT"].includes(error.code)) {
    return Response.json({ error: error.code }, { status: 400, headers });
  }
  throw error;
}

async function bundles(locale: string) {
  const load = (value: string) => provider.load({ appId, release, locale: value, namespaces: ["app"] });
  const current = await load(locale);
  const fallbacks = locale === defaultLocale ? [] : [await load(defaultLocale)];
  return { current, fallbacks };
}

export async function localizePage(page: PageDsl, locale: string) {
  const languageBundles = await bundles(locale);
  return localizePageDsl({ page, locale, defaultLocale, languageBundles });
}

/** Localize only declared menu/page titles; never mutate cached, authorization-filtered YAML. */

export async function localizeSitemap(site: SitemapResource, locale: string): Promise<SitemapResource> {
  const languageBundles = await bundles(locale);
  const current = languageBundles.current.bundles.app.messages;
  const fallback = languageBundles.fallbacks[0]?.bundles.app.messages ?? {};
  const t = (key: string, original: string) => current[key] ?? fallback[key] ?? original;
  const menus = (items: SitemapResource["menus"]): SitemapResource["menus"] => items.map((item) => ({
    ...item,
    ...(item.title ? { title: t(`menu.${item.id}`, item.title) } : {}),
    ...(item.children ? { children: menus(item.children) } : {}),
  }));
  return {
    ...site,
    app: site.app && typeof site.app.name === "string"
      ? { ...site.app, name: t("site.app.name", site.app.name) }
      : site.app,
    layouts: Object.fromEntries(Object.entries(site.layouts).map(([name, layout]) => {
      if (name !== "admin") return [name, layout];
      const page = { dsl: layout.dsl, page: { id: "layout-admin", title: "" }, body: layout.body };
      const localized = localizePageDsl({ page, locale, defaultLocale, languageBundles });
      return [name, { ...layout, body: localized.body ?? layout.body }];
    })),
    pages: site.pages.map((page) => ({
      ...page,
      title: t(`page.${page.id}.title`, page.title),
      ...(page.pageDsl ? { pageDsl: localizePageDsl({ page: page.pageDsl, locale, defaultLocale, languageBundles }) } : {}),
    })),
    menus: menus(site.menus),
    localization: { locale, defaultLocale, release, bundleVersions: { app: "1" } },
  };
}

export function localization(locale: string) {
  return { locale, defaultLocale, release, bundleVersions: { app: "1" } };
}
