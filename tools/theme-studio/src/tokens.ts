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

export interface TokenMeta {
  /** 令牌名（含 -- 前缀），与 styles.css 的 :root 声明一致 */
  name: string;
  type: TokenType;
  /** 用途说明（编辑器内展示） */
  description: string;
  /** styles.css 中的默认值（展示参考；编辑初始值为空=不覆盖） */
  defaultValue: string;
}

export interface TokenGroup {
  key: string;
  title: string;
  tokens: TokenMeta[];
}

export const TOKEN_GROUPS: TokenGroup[] = [
  {
    key: 'page',
    title: '页面背景与文字',
    tokens: [
      { name: '--background', type: 'color', description: '页面背景（纯色）', defaultValue: 'oklch(1 0 0)' },
      { name: '--background-image', type: 'image', description: '页面背景渐变或图片（默认 none），与 --background 叠加', defaultValue: 'none' },
      { name: '--foreground', type: 'color', description: '主文字颜色', defaultValue: 'oklch(0.145 0 0)' },
      { name: '--font-sans', type: 'font', description: '全局字体族（body 及继承）', defaultValue: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" },
    ],
  },
  {
    key: 'surface',
    title: '表面（卡片 / 浮层）',
    tokens: [
      { name: '--card', type: 'color', description: '卡片表面背景', defaultValue: 'oklch(1 0 0)' },
      { name: '--card-foreground', type: 'color', description: '卡片上的文字', defaultValue: 'oklch(0.145 0 0)' },
      { name: '--card-shadow', type: 'length', description: '卡片阴影（默认 none）', defaultValue: 'none' },
      { name: '--popover', type: 'color', description: '浮起表面（弹层 / 下拉 / Toast）', defaultValue: 'oklch(1 0 0)' },
      { name: '--popover-foreground', type: 'color', description: '浮起表面上的文字', defaultValue: 'oklch(0.145 0 0)' },
      { name: '--overlay-background', type: 'color', description: '模态遮罩（Dialog / Sheet / Drawer 幕布）', defaultValue: 'oklch(0 0 0 / 50%)' },
      { name: '--shadow-color', type: 'color', description: '弹层阴影颜色', defaultValue: 'oklch(0 0 0 / 10%)' },
    ],
  },
  {
    key: 'brand',
    title: '主色与强调',
    tokens: [
      { name: '--primary', type: 'color', description: '主色实体（主按钮、激活态）', defaultValue: 'oklch(0.205 0 0)' },
      { name: '--primary-foreground', type: 'color', description: '主色上的文字（须与 --primary 成对覆盖）', defaultValue: 'oklch(0.985 0 0)' },
      { name: '--secondary', type: 'color', description: '次级表面', defaultValue: 'oklch(0.97 0 0)' },
      { name: '--secondary-foreground', type: 'color', description: '次级表面上的文字', defaultValue: 'oklch(0.205 0 0)' },
      { name: '--accent', type: 'color', description: '强调底（选中、悬浮）', defaultValue: 'oklch(0.97 0 0)' },
      { name: '--accent-foreground', type: 'color', description: '强调底上的文字', defaultValue: 'oklch(0.205 0 0)' },
      { name: '--muted', type: 'color', description: '弱背景（表头、悬浮态）', defaultValue: 'oklch(0.97 0 0)' },
      { name: '--muted-foreground', type: 'color', description: '次级文字', defaultValue: 'oklch(0.556 0 0)' },
    ],
  },
  {
    key: 'semantic',
    title: '语义色',
    tokens: [
      { name: '--destructive', type: 'color', description: '危险语义（error / danger）', defaultValue: 'oklch(0.577 0.245 27.325)' },
      { name: '--destructive-foreground', type: 'color', description: '危险色上的文字', defaultValue: 'oklch(0.985 0 0)' },
      { name: '--success', type: 'color', description: '成功语义（Alert 四态）', defaultValue: 'oklch(0.696 0.17 162.48)' },
      { name: '--warning', type: 'color', description: '警告语义（Alert 四态）', defaultValue: 'oklch(0.769 0.188 70.08)' },
      { name: '--info', type: 'color', description: '信息语义（Alert 四态）', defaultValue: 'oklch(0.623 0.214 259.815)' },
    ],
  },
  {
    key: 'border',
    title: '边框与焦点',
    tokens: [
      { name: '--border', type: 'color', description: '常规边框', defaultValue: 'oklch(0.922 0 0)' },
      { name: '--input', type: 'color', description: '输入控件边框', defaultValue: 'oklch(0.922 0 0)' },
      { name: '--ring', type: 'color', description: '焦点环颜色', defaultValue: 'oklch(0.708 0 0)' },
    ],
  },
  {
    key: 'shape',
    title: '形状',
    tokens: [
      { name: '--radius', type: 'length', description: '圆角基准（sm/md/lg/xl… 由其乘法派生）', defaultValue: '0.625rem' },
    ],
  },
  {
    key: 'chart',
    title: '图表色板',
    tokens: [
      { name: '--chart-1', type: 'color', description: '图表色板 1（按序循环取色）', defaultValue: 'oklch(0.646 0.222 41.116)' },
      { name: '--chart-2', type: 'color', description: '图表色板 2', defaultValue: 'oklch(0.6 0.118 184.704)' },
      { name: '--chart-3', type: 'color', description: '图表色板 3', defaultValue: 'oklch(0.398 0.07 227.392)' },
      { name: '--chart-4', type: 'color', description: '图表色板 4', defaultValue: 'oklch(0.828 0.189 84.429)' },
      { name: '--chart-5', type: 'color', description: '图表色板 5', defaultValue: 'oklch(0.769 0.188 70.08)' },
    ],
  },
  {
    key: 'sidebar',
    title: '侧栏',
    tokens: [
      { name: '--sidebar', type: 'color', description: '侧栏表面', defaultValue: 'oklch(0.985 0 0)' },
      { name: '--sidebar-foreground', type: 'color', description: '侧栏文字', defaultValue: 'oklch(0.145 0 0)' },
      { name: '--sidebar-primary', type: 'color', description: '侧栏主色', defaultValue: 'oklch(0.205 0 0)' },
      { name: '--sidebar-primary-foreground', type: 'color', description: '侧栏主色上的文字', defaultValue: 'oklch(0.985 0 0)' },
      { name: '--sidebar-accent', type: 'color', description: '侧栏强调底', defaultValue: 'oklch(0.97 0 0)' },
      { name: '--sidebar-accent-foreground', type: 'color', description: '侧栏强调底上的文字', defaultValue: 'oklch(0.205 0 0)' },
      { name: '--sidebar-border', type: 'color', description: '侧栏边框', defaultValue: 'oklch(0.922 0 0)' },
      { name: '--sidebar-ring', type: 'color', description: '侧栏焦点环', defaultValue: 'oklch(0.708 0 0)' },
    ],
  },
  {
    key: 'switch-slider',
    title: '组件级：Switch / Slider',
    tokens: [
      { name: '--switch-track', type: 'color', description: 'Switch 轨道（未选中），默认 var(--input)', defaultValue: 'var(--input)' },
      { name: '--switch-track-checked', type: 'color', description: 'Switch 轨道（选中），默认 var(--primary)', defaultValue: 'var(--primary)' },
      { name: '--switch-thumb', type: 'color', description: 'Switch 滑块，默认 var(--background)', defaultValue: 'var(--background)' },
      { name: '--slider-track', type: 'color', description: 'Slider 轨道，默认 var(--muted)', defaultValue: 'var(--muted)' },
      { name: '--slider-range', type: 'color', description: 'Slider 已选进度，默认 var(--primary)', defaultValue: 'var(--primary)' },
      { name: '--slider-thumb', type: 'color', description: 'Slider 滑块，默认 var(--background)', defaultValue: 'var(--background)' },
    ],
  },
  {
    key: 'radio-progress',
    title: '组件级：Radio / Progress',
    tokens: [
      { name: '--radio-border', type: 'color', description: 'Radio 圆圈边框（默认），默认 var(--input)', defaultValue: 'var(--input)' },
      { name: '--radio-checked', type: 'color', description: 'Radio 选中（边框与圆点），默认 var(--primary)', defaultValue: 'var(--primary)' },
      { name: '--progress-track', type: 'color', description: 'Progress 背景轨道，默认 var(--muted)', defaultValue: 'var(--muted)' },
      { name: '--progress-indicator', type: 'color', description: 'Progress 进度条，默认 var(--primary)', defaultValue: 'var(--primary)' },
    ],
  },
  {
    key: 'pagination-menu',
    title: '组件级：Pagination / Menu',
    tokens: [
      { name: '--pagination-active-background', type: 'color', description: 'Pagination 当前页背景，默认 var(--background)', defaultValue: 'var(--background)' },
      { name: '--pagination-active-border', type: 'color', description: 'Pagination 当前页边框，默认 var(--border)', defaultValue: 'var(--border)' },
      { name: '--pagination-active-radius', type: 'length', description: 'Pagination 当前页圆角', defaultValue: 'calc(var(--radius) * 0.8)' },
      { name: '--menu-hover-background', type: 'color', description: '菜单项 hover 背景（Menu / DropdownMenu / Select 列表等共用），默认 var(--accent)', defaultValue: 'var(--accent)' },
      { name: '--menu-hover-foreground', type: 'color', description: '菜单项 hover 文字，默认 var(--accent-foreground)', defaultValue: 'var(--accent-foreground)' },
      { name: '--menu-active-background', type: 'color', description: '菜单项选中/展开背景，默认 var(--accent)', defaultValue: 'var(--accent)' },
      { name: '--menu-active-foreground', type: 'color', description: '菜单项选中/展开文字，默认 var(--accent-foreground)', defaultValue: 'var(--accent-foreground)' },
    ],
  },
  {
    key: 'bubble',
    title: '组件级：聊天气泡',
    tokens: [
      { name: '--bubble-background', type: 'color', description: 'Bubble tinted 变体背景，默认由 --primary 派生', defaultValue: 'oklch(from var(--primary) 0.93 calc(c * 0.4) h)' },
      { name: '--bubble-hover-background', type: 'color', description: 'Bubble tinted 变体 hover 背景', defaultValue: 'oklch(from var(--primary) 0.88 calc(c * 0.5) h)' },
    ],
  },
  {
    key: 'calendar',
    title: '组件级：Calendar',
    tokens: [
      { name: '--calendar-day-hover-background', type: 'color', description: 'Calendar 日期 hover 背景，默认 var(--accent)', defaultValue: 'var(--accent)' },
      { name: '--calendar-day-hover-foreground', type: 'color', description: 'Calendar 日期 hover 文字，默认 var(--accent-foreground)', defaultValue: 'var(--accent-foreground)' },
      { name: '--calendar-selected-background', type: 'color', description: 'Calendar 选中日背景，默认 var(--primary)', defaultValue: 'var(--primary)' },
      { name: '--calendar-selected-foreground', type: 'color', description: 'Calendar 选中日文字，默认 var(--primary-foreground)', defaultValue: 'var(--primary-foreground)' },
      { name: '--calendar-today-background', type: 'color', description: 'Calendar 今日背景，默认 var(--accent)', defaultValue: 'var(--accent)' },
      { name: '--calendar-today-foreground', type: 'color', description: 'Calendar 今日文字，默认 var(--accent-foreground)', defaultValue: 'var(--accent-foreground)' },
    ],
  },
];

/** 全部令牌名（扁平清单，与 styles.css :root 一一对应，供测试比对） */
export const TOKEN_NAMES: string[] = TOKEN_GROUPS.flatMap((group) =>
  group.tokens.map((token) => token.name),
);
