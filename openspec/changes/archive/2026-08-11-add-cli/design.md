# Design: add-cli

## Context

设计文档第 84 节 CLI 清单：create / lint / validate / inspect / schema / build / preview。V1 做前六个，preview 裁剪。能力复用：pactor-schema（validatePageDsl + JSON Schema）、pactor-expression（parseExpression 做 lint 表达式语法检查）、yaml 包。

约束：

- 零 React 依赖、Node >= 18；命令处理器与 CLI 入口分离（处理器接受 argv 解析后的参数 + 可注入 stdout/stderr，返回退出码）——纯函数可测。
- 手写极简参数解析（位置参数 + `--flag` / `-o value`），不引 commander/cac。
- bin：`dist/cli.js` 带 shebang；package.json `bin: { pactor: './dist/cli.js' }`。

## Goals / Non-Goals

**Goals:**

- 六个命令：validate / inspect / lint / schema / build / create。
- 退出码语义（0 成功；1 校验/lint 失败；2 用法错误）。
- 测试与文档。

**Non-Goals:**

- `preview` 命令；watch 模式；交互式 create 问答（模板参数全部经命令行/默认值）；YAML 的自动修复（--fix）。

## Decisions

### D1: 结构

```
src/
  cli.ts            # 入口：解析 argv → 分发命令 → process.exit(code)
  args.ts           # 极简参数解析
  commands/
    validate.ts     # pactor validate <files...>
    inspect.ts      # pactor inspect <file>
    lint.ts         # pactor lint <paths...>（目录递归 .page/.fragment.yaml）
    schema.ts       # pactor schema [-o file]
    build.ts        # pactor build <src> -o <dir>
    create.ts       # pactor create <name> [-t app]
  dsl-io.ts         # 共享：读取/解析 YAML、page/fragment 判定、校验聚合（与 vite-plugin 同语义，独立实现）
templates/app/      # create 模板
```

### D2: 各命令语义

- **validate**：逐文件解析 + validatePageDsl（fragment 宽松检查）；失败打印 `<file>: path: message (keyword)`，退出码 1；全部通过打印汇总，退出码 0。
- **inspect**：输出结构化摘要（YAML 或人类可读文本）：page id/title/type、状态键、dataSources（type/service）、组件类型计数（递归 body）、事件动作清单、permission 引用、表达式清单（收集 `${...}`）。
- **lint**：validate + 规则：
  - `expression-syntax`（error）：遍历 DSL 中所有字符串的 `${...}`，用 parseExpression 解析，失败即 error。
  - `component-naming`（warning）：组件 type 非 PascalCase。
  - `permission-format`（warning）：权限码不含 `:` 或为空段。
  - 输出分级汇总；有 error 退出码 1，仅 warning 退出码 0。
- **schema**：`pageDslSchema`（及关联的 node/action schema 以 `$ref` 一致性）JSON.stringify 输出；`-o` 写文件。
- **build**：递归 src 下 DSL 文件 → 编译为 JSON（page 包装为 Envelope 形态 `{ id, resourceType, version: 1, dslVersion, schema }`，id 取 page.id / fragment.id）→ 写 `<out>/<id>.json`。校验失败中止并报告。
- **create**：复制 `templates/app` 到目标目录（目录已存在且非空 → 报错退出码 2），替换占位（`__APP_NAME__` 等）。模板内容：package.json（vite/react/pactor-app/pactor-ui-radix/pactor-vite-plugin 依赖）、vite.config.ts（含 pactor() 插件）、index.html、src/main.tsx（createPactorApplication + StaticDslLoader + 样式导入）、src/pages/home.page.yaml、tsconfig、README。

### D3: 测试

- 每命令处理器单测：合法/非法输入、退出码、输出关键内容（注入内存 stdout/stderr 收集）。
- create/build 用 os.tmpdir 临时目录。
- bin 冒烟：`node dist/cli.js --help` 退出码 0 且含命令清单（build 后执行）。

## Risks / Trade-offs

- [手写参数解析对复杂 flag 支持有限] → 命令面刻意简单（位置参数 + 少量 flag），够用。
- [模板与主仓版本同步] → 模板 package.json 依赖版本用 `workspace` 之外的语义化占位（如 `^0.1.0`），README 注明发布后对齐；模板测试只验证生成与关键文件存在，不实际安装。
- [lint 规则集难免误判] → 分级（仅 expression-syntax 为 error），文档说明每条规则。

## Migration Plan

无（全新包）。顺序：骨架与参数解析 → dsl-io → validate/schema → inspect/lint → build/create → 测试 → 文档。

## Open Questions

- `preview`：结合 examples 工程评估（静态服务 + StaticDslLoader 指向本地 DSL 目录）。
