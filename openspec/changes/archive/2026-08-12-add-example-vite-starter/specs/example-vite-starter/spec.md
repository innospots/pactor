# Spec Delta: example-vite-starter（新增能力）

## ADDED Requirements

### Requirement: 可启动可构建

`example-vite-starter` SHALL 为 pnpm workspace 成员（private）：`pnpm --filter example-vite-starter dev` 在 5499 端口启动 vite dev；`pnpm --filter example-vite-starter build` 构建成功（vite 插件构建期校验全部页面 YAML）。示例 MUST NOT 导致根级 `pnpm -r --if-present build/test/typecheck` 失败。

#### Scenario: 构建成功

- **WHEN** 执行 `pnpm --filter example-vite-starter build`
- **THEN** vite 构建成功，YAML 经插件校验无错误

### Requirement: 最小插件工作流演示

示例 SHALL 以 pactor-vite-plugin 直接 import `*.page.yaml` 模块并经 pactor-app 渲染：单页面覆盖 state、Form 提交（setState + reload）、service 数据源与 Table；dev 时修改 YAML SHALL 触发热更新，YAML 校验失败 SHALL 使构建报错。

#### Scenario: 页面渲染与查询

- **WHEN** 打开示例并在查询框输入关键词提交
- **THEN** 表格按关键词过滤（service 数据源 reload）

#### Scenario: 校验失败构建报错

- **WHEN** 页面 YAML 含 Schema 非法字段
- **THEN** 插件使构建/dev 报错，错误信息含文件标识与字段路径
