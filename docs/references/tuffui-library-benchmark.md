# tuffui 组件库借鉴评估

> 评估对象：https://github.com/yurigdesigner/tuffui（commit `f31ea2b`，2026-11-16）
> 对照对象：pactor 仓库（`packages/ui`、`packages/chat`、`packages/permission`、`packages/theme`）与 pactor-docs
> 评估日期：2026-11-19
> 结论性质：只做评估，不改代码。落地成本按熟悉本仓库的 1 人估算，单位为「人日」。
> 关联文档：`docs/references/tuffui-docs-benchmark.md` 已覆盖文档站层面的 12 项；本文只评估**库本身**，不重复文档站条目，必要处标注「文档站 #N」。

---

## 一、TL;DR

tuffui 是一个面向 AI 产品界面的 **copy-in React 组件集**：88 个 catalog 条目（81 个组件 + 7 个整屏）、90 个 registry 目录、8 个分类；源码通过 shadcn CLI 复制进使用方项目。它不是运行时、不是 npm 设计系统包，也**没有测试与 CI**（`package.json` 只有 lint / typecheck / build，`.github` 下只有图片资源）。

所以，**它的分发模型、内容规模和视觉路线都不适合 pactor**。pactor 是「24 个 npm 包 + DSL 运行时 + 预编译皮肤」，两者不在一个层面。真正值得借的是 tuffui 在**组件交互契约、预览契约、交付验收**上的细节，而这些恰好是 pactor 当前有具体缺口的地方：

1. **把可访问性要求写进类型**：`IconButton` 的 `label` 必填；`Segmented` 的 `label` 必填，并实现 `role="radiogroup"` + 方向键 + roving tabindex。
2. **集中动效令牌 + 系统级 reduced-motion**：一套 `EASE_OUT / EASE_IN_OUT / spring / enter / exit / instant`，组件统一消费。
3. **统一预览契约**：`DemoProps { variant, autoplay, thumbnail }` 同时服务组件预览、整屏预览、缩略图；装饰性缩略图 `aria-hidden` + `inert`。
4. **高风险审批队列的交互模型**：风险分组、`once/session/always` 授权范围、批量操作、撤销窗口、`aria-live`、键盘行导航。
5. **设备框预览 + 整屏验收清单**：1280 / 768 / 390 三档设备框、自动缩放、全屏路由 `noindex` + canonical；整屏只允许一个纵向滚动、禁止嵌套滚动、禁止横向溢出。
6. **「新增组件 / 新增屏幕」交付清单**：三步交付、构建期硬约束，把「文档写漏」变成构建失败。

**一句话：借它的「交互与验收契约」，不借它的「分发与内容」。**

| # | 借鉴项 | tuffui 证据 | pactor 现状 | 价值 | 成本 | 优先级 | 结论 |
|---|---|---|---|---|---|---|---|
| 1 | 类型级 a11y 契约 + 复合控件键盘 | `registry/action-button/action-button.tsx:70-75`、`registry/segmented-control/segmented-control.tsx:52-88` | `ActionButton.label` 可选、仅 dev 告警；`Segmented` 无方向键 / roving tabindex | 高 | 1.5–2 | P0 | 直接采纳 |
| 2 | 动效令牌 + 全局 reduced-motion | `registry/motion-tokens/motion-tokens.ts:8-21`、`app/globals.css:209-217` | 65 个文件用 `transition`，仅 10 个处理 reduced-motion；无 `--ease-*` | 中 | 1.5–2 | P0（先做全局兜底）/ P1（迁移） | 采纳 |
| 3 | 统一预览契约 | `components/docs/demo.tsx:6-10`、`components/site/component-thumbnail.tsx:58-59` | 预览注册表零参数、Login / Hero 专用岛；无缩略图约束 | 中 | 2–3 | P1 | 采纳（与文档站 #7 合并） |
| 4 | 高风险审批队列的交互模型 | `registry/tool-approval-queue/tool-approval-queue.tsx` | 只有 `ChatConfirm` 回调，无 UI；permission 只有权限码 | 高 | 5–8 | P1 | 采纳（先 POC） |
| 5 | 设备框预览 + 整屏验收契约 | `components/docs/screen-preview.tsx:13-19`、`README.md:67-82` | 模板预览硬编码 125% / 0.8；无设备切换；预览路由无 noindex | 中高 | 3–4 | P1 | 选择性采纳 |
| 6 | 组件交付清单 + 覆盖门禁 | `README.md:56-66`、`scripts/build-registry.mts:103-111` | 无贡献清单；`validate.ts` 不校验预览覆盖 | 中 | 1.5–2 | P2 | 采纳 |

与文档站评估重叠的部分：#3 与文档站 #7（预览重置 / 变体切换）、#6 与 #8 / #12（文档源码漂移 / 单一数据源）。本文只补充**库侧契约**；落地时应合并实施，不要做两套。

---

## 二、tuffui 的库模型（事实）

### 2.1 规模与定位

- **88 个 catalog 条目** = 81 个组件 + 7 个整屏；**90 个 registry 目录**（多出的 `motion-tokens`、`use-mock-run` 不是 catalog 组件）。
- 8 个分类：foundations / screens / conversation / tools / generative / planning / observability / usage。
- 技术栈硬绑定：Next.js 16.4.4、React 19.3、Tailwind v4、motion 14.9、Radix UI、Phosphor icons。
- **0 个测试文件、无 CI**；构建脚本只有 `lint`、`typecheck`、`registry:build`、`next build`。
- 组件是自包含 UI + mock 数据 demo，不是可执行运行时；没有 DSL、权限、i18n、路由能力。

### 2.2 交付结构

每个组件一个目录，三个文件同目录：

```text
registry/<slug>/
  <slug>.tsx   组件源码
  demo.tsx     预览用的脚本化示例
  docs.ts      { usage, props[], types? } —— 页面上的 Usage 与 Props 表直接来自这里
```

- `docs.ts` 的类型只有十行（`lib/docs/types.ts`）：`PropDef { name, type, default?, required?, description }`、`ComponentDocs { usage, props, types? }`。
- `lib/catalog.ts` 的 `CatalogEntry` 含 `slug / name / description / category / variants[] / status: "ready" | "planned" / added?`；`variants` 的第一项是默认变体。
- catalog 一处驱动导航、目录页、组件页静态参数、上 / 下一页、sitemap、llms、搜索索引。
- `components/docs/demo.tsx` 为每个 slug 建一个 `next/dynamic` 懒加载块，并定义共享的 `DemoProps`。

### 2.3 构建期硬约束

- `scripts/build-registry.mts`：
  - 从组件与 demo 的 `import` **反推** npm 依赖与 registry 依赖；
  - 从 `app/globals.css` **解析**主题 token 写进 registry；
  - **许可证头缺失即构建失败**（`scripts/build-registry.mts:103-111`）。
- `lib/theme-tokens.ts`：`shippedTokens` 白名单 + `parseTokens(':root' | '.dark')` + `tokensCss` 输出。
- 静态 `_headers`、OG ImageResponse、JSON-LD、sitemap、llms.txt 都在构建期产出。

### 2.4 交互契约（库侧）

- **可访问名写进类型**：`IconButtonProps.label: string` 必填（`registry/action-button/action-button.tsx:70-75`），渲染为 `aria-label`（`:107`）；默认 `type="button"`、`aria-busy`（`:55`、`:110`）。
- **复合控件键盘语义**：`Segmented` 的 `label: string` 必填（`registry/segmented-control/segmented-control.tsx:22`）；`role="radiogroup"` + `aria-label`（`:70-72`）；`aria-checked` + roving `tabIndex`（`:86-88`）；方向键循环、跳过 disabled、聚焦选中项（`:52-63`）；键盘切换用 `instant` 过渡，指针切换用 spring（`:102`）；外层 `MotionConfig reducedMotion="user"`（`:67`）。
- **审批队列**：风险分组、`once/session/always` 授权范围、批量操作、撤销窗口、`role="status" aria-live="polite"`、键盘行导航（详见第四节）。
- **装饰性缩略图**：外层 `aria-hidden="true"` + `inert`，`useInView` 懒挂载（`components/site/component-thumbnail.tsx:28`、`:58-59`）。

### 2.5 预览架构

- `DemoProps { variant?, autoplay?, thumbnail? }`（`components/docs/demo.tsx:6-10`）被四处复用：`ComponentPreview`、`ScreenPreview`、`ScreenHost`、`ComponentThumbnail`。
- `ComponentPreview`：preview / code 页签、变体 radiogroup、Replay（`key={run}` 重挂载）、切换变体同时重置脚本（`components/docs/component-preview.tsx:20-99`）。
- `ScreenPreview`：三档设备框（1280×800 / 768×960 / 390×780，`components/docs/screen-preview.tsx:13-19`），`ResizeObserver` 计算 `Math.min(1, containerWidth / width)` 缩放（`:138-152`），Full screen 链接。
- `ScreenHost`：整屏路由用 `useSyncExternalStore` 读 `?variant=`，避免 hydration 不一致（`components/docs/screen-host.tsx:16-26`）。
- 整屏路由的 metadata 指向组件详情页并 `noindex: true`，canonical 指回详情页（`app/screens/[slug]/page.tsx:22-26`）。
- 缩略图：`useInView({ once: true, margin: "200px" })` 懒挂载；卡片只在鼠标悬停或 `:focus-visible` 时播放，`onPointerEnter` 显式判断 `pointerType === "mouse"`，避免 iOS 把 tap 当 hover（`components/site/component-card.tsx:18-21`）。

### 2.6 明确的短板（不要抄）

- 0 测试、无 CI；一个 88 组件库没有一条自动化交互断言。
- `lib/docs/index.ts` 是 **88 行手写 import 映射**；`components/docs/demo.tsx` 是另一张 88 项手写表。新增一个组件要改两处，属于结构性漂移源。
- copy-in 分发、许可证头、Next 静态导出 `_headers`、Phosphor / motion 硬依赖，都是 tuffui 自身形态的产物。
- 商业位与捐赠链接（`ko-fi`）不进 pactor。

---

## 三、pactor 基线（事实）

### 3.1 已经领先、不必回头抄

| 能力 | pactor | tuffui |
|---|---|---|
| 分发与版本 | 24 个 npm 包、semver、`@pactor-app/*`；`styles.css` 预编译，消费方无需 Tailwind | copy-in 源码；使用方需具备 React 19 / Tailwind v4 / shadcn CLI |
| 测试 | `packages` 下 217 个测试文件，其中 `packages/ui` 62 个 | 0 |
| 主题 | 14 套皮肤；`build-skins.mjs --check` 校验 manifest / 源文件 / loader / 孤儿文件 / `--theme-source` 颜色一致性 | 仅许可证头 + token 解析；无皮肤构建门禁 |
| 运行时 | DSL runtime、router、permission、i18n、chat、resource | 静态 React 组件 |
| 文档 | 175 个组件条目、DSL / YAML 三页签、markdown 复制；搜索与 llms 已在 pactor-docs 工作区实现（P0，未部署） | 2 篇叙述型文档 + 88 个组件页 |
| 基础可访问性 | `Button` 已有 `aria-busy`、非提交默认 `type="button"`；大量 Base UI 原语自带键盘语义 | 自研组件，契约靠作者自觉 |

### 3.2 具体缺口（本文要解决的）

| 缺口 | 证据 | 影响 |
|---|---|---|
| 图标按钮的可访问名没有类型保证 | `packages/ui/src/ui/action-button.tsx:15` `label?: React.ReactNode`；`:39-46` 只在 dev `console.warn` | JS 调用方、spread props、CI 都拦不住 icon-only 无名按钮 |
| `Segmented` 缺键盘语义 | `packages/ui/src/components/components/Segmented/index.tsx:28` `label?: string`；`:117` 有 `role="radiogroup"`，但无 `aria-label`、无 `onKeyDown`、无 roving `tabIndex` | 键盘用户 Tab 逐个经过每个选项，方向键无效；WCAG 2.1.1 / 4.1.2 风险 |
| Form 内 `Segmented` 的组级语义错误 | `Segmented/index.tsx:170-178` 不传 `htmlFor`；`Form/form-item.tsx:57-74` 把 `aria-required` / `aria-invalid` 写到第一个 `button` | 组没有可访问名；必填 / 错误语义落在单个 radio 上 |
| 动效没有系统化 | 65 个文件用 `transition`，仅 10 个有 `motion-reduce` / `motion-safe`；无 `--ease-*`；`--motion-*` 只在 `packages/theme/src/skins/portal.css:115-118`，UI 从不消费 | 开系统「减弱动效」后仍有大量动画；曲线各写各的 |
| 高风险操作没有标准审批界面 | `packages/chat/src/capability-action.ts:19-20` 只有 `risk: 'low' \| 'high'`；`:37-50` `ChatConfirm = (request) => Promise<boolean>`；`packages/permission/src/store.ts:12` 只有权限码 `Set<string>` | 宿主必须自己实现审批 UI；`risk: 'high'` 的默认体验是抛错或一个原生 confirm |
| 模板预览是硬编码缩放 | pactor-docs `src/components/TemplateFlowSection.astro:26-45` 固定 `height = preview.height ?? 560`；`src/styles/asset-library.css:1559-1567` `width:125%; transform:scale(0.8); margin-bottom:-112px` | 无法切设备；窄屏下预览不可信；预览路由无 noindex / canonical |
| 预览注册表零参数 | pactor-docs `src/components/previews/ComponentPreview.tsx:448-495` `Record<string, () => ReactElement>`；Login / Hero 走专用岛（`ComponentPreviewDslSection.astro:31-40`） | 变体 / 重播 / 缩略图无法统一；每加一种能力就要再写一个专用岛 |
| 没有交付清单与覆盖门禁 | `packages/ui/README.md` 130 行只有安装 / 覆盖点 / 样式 / 独立使用；pactor-docs `scripts/validate.ts:139-245` 只校验 ID / 引用 / 外链 | 新增组件容易漏 docs 数据、详情、预览、previewable 清单；预览表靠人手同步 |

---

## 四、逐项评估

### 1. 类型级 a11y 契约与复合控件键盘（P0）

**tuffui 做法**

- `IconButtonProps` 的 `label: string` 是必填字段，注释写明「Accessible name; icon buttons have no visible text」，渲染时直接成为 `aria-label`（`registry/action-button/action-button.tsx:70-75`、`:107`）。
- `Segmented` 的 `label: string` 必填，作为 `aria-label`；方向键在 enabled 选项间循环并聚焦，roving tabindex 让整组只占一个 Tab 停靠点；键盘切换用 `instant`，避免「键盘操作还要等动画」（`registry/segmented-control/segmented-control.tsx:22`、`:52-63`、`:67-72`、`:86-88`、`:102`）。
- 注意：tuffui 自己也没有贯彻到底——`components/docs/component-preview.tsx:48-80` 的变体 radiogroup 就没有方向键和 roving tabindex。**借的是契约，不是它的覆盖率。**

**pactor 现状**

- `ActionButton` 的 `label` 是可选的，icon-only 时只做 dev 告警（`packages/ui/src/ui/action-button.tsx:15`、`:39-46`）；类型层面允许「无 label、无 aria-label」通过。
- `Segmented` 的 `label` 也是可选，且只作为 Form 的可见标签；`role="radiogroup"` 但没有 `aria-label`，没有 `onKeyDown`，没有 `tabIndex`（`packages/ui/src/components/components/Segmented/index.tsx:28`、`:117`、`:142-147`）。
- Form 内 `FieldShell` 对分组控件不传 `htmlFor`，`useEffect` 又把 `aria-required` / `aria-invalid` 写到第一个可聚焦 `button`（`Form/form-item.tsx:57-74`），组本身没有名字、错误语义也落错位置。
- 测试只覆盖点击 / 受控 / 非受控 / Form 提交，没有键盘与可访问名断言（`packages/ui/tests/components/essential-display.test.tsx:690+`）。

**pactor 怎么落**

1. `ActionButton` 改成「二选一」联合类型，保留运行时告警兜底 JS / spread 调用：
   ```ts
   type ActionButtonBase = Omit<React.ComponentProps<'button'>, 'children'> &
     VariantProps<typeof buttonVariants> & {
       icon: React.ReactNode;
       tooltip?: string;
     };

   export type ActionButtonProps = ActionButtonBase &
     (
       | { label: React.ReactNode }
       | { label?: undefined; 'aria-label': string }
     );
   ```
   加一条 `// @ts-expect-error` 的类型测试，确保「只有 icon」无法编译。
2. `Segmented` 补齐键盘：
   - `tabIndex={active ? 0 : -1}`；没有选中项时第一个 enabled 项为 0；
   - `ArrowLeft/Right/Up/Down` 循环、跳过 disabled、聚焦下一项；`Home/End` 可选；
   - 键盘改变时指示块过渡为 0（增加 `inputMode` state），指针保持现有 200ms；
   - 独立渲染时把 `label` 映射为 `aria-label`；Form 内给 `FieldShell` 生成 label id，组上 `aria-labelledby`；
   - 组级 `aria-required` / `aria-invalid` / `aria-describedby`：给 `FieldShell` 增加「aria 目标」概念（例如 `ariaTarget="group"`），或者让 `Segmented` 通过 context 读取 error / rules 后自己写到组上，并让 FieldShell 跳过自动下发。
3. 测试：方向键循环、跳过 disabled、roving tabindex、`aria-checked` 跟随、Form 内组名 / 必填 / 错误语义。

**成本**：1.5–2 人日（组件 0.5–1、Form 集成 0.5、测试 0.5）。
**风险**：低。主要风险是 Form 现有测试回归；改动集中在 `Segmented` 与 `form-item` 两处。
**验收**：纯键盘可完成 Segmented 选择；屏幕阅读器读出组名与选中项；`ActionButton` 无 label 且无 aria-label 时 TypeScript 报错。

---

### 2. 集中动效令牌 + 全局 reduced-motion（P0 先做兜底，P1 迁移）

**tuffui 做法**

- `registry/motion-tokens/motion-tokens.ts:8-21` 定义一套共享值：
  - `EASE_OUT = [0.23, 1, 0.32, 1]`、`EASE_IN_OUT = [0.77, 0, 0.175, 1]`；
  - CSS 版本 `CSS_EASE_OUT` / `CSS_EASE_IN_OUT`；
  - `spring { duration: 0.3, bounce: 0 }`；
  - `enter { duration: 0.2 }`、`exit { duration: 0.14 }`（出场比入场快）；
  - `instant { duration: 0 }`（键盘操作 / reduced-motion）。
- `app/globals.css:99-105` 把同样的曲线暴露为站点级 CSS 变量与 `--animate-*`；`:209-217` 有全局 `prefers-reduced-motion` 兜底（`scroll-behavior: auto`，两个动画类降级为 fade）。
- 采用率：176 个 registry `.tsx` 中 69 个用 `MotionConfig`、41 个用 `useReducedMotion`、75 个导入 motion tokens。核心交互组件普遍使用，但不是全覆盖。

**pactor 现状**

- 65 个 `packages/ui/src` 文件出现 `transition`，只有 10 个出现 `motion-reduce` / `motion-safe`。
- 24 处原始 easing 工具类：16 个 `ease-out`、4 个 `ease-in-out`、3 个 `ease-linear`、1 个 `ease-in`；没有任何 `--ease-*` 令牌。
- `packages/ui/src/styles.css:312-341` 只有 accordion / toast 的 `--animate-*`，没有统一曲线。
- `packages/theme/src/skins/portal.css:115-118` 定义了 `--motion-fast/base/layout/slow`，但 14 套皮肤里只有 portal 有，且 `packages/ui` 从不使用。
- `packages/chat/src/styles.css:1837-1862` 已有一套**作用域内**的 reduced-motion 降级（过渡缩到 0.001ms、循环动画移除），可以直接作为 UI 包的模板。

**pactor 怎么落**

1. 在 `packages/ui/src/styles.css` 的 `@theme inline` 增加：
   ```css
   --ease-ui-out: cubic-bezier(0.23, 1, 0.32, 1);
   --ease-ui-in-out: cubic-bezier(0.77, 0, 0.175, 1);
   --duration-ui-fast: 150ms;
   --duration-ui-base: 200ms;
   --duration-ui-slow: 320ms;
   ```
   Tailwind v4 会把 `--ease-*` 生成为 `ease-ui-out` 工具类；时长用 `duration-[var(--duration-ui-base)]`（或继续沿用现有的 150/200/300ms，先统一曲线）。
2. 增加全局兜底（作用域建议 `:root`，不要只包 chat）：
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.001ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.001ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```
   对「必须保留的动效」（例如 Loading 的旋转）用 `[data-motion="essential"]` 显式豁免，并在文档里写明。
3. 迁移节奏：先改高频可见组件（Dialog / Popover / Select / Accordion / Tabs / Toast / Segmented），再按批次清理原始 `ease-*`；不要一次改 65 个文件。
4. 加一个「棘轮」测试：`packages/ui/tests/motion-contract.test.ts` 扫描 `src/**/*.tsx`，禁止新增白名单外的原始 `ease-[` / `ease-out`，并统计未处理 reduced-motion 的文件数，只允许下降。这比一次性全量替换可控。
5. 主题侧：把 `--motion-*` 从 portal 提到 `_base.css`（或直接废弃，统一用 UI 包的 `--duration-ui-*`），避免「只有一套皮肤有动效令牌」。

**成本**：1.5–2 人日（令牌 + 全局兜底 0.5、首批组件迁移 0.5–1、棘轮测试 0.5）。
**风险**：中低。全局 `!important` 可能影响依赖 `transitionend` 的逻辑；0.001ms 仍会触发 `transitionend`，但要在 Dialog / Toast 上回归一遍。
**验收**：系统开启「减弱动效」后，除显式豁免外无可见动画；源码中不再新增原始 easing；三套代表性组件视觉无回退。

---

### 3. 统一预览契约与装饰性预览的可访问性（P1）

**tuffui 做法**

- `DemoProps { variant?, autoplay?, thumbnail? }`（`components/docs/demo.tsx:6-10`）是唯一契约；`Demo({ slug, ...props })` 按 slug 取懒加载组件，把 props 原样透传（`:105`）。
- 同一份 demo 同时服务：
  - 组件预览：变体切换 + Replay，`key={`${variant}-${run}`}` 重挂载（`components/docs/component-preview.tsx:20-99`）；
  - 整屏预览：`ScreenHost` 从 URL 读 `?variant=`（`components/docs/screen-host.tsx:16-26`）；
  - 首页缩略图：`autoplay` / `thumbnail` 控制播放与精简布局（`components/site/component-thumbnail.tsx:77-78`）。
- 缩略图外层 `aria-hidden="true"` + `inert`，避免装饰性预览进入可访问树与 Tab 序列（`:58-59`）；`useInView` 懒挂载（`:28`）；只有鼠标悬停 / `:focus-visible` 才播放，`pointerType === "mouse"` 显式排除触摸（`components/site/component-card.tsx:18-21`）。
- 整屏路由 `noindex` + canonical 指回详情页（`app/screens/[slug]/page.tsx:22-26`）。

**pactor 现状**

- `ComponentPreview` 是 `Record<string, () => ReactElement>`（pactor-docs `src/components/previews/ComponentPreview.tsx:448-495`），没有 props 契约；174 个预览各自手写状态。
- Login / Hero 是专用整节岛（`ComponentPreviewDslSection.astro:31-40`），变体切换和 DSL / YAML 联动各写一套。
- 预览重置目前只能靠展开 / 收起弹层触发重挂载（文档站 #7）；没有统一的 replay。
- 没有目录页活体缩略图（文档站 #10）；未来若做，需要从一开始就处理 `aria-hidden` / `inert` 与触摸误触。
- 组件没有独立全屏预览路由；模板的独立预览路由也没有 `noindex` / canonical。

**pactor 怎么落**

1. 在 pactor-docs 定义一份最小契约：
   ```ts
   // src/components/previews/types.ts
   export interface PreviewProps {
     variant?: string;
     replayKey?: number;
     autoplay?: boolean;
     thumbnail?: boolean;
   }
   ```
2. 把注册表改为 `Record<string, ComponentType<PreviewProps>>`。现有的零参数组件**仍然可赋值**（少参数函数可赋给多参数函数类型），所以 174 个预览不用重写；只有需要变体的组件读取 `variant`。
3. 用一个 `PreviewFrame` 统一承载：变体 radiogroup、Replay（`key={`${variant}-${replayKey}`}`）、DSL / YAML 联动。先把 Login / Hero 迁进这个契约（它们已有状态机），再覆盖 10–20 个高频组件，不要求全量。
4. 若做目录缩略图：`useInView` 懒挂载 + 外层 `aria-hidden` + `inert`；只在 `pointerType === "mouse"` 的 hover 或 `:focus-visible` 播放；避免把 175 个预览岛全部塞进首屏。
5. 独立预览路由（模板 `templates/wireframe/preview/...`，以及未来组件全屏）统一加 `<meta name="robots" content="noindex, follow">` 与 canonical；canonical 指向对应详情页。

**与文档站 #7 的关系**：文档站 #7 已经提出「重置 + 变体切换通用化」。这里补的是**契约层**——把「变体 / 重播 / 缩略图 / 全屏」收敛成一个 props 形状，避免每加一种能力就再造一个专用岛。实施时先落 #7，再让 #7 走这个契约。

**成本**：2–3 人日（契约与框架 1、Login / Hero 迁移 0.5–1、首批组件 0.5–1）。
**风险**：低–中。`client:visible` 水合与 `key` 重挂载的交互要回归；缩略图不要进入可访问树。
**验收**：任意首批组件可切换变体、重播、展开全屏，且预览 / DSL / YAML 三处同步；缩略图不获取焦点、不被读屏朗读。

---

### 4. 高风险审批队列的交互模型（P1，先 POC）

**tuffui 做法**

`registry/tool-approval-queue/tool-approval-queue.tsx` 是一个完整的审批队列交互实现：

- **数据模型**：`ToolRisk = 'low' | 'medium' | 'high'`；`GrantScope = 'once' | 'session' | 'always'`；`ToolDecision = 'approved' | 'denied'`；payload 支持 shell / diff / email / json 四种（`:26-50`）。
- **受控 / 非受控**：`selected` + `onSelectedChange` 可受控；`defaultExpanded` 指定初始展开项（`:52-80`）。
- **乐观本地决议**：`local` 记录决议；`timers` 为每个请求设置 `undoMs`（默认 5000ms）后撤销「可撤销」标记；卸载时清理全部定时器（`:120-130`、`:160-197`）。
- **风险分组**：`grouped` 按 high → medium → low 分组；`flat` 保持到达顺序（`:199-204`）。
- **批量操作**：选中计数、Clear、Deny / Approve 全部；每行也有独立 approve / deny（`:242-280`）。
- **键盘**：行 `role="button"` + `tabIndex=0` + `aria-expanded` + `aria-keyshortcuts`；`ArrowUp/Down` 移动焦点、`Space` 选择、`Enter` 展开；键盘触发的展开跳过动画（`:206-218`、`:330-350`）。
- **授权范围**：每行展开后一个 `Segmented` 选 `Once / This session / Always`，按钮文案随范围变化（`:430-445`）。
- **可访问性**：外层 `MotionConfig reducedMotion="user"`；底部 `<p role="status" aria-live="polite" className="sr-only">` 播报决议（`:220`、`:476-478`）。
- **撤销**：已决区显示 Undo，撤销时清掉该请求的定时器并回队列（`:186-197`）。

**pactor 现状**

- `packages/chat/src/capability-action.ts` 已有正确的执行链：`CapabilityRegistry → Permission → Confirmation → Execute`（`:1-10`、`:80-112`）。高风险 capability 只有在注入 `confirm` 时才执行；未注入直接失败（`:101-112`）。
- 但 `ChatConfirm` 只是一个 `(request) => Promise<boolean>` 回调（`:37-50`），`ChatView` / `ChatWorkspace` 只把它透传（`packages/chat/src/view/ChatView.tsx:84/167/223`、`packages/chat/src/chat-workspace.tsx:54`）。**没有任何内置审批 UI。**
- `@pactor-app/permission` 只存权限码集合（`packages/permission/src/store.ts:12`），没有 `once/session/always` 的授权概念。
- 结果是：接入方要用 `risk: 'high'`，必须自己实现队列、范围、撤销、键盘与播报，或者退回原生 `confirm`。

**pactor 怎么落**

1. 在 `@pactor-app/chat` 增加 `ApprovalQueue`（UI 组件 + 适配器），**不改 `ChatConfirm` 的公开签名**：
   - 组件 props 对齐 tuffui 的交互能力：`requests / layout / onDecide(requests, decision, scope) / onUndo / undoMs / selected / onSelectedChange / defaultExpanded`；
   - `risk` 先支持 pactor 现有的 `low | high`，预留 `medium`；
   - payload 用 `renderPayload?(request)` 插槽 + 内置 `json` / `shell` / `diff` 渲染；不要把 tuffui 的四元 union 当成唯一公开形状；
   - 乐观本地决议 + 定时器清理 + `onDecide` 回写；服务端可通过 `status` 覆盖本地状态；
   - 键盘行导航、批量、撤销、`aria-live` 全部保留。
2. 适配器 `createApprovalConfirm({ queue, grants, persistGrant? })` 返回 `ChatConfirm`：
   - 收到高风险请求先查 `grants`；命中 `session` / `always` 直接放行；
   - 未命中则入队，等待用户决议；
   - 用户选择 `once` 只放行本次；`session` 写内存 grant；`always` 调 `persistGrant`（持久化由宿主决定）；
   - 拒绝时返回 `false`，沿用现有 `{ ok: true, skipped: true }` 语义。
3. 审计：决议时向 chat 事件流 / transcript 写入 `approval.requested` / `approval.decided`（含 actor、scope、时间），这是 pactor 相对 tuffui 的企业级增量；tuffui 只有本地 mock 状态，没有审计。
4. POC 范围：先只做 `risk: 'high'` + `once/session` + 单请求；批量、undo、always、diff 渲染放到二期。

**成本**：POC 2–3 人日；完整组件 + 适配器 + 测试 + 文档 5–8 人日。
**风险**：中。`always` 的持久化与撤回、并发多请求的顺序、session 的边界（刷新即失效）需要产品决策；建议一期只承诺 `once/session`。
**验收**：一个声明 `risk: 'high'` 的 capability 在 DSL 中触发队列；批准后执行、拒绝后 `skipped`；`session` 授权后第二次不再询问；纯键盘可完成审批；读屏能听到决议播报。

---

### 5. 设备框预览与整屏验收契约（P1）

**tuffui 做法**

- 三档设备：Desktop 1280×800、Tablet 768×960、Mobile 390×780（`components/docs/screen-preview.tsx:13-19`）。
- `DeviceFrame` 用 `ResizeObserver` 量容器宽度，`scale = Math.min(1, clientWidth / width)`，按比例缩放设备内容（`:138-152`）；Full screen 链接打开独立路由。
- 整屏路由 `ScreenHost` 从 `?variant=` 取变体，整屏 `h-dvh w-full overflow-hidden`（`components/docs/screen-host.tsx:16-26`）；metadata `noindex` + canonical 指回详情页（`app/screens/[slug]/page.tsx:22-26`）。
- `README.md:67-82` 把「整屏」的验收写成硬约束：
  - 根节点 `h-full w-full` 且是 `@container`；
  - 只用容器查询（`@md:`、`@4xl:`），不用视口断点；
  - 主内容**只允许一个纵向滚动**，消息 / 面板内禁止嵌套滚动；
  - composer 固定在底部，`ChatThread bare` + `bottomInset` 用实测高度；
  - 任何宽度都不能横向滚动：chips / tags 换行、长文本截断或换行、payload 换行；
  - 抽屉等覆盖层留在屏幕框内，不 portal 到页面；
  - 显式检查：没有 `overflow-x: auto | scroll` 且 `scrollWidth > clientWidth` 的元素；屏幕框外没有可见内容。

**pactor 现状**

- pactor-docs 模板详情页的每个「预览」块是固定高度 iframe：`frameHeight = b.preview.height ?? 560`（`src/components/TemplateFlowSection.astro:26-45`）。
- 样式用 `width:125%` 把内容视口放大到 >768px 触发桌面布局，再 `transform:scale(0.8)` 缩回，负 margin 抵消空白（`src/styles/asset-library.css:1559-1567`）。这是**为了在 560px 高的预览盒里看到桌面布局**的 hack，不是设备框。
- 没有设备切换；窄屏下 125% 宽度会溢出或裁切；移动端布局无法在预览里评估。
- 独立预览路由 `src/pages/templates/wireframe/preview/[...path].astro` 只有 `<title>`，没有 `noindex` / canonical（`:28-33`）。
- 模板预览的主题同步已经做好（localStorage + storage 事件，`:37-58`），设备框改造不能破坏它。

**pactor 怎么落**

1. 做一个 `DeviceFrame`（React 岛或 Astro + 原生脚本）：
   - 预设 `desktop 1280×800 / tablet 768×960 / mobile 390×780`；
   - `ResizeObserver` 计算 `scale = Math.min(1, containerWidth / width)`；
   - 外层尺寸 `width * scale` × `height * scale`；iframe 内部仍用 `width` × `height`，`transform: scale(scale)`、`transform-origin: 0 0`；
   - 替换 `width:125%; scale(.8)` 的 hack；移动端预设不再放大。
2. 详情页加设备切换（Segmented 或按钮组）+「全屏」链接；全屏路由读 `?device=` / `?variant=`，保持同一份预览。
3. 独立预览路由补 `noindex, follow` 与 canonical，避免 100+ 个预览页被搜索引擎单独收录。
4. 把 tuffui 的整屏验收条目改写成 pactor 的 `docs/references/screen-acceptance.md`（或 pactor-docs 的贡献文档），用于模板、starter、`apps-shell` 的整屏验收；先人工 checklist，不急着引入 Playwright。
5. 如果要自动化：pactor 目前没有 Playwright 依赖，建议先用一个一次性 CDP 脚本检查「无横向溢出 / 无嵌套滚动 / 屏幕框外无可见元素」，验证价值后再决定是否加浏览器测试框架。

**成本**：3–4 人日（设备框 1.5–2、全屏与 metadata 0.5、替换 hack 与回归 1、验收文档 0.5）。
**风险**：中。iframe 缩放后的指针坐标、Safari 的 `transform` + iframe 渲染、主题同步都要回归；桌面预设 1280 在窄容器里缩放后最小可能小于 0.5，需设下限或允许横向滚动容器。
**验收**：三档设备可切换；移动端预设真实触发模板的移动布局；页面无横向滚动；全屏预览不被索引；主题切换仍同步。

---

### 6. 组件交付清单与覆盖门禁（P2）

**tuffui 做法**

- `README.md:56-66`「Add a component」四步：
  1. 建 `registry/<slug>/{<slug>.tsx,demo.tsx,docs.ts}`，文件头两行许可证；
  2. 在 `lib/catalog.ts` 加条目；
  3. 共享原语从 `@/components/ui/<name>` 导入，动效从 `@/lib/motion-tokens` 导入；构建期自动推断依赖；
  4. 在 `components/docs/demo.tsx` 与 `lib/docs/index.ts` 注册 demo / docs。
- `README.md:67-82`「Add a screen」：catalog 条目、shim 导入、`@container`、单一纵向滚动、覆盖层在框内、无横向溢出。
- 构建期硬约束：
  - 许可证头缺失 → 构建失败（`scripts/build-registry.mts:103-111`）；
  - 依赖从 import 反推，不手写；
  - 主题 token 从 CSS 解析，不手抄。
- 反面教材：`lib/docs/index.ts` 88 行手写 import、`demo.tsx` 88 项手写表——交付步骤里仍然有「两处手写注册」，这是 tuffui 自己的漂移源。

**pactor 现状**

- `packages/ui/README.md` 130 行：安装、默认路径、覆盖点、样式、独立使用、聚合 re-export、文档、License；**没有「新增组件」清单**。
- 新增一个 UI 组件实际要动：
  1. `packages/ui/src/components/components/<Name>/index.tsx`；
  2. `packages/ui/src/components/index.ts` 导出组件与类型；
  3. `packages/ui/src/components/register.ts` 导入并加入 DSL 注册表；
  4. 测试（`packages/ui/tests/components/...`）；
  5. 若含文案，补 i18n；
  6. pactor-docs：组件目录数据、详情数据、预览注册表、`previewable.ts` 清单。
- 第 6 步完全靠人记；`scripts/validate.ts:139-245` 只校验 ID / 引用 / 外链，不校验预览覆盖、重复 key、详情引用。
- 现状其实是齐的：`previewable.ts` 174 个 id，`ComponentPreview` 侧 174 个唯一 key；但这是人工维护的结果。`component.accordion` / `component.carousel` 在 `basic-a` 与 `basic-b` 重复定义，靠 spread 顺序静默覆盖（`basic-a.tsx:879-880`、`basic-b.tsx:588-589`）。

**pactor 怎么落**

1. 写 `packages/ui/CONTRIBUTING.md`（或 README 新章节）「新增组件交付清单」，按上面的 6 步列 checkbox；明确哪些是自动的（导出、注册、样式、测试），哪些要人工补（docs 数据、详情、预览、previewable）。tuffui 的「3 文件」简洁性值得学，但 pactor 的交付面更大，清单要如实反映。
2. 在 pactor-docs 增加 `scripts/validate-previews.mjs`（零依赖，沿用 `validate.ts` 风格）：
   - 从 `previewable.ts` 读取 id 集合；
   - 正则扫描 `ComponentPreview.tsx` + `basic-*.tsx` / `chart-a.tsx` / `blocks-a.tsx` / `buttons-a.tsx` 的 `component.*` key，断言两边集合相等；
   - 扫描跨文件重复 key，重复即 error（若确实需要覆盖，显式 allowlist 并注释原因）；
   - 断言 `previewable` 的 id 都存在于 `components` 数据；
   - 断言 `componentDetailContents` 的 key 都存在于 `components` 数据（「未撰写详情」不报错，因为详情页有骨架；只拦「写了不存在的组件」）。
3. 把脚本接入 `pnpm validate`（pactor-docs 的 `build` 已经先跑 `pnpm validate`），先 warn 一周，再升 error。
4. 不要抄 tuffui 的 88 行手写 import / demo 表；pactor 已经是数据驱动，保持这个优势。

**成本**：1.5–2 人日（清单 0.5、校验脚本 1、修历史问题 0.5）。
**风险**：低。第一次跑可能暴露已有的重复 key 或未覆盖项，先 warn 再 error。
**验收**：故意从 `ComponentPreview` 删一个 key，`pnpm build` 在 validate 阶段失败并指名组件；新增组件时按清单走不会漏 docs / preview。

---

## 五、不建议借鉴

| 项 | 为什么不适用 |
|---|---|
| **shadcn CLI copy-in 分发** | pactor 是 npm 包 + 运行时 DSL；用户不复制组件源码。copy-in 会与 semver、预编译 `styles.css`、DSL 适配层冲突。可以借「一条命令 + 说清这一步做了什么」的表达，不借分发机制。 |
| **许可证头注入 + 捐赠链接** | pactor 走 npm 包，`LICENSE` 与 `package.json` 已覆盖；`ko-fi` 是 tuffui 的商业表达，不进 pactor。 |
| **Next 16 / React 19 / Tailwind v4 / Phosphor / motion 14 硬绑定** | pactor 刻意让消费方无需 Tailwind，ui 包基于 Base UI + shadcn 语义令牌；不要引入 tuffui 的技术栈前置。 |
| **8 分类 / 81 组件的 AI-UI 内容切分** | tuffui 面向「AI 产品 UI 片段」；pactor 是通用运行时 + 175 项资产库。照搬分类会破坏现有资产体系。 |
| **88 行手写 docs import / demo 表** | 这是 tuffui 的结构性漂移源，pactor 的数据驱动注册更优，不要反向退化。 |
| **0 测试 / 无 CI** | 不解释；pactor 已有 217 个测试文件，应继续加，而不是学 tuffui 的「只靠 typecheck」。 |
| **`ToolApprovalQueue` 的 mock 数据形状** | 借交互模型，不借 `shell \| diff \| email \| json` 四元 union 作为公开 API；pactor 的 payload 应可扩展、可由宿主渲染。 |
| **银灰渐变 / Phosphor 视觉风格** | pactor 是中性、可换肤的语义令牌体系；tuffui 的视觉是品牌化的，不适用。 |
| **`useMockRun` 脚本回放 / OG / sitemap** | 文档站 #11、#4 已评估，本文不重复。 |

---

## 六、建议路线

### 第 0 阶段：一周内（质量兜底，改动小）

1. `ActionButton` 二选一类型（第 1 项，0.5 人日）。
2. `packages/ui/src/styles.css` 全局 reduced-motion 兜底（第 2 项的前半，0.5 人日）。
3. `Segmented` 键盘 + roving tabindex + Form 组级语义（第 1 项，1.5–2 人日）。
4. pactor-docs 预览覆盖校验脚本（第 6 项，1–1.5 人日）。

**完成后可对外说**：图标按钮在类型层无法「无名」；Segmented 纯键盘可用；系统减弱动效真正生效；新增组件漏预览会在构建期失败。

### 第 1 阶段：两到三周（预览与动效系统化）

5. 统一 PreviewProps 契约 + `PreviewFrame`，迁移 Login / Hero + 首批 10–20 个组件（第 3 项，2–3 人日）。
6. 动效令牌与首批组件迁移 + 棘轮测试（第 2 项，1.5–2 人日）。
7. 模板设备框 + 全屏 metadata（第 5 项，3–4 人日）。
8. 组件交付清单（第 6 项，0.5 人日）。

**完成后可对外说**：组件预览可切变体 / 重播 / 全屏；模板可在桌面 / 平板 / 手机三档验收；动效有一致的曲线与降级；新增组件有清单可循。

### 第 2 阶段：三到六周（AI 审批能力）

9. 审批队列 POC：高风险 capability → 队列 → 批准 / 拒绝 → 执行（第 4 项，2–3 人日）。
10. POC 验证后产品化：批量、undo、`session` 授权、审计事件、文档与 demo（第 4 项，3–5 人日）。

**完成后可对外说**：`risk: 'high'` 不再是「抛错或原生 confirm」，而是内置的、可键盘操作、可播报、可审计的审批队列。

### 暂不做

- 设备框的浏览器自动化测试（先人工 checklist，避免为一个预览引入 Playwright）。
- 全量迁移 174 个预览到变体契约（只做有明确枚举变体的组件）。
- 审批队列的 `always` 持久化（需要产品决策与宿主存储契约）。

---

## 七、附：复核方式

### tuffui 证据

- 仓库：https://github.com/yurigdesigner/tuffui（commit `f31ea2b`）
- 目录与规模：`lib/catalog.ts`（88 条，81 组件 + 7 屏幕）、`registry/*`（90 个目录）、`package.json`（无 test script）
- 交互契约：
  - `registry/action-button/action-button.tsx:70-75`、`:107`
  - `registry/segmented-control/segmented-control.tsx:22`、`:52-63`、`:67-72`、`:86-88`、`:102`
  - `registry/tool-approval-queue/tool-approval-queue.tsx:26-50`、`:52-80`、`:120-130`、`:160-218`、`:242-280`、`:330-350`、`:430-478`
- 动效：`registry/motion-tokens/motion-tokens.ts:8-21`、`app/globals.css:99-105`、`:209-217`
- 预览：`components/docs/demo.tsx:6-10`、`components/docs/component-preview.tsx:20-99`、`components/docs/screen-preview.tsx:13-19`、`:138-152`、`components/docs/screen-host.tsx:16-26`、`app/screens/[slug]/page.tsx:22-26`
- 缩略图：`components/site/component-thumbnail.tsx:28`、`:58-59`、`:77-78`；`components/site/component-card.tsx:18-21`
- 交付与门禁：`README.md:56-82`、`scripts/build-registry.mts:103-111`

### pactor 侧证据

- `packages/ui/src/ui/action-button.tsx:15`、`:39-46`
- `packages/ui/src/components/components/Segmented/index.tsx:28`、`:117`、`:142-147`、`:170-178`
- `packages/ui/src/components/components/Form/form-item.tsx:57-74`
- `packages/ui/tests/components/essential-display.test.tsx:690+`
- `packages/ui/src/styles.css:312-341`
- `packages/theme/src/skins/portal.css:115-118`
- `packages/chat/src/styles.css:1837-1862`
- `packages/chat/src/capability-action.ts:19-20`、`:37-50`、`:101-112`
- `packages/chat/src/view/ChatView.tsx:84`、`:167`、`:223`
- `packages/chat/src/chat-workspace.tsx:54`
- `packages/permission/src/store.ts:12`
- pactor-docs `src/components/TemplateFlowSection.astro:26-45`
- pactor-docs `src/styles/asset-library.css:1559-1567`
- pactor-docs `src/pages/templates/wireframe/preview/[...path].astro:28-58`
- pactor-docs `src/components/previews/ComponentPreview.tsx:448-495`
- pactor-docs `src/components/ComponentPreviewDslSection.astro:31-40`
- pactor-docs `scripts/validate.ts:139-245`

### 复现数字

```bash
# tuffui：88 条 catalog；90 个 registry 目录；0 个测试
git clone --depth 1 https://github.com/yurigdesigner/tuffui.git /tmp/tuffui-eval
grep -c '^    slug: ' /tmp/tuffui-eval/lib/catalog.ts
ls -d /tmp/tuffui-eval/registry/*/ | wc -l
find /tmp/tuffui-eval -path '*/node_modules' -prune -o -type f \( -name '*.test.*' -o -name '*.spec.*' \) -print | wc -l

# pactor：217 个测试文件（ui 62 个）；65 个 transition 文件 / 10 个 reduced-motion 文件
cd /Users/Zhuanz/Documents/workspace/pactor
find packages -path '*/node_modules' -prune -o -type f \( -name '*.test.ts' -o -name '*.test.tsx' \) -print | wc -l
find packages/ui -path '*/node_modules' -prune -o -type f -name '*.test.*' -print | wc -l
grep -rl 'transition' packages/ui/src | wc -l
grep -rlE 'motion-reduce|motion-safe' packages/ui/src | wc -l

# pactor-docs：174 个 previewable id
cd /Users/Zhuanz/Documents/workspace/pactor-docs
grep -oE "'component\.[a-z0-9-]+'" src/components/previews/previewable.ts | tr -d "'" | sort -u | wc -l
```
