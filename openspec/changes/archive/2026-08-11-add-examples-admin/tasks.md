# Tasks: add-examples-admin

## 1. 工程骨架

- [x] 1.1 创建 `examples/admin`（可用 `node packages/cli/dist/cli.js create` 起步或手写）：package.json（example-admin，private）、vite.config.ts（react + pactor()，端口 5199）、index.html、tsconfig
- [x] 1.2 pnpm-workspace.yaml 加入 `examples/*`；`pnpm install` 成功

## 2. 模拟层

- [x] 2.1 `src/bootstrap.ts`：app/user/permissions（含 customer:view/edit，不含 customer:delete/system:admin）/menus（group + hidden 详情页 + settings 未授权项）/layout（admin + tabs + breadcrumb）
- [x] 2.2 `src/services.ts`：内存 customer.list/detail/update mock（延迟模拟）
- [x] 2.3 `src/main.tsx`：createPactorApplication + StaticDslLoader（bootstrap + 页面 imports）+ services + `pactor-ui-radix/styles.css`

## 3. 页面 DSL（src/pages/*.page.yaml）

- [x] 3.1 dashboard：Grid + Statistic + Alert + Tabs + 表达式
- [x] 3.2 customer-list：Form 查询 + Table（service 数据源 + cell 行模板）+ overlay.open 抽屉编辑（成功后 reload + message）+ 删除按钮 denied disabled
- [x] 3.3 customer-edit：route.params 驱动 + 提交 navigate 返回

## 4. 验收与文档

- [x] 4.1 `pnpm --filter example-admin build` 通过；`pnpm -r --if-present build/test/typecheck` 不受影响
- [x] 4.2 示例 README（启动方式 + 演示点清单）；getting-started 加示例小节；根 README 工程结构补 examples
- [x] 4.3 暴露的框架问题（如有）记录汇报，不修改既有包
