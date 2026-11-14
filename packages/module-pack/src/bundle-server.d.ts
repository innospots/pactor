/**
 * server entry 打包（esbuild）：
 * - `--bundle --format=esm --platform=node --target=node20`；
 * - 产物固定为 server/index.mjs：模块包通常没有 `"type": "module"`，
 *   若输出 .js 会被 Node 按 CJS 解析；esbuild 的 format=esm 不会自动改扩展名，
 *   因此必须显式 outExtension；
 * - react / next / pactor 保持 external（server 端不需要，也不该打入模块）；
 *   Node built-in 由 platform=node 自动 external；
 * - alias 复用 tsconfig 的 paths（如 `@/*` → `./src/*`）；
 * - 入口必须位于工程根内，防止越界读取。
 */
/** 内置 externals：宿主/框架依赖，绝不打进 server bundle */
export declare const SERVER_EXTERNALS: string[];
/** server 产物文件名（与 manifest.serverEntry 一致） */
export declare const SERVER_BUNDLE_FILE: "index.mjs";
/** server 打包错误（入口缺失 / 越界 / 产物缺失） */
export declare class ServerBundleError extends Error {
}
export interface BundleServerOptions {
    projectDir: string;
    /** 工程相对路径（配置 serverEntry） */
    serverEntry: string;
    /** 输出目录（绝对路径，产物为 index.mjs / index.mjs.map） */
    outDir: string;
}
export interface BundleServerResult {
    bundled: true;
    entry: typeof SERVER_BUNDLE_FILE;
}
/** esbuild 打包 server entry；入口不存在或越界时抛 ServerBundleError */
export declare function bundleServer(options: BundleServerOptions): BundleServerResult;
