# pactor-cli

[Pactor](https://github.com/426-330/pactor) 的命令行工具（bin `pactor`）：本地 DSL 开发工具链，覆盖校验、结构摘要、静态检查、Schema 导出、编译为 Runtime Envelope JSON 与脚手架生成。

## 安装

```bash
npm install -g pactor-cli
# 或
pnpm add -g pactor-cli
```

要求 Node.js >= 18；零 React 依赖。

## 命令

```text
pactor validate <files...>      校验 DSL 文件（page 走 Schema 校验，fragment 宽松检查 dsl + body）
pactor inspect <file>           输出 DSL 结构摘要（状态 / 数据源 / 组件计数 / 动作 / 权限 / 表达式）
pactor lint <paths...>          校验 + 静态检查规则（目录递归 .page/.fragment.yaml/.yml）
pactor schema [-o <file>]       输出 Page DSL JSON Schema（含 node / action 关联 Schema）
pactor build <src> -o <dir>     递归编译 DSL 为 Runtime Envelope JSON（<out>/<id>.json）
pactor create <name> [-t app]   从模板生成业务工程（vite + react + pactor-app + pactor-ui-radix）
pactor --help                   命令清单
```

退出码语义：

- `0`：成功（lint 仅 warning 也算成功）
- `1`：校验或 lint 失败（lint 存在 error）
- `2`：用法错误（缺参数、文件不存在、目标目录非空等）

lint 规则：

- `expression-syntax`（error）：解析 DSL 中所有 `${...}` 模板与整体表达式
- `component-naming`（warning）：组件 type 应为 PascalCase
- `permission-format`（warning）：权限码应为 `resource:action` 形态

`preview` 命令在 V1 未实现（见设计文档第 84 节裁剪说明）。

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
