import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '../lib/utils.js';

/** shadcn/ui Switch（vendored 源码，Base UI 原语） */
function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'inline-flex h-[1.15rem] w-8 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-checked:bg-(--switch-track-checked) data-unchecked:bg-(--switch-track)',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-4 rounded-full bg-(--switch-thumb) transition-transform data-checked:translate-x-[calc(100%-2px)] data-unchecked:translate-x-0"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
