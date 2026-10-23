import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * DSL URL 重写（Shell 装配器不重写 DSL，必须在打包侧处理）：
 *
 * - 导航重写：action 为 `navigate` / `app.reload` 的节点，其 `params.to`
 *   若以 `/` 开头且命中模块内页面路径或 loginPath，加 basePath 前缀；
 *   绝不重写 `request` 的 API `url`（`/api/...`）与 http(s) 外链。
 * - 资源重写：字符串值以 `/` 开头、非 `/api/`、非页面路径，且对应文件存在于
 *   publicDir（如 `/next.svg`），重写为 `/modules/<id>/<version>/<path>`。
 * - 绝对 API 地址（如 `http://localhost:8011/api/...`）：记入 warning 列表；
 *   默认重写为去掉 origin 的相对路径（可由配置关闭）。
 */

export interface RewriteContext {
  /** 模块 basePath（已规范化为 `/xxx`，无尾斜杠） */
  basePath: string;
  /** sitemap 中全部页面 path（可含 `:param` 段） */
  pagePaths: string[];
  /** 登录页路径（sitemap auth.loginPath，默认 /login） */
  loginPath: string;
  /** 目标工程 public 目录（绝对路径，用于判断资源文件存在） */
  publicDir: string;
  /** 是否执行导航重写（profile.rewriteNavigation.basePath） */
  rewriteNavigation: boolean;
  /** 是否执行资源重写 */
  rewriteAssets: boolean;
  /** 资源重写前缀（如 `/modules/risk/0.1.0`，无尾斜杠） */
  assetPrefix: string;
  /** 绝对 API 地址重写为相对路径（false 时仅告警不改写） */
  absoluteApiToRelative: boolean;
}

export interface RewriteResult {
  value: unknown;
  warnings: string[];
}

/** 需要导航重写的 action 名 */
const NAVIGATION_ACTIONS = new Set(['navigate', 'app.reload']);

/** 绝对 API 地址（http(s)://<host>/api/...） */
const ABSOLUTE_API_RE = /^https?:\/\/[^/]+(\/api\/.+)$/;

type AnyRecord = Record<string, unknown>;

/** 遍历 DSL 值并重写 URL（不修改入参，返回新值与告警列表） */
export function rewriteDslUrls(value: unknown, ctx: RewriteContext): RewriteResult {
  const warnings: string[] = [];

  const walk = (node: unknown): unknown => {
    if (typeof node === 'string') {
      return rewriteString(node, ctx, warnings);
    }
    if (Array.isArray(node)) {
      return node.map((item) => walk(item));
    }
    if (node === null || typeof node !== 'object') {
      return node;
    }
    const record = node as AnyRecord;
    const next: AnyRecord = {};
    for (const [key, item] of Object.entries(record)) {
      next[key] = walk(item);
    }
    if (ctx.rewriteNavigation && isNavigationAction(record)) {
      const params = next.params;
      if (isRecord(params) && typeof params.to === 'string') {
        const rewritten = rewriteNavigationTo(params.to, ctx);
        if (rewritten !== undefined) {
          params.to = rewritten;
        }
      }
    }
    return next;
  };

  return { value: walk(value), warnings };
}

function isNavigationAction(record: AnyRecord): boolean {
  return typeof record.action === 'string' && NAVIGATION_ACTIONS.has(record.action);
}

/**
 * 导航 `to` 重写：命中模块内页面路径或 loginPath 时加 basePath 前缀；
 * 返回 undefined 表示不重写。模板表达式段（`${...}`）按原样保留。
 */
export function rewriteNavigationTo(to: string, ctx: RewriteContext): string | undefined {
  if (!to.startsWith('/') || to.startsWith('//')) return undefined;
  if (to.startsWith('/api/')) return undefined;
  if (to === ctx.basePath || to.startsWith(`${ctx.basePath}/`)) return undefined;
  const hit = [ctx.loginPath, ...ctx.pagePaths].some(
    (pattern) => pattern.length > 0 && matchPathPattern(pattern, to),
  );
  if (!hit) return undefined;
  return `${ctx.basePath}${to}`;
}

/**
 * 路径模式匹配：`:param` 段匹配任意非空段（含 `${...}` 模板段），
 * 字面值段必须相等；忽略查询串。
 */
export function matchPathPattern(pattern: string, value: string): boolean {
  const patternSegs = pattern.split('?')[0]!.split('/').filter(Boolean);
  const valueSegs = value.split('?')[0]!.split('/').filter(Boolean);
  if (patternSegs.length !== valueSegs.length) return false;
  return patternSegs.every((seg, index) => seg.startsWith(':') || seg === valueSegs[index]);
}

/** 字符串值重写：绝对 API 告警/降相对、资源 URL 重写为模块 assets 路径 */
function rewriteString(value: string, ctx: RewriteContext, warnings: string[]): string {
  const absoluteApi = ABSOLUTE_API_RE.exec(value);
  if (absoluteApi) {
    warnings.push(
      `绝对 API 地址: ${value}${ctx.absoluteApiToRelative ? '（已重写为相对路径，需底座 BFF/代理承接）' : ''}`,
    );
    return ctx.absoluteApiToRelative ? absoluteApi[1]! : value;
  }
  if (!ctx.rewriteAssets) return value;
  if (!value.startsWith('/') || value.startsWith('//')) return value;
  if (value.startsWith('/api/')) return value;
  if (value === ctx.basePath || value.startsWith(`${ctx.basePath}/`)) return value;
  // 页面路径不是资源，不重写
  const isPagePath = [ctx.loginPath, ...ctx.pagePaths].some(
    (pattern) => pattern.length > 0 && matchPathPattern(pattern, value),
  );
  if (isPagePath) return value;
  if (!isPublicFile(ctx.publicDir, value)) return value;
  return `${ctx.assetPrefix}${value}`;
}

/** 判断 URL 路径是否对应 publicDir 下的真实文件 */
function isPublicFile(publicDir: string, urlPath: string): boolean {
  const file = join(publicDir, urlPath);
  try {
    return existsSync(file) && statSync(file).isFile();
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is AnyRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
