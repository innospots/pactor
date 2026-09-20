/**
 * 主题源数据（任务 4.2，80 个：16 色系 × 每系 5 主题）。
 * 来源：product-design/ui/theme-design.md §6.1-§6.16（主题名、色彩倾向、推荐场景逐条取自
 * 文档表格）；主题 id 第三段为拼音 slug，命名口径：文档已给出全部 80 个主题的具体名称，
 * 未采用「经典/明快」等语义化命名。
 * modeSupport 口径（文档 §6.16）：玄青系 5 主题为完整深色体系 → 'dark'；
 * 其余 75 主题为浅色完整 + 深色兼容预览 → 'light-with-dark-preview'。
 * maturity 口径（文档 §12）：发布矩阵（元数据完整、引用可解析、10 阶色阶完整、组件状态
 * 矩阵、页面场景、可访问性、复制可复现）尚未逐项验收，任一必填项缺失不得标 stable，
 * 本期全部 experimental，验收通过后提升。
 * baseHex（色阶基准传统色）口径：本期接入 21 个主题（玄青系 5 个 + 其余每系代表 1 个
 * 共 15 个，其中朱砂系代表为朱砂；另朱砂系追加银朱，因其基准色在文档可查色表中有值）——
 * 有文档可查的参考色值直接采用并在注释标明来源；查不到的按色系
 * 色彩倾向给出工作值并逐条标注「基准色待设计确认」。其余 59 个主题本期 metadata 完整
 * 但 scale 留空（integration: 'pending'），待设计确认基准色后补 baseHex 并运行生成脚本。
 * 本文件为 themes.ts 的生成输入，scale / resolvedTokens 由 scripts/gen-theme-scales.mts
 * 生成后落盘；请勿直接编辑 themes.ts。
 */
import type { ThemeEntry } from '../types.ts';

/** 主题源定义：ThemeEntry 去掉生成字段，外加色阶基准色 baseHex */
export type ThemeDef = Omit<ThemeEntry, 'scale' | 'resolvedTokens' | 'overrides'> & {
  /** 色阶基准传统色 hex；缺省表示基准色待设计确认（scale 留空） */
  baseHex?: string;
};

export const themeDefs: ThemeDef[] = [
  // ===== 朱砂色系（暖色） =====
  {
    id: 'theme.zhusha.yinzhu', name: '银朱', familyId: 'zhusha', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '銀硃', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '明亮橘红；适用活动、增长、年轻品牌。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。',
    baseHex: '#D12920', // 《中国传统色·故宫里的色彩美学》整理色表：銀硃 #D12920
  },
  {
    id: 'theme.zhusha.zhusha', name: '朱砂', familyId: 'zhusha', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '朱砂', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '纯正朱红；适用文化品牌、主操作、节庆。基准色为工作参考值，基准色待设计确认，UI 主色待校准。',
    baseHex: '#C3272B', // 基准色待设计确认：纯正朱红常用参考值，文档未给出具体色值
  },
  {
    id: 'theme.zhusha.zhuhong', name: '朱红', familyId: 'zhusha', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '朱红', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '饱满正红；适用消费、零售、内容平台。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.zhusha.danse', name: '丹色', familyId: 'zhusha', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '丹色', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '温暖赤红；适用生活服务、人文产品。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.zhusha.chihong', name: '赤红', familyId: 'zhusha', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '赤红', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '深而有力的红；适用告警强化、运动、品牌强调。基准色待设计确认，色阶待生成。',
  },

  // ===== 胭脂色系（暖色） =====
  {
    id: 'theme.yanli.yanli', name: '胭脂', familyId: 'yanli', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '胭脂', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '浓郁玫红；适用美妆、时尚、文化内容。基准色为工作参考值，基准色待设计确认，UI 主色待校准。',
    baseHex: '#9D2933', // 基准色待设计确认：浓郁玫红常用参考值，文档未给出具体色值
  },
  {
    id: 'theme.yanli.jianghong', name: '绛红', familyId: 'yanli', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '绛红', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '深暗红；适用高端品牌、收藏、会员体系。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.yanli.qianse', name: '茜色', familyId: 'yanli', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '茜色', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '温暖玫红；适用女性生活、内容社区。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.yanli.sufang', name: '苏方', familyId: 'yanli', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '苏方', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '柔和红紫；适用艺术、编辑、创意工具。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.yanli.zaohong', name: '枣红', familyId: 'yanli', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '枣红', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '棕调深红；适用传统文化、商务礼赠。基准色待设计确认，色阶待生成。',
  },

  // ===== 海棠色系（暖色） =====
  {
    id: 'theme.haitang.haitanghong', name: '海棠红', familyId: 'haitang', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '海棠红', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '明净粉红；适用生活服务、女性社区。基准色为工作参考值，基准色待设计确认，UI 主色待校准。',
    baseHex: '#DB5A6B', // 基准色待设计确认：明净粉红常用参考值，文档未给出具体色值
  },
  {
    id: 'theme.haitang.taohong', name: '桃红', familyId: 'haitang', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '桃红', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '鲜活暖粉；适用社交、活动、内容互动。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.haitang.yinhong', name: '银红', familyId: 'haitang', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '银红', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '低饱和浅红；适用健康、关怀、轻应用。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.haitang.tuihong', name: '退红', familyId: 'haitang', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '退红', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '灰调淡粉；适用阅读、审美、低干扰界面。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.haitang.yinghua', name: '樱花', familyId: 'haitang', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '樱花', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '极浅柔粉；适用内容背景、教育、生活记录。基准色待设计确认，色阶待生成。',
  },

  // ===== 缃叶色系（暖色） =====
  {
    id: 'theme.xiangye.xiangye', name: '缃叶', familyId: 'xiangye', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '缃葉', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '金调橙黄；适用创作、文化、内容推荐。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。',
    baseHex: '#ECD452', // 《中国传统色·故宫里的色彩美学》整理色表：緗葉 #ECD452
  },
  {
    id: 'theme.xiangye.juhuang', name: '橘黄', familyId: 'xiangye', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '橘黄', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '鲜亮橙黄；适用增长、活动、营销工具。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.xiangye.xinghuang', name: '杏黄', familyId: 'xiangye', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '杏黄', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '柔暖浅橙；适用教育、亲子、生活服务。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.xiangye.shise', name: '柿色', familyId: 'xiangye', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '柿色', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '饱满暖橙；适用餐饮、零售、消费产品。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.xiangye.hupo', name: '琥珀', familyId: 'xiangye', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '琥珀', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '深金橙；适用会员、品质消费、数据强调。基准色待设计确认，色阶待生成。',
  },

  // ===== 栀子色系（暖色） =====
  {
    id: 'theme.zhizi.zhizi', name: '栀子', familyId: 'zhizi', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '梔子', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '清亮暖黄；适用创意工具、生活方式。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。',
    baseHex: '#FAC03D', // 《中国传统色·故宫里的色彩美学》整理色表：梔子 #FAC03D
  },
  {
    id: 'theme.zhizi.minghuang', name: '明黄', familyId: 'zhizi', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '明黄', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '高明度正黄；适用活动、提示、品牌识别。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.zhizi.ehuang', name: '鹅黄', familyId: 'zhizi', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '鹅黄', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '柔和浅黄；适用教育、儿童、轻阅读。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.zhizi.xiangse', name: '缃色', familyId: 'zhizi', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '缃色', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '稳定金黄；适用文化、知识、内容产品。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.zhizi.zhengli', name: '蒸栗', familyId: 'zhizi', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '蒸栗', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '低饱和栗黄；适用商务、人文、传统品牌。基准色待设计确认，色阶待生成。',
  },

  // ===== 秋香色系（自然色） =====
  {
    id: 'theme.qiuxiang.qiuxiang', name: '秋香', familyId: 'qiuxiang', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '秋香', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '黄绿平衡；适用文化、农业、自然品牌。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。',
    baseHex: '#BF9C46', // 《中国传统色·故宫里的色彩美学》整理色表：秋香 #BF9C46
  },
  {
    id: 'theme.qiuxiang.quchen', name: '麹尘', familyId: 'qiuxiang', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '麹尘', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '灰调黄绿；适用人文工具、低饱和界面。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.qiuxiang.liuhuang', name: '柳黄', familyId: 'qiuxiang', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '柳黄', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '明亮嫩黄绿；适用春季活动、健康、生活服务。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.qiuxiang.nencao', name: '嫩草', familyId: 'qiuxiang', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '嫩草', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '清新浅黄绿；适用成长、教育、轻应用。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.qiuxiang.ganlan', name: '橄榄', familyId: 'qiuxiang', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '橄榄', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '深沉灰黄绿；适用户外、专业工具、可持续产品。基准色待设计确认，色阶待生成。',
  },

  // ===== 竹青色系（自然色） =====
  {
    id: 'theme.zhuqing.zhuqing', name: '竹青', familyId: 'zhuqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '竹青', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '清正中绿；适用企业、协作、健康产品。基准色为工作参考值，基准色待设计确认，UI 主色待校准。',
    baseHex: '#789262', // 基准色待设计确认：清正中绿常用参考值，文档未给出具体色值
  },
  {
    id: 'theme.zhuqing.shilv', name: '石绿', familyId: 'zhuqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '石绿', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '饱和矿物绿；适用文化、视觉创作、品牌强调。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.zhuqing.guanlv', name: '官绿', familyId: 'zhuqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '官绿', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '稳定正绿；适用政企、流程、运营管理。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.zhuqing.cuilv', name: '翠绿', familyId: 'zhuqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '翠绿', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '鲜亮高饱和绿；适用增长、生态、状态提示。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.zhuqing.songlv', name: '松绿', familyId: 'zhuqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '松绿', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '深而冷静的绿；适用专业工具、安全、环境产品。基准色待设计确认，色阶待生成。',
  },

  // ===== 松花色系（自然色） =====
  {
    id: 'theme.songhua.songhua', name: '松花', familyId: 'songhua', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '松花', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '淡黄浅绿；适用内容、教育、轻量工具。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。',
    baseHex: '#FFEE6F', // 《中国传统色·故宫里的色彩美学》整理色表：松花 #FFEE6F
  },
  {
    id: 'theme.songhua.doulv', name: '豆绿', familyId: 'songhua', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '豆绿', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '柔和浅绿；适用健康、生活服务、表单产品。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.songhua.fenlv', name: '粉绿', familyId: 'songhua', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '粉绿', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '低饱和灰绿；适用阅读、知识管理、个人工具。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.songhua.congqian', name: '葱倩', familyId: 'songhua', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '葱倩', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '清新青绿；适用社交、效率、移动应用。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.songhua.lvshen', name: '绿沈', familyId: 'songhua', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '绿沈', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '沉静灰绿；适用企业后台、专业内容、数据产品。基准色待设计确认，色阶待生成。',
  },

  // ===== 天青色系（冷色） =====
  {
    id: 'theme.tianqing.tianqing', name: '天青', familyId: 'tianqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '天青', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '清透浅青；适用云服务、科技、内容产品。基准色为工作参考值，基准色待设计确认，UI 主色待校准。',
    baseHex: '#6FA8B8', // 基准色待设计确认：清透浅青按色系描述给出的工作值，文档未给出具体色值
  },
  {
    id: 'theme.tianqing.tianshuibi', name: '天水碧', familyId: 'tianqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '天水碧', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '绿调浅青；适用健康、自然、生活方式。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.tianqing.yaluanqing', name: '鸭卵青', familyId: 'tianqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '鸭卵青', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '灰调淡青；适用阅读、文档、低干扰工具。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.tianqing.yingqing', name: '影青', familyId: 'tianqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '影青', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '冷灰浅青；适用企业工具、设计系统、背景体系。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.tianqing.biqing', name: '碧青', familyId: 'tianqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '碧青', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '饱和青色；适用数据、协作、状态强调。基准色待设计确认，色阶待生成。',
  },

  // ===== 孔雀蓝色系（冷色） =====
  {
    id: 'theme.kongquelan.kongquelan', name: '孔雀蓝', familyId: 'kongquelan', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '孔雀藍', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '深蓝绿色；适用金融、智能、专业工具。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。',
    baseHex: '#4994C4', // 《中国传统色·故宫里的色彩美学》整理色表：孔雀藍 #4994C4
  },
  {
    id: 'theme.kongquelan.kongquelv', name: '孔雀绿', familyId: 'kongquelan', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '孔雀绿', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '饱和蓝绿色；适用数据可视化、生态科技。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.kongquelan.hulan', name: '湖蓝', familyId: 'kongquelan', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '湖蓝', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '明亮蓝青；适用云平台、旅游、服务产品。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.kongquelan.cuilan', name: '翠蓝', familyId: 'kongquelan', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '翠蓝', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '清亮青蓝；适用协作、创作、效率工具。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.kongquelan.bilan', name: '碧蓝', familyId: 'kongquelan', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '碧蓝', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '稳定蓝青；适用企业应用、资源管理。基准色待设计确认，色阶待生成。',
  },

  // ===== 群青色系（冷色） =====
  {
    id: 'theme.qunqing.qunqing', name: '群青', familyId: 'qunqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '群青', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '高识别正蓝；适用通用企业产品、主操作。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。',
    baseHex: '#2E59A7', // 《中国传统色·故宫里的色彩美学》整理色表：群青 #2E59A7
  },
  {
    id: 'theme.qunqing.baolan', name: '宝蓝', familyId: 'qunqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '宝蓝', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '饱满亮蓝；适用科技、金融、品牌门户。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.qunqing.shiqing', name: '石青', familyId: 'qunqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '石青', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '稳定矿物蓝；适用文化科技、创意工具。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.qunqing.dishiqiang', name: '帝释青', familyId: 'qunqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '帝释青', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '清澈亮蓝；适用云服务、开发者平台。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.qunqing.roulan', name: '柔蓝', familyId: 'qunqing', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '柔蓝', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '低饱和浅蓝；适用内容、教育、低压力工具。基准色待设计确认，色阶待生成。',
  },

  // ===== 黛蓝色系（冷色） =====
  {
    id: 'theme.dailan.dailan', name: '黛蓝', familyId: 'dailan', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '黛蓝', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '灰调深蓝；适用政企、文档、专业后台。基准色为工作参考值，基准色待设计确认，UI 主色待校准。',
    baseHex: '#46586A', // 基准色待设计确认：灰调深蓝按色系描述给出的工作值，文档未给出具体色值
  },
  {
    id: 'theme.dailan.zanglan', name: '藏蓝', familyId: 'dailan', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '藏蓝', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '稳重正深蓝；适用金融、企业、安全产品。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.dailan.ganqing', name: '绀青', familyId: 'dailan', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '绀青', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '高浓度蓝；适用开发者工具、数据平台。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.dailan.yaqing', name: '鸦青', familyId: 'dailan', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '鸦青', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '接近黑的蓝灰；适用沉浸式编辑、深色导航。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.dailan.molan', name: '墨蓝', familyId: 'dailan', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '墨蓝', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '柔和墨调蓝；适用知识、写作、文化科技。基准色待设计确认，色阶待生成。',
  },

  // ===== 藤萝色系（冷色） =====
  {
    id: 'theme.tengluo.tengluo', name: '藤萝', familyId: 'tengluo', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '藤蘿', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '柔和中紫；适用 AI、创作、知识产品。基准色为工作参考值，基准色待设计确认，UI 主色待校准。',
    baseHex: '#8076A3', // 基准色待设计确认：柔和中紫（藤萝紫）常用参考值，文档未给出具体色值
  },
  {
    id: 'theme.tengluo.dingxiang', name: '丁香', familyId: 'tengluo', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '丁香', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '灰调浅紫；适用内容、审美、个人工具。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.tengluo.ouhe', name: '藕荷', familyId: 'tengluo', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '藕荷', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '暖灰紫；适用生活、文化、女性产品。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.tengluo.mushanzi', name: '暮山紫', familyId: 'tengluo', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '暮山紫', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '沉静深紫；适用高端内容、沉浸式应用。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.tengluo.qinglian', name: '青莲', familyId: 'tengluo', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '青莲', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '蓝调紫；适用智能、开发者、数字艺术。基准色待设计确认，色阶待生成。',
  },

  // ===== 檀色色系（中性色） =====
  {
    id: 'theme.tanse.tanse', name: '檀色', familyId: 'tanse', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '檀色', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '红调暖棕；适用文化、文博、品质品牌。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。',
    baseHex: '#B26D5D', // 《中国传统色·故宫里的色彩美学》整理色表：檀色 #B26D5D
  },
  {
    id: 'theme.tanse.tuohe', name: '驼褐', familyId: 'tanse', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '驼褐', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '柔和浅棕；适用家居、生活方式、内容。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.tanse.chahe', name: '茶褐', familyId: 'tanse', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '茶褐', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '稳定中棕；适用餐饮、零售、人文工具。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.tanse.lise', name: '栗色', familyId: 'tanse', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '栗色', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '深红棕；适用会员、高端消费、收藏。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.tanse.zheshi', name: '赭石', familyId: 'tanse', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '赭石', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '土调橙棕；适用艺术、户外、传统工艺。基准色待设计确认，色阶待生成。',
  },

  // ===== 月白色系（中性色） =====
  {
    id: 'theme.yuebai.yuebai', name: '月白', familyId: 'yuebai', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '月白', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '微蓝冷白；适用文档、知识、设计系统。基准色来源：《中国传统色·故宫里的色彩美学》整理色表（design/themes.md 参考来源），UI 主色待校准。',
    baseHex: '#D4E5EF', // 《中国传统色·故宫里的色彩美学》整理色表：月白 #D4E5EF
  },
  {
    id: 'theme.yuebai.xiangyabai', name: '象牙白', familyId: 'yuebai', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '象牙白', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '温润米白；适用阅读、家居、生活方式。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.yuebai.gaosu', name: '缟素', familyId: 'yuebai', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '缟素', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '中性柔白；适用企业工具、表单、内容平台。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.yuebai.xuebai', name: '雪白', familyId: 'yuebai', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '雪白', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '清亮纯白；适用医疗、科技、极简界面。基准色待设计确认，色阶待生成。',
  },
  {
    id: 'theme.yuebai.qianyun', name: '浅云', familyId: 'yuebai', modeSupport: 'light-with-dark-preview',
    traditionalColorRef: '浅云', maturity: 'experimental', change: 'new', integration: 'pending',
    description: '淡冷灰白；适用后台、代码、低干扰背景。基准色待设计确认，色阶待生成。',
  },

  // ===== 玄青色系（中性色，首版完整深色体系：modeSupport = 'dark'） =====
  {
    id: 'theme.xuanqing.xuanqing', name: '玄青', familyId: 'xuanqing', modeSupport: 'dark',
    traditionalColorRef: '玄青', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '蓝调深黑；适用通用深色产品、数据工作台。基准色为工作参考值，基准色待设计确认，UI 主色待校准。',
    baseHex: '#232B38', // 基准色待设计确认：蓝调深黑按色系描述给出的工作值，文档未给出具体色值
  },
  {
    id: 'theme.xuanqing.xuanse', name: '玄色', familyId: 'xuanqing', modeSupport: 'dark',
    traditionalColorRef: '玄色', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '中性深黑；适用高端、沉浸、媒体产品。基准色为工作参考值，基准色待设计确认，UI 主色待校准。',
    baseHex: '#2A2422', // 基准色待设计确认：中性深黑（微暖）按色系描述给出的工作值，文档未给出具体色值
  },
  {
    id: 'theme.xuanqing.wuhei', name: '乌黑', familyId: 'xuanqing', modeSupport: 'dark',
    traditionalColorRef: '烏黑', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '纯净黑灰；适用视频、图片、展示工具。基准色为工作参考值，基准色待设计确认，UI 主色待校准。',
    baseHex: '#2D2D2D', // 基准色待设计确认：纯净黑灰按色系描述给出的工作值，文档未给出具体色值
  },
  {
    id: 'theme.xuanqing.mose', name: '墨色', familyId: 'xuanqing', modeSupport: 'dark',
    traditionalColorRef: '墨色', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '柔和暖黑；适用写作、阅读、文化内容。基准色为工作参考值，基准色待设计确认，UI 主色待校准。',
    baseHex: '#363230', // 基准色待设计确认：柔和暖黑按色系描述给出的工作值，文档未给出具体色值
  },
  {
    id: 'theme.xuanqing.baicaoshuang', name: '百草霜', familyId: 'xuanqing', modeSupport: 'dark',
    traditionalColorRef: '百草霜', maturity: 'experimental', change: 'new', integration: 'integrated',
    description: '低对比烟灰黑；适用长时工作、专业编辑器。基准色为工作参考值，基准色待设计确认，UI 主色待校准。',
    baseHex: '#3D3B38', // 基准色待设计确认：低对比烟灰黑（百草霜，灶突墨）按色系描述给出的工作值，文档未给出具体色值
  },
];
