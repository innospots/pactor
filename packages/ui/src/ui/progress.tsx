import { Progress as ProgressPrimitive } from '@base-ui/react/progress';

import { cn } from '../lib/utils.js';

/** shadcn/ui Progress（vendored 源码，Base UI 原语） */
function Progress({ className, ...props }: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('relative w-full', className)}
      {...props}
    />
  );
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      className={cn('h-2 w-full overflow-hidden rounded-full bg-(--progress-track)', className)}
      {...props}
    />
  );
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        'h-full bg-(--progress-indicator) transition-[width] duration-300 ease-in-out',
        className,
      )}
      {...props}
    />
  );
}

export { Progress, ProgressIndicator, ProgressTrack };
