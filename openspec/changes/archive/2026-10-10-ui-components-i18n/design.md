# Design: UI 组件库基础组件文案国际化补齐

## Context

`packages/runtime/src/context/i18n-context.ts` 的 `defaultMessages` 已内置 ~40 个 `pactor.*` key（layout/table/form/select/input/numberInput/alertDialog/command/overlay/datePicker/login/cardList）。已接入 `useI18n` 的组件有 5 个残留硬编码；`components/components/` 下 18 个基础组件完全未接入。扫描方法：去注释后检索 CJK 字符行，再人工剔除 dev-facing console 消息与注释残留。

应用侧还有两处相关缺口：`SitemapApp` 的 5 处状态文案硬编码，且未把 `PactorPageOptions` 已有的 `locale`/`defaultLocale`/`messages` 透传给两个 PactorPage（页面表达式与内置组件落回 zh-CN）；`embedded.tsx` 嵌入页错误态「页面加载失败/重试」同样硬编码。注意 `PactorPage` 直接使用形态首次渲染时组装一次（`embedded.tsx:156-159` factoryRef），locale 变化不会重建——语言切换必须走工厂重建路径。

## Goals / Non-Goals

**Goals:**

- 18 个基础组件 + 5 个残留组件全部接入 `useI18n`，默认文案经 `t(key)` 渲染。
- SitemapApp 与 embedded 错误态文案接入 i18n；SitemapApp 支持宿主经 props 配置与切换语言。
- 新增 key 全部进 `defaultMessages`（zh-CN + en-US 双份），业务可经 messages 覆盖。
- 默认中文文案与现状完全一致（无视觉回归）。

**Non-Goals:**

- `components/business/*`、`components/chat/*`、`components/chart/*` 的文案（后续批次）。
- dev-facing console.warn/error 文案（保留中文）。
- 不新增公开 prop API（沿用 `prop ?? t(...)` 覆盖模式）。
- 不处理日期/数字格式化（DatePicker 已单独处理 date-fns）。

## Decisions

### D1: key 命名 = 组件命名空间 + 语义 camelCase，全部进 defaultMessages

每个组件一个命名空间（如 `pactor.pagination.*`），key 语义化（`total` / `prev` / `zoomIn`…）。全部追加到 `i18n-context.ts` 的 `defaultMessages` 两组语言中，业务经 messages 覆盖与现有机制一致。

### D2: 复用优先，不重复造 key

| 复用 key | 使用点 |
|---|---|
| `pactor.command.empty` | Combobox 无匹配结果 |
| `pactor.alertDialog.confirm` | TimePicker「确定」 |
| `pactor.table.empty` | List「暂无数据」 |
| `pactor.overlay.close` | Tag「关闭」、ImageViewer「关闭」 |
| `pactor.select.search` | TreeSelect 搜索框 |
| `pactor.table.loading` | SitemapApp「加载中…」 |

### D3: 覆盖模式与现有组件一致

- 可见文本：`placeholder ?? t(key)`、`emptyText ?? t(key)`、`title ?? t(key)`（组件已暴露同名 prop 的优先 prop）。
- aria-label / tooltip：直接 `t(key)`（不新增 prop）。
- 插值统一 `{{name}}`（core 的 `interpolate` 已支持）；**插值参数命名沿用既有约定**：计数语义一律 `{{count}}`（与已发布的 `pactor.cardList.total`「共 {{count}} 个」一致），避免同语义参数名混搭（total/count）增加业务覆盖时的记忆成本。

### D4: 新 key 清单（zh-CN / en-US）

| 命名空间 | key | zh-CN | en-US |
|---|---|---|---|
| `select` | `placeholder` | 请选择 | Please select |
| `pagination` | `total` | 共 {{count}} 条 | Total {{count}} |
| | `pageSize` | 每页 {{size}} 条 | {{size}} per page |
| | `itemsPerPage` | {{size}} 条/页 | {{size}} / page |
| | `prev` / `next` | 上一页 / 下一页 | Previous / Next |
| `upload` | `dragText` | 点击或拖拽文件到此区域 | Click or drag files here |
| | `selectFile` | 选择文件 | Select file |
| | `rejected` | 已忽略 {{count}} 个不符合要求的文件 | {{count}} invalid file(s) ignored |
| | `remove` | 移除 {{name}} | Remove {{name}} |
| `tree` | `newNode` | 新节点 | New node |
| | `nodeActions` | 节点操作 | Node actions |
| | `dragToReorder` | 拖拽排序 | Drag to reorder |
| | `expand` / `collapse` | 展开 / 收起 | Expand / Collapse |
| `transfer` | `listOne` / `listTwo` | 列表 1 / 列表 2 | List 1 / List 2 |
| | `selectAll` | 全选{{title}} | Select all {{title}} |
| | `itemCount` | {{count}} 项 | {{count}} items |
| | `moveRight` / `moveLeft` | 移到右侧 / 移到左侧 | Move to right / Move to left |
| `imageViewer` | `open` | 图片查看 | View image |
| | `prev` / `next` | 上一张 / 下一张 | Previous / Next image |
| | `zoomIn` / `zoomOut` | 放大 / 缩小 | Zoom in / Zoom out |
| | `rotate` | 旋转 | Rotate |
| | `reset` | 复位 | Reset |
| | `close` | 关闭预览 | Close preview |
| `tour` | `prev` / `next` / `done` | 上一步 / 下一步 / 完成 | Previous / Next / Done |
| `timePicker` | `placeholder` | 请选择时间 | Select time |
| | `now` | 此刻 | Now |
| `colorPicker` | `placeholder` | 请选择颜色 | Select color |
| | `hexLabel` | hex 颜色值 | hex color value |
| | `channel` | {{label}} 通道 | {{label}} channel |
| | `invalidFormat` | 颜色格式不正确，请输入十六进制色值 | Invalid color format, please enter a hex value |
| `rate` | `star` / `starLeft` / `starRight` | 第 {{index}} 星（左半/右半） | Star {{index}} (left/right half) |
| `documentPreview` | `prev` / `next` | 上一页 / 下一页 | Previous / Next page |
| | `zoomIn` / `zoomOut` | 放大 / 缩小 | Zoom in / Zoom out |
| | `page` | 第 {{page}} 页 | Page {{page}} |
| | `empty` | 暂无文档内容 | No document content |
| `jsonViewer` | `copy` | 复制 JSON | Copy JSON |
| | `items` / `keys` | […] {{count}} 项 / {…} {{count}} 键 | […] {{count}} items / {…} {{count}} keys |
| `filePreview` | `unnamed` | 未命名文件 | Untitled file |
| | `download` | 下载 | Download |
| `image` | `preview` | 图片预览 | Image preview |
| `backTop` | `top` | 回到顶部 | Back to top |
| `chatInput` | `send` | 发送 | Send |
| `codeBlock` | `copy` | 复制代码 | Copy code |
| `timeline` | `inProgress` | 进行中 | In progress |
| `header` | `themeToLight` / `themeToDark` | 切换为浅色 / 切换为深色 | Switch to light / dark mode |
| | `themeToggle` | 切换明暗主题 | Toggle theme |
| `sitemap` | `loadError` | sitemap 加载失败：{{message}} | Sitemap loading failed: {{message}} |
| | `redirecting` | 重定向… | Redirecting… |
| | `notFound` | 页面不存在（{{path}}） | Page not found ({{path}}) |
| | `layoutMissing` | 布局未定义：{{name}} | Layout not defined: {{name}} |
| `page` | `loadFailed` | 页面加载失败 | Page loading failed |
| | `retry` | 重试 | Retry |

### D5: 测试策略

新增 `packages/ui/tests/components/i18n-coverage.test.tsx`：用 `I18nContextProvider`（@pactor-app/runtime）直接包裹被测组件，三态断言：

1. **缺省（无 Provider）**：默认中文文案（`useI18n` 缺省上下文回退 zh-CN）。
2. **Provider locale=en-US**：英文文案（内置 en-US 文案经 useI18n 回退生效）。
3. **Provider messages 覆盖**：个别组件（如 Pagination `pactor.pagination.total`）验证业务覆盖优先级。

复杂组件用最小 props 渲染空态（DocumentPreview 无 src → empty 文案；ImageViewer 无图片列表 → 关闭按钮 aria；Upload 空态拖拽区），避免真实资源依赖。

### D6: 验证闭环

接入完成后重跑扫描脚本（去注释 CJK 检索），断言 `components/components/` 与 5 个残留文件零命中（console/正则字符类等白名单除外）。

### D7: SitemapApp 国际化（props 透传 + 工厂重建 + 根 Provider）

**分层说明（刻意取舍）**：`pactor.sitemap.*` / `pactor.page.*` 是 app 层文案，但 SitemapApp / embedded 经 `useI18n` 消费，key 必须进 runtime 包的 `defaultMessages` 才能被默认回退命中——暂借 runtime 默认表是刻意的；未来 app 层文案增多时，可演进为 app 侧默认表在 Provider 层 merge，机制不变。

1. **静态配置**：`SitemapAppProps` 增加 `locale` / `defaultLocale` / `messages`，透传给页面实例与布局实例两个 PactorPage（PactorPage 直接形态的 props 即工厂 options，首次渲染组装一次即生效）。
2. **自身状态文案**：SitemapApp 根部包 `I18nContextProvider`（`useMemo` 按 props 组 `createI18nContext`），5 处状态文案走 `pactor.sitemap.*`（「加载中…」复用 `pactor.table.loading`）。loading/error/notFound 分支均须在 Provider 内。
3. **语言切换（宿主驱动）**：`PactorPage` 直接形态组装一次（factoryRef），locale 变化不重建——SitemapLayout 改为 `createPactorPage` 工厂 + `useMemo` 依赖 `[locale, messages, ...]`：语言变化产生新组件类型，React 卸载重建页面运行时，表达式与内置组件跟随；页面实例 `pageId@pathname` key 语义不变（路由重建仍由 key 控制）。
4. **菜单文案**：menus 来自 sitemap 源，由源侧按语言下发（与整应用模式「菜单标题不做表达式求值」一致）。
5. **持久化**：SitemapApp 不接管，宿主页面负责（对应整应用模式的 `options.localeStorage` 职责分离）。

## Risks / Trade-offs

- [key 命名与业务已有 messages 冲突] → 全部新命名空间、新 key，冲突概率低；冲突时业务覆盖本身即期望行为。
- [组件测试渲染成本] → D5 空态最小 props 策略；不逐组件做交互级测试，仅断言文案三态。
- [扫描遗漏] → D6 重跑脚本闭环；`lib/`、`hooks/`、`layout/` 本轮扫描为零命中，不涉及。
- [en-US 译文质量] → 以现有 defaultMessages 风格为准（简洁 UI 文案），业务可覆盖修正。
- [SitemapApp 切换语言重建丢失页面状态] → 嵌入模式本来按 key 重建（V1 无 keepAlive），语言切换与路由切换共用该语义，无新增取舍；布局 DSL 实例同样重建（layoutPage 随 locale memo 化）。
- [PactorPage 组装一次语义不直观] → 不修改 PactorPage 本体（embedded-page-view spec 不动），SitemapApp 走工厂重建路径；文档点明两种形态的差异。

## Migration Plan

单批提交（无分阶段风险）：

1. `i18n-context.ts` defaultMessages 增补全部新 key（纯增量，无行为变化）。
2. 5 个残留组件改用法。
3. 18 个基础组件接入 `useI18n`。
4. 新增测试 + 全量 ui 测试 + 扫描脚本闭环。

回滚：每步独立可回滚；默认中文文案不变，任何一步回退均不产生视觉回归。

归档：delta spec 合并到 `openspec/specs/i18n`「内置组件默认文案国际化」requirement。

## Open Questions

- 无。business / chat / chart 批次另行立项。
