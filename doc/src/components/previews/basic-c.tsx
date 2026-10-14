/**
 * 组件运行态预览注册表（第三批）：反馈 / 数据展示 / 图表 / 弹层类组件。
 * 纯 React 组件直接命名导入渲染；Drawer / Dialog / Popover 依赖 Renderer
 * 上下文，经 DslPreview 以真实 DSL 渲染（与业务页面同一代码路径）。
 */
import type { ReactElement } from 'react';
import type { DslNode } from '@pactor-app/core';
import {
  Alert,
  Progress,
  Skeleton,
  Spinner,
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

function AlertPreview() {
  return (
    <div style={columnStyle}>
      <Alert variant="success" showIcon message="保存成功" description="所有更改已同步至云端。" />
      <Alert variant="info" showIcon message="版本更新" description="v2.4 已发布，包含 12 项改进。" />
      <Alert variant="warning" showIcon message="配额即将用尽" description="本月 API 调用已达 90%。" />
      <Alert variant="error" showIcon message="提交失败" description="网络异常，请稍后重试。" />
    </div>
  );
}

const DRAWER_NODE: DslNode = {
  type: 'Flex',
  children: [
    {
      type: 'Button',
      props: { text: '打开抽屉', variant: 'primary' },
      events: {
        onClick: [{ action: 'setState', params: { drawerOpen: true } }],
      },
    },
    {
      type: 'Drawer',
      props: {
        title: '订单详情',
        placement: 'right',
        open: '${state.drawerOpen}',
      },
      events: {
        onClose: [{ action: 'setState', params: { drawerOpen: false } }],
      },
      children: [
        {
          type: 'Flex',
          props: { direction: 'vertical', gap: 'middle' },
          children: [
            { type: 'Text', props: { text: '订单号：PO20260921001' } },
            { type: 'Text', props: { text: '金额：¥1,280.00 · 已支付' } },
            { type: 'Text', props: { text: '收货地址：杭州市西湖区文三路 100 号' } },
          ],
        },
      ],
    },
  ],
};

function DrawerPreview() {
  return <DslPreview node={DRAWER_NODE} />;
}

function ProgressPreview() {
  return (
    <div style={columnStyle}>
      <Progress value={30} />
      <Progress value={70} />
      <Progress value={100} />
    </div>
  );
}

function SkeletonPreview() {
  return (
    <div style={{ ...blockStyle, ...columnStyle, maxWidth: 360 }}>
      <div style={rowStyle}>
        <Skeleton shape="circle" width={40} height={40} />
        <div style={{ ...columnStyle, gap: 8, flex: 1 }}>
          <Skeleton shape="line" width="60%" />
          <Skeleton shape="line" width="40%" />
        </div>
      </div>
      <Skeleton shape="rect" height={96} />
      <Skeleton shape="line" />
    </div>
  );
}

function SpinPreview() {
  return (
    <div style={rowStyle}>
      <Spinner size="sm" />
      <Spinner size="lg" />
    </div>
  );
}

const MODAL_NODE: DslNode = {
  type: 'Dialog',
  props: {
    title: '编辑成员',
    description: '修改后将立即生效',
    trigger: { type: 'Button', props: { text: '打开对话框', variant: 'primary' } },
  },
  children: [
    { type: 'Text', props: { text: '在这里放置表单或其他内容子树；关闭（X / 遮罩 / Escape）由组件内部状态自管理。' } },
  ],
};

function ModalPreview() {
  return <DslPreview node={MODAL_NODE} />;
}

const POPOVER_NODE: DslNode = {
  type: 'Popover',
  props: {
    content: { type: 'Text', props: { text: '浮层内容：可放任意 DSL 子树，点击外部关闭。' } },
  },
  children: [{ type: 'Button', props: { text: '打开浮层', variant: 'default' } }],
};

function PopoverPreview() {
  return <DslPreview node={POPOVER_NODE} />;
}

export const PREVIEWS_C: Record<string, () => ReactElement> = {
  'component.alert': AlertPreview,
  'component.drawer': DrawerPreview,
  'component.progress': ProgressPreview,
  'component.skeleton': SkeletonPreview,
  'component.spinner': SpinPreview,
  'component.dialog': ModalPreview,
  'component.popover': PopoverPreview,
};
