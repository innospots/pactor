import type { ModulePackConfig } from './config.js';
/**
 * 产物落盘：dist-module/ = Manifest V1 + dsl/（sitemap + 页面 DSL）+
 * assets/（public 复制）+ module-assets.json（sha256 清单）+ client/（由 bundle 阶段写入）。
 *
 * Manifest V1 契约对齐 Shell 装配器（assemble-modules.mjs）：
 * require.resolve("<pkg>/manifest") → manifest.json；pages[].id ↔ dslRoot 下
 * <pageId>.yaml；assetsRoot 复制到 public/modules/<id>/<version>/。
 */
export interface ModuleManifest {
    schemaVersion: '1';
    id: string;
    name: string;
    /** 与目标工程 package.json version 同步 */
    version: string;
    /** 从目标工程安装的 pactor-app 版本推导（如 ^1.54.0） */
    pactorVersionRange: string;
    basePath: string;
    sitemap: 'dsl/sitemap.yaml';
    dslRoot: 'dsl';
    assetsRoot: 'assets';
    /** 纯 DSL 模块无 client bundle 时缺省 */
    clientEntry?: 'client/index.js';
    styles?: ['client/index.css'];
    /** 服务端入口（存在 server bundle 时输出） */
    serverEntry?: 'server/index.mjs';
    /** 模块 API 逻辑前缀（与 serverEntry 成对输出） */
    apiPrefixes?: string[];
}
export interface EmitDslInput {
    config: ModulePackConfig;
    projectDir: string;
    /** 产物目录（绝对路径，通常是临时构建目录） */
    outDir: string;
    /** 转换 + 重写后的 sitemap */
    site: Record<string, unknown>;
    /** pageId -> 展开 + 重写后的页面 DSL */
    pages: Map<string, unknown>;
}
export interface EmitDslResult {
    assetCount: number;
}
export interface WriteManifestInput {
    config: ModulePackConfig;
    projectDir: string;
    outDir: string;
    clientEntry?: 'client/index.js';
    styles?: ['client/index.css'];
    serverEntry?: 'server/index.mjs';
    apiPrefixes?: string[];
    /** 追加版本推导相关的告警 */
    warnings: string[];
}
/** 一步落盘全部产物（dsl + assets + module-assets.json + manifest.json） */
export declare function emitModule(input: EmitDslInput & Omit<WriteManifestInput, 'config' | 'projectDir' | 'outDir'>): EmitDslResult & {
    manifest: ModuleManifest;
};
/** 落盘 dsl/（sitemap.yaml + <pageId>.yaml）与 assets/（含 module-assets.json） */
export declare function emitDsl(input: EmitDslInput): EmitDslResult;
/** 生成 manifest.json（version 与目标工程 package.json 同步） */
export declare function writeManifest(input: WriteManifestInput): ModuleManifest;
/** 读取目标工程 package.json 的 version（缺失时回退 0.0.0） */
export declare function readProjectVersion(projectDir: string): string;
/**
 * 推导 pactorVersionRange：优先目标工程 node_modules 中实际安装的
 * pactor-app / @pactor-app/app 版本（^x.y.z）；其次 package.json 中声明的
 * 版本范围；都不可得时告警并回退 ^1.54.0。
 */
export declare function resolvePactorVersionRange(projectDir: string, warnings: string[]): string;
