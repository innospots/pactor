# Design: add-prd-to-yaml-app-skill

## Context

已完成过一次人工迁移：以 product-design/nexmux/prd-diagram（27 个产品页面 / 34 个 markdown 线框图）为输入，在 nexmux-ui 中产出基于 pactor 的 Next.js 项目——`src/server/yaml/sitemap.yaml` 布局 DSL + 按模块分目录的页面 DSL（`yaml/<模块>/<id>.yaml`），dataSources 全部 `type: http`，`app/api/data/[...path]` 路由表承接 mock 数据，主题换肤对齐原产品。本变更把这次迁移的方法论沉淀为仓内 skill（`packages/skills/prd-to-yaml-app/`），供 Agent 对任意同类产品文档复用。

约束：

- Skill 是文档型资产（SKILL.md + references/），无可执行代码，不改现有包
- 遵循 Agent Skills 规范：frontmatter（name/description）+ 正文流程 + references 渐进加载
- 仓内已有用户级 skill `~/.kimi-code/skills/pactor`（DSL 编写参考），本 skill 引用它而非重复其内容

## Goals / Non-Goals

**Goals:**

- SKILL.md 给出六阶段主干流程：输入解析 → 脚手架 → 页面生成 → mock 服务 → 样式移植 → 功能与视觉验收
- references/ 提供可直接套用的模板：页面 yaml 模板（列表/详情/表单）、组件映射表、mock 路由模板、主题与样式移植指南、验收清单
- 与既有 pactor skill 分工：本 skill 管「流程与产出物约定」，DSL 语法细节引用 pactor skill
- 生成项目与原产品样式一致（主题令牌/深浅色/换肤/自定义 CSS）且功能一致（线框图描述的交互全部闭环可用，非静态骨架）

**Non-Goals:**

- 不实现 PRD 解析的程序化工具（脚本/CLI）——解析由 Agent 按 skill 指引完成
- 不改 create-app 模板、不改 starters 代码
- 不覆盖流式/权限等高级运行时能力的迁移细节
- 不负责把 skill 安装到用户目录（使用方自行拷贝/软链）

## Decisions

### D1: skill 收进既有 `@pactor-app/skills` 包，与 pactor skill 同包分发

`packages/skills/prd-to-yaml-app/`（该包已是「每 skill 一个自包含目录」的布局，README 有 Adding a skill 约定）。备选：① 仓库根新建 `skills/`——另起分发渠道，与既有 skills 包割裂；② 直接写 `~/.kimi-code/skills/`——脱离版本管理，无法评审与演进。选 `packages/skills/`，随仓库/npm 包分发，需要时由用户拷贝/软链到 agent skills 目录。

### D2: SKILL.md 只写流程主干，模板放 references/

SKILL.md 控制在 ~150 行：触发场景、输入要求、五阶段流程、references 索引、红线（如「dataSources 必须 type: http」「页面文案以线框图为准」）。模板类长内容（页面模板、映射表、路由模板、验收清单）拆到 references/ 按需加载，避免每次加载 skill 都占满上下文。

### D3: 数据源一律 `type: http` + 单一路由表 mock

沿用 nexmux-ui 验证过的模式：页面 dataSources 全部 http（`/api/data/<domain>-<entity>`，单段路径防详情路由误解析），mock 收敛在 `app/api/data/[...path]/route.ts` 的 ROUTE_TABLE。这样 PRD → 原型阶段零后端依赖，后续换真实接口只改路由实现，页面 yaml 不动。备选的 `type: service`（进程内 mock 函数）被否决：它绑定具体运行时，违背「方便替换为真实服务端接口」的目标。

### D4: 组件映射表以线框图「区域」为键

references/component-mapping.md 按线框图常见区域（面包屑/页头/搜索筛选区/卡片网格/表格/描述列表/Tab/表单分区/操作列）映射到 pactor 组件与常用 props 模式，而不是按组件字母表罗列——翻译时是从区域出发反查组件。

### D5: 样式与功能一致性作为硬性产出标准

nexmux-ui 迁移的经验：样式对齐不止换主色——要从原产品提取完整令牌（含深浅色）、移植页面级自定义 CSS（如 login.css 曾漏合入导致登录页样式丢失），换肤入口与皮肤数量也要对齐。功能上不接受静态骨架：线框图中的筛选/跳转/弹窗/提交必须经 events/actions 闭环。两者都写进 references/theme-and-style.md 与验收清单，验收阶段逐项操作验证（含错误分支，如登录失败提示）。

### D6: 验收清单驱动收尾

references/acceptance-checklist.md 定义逐页验收项（路由可达、http 数据源 200、渲染符合线框、交互闭环、控制台无错、深浅色切换正常、与原产品视觉/功能对比一致），skill 流程最后一步强制执行并输出验收结果表。这防止「生成即完成」的假象。

## Risks / Trade-offs

- [线框图格式因产品而异，skill 按 nexmux 格式写死会失效] → 输入解析阶段写成「识别模块/页面清单与单页结构」的通用指引，nexmux 仅作示例；遇到异格式时先归纳再套用
- [样式移植不完整（如漏挂页面级 CSS、深浅色令牌缺项）] → 主题移植指南列出必查项（令牌表、自定义 CSS 挂载点、深浅色、换肤入口），验收清单含与原产品的同页面对比
- [功能被做成静态骨架] → 红线写明「线框图描述的交互必须闭环可用」，验收清单要求逐项操作（含错误分支）
- [模板与 pactor 组件能力漂移（组件新增/改名后模板过时）] → 映射表只列稳定组件与 props 模式，并注明「以 packages/ui 当前导出为准」；skill 随仓库演进，组件变更时应同步更新
- [Agent 跳过验收直接交付] → SKILL.md 把验收列为必经阶段，附检查清单与输出格式要求

## Open Questions

- 是否同时在 `~/.kimi-code/skills/` 安装一份供日常使用（本变更范围外，实施后可手动做）
