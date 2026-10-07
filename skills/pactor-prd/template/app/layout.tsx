import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PactorApp } from "@/pactor/App";
// 顺序约定：globals（本项目 tailwind 工具类 + 皮肤无关的外壳规则）→
// ui 预建样式（同层冲突时 ui 胜出，保证其内部 base/响应式变体排序生效，
// 如 Sidebar 的 hidden md:block）。主题令牌由 public/skins/<skin>.css
// 经下方内联脚本在首屏注入（link 后加载者胜出）。
import "./globals.css";
import "@pactor-app/ui/styles.css";

export const metadata: Metadata = {
  title: "Pactor Console",
  description: "Pactor Console 管理台",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            // 首屏渲染前加载皮肤 link（data-pactor-skin 标记，对应 public/skins/，
            // 由 Theme Studio 生成；运行时换肤见 src/pactor/skin.ts）并应用明暗
            //（data-pactor-theme），避免闪烁。皮肤与明暗偏好持久化在
            // localStorage（mc-skin / mc-mode），由 Header 的 ThemeSwitcher 写入；
            // mc-mode 缺省时跟随系统并监听变化。
            // suppressHydrationWarning 容忍 data-pactor-theme 造成的 hydration 差异。
            __html: `(function(){var root=document.documentElement;var skin=localStorage.getItem("mc-skin")||"chenwunaifu";var link=document.createElement("link");link.rel="stylesheet";link.href="/skins/"+skin+".css";link.setAttribute("data-pactor-skin",skin);document.head.appendChild(link);var m=window.matchMedia("(prefers-color-scheme: dark)");function apply(){var mode=localStorage.getItem("mc-mode");var dark=mode?mode==="dark":m.matches;if(dark){root.setAttribute("data-pactor-theme","dark")}else{root.removeAttribute("data-pactor-theme")}}apply();m.addEventListener("change",apply)})()`,
          }}
        />
      </head>
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
