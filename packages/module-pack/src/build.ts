import { existsSync, mkdirSync, mkdtempSync, renameSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { bundleClient } from './bundle-client.js';
import { bundleServer } from './bundle-server.js';
import { collectModuleSource } from './collect.js';
import { compileTailwind } from './compile-styles.js';
import { loadModuleConfig } from './config.js';
import { emitDsl, readProjectVersion, writeManifest } from './emit-manifest.js';
import { loadYamlExpanded } from './expand-include.js';
import { getProfile } from './profiles/index.js';
import { rewriteDslUrls, type RewriteContext } from './rewrite-urls.js';
import { transformSitemap } from './transform-sitemap.js';
import { validateModule } from './validate.js';

/**
 * `buildModule`：模块构建全链路编排。
 *
 * 收集 → $include 展开 → sitemap 转换（profile）→ URL 重写 → client bundle →
 * Tailwind 预编译 → manifest/assets 落盘 → 产物校验。
 *
 * 失败即阻断：全部产物先写入工程根下的临时目录，校验通过后才整体替换
 * dist-module/；任一页面缺失或校验失败抛 ModuleBuildError，不留半成品。
 */

/** 构建失败（含结构化错误列表，如页面缺失 / 校验失败） */
export class ModuleBuildError extends Error {
  constructor(
    message: string,
    public readonly errors: string[],
  ) {
    super(message);
  }
}

export interface BuildModuleOptions {
  /** 目标工程根（默认 cwd） */
  dir?: string;
  /** 配置文件路径（默认 pactor.module.json） */
  config?: string;
}

export interface BuildModuleResult {
  /** 产物目录（绝对路径） */
  outDir: string;
  stats: {
    pages: number;
    menus: number;
    layouts: number;
    assets: number;
  };
  clientBundled: boolean;
  serverBundled: boolean;
  warnings: string[];
}

/** 执行模块构建全链路，返回产物摘要；失败抛 ModuleBuildError */
export function buildModule(options: BuildModuleOptions = {}): BuildModuleResult {
  const projectDir = resolve(options.dir ?? process.cwd());
  const config = loadModuleConfig(projectDir, options.config);
  const profile = getProfile(config.target);

  if (profile.forbidRootBasePath && config.basePath === '/') {
    throw new ModuleBuildError(
      `target ${config.target} 禁止 basePath: "/"（Shell joinPublicPath 会产生 "//login" 这类坏路径）`,
      [`basePath: "/" 与 profile ${config.target} 的 forbidRootBasePath 冲突，请改用如 /${config.id} 的前缀`],
    );
  }

  // server entry 依赖 Shell 的 /api/modules/* 通用分发入口
  if (config.serverEntry !== undefined && !profile.moduleServerApi) {
    throw new ModuleBuildError(
      `target ${config.target} 不支持模块 server entry（需要 innospots-web-shell@3）`,
      [
        `配置了 serverEntry / apiPrefixes，但 profile ${config.target} 的 moduleServerApi=false`,
        '请把 pactor.module.json 的 target 升到 "innospots-web-shell@3" 后重新构建',
      ],
    );
  }

  const yamlRoot = join(projectDir, config.yamlRoot);
  if (!existsSync(yamlRoot)) {
    throw new ModuleBuildError(`yamlRoot 不存在: ${config.yamlRoot}`, [
      `yamlRoot 不存在: ${yamlRoot}`,
    ]);
  }

  const warnings: string[] = [];
  const collected = collectModuleSource(yamlRoot);
  warnings.push(...collected.warnings);

  // 1) sitemap 展开
  let site: Record<string, unknown>;
  try {
    site = loadYamlExpanded(yamlRoot, 'sitemap.yaml') as Record<string, unknown>;
  } catch (error) {
    const message = `sitemap 展开失败: ${(error as Error).message}`;
    throw new ModuleBuildError(message, [message]);
  }
  const sitePages = Array.isArray(site.pages)
    ? (site.pages as Record<string, unknown>[])
    : [];

  // 2) 页面 DSL 展开；任一缺失/失败即中止（尚未写任何产物）
  const errors: string[] = [];
  const pageDsls = new Map<string, unknown>();
  for (const page of sitePages) {
    const id = page.id;
    if (typeof id !== 'string') {
      errors.push('sitemap.pages 存在缺少 id 的页面项');
      continue;
    }
    const rel = collected.pages.get(id);
    if (rel === undefined) {
      errors.push(`页面 DSL 缺失: ${id}（${config.yamlRoot} 下未找到 ${id}.yaml / ${id}.page.yaml）`);
      continue;
    }
    try {
      pageDsls.set(id, loadYamlExpanded(yamlRoot, rel));
    } catch (error) {
      errors.push(`页面 ${id} 展开失败: ${(error as Error).message}`);
    }
  }
  if (errors.length > 0) {
    throw new ModuleBuildError(`模块构建失败（${errors.length} 个错误）`, errors);
  }

  // 3) sitemap 转换（布局内联 / 菜单去 path / lazy 按 profile / 访问默认值填充）
  const transformed = transformSitemap(site, {
    profile,
    accessDefault: config.access.default,
    loadLayout: (rel) => loadYamlExpanded(yamlRoot, rel),
  });

  // 4) URL 重写（导航 basePath 前缀 / 资源 /modules/<id>/<version>/ / 绝对 API 告警）
  const version = readProjectVersion(projectDir);
  const siteAuth =
    site.auth !== null && typeof site.auth === 'object' && !Array.isArray(site.auth)
      ? (site.auth as Record<string, unknown>)
      : {};
  const rewriteCtx: RewriteContext = {
    basePath: config.basePath,
    pagePaths: sitePages
      .map((page) => page.path)
      .filter((path): path is string => typeof path === 'string'),
    loginPath: typeof siteAuth.loginPath === 'string' ? siteAuth.loginPath : '/login',
    publicDir: join(projectDir, config.publicDir),
    rewriteNavigation: profile.rewriteNavigation.basePath,
    rewriteAssets: true,
    assetPrefix: profile.rewriteAssetUrls(config.id, version).replace(/\/+$/, ''),
    absoluteApiToRelative: config.rewrite.absoluteApiToRelative,
    moduleId: config.id,
    apiPrefixes: config.apiPrefixes,
  };
  const sitemapRewrite = rewriteDslUrls(transformed.site, rewriteCtx);
  warnings.push(...sitemapRewrite.warnings);
  const rewrittenPages = new Map<string, unknown>();
  for (const [id, dsl] of pageDsls) {
    const result = rewriteDslUrls(dsl, rewriteCtx);
    warnings.push(...result.warnings.map((warning) => `${id}: ${warning}`));
    rewrittenPages.set(id, result.value);
  }

  // 5) 临时目录构建 → 校验 → 整体替换，不留半成品
  const outDir = join(projectDir, config.outDir);
  const temp = mkdtempSync(join(projectDir, '.module-pack-'));
  try {
    // client bundle（纯 DSL 模块跳过）
    const bundle = bundleClient({
      projectDir,
      clientEntry: config.clientEntry,
      outDir: join(temp, 'client'),
    });
    if (bundle.message !== undefined) {
      warnings.push(bundle.message);
    }

    // server bundle（未配置 serverEntry 的模块跳过）
    const server = config.serverEntry
      ? bundleServer({
          projectDir,
          serverEntry: config.serverEntry,
          outDir: join(temp, 'server'),
        })
      : undefined;

    // dsl + assets + module-assets.json（Tailwind 需扫描 dist dsl，先落盘）
    const emitted = emitDsl({
      config,
      projectDir,
      outDir: temp,
      site: sitemapRewrite.value as Record<string, unknown>,
      pages: rewrittenPages,
    });

    // Tailwind 预编译（可选；不可用降级为 warning）
    if (bundle.bundled && config.tailwind.enabled) {
      const tailwind = compileTailwind({
        projectDir,
        tailwind: config.tailwind,
        scanDirs: [join(temp, 'dsl'), dirname(join(projectDir, config.clientEntry))],
        cssFile: join(temp, 'client', 'index.css'),
      });
      warnings.push(...tailwind.warnings);
    }

    const hasCss = existsSync(join(temp, 'client', 'index.css'));
    writeManifest({
      config,
      projectDir,
      outDir: temp,
      clientEntry: bundle.bundled ? 'client/index.js' : undefined,
      styles: bundle.bundled && hasCss ? ['client/index.css'] : undefined,
      serverEntry: server ? 'server/index.mjs' : undefined,
      apiPrefixes: server ? config.apiPrefixes : undefined,
      warnings,
    });

    // 产物校验（临时目录），有错误即中止并清理
    const validation = validateModule({ dir: projectDir, config: options.config, moduleDir: temp });
    warnings.push(...validation.warnings);
    if (!validation.ok) {
      throw new ModuleBuildError(
        `产物校验失败（${validation.errors.length} 个错误）`,
        validation.errors,
      );
    }

    rmSync(outDir, { recursive: true, force: true });
    mkdirSync(dirname(outDir), { recursive: true });
    renameSync(temp, outDir);

    return {
      outDir,
      stats: {
        pages: transformed.pageCount,
        menus: transformed.menuCount,
        layouts: transformed.layoutCount,
        assets: emitted.assetCount,
      },
      clientBundled: bundle.bundled,
      serverBundled: server !== undefined,
      warnings,
    };
  } catch (error) {
    rmSync(temp, { recursive: true, force: true });
    throw error;
  }
}
