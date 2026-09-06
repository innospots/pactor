import { GripVerticalIcon } from 'lucide-react';
import * as React from 'react';
import {
  Group as PanelGroupPrimitive,
  Panel as PanelPrimitive,
  Separator as PanelResizeHandlePrimitive,
} from 'react-resizable-panels';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui Resizable（vendored 源码封装，react-resizable-panels 原语）：
 * PanelGroup（direction→orientation）+ Panel + ResizableHandle（带拖拽手柄）。
 */
function PanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof PanelGroupPrimitive>) {
  return (
    <PanelGroupPrimitive
      data-slot="resizable-panel-group"
      className={cn(
        'flex h-full w-full data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    />
  );
}

function Panel({ ...props }: React.ComponentProps<typeof PanelPrimitive>) {
  return <PanelPrimitive data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof PanelResizeHandlePrimitive> & {
  withHandle?: boolean;
}) {
  return (
    <PanelResizeHandlePrimitive
      data-slot="resizable-handle"
      className={cn(
        'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:h-1 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:translate-x-0 data-[orientation=vertical]:after:-translate-y-1/2 [&[data-orientation=vertical]>div]:rotate-90',
        className,
      )}
      {...props}
    >
      {withHandle ? (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-xs border border-border bg-border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      ) : null}
    </PanelResizeHandlePrimitive>
  );
}

export { Panel, PanelGroup, ResizableHandle };
