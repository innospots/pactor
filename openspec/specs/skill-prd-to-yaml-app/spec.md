# Spec: skill-prd-to-yaml-app

## Purpose

PRD/线框图驱动的 YAML 页面应用生成技能（skills/pactor-prd，skill id `pactor-prd`）：输入解析、项目脚手架、按模块分目录的 YAML 页面生成（dataSources 一律 type: http）、mock 服务、样式/功能与原产品一致、浏览器逐页验收。
## Requirements
### Requirement: Skill 目录与入口

仓库 SHALL 在 `skills/pactor-prd/` 提供符合 Agent Skill 规范的 `SKILL.md`（含 frontmatter `name` / `description`，description 明确触发场景），并附 `references/` 目录承载细节材料，SKILL.md 正文只保留流程主干与引用索引。

#### Scenario: 技能被发现与加载

- **WHEN** Agent 的技能目录（如 `~/.kimi-code/skills/` 或项目级 skills 目录）包含 `skills/pactor-prd/`
- **THEN** Agent 能识别 skill 名称与触发条件，加载 SKILL.md 后获得完整执行流程与 references 索引

#### Scenario: 触发场景描述准确

- **WHEN** 用户给出产品文档 / 线框图目录并要求生成 yaml 页面项目
- **THEN** SKILL.md 的 description 能匹配该意图（包含 PRD、线框图、yaml 页面、pactor 等关键词）

### Requirement: 输入解析流程

Skill SHALL 定义从 PRD/线框图目录解析出「模块 → 页面清单」的步骤：读取总览 README 提取模块/页面/优先级表，逐页读取线框图提取页面路径、页面类型、区域结构与交互说明，输出标准化的页面清单（页面 id、标题、路由路径、菜单分组、优先级）。

#### Scenario: 解析模块与页面清单

- **WHEN** 输入目录含总览 README（模块 × 页面 × 优先级表格）与分页线框图 markdown
- **THEN** 产出页面清单，每个页面具备 id（kebab-case）、标题、路由路径、所属菜单分组、P0/P1/P2 优先级

#### Scenario: 解析单页线框图

- **WHEN** 读取单个页面线框图 markdown（含 ASCII 线框、区域说明、字段与交互描述）
- **THEN** 产出该页的结构化描述：布局区域、组件清单（表格/表单/卡片/筛选器等）、字段与数据源需求、交互（跳转/弹窗/操作）

### Requirement: 项目脚手架与目录约定

Skill SHALL 约定以包内 `template/` 模板工程（可运行参考实现：完整接线 + 公共页面 + 两个参考模块）整体复制作为新项目起点，并约定目录结构：`src/server/yaml/sitemap.yaml` 为布局 DSL（app 信息、布局、菜单、页面注册），各页面 DSL 按模块分目录存放（`src/server/yaml/<模块>/<id>.yaml`，页面 id = 文件名），`app/api/sitemap/route.ts` 返回入口数据，懒加载页面端点为 `app/api/public/pages/[id]/route.ts`（返回页面 envelope，且在 `src/pactor/config.ts` 显式配置 `pageEndpoint` 指向该路径），`app/api/data/[...path]/route.ts` 承载 mock 数据路由表。

#### Scenario: 创建项目骨架

- **WHEN** 按 skill 执行脚手架步骤
- **THEN** 复制 template/ 为起点、安装依赖，且目录结构符合约定： `src/server/yaml/`（sitemap.yaml + 按模块分目录的页面 yaml，yaml/<模块>/<id>.yaml）与 `app/api/` 三个路由文件

#### Scenario: 未指定工程名称时从 README 派生

- **WHEN** 用户未明确指定工程名称
- **THEN** 根据原型目录 README 中的产品名生成英文 kebab-case 工程名（如「Model Console 产品原型线框图」→ `model-console`；中文产品名先译为简洁英文），创建前向用户确认一次

### Requirement: YAML 页面生成规则

Skill SHALL 规定每个 PRD 页面翻译为一个 `<id>.yaml`（按模块分目录存放 `yaml/<模块>/<id>.yaml`，页面 id = 文件名）：页面组件从线框图区域映射到 pactor 组件（表格/筛选区/卡片/表单/Tab 等），所有 dataSources 一律 `type: http` 指向 `/api/data/...`，过滤/操作类交互经 events + actions 闭环，文案与线框图保持一致；布局、样式、尺寸、间距以 `template/` 模板工程同类页面为准，不逐像素还原线框图。

#### Scenario: 页面翻译为页面 yaml

- **WHEN** 按页面清单逐页生成
- **THEN** 每页产生合法页面 yaml：组件映射遵循 references 中的映射表，dataSources 全部 `type: http`，交互经事件动作闭环

#### Scenario: 数据源接口化

- **WHEN** 页面需要列表/详情/选项等数据
- **THEN** 一律声明 http 数据源指向 `/api/data/<domain>-<entity>` 风格路径，并在 mock 路由表中注册对应 handler，便于后续替换为真实服务端接口

### Requirement: 表单与列表操作列规范

Skill SHALL 规定：所有表单（独立表单页、页面内嵌配置面板、弹窗/抽屉表单、搜索栏筛选区）一律用 `Form` 组件包裹，字段经 `props.name` 绑定，校验用字段级 `rules`，提交用 `submit: true` 按钮触发 `onSubmit`，回填联动用 `form.setValues` 动作；禁止散放字段组件 + setState 攒草稿 + `if` 动作手写校验。表格操作列按钮样式统一 `Button variant: link`；「编辑」与「新建」SHALL 指向同一个表单，仅以是否预填数据区分。

#### Scenario: 表单一律 Form 包裹

- **WHEN** 生成任何含「字段 + 校验 + 提交」结构的页面区域（含树/列表右侧的编辑面板、弹窗表单）
- **THEN** 该区域由 `Form` 包裹，字段 `name` 绑定、`rules` 就地校验、`submit: true` 提交、回填经 `form.setValues`，无散放字段手写校验

#### Scenario: 搜索栏为 inline 表单

- **WHEN** 列表页含「关键词/下拉筛选 + 查询/重置」的搜索栏
- **THEN** 搜索栏用 `Form layout: inline` 实现，onSubmit 中 setState + reload；即点即生效的快筛（ChipFilter）不受此约束

#### Scenario: 操作列样式统一且编辑复用新建表单

- **WHEN** 列表页表格含操作列
- **THEN** 操作列按钮统一 `Button variant: link`；「编辑」打开与「新建」相同的表单（同一路由页或同一弹窗），编辑态以行数据预填（路由页 `initialValues` / 弹窗 `form.setValues`）

### Requirement: 布局、主题与验收

Skill SHALL 约定：sitemap.yaml 定义管理后台布局与菜单（与 PRD 模块树一致）；最后以浏览器逐页验收（路由可达、数据渲染、交互闭环、无控制台报错）。

#### Scenario: 菜单与 PRD 模块树一致

- **WHEN** 生成 sitemap.yaml
- **THEN** 菜单分组与条目覆盖 PRD 页面清单中的全部页面，路由路径与页面 id 一一对应

#### Scenario: 菜单图标层级规则

- **WHEN** 为菜单项配置图标
- **THEN** 仅一级菜单（目录 group 与「首页」这类独立页面项）配置图标（pactor Icon 白名单 kebab-case 名），二级及以下菜单项不配图标

#### Scenario: 逐页浏览器验收

- **WHEN** 全部页面生成完毕
- **THEN** 启动 dev server，用浏览器逐页打开验证：页面区域结构/字段/文案符合线框图（布局尺寸以模板工程为准）、http 数据源返回数据、筛选/跳转等交互可用、控制台无报错

### Requirement: 样式与原产品一致

Skill SHALL 规定从原产品提取视觉体系并完整移植到生成项目：主题令牌（主色、前景/背景、圆角等）写入 pactor 皮肤机制，深浅色模式俱全；原产品的自定义样式（页面级 CSS，如登录页）按原样移植并在对应页面/布局挂载；换肤能力与原产品一致（皮肤数量、切换入口）。

#### Scenario: 主题令牌对齐

- **WHEN** 原产品（如 model-console）定义了自己的色板/圆角/字体等设计令牌
- **THEN** 生成项目的皮肤文件（skin css）覆盖同名语义令牌，浏览器对比两产品同页面无明显色差，深浅色模式均正常

#### Scenario: 自定义样式移植

- **WHEN** 原产品存在页面级自定义 CSS（如登录页渐变背景、磨砂卡片）
- **THEN** 该 CSS 完整复制进生成项目并在对应布局/页面挂载，页面视觉效果与原产品一致

#### Scenario: 换肤能力一致

- **WHEN** 原产品支持多套皮肤或深浅色切换
- **THEN** 生成项目提供同等数量皮肤与切换入口，切换后全站组件（含图表）随肤变化

### Requirement: 功能与原产品一致

Skill SHALL 规定线框图/PRD 中描述的交互功能全部实现为可用闭环（筛选、搜索、分页、跳转、弹窗、抽屉、表单提交、操作反馈等），不允许生成只有静态外观的骨架；数据源一律 http mock，但交互行为（含加载态、空态、校验提示）与原产品一致。

#### Scenario: 交互功能可用

- **WHEN** 线框图描述了筛选、跳转、弹窗、提交等交互
- **THEN** 生成页面中这些交互经 events/actions 闭环可用（如筛选条件变化触发列表重新请求、按钮点击打开对应弹窗或路由跳转），而非仅渲染静态外观

#### Scenario: 特殊页面功能对齐

- **WHEN** 原产品存在功能复杂的页面（如登录页的提交/错误提示/跳转逻辑）
- **THEN** 生成项目的对应页面保持一致的交互行为（含校验失败提示、成功后跳转），验收时逐项操作验证

### Requirement: 参考材料完整性

Skill 的 `references/` SHALL 至少包含：页面 yaml 模板（列表页/详情页/表单页）、组件映射表（线框图区域 → pactor 组件）、mock 数据路由模板、主题与样式移植指南（令牌提取、皮肤文件、自定义 CSS 挂载、换肤对齐）、验收清单；SKILL.md 对每个 reference 的引用场景有说明。

#### Scenario: reference 按需加载

- **WHEN** 执行到页面生成 / mock 服务 / 验收任一环节
- **THEN** SKILL.md 指引加载对应 reference 文件，且该文件存在并包含可套用的模板或清单

### Requirement: 模板登录页使用 Login 业务组件

模板工程的登录页（`src/server/yaml/common/login.yaml`）SHALL 以 DSL `type: Login` 区块组件（`@pactor-app/blocks` `components/Login/`）实现，登录页特有的可配置信息（品牌区、标题、副标题、字段文案、提交按钮文案、辅助入口、页脚）经 props 表达；提交闭环 SHALL 由 `events.onSubmit` 动作链编排（`request` 登录接口 + 失败 `message` + 成功 `app.reload` 跳转），组件 SHALL NOT 内置登录请求；手写登录样式特例（`login-page` 渐变外壳布局与 `app/login.css`）SHALL 移除，sitemap 的 `login` 布局简化为纯页面出口。

#### Scenario: 登录页 DSL 渲染与提交闭环

- **WHEN** 匿名访问模板工程 `/login`，填写演示账号（admin / pactor123）提交
- **THEN** 渲染 Login 组件完整登录页，校验通过后执行 request → message → app.reload 闭环并进入后台首页

#### Scenario: 无手写登录 CSS 残留

- **WHEN** 登录页改用 Login 组件后
- **THEN** `app/login.css` 与其在 `app/layout.tsx` 的引入被删除，sitemap `login` 布局不再引用 `login-page` 类，工程内无 `login-page` / `login-card` / `login-eyebrow` / `login-heading` / `login-subtitle` 类名残留

#### Scenario: 生成项目登录页以模板为准

- **WHEN** 按 PRD 生成的项目包含登录页
- **THEN** 以模板 `common/login.yaml` 的 Login 组件写法为样板生成，品牌区文案、标题、提交动作的目标地址按 PRD 与目标项目调整

### Requirement: 登录页布局澄清

当 PRD 包含登录页但原型未明确指定布局方式时，skill SHALL 向用户提问选择 `Login` 组件的布局（`layout`：`split` / `centered` / `brand-card` / `overlap` / `backdrop`，必要时含 `brandSide` / `brandRatio` / `authVariant` 等修饰项），得到答复后再生成；原型已明确布局时 SHALL 直接使用指定布局，不重复提问；用户不作答时 SHALL 按缺省 `split` + `authVariant: card` 生成。

#### Scenario: 原型未明确布局时提问

- **WHEN** PRD 含登录页线框图，但无法从中判定结构布局
- **THEN** 向用户提问可选布局（附各布局效果简述），按答复设置 `layout` 与修饰 props

#### Scenario: 原型明确布局时不提问

- **WHEN** 线框图可明确判定布局（如 ASCII 为左右分栏结构或文字注明）
- **THEN** 直接使用对应 `layout` 生成，不发起提问

