import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui Separator（vendored 源码，Base UI 原语）。
 * 官方源码：https://ui.shadcn.com/r/styles/base-nova/separator.json
 * Base UI Separator 无 `decorative` prop（始终为可访问的 separator 角色），
 * 该 prop 仅为保持导出表面而保留、不再透传。
 */
function Separator({
  className,
  orientation = 'horizontal',
  decorative: _decorative,
  ...props
}: Omit<SeparatorPrimitive.Props, 'orientation'> & {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
