import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PactorApp } from "@/pactor/App";

import "./globals.css";
import "./theme.css";
// 独立运行时的模块二级侧栏（kn-* 样式来自 shell 样式包）
import "@pactor-app/shell/styles.css";
import "@/pactor/components/app-shell.css";
import "@/pactor/components/product-center.css";

export const metadata: Metadata = {
  title: "产品中心",
  description: "产品管理、产品配置与产品状态任务看板",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full" suppressHydrationWarning>
      <body className="h-full flex flex-col">
        {/*
         * PactorApp 挂在 Next layout 而非 page：App Router 导航时 page 会
         * 重挂载、layout 常驻——sitemap 只拉取一次，切换导航只刷新内容区。
         */}
        <PactorApp />
        {children}
      </body>
    </html>
  );
}
