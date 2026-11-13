/**
 * `$include` 展开器（语义以 PoC build-adapter.mjs 为蓝本）：
 * - `$include` 必须是对象唯一键，值为 yamlRoot 相对路径字符串；
 * - 递归展开，循环引用报错并带引用链；
 * - 解析失败的错误均带文件上下文。
 *
 * 注意：`$include` 目前是应用层约定（各工程在自己的 sitemap.ts 中重复实现），
 * 本实现是上游化为框架能力的第一步，后续应迁移到 dsl-io 供运行时与打包共用。
 */
export declare const INCLUDE_KEY = "$include";
/** include 展开相关错误（循环引用 / 非法 $include / YAML 语法错误） */
export declare class IncludeError extends Error {
}
/** 解析 YAML 文件为 JS 值，语法错误带文件路径 */
export declare function parseYamlFile(file: string): unknown;
interface ExpandContext {
    yamlRoot: string;
    /** 当前文件（yamlRoot 相对路径，用于错误信息） */
    current: string;
    /** 引用链（yamlRoot 相对路径），用于循环检测 */
    stack: string[];
}
/**
 * 加载 yamlRoot 下的相对路径文件并递归展开其中的 `$include`。
 * 循环引用时报错，信息形如 `循环引用: a.yaml -> b.yaml -> a.yaml`。
 */
export declare function loadYamlExpanded(yamlRoot: string, relPath: string, stack?: string[]): unknown;
/** 递归展开值中的 `$include` 节点（非 $include 对象/数组/标量原样递归返回） */
export declare function expandIncludes(value: unknown, ctx: ExpandContext): unknown;
export {};
