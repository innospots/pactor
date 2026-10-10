# Tasks: UI 组件库基础组件文案国际化补齐

## 1. defaultMessages 增补（设计 D1/D4）

- [x] 1.1 `packages/runtime/src/context/i18n-context.ts` 增补全部新 key（设计 D4 清单）到 `defaultMessages` 的 zh-CN 与 en-US 两组
- [x] 1.2 新增/调整 `pactor.select.placeholder`（请选择 / Please select）

## 2. 残留修复（设计 D2，5 个已接入组件）

- [x] 2.1 Combobox：空结果 `emptyText ?? t('pactor.command.empty')`
- [x] 2.2 TimePicker：placeholder 走 `pactor.timePicker.placeholder`、「此刻」走 `pactor.timePicker.now`、「确定」复用 `pactor.alertDialog.confirm`
- [x] 2.3 TreeSelect：展开/收起走 `pactor.tree.expand/collapse`、placeholder 走 `pactor.select.placeholder`、搜索复用 `pactor.select.search`
- [x] 2.4 Header：主题切换 tooltip/aria 走 `pactor.header.themeToLight/themeToDark/themeToggle`
- [x] 2.5 Cascader：placeholder 走 `pactor.select.placeholder`

## 3. 基础组件接入（18 个，设计 D3）

- [x] 3.1 Pagination（pagination.*，含统计、每页选择、上/下一页）
- [x] 3.2 Upload（upload.*，含拖拽区、选择文件、rejected、移除插值）
- [x] 3.3 Tree（tree.*：新节点、节点操作、拖拽排序、展开/收起）
- [x] 3.4 Transfer（transfer.*：列表标题、全选、项数、左右移动）
- [x] 3.5 ImageViewer（imageViewer.* + 关闭复用 `pactor.overlay.close`）
- [x] 3.6 Tour（tour.*）
- [x] 3.7 ColorPicker（colorPicker.*）
- [x] 3.8 Rate（rate.* 插值）
- [x] 3.9 DocumentPreview（documentPreview.*）
- [x] 3.10 JSONViewer（jsonViewer.*）
- [x] 3.11 FilePreview（filePreview.*）
- [x] 3.12 Image（image.preview）
- [x] 3.13 BackTop（backTop.top）
- [x] 3.14 ChatInput（chatInput.send）
- [x] 3.15 CodeBlock（codeBlock.copy）
- [x] 3.16 List（复用 `pactor.table.empty`）
- [x] 3.17 Tag（复用 `pactor.overlay.close`）
- [x] 3.18 Timeline（timeline.inProgress）

## 4. 测试与验证闭环

- [x] 4.1 新增 `packages/ui/tests/components/i18n-coverage.test.tsx`：缺省中文 / Provider locale=en-US / messages 覆盖三态断言（设计 D5）
- [x] 4.2 运行 `packages/ui` 与 `packages/runtime` 全量测试与类型检查，确认无回归
- [x] 4.3 重跑扫描脚本：`components/components/` 与 5 个残留文件 CJK 命中清零（白名单：console 消息、正则字符类）
- [x] 4.4 `openspec validate ui-components-i18n` 通过

## 5. SitemapApp 与 embedded 错误态（设计 D7）

- [x] 5.1 `defaultMessages` 增补 `pactor.sitemap.*`（loadError/redirecting/notFound/layoutMissing）与 `pactor.page.*`（loadFailed/retry）
- [x] 5.2 `SitemapAppProps` 增加 `locale` / `defaultLocale` / `messages`；根部包 `I18nContextProvider`（useMemo 按 props 组 createI18nContext）
- [x] 5.3 SitemapApp 5 处状态文案改 `useI18n().t()`（「加载中…」复用 `pactor.table.loading`）
- [x] 5.4 SitemapLayout 两个 PactorPage 改 `createPactorPage` 工厂 + `useMemo` 依赖 locale/messages（透传 i18n 配置；页面实例 key 保持 `pageId@pathname`）。注意 messages 引用稳定性：宿主每次渲染新建对象会导致每次重建——useMemo 依赖按值语义处理（或 JSDoc 明确要求宿主 memo 化 messages）
- [x] 5.5 `embedded.tsx` 错误态「页面加载失败 / 重试」走 `pactor.page.*`
- [x] 5.6 测试（`packages/app/tests/sitemap.test.tsx`）：locale/messages 透传渲染；宿主改 locale prop 后页面重建按新语言；sitemap 状态文案 en-US 与 messages 覆盖
