# Proposal: add-login-page-template

## Why

pactor-prd 模板的登录页（`yaml/common/login.yaml`）是手写 Card+Form + `app/login.css` 自定义样式的特例实现，而 `packages/ui` 已提供 DSL 可调用的 `Login` 业务组件（`components/business/Login/`，5 种结构布局 × 正交修饰配置，样式全走语义令牌）。模板登录页应改用标准组件，让生成的项目直接继承组件能力；同时登录页布局方式（split/centered/brand-card/overlap/backdrop 及其修饰）属于产品决策，原型未明确时不应替用户拍板。

## What Changes

- 改造 `skills/pactor-prd/template/src/server/yaml/common/login.yaml`：body 由手写 Card+Form 改为 `type: Login` 业务组件（默认 `split` + `card`），`events.onSubmit` 保留既有提交闭环（request 登录接口 + 失败 message + 成功 app.reload），原 eyebrow/标题/副标题文案迁移到 Login 的 props
- `sitemap.yaml` 的 `login` 布局简化为纯 PageOutlet（Login 组件自带整页品牌视觉与背景装饰，不再需要 `login-page` 渐变外壳）
- 删除 `app/login.css` 及 `app/layout.tsx` 中的引入（样式由组件语义令牌接管）
- SKILL.md 增加登录页生成规则：PRD 含登录页时，原型未明确布局方式则向用户提问选择 `Login` 的 layout 与修饰配置，再按模板登录页生成
- `references/page-templates.md` 增加登录页模板小节，列出可配置项

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `skill-prd-to-yaml-app`: 模板登录页改用 DSL `Login` 业务组件实现（去除手写 CSS 特例）；生成流程新增「登录页布局未明确时向用户提问」的澄清规则

## Impact

- `skills/pactor-prd/template/src/server/yaml/common/login.yaml`（改造）、`sitemap.yaml`（login 布局简化）
- `skills/pactor-prd/template/app/login.css`（删除）、`app/layout.tsx`（去引入）
- `skills/pactor-prd/SKILL.md`、`skills/pactor-prd/references/page-templates.md`（规则与索引）
- 不改动 `packages/ui` 的 Login 组件本身
