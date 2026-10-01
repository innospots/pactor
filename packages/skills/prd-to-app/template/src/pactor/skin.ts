/**
 * 皮肤加载：Theme Studio 导出的皮肤 CSS（public/skins/<key>.css）经
 * `<link rel="stylesheet" data-pactor-skin>` 在 @pactor-app/ui/styles.css
 * 之后加载（后加载者胜出）。令牌经 var() 运行时解析，替换 link 节点即可
 * 即时换肤，无需刷新页面（对齐 pactor 文档 guides/theming「运行时切换皮肤」）。
 *
 * 首屏由 layout.tsx 内联脚本在 <head> 中同步注入对应 link（避免闪烁），
 * 本模块供 ThemeSwitcher 在运行时执行换肤 swap。
 */

export const SKIN_STORAGE_KEY = "mc-skin";

export interface SkinOption {
  value: string;
  label: string;
  color: string;
}

export const SKINS: SkinOption[] = [
  { value: "chenwunaifu", label: "晨雾奶芙", color: "#c98a5e" },
  { value: "taijingshenlin", label: "苔径深林", color: "#3f6b4f" },
  { value: "xuanzhimoyun", label: "宣纸墨韵", color: "#2f3437" },
];

export const DEFAULT_SKIN = SKINS[0].value;

export function skinHref(skin: string): string {
  return `/skins/${skin}.css`;
}

/**
 * 运行时换肤：新皮肤 link 加载完成后再移除旧的，避免无样式闪烁。
 * link 以 data-pactor-skin 属性标记，供本函数识别清理。
 */
export function applySkinStylesheet(skin: string): void {
  const href = skinHref(skin);
  if (document.querySelector(`link[data-pactor-skin][href="${href}"]`)) {
    return;
  }
  const next = document.createElement("link");
  next.rel = "stylesheet";
  next.href = href;
  next.dataset.pactorSkin = skin;
  next.onload = () => {
    document
      .querySelectorAll("link[data-pactor-skin]")
      .forEach((el) => {
        if (el !== next) el.remove();
      });
  };
  document.head.append(next);
}
