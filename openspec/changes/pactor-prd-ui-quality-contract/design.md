# Design: pactor-prd-ui-quality-contract

## Context

“美观”包括主题、布局、间距、组件语义和状态细节，不能只由皮肤或截图色差衡量。稳定的生成质量需要在 YAML 前显式做出 UI 决策，并在生成后分别做静态和视觉验收。

## Decisions

### D1. 逐页 UI 计划是生成中间产物

每页在 `docs/prd/ui-plan.md` 记录：PRD 来源、page id/type、布局模式、区域与组件选择理由、Form layout 与 Field 间距、数据/交互、empty/loading/error/disabled 状态、桌面与窄屏行为、验收项。P0/P1 页面必须有完整条目，禁止无计划直接生成。

### D2. 标准骨架优先，禁止自由发挥间距

列表、详情、表单、dashboard、login 分别使用模板同类页基准。搜索区使用 Form inline；标准字段由 Field 管理 label/hint/error；间距使用模板 Flex/Grid/gap 与主题令牌，不用临时 CSS 或散落的 margin 修补。只有 PRD 明确要求且标准变体不能表达时才允许自定义布局，并需在 UI 计划写明原因。

### D3. 组件按语义选择

- 层级数据用 TreeSelect/Cascader，大量可搜索选项用 Combobox，日期用 DatePicker，前后缀输入用 InputGroup。
- 空态用 Empty 并按任务提供 CTA；编辑与新建复用同一 Form。
- Tabs 仅在需要页签语义或已批准的模式中使用；单页签 Tabs 不因支持 extra 而成为默认分区容器。
- 表格/卡片列表依据数据密度与 PRD 操作方式选择，不机械套用一种展示。

### D4. 经验条目必须与当前源码契约一致

- FloatingButtonGroup 才有受控 value；ExpandingButtonGroup 使用 onSelect、confirm/confirmLabel。
- isOpaque 仅描述 ActionEngine params 的命中子树；必须保留后端 type 时给出可执行提交方式，不笼统建议 typeKey。
- ChipFilterItem 为 value/text/dot；CardListItem 按 EntityCard 字段；Tabs.items 为 key/label；Segmented.options 为 label/value。
- Select 宽度按当前 wrapper + trigger 契约书写；聚合样式保持 ui → blocks → chart → chat 级联顺序。

### D5. 三层验收

静态检查验证组件、表单、路由和 DSL 红线；浏览器功能验收逐项操作数据、交互、错误分支和状态；截图与目检验证信息层级、间距、对齐、响应式、亮暗色和状态。任何一层都不能用另一层替代，失败后修复并重验该页全部三层。

## Risks / Trade-offs

- **UI 计划流于形式** → 后续 E2E 必须对照计划检查实际页面，计划缺失或不一致均不通过。
- **规则过死阻碍 PRD 表达** → 允许有理由的布局变体，但禁止无依据的随意组件和间距。
- **文档与框架演进漂移** → 条目附当前源码/正式文档核对任务，E2E 只采用已验证契约。
