# @pactor/permission

[Pactor](https://github.com/426-330/pactor) 的权限模块：权限码集合存储（PermissionStore）、适配 @pactor/runtime 的权限适配器、Menu / Page 守卫纯函数与表达式函数 `permission(code)`。

浏览器只持有 Permission Set，DSL 中不出现 Role；前端权限只控制 UI（隐藏 / 禁用 / 拦截），后端必须再次鉴权。

## 安装

```bash
npm install @pactor/permission
# 或
pnpm add @pactor/permission
```

零运行时依赖（仅 @pactor/core 类型），不依赖 React 与 @pactor/runtime，可纯 Node 使用与测试。

## 示例

```ts
import {
  PermissionStore,
  createPermissionAdapter,
  createPermissionFunction,
  filterMenusByPermission,
  checkPagePermission,
} from '@pactor/permission';

// bootstrap 阶段一次性注入权限码集合
const store = new PermissionStore();
store.setPermissions(['customer:view', 'customer:edit']);

// 1. 注入 @pactor/runtime（结构化兼容 PermissionAdapter）
const runtime = createPageRuntime(pageDsl, {
  permission: createPermissionAdapter(store),
});
// - 节点 permission: 'customer:edit' 无权限时默认隐藏；
// - permission: { code: 'customer:edit', denied: 'disabled' } 时注入 disabled: true；
// - 动作配置无权限的 permission 时被 Action 引擎拦截（{ ok: false }）。

// 2. Menu / Page 守卫（纯函数）
const menus = filterMenusByPermission(rawMenus, store);
const canEnter = checkPagePermission(pageMeta, store);

// 3. 表达式函数（注入求值 options.functions 或作用域）
const functions = { permission: createPermissionFunction(store) };
// 支持 `${!permission('customer:edit')}` 形式

// 4. 权限变更通知
const off = store.subscribe(() => {/* 重新过滤菜单等 */});
```

## 功能一览

- **PermissionStore**：`setPermissions(codes)`（整体替换）/ `clear()` / `has(code)` / `hasAny(codes)` / `hasAll(codes)` / `subscribe(listener)`（返回退订函数）。V1 精确匹配，不做通配符。
- **`createPermissionAdapter(store)`**：结构化兼容 @pactor/runtime 的 `PermissionAdapter`，`check` 支持 string / string[]（hasAny）/ `{ code, denied }` 三种配置形态（对象形式只判定 `code`）。
- **`resolvePermissionCheck(config, checker)`**：三种形态归一为 `{ allowed, denied }`（denied 缺省 `'hidden'`，未配置 permission 视为放行），Renderer 与 Guards 复用同一逻辑。
- **`filterMenusByPermission(menus, checker)`**：递归移除无权限菜单项与空目录，不修改原数组，泛型保持菜单项类型。
- **`checkPagePermission(page, checker)`**：页面无 permission 字段时放行。
- **`createPermissionFunction(store)`**：返回 `(code: string) => boolean`，作为白名单函数注入表达式求值。

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
