/**
 * `@pactor-app/ui/ui` 子路径（vendored shadcn 原语）测试：
 * - 全部公开符号可从汇总入口导入（src/ui/index.ts 即 ./ui 子路径入口）
 * - 关键原语（Button/Input/Popover/Dialog/Select）可渲染
 */
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as ui from '../src/ui/index.js';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectTrigger,
  SelectValue,
} from '../src/ui/index.js';
import './components/setup.js';

describe('/ui 子路径汇总导出', () => {
  it('各 vendored 模块的公开符号齐全', () => {
    const expected = [
      // accordion
      'Accordion',
      'AccordionContent',
      'AccordionItem',
      'AccordionTrigger',
      // alert
      'Alert',
      'AlertDescription',
      'AlertTitle',
      // badge
      'Badge',
      'badgeVariants',
      // button
      'Button',
      'buttonVariants',
      // card
      'Card',
      'CardAction',
      'CardContent',
      'CardDescription',
      'CardFooter',
      'CardHeader',
      'CardTitle',
      // dialog
      'Dialog',
      'DialogClose',
      'DialogContent',
      'DialogDescription',
      'DialogFooter',
      'DialogHeader',
      'DialogOverlay',
      'DialogPortal',
      'DialogTitle',
      'DialogTrigger',
      // input / label
      'Input',
      'Label',
      // popover
      'Popover',
      'PopoverContent',
      'PopoverTrigger',
      // select
      'Select',
      'SelectContent',
      'SelectGroup',
      'SelectItem',
      'SelectLabel',
      'SelectScrollDownButton',
      'SelectScrollUpButton',
      'SelectSeparator',
      'SelectTrigger',
      'SelectValue',
      // separator / skeleton
      'Separator',
      'Skeleton',
      // table
      'Table',
      'TableBody',
      'TableCaption',
      'TableCell',
      'TableFooter',
      'TableHead',
      'TableHeader',
      'TableRow',
      // tabs / textarea
      'Tabs',
      'TabsContent',
      'TabsList',
      'TabsTrigger',
      'Textarea',
    ] as const;
    for (const name of expected) {
      expect(
        (ui as Record<string, unknown>)[name],
        `缺少导出符号 ${name}`,
      ).toBeDefined();
    }
  });
});

describe('/ui 原语可渲染', () => {
  it('Button 渲染为带 shadcn 变体类的按钮', () => {
    render(<Button variant="outline">保存</Button>);
    const button = screen.getByRole('button', { name: '保存' });
    expect(button.className).toContain('border-border');
  });

  it('Input 渲染', () => {
    render(<Input aria-label="标题" placeholder="输入" />);
    expect(screen.getByLabelText('标题')).toBeDefined();
  });

  it('Popover：Trigger 点击打开 Content', async () => {
    render(
      <Popover open>
        <PopoverTrigger render={<Button>打开</Button>} />
        <PopoverContent>弹层内容</PopoverContent>
      </Popover>,
    );
    expect(await screen.findByText('弹层内容')).toBeDefined();
  });

  it('Dialog：受控 open 渲染内容', async () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>标题</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(await screen.findByRole('dialog')).toBeDefined();
    expect(screen.getByText('标题')).toBeDefined();
  });

  it('Select：Trigger 渲染占位值', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="选择" />
        </SelectTrigger>
      </Select>,
    );
    expect(screen.getByText('选择')).toBeDefined();
  });
});
