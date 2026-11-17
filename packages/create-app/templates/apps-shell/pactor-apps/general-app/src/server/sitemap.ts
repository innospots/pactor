import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  createDefaultTranslatableFieldRegistry,
  localizePageDsl,
  resolveRequestLocale,
  type TranslatableFieldRegistry,
} from "@pactor-app/i18n";
import { YamlMessageProvider } from "@pactor-app/i18n/node";
import type { LayoutDsl, SitemapPageEntry, SitemapResource } from "pactor-app";
import { parse } from "yaml";

import { requestCookies } from "@/server/api/http";

/**
 * 独立运行的 sitemap 数据源：布局与页面 DSL 直接从 yaml/ 读取，
 * 按请求 locale 用 public/i18n 下的语言包本地化后内联返回。
 *
 * 接入 Shell 后这段本地化由 Shell 的页面端点承接（语言包随模块 public
 * 资源分发到 public/modules/<moduleId>/<version>/i18n/）。
 */

const YAML_DIR = join(process.cwd(), "src/server/yaml");
const PAGES_DIR = "general-app";
const I18N_DIR = join(process.cwd(), "public/i18n");
const APP_ID = "general-app";
const RELEASE = "v1";
const NAMESPACE = "app";
const LOCALE_CONFIG = {
  supportedLocales: ["zh-CN", "en-US"],
  defaultLocale: "zh-CN",
  aliases: { zh: "zh-CN", en: "en-US" },
};

interface PageEntry {
  id: string;
  path: string;
  title: string;
  version: number;
}

interface SiteFile {
  id: string;
  resourceType: "sitemap";
  version: number;
  dslVersion: string;
  app: { name: string };
  layouts: Record<string, LayoutDsl | string>;
  pages: PageEntry[];
  menus: SitemapResource["menus"];
}

const provider = new YamlMessageProvider({
  manifest: {
    appId: APP_ID,
    release: RELEASE,
    locales: {
      "zh-CN": { [NAMESPACE]: { path: "zh-CN/app.yaml", version: "1" } },
      "en-US": { [NAMESPACE]: { path: "en-US/app.yaml", version: "1" } },
    },
  },
  readFile: (path) => readFile(join(I18N_DIR, path), "utf8"),
});

function loadYaml<T>(file: string): T {
  return parse(readFileSync(join(YAML_DIR, file), "utf8")) as T;
}

/** 可翻译字段注册表：默认字段 + 模块自定义组件字段（public/i18n/fields.json） */
function translatableFields(): TranslatableFieldRegistry {
  const registry = createDefaultTranslatableFieldRegistry();
  let spec: {
    components?: Record<string, string | string[]>;
    actions?: Record<string, string | string[]>;
  };
  try {
    spec = JSON.parse(readFileSync(join(I18N_DIR, "fields.json"), "utf8"));
  } catch {
    return registry;
  }
  for (const [component, fields] of Object.entries(spec.components ?? {})) {
    registry.register(component, fields);
  }
  for (const [action, fields] of Object.entries(spec.actions ?? {})) {
    registry.registerAction(action, fields);
  }
  return registry;
}

function requestLocale(request: Request): string {
  try {
    return resolveRequestLocale(
      {
        queryLocale: new URL(request.url).searchParams.getAll("locale"),
        cookieLocale: requestCookies(request).get("locale"),
        acceptLanguage: request.headers.get("accept-language") ?? undefined,
      },
      LOCALE_CONFIG,
    ).locale;
  } catch {
    return LOCALE_CONFIG.defaultLocale;
  }
}

async function languageBundles(locale: string) {
  const load = (value: string) =>
    provider.load({
      appId: APP_ID,
      release: RELEASE,
      locale: value,
      namespaces: [NAMESPACE],
    });
  const current = await load(locale);
  const fallbacks =
    locale === LOCALE_CONFIG.defaultLocale
      ? []
      : [await load(LOCALE_CONFIG.defaultLocale)];
  return { current, fallbacks };
}

export async function buildSitemap(request: Request): Promise<SitemapResource> {
  const site = loadYaml<SiteFile>("sitemap.yaml");
  const layouts = Object.fromEntries(
    Object.entries(site.layouts).map(([name, def]) => [
      name,
      typeof def === "string" ? loadYaml<LayoutDsl>(def) : def,
    ]),
  );

  const locale = requestLocale(request);
  const bundles = await languageBundles(locale);
  const registry = translatableFields();

  const pages: SitemapPageEntry[] = site.pages.map((entry) => {
    // 页面 DSL 约定：yaml/<模块目录>/<pageId>.yaml
    const raw = loadYaml<Record<string, unknown>>(
      `${PAGES_DIR}/${entry.id}.yaml`,
    );
    let pageDsl = raw as unknown as SitemapPageEntry["pageDsl"];
    try {
      pageDsl = localizePageDsl({
        page: raw as unknown as Parameters<typeof localizePageDsl>[0]["page"],
        locale,
        defaultLocale: LOCALE_CONFIG.defaultLocale,
        languageBundles: bundles,
        registry,
      }) as SitemapPageEntry["pageDsl"];
    } catch (error) {
      console.warn(`[general-app] 页面 ${entry.id} 本地化失败，回退原文`, error);
    }
    return { ...entry, pageDsl };
  });

  return {
    id: site.id,
    resourceType: site.resourceType,
    version: site.version,
    dslVersion: site.dslVersion,
    app: site.app,
    layouts,
    pages,
    menus: site.menus,
  };
}
