/** 主题目录：代表色来自中国传统色十二色系谱。 */
export const THEMES = [
  { value: "zhu-cao", label: "朱草绛红", labelEn: "Vermilion Red", family: "红色系", familyEn: "Red", color: "#A64036", source: "朱草", sourceEn: "Zhu Cao" },
  { value: "jin-yun", label: "缙云暖橙", labelEn: "Jinyun Orange", family: "橙色系", familyEn: "Orange", color: "#EE7959", source: "缙云", sourceEn: "Jinyun" },
  { value: "qiu-xiang", label: "秋香金黄", labelEn: "Autumn Gold", family: "黄色系", familyEn: "Yellow", color: "#BF9C46", source: "秋香", sourceEn: "Qiu Xiang" },
  { value: "bi-shan", label: "碧山青绿", labelEn: "Bishan Green", family: "绿色系", familyEn: "Green", color: "#779649", source: "碧山", sourceEn: "Bishan" },
  { value: "tian-shui", label: "天水澄青", labelEn: "Tianshui Cyan", family: "青色系", familyEn: "Cyan", color: "#5AA4AE", source: "天水碧", sourceEn: "Tianshui Bi" },
  { value: "qing-ming", label: "青冥深蓝", labelEn: "Qingming Blue", family: "蓝色系", familyEn: "Blue", color: "#3271AE", source: "青冥", sourceEn: "Qingming" },
  { value: "ning-ye", label: "凝夜幽紫", labelEn: "Night Violet", family: "紫色系", familyEn: "Purple", color: "#422256", source: "凝夜紫", sourceEn: "Ning Ye Zi" },
  { value: "lian-hong", label: "莲红浅粉", labelEn: "Lotus Pink", family: "粉色系", familyEn: "Pink", color: "#D9A0B3", source: "莲红", sourceEn: "Lian Hong" },
  { value: "li-ke", label: "栗壳暖褐", labelEn: "Chestnut Brown", family: "棕褐色系", familyEn: "Brown", color: "#775039", source: "栗壳", sourceEn: "Li Ke" },
  { value: "wan-yan", label: "琬琰米杏", labelEn: "Wanyan Beige", family: "米杏色系", familyEn: "Beige", color: "#A9A886", source: "琬琰", sourceEn: "Wan Yan" },
  { value: "yue-po", label: "月魄素灰", labelEn: "Moonstone Gray", family: "白灰色系", familyEn: "Gray", color: "#B2B6B6", source: "月魄", sourceEn: "Yue Po" },
  { value: "jin-yu", label: "瑾瑜玄墨", labelEn: "Jinyu Ink", family: "黑墨色系", familyEn: "Ink", color: "#1E2732", source: "瑾瑜", sourceEn: "Jin Yu" },
] as const;

export type Theme = (typeof THEMES)[number];

export function themeText(theme: Theme, locale: string) {
  const english = locale === "en-US";
  return {
    label: english ? theme.labelEn : theme.label,
    family: english ? theme.familyEn : theme.family,
    source: english ? theme.sourceEn : theme.source,
  };
}
