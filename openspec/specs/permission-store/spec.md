# Spec: permission-store

权限码集合的存储、查询、订阅与表达式函数（`@pactor-app/permission`）。浏览器只持有 Permission Set，DSL 不出现 Role。

### Requirement: PermissionStore

SHALL 提供 `PermissionStore`：`setPermissions(codes)`（整体替换）、`clear()`、`has(code)`、`hasAny(codes)`、`hasAll(codes)`、`subscribe(listener)`（返回退订函数）。`has` 对未设置的权限码 MUST 返回 `false`。MUST 不依赖 React 与 @pactor-app/runtime。

#### Scenario: 设置并查询权限

- **WHEN** `setPermissions(['customer:view', 'customer:edit'])`
- **THEN** `has('customer:view')` 为 true，`has('customer:delete')` 为 false，`hasAny(['customer:edit', 'x'])` 为 true，`hasAll(['customer:view', 'customer:edit'])` 为 true

#### Scenario: 替换与清空

- **WHEN** 再次 `setPermissions(['a'])` 后查询此前的权限码
- **THEN** 旧权限码 `has` 返回 false；`clear()` 后所有查询为 false

#### Scenario: 订阅通知

- **WHEN** 订阅后调用 `setPermissions` 或 `clear`
- **THEN** listener 被调用；退订后不再调用

### Requirement: Runtime 权限适配器

SHALL 提供 `createPermissionAdapter(store)`，返回结构化兼容 @pactor-app/runtime `PermissionAdapter` 的对象：`check(permission)` 支持 string / string[] / `{ code, denied }` 三种配置形态，数组语义为 hasAny，对象形式只判定 `code`。

#### Scenario: 三种形态检查

- **WHEN** store 含 `customer:edit`，分别 check `'customer:edit'`、`['x', 'customer:edit']`、`{ code: 'customer:edit', denied: 'disabled' }`
- **THEN** 三者均返回 true；store 不含时均返回 false

#### Scenario: 与 runtime Action 引擎集成

- **WHEN** PageRuntime 注入该 adapter，动作配置无权限的 permission
- **THEN** 动作被拦截返回 `{ ok: false }`

### Requirement: 权限表达式函数

SHALL 提供 `createPermissionFunction(store)` 返回 `(code: string) => boolean`，可作为白名单函数注入表达式求值，支持 `${!permission('customer:edit')}` 形式。

#### Scenario: 表达式中求值权限

- **WHEN** 以该函数作为 `permission` 白名单求值 `!permission('customer:edit')`
- **THEN** store 含该权限码时结果为 false，不含时为 true
