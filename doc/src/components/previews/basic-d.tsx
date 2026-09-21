/**
 * 组件运行态预览注册表（媒体与内容批）：ImageViewer / Gallery / Video /
 * Audio / FilePreview / DocumentPreview / RichText / Markdown / CodeBlock /
 * DiffViewer / JSONViewer 的代表形态；媒体源用内联 SVG 占位图，保证离线可渲染。
 */
import type { ReactElement } from 'react';
import {
  Audio,
  CodeBlock,
  DiffViewer,
  DocumentPreview,
  FilePreview,
  Gallery,
  ImageViewer,
  JSONViewer,
  Markdown,
  RichText,
  Video,
} from '@pactor-app/ui/components';

const columnStyle = { display: 'flex', flexDirection: 'column', gap: 12 } as const;

function demoImage(label: string, fill: string): string {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="180"><rect width="480" height="180" fill="${fill}"/><text x="240" y="96" font-size="16" text-anchor="middle" fill="#ffffff">${label}</text></svg>`,
    )
  );
}

function ImageViewerPreview() {
  return (
    <div style={{ maxWidth: 360 }}>
      <ImageViewer src={demoImage('点击查看灯箱', '#60a5fa')} alt="示例图片" />
    </div>
  );
}

function GalleryPreview() {
  return (
    <Gallery
      columns={4}
      items={[
        { src: demoImage('图一', '#60a5fa'), caption: '晨会现场' },
        { src: demoImage('图二', '#34d399'), caption: '产品评审' },
        { src: demoImage('图三', '#fbbf24'), caption: '团建合影' },
        { src: demoImage('图四', '#f472b6'), caption: '发布会' },
      ]}
    />
  );
}

function VideoPreview() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Video poster={demoImage('视频封面（未配置 src）', '#94a3b8')} />
    </div>
  );
}

function AudioPreview() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Audio />
    </div>
  );
}

function FilePreviewPreview() {
  return (
    <div style={columnStyle}>
      <FilePreview
        name="发布说明.md"
        fileSize={2048}
        fileType=".md"
        src="#"
        content={'## v1.20.0\n\n- 新增媒体与内容类组件\n- 修复导航菜单图标换行'}
      />
      <FilePreview name="架构图.png" fileSize={156672} fileType="image/png" src={demoImage('架构图', '#818cf8')} />
    </div>
  );
}

function DocumentPreviewPreview() {
  return (
    <DocumentPreview
      pages={[
        { content: '第一章 总则\n\n第一条 为规范动态页面的开发与接入，制定本规范。\n第二条 本规范适用于全部 DSL 页面。' },
        { content: '第二章 组件\n\n第三条 页面应优先使用内置组件；自定义组件需注册适配器。\n第四条 涉及状态的组件应支持受控模式。' },
        { content: '第三章 附则\n\n第五条 本规范自发布之日起施行。' },
      ]}
    />
  );
}

function RichTextPreview() {
  return (
    <RichText html='<h3 style="margin:0 0 8px">富文本内容</h3><p style="margin:0">支持 <strong>加粗</strong>、<em>斜体</em>、<a href="#">链接</a> 等内联格式；渲染前经白名单消毒。</p>' />
  );
}

function MarkdownPreview() {
  return (
    <Markdown
      content={'## 发布清单\n\n- [x] 组件实现\n- [x] 契约测试\n- [ ] 版本发布\n\n`pnpm --filter @pactor-app/ui build`'}
    />
  );
}

function CodeBlockPreview() {
  return (
    <CodeBlock
      language="ts"
      code={'interface User {\n  id: string;\n  name: string;\n}\n\nexport function greet(user: User): string {\n  return `你好，${user.name}`;\n}'}
    />
  );
}

function DiffViewerPreview() {
  return (
    <DiffViewer
      oldText={'export const title = "资产库";\nexport const version = "1.19.0";\nexport const stable = false;'}
      newText={'export const title = "资产库";\nexport const version = "1.20.0";\nexport const stable = true;'}
    />
  );
}

function JSONViewerPreview() {
  return (
    <JSONViewer
      data={{
        name: '@pactor-app/ui',
        version: '1.20.0',
        components: 148,
        stable: true,
        deps: { react: '19', tailwind: '4' },
        tags: ['dsl', 'sdui'],
        extra: null,
      }}
      expandedDepth={1}
    />
  );
}

export const PREVIEWS_D: Record<string, () => ReactElement> = {
  'component.image-viewer': ImageViewerPreview,
  'component.gallery': GalleryPreview,
  'component.video': VideoPreview,
  'component.audio': AudioPreview,
  'component.file-preview': FilePreviewPreview,
  'component.document-preview': DocumentPreviewPreview,
  'component.rich-text': RichTextPreview,
  'component.markdown': MarkdownPreview,
  'component.code-block': CodeBlockPreview,
  'component.diff-viewer': DiffViewerPreview,
  'component.json-viewer': JSONViewerPreview,
};
