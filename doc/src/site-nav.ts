/**
 * 资产库站点导航数据：5 个一级分类 × 二级菜单。
 * 左侧导航只保留两级（分类 Tab + 子菜单），无三级菜单；
 * 路由为 /<routePrefix>/<slug>，由 [category]/[section].astro 生成。
 */
import type { AssetCategory, ComponentCategoryId, ThemeFamilyId, TokenType } from './assets-data/types.ts';
import { components } from './assets-data/components/index.ts';
import { materials } from './assets-data/materials/index.ts';
import { templates } from './assets-data/templates/index.ts';
import { themes } from './assets-data/themes/index.ts';
import { tokens } from './assets-data/tokens/index.ts';

/** 二级菜单项 */
export interface SiteNavItem {
  /** 路由段（如 overview / colors / zhusha） */
  slug: string;
  /** 展示名 */
  name: string;
}

/** 一级分类 */
export interface SiteNavCategory {
  id: AssetCategory;
  /** 分类展示名（样式 / 组件 / …） */
  label: string;
  /** 路由前缀（不含斜杠，如 styles） */
  routePrefix: string;
  /** 子菜单；首项约定为该分类「总览」 */
  items: SiteNavItem[];
}

const overview = (name = '总览'): SiteNavItem => ({ slug: 'overview', name });

export const SITE_NAV: SiteNavCategory[] = [
  {
    id: 'styles',
    label: '样式',
    routePrefix: 'styles',
    items: [
      overview(),
      { slug: 'colors', name: '色彩' },
      { slug: 'fonts', name: '字体' },
      { slug: 'typography', name: '排版' },
      { slug: 'layout', name: '布局' },
      { slug: 'shape', name: '形态' },
      { slug: 'motion', name: '动效' },
    ],
  },
  {
    id: 'components',
    label: '组件',
    routePrefix: 'components',
    items: [
      overview(),
      { slug: 'general', name: '通用' },
      { slug: 'layout', name: '布局' },
      { slug: 'navigation', name: '导航' },
      { slug: 'data-entry', name: '数据录入' },
      { slug: 'data-display', name: '数据展示' },
      { slug: 'feedback', name: '反馈' },
      { slug: 'charts', name: '图表' },
      { slug: 'media', name: '媒体与内容' },
      { slug: 'ai-chat', name: 'AI 与会话' },
      { slug: 'business', name: '业务组件' },
    ],
  },
  {
    id: 'themes',
    label: '主题',
    routePrefix: 'themes',
    items: [
      overview(),
      { slug: 'zhusha', name: '朱砂' },
      { slug: 'yanli', name: '胭脂' },
      { slug: 'haitang', name: '海棠' },
      { slug: 'xiangye', name: '缃叶' },
      { slug: 'zhizi', name: '栀子' },
      { slug: 'qiuxiang', name: '秋香' },
      { slug: 'zhuqing', name: '竹青' },
      { slug: 'songhua', name: '松花' },
      { slug: 'tianqing', name: '天青' },
      { slug: 'kongquelan', name: '孔雀蓝' },
      { slug: 'qunqing', name: '群青' },
      { slug: 'dailan', name: '黛蓝' },
      { slug: 'tengluo', name: '藤萝' },
      { slug: 'tanse', name: '檀色' },
      { slug: 'yuebai', name: '月白' },
      { slug: 'xuanqing', name: '玄青' },
    ],
  },
  {
    id: 'templates',
    label: '模板',
    routePrefix: 'templates',
    items: [
      overview(),
      { slug: 'skeleton', name: '页面骨架' },
      { slug: 'charts', name: '图表' },
      { slug: 'lists', name: '列表' },
      { slug: 'forms', name: '表单' },
      { slug: 'details', name: '详情' },
      { slug: 'results', name: '结果' },
      { slug: 'profile', name: '个人' },
      { slug: 'login', name: '登录' },
      { slug: 'chat', name: 'Chat' },
      { slug: 'payment', name: '支付' },
      { slug: 'settings', name: '设置' },
      { slug: 'text', name: '文字' },
    ],
  },
  {
    id: 'materials',
    label: '素材',
    routePrefix: 'materials',
    items: [
      overview(),
      { slug: 'icons', name: '图标' },
      { slug: 'svg', name: 'SVG 图形' },
      { slug: 'images', name: '图片与插画' },
      { slug: 'prompts', name: '生成提示词' },
      { slug: 'logo', name: 'Logo 与品牌' },
      { slug: 'ui-resources', name: 'UI 样式资源' },
      { slug: 'media', name: '媒体与动效' },
      { slug: 'copywriting', name: '文案与数据' },
      { slug: 'sites', name: '素材站点' },
    ],
  },
];

export function findCategory(id: AssetCategory): SiteNavCategory | undefined {
  return SITE_NAV.find((c) => c.id === id);
}

export function findSection(
  categoryId: AssetCategory,
  slug: string,
): SiteNavItem | undefined {
  return findCategory(categoryId)?.items.find((i) => i.slug === slug);
}

/** 样式子菜单 slug → Token 类型（占位映射，待样式数据全量接入后按语义分组调整） */
const STYLE_SECTION_TOKEN_TYPES: Record<string, TokenType[]> = {
  colors: ['color'],
  fonts: ['fontFamily'],
  typography: ['fontSize', 'fontWeight', 'lineHeight'],
  layout: ['spacing'],
  shape: ['radius', 'shadow'],
  motion: ['duration', 'easing'],
};

/**
 * 子菜单条目数：构建期从对应资产数据模块长度计算（见 design D3）。
 * 数据尚未接入时为 0，侧栏显示「待接入」角标而非 0。
 */
export function sectionCount(categoryId: AssetCategory, slug: string): number {
  switch (categoryId) {
    case 'styles': {
      if (slug === 'overview') return tokens.length;
      const types = STYLE_SECTION_TOKEN_TYPES[slug];
      return types ? tokens.filter((t) => types.includes(t.type)).length : 0;
    }
    case 'components': {
      if (slug === 'overview') return components.length;
      return components.filter((c) => c.category === (slug as ComponentCategoryId))
        .length;
    }
    case 'themes': {
      if (slug === 'overview') return themes.length;
      return themes.filter((t) => t.familyId === (slug as ThemeFamilyId)).length;
    }
    case 'templates': {
      if (slug === 'overview') return templates.length;
      return templates.filter((t) => t.category === slug).length;
    }
    case 'materials': {
      if (slug === 'overview') return materials.length;
      return materials.filter((m) => m.category === slug).length;
    }
  }
}
