## ADDED Requirements

### Requirement: markdown 驱动的模板内容目录

资产库站点 SHALL 提供线框模板内容目录（`doc/src/content/wireframe-templates/*.md`），一个 markdown 文件对应一个模板。每个文件 MUST 在 frontmatter 中声明 `title`（菜单展示名），可声明 `slug`（路由段，缺省取文件名）、`order`（排序，缺省按文件名）、`summary`、`sourceRef`（溯源路径）。将符合约定的 markdown 文件放入目录后，重新构建 MUST 自动产生对应菜单项与页面，MUST NOT 需要修改导航硬编码。

#### Scenario: 放入 markdown 自动出现菜单

- **WHEN** 在内容目录新增一篇带合法 frontmatter 的模板 markdown 并重新构建
- **THEN** 「模板」分类的线框模板集合页自动列出该模板条目，详情页路由可访问，无需修改 `site-nav.ts`

#### Scenario: frontmatter 缺 title 构建失败

- **WHEN** 内容目录中存在缺少 `title` 的 markdown
- **THEN** 构建期校验报错并指出文件路径

### Requirement: 模板详情页

每个线框模板 SHALL 有独立详情页（`/templates/wireframe/<slug>`），页面复用组件详情页的骨架（面包屑 + 页头 + 固定章节顺序），MUST NOT 渲染「元信息」「变体」「API 属性」「Design Token 映射」等不适用模板的章节或右看板元信息。页面 MUST 包含：

- **面包屑右端「复制此页」按钮**：点击将该模板页的 markdown 源码原文复制到剪贴板，成功/失败有明确反馈。
- **「预览」章节**：按结构章节渲染说明文字 + 运行态预览——章节内的 DSL yaml 骨架经构建期占位清洗后由真实 @pactor-app 组件渲染；渲染失败或无可用骨架时回退展示该节 ASCII 线框（等宽、横向滚动不换行）。
- **「结构」章节**：章节内以 Tab 切换「DSL 结构」（构建期解析 yaml 骨架得到的结构视图；解析失败的块回退为纯文本）与「yaml 结构」（原始 yaml 骨架代码块，按所属布局/套标题分组展示，只读可复制）。yaml 结构 MUST 标注其为 DSL 语法骨架、字段需按业务补全。

#### Scenario: 查看模板详情

- **WHEN** 用户从线框模板集合页点击「搜索列表页」
- **THEN** 详情页「预览」章节展示 DSL 骨架渲染的真实组件效果（如筛选 Form、表格、分页），「结构」章节可通过 Tab 查看按 S1/S2、F1/F2/F3 等布局分组的 DSL 结构视图与 yaml 骨架代码块，且无元信息/变体/API 属性章节

#### Scenario: 复制此页

- **WHEN** 用户点击详情页面包屑右端的「复制此页」按钮
- **THEN** 剪贴板写入该模板 markdown 源码原文，按钮显示成功反馈

#### Scenario: 深链访问

- **WHEN** 用户直接打开某模板详情页 URL
- **THEN** 页面正常渲染对应模板内容

### Requirement: 线框模板集合页

「模板」分类 SHALL 提供线框模板集合页（`/templates/wireframe`），列出全部已接入模板条目（名称、摘要、布局/结构模式数量），条目按 frontmatter `order` 排序，点击条目进入详情页。

#### Scenario: 浏览模板列表

- **WHEN** 用户进入「模板 → 线框模板」
- **THEN** 页面按序展示全部已接入模板卡片，计数与内容目录文件数一致

### Requirement: 首批线框模板内容

资产库 SHALL 接入 14 篇线框模板（控制台外壳、搜索列表页、卡片列表页、树形主从配置页、详情页-Tab分栏、详情页-纵向区块、独立表单页、侧滑层表单、弹窗与确认框、双栏授权配置、登录页布局选型、仪表盘页、信息与文本卡片、聊天交互页），内容 MUST 保留源文档的结构模式编号、ASCII 线框、说明表格与全部 DSL yaml 骨架块，并通过 frontmatter `sourceRef` 标注溯源。

#### Scenario: 内容完整性

- **WHEN** 构建完成后打开任一线框模板详情页
- **THEN** 页面 yaml 结构区的代码块数量与源文档中 ```yaml 块数量一致，ASCII 线框完整展示
