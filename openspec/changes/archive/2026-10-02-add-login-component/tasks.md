# Tasks

## 1. 组件骨架

- [x] 1.1 新建 `packages/ui/src/components/business/Login/index.tsx`：LoginProps 类型（layout / brand / title / subtitle / 字段文案 / submitText / registerLink / forgotLink / footer / className / style / onSubmit / onRegisterClick / onForgotClick）
- [x] 1.2 实现 4 种布局结构（split / split-card 默认 / centered-card / centered-plain）：品牌区 + 认证区容器关系、表单区 320–420px、窄屏单列降级（md 断点，品牌区收缩）
- [x] 1.2b 扩展为 10 种布局（覆盖设计文档 01–09、11、12，除扫码 10）：新增 split-card-float / split-wide / brand-card / overlap / backdrop / reverse-split；overlap 窄屏取消重叠，reverse-split 品牌面板不重复 logo 行
- [x] 1.3 认证区内部复用 ui 的 `Form` + `Input` + `Button`：username/password 字段（label/placeholder/rules 文案可覆盖）、提交按钮 `submit: true`，校验通过触发 `onSubmit(values)`
- [x] 1.4 辅助入口与页脚：registerLink/forgotLink 有 href 渲染 Link，否则触发对应事件；footer 弱化样式；未配置的元素不渲染
- [x] 1.5 全部样式用语义令牌（深浅色/换肤自适应），缺省文案接入 i18n（`pactor.login.*`，props 优先）

## 2. 注册与导出

- [x] 2.1 `packages/ui/src/components/register.ts` 注册 DSL type `Login`
- [x] 2.2 `packages/ui/src/components/index.ts` 导出 `Login` 与 `LoginProps`

## 3. 测试

- [x] 3.1 新增 `packages/ui/tests/components/login.test.tsx`：10 种布局渲染、overlap 双卡结构、reverse-split 品牌面板位置、brand/文案 props 透传、默认插画（缺省/替换/隐藏）、未配置元素不渲染、必填校验阻止提交、onSubmit 抛出 values、辅助入口 href/事件两种行为
- [x] 3.2 `pnpm --filter @pactor-app/ui test` 与 `build` 全绿

## 4. DSL 验证

- [x] 4.1 在 examples/next-app-example 临时登录页用 `type: Login` 替换手写结构，浏览器验证渲染、校验、提交事件闭环（验证后可保留为示例）
