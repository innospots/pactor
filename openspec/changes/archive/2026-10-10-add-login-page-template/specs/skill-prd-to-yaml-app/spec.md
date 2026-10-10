# Delta: skill-prd-to-yaml-app

## ADDED Requirements

### Requirement: 模板登录页使用 Login 业务组件

模板工程的登录页（`src/server/yaml/common/login.yaml`）SHALL 以 DSL `type: Login` 业务组件（`packages/ui` `components/business/Login/`）实现，登录页特有的可配置信息（品牌区、标题、副标题、字段文案、提交按钮文案、辅助入口、页脚）经 props 表达；提交闭环 SHALL 由 `events.onSubmit` 动作链编排（`request` 登录接口 + 失败 `message` + 成功 `app.reload` 跳转），组件 SHALL NOT 内置登录请求；手写登录样式特例（`login-page` 渐变外壳布局与 `app/login.css`）SHALL 移除，sitemap 的 `login` 布局简化为纯页面出口。

#### Scenario: 登录页 DSL 渲染与提交闭环

- **WHEN** 匿名访问模板工程 `/login`，填写演示账号（admin / pactor123）提交
- **THEN** 渲染 Login 组件完整登录页，校验通过后执行 request → message → app.reload 闭环并进入后台首页

#### Scenario: 无手写登录 CSS 残留

- **WHEN** 登录页改用 Login 组件后
- **THEN** `app/login.css` 与其在 `app/layout.tsx` 的引入被删除，sitemap `login` 布局不再引用 `login-page` 类，工程内无 `login-page` / `login-card` / `login-eyebrow` / `login-heading` / `login-subtitle` 类名残留

#### Scenario: 生成项目登录页以模板为准

- **WHEN** 按 PRD 生成的项目包含登录页
- **THEN** 以模板 `common/login.yaml` 的 Login 组件写法为样板生成，品牌区文案、标题、提交动作的目标地址按 PRD 与目标项目调整

### Requirement: 登录页布局澄清

当 PRD 包含登录页但原型未明确指定布局方式时，skill SHALL 向用户提问选择 `Login` 组件的布局（`layout`：`split` / `centered` / `brand-card` / `overlap` / `backdrop`，必要时含 `brandSide` / `brandRatio` / `authVariant` 等修饰项），得到答复后再生成；原型已明确布局时 SHALL 直接使用指定布局，不重复提问；用户不作答时 SHALL 按缺省 `split` + `authVariant: card` 生成。

#### Scenario: 原型未明确布局时提问

- **WHEN** PRD 含登录页线框图，但无法从中判定结构布局
- **THEN** 向用户提问可选布局（附各布局效果简述），按答复设置 `layout` 与修饰 props

#### Scenario: 原型明确布局时不提问

- **WHEN** 线框图可明确判定布局（如 ASCII 为左右分栏结构或文字注明）
- **THEN** 直接使用对应 `layout` 生成，不发起提问
