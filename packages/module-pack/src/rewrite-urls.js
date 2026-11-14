import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
/** 需要导航重写的 action 名 */
const NAVIGATION_ACTIONS = new Set(['navigate', 'app.reload']);
/** 绝对 API 地址（http(s)://<host>/api/...） */
const ABSOLUTE_API_RE = /^https?:\/\/[^/]+(\/api\/.+)$/;
/** 遍历 DSL 值并重写 URL（不修改入参，返回新值与告警列表） */
export function rewriteDslUrls(value, ctx) {
    const warnings = [];
    const walk = (node) => {
        if (typeof node === 'string') {
            return rewriteString(node, ctx, warnings);
        }
        if (Array.isArray(node)) {
            return node.map((item) => walk(item));
        }
        if (node === null || typeof node !== 'object') {
            return node;
        }
        const record = node;
        const next = {};
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
function isNavigationAction(record) {
    return typeof record.action === 'string' && NAVIGATION_ACTIONS.has(record.action);
}
/**
 * 导航 `to` 重写：命中模块内页面路径或 loginPath 时加 basePath 前缀；
 * 返回 undefined 表示不重写。模板表达式段（`${...}`）按原样保留。
 */
export function rewriteNavigationTo(to, ctx) {
    if (!to.startsWith('/') || to.startsWith('//'))
        return undefined;
    if (to.startsWith('/api/'))
        return undefined;
    if (to === ctx.basePath || to.startsWith(`${ctx.basePath}/`))
        return undefined;
    const hit = [ctx.loginPath, ...ctx.pagePaths].some((pattern) => pattern.length > 0 && matchPathPattern(pattern, to));
    if (!hit)
        return undefined;
    return `${ctx.basePath}${to}`;
}
/**
 * 路径模式匹配：`:param` 段匹配任意非空段（含 `${...}` 模板段），
 * 字面值段必须相等；忽略查询串。
 */
export function matchPathPattern(pattern, value) {
    const patternSegs = pattern.split('?')[0].split('/').filter(Boolean);
    const valueSegs = value.split('?')[0].split('/').filter(Boolean);
    if (patternSegs.length !== valueSegs.length)
        return false;
    return patternSegs.every((seg, index) => seg.startsWith(':') || seg === valueSegs[index]);
}
/** 字符串值重写：绝对 API 告警/降相对、模块 API namespacing、资源 URL 重写 */
function rewriteString(value, ctx, warnings) {
    const absoluteApi = ABSOLUTE_API_RE.exec(value);
    if (absoluteApi) {
        // 绝对地址先去掉 origin，再按模块 API 前缀 namespacing（若命中）。
        const relative = absoluteApi[1];
        const namespaced = ctx.absoluteApiToRelative
            ? namespaceModuleApi(relative, ctx)
            : undefined;
        const action = ctx.absoluteApiToRelative
            ? namespaced !== undefined
                ? '（已重写为模块 API 相对路径）'
                : '（已重写为相对路径，需底座 BFF/代理承接）'
            : '（absoluteApiToRelative=false，保持绝对地址，不会走模块 API 路由）';
        warnings.push(`绝对 API 地址: ${value}${action}`);
        return ctx.absoluteApiToRelative ? (namespaced ?? relative) : value;
    }
    // 模块 API namespacing 不受 rewriteAssets 影响（即使关闭资源重写也必须改写）
    const namespaced = namespaceModuleApi(value, ctx);
    if (namespaced !== undefined)
        return namespaced;
    if (!ctx.rewriteAssets)
        return value;
    if (!value.startsWith('/') || value.startsWith('//'))
        return value;
    if (value.startsWith('/api/'))
        return value;
    if (value === ctx.basePath || value.startsWith(`${ctx.basePath}/`))
        return value;
    // 页面路径不是资源，不重写
    const isPagePath = [ctx.loginPath, ...ctx.pagePaths].some((pattern) => pattern.length > 0 && matchPathPattern(pattern, value));
    if (isPagePath)
        return value;
    if (!isPublicFile(ctx.publicDir, value))
        return value;
    return `${ctx.assetPrefix}${value}`;
}
/**
 * 命中模块声明的 API 前缀时，把 `/api/<path>` 改写为
 * `/api/modules/<moduleId>/<path>`（query / hash 原样保留）。
 * 未配置 moduleId/apiPrefixes 或未命中时返回 undefined。
 *
 * 前缀按长度降序匹配并做段边界判断，避免 `/api/risk-analysis-extra`
 * 被 `/api/risk-analysis` 误命中。
 */
function namespaceModuleApi(value, ctx) {
    const { moduleId, apiPrefixes } = ctx;
    if (!moduleId || !apiPrefixes || apiPrefixes.length === 0)
        return undefined;
    const pathOnly = value.split(/[?#]/, 1)[0];
    const hit = [...apiPrefixes]
        .sort((a, b) => b.length - a.length)
        .some((prefix) => pathOnly === prefix || pathOnly.startsWith(`${prefix}/`));
    if (!hit)
        return undefined;
    return `/api/modules/${encodeURIComponent(moduleId)}${value.slice('/api'.length)}`;
}
/** 判断 URL 路径是否对应 publicDir 下的真实文件 */
function isPublicFile(publicDir, urlPath) {
    const file = join(publicDir, urlPath);
    try {
        return existsSync(file) && statSync(file).isFile();
    }
    catch {
        return false;
    }
}
function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
