/**
 * 通用分类完整详情（第九批组件，packages/ui 真实实现已核对）。
 * - API 属性与 DSL 结构核对自 packages/ui/src/components/components/ 下同名
 *   目录的 index.tsx：Icon / Typography / Link / Separator / Avatar / Badge /
 *   Tooltip；
 * - 运行态预览核对自 doc/src/components/previews/basic-a.tsx（同一文件注册
 *   component.icon / typography / link / separator / avatar / badge / tooltip）；
 *   其中 component.link 的 dsl 直接复用预览文件中的 LINK_NODE 常量。
 */
import type { ComponentDetailContent } from './component-details.ts';

export const generalDetailContents: Record<string, ComponentDetailContent> = {
  'component.icon': {
    dsl: {
      "type": "Icon",
      "props": {
        "name": "download",
        "size": 28,
        "color": "#1677ff"
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 为操作、状态或对象补充视觉标识：按钮内的动作图标、列表行的类型图标、空态与提示的语义图标。',
      '- 紧凑空间中替代文字标签：工具栏、表头筛选、卡片角落入口。',
      '- 需要跟随上下文的跟随式图标：不传 color 时继承 currentColor，自动适配所在容器（含 danger 等有色按钮）。',
      '',
      '**何时不用**',
      '',
      '- 图标本身就是可点击入口：使用 Button（icon 通道）或 Link，Icon 只表达含义、不承载点击与焦点。',
      '- 需要图形化表达（插图、缩略图、封面）：使用 Image 等展示组件。',
      '- 含义无法从上下文推断且无处放文案：先补 Tooltip 或可见文本，而不是让用户猜图形。',
    ].join('\n'),
    previewNote:
      '静态结构：渲染为单个 <svg data-slot="icon">（lucide-react，shrink-0 + aria-hidden，纯装饰不进入无障碍树）；name 经 normalizeIconName 归一（kebab-case / camelCase / PascalCase 均接受）后查 ICONS 白名单，未命中渲染 help-circle 占位并标 data-unknown（不抛错）；size 档位 sm=16 / default=20 / lg=24，数字按 px；color 缺省 currentColor 跟随文本色；className / style 合并到图标根节点。',
    variants: [
      { name: '默认（default）', visual: '20px 线性图标', scene: '正文、列表行内与文本并列的图标' },
      { name: 'sm 小号', visual: '16px', scene: '按钮内、菜单项、表格密集区域' },
      { name: 'lg 大号', visual: '24px', scene: '空态、卡片头部、强调入口' },
      { name: '数字尺寸', visual: 'size 传数字按 px 精确控制（如 28）', scene: '自定义插图式图标、视觉稿逐像素对齐' },
      { name: '自定义颜色', visual: 'color 覆盖为固定色值', scene: '品牌色图标、与文本色不同的强调图标' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '图标名：kebab-case（如 arrow-right）或 PascalCase（如 ArrowRight），取自 ICONS 白名单；未命中渲染 help-circle 占位并标 data-unknown' },
      { name: 'size', type: "'sm' | 'default' | 'lg' | number", defaultValue: "'default'", description: '尺寸：sm 16 / default 20 / lg 24，或数字 px' },
      { name: 'color', type: 'string', defaultValue: '—', description: '颜色（CSS 颜色值）；缺省 currentColor 跟随文本色' },
      { name: 'strokeWidth', type: 'number', defaultValue: '—', description: '描边宽度（lucide 缺省 2）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 图标只做语义补充：关键含义必须能从相邻文本或 Tooltip 得知，不依赖用户猜测图形。',
      '- 纯图标入口必须提供可访问名称（Tooltip 文案或 aria-label），且点击命中区不小于 32px。',
      '- 同一区域图标取同一档尺寸（常用 sm / default），不混用三档造成基线错位。',
      '- 颜色跟随语义：状态色交给 Text / Tag / Status 的语义容器，除品牌表达外不给 Icon 硬编码颜色。',
      '- 新增图标先在 ICONS 白名单登记（一行导入 + 一行映射），未登记的名字会静默落为占位图标。',
    ].join('\n'),
    examplesDo: [
      '列表行：Icon name="file-text" 表示文档类型，与标题文本同色。',
      '危险操作按钮：Button 的 icon="trash" + danger，图标自动跟随按钮文字色。',
    ],
    examplesDont: [
      '直接给 Icon 绑 onClick 当按钮用（应使用 Button 的 icon 通道）。',
      '依赖未登记的图标名（渲染为占位问号图标，用户误读为帮助入口）。',
    ],
  },
  'component.typography': {
    dsl: {
      "type": "Typography",
      "props": {
        "variant": "h3",
        "text": "三级标题 H3"
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 建立文档级排版层级：页面 / 区块标题（h1 ~ h4）、正文段落、引导语与辅助说明。',
      '- 需要语义标签同步正确：variant 决定渲染标签（h3 → <h3>），利于大纲与读屏结构。',
      '- 行内代码、引用、列表等富文本片段：inline-code / blockquote / list 变体。',
      '',
      '**何时不用**',
      '',
      '- 只有颜色、字号或装饰差异的短文本：使用 Text（语义色 + 粗体 / 删除线 / 下划线）。',
      '- 多段结构化长内容（含表格、代码块、嵌套列表）：使用 Markdown。',
      '- 文本本身就是操作入口：使用 Button（text / link 变体）或 Link。',
    ].join('\n'),
    previewNote:
      '静态结构：渲染为带 data-slot="typography" 与 data-variant 的语义标签——variant → 标签映射：h1 ~ h4 → <h1> ~ <h4>，p / lead / muted → <p>，list → <ul>，inline-code → <code>，small → <small>；样式经 cva 变体类挂载（h2 带底部分隔线、inline-code 为 bg-muted 圆角等宽、muted 为 text-sm text-muted-foreground、lead 为 text-xl 弱化色）；文本经 text 属性注入。',
    variants: [
      { name: 'h1 ~ h4 标题', visual: '逐级递减的字号与字重（h2 带分隔线）', scene: '页面标题、区块标题、卡片标题' },
      { name: 'p 正文', visual: 'leading-7 常规段落', scene: '正文阅读内容' },
      { name: 'lead', visual: 'text-xl 弱化色引导语', scene: '页头摘要、导语' },
      { name: 'muted', visual: 'text-sm 弱化色', scene: '辅助说明、字段注释、时间戳' },
      { name: 'inline-code', visual: '等宽字体 + 灰底圆角', scene: '正文中的变量名、命令行、字段名' },
      { name: 'blockquote / list', visual: '左侧竖线引用 / 圆点列表', scene: '引用他人观点、要点罗列' },
    ],
    apiProps: [
      { name: 'variant', type: "'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'blockquote' | 'list' | 'inline-code' | 'lead' | 'muted' | 'small'", defaultValue: "'p'", description: '排版变体（同时决定渲染的语义标签）' },
      { name: 'text', type: 'string', defaultValue: '—', description: '文本内容（可含表达式）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 一页只用一个 h1，标题层级按 h1 → h4 逐级下降，不跳级。',
      '- 标题描述内容而非形式（「订单详情」而非「加粗大字」），层级语义与视觉保持一致。',
      '- 正文段落用 p 而非给 Text 堆叠样式，后续换肤时排版规则统一生效。',
      '- 弱化信息统一用 muted，不在同一区块混用多种辅助文本变体。',
    ].join('\n'),
    examplesDo: [
      '详情页：Typography h2「基础信息」+ 多个 p 段落组织正文。',
      '页头导语：Typography lead 描述页面用途，正文用 p 承接。',
    ],
    examplesDont: [
      '用 h4 + 自定义字号冒充 h2（层级语义与视觉不符）。',
      '整段长文（含表格、代码块）塞进单个 Typography text（应使用 Markdown）。',
    ],
  },
  'component.link': {
    dsl: {
      "type": "Link",
      "props": {
        "href": "https://example.com/docs",
        "text": "查看文档",
        "target": "_blank"
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 跳转页面、位置或外部资源：站内路由、文档外链、邮件 / 电话等协议链接。',
      '- 需要保留原生链接能力：可复制地址、右键新窗口打开、悬停显示目标地址。',
      '- 正文中的引用式跳转：段落里指向其他页面或章节的关键词。',
      '',
      '**何时不用**',
      '',
      '- 触发即时动作（提交、删除、开关）：使用 Button，Link 不做状态变更。',
      '- 页面级 / 模块级导航：使用 Menu、NavigationMenu、Breadcrumb、Tabs 等导航组件。',
      '- 需要按钮外观的跳转入口：使用 Button（点击后由动作执行跳转），而不是给 Link 加按钮样式。',
    ].join('\n'),
    previewNote:
      '静态结构：渲染为原生 <a data-slot="link">（保留 href 原生语义，样式 text-primary underline-offset-4 hover:underline）；内容取 text ?? children；target="_blank" 时自动补 rel="noreferrer"；站内路径（/ 开头）的普通左键点击被拦截并走渲染上下文路由（route.navigate，嵌入模式可注入宿主路由），外链 / 锚点 / 修饰键点击 / 显式 target 保持浏览器自然跳转。本条目复用预览文件 LINK_NODE：Flex gap 16 内并列「站内链接（SPA 导航）」与「外部链接（新窗口）」。',
    variants: [
      { name: '站内链接', visual: '主题色文字，hover 下划线', scene: '路由跳转（/ 开头路径走渲染上下文路由）' },
      { name: '外链（_blank）', visual: '同上，新窗口打开并补 rel="noreferrer"', scene: '指向外部站点、第三方文档' },
      { name: '正文内联', visual: '与其他文本共行，仅主题色区分', scene: '段落中的引用式跳转' },
    ],
    apiProps: [
      { name: 'href', type: 'string', defaultValue: '—', description: '链接地址（可含表达式）；站内路径（/ 开头）左键点击走 SPA 路由' },
      { name: 'text', type: 'string', defaultValue: '—', description: '链接文本；也可用 children' },
      { name: 'target', type: "'_blank' | '_self' | '_parent' | '_top'", defaultValue: '—', description: '打开方式；_blank 时自动补 rel="noreferrer"' },
      { name: 'children', type: 'DslNode[]', defaultValue: '—', description: '链接内容（DSL 子树；与 text 二选一，text 优先）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 文案描述目标（「查看订单详情」）而非「点击这里」，读屏按链接文本跳读也能理解。',
      '- 外链一律 target="_blank"（组件自动补 rel="noreferrer"），站内跳转不加 target，交路由接管。',
      '- 同一段落内的链接不超过两处，避免正文被切碎。',
      '- 站内路径写法与路由表一致（/ 开头），锚点用 #id 交给浏览器原生定位。',
    ].join('\n'),
    examplesDo: [
      '列表页脚注：Link href="/components/button" text="查看 Button 用法"。',
      '文档外链：Link 指向外部规范站点并 target="_blank"。',
    ],
    examplesDont: [
      '用 Link 承载「删除」等即时动作（应使用 Button + 二次确认）。',
      '给 Link 加按钮样式伪装成主操作（选型与可访问性都会失真）。',
    ],
  },
  'component.separator': {
    dsl: {
      "type": "Separator",
      "props": {
        "orientation": "horizontal"
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 区块之间的轻量分隔：表单分组、卡片内小节、列表项之间。',
      '- 行内条目的并列分隔：统计数字之间、面包屑式的元信息串（垂直态）。',
      '- 需要用语义分隔符（而非纯装饰线）表达内容边界：组件始终带 separator 角色。',
      '',
      '**何时不用**',
      '',
      '- 可拖拽调整尺寸的分割：使用 Splitter / Resizable（Separator 不可交互）。',
      '- 需要靠间距就能区分的相邻元素：用 Space / Flex 的 gap，不必再加线。',
      '- 页面级结构分区（头 / 侧栏 / 内容）：由 Layout 的子区域自带边框。',
    ].join('\n'),
    previewNote:
      '静态结构：渲染为 Base UI Separator（data-slot="separator"），始终具备可访问的 separator 角色（vendored 版不提供 decorative 开关）；horizontal 映射 h-px w-full、vertical 映射 w-px h-full（经 data-[orientation=*] 变体），底色 bg-border；垂直态依赖父容器有确定高度，预览中与条目文本并列于固定行高的 Flex 行内。',
    variants: [
      { name: '水平', visual: 'h-px 通栏细线', scene: '区块、小节、列表项之间的分隔' },
      { name: '垂直', visual: 'w-px 竖线（撑满父容器高度）', scene: '行内条目并列分隔、元信息串' },
      { name: '自定义线型', visual: '经 className / style 覆盖颜色与粗细', scene: '浅色分区、需要强调边界的区域' },
    ],
    apiProps: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: '方向；垂直态高度取父容器高度' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 分隔线只表达分组，不表达层级：层级靠标题与缩进，不靠粗细不同的线。',
      '- 相邻元素已有足够间距时不再叠加分隔线，避免视觉噪声。',
      '- 垂直分隔线必须置于有确定高度的容器内（Flex 行、固定行高），否则不可见。',
      '- 带文字的中缝分隔（如「或」）用文本 + 两条水平 Separator 组合，不改造组件。',
    ].join('\n'),
    examplesDo: [
      '表单分组：两组字段之间水平 Separator 划出界限。',
      '统计条：三个指标数字之间用垂直 Separator 并列分隔。',
    ],
    examplesDont: [
      '用 Separator 做可拖拽的面板分割（应使用 Splitter / Resizable）。',
      '每个列表项上下各加一条线（列表本身已有行分隔，重复表达）。',
    ],
  },
  'component.avatar': {
    dsl: {
      "type": "Avatar",
      "props": {
        "src": "https://i.pravatar.cc/64",
        "alt": "用户头像",
        "fallback": "张"
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 表示用户、组织或对象身份：头部用户区、评论作者、成员列表、任务负责人。',
      '- 图片缺失或加载失败时的稳定占位：fallback 提供首字母 / 简称，避免布局跳动。',
      '- 需要与姓名并排的紧凑身份标识：配合 Flex 的 gap 排列。',
      '',
      '**何时不用**',
      '',
      '- 单纯展示图片内容（封面、截图、插图）：使用 Image。',
      '- 需要展示身份详情（姓名 + 角色 + 联系方式）：用 Card、Descriptions 承接，Avatar 只做标识。',
      '- 需要可点击进入个人主页时，外层用 Button / Link 承载交互，Avatar 本身不承载。',
    ].join('\n'),
    previewNote:
      '静态结构：Base UI Avatar.Root（data-slot="avatar"，size-8 rounded-full overflow-hidden）；src 存在时渲染 avatar-image（data-slot="avatar-image"，size-full object-cover），fallback 存在时渲染 avatar-fallback（data-slot="avatar-fallback"，bg-muted 居中弱化文本），图片加载中 / 失败由原语自动回落到 fallback；默认尺寸 size-8（32px），更大 / 更小经 className 覆盖；src 与 fallback 均缺省时只剩空容器。',
    variants: [
      { name: '图片头像', visual: '圆形裁切照片（object-cover）', scene: '用户 / 组织有头像资源' },
      { name: '文本兜底', visual: '灰底居中首字母或简称', scene: '无头像资源时的默认身份标识' },
      { name: '加载失败回落', visual: '自动切到 fallback（不出现破图）', scene: '外链头像失效、内网资源不可达' },
      { name: '自定义尺寸', visual: '经 className 覆盖 size-8', scene: '头部大号身份区 / 列表小号标识' },
    ],
    apiProps: [
      { name: 'src', type: 'string', defaultValue: '—', description: '图片地址' },
      { name: 'alt', type: 'string', defaultValue: '—', description: '图片替代文本（缺省空字符串，纯装饰时不朗读）' },
      { name: 'fallback', type: 'string', defaultValue: '—', description: '加载失败或缺省时的占位文本（如首字母）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（尺寸常在此覆盖）' },
    ],
    guidelines: [
      '- 同时给 src 与 fallback：只给 src 时网络失败会留下空位。',
      '- fallback 用姓名首字或对象简称，同一系统内规则统一（如统一取首字）。',
      '- 作为纯装饰时 alt 留空；承载身份语义时写清对象名称。',
      '- 头像尺寸跟随容器密度（8 的倍数），不逐处自定义奇数尺寸。',
    ].join('\n'),
    examplesDo: [
      'Header 用户区：Avatar src + fallback 首字母，右侧并排用户名。',
      '成员列表：每行 Avatar 表示成员，小尺寸经 className 设定。',
    ],
    examplesDont: [
      '用 Avatar 展示文章封面图（应使用 Image）。',
      '不设 fallback 依赖外链头像可用（破图破坏布局与可信度）。',
    ],
  },
  'component.badge': {
    dsl: {
      "type": "Badge",
      "props": {
        "text": "次要",
        "variant": "secondary"
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 表达数量、提醒或附着状态：未读条数、待办数量、对象上的状态备注。',
      '- 需要与主体并列的轻量标记：卡片标题旁的「新」「测试版」、列表项后的计数。',
      '- 需要视觉权重低于正文的短标记：variant 四档控制底色强弱（default / secondary / destructive / outline）。',
      '',
      '**何时不用**',
      '',
      '- 标记分类、属性或可移除条件：使用 Tag（Badge 不与 Tag 混用）。',
      '- 表达运行 / 审核等业务状态（带状态点 + 文本）：使用 Status。',
      '- 需要点击的操作入口或筛选条件：使用 Button / Tag，Badge 只读不可交互。',
    ].join('\n'),
    previewNote:
      '静态结构：渲染为 <span data-slot="badge">（inline-flex w-fit 圆角边框、px-2 py-0.5、text-xs font-medium）；variant 四档由 cva 映射底色——default 主色实心、secondary 次要色实心、destructive 危险色实心、outline 透明底 + border-border；文本取 text 属性。当前适配器为静态文本徽标形态，不内置角标定位（附着于图标 / 头像右上角的角标需外层容器自行定位）。',
    variants: [
      { name: 'default', visual: '主色实心', scene: '最高权重的短标记（如「新」）' },
      { name: 'secondary', visual: '次要色实心', scene: '中性计数、普通备注' },
      { name: 'destructive', visual: '危险色实心', scene: '异常计数、需要立即关注的数量' },
      { name: 'outline', visual: '透明底 + 描边', scene: '低干扰标记、与浅色背景并置' },
    ],
    apiProps: [
      { name: 'text', type: 'string', defaultValue: '—', description: '徽标文本（计数 / 短标记）' },
      { name: 'variant', type: "'default' | 'secondary' | 'destructive' | 'outline'", defaultValue: "'default'", description: '变体（视觉权重与语义色档位）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（角标定位常在此声明）' },
    ],
    guidelines: [
      '- 文案极短：计数直接用数字，标记不超过 4 个字。',
      '- 同一语义固定同一 variant（如危险计数恒为 destructive），不随场景换色。',
      '- 计数超量级时收敛显示（如「99+」），避免徽标宽度撑破布局。',
      '- 不在 Badge 上挂交互；需要点击时改用 Button 或 Tag。',
    ].join('\n'),
    examplesDo: [
      '菜单项：标题后 Badge text="12" 表示待办数量。',
      '卡片标题：Badge variant="outline" text="Beta" 标注功能阶段。',
    ],
    examplesDont: [
      '用 Badge 标记商品分类或可移除筛选条件（应使用 Tag）。',
      '用 Badge 表达服务运行状态（应使用 Status）。',
    ],
  },
  'component.tooltip': {
    dsl: {
      "type": "Tooltip",
      "props": {
        "content": "这里是提示内容"
      },
      "children": [
        {
          "type": "Button",
          "props": {
            "text": "悬浮查看提示",
            "variant": "default"
          }
        }
      ]
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 补充短说明：图标按钮含义、字段口径、缩写全称。',
      '- 展示被截断文本的完整内容：列表单元格、标签溢出时。',
      '- 给出不可见标签：纯图标入口的可访问名称来源之一。',
      '',
      '**何时不用**',
      '',
      '- 需要承载复杂内容或交互（多行、按钮、表单、链接）：使用 Popover。',
      '- 需要用户确认或输入：使用 Popconfirm / Dialog / Drawer。',
      '- 承载关键信息：触屏与键盘用户可能无法触发悬浮，关键内容必须直接可见。',
    ].join('\n'),
    previewNote:
      '静态结构：Base UI Tooltip（data-slot="tooltip"）——children 为触发元素，经 span（data-slot="tooltip-trigger-wrap"）接入 Trigger（DSL 适配器不透传未知 props，须由包装接住触发器合并的 aria / ref / 事件）；提示浮层 data-slot="tooltip-content" 走 Portal + Positioner（缺省 side=top、align=center、sideOffset=4），反色底 bg-primary + text-xs，open / closed 由 data-open / data-closed 变体驱动；className / style 挂在浮层而非触发元素。',
    variants: [
      { name: '图标按钮提示', visual: 'hover 图标上方浮出反色小气泡', scene: '无文字的工具栏 / 表头按钮说明' },
      { name: '文本截断提示', visual: 'hover 被截断文本展示全文', scene: '列表单元格、标签、路径' },
      { name: '表单字段说明', visual: 'hover 标签浮出字段口径', scene: '字段含义、格式要求补充' },
    ],
    apiProps: [
      { name: 'content', type: 'string', defaultValue: '—', description: '提示文案（纯文本，不支持 DSL 子树）' },
      { name: 'children', type: 'DslNode[]', defaultValue: '—', description: '触发元素（DSL 子树，经 Renderer children 机制渲染）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：挂在提示浮层根节点（不是触发元素）的 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 文案一句话说清，不加句号、不放交互元素。',
      '- 触发元素必须可悬浮且可聚焦（Button、Icon 等），纯文本裸节点在键盘下不可达。',
      '- 不嵌套 Tooltip，也不在 Tooltip 里放链接或按钮。',
      '- 关键信息直接可见，Tooltip 只做锦上添花。',
    ].join('\n'),
    examplesDo: [
      '工具栏图标按钮：Tooltip content="下载 CSV" 包裹 Button（icon 通道）。',
      '字段标签：Tooltip 说明「结算周期」的口径后再放输入控件。',
    ],
    examplesDont: [
      '把表单或操作按钮放进 Tooltip 内容（应使用 Popover）。',
      '依赖 Tooltip 承载必读提示（触屏与键盘用户看不到）。',
    ],
  },
};
