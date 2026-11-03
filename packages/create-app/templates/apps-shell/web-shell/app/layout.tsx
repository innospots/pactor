import type { Metadata } from "next";

import "./globals.css";
// 聚合样式入口（ui → blocks → chart → chat）：风险分析 / 风险决策页面
// 使用 chart 组件，必须引入聚合样式而不是仅 ui 分表。
import "pactor-app/styles.css";

export const metadata: Metadata = {
  title: "InnoSpots Web Shell",
  description: "统一 Pactor 模块化 Web 入口",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
        {children}
      </body>
    </html>
  );
}
