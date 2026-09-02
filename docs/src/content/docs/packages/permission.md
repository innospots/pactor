---
title: "@pactor-app/permission"
description: 权限模块——PermissionStore、Runtime 权限适配器、Menu / Page 守卫与表达式函数 permission(code)
---

`@pactor-app/permission` 实现四层权限模型（Menu / Page / Component / Action）的浏览器端部分：权限码集合存储、适配 @pactor-app/runtime 的权限适配器、Menu / Page 守卫纯函数，以及表达式函数 `permission(code)`。

```bash
pnpm add @pactor-app/permission
```

零运行时依赖（仅 @pactor-app/core 类型），不依赖 React 与 @pactor-app/runtime，可纯 Node 使用与测试。浏览器只持有 Permission Set，DSL 中不出现 Role；前端权限只控制 UI（隐藏 / 禁用 / 拦截），**后端必须再次鉴权**。

## PermissionStore

```ts
import { PermissionStore } from '@pactor-app/permission';

const store = new PermissionStore();

// bootstrap 阶段一次性注入权限码集合（整体替换）
store.setPermissions(['customer:view', 'customer:edit']);

store.has('customer:view');              // true
store.has('customer:delete');            // false
store.hasAny(['customer:edit', 'x']);    // true（任一命中）
store.hasAll(['customer:view', 'customer:edit']); // true（全部命中）

store.clear();                           // 清空

const off = store.subscribe(() => {
  // setPermissions / clear 时触发；返回退订函数
});
```

当前版本为精确匹配，不做通配符（`customer:*`）匹配；权限在 bootstrap 阶段一次性设置，不做异步加载。

## 权限配置的三种形态

@pactor-app/core 的 `PermissionConfig` 支持三种形态：

```ts
'customer:edit'                                      // 单个权限码
['customer:edit', 'customer:view']                   // 数组，任一命中即放行（hasAny）
{ code: 'customer:edit', denied: 'disabled' }        // 对象形式：code + 无权限处理策略
```

`denied` 策略仅对 Component 层有意义：`'hidden'`（缺省，不渲染）/ `'disabled'`（注入 `disabled: true`）/ `'readonly'`（注入 `readOnly: true`）。

`resolvePermissionCheck(config, checker)` 把三种形态归一为 `{ allowed, denied }`（denied 缺省 `'hidden'`，未配置 permission 视为放行），是 Guards 与适配器共用的解析逻辑。`checker` 为结构化接口 `{ hasAny(codes): boolean }`，PermissionStore 天然满足。

## Runtime 权限适配器（Component / Action 层）

```ts
import { createPageRuntime } from '@pactor-app/runtime';
import { createPermissionAdapter } from '@pactor-app/permission';

const runtime = createPageRuntime(pageDsl, {
  permission: createPermissionAdapter(store),
});
```

`createPermissionAdapter(store)` 结构化兼容 @pactor-app/runtime 的 `PermissionAdapter`（本包不 import runtime 的任何运行时值，类型兼容性由编译期断言锁定）。注入后：

- **Component 层**：Renderer 渲染节点前检查 `node.permission`——无权限时按 denied 策略处理：`hidden` 渲染 null（默认）、`disabled` 注入 `disabled: true`、`readonly` 注入 `readOnly: true`；权限注入的 prop 优先于 DSL props 中的同名字段。有权限或未配置 permission 时行为不变。
- **Action 层**：动作配置无权限的 permission 时被 Action 引擎拦截，返回 `{ ok: false }`（denied 策略对动作无意义，对象形式只判定 `code`）。

:::note
`disabled` / `readOnly` prop 并非所有组件都支持，组件适配层自行映射。不接入 @pactor-app/permission 时（默认适配器放行）行为完全不变。
:::

## Menu / Page 守卫（纯函数）

```ts
import {
  filterMenusByPermission,
  checkPagePermission,
} from '@pactor-app/permission';

// Menu Guard：递归移除无权限菜单项；children 全被移除的空目录一并移除；
// 不修改原数组，泛型保持菜单项类型
const menus = filterMenusByPermission(rawMenus, store);

// Page Guard：页面元信息含 permission 时判定是否放行；无 permission 字段放行
if (!checkPagePermission(pageMeta, store)) {
  // 跳转 403 / 登录
}
```

本包不实现菜单与路由本身——router / layout 模块消费这两个纯函数。

## 表达式函数

```ts
import { createPermissionFunction } from '@pactor-app/permission';

const permission = createPermissionFunction(store); // (code: string) => boolean
```

可注入 @pactor-app/expression 的求值作用域（或经 `options.functions` 白名单），支持 `${!permission('customer:edit')}` 形式：

```ts
import { evaluateExpression } from '@pactor-app/expression';

evaluateExpression("!permission('customer:edit')", { permission }); // 有权限时为 false
```

:::note
PageRuntime 不把 `permission` 函数自动注入表达式作用域——是否注入由上层组合层（@pactor-app/app）决定，本包不改变 PageRuntime 的既有行为。
:::
