/**
 * 媒体与内容分类组件（11 个）。
 * 来源：product-design/ui/component-design.md §3.8 媒体与内容（§11 首版验收矩阵：媒体与内容 = 11）。
 * 命名口径：Image 属数据展示（基础展示），ImageViewer 属媒体分类（放大、缩放、切换查看）。
 * tokenRefs 本期全部留空：待样式 Token 接入后回填。
 */
import type { ComponentEntry } from '../types.ts';

export const mediaComponents: ComponentEntry[] = [
  { id: 'component.image-viewer', name: 'ImageViewer', category: 'media', purpose: '放大、缩放和切换单张图片', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：图片查看器。' },
  { id: 'component.gallery', name: 'Gallery', category: 'media', purpose: '浏览多张图片或媒体资源', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：画廊。' },
  { id: 'component.video', name: 'Video', category: 'media', purpose: '播放视频内容', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：视频播放。' },
  { id: 'component.audio', name: 'Audio', category: 'media', purpose: '播放音频内容', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：音频播放。' },
  { id: 'component.file-preview', name: 'FilePreview', category: 'media', purpose: '预览常见文件及其元信息', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：文件预览。' },
  { id: 'component.document-preview', name: 'DocumentPreview', category: 'media', purpose: '阅读分页文档', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：文档预览。' },
  { id: 'component.rich-text', name: 'RichText', category: 'media', purpose: '渲染富文本内容', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：富文本。' },
  { id: 'component.markdown', name: 'Markdown', category: 'media', purpose: '渲染 Markdown 内容', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：Markdown 渲染。' },
  { id: 'component.code-block', name: 'CodeBlock', category: 'media', purpose: '展示带语法高亮的代码', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：代码块。' },
  { id: 'component.diff-viewer', name: 'DiffViewer', category: 'media', purpose: '比较文本或代码差异', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：差异对比。' },
  { id: 'component.json-viewer', name: 'JSONViewer', category: 'media', purpose: '折叠、检查和复制结构化数据', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：JSON 查看器。' },
];
