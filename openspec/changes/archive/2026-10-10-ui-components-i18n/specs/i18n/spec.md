# Delta Spec: i18n

## ADDED Requirements

### Requirement: SitemapApp 国际化

`SitemapApp` SHALL 支持经 props 配置国际化：`locale`（缺省 'zh-CN'）、`defaultLocale`、`messages`，并 MUST 透传给页面实例与布局实例的 PactorPage（页面表达式 `t()` 与内置组件按配置语言渲染）。SitemapApp 自身的状态文案（加载中 / sitemap 拉取失败 / 重定向 / 路由未命中 / 布局缺失）SHALL 使用 `pactor.sitemap.*` key 渲染（「加载中…」复用 `pactor.table.loading`），支持 messages 覆盖。宿主切换 `locale` prop 时 SitemapApp SHALL 重建页面运行时并按新语言渲染；菜单标题 MUST 由 sitemap 源按语言下发，不做表达式求值。

#### Scenario: SitemapApp 静态语言配置

- **WHEN** `<SitemapApp locale="en-US" messages={{ welcome: 'Welcome' }} />` 且页面 DSL 含 `${t('welcome')}`
- **THEN** 页面渲染 `'Welcome'`，内置组件默认文案为英文

#### Scenario: SitemapApp 状态文案按语言渲染

- **WHEN** SitemapApp `locale` 为 `'en-US'` 且 sitemap 拉取失败
- **THEN** 错误视图显示 `'Sitemap loading failed: <message>'`

#### Scenario: 宿主切换语言触发页面重建

- **WHEN** 宿主将 SitemapApp 的 `locale` prop 从 `'zh-CN'` 改为 `'en-US'`
- **THEN** 页面运行时重建，表达式与内置组件按英文渲染

#### Scenario: 覆盖 SitemapApp 状态文案

- **WHEN** messages 提供 `pactor.sitemap.notFound` 为 `'Oops, {{path}} is missing'` 且访问未命中路径
- **THEN** 404 视图显示 `'Oops, /x is missing'`

## MODIFIED Requirements

### Requirement: 内置组件默认文案国际化

内置组件（Table、Form、Select、DatePicker、Pagination、Upload、Tree、Transfer、ImageViewer、Tour、TimePicker、ColorPicker、Rate、DocumentPreview、JSONViewer、FilePreview、Image、BackTop、ChatInput、CodeBlock、Timeline、Header、Cascader、TreeSelect、Combobox、List、Tag 等）的默认提示文案 SHALL 使用 i18n key 并允许业务覆盖。内置 key 的命名空间 MUST 以 `pactor.` 开头并保持稳定；未覆盖时回退到内置默认中文文案。DatePicker 的默认文案 SHALL 使用 `pactor.datePicker.*` 一组 key（placeholder / placeholderRange / today / thisWeek / thisMonth）；日期选择类组件的日历本体（月份/星期标题）SHALL 按当前 locale 切换（经 date-fns locale 映射，未知 locale 回退 en-US）。语义相同的文案 MUST 复用同一 key（如 `pactor.table.empty` 供 List 空态、`pactor.overlay.close` 供 Tag/ImageViewer 关闭、`pactor.command.empty` 供 Combobox 空结果、`pactor.alertDialog.confirm` 供 TimePicker 确定）。

#### Scenario: 覆盖 Table 空状态文案

- **WHEN** messages 提供 `pactor.table.empty` 为 `'No data'`
- **THEN** Table 组件在无数据时显示 `'No data'`

#### Scenario: 覆盖 Form 必填提示

- **WHEN** messages 提供 `pactor.form.required` 为 `'This field is required'`
- **THEN** 表单校验失败时显示该文案

#### Scenario: 覆盖 DatePicker 预设文案

- **WHEN** messages 提供 `pactor.datePicker.today` 为 `'Today!'` 且渲染 DatePicker 的缺省预设
- **THEN** 预设栏第一项显示 `'Today!'`

#### Scenario: 日历按 locale 切换

- **WHEN** 应用 locale 为 `en-US` 且打开 DatePicker 浮层
- **THEN** 日历的月份与星期标题显示为英文

#### Scenario: 覆盖 Pagination 统计文案

- **WHEN** messages 提供 `pactor.pagination.total` 为 `'Total {{count}} items'` 且 Pagination 渲染统计区
- **THEN** 统计区显示 `'Total 100 items'`（count 为 100，插值参数沿用既有计数约定 `{{count}}`）

#### Scenario: 新增组件默认英文文案

- **WHEN** 应用 locale 为 `en-US` 且渲染 Upload 空态拖拽区与 Tour 步骤条
- **THEN** 拖拽区显示 `'Click or drag files here'`，Tour 末步按钮显示 `'Done'`

#### Scenario: 复用 key 生效

- **WHEN** messages 提供 `pactor.table.empty` 为 `'Empty list'` 且渲染 List 空态
- **THEN** List 显示 `'Empty list'`（与 Table 共享同一 key）

#### Scenario: 插值 aria 文案

- **WHEN** locale 为 `en-US` 且 Upload 渲染名为 `report.pdf` 的文件项
- **THEN** 移除按钮的 aria-label 为 `'Remove report.pdf'`（`pactor.upload.remove` 插值）
