# Proposal: add-permission-module

## Why

设计文档第 38–43 节定义了四层权限模型（Menu / Page / Component / Action）。pactor-runtime 已预留 `PermissionAdapter` 接口并被 Action 引擎消费，但：① 还没有真正的权限实现（默认适配器一律放行）；② Renderer 目前完全忽略节点的 `permission` 配置；③ pactor-core 的 `PermissionConfig` 只有 `string | string[]`，不支持第 41 节的对象形式（`{ code, denied: hidden|disabled|readonly }`）。本变更落地 `pactor-permission` 并补齐 core/runtime 的权限链路。前端权限只控制 UI，后端仍是安全边界（第 3.5 节）。

## What Changes

- **pactor-core（扩展，向后兼容）**：`PermissionConfig` 扩展为 `string | string[] | { code: string | string[]; denied?: 'hidden' | 'disabled' | 'readonly' }`。
- **pactor-runtime（扩展，向后兼容）**：Renderer 渲染前解析节点 `permission`——无权限时按 `denied` 策略处理：`hidden`（默认）渲染 null、`disabled` 注入 `disabled: true` prop、`readonly` 注入 `readOnly: true` prop；数组语义为 hasAny。
- **新增 `pactor-permission` 包**（`packages/permission`）：
  - `PermissionStore`：持有当前用户权限码集合（浏览器只拿 Permission Set，DSL 不理解 Role），实现 `has` / `hasAny` / `hasAll` / `setPermissions` / `clear` / `subscribe`。
  - `createPermissionAdapter(store)`：实现 pactor-runtime 的 `PermissionAdapter`，供 Action 引擎与 Renderer 使用。
  - 守卫辅助：`filterMenusByPermission(menus, store)`（Menu Guard）、`checkPagePermission(page, store)`（Page Guard）——纯函数，供后续 router/layout 使用。
  - `createPermissionFunction(store)`：表达式白名单函数 `permission('customer:edit')`，供表达式求值（如 `${!permission('customer:edit')}`）。
- 单元测试 + Renderer 权限渲染的组件测试。
- 文档站新增 pactor-permission 模块页。

## Capabilities

### New Capabilities

- `permission-store`: 权限码集合的存储、查询（has/hasAny/hasAll）、订阅与表达式函数。
- `permission-guards`: Menu 过滤、Page 校验、Runtime 适配器，以及 Component 层 denied 策略（hidden/disabled/readonly）渲染行为。

### Modified Capabilities

- `dsl-core-protocol`: `PermissionConfig` 类型扩展对象形式（向后兼容的拓宽）。
- `dsl-renderer`: Renderer 新增节点 permission 处理（此前忽略该字段）。

## Impact

- **新增代码**：`packages/permission`；**修改**：`packages/core`（类型拓宽）、`packages/runtime`（Renderer 权限处理 + 测试）。
- **无新运行时依赖**（纯 TypeScript，React 测试复用现有栈）。
- **兼容性**：`PermissionConfig` 拓宽向后兼容；Renderer 对未配置 permission 的节点行为不变；默认适配器仍放行，不接入 pactor-permission 时行为不变。
- **后续模块**：pactor-router（用 Page Guard）、pactor-layout（用 Menu Guard）。
