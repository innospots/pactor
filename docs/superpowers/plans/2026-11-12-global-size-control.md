# 全局尺寸档位（Global Size Scale）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `@pactor-app/ui` 建立 compact / default / comfortable 三档全局密度（一期：表单控件族 + 按钮族；二期：Table / 菜单族 / Tabs / NavigationMenu / Sidebar 菜单行 / Calendar / Avatar / Badge / Breadcrumb），并支持自定义数值覆盖；UserMenu 与自定义组件（示例：SkinSettings）均可切换整页尺寸。

**Architecture:** CSS 尺寸令牌 + `data-pactor-size` 属性（与 `data-pactor-theme` 同构）。`:root` 定义 `--pactor-control-*` 令牌（default 档 = 现行尺寸），`[data-pactor-size='compact'|'comfortable']` 块覆盖令牌值；组件把硬编码 `h-9` / `text-sm` 换成令牌引用。最大杠杆是 DSL 层 `control-size.ts`（12 个表单控件共用的尺寸映射）一次令牌化。UserMenu 新增密度切换（与 theme/language 同构的受控/非受控 props + localStorage 持久化）。

**Tech Stack:** React 19 + Tailwind v4（预建 styles.css）+ Base UI + vitest + tailwind-merge v3.6。

**设计文档:** `docs/superpowers/specs/2026-11-12-global-size-control-design.md`（已提交）

## Global Constraints

- **字号必须用 `text-[length:var(--token)]`**，禁止 `text-(--token)`（后者编译为 `color`，且 tailwind-merge 不与 `text-sm` 冲突去重）。已实测验证。
- 高度用 `h-(--token)` / `size-(--token)`（编译为 `height` / `width+height`，tailwind-merge 归 h / size 组，可正常与 `h-9` 冲突去重）。已实测验证。
- **default 档值 = 现行尺寸**（h-6/8/9/10 = 1.5/2/2.25/2.5rem，text-xs/sm/base = 0.75/0.875/1rem）：不设置 `data-pactor-size` 时任何组件视觉零变化。
- 令牌命名前缀 `--pactor-control-`；属性 `data-pactor-size`；持久化 key `pactor.size`。
- 不新增依赖；不改动 `control-size.ts` 的导出签名（`ControlSize` / `CONTROL_SIZE_*` 名字与 Record 形状不变）。
- 自定义数值优先级：**documentElement 内联变量 > `[data-pactor-size]` 档位 > `:root` default**（内联样式天然胜出，无需额外 CSS）。
- i18n key 必须同时加进 `packages/runtime/src/context/locales/zh-CN.ts` 与 `en-US.ts`。
- 提交信息用中文 / 英文均可，遵循仓库现有 `feat(ui): ...` 风格。
- 测试命令：`cd packages/ui && pnpm test`（单文件：`pnpm vitest run tests/<file>`）；样式构建断言：`pnpm vitest run tests/build-styles.test.mjs`（仓库根目录）。
- Switch / Slider / Textarea（vendored 层）**保持现状**，一期不动。

---

### Task 1: 尺寸令牌 + global-size 工具 + 导出

**Files:**
- Modify: `packages/ui/src/styles.css`（`:root` 内 `--grid-gap: 16px;` 之后；`:root` 闭括号与 `[data-pactor-theme='dark']` 之间）
- Create: `packages/ui/src/lib/global-size.ts`
- Modify: `packages/ui/src/ui/index.ts`（文件尾部 user-menu 导出块之后追加）
- Modify: `packages/ui/src/components/index.ts`（control-size 导出块之后追加）
- Test: `packages/ui/tests/global-size.test.ts`（新建）
- Test: `tests/build-styles.test.mjs`（追加一个 it）

**Interfaces:**
- Produces（后续所有任务依赖）:
  - CSS 令牌：`--pactor-control-height-{xs,sm,md,lg}`、`--pactor-control-text-{sm,md,lg}`、`--pactor-control-box`
  - `export type GlobalSize = 'compact' | 'default' | 'comfortable'`
  - `export const globalSizeStorageKey = 'pactor.size'`
  - `readGlobalSize(): GlobalSize`（读 documentElement，非法/未设置回退 `'default'`）
  - `applyGlobalSize(size: GlobalSize): void`（default 移除属性，其余写 `data-pactor-size`）
  - `readStoredGlobalSize(): GlobalSize | null`、`persistGlobalSize(size): void`
  - `interface GlobalSizeValues { heightXs?/heightSm?/heightMd?/heightLg?/textSm?/textMd?/textLg?/box?: string }`
  - `applyGlobalSizeValues(values: GlobalSizeValues | null): void`（参数即完整覆盖集：给出的键写内联变量，未给出的键移除既有内联覆盖，null 清除全部）
  - `readGlobalSizeValues(): GlobalSizeValues`（只读内联覆盖，无覆盖返回 `{}`）
  - 以上全部从 `@pactor-app/ui` 包根与 `@pactor-app/ui/ui` 均可导入。

- [ ] **Step 1: 写失败测试**

`packages/ui/tests/global-size.test.ts`：

```ts
// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import {
  applyGlobalSize,
  applyGlobalSizeValues,
  globalSizeStorageKey,
  persistGlobalSize,
  readGlobalSize,
  readGlobalSizeValues,
  readStoredGlobalSize,
} from '../src/lib/global-size.js';

afterEach(() => {
  document.documentElement.removeAttribute('data-pactor-size');
  applyGlobalSizeValues(null);
  window.localStorage.removeItem(globalSizeStorageKey);
});

describe('global-size', () => {
  it('未设置属性 / 非法值时 readGlobalSize 回退 default', () => {
    expect(readGlobalSize()).toBe('default');
    document.documentElement.setAttribute('data-pactor-size', 'huge');
    expect(readGlobalSize()).toBe('default');
  });

  it('applyGlobalSize：compact/comfortable 写属性，default 移除属性', () => {
    applyGlobalSize('compact');
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('compact');
    applyGlobalSize('comfortable');
    expect(readGlobalSize()).toBe('comfortable');
    applyGlobalSize('default');
    expect(document.documentElement.hasAttribute('data-pactor-size')).toBe(false);
  });

  it('持久化往返；非法存储值回退 null', () => {
    expect(readStoredGlobalSize()).toBeNull();
    persistGlobalSize('compact');
    expect(readStoredGlobalSize()).toBe('compact');
    window.localStorage.setItem(globalSizeStorageKey, 'huge');
    expect(readStoredGlobalSize()).toBeNull();
  });

  it('自定义数值：写内联变量、参数即完整覆盖集、null 清除全部', () => {
    const style = document.documentElement.style;

    applyGlobalSizeValues({ heightMd: '40px', textMd: '15px' });
    expect(style.getPropertyValue('--pactor-control-height-md')).toBe('40px');
    expect(style.getPropertyValue('--pactor-control-text-md')).toBe('15px');
    expect(readGlobalSizeValues()).toEqual({ heightMd: '40px', textMd: '15px' });

    // 第二次调用未给出的键移除既有覆盖（不与上一次合并）
    applyGlobalSizeValues({ heightLg: '48px' });
    expect(style.getPropertyValue('--pactor-control-height-md')).toBe('');
    expect(style.getPropertyValue('--pactor-control-height-lg')).toBe('48px');

    applyGlobalSizeValues(null);
    expect(readGlobalSizeValues()).toEqual({});
  });

  it('内联自定义值优先于档位预设（inline style 高于样式表选择器）', () => {
    // jsdom 不计算样式表级联，此处断言实现机制：内联变量与属性可共存，
    // 浏览器中 inline style 优先级天然高于 [data-pactor-size] 块
    applyGlobalSize('compact');
    applyGlobalSizeValues({ heightMd: '40px' });
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('compact');
    expect(document.documentElement.style.getPropertyValue('--pactor-control-height-md')).toBe('40px');
  });
});
```

`tests/build-styles.test.mjs` 在最后一个 `it` 后追加：

```js
  it('包含全局密度令牌与档位选择器', () => {
    expect(css).toContain('--pactor-control-height-md');
    expect(css).toContain('--pactor-control-text-lg');
    expect(css).toContain('--pactor-control-box');
    expect(css).toContain("[data-pactor-size='compact']");
    expect(css).toContain("[data-pactor-size='comfortable']");
  });
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/ui && pnpm vitest run tests/global-size.test.ts`
Expected: FAIL（`../src/lib/global-size.js` 不存在）

- [ ] **Step 3: 实现 global-size.ts**

`packages/ui/src/lib/global-size.ts`：

```ts
/**
 * 全局密度档位：compact / default / comfortable。
 * 契约：compact / comfortable 写 documentElement 的 data-pactor-size，
 * default 移除该属性（与 data-pactor-theme 三态同款）；非受控偏好持久化到
 * localStorage 的 pactor.size（与 pactor.locale 同命名空间）。
 * 自定义组件 / 宿主脚本写同一属性即可全局切换；CSS 消费
 * var(--pactor-control-height-*) 等令牌即自动跟随（令牌定义见 styles.css）。
 */
export type GlobalSize = 'compact' | 'default' | 'comfortable';

/** 与 UserMenu 注释、设计文档一致的持久化 key */
export const globalSizeStorageKey = 'pactor.size';

const attribute = 'data-pactor-size';

/** 读取当前全局密度：未设置 / 非法值回退 'default' */
export function readGlobalSize(): GlobalSize {
  if (typeof document === 'undefined') return 'default';
  const value = document.documentElement.getAttribute(attribute);
  return value === 'compact' || value === 'comfortable' ? value : 'default';
}

/** 应用全局密度：default 移除属性，其余写属性 */
export function applyGlobalSize(size: GlobalSize): void {
  if (typeof document === 'undefined') return;
  if (size === 'default') {
    document.documentElement.removeAttribute(attribute);
  } else {
    document.documentElement.setAttribute(attribute, size);
  }
}

/** 读取持久化偏好；未设置 / 存储不可用 / 非法值回退 null */
export function readStoredGlobalSize(): GlobalSize | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(globalSizeStorageKey);
    return value === 'compact' || value === 'default' || value === 'comfortable'
      ? value
      : null;
  } catch {
    return null;
  }
}

/** 持久化密度偏好；存储禁用时忽略，仅保留会话内选择 */
export function persistGlobalSize(size: GlobalSize): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(globalSizeStorageKey, size);
  } catch {
    // 忽略：存储被禁用时不影响菜单内切换
  }
}

/**
 * 自定义数值覆盖：三档预设之外允许直接指定各令牌数值。
 * 经 documentElement 内联变量实现，优先级高于样式表中的档位预设
 * （inline style > [data-pactor-size] > :root）；持久化由宿主负责。
 */
export interface GlobalSizeValues {
  heightXs?: string;
  heightSm?: string;
  heightMd?: string;
  heightLg?: string;
  textSm?: string;
  textMd?: string;
  textLg?: string;
  box?: string;
}

const valueTokens: Record<keyof GlobalSizeValues, string> = {
  heightXs: '--pactor-control-height-xs',
  heightSm: '--pactor-control-height-sm',
  heightMd: '--pactor-control-height-md',
  heightLg: '--pactor-control-height-lg',
  textSm: '--pactor-control-text-sm',
  textMd: '--pactor-control-text-md',
  textLg: '--pactor-control-text-lg',
  box: '--pactor-control-box',
};

const valueKeys = Object.keys(valueTokens) as (keyof GlobalSizeValues)[];

/** 应用自定义数值：参数即完整覆盖集——给出的键写内联变量，
 *  未给出的键移除既有内联覆盖；传 null 清除全部，回到档位预设 */
export function applyGlobalSizeValues(values: GlobalSizeValues | null): void {
  if (typeof document === 'undefined') return;
  const style = document.documentElement.style;
  for (const key of valueKeys) {
    const value = values?.[key];
    if (value) style.setProperty(valueTokens[key], value);
    else style.removeProperty(valueTokens[key]);
  }
}

/** 读取当前内联覆盖（不含样式表档位值；无覆盖返回 {}） */
export function readGlobalSizeValues(): GlobalSizeValues {
  if (typeof document === 'undefined') return {};
  const style = document.documentElement.style;
  const values: GlobalSizeValues = {};
  for (const key of valueKeys) {
    const value = style.getPropertyValue(valueTokens[key]).trim();
    if (value) values[key] = value;
  }
  return values;
}
```

- [ ] **Step 4: styles.css 加令牌与档位块**

`packages/ui/src/styles.css` 的 `:root` 块内，`--grid-gap: 16px;` 行之后、闭括号 `}` 之前插入：

```css
  /* 控件尺寸令牌（全局密度档位基准；default 档 = 现行尺寸，默认视觉零变化。
     compact / comfortable 经下方 [data-pactor-size] 块覆盖；
     属性可挂在 documentElement 或任意容器上，经变量继承局部生效） */
  --pactor-control-height-xs: 1.5rem;
  --pactor-control-height-sm: 2rem;
  --pactor-control-height-md: 2.25rem;
  --pactor-control-height-lg: 2.5rem;
  --pactor-control-text-sm: 0.75rem;
  --pactor-control-text-md: 0.875rem;
  --pactor-control-text-lg: 1rem;
  --pactor-control-box: 1rem;
```

`:root` 闭括号之后、`/* 暗色皮肤… */ [data-pactor-theme='dark']` 之前插入：

```css
/* 全局密度档位 compact（紧凑）：高度 -4px、正文字号 -1px */
[data-pactor-size='compact'] {
  --pactor-control-height-xs: 1.25rem;
  --pactor-control-height-sm: 1.75rem;
  --pactor-control-height-md: 2rem;
  --pactor-control-height-lg: 2.25rem;
  --pactor-control-text-sm: 0.75rem;
  --pactor-control-text-md: 0.8125rem;
  --pactor-control-text-lg: 0.875rem;
  --pactor-control-box: 0.875rem;
}

/* 全局密度档位 comfortable（宽松）：高度 +4px（lg +8px）、正文字号 +1px */
[data-pactor-size='comfortable'] {
  --pactor-control-height-xs: 1.75rem;
  --pactor-control-height-sm: 2.25rem;
  --pactor-control-height-md: 2.5rem;
  --pactor-control-height-lg: 3rem;
  --pactor-control-text-sm: 0.8125rem;
  --pactor-control-text-md: 0.9375rem;
  --pactor-control-text-lg: 1.0625rem;
  --pactor-control-box: 1.125rem;
}
```

- [ ] **Step 5: 导出**

`packages/ui/src/ui/index.ts` 文件末尾追加：

```ts
export {
  applyGlobalSize,
  applyGlobalSizeValues,
  globalSizeStorageKey,
  persistGlobalSize,
  readGlobalSize,
  readGlobalSizeValues,
  readStoredGlobalSize,
} from '../lib/global-size.js';
export type { GlobalSize, GlobalSizeValues } from '../lib/global-size.js';
```

`packages/ui/src/components/index.ts` 在 control-size 导出块（`export type { ControlSize } from './control-size.js';`）之后追加：

```ts
export {
  applyGlobalSize,
  applyGlobalSizeValues,
  globalSizeStorageKey,
  persistGlobalSize,
  readGlobalSize,
  readGlobalSizeValues,
  readStoredGlobalSize,
} from '../lib/global-size.js';
export type { GlobalSize, GlobalSizeValues } from '../lib/global-size.js';
```

- [ ] **Step 6: 跑测试确认通过**

Run: `cd packages/ui && pnpm vitest run tests/global-size.test.ts`，然后回仓库根目录 `pnpm vitest run tests/build-styles.test.mjs`
Expected: 全部 PASS（build-styles 会先执行样式构建，耗时正常；根级 vitest 只认根 tests/ 目录，不要在 packages/ui 里跑它）

- [ ] **Step 7: Commit**

```bash
git add packages/ui/src/styles.css packages/ui/src/lib/global-size.ts packages/ui/src/ui/index.ts packages/ui/src/components/index.ts packages/ui/tests/global-size.test.ts tests/build-styles.test.mjs
git commit -m "feat(ui): 全局密度令牌与 global-size 工具（data-pactor-size 契约）"
```

---

### Task 2: control-size.ts 令牌化（12 个 DSL 表单控件整体跟随）

**Files:**
- Modify: `packages/ui/src/components/control-size.ts`
- Test: `packages/ui/tests/components/control-size.test.ts`（新建）

**Interfaces:**
- Consumes: Task 1 的令牌名。
- Produces: 同名导出（`ControlSize` / `CONTROL_SIZE_BOX` / `CONTROL_SIZE_BOX_GROW` / `CONTROL_SIZE_AREA` / `CONTROL_SIZE_SELECT_ATTR` / `CONTROL_SIZE_TRIGGER_TEXT`），值改为令牌引用；全部消费组件（Input/Select/DatePicker/Textarea/Combobox/MultiSelect/NumberInput/TimePicker/TreeSelect/Cascader/Mentions）零改动。

- [ ] **Step 1: 写失败测试**

`packages/ui/tests/components/control-size.test.ts`：

```ts
import { describe, expect, it } from 'vitest';

import {
  CONTROL_SIZE_AREA,
  CONTROL_SIZE_BOX,
  CONTROL_SIZE_BOX_GROW,
  CONTROL_SIZE_TRIGGER_TEXT,
} from '../../src/components/control-size.js';
import { cn } from '../../src/lib/utils.js';

describe('control-size 令牌映射', () => {
  it('盒式控件高度与字号引用全局密度令牌', () => {
    expect(CONTROL_SIZE_BOX.small).toContain('h-(--pactor-control-height-sm)');
    expect(CONTROL_SIZE_BOX.middle).toContain('h-(--pactor-control-height-md)');
    expect(CONTROL_SIZE_BOX.large).toContain('h-(--pactor-control-height-lg)');
    expect(CONTROL_SIZE_BOX.small).toContain('text-[length:var(--pactor-control-text-sm)]');
    expect(CONTROL_SIZE_BOX.large).toContain('text-[length:var(--pactor-control-text-lg)]');
    expect(CONTROL_SIZE_BOX_GROW.middle).toContain('min-h-(--pactor-control-height-md)');
    expect(CONTROL_SIZE_AREA.large).toContain('text-[length:var(--pactor-control-text-lg)]');
    expect(CONTROL_SIZE_TRIGGER_TEXT.middle).toContain(
      'text-[length:var(--pactor-control-text-md)]',
    );
  });

  it('cn 合并时令牌类覆盖 vendored 基类（h-9 / text-sm 被去重）', () => {
    // tailwind-merge 须把 h-(--x) 归 h 组、text-[length:...] 归 font-size 组，
    // 否则基类与令牌类并存、胜负取决于样式表顺序
    expect(cn('h-9 px-3 text-sm', CONTROL_SIZE_BOX.small)).toBe(
      'h-(--pactor-control-height-sm) px-2.5 text-[length:var(--pactor-control-text-sm)]',
    );
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/ui && pnpm vitest run tests/components/control-size.test.ts`
Expected: FAIL（当前值是硬编码 `h-8` / `text-xs` 等）

- [ ] **Step 3: 重写映射值（签名不变）**

`packages/ui/src/components/control-size.ts` 中四个 Record 的值替换为：

```ts
export const CONTROL_SIZE_BOX: Record<ControlSize, string> = {
  small:
    'h-(--pactor-control-height-sm) px-2.5 text-[length:var(--pactor-control-text-sm)]',
  middle:
    'h-(--pactor-control-height-md) px-3 text-[length:var(--pactor-control-text-md)]',
  large:
    'h-(--pactor-control-height-lg) px-4 text-[length:var(--pactor-control-text-lg)]',
};

export const CONTROL_SIZE_BOX_GROW: Record<ControlSize, string> = {
  small:
    'min-h-(--pactor-control-height-sm) px-2.5 py-1 text-[length:var(--pactor-control-text-sm)]',
  middle:
    'min-h-(--pactor-control-height-md) px-3 py-1.5 text-[length:var(--pactor-control-text-md)]',
  large:
    'min-h-(--pactor-control-height-lg) px-4 py-1.5 text-[length:var(--pactor-control-text-lg)]',
};

export const CONTROL_SIZE_AREA: Record<ControlSize, string> = {
  small: 'px-2.5 py-1.5 text-[length:var(--pactor-control-text-sm)]',
  middle: 'px-3 py-2 text-[length:var(--pactor-control-text-md)]',
  large: 'px-4 py-2.5 text-[length:var(--pactor-control-text-lg)]',
};

export const CONTROL_SIZE_TRIGGER_TEXT: Record<ControlSize, string> = {
  small: 'px-2.5 text-[length:var(--pactor-control-text-sm)]',
  middle: 'px-3 text-[length:var(--pactor-control-text-md)]',
  large: 'px-4 text-[length:var(--pactor-control-text-lg)]',
};
```

同时把文件头注释中「高度、内边距、字号一致」一段后补一句：`档位值引用 --pactor-control-* 令牌，随全局密度（data-pactor-size）整体缩放。`

- [ ] **Step 4: 跑测试 + 既有表单测试回归**

Run: `cd packages/ui && pnpm vitest run tests/components/control-size.test.ts tests/components/form.test.tsx tests/components/extended-form.test.tsx`
Expected: 全部 PASS

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/components/control-size.ts packages/ui/tests/components/control-size.test.ts
git commit -m "feat(ui): control-size 映射令牌化，DSL 表单控件随全局密度缩放"
```

---

### Task 3: vendored 原语令牌化（button / input / select / toggle / combobox / input-group / input-otp / checkbox / radio）

**Files:**
- Modify: `packages/ui/src/ui/button.tsx`、`input.tsx`、`select.tsx`、`toggle.tsx`、`combobox.tsx`、`input-group.tsx`、`input-otp.tsx`、`checkbox.tsx`、`radio-group.tsx`
- Test: `tests/build-styles.test.mjs`（追加编译产物断言）

**Interfaces:**
- Consumes: Task 1 令牌。Produces: 无新导出；DSL Button/Select 等经 cva / data-size 自动跟随。

- [ ] **Step 1: 写失败测试（编译产物断言）**

`tests/build-styles.test.mjs` 在 Task 1 的 it 后追加：

```js
  it('控件原语编译为令牌引用（运行时随密度档位变化）', () => {
    // Tailwind v4 var 语法编译为 var() 引用；选择器中的 ( ) 转义为 \( \)
    expect(css).toContain('.h-\\(--pactor-control-height-md\\)');
    expect(css).toContain('.text-\\[length\\:var\\(--pactor-control-text-md\\)\\]');
    expect(css).toContain('.size-\\(--pactor-control-box\\)');
    expect(css).toContain('.data-\\[size\\=sm\\]\\:h-\\(--pactor-control-height-sm\\)');
  });
```

Run: `pnpm vitest run tests/build-styles.test.mjs`
Expected: FAIL（该 it 的断言不成立）

- [ ] **Step 2: button.tsx**

- 基类串中 `text-sm font-medium` → `text-[length:var(--pactor-control-text-md)] font-medium`
- `default: 'h-9 px-4 py-2'` → `default: 'h-(--pactor-control-height-md) px-4 py-2'`
- `xs:` 串中 `h-6` → `h-(--pactor-control-height-xs)`，`text-xs` → `text-[length:var(--pactor-control-text-sm)]`
- `sm: 'h-8 gap-1.5 rounded-md px-3 text-xs'` → `sm: 'h-(--pactor-control-height-sm) gap-1.5 rounded-md px-3 text-[length:var(--pactor-control-text-sm)]'`
- `lg: 'h-10 rounded-md px-6'` → `lg: 'h-(--pactor-control-height-lg) rounded-md px-6'`
- `icon: 'size-9'` → `icon: 'size-(--pactor-control-height-md)'`
- `icon-xs:` 串中 `size-6` → `size-(--pactor-control-height-xs)`（首个 size-6，即按钮盒尺寸；`[&_svg...]:size-3` 图标字形不动）
- `icon-sm: 'size-8'` → `icon-sm: 'size-(--pactor-control-height-sm)'`
- `icon-lg: 'size-10'` → `icon-lg: 'size-(--pactor-control-height-lg)'`

- [ ] **Step 3: input.tsx / select.tsx / toggle.tsx**

- `input.tsx`：`flex h-9 w-full` → `flex h-(--pactor-control-height-md) w-full`；`py-1 text-sm` → `py-1 text-[length:var(--pactor-control-text-md)]`
- `select.tsx` SelectTrigger 类串：`data-[size=default]:h-9 data-[size=sm]:h-8 data-[size=lg]:h-10` → `data-[size=default]:h-(--pactor-control-height-md) data-[size=sm]:h-(--pactor-control-height-sm) data-[size=lg]:h-(--pactor-control-height-lg)`；`text-left text-sm` → `text-left text-[length:var(--pactor-control-text-md)]`
- `toggle.tsx`：基类 `text-sm` → `text-[length:var(--pactor-control-text-md)]`；`default: 'h-9 px-2 min-w-9'` → `'h-(--pactor-control-height-md) px-2 min-w-9'`；`sm: 'h-8 px-1.5 min-w-8'` → `'h-(--pactor-control-height-sm) px-1.5 min-w-8'`；`lg: 'h-10 px-2.5 min-w-10'` → `'h-(--pactor-control-height-lg) px-2.5 min-w-10'`（min-w-* 保持现状）

- [ ] **Step 4: combobox.tsx / input-group.tsx / input-otp.tsx**

- `combobox.tsx`：`flex h-9 w-full` → `flex h-(--pactor-control-height-md) w-full`；`py-1 text-sm` → `py-1 text-[length:var(--pactor-control-text-md)]`
- `input-group.tsx`（约 58 行 input 类串）：`h-9 min-w-0 flex-1` → `h-(--pactor-control-height-md) min-w-0 flex-1`（`text-base md:text-sm` 响应式字号是 iOS 防缩放契约，保持不动）
- `input-otp.tsx`：`relative flex h-9 w-9 items-center` → `relative flex h-(--pactor-control-height-md) w-(--pactor-control-height-md) items-center`；`text-sm transition-all` → `text-[length:var(--pactor-control-text-md)] transition-all`

- [ ] **Step 5: checkbox.tsx / radio-group.tsx**

- `checkbox.tsx`：`peer size-4 shrink-0` → `peer size-(--pactor-control-box) shrink-0`
- `radio-group.tsx`：`aspect-square size-4 shrink-0` → `aspect-square size-(--pactor-control-box) shrink-0`

- [ ] **Step 6: 跑测试确认通过 + 回归**

Run: `pnpm vitest run tests/build-styles.test.mjs && cd packages/ui && pnpm test`
Expected: 全部 PASS

- [ ] **Step 7: Commit**

```bash
git add packages/ui/src/ui tests/build-styles.test.mjs
git commit -m "feat(ui): 表单原语尺寸令牌化（button/input/select/toggle/combobox/input-group/input-otp/checkbox/radio）"
```

---

### Task 4: UserMenu 密度切换（ui 层 + i18n）

**Files:**
- Modify: `packages/ui/src/ui/user-menu/types.ts`
- Modify: `packages/ui/src/ui/user-menu/options.tsx`
- Modify: `packages/ui/src/ui/user-menu/user-menu.tsx`
- Modify: `packages/ui/src/ui/user-menu/parts.tsx`
- Modify: `packages/ui/src/ui/user-menu/menu-dropdown.tsx`
- Modify: `packages/ui/src/ui/user-menu/menu-sheet.tsx`
- Modify: `packages/ui/src/ui/user-menu/index.ts`
- Modify: `packages/ui/src/ui/index.ts`（user-menu 导出块）
- Modify: `packages/runtime/src/context/locales/zh-CN.ts`、`en-US.ts`
- Test: `packages/ui/tests/components/user-menu-density.test.tsx`（新建）

**Interfaces:**
- Consumes: Task 1 的 `GlobalSize` / `applyGlobalSize` / `readGlobalSize` / `readStoredGlobalSize` / `persistGlobalSize`。
- Produces（Task 5 依赖）:
  - `type SizeOption = { value: GlobalSize; label: string }`（types.ts）
  - UserMenu 新 props：`size?: GlobalSize`、`defaultSize?: GlobalSize`、`showSize?: boolean`（缺省 false）、`sizes?: SizeOption[]`、`onSizeChange?: (size: GlobalSize) => void`
  - `defaultSizes`（options.tsx，含 labelKey 与 A 字形图标）
  - i18n keys：`pactor.userMenu.size` / `sizeCompact` / `sizeDefault` / `sizeComfortable`

- [ ] **Step 1: 写失败测试**

`packages/ui/tests/components/user-menu-density.test.tsx`：

```tsx
// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { UserMenu as UiUserMenu } from '../../src/ui/user-menu/index.js';
import { globalSizeStorageKey } from '../../src/lib/global-size.js';

const USER = { name: 'Emma Collins', email: 'emma@example.com' };

afterEach(() => {
  document.documentElement.removeAttribute('data-pactor-size');
  window.localStorage.removeItem(globalSizeStorageKey);
});

function renderMenu(extra: Record<string, unknown> = {}) {
  render(<UiUserMenu user={USER} showSize {...extra} />);
  fireEvent.click(screen.getByRole('button', { name: /账户菜单/ }));
}

describe('UserMenu 密度切换', () => {
  it('showSize 显示「界面密度」分段行；选择即应用属性并持久化', () => {
    renderMenu();
    // 行标签（Segmented 行容器角色在桌面/抽屉两路径不同，按文本断言更稳）
    expect(screen.getByText('界面密度')).toBeTruthy();

    fireEvent.click(screen.getByRole('menuitemradio', { name: '紧凑' }));
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('compact');
    expect(window.localStorage.getItem(globalSizeStorageKey)).toBe('compact');

    fireEvent.click(screen.getByRole('menuitemradio', { name: '宽松' }));
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('comfortable');

    fireEvent.click(screen.getByRole('menuitemradio', { name: '默认' }));
    expect(document.documentElement.hasAttribute('data-pactor-size')).toBe(false);
    expect(window.localStorage.getItem(globalSizeStorageKey)).toBe('default');
  });

  it('受控 size：选择经 onSizeChange 上报并应用属性，但不写 localStorage', () => {
    const onSizeChange = vi.fn();
    renderMenu({ size: 'comfortable', onSizeChange });
    fireEvent.click(screen.getByRole('menuitemradio', { name: '紧凑' }));
    expect(onSizeChange).toHaveBeenCalledWith('compact');
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('compact');
    expect(window.localStorage.getItem(globalSizeStorageKey)).toBeNull();
  });

  it('非受控挂载时应用持久化偏好（刷新后密度保持）', () => {
    window.localStorage.setItem(globalSizeStorageKey, 'compact');
    render(<UiUserMenu user={USER} showSize />);
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('compact');
  });
});
```

Run: `cd packages/ui && pnpm vitest run tests/components/user-menu-density.test.tsx`
Expected: FAIL（`showSize` prop 不存在 / 类型错误）

- [ ] **Step 2: types.ts 契约**

`packages/ui/src/ui/user-menu/types.ts`：

- 顶部 import 后追加：

```ts
import type { GlobalSize } from '../../lib/global-size.js';

export type { GlobalSize };

/** 密度选项：label 可随界面语言覆盖默认值 */
export interface SizeOption {
  value: GlobalSize;
  label: string;
}
```

- `UserMenuProps` 中 `onThemeChange` 之后追加（放在主题与语言两组之间，保持 props 分组语义）：

```ts
  /** 受控全局密度 */
  size?: GlobalSize;
  /** 非受控初始密度；缺省读取 localStorage 的 pactor.size，未设置视为 'default' */
  defaultSize?: GlobalSize;
  /** 密度选择回调；选择同时应用到 documentElement（compact / comfortable 写
   *  data-pactor-size，default 移除）；非受控时写入 localStorage 的 pactor.size */
  onSizeChange?: (size: GlobalSize) => void;
  /** 显示「界面密度」内联切换（缺省 false） */
  showSize?: boolean;
  /** 密度选项（缺省 紧凑 / 默认 / 宽松）；追加 { value, label } 即可覆盖显示名 */
  sizes?: SizeOption[];
```

- [ ] **Step 3: options.tsx 默认选项**

`packages/ui/src/ui/user-menu/options.tsx`：import 块加 `import type { GlobalSize } from '../../lib/global-size.js';`，`themes` 定义之后追加：

```tsx
/** 密度选项图标：同字形 A 按档递大（密度语义直观，无需引入新图标） */
export const defaultSizes: {
  value: GlobalSize;
  label: string;
  labelKey: string;
  icon: ReactNode;
}[] = [
  {
    value: 'compact',
    label: '紧凑',
    labelKey: 'pactor.userMenu.sizeCompact',
    icon: (
      <span aria-hidden="true" className="text-[9px] font-semibold leading-none">
        A
      </span>
    ),
  },
  {
    value: 'default',
    label: '默认',
    labelKey: 'pactor.userMenu.sizeDefault',
    icon: (
      <span aria-hidden="true" className="text-[11px] font-semibold leading-none">
        A
      </span>
    ),
  },
  {
    value: 'comfortable',
    label: '宽松',
    labelKey: 'pactor.userMenu.sizeComfortable',
    icon: (
      <span aria-hidden="true" className="text-[13px] font-semibold leading-none">
        A
      </span>
    ),
  },
];
```

- [ ] **Step 4: user-menu.tsx 状态与应用**

`packages/ui/src/ui/user-menu/user-menu.tsx`：

- import 追加：

```ts
import {
  applyGlobalSize,
  persistGlobalSize,
  readGlobalSize,
  readStoredGlobalSize,
} from '../../lib/global-size.js';
import type { GlobalSize } from '../../lib/global-size.js';
```

- `defaultLanguages` 的 import 改为 `import { defaultLanguages, defaultSizes } from './options.js';`，types import 加 `SizeOption`。
- 函数签名解构中 `onThemeChange,` 之后加：`size: sizeProp, defaultSize, onSizeChange, showSize = false, sizes,`
- `innerTheme` state 之后加：

```ts
  const [innerSize, setInnerSize] = useState<GlobalSize>(
    () => defaultSize ?? readStoredGlobalSize() ?? 'default',
  );
```

- `const theme = themeProp ?? innerTheme;` 之后加：`const size = sizeProp ?? innerSize;`
- 主题回显 effect（`if (!open || themeProp !== undefined ...) return;` 那个）之后加两个 effect：

```ts
  // 非受控时挂载即应用持久化偏好（刷新后密度保持）；
  // 需要首屏防闪烁的宿主应在 HTML 头部内联脚本提前写 data-pactor-size
  useEffect(() => {
    if (sizeProp === undefined) applyGlobalSize(size);
    // 仅挂载时执行一次；受控切换由 changeSize / 宿主负责应用
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 非受控且未显式指定 defaultSize 时，打开菜单按页面当前密度回显，
  // 避免 SkinSettings 等外部切换后分段控件仍停留在过期偏好
  useEffect(() => {
    if (!open || sizeProp !== undefined || defaultSize !== undefined) return;
    setInnerSize(readGlobalSize());
  }, [open, sizeProp, defaultSize]);
```

- `changeTheme` 之后加：

```ts
  function changeSize(value: GlobalSize): void {
    // 应用属性与 theme 同契（受控也应用，与 changeTheme 一致）；
    // 受控时由父级回写 size；非受控时内部记住选择并持久化
    if (sizeProp === undefined) {
      setInnerSize(value);
      persistGlobalSize(value);
    }
    applyGlobalSize(value);
    onSizeChange?.(value);
  }
```

- `UserMenuSheet` 与 `UserMenuDropdown` 两处 JSX 各加 props：`showSize={showSize} size={size} sizes={sizes} onSizeChange={changeSize}`

- [ ] **Step 5: parts.tsx PreferenceRows 第三行**

`packages/ui/src/ui/user-menu/parts.tsx`：

- lucide import 加 `StretchVertical`；options import 加 `defaultSizes`；types import 加 `SizeOption`；加 `import type { GlobalSize } from '../../lib/global-size.js';`
- `PreferenceRows` props 类型与解构各加：`showSize: boolean; size: GlobalSize; sizes?: SizeOption[]; onSizeChange: (size: GlobalSize) => void;`
- 函数体 `if (!showStatus && !showTheme) return null;` 改为 `if (!showStatus && !showTheme && !showSize) return null;`
- 主题 Segmented 之后追加：

```tsx
      {showSize ? (
        <Segmented
          label={t('pactor.userMenu.size')}
          icon={<StretchVertical size={16} strokeWidth={1.75} aria-hidden="true" />}
          value={size}
          onChange={onSizeChange}
          options={defaultSizes.map((option) => ({
            value: option.value,
            label:
              sizes?.find((item) => item.value === option.value)?.label ??
              t(option.labelKey),
            icon: option.icon,
          }))}
          sheet={sheet}
        />
      ) : null}
```

- [ ] **Step 6: menu-dropdown.tsx / menu-sheet.tsx 透传**

两个文件各自：

- props interface 加：`showSize: boolean; size: GlobalSize; sizes?: SizeOption[]; onSizeChange: (size: GlobalSize) => void;`（types import 相应加 `SizeOption`，并 `import type { GlobalSize } from '../../lib/global-size.js';`）
- 解构加同名四项
- 分区条件 `showLanguage || showTheme || showStatus` → `showLanguage || showTheme || showStatus || showSize`
- `<PreferenceRows …>` 加：`showSize={showSize} size={size} sizes={sizes} onSizeChange={onSizeChange}`

- [ ] **Step 7: index 导出 + i18n**

`packages/ui/src/ui/user-menu/index.ts`：value 导出加 `defaultSizes`；type 导出加 `GlobalSize`、`SizeOption`。

`packages/ui/src/ui/index.ts` user-menu 导出块：value 列表加 `defaultSizes`，type 列表加 `GlobalSize`、`SizeOption`。

`packages/runtime/src/context/locales/zh-CN.ts`，`'pactor.userMenu.themeSystem': '跟随系统',` 之后加：

```ts
  'pactor.userMenu.size': '界面密度',
  'pactor.userMenu.sizeCompact': '紧凑',
  'pactor.userMenu.sizeDefault': '默认',
  'pactor.userMenu.sizeComfortable': '宽松',
```

`packages/runtime/src/context/locales/en-US.ts`，`'pactor.userMenu.themeSystem': 'System',` 之后加：

```ts
  'pactor.userMenu.size': 'Density',
  'pactor.userMenu.sizeCompact': 'Compact',
  'pactor.userMenu.sizeDefault': 'Default',
  'pactor.userMenu.sizeComfortable': 'Comfortable',
```

- [ ] **Step 8: 跑测试确认通过 + 回归**

Run: `cd packages/ui && pnpm vitest run tests/components/user-menu-density.test.tsx tests/components/user-menu.test.tsx && pnpm typecheck`
Expected: 全部 PASS

- [ ] **Step 9: Commit**

```bash
git add packages/ui/src/ui/user-menu packages/ui/src/ui/index.ts packages/runtime/src/context/locales packages/ui/tests/components/user-menu-density.test.tsx
git commit -m "feat(ui): UserMenu 界面密度切换（data-pactor-size + pactor.size 持久化）"
```

---

### Task 5: DSL UserMenu 适配层 + 包根类型导出

**Files:**
- Modify: `packages/ui/src/components/components/UserMenu/index.tsx`
- Test: `packages/ui/tests/components/user-menu-density.test.tsx`（追加 DSL 用例）

**Interfaces:**
- Consumes: Task 4 的 UserMenu props。
- Produces: DSL `UserMenu` 组件新 props（同名透传），DSL 页面可 `props: { showSize: true }`，事件 `events.onSizeChange` 收 `${event}`（density 值）。

- [ ] **Step 1: 追加失败测试（DSL 路径）**

`packages/ui/tests/components/user-menu-density.test.tsx` 追加（顶部 import 加 `import { renderDsl, expectEventState } from './helpers.js';`）：

```tsx
  it('DSL：showSize 透传；选择经 events.onSizeChange 传出密度值', async () => {
    const { context } = renderDsl({
      type: 'UserMenu',
      props: { user: USER, showSize: true },
      events: {
        onSizeChange: { action: 'setState', params: { density: '${event}' } },
      },
    });

    fireEvent.click(screen.getByRole('button', { name: /账户菜单/ }));
    fireEvent.click(screen.getByRole('menuitemradio', { name: '紧凑' }));

    await expectEventState(context, 'density', 'compact');
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('compact');
  });
```

Run: `cd packages/ui && pnpm vitest run tests/components/user-menu-density.test.tsx`
Expected: FAIL（DSL 适配层未透传）

- [ ] **Step 2: 适配层透传**

`packages/ui/src/components/components/UserMenu/index.tsx`：

- ui import 加 `type SizeOption`；加 `import type { GlobalSize } from '../../../lib/global-size.js';`
- `UserMenuProps`（DSL 适配层接口）在 `onThemeChange` 声明之后加：

```ts
  /** 受控全局密度 */
  size?: GlobalSize;
  /** 非受控初始密度；缺省读取 localStorage 的 pactor.size */
  defaultSize?: GlobalSize;
  /** 显示「界面密度」内联切换（缺省 false），选择即应用到页面 */
  showSize?: boolean;
  /** 密度选项（缺省 紧凑 / 默认 / 宽松） */
  sizes?: SizeOption[];
  /** 密度选择回调；选择同时应用到 documentElement 的 data-pactor-size */
  onSizeChange?: (size: GlobalSize) => void;
```

- 函数解构加：`size, defaultSize, showSize, sizes, onSizeChange,`；`<ShadcnUserMenu` JSX 加同名五个 props。
- 文件头组件注释的契约段补一句：密度切换与主题同款契约（`data-pactor-size` + `pactor.size` 持久化）。

- [ ] **Step 3: 跑测试 + 类型检查**

Run: `cd packages/ui && pnpm vitest run tests/components/user-menu-density.test.tsx tests/components/user-menu.test.tsx && pnpm typecheck`
Expected: 全部 PASS

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/components/components/UserMenu packages/ui/tests/components/user-menu-density.test.tsx
git commit -m "feat(ui): DSL UserMenu 透传密度切换 props"
```

---

### Task 6: example-admin SkinSettings 密度演示 + MEMORY.md

**Files:**
- Modify: `examples/admin/src/SkinSettings.tsx`
- Modify: `MEMORY.md`（项目日志追加条目）

**Interfaces:**
- Consumes: Task 1 包根导出的 `applyGlobalSize` / `readGlobalSize` / `GlobalSize`。

- [ ] **Step 1: SkinSettings 加密度行**

`examples/admin/src/SkinSettings.tsx`：

- import 区加：

```ts
import {
  applyGlobalSize,
  applyGlobalSizeValues,
  readGlobalSize,
  type GlobalSize,
} from '@pactor-app/ui';
```

- 组件内 `const skin = ...` 行之后加：

```ts
  const [density, setDensity] = useState<GlobalSize>(() => readGlobalSize());
  /** 自定义控件高度基准（md，px）；null = 跟随密度档位预设 */
  const [heightMd, setHeightMd] = useState<number | null>(null);
```

- 「圆角」区块之后、「恢复默认」按钮之前加：

```tsx
          <div style={{ fontWeight: 600, margin: '16px 0 8px' }}>界面密度</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(
              [
                { value: 'compact', label: '紧凑' },
                { value: 'default', label: '默认' },
                { value: 'comfortable', label: '宽松' },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={density === option.value}
                onClick={() => {
                  applyGlobalSize(option.value);
                  setDensity(option.value);
                }}
                style={{
                  flex: 1,
                  padding: '4px 0',
                  borderRadius: 'var(--radius)',
                  border:
                    density === option.value
                      ? '2px solid var(--foreground)'
                      : '1px solid var(--border)',
                  background: 'transparent',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div style={{ fontWeight: 600, margin: '16px 0 8px' }}>
            控件高度（自定义）
            {heightMd !== null && (
              <button
                type="button"
                onClick={() => {
                  applyGlobalSizeValues(null);
                  setHeightMd(null);
                }}
                style={{
                  marginLeft: 8,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 400,
                }}
              >
                恢复档位
              </button>
            )}
          </div>
          <input
            type="range"
            min={32}
            max={44}
            step={1}
            value={heightMd ?? 36}
            aria-label="控件高度"
            style={{ width: '100%' }}
            onChange={(event) => {
              const md = Number(event.target.value);
              setHeightMd(md);
              // 其余高度档按 default 档阶梯派生（24/32/36/40 → md-12/md-4/md/md+4）
              applyGlobalSizeValues({
                heightXs: `${md - 12}px`,
                heightSm: `${md - 4}px`,
                heightMd: `${md}px`,
                heightLg: `${md + 4}px`,
              });
            }}
          />
          {heightMd !== null && (
            <div style={{ color: 'var(--muted-foreground)', fontSize: 12 }}>
              当前 {heightMd}px（自定义值优先于密度档位）
            </div>
          )}
```

- 文件头注释「（主色预设 / 暗黑开关 / 圆角滑杆 / 恢复默认）」改为「（主色预设 / 暗黑开关 / 圆角滑杆 / 界面密度 / 控件高度自定义 / 恢复默认）」。

- [ ] **Step 2: 构建并手动验证**

```bash
pnpm --filter @pactor-app/ui build && pnpm --filter example-admin dev
```

浏览器打开 admin 示例 → 头部「皮肤」→ 界面密度三档切换：Button/Input/Select 高度与字号即时变化；default 档与改动前视觉一致。

- [ ] **Step 3: MEMORY.md 条目**

`MEMORY.md` 最新条目之后追加一行：

```markdown
- **全局密度档位**（2026-11-12 global-size-control）：`data-pactor-size="compact|comfortable"`（不设置=default）切换 `--pactor-control-*` 令牌（高度/字号/控件盒），default 档=现行尺寸零视觉变化；`control-size.ts` 四组映射已令牌化（12 个 DSL 表单控件自动跟随），vendored 原语 button/input/select/toggle/combobox/input-group/input-otp/checkbox/radio 同步。**坑：字号必须 `text-[length:var(--x)]`，`text-(--x)` 编译为 color 且 tailwind-merge 不去重**。UserMenu 新增 size/defaultSize/showSize/sizes/onSizeChange（与 theme 同构，持久化 `pactor.size`）；自定义数值走 applyGlobalSizeValues/readGlobalSizeValues（documentElement 内联变量，优先级高于档位预设，null 清除）；自定义组件入口 applyGlobalSize/readGlobalSize（example-admin SkinSettings 已演示三档切换 + 高度滑杆）。
```

- [ ] **Step 4: Commit**

```bash
git add examples/admin/src/SkinSettings.tsx MEMORY.md
git commit -m "feat(example-admin): SkinSettings 演示全局密度切换"
```

---

### Task 7: 菜单族 + Tabs + NavigationMenu + Sidebar 菜单行（二期）

**Files:**
- Modify: `packages/ui/src/styles.css`（menu 令牌，三块同改）
- Modify: `packages/ui/src/ui/dropdown-menu.tsx`、`context-menu.tsx`、`menubar.tsx`、`tabs.tsx`、`navigation-menu.tsx`、`sidebar.tsx`
- Modify: `packages/ui/src/components/components/Tabs/index.tsx`
- Test: `tests/build-styles.test.mjs`（追加断言）

**Interfaces:**
- Consumes: Task 1 令牌；新增令牌 `--pactor-menu-item-padding-y`。
- Produces: DSL `Tabs` 新 prop `size?: 'default' | 'sm'`（缺省 default，仅压缩胶囊变体）。

- [ ] **Step 1: styles.css 加菜单令牌（三块同改）**

`:root` 令牌区追加 `--pactor-menu-item-padding-y: 0.375rem;`；`[data-pactor-size='compact']` 块追加 `--pactor-menu-item-padding-y: 0.25rem;`；`[data-pactor-size='comfortable']` 块追加 `--pactor-menu-item-padding-y: 0.5rem;`。

- [ ] **Step 2: 写失败测试（编译产物断言）**

`tests/build-styles.test.mjs` 在 Task 3 的 it 后追加：

```js
  it('菜单项编译为密度令牌引用', () => {
    expect(css).toContain('.py-\\(--pactor-menu-item-padding-y\\)');
  });
```

Run: `pnpm vitest run tests/build-styles.test.mjs`
Expected: FAIL（断言不成立）

- [ ] **Step 3: 菜单族（dropdown-menu / context-menu / menubar）**

- `dropdown-menu.tsx`：文件内所有 item 类串中的 `py-1.5 text-sm` → `py-(--pactor-menu-item-padding-y) text-[length:var(--pactor-control-text-md)]`（Item / CheckboxItem / RadioItem / SubTrigger / Label 等全部出现处，改完 `grep -c "py-1.5" ui/dropdown-menu.tsx` 应为 0）
- `context-menu.tsx`：同样处理所有 `py-1.5` 与 item 的 `text-sm`
- `menubar.tsx`：菜单**项**（约 90 行等）`py-1.5 text-sm` → 同上；顶栏**触发器**（约 41 行）`py-1` 保持，仅 `text-sm` → `text-[length:var(--pactor-control-text-md)]`

- [ ] **Step 4: tabs.tsx + DSL Tabs 透传**

`tabs.tsx`：
- `default: 'h-9 rounded-lg bg-muted p-[3px]'` → `default: 'h-(--pactor-control-height-md) rounded-lg bg-muted p-[3px]'`
- compoundVariants `{ variant: 'default', size: 'sm', class: 'h-8' }` → `class: 'h-(--pactor-control-height-sm)'`
- 触发器基类（约 111 行）`px-2 py-1 text-sm font-medium` → `px-2 py-1 text-[length:var(--pactor-control-text-md)] font-medium`
- `'group-data-[size=sm]/tabs-list:py-0.5 group-data-[size=sm]/tabs-list:text-xs'` → 末尾改为 `group-data-[size=sm]/tabs-list:text-[length:var(--pactor-control-text-sm)]`
- TabsAddButton（约 175 行）`inline-flex size-9` → `inline-flex size-(--pactor-control-height-md)`

`components/components/Tabs/index.tsx`：
- `TabsProps` 的 `variant` 声明后加：`/** 尺寸（仅压缩 default 胶囊变体为 sm 档）：default（缺省）/ sm */ size?: 'default' | 'sm';`
- 函数解构加 `size = 'default',`；`<TabsList variant={variant}` 改为 `<TabsList variant={variant} size={size}`

- [ ] **Step 5: navigation-menu.tsx / sidebar.tsx**

- `navigation-menu.tsx`（约 56 行触发器类串）：`inline-flex h-9 w-max` → `inline-flex h-(--pactor-control-height-md) w-max`；`py-2 text-sm font-medium` → `py-2 text-[length:var(--pactor-control-text-md)] font-medium`
- `sidebar.tsx` menu-button variants：
  - `default: 'h-8 text-sm'` → `default: 'h-(--pactor-control-height-sm) text-[length:var(--pactor-control-text-md)]'`
  - `sm: 'h-7 text-xs'` → `sm: 'h-7 text-[length:var(--pactor-control-text-sm)]'`（h-7 为侧栏特有小档，保持）
  - `lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!'` → `lg: 'h-12 text-[length:var(--pactor-control-text-md)] group-data-[collapsible=icon]:p-0!'`（h-12 保持）

说明：Pagination 页码按钮复用 `buttonVariants`，Task 3 后已自动跟随全局密度，本任务无需改动；DSL `Menu` 不动（其 `py-2` 是侧栏导航语义，已由 Sidebar menu-button 覆盖）。

- [ ] **Step 6: 跑测试 + 回归**

Run: `pnpm vitest run tests/build-styles.test.mjs && cd packages/ui && pnpm vitest run tests/components/sidebar.test.tsx tests/components/extended-overlay.test.tsx tests/components/extended-composite.test.tsx tests/layout`
Expected: 全部 PASS

- [ ] **Step 7: Commit**

```bash
git add packages/ui/src/styles.css packages/ui/src/ui/dropdown-menu.tsx packages/ui/src/ui/context-menu.tsx packages/ui/src/ui/menubar.tsx packages/ui/src/ui/tabs.tsx packages/ui/src/ui/navigation-menu.tsx packages/ui/src/ui/sidebar.tsx packages/ui/src/components/components/Tabs tests/build-styles.test.mjs
git commit -m "feat(ui): 菜单族/Tabs/NavigationMenu/Sidebar 菜单行随全局密度缩放，DSL Tabs 透传 size"
```

---

### Task 8: Table 密度（ui 令牌化 + DSL size prop）

**Files:**
- Modify: `packages/ui/src/styles.css`（table 令牌，三块同改）
- Modify: `packages/ui/src/ui/table.tsx`
- Modify: `packages/ui/src/components/components/Table/index.tsx`
- Test: `packages/ui/tests/components/table-density.test.tsx`（新建）

**Interfaces:**
- Consumes: `ControlSize`（`components/control-size.ts`）；新增令牌 `--pactor-table-head-height` / `--pactor-table-cell-padding-y`。
- Produces: DSL `Table` 新 prop `size?: ControlSize`（缺省 `'middle'` = 跟随全局密度；`small` / `large` 强制局部档，与全局密度独立、局部优先）。

- [ ] **Step 1: styles.css 加表格令牌（三块同改）+ 失败断言**

`:root` 追加 `--pactor-table-head-height: 2.5rem;` 与 `--pactor-table-cell-padding-y: 0.5rem;`；compact 块追加 `2rem` / `0.25rem`；comfortable 块追加 `3rem` / `0.75rem`。

`tests/build-styles.test.mjs` 追加：

```js
  it('表格编译为密度令牌引用', () => {
    expect(css).toContain('.py-\\(--pactor-table-cell-padding-y\\)');
    expect(css).toContain('.h-\\(--pactor-table-head-height\\)');
  });
```

- [ ] **Step 2: 写失败测试**

`packages/ui/tests/components/table-density.test.tsx`：

```tsx
// @vitest-environment jsdom
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderDsl } from './helpers.js';

const columns = [{ title: '姓名', dataIndex: 'name' }];
const dataSource = [{ id: 1, name: 'Alice' }];

describe('Table 密度', () => {
  it('size=small 覆盖行高与单元格 padding（局部档优先）', () => {
    renderDsl({ type: 'Table', props: { columns, dataSource, size: 'small' } });
    const cell = screen.getByText('Alice').closest('td');
    expect(cell?.className).toContain('py-1');
    const head = screen.getByText('姓名').closest('th');
    expect(head?.className).toContain('h-8');
  });

  it('size=large 覆盖行高与单元格 padding', () => {
    renderDsl({ type: 'Table', props: { columns, dataSource, size: 'large' } });
    expect(screen.getByText('Alice').closest('td')?.className).toContain('py-2.5');
    expect(screen.getByText('姓名').closest('th')?.className).toContain('h-12');
  });

  it('size 缺省（middle）不加覆盖类，跟随全局密度令牌', () => {
    renderDsl({ type: 'Table', props: { columns, dataSource } });
    const cell = screen.getByText('Alice').closest('td');
    expect(cell?.className).toContain('py-(--pactor-table-cell-padding-y)');
    expect(cell?.className).not.toContain(' py-1');
  });
});
```

Run: `cd packages/ui && pnpm vitest run tests/components/table-density.test.tsx`
Expected: FAIL（`size` prop 不存在；基类仍是硬编码 `p-2`）

- [ ] **Step 3: table.tsx 令牌化**

- Table 基类 `w-full caption-bottom text-sm` → `w-full caption-bottom text-[length:var(--pactor-control-text-md)]`
- TableHead：`'h-10 px-2 text-left` → `'h-(--pactor-table-head-height) px-2 text-left`
- TableCell：`'p-2 align-middle` → `'px-2 py-(--pactor-table-cell-padding-y) align-middle`

- [ ] **Step 4: DSL Table 加 size prop**

`components/components/Table/index.tsx`：

- import 加 `import type { ControlSize } from '../../control-size.js';`
- 文件顶部（TableProps 之前）加：

```ts
/** 行密度档位：middle = 跟随全局密度令牌（不加覆盖类）；small / large 强制局部档 */
const TABLE_SIZE: Record<ControlSize, { head: string; cell: string }> = {
  small: { head: 'h-8', cell: 'px-2 py-1' },
  middle: { head: '', cell: '' },
  large: { head: 'h-12 px-3', cell: 'px-3 py-2.5' },
};
```

- `TableProps` 加（放在 `pagination` 之后）：`/** 行密度：middle（缺省，跟随全局密度档位）/ small / large（强制局部档，与全局密度独立） */ size?: ControlSize;`
- 组件函数解构加 `size = 'middle',`
- 全部 `<TableHead` 渲染点（drag 手柄、selection、columns.map 三处）的 `className={cn(...)}` 末尾追加 `TABLE_SIZE[size].head`；全部 `<TableCell` 渲染点（empty colSpan 行、body 各行，约 574 / 597 / 615 / 638 行）的 className 末尾追加 `TABLE_SIZE[size].cell`

- [ ] **Step 5: 跑测试 + 回归**

Run: `cd packages/ui && pnpm vitest run tests/components/table-density.test.tsx tests/components/table-tree-dnd.test.tsx tests/components/contract.test.tsx`，然后回仓库根目录 `pnpm vitest run tests/build-styles.test.mjs`
Expected: 全部 PASS

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/styles.css packages/ui/src/ui/table.tsx packages/ui/src/components/components/Table packages/ui/tests/components/table-density.test.tsx
git commit -m "feat(ui): Table 密度——行高/单元格令牌化 + DSL size prop（small/middle/large）"
```

---

### Task 9: Calendar / Avatar / Badge / Breadcrumb（二期小件）

**Files:**
- Modify: `packages/ui/src/styles.css`（calendar 令牌，三块同改）
- Modify: `packages/ui/src/ui/calendar.tsx`、`avatar.tsx`、`badge.tsx`、`breadcrumb.tsx`

**Interfaces:**
- Consumes: Task 1 令牌；新增令牌 `--pactor-calendar-day-size`。Produces: 无新导出。

- [ ] **Step 1: styles.css 加日历令牌（三块同改）+ 失败断言**

`:root` 追加 `--pactor-calendar-day-size: 2rem;`；compact 块追加 `1.75rem`；comfortable 块追加 `2.25rem`。

`tests/build-styles.test.mjs` 追加：

```js
  it('日历日期格编译为密度令牌引用', () => {
    expect(css).toContain('.size-\\(--pactor-calendar-day-size\\)');
  });
```

- [ ] **Step 2: calendar.tsx / avatar.tsx / badge.tsx / breadcrumb.tsx**

- `calendar.tsx`：weekday `'w-8 rounded-md` → `'w-(--pactor-calendar-day-size) rounded-md`；day `'h-8 w-8 p-0 text-center text-sm'` → `'h-(--pactor-calendar-day-size) w-(--pactor-calendar-day-size) p-0 text-center text-[length:var(--pactor-control-text-md)]'`；day 按钮 `'size-8 cursor-pointer` → `'size-(--pactor-calendar-day-size) cursor-pointer`（nav 前后按钮 `size-7` 保持）
- `avatar.tsx`：`'relative flex size-8` → `'relative flex size-(--pactor-control-height-sm)`
- `badge.tsx`：类串中 `text-xs` → `text-[length:var(--pactor-control-text-sm)]`
- `breadcrumb.tsx`（约 106 行）：`'flex size-9 items-center` → `'flex size-(--pactor-control-height-md) items-center`
- Kbd 保持现状（`h-5` 与控件高度阶梯不对齐，收益低）

- [ ] **Step 3: 跑测试 + 回归**

Run: `pnpm vitest run tests/build-styles.test.mjs && cd packages/ui && pnpm test`
Expected: 全部 PASS

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/styles.css packages/ui/src/ui/calendar.tsx packages/ui/src/ui/avatar.tsx packages/ui/src/ui/badge.tsx packages/ui/src/ui/breadcrumb.tsx
git commit -m "feat(ui): Calendar/Avatar/Badge/Breadcrumb 尺寸随全局密度缩放"
```

---

### Task 10: 全量验证

- [ ] **Step 1: 全量测试与类型检查**

```bash
pnpm --filter @pactor-app/ui test && pnpm typecheck && pnpm vitest run tests/
```

Expected: 全部 PASS。

- [ ] **Step 2: 样式构建产物抽查**

```bash
cd packages/ui && pnpm build:styles && grep -c "pactor-control" styles.css
```

Expected: 计数 > 0（令牌定义 + 工具类引用均存在）。

- [ ] **Step 3: 视觉验收（手动，执行者在总结中报告）**

`pnpm --filter example-admin dev`：SkinSettings 切三档 + 将某页面 DSL UserMenu 设 `showSize: true`（或直接在 DevTools 对 `<html>` 写 `data-pactor-size`），确认：
1. default 档与改动前像素级一致；
2. compact / comfortable 差异明显（控件高度 ±4px 以上）；
3. 弹层（Select/Dropdown 等 portal 挂 body）同样跟随；
4. 刷新后密度偏好保持（UserMenu 非受控路径）；
5. SkinSettings 控件高度滑杆：拖动后 Button/Input 高度按自定义值渲染，且覆盖密度档位；「恢复档位」后回到预设；
6. 二期组件：Table 行高、DropdownMenu 菜单项、Tabs 胶囊、Sidebar 菜单行、Calendar 日期格在三档下差异明显；DSL Table `size: 'small'` 强制局部紧凑且不受全局档位影响。
