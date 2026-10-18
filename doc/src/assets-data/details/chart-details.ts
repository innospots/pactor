/**
 * 图表组件集完整详情（packages/ui src/components/chart 目录，echarts 渲染，已核对）。
 * - apiProps 核对自 packages/ui/src/components/chart/<Name>/index.tsx；
 * - 共享基础件 EChartBase（生命周期 / 主题令牌 / click → onSelect）与
 *   option 构建纯函数见 packages/ui/src/components/chart/{EChartBase,lib/}；
 * - 命名口径与 charts.ts（component-design.md §3.7）一致；
 * - 旧 recharts 薄封装 Chart（components/Chart）已移除：图表能力统一由本
 *   组件集提供（recharts 依赖同步移除）。
 */
import type { DslNode } from '@pactor-app/core';

import type { ComponentDetailContent } from './component-details.ts';

const COMMON_EVENT_NOTE =
  'events.onSelect 的 ${event} 载荷为 { name, value, seriesName, dataIndex }（echarts click 规范化）。';

export const chartDetailContents: Record<string, ComponentDetailContent> = {
  'component.metric-card': {
    dsl: {
  "type": "Flex",
  "props": {
    "gap": 12,
    "align": "center"
  },
  "children": [
    {
      "type": "MetricCard",
      "props": {
        "title": "月收入",
        "value": 12800,
        "prefix": "¥",
        "trend": 12.5,
        "trendLabel": "较上月"
      }
    },
    {
      "type": "MetricCard",
      "props": {
        "title": "退款率",
        "value": "1.8%",
        "trend": -0.6,
        "trendLabel": "较上月"
      }
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 看板 / 报表顶部的单指标概览（单值 + 变化趋势）。',
      '- 与图表组合成监控页头：MetricCard 给数值结论，图表给过程细节。',
      '',
      '**何时不用**',
      '',
      '- 纯数值无趋势诉求且空间紧凑：用更轻量的 Statistic。',
      '- 多指标对比表格：用 Table / Descriptions。',
    ].join('\n'),
    previewNote:
      '静态结构：<div data-slot="metric-card">（rounded-lg border bg-card p-4）；标题 muted 小字，数值 text-2xl font-semibold tabular-nums；trend ≠ 0 时展示趋势行（data-trend=up/down，上升 text-success + ArrowUpRight，下降 text-destructive + ArrowDownRight）。',
    variants: [
      { name: '纯数值', visual: '标题 + 大数值', scene: '无对比诉求的概览数字' },
      { name: '带趋势', visual: '数值下追加趋势箭头行', scene: '环比 / 同比变化的指标卡' },
    ],
    apiProps: [
      { name: 'title', type: 'string', defaultValue: '—', description: '指标标题' },
      { name: 'value', type: 'number | string', defaultValue: '—', description: '指标数值（表达式解析结果）' },
      { name: 'prefix / suffix', type: 'string', defaultValue: '—', description: '数值前后缀（¥ / 单位）' },
      { name: 'trend', type: 'number', defaultValue: '—', description: '趋势百分比：正升负降，0 / 缺省不展示' },
      { name: 'trendLabel', type: 'string', defaultValue: '—', description: '趋势对比说明（如"较上月"）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用 props' },
    ],
    guidelines: [
      '- 趋势色走语义令牌（升 success / 降 destructive），不自定义色值。',
      '- 同一看板行的 MetricCard 宽高对齐，数值精度一致。',
      '- 趋势值为 0 时不展示趋势行，避免误导性水平箭头。',
    ].join('\n'),
    examplesDo: ['经营看板：四张 MetricCard（收入/订单/客单/退款）+ 下方 AreaChart 趋势。'],
    examplesDont: ['把 MetricCard 当按钮或可点击卡片使用（它是纯展示组件）。'],
  },

  'component.line-chart': {
    dsl: {
  "type": "LineChart",
  "props": {
    "data": [
      {
        "month": "1月",
        "visits": 320,
        "signups": 120
      },
      {
        "month": "2月",
        "visits": 452,
        "signups": 168
      },
      {
        "month": "3月",
        "visits": 398,
        "signups": 155
      },
      {
        "month": "4月",
        "visits": 560,
        "signups": 210
      },
      {
        "month": "5月",
        "visits": 480,
        "signups": 190
      },
      {
        "month": "6月",
        "visits": 612,
        "signups": 256
      }
    ],
    "xKey": "month",
    "yKeys": [
      "visits",
      "signups"
    ],
    "smooth": true,
    "title": "访问与注册趋势"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 连续时间序列的趋势表达（访问量、温度、余额走势）。',
      '- 多系列趋势对比（yKeys 多字段）。',
      '',
      '**何时不用**',
      '',
      '- 离散类目比较：用 ColumnChart（柱形强调对比量）。',
      '- 累计规模强调：用 AreaChart。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="line-chart">（默认高 256px）；缺省配色取 --chart-1..5 语义令牌；多系列自动配图例；交互点击数据点触发 onSelect。' +
      COMMON_EVENT_NOTE,
    variants: [
      { name: '平滑曲线', visual: 'smooth: true', scene: '趋势概览，弱化逐点抖动' },
      { name: '面积折线', visual: 'showArea: true，线下 0.25 透明填充', scene: '趋势 + 量级感知' },
      { name: '堆叠', visual: 'stacked: true', scene: '多系列构成总量随时间变化' },
    ],
    apiProps: [
      { name: 'data', type: 'Record<string, unknown>[]', defaultValue: '[]', description: '数据行数组（表达式解析结果）' },
      { name: 'xKey', type: 'string', defaultValue: '—', description: '类目字段（通常为时间）' },
      { name: 'yKeys', type: 'string[]', defaultValue: "['value']", description: '数值字段，多系列传多个' },
      { name: 'smooth', type: 'boolean', defaultValue: 'false', description: '平滑曲线' },
      { name: 'showArea / stacked', type: 'boolean', defaultValue: 'false', description: '面积填充 / 堆叠' },
      { name: 'colors', type: 'string[]', defaultValue: '—', description: '系列颜色覆盖（按序循环）' },
      { name: 'title / height', type: 'string / number | string', defaultValue: '— / 256', description: '标题 / 容器高度' },
      { name: 'onSelect', type: '(payload: ChartSelectPayload) => void', defaultValue: '—', description: '点击数据点（DSL：events.onSelect）' },
    ],
    guidelines: [
      '- 系列超过 3 条时启用 stacked 或拆分图表，避免线团。',
      '- 时间类目保持等距排序，缺失日期补空行不断线误导。',
      '- 颜色缺省走令牌，仅品牌定制场景用 colors 覆盖。',
    ].join('\n'),
    examplesDo: ["近 30 天访问趋势：xKey=date，yKeys=['pv', 'uv']，smooth 开概览、关报表。"],
    examplesDont: ['用折线图表达枚举类目的对比（视觉暗示连续关系，应用柱状图）。'],
  },

  'component.column-chart': {
    dsl: {
  "type": "ColumnChart",
  "props": {
    "data": [
      {
        "month": "1月",
        "visits": 320,
        "signups": 120
      },
      {
        "month": "2月",
        "visits": 452,
        "signups": 168
      },
      {
        "month": "3月",
        "visits": 398,
        "signups": 155
      },
      {
        "month": "4月",
        "visits": 560,
        "signups": 210
      },
      {
        "month": "5月",
        "visits": 480,
        "signups": 190
      },
      {
        "month": "6月",
        "visits": 612,
        "signups": 256
      }
    ],
    "xKey": "month",
    "yKeys": [
      "visits"
    ],
    "title": "月度访问"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 离散类目的数值比较（各城市销售额、各环节耗时）。',
      '- 多系列分组 / 堆叠对比。',
      '',
      '**何时不用**',
      '',
      '- 类目名称长（超过 6 字）：改用 BarChart 横向条形。',
      '- 连续趋势：用 LineChart / AreaChart。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="column-chart">；类目轴自动取 xKey 字段字符串值；多系列 / 堆叠自动配图例；点击柱子触发 onSelect。' +
      COMMON_EVENT_NOTE,
    variants: [
      { name: '单系列', visual: '单色柱', scene: '单指标类目对比' },
      { name: '分组', visual: '多 yKeys 并列柱', scene: '两至三个指标的类目对比' },
      { name: '堆叠', visual: 'stacked 同色柱累积', scene: '构成总量 + 类目比较' },
    ],
    apiProps: [
      { name: 'data', type: 'Record<string, unknown>[]', defaultValue: '[]', description: '数据行数组' },
      { name: 'xKey', type: 'string', defaultValue: '—', description: '类目字段' },
      { name: 'yKeys', type: 'string[]', defaultValue: "['value']", description: '数值字段，多系列传多个' },
      { name: 'stacked', type: 'boolean', defaultValue: 'false', description: '堆叠柱' },
      { name: 'colors / title / height', type: '—', defaultValue: '— / — / 256', description: '颜色覆盖 / 标题 / 高度' },
      { name: 'onSelect', type: '(payload: ChartSelectPayload) => void', defaultValue: '—', description: '点击柱子（DSL：events.onSelect）' },
    ],
    guidelines: [
      '- 类目超过 12 个时考虑横向 BarChart 或滚动容器。',
      '- 堆叠总数有意义时才用 stacked（如流量构成），无关指标保持分组。',
      '- 数值差异量级悬殊时考虑对数轴（后续版本）或拆图。',
    ].join('\n'),
    examplesDo: ['月度销售额对比：xKey=month，单系列纯色柱，点击柱子联动明细表。'],
    examplesDont: ['把 20+ 类目塞进一张柱图（标签重叠不可读）。'],
  },

  'component.bar-chart': {
    dsl: {
  "type": "BarChart",
  "props": {
    "data": [
      {
        "channel": "直接访问",
        "count": 420
      },
      {
        "channel": "搜索引擎",
        "count": 315
      },
      {
        "channel": "社交媒体",
        "count": 238
      },
      {
        "channel": "外部链接",
        "count": 146
      },
      {
        "channel": "邮件推广",
        "count": 92
      }
    ],
    "yKey": "channel",
    "xKeys": [
      "count"
    ],
    "title": "渠道访问 Top5"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 类目名称长（地区全称、URL、标题类）的横向比较。',
      '- 排名榜（Top N）展示。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="bar-chart">；类目在纵轴（yKey），数值在横轴（xKeys）；支持堆叠；点击条块触发 onSelect。',
    variants: [
      { name: '单系列', visual: '横向单色条', scene: 'Top N 排名' },
      { name: '堆叠', visual: '横向累积条', scene: '长类目的构成比较' },
    ],
    apiProps: [
      { name: 'data', type: 'Record<string, unknown>[]', defaultValue: '[]', description: '数据行数组' },
      { name: 'yKey', type: 'string', defaultValue: '—', description: '类目字段（纵轴）' },
      { name: 'xKeys', type: 'string[]', defaultValue: "['value']", description: '数值字段（横轴，多系列传多个）' },
      { name: 'stacked', type: 'boolean', defaultValue: 'false', description: '堆叠条' },
      { name: 'colors / title / height / onSelect', type: '—', defaultValue: '—', description: '同 ColumnChart' },
    ],
    guidelines: ['- 类目按数值排序后展示（排名语义）。', '- 类目名超长时结合 grid 容器溢出滚动。'].join('\n'),
    examplesDo: ["渠道效果榜：yKey=channel，xKeys=['clicks']，按点击降序。"],
    examplesDont: ['用 BarChart 表达时间趋势（横向时间轴阅读成本高）。'],
  },

  'component.area-chart': {
    dsl: {
  "type": "AreaChart",
  "props": {
    "data": [
      {
        "month": "1月",
        "visits": 320,
        "signups": 120
      },
      {
        "month": "2月",
        "visits": 452,
        "signups": 168
      },
      {
        "month": "3月",
        "visits": 398,
        "signups": 155
      },
      {
        "month": "4月",
        "visits": 560,
        "signups": 210
      },
      {
        "month": "5月",
        "visits": 480,
        "signups": 190
      },
      {
        "month": "6月",
        "visits": 612,
        "signups": 256
      }
    ],
    "xKey": "month",
    "yKeys": [
      "visits",
      "signups"
    ],
    "stacked": true,
    "title": "访问构成"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 趋势 + 累计规模感（流量、容量、库存水位）。',
      '- 多系列堆叠构成随时间变化。',
      '',
      '**何时不用**',
      '',
      '- 纯趋势无规模诉求：LineChart 更轻。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="area-chart">；line 系列 + areaStyle（透明度 fillOpacity 缺省 0.25）；堆叠时顶部线为总量。',
    variants: [
      { name: '渐变面积', visual: '单系列透明填充', scene: '单指标水位感' },
      { name: '堆叠面积', visual: '多系列层叠', scene: '构成 + 总量趋势' },
    ],
    apiProps: [
      { name: 'data / xKey / yKeys', type: '—', defaultValue: '—', description: '同 LineChart' },
      { name: 'stacked', type: 'boolean', defaultValue: 'false', description: '堆叠面积' },
      { name: 'fillOpacity', type: 'number', defaultValue: '0.25', description: '填充不透明度（0-1）' },
      { name: 'colors / title / height / onSelect', type: '—', defaultValue: '—', description: '同 LineChart' },
    ],
    guidelines: ['- 堆叠面积系列数 ≤ 4，底部系列颜色最深。', '- fillOpacity 超过 0.5 会遮挡网格与标签。'].join('\n'),
    examplesDo: ['一年的流量构成：stacked AreaChart（直接/搜索/社交三系列）。'],
    examplesDont: ['非堆叠的多系列面积图（填充互相遮挡不可读）。'],
  },

  'component.pie-chart': {
    dsl: {
  "type": "PieChart",
  "props": {
    "data": [
      {
        "channel": "直接访问",
        "count": 420
      },
      {
        "channel": "搜索引擎",
        "count": 315
      },
      {
        "channel": "社交媒体",
        "count": 238
      },
      {
        "channel": "外部链接",
        "count": 146
      },
      {
        "channel": "邮件推广",
        "count": 92
      }
    ],
    "nameKey": "channel",
    "valueKey": "count",
    "title": "流量来源"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 少量类别（≤ 6）的构成占比。',
      '',
      '**何时不用**',
      '',
      '- 类别多或占比接近（人眼难辨角度差）：用 ColumnChart。',
      '- 需要中心指标：用 DonutChart。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="pie-chart">；nameKey/valueKey 映射切片；缺省隐藏标签（showLabel 开启显示）；切片色取 chart-1..5 令牌循环。',
    variants: [
      { name: '无标签', visual: '纯扇区 + 图例', scene: '类别少且图例可辨识' },
      { name: '带标签', visual: '扇区内/外显示名称数值', scene: '报表导出场景' },
    ],
    apiProps: [
      { name: 'data', type: 'Record<string, unknown>[]', defaultValue: '[]', description: '切片数据行' },
      { name: 'nameKey / valueKey', type: 'string', defaultValue: "'name' / 'value'", description: '切片名称 / 数值字段' },
      { name: 'showLabel', type: 'boolean', defaultValue: 'false', description: '显示切片标签' },
      { name: 'colors / title / height / onSelect', type: '—', defaultValue: '—', description: '同 LineChart；onSelect 点击切片' },
    ],
    guidelines: ['- 类别 ≤ 6 且最大占比可辨识；超出改用柱图。', '- 占比小于 5% 的类别合并为"其他"。'].join('\n'),
    examplesDo: ['流量来源构成：5 个渠道切片 + 图例。'],
    examplesDont: ['10+ 类别的饼图（扇区过窄标签堆叠）。'],
  },

  'component.donut-chart': {
    dsl: {
  "type": "DonutChart",
  "props": {
    "data": [
      {
        "channel": "直接访问",
        "count": 420
      },
      {
        "channel": "搜索引擎",
        "count": 315
      },
      {
        "channel": "社交媒体",
        "count": 238
      },
      {
        "channel": "外部链接",
        "count": 146
      },
      {
        "channel": "邮件推广",
        "count": 92
      }
    ],
    "nameKey": "channel",
    "valueKey": "count",
    "centerLabel": "总访问",
    "centerValue": "1211",
    "title": "流量来源"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 构成占比 + 中心关键指标（总计、完成率）。',
      '',
      '**何时不用**',
      '',
      '- 纯构成无中心指标：PieChart 足够。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="donut-chart">；内半径缺省 48%、外半径 72%；centerLabel/centerValue 以居中标题呈现于环心。',
    variants: [
      { name: '中心指标', visual: '环心居中数值 + 说明', scene: '总计 / 完成率概览' },
      { name: '纯环形', visual: '仅环 + 图例', scene: '构成对比' },
    ],
    apiProps: [
      { name: 'data / nameKey / valueKey', type: '—', defaultValue: '—', description: '同 PieChart' },
      { name: 'innerRadius / outerRadius', type: "number | string", defaultValue: "'48%' / '72%'", description: '内外半径（px 或百分比串）' },
      { name: 'centerLabel / centerValue', type: 'string / number | string', defaultValue: '—', description: '环心指标名 / 值' },
      { name: 'showLabel / colors / title / height / onSelect', type: '—', defaultValue: '—', description: '同 PieChart' },
    ],
    guidelines: ['- 环心只放单一关键指标，不堆文案。', '- 切片数 ≤ 6，与 PieChart 同一约束。'].join('\n'),
    examplesDo: ['存储用量：环心 1.2T 总计，切片为各业务线占比。'],
    examplesDont: ['中心放长句子或多行指标（环心面积有限）。'],
  },

  'component.scatter-chart': {
    dsl: {
  "type": "ScatterChart",
  "props": {
    "data": [
      {
        "cost": 120,
        "roi": 2.1,
        "channel": "搜索"
      },
      {
        "cost": 200,
        "roi": 1.6,
        "channel": "搜索"
      },
      {
        "cost": 150,
        "roi": 3.2,
        "channel": "社交"
      },
      {
        "cost": 260,
        "roi": 2.4,
        "channel": "社交"
      },
      {
        "cost": 90,
        "roi": 1.2,
        "channel": "邮件"
      }
    ],
    "xKey": "cost",
    "yKey": "roi",
    "seriesKey": "channel",
    "title": "成本-ROI 分布"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 两数值变量的关系与分布（成本-ROI、时长-转化率）。',
      '- 分组对比分布（seriesKey 拆系列）。',
      '',
      '**何时不用**',
      '',
      '- 类目对比：用 ColumnChart（散点无类目轴语义）。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="scatter-chart">；seriesKey 存在时按值拆系列并配图例，否则单系列；坐标轴均为数值轴。',
    variants: [
      { name: '单系列', visual: '单色散点', scene: '单群体分布观察' },
      { name: '分组', visual: 'seriesKey 多色散点 + 图例', scene: '多群体分布对比' },
    ],
    apiProps: [
      { name: 'data', type: 'Record<string, unknown>[]', defaultValue: '[]', description: '数据行数组' },
      { name: 'xKey / yKey', type: 'string', defaultValue: "'x' / 'y'", description: 'X / Y 数值字段' },
      { name: 'seriesKey', type: 'string', defaultValue: '—', description: '分组字段（按值拆系列）' },
      { name: 'colors / title / height / onSelect', type: '—', defaultValue: '—', description: '同 LineChart；onSelect 点击数据点' },
    ],
    guidelines: ['- 点量过大（>1k）时考虑聚合或采样，避免渲染压力。', '- 两轴语义需在标题或周边文案说明。'].join('\n'),
    examplesDo: ['广告投放分析：xKey=cost，yKey=roi，seriesKey=channel 观察渠道分布差异。'],
    examplesDont: ['把时间字段放进散点轴却期望趋势解读（应折线图）。'],
  },

  'component.bubble-chart': {
    dsl: {
  "type": "BubbleChart",
  "props": {
    "data": [
      {
        "price": 99,
        "sales": 820,
        "profit": 18
      },
      {
        "price": 199,
        "sales": 460,
        "profit": 52
      },
      {
        "price": 299,
        "sales": 210,
        "profit": 76
      },
      {
        "price": 399,
        "sales": 96,
        "profit": 95
      },
      {
        "price": 159,
        "sales": 350,
        "profit": 40
      }
    ],
    "xKey": "price",
    "yKey": "sales",
    "sizeKey": "profit",
    "title": "价格-销量-利润"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 三变量关系：两轴 + 气泡大小（价格-销量-利润）。',
      '',
      '**何时不用**',
      '',
      '- 仅两变量：ScatterChart 更直接（气泡增加面积误判）。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="bubble-chart">；sizeKey 数值线性映射 12-48px 气泡半径；支持 seriesKey 分组。',
    variants: [
      { name: '单系列气泡', visual: '单色气泡', scene: '三变量总体关系' },
      { name: '分组气泡', visual: 'seriesKey 多色', scene: '类目 + 三变量' },
    ],
    apiProps: [
      { name: 'data / xKey / yKey', type: '—', defaultValue: '—', description: '同 ScatterChart' },
      { name: 'sizeKey', type: 'string', defaultValue: "'size'", description: '气泡大小字段（第三变量）' },
      { name: 'seriesKey', type: 'string', defaultValue: '—', description: '分组字段' },
      { name: 'colors / title / height / onSelect', type: '—', defaultValue: '—', description: '同 ScatterChart' },
    ],
    guidelines: ['- 大小映射的字段必须为非负数值。', '- 气泡数 ≤ 50 时可读，超出考虑聚合。'].join('\n'),
    examplesDo: ['商品组合分析：price × sales，气泡大小 = profit 找高利润爆品。'],
    examplesDont: ['sizeKey 取负值或枚举（大小无线性语义）。'],
  },

  'component.radar-chart': {
    dsl: {
  "type": "RadarChart",
  "props": {
    "data": [
      {
        "skill": "研发",
        "alice": 90,
        "bob": 70
      },
      {
        "skill": "市场",
        "alice": 60,
        "bob": 85
      },
      {
        "skill": "管理",
        "alice": 75,
        "bob": 65
      },
      {
        "skill": "设计",
        "alice": 65,
        "bob": 80
      }
    ],
    "indicatorKey": "skill",
    "yKeys": [
      "alice",
      "bob"
    ],
    "title": "能力对比"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 多维能力对比（每行一个维度，每列一个对象）。',
      '- 维度 3-8 个的对称形状比较。',
      '',
      '**何时不用**',
      '',
      '- 维度过多（>8）或单维对比（用柱图）。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="radar-chart">；indicatorKey 每行生成一个雷达轴（max 100）；yKeys 每列一个系列（多系列配图例）。',
    variants: [
      { name: '单对象画像', visual: '单系列多边形', scene: '个人能力画像' },
      { name: '多对象对比', visual: '多系列重叠多边形', scene: '候选人 / 方案对比' },
    ],
    apiProps: [
      { name: 'data', type: 'Record<string, unknown>[]', defaultValue: '[]', description: '每行一个维度' },
      { name: 'indicatorKey', type: 'string', defaultValue: "'indicator'", description: '维度名字段' },
      { name: 'yKeys', type: 'string[]', defaultValue: "['value']", description: '系列字段（每列一个对比对象）' },
      { name: 'colors / title / height / onSelect', type: '—', defaultValue: '—', description: '同 LineChart' },
    ],
    guidelines: ['- 各维度量纲需归一化到同一量程（组件按 0-100）。', '- 对比系列 ≤ 3，多边形透明度保持可读。'].join('\n'),
    examplesDo: ['候选人对比：6 个能力维度 × 2 人，雷达图直观呈现差异。'],
    examplesDont: ['维度间量纲未归一（如金额与次数同图）。'],
  },

  'component.funnel-chart': {
    dsl: {
  "type": "FunnelChart",
  "props": {
    "data": [
      {
        "stage": "访问",
        "value": 10000
      },
      {
        "stage": "注册",
        "value": 3200
      },
      {
        "stage": "激活",
        "value": 1500
      },
      {
        "stage": "付费",
        "value": 860
      }
    ],
    "nameKey": "stage",
    "valueKey": "value",
    "title": "注册转化漏斗"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 流程阶段转化（访问 → 注册 → 付费）。',
      '- 阶段数 3-7 的有序漏斗。',
      '',
      '**何时不用**',
      '',
      '- 无序类别构成：用 PieChart / ColumnChart（漏斗暗示顺序与流失）。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="funnel-chart">；默认降序（大在上）；阶段标签置于层内（卡片底色文字）。',
    variants: [
      { name: '标准漏斗', visual: '降序梯形层叠', scene: '转化漏斗' },
      { name: '保序漏斗', visual: "sort: 'none' 输入顺序", scene: '非数值递减的阶段展示' },
    ],
    apiProps: [
      { name: 'data', type: 'Record<string, unknown>[]', defaultValue: '[]', description: '阶段数据行' },
      { name: 'nameKey / valueKey', type: 'string', defaultValue: "'name' / 'value'", description: '阶段名 / 数值字段' },
      { name: 'sort', type: "'descending' | 'ascending' | 'none'", defaultValue: "'descending'", description: '阶段排序' },
      { name: 'colors / title / height / onSelect', type: '—', defaultValue: '—', description: '同 LineChart；onSelect 点击阶段' },
    ],
    guidelines: ['- 阶段名 + 数值 + 转化率三级信息中，图内放前两级。', '- 相邻阶段数值倒挂时检查 sort 设置。'].join('\n'),
    examplesDo: ['注册转化漏斗：访问 10000 → 注册 3200 → 付费 860，标注转化率。'],
    examplesDont: ['把漏斗当构成图展示无序类别（语义误导）。'],
  },

  'component.gauge-chart': {
    dsl: {
  "type": "GaugeChart",
  "props": {
    "value": 72,
    "unit": "%",
    "thresholds": [
      {
        "value": 60,
        "color": "var(--success)"
      },
      {
        "value": 90,
        "color": "var(--warning)"
      },
      {
        "value": 100,
        "color": "var(--destructive)"
      }
    ],
    "title": "服务健康度"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 单指标的区间状态（CPU 负载、完成率、健康分）。',
      '',
      '**何时不用**',
      '',
      '- 多指标对比：用 MetricCard 组或柱图。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="gauge-chart">；环形进度表（210° 到 -30°），中心大字数值 + 单位；thresholds 按量程分段配色。',
    variants: [
      { name: '单阈值段', visual: '单色进度弧', scene: '无分档诉求的完成度' },
      { name: '多阈值段', visual: '轴弧按阈值分段变色', scene: '负载 / 健康度分档' },
    ],
    apiProps: [
      { name: 'value', type: 'number', defaultValue: '0', description: '当前值' },
      { name: 'min / max', type: 'number', defaultValue: '0 / 100', description: '量程' },
      { name: 'thresholds', type: '{ value: number; color?: string }[]', defaultValue: '—', description: '阈值区间：按 value 上限分段配色，末段兜底 max' },
      { name: 'unit', type: 'string', defaultValue: '—', description: '数值单位后缀（如 %）' },
      { name: 'title / height / onSelect', type: '—', defaultValue: '—', description: '标题 / 高度 / 点击事件' },
    ],
    guidelines: ['- 阈值配色走语义色（success / warning / destructive）。', '- 单页仪表盘 ≤ 4 个，避免表盘墙。'].join('\n'),
    examplesDo: ['服务健康度：0-60 绿、60-90 黄、90-100 红，中心显示当前百分比。'],
    examplesDont: ['用仪表盘展示精确数值比较（表盘读数精度低）。'],
  },

  'component.heatmap': {
    dsl: {
  "type": "Heatmap",
  "props": {
    "data": [
      {
        "hour": "9时",
        "day": "周一",
        "commits": 7
      },
      {
        "hour": "12时",
        "day": "周一",
        "commits": 14
      },
      {
        "hour": "15时",
        "day": "周一",
        "commits": 21
      },
      {
        "hour": "18时",
        "day": "周一",
        "commits": 28
      },
      {
        "hour": "9时",
        "day": "周二",
        "commits": 20
      },
      {
        "hour": "12时",
        "day": "周二",
        "commits": 27
      },
      {
        "hour": "15时",
        "day": "周二",
        "commits": 34
      },
      {
        "hour": "18时",
        "day": "周二",
        "commits": 41
      },
      {
        "hour": "9时",
        "day": "周三",
        "commits": 33
      },
      {
        "hour": "12时",
        "day": "周三",
        "commits": 40
      },
      {
        "hour": "15时",
        "day": "周三",
        "commits": 7
      },
      {
        "hour": "18时",
        "day": "周三",
        "commits": 14
      },
      {
        "hour": "9时",
        "day": "周四",
        "commits": 6
      },
      {
        "hour": "12时",
        "day": "周四",
        "commits": 13
      },
      {
        "hour": "15时",
        "day": "周四",
        "commits": 20
      },
      {
        "hour": "18时",
        "day": "周四",
        "commits": 27
      },
      {
        "hour": "9时",
        "day": "周五",
        "commits": 19
      },
      {
        "hour": "12时",
        "day": "周五",
        "commits": 26
      },
      {
        "hour": "15时",
        "day": "周五",
        "commits": 33
      },
      {
        "hour": "18时",
        "day": "周五",
        "commits": 40
      }
    ],
    "xKey": "hour",
    "yKey": "day",
    "valueKey": "commits",
    "title": "提交热力"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 二维类目密度（时段 × 星期 的活跃度、功能 × 版本 的缺陷密度）。',
      '',
      '**何时不用**',
      '',
      '- 仅一维分布：用 ColumnChart。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="heatmap">；x/y 类目自动去重；visualMap 色阶取主题色板（深色端 = palette[2]，浅色端 = palette[0]），数值范围取数据最值。',
    variants: [
      { name: '提交热力', visual: '小时 × 星期 网格', scene: '协作平台活跃度' },
    ],
    apiProps: [
      { name: 'data', type: 'Record<string, unknown>[]', defaultValue: '[]', description: '数据行（x / y / value）' },
      { name: 'xKey / yKey', type: 'string', defaultValue: "'x' / 'y'", description: '横 / 纵类目字段' },
      { name: 'valueKey', type: 'string', defaultValue: "'value'", description: '数值字段' },
      { name: 'title / height / onSelect', type: '—', defaultValue: '—', description: '标题 / 高度 / 点击单元格' },
    ],
    guidelines: ['- 缺失组合显示为背景色（无数据），不用 0 填充混淆。', '- 类目轴顺序业务可控时先排序数据再传入。'].join('\n'),
    examplesDo: ['代码提交热力图：xKey=hour（0-23），yKey=weekday。'],
    examplesDont: ['连续数值轴用热力图（散点密度更合适）。'],
  },

  'component.tree-chart': {
    dsl: {
  "type": "TreeChart",
  "props": {
    "data": [
      {
        "name": "总经理",
        "children": [
          {
            "name": "技术部",
            "children": [
              {
                "name": "前端组"
              },
              {
                "name": "后端组"
              },
              {
                "name": "测试组"
              }
            ]
          },
          {
            "name": "市场部",
            "children": [
              {
                "name": "品牌组"
              },
              {
                "name": "渠道组"
              }
            ]
          },
          {
            "name": "运营部"
          }
        ]
      }
    ],
    "title": "组织架构",
    "initialTreeDepth": -1
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 层级结构的节点关系展示（组织架构、分类树、依赖树、文件目录）。',
      '- 节点-连线形态（对齐 echarts 2.2.4 tree 系列）的根到叶展开表达。',
      '',
      '**何时不用**',
      '',
      '- 层级构成占比：用 PieChart / DonutChart（面积表达构成）。',
      '- 流向关系：用 SankeyChart。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="tree-chart">；正交布局，根节点定位后逐层展开，曲线/折线连边；叶子节点取色板次色，中间节点取首色；节点可点击触发 onSelect。',
    variants: [
      { name: '垂直展开', visual: "orient: 'vertical'（TB，根在上）", scene: '组织架构、向下展开的层级' },
      { name: '水平展开', visual: "orient: 'horizontal'（LR，根在左）", scene: '向左对齐的目录 / 依赖树' },
      { name: '折线连边', visual: "edgeShape: 'polyline'", scene: '规整的直角连线诉求' },
    ],
    apiProps: [
      { name: 'data', type: 'Record<string, unknown>[]', defaultValue: '[]', description: '层级数据：通常为单根 [{ name, children: [...] }]' },
      { name: 'orient', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: '展开方向：根在上向下（TB）/ 根在左向右（LR）' },
      { name: 'edgeShape', type: "'curve' | 'polyline'", defaultValue: "'curve'", description: '连线形状：曲线 / 折线' },
      { name: 'initialTreeDepth', type: 'number', defaultValue: '2', description: '初始展开层级深度；-1 全部展开' },
      { name: 'title / height / onSelect', type: '—', defaultValue: '—', description: '标题 / 高度 / 点击节点' },
    ],
    guidelines: [
      '- 数据为单根层级结构（name + children），层级 ≤ 5 保证可读。',
      '- 全展开（initialTreeDepth: -1）仅适合小树；大树用默认深度 + 节点点击展开。',
      '- 水平方向适合层级深、节点名长的数据。',
    ].join('\n'),
    examplesDo: ['组织架构：总经理 → 部门 → 小组三级，垂直曲线连边。'],
    examplesDont: ['用树图表达占比（面积无语义，应使用饼图/矩形构成图）。'],
  },

  'component.sankey-chart': {
    dsl: {
  "type": "SankeyChart",
  "props": {
    "nodes": [
      {
        "name": "首页"
      },
      {
        "name": "详情"
      },
      {
        "name": "下单"
      },
      {
        "name": "流失"
      }
    ],
    "links": [
      {
        "source": "首页",
        "target": "详情",
        "value": 60
      },
      {
        "source": "首页",
        "target": "流失",
        "value": 40
      },
      {
        "source": "详情",
        "target": "下单",
        "value": 25
      },
      {
        "source": "详情",
        "target": "流失",
        "value": 35
      }
    ],
    "title": "用户路径"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 节点间流向与规模（流量路径、能源流向、资金流转）。',
      '- 多源多汇的桑基平衡图。',
      '',
      '**何时不用**',
      '',
      '- 简单线性漏斗：FunnelChart 更轻。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="sankey-chart">；nodes/links 结构直传（series.data 承载节点）；边为渐变流向色，悬停聚焦相邻节点。',
    variants: [
      { name: '单路径流', visual: '单源单汇', scene: '页面跳转路径' },
      { name: '多源多汇', visual: '网状流向', scene: '流量分配分析' },
    ],
    apiProps: [
      { name: 'nodes', type: '{ name: string }[]', defaultValue: '[]', description: '节点数组' },
      { name: 'links', type: '{ source: string; target: string; value: number }[]', defaultValue: '[]', description: '流向边（source → target 及数值）' },
      { name: 'title / height / onSelect', type: '—', defaultValue: '—', description: '标题 / 高度 / 点击节点或边' },
    ],
    guidelines: ['- 节点数 ≤ 12，过多交叉不可读。', '- 流入总和 = 流出总和（桑基图语义），数据提供方保证平衡。'].join('\n'),
    examplesDo: ['用户路径分析：landing → 详情 → 下单/流失 的流向规模。'],
    examplesDont: ['有环流向（A→B→A）用桑基图（布局不支持环）。'],
  },

  'component.map-chart': {
    dsl: {
  "type": "Flex",
  "props": {
    "direction": "vertical",
    "gap": 24
  },
  "children": [
    {
      "type": "MapChart",
      "props": {
        "mapName": "asset-china",
        "geoJsonUrl": "/maps/china.json",
        "data": [
          {
            "name": "北京",
            "value": 980
          },
          {
            "name": "上海",
            "value": 850
          },
          {
            "name": "广东",
            "value": 920
          },
          {
            "name": "浙江",
            "value": 720
          },
          {
            "name": "江苏",
            "value": 760
          },
          {
            "name": "四川",
            "value": 480
          },
          {
            "name": "湖北",
            "value": 430
          },
          {
            "name": "陕西",
            "value": 360
          },
          {
            "name": "辽宁",
            "value": 320
          },
          {
            "name": "新疆",
            "value": 180
          }
        ],
        "title": "中国地图"
      }
    },
    {
      "type": "MapChart",
      "props": {
        "mapName": "asset-world",
        "geoJsonUrl": "/maps/world.json",
        "data": [
          {
            "name": "China",
            "value": 980
          },
          {
            "name": "United States",
            "value": 860
          },
          {
            "name": "Russia",
            "value": 640
          },
          {
            "name": "Brazil",
            "value": 520
          },
          {
            "name": "India",
            "value": 700
          },
          {
            "name": "Australia",
            "value": 380
          },
          {
            "name": "Germany",
            "value": 420
          },
          {
            "name": "Japan",
            "value": 450
          }
        ],
        "title": "世界地图"
      }
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 地理分布与区域比较（世界地图 / 国家地图 / 省份等其他区域地图）。',
      '',
      '**何时不用**',
      '',
      '- 无地理语义的空间分布：用 ScatterChart。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="map-chart">；区域数据经 visualMap 色阶映射（数据最值区间）；内置 /maps/china.json（34 省）与 /maps/world.json（217 国家）演示资源，经 geoJsonUrl 加载；未注册且无加载来源时降级 Empty 占位 + console.warn，不抛错。',
    variants: [
      { name: '内联数据', visual: '传入 geoJson 由组件渲染期注册', scene: '单图自助、小体积自定义区域' },
      { name: 'URL 加载', visual: '传入 geoJsonUrl 由组件 fetch + 注册（按 mapName 缓存）', scene: '世界 / 国家 / 标准区域地图的推荐做法' },
      { name: '预注册', visual: '应用启动统一 registerMap，组件仅引用 mapName', scene: '多图共享地图数据' },
    ],
    apiProps: [
      { name: 'mapName', type: 'string', defaultValue: "'map'", description: 'echarts 地图名（geoJson / geoJsonUrl 注册时作为键）' },
      { name: 'data', type: 'Record<string, unknown>[]', defaultValue: '[]', description: '区域数据行（区域名 + 数值）' },
      { name: 'nameKey / valueKey', type: 'string', defaultValue: "'name' / 'value'", description: '区域名 / 数值字段' },
      { name: 'geoJson', type: 'Record<string, unknown>', defaultValue: '—', description: '内联 GeoJSON，传入即注册（优先于 geoJsonUrl）' },
      { name: 'geoJsonUrl', type: 'string', defaultValue: '—', description: 'GeoJSON 资源地址，组件 fetch 后注册（按 mapName 缓存，只请求一次）' },
      { name: 'title / height / onSelect', type: '—', defaultValue: '—', description: '标题 / 高度 / 点击区域' },
    ],
    guidelines: [
      '- 推荐应用启动时统一 registerMap 或经 geoJsonUrl 加载，多图共享同一份地图数据。',
      '- 区域名需与 geoJson 中的名称属性一致，否则匹配不上显示为无数据。',
      '- 组件不内置地图数据文件；世界 / 国家 / 省份等标准地图可使用 echarts@4 附带的 GeoJSON（如 doc 站 /maps/*.json）。',
    ].join('\n'),
    examplesDo: ['全国订单分布：geoJsonUrl 加载 china.json，data 传省份订单量，visualMap 色阶呈现。'],
    examplesDont: ['每次渲染都传入大体积 geoJson（重复注册且影响首屏）。'],
  },

  'component.composed-chart': {
    dsl: {
  "type": "ComposedChart",
  "props": {
    "data": [
      {
        "month": "1月",
        "visits": 320,
        "signups": 120
      },
      {
        "month": "2月",
        "visits": 452,
        "signups": 168
      },
      {
        "month": "3月",
        "visits": 398,
        "signups": 155
      },
      {
        "month": "4月",
        "visits": 560,
        "signups": 210
      },
      {
        "month": "5月",
        "visits": 480,
        "signups": 190
      },
      {
        "month": "6月",
        "visits": 612,
        "signups": 256
      }
    ],
    "xKey": "month",
    "series": [
      {
        "type": "bar",
        "dataKey": "visits",
        "name": "访问量"
      },
      {
        "type": "line",
        "dataKey": "signups",
        "yAxisIndex": 1,
        "name": "注册量"
      }
    ],
    "title": "访问 × 注册"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 多种度量 / 表达目标的组合（柱 = 订单量 + 线 = 营收额，双轴）。',
      '',
      '**何时不用**',
      '',
      '- 单图型即可表达：直接用对应专用图表组件。',
    ].join('\n'),
    previewNote:
      '渲染为 echarts canvas 容器 <div data-slot="composed-chart">；声明式 series 数组（type: line|bar|area + dataKey），任一 yAxisIndex=1 时生成双数值轴；area 型为带透明填充的折线。',
    variants: [
      { name: '柱线组合', visual: '柱 + 折线单轴/双轴', scene: '量级 + 比率同图' },
      { name: '柱面组合', visual: '柱 + 面积', scene: '对比 + 趋势' },
    ],
    apiProps: [
      { name: 'data', type: 'Record<string, unknown>[]', defaultValue: '[]', description: '数据行数组' },
      { name: 'xKey', type: 'string', defaultValue: '—', description: '类目字段' },
      { name: 'series', type: "ComposedSeriesItem[]", defaultValue: '[]', description: "图型（line|bar|area）+ 数据字段，可选 yAxisIndex（0 主 / 1 副）与 name" },
      { name: 'colors / title / height / onSelect', type: '—', defaultValue: '—', description: '同 LineChart' },
    ],
    guidelines: [
      '- 双轴仅当两序列量纲差异大时使用，且副轴系列数 ≤ 1。',
      '- 组合 ≤ 3 个系列，过多组合失去可读性。',
    ].join('\n'),
    examplesDo: ['月度经营：柱 = 订单量（左轴），线 = 营收额（右轴），同月对比。'],
    examplesDont: ['同量纲两序列也用双轴（视觉比例失真）。'],
  },
};
