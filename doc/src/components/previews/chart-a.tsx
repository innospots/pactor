/**
 * 组件运行态预览注册表（图表组件集）：src/components/chart 目录 17 个
 * echarts 组件的真实渲染预览。键为资产规范 id（component.*），
 * 与 previewable.ts 清单一一对应；ComponentPreview 中本注册表
 * 位于 PREVIEWS_E 之后 spread，覆盖 basic-c 中旧的 recharts Chart 预览。
 */
import { type ReactElement } from 'react';
import {
  AreaChart,
  BarChart,
  BubbleChart,
  ColumnChart,
  ComposedChart,
  DonutChart,
  FunnelChart,
  GaugeChart,
  Heatmap,
  LineChart,
  MapChart,
  MetricCard,
  PieChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
  TreeChart,
} from '@pactor-app/chart';

const MONTH_VISITS = [
  { month: '1月', visits: 320, signups: 120 },
  { month: '2月', visits: 452, signups: 168 },
  { month: '3月', visits: 398, signups: 155 },
  { month: '4月', visits: 560, signups: 210 },
  { month: '5月', visits: 480, signups: 190 },
  { month: '6月', visits: 612, signups: 256 },
];

const CHANNELS = [
  { channel: '直接访问', count: 420 },
  { channel: '搜索引擎', count: 315 },
  { channel: '社交媒体', count: 238 },
  { channel: '外部链接', count: 146 },
  { channel: '邮件推广', count: 92 },
];

function MetricCardPreview() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
      <MetricCard title="月收入" value={12800} prefix="¥" trend={12.5} trendLabel="较上月" />
      <MetricCard title="退款率" value="1.8%" trend={-0.6} trendLabel="较上月" />
    </div>
  );
}

function LineChartPreview() {
  return (
    <LineChart
      data={MONTH_VISITS}
      xKey="month"
      yKeys={['visits', 'signups']}
      smooth
      title="访问与注册趋势"
    />
  );
}

function ColumnChartPreview() {
  return <ColumnChart data={MONTH_VISITS} xKey="month" yKeys={['visits']} title="月度访问" />;
}

function BarChartPreview() {
  return (
    <BarChart
      data={[...CHANNELS].sort((a, b) => b.count - a.count)}
      yKey="channel"
      xKeys={['count']}
      title="渠道访问 Top5"
    />
  );
}

function AreaChartPreview() {
  return (
    <AreaChart
      data={MONTH_VISITS}
      xKey="month"
      yKeys={['visits', 'signups']}
      stacked
      title="访问构成"
    />
  );
}

function PieChartPreview() {
  return <PieChart data={CHANNELS} nameKey="channel" valueKey="count" title="流量来源" />;
}

function DonutChartPreview() {
  return (
    <DonutChart
      data={CHANNELS}
      nameKey="channel"
      valueKey="count"
      centerLabel="总访问"
      centerValue="1211"
      title="流量来源"
    />
  );
}

function ScatterChartPreview() {
  const data = [
    { cost: 120, roi: 2.1, channel: '搜索' },
    { cost: 200, roi: 1.6, channel: '搜索' },
    { cost: 150, roi: 3.2, channel: '社交' },
    { cost: 260, roi: 2.4, channel: '社交' },
    { cost: 90, roi: 1.2, channel: '邮件' },
  ];
  return <ScatterChart data={data} xKey="cost" yKey="roi" seriesKey="channel" title="成本-ROI 分布" />;
}

function BubbleChartPreview() {
  const data = [
    { price: 99, sales: 820, profit: 18 },
    { price: 199, sales: 460, profit: 52 },
    { price: 299, sales: 210, profit: 76 },
    { price: 399, sales: 96, profit: 95 },
    { price: 159, sales: 350, profit: 40 },
  ];
  return <BubbleChart data={data} xKey="price" yKey="sales" sizeKey="profit" title="价格-销量-利润" />;
}

function RadarChartPreview() {
  return (
    <RadarChart
      data={[
        { skill: '研发', alice: 90, bob: 70 },
        { skill: '市场', alice: 60, bob: 85 },
        { skill: '管理', alice: 75, bob: 65 },
        { skill: '设计', alice: 65, bob: 80 },
      ]}
      indicatorKey="skill"
      yKeys={['alice', 'bob']}
      title="能力对比"
    />
  );
}

function FunnelChartPreview() {
  return (
    <FunnelChart
      data={[
        { stage: '访问', value: 10000 },
        { stage: '注册', value: 3200 },
        { stage: '激活', value: 1500 },
        { stage: '付费', value: 860 },
      ]}
      nameKey="stage"
      valueKey="value"
      title="注册转化漏斗"
    />
  );
}

function GaugeChartPreview() {
  return (
    <GaugeChart
      value={72}
      unit="%"
      thresholds={[
        { value: 60, color: 'var(--success)' },
        { value: 90, color: 'var(--warning)' },
        { value: 100, color: 'var(--destructive)' },
      ]}
      title="服务健康度"
    />
  );
}

function HeatmapPreview() {
  const weekdays = ['周一', '周二', '周三', '周四', '周五'];
  const hours = ['9时', '12时', '15时', '18时'];
  const data = weekdays.flatMap((day, yi) =>
    hours.map((hour, xi) => ({
      hour,
      day,
      commits: ((xi * 7 + yi * 13 + 5) % 40) + 2,
    })),
  );
  return <Heatmap data={data} xKey="hour" yKey="day" valueKey="commits" title="提交热力" />;
}

function TreeChartPreview() {
  return (
    <TreeChart
      data={[
        {
          name: '总经理',
          children: [
            {
              name: '技术部',
              children: [{ name: '前端组' }, { name: '后端组' }, { name: '测试组' }],
            },
            {
              name: '市场部',
              children: [{ name: '品牌组' }, { name: '渠道组' }],
            },
            { name: '运营部' },
          ],
        },
      ]}
      title="组织架构"
      initialTreeDepth={-1}
    />
  );
}

function SankeyChartPreview() {
  return (
    <SankeyChart
      nodes={[{ name: '首页' }, { name: '详情' }, { name: '下单' }, { name: '流失' }]}
      links={[
        { source: '首页', target: '详情', value: 60 },
        { source: '首页', target: '流失', value: 40 },
        { source: '详情', target: '下单', value: 25 },
        { source: '详情', target: '流失', value: 35 },
      ]}
      title="用户路径"
    />
  );
}

/** 中国省份演示数据（区域名与 maps/china.json 特性名一致） */
const CHINA_DATA = [
  { name: '北京', value: 980 },
  { name: '上海', value: 850 },
  { name: '广东', value: 920 },
  { name: '浙江', value: 720 },
  { name: '江苏', value: 760 },
  { name: '四川', value: 480 },
  { name: '湖北', value: 430 },
  { name: '陕西', value: 360 },
  { name: '辽宁', value: 320 },
  { name: '新疆', value: 180 },
];

/** 世界国家演示数据（区域名与 maps/world.json 特性名一致） */
const WORLD_DATA = [
  { name: 'China', value: 980 },
  { name: 'United States', value: 860 },
  { name: 'Russia', value: 640 },
  { name: 'Brazil', value: 520 },
  { name: 'India', value: 700 },
  { name: 'Australia', value: 380 },
  { name: 'Germany', value: 420 },
  { name: 'Japan', value: 450 },
];

function MapChartPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <MapChart
        mapName="asset-china"
        geoJsonUrl="/maps/china.json"
        data={CHINA_DATA}
        title="中国地图"
      />
      <MapChart
        mapName="asset-world"
        geoJsonUrl="/maps/world.json"
        data={WORLD_DATA}
        title="世界地图"
      />
    </div>
  );
}

function ComposedChartPreview() {
  return (
    <ComposedChart
      data={MONTH_VISITS}
      xKey="month"
      series={[
        { type: 'bar', dataKey: 'visits', name: '访问量' },
        { type: 'line', dataKey: 'signups', yAxisIndex: 1, name: '注册量' },
      ]}
      title="访问 × 注册"
    />
  );
}

export const PREVIEWS_CHART: Record<string, () => ReactElement> = {
  'component.metric-card': MetricCardPreview,
  'component.line-chart': LineChartPreview,
  'component.column-chart': ColumnChartPreview,
  'component.bar-chart': BarChartPreview,
  'component.area-chart': AreaChartPreview,
  'component.pie-chart': PieChartPreview,
  'component.donut-chart': DonutChartPreview,
  'component.scatter-chart': ScatterChartPreview,
  'component.bubble-chart': BubbleChartPreview,
  'component.radar-chart': RadarChartPreview,
  'component.funnel-chart': FunnelChartPreview,
  'component.gauge-chart': GaugeChartPreview,
  'component.heatmap': HeatmapPreview,
  'component.tree-chart': TreeChartPreview,
  'component.sankey-chart': SankeyChartPreview,
  'component.map-chart': MapChartPreview,
  'component.composed-chart': ComposedChartPreview,
};
