# Design: add-login-page-template

## Context

pactor-prd 模板工程的登录页现状：`yaml/common/login.yaml` 手写 Card+Form（eyebrow/标题/副标题 + 用户名密码 + 提交按钮），视觉依赖 `app/login.css`（`.login-page` 渐变外壳、卡片、按钮 hover 等自定义样式，经 `app/layout.tsx` 引入），sitemap.yaml 的 `login` 布局提供 `login-page` 全屏渐变容器。`packages/ui` 的 `Login` 业务组件（DSL type `Login`）已覆盖《登录页产品结构设计》的 5 种结构布局（split / centered / brand-card / overlap / backdrop）+ 正交修饰（brandSide / brandRatio / authVariant / brandPanelBackground / decor），品牌区、文案、辅助入口、页脚全部 props 化，自带整页视觉（渐变 + 背景装饰 + 默认插画），提交闭环由 DSL `onSubmit` 编排。

## Goals / Non-Goals

**Goals:**

- 模板登录页 `yaml/common/login.yaml` 改用 `type: Login`，提交闭环行为不变（演示账号 admin / pactor123 可登录）
- 去除手写 CSS 特例：`login` 布局简化、删除 `login.css`
- SKILL.md 约定：PRD 含登录页且原型未明确布局时，向用户提问选择布局后再生成

**Non-Goals:**

- 不改 `packages/ui` 的 Login 组件实现
- 不新增 `models/login.yaml` 骨架文件（用户明确决定直接改造现有登录页）
- 不实现扫码登录（组件范围外）

## Decisions

1. **直接改造 `common/login.yaml`，不新增 models/ 骨架**
   - 用户明确决定。模板登录页本身就是「生成时的参考实现」，用 Login 组件后它即是标准样板，无需再维护一份骨架副本。
   - 备选：新增 models/login.yaml 骨架、common/login.yaml 保持手写——拒绝，两处登录实现会漂移。

2. **`login` 布局简化为纯 PageOutlet，删除 `login.css`**
   - Login 组件自带整页渐变背景、背景装饰与品牌面板；再套 `login-page` 渐变外壳是双重背景。`login.css` 只服务 `.login-page` 作用域（文件头注释自述），随外壳一并删除，并移除 `app/layout.tsx` 的引入与相关注释。
   - 风险核查点：删除前确认 `login-page` / `login-card` / `login-eyebrow` 等类无其他引用。

3. **文案迁移到 props，提交动作链原样保留**
   - 原 eyebrow（RESTRICTED ACCESS）、标题（管理后台登录）、副标题迁移为 Login 的 `brand.name`/`title`/`subtitle` 等 props；`onSubmit` 动作链（request → token 判空 → message → app.reload）原样保留，仅字段来源从 `${event.username}` 保持不变（Login 抛出同名 values）。

4. **布局澄清规则写进 SKILL.md 红线/流程**
   - 布局选择是产品决策。规则：原型明确指定布局（文字或视觉可判定）→ 直接用；未明确 → AskUserQuestion 列出 5 种 layout + 关键修饰（含效果简述）；用户不答 → 默认 `split` + `authVariant: card`（即模板默认形态）。

## Risks / Trade-offs

- [删除 login.css 误伤其他页面] → 其作用域注释声明仅限 `.login-page`，实施时全局 grep 类名确认零引用后再删
- [模板登录页视觉基线变化（渐变外壳 → 组件默认 split 视觉）] → 组件视觉即新标准；实施后用浏览器验收登录页深浅色渲染
- [骨架与 Login 组件 props 漂移] → login.yaml 注释指向 `ui-login-component` spec 与组件源码为权威
