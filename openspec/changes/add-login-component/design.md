## Context

pactor 的 ui 包组件分三类目录：通用组件（`components/`）、图表（`chart/`）、会话（`chat/`）。登录页目前由各项目用 Card + Form + Input + Button 手写整页 DSL（如 starters/examples/template 的 login.yaml），重复拼装且结构不统一。产品文档《登录页产品结构设计》（product-design/general/login/）定义了 12 种布局结构与第 7 节「模板可变更元素」清单，本设计据此把登录页沉淀为 `packages/ui` 的业务组件 `Login`，DSL `type: Login` 调用。

## Goals / Non-Goals

**Goals:**

- 新增 `packages/ui/src/components/business/Login/` 业务组件，注册 DSL type `Login`
- 可配置信息全部走 props：品牌区、认证区标题/说明/字段/按钮文案、辅助入口（注册/找回密码）、页脚、布局类型
- 提交闭环保持 DSL 编排：`onSubmit` 抛出 values，页面自行 request + message + app.reload（与现有 login.yaml 模式兼容）
- 深浅色/换肤自适应（语义令牌），窄屏降级为单列，i18n 缺省文案可覆盖
- 组件测试覆盖渲染、props、校验、事件

**Non-Goals:**

- 不含扫码登录（设计文档布局 10）、MFA、SSO 第三方入口（设计文档标注为未确认需求）
- 不改造 starters/examples/template 中现有 login.yaml（下游迁移另行进行）
- 不内置登录请求逻辑（接口地址、会话写入由 DSL/服务端决定）

## Decisions

### 1. 目录：`components/business/` 新分类

业务组件目录为 `packages/ui/src/components/business/`，与 `chat/`、`chart/` 平级，`Login` 为首个成员。理由：chat/chart 是领域目录，登录不属于任一领域，新开 `business/` 为后续业务组件（如 NotFound、ErrorPage）留位。备选：放入通用 `components/`——拒绝，登录是页面级业务组合而非通用原子组件。

### 2. 布局 prop：10 种枚举覆盖设计文档全部非扫码结构

`layout` 取值与文档编号对应：`split`（01）、`split-card`（02/09，默认）、`split-card-float`（03）、`split-wide`（04）、`centered-card`（05）、`centered-plain`（07）、`brand-card`（06）、`overlap`（08）、`backdrop`（11）、`reverse-split`（12）。10 扫码登录不含（认证能力不支持扫码）。容器关系按文档第 6 节约束：表单区 320–420px，窄屏（<md）单列且品牌区收缩/后置，overlap 窄屏取消重叠。备选：12 个枚举含扫码——拒绝（无扫码能力）；仅做 4 种——已被「支持 10 种布局」需求取代。

### 3. 品牌区 props 聚合为 `brand` 对象

`brand: { logo?, name?, title?, description?, illustration? }`（对应文档第 7 节品牌标识/文案/展示图）。`brand` 缺省时居中布局自动隐藏品牌区；分栏布局下缺省渲染占位（logo+name）。插画走 `Image`，不烘焙文字。

### 4. 认证区内部复用 `Form` 组件

字段固定 username/password（label/placeholder/required 文案可 props 覆盖），内部用 ui 已有 `Form` + `Input`，校验走字段 rules；提交按钮 `submit: true`。理由：与「表单一律 Form」的既有规范一致，校验/错误展示零新增代码。`onSubmit(values)` 抛给 DSL。备选：fields 数组全开放配置——v1 拒绝（登录字段语义固定），但 props 预留 `extraFields` 扩展位暂不实装。

### 5. 辅助入口与页脚

`registerLink?: { text, href? }`、`forgotLink?: { text, href? }`；给 `href` 直接渲染 Link，否则触发 `onRegisterClick` / `onForgotClick` 事件交 DSL 编排。`footer?: string`（版权/协议行，弱化样式）。缺省全部不渲染（文档：仅呈现已支持的入口）。

### 6. 样式与主题

全部使用语义令牌（`bg-(--background)`、`text-(--muted-foreground)` 等 tailwind 写法），不写死色值；页面级渐变背景等装饰经 `className`/`style` 由使用方注入。缺省文案走 `context.i18n.t('pactor.login.*')`，props 优先。测试用 vitest + 包内既有测试基建。

## Risks / Trade-offs

- [布局枚举将来再扩展（如扫码）时需保持向后兼容] → 枚举追加式扩展，已有值语义不变
- [字段固化 username/password，产品要邮箱+验证码登录时不适用] → v2 扩展 `fields` 配置；当前在文档中明确适用范围
- [品牌插画在不同皮肤下违和] → 插画由使用方按皮肤准备素材，组件不加滤镜/反色 hack
- [DSL 事件名与 chat 组件既有命名不一致] → 沿用 React 惯例 `onSubmit/onXxxClick`，与 Form/ChatPage 一致

## Open Questions

- 窄屏下品牌区是「收缩」还是「移至认证内容之后」：v1 取收缩（隐藏插画与描述，保留 logo+名称），如产品另有要求再调
