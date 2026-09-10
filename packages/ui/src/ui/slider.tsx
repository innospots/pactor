import { Slider as SliderPrimitive } from '@base-ui/react/slider';

import { cn } from '../lib/utils.js';

/** shadcn/ui Slider（vendored 源码，Base UI 原语；单值滑杆形态） */
function Slider({ className, ...props }: SliderPrimitive.Root.Props<number>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        'relative flex w-full touch-none items-center select-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

function SliderControl({ className, ...props }: SliderPrimitive.Control.Props) {
  return (
    <SliderPrimitive.Control
      data-slot="slider-control"
      className={cn('flex w-full items-center py-2', className)}
      {...props}
    />
  );
}

function SliderTrack({ className, ...props }: SliderPrimitive.Track.Props) {
  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      className={cn(
        'relative h-1.5 w-full grow overflow-hidden rounded-full bg-(--slider-track)',
        className,
      )}
      {...props}
    />
  );
}

function SliderIndicator({ className, ...props }: SliderPrimitive.Indicator.Props) {
  return (
    <SliderPrimitive.Indicator
      data-slot="slider-indicator"
      className={cn('absolute h-full bg-(--slider-range)', className)}
      {...props}
    />
  );
}

function SliderThumb({ className, ...props }: SliderPrimitive.Thumb.Props) {
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className={cn(
        'block size-4 shrink-0 cursor-grab rounded-full border border-primary bg-(--slider-thumb) shadow-sm transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack };
