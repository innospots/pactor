/**
 * 从 yamlRoot 收集模块源文件清单（与 PoC collectPages 语义一致）：
 * - 页面：递归 `*.yaml`，排除 sitemap.yaml / *.layout.yaml / *.fragment.yaml；
 *   页面 id 为文件名去掉 `.yaml`，再去掉可选的 `.page` 后缀；
 * - 布局文件：*.layout.yaml；片段文件：*.fragment.yaml（仅登记，内容由 $include 引用）。
 */
export interface CollectedSource {
    yamlRoot: string;
    /** pageId -> yamlRoot 相对路径 */
    pages: Map<string, string>;
    /** *.layout.yaml 的 yamlRoot 相对路径列表 */
    layouts: string[];
    /** *.fragment.yaml 的 yamlRoot 相对路径列表 */
    fragments: string[];
    /** 收集期警告（如页面 id 重复） */
    warnings: string[];
}
/** 递归收集 yamlRoot 下的页面 / 布局 / 片段文件 */
export declare function collectModuleSource(yamlRoot: string): CollectedSource;
