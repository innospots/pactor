/**
 * 产物校验（`pactor module validate`，构建收尾也会自动执行）：
 * - manifest 合法且字段齐备（Manifest V1）；
 * - sitemap 每个 pages[].id 在 dslRoot 下存在对应 <id>.yaml（与 Shell 装配器同语义，递归查找）；
 * - 产物中无 $include 残留；
 * - layouts 全部为对象（无字符串引用残留）；
 * - client bundle 存在且未内嵌 react / @pactor-app（启发式扫描）；
 * - package.json exports 含 ./manifest 与 ./client。
 * 输出结构化错误 / 警告列表；有错误时 ok = false。
 */
export interface ValidateModuleOptions {
    /** 目标工程根（默认 cwd） */
    dir?: string;
    /** 配置文件路径（默认 pactor.module.json） */
    config?: string;
    /** 直接指定产物目录（构建流程内部用于校验临时目录；缺省为 <dir>/<outDir>） */
    moduleDir?: string;
}
export interface ValidateModuleResult {
    ok: boolean;
    errors: string[];
    warnings: string[];
}
/** 校验产物目录与工程 package.json，返回结构化结果 */
export declare function validateModule(options?: ValidateModuleOptions): ValidateModuleResult;
