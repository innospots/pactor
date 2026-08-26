# example-admin

Pactor 管理后台示例：纯前端可跑（无后端）——页面 DSL 本地 `.page.yaml` 导入（`pactor-vite-plugin` 构建期 Parse → Validate → Compile），bootstrap 与数据均为内存 mock。

## 启动

```bash
pnpm install
pnpm --filter example-admin dev    # vite dev，端口 5199
pnpm --filter example-admin build  # 构建（插件构建期强校验全部页面 YAML）
```

打开 <http://localhost:5199/>，以演示账号 **admin / pactor123** 登录。

## 技术要点

- `src/main.tsx`：`createPactorApplication` + `StaticDslLoader`（bootstrap + 页面 import）+ `options.services` 注入 mock 服务；默认 shadcn UI kit（pactor-ui，唯一内置实现），导入 `pactor-ui/styles.css`。未登录/已登录的路由守卫（整页跳转）也在此——认证跳转属于应用外壳职责，在 DSL 之外。
- `src/auth.ts`：本地会话读写（localStorage `example-admin.session`），演示账号写死于此。
- `src/bootstrap.ts`：`createBootstrap()` 按当前会话返回两种形态——未登录：`login` 布局 + 仅 `/login` 菜单；已登录：`admin` 布局 + 业务菜单/权限。
- `src/services.ts`：`auth.login` / `auth.logout`（500ms 延迟）+ 内存 customer mock（`customer.list` 关键词过滤 / `customer.detail` / `customer.update`，约 300ms 延迟）。
- `src/pages/*.page.yaml`：页面 DSL，构建期经 `validatePageDsl` 强校验。

## 演示点清单

- **登录全流程**：`/login` 使用框架内置 `login` 布局（品牌区 + 居中卡片）；密码框为 `Input` 的 `type: password` 掩码；提交 → `setState submitting` + `loading: ${state.submitting}` 让登录按钮进入 loading（并禁用防重复提交）→ `service.call auth.login` → 成功写会话并 `app.reload`（整页重载，bootstrap 重取）到 `/`；失败 toast 错误；必填校验拦截空提交。
- **布局随会话切换**：同一应用，未登录 bootstrap 返回 `login` 布局，已登录返回 `admin` 布局——布局类型由 bootstrap 决定（`layout.type`），这是框架的多布局切换方式。
- **退出登录**：dashboard"退出登录"→ `auth.logout` 清会话 → `app.reload /login`。
- **admin 布局**：页签（tabs）与面包屑（breadcrumb）开启；切换菜单观察页签累积与面包屑变化。
- **菜单权限过滤**：侧边菜单无"系统设置"项（permissions 不含 `system:admin`）；直接访问 `/settings` 渲染 403（菜单仅做展示过滤，路由守卫由 `DynamicDslRoute` 的 permissionChecker 判定）。
- **group 菜单**："客户管理"为分组，含"客户列表"子项。
- **隐藏详情页**：访问 `/customers/1/edit` 渲染编辑页，菜单高亮"客户列表"（`hidden: true` + `activeMenu`）。
- **表达式绑定**：dashboard 的 `${user.name}` / `${app.name}` / `${data.stats.*}`。
- **service 数据源**：列表页 Table 经 `customer.list` mock 加载（`dataSource: ${data.customers}`）。
- **Form 查询链路**：输入关键词提交 → `setState` + `reload` → 数据源以新 keyword 重新加载（感受 300ms 模拟延迟）。
- **cell 行模板 + overlay.open**：行内"编辑"打开抽屉（drawer），内嵌表单；行数据经 `params` 注入抽屉作用域（`${params.name}`），字段级 `value` 回填现值。
- **表单联动**：抽屉表单命名 `name: edit`（页面查询表单占用 default）；省份 Select 的 `onChange` → `form.setValues` 清空城市 + `setState` 查 `cityMap` 更新城市选项（`${state.cityMap[event]}` 计算成员访问）；打开抽屉前先按行数据初始化 cityOptions。
- **命名动作结果链路**：抽屉表单提交 → `service.call`（`id: updateResult`）→ 成功 `overlay.close { success: true }` → `if ${actions.editResult.success}` → reload 列表 + 成功 message；直接关闭抽屉（X / 遮罩 / Escape）为取消语义，不 reload。
- **navigate**：编辑页（`/customers/:id/edit`）提交成功后 `navigate` 回列表；"返回列表"按钮同。
- **route.params 驱动**：编辑页 detail 数据源入参 `${route.params.id}`。
- **组件权限 denied**：行内"删除"按钮配置 `permission: { code: 'customer:delete', denied: 'disabled' }`，因未授权以禁用态呈现。
- **自定义动作扩展**：`service.call`（写操作调 ServiceRegistry）与 `app.reload`（整页重载，供登录/登出后重取 bootstrap）均经 `options.actions` 注册——框架暂无内置"调用服务"动作（`request` 仅走 HTTP 出口），这是示例侧的扩展点用法。

## 已知限制

- 会话仅存 localStorage，刷新页面保持登录；无 token 过期/刷新逻辑（演示从简）。
