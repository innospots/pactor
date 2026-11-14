import { THEME_NAMES } from '@pactor-app/theme';

export interface SkinHeadScriptProps {
  /** 皮肤持久化键，缺省 pactor.theme */
  storageKey?: string;
  /** 无持久化值时的缺省皮肤；不传则不注入首屏 <link>（保留宿主基础皮肤） */
  defaultSkin?: string;
  /** light/dark 模式持久化键，缺省 pactor.mode */
  modeStorageKey?: string;
  /** 皮肤 CSS 的 public 目录，缺省 /themes（pactor-shell theme sync 的输出） */
  themesPath?: string;
  /** 允许的皮肤名单，缺省主题包全部预置 */
  allowedSkins?: string[];
}

/**
 * 首屏防闪烁内联脚本（宿主放根 layout <head>，如
 * `<head><SkinHeadScript /></head>`）。语义与 next-app-starter 根 layout 的
 * 内联脚本一致：同步恢复持久化皮肤 <link> 与 light/dark 模式属性，避免
 * 水合前闪烁；根 <html> 需配 suppressHydrationWarning。
 */
export function SkinHeadScript({
  storageKey = 'pactor.theme',
  defaultSkin,
  modeStorageKey = 'pactor.mode',
  themesPath = '/themes',
  allowedSkins,
}: SkinHeadScriptProps) {
  const js = `(function(){var root=document.documentElement;var allowed=${JSON.stringify(allowedSkins ?? [...THEME_NAMES])};var skin=null;try{skin=localStorage.getItem(${JSON.stringify(storageKey)})}catch(e){}if(allowed.indexOf(skin)<0){skin=${defaultSkin === undefined ? 'null' : JSON.stringify(defaultSkin)}}if(skin){root.setAttribute("data-requested-skin",skin);root.setAttribute("data-pactor-skin",skin);var link=document.createElement("link");link.rel="stylesheet";link.href=${JSON.stringify(themesPath)}+"/"+skin+".css";link.setAttribute("data-pactor-skin",skin);document.head.appendChild(link)}var m=window.matchMedia("(prefers-color-scheme: dark)");function apply(){var mode;try{mode=localStorage.getItem(${JSON.stringify(modeStorageKey)})}catch(e){}var dark=mode?mode==="dark":m.matches;if(dark){root.setAttribute("data-pactor-theme","dark")}else{root.removeAttribute("data-pactor-theme")}}apply();m.addEventListener("change",apply)})()`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
