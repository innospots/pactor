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
    /** 模块 id（与 apiPrefixes 同时存在时，命中前缀的 API URL 改写为模块挂载路径） */
    moduleId?: string;
    /** 模块声明的逻辑 API 前缀（如 `/api/risk-analysis`） */
    apiPrefixes?: string[];
}
export interface RewriteResult {
    value: unknown;
    warnings: string[];
}
/** 遍历 DSL 值并重写 URL（不修改入参，返回新值与告警列表） */
export declare function rewriteDslUrls(value: unknown, ctx: RewriteContext): RewriteResult;
/**
 * 导航 `to` 重写：命中模块内页面路径或 loginPath 时加 basePath 前缀；
 * 返回 undefined 表示不重写。模板表达式段（`${...}`）按原样保留。
 */
export declare function rewriteNavigationTo(to: string, ctx: RewriteContext): string | undefined;
/**
 * 路径模式匹配：`:param` 段匹配任意非空段（含 `${...}` 模板段），
 * 字面值段必须相等；忽略查询串。
 */
export declare function matchPathPattern(pattern: string, value: string): boolean;
