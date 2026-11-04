import { useEffect, useState, type CSSProperties } from 'react';

import Viewer from '@file-viewer/react';
import type {
  FileRef,
  ViewerEvent,
  ViewerOptions,
  ViewerThemeMode,
  ViewerToolbarOptions,
  ViewerWatermarkOptions,
} from '@file-viewer/react';

/**
 * 注册期默认配置（来自宿主 JS，不进 DSL）：
 * preset 只能由此注入（DSL 无法表达 JS 对象），
 * 业务侧按需传 @file-viewer/preset-office 或 preset-all；
 * 其余 ViewerOptions 字段（archive / typst / cad 自托管资源路径等）同义透传。
 */
export type FileViewerDefaultOptions = ViewerOptions;

export interface FileViewerProps {
  /** 可直接访问的文件地址（表达式绑定，如 ${data.x.fileUrl}） */
  url?: string;
  /** 鉴权下载后的二进制内容（优先级高于 url；DSL 侧由 dataSource / action 提供） */
  file?: FileRef;
  /** file / buffer 的文件名，建议带扩展名用于格式识别 */
  name?: string;
  /** 容器高度：数字按 px，缺省 480。预览器内部以 height:100% 填满容器，
   *  因此这里必须是确定高度——父级无确定高度时传 '100%' 会塌陷，请用具体像素值 */
  height?: number | string;
  /** 主题，缺省 light */
  theme?: ViewerThemeMode;
  /** 工具栏配置，缺省 { position: 'bottom-right' } */
  toolbar?: ViewerToolbarOptions;
  /** 水印配置 */
  watermark?: ViewerWatermarkOptions;
  /** 其余 ViewerOptions 原样透传（archive / typst / cad / pdf / hooks 等），优先级最高 */
  options?: ViewerOptions;
  /** 预览器事件（加载 / 卸载 / 操作 / 搜索 / 位置变化），DSL 用 events.onEvent + ${event} */
  onEvent?: (event: ViewerEvent) => void;
  /** 通用：容器 class */
  className?: string;
  /** 通用：容器内联样式 */
  style?: CSSProperties;
}

function toCssSize(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * 基于 @file-viewer/react 的文件预览 DSL 组件（类型名 FileViewer）。
 * createFileViewerComponent(defaultOptions) 生成绑定了 preset / 自托管配置的组件，
 * registerFileViewerComponents 注册的就是它；不传 preset 时仅有 core 基础格式能力。
 * 样式隔离保持上游默认（Shadow DOM），避免低代码 reset 破坏工具栏。
 * SSR 下仅渲染空容器，viewer 在 mount 后才初始化。
 */
export function createFileViewerComponent(defaultOptions: FileViewerDefaultOptions = {}) {
  function FileViewer({
    url,
    file,
    name,
    height = 480,
    theme,
    toolbar,
    watermark,
    options,
    onEvent,
    className,
    style,
  }: FileViewerProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const mergedOptions: ViewerOptions = {
      rendererMode: 'replace',
      theme: 'light',
      toolbar: { position: 'bottom-right' },
      ...defaultOptions,
      ...(theme !== undefined ? { theme } : undefined),
      ...(toolbar !== undefined ? { toolbar } : undefined),
      ...(watermark !== undefined ? { watermark } : undefined),
      ...options,
    };

    return (
      <div
        data-slot="file-viewer"
        className={className}
        style={{ width: '100%', height: toCssSize(height), ...style }}
      >
        {mounted && (url || file) ? (
          <Viewer url={url} file={file} name={name} options={mergedOptions} onEvent={onEvent} />
        ) : null}
      </div>
    );
  }

  return FileViewer;
}

/** 未注入 preset 的默认组件（仅 core 基础格式能力） */
export const FileViewer = createFileViewerComponent();
