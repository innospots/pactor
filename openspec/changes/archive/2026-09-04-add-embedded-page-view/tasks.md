# Tasks: add-embedded-page-view

## 1. 组装内核抽取（@pactor-app/app）

- [x] 1.1 从 `application.ts` 抽出共用装配：组件/动作/服务/能力 registries 合并、UI kit 预设解析、交互层组件对（Provider/OverlayHost）、i18n 上下文组装为独立内部函数
- [x] 1.2 `createPactorApplication` 改为调用该内核（行为不变，现有测试全绿）

## 2. 嵌入式入口实现

- [x] 2.1 新建 `packages/app/src/embedded.tsx`：`PactorPage` 组件（`pageId` | `page`、`route` props、加载态/错误重试）+ `createPactorPage(options)` 工厂
- [x] 2.2 嵌入页组装：复用内核；`navigate` 动作注册为 `location.assign` 自然跳转；不 import react-router-dom
- [x] 2.3 `@pactor-app/ui` 新增 `Link` 组件（`href` / `text` / `target?` / children，渲染原生 `<a>`），注册进组件表并支持通用 props
- [x] 2.4 `packages/app/src/index.ts` 导出 `PactorPage` / `createPactorPage` 与相关类型

## 3. 测试

- [x] 3.1 PactorPage：pageId 经 loader 加载渲染、直接传 page、route params 进 `${route.params}` 作用域
- [x] 3.2 加载失败渲染错误页、重试后重新加载
- [x] 3.3 Link 组件渲染原生锚点（href / target）；嵌入模式 navigate 动作退化为 location.assign
- [x] 3.3.1 Link 加入通用 props 契约测试（common-props.test.tsx）
- [x] 3.4 交互层一致：confirm / message / overlay.open 在嵌入页可用
- [x] 3.5 多实例隔离：两个 PactorPage 实例 state 互不影响
- [x] 3.6 回归：整应用模式现有测试全部保持通过

## 4. 文档

- [x] 4.1 `docs/src/content/docs/guides/getting-started.md` 或新增嵌入指南：两种调用方式对比、Next.js / 存量 react-router 项目接入示例（Link / navigate 自然跳转写法、styles.css 引入注意点）
- [x] 4.2 `@pactor-app/app` README 补嵌入式用法

## 5. 验证

- [x] 5.1 `pnpm build && pnpm typecheck && pnpm test` 全绿
- [x] 5.2 `pnpm docs:build` 通过
