import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui HoverCard（vendored 源码，Base UI PreviewCard 原语——
 * Base UI 对 Radix HoverCard 的对应组件）。
 * 官方源码：https://ui.shadcn.com/r/styles/base-nova/hover-card.json
 */
function HoverCard({
  ...props
}: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({
  ...props
}: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

function HoverCardContent({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<PreviewCardPrimitive.Positioner.Props, 'align' | 'side' | 'sideOffset'>) {
  return (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            'z-50 w-64 origin-(--transform-origin) rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md shadow-(color:--shadow-color) outline-hidden duration-200 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fill-mode-forwards data-closed:fade-out-0 data-closed:zoom-out-95',
            className,
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
