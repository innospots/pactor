import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PactorApp } from "@/pactor/App";

import "./globals.css";
import "./theme.css";
import "@/pactor/components/risk-shell.css";
import "@/pactor/components/risk-decision.css";

export const metadata: Metadata = {
  title: "风险决策总览",
  description: "对接监控、数据同步趋势与对接系统明细",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full" suppressHydrationWarning>
      <body className="h-full flex flex-col">
        {/*
         * PactorApp 挂在 Next layout 而非 page：App Router 导航时 page 会
         * 重挂载、layout 常驻——sitemap 只拉取一次，切换导航只刷新内容区。
         * children（page）恒为 null，路由由 PactorApp 内部按 sitemap 解析。
         */}
        <PactorApp />
        {children}
      </body>
    </html>
  );
}
