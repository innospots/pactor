import type { DslNode } from '@pactor-app/core';

/**
 * ArtifactPanel 产物模型与纯函数助手（自 @pactor-app/chat 的 artifact 模型
 * 移植面板所需子集）：零 React，可纯 Node 测试。
 */

/** 产物：dsl kind 的 content 为 DslNode 普通对象，其余 kind 为字符串 */
export interface ChatPageArtifact {
  id: string;
  kind: 'markdown' | 'code' | 'text' | 'dsl';
  title: string;
  content: string | DslNode;
  /** code kind 的语言标记（角标 / CodeBlock 高亮） */
  language?: string;
  /**
   * 文件类型（扩展名，大小写 / 带点均可，如 'png' / '.MD'）：
   * 图片类扩展名走内建图片预览（content 为 URL / data URL，
   * svg 另支持原始标记）；自定义查看器（artifactViewers）按此键匹配。
   * 缺省从 title 的扩展名推导
   */
  fileType?: string;
  meta?: Record<string, unknown>;
}

/** 内建图片预览的扩展名（小写不带点） */
export const ARTIFACT_IMAGE_EXTENSIONS: readonly string[] = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'svg',
  'webp',
  'avif',
  'bmp',
  'ico',
];

/** 解析产物文件类型：显式 fileType 优先，缺省取 title 扩展名；均无返回 null */
export function resolveArtifactFileType(artifact: ChatPageArtifact): string | null {
  const declared = artifact.fileType?.trim().toLowerCase().replace(/^\./, '');
  if (declared) {
    return declared;
  }
  const match = /\.([A-Za-z0-9]+)$/.exec(artifact.title.trim());
  return match ? match[1]!.toLowerCase() : null;
}

/** 是否图片类产物（扩展名命中内建图片集合） */
export function isImageArtifact(artifact: ChatPageArtifact): boolean {
  const ext = resolveArtifactFileType(artifact);
  return ext !== null && ARTIFACT_IMAGE_EXTENSIONS.includes(ext);
}

/** 产物图标的扩展名分桶（小写不带点）→ ui Icon 白名单名 */
const ARTIFACT_ICON_BY_EXTENSION: Record<string, string> = {
  // 表格数据
  csv: 'table',
  tsv: 'table',
  xls: 'table',
  xlsx: 'table',
  // 数据 / 数据库
  json: 'database',
  sql: 'database',
  // 脚本
  sh: 'terminal',
  bash: 'terminal',
  zsh: 'terminal',
  // 代码 / 配置
  js: 'code',
  mjs: 'code',
  cjs: 'code',
  jsx: 'code',
  ts: 'code',
  mts: 'code',
  cts: 'code',
  tsx: 'code',
  py: 'code',
  rb: 'code',
  go: 'code',
  rs: 'code',
  java: 'code',
  kt: 'code',
  c: 'code',
  h: 'code',
  cc: 'code',
  cpp: 'code',
  cs: 'code',
  swift: 'code',
  php: 'code',
  css: 'code',
  scss: 'code',
  less: 'code',
  html: 'code',
  vue: 'code',
  svelte: 'code',
  yaml: 'code',
  yml: 'code',
  toml: 'code',
  xml: 'code',
  // 文档 / 文本
  md: 'file-text',
  markdown: 'file-text',
  mdx: 'file-text',
  txt: 'file-text',
  text: 'file-text',
  log: 'file-text',
  rst: 'file-text',
  pdf: 'file-text',
  doc: 'file-text',
  docx: 'file-text',
};

/**
 * 产物图标名：文件扩展名优先（图片类 → image，表格 / 数据 / 脚本 /
 * 代码 / 文档按扩展名分桶），无扩展名或未知扩展名时按 kind 兜底
 * （code → code、dsl → layout-grid、其余 file-text 或 file）。
 * 面板切换下拉 / 目录树共用，返回值保证在 ui Icon 白名单内。
 */
export function resolveArtifactIconName(artifact: ChatPageArtifact): string {
  const ext = resolveArtifactFileType(artifact);
  if (ext !== null) {
    if (ARTIFACT_IMAGE_EXTENSIONS.includes(ext)) {
      return 'image';
    }
    const name = ARTIFACT_ICON_BY_EXTENSION[ext];
    if (name !== undefined) {
      return name;
    }
  }
  if (artifact.kind === 'code') {
    return 'code';
  }
  if (artifact.kind === 'dsl') {
    return 'layout-grid';
  }
  return ext === null ? 'file-text' : 'file';
}

/** 产物目录树节点（buildArtifactTree 产出） */
export interface ArtifactTreeNode {
  /** 段名（目录名或产物标题） */
  name: string;
  /** 完整路径（目录为 id 前缀，文件为产物 id） */
  path: string;
  artifact?: ChatPageArtifact;
  children: ArtifactTreeNode[];
}

/**
 * 产物目录树（纯函数）：按 id 的 '/' 分段建目录层级——
 * id 形如 `reports/q3/月报` 时产出 reports → q3 两级目录；
 * 无 '/' 分段的产物平铺在根层。目录先于文件、各自按名称排序。
 */
export function buildArtifactTree(artifacts: ChatPageArtifact[]): ArtifactTreeNode[] {
  const root: ArtifactTreeNode = { name: '', path: '', children: [] };
  for (const artifact of artifacts) {
    const segments = artifact.id.split('/').filter(Boolean);
    let node = root;
    // 末段是文件本身，前面的段是目录
    for (let i = 0; i < segments.length - 1; i++) {
      const path = segments.slice(0, i + 1).join('/');
      let child = node.children.find(
        (item) => item.path === path && item.artifact === undefined,
      );
      if (!child) {
        child = { name: segments[i]!, path, children: [] };
        node.children.push(child);
      }
      node = child;
    }
    node.children.push({
      name: artifact.title,
      path: artifact.id,
      artifact,
      children: [],
    });
  }
  const sortLevel = (nodes: ArtifactTreeNode[]): void => {
    nodes.sort((a, b) => {
      const dirDelta = Number(b.artifact === undefined) - Number(a.artifact === undefined);
      return dirDelta !== 0 ? dirDelta : a.name.localeCompare(b.name);
    });
    for (const item of nodes) {
      sortLevel(item.children);
    }
  };
  sortLevel(root.children);
  return root.children;
}
