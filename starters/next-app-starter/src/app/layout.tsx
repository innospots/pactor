import type { Metadata } from "next";

import { PactorApp } from "@/frontend/App";
import { DEFAULT_SKIN, SKINS, SKIN_STORAGE_KEY } from "@/frontend/skin";
import "./globals.css";
import "pactor-app/styles.css";

export const metadata: Metadata = {
  title: "Example Admin",
  description: "{{APP_DESCRIPTION}}",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const allowedSkins = JSON.stringify(SKINS.map((skin) => skin.name));
  const skinStorageKey = JSON.stringify(SKIN_STORAGE_KEY);
  return (
    <html lang="zh-CN" suppressHydrationWarning className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var root=document.documentElement;var q=new URLSearchParams(location.search).get("locale");var c=document.cookie.split("; ").filter(function(p){return p.slice(0,7)==="locale="})[0];var saved=c?decodeURIComponent(c.slice(7)):"";var loc=q||saved;root.lang=loc==="en-US"?"en-US":loc==="zh-CN"?"zh-CN":navigator.language.toLowerCase().indexOf("en")===0?"en-US":"zh-CN";var allowed=${allowedSkins};var skin;try{skin=localStorage.getItem(${skinStorageKey})}catch(e){}if(allowed.indexOf(skin)<0){skin=${JSON.stringify(DEFAULT_SKIN)}}root.setAttribute("data-requested-skin",skin);root.setAttribute("data-pactor-skin",skin);var link=document.createElement("link");link.rel="stylesheet";link.href="/themes/"+skin+".css";link.setAttribute("data-pactor-skin",skin);document.head.appendChild(link);var m=window.matchMedia("(prefers-color-scheme: dark)");function apply(){var mode;try{mode=localStorage.getItem("mc-mode")}catch(e){}var dark=mode?mode==="dark":m.matches;if(dark){root.setAttribute("data-pactor-theme","dark")}else{root.removeAttribute("data-pactor-theme")}}apply();m.addEventListener("change",apply)})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <PactorApp />
        {children}
      </body>
    </html>
  );
}
