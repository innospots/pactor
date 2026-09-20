/**
 * 主题色系（任务 4.2，16 个）。
 * 来源：product-design/ui/theme-design.md §2 主题体系规模（暖色 5 / 自然色 3 / 冷色 5 /
 * 中性色 3）与 §6 十六个主色系（色系范围与气质描述逐系提炼自 §6.1-§6.16）。
 * 传统色参考说明：色系内主题名均为中国传统色名；色名归属用于产品浏览，不替代国家标准
 * （GB/T 31430-2015）或传统色研究中的正式色度坐标，最终基准色值以设计确认并校准后的
 * 记录为准（theme-design.md §6、§12）。
 * maturity 口径：色系元数据已完整，但色系集合页依赖的色带展示与对比度概况尚未经
 * §12 发布矩阵逐项验收，本期与主题同口径保守标注 experimental，验收通过后提升 stable。
 * change：本期新增（首批评入）。
 */
import type { ThemeFamily } from '../types.ts';

export const themeFamilies: ThemeFamily[] = [
  {
    id: 'family.zhusha',
    name: '朱砂',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '暖色。范围为正红至橘红，高识别、高能量，适合强调行动、节庆、品牌和关键操作。传统色参考：银朱、朱砂、朱红、丹色、赤红。',
  },
  {
    id: 'family.yanli',
    name: '胭脂',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '暖色。范围为深红至玫红，精致、浓郁，适合文化、审美和高情绪价值产品。传统色参考：胭脂、绛红、茜色、苏方、枣红。',
  },
  {
    id: 'family.haitang',
    name: '海棠',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '暖色。范围为粉红至浅绯，柔和、亲近，适合生活方式、社交和轻量内容产品。传统色参考：海棠红、桃红、银红、退红、樱花。',
  },
  {
    id: 'family.xiangye',
    name: '缃叶',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '暖色。范围为橙至橙黄，温暖、积极，适合增长、创作、餐饮和服务型产品。传统色参考：缃叶、橘黄、杏黄、柿色、琥珀。',
  },
  {
    id: 'family.zhizi',
    name: '栀子',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '暖色。范围为明黄至淡黄，明快、醒目，适合创造、提示、年轻化和轻量工具。传统色参考：栀子、明黄、鹅黄、缃色、蒸栗。',
  },
  {
    id: 'family.qiuxiang',
    name: '秋香',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '自然色。范围为黄绿至橄榄色，兼有秋日温度与草木气息，适合自然、农业、人文和沉稳产品。传统色参考：秋香、麹尘、柳黄、嫩草、橄榄。',
  },
  {
    id: 'family.zhuqing',
    name: '竹青',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '自然色。范围为中绿至深绿，稳定、生长，适合健康、生态、成功状态和企业服务。传统色参考：竹青、石绿、官绿、翠绿、松绿。',
  },
  {
    id: 'family.songhua',
    name: '松花',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '自然色。范围为浅绿至灰绿，轻盈、平静，适合生态、健康、阅读和低压力工具。传统色参考：松花、豆绿、粉绿、葱倩、绿沈。',
  },
  {
    id: 'family.tianqing',
    name: '天青',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '冷色。范围为浅青至青色，通透、轻盈，适合科技、云服务、健康和清洁型产品。传统色参考：天青、天水碧、鸭卵青、影青、碧青。',
  },
  {
    id: 'family.kongquelan',
    name: '孔雀蓝',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '冷色。范围为蓝绿至深青，现代、专业且具有品质感，适合数据、金融、智能和高端工具。传统色参考：孔雀蓝、孔雀绿、湖蓝、翠蓝、碧蓝。',
  },
  {
    id: 'family.qunqing',
    name: '群青',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '冷色。范围为标准蓝至亮蓝，可靠、清晰，适合数字产品、企业服务和高频交互。传统色参考：群青、宝蓝、石青、帝释青、柔蓝。',
  },
  {
    id: 'family.dailan',
    name: '黛蓝',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '冷色。范围为深蓝至藏蓝，稳重、安全，适合政企、金融、开发者和复杂工作台。传统色参考：黛蓝、藏蓝、绀青、鸦青、墨蓝。',
  },
  {
    id: 'family.tengluo',
    name: '藤萝',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '冷色。范围为紫至浅紫，富有想象与创造力，适合 AI、创作、艺术和个性化产品。传统色参考：藤萝、丁香、藕荷、暮山紫、青莲。',
  },
  {
    id: 'family.tanse',
    name: '檀色',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '中性色。范围为棕、赭至土色，温厚、自然，适合人文、家居、文博和传统品牌。传统色参考：檀色、驼褐、茶褐、栗色、赭石。',
  },
  {
    id: 'family.yuebai',
    name: '月白',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '中性色。范围为白、米白至冷灰，克制、留白，适合内容、文档、设计工具和极简产品。传统色参考：月白、象牙白、缟素、雪白、浅云。月白主题以深色文字与低饱和辅助色建立层级，不以近白色作按钮文字或焦点色。',
  },
  {
    id: 'family.xuanqing',
    name: '玄青',
    maturity: 'experimental',
    change: 'new',
    integration: 'integrated',
    description:
      '中性色。范围为黑、墨至深灰蓝，沉浸、稳重，是首版完整深色主题体系（5 主题完整定义深色背景层级、反转文字、边框、浮层、遮罩、图表与交互状态）。传统色参考：玄青、玄色、乌黑、墨色、百草霜。',
  },
];
