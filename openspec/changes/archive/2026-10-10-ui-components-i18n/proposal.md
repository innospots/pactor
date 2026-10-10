# Proposal: UI 组件库基础组件文案国际化补齐

## Why

`packages/ui/src` 中 42 个文件存在用户可见的硬编码中文。其中已接入 `useI18n` 的组件有 5 个残留硬编码（Combobox / TimePicker / TreeSelect / Header / Cascader）；`components/components/` 下 18 个基础组件完全未接入 i18n（ImageViewer、Pagination、DocumentPreview、Transfer、Tree、ColorPicker、Upload、JSONViewer、Rate、Tour、FilePreview、Image、BackTop、ChatInput、CodeBlock、List、Tag、Timeline）。应用切换到 en-US 时这些组件的默认文案仍是中文，破坏国际化完整性。

## What Changes

- `@pactor-app/runtime` 的 `i18n-context.ts` `defaultMessages` 增补一批新命名空间 key（zh-CN / en-US 双份）：`pactor.pagination.*`、`pactor.upload.*`、`pactor.tree.*`、`pactor.transfer.*`、`pactor.imageViewer.*`、`pactor.tour.*`、`pactor.timePicker.*`、`pactor.colorPicker.*`、`pactor.rate.*`、`pactor.documentPreview.*`、`pactor.jsonViewer.*`、`pactor.filePreview.*`、`pactor.image.*`、`pactor.backTop.*`、`pactor.chatInput.*`、`pactor.codeBlock.*`、`pactor.timeline.*`、`pactor.header.*`、`pactor.cascader.*`、`pactor.select.placeholder`。
- 上述 18 个基础组件接入 `useI18n`：默认文案走 `t(key)`，沿用现有覆盖模式（`placeholder ?? t(...)`、`emptyText ?? t(...)`、`title ?? t(...)`），aria-label 用 `t()`。
- 5 个已接入组件的残留硬编码改用 key：Combobox 空结果复用 `pactor.command.empty`；TimePicker「确定」复用 `pactor.alertDialog.confirm`；List「暂无数据」复用 `pactor.table.empty`；Tag「关闭」复用 `pactor.overlay.close`；其余用新 key。
- `SitemapApp` 增加 `locale` / `defaultLocale` / `messages` props 并透传两个 PactorPage；自身 5 处状态文案（加载中/拉取失败/重定向/404/布局缺失）走新 key `pactor.sitemap.*`（「加载中…」复用 `pactor.table.loading`）；支持宿主改 locale prop 驱动页面重建（经 `createPactorPage` 工厂按语言 memo 化）。
- `embedded.tsx` 嵌入页错误态「页面加载失败 / 重试」走新 key `pactor.page.*`。
- 不新增可配置 API：所有文案均经 messages 覆盖，与现有 Table/Command 等机制一致。

## Capabilities

### Modified Capabilities

- `i18n`: 「内置组件默认文案国际化」requirement 扩展：新增一批内置组件的默认文案 key 命名空间与覆盖场景（Pagination / Upload / Tree / Transfer / ImageViewer / Tour / TimePicker / ColorPicker / Rate / DocumentPreview / JSONViewer / FilePreview / Image / BackTop / ChatInput / CodeBlock / Timeline / Header 主题切换 / Cascader / TreeSelect / Combobox / List / Tag）；并新增「SitemapApp 国际化」requirement（props 透传、自身状态文案、宿主驱动语言切换）。

## Impact

- `packages/runtime/src/context/i18n-context.ts`：defaultMessages 增补（约 70 个 key × 2 语言）。
- `packages/ui/src/components/components/`：18 个组件文件改 `useI18n`。
- `packages/ui/src/components/components/Combobox|TimePicker|TreeSelect|Header|Cascader`：5 个残留修复。
- `packages/app/src/sitemap/SitemapApp.tsx`：i18n props + 根 Provider + 状态文案 + 工厂式 PactorPage 重建。
- `packages/app/src/embedded.tsx`：错误态文案 i18n。
- `packages/ui/tests/components/`、`packages/app/tests/sitemap.test.tsx`：新增 i18n 覆盖测试（默认中文 / en-US 切换 / messages 覆盖）。
- 不在本批：`components/business/*`、`components/chat/*`、`components/chart/*` 的文案与 dev-facing console 消息（后续批次）。
- 无 breaking 变更：默认中文文案不变，仅变为可经 messages 覆盖。
