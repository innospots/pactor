# Tasks: add-radix-theme

## 1. token 层与默认皮肤

- [x] 1.1 styles.css 重写：色板 token（accent=#3C47DD 刻度、slate 刻度、语义实体色）+ 语义 token + 形状 token（radius/shadow/font/focus-ring）
- [x] 1.2 全部 `.pcr-*` 组件规则改经 `var(--pcr-*)` 取值并补齐状态反馈（按钮全态/表单 focus+错误/表格条纹悬停/卡片阴影/Modal/Drawer data-state 动画/Tabs 激活/菜单悬停激活/Toast 四态/排版阶梯）
- [x] 1.3 `[data-pactor-theme='dark']` 全套 token 暗色覆盖

## 2. 测试

- [x] 2.1 新增 theme 测试：token 存在、dark 块覆盖、组件规则区无硬编码 hex
- [x] 2.2 既有 ui-radix 92 个测试与全仓测试零回归

## 3. 文档

- [x] 3.1 新增 docs/src/content/docs/guides/theming.md（三种换肤方式、完整 token 清单、Radix Colors 定制工具配合、暗色切换示例）；侧边栏「指南」组加入
- [x] 3.2 ui-radix.md 样式章节更新为指向主题指南；README（ui-radix）同步

## 4. 视觉验证

- [x] 4.1 启动 examples/admin dev server，playwright 截图 dashboard 与 customer-list（light + dark），主代理读图确认
- [x] 4.2 验证后停止示例 dev server

## 5. 验收

- [x] 5.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 5.2 `pnpm docs:build` 通过；重启 docs dev server 验证新页面
