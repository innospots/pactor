# Tasks: migrate-ui-base-ui

## 1. 依赖与组件层

- [x] 1.1 packages/ui：新增 `@base-ui/react`（^1.7.0），移除 9 个 `@radix-ui/react-*` 依赖；pnpm install 更新 lockfile
- [x] 1.2 重 vendor 组件（以官方 Base UI 版源码为准，保留 data-slot 与导出契约）：button（asChild→render 封装）、accordion、dialog、popover、select、tabs、separator、label（原生 label）

## 2. 适配层与样式

- [x] 2.1 Form 去原语化（design D3）：Form/Input/Select 适配件改原生 form/div/label + useId 关联，契约语义不变（校验拦截/form 作用域/onValuesChange 首参/initialValues 优先级）
- [x] 2.2 admin 布局与交互层适配：Accordion/Popover 用法、OverlayHost Dialog、Select 的 items 映射（含"未渲染 item 的选中 label"场景）
- [x] 2.3 styles.css：accordion 动画机制替换为 base 版；弹层动画类跟随官方源码；评估 tw-animate-css 去留

## 3. 测试与回归

- [x] 3.1 packages/ui 既有测试修复/适配至全绿（data-slot 断言不变）；补 Base UI 特有行为测试（Select label 映射、折叠菜单 flyout）
- [x] 3.2 三示例 playwright 截图回归：admin（手风琴/flyout/Tabs/Select/Dialog/登录校验/暗色）、chat、vite-starter；MEMORY 坑 #7（body 滚动锁）重验
- [x] 3.3 全仓测试 + typecheck + 构建全绿；grep 确认零 `@radix-ui` 残留

## 4. 收尾

- [x] 4.1 文档更新：packages/ui README、docs/packages/ui.md、framework-design.md 中 Radix 表述；MEMORY.md 坑位清理（#7、Radix Select 坑）
- [x] 4.2 spec 卫生：主 specs 中 unify-ui-shadcn 遗留的失效"双 kit / pactor-ui-radix"表述清理（admin-layout/form-container/overlay-host/example-admin/dsl-cli 的相关条款按现状改写）
- [x] 4.3 spec 同步（ui-kit-shadcn-preset 包结构需求）与归档
