# Proposal: add-essential-components

## Why

对照产品设计文档 `product-design/ui/component-design.md` 的 137 组件目录，`@pactor-app/ui` 现有 71 个 DSL 类型，其中影响 DSL 页面落地能力的三块缺口最集中：

- **数据录入**：缺 TreeSelect、Cascader、Rate、TimePicker、ColorPicker、Upload、Transfer、Mentions（8 个，表单刚需）
- **数据展示**：缺 List、Tree、Descriptions、Timeline、Image、QRCode、Segmented（7 个，后台页面高频件）
- **反馈**：缺 Message、Notification、Popconfirm、Result、LoadingOverlay、Watermark、Tour（7 个，流程闭环必需）

图表与 AI 会话类需先定架构（拆分粒度 / ui 与 chat 归属），本变更不涉及。

## What Changes

- `@pactor-app/ui` 新增第五批 22 个 DSL 组件（单目录单 `index.tsx` 适配器，沿用 vendored Base UI 原语 + 框架级 props 约定）
- 数据录入 8 个全部接入 Form 上下文（`name` / `label` / `rules` / FieldShell），Segmented 同样可入表单
- `Message` / `Notification` 以**声明式触发器**形态落地（content/title 变为非空即发全局 toast），复用并扩展 vendored toast 原语（新增 `warning` 变体），不重复造全局反馈系统
- `Upload` 为纯 UI 组件（选择/校验/列表/移除 + 元数据事件），不包含网络上传；真实上传经 DSL events 接动作层
- `QRCode` 引入 `qrcode` 依赖（SVG 输出），这是本变更唯一新增依赖
- 注册表、`register.test.ts` 类型清单、`docs` 组件分类页（form/display/feedback）同步更新

## Impact

- Affected specs: `shadcn-extended-components`（MODIFIED 注册入口 + ADDED 三组组件需求）
- Affected code: `packages/ui/src/components/`（22 个新目录）、`register.ts`、`components/index.ts`、`tests/components/`（3 个新测试文件）、`packages/ui/package.json`（+qrcode）、`docs/src/content/docs/components/{form.md,display.mdx,feedback.md}`
- 无破坏性变更；既有 71 个类型不变
