# Tasks: add-login-page-template

## 1. 模板登录页改造

- [x] 1.1 改造 `skills/pactor-prd/template/src/server/yaml/common/login.yaml`：body 改为 `type: Login`（`layout: split` 默认修饰 + 品牌区/标题/副标题 props 承接原文案），`events.onSubmit` 保留 request（POST /api/auth/login）+ `${actions.loginResult.token}` 判空 + 失败 message error / 成功 message + app.reload 动作链
- [x] 1.2 `sitemap.yaml`：`login` 布局简化为纯 PageOutlet（去掉 `login-page` 渐变外壳 Flex）
- [x] 1.3 全局确认 `login-page` / `login-card` / `login-eyebrow` / `login-heading` / `login-subtitle` 零残留后，删除 `app/login.css` 并移除 `app/layout.tsx` 的引入与相关注释
- [x] 1.4 校验：yaml 解析零错误；`pnpm build` 通过；启动后浏览器实测 /login 深浅色渲染、校验失败提示、错误账号提示、admin/pactor123 登录跳转闭环

## 2. 技能规则与文档

- [x] 2.1 SKILL.md 增加登录页规则：PRD 含登录页且原型未明确布局 → AskUserQuestion 列出 5 种 layout（附效果简述）+ 关键修饰项，用户不答默认 split + card；生成时以模板 `common/login.yaml` 为样板
- [x] 2.2 `references/page-templates.md` 增加登录页模板小节：指向模板登录页，列出 layout / brand / 文案 / 辅助入口 / footer 可配置项
- [x] 2.3 `node scripts/validate-skills.mjs` 通过
