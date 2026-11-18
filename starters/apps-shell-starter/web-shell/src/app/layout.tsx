import type { Metadata } from "next";

import { SkinHeadScript } from "@pactor-app/shell/client";

import "./globals.css";
// 聚合样式入口（ui → blocks → chart → chat）：模块页面
// 使用 chart 组件，必须引入聚合样式而不是仅 ui 分表。
import "pactor-app/styles.css";

export const metadata: Metadata = {
  title: "InnoSpots Web Shell",
  description: "统一 Pactor 模块化 Web 入口",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="h-full antialiased">
      <head>
        {/*
          首屏防闪烁：恢复持久化皮肤 <link> 与 light/dark 属性。
          不传 defaultSkin —— 无持久化选择时保留宿主基础皮肤（晨雾奶芙 theme.css）。
        */}
        <SkinHeadScript />
      </head>
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
        {children}
      </body>
    </html>
  );
}
