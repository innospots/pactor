/**
 * `pactor.module.json` 配置加载与校验（手写校验，避免重依赖）。
 * 字段见设计文档 §3.2；未提供的字段使用合理默认值。
 */
/** 配置相关错误（缺失 / 解析失败 / 类型非法） */
export declare class ConfigError extends Error {
}
export declare const CONFIG_FILE = "pactor.module.json";
export interface TailwindConfig {
    enabled: boolean;
    /** 自定义入口 css（工程相对路径）；缺省时生成 @import "tailwindcss" + @source */
    input?: string;
    /** 额外扫描目录（绝对路径或工程相对路径）；缺省扫描 dist-module/dsl 与 client 源码目录 */
    scan?: string[];
}
export interface ModulePackConfig {
    /** 模块 id（进入 globalPageId 前缀与资源路径） */
    id: string;
    name: string;
    /** 路由前缀（规范化保证以 / 开头、无尾斜杠） */
    basePath: string;
    yamlRoot: string;
    clientEntry: string;
    /** 服务端入口（工程相对路径，如 module/server.ts）；与 apiPrefixes 成对出现 */
    serverEntry?: string;
    /**
     * 模块 API 逻辑前缀（如 /api/risk-analysis）。打包时命中这些前缀的 DSL URL
     * 会改写为 /api/modules/<id>/...，由 Shell 的通用分发入口承接。
     */
    apiPrefixes?: string[];
    /** init 时自动发现的 src/pactor/*-actions.ts（仅记录，client entry 自行 import） */
    actions: string[];
    publicDir: string;
    /** target profile id（如 innospots-web-shell@2） */
    target: string;
    /**
     * 模块级访问默认值：'public' 时构建期给未声明 public/permission 的
     * pages / menus 补 public: true（缺省填充）；默认 'authenticated' 不改动。
     */
    access: {
        default: 'public' | 'authenticated';
    };
    tailwind: TailwindConfig;
    rewrite: {
        /** 绝对 API 地址重写为去 origin 的相对路径（默认 true） */
        absoluteApiToRelative: boolean;
    };
    /** 产物目录（工程相对路径，默认 dist-module） */
    outDir: string;
    /**
     * yamlRoot 下的站点地图文件名（默认 sitemap.yaml）。
     * 双模式工程可用 sitemap.module.yaml 专供模块打包，独立应用仍用全量 sitemap.yaml。
     */
    sitemap: string;
}
export declare const CONFIG_DEFAULTS: {
    readonly yamlRoot: "src/server/yaml";
    readonly clientEntry: "module/client.ts";
    readonly publicDir: "public";
    readonly target: string;
    readonly outDir: "dist-module";
    readonly sitemap: "sitemap.yaml";
};
/** 加载并校验工程根下的 pactor.module.json（或 --config 指定文件） */
export declare function loadModuleConfig(projectDir: string, configPath?: string): ModulePackConfig;
