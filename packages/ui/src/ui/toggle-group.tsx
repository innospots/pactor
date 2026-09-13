import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../lib/utils.js';
import { toggleVariants } from './toggle.js';

/** shadcn/ui ToggleGroup（vendored 源码，Base UI 原语）：相连的多选/单选切换组 */
const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: 'default',
  variant: 'default',
});

function ToggleGroup({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}: ToggleGroupPrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        'group/toggle-group flex w-fit items-center gap-1 rounded-md',
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={variant ?? context.variant}
      data-size={size ?? context.size}
      className={cn(
        toggleVariants({
          variant: variant ?? context.variant,
          size: size ?? context.size,
        }),
        'min-w-0 flex-1 shrink-0 shadow-none focus:z-10 focus-visible:z-10',
        className,
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}

export { ToggleGroup, ToggleGroupItem };
