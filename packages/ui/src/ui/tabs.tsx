import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { PlusIcon, XIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui Tabs（vendored 源码，Base UI 原语）。
 * 官方源码：https://ui.shadcn.com/r/styles/base-nova/tabs.json
 * Root/List/Tab/Panel 对应原 Radix Root/List/Trigger/Content；激活态属性
 * 由 `data-[state=active]` 换成官方 `data-active` 自定义变体。
 * List 支持 `variant`（default 胶囊 / line 下划线 / page 可编辑页面页签）
 * 与 `size`（default h-9 / sm h-8 + 触发器 text-xs，仅压缩胶囊变体，
 * line 行高不变）；激活态装饰按
 * `group-data-[variant=*]/tabs-list`、尺寸按 `group-data-[size=*]/tabs-list`
 * 分别限定，互不污染。page 变体的视觉细节（页签条、顶部圆角、关闭 / 新增
 * 按钮）由 styles.css 中的 `data-variant=page` 规则承载。
 */
function Tabs({
  className,
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground',
  {
    variants: {
      variant: {
        default: 'h-9 rounded-lg bg-muted p-[3px]',
        // line：页签栏通栏（下划线轨道占满容器宽），触发器自然宽度靠左排列
        line: 'h-auto w-full justify-start gap-1 rounded-none border-b border-border bg-transparent p-0',
        // page：可编辑页面页签（浅灰页签条 + 顶部圆角页签），
        // 具体视觉见 styles.css 中 data-variant=page 规则
        page: 'pactor-tabs-page',
      },
      /** 尺寸（对齐 Button 的 size 语义）：sm 经 compoundVariants 仅压缩胶囊变体 */
      size: {
        default: '',
        sm: '',
      },
    },
    compoundVariants: [
      { variant: 'default', size: 'sm', class: 'h-8' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function TabsList({
  className,
  variant,
  size,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant ?? 'default'}
      data-size={size ?? 'default'}
      className={cn(tabsListVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export interface TabsTriggerProps extends TabsPrimitive.Tab.Props {
  /** 页签名旁的状态图标（page 变体；装饰性，aria-hidden） */
  icon?: ReactNode;
  /** 图标位置：start 页签名前（缺省）/ end 页签名后、关闭按钮前 */
  iconPosition?: 'start' | 'end';
  /** 在页签右侧渲染关闭按钮（page 变体） */
  closable?: boolean;
  /** 关闭按钮无障碍名称，通常为「关闭 <页签名>」 */
  closeLabel?: string;
  /** 关闭事件；关闭按钮与页签按钮为兄弟节点，触发时不切换激活页签 */
  onClose?: () => void;
}

function TabsTrigger({
  className,
  icon,
  iconPosition = 'start',
  closable,
  closeLabel,
  onClose,
  children,
  ...props
}: TabsTriggerProps) {
  const iconNode = icon ? (
    <span aria-hidden="true" data-slot="tabs-trigger-icon">
      {icon}
    </span>
  ) : null;
  const tab = (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      data-closable={closable || undefined}
      className={cn(
        "inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // default 变体：激活态胶囊（边框 + 卡片底 + 阴影）
        'group-data-[variant=default]/tabs-list:data-active:border-border group-data-[variant=default]/tabs-list:data-active:bg-card group-data-[variant=default]/tabs-list:data-active:shadow-sm',
        // line 变体：下划线指示——弱化未激活文字，激活态底部 2px 主色线
        //（叠在 List 的底边轨道上），无底色/圆角/阴影；通栏 List 下取消
        // flex-1 拉伸，触发器保持自然宽度
        'group-data-[variant=line]/tabs-list:-mb-px group-data-[variant=line]/tabs-list:h-9 group-data-[variant=line]/tabs-list:flex-none group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:border-x-0 group-data-[variant=line]/tabs-list:border-t-0 group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:py-1.5 group-data-[variant=line]/tabs-list:text-muted-foreground group-data-[variant=line]/tabs-list:data-active:border-b-primary group-data-[variant=line]/tabs-list:data-active:text-foreground',
        // size=sm：小字号 + 收紧纵向 padding（高度随 List h-8 自动收缩）
        'group-data-[size=sm]/tabs-list:py-0.5 group-data-[size=sm]/tabs-list:text-xs',
        className,
      )}
      {...props}
    >
      {iconPosition === 'start' ? iconNode : null}
      {children}
      {iconPosition === 'end' ? iconNode : null}
    </TabsPrimitive.Tab>
  );

  // 非 closable 保持原有单按钮 DOM；可关闭页签把关闭按钮放在页签按钮的
  // 兄弟位置，避免 <button> 嵌套并保持列表的焦点顺序可预测。
  if (!closable) return tab;

  return (
    <span
      data-slot="tabs-trigger-wrapper"
      className="relative inline-flex flex-none items-stretch"
    >
      {tab}
      <button
        aria-label={closeLabel}
        data-slot="tabs-trigger-close"
        type="button"
        className="absolute top-1/2 right-1 inline-flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-3"
        onClick={(event) => {
          event.stopPropagation();
          onClose?.();
        }}
      >
        <XIcon aria-hidden="true" />
      </button>
    </span>
  );
}

export interface TabsAddButtonProps
  extends Omit<ComponentProps<'button'>, 'type'> {
  /** 按钮无障碍名称，必填 */
  label: string;
}

/** 页签栏尾部的新增按钮（page 变体）；children 缺省为加号图标。 */
function TabsAddButton({
  className,
  label,
  children,
  ...props
}: TabsAddButtonProps) {
  return (
    <button
      aria-label={label}
      data-slot="tabs-add"
      type="button"
      className={cn(
        "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-card p-0 text-foreground transition-colors hover:border-primary hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children ?? <PlusIcon aria-hidden="true" />}
    </button>
  );
}

function TabsContent({
  className,
  ...props
}: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export {
  Tabs,
  TabsAddButton,
  TabsContent,
  TabsList,
  TabsTrigger,
};
