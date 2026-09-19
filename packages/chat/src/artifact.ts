import type { DslNode } from '@pactor-app/core';

/**
 * 产出物模型与 ArtifactStore（spec: chat-artifact-panel，设计决策 D1）。
 *
 * 零 React，可纯 Node 测试；状态语义与 ConversationStore 同模式
 * （不可变更新 + subscribe 通知，兼容 useSyncExternalStore）。
 * store 持会话内全部产出物列表 + 当前激活项：open 按 id upsert 并
 * 激活；面板 tabs / 目录列表视图经 list() 读取；close 只关闭面板
 * （清空激活项），列表保留供重开时继续切换。
 */

/** 产出物：dsl kind 的 content 为 DslNode 普通对象，其余 kind 为字符串 */
export interface ChatArtifact {
  id: string;
  kind: 'markdown' | 'code' | 'text' | 'dsl';
  title: string;
  content: string | DslNode;
  /** code kind 的语言标记（仅作角标展示） */
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
export function resolveArtifactFileType(artifact: ChatArtifact): string | null {
  const declared = artifact.fileType?.trim().toLowerCase().replace(/^\./, '');
  if (declared) {
    return declared;
  }
  const match = /\.([A-Za-z0-9]+)$/.exec(artifact.title.trim());
  return match ? match[1]!.toLowerCase() : null;
}

/** 是否图片类产物（扩展名命中内建图片集合） */
export function isImageArtifact(artifact: ChatArtifact): boolean {
  const ext = resolveArtifactFileType(artifact);
  return ext !== null && ARTIFACT_IMAGE_EXTENSIONS.includes(ext);
}

/** 产物图标的着色档位（卡片图标底色 / 前景色按 tone 取色） */
export type ArtifactIconTone = 'green' | 'blue' | 'amber' | 'violet' | 'slate';

/** 产物图标规格：ui Icon 白名单名 + 着色档位 */
export interface ArtifactIconSpec {
  name: string;
  tone: ArtifactIconTone;
}

/** 产物图标的扩展名分桶（小写不带点）→ 图标名 + 着色档位 */
const ARTIFACT_ICON_BY_EXTENSION: Record<string, ArtifactIconSpec> = {
  // 表格数据（绿）
  csv: { name: 'table', tone: 'green' },
  tsv: { name: 'table', tone: 'green' },
  xls: { name: 'table', tone: 'green' },
  xlsx: { name: 'table', tone: 'green' },
  // 数据 / 数据库（琥珀）
  json: { name: 'database', tone: 'amber' },
  sql: { name: 'database', tone: 'amber' },
  // 脚本（蓝，终端图标）
  sh: { name: 'terminal', tone: 'blue' },
  bash: { name: 'terminal', tone: 'blue' },
  zsh: { name: 'terminal', tone: 'blue' },
  // 代码 / 配置（蓝）
  js: { name: 'code', tone: 'blue' },
  mjs: { name: 'code', tone: 'blue' },
  cjs: { name: 'code', tone: 'blue' },
  jsx: { name: 'code', tone: 'blue' },
  ts: { name: 'code', tone: 'blue' },
  mts: { name: 'code', tone: 'blue' },
  cts: { name: 'code', tone: 'blue' },
  tsx: { name: 'code', tone: 'blue' },
  py: { name: 'code', tone: 'blue' },
  rb: { name: 'code', tone: 'blue' },
  go: { name: 'code', tone: 'blue' },
  rs: { name: 'code', tone: 'blue' },
  java: { name: 'code', tone: 'blue' },
  kt: { name: 'code', tone: 'blue' },
  c: { name: 'code', tone: 'blue' },
  h: { name: 'code', tone: 'blue' },
  cc: { name: 'code', tone: 'blue' },
  cpp: { name: 'code', tone: 'blue' },
  cs: { name: 'code', tone: 'blue' },
  swift: { name: 'code', tone: 'blue' },
  php: { name: 'code', tone: 'blue' },
  css: { name: 'code', tone: 'blue' },
  scss: { name: 'code', tone: 'blue' },
  less: { name: 'code', tone: 'blue' },
  html: { name: 'code', tone: 'blue' },
  vue: { name: 'code', tone: 'blue' },
  svelte: { name: 'code', tone: 'blue' },
  yaml: { name: 'code', tone: 'blue' },
  yml: { name: 'code', tone: 'blue' },
  toml: { name: 'code', tone: 'blue' },
  xml: { name: 'code', tone: 'blue' },
  // 文档 / 文本（石板灰）
  md: { name: 'file-text', tone: 'slate' },
  markdown: { name: 'file-text', tone: 'slate' },
  mdx: { name: 'file-text', tone: 'slate' },
  txt: { name: 'file-text', tone: 'slate' },
  text: { name: 'file-text', tone: 'slate' },
  log: { name: 'file-text', tone: 'slate' },
  rst: { name: 'file-text', tone: 'slate' },
  pdf: { name: 'file-text', tone: 'slate' },
  doc: { name: 'file-text', tone: 'slate' },
  docx: { name: 'file-text', tone: 'slate' },
};

/**
 * 产物图标（图标名 + 着色档位）：文件扩展名优先（图片类 → image/violet，
 * 表格 / 数据 / 脚本 / 代码 / 文档按扩展名分桶），无扩展名或未知扩展名
 * 时按 kind 兜底（code → code/blue、dsl → layout-grid/slate、其余
 * file-text 或 file，均 slate）。卡片 / 面板下拉 / 目录树共用，
 * 保证同一产物在各处图标一致。
 */
export function resolveArtifactIcon(artifact: ChatArtifact): ArtifactIconSpec {
  const ext = resolveArtifactFileType(artifact);
  if (ext !== null) {
    if (ARTIFACT_IMAGE_EXTENSIONS.includes(ext)) {
      return { name: 'image', tone: 'violet' };
    }
    const spec = ARTIFACT_ICON_BY_EXTENSION[ext];
    if (spec !== undefined) {
      return spec;
    }
  }
  if (artifact.kind === 'code') {
    return { name: 'code', tone: 'blue' };
  }
  if (artifact.kind === 'dsl') {
    return { name: 'layout-grid', tone: 'slate' };
  }
  return ext === null
    ? { name: 'file-text', tone: 'slate' }
    : { name: 'file', tone: 'slate' };
}

/** 产物图标名（resolveArtifactIcon 的 name 部分，面板下拉 / 目录树用） */
export function resolveArtifactIconName(artifact: ChatArtifact): string {
  return resolveArtifactIcon(artifact).name;
}

/** 产物尺寸展示（meta.size 字节数 → "512 B / 3.5 KB / 12.0 MB"；非法输入返回 null） */
export function formatArtifactSize(size: unknown): string | null {
  if (typeof size !== 'number' || !Number.isFinite(size) || size < 0) {
    return null;
  }
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

/** update 的补丁：id 不可改 */
export type ArtifactPatch = Partial<Omit<ChatArtifact, 'id'>>;

/** 消息形态的最小契约（与 model.ts ChatMessage 结构化兼容，保持本文件零依赖） */
interface ArtifactPartCarrier {
  parts: Array<{
    type: string;
    artifact?: ChatArtifact;
    status?: string;
  }>;
}

/**
 * 从会话消息流归集产出物（tabs / 目录列表视图的默认数据源）：
 * 按消息序遍历 artifact part，同 id 后者覆盖（流式更新取最新），
 * 顺序保持首次出现序；streaming 中的 part 跳过（就绪后再入列）。
 * 纯函数，输入消息数组引用不变时结果可经 useMemo 缓存。
 */
export function collectArtifacts(
  messages: readonly ArtifactPartCarrier[],
): ChatArtifact[] {
  const order: string[] = [];
  const byId = new Map<string, ChatArtifact>();
  for (const message of messages) {
    for (const part of message.parts) {
      if (part.type !== 'artifact' || !part.artifact) {
        continue;
      }
      if (part.status !== undefined && part.status !== 'ready') {
        continue;
      }
      if (!byId.has(part.artifact.id)) {
        order.push(part.artifact.id);
      }
      byId.set(part.artifact.id, part.artifact);
    }
  }
  return order.map((id) => byId.get(id)!);
}

/**
 * 合并消息流归集与 store 打开记录：stream 顺序为主，冲突 id 取
 * store 版本（store.update 的流式补丁可能领先消息 part），
 * store 中未入流的产物（宿主直接 open 的）追加在后。
 */
export function mergeArtifacts(
  stream: readonly ChatArtifact[],
  opened: readonly ChatArtifact[],
): ChatArtifact[] {
  const openedById = new Map(opened.map((item) => [item.id, item]));
  const merged = stream.map((item) => openedById.get(item.id) ?? item);
  for (const item of opened) {
    if (!stream.some((s) => s.id === item.id)) {
      merged.push(item);
    }
  }
  return merged;
}

/**
 * ArtifactStore（设计决策 D1）：产出物列表的可变容器。
 * 可注入（services.artifactStore）或由组合层自持（ref 保持）。
 * 对未 open 状态下的 update 宽容：console.warn 并忽略，不抛错。
 * list() 返回的内部数组不可变、引用在不变时保持稳定
 * （useSyncExternalStore 快照安全）。
 */
export class ArtifactStore {
  private artifacts: ChatArtifact[] = [];
  private activeId: string | null = null;
  private readonly listeners = new Set<() => void>();

  /** 当前激活产出物（未打开时为 null；引用在不变时保持稳定） */
  get(): ChatArtifact | null {
    if (this.activeId === null) {
      return null;
    }
    return this.artifacts.find((item) => item.id === this.activeId) ?? null;
  }

  /** 全部产出物（插入序；数组不可变，引用稳定） */
  list(): ChatArtifact[] {
    return this.artifacts;
  }

  /** 打开（或按 id 替换）产出物并激活 */
  open(artifact: ChatArtifact): void {
    const index = this.artifacts.findIndex((item) => item.id === artifact.id);
    this.artifacts =
      index === -1
        ? [...this.artifacts, artifact]
        : this.artifacts.map((item, i) => (i === index ? artifact : item));
    this.activeId = artifact.id;
    this.notify();
  }

  /** 切换激活项（未知 id 告警并忽略，不抛错） */
  activate(id: string): void {
    if (this.activeId === id) {
      return;
    }
    if (!this.artifacts.some((item) => item.id === id)) {
      console.warn('[@pactor-app/chat] unknown artifact id, activate ignored');
      return;
    }
    this.activeId = id;
    this.notify();
  }

  /** 部分更新当前激活产出物（id 不可改）；未 open 时告警并忽略 */
  update(patch: ArtifactPatch): void {
    const current = this.get();
    if (!current) {
      console.warn('[@pactor-app/chat] artifact not open, update ignored');
      return;
    }
    const next = { ...current, ...patch, id: current.id };
    this.artifacts = this.artifacts.map((item) =>
      item.id === current.id ? next : item,
    );
    this.notify();
  }

  /** 关闭面板：清空激活项，列表保留（未打开时幂等，不重复通知） */
  close(): void {
    if (this.activeId === null) {
      return;
    }
    this.activeId = null;
    this.notify();
  }

  /** 订阅变更；返回退订函数 */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
