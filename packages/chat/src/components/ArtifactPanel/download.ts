import { isImageArtifact, resolveArtifactFileType } from './artifact.js';
import type { ChatPageArtifact } from './artifact.js';

/**
 * 产物下载（自 @pactor-app/chat 的 artifact-download 移植）：
 * 面板标题栏下载钮把当前激活产物保存为本地文件。
 * 纯函数部分（文件名 / Blob 构建）可纯 Node 测试；
 * saveBlob / downloadArtifact 的 DOM 副作用在 jsdom 下可桩。
 */

/** kind 的缺省扩展名（title 无扩展名时兜底） */
const KIND_EXTENSIONS: Record<ChatPageArtifact['kind'], string> = {
  markdown: 'md',
  text: 'txt',
  code: 'txt',
  dsl: 'json',
};

/** 下载文件名：title 已带扩展名原样使用；否则补 fileType / kind 缺省扩展名 */
export function resolveArtifactFilename(artifact: ChatPageArtifact): string {
  const title = artifact.title.trim() || 'artifact';
  if (/\.[A-Za-z0-9]+$/.test(title)) {
    return title;
  }
  const ext = resolveArtifactFileType(artifact) ?? KIND_EXTENSIONS[artifact.kind];
  return `${title}.${ext}`;
}

/** data URL → Blob（图片 data URL 内容本地下载） */
function dataUrlToBlob(dataUrl: string): Blob {
  const comma = dataUrl.indexOf(',');
  const meta = dataUrl.slice(0, comma);
  const payload = dataUrl.slice(comma + 1);
  const mime = /^data:([^;,]+)/.exec(meta)?.[1] ?? 'application/octet-stream';
  if (meta.includes(';base64')) {
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
  }
  return new Blob([decodeURIComponent(payload)], { type: mime });
}

/** 内容是否 http(s) URL（图片 URL 需 fetch 取回） */
function isRemoteUrl(raw: string): boolean {
  return /^https?:\/\//.test(raw.trim());
}

/**
 * 构建下载 Blob；图片内容为 http(s) URL 时返回 null（由 downloadArtifact
 * 走 fetch 取回，失败降级新标签打开）
 */
export function buildArtifactBlob(artifact: ChatPageArtifact): Blob | null {
  if (artifact.kind === 'dsl' && typeof artifact.content === 'object') {
    return new Blob([JSON.stringify(artifact.content, null, 2)], {
      type: 'application/json',
    });
  }
  const raw = String(artifact.content);
  if (isImageArtifact(artifact)) {
    const trimmed = raw.trim();
    if (trimmed.startsWith('data:')) {
      return dataUrlToBlob(trimmed);
    }
    if (trimmed.startsWith('<svg') || trimmed.startsWith('<?xml')) {
      return new Blob([raw], { type: 'image/svg+xml' });
    }
    if (isRemoteUrl(trimmed)) {
      return null;
    }
  }
  const ext = resolveArtifactFileType(artifact);
  const mime = ext === 'md' || artifact.kind === 'markdown'
    ? 'text/markdown'
    : 'text/plain';
  return new Blob([raw], { type: `${mime};charset=utf-8` });
}

/** 触发浏览器下载（Object URL + 临时锚点） */
export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * 下载产物：文本类 / dsl JSON / 图片 data URL 与 svg 标记直接存 Blob；
 * 图片 http(s) URL fetch 取回（跨域失败降级新标签打开）
 */
export async function downloadArtifact(artifact: ChatPageArtifact): Promise<void> {
  const filename = resolveArtifactFilename(artifact);
  const raw = String(artifact.content ?? '').trim();
  if (isImageArtifact(artifact) && isRemoteUrl(raw)) {
    try {
      const response = await fetch(raw);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      saveBlob(await response.blob(), filename);
      return;
    } catch {
      window.open(raw, '_blank', 'noopener');
      return;
    }
  }
  const blob = buildArtifactBlob(artifact);
  if (blob) {
    saveBlob(blob, filename);
  }
}
