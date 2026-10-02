## ADDED Requirements

### Requirement: Login 业务组件

`packages/ui` SHALL 在 `components/business/Login/` 提供登录业务组件并注册 DSL type `Login`，以 props 承载登录页可配置信息，经 `onSubmit` 事件抛出表单 values 供 DSL 编排提交闭环。

#### Scenario: DSL 调用

- **WHEN** 页面 yaml 声明 `type: Login` 并配置 props 与 `events.onSubmit`
- **THEN** 渲染完整登录页结构，提交时 `onSubmit` 动作链执行且 `${event.username}` / `${event.password}` 可读

#### Scenario: 表单校验

- **WHEN** 用户未填用户名或密码直接点击登录
- **THEN** 对应字段就地展示错误提示（Form rules），不触发 `onSubmit`

### Requirement: 布局类型

组件 SHALL 支持 `layout` prop，覆盖《登录页产品结构设计》中除扫码（10）外的全部十种结构：`split`（01）、`split-card`（02/09，默认）、`split-card-float`（03）、`split-wide`（04）、`centered-card`（05）、`centered-plain`（07）、`brand-card`（06）、`overlap`（08）、`backdrop`（11）、`reverse-split`（12）；窄屏下分栏布局降为单列，认证内容优先，overlap 布局取消卡片重叠。

#### Scenario: 默认布局

- **WHEN** 未配置 `layout`
- **THEN** 按 `split-card` 渲染：左侧品牌区 + 右侧认证卡片

#### Scenario: 十种布局可选

- **WHEN** `layout` 取十个枚举值之一
- **THEN** 按对应结构渲染品牌区与认证区的容器关系（分栏比例 / 卡片有无 / 叠加 / 反向分栏 / 整页渐变背景），根节点 `data-layout` 等于所配置值

#### Scenario: 居中布局无品牌区

- **WHEN** `layout` 为 `centered-card` 或 `centered-plain`
- **THEN** 认证区居中展示，不渲染分栏品牌区

#### Scenario: 窄屏降级

- **WHEN** 视口宽度小于断点（md）
- **THEN** 分栏布局变为单列：品牌区收缩（隐藏插画与描述），认证区完整可达；overlap 布局取消重叠改为上下排列

### Requirement: 可配置元素

组件 SHALL 以 props 暴露：品牌区（`brand: { logo, name, title, description, illustration }`）、认证区标题与说明（`title`、`subtitle`）、字段文案（用户名/密码的 label 与 placeholder）、提交按钮文案（`submitText`）、辅助入口（`registerLink`、`forgotLink`）、页脚（`footer`）、根节点 `className`/`style`。未配置的可选元素一律不渲染。

#### Scenario: 品牌区配置

- **WHEN** 配置 `brand: { name, title, description, illustration }`
- **THEN** 分栏布局的品牌区展示对应 logo/名称/文案/插画

#### Scenario: 辅助入口按需渲染

- **WHEN** 仅配置 `forgotLink`，未配置 `registerLink`
- **THEN** 只渲染「忘记密码」入口，不渲染注册入口

#### Scenario: 辅助入口跳转

- **WHEN** 点击配置了 `href` 的辅助入口
- **THEN** 跳转对应链接；未配 `href` 时触发对应 DSL 事件（`onRegisterClick`/`onForgotClick`）

#### Scenario: 默认装饰（图片与背景）

- **WHEN** 未配置 `brand.illustration` 与自定义背景
- **THEN** 分栏布局品牌区展示内置默认插画（语义令牌 SVG）、渐变背景与背景装饰图形（柔光圆斑/圆环/点阵/底部流线），居中与 backdrop 布局整页带默认渐变与装饰；配置 `brand.illustration` 地址则替换默认插画，传空字符串则隐藏插画

### Requirement: 提交闭环由 DSL 编排

组件 SHALL NOT 内置登录请求；`onSubmit` 抛出 values 后，请求、成功/失败反馈与跳转由 DSL 页面动作链编排（兼容 `request` + `message` + `app.reload` 模式）。

#### Scenario: 提交事件抛出 values

- **WHEN** 校验通过后点击登录按钮
- **THEN** `onSubmit` 被调用，参数为 `{ username, password }`，DSL 中以 `${event.username}` 读取

### Requirement: 主题与国际化适配

组件 SHALL 全部使用语义令牌（不写死色值），深浅色模式与换肤下对比度正常；可见文案缺省值走 i18n（`pactor.login.*`），同名 props 配置优先于 i18n 缺省。

#### Scenario: 深浅色切换

- **WHEN** 切换深色模式或更换皮肤
- **THEN** 背景、卡片、文字、边框成套切换，认证区可读性不受影响

#### Scenario: 文案覆盖

- **WHEN** props 配置了 `title`/`submitText` 等文案
- **THEN** 展示 props 值而非 i18n 缺省文案
