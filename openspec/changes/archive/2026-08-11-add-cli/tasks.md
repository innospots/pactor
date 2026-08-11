# Tasks: add-cli

## 1. 包骨架

- [x] 1.1 创建 `packages/cli`：dependencies `pactor-core`/`pactor-schema`/`pactor-expression`/`yaml`，bin `pactor` → dist/cli.js（shebang），tsconfig、tsup、LICENSE、README；`pnpm install`

## 2. 基础设施

- [x] 2.1 极简参数解析（位置参数 + --flag / -o value）+ cli.ts 分发入口（--help / 未知命令退出码 2）
- [x] 2.2 dsl-io 共享层：读取解析 YAML、page/fragment 判定、校验聚合（含文件标识与 path/message）

## 3. 命令实现（spec: dsl-cli）

- [x] 3.1 validate（退出码 0/1/2 语义）
- [x] 3.2 inspect（结构摘要：组件计数/动作/权限/表达式清单）
- [x] 3.3 lint（expression-syntax error + component-naming/permission-format warning，目录递归）
- [x] 3.4 schema（stdout / -o 文件）
- [x] 3.5 build（Envelope JSON 输出，校验失败中止）
- [x] 3.6 create（templates/app 模板 + 占位替换 + 非空目录拒绝）

## 4. 测试

- [x] 4.1 各命令处理器单测（注入 IO，覆盖 spec 各 scenario）
- [x] 4.2 create/build 临时目录测试
- [x] 4.3 bin 冒烟：构建后 `node dist/cli.js --help` 退出码 0 含命令清单

## 5. 验收与文档

- [x] 5.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 5.2 文档站新增 `packages/cli.md`（六个命令用法与退出码、模板说明、preview 未实现说明）；侧边栏与快速开始模块表同步
- [x] 5.3 `pnpm docs:build` 通过（新页面已包含在构建产物中；按要求未重启 docs dev server）
