import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { cookies } from "next/headers";

import {
  createDefaultTranslatableFieldRegistry,
  isI18nError,
  localizePageDsl,
  resolveRequestLocale,
} from "@pactor-app/i18n";
import { YamlMessageProvider } from "@pactor-app/i18n/node";
import { getRuntimePage } from "@pactor-app/shell/server";

import { findUserBySession, SESSION_COOKIE } from "@/backend/mock/accounts";

const STATUS_BY_KIND = {
  not_found: 404,
  unauthorized: 401,
  forbidden: 403,
} as const;

const appId = "innospots-web-shell";
const release = "web-shell-v1";
const defaultLocale = "zh-CN";
const localeConfig = {
  supportedLocales: ["zh-CN", "en-US"],
  defaultLocale,
  aliases: { zh: "zh-CN", en: "en-US" },
};

/**
 * 可翻译字段注册表：与 next-app-starter 对齐（页面 DSL 同源移植），
 * 覆盖宿主自定义组件（WorkbenchEntry / FilterSelect）与 kit 组件的扩展字段。
 */
const translatableFields = createDefaultTranslatableFieldRegistry()
  .register("Login", ["props.brand.description", "props.subtitle"])
  .register("Input", "props.placeholder")
  .register("MetricCard", ["props.title", "props.trendLabel"])
  .register("WorkbenchEntry", ["props.title", "props.description"])
  .register("Field", ["props.label", "props.description"])
  .register("Tabs", "props.items[*].label")
  .register("Descriptions", ["props.items[*].label", "props.items[*].value"])
  .register("Dialog", "props.title")
  .register("Textarea", [
    "props.label",
    "props.placeholder",
    "props.description",
    "props.ariaLabel",
    "props.rules[*].message",
  ])
  .register("FilterSelect", [
    "props.label",
    "props.placeholder",
    "props.description",
    "props.ariaLabel",
    "props.options[*].label",
    "props.rules[*].message",
  ])
  .register("Select", "props.rules[*].message")
  .registerAction("overlay.open", "params.overlay.title");

/** 语言包：src/backend/locales/<locale>/app.yaml（移植自 next-app-starter） */
const provider = new YamlMessageProvider({
  manifest: {
    appId,
    release,
    locales: {
      "zh-CN": { app: { path: "locales/zh-CN/app.yaml", version: "1" } },
      "en-US": { app: { path: "locales/en-US/app.yaml", version: "1" } },
    },
  },
  readFile: (path) =>
    readFile(join(process.cwd(), "src/backend", path), "utf8"),
});

async function bundles(locale: string) {
  const load = (value: string) =>
    provider.load({ appId, release, locale: value, namespaces: ["app"] });
  const current = await load(locale);
  const fallbacks = locale === defaultLocale ? [] : [await load(defaultLocale)];
  return { current, fallbacks };
}

/**
 * 懒加载页面端点：在 shell 默认 handler 之上叠加服务端本地化
 * （移植自 next-app-starter 的页面 DSL 使用 $i18n 简写，转换后下发）。
 * locale 取 ?locale= 查询、locale Cookie 或 Accept-Language，缺省 zh-CN。
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ pageId: string }> },
) {
  const { pageId } = await context.params;
  const store = await cookies();
  const user = findUserBySession(store.get(SESSION_COOKIE)?.value);
  const result = getRuntimePage(pageId, user);
  if (result.kind !== "ok") {
    return Response.json({ error: result.kind }, { status: STATUS_BY_KIND[result.kind] });
  }
  try {
    const { locale } = resolveRequestLocale(
      {
        queryLocale: new URL(request.url).searchParams.getAll("locale"),
        cookieLocale: store.get("locale")?.value,
        acceptLanguage: request.headers.get("accept-language") ?? undefined,
      },
      localeConfig,
    );
    const languageBundles = await bundles(locale);
    const schema = localizePageDsl({
      page: result.resource.schema as Parameters<typeof localizePageDsl>[0]["page"],
      locale,
      defaultLocale,
      languageBundles,
      registry: translatableFields,
    });
    return Response.json(
      { ...result.resource, schema },
      { headers: { "cache-control": "no-store", "content-language": locale } },
    );
  } catch (error) {
    if (
      isI18nError(error) &&
      ["INVALID_LOCALE", "UNSUPPORTED_LOCALE", "DUPLICATE_LOCALE_PARAM", "LOCALE_CONFLICT"].includes(
        error.code,
      )
    ) {
      return Response.json({ error: error.code }, { status: 400 });
    }
    throw error;
  }
}
