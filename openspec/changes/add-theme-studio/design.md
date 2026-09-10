## Context

皮肤令牌契约（openspec/specs/theme-skin-css）已定：语义令牌（`--background`/`--primary`/`--accent`…）、组件级令牌（`--switch-track`/`--menu-hover-background`…，默认 `var()` 回退语义令牌）、`--background-image`/`--font-sans`/阴影/遮罩令牌；皮肤 = 在 `pactor-ui/styles.css` 之后加载的 CSS 覆盖块。工作室是这个契约的可视化编辑器。

约束：工具不进发布物（不发 npm）；复用 workspace 依赖；预览必须真实反映"宿主加载皮肤 CSS"的最终效果，不能有工作室特供路径。

## Goals / Non-Goals

**Goals:**

- 左栏：预置主题列表 + 分组令牌编辑器（颜色取色器 / 文本输入）。
- 右栏：iframe 内嵌 `/gallery` 组件画廊，展示 ui 包全部组件，主题与令牌修改实时生效。
- 预置主题含中国传统色系列（数据来自 china_colors.md，384 色按节气分组；选代表色系生成 5+ 套主题）。
- 导出合成后的皮肤 CSS 下载。
- 工作室自身就是一个 pactor 应用：`createPactorApplication` + DSL 页面（`*.page.yaml`）开发，工作室 UI 即 `@pactor-app/ui` 组件（吃自己的狗粮，顺带验证令牌体系与 DSL 表达力）。

**Non-Goals:**

- 不做暗色整套编辑器（皮肤可手动在导出文件中补暗色块；工作室只编辑亮色令牌）。
- 不做配色 AI 推荐、对比度自动校验等智能功能。
- 不发布为 npm 包、不做服务端/持久化（刷新即重置）。
- 画廊不做交互式 playground（不改组件 props，只展示皮肤效果）。

## Decisions

### 1. 位置与形态：`tools/theme-studio`，pactor 应用（DSL 结构），入 workspace

`pnpm-workspace.yaml` 增加 `tools/*`。工作室是与 examples/admin 同构的 pactor 应用：`createPactorApplication` + `StaticDslLoader` + `src/pages/*.page.yaml` DSL 页面，独立 dev server（端口 5710）。不发 npm（`private: true`）。

页面构成（两个 DSL 页面）：
- `studio.page.yaml`（`/` 路由，blank 布局）：左栏自定义组件 + 右侧自定义预览组件；
- `gallery.page.yaml`（`/gallery` 路由，blank 布局）：纯内置组件陈列，不写自定义代码。

交互性强、DSL 表达不了的部分（主题列表、令牌编辑器、iframe 预览、下载）实现为 **React 自定义组件**，经 `componentRegistry` 注册后在 DSL 中引用——与 examples/admin 注册 `SkinSettings` 同一模式。自定义组件共享状态用一个模块级 store（选中主题 + 用户 overrides + 合成 CSS），避免经 DSL props 穿透。

### 2. 预览用 iframe + postMessage，皮肤经注入 `<style>` 生效

iframe src = 同源 `/gallery`。左右通信：`postMessage({ type: 'skin', css })`，gallery 页监听后 upsert 一个 `<style data-theme-studio>` 节点。理由：iframe 提供天然样式隔离与"宿主页面"语义——皮肤 CSS 在 gallery 里就是经级联覆盖 `pactor-ui/styles.css`，与真实宿主加载方式完全一致（契约：后加载者胜出）。替代方案（同页预览）会让工作室自身样式与预览样式互相污染，否决。

合成 CSS 的单一来源在左栏：`base theme tokens ∪ user overrides` → 生成 `:root { … }` 文本 → postMessage 给 iframe；下载就是同一份文本。任何时候预览与导出严格一致。

### 3. 预置主题是"令牌子集覆盖"，不是完整令牌表

每套主题只定义它改的语义令牌（primary/accent/ring/chart/sidebar 等约 10-15 个），组件级令牌靠默认 `var()` 回退自动跟随——这正好验证令牌契约的回退设计。中国传统色系列按代表色生成：

| 主题 | 主色 | 辅色 |
| --- | --- | --- |
| 珊瑚赫（立春） | `#c12c1f` | 海天霞 `#f3a694` |
| 青冥（春分） | `#3271ae` | 青雘 `#007175` |
| 碧山（雨水） | `#779649` | 歐碧 `#c0d695` |
| 梔子（驚蟄） | `#fac03d` | 柘黃 `#c67915` |
| 齊紫（清明） | `#6c216d` | 紫蒲 `#a6559d` |

十六进制直接使用（浏览器原生支持），前景配对令牌按明暗给白/深色。另含 1-2 套非中国色主题（如石墨灰、莫兰迪）作对照。

### 4. 令牌编辑器数据驱动：令牌清单是一份 TS 元数据

`tokens.ts` 声明分组（背景/文字/主色/形状/阴影/菜单/表单组件/日历/气泡…）、每令牌的名字、类型（color | length | font | image）、当前生效默认值说明。编辑器据此渲染：color 型给 `<input type="color">` + hex 文本框；其余给文本输入。与 specs 的"令牌清单"人工对齐（清单变更需同步此文件——风险见下）。

### 5. 画廊页是纯 DSL 页面，按组件分组静态陈列

`/gallery` 一页长滚动（`gallery.page.yaml`，blank 布局），分组：基础（Button/Badge/Icon/Typography）、表单（Input/Select/Switch/Slider/Radio/Checkbox/Combobox/Calendar…）、反馈（Alert/Toast 触发/Progress/Skeleton）、导航（Menu/Tabs/Pagination/Breadcrumb）、浮层（Dialog/Popover/DropdownMenu 触发态）、数据（Table/Chart/Card/Statistic）、chat 系（Bubble/Message/Attachment/ChatInput）。全部用 DSL 引用内置组件静态陈列，不注册自定义组件——gallery 同时充当 DSL 表达力的回归面。Chat 系组件经 chat 包的 `registerChatComponent`/`createChatComponentRegistry` 进入注册表后同样可在 DSL 引用。

### 6. 下载：Blob + a[download]

`URL.createObjectURL(new Blob([css], { type: 'text/css' }))` + 临时 `<a download="pactor-theme.css">` 点击，无依赖。

## Risks / Trade-offs

- [令牌元数据与 styles.css 实际令牌可能漂移] → 加一个 vitest：解析 `packages/ui/src/styles.css` 的 `:root` 自定义属性集合，与 `tokens.ts` 清单比对，缺/多即失败。
- [iframe postMessage 时序（gallery 未加载完就收不到消息）] → gallery 挂载后主动 `postMessage({ type: 'ready' })`，左栏收到 ready 才发首次 skin；此后每次编辑即时发送。
- [中国色 hex 直接作 oklch 体系的令牌值，色域/观感可能与默认主题不一致] → 可接受，浏览器原生支持 hex；对比度靠前景配对手工给值。
- [组件画廊维护成本（新组件要补陈列）] → 陈列按"覆盖全部令牌类型"的最小完备集组织，不强求每个组件每个变体。
- [jsdom 测不了 iframe 真实级联] → 单测覆盖 CSS 合成逻辑与令牌元数据一致性；端到端靠人工验收（dev server 起两个路由）。

## Migration Plan

纯新增目录，零迁移。验收：`pnpm --filter theme-studio dev` 起服 → 选主题/改令牌/下载三步走通；下载的 CSS 挂到 examples/chat 验证生效。

## Open Questions

- 导出是否附带暗色块模板（注释掉的 `[data-pactor-theme='dark']` 骨架）？倾向附带注释骨架，成本低、引导好——实现期确认。
