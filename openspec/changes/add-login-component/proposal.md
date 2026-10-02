## Why

登录页是任何管理后台/控制台产品的必备页面。目前用 pactor DSL 搭建登录页需要手写 Card + Form + Input + Button 的整页结构（参考各项目 login.yaml），每个项目重复拼装，且布局、品牌区、辅助入口等结构缺乏统一抽象。产品侧已产出《登录页产品结构设计》文档（12 种布局结构 + 可配置元素清单），具备沉淀为可复用业务组件的条件。

## What Changes

- 在 `packages/ui/src/components/business/` 新建业务组件目录，新增 `Login` 登录业务组件（含样式文件与 DSL 注册）
- 组件以 props 承载登录页的可配置信息：品牌区（logo、品牌名、标题、副标题、插画/背景）、认证区（标题、说明、字段配置、提交按钮文案）、辅助入口（注册/找回密码链接）、页脚、布局类型（对应设计文档的 12 种布局中的常用几种）等
- 认证交互通过 DSL 事件暴露：`onSubmit`（表单 values 经 `${event.*}` 读取）、`onRegisterClick` / `onForgotClick` 等，提交请求与跳转闭环由 DSL 页面编排（与现有 login.yaml 的 request + app.reload 模式兼容）
- 组件遵循 ui 包既有约定：语义令牌（深浅色/换肤自适应）、lucide 图标、i18n 缺省文案
- 补充组件测试（渲染、props 透传、提交事件、校验）

## Capabilities

### New Capabilities

- `ui-login-component`: packages/ui 的登录业务组件——可配置品牌区/认证区/辅助入口/页脚/布局，DSL 注册与事件契约，深浅色与换肤适配

### Modified Capabilities

（无）

## Impact

- **代码**：新增 `packages/ui/src/components/business/Login/`（组件、样式、类型、测试）；`packages/ui/src/components/index.ts` 与 `register.ts` 增加导出与 DSL 注册（DSL type: `Login`）
- **API**：纯新增，无 breaking change；不影响现有 chat/chart/通用组件
- **依赖**：仅复用 ui 包内已有组件（Card/Form/Input/Button 等）与 lucide-react，不新增外部依赖
- **下游**：starters / examples / prd-to-app skill 模板的登录页 yaml 后续可改用该组件（本变更不含模板改造）
