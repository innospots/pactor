import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../Icon/index.js';

/** 文件类别（缺省按 fileType / name 扩展名推断） */
export type FilePreviewKind = 'image' | 'text' | 'video' | 'audio' | 'other';

export interface FilePreviewProps {
  /** 文件名（含扩展名，用于类型推断与展示） */
  name?: string;
  /** 文件大小（字节，展示前格式化为 KB/MB） */
  fileSize?: number;
  /** MIME 或扩展名（如 image/png、.md），用于类型推断 */
  fileType?: string;
  /** 文件地址：图片 / 视频 / 音频的内嵌预览与下载链接均使用 */
  src?: string;
  /** 文本文件内容（kind=text 时内嵌展示） */
  content?: string;
  /** 显式指定类别（覆盖推断） */
  kind?: FilePreviewKind;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const kindIcon: Record<FilePreviewKind, string> = {
  image: 'image',
  text: 'file-text',
  video: 'video',
  audio: 'music',
  other: 'file',
};

/** 按 MIME / 扩展名推断类别 */
export function inferKind(name?: string, fileType?: string): FilePreviewKind {
  const probe = `${fileType ?? ''} ${name ?? ''}`.toLowerCase();
  if (/(^|[ /])image|\.(png|jpe?g|gif|webp|svg|bmp|avif)\b/.test(probe)) return 'image';
  if (/(^|[ /])video|\.(mp4|webm|mov|mkv|avi)\b/.test(probe)) return 'video';
  if (/(^|[ /])audio|\.(mp3|wav|ogg|flac|m4a|aac)\b/.test(probe)) return 'audio';
  if (/(^|[ /])(text|json|javascript|yaml)|\.(txt|md|json|ya?ml|tsx?|jsx?|css|html?|log|csv)\b/.test(probe)) return 'text';
  return 'other';
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * FilePreview 适配器（shadcn kit）：常见文件内嵌预览 + 元信息卡片。
 * image / video / audio 经 src 内嵌渲染，text 展示 content 文本，
 * 其余类型展示图标 + 元信息；提供 src 时渲染下载链接。
 */
export function FilePreview({
  name,
  fileSize,
  fileType,
  src,
  content,
  kind,
  className,
  style,
}: FilePreviewProps) {
  const resolvedKind = kind ?? inferKind(name, fileType);

  return (
    <div
      data-slot="file-preview"
      data-kind={resolvedKind}
      className={cn('w-full overflow-hidden rounded-md border border-border', className)}
      style={style}
    >
      <div data-slot="file-preview-body" className="bg-muted">
        {resolvedKind === 'image' && src ? (
          <img src={src} alt={name ?? ''} className="max-h-72 w-full object-contain" />
        ) : null}
        {resolvedKind === 'video' && src ? (
          <video src={src} controls playsInline className="max-h-72 w-full" />
        ) : null}
        {resolvedKind === 'audio' && src ? (
          <div className="p-3">
            <audio src={src} controls className="w-full" />
          </div>
        ) : null}
        {resolvedKind === 'text' ? (
          <pre className="max-h-72 overflow-auto p-3 text-xs whitespace-pre-wrap">{content ?? ''}</pre>
        ) : null}
        {resolvedKind === 'other' || (resolvedKind !== 'text' && !src) ? (
          <div className="flex items-center justify-center p-6 text-muted-foreground">
            <Icon name={kindIcon[resolvedKind]} size="lg" />
          </div>
        ) : null}
      </div>
      <div data-slot="file-preview-meta" className="flex items-center gap-2 px-3 py-2 text-sm">
        <Icon name={kindIcon[resolvedKind]} size="sm" />
        <span className="min-w-0 flex-1 truncate font-medium">{name ?? '未命名文件'}</span>
        {fileSize !== undefined ? (
          <span className="shrink-0 text-xs text-muted-foreground">{formatSize(fileSize)}</span>
        ) : null}
        {fileType ? (
          <span className="shrink-0 text-xs text-muted-foreground">{fileType}</span>
        ) : null}
        {src ? (
          <a
            data-slot="file-preview-download"
            href={src}
            download={name ?? true}
            className="shrink-0 text-primary hover:underline"
            aria-label="下载"
          >
            <Icon name="download" size="sm" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
