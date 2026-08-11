# Tasks: add-layout-module

## 1. 包骨架

- [x] 1.1 创建 `packages/layout`：dependencies `pactor-core`/`pactor-router`/`pactor-permission` workspace:*，peerDeps `react >=18`/`antd >=5`，devDeps antd + react 测试栈；tsconfig（jsx）、tsup、LICENSE、README、tests/setup.ts；`pnpm install` 成功

## 2. AdminLayout（spec: admin-layout）

- [x] 2.1 菜单转换工具：MenuRegistry 可见树 → antd Menu items（group/disabled 映射）+ 权限过滤接入
- [x] 2.2 菜单链工具 findMenuChain（供 Breadcrumb）
- [x] 2.3 AdminLayout 主体：Header（brand + headerExtra）/ Sidebar / 内容出口 / 布局开关
- [x] 2.4 选中态（route.activeMenu）与点击导航（bridge.push，link/external 新窗口）
- [x] 2.5 Breadcrumb 渲染
- [x] 2.6 Tabs：访问页签（去重、点击导航、关闭、关闭当前回退导航）

## 3. 基础布局与注册表（spec: basic-layouts）

- [x] 3.1 BlankLayout
- [x] 3.2 LoginLayout（center/split + brand，不含认证逻辑）
- [x] 3.3 LandingLayout（navbar/footer 插槽）
- [x] 3.4 LayoutRegistry：createLayoutRegistry 预注册四种 + resolveLayout 未命中回退 BlankLayout

## 4. 测试

- [x] 4.1 组件测试覆盖两个 spec 全部 scenario（jsdom + antd + MemoryNavigation + MenuRegistry）

## 5. 验收与文档

- [x] 5.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 5.2 文档站新增 `packages/layout.md`，侧边栏与快速开始模块表同步，`pnpm docs:build` 通过
