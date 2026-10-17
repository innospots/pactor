/**
 * 组件运行态预览注册表（React 岛）：以真实 @pactor-app/ui 组件渲染
 * 各组件的代表形态；表单类组件用局部 state 受控，保证预览可操作。
 * 键为资产规范 id（component.*），与 previewable.ts 清单一一对应。
 */
import { useState, type ReactElement, type ReactNode } from 'react';
import {
  Button,
  Cascader,
  ColorPicker,
  Descriptions,
  Image,
  List,
  LoadingOverlay,
  Mentions,
  Message,
  Notification,
  Popconfirm,
  QRCode,
  Rate,
  Result,
  Segmented,
  TimePicker,
  Timeline,
  Tour,
  Transfer,
  Tree,
  TreeSelect,
  Upload,
  Watermark,
  type UploadFileMeta,
} from '@pactor-app/ui/components';
import { Toaster } from '@pactor-app/ui/ui';

import { PREVIEWS_A } from './basic-a';
import { PREVIEWS_B } from './basic-b';
import { PREVIEWS_C } from './basic-c';
import { PREVIEWS_CHART } from './chart-a';
import { PREVIEWS_D } from './basic-d';
import { PREVIEWS_E } from './basic-e';
import { PREVIEWS_BLOCKS } from './blocks-a';
import { PREVIEWS_BUTTONS } from './buttons-a';

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

function ButtonPreview() {
  return (
    <div style={columnStyle}>
      <div style={rowStyle}>
        <Button text="主要操作" variant="primary" />
        <Button text="默认按钮" variant="default" />
        <Button text="虚线按钮" variant="dashed" />
        <Button text="链接按钮" variant="link" />
        <Button text="文字按钮" variant="text" />
      </div>
      <div style={rowStyle}>
        <Button text="危险操作" variant="primary" danger />
        <Button text="加载中" variant="primary" loading />
        <Button text="已禁用" disabled />
        <Button text="小尺寸" size="small" />
      </div>
    </div>
  );
}

function RatePreview() {
  const [value, setValue] = useState(3);
  const [half, setHalf] = useState(2.5);
  return (
    <div style={columnStyle}>
      <Rate value={value} onChange={setValue} />
      <Rate value={half} onChange={setHalf} allowHalf />
    </div>
  );
}

function TimePickerPreview() {
  const [value, setValue] = useState('09:30:00');
  const [short, setShort] = useState('18:45');
  return (
    <div style={rowStyle}>
      <TimePicker value={value} onChange={(next) => setValue(next ?? '')} />
      <TimePicker value={short} onChange={(next) => setShort(next ?? '')} format="HH:mm" />
    </div>
  );
}

function ColorPickerPreview() {
  const [value, setValue] = useState('#1677ff');
  return (
    <ColorPicker
      value={value}
      onChange={setValue}
      presets={['#1677ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2']}
    />
  );
}

function UploadPreview() {
  const [files, setFiles] = useState<UploadFileMeta[]>([
    { name: '需求文档.pdf', size: 204800, type: 'application/pdf' },
  ]);
  return (
    <Upload
      value={files}
      onChange={setFiles}
      multiple
      maxCount={5}
      tip="最多 5 个文件；选择/移除实时生效"
    />
  );
}

const TREE_SELECT_OPTIONS = [
  {
    label: '华东大区',
    value: 'east',
    children: [
      { label: '上海', value: 'sh' },
      { label: '杭州', value: 'hz' },
    ],
  },
  {
    label: '华南大区',
    value: 'south',
    children: [
      { label: '广州', value: 'gz' },
      { label: '深圳', value: 'sz' },
    ],
  },
];

function TreeSelectPreview() {
  const [value, setValue] = useState<string | number>();
  return (
    <TreeSelect
      options={TREE_SELECT_OPTIONS}
      value={value}
      onChange={setValue}
      searchable
      placeholder="选择城市（可搜索）"
    />
  );
}

const CASCADER_OPTIONS = [
  {
    label: '浙江省',
    value: 'zj',
    children: [
      {
        label: '杭州市',
        value: 'hz',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '余杭区', value: 'yuhang' },
        ],
      },
    ],
  },
  {
    label: '江苏省',
    value: 'js',
    children: [
      {
        label: '南京市',
        value: 'nj',
        children: [{ label: '玄武区', value: 'xuanwu' }],
      },
    ],
  },
];

function CascaderPreview() {
  const [value, setValue] = useState<(string | number)[]>([]);
  return (
    <Cascader options={CASCADER_OPTIONS} value={value} onChange={(next) => setValue(next ?? [])} placeholder="选择地区" />
  );
}

function TransferPreview() {
  const [value, setValue] = useState<(string | number)[]>(['b']);
  return (
    <Transfer
      options={[
        { label: '选项 A', value: 'a' },
        { label: '选项 B', value: 'b' },
        { label: '选项 C', value: 'c' },
        { label: '选项 D（禁用）', value: 'd', disabled: true },
        { label: '选项 E', value: 'e' },
      ]}
      value={value}
      onChange={setValue}
      titles={['候选', '已选']}
    />
  );
}

function MentionsPreview() {
  const [value, setValue] = useState('');
  return (
    <Mentions
      options={[
        { label: '张三', value: 'zhangsan' },
        { label: '李四', value: 'lisi' },
        { label: '王五', value: 'wangwu' },
      ]}
      value={value}
      onChange={setValue}
      rows={3}
      placeholder="输入 @ 提及成员"
    />
  );
}

function ListPreview() {
  return (
    <List
      items={[
        { key: '1', title: '月度运营报告', description: '2026-08 月报 · 已发布', extra: '查看' },
        { key: '2', title: '客户分层方案', description: '运营部 · 草稿', extra: '编辑' },
        { key: '3', title: 'Q3 投放复盘', description: '市场部 · 审核中', extra: '查看' },
      ]}
      bordered
    />
  );
}

function TreePreview() {
  return (
    <Tree
      treeData={[
        {
          key: 'root',
          title: '产品部',
          children: [
            { key: 'a', title: '平台组' },
            { key: 'b', title: '商业化组' },
          ],
        },
        {
          key: 'design',
          title: '设计部',
          children: [{ key: 'c', title: '体验设计组' }],
        },
      ]}
      defaultExpandedKeys={['root']}
      checkable
      defaultCheckedKeys={['a']}
    />
  );
}

function DescriptionsPreview() {
  return (
    <Descriptions
      title="客户信息"
      bordered
      column={3}
      items={[
        { label: '姓名', value: '张三' },
        { label: '角色', value: '管理员' },
        { label: '部门', value: '平台组' },
        { label: '手机', value: '138****0000' },
        { label: '状态', value: '在职' },
      ]}
    />
  );
}

function TimelinePreview() {
  return (
    <Timeline
      items={[
        { content: '创建订单', time: '09:12', color: 'green' },
        { content: '支付成功', time: '09:15', color: 'green' },
        { content: '仓库拣货', time: '10:02' },
      ]}
      pending="等待出库"
    />
  );
}

function ImagePreview() {
  return <Image src={DEMO_IMAGE} alt="示例图片" width={200} height={120} />;
}

function QRCodePreview() {
  return <QRCode value="https://pactor-docs.xp-java.workers.dev" size={112} bordered />;
}

function SegmentedPreview() {
  const [value, setValue] = useState<string>('week');
  return (
    <Segmented
      options={[
        { label: '日', value: 'day' },
        { label: '周', value: 'week' },
        { label: '月', value: 'month' },
      ]}
      value={value}
      onChange={(next) => setValue(String(next))}
    />
  );
}

function MessagePreview() {
  const [content, setContent] = useState('');
  return (
    <div style={rowStyle}>
      <Button
        text="触发成功消息"
        variant="primary"
        onClick={() => setContent(`已保存（${new Date().toLocaleTimeString()}）`)}
      />
      <Message content={content} variant="success" />
      <Toaster />
    </div>
  );
}

function NotificationPreview() {
  const [title, setTitle] = useState('');
  return (
    <div style={rowStyle}>
      <Button
        text="触发一条通知"
        variant="primary"
        onClick={() => setTitle(`审批已通过（${new Date().toLocaleTimeString()}）`)}
      />
      <Notification title={title} description="你提交的月报已通过审批，可在列表查看。" variant="info" />
      <Toaster />
    </div>
  );
}

function PopconfirmPreview() {
  const [result, setResult] = useState('');
  return (
    <div style={rowStyle}>
      <Popconfirm
        title="确认删除该记录？"
        description="删除后不可恢复"
        danger
        onConfirm={() => setResult('已确认删除')}
        onCancel={() => setResult('已取消')}
      >
        <Button text="删除" variant="primary" danger />
      </Popconfirm>
      <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{result}</span>
    </div>
  );
}

function ResultPreview() {
  return (
    <Result
      status="success"
      title="支付成功"
      subTitle="订单号 PO20260921001，预计 24 小时内发货"
    >
      <div style={rowStyle}>
        <Button text="查看订单" variant="primary" />
        <Button text="返回列表" variant="default" />
      </div>
    </Result>
  );
}

function LoadingOverlayPreview() {
  return (
    <LoadingOverlay loading text="加载中…">
      <div style={blockStyle}>被覆盖的区块内容：loading 期间无法交互，加载完成后恢复。</div>
    </LoadingOverlay>
  );
}

function WatermarkPreview() {
  return (
    <Watermark content={['Pactor 资产库', '内部资料']}>
      <div style={blockStyle}>带水印的内容区块：水印平铺于表面，不影响文本选择与点击。</div>
    </Watermark>
  );
}

function TourPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div style={columnStyle}>
      <div style={rowStyle}>
        <div id="tour-demo-a" style={blockStyle}>
          功能入口 A
        </div>
        <div id="tour-demo-b" style={blockStyle}>
          功能入口 B
        </div>
      </div>
      <div>
        <Button text="开始引导" variant="primary" onClick={() => setOpen(true)} />
      </div>
      <Tour
        open={open}
        steps={[
          { target: '#tour-demo-a', title: '第一步', content: '这里是功能入口 A，点击可进入对应模块。' },
          { target: '#tour-demo-b', title: '第二步', content: '这里是功能入口 B，展示关键业务信息。' },
        ]}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

const PREVIEWS: Record<string, () => ReactElement> = {
  'component.button': ButtonPreview,
  'component.rate': RatePreview,
  'component.time-picker': TimePickerPreview,
  'component.color-picker': ColorPickerPreview,
  'component.upload': UploadPreview,
  'component.tree-select': TreeSelectPreview,
  'component.cascader': CascaderPreview,
  'component.transfer': TransferPreview,
  'component.mentions': MentionsPreview,
  'component.list': ListPreview,
  'component.tree': TreePreview,
  'component.descriptions': DescriptionsPreview,
  'component.timeline': TimelinePreview,
  'component.image': ImagePreview,
  'component.qrcode': QRCodePreview,
  'component.segmented': SegmentedPreview,
  'component.message': MessagePreview,
  'component.notification': NotificationPreview,
  'component.popconfirm': PopconfirmPreview,
  'component.result': ResultPreview,
  'component.loading-overlay': LoadingOverlayPreview,
  'component.watermark': WatermarkPreview,
  'component.tour': TourPreview,
  // 扩展批次：A（通用/布局/导航）、B（数据录入/数据展示）、C（反馈）、
  // D（媒体与内容）、E（AI 与会话）、CHART（图表组件集，echarts 渲染）、
  // BUSINESS（业务，packages/ui business 子目录）、
  // BUTTONS（按钮族：ButtonGroup + 扩展按钮 7 个，@pactor-app/ui/ui）；
  // component.collapse / component.carousel 在 A 与 B 重复定义，以 B 为准
  ...PREVIEWS_A,
  ...PREVIEWS_B,
  ...PREVIEWS_C,
  ...PREVIEWS_D,
  ...PREVIEWS_E,
  ...PREVIEWS_CHART,
  ...PREVIEWS_BLOCKS,
  ...PREVIEWS_BUTTONS,
};

export default function ComponentPreview({ componentId }: { componentId: string }): ReactNode {
  const Preview = PREVIEWS[componentId];
  return Preview ? <Preview /> : null;
}
