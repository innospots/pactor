"use client";

import type { PageDsl } from "@pactor-app/core";
import { PactorPage } from "@pactor-app/app";
import { createFileViewerComponent } from "@pactor-app/file-viewer";
import officePreset from "@file-viewer/preset-office";

/**
 * 文件预览示例页：DSL type: FileViewer（@pactor-app/file-viewer 封装
 * @file-viewer/react），格式能力由注册期注入的 preset-office 决定。
 * Next.js 非 Vite 项目：Worker / WASM 资产由 predev / prebuild 钩子
 * 里的 file-viewer-copy-assets 拷入 public 根目录（vendor/ + wasm/）
 * 静态供给——渲染器默认请求根相对路径，无需额外 options 配置；
 * 组件仅在客户端 mount 后初始化，SSR 安全。
 */

// 注册期绑定 preset（DSL 无法表达 JS 对象），模块级创建一次即可
const FileViewer = createFileViewerComponent({ preset: officePreset });

const filePreviewPage: PageDsl = {
  dsl: "1.0",
  page: {
    id: "file-preview",
    title: "文件预览",
    name: "file-preview",
    description: "FileViewer：PDF / Office 文件预览（preset-office）",
  },
  state: {
    viewerEvent: "",
  },
  children: [
    {
      type: "Page",
      props: { title: "文件预览" },
      children: [
        {
          type: "Alert",
          props: {
            variant: "info",
            message:
              "FileViewer 组件由 @pactor-app/file-viewer 注册，格式能力来自注册期注入的 @file-viewer/preset-office",
            description:
              "预览 public/files/sample.pdf；Worker / WASM 资产由 file-viewer-copy-assets 拷入 public 根目录（vendor/ 与 wasm/）。",
          },
        },
        {
          type: "Card",
          props: { title: "PDF 预览" },
          children: [
            {
              type: "FileViewer",
              props: {
                url: "/files/sample.pdf",
                height: 640,
                watermark: { text: "Pactor 示例", opacity: 0.12 },
              },
              events: {
                onEvent: [
                  {
                    action: "setState",
                    params: { viewerEvent: "${event.type}" },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};

export function FilePreviewClient() {
  return (
    <PactorPage
      pageDsl={filePreviewPage}
      components={{ FileViewer }}
    />
  );
}
