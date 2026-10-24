# @pactor-app/cli

[Pactor](https://github.com/innospots/pactor) 的命令行工具（bin `pactor`）：本地 DSL 开发工具链，覆盖校验、结构摘要、静态检查、Schema 导出、编译为 Runtime Envelope JSON、脚手架生成与 Shell 模块打包。

## 安装

```bash
npm install -g @pactor-app/cli
# 或
pnpm add -g @pactor-app/cli
```

要求 Node.js >= 18；零 React 依赖。

## 命令

```text
pactor validate <files...>      校验 DSL 文件（page 走 Schema 校验，fragment 宽松检查 dsl + body）
pactor inspect <file>           输出 DSL 结构摘要（状态 / 数据源 / 组件计数 / 动作 / 权限 / 表达式）
pactor lint <paths...>          校验 + 静态检查规则（目录递归 .page/.fragment.yaml/.yml）
pactor schema [-o <file>]       输出 Page DSL JSON Schema（含 node / action 关联 Schema）
pactor build <src> -o <dir>     递归编译 DSL 为 Runtime Envelope JSON（<out>/<id>.json）
pactor create <name> [-t app]   从模板生成业务工程（vite + react + @pactor-app/app + @pactor-app/ui）
pactor module <sub> [--dir .]   模块打包：init / build / validate / pack / publish（Shell 可装配 npm 模块）
pactor --help                   命令清单
```

退出码语义：

- `0`：成功（lint 仅 warning 也算成功）
- `1`：校验 / lint / 模块构建或产物校验失败
- `2`：用法或配置错误（缺参数、文件不存在、目标目录非空、配置 / target profile 非法等）

lint 规则：

- `schema`（error）：Page / Fragment Schema 校验
- `yaml`（error）：YAML 解析失败
- `expression-syntax`（error）：解析 DSL 中所有 `${...}` 模板与整体表达式
- `component-naming`（warning）：组件 type 应为 PascalCase
- `permission-format`（warning）：权限码应为 `resource:action` 形态
- `body-children-conflict`（warning）：body 与根级 children 同时声明时 children 被忽略

## 模块打包（`pactor module`）

把业务工程打包为 Shell（如 innospots-web-shell）可装配的 npm 模块（Manifest V1）。
转换与校验逻辑由 [`@pactor-app/module-pack`](../module-pack/README.md) 提供，CLI 只做参数适配与输出。

```text
pactor module init [--dir <工程根>] [--force]               初始化模块接入面（已存在文件询问是否重新生成，--force 直接覆盖）
pactor module build [--dir <工程根>] [--config <配置文件>]    构建 dist-module/ 产物
pactor module validate [--dir <工程根>] [--config <配置文件>] 校验 dist-module/ 产物
pactor module pack [--dir <工程根>] [--config <配置文件>]     递增版本号 + build + npm pack 生成 tgz
pactor module publish [--dir <工程根>]                        pack 全流程 + npm publish 发布到 npm 服务器
```

- `init`：生成 `pactor.module.json` 与 `module/client.ts`，并向 `package.json` 注入 `files` / `exports` / `scripts` / `peerDependencies`；文件已存在时交互询问是否重新生成（非 TTY 默认保留，`--force` 直接覆盖）。
- `build`：按配置收集 `yamlRoot` 下的页面 / 布局 / 片段，展开 `$include`、重写 URL、打包 client，输出 Manifest V1 + DSL + assets 到 `dist-module/`。
- `validate`：校验 `dist-module/` 产物是否符合 Manifest V1 与 target profile 契约。
- `pack`：先自动递增 `package.json` 版本号（默认 patch；`--bump minor|major|x.y.z` 指定，`--no-bump` 关闭），再 build，然后用 `npm pack --dry-run` 确认 `files` 覆盖 `dist-module/`，最后执行 `npm pack` 生成 tgz。
- `publish`：执行 pack 全流程后 `npm publish <tgz>` 发布；支持 `--registry <url>` 指向私服、`--tag`、`--access public|restricted`、`--otp`、`--dry-run`（演练不上传）。

`--dir` 缺省为当前目录，`--config` 缺省为工程根下的 `pactor.module.json`。

`preview` 命令尚未实现。

## 文档

完整文档见 <https://pactor-docs.xp-java.workers.dev>（源码仓库 [innospots/pactor-docs](https://github.com/innospots/pactor-docs)）。

## License

[MIT](../../LICENSE)
