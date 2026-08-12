# MEMORY.md

> 项目记忆文件——供后续会话快速恢复上下文。最后更新：2026-08-11。

## 项目定位

**Pactor**（仓库 `github.com/426-330/pactor`）：基于 YAML/JSON DSL 的企业级 Server-Driven UI + AI-Native 前端运行时框架。Monorepo（pnpm workspace + tsup + vitest），设计文档：`docs/src/content/docs/framework-design.md`（中文，约 4400 行，唯一权威设计来源）。

核心原则：DSL 是协议、Runtime 是核心、动态 DSL 静态能力（禁 eval/远程 JS）、Registry 管理一切可扩展点、前端权限只管 UI。

## 包结构（packages/，14 个包 + examples/admin、examples/admin-antd）

命名规则：无 npm scope，统一 `pactor-` 前缀，目录名简短。全部已按 npm 发布规范配置（license/repository/exports 双类型/prepublishOnly），包名在 npm 均可用，**但尚未发布、未 git 提交**。

| 层 | 包 | 说明 |
| --- | --- | --- |
| 基础协议 | `pactor-core` | DSL 类型（DslNode/PageDsl/ActionConfig 等）+ `Registry<T>`；零依赖 |
| | `pactor-schema` | JSON Schema + Ajv 校验（`validatePageDsl` 结构化错误） |
| | `pactor-expression` | 受控表达式引擎（自研 AST parser，禁 eval，`${...}` 模板） |
| 运行时 | `pactor-runtime` | RuntimeContext/StateStore/DataStore/ActionEngine（8 内置动作）/React Renderer/PageRuntime；react>=18 peer |
| UI kit | `pactor-ui-antd` | antd 实现：components/interaction/layout 三层 + `antdUiKit` 预设 |
| | `pactor-ui-radix` | Radix Primitives 实现（**pactor-app 的默认 UI kit**）：同构三层 + `radixUiKit` + token 化 `styles.css`（`--pcr-*` 变量，light/dark，主色 #3C47DD） |
| 能力 | `pactor-permission` | PermissionStore + 四层守卫（零 React，结构化兼容 runtime） |
| | `pactor-resource` | DSL 资源加载（Http/Static Loader、`id@version` 缓存、ETag、inflight 去重） |
| | `pactor-router` | MenuRegistry/PathMatcher/NavigationBridge + `pactor-router/react` 子入口（DynamicDslRoute） |
| | `pactor-markdown` | react-markdown 安全渲染（禁 raw HTML、协议白名单）+ DSL Markdown 组件 |
| | `pactor-chat` | Chat 消息模型/SSE reducer/Safe Registry/capability 动作/ChatView |
| 集成 | `pactor-app` | `createPactorApplication({ appId, api|loader, ui?, componentRegistry?, layoutRegistry?, interactionKit?, ... }).mount()` |
| 工具链 | `pactor-vite-plugin` | `import x from '*.page.yaml'`：YAML→校验→JS 模块 |
| | `pactor-cli` | bin `pactor`：validate/inspect/lint/schema/build/create 六命令 |

依赖方向：`core ← schema ← expression ← runtime ← {permission, resource, router, ui-antd} ← {ui-radix, chat} ← app`（ui-radix 依赖 ui-antd 的 interaction 核心与契约类型）。

## 关键架构决策（易忘）

- **UI kit 可切换**：`ui` 预设对象（非字符串标识！）+ 三个细粒度槽位；优先级：显式选项 > `ui` 预设 > 内置默认（**默认 Radix**）。Radix 无内建样式，必须 `import 'pactor-ui-radix/styles.css'`。
- **UiBridge/Adapter 均为结构化接口**（antd 无关）：permission/router/interaction 的核心零 React，可纯 Node 测。
- **动作引擎**：condition 跳过 → permission 拦截 → registry 执行；命名动作（`id`）结果入 `actions.<id>` 作用域；编排动作（sequence 等）的子动作**执行时求值**而非快照；含 `action` 键或字符串 `type` 键的内嵌对象不求值（isOpaque 约定）。
- **表达式**：标识符仅从注入 scope 解析（window/fetch 不可达），`__proto__/constructor` 隔离；整体单 `${...}` 保留原始类型，混合模板拼接字符串。
- **Form 初始值**：`initialValues` + 字段级 `value`（字段级优先）；antd 靠挂载时 `setFieldValue` 实现字段级优先（antd 原生优先级相反）。
- **Input type**：`InputProps.type: 'text' | 'password'`（缺省 text）；antd 映射 `Input.Password`，Radix 透传 `<input type>`（2026-08-12 add-input-type-prop，第 24 个归档变更）。
- **示例登录模式**：会话存 localStorage（`src/auth.ts`），`createBootstrap()` 按会话返回 `login`/`admin` 布局形态（布局类型由 bootstrap 决定，全应用单布局）；登录/登出后须整页重载重取 bootstrap——示例用自定义 `app.reload` 动作（`window.location.assign`），路由守卫（未登录→/login）在 main.tsx DSL 之外。
- **Radix Select 坑**：值从 uncontrolled→controlled 切换会以空串回调清值；`Select.Value` 未渲染过 item 时解析不到选中文案——已修复（`value={key ?? ''}` + 忽略空 key + 显式 label children）。
- **主题换肤**：覆盖 `--pcr-*` CSS 变量 / `<html data-pactor-theme="dark">` / 覆盖 `.pcr-*` class；参考 `examples/admin/src/theme.css`；文档 `guides/theming`。
- **Chat 安全**：LLM DSL 走 Safe Registry 白名单（`guardChatDsl` 替换为 ChatDenied 占位）；AI 动作走 capability 链（registry → permission → confirm → execute）。

## OpenSpec 工作流（本项目标准流程）

- 每个变更：`openspec new change <name>` → proposal/design/specs/tasks 四件 → 实现（多由 coder 子代理完成）→ 主代理独立复跑验收 → tasks 勾选 → 归档时同步 delta specs 到 `openspec/specs/`（主 spec 无 ADDED/MODIFIED 头）→ `mv` 到 `changes/archive/YYYY-MM-DD-<name>`。
- 已归档 25 个变更；主 specs 43 个能力（`openspec/specs/`）是现状基准。
- 规范细节：scenario 必须 4 个 `#`（####）；MODIFIED 需全量需求块；MODIFIED 合并时注意变更间依赖顺序。

## 环境与命令

- Node >= 18 / pnpm >= 9（实际 node 22 + pnpm 10）。根命令：`pnpm build` / `pnpm test` / `pnpm typecheck` / `pnpm docs:dev`（端口 **4334**）/ `pnpm docs:build` / `pnpm release`。
- 全量基线：**573 包内测试 + 289 根级测试**，typecheck 0 错误。
- 示例：`pnpm --filter example-admin dev`（Radix，端口 **5199**）；`pnpm --filter example-admin-antd dev`（antd kit，端口 **5299**）。两个示例页面 DSL 逐字节一致，仅 main.tsx 的 `ui` 预设与样式导入不同（antd 版引 `antd/dist/reset.css`，不引 pcr 皮肤）。
- **examples 引用 workspace 包的 dist 产物**——改包代码后必须重建该包，示例才能看到效果。
- 视觉验证用 `playwright-cli`（截图 → ReadMediaFile 读图评审）。

## 常见坑（已踩过，别再踩）

1. **Astro dev server 不热收录新增文档文件**——新增 docs 页面后必须重启 `pnpm docs:dev`，否则报 `The slug "..." does not exist`；修改已有文件会热更新。
2. **后台 dev server 的 pnpm 父进程被杀后子进程（vite/astro）可能残留占端口**——用 `lsof -iTCP:<port> -sTCP:LISTEN` 找 PID 再 kill。
3. `pnpm docs <pkg>` 是 pnpm 内置命令（打开包文档页）——根脚本必须用 `docs:dev` 这类带冒号的名字。
4. antd 对两个汉字的按钮自动插空格——测试断言用正则 `/提\s*示/`。
5. `grep -c` 无匹配时 exit 1——组合命令的 "Command failed" 可能只是 grep 无匹配。
6. vitest `run tests/` 参数是路径过滤器，会连带匹配 `packages/*/tests/`（根级测试数因此偏大，无害）。

## 已知边界 / 待办

- **未 git 提交、未发布 npm**：全部工作敞口在工作区，优先级最高的待办。
- 框架空白：无内置"调用 service"动作（示例用自定义 `service.call` 绕过）；Form initialValues 变化不重置表单（用 key 重建绕过）。
- chat 视图仍用少量 antd（Collapse/Alert）——Radix 化未做；antd peer 在 ui-radix 依赖链上（peer 警告可忽略，彻底解耦需交互核心下沉 runtime）。
- 未做：pactor-devtools、`pactor preview` 命令、真实 SSE Transport、AI Context Bridge、SSR/RSC 支持（Next.js 集成目前只能 client island + `ssr:false`，路由建议 hash 避让）。
- V2 范围（设计文档第 99 节）：DSL Center、在线编辑、灰度多租户等均未启动。
- `docs/.astro/data-store.json` 是构建缓存，改动无害。
