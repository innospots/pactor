/**
 * 组件运行态预览注册表（基础批）：图标 / 排版 / 布局 / 导航 / 容器类组件。
 * 纯 React 组件直接命名导入渲染；Link / Breadcrumb 内部经 useRenderer
 * 读取路由上下文（useSpaLinkClick），Layout / Resizable / Tabs / Carousel /
 * Accordion 依赖 Renderer children 机制，均经 DslPreview 以真实 DSL 渲染
 * （与业务页面同一代码路径）。
 */
import { useState, type ReactElement } from 'react';
import type { DslNode } from '@pactor-app/core';
import {
  AspectRatio,
  Avatar,
  Badge,
  Button,
  DropdownMenu,
  Flex,
  Grid,
  Icon,
  Menu,
  NavigationMenu,
  Pagination,
  ScrollArea,
  Separator,
  Tooltip,
  Typography,
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

function demoImage(label: string, fill: string): string {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="180"><rect width="480" height="180" fill="${fill}"/><text x="240" y="96" font-size="16" text-anchor="middle" fill="#ffffff">${label}</text></svg>`,
    )
  );
}

function IconPreview() {
  return (
    <div style={rowStyle}>
      <Icon name="search" size="sm" />
      <Icon name="settings" />
      <Icon name="heart" size="lg" color="#e0245e" />
      <Icon name="download" size={28} color="#1677ff" />
    </div>
  );
}

function TypographyPreview() {
  return (
    <div style={columnStyle}>
      <Typography variant="h3" text="三级标题 H3" />
      <Typography variant="p" text="正文段落：用于常规阅读文本，行高宽松。" />
      <Typography variant="muted" text="弱化文本：用于辅助说明与次要信息。" />
      <Typography variant="inline-code" text="const total = 95" />
    </div>
  );
}

const LINK_NODE: DslNode = {
  type: 'Flex',
  props: { gap: 16 },
  children: [
    { type: 'Link', props: { href: '/components', text: '站内链接（SPA 导航）' } },
    { type: 'Link', props: { href: 'https://example.com', text: '外部链接（新窗口）', target: '_blank' } },
  ],
};

function LinkPreview() {
  return <DslPreview node={LINK_NODE} />;
}

function DividerPreview() {
  return (
    <div style={columnStyle}>
      <div style={{ fontSize: 13 }}>上方内容区块</div>
      <Separator />
      <div style={{ ...rowStyle, height: 20, fontSize: 13 }}>
        <span>条目一</span>
        <Separator orientation="vertical" />
        <span>条目二</span>
        <Separator orientation="vertical" />
        <span>条目三</span>
      </div>
    </div>
  );
}

function AvatarPreview() {
  return (
    <div style={rowStyle}>
      <Avatar src="https://i.pravatar.cc/64" alt="用户头像" />
      <Avatar src="https://i.pravatar.cc/64?img=5" alt="成员头像" />
      <Avatar fallback="张" />
    </div>
  );
}

function BadgePreview() {
  return (
    <div style={rowStyle}>
      <Badge text="默认" />
      <Badge text="次要" variant="secondary" />
      <Badge text="危险" variant="destructive" />
      <Badge text="描边" variant="outline" />
    </div>
  );
}

function TooltipPreview() {
  return (
    <Tooltip content="这里是提示内容">
      <Button text="悬浮查看提示" variant="default" />
    </Tooltip>
  );
}

const GRID_COLORS = ['#dbeafe', '#dcfce7', '#fef3c7', '#fee2e2', '#ede9fe', '#cffafe'];

function GridPreview() {
  return (
    <Grid columns={3} gap={12}>
      {GRID_COLORS.map((color) => (
        <div key={color} style={{ height: 48, borderRadius: 6, background: color }} />
      ))}
    </Grid>
  );
}

function FlexPreview() {
  return (
    <Flex justify="space-between" align="center" gap={12} style={{ width: '100%' }}>
      <div style={{ ...blockStyle, background: '#dbeafe', border: 'none' }}>左</div>
      <div style={{ ...blockStyle, background: '#dcfce7', border: 'none' }}>中</div>
      <div style={{ ...blockStyle, background: '#fef3c7', border: 'none' }}>右</div>
    </Flex>
  );
}

function AspectRatioPreview() {
  return (
    <div style={{ maxWidth: 320 }}>
      <AspectRatio ratio={16 / 9}>
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 8,
            background: '#dbeafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            color: '#1e40af',
          }}
        >
          16 / 9
        </div>
      </AspectRatio>
    </div>
  );
}

function ScrollAreaPreview() {
  return (
    <ScrollArea maxHeight={120}>
      <div style={{ ...columnStyle, gap: 4, fontSize: 13 }}>
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index}>通知消息 {index + 1}：你提交的报表已通过审批。</div>
        ))}
      </div>
    </ScrollArea>
  );
}

function MenuPreview() {
  const [selected, setSelected] = useState('dashboard');
  return (
    <div style={{ ...blockStyle, width: 240, padding: 0 }}>
      <Menu
        items={[
          { key: 'dashboard', label: '工作台', icon: 'home' },
          { key: 'orders', label: '订单管理', icon: 'list', badge: 12 },
          { key: 'stats', label: '数据统计', icon: 'chart' },
          { key: 'settings', label: '系统设置', icon: 'settings', disabled: true },
        ]}
        selectedKey={selected}
        onSelect={setSelected}
      />
    </div>
  );
}

const BREADCRUMB_NODE: DslNode = {
  type: 'Breadcrumb',
  props: {
    items: [
      { label: '首页', href: '/' },
      { label: '组件', href: '/components' },
      { label: '面包屑' },
    ],
  },
};

function BreadcrumbPreview() {
  return <DslPreview node={BREADCRUMB_NODE} />;
}

function PaginationPreview() {
  const [page, setPage] = useState(1);
  return (
    <div style={columnStyle}>
      <Pagination total={95} pageSize={10} page={page} onChange={setPage} />
      <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
        当前第 {page} 页 · 共 95 条
      </div>
    </div>
  );
}

function DropdownPreview() {
  const [selected, setSelected] = useState('');
  return (
    <div style={rowStyle}>
      <DropdownMenu
        items={[
          { label: '重命名', value: 'rename', icon: 'pencil' },
          { label: '分享', value: 'share', icon: 'share' },
          { label: '删除', value: 'delete', icon: 'trash', danger: true },
        ]}
        onSelect={setSelected}
      >
        <Button text="打开菜单" variant="default" />
      </DropdownMenu>
      <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
        {selected ? `已选择：${selected}` : '点击按钮打开下拉菜单'}
      </span>
    </div>
  );
}

function NavigationPreview() {
  return (
    <NavigationMenu
      items={[
        {
          label: '产品',
          children: [
            { label: '动态页面', href: '#', description: 'DSL 驱动的页面运行时', icon: 'grid' },
            { label: '资产库', href: '#', description: '组件与区块资产目录', icon: 'package' },
          ],
        },
        { label: '文档', href: '#', icon: 'file-text' },
        { label: '关于', href: '#' },
      ]}
    />
  );
}

const layoutText = (text: string) => ({
  type: 'Text',
  props: { text, style: { display: 'block', padding: 8 } },
});

const LAYOUT_NODE: DslNode = {
  type: 'Layout',
  children: [
    { type: 'Header', children: [layoutText('Header 顶部区')] },
    {
      type: 'Layout',
      children: [
        { type: 'Sider', props: { width: 120 }, children: [layoutText('Sider 侧边')] },
        { type: 'Content', children: [layoutText('Content 内容区')] },
      ],
    },
    { type: 'Footer', children: [layoutText('Footer 底部区')] },
  ],
};

function LayoutPreview() {
  return (
    <div style={{ height: 180, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      <DslPreview node={LAYOUT_NODE} />
    </div>
  );
}

const SPLITTER_NODE: DslNode = {
  type: 'Resizable',
  props: {
    panels: [
      { defaultSize: 40, children: [layoutText('左侧面板')] },
      { children: [layoutText('右侧面板（拖动手柄调整）')] },
    ],
  },
};

function SplitterPreview() {
  return (
    <div style={{ height: 100, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      <DslPreview node={SPLITTER_NODE} />
    </div>
  );
}

const RESIZABLE_NODE: DslNode = {
  type: 'Resizable',
  props: {
    direction: 'vertical',
    panels: [
      { defaultSize: 30, children: [layoutText('面板一')] },
      { children: [layoutText('面板二（纵向排列，手柄可拖拽）')] },
      { defaultSize: 25, children: [layoutText('面板三')] },
    ],
  },
};

function ResizablePreview() {
  return (
    <div style={{ height: 200, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      <DslPreview node={RESIZABLE_NODE} />
    </div>
  );
}

const TABS_NODE: DslNode = {
  type: 'Tabs',
  props: {
    items: [
      { key: 'overview', label: '概览', children: [layoutText('概览页签内容区。')] },
      {
        key: 'detail',
        label: '明细',
        children: [
          { type: 'Alert', props: { variant: 'info', showIcon: true, message: '页签内容可放任意 DSL 子树。' } },
        ],
      },
      { key: 'setting', label: '设置', children: [layoutText('设置页签内容区。')] },
    ],
  },
};

function TabsPreview() {
  return <DslPreview node={TABS_NODE} />;
}

const CAROUSEL_NODE: DslNode = {
  type: 'Carousel',
  props: {
    loop: true,
    items: [
      { src: demoImage('轮播一', '#60a5fa'), alt: '轮播一' },
      { src: demoImage('轮播二', '#34d399'), alt: '轮播二' },
      { src: demoImage('轮播三', '#fbbf24'), alt: '轮播三' },
    ],
  },
};

function CarouselPreview() {
  return (
    <div style={{ maxWidth: 480, padding: '0 48px' }}>
      <DslPreview node={CAROUSEL_NODE} />
    </div>
  );
}

const COLLAPSE_NODE: DslNode = {
  type: 'Accordion',
  props: {
    items: [
      { key: 'a', title: '什么是动态页面？', children: [layoutText('以 DSL 描述页面结构，由运行时渲染为真实组件。')] },
      { key: 'b', title: '如何扩展组件？', children: [layoutText('在组件注册表登记适配器后即可在 DSL 中引用。')] },
      { key: 'c', title: '支持哪些数据源？', children: [layoutText('支持 HTTP 服务与静态数据，可绑定表达式。')] },
    ],
  },
};

function CollapsePreview() {
  return <DslPreview node={COLLAPSE_NODE} />;
}

export const PREVIEWS_A: Record<string, () => ReactElement> = {
  'component.icon': IconPreview,
  'component.typography': TypographyPreview,
  'component.link': LinkPreview,
  'component.separator': DividerPreview,
  'component.avatar': AvatarPreview,
  'component.badge': BadgePreview,
  'component.tooltip': TooltipPreview,
  'component.grid': GridPreview,
  'component.flex': FlexPreview,
  'component.aspect-ratio': AspectRatioPreview,
  'component.scroll-area': ScrollAreaPreview,
  'component.menu': MenuPreview,
  'component.breadcrumb': BreadcrumbPreview,
  'component.pagination': PaginationPreview,
  'component.dropdown-menu': DropdownPreview,
  'component.navigation-menu': NavigationPreview,
  'component.layout': LayoutPreview,
  'component.splitter': SplitterPreview,
  'component.resizable': ResizablePreview,
  'component.tabs': TabsPreview,
  'component.carousel': CarouselPreview,
  'component.accordion': CollapsePreview,
};
