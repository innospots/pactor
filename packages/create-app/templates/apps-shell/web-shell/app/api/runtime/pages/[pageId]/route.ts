import { existsSync, readdirSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { cookies } from "next/headers";

import {
  createDefaultTranslatableFieldRegistry,
  isI18nError,
  localizePageDsl,
  resolveRequestLocale,
  type TranslatableFieldRegistry,
} from "@pactor-app/i18n";
import { YamlMessageProvider } from "@pactor-app/i18n/node";
import { getRuntimePage } from "@pactor-app/shell/server";

import { findUserBySession, SESSION_COOKIE } from "@/backend/session";

/**
 * 懒加载页面端点。
 *
 * 页面 DSL 由装配器落到 .generated；业务模块的语言包随模块资源分发到
 * public/modules/<moduleId>/<version>/i18n/。本端点按页面所属模块加载
 * 对应语言包并本地化，Shell 自带页面（globalPageId 前缀 shell:）为直写
 * 文案，原样返回。自定义组件的可翻译字段由模块的 i18n/fields.json 声明，
 * 与默认注册表合并。
 */

const STATUS_BY_KIND = {
  not_found: 404,
  unauthorized: 401,
  forbidden: 403,
} as const;

const MODULES_DIR = join(process.cwd(), "public/modules");
const NAMESPACE = "app";
const DEFAULT_LOCALE = "zh-CN";
const LOCALE_CONFIG = {
  supportedLocales: ["zh-CN", "en-US"],
  defaultLocale: DEFAULT_LOCALE,
  aliases: { zh: "zh-CN", en: "en-US" },
};
const INVALID_LOCALE_CODES = [
  "INVALID_LOCALE",
  "UNSUPPORTED_LOCALE",
  "DUPLICATE_LOCALE_PARAM",
  "LOCALE_CONFLICT",
];

interface ModuleAssets {
  moduleId: string;
  dir: string;
  release: string;
}

interface FieldSpec {
  components?: Record<string, string | string[]>;
  actions?: Record<string, string | string[]>;
}

/** 已安装模块的资源目录（public/modules/<moduleId>/<version>，含 i18n 才算） */
function listModuleAssets(): ModuleAssets[] {
  if (!existsSync(MODULES_DIR)) return [];
  const result: ModuleAssets[] = [];
  for (const moduleEntry of readdirSync(MODULES_DIR, { withFileTypes: true })) {
    if (!moduleEntry.isDirectory()) continue;
    const moduleId = moduleEntry.name;
    const root = join(MODULES_DIR, moduleId);
    for (const versionEntry of readdirSync(root, { withFileTypes: true })) {
      if (!versionEntry.isDirectory()) continue;
      const dir = join(root, versionEntry.name);
      if (existsSync(join(dir, "i18n"))) {
        result.push({ moduleId, dir, release: `v${versionEntry.name}` });
      }
    }
  }
  return result;
}

/** globalPageId 形如 <moduleId>:<pageId>；Shell 自带站点没有模块资源 */
function assetsForPage(globalPageId: string): ModuleAssets | null {
  const moduleId = globalPageId.split(":")[0];
  if (!moduleId || moduleId === "shell") return null;
  return listModuleAssets().find((assets) => assets.moduleId === moduleId) ?? null;
}

/** 默认字段注册表 + 各模块声明的自定义组件字段 */
function translatableFields(): TranslatableFieldRegistry {
  const registry = createDefaultTranslatableFieldRegistry();
  for (const assets of listModuleAssets()) {
    const file = join(assets.dir, "i18n", "fields.json");
    if (!existsSync(file)) continue;
    try {
      const spec = JSON.parse(readFileSync(file, "utf8")) as FieldSpec;
      for (const [component, fields] of Object.entries(spec.components ?? {})) {
        registry.register(component, fields);
      }
      for (const [action, fields] of Object.entries(spec.actions ?? {})) {
        registry.registerAction(action, fields);
      }
    } catch (error) {
      console.warn(`[runtime] 模块 ${assets.moduleId} 的 i18n/fields.json 解析失败`, error);
    }
  }
  return registry;
}

function providerFor(assets: ModuleAssets): YamlMessageProvider {
  return new YamlMessageProvider({
    manifest: {
      appId: assets.moduleId,
      release: assets.release,
      locales: {
        "zh-CN": { [NAMESPACE]: { path: "zh-CN/app.yaml", version: "1" } },
        "en-US": { [NAMESPACE]: { path: "en-US/app.yaml", version: "1" } },
      },
    },
    readFile: (path) => readFile(join(assets.dir, "i18n", path), "utf8"),
  });
}

function json(body: unknown, headers: Record<string, string> = {}): Response {
  return Response.json(body, {
    headers: { "cache-control": "no-store", ...headers },
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ pageId: string }> },
) {
  const { pageId } = await context.params;
  const store = await cookies();
  const user = findUserBySession(store.get(SESSION_COOKIE)?.value);
  const result = getRuntimePage(pageId, user);
  if (result.kind !== "ok") {
    return Response.json(
      { error: result.kind },
      { status: STATUS_BY_KIND[result.kind] },
    );
  }

  const assets = assetsForPage(result.resource.id);
  if (!assets) return json(result.resource);

  let locale = DEFAULT_LOCALE;
  try {
    const resolved = resolveRequestLocale(
      {
        queryLocale: new URL(request.url).searchParams.getAll("locale"),
        cookieLocale: store.get("locale")?.value,
        acceptLanguage: request.headers.get("accept-language") ?? undefined,
      },
      LOCALE_CONFIG,
    );
    locale = resolved.locale;
  } catch (error) {
    if (isI18nError(error) && INVALID_LOCALE_CODES.includes(error.code)) {
      return Response.json({ error: error.code }, { status: 400 });
    }
    throw error;
  }

  try {
    const provider = providerFor(assets);
    const load = (value: string) =>
      provider.load({
        appId: assets.moduleId,
        release: assets.release,
        locale: value,
        namespaces: [NAMESPACE],
      });
    const current = await load(locale);
    const fallbacks = locale === DEFAULT_LOCALE ? [] : [await load(DEFAULT_LOCALE)];
    const schema = localizePageDsl({
      page: result.resource.schema as Parameters<typeof localizePageDsl>[0]["page"],
      locale,
      defaultLocale: DEFAULT_LOCALE,
      languageBundles: { current, fallbacks },
      registry: translatableFields(),
    });
    return json(
      { ...result.resource, schema },
      { "content-language": locale },
    );
  } catch (error) {
    // 语言包缺失 / 字段未注册：保留原文（$i18n 内联默认值仍可渲染），并告警
    console.warn(`[runtime] 页面 ${result.resource.id} 本地化失败`, error);
    return json(result.resource);
  }
}
