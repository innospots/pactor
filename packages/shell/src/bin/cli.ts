#!/usr/bin/env node
/**
 * pactor-shell CLI：宿主构建链入口。
 *   pactor-shell assemble    装配 UI 模块 → .generated/pactor 与 public/modules
 *   pactor-shell validate    校验装配产物（失败非零退出）
 *   pactor-shell theme sync  同步 @pactor-app/theme 预置皮肤 → public/themes
 *   pactor-shell theme check 校验 public/themes 与主题包一致（CI 用）
 */
import { assembleModules } from '../assemble/assemble.js';
import { validateModules } from '../assemble/validate.js';
import { syncThemes } from '../skin/sync-themes.js';

const [command, sub] = process.argv.slice(2);

function fail(message: string): never {
  console.error(`[pactor-shell] ${message}`);
  process.exit(1);
}

try {
  if (command === 'assemble') {
    const summary = assembleModules({ rootDir: process.cwd() });
    console.log(
      `[assemble] 完成：${summary.modules} 个模块，${summary.routes} 条路由，${summary.serverApis} 个模块 API → ${summary.generatedDir}`,
    );
  } else if (command === 'validate') {
    const summary = validateModules({ rootDir: process.cwd() });
    console.log(
      `[validate] 通过：${summary.routes} 条路由，${summary.pages} 个页面，${summary.menus} 个顶层菜单，${summary.serverApis} 个模块 API`,
    );
  } else if (command === 'theme' && (sub === 'sync' || sub === 'check')) {
    const result = syncThemes({ appRoot: process.cwd(), checkOnly: sub === 'check' });
    console.log(
      `[theme-css] ${sub === 'check' ? 'verified' : 'synced'} ${result.synced} skins → public/themes`,
    );
  } else {
    fail(
      `未知命令：${[command, sub].filter(Boolean).join(' ') || '(空)'}，可用：assemble | validate | theme sync | theme check`,
    );
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
