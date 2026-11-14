import type { TailwindConfig } from './config.js';
/**
 * 可选 Tailwind 预编译（配置 `tailwind: { enabled, input?, scan? }`）：
 * 调用目标工程的 tailwindcss CLI（npx --no-install tailwindcss，v4 / @tailwindcss/cli），
 * 扫描 dist-module/dsl 与 client 源码生成工具类 CSS，合并进 client/index.css。
 * tailwind 不可用或编译失败时降级为 warning，不 fail 构建。
 */
export interface CompileTailwindOptions {
    projectDir: string;
    tailwind: TailwindConfig;
    /** 默认扫描目录（dist-module/dsl 产物目录 + client entry 源码目录） */
    scanDirs: string[];
    /** 目标 CSS 文件（client/index.css，不存在则创建） */
    cssFile: string;
}
export interface CompileTailwindResult {
    compiled: boolean;
    warnings: string[];
}
/** 执行 Tailwind 预编译并把工具类 CSS 追加到 cssFile */
export declare function compileTailwind(options: CompileTailwindOptions): CompileTailwindResult;
