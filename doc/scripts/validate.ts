/**
 * 资产数据构建期校验（零依赖：node: 内置模块 + ../src/assets-data）。
 *
 * 直接执行：node --experimental-strip-types scripts/validate.ts
 *
 * 规则：
 *  1. ID 全局唯一
 *  2. ID 命名规范：DesignToken 为点分层路径（至少两段）；
 *     组件 component.<name>；模板 template.<name>；素材 material.<name>；
 *     色系 family.<familyId>；主题 theme.<familyId>.<name>，且 ID 第二段
 *     必须与其 familyId 一致
 *  3. 跨文件引用可达：ComponentEntry.tokenRefs → Token id；
 *     TemplateEntry.componentRefs → 组件 id；ThemeEntry.familyId → 色系 id；
 *     任何条目的 replacedBy → 现存条目 id
 *  4. maturity === 'deprecated' 必须有有效 replacedBy
 *  5. 带 url 的外链条目必须有 availability；availability === 'broken' 仅警告
 *  6. 统计各类数量
 */
import { pathToFileURL } from 'node:url';

import { components } from '../src/assets-data/components/index.ts';
import { materials } from '../src/assets-data/materials/index.ts';
import { templates } from '../src/assets-data/templates/index.ts';
import { themeFamilies, themes } from '../src/assets-data/themes/index.ts';
import { tokens } from '../src/assets-data/tokens/index.ts';
import { THEME_FAMILY_IDS } from '../src/assets-data/types.ts';

export interface ValidationResult {
  errors: string[];
  warnings: string[];
  stats: Record<string, number>;
}

/** 数据模块名（错误定位与统计用） */
type AssetModule =
  | 'tokens'
  | 'components'
  | 'themeFamilies'
  | 'themes'
  | 'templates'
  | 'materials';

interface CollectedEntry {
  module: AssetModule;
  id: string;
  entry: Record<string, unknown>;
}

const ID_SEGMENT = /^[a-z0-9][a-z0-9-]*$/;
const LINK_AVAILABILITIES: readonly string[] = [
  'available',
  'needs-review',
  'restricted',
  'broken',
];

/** 点分层路径：至少 minSegments 段，每段为小写字母 / 数字 / 连字符 */
function isDotPath(id: string, minSegments: number): boolean {
  const segments = id.split('.');
  return (
    segments.length >= minSegments && segments.every((s) => ID_SEGMENT.test(s))
  );
}

/** 前缀 + 单段 slug：如 component.button、family.zhusha */
function isPrefixedSlug(id: string, prefix: string): boolean {
  if (!id.startsWith(`${prefix}.`)) return false;
  const rest = id.slice(prefix.length + 1);
  return rest.length > 0 && !rest.includes('.') && ID_SEGMENT.test(rest);
}

function toCollected(module: AssetModule, entry: { id: string }): CollectedEntry {
  return {
    module,
    id: entry.id,
    entry: entry as unknown as Record<string, unknown>,
  };
}

/** 规则 2：按模块校验 ID 命名规范 */
function checkIdFormat(
  { module, id, entry }: CollectedEntry,
  errors: string[],
): void {
  const bad = (expectation: string) =>
    errors.push(`[${module}] ID "${id}" 不符合规范：${expectation}`);
  switch (module) {
    case 'tokens':
      if (!isDotPath(id, 2)) {
        bad('应为至少两段的点分层路径（如 color.brand.500）');
      }
      break;
    case 'components':
      if (!isPrefixedSlug(id, 'component')) bad('应为 component.<name>');
      break;
    case 'templates':
      if (!isPrefixedSlug(id, 'template')) bad('应为 template.<name>');
      break;
    case 'materials':
      if (!isPrefixedSlug(id, 'material')) bad('应为 material.<name>');
      break;
    case 'themeFamilies': {
      if (!isPrefixedSlug(id, 'family')) {
        bad('应为 family.<色系>');
        break;
      }
      const slug = id.slice('family.'.length);
      if (!(THEME_FAMILY_IDS as readonly string[]).includes(slug)) {
        errors.push(
          `[${module}] 色系 ID "${id}" 的色系段 "${slug}" 不在 16 个色系定义内`,
        );
      }
      break;
    }
    case 'themes': {
      if (!id.startsWith('theme.') || !isDotPath(id, 3)) {
        bad('应为 theme.<familyId>.<name>（至少三段）');
        break;
      }
      const familySegment = id.split('.')[1];
      if (!(THEME_FAMILY_IDS as readonly string[]).includes(familySegment)) {
        errors.push(
          `[${module}] 主题 ID "${id}" 的色系段 "${familySegment}" 不在 16 个色系定义内`,
        );
      }
      const familyId = entry.familyId;
      if (typeof familyId !== 'string' || familyId.length === 0) {
        errors.push(`[${module}] 主题 "${id}" 缺少 familyId`);
      } else if (familySegment !== familyId) {
        errors.push(
          `[${module}] 主题 "${id}" 的 ID 色系段 "${familySegment}" 与 familyId "${familyId}" 不一致`,
        );
      }
      break;
    }
  }
}

export function validate(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // ===== 收集全部条目 =====
  const collected: CollectedEntry[] = [
    ...tokens.map((e) => toCollected('tokens', e)),
    ...components.map((e) => toCollected('components', e)),
    ...themeFamilies.map((e) => toCollected('themeFamilies', e)),
    ...themes.map((e) => toCollected('themes', e)),
    ...templates.map((e) => toCollected('templates', e)),
    ...materials.map((e) => toCollected('materials', e)),
  ];

  const idIndex = new Map<string, AssetModule>();
  const tokenIds = new Set(tokens.map((e) => e.id));
  const componentIds = new Set(components.map((e) => e.id));
  const familyIds = new Set(themeFamilies.map((e) => e.id));

  // ===== 规则 1 + 2：ID 全局唯一、命名规范 =====
  for (const item of collected) {
    if (idIndex.has(item.id)) {
      errors.push(
        `ID 重复："${item.id}"（${idIndex.get(item.id)} 与 ${item.module}）`,
      );
    } else {
      idIndex.set(item.id, item.module);
    }
    checkIdFormat(item, errors);
  }

  const allIds = new Set(idIndex.keys());

  // ===== 规则 3：跨文件引用可达 =====
  const checkRef = (
    owner: string,
    field: string,
    ref: unknown,
    target: Set<string>,
    label: string,
  ) => {
    if (typeof ref !== 'string' || ref.length === 0) {
      errors.push(`${owner} 的 ${field} 存在空或非字符串引用`);
      return;
    }
    if (!target.has(ref)) {
      errors.push(`${owner} 的 ${field} 引用了不存在的${label}："${ref}"`);
    }
  };

  for (const c of components) {
    for (const ref of c.tokenRefs ?? []) {
      checkRef(`组件 ${c.id}`, 'tokenRefs', ref, tokenIds, 'Token');
    }
  }
  for (const t of templates) {
    for (const ref of t.componentRefs ?? []) {
      checkRef(`模板 ${t.id}`, 'componentRefs', ref, componentIds, '组件');
    }
  }
  for (const t of themes) {
    const familyRef = `family.${t.familyId}`;
    if (!familyIds.has(familyRef)) {
      errors.push(
        `主题 ${t.id} 的 familyId 引用了不存在的色系："${familyRef}"`,
      );
    }
  }

  // ===== 规则 3（replacedBy）+ 4 + 5：逐条通用检查 =====
  for (const { id, entry } of collected) {
    const replacedBy = entry.replacedBy;
    if (replacedBy !== undefined) {
      checkRef(`条目 ${id}`, 'replacedBy', replacedBy, allIds, '条目');
    }

    // 规则 4：废弃条目必须有有效 replacedBy
    if (
      entry.maturity === 'deprecated' &&
      (typeof replacedBy !== 'string' || replacedBy.length === 0)
    ) {
      errors.push(`废弃条目 ${id} 缺少有效 replacedBy`);
    }

    // 规则 5：外链条目必须有 availability；broken 仅警告
    const url = entry.url;
    if (typeof url === 'string' && url.length > 0) {
      const availability = entry.availability;
      if (!LINK_AVAILABILITIES.includes(availability as string)) {
        errors.push(`外链条目 ${id} 缺少有效 availability（url: ${url}）`);
      } else if (availability === 'broken') {
        warnings.push(`外链失效（availability: broken）：${id}（${url}）`);
      }
    }
  }

  // ===== 规则 6：统计 =====
  const stats: Record<string, number> = {
    tokens: tokens.length,
    components: components.length,
    themeFamilies: themeFamilies.length,
    themes: themes.length,
    templates: templates.length,
    materials: materials.length,
    total: collected.length,
  };

  return { errors, warnings, stats };
}

function main(): void {
  const { errors, warnings, stats } = validate();

  console.log('资产数据校验统计：');
  for (const [key, value] of Object.entries(stats)) {
    console.log(`  ${key}: ${value}`);
  }
  for (const w of warnings) console.warn(`  ⚠ ${w}`);
  if (errors.length > 0) {
    console.error(`校验失败（${errors.length} 个错误）：`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  }
  console.log('校验通过');
}

const entryPath = process.argv[1];
if (entryPath && import.meta.url === pathToFileURL(entryPath).href) {
  main();
}
