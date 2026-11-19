# tuffui 文档站借鉴评估

> 评估对象：https://tuffui.com/docs/installation（含组件页模板、registry 构建链路、机器可读输出）
> 对照对象：pactor-docs（`/Users/Zhuanz/Documents/workspace/pactor-docs`）
> 评估日期：2026-11-19
> 结论性质：只做评估，不改代码。落地成本按熟悉本仓库的 1 人估算，单位为「人日」。

---

## 一、TL;DR

tuffui 的文档站**内容体量远小于 pactor**（2 篇叙述型文档 + 88 个组件页，pactor 是 34 篇指南/参考/模块文档 + 175 个组件详情页），所以**信息架构不值得抄**。真正值得借鉴的是三件事：

1. **每条文档产出的路径都被工程化**：`catalog.ts` 一处数据同时驱动导航、目录页、组件页、上/下一页、sitemap、llms.txt、搜索索引；
2. **组件页是一个固定四段式模板**，且「安装命令 / 用法片段 / Props 表」都是**可以直接复制粘贴**的东西；
3. **面向 AI 与搜索引擎的产物是文档站的一等公民**：`llms.txt`、`llms-full.txt`、`/source/<slug>`、JSON-LD、sitemap。

对照下来，pactor-docs 在「单页 markdown 复制 / 在 AI 里提问 / DSL↔YAML 联动 / 资产库广度」上**已经领先 tuffui**，不必回头抄；缺口集中在**搜索、机器可读入口、安装块、组件页最小用法、文档与源码的漂移校验、站点 SEO 基础件**。

| # | 借鉴项 | tuffui 证据 | pactor 现状 | 价值 | 成本 | 优先级 | 结论 |
|---|---|---|---|---|---|---|---|
| 1 | ⌘K 全局搜索 | `components/site/command-palette.tsx` | 按钮已占位，标注「即将上线」 | 高 | 1.5–2 | P0 | 直接借鉴 |
| 2 | `llms.txt` / `llms-full.txt` | `app/llms.txt/route.ts`、`lib/llms.ts` | 无 | 高 | 0.5–1 | P0 | 直接借鉴 |
| 3 | 安装块（包管理器页签 + 复制） | `components/docs/install-block.tsx` | 50+ 处安装命令均为裸代码块（pnpm 为主） | 中 | 0.5–1 | P0 | 直接借鉴 |
| 4 | 站点 SEO 基础件（sitemap / robots / canonical / OG / JSON-LD） | `app/sitemap.ts`、`lib/seo.tsx`、`opengraph-image.tsx` | 仅 `description` meta | 中 | 1.5–2.5 | P1 | 选择性采纳 |
| 5 | 「复制为 Markdown / 在 AI 中提问」覆盖到文档页 | tuffui 无此能力（pactor 更先进） | 仅组件详情页有 | 中 | 0.5 | P1 | 补齐 |
| 6 | 组件页「最小用法」片段 | `registry/<slug>/docs.ts` 的 `usage` | DSL 示例是「全变体」大片段，无最小片段 | 高 | 2–3 | P1 | 采纳（新增字段） |
| 7 | 预览「重置/重播」+ 变体切换通用化 | `ComponentPreview` 的 Replay + variant 切换 | 仅 Login / Hero 有状态切换，无重置 | 中 | 1–2 | P1 | 采纳 |
| 8 | 文档 ↔ 源码漂移校验 | `build-registry.mts` 从 import 推依赖、从 CSS 解析 token | 175 条 `apiProps` 手抄维护，`validate.ts` 不校验 | 高 | 3–5 | P1 | 采纳校验 |
| 9 | 文档上/下一页 | `docs-page.tsx` 的 Pager | 无 | 低–中 | 0.5 | P2 | 采纳 |
| 10 | 组件卡片活体缩略图 | `component-thumbnail.tsx` | 纯文字卡片 | 中 | 2–3 | P2 | 选择性 |
| 11 | 脚本化 demo 运行（可回放场景） | `registry/use-mock-run/use-mock-run.ts` | 预览靠手写 state，无脚本回放 | 中 | 5–10 | P2 | 试验 |
| 12 | 单一数据源驱动全站 | `lib/catalog.ts` 一处驱动 6 个消费方 | 导航 / 资产数据 / 页面各自维护 | 中 | 5–10 | P2 | 试验 |

**不建议借鉴**：shadcn CLI 的 copy-in 分发模型、Tailwind v4 / React 19 的硬性前置、许可证头注入、88 组件级别的视觉路线、捐赠/付费产品位。理由见第五节。

---

## 二、tuffui 的文档模型（事实）

### 2.1 站点形态

- Next.js App Router 静态导出 + shadcn registry；
- 全站只有 **2 篇叙述型文档**：Introduction（实际指向 `/components`）与 Installation；其余 88 个页面全是组件页；
- 组件分 8 类（Foundations / Screens / Conversation / Tools & Approvals / Interactive Answers / Planning & Execution / Observability / Settings & Usage），每类在侧栏显示数量；
- 组件按「复制源码进项目」分发：`npx shadcn@latest add https://tuffui.com/r/<slug>.json`，源码落到 `components/ui/`，依赖与主题 token 由 registry 声明自动带入。

### 2.2 安装页的信息结构

一篇 `page.tsx` 写死六节，顺序本身就是叙事：

1. **Requirements** — React 19 / Tailwind v4 / TS，以及「shadcn CLI 能跑的地方就能用」；
2. **Initialize shadcn** — 一条命令，并注明「已有 `components.json` 可跳过」；
3. **Add a component** — 一条命令 + 一句「这一步做了什么」（拷源码、装依赖、带 token）；
4. **Theme tokens** — 说明默认随组件安装，也可单独装 `theme.json`；
5. **Manual setup** — 不用 CLI 的降级路径：装依赖、贴 `globals.css` 的 token、建 `cn` helper；
6. **Motion** — 动画用 motion + `MotionConfig reducedMotion="user"`，最后一行顺手引出 `use-mock-run`。

页脚固定挂 `llms.txt` / `llms-full.txt` / GitHub / MIT。

### 2.3 组件页模板

所有组件页完全同构（`app/(docs)/components/[slug]/page.tsx`）：

```
标题 + 一句话描述 + 徽章（N variants / MIT）
Preview     预览/Code 页签 + 变体切换（radiogroup）+ Replay 按钮
Installation  一行安装命令（pnpm/npm/yarn/bun 页签 + 复制）
Usage        5–15 行可直接粘贴的调用代码
Props        Prop | Type | Default | Description，required 用 * 标出
上一页 / 下一页
右侧 TOC
```

组件源码、demo、文档数据三者**同目录**：

```
registry/<slug>/
  <slug>.tsx   组件源码
  demo.tsx     预览用的脚本化示例
  docs.ts      { usage, props[], types? } —— 页面上的 Usage 与 Props 表直接来自这里
```

### 2.4 生成链路（真正值得学的地方）

- `scripts/build-registry.mts`：
  - 从每个组件的 `import` **反推** npm 依赖与 registry 依赖（`@/components/ui/x` → `/r/x.json`，裸包 → npm 依赖），人工不可能漏写；
  - 主题 token 从 `app/globals.css` **解析**出来写进 `registry.json`，站点与安装物永不漂移；
  - 构建期校验每个待分发文件顶部有许可证声明，否则构建失败。
- `lib/llms.ts` + `app/llms.txt/route.ts` + `app/llms-full.txt/route.ts`：用同一份 catalog + docs 数据渲染出「给模型看的站点」。
- `app/source/[slug]/route.ts`：按需返回组件源码（Code 页签懒加载，长源码不进首屏 HTML）。
- `lib/seo.tsx` 提供 `pageMetadata` + JSON-LD（`SoftwareSourceCode` + `BreadcrumbList`），`opengraph-image.tsx` 按路由生成 OG 图，`app/sitemap.ts` / `app/robots.ts` 自动产出。
- 搜索：`cmdk` 命令面板，索引来自 `catalog` 与 `docsPages`；**故意用子串匹配替代模糊匹配**（注释写明：模糊匹配会把所有长描述都命中）。

---

## 三、pactor-docs 现状基线（事实）

先明确已经有的，避免重复投入：

| 能力 | 现状 | 证据 |
|---|---|---|
| 文档规模 | 34 篇指南/参考/模块文档 + 175 个组件详情 | `docs/src/content/docs/**`、`src/assets-data/components/index.ts` |
| 组件详情页 | 预览与 DSL / YAML 三页签联动、何时用、变体、API 属性、使用规范、Design Token 映射 | `src/pages/components/[category]/[slug].astro` |
| 运行态预览 | 174 / 175 个组件可预览（注册在 `previews/basic-a…e.tsx` 等） | `src/components/previews/previewable.ts` |
| 复制此页 | 复制整页 markdown / 查看 markdown / 复制链接 / 在 ChatGPT、Claude、Cursor、v0 中提问 | `src/components/CopyPageSplitButton.tsx` |
| 单页 markdown 路由 | `/markdown/<slug>.md`（仅组件） | `src/pages/markdown/[id].md.ts` |
| 右侧看板 | 页面目录、元信息、对象检查模式 | `src/layouts/AssetLibraryLayout.astro`、`src/components/Inspector.tsx` |
| 深浅色 | 顶栏切换 + `data-theme` | `src/components/TopNav.astro` |
| 构建版本 | 顶栏与页脚展示版本 / commit / 同步时间 | `src/generated/build-info.json` |
| 数据校验 | `validate.ts` 校验 ID 规范、引用完整性、外链可用性 | `scripts/validate.ts`（268 行） |

明确缺的：

| 缺口 | 证据 |
|---|---|
| 全局搜索 | `TopNav.astro:65` 按钮 `title="全局搜索即将上线"`，点击无行为 |
| llms.txt / llms-full.txt | 全仓 grep 无命中 |
| sitemap.xml / robots.txt / OG 卡片 / canonical / JSON-LD | `public/` 只有 `_redirects`、图标、`maps/`；布局只输出 `<meta name="description">` |
| 组件级最小用法 | 详情页「DSL 结构」是驱动预览的「全变体」大对象，不能当最小示例抄 |
| 文档页的复制/问询 | `CopyPageSplitButton` 只在组件详情页挂载 |
| 文档上/下一页 | 模板中无 prev/next |
| 预览重置 | 交互预览改状态后只能靠整页刷新或展开弹层（重挂载）复位 |
| 变体/状态切换 | 只有 Login、HeroSection 两个组件做了专用联动岛 |
| API 表与源码一致性 | `component-details.ts` 注释写明「提炼自 / 核对自 packages/ui」，属人工维护；`validate.ts` 不校验 prop 名与类型 |
| 安装命令呈现 | 文档中 50+ 处安装命令（pnpm 52 次 / npm 16 次），均为裸代码块，无复制按钮、无多包管理器切换 |

---

## 四、逐项评估

### 1. ⌘K 全局搜索（P0）

**tuffui 做法**：`cmdk` 面板，两组结果——Docs（2 条）与按分类分组的组件；每条带图标、分类标题、选中箭头；过滤用子串而非模糊（`filter` 函数显式实现并注释原因）。

**为什么值得**：pactor 的资产库有 175 个组件、34 篇文档、若干模板/主题/素材，左侧导航只能「按分类找」，不能「按名字找」。搜索按钮已经占了位置却不可用，是明显的体验负资产。

**pactor 怎么落**：
- 构建期生成一份 `search-index.json`：`{ type, id, title, description, href, category, headings? }`，来源直接取 `assets-data/components`、`components/details`、`getCollection('docs')` 的标题与二三级 heading、主题/模板/素材索引；
- 前端用 `cmdk` 或自研岛（项目已有 `@pactor-app/ui/ui` 的 Dialog + Input）渲染，⌘K / Ctrl+K 唤起，分组顺序：文档 → 组件 → 模板 → 主题 → 素材；
- 过滤先做子串匹配，命中标题权重高于描述；暂不做拼音/模糊。

**成本**：1.5–2 人日（索引生成 0.5、面板 1、快捷键与空态 0.5）。
**风险**：低。唯一注意点是索引体积（约 200+ 条，压缩前 < 100KB）。
**验收**：⌘K 可搜「表格」「Button」「权限」，结果可直接跳详情页；空查询显示最近更新。

---

### 2. llms.txt / llms-full.txt（P0）

**tuffui 做法**：`llms.txt` 是站点级目录（Docs 两条 + 每个组件一行：名称、URL、一句话、安装命令）；`llms-full.txt` 把每个组件的 Props 表 + Usage 代码块 + Types 全量拼成约 210KB 的纯文本。两者都在构建期从同一份数据渲染。

**为什么值得**：pactor 自我定位是 AI-native 运行时，文档站却没有「给模型吃」的入口，只有逐页 `/markdown/<slug>.md`。模型需要先能拿到全站地图，再逐页取细节——这正是 llms.txt 协议解决的问题。

**pactor 怎么落**：
- `/llms.txt`：站点简介 + 分区目录（指南 / 参考 / 模块 / 组件 / 模板 / 主题 / 素材），每条一行链接 + 摘要；
- `/llms-full.txt`：复用现有 `buildComponentMarkdown()`（`src/lib/component-markdown.ts`）逐组件拼接，再拼 34 篇文档正文（Astro `getCollection` + `render` 或直接读源 md）；给出体积预算（< 500KB），超出就分片为 `llms-full-<group>.txt`；
- 页脚固定挂两个链接（tuffui 就是这么做的），并写进 `robots.txt`。

**成本**：0.5–1 人日。**风险**：低；注意内容里不要带构建时间等每次都变的字段，否则缓存失效。
**验收**：`/llms.txt` 能被 `curl` 直接取到；`llms-full.txt` 覆盖全部 175 个组件 + 34 篇文档；单文件 < 500KB。

---

### 3. 安装块组件（P0）

**tuffui 做法**：`InstallBlock` 一个组件承载 4 个页签（pnpm / npm / yarn / bun），命令拆分「命令前缀（灰）+ registry URL」，右侧复制按钮复制完整命令；组件页与安装页复用同一个组件。

**为什么值得**：pactor 文档里的安装命令全是裸 fence，读者要手动选中复制；`pnpm` 之外的包管理器读者需要自己翻译。

**pactor 怎么落**：
- 做一个 `InstallBlock`（React 或 Astro 组件），接收 `{ package | command }`，渲染页签 + 复制；
- 因为文档是 `.md` 而非 `.mdx`，两条路：① 写 remark/rehype 插件，把带 meta 的 fence（如 ` ```bash install="pactor-app" `）转成组件节点；② 只把安装类页面迁成 `.mdx` 并在其中直接用组件。推荐 ①，一次性收益覆盖全部 55 处；
- 同时给所有代码块补复制按钮——`CopyButton.tsx` 已存在，确认是否已普遍接入。

**成本**：0.5–1 人日（插件写法 0.5，样式与回归 0.5）。
**风险**：低。注意与现有 markdown 处理器（`unified` + `remarkDocsLinks`）共存，插件顺序要放在链接改写之后。
**验收**：任意文档页的安装命令有 4 个页签、可一键复制；SSR 输出不含重复命令文本。

---

### 4. 站点 SEO 基础件（P1，选择性）

**tuffui 做法**：`app/sitemap.ts` 自动生成 sitemap；`robots.ts` 输出规则；`lib/seo.tsx` 统一 title/description/canonical/OG/Twitter；每个路由有 `opengraph-image.tsx`（含组件页），并用 JSON-LD 声明 `SoftwareSourceCode` + `BreadcrumbList`。

**为什么值得**：pactor-docs 是公开站（`tuffui` 也是），但目前只有 `description` meta：没有 sitemap、没有 robots、没有 canonical、没有 OG 卡片，分享链接在社交/IM 里是白板。对一个要被搜索与 AI 引用的资产库，这是基础件。

**pactor 怎么落**：
- `@astrojs/sitemap` 集成 + `public/robots.txt`（指向 sitemap 与 llms.txt）；
- 布局里补 `canonical`、`og:*`、`twitter:card`；
- OG 图先用一套静态模板按分类生成（组件/模板/主题各一张 + 默认图），暂不做逐页动态生成；
- JSON-LD：组件页 `SoftwareSourceCode`，文档页 `TechArticle`，全站 `BreadcrumbList`。

**成本**：1.5–2.5 人日。**风险**：低；OG 若做逐页动态渲染需要额外字体与运行环境，建议先静态。
**验收**：`/sitemap-index.xml` 可达且覆盖全部路由；分享链接有卡片；`view-source` 可见 canonical 与 JSON-LD。

---

### 5. 复制/问询能力覆盖到文档页（P1）

**tuffui 无此能力**，这是 pactor 的存量优势：`CopyPageSplitButton` 支持复制 markdown、查看 markdown、在 ChatGPT/Claude/Cursor/v0 中提问。但它**只挂在组件详情页**（`[slug].astro:167`），34 篇文档页没有。

**为什么值得**：文档页才是「读者最想丢给 AI 让它照着做」的内容（接入步骤、DSL 参考）。能力已存在，差的只是接线。

**pactor 怎么落**：把按钮挂进 `docs/[...slug].astro` 的 breadcrumb-extra；`/markdown/` 路由扩一个 docs 分支，直接返回 md 源文件（可复用 `resolveDocsLink` 处理站内链接前缀）。

**成本**：0.5 人日。**风险**：无。
**验收**：任意文档页可复制为 markdown，且「在 Claude 中提问」带正确页面 URL。

---

### 6. 组件页「最小用法」片段（P1）

**tuffui 做法**：`docs.ts` 的 `usage` 是 5–15 行、带真实回调名的可粘贴代码，页面上单独成节，与 Props 表并列。

**pactor 现状**：`ComponentDetailContent.dsl` 是**驱动预览的完整示例**（如 Button 页包含 8 种变体的嵌套树，约 100 行），被同时当作「DSL 结构」展示。读者想抄的是「一个 Button 怎么写」，拿到的是整页布局。

**建议**：给 `ComponentDetailContent` 增加 `usage?: DslNode`（或 `usageSnippet: string`）字段，详情页在「API 属性」前插入「最小用法」一节，默认只展示一个节点 + 必要 props；`dsl` 继续服务于预览。可先给 Top 30 高頻组件补齐，其余按批次。

**成本**：2–3 人日（含 30 个组件的示例撰写与校对）。**风险**：低；注意不要与 `dsl` 字段语义混淆，命名要能自解释。
**验收**：Button / Input / Table / Form / Dialog 等高频页有 ≤ 10 行的可运行片段，且 YAML 页签同步。

---

### 7. 预览重置/重播 + 变体切换通用化（P1）

**tuffui 做法**：`ComponentPreview` 顶部固定三个控件——preview/code 页签、变体 radiogroup（选中态用 `layoutId` 滑动）、Replay 按钮（`setRun(n+1)` 重挂载 demo）。切换变体同时重置脚本。

**pactor 现状**：174 个可预览组件，但**只有 Login / HeroSection** 做了状态/变体切换的联动岛；其余预览改动状态后没有复位入口（仅展开/收起预览弹层时因重挂载而复位）。

**建议**：
- 在 `PreviewDslTabs` 的页签栏右侧加「重置」按钮，通过 `key` 自增重挂载预览岛；
- 将 Login/Hero 的专用岛抽象成通用能力：`previewable` 注册表增加 `variants?: { name, props }[]`，切换时把变体 props 注入预览并联动 DSL/YAML；
- 先覆盖「有明确枚举变体」的组件（Button、Alert、Tag、Segmented、Progress 等 20 个左右），不是全量重写。

**成本**：1–2 人日（重置）+ 2–3 人日（变体注册表与首批组件）。**风险**：中——预览岛是 `client:visible` 水合的，注意 `key` 变化时的 slot 内容与嵌套岛水合行为。
**验收**：任意交互预览可一键复位；Button 页切换 primary/dashed/link 时预览、DSL、YAML 三处同步。

---

### 8. 文档 ↔ 源码漂移校验（P1，工程价值最高）

**tuffui 做法**：文档里的 Props 就写在组件目录下；依赖不手写而是从 `import` 反推；主题 token 从 CSS 解析。**结构上消灭了「文档写错」的可能**。

**pactor 现状**：175 条 `apiProps` 是人工从 `packages/ui` 适配器「提炼并核对」的（`component-details.ts` 顶部注释详细记录了每一批的来源与核对方式）。这意味着每次 `packages/ui` 改 props，文档都要靠人记得同步。`validate.ts` 目前只校验 ID 格式、引用完整性、外链可用性，**不校验 prop**。

**建议（分两步）**：
1. **先做校验，不做生成**：`@pactor-app/ui/components` 已导出 props 契约类型。写一个脚本用 `ts-morph` 或 TypeScript Compiler API 读取各组件的 `*Props` 接口，与 `apiProps` 的 `name` 集合比对；在 `scripts/validate.ts` 里升级为 error，构建阻断。允许白名单（如适配器把 DSL props 映射到内部组件 props 的场景）。
2. **后做生成**：类型 → `apiProps` 草稿（name/type/required），人工补 `description` 与 `defaultValue`；生成物与现有数据做 diff，人工确认后落盘。

**成本**：校验 3–5 人日；自动生成再加 3–5 人日。**风险**：中——DSL 适配层的 props 与底层组件 props 不是一一对应，第一版只校验「文档里写了但类型里没有」的单向包含关系，避免误报。
**验收**：人为从 `packages/ui` 删一个 prop，`pnpm build` 在 `validate` 阶段失败并指名组件。

---

### 9. 文档上/下一页（P2）

**tuffui 做法**：`DocsPage` 底部双栏 Pager，顺序取侧栏扁平列表（`orderedEntries` + `getNeighbors`）。

**pactor 现状**：没有。`docs-nav.ts` 已有 `DOCS_NAV_GROUPS.order`，顺序数据是现成的。

**建议**：在 `docs/[...slug].astro` 用 `DOCS_NAV_GROUPS` 的扁平顺序算出 prev/next，渲染在正文末尾；组件详情页同理可用同分类顺序。

**成本**：0.5 人日。**风险**：无。**验收**：文档页底部可在 34 篇之间连续翻页，顺序与侧栏一致。

---

### 10. 组件卡片活体缩略图（P2，选择性）

**tuffui 做法**：目录页的卡片里直接渲染**真实组件**的 demo，等比缩放（`ResizeObserver` 计算 fit scale），`useInView` 懒挂载，悬停/聚焦时播放脚本化 demo；Screens 类用 1280×800 的设备框。

**pactor 现状**：目录卡片是纯文字（名称 + 描述 + 状态徽章），`CollectionPage.astro` 无缩略图。

**评估**：视觉收益明显，但 pactor 的资产库是「规范文档」风格（带检查模式、元信息、构建版本），卡片缩略图会改变整体气质；且 175 个预览岛全量上目录页会显著增加构建产物与首屏成本。**建议只对「常用组件」或分类页头部做 8–12 个缩略图**，并严格 `client:visible`。

**成本**：2–3 人日。**风险**：中（性能、视觉一致性）。**验收**：分类页头部有可交互缩略图，Lighthouse 首屏无明显回退。

---

### 11. 脚本化 demo 运行（P2，试验）

**tuffui 做法**：`useMockRun(initial, steps)` 按时间轴依次 `apply` 状态，配 `streamText()` 把文本切成词级 token 模拟流式输出；`Replay` 重新播放。所有复杂组件（审批队列、流式消息、工具调用）的预览都由脚本驱动，不依赖真实后端。

**为什么可能对 pactor 有价值**：pactor 的预览目前是手写 state 交互；而 pactor 本身就有 DSL `dataSources` + `events` 的动作编排模型。如果做成「**场景脚本**」（`[{ delay, action }]`），可以同时服务三处：预览演示、文档动图、e2e 测试。这与 pactor「DSL 即测试夹具」的定位是契合的。

**建议**：先做一个 POC——选 3 个组件（Message / Notification / ChatMessage），用 DSL 的 `events` + mock 数据源写成可回放脚本，验证「同一份脚本能驱动预览与测试」。跑通再决定是否产品化。

**成本**：POC 3–5 人日；产品化 5–10 人日。**风险**：中高——容易变成第二套 DSL；必须在现有事件模型内实现，不新造一套。
**验收**：同一份场景脚本既能在文档页回放，也能在 vitest 里断言最终状态。

---

### 12. 单一数据源驱动全站（P2，试验）

**tuffui 做法**：`lib/catalog.ts` 一个数组驱动——侧栏、目录页、组件页静态参数、上/下一页、搜索、llms.txt、sitemap；`docs.ts` 与组件同目录。

**pactor 现状**：导航顺序在 `src/lib/docs-nav.ts`，资产在 `src/assets-data/`（components / details / themes / templates / materials 多个目录），页面路由各自 `getStaticPaths`，markdown 端点单独遍历。新增一个组件需要改：组件数据、详情数据、预览注册表、previewable 清单、（若有）导航。**这是一致的漂移源**。

**建议**：不要求一次重构。先引入一个**只读的聚合 `catalog.json`**（构建期脚本从现有数据汇总），让搜索索引、llms、sitemap 三个新功能都消费它；验证收益后，再考虑让导航与路由也消费同一份数据。这是「先加读取方，再改写入方」的低风险路径。

**成本**：1.5 人日（聚合）+ 后续重构 5–10 人日。**风险**：中——多源合并时字段命名不统一（`id` / `slug` / `name` / `title`），需要一层归一化。
**验收**：新功能（搜索/llms/sitemap）都只读聚合文件；新增组件时不再需要改三处以上。

---

## 五、不建议借鉴

| 项 | 为什么不适用 |
|---|---|
| **shadcn CLI copy-in 分发模型** | pactor 是「npm 包 + 运行时渲染 DSL」，用户不复制组件源码进项目；组件是包内适配器，宿主通过 `createPactorApplication` 装配。强行做 registry 会与版本发布、预编译 `styles.css`、DSL 适配层冲突。**可以借的是「一条命令 + 说清这一步做了什么」的表达方式，不是分发机制本身。** |
| **Tailwind v4 / React 19 前置** | tuffui 依赖用户工程具备 Tailwind v4；pactor 刻意做到「消费方无需 Tailwind」（构建期预编译单文件样式）。不要把这个前置条件抄进安装页。 |
| **许可证头注入构建校验** | tuffui 分发的是单文件源码，需要版权头随代码走；pactor 走 npm 包，`LICENSE` 与 `package.json` 已覆盖。 |
| **88 组件 / 8 分类的内容切分** | tuffui 面向「AI 产品 UI 片段」；pactor 是通用运行时 + 资产库（175 组件 / 主题 / 模板 / 素材）。照搬分类会破坏现有资产体系。 |
| **捐赠 / 付费产品位（Promo）** | 商业定位不同；pactor 文档页右侧看板已被「页面目录 + 元信息」占满。 |
| **组件页 Code 页签按需拉源码** | pactor 的对应物是 DSL/YAML 结构，已在构建期内联，无需单独接口。 |

---

## 六、建议路线

### 第一阶段：一周内可完成（只做加法，不动存量）

1. ⌘K 搜索（#1）
2. `/llms.txt` + `/llms-full.txt`（#2）
3. `InstallBlock` 与代码块复制（#3）
4. 文档页复制/问询（#5）
5. 文档上/下一页（#9）

**完成后可对外说**：文档站可搜索、可被 AI 整站抓取、每条命令可一键复制、任意页面可丢给 AI。

### 第二阶段：两到三周（补齐组件页与站点基础件）

6. 组件页「最小用法」首批 30 个（#6）
7. 预览重置 + 变体切换首批 20 个（#7）
8. SEO 基础件（#4）
9. props 漂移校验（#8）

**完成后可对外说**：组件页达到「看一眼—抄一段—跑起来」的闭环；`packages/ui` 改 props 时文档不会悄悄过期。

### 第三阶段：评估后再定（需要先看收益）

10. 活体缩略图（#10）
11. 脚本化场景 POC（#11）
12. 聚合 catalog（#12）

---

## 七、附：复核方式

### tuffui 证据

- 安装页：https://tuffui.com/docs/installation
- 机器可读：https://tuffui.com/llms.txt、https://tuffui.com/llms-full.txt
- registry 条目示例：https://tuffui.com/r/action-button.json
- 源码：`github.com/yurigdesigner/tuffui`
  - `lib/catalog.ts`、`lib/docs/types.ts`、`registry/<slug>/docs.ts`
  - `scripts/build-registry.mts`、`lib/llms.ts`、`app/sitemap.ts`、`lib/seo.tsx`
  - `components/docs/install-block.tsx`、`components/docs/component-preview.tsx`
  - `components/site/command-palette.tsx`、`components/site/component-thumbnail.tsx`
  - `registry/use-mock-run/use-mock-run.ts`

### pactor 侧证据（本仓库外的 pactor-docs）

- 搜索占位：`pactor-docs/src/components/TopNav.astro:65`
- 导航顺序：`pactor-docs/src/lib/docs-nav.ts`
- 组件详情模板：`pactor-docs/src/pages/components/[category]/[slug].astro`
- 详情数据（人工核对）：`pactor-docs/src/assets-data/details/component-details.ts`
- 校验脚本：`pactor-docs/scripts/validate.ts`
- 复制此页：`pactor-docs/src/components/CopyPageSplitButton.tsx`
- markdown 端点：`pactor-docs/src/pages/markdown/[id].md.ts`
- 预览注册：`pactor-docs/src/components/previews/previewable.ts`、`previews/*.tsx`
- 页签岛：`pactor-docs/src/components/PreviewDslTabs.tsx`

### 复现本文中的数字

```bash
# 175 个组件 / 175 条详情 / 174 个可预览
cd pactor-docs
node --experimental-strip-types -e "import('./src/assets-data/components/index.ts').then(m=>console.log(m.components.length))"
node --experimental-strip-types -e "import('./src/components/previews/previewable.ts').then(m=>console.log(m.PREVIEWABLE_IDS.length))"
find docs/src/content/docs -name '*.md' -o -name '*.mdx' | grep -vE '/(components|style)/' | wc -l   # 34
```
