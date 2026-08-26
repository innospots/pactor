# MEMORY.md

> 项目记忆文件——供后续会话快速恢复上下文。最后更新：2026-08-11。

## 项目定位

**Pactor**（仓库 `github.com/426-330/pactor`）：基于 YAML/JSON DSL 的企业级 Server-Driven UI + AI-Native 前端运行时框架。Monorepo（pnpm workspace + tsup + vitest），设计文档：`docs/src/content/docs/framework-design.md`（中文，约 4400 行，唯一权威设计来源）。

核心原则：DSL 是协议、Runtime 是核心、动态 DSL 静态能力（禁 eval/远程 JS）、Registry 管理一切可扩展点、前端权限只管 UI。

## 包结构（packages/，12 个包 + examples/admin、examples/chat、examples/vite-starter）

命名规则：无 npm scope，统一 `pactor-` 前缀，目录名简短。全部已按 npm 发布规范配置（license/repository/exports 双类型/prepublishOnly），包名在 npm 均可用，**但尚未发布、未 git 提交**。

| 层 | 包 | 说明 |
| --- | --- | --- |
| 基础协议 | `pactor-core` | DSL 类型（DslNode/PageDsl/ActionConfig 等）+ `Registry<T>`；零依赖 |
| | `pactor-schema` | JSON Schema + Ajv 校验（`validatePageDsl` 结构化错误） |
| | `pactor-expression` | 受控表达式引擎（自研 AST parser，禁 eval，`${...}` 模板） |
| 运行时 | `pactor-runtime` | RuntimeContext/StateStore/DataStore/ActionEngine（8 内置动作）/React Renderer/PageRuntime；react>=18 peer |
| UI kit | `pactor-ui` | **唯一内置 UI kit**（shadcn，pactor-app 默认）：vendored shadcn/ui（Radix Primitives + cva + tailwind-merge + lucide-react）；components/interaction/layout 三层自持（12 组件 props 契约、`OverlayManager`/`createUiBridge`/`registerInteractionActions` 交互核心、布局类型与 `resolveLayout` 均在本包）+ `shadcnUiKit` 预设 + 预建 `styles.css`（shadcn 语义令牌，light/dark） |
| 能力 | `pactor-permission` | PermissionStore + 四层守卫（零 React，结构化兼容 runtime） |
| | `pactor-resource` | DSL 资源加载（Http/Static Loader、`id@version` 缓存、ETag、inflight 去重） |
| | `pactor-router` | MenuRegistry/PathMatcher/NavigationBridge + `pactor-router/react` 子入口（DynamicDslRoute） |
| | `pactor-markdown` | react-markdown 安全渲染（禁 raw HTML、协议白名单）+ 代码高亮（react-syntax-highlighter Light）+ KaTeX 数学 + DSL Markdown 组件 |
| | `pactor-chat` | Chat 消息模型/SSE reducer/Safe Registry/capability 动作/ChatView（视图零 antd：lucide 图标 + `styles.css` 皮肤 + smooth-stream/auto-scroll hooks） |
| 集成 | `pactor-app` | `createPactorApplication({ appId, api|loader, ui?, componentRegistry?, layoutRegistry?, interactionKit?, ... }).mount()` |
| 工具链 | `pactor-vite-plugin` | `import x from '*.page.yaml'`：YAML→校验→JS 模块 |
| | `pactor-cli` | bin `pactor`：validate/inspect/lint/schema/build/create 六命令 |

依赖方向：`core ← schema ← expression ← runtime ← {permission, resource, router, ui} ← {chat} ← app`。（2026-08-26 unify-ui-shadcn：ui-antd / ui-radix 两包与 example-admin-antd 已删除，契约与交互核心归位 pactor-ui；全仓无 antd 依赖。）

## 关键架构决策（易忘）

- **UI kit 单一内置（shadcn）**：`ui` 预设对象（非字符串标识！）+ 三个细粒度槽位的覆盖机制保留；优先级：显式选项 > `ui` 预设 > 内置默认（**默认且唯一内置为 shadcn / pactor-ui**）。必须 `import 'pactor-ui/styles.css'`。
- **UiBridge/Adapter 均为结构化接口**（antd 无关）：permission/router/interaction 的核心零 React，可纯 Node 测。
- **动作引擎**：condition 跳过 → permission 拦截 → registry 执行；命名动作（`id`）结果入 `actions.<id>` 作用域；编排动作（sequence 等）的子动作**执行时求值**而非快照；含 `action` 键或字符串 `type` 键的内嵌对象不求值（isOpaque 约定）。
- **表达式**：标识符仅从注入 scope 解析（window/fetch 不可达），`__proto__/constructor` 隔离；整体单 `${...}` 保留原始类型，混合模板拼接字符串。
- **Form 初始值**：`initialValues` + 字段级 `value`（字段级优先）；shadcn kit 的 Form 上下文在字段首次注册时合并字段级初始值。
- **表单联动**：`form.setValues` 内置动作（params.form 缺省 default + values），Form 经 `context.forms` 桥注册（Form `name` prop 缺省 default，同页多表单须显式命名否则重复注册抛错）；setValues 不触发校验/onValuesChange。`onValuesChange` 的 event 仅首参 `{ <field>: <newValue> }`。**OverlayHost 已订阅 state/data**——overlay 内容绑 store 的表达式随变化重渲染（曾是级联选项不更新的坑）。
- **Input type**：`InputProps.type: 'text' | 'password'`（缺省 text）；shadcn kit 透传 `<input type>`（2026-08-12 add-input-type-prop，第 24 个归档变更）。
- **示例登录模式**：会话存 localStorage（`src/auth.ts`），`createBootstrap()` 按会话返回 `login`/`admin` 布局形态（布局类型由 bootstrap 决定，全应用单布局）；登录/登出后须整页重载重取 bootstrap——示例用自定义 `app.reload` 动作（`window.location.assign`），路由守卫（未登录→/login）在 main.tsx DSL 之外。
- **Radix Select 坑**：值从 uncontrolled→controlled 切换会以空串回调清值；`Select.Value` 未渲染过 item 时解析不到选中文案——已修复（`value={key ?? ''}` + 忽略空 key + 显式 label children）。
- **主题换肤**：覆盖 shadcn 语义令牌（`--primary` / `--muted` 等 CSS 变量）/ `<html data-pactor-theme="dark">` / `data-slot` 结构覆盖；参考 `examples/admin/src/theme.css`；文档 `guides/theming`。**preflight 已开启**（2026-08-26 align-ui-shadcn-theme，第 37 个归档变更）：styles.css = 完整 tailwindcss + tw-animate-css + 官方 base layer，对齐 shadcn 官方主题脚手架（radius 乘法派生、chart/sidebar 令牌、accordion keyframes）；导入即接受基线全局样式，宿主皮肤 CSS 须在其后导入。
- **Admin 布局模式**（2026-08-12 add-admin-layout-modes + change-layout-fixed-defaults）：bootstrap `layout` 支持 `mode`（top-side 缺省 / top-bottom / side-full / two-column）、`fixedHeader`/`fixedSider`（sticky，**缺省 true**，显式 false 关闭）、`collapsible`/`collapsed`、`breakpoint`（xs-xxl，shadcn 走 useMediaQuery hook，断点 480/576/768/992/1200/1600）；app `pickLayoutConfig` 枚举校验透传，非法值忽略。two-column 选中项无子菜单时隐藏第二列收窄为 56px 窄列、不叠加收起 trigger；side-full 品牌区入侧边栏、header 不重复。
- **Chat 视图**（2026-08-12 polish-chat-view，参考 DeepTutor web 技术选型独立实现）：零 antd（lucide-react 图标 + `pactor-chat/styles.css` 皮肤 `--pactor-chat-*` 变量 + `data-pactor-theme="dark"` 暗色）；`useSmoothStreamText`（rAF 打字机）/ `useChatAutoScroll`（80px 释放、40px 回底、容器须 `overflow-anchor:none`）；`runChatTurn` 支持 `signal`（abort → cancelled 收尾不抛错）；MessageBubble user 右气泡 / assistant 通栏 + hover 复制条；Composer 自适应 textarea + 流式停止按钮。
- **Chat 产出物面板与 ChatShell**（2026-08-26 add-chat-artifact-panel）：`ChatArtifact`（markdown/code/text/dsl 四 kind，dsl 经 Safe Registry 守卫活预览）+ `ArtifactStore`；`Chat` 受控 props `artifact`/`panelOpen`/`onPanelClose` + `inspector` 槽 + `events.onArtifact`（artifact part 就绪触发，框架不擅自开面板）；`ChatShell` = AppShell + 菜单侧栏 + `content` 槽（无聊天/路由逻辑），随 `registerChatComponent` 一并注册。**坑：面板开合不得改变子树深度**——面板功能使用时恒渲染 host 包裹层，否则 ChatView 重挂载导致 onArtifact 重放（有回归测试）。**examples/chat 已路由化**：HashRouter + pactor-router（MenuRegistry/DynamicDslRoute/createRouterAdapter），三页 YAML（chat/agents/settings），刷新按 URL 还原；ConversationStore 按会话 id 缓存于宿主 Map 跨页存活。
- **Chat 安全**：LLM DSL 走 Safe Registry 白名单（`guardChatDsl` 替换为 ChatDenied 占位）；AI 动作走 capability 链（registry → permission → confirm → execute）。
- **应用级槽位**（2026-08-12 add-antd-skin-settings）：`providers`（Router 内、InteractionKit 外，业务 ConfigProvider/全局 Context 入口，皮肤主题等运行时切换经此注入）+ `headerExtra`（admin 头部右侧插槽）。example-admin 皮肤设置：`skin.ts` store（localStorage + 订阅）→ 写 DOM 属性（`data-pactor-theme` / `data-pactor-accent` / `--radius` 内联变量）→ `SkinSettings`（头部按钮 → 面板：预设色板/取色/暗黑/圆角/恢复默认）。

## OpenSpec 工作流（本项目标准流程）

- 每个变更：`openspec new change <name>` → proposal/design/specs/tasks 四件 → 实现（多由 coder 子代理完成）→ 主代理独立复跑验收 → tasks 勾选 → 归档时同步 delta specs 到 `openspec/specs/`（主 spec 无 ADDED/MODIFIED 头）→ `mv` 到 `changes/archive/YYYY-MM-DD-<name>`。
- 已归档 43 个变更；主 specs 50 个能力（`openspec/specs/`）是现状基准。
- 规范细节：scenario 必须 4 个 `#`（####）；MODIFIED 需全量需求块；MODIFIED 合并时注意变更间依赖顺序。

## 环境与命令

- Node >= 18 / pnpm >= 9（实际 node 22 + pnpm 10）。根命令：`pnpm build` / `pnpm test` / `pnpm typecheck` / `pnpm docs:dev`（端口 **4334**）/ `pnpm docs:build` / `pnpm release`。
- **文档站已部署 Cloudflare**（Workers 静态资产，assets-only 无脚本）：`docs/wrangler.jsonc`（account `43cad862…727e`，即 Xp.java 账号），`pnpm --filter pactor-docs deploy`（build + wrangler deploy），线上 https://pactor-docs.xp-java.workers.dev 。
- 文档站结构：guides/（getting-started、**data-flow 数据流**、events 事件与表单联动、**custom-components 自定义组件**、theming） + **reference/dsl（DSL 完整参考：结构/作用域/数据源/动作/组件 props，含 Markdown 组件）** + packages/<包名> + framework-design；新增页面要同步 `docs/astro.config.mjs` sidebar 并重启 dev server。
- 全量基线：**613 包内测试 + 346 根级测试**，typecheck 0 错误。
- 示例：`pnpm --filter example-admin dev`（shadcn kit，端口 **5199**）；`pnpm --filter example-chat dev`（pactor-chat 对话示例，端口 **5399**）；`pnpm --filter example-vite-starter dev`（最小 vite-plugin 上手示例，端口 **5499**，blank 布局 + 单页 todo 清单）。
- **example-chat**（2026-08-12 add-example-chat）：不经 pactor-app，直接组合 `ConversationStore` + mock `ChatTransport`（async generator 分片延迟，`src/mock-ai.ts`）+ `ChatView`/`ChatLayout`；Safe Registry 白名单 Flex/Card/Statistic/Alert/Button（shadcn 注册表；dsl 里塞一个 Table 演示 ChatDenied）；capability `weather.query`（低风险）/ `data.export`（high risk → pactor-ui 交互层 confirm 确认链，执行后经 UiBridge message.success toast 反馈）。演示口令：天气 / 报表 / 导出 / 任意提问。
- **examples 引用 workspace 包的 dist 产物**——改包代码后必须重建该包，示例才能看到效果。
- 视觉验证用 `playwright-cli`（截图 → ReadMediaFile 读图评审）。

## 常见坑（已踩过，别再踩）

1. **Astro dev server 不热收录新增文档文件**——新增 docs 页面后必须重启 `pnpm docs:dev`，否则报 `The slug "..." does not exist`；修改已有文件会热更新。
2. **后台 dev server 的 pnpm 父进程被杀后子进程（vite/astro）可能残留占端口**——用 `lsof -iTCP:<port> -sTCP:LISTEN` 找 PID 再 kill。
3. `pnpm docs <pkg>` 是 pnpm 内置命令（打开包文档页）——根脚本必须用 `docs:dev` 这类带冒号的名字。
4. `grep -c` 无匹配时 exit 1——组合命令的 "Command failed" 可能只是 grep 无匹配。
5. vitest `run tests/` 参数是路径过滤器，会连带匹配 `packages/*/tests/`（根级测试数因此偏大，无害）。
6. DSL Schema 校验只管结构不管组件 props（props 开放，由组件自行解释）——演示 vite-plugin 构建期报错要用删 `page.id` 这类结构性错误，加非法 prop 不会报错。
7. **@radix-ui/react-dialog（shadcn Dialog）展开会锁 body 滚动**（react-remove-scroll：body `data-scroll-locked` + overflow hidden + margin 补偿）——经典滚动条系统下视口变宽，右锚定的自绘面板会右移跳动；注意滚动补偿冲突。

## 已知边界 / 待办

- **未 git 提交、未发布 npm**：全部工作敞口在工作区，优先级最高的待办。
- 框架空白：无内置"调用 service"动作（示例用自定义 `service.call` 绕过）；Form initialValues 变化不重置表单（用 key 重建绕过）。
- 未做：pactor-devtools、`pactor preview` 命令、真实 SSE Transport、AI Context Bridge、SSR/RSC 支持（Next.js 集成目前只能 client island + `ssr:false`，路由建议 hash 避让）。
- V2 范围（设计文档第 99 节）：DSL Center、在线编辑、灰度多租户等均未启动。
- `docs/.astro/data-store.json` 是构建缓存，改动无害。
