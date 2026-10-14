/**
 * 图表 option 构建纯函数契约（第九批 chart/ 组件集）：
 * 数据形状 → echarts option 结构断言（不依赖 canvas 环境）。
 */
import { describe, expect, it } from 'vitest';

import {
  buildAreaOption,
  buildBarOption,
  buildBubbleOption,
  buildColumnOption,
  buildComposedOption,
  buildDonutOption,
  buildFunnelOption,
  buildGaugeOption,
  buildHeatmapOption,
  buildLineOption,
  buildMapOption,
  buildPieOption,
  buildRadarOption,
  buildSankeyOption,
  buildScatterOption,
  buildTreeOption,
} from '../../src/components/chart/lib/option-builders.js';
import type { ChartTheme } from '../../src/components/chart/lib/theme.js';

const theme: ChartTheme = {
  palette: ['c1', 'c2', 'c3', 'c4', 'c5'],
  foreground: 'fg',
  muted: 'muted',
  border: 'border',
  card: 'card',
  success: 'ok',
  warning: 'warn',
  destructive: 'bad',
  info: 'info',
};

const rows = [
  { month: '一月', uv: 30, pv: 50 },
  { month: '二月', uv: 40, pv: 60 },
];

type AnyOption = Record<string, any>;

describe('buildLineOption', () => {
  it('类目轴 + 多系列折线，数据按行映射', () => {
    const option = buildLineOption({ data: rows, xKey: 'month', yKeys: ['uv', 'pv'] }, theme) as AnyOption;
    expect(option.xAxis.type).toBe('category');
    expect(option.xAxis.data).toEqual(['一月', '二月']);
    expect(option.series).toHaveLength(2);
    expect(option.series[0]).toMatchObject({ type: 'line', name: 'uv', data: [30, 40] });
    expect(option.series[1].itemStyle.color).toBe('c2');
    expect(option.color).toEqual(theme.palette);
  });

  it('smooth / showArea / stacked 映射', () => {
    const option = buildLineOption(
      { data: rows, xKey: 'month', yKeys: ['uv'], smooth: true, showArea: true, stacked: true },
      theme,
    ) as AnyOption;
    expect(option.series[0].smooth).toBe(true);
    expect(option.series[0].areaStyle).toEqual({ opacity: 0.25 });
    expect(option.series[0].stack).toBe('total');
  });

  it('colors 覆盖优先于主题色板', () => {
    const option = buildLineOption(
      { data: rows, xKey: 'month', yKeys: ['uv', 'pv'], colors: ['x', 'y'] },
      theme,
    ) as AnyOption;
    expect(option.color).toEqual(['x', 'y']);
    expect(option.series[1].itemStyle.color).toBe('y');
  });
});

describe('buildColumnOption / buildBarOption / buildAreaOption', () => {
  it('柱状图：垂直类目轴 + bar 系列', () => {
    const option = buildColumnOption({ data: rows, xKey: 'month', yKeys: ['uv'] }, theme) as AnyOption;
    expect(option.series[0].type).toBe('bar');
    expect(option.xAxis.data).toEqual(['一月', '二月']);
  });

  it('条形图：类目在纵轴，数值在横轴', () => {
    const option = buildBarOption(
      { data: rows, yKey: 'month', yKeys: ['uv'], stacked: true },
      theme,
    ) as AnyOption;
    expect(option.yAxis.type).toBe('category');
    expect(option.yAxis.data).toEqual(['一月', '二月']);
    expect(option.xAxis.type).toBe('value');
    expect(option.series[0]).toMatchObject({ type: 'bar', stack: 'total', data: [30, 40] });
  });

  it('面积图：areaStyle 透明度可配', () => {
    const option = buildAreaOption(
      { data: rows, xKey: 'month', yKeys: ['uv'], fillOpacity: 0.5 },
      theme,
    ) as AnyOption;
    expect(option.series[0].areaStyle).toEqual({ opacity: 0.5 });
  });
});

describe('buildPieOption / buildDonutOption', () => {
  const pieRows = [
    { name: 'A', value: 10 },
    { name: 'B', value: 20 },
  ];

  it('饼图：切片 name/value 映射，默认 label 关闭', () => {
    const option = buildPieOption({ data: pieRows }, theme) as AnyOption;
    expect(option.series[0]).toMatchObject({
      type: 'pie',
      radius: [0, '72%'],
      data: [
        { name: 'A', value: 10 },
        { name: 'B', value: 20 },
      ],
    });
    expect(option.series[0].label.show).toBe(false);
  });

  it('环形图：内半径 + 中心指标标题', () => {
    const option = buildDonutOption(
      { data: pieRows, innerRadius: '40%', centerLabel: '总计', centerValue: 30 },
      theme,
    ) as AnyOption;
    expect(option.series[0].radius).toEqual(['40%', '72%']);
    expect(option.title).toMatchObject({ text: '30', subtext: '总计', left: 'center' });
  });
});

describe('buildScatterOption / buildBubbleOption', () => {
  const scatterRows = [
    { x: 1, y: 2, g: '甲' },
    { x: 3, y: 4, g: '乙' },
    { x: 5, y: 6, g: '甲' },
  ];

  it('散点图：seriesKey 按值拆系列', () => {
    const option = buildScatterOption(
      { data: scatterRows, xKey: 'x', yKey: 'y', seriesKey: 'g' },
      theme,
    ) as AnyOption;
    expect(option.series).toHaveLength(2);
    const names = option.series.map((s: AnyOption) => s.name).sort();
    expect(names).toEqual(['乙', '甲']);
    expect(option.legend).toBeDefined();
  });

  it('气泡图：symbolSize 按第三变量缩放', () => {
    const option = buildBubbleOption(
      { data: [{ x: 1, y: 1, size: 0 }, { x: 2, y: 2, size: 10 }], xKey: 'x', yKey: 'y', sizeKey: 'size' },
      theme,
    ) as AnyOption;
    const sizeOf = option.series[0].symbolSize as (datum: unknown[]) => number;
    expect(sizeOf([1, 1, 0])).toBe(12);
    expect(sizeOf([2, 2, 10])).toBe(48);
  });
});

describe('buildRadarOption', () => {
  it('indicatorKey 每行一个轴，yKeys 每列一个系列', () => {
    const option = buildRadarOption(
      {
        data: [
          { dim: '研发', a: 90, b: 70 },
          { dim: '市场', a: 60, b: 85 },
        ],
        indicatorKey: 'dim',
        yKeys: ['a', 'b'],
      },
      theme,
    ) as AnyOption;
    expect(option.radar.indicator).toEqual([
      { name: '研发', max: 100 },
      { name: '市场', max: 100 },
    ]);
    expect(option.series[0].data).toEqual([
      { name: 'a', value: [90, 60] },
      { name: 'b', value: [70, 85] },
    ]);
    expect(option.legend).toBeDefined();
  });
});

describe('buildFunnelOption', () => {
  it('阶段数据映射，默认降序', () => {
    const option = buildFunnelOption(
      { data: [{ name: '访问', value: 100 }, { name: '下单', value: 40 }] },
      theme,
    ) as AnyOption;
    expect(option.series[0]).toMatchObject({
      type: 'funnel',
      sort: 'descending',
      data: [
        { name: '访问', value: 100 },
        { name: '下单', value: 40 },
      ],
    });
  });
});

describe('buildGaugeOption', () => {
  it('阈值分段配色，detail 带单位', () => {
    const option = buildGaugeOption(
      {
        value: 60,
        min: 0,
        max: 100,
        unit: '%',
        thresholds: [
          { value: 60, color: 'ok' },
          { value: 100, color: 'bad' },
        ],
      },
      theme,
    ) as AnyOption;
    expect(option.series[0].axisLine.lineStyle.color).toEqual([
      [0.6, 'ok'],
      [1, 'bad'],
    ]);
    expect(option.series[0].data).toEqual([{ value: 60 }]);
    const formatter = option.series[0].detail.formatter as (value: number) => string;
    expect(formatter(60)).toBe('60%');
  });

  it('无阈值时默认主题色板首色', () => {
    const option = buildGaugeOption({ value: 10 }, theme) as AnyOption;
    expect(option.series[0].axisLine.lineStyle.color).toEqual([[1, 'c1']]);
  });
});

describe('buildHeatmapOption', () => {
  it('x/y 类目去重 + visualMap 色阶范围', () => {
    const option = buildHeatmapOption(
      {
        data: [
          { day: '周一', hour: '早', v: 5 },
          { day: '周一', hour: '晚', v: 9 },
          { day: '周二', hour: '早', v: 3 },
        ],
        xKey: 'day',
        yKey: 'hour',
        valueKey: 'v',
      },
      theme,
    ) as AnyOption;
    expect(option.xAxis.data).toEqual(['周一', '周二']);
    expect(option.yAxis.data).toEqual(['早', '晚']);
    expect(option.visualMap).toMatchObject({ min: 3, max: 9 });
    expect(option.series[0].data).toEqual([
      ['周一', '早', 5],
      ['周一', '晚', 9],
      ['周二', '早', 3],
    ]);
  });
});

describe('buildTreeOption / buildSankeyOption', () => {
  it('树图：层级数据直传，节点-连线树默认垂直曲线展开', () => {
    const data = [{ name: '总部', children: [{ name: '分部', children: [{ name: '小组' }] }] }];
    const option = buildTreeOption({ data, title: '组织' }, theme) as AnyOption;
    expect(option.series[0]).toMatchObject({
      type: 'tree',
      data,
      layout: 'orthogonal',
      orient: 'TB',
      edgeShape: 'curve',
      initialTreeDepth: 2,
    });
    expect(option.series[0].label.color).toBe('fg');
    expect(option.series[0].itemStyle.color).toBe('c1');
    expect(option.series[0].leaves.itemStyle.color).toBe('c2');
    expect(option.series[0].lineStyle.color).toBe('border');
    expect(option.title.text).toBe('组织');
  });

  it('树图：水平方向与折线连边', () => {
    const option = buildTreeOption(
      { data: [{ name: '根' }], orient: 'horizontal', edgeShape: 'polyline', initialTreeDepth: -1 },
      theme,
    ) as AnyOption;
    expect(option.series[0]).toMatchObject({
      orient: 'LR',
      edgeShape: 'polyline',
      initialTreeDepth: -1,
    });
    expect(option.series[0].label.position).toBe('right');
  });

  it('桑基图：nodes/links 直传，流向渐变', () => {
    const nodes = [{ name: 'A' }, { name: 'B' }];
    const links = [{ source: 'A', target: 'B', value: 10 }];
    const option = buildSankeyOption({ nodes, links }, theme) as AnyOption;
    // echarts 桑基图以 series.data 承载节点
    expect(option.series[0]).toMatchObject({ type: 'sankey', data: nodes, links });
    expect(option.series[0].lineStyle.color).toBe('gradient');
  });
});

describe('buildMapOption', () => {
  it('series.map 名称 + 区域数据映射 + visualMap', () => {
    const option = buildMapOption(
      { mapName: 'china', data: [{ name: '北京', value: 100 }] },
      theme,
    ) as AnyOption;
    expect(option.series[0]).toMatchObject({
      type: 'map',
      map: 'china',
      data: [{ name: '北京', value: 100 }],
    });
    expect(option.visualMap.min).toBe(100);
  });
});

describe('buildComposedOption', () => {
  it('声明式 series 混合图型，双轴时生成副数值轴', () => {
    const option = buildComposedOption(
      {
        data: rows,
        xKey: 'month',
        series: [
          { type: 'bar', dataKey: 'uv' },
          { type: 'line', dataKey: 'pv', yAxisIndex: 1 },
        ],
      },
      theme,
    ) as AnyOption;
    expect(option.series).toHaveLength(2);
    expect(option.series[0]).toMatchObject({ type: 'bar', name: 'uv', data: [30, 40], yAxisIndex: 0 });
    expect(option.series[1]).toMatchObject({ type: 'line', name: 'pv', data: [50, 60], yAxisIndex: 1 });
    expect(Array.isArray(option.yAxis)).toBe(true);
    expect(option.yAxis).toHaveLength(2);
  });

  it('无副轴系列时为单数值轴', () => {
    const option = buildComposedOption(
      { data: rows, xKey: 'month', series: [{ type: 'area', dataKey: 'uv' }] },
      theme,
    ) as AnyOption;
    expect(option.yAxis.type).toBe('value');
    expect(option.series[0].areaStyle).toEqual({ opacity: 0.25 });
  });
});
