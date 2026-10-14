/**
 * 资产库数据层类型基座。
 * 资产内容以 Git 维护的结构化静态数据文件驱动，构建期内嵌于站点；
 * 规范 ID 是唯一引用键，展示名称可本地化、不得作为引用键。
 */

// ===== 三轨状态字段 =====

/** 成熟度：稳定 / 实验 / 废弃 */
export type Maturity = 'stable' | 'experimental' | 'deprecated';

/** 变更标识：本期新增 / 本期更新；缺省表示无变更 */
export type ChangeFlag = 'new' | 'updated';

/** 接入状态：已接入 / 待资产接入（待接入条目不展示模拟内容） */
export type Integration = 'integrated' | 'pending';

/** 外链可用性：可用 / 需复核 / 受限 / 失效（仅用于外部资源） */
export type LinkAvailability = 'available' | 'needs-review' | 'restricted' | 'broken';

// ===== 基座字段 =====

/** 所有资产条目共享的基座字段 */
export interface AssetBase {
  /** 稳定规范 ID，全局唯一，命名规范见 scripts/validate.ts */
  id: string;
  /** 展示名称，可本地化或调整，不得作为引用键 */
  name: string;
  maturity: Maturity;
  /** 变更标识 */
  change?: ChangeFlag;
  integration: Integration;
  /** 废弃条目必填，指向现存条目 id */
  replacedBy?: string;
  description: string;
}

/** 外链条目基座：面向外部资源的条目必须声明可用性 */
export interface ExternalLinkFields extends AssetBase {
  availability: LinkAvailability;
  url: string;
  /** 外链域名（展示用，如 "example.com"） */
  domain?: string;
}

/** 素材权利字段：全部独立拆分，禁止合并为单一「授权状态」字段 */
export interface RightsFields {
  /** 来源 / 出处说明 */
  provenance: string;
  /** 许可证名称 */
  license: string;
  /** 是否要求署名 */
  attributionRequired: boolean;
  /** 是否允许商用 */
  commercialUse: boolean;
  /** 是否允许修改 */
  modification: boolean;
  /** 是否允许再分发 */
  redistribution: boolean;
  /** 交付方式：站内打包 / 远程外链 / 复制即用 */
  deliveryMode: 'bundled' | 'remote' | 'copy';
  /** 权利审核状态：待审核 / 已通过 / 已拒绝 */
  reviewState: 'pending' | 'approved' | 'rejected';
}

// ===== 样式 Token =====

export type TokenType =
  | 'color'
  | 'spacing'
  | 'radius'
  | 'fontFamily'
  | 'fontSize'
  | 'fontWeight'
  | 'lineHeight'
  | 'shadow'
  | 'opacity'
  | 'zIndex'
  | 'duration'
  | 'easing'
  | 'other';

/** Token 层级：基础 / 语义 / 组件 */
export type TokenLayer = 'primitive' | 'semantic' | 'component';

/** Token 模式：浅色 / 深色 / 双模式通用 */
export type TokenMode = 'light' | 'dark' | 'both';

/**
 * 设计 Token：路径式规范 ID（如 color.brand.500，至少两段）。
 * value 与 alias 互斥：要么给出具体值，要么别名引用另一 Token id。
 */
export type DesignToken = AssetBase & {
  layer: TokenLayer;
  type: TokenType;
  mode: TokenMode;
  /** 数值单位（px/rem/ms 等） */
  unit?: string;
  /** 对外输出的 CSS 变量名（如 --pactor-color-brand-500） */
  cssVar?: string;
} & (
    | { /** 具体值 */ value: string; alias?: never }
    | { /** 别名引用的 Token id */ alias: string; value?: never }
  );

// ===== 组件 =====

/** 组件二级分类（10 个） */
export type ComponentCategoryId =
  | 'general' // 通用
  | 'layout' // 布局
  | 'navigation' // 导航
  | 'data-entry' // 数据录入
  | 'data-display' // 数据展示
  | 'feedback' // 反馈
  | 'charts' // 图表
  | 'media' // 媒体与内容
  | 'ai-chat' // AI 与会话
  | 'blocks'; // 区块组件

export interface ComponentEntry extends AssetBase {
  category: ComponentCategoryId;
  /** 组件用途 */
  purpose: string;
  /** 关联 DesignToken id 列表 */
  tokenRefs?: string[];
}

// ===== 主题 =====

/** 主题色系 ID（16 个） */
export type ThemeFamilyId =
  | 'zhusha' // 朱砂
  | 'yanli' // 胭脂
  | 'haitang' // 海棠
  | 'xiangye' // 缃叶
  | 'zhizi' // 栀子
  | 'qiuxiang' // 秋香
  | 'zhuqing' // 竹青
  | 'songhua' // 松花
  | 'tianqing' // 天青
  | 'kongquelan' // 孔雀蓝
  | 'qunqing' // 群青
  | 'dailan' // 黛蓝
  | 'tengluo' // 藤萝
  | 'tanse' // 檀色
  | 'yuebai' // 月白
  | 'xuanqing'; // 玄青

/** 色系 ID 全集（构建期校验用） */
export const THEME_FAMILY_IDS: readonly ThemeFamilyId[] = [
  'zhusha',
  'yanli',
  'haitang',
  'xiangye',
  'zhizi',
  'qiuxiang',
  'zhuqing',
  'songhua',
  'tianqing',
  'kongquelan',
  'qunqing',
  'dailan',
  'tengluo',
  'tanse',
  'yuebai',
  'xuanqing',
];

/** 色系：规范 ID 为 family.<familyId>（如 family.zhusha） */
export interface ThemeFamily extends AssetBase {
  /** 下辖主题 id 列表；可由 theme.* 数据推导，故可选 */
  memberThemeIds?: string[];
}

/** 主题模式支持：仅浅色 / 浅色+深色预览 / 深色 / 双模式 */
export type ThemeModeSupport =
  | 'light-only'
  | 'light-with-dark-preview'
  | 'dark'
  | 'dual';

/** 色阶条目：step 1-10，OKLCH 为主、附 sRGB 回退与 HEX */
export interface ThemeScaleEntry {
  /** 色阶步进（1-10） */
  step: number;
  oklch: string;
  srgbFallback: string;
  hex: string;
}

/** 主题：规范 ID 为 theme.<familyId>.<name>，ID 第二段必须与 familyId 一致 */
export interface ThemeEntry extends AssetBase {
  /** 所属色系（引用 ThemeFamily，实际 id 为 family.<familyId>） */
  familyId: ThemeFamilyId;
  /** 差量主题：基础主题 id */
  baseThemeId?: string;
  /** 差量主题：基础主题版本 */
  baseThemeVersion?: string;
  modeSupport: ThemeModeSupport;
  /** 传统色出处引用 */
  traditionalColorRef?: string;
  /** OKLCH 色阶（step 1-10） */
  scale?: ThemeScaleEntry[];
  /** 差量配置：相对基础主题的覆盖项 */
  overrides?: Record<string, string>;
  /** 完整解析后的 token 映射 */
  resolvedTokens?: Record<string, string>;
}

// ===== 模板 =====

/** 模板：规范 ID 为 template.<name> */
export interface TemplateEntry extends AssetBase {
  category: string;
  /** 引用组件 id 列表 */
  componentRefs?: string[];
  /** 路由段（内容驱动模板的详情页路由） */
  slug?: string;
  /** 一句话摘要（集合页卡片） */
  summary?: string;
  /** 菜单/列表排序 */
  order?: number;
  /** 内容溯源路径 */
  sourceRef?: string;
  /** 结构模式数量（卡片展示） */
  patternCount?: number;
}

// ===== 素材 =====

/** 素材：规范 ID 为 material.<name>，权利字段独立拆分 */
export interface MaterialEntry extends AssetBase, RightsFields {
  category: string;
  /** 文件格式（png / svg / woff2 等） */
  format?: string;
  /** 来源外链 */
  sourceUrl?: string;
}

// ===== 分类 =====

/** 资产一级分类 */
export type AssetCategory =
  | 'styles'
  | 'components'
  | 'themes'
  | 'templates'
  | 'materials';
