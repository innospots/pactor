import { parseDocument } from 'yaml';
import type { Plugin } from 'vite';
import { validatePageDsl } from 'pactor-schema';
import type { FragmentDsl, PageDsl } from 'pactor-core';

/**
 * pactor-vite-plugin：把 `.page.yaml` / `.fragment.yaml` DSL 文件
 * 在构建期转换为 JS 模块（设计文档第 34、85 节）。
 */

/** 默认匹配约定：仅 `.page.` / `.fragment.` 后缀的 YAML 文件，避免误伤普通 yaml 配置 */
const DEFAULT_INCLUDE = /\.(page|fragment)\.(yaml|yml)$/;

/** fragment 文件名识别（自定义 include 时仍按此约定区分 page / fragment） */
const FRAGMENT_RE = /\.fragment\.(yaml|yml)$/;

/** 插件选项 */
export interface PactorPluginOptions {
  /**
   * 自定义匹配规则（覆盖默认的 `.page./.fragment.` 后缀约定）。
   * 自定义规则下文件名含 `.fragment.` 的按 FragmentDsl 处理，其余按 PageDsl 处理。
   */
  include?: RegExp | RegExp[];
  /** 是否执行 Schema 校验（默认 true；false 时仅编译不校验） */
  validate?: boolean;
}

/** 归一化 include 选项为正则数组 */
function toIncludeList(include: RegExp | RegExp[] | undefined): RegExp[] {
  if (include === undefined) return [DEFAULT_INCLUDE];
  return Array.isArray(include) ? include : [include];
}

/**
 * 创建 Pactor Vite 插件。
 *
 * 转换管线：YAML 解析（语法错误带位置）→ page 走 `validatePageDsl` 完整校验 /
 * fragment 宽松检查（存在 `dsl` 与 `body`）→ 输出
 * `export default <DSL 对象>` 与 `export const dslVersion`。
 */
export function pactor(options: PactorPluginOptions = {}): Plugin {
  const includeList = toIncludeList(options.include);
  const shouldValidate = options.validate !== false;

  const matches = (id: string): boolean => includeList.some((re) => re.test(id));

  return {
    name: 'pactor',
    enforce: 'pre',

    transform(code, id) {
      if (!matches(id)) return null;

      // 1. YAML 解析：语法错误带行列位置
      const doc = parseDocument(code);
      if (doc.errors.length > 0) {
        const details = doc.errors
          .map((error) => {
            const pos = error.linePos?.[0];
            const where = pos ? `行 ${pos.line} 列 ${pos.col}` : '未知位置';
            return `${where}: ${error.message}`;
          })
          .join('\n  ');
        this.error(`[pactor] YAML 语法错误 ${id}:\n  ${details}`);
      }

      const data = doc.toJS() as unknown;
      const isFragment = FRAGMENT_RE.test(id);

      // 2. 校验
      if (isFragment) {
        if (shouldValidate) {
          const fragment = data as Partial<FragmentDsl> | null;
          if (
            fragment === null ||
            typeof fragment !== 'object' ||
            fragment.dsl === undefined ||
            fragment.body === undefined
          ) {
            this.error(
              `[pactor] Fragment DSL 结构不完整 ${id}:\n  /: 必须存在 dsl 与 body 字段 (required)`,
            );
          }
        }
        // 3. 输出 JS 模块
        const json = JSON.stringify(data);
        return {
          code: `const fragment = ${json};\nexport const dslVersion = fragment.dsl;\nexport default fragment;\n`,
          map: null,
        };
      }

      if (shouldValidate) {
        const result = validatePageDsl(data);
        if (!result.valid) {
          const details = result.errors
            .map((error) => `${error.path}: ${error.message} (${error.keyword})`)
            .join('\n  ');
          this.error(`[pactor] Page DSL 校验失败 ${id}:\n  ${details}`);
        }
      }

      const json = JSON.stringify(data as PageDsl);
      return {
        code: `const page = ${json};\nexport const dslVersion = page.dsl;\nexport default page;\n`,
        map: null,
      };
    },

    handleHotUpdate({ file, server, modules }) {
      if (!matches(file)) return undefined;
      // 有模块记录：交给依赖图热更新；无模块记录（未被 import）：全量刷新
      if (modules.length > 0) return modules;
      server.ws.send({ type: 'full-reload' });
      return [];
    },
  };
}

export default pactor;
