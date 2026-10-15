import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui Tabs（vendored 源码，Base UI 原语）。
 * 官方源码：https://ui.shadcn.com/r/styles/base-nova/tabs.json
 * Root/List/Tab/Panel 对应原 Radix Root/List/Trigger/Content；激活态属性
 * 由 `data-[state=active]` 换成官方 `data-active` 自定义变体。
 * List 支持 `variant`（default 胶囊 / line 下划线）与 `size`（default h-9 /
 * sm h-8 + 触发器 text-xs，仅压缩胶囊变体，line 行高不变）；激活态装饰按
 * `group-data-[variant=*]/tabs-list`、尺寸按 `group-data-[size=*]/tabs-list`
 * 分别限定，互不污染。
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

function TabsTrigger({
  className,
  ...props
}: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
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
    />
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

export { Tabs, TabsContent, TabsList, TabsTrigger };
