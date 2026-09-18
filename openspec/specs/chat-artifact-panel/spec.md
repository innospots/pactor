# Spec: chat-artifact-panel

## Purpose

产出物预览面板（`@pactor-app/chat`）：ChatArtifact 模型与 ArtifactStore、ArtifactPanel 视图与内建渲染器、artifact 消息 part、面板布局与响应式。
## Requirements
### Requirement: 产出物模型与 ArtifactStore

`@pactor-app/chat` SHALL 定义 `ChatArtifact` 类型：`{ id: string; kind: 'markdown' | 'code' | 'text' | 'dsl'; title: string; content: string | DslNode; language?: string; fileType?: string; meta?: Record<string, unknown> }`（`dsl` kind 的 content 为 DslNode 普通对象，其余为字符串；`fileType` 为可选文件扩展名，缺省从 title 扩展名推导）。SHALL 导出 `ArtifactStore`：`get()` / `list()` / `subscribe()` / `open(artifact)` / `activate(id)` / `update(patch)` / `close()`，语义与 ConversationStore 同模式（可注入、可自持）；store 持会话内产出物列表 + 当前激活项——`open` 按 id upsert 并激活，`close` 只清空激活项（面板关闭），列表保留。

#### Scenario: store 开合与订阅

- **WHEN** 调用 open(artifact) 后订阅者收到通知且 get() 返回该 artifact，随后调用 close()
- **THEN** get() 返回 null，订阅者再次收到通知

#### Scenario: 部分更新

- **WHEN** open 后调用 update({ title: '新标题' })
- **THEN** get() 返回的 artifact title 已更新且其余字段不变

#### Scenario: 多产物列表与激活切换

- **WHEN** 依次 open 两个不同 id 的 artifact 后调用 activate(第一个 id)
- **THEN** list() 按插入序返回两个 artifact 且 get() 返回第一个；close() 后 list() 保留两个 artifact

### Requirement: ArtifactPanel 视图与内建渲染器

SHALL 导出 `ArtifactPanel` 组件：标题栏（可选目录列表钮 + 标题 + 可选角标 + 可选下载钮 + 关闭按钮）+ 内容区；内容按 `artifact.kind` 分发内建渲染器——`markdown` 经 @pactor-app/markdown 安全渲染、`code` 渲染只读代码块（language 作角标）、`text` 渲染预格式文本、`dsl` 经 Safe Registry 守卫 + renderChildren 活预览。渲染被守卫拦截或失败时 SHALL 渲染受控降级块，MUST NOT 抛错。关闭按钮点击 SHALL 触发 `onClose` 回调。

有激活产物时标题栏 SHALL 渲染下载钮：点击把当前激活产物存为本地文件——文件名取 title（无扩展名时按 fileType / kind 缺省补齐：markdown→.md、text/code→.txt、dsl→.json）；dsl kind 内容存格式化 JSON；svg 原始标记存 image/svg+xml Blob；图片 data URL 还原二进制；图片 http(s) URL 经 fetch 取回，失败降级新标签打开。下载行为 MUST 不要求受控 props。

图片类产物（`fileType` 或 title 扩展名命中内建图片集合：png / jpg / jpeg / gif / svg / webp / avif / bmp / ico）SHALL 按图片预览——content 为 URL / data URL；svg 原始标记 SHALL 经 `data:image/svg+xml` + `<img>` 呈现（标记内脚本不执行）。SHALL 支持 `artifactViewers` 自定义查看器（键为扩展名小写不带点或 kind；扩展名键优先于 kind 键，均优先于内建渲染器），经 prop 或 `services.artifactViewers` 注入。

提供 `artifacts` 列表时 SHALL 在标题栏左端渲染目录列表钮，点击进入产物目录列表视图（目录树按产物 id 的 `/` 分段构建，目录可折叠，点击产物触发 `onSelectArtifact` 并回到内容视图）；目录列表视图下 SHALL 隐藏目录列表钮，标题栏文件名处显示"产物目录"。`artifacts` 非空时标题栏文件名处 SHALL 渲染产物切换下拉（文件类型图标 + 名称 + chevron），点击菜单项触发 `onSelectArtifact`。激活产物变化时 SHALL 自动回到内容视图。

标题栏 SHALL 优先经 chat chrome DSL 渲染层以宿主组件（Text / Badge / Button / Icon 等）组合渲染（见 chat-chrome-dsl），关闭经 `chat.panelClose` 内建动作接回 `onClose` 回调；无 renderer 环境或类型缺失时回退手写标题栏。内容区内建渲染器、图片预览、切换下拉、目录列表视图、拖拽调宽与受控降级链 MUST 保持 chat 实现。

#### Scenario: markdown 产出物渲染

- **WHEN** artifact kind 为 markdown 且 content 含标题语法
- **THEN** 面板内容区渲染对应 HTML，原始 HTML 不注入

#### Scenario: dsl 产出物活预览

- **WHEN** artifact kind 为 dsl 且 content 为白名单组件的 DslNode
- **THEN** 面板内经 renderChildren 渲染该节点

#### Scenario: dsl 产出物被守卫拦截

- **WHEN** artifact kind 为 dsl 且 content 含非白名单组件类型
- **THEN** 渲染受控降级块，不抛错

#### Scenario: 图片类产出物预览

- **WHEN** artifact 的 fileType 或 title 扩展名为 png / jpg / svg 等图片扩展名
- **THEN** 内容区以 <img> 渲染（content 为 URL / data URL；svg 原始标记经 data URL 呈现），不再按 kind 文本渲染

#### Scenario: 自定义查看器

- **WHEN** 提供 artifactViewers 且键命中产物扩展名（或 kind）
- **THEN** 内容区渲染查看器返回的内容，内建渲染器不再生效

#### Scenario: 多产物下拉切换与目录列表

- **WHEN** artifacts 多于 1 个
- **THEN** 标题栏文件名处为切换下拉，点击菜单项触发 onSelectArtifact；点击标题栏左端目录钮进入目录列表视图（返回钮隐藏、文件名处显示"产物目录"），点击列表项触发 onSelectArtifact 并回到内容视图

#### Scenario: 关闭回调

- **WHEN** 点击面板关闭按钮
- **THEN** 触发 onClose，面板本身不单方面修改外部状态

#### Scenario: 下载产物

- **WHEN** 有激活产物时点击标题栏下载钮
- **THEN** 触发本地下载：markdown 产物（title 无扩展名）存为 `title.md` 文本文件；dsl 产物存 JSON；svg 原始标记存 image/svg+xml

### Requirement: artifact 消息 part

`ChatPart` 联合 SHALL 新增 `{ id?: string; type: 'artifact'; artifact: ChatArtifact; status?: PartStatus }`。PartRenderer SHALL 将消息流内的 artifact part 内联渲染为"产出物卡片"（整卡可点击：着色图标盒 + 标题 + 元信息行 + 右上箭头）；图标 SHALL 经共享 resolver（`resolveArtifactIcon`）解析——文件扩展名优先（图片类 → image/violet，表格 green / 数据 amber / 代码 blue / 脚本 terminal / 文档 file-text 等按扩展名分桶，各带着色档位 tone），无扩展名或未知扩展名按 kind 兜底（code → code/blue、dsl → layout-grid/slate、其余 file-text 或 file，slate）；产出物卡片、面板切换下拉与目录树 SHALL 共用同一 resolver 保证图标一致。元信息行 SHALL 展示「尺寸 · 类型标签」——尺寸取 `meta.size` 字节数经 `formatArtifactSize` 格式化（B / KB / MB，非法或缺省不展示），类型标签取扩展名大写（无扩展名取 kind 大写）。图标盒 SHALL 按 tone 着色（`pactor-chat-artifact-card--{tone}` 修饰类 + `--pactor-chat-artifact-tone-*` 令牌，暗色经 `[data-pactor-theme='dark']` 载体块覆盖）。卡片点击 SHALL 触发面板打开路径：无条件触发宿主回调 `onOpenArtifact(artifact)`（受控场景的面板打开入口），非受控场景同时 `store.open`（原行为保留）。

#### Scenario: 消息流内产出物卡片

- **WHEN** assistant 消息含 artifact part
- **THEN** 消息区渲染产出物卡片（整卡可点击：着色图标盒 + 标题 + 元信息行 + 右上箭头）而非原始 JSON

#### Scenario: 卡片图标按文件类型解析

- **WHEN** artifact 的 fileType 或 title 扩展名为 png / csv / ts 等已知类型
- **THEN** 卡片图标按扩展名分桶展示（image/violet、table/green、code/blue 等），与面板切换下拉、目录树中的同一产物图标一致

#### Scenario: 卡片元信息行

- **WHEN** artifact 的 title 含扩展名且 meta.size 为合法字节数
- **THEN** 元信息行展示「尺寸 · 扩展名大写」（如 `3.5 KB · MD`）；无扩展名时类型标签取 kind 大写

#### Scenario: 卡片打开面板（非受控）

- **WHEN** 未提供受控面板 props 时点击产出物卡片
- **THEN** 内部 store open，面板以该 artifact 打开

#### Scenario: 卡片触发宿主回调（受控）

- **WHEN** 受控模式（panelOpen/artifact 受控）下点击产出物卡片
- **THEN** 触发 onOpenArtifact 回调且 event 含该 artifact（面板开关由宿主/DSL 决定）

### Requirement: 卡片区收起

同一消息内连续的 artifact part SHALL 归并为一个卡片组渲染（被其它类型 part 分隔的段各自成组）。组内产物多于 4 个时 SHALL 只展示前 4 张卡片，下方右侧展示「展开」按钮——点击展开查看全部（按钮转为「收起」，可再收起）；「展开」右侧 SHALL 展示「查看所有产物（n) ›」（n 为组内产物数），点击 SHALL 打开产出物面板并定位产物目录视图：无条件触发宿主回调 `onOpenArtifactList`（受控场景的开面板入口，DSL 事件 `events.onOpenArtifactList`，event 为空对象），非受控场景并行打开面板（无激活产物时激活列表首项）。产物目录定位 SHALL 经面板 viewRequest 信号完成（消费后复位，后续普通打开回内容视图），受控 / 非受控一致。

#### Scenario: 多于 4 个产物收起

- **WHEN** 同一消息内连续 artifact part 超过 4 个
- **THEN** 卡片区只展示前 4 张卡片，下方右侧展示「展开」与「查看所有产物（n) ›」

#### Scenario: 展开查看全部

- **WHEN** 点击「展开」
- **THEN** 展示组内全部卡片，按钮转为「收起」，点击可再收起

#### Scenario: 查看所有产物定位目录视图（非受控）

- **WHEN** 未提供受控面板 props 时点击「查看所有产物（n) ›」
- **THEN** 面板打开并定位产物目录视图（标题显示"产物目录"，列表展示全部产物）

#### Scenario: 查看所有产物触发宿主回调（受控）

- **WHEN** 受控模式（panelOpen/artifact 受控）下点击「查看所有产物（n) ›」
- **THEN** 触发 onOpenArtifactList 回调（event 为空对象；面板开关由宿主/DSL 决定），面板就绪后定位产物目录视图

### Requirement: 面板布局与响应式

提供面板时（打开态）SHALL 在工作区右侧以固定宽栏渲染（宽度经 CSS 变量 `--pactor-chat-inspector-width` 可调，缺省与对话列同宽 `--pactor-chat-content-width`，上限容器宽 2/3）；面板宽度上限 SHALL 经 CSS `max-width` 硬约束（拖拽的 inline 宽度不能突破，窗口尺寸变化后同样生效）；面板背景 SHALL 略深于聊天区底色（`--pactor-chat-inspector-bg`）；面板调宽时对话列左右 SHALL 恒保留 `--pactor-chat-content-gutter` 内间距；桌面缺省布局 SHALL 为：host 行内容器分左右两列——`__main` 左列（工作区 header + 对话区纵向堆叠，header 与对话区同宽、不覆盖面板上方）与面板右列（独占全高、贴视口（容器）右缘无留白），对话列在 `__main` 内限宽居中（`--pactor-chat-content-width`）；窄屏（<768px，与 AppShell 断点一致）SHALL 退化为右侧覆盖抽屉（遮罩点击关闭）。面板关闭/未配置时 MUST NOT 渲染面板 DOM。

桌面形态下 SHALL 提供面板左缘拖拽手柄（`role="separator"` + `aria-orientation="vertical"` + aria-label）：pointer 拖拽实时改变面板宽度，宽度夹取在 [`--pactor-chat-inspector-min-width`（缺省 480px）, 容器宽 2/3] 区间；拖拽期间 MUST 禁用页面文本选择；拖拽结果为组件内部状态（inline 宽度覆盖令牌缺省），MUST NOT 要求受控 props；窄屏覆盖抽屉形态 MUST NOT 显示手柄。

#### Scenario: 桌面并排

- **WHEN** 桌面视口打开面板
- **THEN** 面板贴容器右缘，对话列在剩余空间内居中

#### Scenario: 拖拽调宽

- **WHEN** 桌面视口拖拽面板左缘手柄向左 100px
- **THEN** 面板宽度增加约 100px 且不超过容器宽 2/3

#### Scenario: 拖拽夹取下限

- **WHEN** 向右拖拽手柄低于 480px 下限
- **THEN** 面板宽度保持 480px

#### Scenario: 窄屏覆盖

- **WHEN** 窄屏视口打开面板并点击遮罩
- **THEN** 面板关闭

#### Scenario: 窄屏无拖拽手柄

- **WHEN** 窄屏视口打开面板
- **THEN** 拖拽手柄不显示（CSS 媒体查询）

#### Scenario: 缺省不渲染

- **WHEN** 未配置 artifact 且面板未打开
- **THEN** DOM 中不存在面板节点

