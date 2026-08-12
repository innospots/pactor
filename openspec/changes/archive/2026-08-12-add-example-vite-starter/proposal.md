# Proposal: add-example-vite-starter

## Why

`pactor-vite-plugin` 是框架"YAML 即模块"工作流的入口（构建期校验 + HMR），但现有两个 admin 示例把它淹没在登录/路由/权限/双 kit 的复杂度里，新用户缺少一个最小可运行的上手工程看清这条链路。

## What Changes

- 新增 `examples/vite-starter`（包名 `example-vite-starter`，private，端口 **5499**）：最小 pactor 应用——vite + pactor-vite-plugin + pactor-app（默认 Radix kit），单页面 `*.page.yaml` 演示组件、表单提交、service 数据源与 HMR 工作流。
- README 聚焦插件工作流：yaml 模块导入、构建期校验报错形态、`dsl-modules.d.ts` 声明、HMR。

## Capabilities

### New Capabilities

- `example-vite-starter`: 最小 vite-plugin 上手示例工程（examples/vite-starter），可启动可构建可验证。

### Modified Capabilities

（无）

## Impact

- 新增：`examples/vite-starter/**`；workspace 成员（pnpm-workspace.yaml 已含 `examples/*`）。
- 依赖：pactor-app / pactor-resource / pactor-vite-plugin（workspace），react ^19。
- 根 README 工程结构补登。
- 不影响任何现有包代码。
