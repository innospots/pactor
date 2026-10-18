# UI 质量生成与验收契约

本契约用于 PRD 驱动的新建工程和增量页面。执行顺序固定为：

```text
页面清单 / delta → docs/prd/ui-plan.md → YAML / 主题接线 → 静态检查 + 浏览器功能验收 + 截图目检 → 修复与重验
```

- 每个实际生成的页面都要有计划行；P0/P1 页面缺少完整计划行时，不得生成或修改该页 YAML。
- 增量模式只需重写变更页的计划行，但变更页必须重新执行本契约的全部检查。
- 每个计划单元格和验收结论都必须能判定通过或不通过。不得使用没有对象、动作、数值或观察结果的描述。
- 组件 props 以当前 packages 源码和正式组件文档为准；页面结构以当前同类标准骨架为准。本契约不提供用截图掩盖非法 props、缺失交互或缺失状态的通道。

## 1. 四层质量

四层都要通过；其中任意一层不通过，页面结论即为不通过。

| 层 | 生成契约 | 静态验收证据 | 视觉验收证据 |
| --- | --- | --- | --- |
| 主题 | 颜色、背景、边框、圆角和图表色使用项目语义令牌；新品牌值进入 `theme-and-style.md` 规定的主题接线，不在页面 DSL 写死色值。Select、DatePicker 等挂到 `document.body` 的浮层也必须读取根节点令牌。 | 页面无新增十六进制色值、RGB 色值和页面级颜色补丁；原产品 CSS 仅按主题移植流程接入；样式聚合顺序未被页面样式反转。 | 默认皮肤的亮色、暗色截图中，正文、辅助文字、边框、输入控件、浮层和图表均可辨认；无白边、黑色死块、文字融入背景或浮层与页面主题不一致。 |
| 布局 / 间距 | 先复制同类标准骨架；区域排列使用 Flex、Grid、Row、Col，间距使用骨架已有的 gap / gutter；Field 管理自身标签、辅助和错误节点。 | 计划写明骨架路径、区域结构和间距值；无为修补单页对齐而新增的 margin、间距 class 或 CSS；固定多列 Grid 已按第 4.4 节转换。 | 1440px 与 390px 下，标题、分区、字段和操作顺序与计划一致；同组 Field 间距相等，label / description / error 不重叠，页面本身无横向滚动。 |
| 组件语义 | 按数据形状、选择行为和 PRD 任务选择组件，并逐区记录选择理由；只使用当前注册组件及其真实 props。 | 第 5 节选型表和第 7.1 节全部通过；Form、Field、Tabs、Table、Empty 的结构红线全部通过。 | 实际操作候选、日期、层级、空态、页签和行 / 卡片行为；控件呈现的值与提交值符合该组件契约，无双标签、双空态或伪按钮。 |
| 状态 / 响应式 | 计划逐项声明 empty、loading、error、disabled，或写明不适用依据；声明桌面和窄屏的列数、换行、滚动及操作可达方式。 | 状态有真实数据或事件来源，disabled 有条件表达式，loading / error 不被误接到 Empty；响应式档位完整。 | 按第 7.2 节截图矩阵检查状态，并实际操作 hover、focus、重试、清空筛选和禁用条件；状态切换不改变页面结构含义，不遮挡操作。 |

## 2. 生成门禁：`docs/prd/ui-plan.md`

### 2.1 文件格式

在生成项目的 `docs/prd/ui-plan.md` 建立下表。**一行对应一个 page id**；同一页面的多个区域写在该行的对应单元格内，不拆成只有区域而没有页面字段的散表。单元格内换行使用 `<br>`。

```markdown
# UI 计划

| PRD 来源 | page id / type | 布局模式 | 区域 / 组件 / 选择理由 | Form layout / Field 间距 | 数据 / 交互 | empty / loading / error / disabled | 桌面 / 窄屏行为 | 验收项 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
```

计划必须来自当次 PRD / 线框图，不得从已经生成的 YAML 反填。生成后实现与计划不一致时，按第 8 节处理，不能直接把计划改成与错误实现相同。

### 2.2 字段定义

| 列 | 必填内容 | 判为不完整的情况 |
| --- | --- | --- |
| PRD 来源 | `文件路径#章节标题`，并标注 P0/P1/P2；多个依据用 `<br>` 列出。章节必须能定位到该区域、字段或交互。 | 只写产品名、模块名或“线框图”；无法定位原文；没有优先级。 |
| page id / type | `kebab-case-id / list`，type 取 `list`、`detail`、`form`、`dashboard`、`login`；其他类型写 `other:<具体类型>`。page id 必须与 sitemap 和文件名一致。 | id 与路由文件不一致；只写页面中文名；同页出现多个未解释的 id。 |
| 布局模式 | 标准骨架写 `标准：<骨架文件或章节>`；变体写 `变体：<基准>；PRD 依据：<来源>；基准限制：<结构事实>；采用结构：<容器/区域>；窄屏与状态影响：<结果>`。Login 的五种 `layout` 选择也要记录产品依据。 | 只写“自定义”；没有基准、PRD 依据或窄屏 / 状态影响；用个人偏好作为变体理由。 |
| 区域 / 组件 / 选择理由 | 按 PRD 顺序逐项写 `区域 → 组件及关键 props → 数据形状或交互理由`。页头、筛选、主体、分页 / 计数、操作、抽屉 / 弹窗均须覆盖。 | 只列组件名；只有“与原型相同”而没有选型理由；PRD 区域缺失；多出无 PRD 来源的区域。 |
| Form layout / Field 间距 | 每个 Form 写 `name` 和 `layout`；写 Field 的 label / required / labelHint / description / error 分工，以及 section、字段组、按钮区的 Flex gap / Row gutter。无提交表单时写 `无提交表单：<实际交互，例如 onChange 即时 reload>`。 | 漏掉搜索 Form；只写“使用 Field”；没有 gap / gutter；用空白字符制造标签；Form 嵌套。 |
| 数据 / 交互 | 写 dataSource、请求参数与页面值的绑定；每个 PRD 交互写 `触发 → action 链 → 可见结果`，包括查询、重置、新建、编辑预填、提交、删除确认和重试。 | 只有接口名没有交互闭环；只写“点击可用”；新建和编辑不是同一 Form；失败没有反馈。 |
| empty / loading / error / disabled | 四项都显式命名。写触发条件、呈现组件、保留的数据 / 布局和恢复动作；empty 区分初始无数据与筛选无结果。某项不适用时写 `不适用：<PRD 或当前组件契约依据>`。 | 漏项；把 error 当 empty；把 loading 当 empty；只写“有状态”；disabled 没有条件或原因；编造组件没有的 loading / disabled prop。 |
| 桌面 / 窄屏行为 | 桌面固定写 `1440×900`，窄屏固定写 `390×844`；逐区写列数、Col span / md / xl、换行、内部滚动、抽屉 / 浮层和主要操作的可达方式。 | 只写“响应式”；没有宽度或栅格值；通过隐藏 PRD 内容消除溢出；页面依赖横向滚动才能看到主操作。 |
| 验收项 | 至少覆盖四层，每项写 `编号：操作或观察对象 → 通过结果`；引用本契约的静态项和截图矩阵，并增加该页业务交互断言。 | 只有“检查页面”；没有通过结果；用功能通过代替视觉通过；缺少状态或窄屏项。 |

## 3. 标准骨架与允许变体

### 3.1 默认骨架

| page type | 默认基准 | 必须保留的结构决策 |
| --- | --- | --- |
| list | `template/src/server/yaml/models/data-list.yaml`；独立路由编辑时参考 `references/page-templates.md` 的轻量变体 | Breadcrumb / 页头；新建操作；Card 内搜索 `Form layout: inline`；Table 或经 PRD 论证的 CardList；新建与编辑复用同一 Form；行操作使用 `Button variant: link`。 |
| detail | `references/page-templates.md` 的「详情页」 | Breadcrumb 返回路径；标题与操作；Descriptions 承担只读字段；Tabs 仅承载两个以上同层视图，纵向分区使用 Card / Descriptions 顺序排布。 |
| form | `references/page-templates.md` 的「表单页」；抽屉内表单沿用 data-list 骨架 | 单个 Form 收集值与校验；Field 管理字段节点；新建 / 编辑仅预填和关键字段 disabled 条件不同；提交、取消、失败反馈完整。 |
| dashboard | `template/src/server/yaml/common/dashboard.yaml` | 页头与刷新；时间范围；Statistic 指标卡；趋势图；构成区；指标和图表使用 Row / Col 响应式栅格，时间变化驱动同一数据源刷新。 |
| login | `template/src/server/yaml/common/login.yaml` | 页面 body 使用 `type: Login`；layout / authVariant 与品牌 props 分离；提交走 `request → 成败分支 → message / app.reload`；不得改写成 Card + 手写 Form + 页面背景 CSS。 |

从固定 Grid 改为第 4.4 节规定的响应式 Row / Col，以及把页头两区在窄屏改为纵向 Row / Col，属于**标准响应式转换**，不构成自定义变体。其他区域增删、容器替换或排列变化都要写变体理由。

### 3.2 变体书面理由

只有 PRD 明确要求，而默认骨架的结构无法表达该要求时，才允许变体。计划的「布局模式」必须同时回答以下五点：

1. **PRD 依据**：引用文件和章节，并摘出可核对的任务约束，例如“新建和编辑需要可分享的独立 URL”。
2. **基准限制**：陈述结构事实，例如“抽屉没有独立路由”，不得使用主观评价代替。
3. **采用结构**：写出替换的容器、组件和区域顺序，例如“沿用同一 Form，移到 `/orders/new` 与 `/orders/:id/edit` 路由页”。
4. **保留项**：列出仍沿用的 Form、Field、gap、状态和操作闭环，防止变体变成重新设计。
5. **窄屏与状态影响**：写出新的 Col 档位、滚动位置及 empty / loading / error / disabled 的呈现位置。

示例：`变体：data-list 抽屉改独立路由表单；PRD 依据：orders.md#分享编辑链接要求 URL 可定位记录；基准限制：overlay 无独立路由；采用结构：Breadcrumb → Form → 操作区；保留项：entityForm、Field 规则、gap 和保存闭环；窄屏与状态影响：字段 Col span=24/md=12，详情加载错误在 Form 前 Alert 并重试。`

## 4. 布局、Form / Field 与间距硬规则

### 4.1 搜索区

- 关键词 / 枚举筛选与查询、重置按钮组成一个 `Form`，显式写 `name` 和 `layout: inline`；即点即生效且没有提交语义的 ChipFilter 快筛行不伪装成提交表单。
- 输入控件用 `props.name` 绑定；查询 Button 写 `submit: true`；`onSubmit` 执行 `setState → reload`。重置执行 `form.setValues → setState → reload`，不能只清空可见输入而保留旧请求参数。
- 搜索控件沿用 data-list 的 Field 结构；查询 / 重置按钮组放在无 label 的 Field 中，并用 `Flex gap: small, align: center`。不得使用空格、不换行空格或伪 label 对齐按钮。
- 390px 下依赖 inline Form 的自动换行；每个 label 与自身控件保持同组，查询和重置均可点击，不把按钮挤出页面。

### 4.2 纵向表单与 Field

- 独立表单和内嵌 / 抽屉表单默认 `Form layout: vertical`；一个表单上下文只能有一个原生 Form，不得嵌套。
- 抽屉分区沿用 `Text(strong) → Separator → 字段组`；分区间外层 `Flex direction: vertical, gap: middle`，同组字段 `Flex direction: vertical, gap: small`，底部操作 `Flex justify: end, gap: small`。抽屉内不得仅为分区再套 Card。
- Field 的 `label` 负责标签，`required` 负责必填星号，`labelHint` 负责标签行右侧说明，`description` 负责控件下方辅助说明，`error` 负责声明式外部错误。实际必填校验仍写在控件的 `rules`；不得同时在外层 Field 和内层控件重复声明 label。
- 校验失败由 Form / rules 在对应字段下展示；`Field.error` 不重复书写同一条 rules 消息。禁止用 `Text("*") + Label` 拼字段，也禁止用额外 margin 调整 label、hint 或 error 的位置。
- 新建 / 编辑复用同一 Form。编辑预填用 `initialValues` 或 `form.setValues`；关键字段的 disabled 条件及原因写入计划。

### 4.3 Flex / Grid / Row / Col 与间距令牌

| 容器 | 允许用法 | 间距契约 |
| --- | --- | --- |
| Flex | 页头、按钮组、纵向分区和字段组；`direction` / `justify` / `align` 按骨架 | 优先 `gap: small / middle / large`；骨架已有的数值 gap（如标题区 `gap: 2`）可原样保留，不另造数值。 |
| Grid | 仅限不需要跨窄屏改变列数的固定均分区域；多列表单和 dashboard 不作为默认 | `gap` 使用骨架已有数值；一旦 `columns > 1` 且页面需要窄屏单列 / 少列，按第 4.4 节改为 Row / Col。 |
| Row / Col | 需要响应式列数、卡片网格、成对字段和窄屏纵向页头 | 本契约的响应式区域显式写 `gutter: [16, 16]`；卡片同高行写 `align: stretch`；Col 使用 24 分栏，档位总和不得超过 24。 |
| Page | 页面根节点 | 使用 Page 自带 children 纵向间距，不在每个首级区域再写 margin 模拟页面节奏。 |

禁止为修复单页对齐新增 `style.margin*`、`margin*` CSS、`mt-* / mb-* / ml-* / mr-*` 等补丁，或用绝对定位、空白文本撑位置。标准骨架中已经存在的 class 可随骨架保留；组件宽度和图表高度使用该组件当前公开 props / class 挂载契约，不把尺寸设置伪装成间距补丁。经 `theme-and-style.md` 移植的原产品主题 CSS 不属于单页补丁，但不得用它覆盖上述布局规则。

### 4.4 固定 Grid 的窄屏转换规则

生成响应式页面前逐棵子树检查 `Grid`：

1. `columns: 1` 可保留。
2. `columns: 2` 改为 `Row gutter: [16, 16]`；每个原 Grid 单元改为 `Col props: { span: 24, md: 12 }`。因此 0–767px 单列，768px 起两列。
3. `columns: 3` 改为每个 `Col props: { span: 24, md: 12, xl: 8 }`。因此 0–767px 单列，768–1199px 两列，1200px 起三列。
4. `columns: 4` 改为每个 `Col props: { span: 24, md: 12, xl: 6 }`。因此 0–767px 单列，768–1199px 两列，1200px 起四列。
5. 五列以上或非均分布局不得直接套公式；按 PRD 重排，并在计划逐列写出 `span / md / xl`，每个断点的行内合计不超过 24，390px 的每个 Col 必须为 24 或明确写出内部滚动容器。
6. 卡片列表需要同高时给 Row 写 `align: stretch`；Field 行不为了同高拉伸错误文案区域。
7. `CardList columns` 和 `For columns` 也是固定列数，不因组件名不同而豁免。390px 需要单列而组件只提供固定 columns 时，改用 `Row / Col + EntityCard`（或 PRD 对应的单项组件），并在计划记录该标准响应式转换。
8. 转换后必须在 390×844 与 1440×900 各截图一次，验证列数、顺序和 `document.documentElement.scrollWidth <= clientWidth`。表格允许在其自身区域横向滚动，但整页不得横向滚动。

断点按当前 Row / Col 契约：`md` 为最小宽度 768px，`xl` 为最小宽度 1200px；未写 `sm` 时，`span: 24` 覆盖 768px 以下。

## 5. 组件语义：whenToUse / whenNotToUse

计划中的选择理由必须能对应下表的数据形状或任务条件；只写组件名称不算理由。

| 组件 | whenToUse | whenNotToUse | 验收判据 |
| --- | --- | --- | --- |
| Select | 扁平单选，候选不超过 20 个；11–20 个且需要过滤时使用当前 `showSearch` 能力。options 为 `label / value / disabled?`。 | 层级数据；超过 20 个且关键词检索是主要定位方式；多选；允许提交候选外文本。 | 展开、选中、清空（声明 allowClear 时）后 Form 值为所选 value；禁用项不可选；触发器和弹层宽度不挤压页面。 |
| Combobox | 扁平单选且候选超过 20 个，或 PRD 明确以关键词过滤为主要定位方式；options 为 `label / value / disabled?`。 | 层级候选；多选；自由文本；少量固定候选且没有检索任务。 | 输入关键字后候选减少，无匹配有空文案，选中后提交原始 value；不得把输入串当作未选中候选的提交值。 |
| TreeSelect | 树形数据且父节点或叶子均可作为合法单值；需要按 label 搜索树时使用 `searchable`。 | 只能选叶子且必须保存完整路径；扁平候选。 | 展开 / 收起和选中节点行为正确，Form 值是单个节点 value；搜索命中后祖先路径可见。 |
| Cascader | 省市区等层级数据，只有叶子是合法值，提交值需要完整路径数组。 | 需要选中间层级；扁平候选；大树必须关键词搜索。 | 只有选择叶子才完成，显示各级 label，Form 的 event 是路径 value 数组。 |
| DatePicker | 日期或日期范围；范围使用 `mode: range`，需要快捷范围时配置 presets。 | 仅时间；用一个字段同时选择日期和时刻；用两个 single 拼范围。 | single 提交 ISO 日期字符串，range 提交 `{start,end}`；清除和预设按当前契约触发 onChange。 |
| InputGroup | 一个 Input 与同一字段的前后缀 Text / Button，例如金额前缀 `¥` 或复制按钮。 | 拼接多个独立字段；替代 Flex 做页面布局；替代 Form / Field 承担值收集、标签或校验。 | 组内 Input 仍有 name / rules；前后缀与输入语义相关；focus 环和 disabled 表现覆盖整个组合而非错位。 |
| Form | 一组字段需要统一值收集、rules 校验和提交，包括搜索、独立页、内嵌面板和抽屉。 | Form 内再嵌 Form；散放控件后用 setState 攒草稿和手写必填校验；没有提交语义的即时 ChipFilter 快筛。 | `name` 值进入 event，失败 rules 阻止请求，submit Button 写 `submit: true`，成功和失败都有可见结果。 |
| Field | 需要统一 label / required / labelHint / description / error 与控件间距；纵向标准字段和 data-list 搜索结构按骨架使用。 | 作为普通页面分区容器；用 Text / Label 另拼一份标签；重复展示 rules 已有错误。 | 每个控件最多一个可见 label；错误位于对应字段下；error 出现时相邻字段不重叠，间距仍由 Field / Form 承担。 |
| Table | 多行高密度数据，需要列对齐、字段比较、分页、排序或行操作。 | 以实体摘要和视觉浏览为主的卡片墙；为了在空表格上再叠加 Empty；用卡片模拟多列比较。 | columns / dataSource / rowKey 正确；操作列 Button 为 link；loading 使用组件能力；空数据只出现组件自身的一份空态。 |
| CardList | 实体摘要卡片网格，整卡进入详情、卡内操作或首格新建；items 使用 EntityCard 同形字段。 | 列比较、排序、批量行操作；只有一张卡；把固定 columns 当作窄屏响应式能力。 | onItemClick / onItemAction / onCreateClick 使用事件回传 item；空态与 createText 按组件契约互斥；390px 无挤压多列。 |
| Empty | 请求成功且确定某区域无数据；用 title / description 说明原因，children 提供 PRD 中存在的下一任务 CTA。 | 加载中；请求失败；无权限；Table / CardList 已有内置空态时再叠加一层。 | 初始空与筛选空文案可区分；CTA 执行真实动作；没有 CTA 时计划写明只读或无下一任务的 PRD 依据。 |
| Tabs | 2–6 个同层、等权内容视图，在当前页面上下文切换；items 为 `key / label / children?`。 | 只有一个页签却只为使用 `extra` 或标题操作位；页面 / 路由导航；线性流程；普通分区标题。 | 至少两个真实页签；activeKey / onChange（需要受控时）对应正确面板；单页签 extra 场景改 Card / Flex 分区与操作区。 |
| Descriptions | 详情页的只读 label / value 字段集合。 | 需要编辑和提交的字段；用多个 Input disabled 冒充只读详情。 | 字段来自 detail 数据或 PRD 静态声明，无输入控件外观，长值在窄屏可读取。 |
| Login | PRD 含登录页，使用当前 `layout` / `authVariant` / `brand` 契约和内置账号密码 Form。 | 手写 Card + Form + 页面背景；仅为登录页另造间距和颜色体系。 | 五种布局选择有 PRD / 用户决策记录；内置 rules、request 成败 message 和成功后 app.reload 全部可用。 |

Empty 的 CTA 必须接到真实路由或动作。例如订单初始空态可以使用以下结构，且 `/orders/new` 必须在 sitemap 中可达：

```yaml
- type: Empty
  props:
    title: 暂无订单
    description: 创建第一个订单后，可在这里查看进度。
  children:
    - type: Button
      props: { text: 新建订单, variant: primary }
      events:
        onClick:
          - action: navigate
            params: { to: /orders/new }
```

## 6. 状态生成要求

| 状态 | 生成时必须写明 | 通过标准 |
| --- | --- | --- |
| empty | 区分初始无数据和筛选无数据；写数据来源、文案和 CTA 动作。筛选空可提供清空筛选；初始空可提供新建或返回有效上下文。 | 仅在请求成功且数据为空后出现；不同时显示 Skeleton / loading 或 error；CTA 后数据、路由或筛选状态发生计划中的变化；无双空态。 |
| loading | 首次加载与后续刷新分别写呈现方式；Table 使用 `loading`（如 `${dataStatus.list.loading}`），结构已知的页面区域用 Skeleton，提交中 Button 使用当前组件支持的 loading / disabled。 | 加载中不出现 Empty；骨架或指示器不造成区域跳宽、跳高；刷新保留已展示筛选和输入；提交期间不能重复触发请求。组件没有对应 prop 时标记不适用，不编造。 |
| error | 读取失败、提交失败和字段校验失败分别处理。读取失败写 Alert 与 retry action；仅在项目已注册 Result 时才可用 Result 替代 Alert；提交失败写 message 并保留输入；字段失败由 rules 就地显示。 | error 不显示为“无数据”；重试调用原 dataSource；校验失败无请求发出；提交失败后已填值保持不变；登录错误密码有错误反馈。 |
| disabled | 写条件表达式、涉及控件和用户可理解的原因；权限隐藏与禁用按 PRD 区分。 | 点击和键盘操作均不触发 action；不是只降低透明度；label 和原因仍可读；条件解除后控件恢复，布局不跳动。 |
| hover | 列出可点击行、卡片、Button、Link、Tabs 等交互代表；非交互文本不添加伪 hover。 | 指针悬停有可观察反馈且不改变元素尺寸；浮层 / Tooltip 不被容器裁切；可点击卡片或行有反馈，纯展示区域没有误导性反馈。 |
| focus | 写键盘进入主要输入、操作和 Tabs 的顺序；弹层关闭后的焦点返回位置。 | Tab 顺序与视觉顺序一致；焦点环在亮色和暗色均可见且不被裁切；Enter / Space 可触发对应按钮；Escape 关闭浮层后焦点回到触发器。 |

用于截图的状态必须来自真实页面运行：空数据可让测试接口返回空集合，loading 可延迟请求，error 可返回失败响应，disabled 可切换计划中的权限 / 状态条件。不得通过修改图片、隐藏报错或在静态稿上摆组件伪造状态证据。

## 7. 三层验收

三层依次为：本节的静态检查 S1–S8；`acceptance-checklist.md` 的浏览器功能验收 F1–F6；本节的适用截图矩阵与 V1–V9 目检。三层互相不能替代。

### 7.1 静态验收

对每个变更页执行并记录 S1–S8；任一失败即停止交付该页。

| 编号 | 检查 | 通过标准 |
| --- | --- | --- |
| S1 | 计划门禁 | `docs/prd/ui-plan.md` 有该 page id 的唯一完整行；PRD 来源、骨架 / 变体、四个状态和两种视口均可定位；计划时间早于本次 YAML 生成 / 修改。 |
| S2 | DSL 与路由 | 对该 YAML 运行 `npx pactor validate <实际文件路径>`；文件、page id、sitemap pages / menus 一致，hidden 详情 / 编辑有真实入口和 activeMenu。 |
| S3 | 骨架与间距 | 区域顺序与计划一致；gap / gutter 来自骨架或第 4 节；无新增 margin / 空白文本 / 绝对定位补丁；固定多列网格已完成响应式转换。 |
| S4 | Form / Field | 搜索为 inline Form；所有提交字段有 name，rules 和 submit 正确；无嵌套 Form、双 label、手写必填动作链；新建 / 编辑共用 Form，预填与 disabled 条件正确。 |
| S5 | 组件语义与 props | 逐区符合第 5 节；Tabs.items 用 key / label / children，CardListItem 与 EntityCard 同形；不把不同组件统一猜成 key / value / label；单页签 Tabs 未因 extra 成为分区容器。 |
| S6 | 数据与交互 | 每个 PRD 交互都有 events / actions 闭环；查询参数来自提交后的 state；重置同时复位表单与请求状态；读取失败可重试，提交失败有反馈。 |
| S7 | 状态接线 | empty / loading / error 不混用；Table loading、Button loading / disabled 等只使用当前存在的 props；无权限或请求失败不被渲染成 Empty。 |
| S8 | 计划一致性 | 实际组件、布局、字段、文案、状态和窄屏规则逐项等于计划；任何差异都已按第 8 节先修正计划或实现并留下依据。 |

### 7.2 视觉截图矩阵

使用生成项目的真实 dev server。默认皮肤按以下矩阵留证；每套其他已注册皮肤再按 `acceptance-checklist.md` 执行换肤检查，不能用默认皮肤结果替代。

- 视口：桌面 `desktop = 1440×900`；窄屏 `narrow = 390×844`。
- 主题：`light`、`dark`。
- 对 `normal` 以及计划中适用的 `empty`、`loading`、`error`、`disabled`：每个状态都截取 `desktop-light`、`desktop-dark`、`narrow-light`、`narrow-dark` 四张。状态位于抽屉 / 弹层时，截图必须打开对应区域。
- 对 `hover`、`focus`：至少在 desktop 的 light / dark 各留一张；每类交互组件选择一个代表，输入、主按钮和可点击行 / 卡片 / Tabs 在页面存在时都要覆盖。
- 文件保存为 `docs/prd/ui-evidence/<page-id>/<state>-<desktop|narrow>-<light|dark>.png`。重验后替换同名旧图，验收记录引用实际文件。
- 不适用状态不制造截图，但 S1 必须已有不适用依据；不得为了减少矩阵而把 PRD 已有状态改写成不适用。

### 7.3 截图与目检 rubric

每项只记 `通过` 或 `不通过`，不用平均分抵消失败。

| 编号 | 目检项 | 通过标准 |
| --- | --- | --- |
| V1 | 信息层级 | 页面标题、分区标题、说明和主要操作的层级与计划一致；PRD 区域顺序未变；没有无来源的额外标题、操作或卡片。 |
| V2 | 布局与 Field 间距 | 同组相邻 Field 的垂直间距相等；label、labelHint、description、error 没有双份、重叠或遮挡；按钮组与字段基线符合所用 Form layout；error 出现后相邻字段仍可操作。 |
| V3 | 桌面 / 窄屏 | 两种视口的主操作均在页面内可达；Col 列数符合第 4.4 节；390px 无整页横向滚动、控件重叠、不可读截断或被裁掉的浮层；表格内部滚动时不带动整个页面。 |
| V4 | 亮色 / 暗色 | 页面、Card、Input、Table、Empty、图表及挂到 body 的浮层均随主题切换；无白边、死色、文字融入背景或仅图标可见而文字消失。 |
| V5 | empty / loading / error | 三种状态互斥；Empty 的文案和 CTA 与计划一致且无双空态；loading 不闪 Empty；error 有明确失败反馈和重试；状态出现时主要布局不坍塌。 |
| V6 | disabled | 禁用控件与可用控件可区分，标签和原因仍可读；鼠标与键盘均不能触发；解除条件后恢复且不产生位置跳变。 |
| V7 | hover / focus | hover 只出现在交互元素且不造成位移；focus 环完整可见，Tab 顺序符合视觉顺序；暗色下焦点环仍可辨认，弹层关闭后焦点返回触发器。 |
| V8 | 组件行为 | Select / Combobox / TreeSelect / Cascader / DatePicker 的实际选中值、清空、搜索或层级行为符合第 5 节；Tabs 切换正确面板；Table / CardList 的操作到达正确记录。 |
| V9 | 计划一致性 | 截图中的区域、组件、文案、状态、列数和操作位置与 ui-plan 当前行一致；截图之外的实际操作也未绕开计划。 |

**静态检查、浏览器功能验收与截图目检不能互相替代。** DSL validate 通过、props 合法或功能断言通过，都不能免除截图和目检；截图接近计划，也不能免除 DSL、Form、路由、数据与 action 静态检查及真实浏览器功能操作。页面完成条件是 S1–S8、F1–F6 全部通过、适用截图矩阵齐全且 V1–V9 全部通过。

## 8. 验收失败后的修复与重验

1. **登记失败**：记录 `page id、S/F/V 编号、四层分类、截图或日志、预期结果、实际结果`。同页的多个失败分别登记，不用一条“页面有问题”合并。
2. **判断计划或实现责任**：实现偏离有 PRD 依据的计划时修实现；计划遗漏或误解 PRD 时先修 ui-plan，补齐来源和变体理由，再修实现。不得为了消除差异而把计划改成偶然生成结果。
3. **按根因修复**：布局回到标准骨架和 gap / Row / Col；语义错误替换组件；状态错误修正数据或 action 接线；主题错误修令牌。不得用 margin / CSS 补丁、隐藏溢出内容、删除交互、删除状态或降低验收矩阵来换取通过。
4. **组件契约不确定时停止叠加修改**：回查当前 packages 源码和正式组件文档，确认 props / 事件后再改；不得连续尝试猜测字段。
5. **整页重验**：任何修复后，重新执行该页 S1–S8、浏览器功能 F1–F6、完整适用截图矩阵和 V1–V9，而不是只复查失败项或失败点击。共享骨架、主题令牌、皮肤或公共组件发生变化时，对所有使用它的变更页执行整页重验，并按 acceptance-checklist 做未改页回归。
6. **更新证据**：重验截图替换同名旧图，结果表写明修复内容和本轮结果；旧失败证据保留在验收记录中用于追踪，但不能作为当前通过证据。
7. **关闭条件**：该页没有未处理的 S/F/V 失败，计划、实现和当前截图一致。仍存在已知问题时不得写通过，也不得把失败转写成不适用。

验收记录使用下表，确保修复可以回溯：

```markdown
| page id | 检查编号 | 层 | 失败证据 | 修复 | 重验范围 | 当前结果 |
| --- | --- | --- | --- | --- | --- | --- |
```

## 9. 五类页面的计划示例

以下示例直接采用第 2.1 节的九列格式。示例中的接口和 PRD 路径属于同一个示例项目；实际项目必须替换为真实来源，不得复制示例接口充当已存在接口。

| PRD 来源 | page id / type | 布局模式 | 区域 / 组件 / 选择理由 | Form layout / Field 间距 | 数据 / 交互 | empty / loading / error / disabled | 桌面 / 窄屏行为 | 验收项 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `docs/prd/orders.md#订单列表（P0）` | `order-list / list` | `标准：template/src/server/yaml/models/data-list.yaml；成对字段按第 4.4 节转 Row / Col` | 页头 → Typography h3/muted + 新建 Button → 保留标题层级与主操作<br>筛选 → Card + Form + Input/Select → 关键词和固定状态枚举需要显式查询<br>结果与计数 → Table `pagination=false` + Text(total) → 名称、状态、负责人需要列比较和行编辑，并显示当前筛选总数；PRD 未要求分页<br>编辑 → Drawer `width=min(720px,100vw)` + 同一 entityForm → 新建无预填、编辑按 id 预填且抽屉不超出视口 | `search layout=inline`，Field 标签为编码/名称、状态；查询/重置位于无 label Field，Flex gap=small<br>`entityForm layout=vertical`；分区 gap=middle，字段组 gap=small；名称/负责人用 Row gutter=[16,16]，Field 管 label/rules 错误 | `GET /api/orders` 以 keyword/status 查询；查询 `setState→reload list`；重置 `form.setValues→setState→reload`；编辑 `setState id→reload detail→overlay.open`；保存 `request(id=saveResult)→if ${actions.saveResult != null && actions.saveResult.ok == true}`：成功 message + overlay.close，否则 error message；overlay 关闭后 reload list | empty=初始请求成功且默认筛选返回 `items:[]` 时 `Table.emptyText=暂无订单`；筛选返回 `items:[]` 时 `Table.emptyText=没有符合条件的订单`；两种空态均不叠加 Empty，筛选空可点击重置恢复默认请求<br>loading=首次加载与后续刷新均为 `Table.loading=${dataStatus.list.loading}`；刷新保留筛选和输入，加载时不显示空态<br>error=`when=${dataStatus.list.error != null}` 时在表格上方显示 Alert“订单加载失败”+重试 Button `reload list`，保留筛选<br>disabled=编辑时编码 Input `disabled=${state.editingId != ''}`，Field.description=创建后不可修改 | 1440×900：筛选同行，Table 显示名称/状态/负责人/操作四列，抽屉宽 720px，成对字段 md=12<br>390×844：页头标题与新建按钮用 Row/Col span=24 纵向排列；inline 筛选换行；成对字段 span=24；抽屉宽 390px；Table 仅自身横向滚动，整页无横向滚动 | L1：输入“支付”并查询 → 请求带 keyword=支付且只显示匹配行<br>L2：编辑 id=O-100 → 与新建同一 Drawer 出现，编码已填且禁用<br>L3：分别返回初始空集合与筛选空集合 → 只有一份空态且文案可区分，筛选空点击重置后恢复默认请求<br>L4：S1–S8、F1–F6 通过，normal 与 empty/loading/error/disabled 四状态截图矩阵和 V1–V9 通过 |
| `docs/prd/orders.md#订单详情（P0）` | `order-detail / detail` | `标准：references/page-templates.md#详情页；PRD 明确“概览 / 变更记录”两个同层视图，使用 Tabs` | Breadcrumb → 返回订单列表<br>标题行 → Typography + 停用 Button + 状态原因 Text → 操作和原因都作用于当前订单<br>概览 → Descriptions → 只读字段不需要输入外观<br>两个视图 → Tabs `items=[{key:overview,label:概览},{key:changes,label:变更记录}]` → 同页切换且不换路由 | `无提交表单：停用为确认动作，Tabs onChange 只切换视图；Field 不适用` | `state.tab=overview`；`GET /api/orders/${route.params.id}` 返回 fields/changes/status；Tabs `activeKey=${state.tab}` 且 `onChange→setState tab`；停用 `confirm→request(id=disableResult)→if ${actions.disableResult != null && actions.disableResult.ok == true}`：成功 message + reload detail，否则 error message；变更空态 CTA `setState tab=overview` | empty=`${dataStatus.detail.loading == false && dataStatus.detail.error == null && data.detail.changes.length == 0}` 时在 changes 面板显示 Empty“暂无变更记录”，CTA“返回概览”切换到 overview<br>loading=`${dataStatus.detail.loading}` 时概览字段和变更面板分别显示 Skeleton，不显示 Empty<br>error=`when=${dataStatus.detail.error != null}` 时详情上方 Alert +“重新加载”`reload detail`<br>disabled=停用 Button `disabled=${data.detail.status == 'DISABLED'}`，旁文“订单已停用” | 1440×900：Descriptions 与变更记录按 Tabs 面板展示，标题操作位于右侧<br>390×844：页头两区 Col span=24 纵向排列；两个短页签完整显示；面板内容 Col span=24；长订单号可复制且不撑破页面 | D1：切换 changes → 仅变更面板可见，URL 不离开订单详情<br>D2：空变更点击“返回概览”→ overview 激活<br>D3：status=DISABLED 时点击停用 → 无请求发出且原因可见<br>D4：S1–S8、F1–F6、适用状态矩阵和 V1–V9 通过 |
| `docs/prd/orders.md#可分享编辑链接（P0）` | `order-form / form` | `变体：data-list 抽屉改独立路由表单；PRD 依据：编辑链接需定位记录；基准限制：overlay 无独立路由；采用结构：Breadcrumb→Form→操作区；保留项：entityForm、Field 规则、gap、保存闭环；窄屏与状态影响：字段 Col span=24/md=12，读取错误在 Form 前 Alert` | 基本信息 → Field + Input/Select → 名称、客户需要校验和提交<br>日期 → DatePicker mode=range → 交付起止是一个范围值<br>操作区 → 取消 + 保存 Button → 取消返回列表，保存提交整表 | `orderForm layout=vertical`；两个分区外层 Flex gap=middle；字段组 gap=small；名称/客户 Row gutter=[16,16]，各 Col span=24/md=12；保存区 Flex justify=end gap=small；交付范围 Field.description=含起止日期 | `state.submitting=false`；`GET /api/customers` 提供客户 options；编辑 `GET /api/orders/${route.params.id}` 并 `initialValues=${data.detail}`，新建省略 detail；保存 `setState submitting=true→request(id=saveResult)→setState submitting=false→if ${actions.saveResult != null && actions.saveResult.ok == true}`：成功 message + navigate /orders，否则 error message 并保留 values；取消 `navigate /orders` | empty=customers 请求成功且 `items.length=0` 时 Select 弹层只显示自身空候选文案，Field.description=暂无可选客户，请先创建客户；PRD 不提供本页新建客户入口，保存 Button 同时禁用<br>loading=`${dataStatus.detail.loading}` 时编辑 Form 区域 Skeleton；customers 加载期间保存 Button 禁用并显示 `Field.description=客户选项加载中`，不编造 Select.loading；保存 Button `loading=${state.submitting}`<br>error=`dataStatus.detail.error` 非空时在 Form 前 Alert + `reload detail`，`dataStatus.customers.error` 非空时在客户 Field 前 Alert + `reload customers`；必填失败显示 rules message；保存失败 message=保存失败且保留输入<br>disabled=编辑时编码 `disabled=${route.params.id != null}`；保存 Button `disabled=${state.submitting \|\| dataStatus.customers.loading \|\| dataStatus.customers.error != null \|\| data.customers.items.length == 0}`，加载、错误或无候选原因由对应 Field / Alert 说明 | 1440×900：名称/客户两列，其余长文本单列；操作区右对齐<br>390×844：所有字段 Col span=24 单列；DatePicker 浮层不超出视口；取消和保存保持可见且无整页横向滚动 | F1：名称留空点保存 → 显示“请输入订单名称”且 Network 无保存请求<br>F2：打开编辑 URL → 名称预填、编码禁用；保存失败后名称输入仍保留且 submitting=false<br>F3：交付范围选择起止 → 提交 body 为 `{start,end}` 对应值<br>F4：S1–S8、F1–F6、适用状态矩阵和 V1–V9 通过 |
| `docs/prd/analytics.md#运营看板（P0）` | `ops-dashboard / dashboard` | `标准：template/src/server/yaml/common/dashboard.yaml` | 页头 → Typography + 刷新 Button → 显示看板标题并手动重载<br>范围 → DatePicker mode=range → 所有指标共享同一时间范围<br>指标 → Statistic + Card → 四个独立数值需要并列比较<br>趋势切换 → ToggleGroup → 在请求、Token、费用、延迟中做单选以切换同一趋势指标<br>趋势 → AreaChart → 按时间观察变化<br>构成 → Progress + Card → 比较各模型占比 | `无提交表单：DatePicker onChange 即时 setState range 并 reload dashboard；Field 不适用`；卡片 Row gutter=[16,16] | `state.defaultRange={start:'2026-10-12',end:'2026-10-18'}`，range 初始等于 defaultRange；`GET /api/dashboard?start&end`；范围变化 `setState range→reload`；刷新 `reload dashboard`；趋势 ToggleGroup `onChange→setState metric`；空趋势 CTA `setState range=${state.defaultRange}→reload dashboard` | empty=`${dataStatus.dashboard.loading == false && dataStatus.dashboard.error == null && data.dashboard.trend.length == 0}` 时趋势 Card 内显示 Empty“所选范围没有调用数据”，CTA“恢复默认范围”写回 defaultRange 并 reload<br>loading=`${dataStatus.dashboard.loading}` 时指标和图表区域 Skeleton，保留当前范围<br>error=`when=${dataStatus.dashboard.error != null}` 时看板顶部 Alert“看板加载失败”+重试 `reload dashboard`，不把指标写成 0<br>disabled=刷新 Button `loading=${dataStatus.dashboard.loading}` 且 `disabled=${dataStatus.dashboard.loading}`，防止重复请求 | 1440×900：四个指标 Col xl=6 四列；趋势全宽；构成两卡 xl=12<br>390×844：所有指标和构成 Col span=24 单列；768–1199px 指标 md=12 两列；日期触发器和图表不撑破页面，整页无横向滚动 | B1：选择近 7 天 → 请求 start/end 与 DatePicker event 一致，指标和趋势使用同一响应<br>B2：空趋势点击 CTA → range 变为 start=2026-10-12、end=2026-10-18 并重新请求<br>B3：390px 指标为单列、1440px 为四列，图表无横向溢出<br>B4：S1–S8、F1–F6、适用状态矩阵和 V1–V9 通过 |
| `docs/prd/auth.md#账号密码登录（P0）` | `login / login` | `标准：template/src/server/yaml/common/login.yaml；layout=split、brandSide=left、brandRatio=0.5、authVariant=card；PRD 依据：桌面左侧品牌插画、右侧登录卡` | 整页 → Login → 品牌区、认证区和内置 Form 由业务组件承担<br>品牌 → brand.name/title/description → 文案来自 PRD<br>认证 → Login 内置账号密码 Field → 需要内置 rules 和提交闭环 | `Login 内置 Form；不得在外层再包 Form 或手写 Field 间距`；页面不增加背景 / Card CSS | 提交 `request(id=loginResult)` 调用 `POST /api/auth/login`，body 取 event.username/password；`${actions.loginResult == null \|\| actions.loginResult.token == null}` → error message“用户名或密码错误”；`${actions.loginResult != null && actions.loginResult.token != null}` → success message + `app.reload to=/` | empty=不适用：登录页无集合数据，不以 Empty 表达空账号或空密码<br>loading=不适用：登录请求由 DSL request 编排，当前 Login 未声明提交 loading prop，不编造该 prop<br>error=空账号/密码由内置 rules 就地提示；错误凭证显示 message 且不跳转<br>disabled=不适用：PRD 未声明禁用登录条件，不添加无契约的 Login.disabled | 1440×900：split 品牌列与认证卡各占 50%，brandSide=left<br>390×844：Login 内置单列行为，登录标题、账号、密码、提交按顺序可见；无桌面品牌双列挤压和整页横向滚动；亮暗色浮层提示可读 | A1：空表单提交 → 两个必填错误出现且无登录请求<br>A2：错误密码 → 显示“用户名或密码错误”，仍在 /login<br>A3：正确凭证 → 成功后 app.reload 到 /，菜单按会话更新<br>A4：S1–S8、F1–F6、normal/error 截图矩阵和 V1–V9 通过；empty/loading/disabled 的不适用依据同步核对 |
