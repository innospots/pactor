/**
 * 皮肤令牌元数据：驱动 TokenEditor 的分组渲染与输入控件选型。
 *
 * 清单与 `packages/ui/src/styles.css` 的 `:root` 自定义属性一一对应，
 * 由 tests/tokens.test.ts 做双向比对防漂移（新增/删除令牌需同步本文件）。
 *
 * 类型语义（仅决定编辑器控件形态）：
 * - color  → 原生 `<input type="color">` 取色器 + hex 文本框
 * - length → 文本输入（尺寸 / 圆角 / 阴影等 CSS 值）
 * - font   → 文本输入（字体族）
 * - image  → 文本输入（背景图 / 渐变，默认 none）
 */

export type TokenType = 'color' | 'length' | 'font' | 'image';

/** 数值型令牌（长度单位 px/rem）的滑杆范围 */
export interface SliderRange {
  min: number;
  max: number;
  step: number;
}

/** Radio 档位选项（令牌值为离散档位时使用） */
export interface RadioOption {
  label: string;
  value: string;
}

export interface TokenMeta {
  /** 令牌名（含 -- 前缀），与 styles.css 的 :root 声明一致 */
  name: string;
  type: TokenType;
  /** 用途说明（编辑器内展示） */
  description: string;
  /** styles.css 中的默认值（展示参考；编辑初始值为空=不覆盖） */
  defaultValue: string;
  /** 数值型令牌提供滑杆调节（长度单位 px/rem）；无则仅文本输入 */
  slider?: SliderRange;
  /** 离散档位令牌提供 Radio 切换（与文本输入并存，值匹配时高亮） */
  radio?: RadioOption[];
  /** 派生令牌：默认由其它令牌 calc 派生，编辑器中只读展示（仍可被皮肤 CSS 单独覆盖） */
  derived?: boolean;
}

export interface TokenGroup {
  key: string;
  title: string;
  tokens: TokenMeta[];
}

export const TOKEN_GROUPS: TokenGroup[] = [
  {
    key: 'color',
    title: '颜色',
    tokens: [
      { name: '--background', type: 'color', description: '页面背景（纯色）', defaultValue: 'oklch(1 0 0)' },
      { name: '--foreground', type: 'color', description: '主文字颜色', defaultValue: 'oklch(0.145 0 0)' },
      { name: '--card', type: 'color', description: '卡片表面背景', defaultValue: 'oklch(1 0 0)' },
      { name: '--card-foreground', type: 'color', description: '卡片上的文字', defaultValue: 'oklch(0.145 0 0)' },
      { name: '--popover', type: 'color', description: '浮起表面（弹层 / 下拉 / Toast）', defaultValue: 'oklch(1 0 0)' },
      { name: '--popover-foreground', type: 'color', description: '浮起表面上的文字', defaultValue: 'oklch(0.145 0 0)' },
      { name: '--primary', type: 'color', description: '主色实体（主按钮、激活态）', defaultValue: 'oklch(0.205 0 0)' },
      { name: '--primary-foreground', type: 'color', description: '主色上的文字', defaultValue: 'oklch(0.985 0 0)' },
      { name: '--secondary', type: 'color', description: '次级表面', defaultValue: 'oklch(0.97 0 0)' },
      { name: '--secondary-foreground', type: 'color', description: '次级表面上的文字', defaultValue: 'oklch(0.205 0 0)' },
      { name: '--accent', type: 'color', description: '强调底（选中、悬浮）', defaultValue: 'oklch(0.97 0 0)' },
      { name: '--accent-foreground', type: 'color', description: '强调底上的文字', defaultValue: 'oklch(0.205 0 0)' },
      { name: '--muted', type: 'color', description: '弱背景（表头、悬浮态）', defaultValue: 'oklch(0.97 0 0)' },
      { name: '--muted-foreground', type: 'color', description: '次级文字', defaultValue: 'oklch(0.556 0 0)' },
      { name: '--destructive', type: 'color', description: '危险语义（error / danger）', defaultValue: 'oklch(0.577 0.245 27.325)' },
      { name: '--destructive-foreground', type: 'color', description: '危险色上的文字', defaultValue: 'oklch(0.985 0 0)' },
      { name: '--success', type: 'color', description: '成功语义（Alert 四态）', defaultValue: 'oklch(0.696 0.17 162.48)' },
      { name: '--warning', type: 'color', description: '警告语义（Alert 四态）', defaultValue: 'oklch(0.769 0.188 70.08)' },
      { name: '--info', type: 'color', description: '信息语义（Alert 四态）', defaultValue: 'oklch(0.623 0.214 259.815)' },
      { name: '--border', type: 'color', description: '常规边框', defaultValue: 'oklch(0.922 0 0)' },
      { name: '--input', type: 'color', description: '输入控件边框', defaultValue: 'oklch(0.922 0 0)' },
      { name: '--ring', type: 'color', description: '焦点环颜色', defaultValue: 'oklch(0.708 0 0)' },
      { name: '--chart-1', type: 'color', description: '图表色 1', defaultValue: 'oklch(0.646 0.222 41.116)' },
      { name: '--chart-2', type: 'color', description: '图表色 2', defaultValue: 'oklch(0.6 0.118 184.704)' },
      { name: '--chart-3', type: 'color', description: '图表色 3', defaultValue: 'oklch(0.398 0.07 227.392)' },
      { name: '--chart-4', type: 'color', description: '图表色 4', defaultValue: 'oklch(0.828 0.189 84.429)' },
      { name: '--chart-5', type: 'color', description: '图表色 5', defaultValue: 'oklch(0.769 0.188 70.08)' },
      { name: '--sidebar', type: 'color', description: '侧栏表面', defaultValue: 'var(--card)' },
      { name: '--sidebar-foreground', type: 'color', description: '侧栏文字', defaultValue: 'var(--card-foreground)' },
      { name: '--sidebar-primary', type: 'color', description: '侧栏主色', defaultValue: 'var(--primary)' },
      { name: '--sidebar-primary-foreground', type: 'color', description: '侧栏主色文字', defaultValue: 'var(--primary-foreground)' },
      { name: '--sidebar-accent', type: 'color', description: '侧栏强调底', defaultValue: 'var(--accent)' },
      { name: '--sidebar-accent-foreground', type: 'color', description: '侧栏强调文字', defaultValue: 'var(--accent-foreground)' },
      { name: '--sidebar-border', type: 'color', description: '侧栏边框', defaultValue: 'var(--border)' },
      { name: '--sidebar-ring', type: 'color', description: '侧栏焦点环', defaultValue: 'var(--ring)' },
      { name: '--switch-track', type: 'color', description: 'Switch 轨道', defaultValue: 'var(--input)' },
      { name: '--switch-track-checked', type: 'color', description: 'Switch 轨道（选中）', defaultValue: 'var(--primary)' },
      { name: '--switch-thumb', type: 'color', description: 'Switch 滑块', defaultValue: 'var(--card)' },
      { name: '--slider-track', type: 'color', description: 'Slider 轨道', defaultValue: 'var(--muted)' },
      { name: '--slider-range', type: 'color', description: 'Slider 已选进度', defaultValue: 'var(--primary)' },
      { name: '--slider-thumb', type: 'color', description: 'Slider 滑块', defaultValue: 'var(--card)' },
      { name: '--radio-border', type: 'color', description: 'Radio 圆圈边框', defaultValue: 'var(--input)' },
      { name: '--radio-checked', type: 'color', description: 'Radio 选中圆点', defaultValue: 'var(--primary)' },
      { name: '--progress-track', type: 'color', description: 'Progress 轨道', defaultValue: 'var(--muted)' },
      { name: '--progress-indicator', type: 'color', description: 'Progress 进度条', defaultValue: 'var(--primary)' },
      { name: '--pagination-active-background', type: 'color', description: '当前页背景', defaultValue: 'var(--card)' },
      { name: '--pagination-active-border', type: 'color', description: '当前页边框', defaultValue: 'var(--border)' },
      { name: '--menu-hover-background', type: 'color', description: '菜单 hover 背景', defaultValue: 'var(--accent)' },
      { name: '--menu-hover-foreground', type: 'color', description: '菜单 hover 文字', defaultValue: 'var(--accent-foreground)' },
      { name: '--menu-active-background', type: 'color', description: '菜单选中背景', defaultValue: 'var(--accent)' },
      { name: '--menu-active-foreground', type: 'color', description: '菜单选中文字', defaultValue: 'var(--accent-foreground)' },
      { name: '--bubble-background', type: 'color', description: '气泡背景（tinted）', defaultValue: 'oklch(from var(--primary) 0.93 calc(c * 0.4) h)' },
      { name: '--bubble-hover-background', type: 'color', description: '气泡 hover（tinted）', defaultValue: 'oklch(from var(--primary) 0.88 calc(c * 0.5) h)' },
      { name: '--calendar-day-hover-background', type: 'color', description: '日历 hover 背景', defaultValue: 'var(--accent)' },
      { name: '--calendar-day-hover-foreground', type: 'color', description: '日历 hover 文字', defaultValue: 'var(--accent-foreground)' },
      { name: '--calendar-selected-background', type: 'color', description: '日历选中日背景', defaultValue: 'var(--primary)' },
      { name: '--calendar-selected-foreground', type: 'color', description: '日历选中日文字', defaultValue: 'var(--primary-foreground)' },
      { name: '--calendar-today-background', type: 'color', description: '日历今日背景', defaultValue: 'var(--accent)' },
      { name: '--calendar-today-foreground', type: 'color', description: '日历今日文字', defaultValue: 'var(--accent-foreground)' },
      { name: '--calendar-today-border', type: 'color', description: '日历今日边框', defaultValue: 'var(--primary)' },
      { name: '--calendar-range-background', type: 'color', description: '日历范围中间日背景', defaultValue: 'var(--accent)' },
      { name: '--calendar-range-foreground', type: 'color', description: '日历范围中间日文字', defaultValue: 'var(--accent-foreground)' },
    ],
  },
  {
    key: 'size',
    title: '尺寸',
    tokens: [
      { name: '--radius', type: 'length', description: '圆角基准（sm/md/lg/xl… 由其乘法派生）', defaultValue: '0.625rem', slider: { min: 0, max: 2, step: 0.125 } },
      { name: '--flex-gap', type: 'length', description: 'Flex 间距基准（sm/md/lg 档位按比例派生）', defaultValue: '12px', radio: [
        { label: '紧凑', value: '8px' },
        { label: '标准', value: '12px' },
        { label: '宽松', value: '16px' },
      ] },
      { name: '--flex-gap-sm', type: 'length', description: 'Flex gap=small 档位（默认 ×0.67 派生）', defaultValue: 'calc(var(--flex-gap) * 0.67)', derived: true },
      { name: '--flex-gap-md', type: 'length', description: 'Flex gap=middle 档位（默认 ×1.33 派生）', defaultValue: 'calc(var(--flex-gap) * 1.33)', derived: true },
      { name: '--flex-gap-lg', type: 'length', description: 'Flex gap=large 档位（默认 ×2 派生）', defaultValue: 'calc(var(--flex-gap) * 2)', derived: true },
      { name: '--grid-gap', type: 'length', description: 'Grid 未指定 gap 时的默认栏间距', defaultValue: '16px', slider: { min: 0, max: 48, step: 1 } },
      { name: '--pagination-active-radius', type: 'length', description: 'Pagination 当前页圆角', defaultValue: 'calc(var(--radius) * 0.8)' },
      { name: '--sidebar-width', type: 'length', description: 'Sidebar 展开宽度（桌面端）', defaultValue: '16rem', slider: { min: 12, max: 24, step: 0.5 } },
      { name: '--sidebar-width-icon', type: 'length', description: 'Sidebar 折叠后的 icon rail 宽度', defaultValue: '3rem', slider: { min: 2, max: 5, step: 0.25 } },
    ],
  },
  {
    key: 'style',
    title: '风格',
    tokens: [
      { name: '--font-sans', type: 'font', description: '全局字体族（body 及继承）', defaultValue: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" },
      { name: '--background-image', type: 'image', description: '页面背景渐变或图片，与 --background 叠加', defaultValue: 'none' },
      { name: '--card-shadow', type: 'length', description: '卡片阴影', defaultValue: 'none' },
      { name: '--overlay-background', type: 'color', description: '模态遮罩（Dialog / Sheet / Drawer 幕布）', defaultValue: 'oklch(0 0 0 / 50%)' },
      { name: '--shadow-color', type: 'color', description: '弹层阴影颜色', defaultValue: 'oklch(0 0 0 / 10%)' },
    ],
  },
];

/** 全部令牌名（扁平清单，与 styles.css :root 一一对应，供测试比对） */
export const TOKEN_NAMES: string[] = TOKEN_GROUPS.flatMap((group) =>
  group.tokens.map((token) => token.name),
);
