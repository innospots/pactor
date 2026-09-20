/**
 * 主题条目（80 个：16 色系 × 每系 5 主题）。
 * 本文件由 scripts/gen-theme-scales.mts 生成，请勿手改；修改主题元数据或补 baseHex 后
 * 重新执行 pnpm gen:theme-scales（生成规则与口径见脚本头注释及 themes/theme-defs.ts）。
 * scale 为 OKLCH 生成的 10 阶色阶（含 sRGB 回退与 HEX）；resolvedTokens 为占位语义映射
 * （键名对齐 @pactor-app/ui shadcn 语义令牌，省略 -- 前缀），正式语义映射待样式 Token
 * 接入后由设计校准回填。
 */
import type { ThemeEntry } from '../types.ts';

export const themes: ThemeEntry[] = [
  {
    "id": "theme.zhusha.yinzhu",
    "name": "银朱",
    "familyId": "zhusha",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "銀硃",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "明亮橘红；适用活动、增长、年轻品牌。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.936 0.033 37.7)",
        "srgbFallback": "#ffe3da",
        "hex": "#ffe3da"
      },
      {
        "step": 2,
        "oklch": "oklch(0.89 0.059 34.2)",
        "srgbFallback": "#ffcdc1",
        "hex": "#ffcdc1"
      },
      {
        "step": 3,
        "oklch": "oklch(0.819 0.103 31.1)",
        "srgbFallback": "#ffab9b",
        "hex": "#ffab9b"
      },
      {
        "step": 4,
        "oklch": "oklch(0.74 0.159 29.3)",
        "srgbFallback": "#ff7f6e",
        "hex": "#ff7f6e"
      },
      {
        "step": 5,
        "oklch": "oklch(0.669 0.204 28.9)",
        "srgbFallback": "#f95344",
        "hex": "#f95344"
      },
      {
        "step": 6,
        "oklch": "oklch(0.559 0.204 28.9)",
        "srgbFallback": "#d12920",
        "hex": "#d12920"
      },
      {
        "step": 7,
        "oklch": "oklch(0.459 0.188 28.9)",
        "srgbFallback": "#a70003",
        "hex": "#a70003"
      },
      {
        "step": 8,
        "oklch": "oklch(0.375 0.154 29.2)",
        "srgbFallback": "#7f0000",
        "hex": "#7f0000"
      },
      {
        "step": 9,
        "oklch": "oklch(0.298 0.122 29.2)",
        "srgbFallback": "#5c0000",
        "hex": "#5c0000"
      },
      {
        "step": 10,
        "oklch": "oklch(0.217 0.089 29.2)",
        "srgbFallback": "#390000",
        "hex": "#390000"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#281310",
      "card": "#ffffff",
      "card-foreground": "#281310",
      "popover": "#ffffff",
      "popover-foreground": "#281310",
      "primary": "#d12920",
      "primary-foreground": "#ffffff",
      "secondary": "#ffab9b",
      "secondary-foreground": "#281310",
      "muted": "#ffcdc1",
      "muted-foreground": "#61322b",
      "accent": "#ffcdc1",
      "accent-foreground": "#281310",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#c3a29c",
      "input": "#c3a29c",
      "ring": "#d12920",
      "chart-1": "#d12920",
      "chart-2": "#ff7f6e",
      "chart-3": "#7f0000",
      "chart-4": "#f95344",
      "chart-5": "#5c0000"
    }
  },
  {
    "id": "theme.zhusha.zhusha",
    "name": "朱砂",
    "familyId": "zhusha",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "朱砂",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "纯正朱红；适用文化品牌、主操作、节庆。基准色为工作参考值，基准色待设计确认，UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.92 0.041 28.4)",
        "srgbFallback": "#ffdbd5",
        "hex": "#ffdbd5"
      },
      {
        "step": 2,
        "oklch": "oklch(0.876 0.066 27.4)",
        "srgbFallback": "#ffc6be",
        "hex": "#ffc6be"
      },
      {
        "step": 3,
        "oklch": "oklch(0.808 0.109 26.1)",
        "srgbFallback": "#ffa49b",
        "hex": "#ffa49b"
      },
      {
        "step": 4,
        "oklch": "oklch(0.733 0.163 25.6)",
        "srgbFallback": "#fe7a72",
        "hex": "#fe7a72"
      },
      {
        "step": 5,
        "oklch": "oklch(0.643 0.191 25.6)",
        "srgbFallback": "#ea504c",
        "hex": "#ea504c"
      },
      {
        "step": 6,
        "oklch": "oklch(0.533 0.191 25.6)",
        "srgbFallback": "#c3272b",
        "hex": "#c3272b"
      },
      {
        "step": 7,
        "oklch": "oklch(0.433 0.176 25.7)",
        "srgbFallback": "#9a0013",
        "hex": "#9a0013"
      },
      {
        "step": 8,
        "oklch": "oklch(0.35 0.143 29.2)",
        "srgbFallback": "#730000",
        "hex": "#730000"
      },
      {
        "step": 9,
        "oklch": "oklch(0.272 0.112 29.2)",
        "srgbFallback": "#510000",
        "hex": "#510000"
      },
      {
        "step": 10,
        "oklch": "oklch(0.192 0.079 29.2)",
        "srgbFallback": "#2f0000",
        "hex": "#2f0000"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#210e0c",
      "card": "#ffffff",
      "card-foreground": "#210e0c",
      "popover": "#ffffff",
      "popover-foreground": "#210e0c",
      "primary": "#c3272b",
      "primary-foreground": "#ffffff",
      "secondary": "#ffa49b",
      "secondary-foreground": "#210e0c",
      "muted": "#ffc6be",
      "muted-foreground": "#572d26",
      "accent": "#ffc6be",
      "accent-foreground": "#210e0c",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#c19f9c",
      "input": "#c19f9c",
      "ring": "#c3272b",
      "chart-1": "#c3272b",
      "chart-2": "#fe7a72",
      "chart-3": "#730000",
      "chart-4": "#ea504c",
      "chart-5": "#510000"
    }
  },
  {
    "id": "theme.zhusha.zhuhong",
    "name": "朱红",
    "familyId": "zhusha",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "朱红",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "饱满正红；适用消费、零售、内容平台。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.zhusha.danse",
    "name": "丹色",
    "familyId": "zhusha",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "丹色",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "温暖赤红；适用生活服务、人文产品。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.zhusha.chihong",
    "name": "赤红",
    "familyId": "zhusha",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "赤红",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "深而有力的红；适用告警强化、运动、品牌强调。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.yanli.yanli",
    "name": "胭脂",
    "familyId": "yanli",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "胭脂",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "浓郁玫红；适用美妆、时尚、文化内容。基准色为工作参考值，基准色待设计确认，UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.951 0.025 22.9)",
        "srgbFallback": "#ffe9e7",
        "hex": "#ffe9e7"
      },
      {
        "step": 2,
        "oklch": "oklch(0.909 0.047 21.5)",
        "srgbFallback": "#ffd6d3",
        "hex": "#ffd6d3"
      },
      {
        "step": 3,
        "oklch": "oklch(0.845 0.085 20.8)",
        "srgbFallback": "#ffb6b4",
        "hex": "#ffb6b4"
      },
      {
        "step": 4,
        "oklch": "oklch(0.767 0.129 20.8)",
        "srgbFallback": "#fa9090",
        "hex": "#fa9090"
      },
      {
        "step": 5,
        "oklch": "oklch(0.677 0.151 20.8)",
        "srgbFallback": "#e56c6e",
        "hex": "#e56c6e"
      },
      {
        "step": 6,
        "oklch": "oklch(0.567 0.151 20.8)",
        "srgbFallback": "#bf494f",
        "hex": "#bf494f"
      },
      {
        "step": 7,
        "oklch": "oklch(0.467 0.139 20.8)",
        "srgbFallback": "#983037",
        "hex": "#983037"
      },
      {
        "step": 8,
        "oklch": "oklch(0.367 0.127 20.8)",
        "srgbFallback": "#731520",
        "hex": "#731520"
      },
      {
        "step": 9,
        "oklch": "oklch(0.278 0.112 21.4)",
        "srgbFallback": "#52000d",
        "hex": "#52000d"
      },
      {
        "step": 10,
        "oklch": "oklch(0.201 0.082 27.9)",
        "srgbFallback": "#330001",
        "hex": "#330001"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#23100e",
      "card": "#ffffff",
      "card-foreground": "#23100e",
      "popover": "#ffffff",
      "popover-foreground": "#23100e",
      "primary": "#bf494f",
      "primary-foreground": "#ffffff",
      "secondary": "#ffb6b4",
      "secondary-foreground": "#23100e",
      "muted": "#ffd6d3",
      "muted-foreground": "#593232",
      "accent": "#ffd6d3",
      "accent-foreground": "#23100e",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#c7acaa",
      "input": "#c7acaa",
      "ring": "#bf494f",
      "chart-1": "#bf494f",
      "chart-2": "#fa9090",
      "chart-3": "#731520",
      "chart-4": "#e56c6e",
      "chart-5": "#52000d"
    }
  },
  {
    "id": "theme.yanli.jianghong",
    "name": "绛红",
    "familyId": "yanli",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "绛红",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "深暗红；适用高端品牌、收藏、会员体系。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.yanli.qianse",
    "name": "茜色",
    "familyId": "yanli",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "茜色",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "温暖玫红；适用女性生活、内容社区。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.yanli.sufang",
    "name": "苏方",
    "familyId": "yanli",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "苏方",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "柔和红紫；适用艺术、编辑、创意工具。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.yanli.zaohong",
    "name": "枣红",
    "familyId": "yanli",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "枣红",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "棕调深红；适用传统文化、商务礼赠。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.haitang.haitanghong",
    "name": "海棠红",
    "familyId": "haitang",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "海棠红",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "明净粉红；适用生活服务、女性社区。基准色为工作参考值，基准色待设计确认，UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.921 0.041 14.2)",
        "srgbFallback": "#ffdadc",
        "hex": "#ffdadc"
      },
      {
        "step": 2,
        "oklch": "oklch(0.88 0.064 14.3)",
        "srgbFallback": "#ffc7ca",
        "hex": "#ffc7ca"
      },
      {
        "step": 3,
        "oklch": "oklch(0.816 0.105 14.9)",
        "srgbFallback": "#ffa7ad",
        "hex": "#ffa7ad"
      },
      {
        "step": 4,
        "oklch": "oklch(0.727 0.138 15)",
        "srgbFallback": "#f0808b",
        "hex": "#f0808b"
      },
      {
        "step": 5,
        "oklch": "oklch(0.637 0.162 15)",
        "srgbFallback": "#db5a6b",
        "hex": "#db5a6b"
      },
      {
        "step": 6,
        "oklch": "oklch(0.527 0.162 15)",
        "srgbFallback": "#b5364c",
        "hex": "#b5364c"
      },
      {
        "step": 7,
        "oklch": "oklch(0.427 0.149 15)",
        "srgbFallback": "#8e1b34",
        "hex": "#8e1b34"
      },
      {
        "step": 8,
        "oklch": "oklch(0.33 0.132 16)",
        "srgbFallback": "#69001d",
        "hex": "#69001d"
      },
      {
        "step": 9,
        "oklch": "oklch(0.253 0.102 21.3)",
        "srgbFallback": "#48000a",
        "hex": "#48000a"
      },
      {
        "step": 10,
        "oklch": "oklch(0.175 0.071 28.3)",
        "srgbFallback": "#280000",
        "hex": "#280000"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#1b0b09",
      "card": "#ffffff",
      "card-foreground": "#1b0b09",
      "popover": "#ffffff",
      "popover-foreground": "#1b0b09",
      "primary": "#b5364c",
      "primary-foreground": "#ffffff",
      "secondary": "#ffa7ad",
      "secondary-foreground": "#1b0b09",
      "muted": "#ffc7ca",
      "muted-foreground": "#50282b",
      "accent": "#ffc7ca",
      "accent-foreground": "#1b0b09",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#bc9ea0",
      "input": "#bc9ea0",
      "ring": "#b5364c",
      "chart-1": "#b5364c",
      "chart-2": "#f0808b",
      "chart-3": "#69001d",
      "chart-4": "#db5a6b",
      "chart-5": "#48000a"
    }
  },
  {
    "id": "theme.haitang.taohong",
    "name": "桃红",
    "familyId": "haitang",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "桃红",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "鲜活暖粉；适用社交、活动、内容互动。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.haitang.yinhong",
    "name": "银红",
    "familyId": "haitang",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "银红",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "低饱和浅红；适用健康、关怀、轻应用。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.haitang.tuihong",
    "name": "退红",
    "familyId": "haitang",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "退红",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "灰调淡粉；适用阅读、审美、低干扰界面。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.haitang.yinghua",
    "name": "樱花",
    "familyId": "haitang",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "樱花",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "极浅柔粉；适用内容背景、教育、生活记录。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.xiangye.xiangye",
    "name": "缃叶",
    "familyId": "xiangye",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "缃葉",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "金调橙黄；适用创作、文化、内容推荐。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.977 0.045 98.7)",
        "srgbFallback": "#fff8d6",
        "hex": "#fff8d6"
      },
      {
        "step": 2,
        "oklch": "oklch(0.937 0.067 98.7)",
        "srgbFallback": "#f5ebb8",
        "hex": "#f5ebb8"
      },
      {
        "step": 3,
        "oklch": "oklch(0.867 0.097 98.7)",
        "srgbFallback": "#e3d589",
        "hex": "#e3d589"
      },
      {
        "step": 4,
        "oklch": "oklch(0.777 0.126 98.7)",
        "srgbFallback": "#cbb74e",
        "hex": "#cbb74e"
      },
      {
        "step": 5,
        "oklch": "oklch(0.687 0.142 98.1)",
        "srgbFallback": "#b29a00",
        "hex": "#b29a00"
      },
      {
        "step": 6,
        "oklch": "oklch(0.579 0.119 95.1)",
        "srgbFallback": "#907800",
        "hex": "#907800"
      },
      {
        "step": 7,
        "oklch": "oklch(0.48 0.098 92.8)",
        "srgbFallback": "#715b00",
        "hex": "#715b00"
      },
      {
        "step": 8,
        "oklch": "oklch(0.38 0.078 89.2)",
        "srgbFallback": "#534000",
        "hex": "#534000"
      },
      {
        "step": 9,
        "oklch": "oklch(0.29 0.06 84.2)",
        "srgbFallback": "#392800",
        "hex": "#392800"
      },
      {
        "step": 10,
        "oklch": "oklch(0.2 0.042 74.9)",
        "srgbFallback": "#211300",
        "hex": "#211300"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#1b150d",
      "card": "#ffffff",
      "card-foreground": "#1b150d",
      "popover": "#ffffff",
      "popover-foreground": "#1b150d",
      "primary": "#907800",
      "primary-foreground": "#ffffff",
      "secondary": "#e3d589",
      "secondary-foreground": "#1b150d",
      "muted": "#f5ebb8",
      "muted-foreground": "#4a422d",
      "accent": "#f5ebb8",
      "accent-foreground": "#1b150d",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#bbb7a1",
      "input": "#bbb7a1",
      "ring": "#907800",
      "chart-1": "#907800",
      "chart-2": "#cbb74e",
      "chart-3": "#534000",
      "chart-4": "#b29a00",
      "chart-5": "#392800"
    }
  },
  {
    "id": "theme.xiangye.juhuang",
    "name": "橘黄",
    "familyId": "xiangye",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "橘黄",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "鲜亮橙黄；适用增长、活动、营销工具。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.xiangye.xinghuang",
    "name": "杏黄",
    "familyId": "xiangye",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "杏黄",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "柔暖浅橙；适用教育、亲子、生活服务。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.xiangye.shise",
    "name": "柿色",
    "familyId": "xiangye",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "柿色",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "饱满暖橙；适用餐饮、零售、消费产品。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.xiangye.hupo",
    "name": "琥珀",
    "familyId": "xiangye",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "琥珀",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "深金橙；适用会员、品质消费、数据强调。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.zhizi.zhizi",
    "name": "栀子",
    "familyId": "zhizi",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "梔子",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "清亮暖黄；适用创意工具、生活方式。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.949 0.046 83.4)",
        "srgbFallback": "#fdeccc",
        "hex": "#fdeccc"
      },
      {
        "step": 2,
        "oklch": "oklch(0.909 0.069 83.4)",
        "srgbFallback": "#f7dead",
        "hex": "#f7dead"
      },
      {
        "step": 3,
        "oklch": "oklch(0.839 0.1 83.4)",
        "srgbFallback": "#eac57d",
        "hex": "#eac57d"
      },
      {
        "step": 4,
        "oklch": "oklch(0.749 0.131 83.4)",
        "srgbFallback": "#d5a53d",
        "hex": "#d5a53d"
      },
      {
        "step": 5,
        "oklch": "oklch(0.661 0.137 79.4)",
        "srgbFallback": "#be8700",
        "hex": "#be8700"
      },
      {
        "step": 6,
        "oklch": "oklch(0.553 0.118 72.8)",
        "srgbFallback": "#9b6500",
        "hex": "#9b6500"
      },
      {
        "step": 7,
        "oklch": "oklch(0.453 0.099 68.1)",
        "srgbFallback": "#7a4a00",
        "hex": "#7a4a00"
      },
      {
        "step": 8,
        "oklch": "oklch(0.353 0.082 61)",
        "srgbFallback": "#592f00",
        "hex": "#592f00"
      },
      {
        "step": 9,
        "oklch": "oklch(0.263 0.067 52.3)",
        "srgbFallback": "#3d1900",
        "hex": "#3d1900"
      },
      {
        "step": 10,
        "oklch": "oklch(0.172 0.055 39.3)",
        "srgbFallback": "#220500",
        "hex": "#220500"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#180c09",
      "card": "#ffffff",
      "card-foreground": "#180c09",
      "popover": "#ffffff",
      "popover-foreground": "#180c09",
      "primary": "#9b6500",
      "primary-foreground": "#ffffff",
      "secondary": "#eac57d",
      "secondary-foreground": "#180c09",
      "muted": "#f7dead",
      "muted-foreground": "#4a3727",
      "accent": "#f7dead",
      "accent-foreground": "#180c09",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#b8ac97",
      "input": "#b8ac97",
      "ring": "#9b6500",
      "chart-1": "#9b6500",
      "chart-2": "#d5a53d",
      "chart-3": "#592f00",
      "chart-4": "#be8700",
      "chart-5": "#3d1900"
    }
  },
  {
    "id": "theme.zhizi.minghuang",
    "name": "明黄",
    "familyId": "zhizi",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "明黄",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "高明度正黄；适用活动、提示、品牌识别。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.zhizi.ehuang",
    "name": "鹅黄",
    "familyId": "zhizi",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "鹅黄",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "柔和浅黄；适用教育、儿童、轻阅读。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.zhizi.xiangse",
    "name": "缃色",
    "familyId": "zhizi",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "缃色",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "稳定金黄；适用文化、知识、内容产品。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.zhizi.zhengli",
    "name": "蒸栗",
    "familyId": "zhizi",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "蒸栗",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "低饱和栗黄；适用商务、人文、传统品牌。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.qiuxiang.qiuxiang",
    "name": "秋香",
    "familyId": "qiuxiang",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "秋香",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "黄绿平衡；适用文化、农业、自然品牌。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.981 0.032 96)",
        "srgbFallback": "#fff9e1",
        "hex": "#fff9e1"
      },
      {
        "step": 2,
        "oklch": "oklch(0.957 0.05 88)",
        "srgbFallback": "#fff0cb",
        "hex": "#fff0cb"
      },
      {
        "step": 3,
        "oklch": "oklch(0.888 0.073 87)",
        "srgbFallback": "#efd8a3",
        "hex": "#efd8a3"
      },
      {
        "step": 4,
        "oklch": "oklch(0.798 0.095 87)",
        "srgbFallback": "#d8b974",
        "hex": "#d8b974"
      },
      {
        "step": 5,
        "oklch": "oklch(0.708 0.112 87)",
        "srgbFallback": "#bf9c46",
        "hex": "#bf9c46"
      },
      {
        "step": 6,
        "oklch": "oklch(0.598 0.112 87)",
        "srgbFallback": "#9c7a1e",
        "hex": "#9c7a1e"
      },
      {
        "step": 7,
        "oklch": "oklch(0.498 0.102 86.6)",
        "srgbFallback": "#7c5e00",
        "hex": "#7c5e00"
      },
      {
        "step": 8,
        "oklch": "oklch(0.399 0.082 82.9)",
        "srgbFallback": "#5d4200",
        "hex": "#5d4200"
      },
      {
        "step": 9,
        "oklch": "oklch(0.31 0.065 78.2)",
        "srgbFallback": "#422b00",
        "hex": "#422b00"
      },
      {
        "step": 10,
        "oklch": "oklch(0.22 0.048 70.3)",
        "srgbFallback": "#281600",
        "hex": "#281600"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#201911",
      "card": "#ffffff",
      "card-foreground": "#201911",
      "popover": "#ffffff",
      "popover-foreground": "#201911",
      "primary": "#9c7a1e",
      "primary-foreground": "#ffffff",
      "secondary": "#efd8a3",
      "secondary-foreground": "#201911",
      "muted": "#fff0cb",
      "muted-foreground": "#514630",
      "accent": "#fff0cb",
      "accent-foreground": "#201911",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#c4bcac",
      "input": "#c4bcac",
      "ring": "#9c7a1e",
      "chart-1": "#9c7a1e",
      "chart-2": "#d8b974",
      "chart-3": "#5d4200",
      "chart-4": "#bf9c46",
      "chart-5": "#422b00"
    }
  },
  {
    "id": "theme.qiuxiang.quchen",
    "name": "麹尘",
    "familyId": "qiuxiang",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "麹尘",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "灰调黄绿；适用人文工具、低饱和界面。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.qiuxiang.liuhuang",
    "name": "柳黄",
    "familyId": "qiuxiang",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "柳黄",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "明亮嫩黄绿；适用春季活动、健康、生活服务。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.qiuxiang.nencao",
    "name": "嫩草",
    "familyId": "qiuxiang",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "嫩草",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "清新浅黄绿；适用成长、教育、轻应用。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.qiuxiang.ganlan",
    "name": "橄榄",
    "familyId": "qiuxiang",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "橄榄",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "深沉灰黄绿；适用户外、专业工具、可持续产品。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.zhuqing.zhuqing",
    "name": "竹青",
    "familyId": "zhuqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "竹青",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "清正中绿；适用企业、协作、健康产品。基准色为工作参考值，基准色待设计确认，UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.917 0.023 131.4)",
        "srgbFallback": "#dee7d8",
        "hex": "#dee7d8"
      },
      {
        "step": 2,
        "oklch": "oklch(0.877 0.034 131.4)",
        "srgbFallback": "#cfdcc5",
        "hex": "#cfdcc5"
      },
      {
        "step": 3,
        "oklch": "oklch(0.807 0.049 131.4)",
        "srgbFallback": "#b5c7a7",
        "hex": "#b5c7a7"
      },
      {
        "step": 4,
        "oklch": "oklch(0.717 0.064 131.4)",
        "srgbFallback": "#95ac83",
        "hex": "#95ac83"
      },
      {
        "step": 5,
        "oklch": "oklch(0.627 0.075 131.4)",
        "srgbFallback": "#789262",
        "hex": "#789262"
      },
      {
        "step": 6,
        "oklch": "oklch(0.517 0.075 131.4)",
        "srgbFallback": "#587143",
        "hex": "#587143"
      },
      {
        "step": 7,
        "oklch": "oklch(0.417 0.069 131.4)",
        "srgbFallback": "#3f542b",
        "hex": "#3f542b"
      },
      {
        "step": 8,
        "oklch": "oklch(0.317 0.063 131.4)",
        "srgbFallback": "#263914",
        "hex": "#263914"
      },
      {
        "step": 9,
        "oklch": "oklch(0.227 0.056 131.4)",
        "srgbFallback": "#122103",
        "hex": "#122103"
      },
      {
        "step": 10,
        "oklch": "oklch(0.138 0.04 135.1)",
        "srgbFallback": "#030c00",
        "hex": "#030c00"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#060a05",
      "card": "#ffffff",
      "card-foreground": "#060a05",
      "popover": "#ffffff",
      "popover-foreground": "#060a05",
      "primary": "#587143",
      "primary-foreground": "#ffffff",
      "secondary": "#b5c7a7",
      "secondary-foreground": "#060a05",
      "muted": "#cfdcc5",
      "muted-foreground": "#2d3526",
      "accent": "#cfdcc5",
      "accent-foreground": "#060a05",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#a0a69c",
      "input": "#a0a69c",
      "ring": "#587143",
      "chart-1": "#587143",
      "chart-2": "#95ac83",
      "chart-3": "#263914",
      "chart-4": "#789262",
      "chart-5": "#122103"
    }
  },
  {
    "id": "theme.zhuqing.shilv",
    "name": "石绿",
    "familyId": "zhuqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "石绿",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "饱和矿物绿；适用文化、视觉创作、品牌强调。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.zhuqing.guanlv",
    "name": "官绿",
    "familyId": "zhuqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "官绿",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "稳定正绿；适用政企、流程、运营管理。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.zhuqing.cuilv",
    "name": "翠绿",
    "familyId": "zhuqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "翠绿",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "鲜亮高饱和绿；适用增长、生态、状态提示。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.zhuqing.songlv",
    "name": "松绿",
    "familyId": "zhuqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "松绿",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "深而冷静的绿；适用专业工具、安全、环境产品。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.songhua.songhua",
    "name": "松花",
    "familyId": "songhua",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "松花",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "淡黄浅绿；适用内容、教育、轻量工具。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.979 0.044 101.8)",
        "srgbFallback": "#fefad8",
        "hex": "#fefad8"
      },
      {
        "step": 2,
        "oklch": "oklch(0.939 0.067 101.8)",
        "srgbFallback": "#f3edba",
        "hex": "#f3edba"
      },
      {
        "step": 3,
        "oklch": "oklch(0.869 0.096 101.8)",
        "srgbFallback": "#e0d68b",
        "hex": "#e0d68b"
      },
      {
        "step": 4,
        "oklch": "oklch(0.779 0.126 101.8)",
        "srgbFallback": "#c7b952",
        "hex": "#c7b952"
      },
      {
        "step": 5,
        "oklch": "oklch(0.689 0.144 101.5)",
        "srgbFallback": "#ae9d00",
        "hex": "#ae9d00"
      },
      {
        "step": 6,
        "oklch": "oklch(0.581 0.121 99.2)",
        "srgbFallback": "#8d7b00",
        "hex": "#8d7b00"
      },
      {
        "step": 7,
        "oklch": "oklch(0.482 0.099 97.4)",
        "srgbFallback": "#6e5e00",
        "hex": "#6e5e00"
      },
      {
        "step": 8,
        "oklch": "oklch(0.382 0.078 94.5)",
        "srgbFallback": "#504200",
        "hex": "#504200"
      },
      {
        "step": 9,
        "oklch": "oklch(0.292 0.06 90.6)",
        "srgbFallback": "#372a00",
        "hex": "#372a00"
      },
      {
        "step": 10,
        "oklch": "oklch(0.202 0.042 82.9)",
        "srgbFallback": "#201400",
        "hex": "#201400"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#1a160e",
      "card": "#ffffff",
      "card-foreground": "#1a160e",
      "popover": "#ffffff",
      "popover-foreground": "#1a160e",
      "primary": "#8d7b00",
      "primary-foreground": "#ffffff",
      "secondary": "#e0d68b",
      "secondary-foreground": "#1a160e",
      "muted": "#f3edba",
      "muted-foreground": "#49432d",
      "accent": "#f3edba",
      "accent-foreground": "#1a160e",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#bbb8a1",
      "input": "#bbb8a1",
      "ring": "#8d7b00",
      "chart-1": "#8d7b00",
      "chart-2": "#c7b952",
      "chart-3": "#504200",
      "chart-4": "#ae9d00",
      "chart-5": "#372a00"
    }
  },
  {
    "id": "theme.songhua.doulv",
    "name": "豆绿",
    "familyId": "songhua",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "豆绿",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "柔和浅绿；适用健康、生活服务、表单产品。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.songhua.fenlv",
    "name": "粉绿",
    "familyId": "songhua",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "粉绿",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "低饱和灰绿；适用阅读、知识管理、个人工具。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.songhua.congqian",
    "name": "葱倩",
    "familyId": "songhua",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "葱倩",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "清新青绿；适用社交、效率、移动应用。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.songhua.lvshen",
    "name": "绿沈",
    "familyId": "songhua",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "绿沈",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "沉静灰绿；适用企业后台、专业内容、数据产品。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.tianqing.tianqing",
    "name": "天青",
    "familyId": "tianqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "天青",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "清透浅青；适用云服务、科技、内容产品。基准色为工作参考值，基准色待设计确认，UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.984 0.018 202.4)",
        "srgbFallback": "#edfeff",
        "hex": "#edfeff"
      },
      {
        "step": 2,
        "oklch": "oklch(0.948 0.029 217.4)",
        "srgbFallback": "#d9f3fb",
        "hex": "#d9f3fb"
      },
      {
        "step": 3,
        "oklch": "oklch(0.878 0.041 217.4)",
        "srgbFallback": "#b9dee9",
        "hex": "#b9dee9"
      },
      {
        "step": 4,
        "oklch": "oklch(0.788 0.054 217.4)",
        "srgbFallback": "#93c3d1",
        "hex": "#93c3d1"
      },
      {
        "step": 5,
        "oklch": "oklch(0.698 0.064 217.4)",
        "srgbFallback": "#6fa8b8",
        "hex": "#6fa8b8"
      },
      {
        "step": 6,
        "oklch": "oklch(0.588 0.064 217.4)",
        "srgbFallback": "#4e8696",
        "hex": "#4e8696"
      },
      {
        "step": 7,
        "oklch": "oklch(0.488 0.059 217.4)",
        "srgbFallback": "#356876",
        "hex": "#356876"
      },
      {
        "step": 8,
        "oklch": "oklch(0.388 0.054 217.4)",
        "srgbFallback": "#1d4b57",
        "hex": "#1d4b57"
      },
      {
        "step": 9,
        "oklch": "oklch(0.298 0.048 217.4)",
        "srgbFallback": "#08333d",
        "hex": "#08333d"
      },
      {
        "step": 10,
        "oklch": "oklch(0.21 0.038 219.7)",
        "srgbFallback": "#001c24",
        "hex": "#001c24"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#101a1d",
      "card": "#ffffff",
      "card-foreground": "#101a1d",
      "popover": "#ffffff",
      "popover-foreground": "#101a1d",
      "primary": "#4e8696",
      "primary-foreground": "#ffffff",
      "secondary": "#b9dee9",
      "secondary-foreground": "#101a1d",
      "muted": "#d9f3fb",
      "muted-foreground": "#36484d",
      "accent": "#d9f3fb",
      "accent-foreground": "#101a1d",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#b1bcc0",
      "input": "#b1bcc0",
      "ring": "#4e8696",
      "chart-1": "#4e8696",
      "chart-2": "#93c3d1",
      "chart-3": "#1d4b57",
      "chart-4": "#6fa8b8",
      "chart-5": "#08333d"
    }
  },
  {
    "id": "theme.tianqing.tianshuibi",
    "name": "天水碧",
    "familyId": "tianqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "天水碧",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "绿调浅青；适用健康、自然、生活方式。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.tianqing.yaluanqing",
    "name": "鸭卵青",
    "familyId": "tianqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "鸭卵青",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "灰调淡青；适用阅读、文档、低干扰工具。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.tianqing.yingqing",
    "name": "影青",
    "familyId": "tianqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "影青",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "冷灰浅青；适用企业工具、设计系统、背景体系。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.tianqing.biqing",
    "name": "碧青",
    "familyId": "tianqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "碧青",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "饱和青色；适用数据、协作、状态强调。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.kongquelan.kongquelan",
    "name": "孔雀蓝",
    "familyId": "kongquelan",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "孔雀藍",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "深蓝绿色；适用金融、智能、专业工具。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.929 0.031 239.3)",
        "srgbFallback": "#d6ebfb",
        "hex": "#d6ebfb"
      },
      {
        "step": 2,
        "oklch": "oklch(0.889 0.047 239.3)",
        "srgbFallback": "#bfdff7",
        "hex": "#bfdff7"
      },
      {
        "step": 3,
        "oklch": "oklch(0.819 0.067 239.3)",
        "srgbFallback": "#9ccbeb",
        "hex": "#9ccbeb"
      },
      {
        "step": 4,
        "oklch": "oklch(0.729 0.088 239.3)",
        "srgbFallback": "#72afd9",
        "hex": "#72afd9"
      },
      {
        "step": 5,
        "oklch": "oklch(0.639 0.104 239.3)",
        "srgbFallback": "#4994c4",
        "hex": "#4994c4"
      },
      {
        "step": 6,
        "oklch": "oklch(0.529 0.104 239.3)",
        "srgbFallback": "#2473a1",
        "hex": "#2473a1"
      },
      {
        "step": 7,
        "oklch": "oklch(0.429 0.095 239.3)",
        "srgbFallback": "#04557e",
        "hex": "#04557e"
      },
      {
        "step": 8,
        "oklch": "oklch(0.333 0.081 243.6)",
        "srgbFallback": "#00395c",
        "hex": "#00395c"
      },
      {
        "step": 9,
        "oklch": "oklch(0.246 0.068 249)",
        "srgbFallback": "#00223f",
        "hex": "#00223f"
      },
      {
        "step": 10,
        "oklch": "oklch(0.158 0.055 256.5)",
        "srgbFallback": "#000c24",
        "hex": "#000c24"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#070d16",
      "card": "#ffffff",
      "card-foreground": "#070d16",
      "popover": "#ffffff",
      "popover-foreground": "#070d16",
      "primary": "#2473a1",
      "primary-foreground": "#ffffff",
      "secondary": "#9ccbeb",
      "secondary-foreground": "#070d16",
      "muted": "#bfdff7",
      "muted-foreground": "#263848",
      "accent": "#bfdff7",
      "accent-foreground": "#070d16",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#9baab4",
      "input": "#9baab4",
      "ring": "#2473a1",
      "chart-1": "#2473a1",
      "chart-2": "#72afd9",
      "chart-3": "#00395c",
      "chart-4": "#4994c4",
      "chart-5": "#00223f"
    }
  },
  {
    "id": "theme.kongquelan.kongquelv",
    "name": "孔雀绿",
    "familyId": "kongquelan",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "孔雀绿",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "饱和蓝绿色；适用数据可视化、生态科技。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.kongquelan.hulan",
    "name": "湖蓝",
    "familyId": "kongquelan",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "湖蓝",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "明亮蓝青；适用云平台、旅游、服务产品。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.kongquelan.cuilan",
    "name": "翠蓝",
    "familyId": "kongquelan",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "翠蓝",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "清亮青蓝；适用协作、创作、效率工具。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.kongquelan.bilan",
    "name": "碧蓝",
    "familyId": "kongquelan",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "碧蓝",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "稳定蓝青；适用企业应用、资源管理。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.qunqing.qunqing",
    "name": "群青",
    "familyId": "qunqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "群青",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "高识别正蓝；适用通用企业产品、主操作。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.97 0.019 225.3)",
        "srgbFallback": "#e8f8ff",
        "hex": "#e8f8ff"
      },
      {
        "step": 2,
        "oklch": "oklch(0.929 0.037 243.6)",
        "srgbFallback": "#d4ebff",
        "hex": "#d4ebff"
      },
      {
        "step": 3,
        "oklch": "oklch(0.861 0.07 255.1)",
        "srgbFallback": "#b3d4ff",
        "hex": "#b3d4ff"
      },
      {
        "step": 4,
        "oklch": "oklch(0.776 0.114 261.1)",
        "srgbFallback": "#8db6ff",
        "hex": "#8db6ff"
      },
      {
        "step": 5,
        "oklch": "oklch(0.686 0.134 261.2)",
        "srgbFallback": "#6a99ed",
        "hex": "#6a99ed"
      },
      {
        "step": 6,
        "oklch": "oklch(0.576 0.134 261.2)",
        "srgbFallback": "#4a77c8",
        "hex": "#4a77c8"
      },
      {
        "step": 7,
        "oklch": "oklch(0.476 0.124 261.2)",
        "srgbFallback": "#325aa1",
        "hex": "#325aa1"
      },
      {
        "step": 8,
        "oklch": "oklch(0.376 0.113 261.2)",
        "srgbFallback": "#1c3e7c",
        "hex": "#1c3e7c"
      },
      {
        "step": 9,
        "oklch": "oklch(0.286 0.101 261.2)",
        "srgbFallback": "#0a275b",
        "hex": "#0a275b"
      },
      {
        "step": 10,
        "oklch": "oklch(0.196 0.087 261.4)",
        "srgbFallback": "#00103b",
        "hex": "#00103b"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#0c1525",
      "card": "#ffffff",
      "card-foreground": "#0c1525",
      "popover": "#ffffff",
      "popover-foreground": "#0c1525",
      "primary": "#4a77c8",
      "primary-foreground": "#ffffff",
      "secondary": "#b3d4ff",
      "secondary-foreground": "#0c1525",
      "muted": "#d4ebff",
      "muted-foreground": "#32415d",
      "accent": "#d4ebff",
      "accent-foreground": "#0c1525",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#acb7c9",
      "input": "#acb7c9",
      "ring": "#4a77c8",
      "chart-1": "#4a77c8",
      "chart-2": "#8db6ff",
      "chart-3": "#1c3e7c",
      "chart-4": "#6a99ed",
      "chart-5": "#0a275b"
    }
  },
  {
    "id": "theme.qunqing.baolan",
    "name": "宝蓝",
    "familyId": "qunqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "宝蓝",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "饱满亮蓝；适用科技、金融、品牌门户。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.qunqing.shiqing",
    "name": "石青",
    "familyId": "qunqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "石青",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "稳定矿物蓝；适用文化科技、创意工具。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.qunqing.dishiqiang",
    "name": "帝释青",
    "familyId": "qunqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "帝释青",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "清澈亮蓝；适用云服务、开发者平台。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.qunqing.roulan",
    "name": "柔蓝",
    "familyId": "qunqing",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "柔蓝",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "低饱和浅蓝；适用内容、教育、低压力工具。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.dailan.dailan",
    "name": "黛蓝",
    "familyId": "dailan",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "黛蓝",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "灰调深蓝；适用政企、文档、专业后台。基准色为工作参考值，基准色待设计确认，UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.952 0.011 248.7)",
        "srgbFallback": "#eaf0f7",
        "hex": "#eaf0f7"
      },
      {
        "step": 2,
        "oklch": "oklch(0.912 0.017 248.7)",
        "srgbFallback": "#dae3ed",
        "hex": "#dae3ed"
      },
      {
        "step": 3,
        "oklch": "oklch(0.842 0.024 248.7)",
        "srgbFallback": "#c0cddb",
        "hex": "#c0cddb"
      },
      {
        "step": 4,
        "oklch": "oklch(0.752 0.031 248.7)",
        "srgbFallback": "#a0b1c2",
        "hex": "#a0b1c2"
      },
      {
        "step": 5,
        "oklch": "oklch(0.662 0.037 248.7)",
        "srgbFallback": "#8295a9",
        "hex": "#8295a9"
      },
      {
        "step": 6,
        "oklch": "oklch(0.552 0.037 248.7)",
        "srgbFallback": "#627587",
        "hex": "#627587"
      },
      {
        "step": 7,
        "oklch": "oklch(0.452 0.034 248.7)",
        "srgbFallback": "#475868",
        "hex": "#475868"
      },
      {
        "step": 8,
        "oklch": "oklch(0.352 0.031 248.7)",
        "srgbFallback": "#2e3d4b",
        "hex": "#2e3d4b"
      },
      {
        "step": 9,
        "oklch": "oklch(0.262 0.028 248.7)",
        "srgbFallback": "#1a2632",
        "hex": "#1a2632"
      },
      {
        "step": 10,
        "oklch": "oklch(0.172 0.024 248.7)",
        "srgbFallback": "#07111a",
        "hex": "#07111a"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#0d1014",
      "card": "#ffffff",
      "card-foreground": "#0d1014",
      "popover": "#ffffff",
      "popover-foreground": "#0d1014",
      "primary": "#627587",
      "primary-foreground": "#ffffff",
      "secondary": "#c0cddb",
      "secondary-foreground": "#0d1014",
      "muted": "#dae3ed",
      "muted-foreground": "#363c42",
      "accent": "#dae3ed",
      "accent-foreground": "#0d1014",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#abafb3",
      "input": "#abafb3",
      "ring": "#627587",
      "chart-1": "#627587",
      "chart-2": "#a0b1c2",
      "chart-3": "#2e3d4b",
      "chart-4": "#8295a9",
      "chart-5": "#1a2632"
    }
  },
  {
    "id": "theme.dailan.zanglan",
    "name": "藏蓝",
    "familyId": "dailan",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "藏蓝",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "稳重正深蓝；适用金融、企业、安全产品。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.dailan.ganqing",
    "name": "绀青",
    "familyId": "dailan",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "绀青",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "高浓度蓝；适用开发者工具、数据平台。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.dailan.yaqing",
    "name": "鸦青",
    "familyId": "dailan",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "鸦青",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "接近黑的蓝灰；适用沉浸式编辑、深色导航。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.dailan.molan",
    "name": "墨蓝",
    "familyId": "dailan",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "墨蓝",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "柔和墨调蓝；适用知识、写作、文化科技。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.tengluo.tengluo",
    "name": "藤萝",
    "familyId": "tengluo",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "藤蘿",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "柔和中紫；适用 AI、创作、知识产品。基准色为工作参考值，基准色待设计确认，UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.983 0.01 303.7)",
        "srgbFallback": "#fbf8ff",
        "hex": "#fbf8ff"
      },
      {
        "step": 2,
        "oklch": "oklch(0.951 0.026 296)",
        "srgbFallback": "#f0ecff",
        "hex": "#f0ecff"
      },
      {
        "step": 3,
        "oklch": "oklch(0.882 0.045 294.4)",
        "srgbFallback": "#d9d3f3",
        "hex": "#d9d3f3"
      },
      {
        "step": 4,
        "oklch": "oklch(0.792 0.058 294.4)",
        "srgbFallback": "#bdb4de",
        "hex": "#bdb4de"
      },
      {
        "step": 5,
        "oklch": "oklch(0.702 0.069 294.4)",
        "srgbFallback": "#a197c6",
        "hex": "#a197c6"
      },
      {
        "step": 6,
        "oklch": "oklch(0.592 0.069 294.4)",
        "srgbFallback": "#8076a3",
        "hex": "#8076a3"
      },
      {
        "step": 7,
        "oklch": "oklch(0.492 0.063 294.4)",
        "srgbFallback": "#635a81",
        "hex": "#635a81"
      },
      {
        "step": 8,
        "oklch": "oklch(0.392 0.058 294.4)",
        "srgbFallback": "#473f61",
        "hex": "#473f61"
      },
      {
        "step": 9,
        "oklch": "oklch(0.302 0.051 294.4)",
        "srgbFallback": "#302946",
        "hex": "#302946"
      },
      {
        "step": 10,
        "oklch": "oklch(0.212 0.045 294.4)",
        "srgbFallback": "#1a142b",
        "hex": "#1a142b"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#191720",
      "card": "#ffffff",
      "card-foreground": "#191720",
      "popover": "#ffffff",
      "popover-foreground": "#191720",
      "primary": "#8076a3",
      "primary-foreground": "#ffffff",
      "secondary": "#d9d3f3",
      "secondary-foreground": "#191720",
      "muted": "#f0ecff",
      "muted-foreground": "#464352",
      "accent": "#f0ecff",
      "accent-foreground": "#191720",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#bbbac4",
      "input": "#bbbac4",
      "ring": "#8076a3",
      "chart-1": "#8076a3",
      "chart-2": "#bdb4de",
      "chart-3": "#473f61",
      "chart-4": "#a197c6",
      "chart-5": "#302946"
    }
  },
  {
    "id": "theme.tengluo.dingxiang",
    "name": "丁香",
    "familyId": "tengluo",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "丁香",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "灰调浅紫；适用内容、审美、个人工具。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.tengluo.ouhe",
    "name": "藕荷",
    "familyId": "tengluo",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "藕荷",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "暖灰紫；适用生活、文化、女性产品。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.tengluo.mushanzi",
    "name": "暮山紫",
    "familyId": "tengluo",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "暮山紫",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "沉静深紫；适用高端内容、沉浸式应用。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.tengluo.qinglian",
    "name": "青莲",
    "familyId": "tengluo",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "青莲",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "蓝调紫；适用智能、开发者、数字艺术。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.tanse.tanse",
    "name": "檀色",
    "familyId": "tanse",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "檀色",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "红调暖棕；适用文化、文博、品质品牌。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.974 0.014 50.4)",
        "srgbFallback": "#fff4ee",
        "hex": "#fff4ee"
      },
      {
        "step": 2,
        "oklch": "oklch(0.953 0.025 44.6)",
        "srgbFallback": "#ffebe2",
        "hex": "#ffebe2"
      },
      {
        "step": 3,
        "oklch": "oklch(0.893 0.057 34.6)",
        "srgbFallback": "#ffcfc3",
        "hex": "#ffcfc3"
      },
      {
        "step": 4,
        "oklch": "oklch(0.806 0.078 33.8)",
        "srgbFallback": "#edae9f",
        "hex": "#edae9f"
      },
      {
        "step": 5,
        "oklch": "oklch(0.716 0.092 33.8)",
        "srgbFallback": "#d68e7d",
        "hex": "#d68e7d"
      },
      {
        "step": 6,
        "oklch": "oklch(0.606 0.092 33.8)",
        "srgbFallback": "#b26d5d",
        "hex": "#b26d5d"
      },
      {
        "step": 7,
        "oklch": "oklch(0.506 0.085 33.8)",
        "srgbFallback": "#8f5244",
        "hex": "#8f5244"
      },
      {
        "step": 8,
        "oklch": "oklch(0.406 0.077 33.8)",
        "srgbFallback": "#6d382c",
        "hex": "#6d382c"
      },
      {
        "step": 9,
        "oklch": "oklch(0.316 0.069 33.8)",
        "srgbFallback": "#4f2319",
        "hex": "#4f2319"
      },
      {
        "step": 10,
        "oklch": "oklch(0.226 0.06 33.8)",
        "srgbFallback": "#330f08",
        "hex": "#330f08"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#261815",
      "card": "#ffffff",
      "card-foreground": "#261815",
      "popover": "#ffffff",
      "popover-foreground": "#261815",
      "primary": "#b26d5d",
      "primary-foreground": "#ffffff",
      "secondary": "#ffcfc3",
      "secondary-foreground": "#261815",
      "muted": "#ffebe2",
      "muted-foreground": "#5b433d",
      "accent": "#ffebe2",
      "accent-foreground": "#261815",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#ccbbb7",
      "input": "#ccbbb7",
      "ring": "#b26d5d",
      "chart-1": "#b26d5d",
      "chart-2": "#edae9f",
      "chart-3": "#6d382c",
      "chart-4": "#d68e7d",
      "chart-5": "#4f2319"
    }
  },
  {
    "id": "theme.tanse.tuohe",
    "name": "驼褐",
    "familyId": "tanse",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "驼褐",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "柔和浅棕；适用家居、生活方式、内容。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.tanse.chahe",
    "name": "茶褐",
    "familyId": "tanse",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "茶褐",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "稳定中棕；适用餐饮、零售、人文工具。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.tanse.lise",
    "name": "栗色",
    "familyId": "tanse",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "栗色",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "深红棕；适用会员、高端消费、收藏。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.tanse.zheshi",
    "name": "赭石",
    "familyId": "tanse",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "赭石",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "土调橙棕；适用艺术、户外、传统工艺。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.yuebai.yuebai",
    "name": "月白",
    "familyId": "yuebai",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "月白",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "微蓝冷白；适用文档、知识、设计系统。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.952 0.007 233.4)",
        "srgbFallback": "#ebf0f3",
        "hex": "#ebf0f3"
      },
      {
        "step": 2,
        "oklch": "oklch(0.912 0.01 233.4)",
        "srgbFallback": "#dce3e8",
        "hex": "#dce3e8"
      },
      {
        "step": 3,
        "oklch": "oklch(0.842 0.015 233.4)",
        "srgbFallback": "#c2cdd3",
        "hex": "#c2cdd3"
      },
      {
        "step": 4,
        "oklch": "oklch(0.752 0.019 233.4)",
        "srgbFallback": "#a3b1b9",
        "hex": "#a3b1b9"
      },
      {
        "step": 5,
        "oklch": "oklch(0.662 0.023 233.4)",
        "srgbFallback": "#86969f",
        "hex": "#86969f"
      },
      {
        "step": 6,
        "oklch": "oklch(0.552 0.023 233.4)",
        "srgbFallback": "#66757e",
        "hex": "#66757e"
      },
      {
        "step": 7,
        "oklch": "oklch(0.452 0.021 233.4)",
        "srgbFallback": "#4b5860",
        "hex": "#4b5860"
      },
      {
        "step": 8,
        "oklch": "oklch(0.352 0.019 233.4)",
        "srgbFallback": "#313d44",
        "hex": "#313d44"
      },
      {
        "step": 9,
        "oklch": "oklch(0.262 0.017 233.4)",
        "srgbFallback": "#1c262c",
        "hex": "#1c262c"
      },
      {
        "step": 10,
        "oklch": "oklch(0.172 0.015 233.4)",
        "srgbFallback": "#091115",
        "hex": "#091115"
      }
    ],
    "resolvedTokens": {
      "background": "#ffffff",
      "foreground": "#0d1012",
      "card": "#ffffff",
      "card-foreground": "#0d1012",
      "popover": "#ffffff",
      "popover-foreground": "#0d1012",
      "primary": "#66757e",
      "primary-foreground": "#ffffff",
      "secondary": "#c2cdd3",
      "secondary-foreground": "#0d1012",
      "muted": "#dce3e8",
      "muted-foreground": "#373c3f",
      "accent": "#dce3e8",
      "accent-foreground": "#0d1012",
      "destructive": "#dc2626",
      "destructive-foreground": "#ffffff",
      "border": "#acafb1",
      "input": "#acafb1",
      "ring": "#66757e",
      "chart-1": "#66757e",
      "chart-2": "#a3b1b9",
      "chart-3": "#313d44",
      "chart-4": "#86969f",
      "chart-5": "#1c262c"
    }
  },
  {
    "id": "theme.yuebai.xiangyabai",
    "name": "象牙白",
    "familyId": "yuebai",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "象牙白",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "温润米白；适用阅读、家居、生活方式。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.yuebai.gaosu",
    "name": "缟素",
    "familyId": "yuebai",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "缟素",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "中性柔白；适用企业工具、表单、内容平台。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.yuebai.xuebai",
    "name": "雪白",
    "familyId": "yuebai",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "雪白",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "清亮纯白；适用医疗、科技、极简界面。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.yuebai.qianyun",
    "name": "浅云",
    "familyId": "yuebai",
    "modeSupport": "light-with-dark-preview",
    "traditionalColorRef": "浅云",
    "maturity": "experimental",
    "change": "new",
    "integration": "pending",
    "description": "淡冷灰白；适用后台、代码、低干扰背景。基准色待设计确认，色阶待生成。"
  },
  {
    "id": "theme.xuanqing.xuanqing",
    "name": "玄青",
    "familyId": "xuanqing",
    "modeSupport": "dark",
    "traditionalColorRef": "玄青",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "蓝调深黑；适用通用深色产品、数据工作台。基准色为工作参考值，基准色待设计确认，UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.977 0.008 260)",
        "srgbFallback": "#f4f8fd",
        "hex": "#f4f8fd"
      },
      {
        "step": 2,
        "oklch": "oklch(0.937 0.012 260)",
        "srgbFallback": "#e6ebf2",
        "hex": "#e6ebf2"
      },
      {
        "step": 3,
        "oklch": "oklch(0.867 0.017 260)",
        "srgbFallback": "#cdd4df",
        "hex": "#cdd4df"
      },
      {
        "step": 4,
        "oklch": "oklch(0.777 0.023 260)",
        "srgbFallback": "#aeb7c5",
        "hex": "#aeb7c5"
      },
      {
        "step": 5,
        "oklch": "oklch(0.687 0.026 260)",
        "srgbFallback": "#919bab",
        "hex": "#919bab"
      },
      {
        "step": 6,
        "oklch": "oklch(0.577 0.026 260)",
        "srgbFallback": "#717a8a",
        "hex": "#717a8a"
      },
      {
        "step": 7,
        "oklch": "oklch(0.477 0.024 260)",
        "srgbFallback": "#555d6b",
        "hex": "#555d6b"
      },
      {
        "step": 8,
        "oklch": "oklch(0.377 0.022 260)",
        "srgbFallback": "#3b424e",
        "hex": "#3b424e"
      },
      {
        "step": 9,
        "oklch": "oklch(0.287 0.02 260)",
        "srgbFallback": "#252b35",
        "hex": "#252b35"
      },
      {
        "step": 10,
        "oklch": "oklch(0.197 0.017 260)",
        "srgbFallback": "#11161d",
        "hex": "#11161d"
      }
    ],
    "resolvedTokens": {
      "background": "#11161d",
      "foreground": "#f4f8fd",
      "card": "#252b35",
      "card-foreground": "#f4f8fd",
      "popover": "#252b35",
      "popover-foreground": "#f4f8fd",
      "primary": "#919bab",
      "primary-foreground": "#11161d",
      "secondary": "#3b424e",
      "secondary-foreground": "#f4f8fd",
      "muted": "#3b424e",
      "muted-foreground": "#b2b7be",
      "accent": "#3b424e",
      "accent-foreground": "#f4f8fd",
      "destructive": "#ef4444",
      "destructive-foreground": "#ffffff",
      "border": "#5a5d61",
      "input": "#5a5d61",
      "ring": "#919bab",
      "chart-1": "#919bab",
      "chart-2": "#cdd4df",
      "chart-3": "#555d6b",
      "chart-4": "#aeb7c5",
      "chart-5": "#3b424e"
    }
  },
  {
    "id": "theme.xuanqing.xuanse",
    "name": "玄色",
    "familyId": "xuanqing",
    "modeSupport": "dark",
    "traditionalColorRef": "玄色",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "中性深黑；适用高端、沉浸、媒体产品。基准色为工作参考值，基准色待设计确认，UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.956 0.003 39.3)",
        "srgbFallback": "#f2f0ef",
        "hex": "#f2f0ef"
      },
      {
        "step": 2,
        "oklch": "oklch(0.916 0.004 39.3)",
        "srgbFallback": "#e6e2e1",
        "hex": "#e6e2e1"
      },
      {
        "step": 3,
        "oklch": "oklch(0.846 0.006 39.3)",
        "srgbFallback": "#d0cbc9",
        "hex": "#d0cbc9"
      },
      {
        "step": 4,
        "oklch": "oklch(0.756 0.008 39.3)",
        "srgbFallback": "#b5aeac",
        "hex": "#b5aeac"
      },
      {
        "step": 5,
        "oklch": "oklch(0.666 0.01 39.3)",
        "srgbFallback": "#9a9290",
        "hex": "#9a9290"
      },
      {
        "step": 6,
        "oklch": "oklch(0.556 0.01 39.3)",
        "srgbFallback": "#79726f",
        "hex": "#79726f"
      },
      {
        "step": 7,
        "oklch": "oklch(0.456 0.009 39.3)",
        "srgbFallback": "#5c5553",
        "hex": "#5c5553"
      },
      {
        "step": 8,
        "oklch": "oklch(0.356 0.008 39.3)",
        "srgbFallback": "#403b39",
        "hex": "#403b39"
      },
      {
        "step": 9,
        "oklch": "oklch(0.266 0.007 39.3)",
        "srgbFallback": "#292423",
        "hex": "#292423"
      },
      {
        "step": 10,
        "oklch": "oklch(0.176 0.006 39.3)",
        "srgbFallback": "#13100f",
        "hex": "#13100f"
      }
    ],
    "resolvedTokens": {
      "background": "#13100f",
      "foreground": "#f2f0ef",
      "card": "#292423",
      "card-foreground": "#f2f0ef",
      "popover": "#292423",
      "popover-foreground": "#f2f0ef",
      "primary": "#9a9290",
      "primary-foreground": "#13100f",
      "secondary": "#403b39",
      "secondary-foreground": "#f2f0ef",
      "muted": "#403b39",
      "muted-foreground": "#b2afae",
      "accent": "#403b39",
      "accent-foreground": "#f2f0ef",
      "destructive": "#ef4444",
      "destructive-foreground": "#ffffff",
      "border": "#585656",
      "input": "#585656",
      "ring": "#9a9290",
      "chart-1": "#9a9290",
      "chart-2": "#d0cbc9",
      "chart-3": "#5c5553",
      "chart-4": "#b5aeac",
      "chart-5": "#403b39"
    }
  },
  {
    "id": "theme.xuanqing.wuhei",
    "name": "乌黑",
    "familyId": "xuanqing",
    "modeSupport": "dark",
    "traditionalColorRef": "烏黑",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "纯净黑灰；适用视频、图片、展示工具。基准色为工作参考值，基准色待设计确认，UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.985 0 0)",
        "srgbFallback": "#fafafa",
        "hex": "#fafafa"
      },
      {
        "step": 2,
        "oklch": "oklch(0.947 0 0)",
        "srgbFallback": "#ededed",
        "hex": "#ededed"
      },
      {
        "step": 3,
        "oklch": "oklch(0.877 0 0)",
        "srgbFallback": "#d6d6d6",
        "hex": "#d6d6d6"
      },
      {
        "step": 4,
        "oklch": "oklch(0.787 0 0)",
        "srgbFallback": "#b9b9b9",
        "hex": "#b9b9b9"
      },
      {
        "step": 5,
        "oklch": "oklch(0.697 0 0)",
        "srgbFallback": "#9d9d9d",
        "hex": "#9d9d9d"
      },
      {
        "step": 6,
        "oklch": "oklch(0.587 0 0)",
        "srgbFallback": "#7c7c7c",
        "hex": "#7c7c7c"
      },
      {
        "step": 7,
        "oklch": "oklch(0.487 0 0)",
        "srgbFallback": "#5f5f5f",
        "hex": "#5f5f5f"
      },
      {
        "step": 8,
        "oklch": "oklch(0.387 0 0)",
        "srgbFallback": "#444444",
        "hex": "#444444"
      },
      {
        "step": 9,
        "oklch": "oklch(0.297 0 0)",
        "srgbFallback": "#2d2d2d",
        "hex": "#2d2d2d"
      },
      {
        "step": 10,
        "oklch": "oklch(0.207 0 0)",
        "srgbFallback": "#181818",
        "hex": "#181818"
      }
    ],
    "resolvedTokens": {
      "background": "#181818",
      "foreground": "#fafafa",
      "card": "#2d2d2d",
      "card-foreground": "#fafafa",
      "popover": "#2d2d2d",
      "popover-foreground": "#fafafa",
      "primary": "#9d9d9d",
      "primary-foreground": "#181818",
      "secondary": "#444444",
      "secondary-foreground": "#fafafa",
      "muted": "#444444",
      "muted-foreground": "#b9b9b9",
      "accent": "#444444",
      "accent-foreground": "#fafafa",
      "destructive": "#ef4444",
      "destructive-foreground": "#ffffff",
      "border": "#5f5f5f",
      "input": "#5f5f5f",
      "ring": "#9d9d9d",
      "chart-1": "#9d9d9d",
      "chart-2": "#d6d6d6",
      "chart-3": "#5f5f5f",
      "chart-4": "#b9b9b9",
      "chart-5": "#444444"
    }
  },
  {
    "id": "theme.xuanqing.mose",
    "name": "墨色",
    "familyId": "xuanqing",
    "modeSupport": "dark",
    "traditionalColorRef": "墨色",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "柔和暖黑；适用写作、阅读、文化内容。基准色为工作参考值，基准色待设计确认，UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.985 0.002 48.5)",
        "srgbFallback": "#fbfaf9",
        "hex": "#fbfaf9"
      },
      {
        "step": 2,
        "oklch": "oklch(0.971 0.003 48.5)",
        "srgbFallback": "#f7f5f3",
        "hex": "#f7f5f3"
      },
      {
        "step": 3,
        "oklch": "oklch(0.901 0.004 48.5)",
        "srgbFallback": "#e1dddc",
        "hex": "#e1dddc"
      },
      {
        "step": 4,
        "oklch": "oklch(0.811 0.006 48.5)",
        "srgbFallback": "#c4c0be",
        "hex": "#c4c0be"
      },
      {
        "step": 5,
        "oklch": "oklch(0.721 0.007 48.5)",
        "srgbFallback": "#a8a4a1",
        "hex": "#a8a4a1"
      },
      {
        "step": 6,
        "oklch": "oklch(0.611 0.007 48.5)",
        "srgbFallback": "#878280",
        "hex": "#878280"
      },
      {
        "step": 7,
        "oklch": "oklch(0.511 0.006 48.5)",
        "srgbFallback": "#696563",
        "hex": "#696563"
      },
      {
        "step": 8,
        "oklch": "oklch(0.411 0.006 48.5)",
        "srgbFallback": "#4d4a48",
        "hex": "#4d4a48"
      },
      {
        "step": 9,
        "oklch": "oklch(0.321 0.005 48.5)",
        "srgbFallback": "#353231",
        "hex": "#353231"
      },
      {
        "step": 10,
        "oklch": "oklch(0.231 0.004 48.5)",
        "srgbFallback": "#1f1c1b",
        "hex": "#1f1c1b"
      }
    ],
    "resolvedTokens": {
      "background": "#1f1c1b",
      "foreground": "#fbfaf9",
      "card": "#353231",
      "card-foreground": "#fbfaf9",
      "popover": "#353231",
      "popover-foreground": "#fbfaf9",
      "primary": "#a8a4a1",
      "primary-foreground": "#1f1c1b",
      "secondary": "#4d4a48",
      "secondary-foreground": "#fbfaf9",
      "muted": "#4d4a48",
      "muted-foreground": "#c3c1bf",
      "accent": "#4d4a48",
      "accent-foreground": "#fbfaf9",
      "destructive": "#ef4444",
      "destructive-foreground": "#ffffff",
      "border": "#676665",
      "input": "#676665",
      "ring": "#a8a4a1",
      "chart-1": "#a8a4a1",
      "chart-2": "#e1dddc",
      "chart-3": "#696563",
      "chart-4": "#c4c0be",
      "chart-5": "#4d4a48"
    }
  },
  {
    "id": "theme.xuanqing.baicaoshuang",
    "name": "百草霜",
    "familyId": "xuanqing",
    "modeSupport": "dark",
    "traditionalColorRef": "百草霜",
    "maturity": "experimental",
    "change": "new",
    "integration": "integrated",
    "description": "低对比烟灰黑；适用长时工作、专业编辑器。基准色为工作参考值，基准色待设计确认，UI 主色待校准。",
    "scale": [
      {
        "step": 1,
        "oklch": "oklch(0.953 0.002 78.3)",
        "srgbFallback": "#f0efee",
        "hex": "#f0efee"
      },
      {
        "step": 2,
        "oklch": "oklch(0.913 0.003 78.3)",
        "srgbFallback": "#e3e2e0",
        "hex": "#e3e2e0"
      },
      {
        "step": 3,
        "oklch": "oklch(0.843 0.004 78.3)",
        "srgbFallback": "#cdcbc9",
        "hex": "#cdcbc9"
      },
      {
        "step": 4,
        "oklch": "oklch(0.753 0.005 78.3)",
        "srgbFallback": "#b1afab",
        "hex": "#b1afab"
      },
      {
        "step": 5,
        "oklch": "oklch(0.663 0.006 78.3)",
        "srgbFallback": "#95938f",
        "hex": "#95938f"
      },
      {
        "step": 6,
        "oklch": "oklch(0.553 0.006 78.3)",
        "srgbFallback": "#74726f",
        "hex": "#74726f"
      },
      {
        "step": 7,
        "oklch": "oklch(0.453 0.005 78.3)",
        "srgbFallback": "#585653",
        "hex": "#585653"
      },
      {
        "step": 8,
        "oklch": "oklch(0.353 0.005 78.3)",
        "srgbFallback": "#3d3b39",
        "hex": "#3d3b39"
      },
      {
        "step": 9,
        "oklch": "oklch(0.263 0.004 78.3)",
        "srgbFallback": "#262522",
        "hex": "#262522"
      },
      {
        "step": 10,
        "oklch": "oklch(0.173 0.004 78.3)",
        "srgbFallback": "#11100e",
        "hex": "#11100e"
      }
    ],
    "resolvedTokens": {
      "background": "#11100e",
      "foreground": "#f0efee",
      "card": "#262522",
      "card-foreground": "#f0efee",
      "popover": "#262522",
      "popover-foreground": "#f0efee",
      "primary": "#95938f",
      "primary-foreground": "#11100e",
      "secondary": "#3d3b39",
      "secondary-foreground": "#f0efee",
      "muted": "#3d3b39",
      "muted-foreground": "#b0afad",
      "accent": "#3d3b39",
      "accent-foreground": "#f0efee",
      "destructive": "#ef4444",
      "destructive-foreground": "#ffffff",
      "border": "#565655",
      "input": "#565655",
      "ring": "#95938f",
      "chart-1": "#95938f",
      "chart-2": "#cdcbc9",
      "chart-3": "#585653",
      "chart-4": "#b1afab",
      "chart-5": "#3d3b39"
    }
  }
];
