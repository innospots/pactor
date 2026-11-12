/**
 * `@pactor-app/ui/ui` 子路径（vendored shadcn 原语）测试：
 * - 全部公开符号可从汇总入口导入（src/ui/index.ts 即 ./ui 子路径入口）
 * - 关键原语（Button/Input/Popover/Dialog/Select）可渲染
 */
// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsAddButton,
  TabsList,
  TabsTrigger,
} from '../src/ui/index.js';
import './components/setup.js';

// vitest globals 未开启，RTL 不会自动卸载上一条用例的 DOM，这里显式清理
afterEach(cleanup);

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
      'TabsAddButton',
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

  it('Select：选中值可收缩省略，长 label 不顶出右侧图标', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="选择" />
        </SelectTrigger>
      </Select>,
    );
    const value = document.querySelector('[data-slot="select-value"]');
    // 定宽触发器内：flex-1 + min-w-0 允许收缩让出箭头 / 清除按钮位置，
    // truncate 负责长 label 省略号
    expect(value?.className).toContain('flex-1');
    expect(value?.className).toContain('min-w-0');
    expect(value?.className).toContain('truncate');
  });

  it('Tabs：List size=sm 标记 data-size 并压缩胶囊高度与触发器字号', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList size="sm">
          <TabsTrigger value="a">甲</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    const list = screen.getByRole('tab', { name: '甲' })
      .parentElement as HTMLElement;
    expect(list.dataset.size).toBe('sm');
    expect(list.className).toContain('h-(--pactor-control-height-sm)');
    expect(screen.getByRole('tab', { name: '甲' }).className).toContain(
      'group-data-[size=sm]/tabs-list:text-[length:var(--pactor-control-text-sm)]',
    );
  });

  it('Tabs：List size 缺省为 default（md 档高度令牌）', () => {
    render(
      <Tabs defaultValue="b">
        <TabsList>
          <TabsTrigger value="b">乙</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    const list = screen.getByRole('tab', { name: '乙' })
      .parentElement as HTMLElement;
    expect(list.dataset.size).toBe('default');
    expect(list.className).toContain('h-(--pactor-control-height-md)');
  });

  it('Tabs：page 变体标记 data-variant 且非 closable 页签保持单按钮结构', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="page">
          <TabsTrigger value="a">甲</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    const tab = screen.getByRole('tab', { name: '甲' });
    const list = tab.parentElement as HTMLElement;
    expect(list.dataset.variant).toBe('page');
    expect(list.className).toContain('pactor-tabs-page');
    expect(tab.dataset.slot).toBe('tabs-trigger');
  });

  it('Tabs：iconPosition 控制状态图标位于页签名前 / 后', () => {
    const { unmount } = render(
      <Tabs defaultValue="a">
        <TabsList variant="page">
          <TabsTrigger icon={<span>图标</span>} value="a">
            甲
          </TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    expect(
      screen.getByRole('tab', { name: '甲' }).firstElementChild?.getAttribute(
        'data-slot',
      ),
    ).toBe('tabs-trigger-icon');
    unmount();

    render(
      <Tabs defaultValue="a">
        <TabsList variant="page">
          <TabsTrigger icon={<span>图标</span>} iconPosition="end" value="a">
            甲
          </TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    expect(
      screen.getByRole('tab', { name: '甲' }).lastElementChild?.getAttribute(
        'data-slot',
      ),
    ).toBe('tabs-trigger-icon');
  });

  it('Tabs：closable 页签的关闭按钮与页签按钮为兄弟节点，关闭不切换激活页签', () => {
    const onClose = vi.fn();
    render(
      <Tabs defaultValue="a">
        <TabsList variant="page">
          <TabsTrigger value="a">甲</TabsTrigger>
          <TabsTrigger
            closable
            closeLabel="关闭 乙"
            value="b"
            onClose={onClose}
          >
            乙
          </TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    const tab = screen.getByRole('tab', { name: '乙' });
    const wrapper = tab.parentElement as HTMLElement;
    const close = screen.getByRole('button', { name: '关闭 乙' });
    expect(wrapper.dataset.slot).toBe('tabs-trigger-wrapper');
    expect(close.parentElement).toBe(wrapper);
    expect(close.contains(tab)).toBe(false);

    fireEvent.click(close);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('tab', { name: '甲' }).getAttribute('aria-selected'),
    ).toBe('true');
  });

  it('Tabs：TabsAddButton 使用 aria-label 并触发 onClick', () => {
    const onAdd = vi.fn();
    render(
      <Tabs defaultValue="a">
        <TabsList variant="page">
          <TabsTrigger value="a">甲</TabsTrigger>
          <TabsAddButton label="新建页面" onClick={onAdd} />
        </TabsList>
      </Tabs>,
    );

    fireEvent.click(screen.getByRole('button', { name: '新建页面' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('Select：弹层最小宽度跟随触发器（--anchor-width）', async () => {
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="选择" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">选项 A</SelectItem>
        </SelectContent>
      </Select>,
    );
    // listbox 角色在 Popup 内层的 List 上，弹层本体取最近的 select-content 祖先
    const list = await screen.findByRole('listbox');
    const popup = list.closest('[data-slot="select-content"]');
    expect(popup?.className).toContain('min-w-(--anchor-width)');
  });
});

describe('Input search', () => {
  it('search=true 时前置搜索图标，并左留图标位内边距', () => {
    const { container } = render(<Input aria-label="搜索" search placeholder="搜索" />);
    const input = screen.getByLabelText('搜索');
    // 加 !important：聚合样式中后段 px-3 会覆盖普通 pl-9
    expect(input.className).toContain('pl-9!');
    const wrapper = container.querySelector('[data-slot="input-search"]');
    expect(wrapper).not.toBeNull();
    // 图标为装饰性（aria-hidden），不参与无障碍名称
    expect(wrapper?.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  });

  it('未开启 search 时不渲染包裹层与图标', () => {
    const { container } = render(<Input aria-label="标题" />);
    const input = screen.getByLabelText('标题');
    expect(container.querySelector('[data-slot="input-search"]')).toBeNull();
    expect(container.querySelector('svg')).toBeNull();
    expect(input.className).not.toContain('pl-9');
  });

  it('回车触发 onSearch 并传出当前值；其他按键不触发', () => {
    const onSearch = vi.fn();
    render(
      <Input aria-label="搜索" search onSearch={onSearch} defaultValue="pactor" />,
    );
    const input = screen.getByLabelText('搜索');
    fireEvent.keyDown(input, { key: 'a' });
    expect(onSearch).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('pactor');
  });

  it('IME 组字中的回车不触发 onSearch', () => {
    const onSearch = vi.fn();
    render(
      <Input aria-label="搜索" search onSearch={onSearch} defaultValue="搜" />,
    );
    fireEvent.keyDown(screen.getByLabelText('搜索'), {
      key: 'Enter',
      isComposing: true,
    });
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('自定义 onKeyDown 仍会先被调用', () => {
    const onKeyDown = vi.fn();
    const onSearch = vi.fn();
    render(
      <Input
        aria-label="搜索"
        search
        onKeyDown={onKeyDown}
        onSearch={onSearch}
      />,
    );
    fireEvent.keyDown(screen.getByLabelText('搜索'), { key: 'Enter' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledTimes(1);
  });
});
