# 全局尺寸档位（Global Size Scale）设计

日期：2026-11-12
状态：已确认（auto 模式下由代理按既有约定拍板，假设见文末）

## 背景与问题

`@pactor-app/ui`（shadcn kit）的组件尺寸存在两个问题：

1. **档位差异不明显**：Button 各档高度 h-6 / h-8 / h-9 / h-10（24 / 32 / 36 / 40px），相邻档仅差 4px，视觉上难以感知；Input 甚至只有固定 `h-9` 一档，没有 size 属性。
2. **没有全局尺寸控制**：尺寸以硬编码 Tailwind 类（`h-9`、`text-sm`）散落在 44 个组件源文件里，业务无法像 antd `ConfigProvider componentSize` 那样整体调密 / 调疏。

目标：为 Button、Input 等表单控件族建立**全局尺寸档位**机制，允许在 UserMenu 组件或用户自定义组件中切换整页尺寸，同时让单组件的 `size` 档位差异更显著。

## 方案取舍

### 方案 A：CSS 尺寸令牌 + `data-pactor-size` 属性（推荐）

在 `styles.css` 的 `:root` 定义控件尺寸令牌族（高度 / 字号），组件把硬编码 `h-9` 等换成 Tailwind v4 的 var 语法 `h-(--pactor-control-height-md)`；全局档位经 `documentElement` 的 `data-pactor-size="compact|default|comfortable"` 属性切换令牌值。

- **优点**：与项目既有主题机制（`data-pactor-theme`）和皮肤契约（CSS 变量换肤）完全同构；无 JS 依赖、SSR 友好；portal 弹层挂在 body 下天然继承；自定义组件无需接框架 API，读同一组令牌 / 写同一个属性即可；Tailwind 预建样式表无需随切换重建。
- **缺点**：需要逐组件把硬编码尺寸换成令牌引用（一次性重构，范围可控）。

### 方案 B：React Context（UiSizeProvider，仿 antd）

提供 `<UiSizeProvider size="small">`，各组件 `size` 缺省从 context 读取。

- 缺点：主题走 CSS、尺寸走 JS，机制分裂；portal/overlay 需要保证 context 穿透；`ui/`（shadcn 原语层）与 `components/`（DSL 适配层）两层都要接线；纯 CSS 消费者无法受益。否决。

### 方案 C：根字号 / zoom 缩放

`html { font-size }` 或 `zoom` 整体缩放。

- 缺点：缩放的是整个页面（布局、图片一起变），不是控件密度；与 rem 令牌体系冲突；可访问性差。否决。

**结论：采用方案 A。**

## 设计

### 1. 尺寸令牌族（`packages/ui/src/styles.css`）

`:root` 新增控件尺寸令牌（default 档保持现状值，保证默认视觉零变化）：

| 令牌 | compact | default（现状） | comfortable |
|------|---------|----------------|-------------|
| `--pactor-control-height-xs` | 1.25rem (20px) | 1.5rem (24px, h-6) | 1.75rem (28px) |
| `--pactor-control-height-sm` | 1.75rem (28px) | 2rem (32px, h-8) | 2.25rem (36px) |
| `--pactor-control-height-md` | 2rem (32px) | 2.25rem (36px, h-9) | 2.5rem (40px) |
| `--pactor-control-height-lg` | 2.25rem (36px) | 2.5rem (40px, h-10) | 3rem (48px) |
| `--pactor-control-text-sm` | 0.75rem (12px) | 0.75rem (12px, text-xs) | 0.8125rem (13px) |
| `--pactor-control-text-md` | 0.8125rem (13px) | 0.875rem (14px, text-sm) | 0.9375rem (15px) |
| `--pactor-control-text-lg` | 0.875rem (14px) | 1rem (16px, text-base) | 1.0625rem (17px) |
| `--pactor-control-box` | 0.875rem (14px) | 1rem (16px, size-4) | 1.125rem (18px) |
| `--pactor-menu-item-padding-y` | 0.25rem | 0.375rem (py-1.5) | 0.5rem |
| `--pactor-table-head-height` | 2rem | 2.5rem (h-10) | 3rem |
| `--pactor-table-cell-padding-y` | 0.25rem | 0.5rem (p-2) | 0.75rem |
| `--pactor-calendar-day-size` | 1.75rem | 2rem (size-8) | 2.25rem |

档位切换规则（与 `data-pactor-theme` 三态同款契约）：

```css
:root { /* default 档值，即不设置属性时 */ }
[data-pactor-size='compact'] { /* compact 档覆盖 */ }
[data-pactor-size='comfortable'] { /* comfortable 档覆盖 */ }
```

未设置 `data-pactor-size` = default 档。compact 相比 default 每档高度 -4px、正文字号 -1px；comfortable 每档 +4px（lg 档 +8px）、字号 +1px——全局相邻档差异从 4px 拉到 8px，同时单组件 xs/sm/default/lg 之间保持原有阶梯。

内边距、圆角、图标尺寸保持现状不动（YAGNI：高度 + 字号已足以感知密度差异，且避免破坏现有布局对齐）。

### 2. 组件改造（一期：表单控件族）

把硬编码高度 / 字号类替换为令牌引用，Tailwind v4 var 语法编译为 `height: var(--token)`，运行时切换档位无需重建样式表：

**关键发现（实施前的代码勘察）**：DSL 适配层已有统一尺寸映射 `packages/ui/src/components/control-size.ts`（`CONTROL_SIZE_BOX` / `CONTROL_SIZE_BOX_GROW` / `CONTROL_SIZE_AREA` / `CONTROL_SIZE_TRIGGER_TEXT`，被 Input / Select / DatePicker / Textarea / Combobox / MultiSelect / NumberInput / TimePicker / TreeSelect / Cascader / Mentions 等 12 个表单控件共用），且 DSL Input 等组件**已有 `size?: ControlSize`（small/middle/large）prop**。因此最大的杠杆是把 control-size.ts 里的硬编码类（`h-8/h-9/h-10`、`text-xs/text-sm/text-base`）换成令牌引用——一处改动，全部盒式表单控件跟随全局档位；vendored 原语层（button/input/select/toggle/combobox/input-otp/input-group/checkbox/radio）再逐一令牌化。

| 文件 | 改动 |
|------|------|
| `packages/ui/src/components/control-size.ts` | 四组映射全部令牌化（高度 → `--pactor-control-height-sm/md/lg`，字号 → `--pactor-control-text-sm/md/lg`）；12 个 DSL 表单控件零改动自动跟随 |
| `packages/ui/src/ui/button.tsx` | size 各档 `h-6/h-8/h-9/h-10` → `h-(--pactor-control-height-xs/sm/md/lg)`；`text-xs/text-sm` → `text-(--pactor-control-text-sm/md)`；icon 各档 `size-6/8/9/10` 同步令牌化 |
| `packages/ui/src/ui/input.tsx` | `h-9` → 令牌 md；`text-sm` → 令牌 text-md |
| `packages/ui/src/ui/select.tsx` | `data-[size=*]:h-*` → 令牌；`text-sm` → 令牌 text-md |
| `packages/ui/src/ui/toggle.tsx` / `toggle-group.tsx` | `h-8/h-9/h-10` → 令牌 |
| `packages/ui/src/ui/combobox.tsx` / `input-group.tsx` / `input-otp.tsx` | `h-9`（OTP 含 `w-9`）→ 令牌；字号令牌化 |
| `packages/ui/src/ui/checkbox.tsx` / `radio-group.tsx` | `size-4` → `size-(--pactor-control-box)` |
| `packages/ui/src/ui/textarea.tsx` / `switch.tsx` / `slider.tsx` | **保持现状**：Textarea 高度由行数决定（内边距/字号走 DSL 层 CONTROL_SIZE_AREA 已覆盖）；Switch/Slider 是轨道几何（宽高成比例），缩放会破碎比例，一期不动 |

单组件 `size` prop 语义不变、优先级最高：全局档位只改各档对应的令牌值。

**二期（已纳入本计划）**：

| 组件 | 改动 |
|------|------|
| `table.tsx`（vendored） | TableHead `h-10` → `--pactor-table-head-height`；TableCell `p-2` → `px-2 py-(--pactor-table-cell-padding-y)`；`text-sm` → text-md 令牌 |
| DSL `Table` | 新增 `size?: ControlSize`：middle = 跟随全局令牌（空类），small / large 给覆盖类（`h-8` / `px-2 py-1`、`h-12 px-3` / `px-3 py-2.5`），与全局密度独立、局部优先 |
| `dropdown-menu.tsx` / `context-menu.tsx` / `menubar.tsx` | 菜单项 `py-1.5 text-sm` → `py-(--pactor-menu-item-padding-y)` + text-md 令牌（menubar 顶栏触发器 `py-1` 保持） |
| `tabs.tsx` + DSL `Tabs` | List `h-9` / sm `h-8` → control-height md/sm 令牌，触发器字号令牌化；DSL 适配层补 `size?: 'default' \| 'sm'` 透传（ui 层早有该 prop） |
| `navigation-menu.tsx` | 触发器 `h-9` → control-height md 令牌，字号令牌化 |
| `sidebar.tsx` menu-button | default `h-8 text-sm` → control-height sm + text-md 令牌；sm / lg 档字号令牌化，`h-7` / `h-12` 保持 |
| `calendar.tsx` | 日期格 `size-8` / `w-8` / `h-8` → `--pactor-calendar-day-size`，day 字号令牌化；nav 按钮 `size-7` 保持 |
| `avatar.tsx` / `badge.tsx` / `breadcrumb.tsx` | Avatar `size-8` → control-height sm；Badge `text-xs` → text-sm 令牌；Breadcrumb 更多按钮 `size-9` → control-height md |

**明确不做**：Pagination（页码按钮复用 `buttonVariants`，Task 3 后自动跟随全局，零改动）；DSL `Menu`（其行 padding `py-2` 语义是侧栏导航，已由 Sidebar menu-button 覆盖，动它会破坏 default 档零变化承诺）；`Kbd`（`h-5` 与控件阶梯不对齐，收益低）；Card / Alert / Empty / Dialog / Drawer（间距型，密度语义弱）。

### 3. UserMenu 尺寸切换（`packages/ui/src/ui/user-menu/`）

与 theme / language 完全同构的一组 props：

```ts
type GlobalSize = 'compact' | 'default' | 'comfortable';

interface UserMenuProps {
  size?: GlobalSize;              // 受控
  defaultSize?: GlobalSize;       // 非受控初值；缺省读 localStorage 'pactor.size'，再缺省 'default'
  showSize?: boolean;             // 显示「界面密度」单选行（缺省 false）
  sizes?: { value: GlobalSize; label: string }[];  // 缺省 紧凑 / 默认 / 宽松
  onSizeChange?: (size: GlobalSize) => void;
}
```

行为契约：

- 选择即应用：`compact` / `comfortable` 写 `documentElement` 的 `data-pactor-size`，`default` 移除该属性（对应 `applyThemePreference` 的 system 语义）；
- 非受控时写入 localStorage `pactor.size`（对应 `pactor.locale` 契约），挂载时读取并应用，刷新后偏好保持；受控时持久化由父级决定；
- 菜单内以 MenuRadioGroup 保持展开（与主题切换一致），桌面 Dropdown 与移动端 Sheet 两条路径都要接；
- `components/components/UserMenu` DSL 适配层透传新 props，DSL 页面可直接 `showSize: true` 启用。

### 4. 自定义组件 / 宿主入口

从 `@pactor-app/ui` 导出轻量工具（`packages/ui/src/lib/global-size.ts`，UserMenu 内部同样使用），经 `ui/index.ts` 与包根（`components/index.ts` re-export）双向导出：

```ts
export type GlobalSize = 'compact' | 'default' | 'comfortable';
export function applyGlobalSize(size: GlobalSize): void;   // 写/移除 data-pactor-size
export function readGlobalSize(): GlobalSize;              // 读 documentElement，缺省 'default'
export const globalSizeStorageKey = 'pactor.size';
```

契约文档化：任何自定义组件 / 宿主脚本写 `document.documentElement.dataset.pactorSize` 即可全局切换；消费方在 CSS 中使用 `var(--pactor-control-height-md)` 等令牌即自动跟随。需要在首屏避免闪烁的宿主可在 HTML 头部内联脚本提前写属性（与暗色主题防闪烁同一手法，写入文档）。

### 4.5 自定义数值（GlobalSizeValues API）

三档预设之外，允许用户 / 宿主直接自定义各档数值。落点仍是令牌：在 `documentElement` 上写**内联** CSS 变量，内联样式优先级高于样式表中的 `:root` 与 `[data-pactor-size]` 块，因此自定义数值天然覆盖档位预设。

```ts
/** 各令牌的可覆盖数值（值为合法 CSS 长度，如 '2.5rem' / '40px'） */
export interface GlobalSizeValues {
  heightXs?: string; heightSm?: string; heightMd?: string; heightLg?: string;
  textSm?: string; textMd?: string; textLg?: string;
  box?: string;
}

/** 应用自定义数值：参数即完整覆盖集——给出的键写内联变量，
 *  未给出的键移除既有内联覆盖；传 null 清除全部，回到档位预设 */
export function applyGlobalSizeValues(values: GlobalSizeValues | null): void;

/** 读取当前内联覆盖（不含样式表档位值；无覆盖返回 {}） */
export function readGlobalSizeValues(): GlobalSizeValues;
```

优先级（高 → 低）：**内联自定义值 > `[data-pactor-size]` 档位预设 > `:root` default 档**。持久化（localStorage 键、首屏防闪烁内联脚本）由宿主负责，与皮肤（skin.ts）同一模式；example-admin SkinSettings 演示：滑杆调控件高度基准（md），其余高度档按比例派生后经 `applyGlobalSizeValues` 写入。

### 5. 文档

- `docs/src/content/docs/components/`：UserMenu、Input 等受影响组件的 props 更新；
- 皮肤 / 主题指南补充「尺寸档位」一节：令牌表、`data-pactor-size` 契约、自定义组件接入方式、防闪烁内联脚本示例。

## 错误处理与边界

- localStorage 不可用（隐私模式）：忽略异常，仅保留会话内选择（与语言持久化同一策略）；
- SSR / 无 document 环境：读写均守卫 `typeof document === 'undefined'`（沿用现有 theme 工具做法）；
- 非法属性值（如业务手写 `data-pactor-size="huge"`）：CSS 选择器不匹配，自然回退 default 档；`readGlobalSize` 对未知值回退 `'default'`；
- default 档为现状值：不切换档位时任何组件视觉零变化（回归安全）。

## 测试

- **单元测试**（vitest，`packages/ui` 既有测试结构）：UserMenu size 受控 / 非受控、持久化、属性写删、`onSizeChange` 上报（镜像现有 theme / language 测试）；`global-size` 工具的读写与非法值回退；
- **样式构建测试**（`tests/build-styles.test.mjs`）：断言构建产物包含全部 `--pactor-control-*` 令牌与两个档位属性选择器；
- **手动 / 视觉验收**：`pnpm --filter example-admin dev`，UserMenu 开启 `showSize`，三档切换下 Button / Input / Select 等各档尺寸感知明显，弹层（portal 挂 body）同样跟随。

## 假设（auto 模式下自行拍板）

1. 档位命名为 `compact / default / comfortable`（3 档），而非连续缩放因子——离散档位与主题三态契约一致，令牌表可控。
2. 一期只覆盖表单控件族；Table / Tabs / Menu 等留二期。
3. 只令牌化高度与字号，不动内边距 / 圆角 / 图标尺寸。
4. UserMenu 的「界面密度」入口缺省关闭（`showSize` 默认 false），与 `showLanguage` 一致，由宿主按需开启。
5. 尺寸偏好持久化 key 为 `pactor.size`，与 `pactor.locale` 同命名空间。
6. 自定义数值经 documentElement 内联变量实现（优先级高于档位预设），`applyGlobalSizeValues(null)` 清除后回到档位；自定义值的持久化由宿主自负（ui 包只提供 apply/read，保持与主题一致的轻契约）。
