import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
/** 递归收集 yamlRoot 下的页面 / 布局 / 片段文件 */
export function collectModuleSource(yamlRoot) {
    const pages = new Map();
    const layouts = [];
    const fragments = [];
    const warnings = [];
    const walk = (dir) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            const full = join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(full);
                continue;
            }
            if (!entry.name.endsWith('.yaml')) {
                continue;
            }
            // 站点地图变体（sitemap.yaml / sitemap.module.yaml 等）不是页面 DSL
            if (entry.name === 'sitemap.yaml' || entry.name.startsWith('sitemap.')) {
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
