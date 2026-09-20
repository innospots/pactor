/**
 * 站点级常量配置。
 */

/**
 * 顶部导航「文档」外链的单一配置点。
 * 通过 PUBLIC_DOCS_SITE_URL 环境变量覆盖，默认指向现有 docs 文档站。
 */
export const DOCS_SITE_URL: string =
  import.meta.env.PUBLIC_DOCS_SITE_URL ?? 'https://pactor-docs.workers.dev';

export const SITE_NAME = 'Pactor UI 资产库';
