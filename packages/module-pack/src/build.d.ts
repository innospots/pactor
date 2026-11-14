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
export declare class ModuleBuildError extends Error {
    readonly errors: string[];
    constructor(message: string, errors: string[]);
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
export declare function buildModule(options?: BuildModuleOptions): BuildModuleResult;
