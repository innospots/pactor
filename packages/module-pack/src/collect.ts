import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

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
export function collectModuleSource(yamlRoot: string): CollectedSource {
  const pages = new Map<string, string>();
  const layouts: string[] = [];
  const fragments: string[] = [];
  const warnings: string[] = [];

  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith('.yaml') || entry.name === 'sitemap.yaml') {
        continue;
      }
      const rel = relative(yamlRoot, full);
      if (entry.name.endsWith('.layout.yaml')) {
        layouts.push(rel);
        continue;
      }
      if (entry.name.endsWith('.fragment.yaml')) {
        fragments.push(rel);
        continue;
      }
      let id = entry.name.slice(0, -'.yaml'.length);
      if (id.endsWith('.page')) {
        id = id.slice(0, -'.page'.length);
      }
      if (pages.has(id)) {
        warnings.push(`页面 id 重复: ${id}（${rel} 覆盖 ${pages.get(id)}）`);
      }
      pages.set(id, rel);
    }
  };

  walk(yamlRoot);
  layouts.sort();
  fragments.sort();
  return { yamlRoot, pages, layouts, fragments, warnings };
}
