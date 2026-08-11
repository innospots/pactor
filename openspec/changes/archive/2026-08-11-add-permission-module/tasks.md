# Tasks: add-permission-module

## 1. pactor-core 类型拓宽

- [x] 1.1 `PermissionConfig` 扩展为 `string | string[] | { code: string | string[]; denied?: 'hidden' | 'disabled' | 'readonly' }`，导出 `PermissionDeniedStrategy`
- [x] 1.2 core 类型测试补充对象形式；`pnpm --filter pactor-core test / build / typecheck` 通过

## 2. pactor-runtime Renderer 集成

- [x] 2.1 PermissionAdapter 的 `check` 签名支持三种 PermissionConfig 形态（对象形式只判定 code），默认适配器行为不变
- [x] 2.2 Renderer 渲染前检查 `node.permission`：hidden → null、disabled → 注入 `disabled: true`（优先于 DSL props）、readonly → 注入 `readOnly: true`
- [x] 2.3 组件测试：默认隐藏、disabled 策略及优先级、readonly、有权限正常渲染、默认适配器行为不变
- [x] 2.4 检查 Action 引擎 permission 检查的数组语义与 hasAny 一致（不一致则修正），测试锁定
- [x] 2.5 `pnpm --filter pactor-runtime test / build / typecheck` 通过，既有 77 个测试不回归

## 3. pactor-permission 包

- [x] 3.1 包骨架：`packages/permission`（`pactor-permission`，dependencies 仅 `pactor-core` workspace:*，devDependency 加 `pactor-runtime` 仅用于类型兼容断言）、tsconfig、tsup、LICENSE、README
- [x] 3.2 `PermissionStore`：setPermissions/clear/has/hasAny/hasAll/subscribe
- [x] 3.3 `createPermissionAdapter(store)` + 三种形态归一纯函数（denied 缺省 hidden）
- [x] 3.4 `filterMenusByPermission`（递归、移除空目录、不改原数组）与 `checkPagePermission`
- [x] 3.5 `createPermissionFunction(store)` 表达式函数
- [x] 3.6 单测：store 全部行为、adapter 三形态、guards、表达式函数求值、与 runtime PermissionAdapter 的编译期类型兼容断言

## 4. 验收与文档

- [x] 4.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 4.2 文档站新增 `packages/permission.md`，侧边栏与快速开始模块表同步，`pnpm docs:build` 通过
