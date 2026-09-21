/**
 * 基础补齐类完整详情（第六批组件，packages/ui 真实实现已核对）。
 * - component.tag / component.status：apiProps 核对自
 *   packages/ui/src/components/components/Tag|Status/index.tsx；
 * - component.space / component.container：apiProps 核对自
 *   packages/ui/src/components/components/Space|Container/index.tsx；
 * - component.steps / component.anchor / component.back-top / component.affix：
 *   apiProps 核对自 packages/ui/src/components/components/Steps|Anchor|BackTop|Affix/index.tsx。
 */
import type { ComponentDetailContent } from './component-details.ts';

export const basicDetailContents: Record<string, ComponentDetailContent> = {
  'component.tag': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 标记分类、属性或状态关键字：列表行的类型标记、筛选栏的已选条件、实体的属性标签。',
      '- 可移除的筛选条件：closable 标签配合 events.onClose 同步删除对应条件。',
      '- 需要语义色区分轻重：success / warning / error / info 四色表达状态强弱。',
      '',
      '**何时不用**',
      '',
      '- 表达运行 / 审核等带状态点的业务状态：使用 Status（状态点 + 文本）。',
      '- 表示未读数量等计数提醒：使用 Badge。',
      '- 可点击触发跳转或操作：使用 Button 或 Link，Tag 不是操作入口。',
    ].join('\n'),
    previewNote:
      '静态结构：行内小标签 <span data-slot="tag">（inline-flex、rounded-md、text-xs），语义色经令牌类映射（success → border-success/50 bg-success/10 text-success，error 映射 destructive）；bordered=false 去描边；icon 渲染前缀图标（Icon 白名单）；closable 时尾部渲染关闭按钮（data-slot="tag-close"），点击触发 onClose 事件并在非受控场景隐藏自身。',
    variants: [
      { name: '默认', visual: 'muted 底色 + 边框', scene: '普通分类、属性标记' },
      { name: '语义色', visual: 'success / warning / error / info 浅底深字', scene: '状态强弱、优先级区分' },
      { name: '可关闭', visual: '尾部 × 按钮', scene: '筛选条件、可移除标记' },
      { name: '带图标', visual: '前缀小图标', scene: '强化类型识别（如标签、旗帜）' },
    ],
    apiProps: [
      { name: 'text', type: 'string', defaultValue: '—', description: '标签文本' },
      { name: 'color', type: "'default' | 'success' | 'warning' | 'error' | 'info'", defaultValue: "'default'", description: '语义色' },
      { name: 'bordered', type: 'boolean', defaultValue: 'true', description: '是否描边（antd bordered）' },
      { name: 'closable', type: 'boolean', defaultValue: 'false', description: '是否可关闭；点击触发 onClose 并隐藏自身' },
      { name: 'icon', type: 'string', defaultValue: '—', description: '前缀图标名（Icon 白名单，kebab-case / PascalCase）' },
      { name: 'onClose', type: 'event', defaultValue: '—', description: '关闭事件（events.onClose 绑定动作）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 文案保持 2~6 个字，标签是标记不是句子。',
      '- 同一组标签语义色保持一致的含义（如 error 恒表示阻断性问题）。',
      '- 可关闭标签的移除结果必须可预期：配合数据源同步删除条件，而非仅视觉消失。',
      '- 一组标签用 Space（wrap）排列，避免手写 margin。',
    ].join('\n'),
    examplesDo: [
      '筛选栏：已选条件渲染为 closable Tag，onClose 触发 setState 移除该条件并刷新列表。',
      '表格行：状态列用 success/warning/error 语义色 Tag 区分「已发布 / 待审核 / 已驳回」。',
    ],
    examplesDont: [
      '用 Tag 做页面主操作按钮（应使用 Button）。',
      '在一个实体上堆叠超过 5 个标签（应收敛为关键属性 + 更多收起）。',
    ],
  },
  'component.status': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 表达运行、审核或业务状态：服务运行中、任务处理中、审批通过 / 驳回。',
      '- 需要状态点 + 文本的紧凑组合：列表行、详情页头部、统计卡片脚注。',
      '- processing 态需要「进行中」动感：内置 ping 扩散动画。',
      '',
      '**何时不用**',
      '',
      '- 纯分类标记、可移除条件：使用 Tag。',
      '- 数量提醒或未读计数：使用 Badge。',
      '- 需要图标 + 大标题的整页结果：使用 Result。',
    ].join('\n'),
    previewNote:
      '静态结构：<span data-slot="status"> 行内组合——状态点（data-slot="status-dot"，size-2 圆点，success/processing/error/warning/default 分别映射 bg-success / bg-info / bg-destructive / bg-warning / bg-muted-foreground）+ 文本（data-slot="status-text"）；processing 态在圆点下叠加同色系 animate-ping 扩散层（motion-reduce 时退化为静态点）。',
    variants: [
      { name: 'success', visual: '绿色状态点', scene: '运行正常、审核通过' },
      { name: 'processing', visual: '蓝色状态点 + 扩散动画', scene: '任务进行中、同步中' },
      { name: 'error', visual: '红色状态点', scene: '运行异常、审核驳回' },
      { name: 'warning', visual: '橙色状态点', scene: '存在风险、即将过期' },
      { name: 'default', visual: '灰色状态点', scene: '未启用、已下线等中性态' },
    ],
    apiProps: [
      { name: 'status', type: "'success' | 'processing' | 'error' | 'warning' | 'default'", defaultValue: "'default'", description: '状态（对齐 antd Badge status 五态）' },
      { name: 'text', type: 'string', defaultValue: '—', description: '状态文本' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 状态文本与状态点语义必须一致（error 配「失败 / 驳回」类文案，不写中性词）。',
      '- 同一页面的状态枚举保持同一套五态映射，不自定义第六种颜色。',
      '- processing 仅用于真实进行中的状态，不做装饰性动效。',
    ].join('\n'),
    examplesDo: [
      '服务列表：每行 Status 展示「运行中 / 已停止 / 异常」，processing 表示部署中。',
      '审批详情头部：Status 展示当前审批结论，旁置时间戳辅助文本。',
    ],
    examplesDont: [
      '用 Status 标记商品分类（应使用 Tag）。',
      'processing 状态长期停留不做超时收敛（应有终态流转）。',
    ],
  },
  'component.space': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 一组相邻元素需要一致间距：按钮组、标签组、图标 + 文本组合。',
      '- 需要换行的等间距排列：wrap 模式的标签云、操作集合。',
      '- 垂直堆叠的紧凑表单项或文本行（direction: vertical）。',
      '',
      '**何时不用**',
      '',
      '- 需要主轴分布（space-between / 两端对齐）：使用 Flex。',
      '- 行列栅格布局：使用 Grid。',
      '- 大区块之间的篇章间距：用布局组件或间距令牌，Space 面向「相邻小元素」。',
    ].join('\n'),
    previewNote:
      '静态结构：<div data-slot="space">（flex 容器）；direction 映射 flex-row / flex-col；size 档位映射 gap（small=gap-2 / middle=gap-4 / large=gap-6），数字 size 内联 gap 像素；align 映射 items-*；wrap 追加 flex-wrap。子节点经 Renderer children 机制渲染 DSL 子树。',
    variants: [
      { name: '水平', visual: 'flex-row 等间距', scene: '按钮组、标签组' },
      { name: '垂直', visual: 'flex-col 等间距', scene: '紧凑表单项、文本行堆叠' },
      { name: '换行', visual: 'flex-wrap 多行等间距', scene: '标签云、操作集合' },
    ],
    apiProps: [
      { name: 'direction', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: '排列方向' },
      { name: 'size', type: "'small' | 'middle' | 'large' | number", defaultValue: "'small'", description: '间距档位（8 / 16 / 24）或像素值' },
      { name: 'align', type: "'start' | 'center' | 'end' | 'baseline'", defaultValue: '—', description: '交叉轴对齐' },
      { name: 'wrap', type: 'boolean', defaultValue: 'false', description: '超出时是否换行' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（与数字 size 合并）' },
    ],
    guidelines: [
      '- 同组元素间距只用一档 size，不混用多档。',
      '- 水平排列且子元素高度不一时按需设 align（图标 + 文本常用 center）。',
      '- 超过一屏宽度的集合务必 wrap，避免横向溢出。',
    ].join('\n'),
    examplesDo: [
      '卡片底部操作区：Space 排列「编辑 / 复制 / 删除」三个 Button。',
      '筛选栏：Space wrap 排列若干 closable Tag。',
    ],
    examplesDont: [
      '用 Space 做页面左右分栏（应使用 Flex / Grid）。',
      '嵌套多层 Space 只为凑间距（应合并为一层并选对 size）。',
    ],
  },
  'component.container': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 限制内容最大宽度并建立页面两侧留白：文档页、表单页、营销页正文区。',
      '- 需要水平居中的阅读型内容：详情、帮助中心、结果页。',
      '- 按断点选择阅读宽度：sm ~ xl 四档 + full。',
      '',
      '**何时不用**',
      '',
      '- 页面级头 / 侧栏 / 内容三区结构：使用 Layout。',
      '- 需要栅格分列：使用 Grid；Container 只管「宽度与留白」。',
      '- 管理后台等需要满宽利用的场景：用 full 或不使用 Container。',
    ].join('\n'),
    previewNote:
      '静态结构：<div data-slot="container">（w-full px-4 + max-w-screen-{sm|md|lg|xl}，full 为 max-w-none）；centered=false 去掉 mx-auto。子节点经 Renderer children 机制渲染 DSL 子树。',
    variants: [
      { name: 'sm / md', visual: '窄栏（640 / 768px 断点）', scene: '表单页、结果页、登录注册' },
      { name: 'lg（默认）', visual: '标准阅读宽度（1024px 断点）', scene: '文档、详情、帮助中心' },
      { name: 'xl', visual: '宽栏（1280px 断点）', scene: '数据密度较高的页面' },
      { name: 'full', visual: '不限宽', scene: '满宽工作区、仅要留白' },
    ],
    apiProps: [
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", defaultValue: "'lg'", description: '最大宽度档位（对齐 Tailwind 断点）' },
      { name: 'centered', type: 'boolean', defaultValue: 'true', description: '是否水平居中（mx-auto）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 同一站点阅读型页面统一一档 size，不逐页切换。',
      '- Container 内再做分栏用 Grid / Flex，不在 Container 上叠加 flex。',
      '- 左右留白交给 Container（px-4），内部组件不再各自补 padding。',
    ].join('\n'),
    examplesDo: [
      '文档页：Container lg 居中包裹 Typography 正文。',
      '登录页：Container sm 居中包裹 Form 卡片。',
    ],
    examplesDont: [
      '在管理后台列表页强行套窄栏 Container（应 full 或不用）。',
      'Container 嵌套 Container（宽度语义冲突）。',
    ],
  },
  'component.steps': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 表示流程阶段与当前进度：注册向导、下单流程、审批流转。',
      '- 步骤状态需要显式呈现：完成（√）/ 进行中 / 等待 / 失败（×）。',
      '- 空间受限时的纵向流程：direction: vertical。',
      '',
      '**何时不用**',
      '',
      '- 同层内容视图切换：使用 Tabs。',
      '- 时间顺序的事件记录：使用 Timeline（Steps 面向「流程推进」）。',
      '- 仅表示百分比进度：使用 Progress。',
    ].join('\n'),
    previewNote:
      '静态结构：<ol data-slot="steps">；每步 li（data-slot="steps-item"，data-status 四态）= 圆形序号 / 状态图标（data-slot="steps-icon"，finish → border-primary + √，process → bg-primary 实心，wait → border-border 灰字，error → border-destructive + ×）+ 标题 / 描述；步骤间连接线（data-slot="steps-connector"，水平为自适应 h-px，垂直为 w-px h-6）。状态按 current 推导，item.status 可覆盖；item.icon 优先于状态图标与序号。',
    variants: [
      { name: '水平', visual: '横向步骤 + 自适应连接线', scene: '顶部向导、页面级流程' },
      { name: '垂直', visual: '纵向步骤 + 竖线', scene: '侧栏流程、窄空间' },
      { name: '错误态', visual: '当前步 × 图标 + 红色标题', scene: '流程失败定位' },
    ],
    apiProps: [
      { name: 'items', type: 'StepItemData[]', defaultValue: '[]', description: '步骤列表：{ title, description?, status?, icon? }' },
      { name: 'current', type: 'number', defaultValue: '0', description: '当前步骤下标（从 0 开始）' },
      { name: 'direction', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: '方向' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 步骤数控制在 2~6 步，超出拆分子流程或改纵向。',
      '- 标题用动宾短语（「提交订单」），描述补充状态或耗时。',
      '- 失败必须落在具体步骤（status: error）并给出恢复路径，不整页报错。',
      '- current 与步骤内容区联动：切换步骤只更新中间内容区。',
    ].join('\n'),
    examplesDo: [
      '下单流程：填写地址 → 确认订单 → 支付完成，current 随提交动作推进。',
      '审批流：某节点驳回时该步 status: error，描述展示驳回原因。',
    ],
    examplesDont: [
      '用 Steps 做标签页切换（应使用 Tabs）。',
      '步骤可乱序完成时仍用线性 Steps（应改用 List / Tree 表达）。',
    ],
  },
  'component.anchor': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 长页面章节间定位：文档、详情页、设置页的右侧章节目录。',
      '- 需要 scroll-spy 同步阅读位置：滚动时自动高亮当前章节。',
      '- 两级以内的章节树：items 支持 children 嵌套。',
      '',
      '**何时不用**',
      '',
      '- 跨页面导航：使用 Menu / NavigationMenu。',
      '- 页面内返回顶部：使用 BackTop。',
      '- 短页面（一屏内）不需要 Anchor。',
    ].join('\n'),
    previewNote:
      '静态结构：<nav data-slot="anchor">（border-l 轨道 + 链接列）；链接 <a data-slot="anchor-link">（-ml-px border-l-2，激活项 border-primary text-primary font-medium，未激活 text-muted-foreground），子链接缩进 pl-4。交互：点击阻止默认跳转、按 offsetTop 补偿平滑滚动；监听 window 滚动做 scroll-spy（取最后一个顶部越过 offsetTop 的章节）。状态控制：非受控（未传 activeKey）内部维护激活态；受控时激活态完全由 activeKey 驱动，点击 / 滚动定位仅经 onChange 上报 href（去重：与当前激活项相同或挂载对齐计算不重复触发）。本预览无对应锚点目标，仅演示结构与激活态。',
    variants: [
      { name: '单层', visual: '平铺章节链接', scene: '章节无层级的文档' },
      { name: '嵌套', visual: '子链接缩进', scene: '两级章节树（章 / 节）' },
    ],
    apiProps: [
      { name: 'items', type: 'AnchorItemData[]', defaultValue: '[]', description: '锚点链接：{ href: "#id", title, children? }' },
      { name: 'activeKey', type: 'string', defaultValue: '—', description: '受控：当前激活链接 href；提供时激活态完全由外部驱动' },
      { name: 'onChange', type: 'event', defaultValue: '—', description: '激活项变化（点击或滚动定位），传出 href（events.onChange 绑定动作，${event} 取 href）' },
      { name: 'offsetTop', type: 'number', defaultValue: '0', description: '滚动定位的顶部偏移（如有固定头部）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- href 与页面章节 id 一一对应，缺失目标时点击为空操作（onChange 仍上报）。',
      '- 有固定头部时务必设 offsetTop，避免目标被遮挡。',
      '- 章节数控制在 10 个以内，层级不超过两级。',
      '- 常配合 Affix 固定在页面右侧栏。',
      '- 需要与外部状态联动（如路由 / Tab 同步）时用 activeKey + onChange 受控；纯阅读定位用非受控即可。',
    ].join('\n'),
    examplesDo: [
      '文档详情页：右侧 Affix 固定 Anchor，scroll-spy 跟随阅读进度高亮。',
      '长设置页：基础设置 / 安全设置 / 通知设置三章快速定位。',
    ],
    examplesDont: [
      '用 Anchor 做站点主导航（应使用 Menu）。',
      '锚点目标 id 动态变化却不更新 items（点击落空）。',
    ],
  },
  'component.back-top': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 长页面快速返回顶部：列表、文档、信息流滚动超过一屏后。',
      '- 页面无固定头部时的兜底导航。',
      '',
      '**何时不用**',
      '',
      '- 短页面（滚动不足 visibilityHeight 时组件本就不出现）。',
      '- 局部滚动区域：BackTop 监听 window 滚动，局部滚动用 ScrollArea 自带滚动条。',
      '- 需要章节级定位：使用 Anchor。',
    ].join('\n'),
    previewNote:
      '静态结构：滚动超过 visibilityHeight（默认 400px）后渲染 <button data-slot="back-top">（fixed right-10 bottom-10，rounded-full 边框 + 阴影，默认 arrow-up 图标，children 可自定义内容）；点击 window.scrollTo 平滑回顶，未超阈值不渲染。组件监听 window 滚动（本站点为容器内滚动，预览以负阈值强制展示按钮形态）。',
    variants: [
      { name: '默认按钮', visual: '圆形向上箭头', scene: '通用长页面' },
      { name: '自定义内容', visual: 'children DSL 子树', scene: '品牌化悬浮入口' },
    ],
    apiProps: [
      { name: 'visibilityHeight', type: 'number', defaultValue: '400', description: '滚动超过该高度（像素）后显示按钮' },
      { name: 'children', type: 'DslNode[]', defaultValue: '—', description: '自定义按钮内容（DSL 子树）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 一页最多一个 BackTop，位置固定右下，不与其他悬浮按钮重叠。',
      '- visibilityHeight 按页面长度调整（短列表可降至 200）。',
      '- 已有固定头部提供回顶能力时可不启用。',
    ].join('\n'),
    examplesDo: [
      '长列表页：滚动两屏后右下浮出回到顶部按钮。',
      '文档页配合 Anchor：章节定位用 Anchor，快速回顶用 BackTop。',
    ],
    examplesDont: [
      '在弹窗 / 抽屉内的局部滚动区使用（监听不到局部滚动）。',
      '与右下角在线客服悬浮钮叠放（应错开位置或取舍）。',
    ],
  },
  'component.affix': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 滚动时固定关键导航或操作：页面头部、章节工具条、底部操作栏。',
      '- 长表单底部提交栏常驻：offsetBottom 吸附视口底部。',
      '- 右侧辅助栏（Anchor / 目录）跟随滚动固定。',
      '',
      '**何时不用**',
      '',
      '- 页面级固定骨架（整站头 / 侧栏）：用 Layout 的固定区域而非 Affix。',
      '- 需要悬浮于内容之上且不占位：Affix 是 sticky（占位吸附），悬浮用 fixed 定位的自定义容器。',
    ].join('\n'),
    previewNote:
      '静态结构：<div data-slot="affix">（sticky z-10）；offsetTop（默认 0）内联 top，offsetBottom 提供时优先、内联 bottom（二者同 antd 互斥语义）；子节点经 Renderer children 机制渲染 DSL 子树。吸附在其最近滚动祖先内生效，本预览为静态形态（无滚动上下文时等同普通块）。',
    variants: [
      { name: '顶部吸附', visual: 'sticky top = offsetTop', scene: '章节工具条、表头、右侧目录' },
      { name: '底部吸附', visual: 'sticky bottom = offsetBottom', scene: '长表单提交栏' },
    ],
    apiProps: [
      { name: 'offsetTop', type: 'number', defaultValue: '0', description: '距离视口顶部偏移（像素）；与 offsetBottom 互斥' },
      { name: 'offsetBottom', type: 'number', defaultValue: '—', description: '距离视口底部偏移（像素）；提供时按底部吸附' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（与偏移合并）' },
    ],
    guidelines: [
      '- 吸附元素背景需不透明（卡片 / 页面底色），避免滚动内容透出。',
      '- 顶部已有固定头部时 offsetTop 设为头部高度，避免叠盖。',
      '- 同方向吸附最多一处，多处吸附互相遮挡。',
    ].join('\n'),
    examplesDo: [
      '长表单页：底部操作栏 offsetBottom: 0 吸附，随时可提交。',
      '文档页：右侧 Anchor 外套 Affix（offsetTop = 头部高度）。',
    ],
    examplesDont: [
      '用 Affix 实现整站固定头部（应使用 Layout 固定区域）。',
      '吸附内容高度超过一屏（sticky 失去意义且遮挡内容）。',
    ],
  },
};
