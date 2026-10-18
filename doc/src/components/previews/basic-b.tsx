/**
 * 组件运行态预览注册表（第二批）：基础表单控件与数据展示组件。
 * 纯 React 组件直接命名导入、useState 受控渲染；Form / Table / Accordion /
 * DataTable / Carousel 依赖 Renderer 上下文，经 DslPreview 以真实 DSL 渲染
 * （与业务页面同一代码路径）。键为资产目录 id（component.*）。
 */
import { useState, type ReactElement } from 'react';
import type { DslNode } from '@pactor-app/core';
import {
  Button,
  Calendar,
  Card,
  Checkbox,
  Combobox,
  DatePicker,
  Empty,
  Input,
  NumberInput,
  RadioGroup,
  Select,
  Slider,
  Statistic,
  Switch,
  Textarea,
  type DateRangeValue,
} from '@pactor-app/ui/components';
import DslPreview from './DslPreview';

const rowStyle = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } as const;
const columnStyle = { display: 'flex', flexDirection: 'column', gap: 12 } as const;
const blockStyle = {
  padding: 16,
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--card)',
  color: 'var(--card-foreground)',
  fontSize: 13,
} as const;

const DEMO_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120"><rect width="200" height="120" fill="#e2e8f0"/><text x="100" y="66" font-size="14" text-anchor="middle" fill="#64748b">示例图片</text></svg>',
  );

function slideImage(label: string, fill: string): string {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="240"><rect width="640" height="240" fill="${fill}"/><text x="320" y="128" font-size="20" text-anchor="middle" fill="#ffffff">${label}</text></svg>`,
    )
  );
}

function InputPreview() {
  const [value, setValue] = useState('');
  const [secret, setSecret] = useState('');
  return (
    <div style={{ ...columnStyle, maxWidth: 320 }}>
      <Input value={value} onChange={setValue} placeholder="请输入关键词" allowClear />
      <Input value={secret} onChange={setSecret} type="password" placeholder="请输入密码" />
    </div>
  );
}

function TextareaPreview() {
  const [value, setValue] = useState('');
  return (
    <div style={{ maxWidth: 420 }}>
      <Textarea value={value} onChange={setValue} rows={3} placeholder="请输入备注说明" />
    </div>
  );
}

function InputNumberPreview() {
  const [value, setValue] = useState<number | undefined>(2);
  return (
    <NumberInput value={value} onChange={setValue} min={0} max={10} step={1} />
  );
}

function SelectPreview() {
  const [value, setValue] = useState<string | number | boolean>();
  return (
    <Select
      options={[
        { label: '全部', value: 'all' },
        { label: '进行中', value: 'doing' },
        { label: '已完成', value: 'done' },
        { label: '已归档（禁用）', value: 'archived', disabled: true },
      ]}
      value={value}
      onChange={(next) => setValue(next as string | number | boolean | undefined)}
      placeholder="选择状态"
    />
  );
}

function AutocompletePreview() {
  const [value, setValue] = useState<string | number>();
  return (
    <Combobox
      options={[
        { label: '张三', value: 'zhangsan' },
        { label: '李四', value: 'lisi' },
        { label: '王五', value: 'wangwu' },
        { label: '赵六', value: 'zhaoliu' },
      ]}
      value={value}
      onChange={setValue}
      searchable
      placeholder="搜索并选择成员"
    />
  );
}

function CheckboxPreview() {
  const [checked, setChecked] = useState(true);
  return <Checkbox label="订阅版本更新通知" value={checked} onChange={setChecked} />;
}

function RadioPreview() {
  const [value, setValue] = useState<string | number | boolean>('week');
  return (
    <RadioGroup
      options={[
        { label: '按日', value: 'day' },
        { label: '按周', value: 'week' },
        { label: '按月', value: 'month' },
      ]}
      value={value}
      onChange={setValue}
      direction="horizontal"
    />
  );
}

function SwitchPreview() {
  const [checked, setChecked] = useState(true);
  return <Switch label="开启自动保存" value={checked} onChange={setChecked} />;
}

function SliderPreview() {
  const [value, setValue] = useState(40);
  return (
    <div style={{ ...rowStyle, maxWidth: 420 }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <Slider value={value} onChange={setValue} min={0} max={100} step={5} />
      </div>
    </div>
  );
}

function DatePickerPreview() {
  const [date, setDate] = useState<string | undefined>('2026-09-21');
  const [range, setRange] = useState<DateRangeValue | undefined>({
    start: '2026-09-01',
    end: '2026-09-21',
  });
  return (
    <div style={rowStyle}>
      <DatePicker value={date} onChange={setDate} />
      <DatePicker mode="range" value={range} onChange={setRange} />
    </div>
  );
}

function CardPreview() {
  return (
    <div style={{ maxWidth: 360 }}>
      <Card title="月度运营报告">
        <div style={columnStyle}>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
            2026-08 月报已生成，覆盖 12 项核心指标，较上月提升 8.4%。
          </span>
          <div>
            <Button text="查看详情" variant="primary" size="small" />
          </div>
        </div>
      </Card>
    </div>
  );
}

function StatisticPreview() {
  return (
    <div style={rowStyle}>
      <div style={{ ...blockStyle, minWidth: 160 }}>
        <Statistic title="本月销售额" value={128640.5} precision={2} suffix="元" />
      </div>
      <div style={{ ...blockStyle, minWidth: 160 }}>
        <Statistic title="活跃用户" value={8932} suffix="人" />
      </div>
    </div>
  );
}

function CalendarPreview() {
  const [value, setValue] = useState<string | undefined>('2026-09-21');
  return (
    <div style={rowStyle}>
      <div style={blockStyle}>
        <Calendar value={value} onChange={setValue} />
      </div>
    </div>
  );
}

function EmptyPreview() {
  return (
    <Empty title="暂无数据" description="当前筛选条件下没有匹配的记录，可调整条件后重试。">
      <Button text="新建记录" variant="primary" size="small" />
    </Empty>
  );
}

const FORM_NODE: DslNode = {
  type: 'Flex',
  props: { direction: 'vertical', gap: 12 },
  children: [
    {
      type: 'Form',
      events: {
        onSubmit: { action: 'setState', params: { result: '${event}' } },
      },
      children: [
        { type: 'Input', props: { name: 'keyword', label: '关键词', placeholder: '输入关键词' } },
        {
          type: 'Select',
          props: {
            name: 'status',
            label: '状态',
            placeholder: '选择状态',
            options: [
              { label: '全部', value: 'all' },
              { label: '进行中', value: 'doing' },
              { label: '已完成', value: 'done' },
            ],
          },
        },
        { type: 'Button', props: { text: '提交', variant: 'primary', submit: true } },
      ],
    },
  ],
};

function FormPreview() {
  return <DslPreview node={FORM_NODE} />;
}

const TABLE_NODE: DslNode = {
  type: 'Table',
  props: {
    columns: [
      { title: '名称', dataIndex: 'name' },
      { title: '负责人', dataIndex: 'owner' },
      { title: '状态', dataIndex: 'status', align: 'center' },
    ],
    dataSource: [
      { id: 1, name: '月度运营报告', owner: '张三', status: '已发布' },
      { id: 2, name: '客户分层方案', owner: '李四', status: '草稿' },
      { id: 3, name: 'Q3 投放复盘', owner: '王五', status: '审核中' },
      { id: 4, name: '渠道增长分析', owner: '赵六', status: '已发布' },
    ],
    pagination: { pageSize: 5 },
  },
};

function TablePreview() {
  return <DslPreview node={TABLE_NODE} />;
}

const COLLAPSE_NODE: DslNode = {
  type: 'Accordion',
  props: {
    items: [
      {
        key: 'intro',
        title: '产品简介',
        children: [{ type: 'Text', props: { text: 'Pactor 是一套 DSL 驱动的动态页面框架。' } }],
      },
      {
        key: 'usage',
        title: '使用方式',
        children: [{ type: 'Text', props: { text: '以 YAML/JSON 描述页面结构，经运行时渲染为真实组件。' } }],
      },
      {
        key: 'faq',
        title: '常见问题',
        children: [{ type: 'Text', props: { text: '表达式、数据源与动作均可组合使用，详见使用文档。' } }],
      },
    ],
  },
};

function CollapsePreview() {
  return <DslPreview node={COLLAPSE_NODE} />;
}

const DATA_GRID_NODE: DslNode = {
  type: 'DataTable',
  props: {
    columns: [
      { key: 'name', title: '页面' },
      { key: 'visits', title: '访问量', sortable: true },
      { key: 'trend', title: '趋势' },
    ],
    rows: [
      { id: 1, name: '首页', visits: 12840, trend: '上升' },
      { id: 2, name: '列表页', visits: 8932, trend: '持平' },
      { id: 3, name: '详情页', visits: 6420, trend: '上升' },
      { id: 4, name: '设置页', visits: 2180, trend: '下降' },
      { id: 5, name: '帮助中心', visits: 1546, trend: '持平' },
    ],
    pagination: { pageSize: 3 },
  },
};

function DataGridPreview() {
  return <DslPreview node={DATA_GRID_NODE} />;
}

const CAROUSEL_NODE: DslNode = {
  type: 'Carousel',
  props: {
    loop: true,
    items: [
      { src: slideImage('运营看板', '#1677ff'), alt: '运营看板' },
      { src: slideImage('增长分析', '#52c41a'), alt: '增长分析' },
      { src: slideImage('客户洞察', '#722ed1'), alt: '客户洞察' },
    ],
  },
};

function CarouselPreview() {
  return (
    <div style={{ padding: '0 48px' }}>
      <DslPreview node={CAROUSEL_NODE} />
    </div>
  );
}

export const PREVIEWS_B: Record<string, () => ReactElement> = {
  'component.input': InputPreview,
  'component.textarea': TextareaPreview,
  'component.number-input': InputNumberPreview,
  'component.select': SelectPreview,
  'component.combobox': AutocompletePreview,
  'component.checkbox': CheckboxPreview,
  'component.radio-group': RadioPreview,
  'component.switch': SwitchPreview,
  'component.slider': SliderPreview,
  'component.date-picker': DatePickerPreview,
  'component.card': CardPreview,
  'component.statistic': StatisticPreview,
  'component.calendar': CalendarPreview,
  'component.empty': EmptyPreview,
  'component.form': FormPreview,
  'component.table': TablePreview,
  'component.accordion': CollapsePreview,
  'component.data-table': DataGridPreview,
  'component.carousel': CarouselPreview,
};
