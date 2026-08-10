# Design: add-permission-module

## Context

四层权限模型（设计文档第 38–43 节）：Menu / Page / Component / Action。现状：pactor-runtime 的 Action 引擎已消费 `PermissionAdapter`（默认放行），但 Renderer 忽略节点 `permission`；pactor-core 的 `PermissionConfig = string | string[]` 不支持第 41 节的对象形式。浏览器只持有 Permission Set，DSL 不出现 Role（第 43 节）。

约束：

- 前端权限只控制 UI（隐藏/禁用/拦截），后端必须再次鉴权（第 3.5 节）。
- 向后兼容：不接入 pactor-permission 时（默认适配器）行为完全不变。
- pactor-permission 本身零依赖（仅 pactor-core 类型），可纯 Node 测试；它"实现"runtime 的适配接口但**不依赖 pactor-runtime**（适配器是结构性接口，避免 permission → runtime 依赖导致上层组合困难；接口签名以 runtime 的 PermissionAdapter 为准做结构化兼容）。

## Goals / Non-Goals

**Goals:**

- PermissionStore：权限码集合 + has/hasAny/hasAll + setPermissions/clear + subscribe。
- `createPermissionAdapter(store)`：结构化兼容 runtime PermissionAdapter。
- Menu/Page Guard 纯函数。
- Renderer 的 Component 权限处理（hidden/disabled/readonly）。
- 表达式函数 `permission(code)` 工厂。
- core `PermissionConfig` 类型拓宽。

**Non-Goals:**

- 不实现菜单/路由本身（router/layout 模块消费这里的纯函数）。
- 不做权限码的通配符（`customer:*`）匹配——V1 精确匹配，通配留待有真实需求时加。
- 不做权限的异步加载（bootstrap 时一次性 setPermissions）。

## Decisions

### D1: PermissionStore 极简实现

```ts
class PermissionStore {
  setPermissions(codes: string[]): void
  clear(): void
  has(code): boolean
  hasAny(codes): boolean
  hasAll(codes): boolean
  subscribe(listener): () => void
}
```

内部 `Set<string>`；`has` 对空集合返回 false；数组语义：组件/动作配置数组 = hasAny（与 core 注释一致："任一命中即可"）。

### D2: PermissionConfig 对象形式拓宽（pactor-core）

```ts
type PermissionDeniedStrategy = 'hidden' | 'disabled' | 'readonly';
type PermissionConfig =
  | string
  | string[]
  | { code: string | string[]; denied?: PermissionDeniedStrategy };
```

向后兼容的联合类型拓宽；core 补充类型测试。

### D3: 权限解析与检查集中在 pactor-permission 的纯函数

`resolvePermissionCheck(config, store): { allowed: boolean; denied: PermissionDeniedStrategy }`——统一处理三种形态（string / string[] / 对象），数组 hasAny，denied 缺省 `'hidden'`。Renderer 与 Guards 复用同一逻辑，避免各处重复解释配置形状。

为避免 permission → runtime 依赖，该函数接受结构化接口 `{ hasAny(codes): boolean }` 而非 runtime 类型。

### D4: Renderer 集成（pactor-runtime 扩展）

- 渲染节点时读取 `node.permission`，经 context.permission（PermissionAdapter）检查：无权限 → 按 denied 策略：hidden → 返回 null；disabled → 给组件注入 `disabled: true`（与 DSL props 合并，权限注入优先）；readonly → 注入 `readOnly: true`。
- PermissionAdapter 接口需要支持对象形式检查：现状为 `check(permission): boolean`。扩展为 `check(permission: PermissionConfig): boolean`——runtime 内部把对象形式归一为"检查 code"，denied 策略由 Renderer 解释（adapter 只管"有没有权限"）。默认适配器照旧放行。
- pactor-permission 的 `createPermissionAdapter(store)` 结构化兼容该签名。

### D5: Guards 为纯函数

- `filterMenusByPermission<T extends { permission?: PermissionConfig; children?: T[] }>(menus, checker): T[]`——递归过滤无权限菜单项（children 全被过滤的空目录也移除）。
- `checkPagePermission(page: { permission?: PermissionConfig }, checker): boolean`——无 permission 字段放行。
- `checker` 参数为结构化接口；同时提供直接接受 store 的重载/便捷封装。

### D6: 表达式函数

`createPermissionFunction(store): (code: string) => boolean`——用于 runtime 求值 options.functions 或 scope 注入，支持 `${!permission('customer:edit')}`。用法写入文档；PageRuntime 集成（自动注入 `permission` 函数到作用域）留待 pactor-app 组合层决定，本包不修改 PageRuntime 的既有行为。

## Risks / Trade-offs

- [disabled/readonly 注入的 prop 名并非所有组件都支持] → V1 约定注入 `disabled` / `readOnly`，组件适配器自行映射；文档注明。
- [权限变化后已渲染页面不自动刷新] → store 提供 subscribe；Renderer 暂不把 permission 纳入订阅（state/data 变化已触发重渲染时会重新检查）。权限在 bootstrap 阶段一次性设置，运行期变化场景少，接受。
- [结构化兼容而非直接依赖 runtime 类型，可能签名漂移] → 在 permission 包测试中引入 pactor-runtime 类型做编译期断言（devDependency，不产生运行时依赖）。

## Migration Plan

无（core 类型拓宽与 runtime 行为均为向后兼容）。顺序：core 类型 → runtime Renderer → permission 包 → 文档。

## Open Questions

- 通配符权限码（`customer:*`）：V1 不做。
- Action 权限的现状语义（engine 内 check）是否也按 hasAny：检查并统一，测试锁定。
