import type { Metadata } from "next";
import { PactorApp } from "@/pactor/App";
import "@pactor-app/ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pactor 动态页面 Starter",
  description: "Sitemap 驱动的动态页面应用模板（design/dynamic-page.md）",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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
