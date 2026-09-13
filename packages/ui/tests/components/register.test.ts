import { readFileSync } from 'node:fs';

import { Registry } from '@pactor-app/core';
import { describe, expect, it } from 'vitest';

import {
  createComponentRegistry,
  registerBuiltinComponents,
} from '../../src/components/index.js';

/** 内置组件类型名硬编码清单（契约断言，替代原跨 kit 注册表同构断言） */
const BUILTIN_TYPES = [
  'Page',
  'Grid',
  'Flex',
  'Card',
  'Button',
  'Alert',
  'Statistic',
  'Text',
  'Tabs',
  'Table',
  'Form',
  'Input',
  'Select',
  'Layout',
  'Header',
  'Sider',
  'Content',
  'Footer',
  'Menu',
  'Link',
];

/** 扩展组件类型名清单（spec: shadcn-extended-components / 扩展组件注册入口，第一批：展示类 + 表单类；第二批：导航类 + 反馈弹层类；第三批：表单类 Calendar/InputOTP/Combobox + 复合类；第四批：页面级组合类 Sidebar/DataTable/Chart） */
const EXTENDED_TYPES = [
  'Badge',
  'Avatar',
  'Skeleton',
  'Separator',
  'Kbd',
  'Spinner',
  'Empty',
  'AspectRatio',
  'Progress',
  'Textarea',
  'Checkbox',
  'RadioGroup',
  'Switch',
  'Slider',
  'Label',
  'Field',
  // 第二批：导航类
  'Breadcrumb',
  'Pagination',
  'Menubar',
  'NavigationMenu',
  'DropdownMenu',
  'ContextMenu',
  // 第二批：反馈与弹层类
  'Dialog',
  'AlertDialog',
  'Drawer',
  'Sheet',
  'Popover',
  'Sonner',
  'Accordion',
  'Collapsible',
  'Tooltip',
  'HoverCard',
  // 第三批：表单类（Calendar/DatePicker/InputOTP/Combobox）+ 复合类
  'Calendar',
  'DatePicker',
  'InputOTP',
  'Combobox',
  'Carousel',
  'Command',
  'Resizable',
  'ScrollArea',
  'Toggle',
  'ToggleGroup',
  'ButtonGroup',
  'InputGroup',
  'Item',
  'Typography',
  // 第四批：页面级组合类
  'Sidebar',
  'DataTable',
  'Chart',
  'Icon',
];

describe('组件注册入口', () => {
  it('createComponentRegistry 注册后 20 个类型名全部可解析', () => {
    const registry = createComponentRegistry();
    for (const type of BUILTIN_TYPES) {
      expect(registry.has(type), type).toBe(true);
    }
  });

  it('createComponentRegistry 的类型名集合包含全部 20 个内置类型（超集断言：另含扩展组件）', () => {
    const registry = createComponentRegistry();
    const types = registry.list();
    for (const type of BUILTIN_TYPES) {
      expect(types, type).toContain(type);
    }
  });

  it('registerBuiltinComponents 注册到外部 Registry', () => {
    const registry = new Registry<unknown>('ComponentRegistry');
    registerBuiltinComponents(registry);
    const types = registry.list();
    for (const type of BUILTIN_TYPES) {
      expect(types, type).toContain(type);
    }
  });

  it('扩展类型（展示类 + 表单类）注册后全部可解析', () => {
    const registry = createComponentRegistry();
    for (const type of EXTENDED_TYPES) {
      expect(registry.has(type), type).toBe(true);
    }
  });
});

describe('样式表', () => {
  it('包 exports 暴露 ./styles.css 入口', () => {
    const pkg = JSON.parse(
      readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
    ) as { exports: Record<string, unknown>; sideEffects?: string[] };
    expect(pkg.exports['./styles.css']).toBeDefined();
    expect(pkg.sideEffects).toContain('./styles.css');
  });

  it('样式源文件定义 shadcn 语义令牌与 [data-pactor-theme=dark] 暗色覆盖，含 preflight 与动画层', () => {
    const css = readFileSync(
      new URL('../../src/styles.css', import.meta.url),
      'utf8',
    );
    for (const token of [
      '--background',
      '--foreground',
      '--card',
      '--popover',
      '--primary',
      '--secondary',
      '--muted',
      '--accent',
      '--destructive',
      '--border',
      '--input',
      '--ring',
      '--radius',
      '--chart-1',
      '--chart-5',
      '--sidebar',
      '--sidebar-ring',
    ]) {
      expect(css, token).toContain(token);
    }
    expect(css).toContain("[data-pactor-theme='dark']");
    // preflight 开启（官方基线）：完整 tailwindcss 导入 + tw-animate-css 动画层
    expect(css).toContain("@import 'tailwindcss'");
    expect(css).toContain("tw-animate-css");
    // accordion 关键帧（vendored Accordion 的 animate-[accordion-*] 任意值类依赖）
    expect(css).toContain('@keyframes accordion-down');
    expect(css).toContain('@keyframes accordion-up');
  });
});
