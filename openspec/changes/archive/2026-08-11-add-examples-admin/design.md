# Design: add-examples-admin

## Context

示例工程（设计文档第 7 节 examples/）。全部模块已就绪：pactor-app（默认 Radix kit）、pactor-vite-plugin（本地 YAML 导入）、pactor-cli（create 模板可作为起点）。示例需要无后端可跑——用 StaticDslLoader + 内存 Service mock。

约束：

- examples/admin 是 workspace 成员但 private、不发布；`pnpm -r build/test` 不能因它失败。
- 页面 DSL 必须是合法 YAML 且通过 `validatePageDsl`（vite 插件构建期会校验——这本身就是验收）。
- 不修改既有包；若示例暴露框架 bug，记录汇报而非顺手改框架。

## Goals / Non-Goals

**Goals:**

- 可 `pnpm --filter example-admin dev` 启动（端口 5199）、可 `build` 的完整 admin 示例。
- 覆盖：admin 布局（tabs/breadcrumb）、菜单（group/隐藏页/activeMenu/权限过滤）、表达式、service 数据源、Form/Table、cell 行模板、overlay.open/close、message、navigate、route.params、组件权限 denied。
- 文档同步。

**Non-Goals:**

- 真实后端、登录流程、chat/login/landing 示例、E2E 测试（Playwright 留后续）。

## Decisions

### D1: 结构

```
examples/admin/
  package.json        # example-admin, private; deps: pactor-app/pactor-ui-radix/pactor-vite-plugin/react 等
  vite.config.ts      # react() + pactor()，server.port 5199
  index.html
  src/
    main.tsx          # createPactorApplication + StaticDslLoader + 样式导入 + services 注册
    bootstrap.ts      # 模拟 bootstrap（app/user/permissions/menus/layout）
    services.ts       # 内存 customer 服务（list/detail/update，带延迟模拟）
    pages/
      dashboard.page.yaml
      customer-list.page.yaml
      customer-edit.page.yaml
```

- StaticDslLoader：`bootstrap` 字段 + `pages: { dashboard, 'customer-list', 'customer-edit' }`（值来自 `.page.yaml` import）。
- settings 页：只出现在菜单（permission `system:admin`），bootstrap permissions 不含它——菜单被过滤；同时验证直接访问路径的 403（menu 无权限项即使隐藏过滤后 findByPath 找不到→404 或 403——以实现行为为准并在 README 描述）。
- customer-edit：menus 中 `hidden: true, activeMenu: 'customer-list'`，验证隐藏页路由与面包屑高亮。

### D2: 服务 mock

`services.ts` 导出 `registerDemoServices(services: ServiceRegistry)`：`customer.list`（keyword 过滤 + 延迟 300ms）、`customer.detail`（by id）、`customer.update`（内存改写）。在 main.tsx 经 `options.services` 注入。

### D3: 页面 DSL 设计要点

- customer-list：Form（keyword Input + 查询按钮 submit）→ submit 时 setState keyword + reload customers；Table columns 含 cell 模板（编辑按钮 → overlay.open drawer 内嵌表单；删除按钮演示 permission denied disabled）。
- drawer 内表单：submit → request/service 更新 → overlay.close `{ success: true }` → if `${actions.editResult.success}` → reload + message。
- customer-edit：`${route.params.id}` 驱动 detail 数据源；提交后 navigate 回列表。

### D4: 验收

- `pnpm --filter example-admin build` 通过（vite 插件构建期校验所有 page.yaml——YAML 合法性由此保证）。
- `pnpm -r build/test/typecheck` 不因示例失败（example 无 test 脚本，用 --if-present）。
- README（示例内）写明启动方式与演示点清单。

## Risks / Trade-offs

- [示例首次真实串联全部模块，大概率暴露集成 bug] → 允许修示例侧 workaround 并汇报；框架侧 bug 记录清楚（最小复现），由主代理决定是否修。
- [vite dev 端口冲突] → 固定 5199。

## Migration Plan

无（全新目录）。可用 `node packages/cli/dist/cli.js create` 生成骨架后扩展，或手写（模板即由此而来）。

## Open Questions

- chat / login / landing 示例：后续各立小变更。
