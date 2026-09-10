import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import * as React from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';

import { cn } from '../lib/utils.js';
import { buttonVariants } from './button.js';

/**
 * shadcn/ui Calendar（vendored 源码封装，react-day-picker 原语）：
 * 以 classNames 覆盖为 shadcn 语义令牌样式；`mode="single"` 受控选择
 * 由 DSL 适配层接入。
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('bg-background p-3', className)}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('relative flex flex-col gap-4 md:flex-row', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          'flex h-7 w-full items-center justify-center px-7',
          defaultClassNames.month_caption,
        ),
        caption_label: cn('text-sm font-medium', defaultClassNames.caption_label),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground',
          defaultClassNames.weekday,
        ),
        week: cn('mt-2 flex w-full', defaultClassNames.week),
        day: cn('h-8 w-8 p-0 text-center text-sm', defaultClassNames.day),
        day_button: cn(
          'size-8 cursor-pointer rounded-md p-0 font-normal hover:bg-(--calendar-day-hover-background) hover:text-(--calendar-day-hover-foreground) aria-selected:opacity-100',
          defaultClassNames.day_button,
        ),
        selected: cn(
          '[&>button]:bg-(--calendar-selected-background) [&>button]:text-(--calendar-selected-foreground) [&>button]:hover:bg-(--calendar-selected-background)',
          defaultClassNames.selected,
        ),
        today: cn(
          '[&>button]:bg-(--calendar-today-background) [&>button]:text-(--calendar-today-foreground)',
          defaultClassNames.today,
        ),
        outside: cn(
          'text-muted-foreground opacity-50 aria-selected:text-muted-foreground',
          defaultClassNames.outside,
        ),
        disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeftIcon className="size-4" />
          ) : (
            <ChevronRightIcon className="size-4" />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
