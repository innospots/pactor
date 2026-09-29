# MEMORY.md

> 项目记忆文件——供后续会话快速恢复上下文。最后更新：2026-08-27。

## 项目定位

**Pactor**（仓库 `github.com/426-330/pactor`）：基于 YAML/JSON DSL 的企业级 Server-Driven UI + AI-Native 前端运行时框架。Monorepo（pnpm workspace + tsup + vitest），设计文档：`docs/src/content/docs/framework-design.md`（中文，约 4400 行，唯一权威设计来源）。

核心原则：DSL 是协议、Runtime 是核心、动态 DSL 静态能力（禁 eval/远程 JS）、Registry 管理一切可扩展点、前端权限只管 UI。

## 包结构（packages/，12 个包 + examples/admin、examples/chat、examples/vite-starter）

命名规则：无 npm scope，统一 `pactor-` 前缀，目录名简短。全部已按 npm 发布规范配置（license/repository/exports 双类型/prepublishOnly），包名在 npm 均可用，**但尚未发布、未 git 提交**。

| 层 | 包 | 说明 |
| --- | --- | --- |
| 基础协议 | `@pactor-app/core` | DSL 类型（DslNode/PageDsl/ActionConfig 等）+ `Registry<T>`；零依赖 |
| | `@pactor-app/schema` | JSON Schema + Ajv 校验（`validatePageDsl` 结构化错误） |
| | `@pactor-app/expression` | 受控表达式引擎（自研 AST parser，禁 eval，`${...}` 模板） |
| 运行时 | `@pactor-app/runtime` | RuntimeContext/StateStore/DataStore/ActionEngine（8 内置动作）/React Renderer/PageRuntime；react>=18 peer |
| UI | `@pactor-app/ui` | **内置默认 UI 实现**（shadcn 风格，@pactor-app/app 默认）：vendored shadcn/ui（Base UI 原语 + cva + tailwind-merge + lucide-react；2026-08-26 migrate-ui-base-ui 起 radix 全移除）；components/interaction/layout 三层自持（12 组件 props 契约、`OverlayManager`/`createUiBridge`/`registerInteractionActions` 交互核心、布局类型与 `resolveLayout` 均在本包）+ 预建 `styles.css`（shadcn 语义令牌，light/dark） |
| 能力 | `@pactor-app/permission` | PermissionStore + 四层守卫（零 React，结构化兼容 runtime） |
| | `@pactor-app/resource` | DSL 资源加载（Http/Static Loader、`id@version` 缓存、ETag、inflight 去重） |
| | `@pactor-app/router` | MenuRegistry/PathMatcher/NavigationBridge + `@pactor-app/router/react` 子入口（DynamicDslRoute） |
| | `@pactor-app/markdown` | react-markdown 安全渲染（禁 raw HTML、协议白名单）+ 代码高亮（react-syntax-highlighter Light）+ KaTeX 数学 + DSL Markdown 组件 |
| | `@pactor-app/chat` | Chat 消息模型/SSE reducer/Safe Registry/capability 动作/ChatView（视图零 antd：lucide 图标 + `styles.css` 皮肤 + smooth-stream/auto-scroll hooks） |
| 集成 | `@pactor-app/app` | `createPactorApplication({ appId, api|loader, componentRegistry?, layoutRegistry?, interactionKit?, ... }).mount()` |
| 工具链 | `@pactor-app/vite-plugin` | `import x from '*.page.yaml'`：YAML→校验→JS 模块 |
| | `@pactor-app/cli` | bin `pactor-app`：validate/inspect/lint/schema/build/create 六命令 |
| Meta | `pactor-app` | 聚合安装包：依赖全部 `@pactor-app/*`（skill 除外），入口转发 `@pactor-app/app`；`npm install pactor-app` 装全栈，按需则装单个 `@pactor-app/*` 模块 |

依赖方向：`core ← schema ← expression ← runtime ← {permission, resource, router, ui} ← {chat} ← app`。（2026-08-26 unify-ui-shadcn：ui-antd / ui-radix 两包与 example-admin-antd 已删除，契约与交互核心归位 @pactor-app/ui；全仓无 antd 依赖。）

## 关键架构决策（易忘）

- **UI 单一内置实现（shadcn 风格，@pactor-app/ui）**：`componentRegistry` / `layoutRegistry` / `interactionKit` 三个细粒度槽位是保留的自定义覆盖点，显式选项优先于内置默认。必须 `import '@pactor-app/ui/styles.css'`。
- **UiBridge/Adapter 均为结构化接口**（antd 无关）：permission/router/interaction 的核心零 React，可纯 Node 测。
- **动作引擎**：condition 跳过 → permission 拦截 → registry 执行；命名动作（`id`）结果入 `actions.<id>` 作用域；编排动作（sequence 等）的子动作**执行时求值**而非快照；含 `action` 键或字符串 `type` 键的内嵌对象不求值（isOpaque 约定）——因此 `message` 动作的类型用别名 `messageType`（`type` 保留为兼容别名，messageType 优先）。
- **表达式**：标识符仅从注入 scope 解析（window/fetch 不可达），`__proto__/constructor` 隔离；整体单 `${...}` 保留原始类型，混合模板拼接字符串。
- **Form 初始值**：`initialValues` + 字段级 `value`（字段级优先）；内置 Form 的上下文在字段首次注册时合并字段级初始值。
- **表单联动**：`form.setValues` 内置动作（params.form 缺省 default + values），Form 经 `context.forms` 桥注册（Form `name` prop 缺省 default，同页多表单须显式命名否则重复注册抛错）；setValues 不触发校验/onValuesChange。`onValuesChange` 的 event 仅首参 `{ <field>: <newValue> }`。**OverlayHost 已订阅 state/data**——overlay 内容绑 store 的表达式随变化重渲染（曾是级联选项不更新的坑）。
- **Input type**：`InputProps.type: 'text' | 'password'`（缺省 text）；内置 Input 透传 `<input type>`（2026-08-12 add-input-type-prop，第 24 个归档变更）。
- **示例登录模式**：会话存 localStorage（`src/auth.ts`），`createBootstrap()` 按会话返回 `login`/`admin` 布局形态（布局类型由 bootstrap 决定，全应用单布局）；登录/登出后须整页重载重取 bootstrap——示例用自定义 `app.reload` 动作（`window.location.assign`），路由守卫（未登录→/login）在 main.tsx DSL 之外。
- **Select（Base UI）**：DSL `options` 直接作 Root `items`（value→label 映射），value 原生支持 string/number/boolean，空值映射 `null` 显示 placeholder；`alignItemWithTrigger` 缺省 false。原 Radix Select 两个坑（空串回调清值 / 未渲染 item 解析不到 label）随原语消失，已有对应回归测试。
- **主题换肤**：覆盖 shadcn 语义令牌（`--primary` / `--muted` 等 CSS 变量）/ `<html data-pactor-theme="dark">` / `data-slot` 结构覆盖；参考 `examples/admin/src/theme.css`；文档 `guides/theming`。**preflight 已开启**（2026-08-26 align-ui-shadcn-theme，第 37 个归档变更）：styles.css = 完整 tailwindcss + tw-animate-css + 官方 base layer，对齐 shadcn 官方主题脚手架（radius 乘法派生、chart/sidebar 令牌、accordion keyframes）；导入即接受基线全局样式，宿主皮肤 CSS 须在其后导入。
- **Admin 布局模式**（2026-08-12 add-admin-layout-modes + change-layout-fixed-defaults）：bootstrap `layout` 支持 `mode`（top-side 缺省 / top-bottom / side-full / two-column）、`fixedHeader`/`fixedSider`（sticky，**缺省 true**，显式 false 关闭）、`collapsible`/`collapsed`、`breakpoint`（xs-xxl，shadcn 走 useMediaQuery hook，断点 480/576/768/992/1200/1600）；app `pickLayoutConfig` 枚举校验透传，非法值忽略。two-column 选中项无子菜单时隐藏第二列收窄为 56px 窄列、不叠加收起 trigger；side-full 品牌区入侧边栏、header 不重复。
- **Chat 视图**（2026-08-12 polish-chat-view，参考 DeepTutor web 技术选型独立实现）：零 antd（lucide-react 图标 + `@pactor-app/chat/styles.css` 皮肤 `--pactor-chat-*` 变量 + `data-pactor-theme="dark"` 暗色）；`useSmoothStreamText`（rAF 打字机）/ `useChatAutoScroll`（80px 释放、40px 回底、容器须 `overflow-anchor:none`）；`runChatTurn` 支持 `signal`（abort → cancelled 收尾不抛错）；MessageBubble user 右气泡 / assistant 通栏 + hover 复制条；Composer 自适应 textarea + 流式停止按钮。
- **@pactor-app/ui `/ui` 原语子路径**（2026-08-26 export-ui-primitives）：vendored shadcn 原语公开导出，宿主自定义 UI（槽位/业务组件）用 `/ui`，DSL 编排用 `/components`。**坑：预建 styles.css 只含包内源码实际用到的 Tailwind 工具类**（Tailwind v4 扫描产物），宿主自定义 UI 不要依赖包内未用过的零散工具类（如 rounded-full/rotate-180/backdrop-blur），排版优先走原语组件结构。examples/chat 的 8 个槽位组件已全部改用 `/ui` 原语，AnchoredPopup 删除（Popover Positioner anchor 虚拟元素语义覆盖）。
- **Chat 组件样式自持**（2026-08-26 chat-self-contained-styles）：组件结构布局（高度/对话列居中/面板贴右）全在 `@pactor-app/chat/styles.css`，调用端零覆盖；高度语义 = 填满父容器（`height: 100%`，**宿主须给容器显式定高**，父级无定高退化为内容高度，不再硬编码 100dvh）；可调令牌 `--pactor-chat-content-width`（对话列 768px）/ `--pactor-chat-inspector-width`；侧栏宽度统一走 ui 皮肤令牌 `--sidebar-width` / `--sidebar-width-icon`。示例 app.css 只管 demo 自有 UI（顶栏/chip/弹层）。
- **Chat 产出物面板与 ChatShell**（2026-08-26 add-chat-artifact-panel）：`ChatArtifact`（markdown/code/text/dsl 四 kind，dsl 经 Safe Registry 守卫活预览）+ `ArtifactStore`；`Chat` 受控 props `artifact`/`panelOpen`/`onPanelClose` + `inspector` 槽 + `events.onArtifact`（artifact part 就绪触发，框架不擅自开面板）；`ChatShell` = AppShell + 菜单侧栏 + `content` 槽（无聊天/路由逻辑），随 `registerChatComponent` 一并注册。**坑：面板开合不得改变子树深度**——面板功能使用时恒渲染 host 包裹层，否则 ChatView 重挂载导致 onArtifact 重放（有回归测试）。**examples/chat 已路由化**：HashRouter + @pactor-app/router（MenuRegistry/DynamicDslRoute/createRouterAdapter），三页 YAML（chat/agents/settings），刷新按 URL 还原；ConversationStore 按会话 id 缓存于宿主 Map 跨页存活。
- **Chat 安全**：LLM DSL 走 Safe Registry 白名单（`guardChatDsl` 替换为 ChatDenied 占位）；AI 动作走 capability 链（registry → permission → confirm → execute）。
- **Chat 内建模型选择/上下文弹层/header 操作组**（2026-08-27 chat-builtin-features，第 49 个归档变更）：`models`/`model`/`onModelChange` 内建模型 chip、`contexts` 声明式数据源（静态 items 或 `service` 经 `ChatServices.callService` 桥解析）驱动 @/＋ 内建弹层与 chips、`headerActions`（export/theme/clear）+ `editableTitle`；examples/chat 宿主槽位组件（Header/ModelSelector/PlusMenu 等）已全部清空。**约定/坑**：chat 包保持对 @pactor-app/ui 零运行时依赖（内建弹层为包内 AnchoredPopover 自实现，不导出）；chip 去重键为「同 trigger 同 id」；内建 theme 操作写 `documentElement` 的 `data-pactor-theme`——宿主暗色令牌选择器须挂在 documentElement 链上（examples/chat app.css 已改为 `[data-pactor-theme='dark'] .demo-app`）；调用方 `onPlusMenu`/`onMentionTrigger` 回调优先于内建弹层。
- **Chat 默认皮肤**（2026-08-27 chat-default-skin，第 50 个归档变更）：空态下问候组与 Composer 垂直居中成组为默认行为（`pactor-chat-view--empty`，有消息后恢复钉底）；`modelPlacement: 'header'` 极简头部（chip 在头部左端，仅 models 也渲染头部）；AppShell 桌面品牌行 + `collapsible` icon rail（内部非受控，移动端无折叠钮）+ `sidebarFooter` 固定底部槽；`ChatMenuItem.dot` 状态点；模型状态经 useChatModel 在 ChatComposition 层解析（header/composer 两位共享）；令牌 `--pactor-chat-bg` 调暖白灰、新增 `--pactor-chat-sidebar-bg`（深一档，暗色有对应值）。
- **应用级槽位**（2026-08-12 add-antd-skin-settings）：`providers`（Router 内、InteractionKit 外，业务 ConfigProvider/全局 Context 入口，皮肤主题等运行时切换经此注入）+ `headerExtra`（admin 头部右侧插槽）。example-admin 皮肤设置：`skin.ts` store（localStorage + 订阅）→ 写 DOM 属性（`data-pactor-theme` / `data-pactor-accent` / `--radius` 内联变量）→ `SkinSettings`（头部按钮 → 面板：预设色板/取色/暗黑/圆角/恢复默认）。

## OpenSpec 工作流（本项目标准流程）

- 每个变更：`openspec new change <name>` → proposal/design/specs/tasks 四件 → 实现（多由 coder 子代理完成）→ 主代理独立复跑验收 → tasks 勾选 → 归档时同步 delta specs 到 `openspec/specs/`（主 spec 无 ADDED/MODIFIED 头）→ `mv` 到 `changes/archive/YYYY-MM-DD-<name>`。
- 已归档 50 个变更；主 specs 52 个能力（`openspec/specs/`）是现状基准。
- 规范细节：scenario 必须 4 个 `#`（####）；MODIFIED 需全量需求块；MODIFIED 合并时注意变更间依赖顺序。

## 环境与命令

- Node >= 18 / pnpm >= 9（实际 node 22 + pnpm 10）。根命令：`pnpm build` / `pnpm test` / `pnpm typecheck` / `pnpm docs:dev`（端口 **4334**）/ `pnpm docs:build` / `pnpm release`。
- **文档站已部署 Cloudflare**（Workers 静态资产，assets-only 无脚本）：`docs/wrangler.jsonc`（account `43cad862…727e`，即 Xp.java 账号），`pnpm --filter pactor-docs deploy`（build + wrangler deploy），线上 https://pactor-docs.xp-java.workers.dev 。
- 文档站结构：guides/（getting-started 模板快速开始（create-pactor-app / starters）、**manual-setup 手动安装**（原 getting-started 的安装与参数内容）、**data-flow 数据流**、events 事件与表单联动、**custom-components 自定义组件**、theming） + **reference/dsl（DSL 完整参考：结构/作用域/数据源/动作/组件 props，含 Markdown 组件与聊天页完整示例）** + packages/<包名>；新增页面要同步 `docs/astro.config.mjs` sidebar 并重启 dev server。**docs 面向外部使用者**：不得含「框架设计规范」页、「设计文档第 N 节」、spec:/决策 D/openspec 引用与 V1 代号（框架设计规范原文移至仓库 `design/framework-design.md`，仅供内部）。
- 全量基线：**613 包内测试 + 346 根级测试**，typecheck 0 错误。
- 示例：`pnpm --filter example-admin dev`（端口 **5199**）；`pnpm --filter example-chat dev`（@pactor-app/chat 对话示例，端口 **5399**）；`pnpm --filter example-vite-starter dev`（最小 vite-plugin 上手示例，端口 **5499**，blank 布局 + 单页 todo 清单）。
- **example-chat**（2026-08-12 add-example-chat）：不经 @pactor-app/app，直接组合 `ConversationStore` + mock `ChatTransport`（async generator 分片延迟，`src/mock-ai.ts`）+ `ChatView`/`ChatLayout`；Safe Registry 白名单 Flex/Card/Statistic/Alert/Button（shadcn 注册表；dsl 里塞一个 Table 演示 ChatDenied）；capability `weather.query`（低风险）/ `data.export`（high risk → @pactor-app/ui 交互层 confirm 确认链，执行后经 UiBridge message.success toast 反馈）。演示口令：天气 / 报表 / 导出 / 任意提问。
- **examples 引用 workspace 包的 dist 产物**——改包代码后必须重建该包，示例才能看到效果。
- 视觉验证用 `playwright-cli`（截图 → ReadMediaFile 读图评审）。

## 常见坑（已踩过，别再踩）

1. **Astro dev server 不热收录新增文档文件**——新增 docs 页面后必须重启 `pnpm docs:dev`，否则报 `The slug "..." does not exist`；修改已有文件会热更新。
2. **后台 dev server 的 pnpm 父进程被杀后子进程（vite/astro）可能残留占端口**——用 `lsof -iTCP:<port> -sTCP:LISTEN` 找 PID 再 kill。
3. `pnpm docs <pkg>` 是 pnpm 内置命令（打开包文档页）——根脚本必须用 `docs:dev` 这类带冒号的名字。
4. `grep -c` 无匹配时 exit 1——组合命令的 "Command failed" 可能只是 grep 无匹配。
5. vitest `run tests/` 参数是路径过滤器，会连带匹配 `packages/*/tests/`（根级测试数因此偏大，无害）。
6. DSL Schema 校验只管结构不管组件 props（props 开放，由组件自行解释）——演示 vite-plugin 构建期报错要用删 `page.id` 这类结构性错误，加非法 prop 不会报错。
7. **Base UI Dialog 默认不锁 body 滚动**（原 radix react-remove-scroll 的 `data-scroll-locked` + margin 补偿机制随迁移消失）——经典滚动条系统下右锚定面板右移跳动问题不再存在；accordion 动画变量为 `--accordion-panel-height`（经 `--animate-accordion-down/up` 令牌），uncontrolled Accordion 的 defaultValue 必须首渲染冻结（Base UI 对变更 console.error 告警）。

## 已知边界 / 待办

- **未 git 提交、未发布 npm**：全部工作敞口在工作区，优先级最高的待办。
- 框架空白：无内置"调用 service"动作（示例用自定义 `service.call` 绕过）；Form initialValues 变化不重置表单（用 key 重建绕过）。
- 未做：pactor-devtools、`pactor preview` 命令、真实 SSE Transport、AI Context Bridge、SSR/RSC 支持（Next.js 集成目前只能 client island + `ssr:false`，路由建议 hash 避让）。
- V2 范围（设计文档第 99 节）：DSL Center、在线编辑、灰度多租户等均未启动。
- `docs/.astro/data-store.json` 是构建缓存，改动无害。
