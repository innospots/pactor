# example-admin

Pactor 管理后台示例：纯前端可跑（无后端）——页面 DSL 本地 `.page.yaml` 导入（`pactor-vite-plugin` 构建期 Parse → Validate → Compile），bootstrap 与数据均为内存 mock。

## 启动

```bash
pnpm install
pnpm --filter example-admin dev    # vite dev，端口 5199
pnpm --filter example-admin build  # 构建（插件构建期强校验全部页面 YAML）
```

打开 <http://localhost:5199/>。

## 技术要点

- `src/main.tsx`：`createPactorApplication` + `StaticDslLoader`（bootstrap + 三个页面 import）+ `options.services` 注入 mock 服务；默认 Radix UI kit，导入 `pactor-ui-radix/styles.css`。
- `src/bootstrap.ts`：模拟服务端 bootstrap（app / user / permissions / menus / layout）。
- `src/services.ts`：内存 customer mock（`customer.list` 关键词过滤 / `customer.detail` / `customer.update`，约 300ms 延迟）。
- `src/pages/*.page.yaml`：页面 DSL，构建期经 `validatePageDsl` 强校验。

## 演示点清单

- **admin 布局**：页签（tabs）与面包屑（breadcrumb）开启；切换菜单观察页签累积与面包屑变化。
- **菜单权限过滤**：侧边菜单无"系统设置"项（permissions 不含 `system:admin`）；直接访问 `/settings` 渲染 403（菜单仅做展示过滤，路由守卫由 `DynamicDslRoute` 的 permissionChecker 判定）。
- **group 菜单**："客户管理"为分组，含"客户列表"子项。
- **隐藏详情页**：访问 `/customers/1/edit` 渲染编辑页，菜单高亮"客户列表"（`hidden: true` + `activeMenu`）。
- **表达式绑定**：dashboard 的 `${user.name}` / `${app.name}` / `${data.stats.*}`。
- **service 数据源**：列表页 Table 经 `customer.list` mock 加载（`dataSource: ${data.customers}`）。
- **Form 查询链路**：输入关键词提交 → `setState` + `reload` → 数据源以新 keyword 重新加载（感受 300ms 模拟延迟）。
- **cell 行模板 + overlay.open**：行内"编辑"打开抽屉（drawer），内嵌表单；行数据经 `params` 注入抽屉作用域（`${params.name}`）。
- **命名动作结果链路**：抽屉表单提交 → `service.call`（`id: updateResult`）→ 成功 `overlay.close { success: true }` → `if ${actions.editResult.success}` → reload 列表 + 成功 message；直接关闭抽屉（X / 遮罩 / Escape）为取消语义，不 reload。
- **navigate**：编辑页（`/customers/:id/edit`）提交成功后 `navigate` 回列表；"返回列表"按钮同。
- **route.params 驱动**：编辑页 detail 数据源入参 `${route.params.id}`。
- **组件权限 denied**：行内"删除"按钮配置 `permission: { code: 'customer:delete', denied: 'disabled' }`，因未授权以禁用态呈现。
- **自定义动作扩展**：`service.call`（写操作调 ServiceRegistry）经 `options.actions` 注册——框架暂无内置"调用服务"动作（`request` 仅走 HTTP 出口），这是示例侧的扩展点用法。

## 已知限制

- Form 组件暂无 `initialValues`，抽屉 / 编辑页表单不回填现值（字段留空则 mock 保持原值）；现值通过表单上方 Alert 展示。
