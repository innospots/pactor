import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PactorApp } from "@/pactor/App";

import "./globals.css";
import "./theme.css";
import "@/pactor/styles/starter-pages.css";

export const metadata: Metadata = {
  title: "General App",
  description: "通用业务应用：工作台 / 数据概览 / 系统管理",
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
