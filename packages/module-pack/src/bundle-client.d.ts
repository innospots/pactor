/**
 * client entry 打包（esbuild）：
 * - `--bundle --format=esm --platform=browser`，react / react-dom / next /
 *   pactor-app / @pactor-app/* 全部 external（peer 单例契约，防双实例）；
 * - alias 自动从目标工程 tsconfig.json 的 compilerOptions.paths 生成（如 `@/*` → `./src/*`）；
 * - 产出 client/index.js + sourcemap；入口引入的 CSS 由 esbuild 收集为 client/index.css；
 * - client entry 不存在时跳过（纯 DSL 模块合法），由调用方提示。
 */
/** 内置 externals：peer 单例，绝不打进 bundle */
export declare const CLIENT_EXTERNALS: string[];
export interface BundleClientOptions {
    projectDir: string;
    /** 工程相对路径（配置 clientEntry） */
    clientEntry: string;
    /** 输出目录（绝对路径，产物为 index.js / index.js.map / 可能的 index.css） */
    outDir: string;
}
export interface BundleClientResult {
    bundled: boolean;
    /** 是否产出 index.css（esbuild 收集的 side-effect CSS） */
    css: boolean;
    /** 跳过打包时的说明（纯 DSL 模块） */
    message?: string;
}
/** esbuild 打包 client entry；入口不存在时跳过打包 */
export declare function bundleClient(options: BundleClientOptions): BundleClientResult;
/**
 * 从目标工程 tsconfig.json 的 compilerOptions.paths 生成 esbuild alias。
 * 支持 `@/*` -> `./src/*` 通配（alias 为去掉 `/*` 的包名）与精确映射；
 * 沿 `extends`（相对路径）合并，子配置覆盖父配置。
 */
export declare function tsconfigAliases(projectDir: string): Record<string, string>;
/** 宽松 JSONC 解析：去注释（尊重字符串字面量）与尾逗号 */
export declare function parseJsonc(text: string): unknown;
