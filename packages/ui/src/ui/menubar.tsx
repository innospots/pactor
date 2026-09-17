import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { Menubar as MenubarPrimitive } from '@base-ui/react/menubar';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui Menubar（vendored 源码，Base UI Menubar + Menu 原语）。
 * 官方源码：https://ui.shadcn.com/r/styles/base-nova/menubar.json
 * Menubar 为水平容器，每个 MenubarMenu 是一个 Menu.Root。
 */
function Menubar({
  className,
  ...props
}: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn(
        'flex h-9 items-center gap-1 rounded-md border border-border bg-card p-1 shadow-xs',
        className,
      )}
      {...props}
    />
  );
}

function MenubarMenu({
  ...props
}: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="menubar-menu" {...props} />;
}

function MenubarTrigger({
  className,
  ...props
}: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        'flex cursor-pointer items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none hover:bg-(--menu-hover-background) hover:text-(--menu-hover-foreground) focus:bg-(--menu-hover-background) focus:text-(--menu-hover-foreground) data-open:bg-(--menu-active-background) data-open:text-(--menu-active-foreground)',
        className,
      )}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  align = 'start',
  side = 'bottom',
  sideOffset = 8,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, 'align' | 'side' | 'sideOffset'>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <MenuPrimitive.Popup
          data-slot="menubar-content"
          className={cn(
            'z-50 min-w-36 origin-(--transform-origin) overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md shadow-(color:--shadow-color) duration-200 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fill-mode-forwards data-closed:fade-out-0 data-closed:zoom-out-95',
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function MenubarItem({
  className,
  variant = 'default',
  ...props
}: MenuPrimitive.Item.Props & {
  variant?: 'default' | 'destructive';
}) {
  return (
    <MenuPrimitive.Item
      data-slot="menubar-item"
      data-variant={variant}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-(--menu-hover-background) focus:text-(--menu-hover-foreground) data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function MenubarSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="menubar-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
};
