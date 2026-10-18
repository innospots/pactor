/**
 * 导航分类完整详情（第九批组件，packages/ui 真实实现已核对）。
 * - API 属性与 DSL 结构核对自 packages/ui/src/components/components/ 下同名
 *   目录的 index.tsx：Menu / Tabs / Breadcrumb / Pagination / DropdownMenu /
 *   NavigationMenu；
 * - 运行态预览核对自 doc/src/components/previews/basic-a.tsx（同一文件注册
 *   component.menu / tabs / breadcrumb / pagination / dropdown-menu /
 *   navigation-menu）；其中 component.tabs 的 dsl 复用预览 TABS_NODE、
 *   component.breadcrumb 复用 BREADCRUMB_NODE。
 */
import type { ComponentDetailContent } from './component-details.ts';

export const navigationDetailContents: Record<string, ComponentDetailContent> = {
  'component.menu': {
    dsl: {
      "type": "Menu",
      "props": {
        "mode": "inline",
        "selectedKey": "${state.selected}",
        "items": [
          {
            "key": "dashboard",
            "label": "工作台",
            "icon": "home"
          },
          {
            "key": "orders",
            "label": "订单管理",
            "icon": "list",
            "badge": 12
          },
          {
            "key": "stats",
            "label": "数据统计",
            "icon": "chart"
          },
          {
            "key": "settings",
            "label": "系统设置",
            "icon": "settings",
            "disabled": true
          }
        ]
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 在模块或功能之间导航：Sider 内的纵向一级菜单、Header 内的横向菜单。',
      '- 需要一个受控的「当前所在位置」：selectedKey 与路由路径同步，高亮当前项。',
      '- 菜单项需要附带信息：图标、待办角标（badge）、危险状态圆点（dot）、分组标题（group）。',
      '- 目录可折叠：collapsible 让含子项的目录点击展开 / 收起，层级不超过两级。',
      '',
      '**何时不用**',
      '',
      '- 同层内容视图切换（不换页，只换内容区）：使用 Tabs。',
      '- 表达当前位置与上级路径：使用 Breadcrumb。',
      '- 临时操作集合（重命名 / 分享 / 删除）：使用 DropdownMenu。',
    ].join('\n'),
    previewNote:
      '静态结构：渲染为 <nav data-slot="menu" data-mode>，每项外包 data-slot="menu-group-entry"；inline 模式为纵向 flex-col（gap-0.5 p-2，子项按 depth 缩进 paddingLeft = 12 + depth × 16），horizontal 模式为横向 flex items-center gap-1。菜单项为 <button data-slot="menu-item">：选中项带 aria-current="page" 与 --menu-active-background / --menu-active-foreground 令牌底色，未选中为 text-muted-foreground + hover 变色，disabled 项置灰（opacity-50）且点击不触发 onSelect；icon 渲染于文字前（Icon size="sm"），badge 为右对齐圆角计数（menu-item-badge），dot 为危险色圆点（menu-item-dot），group 为分组标题（menu-group，相邻同组仅渲染一次）；collapsible 的目录项点击只 toggle、右端 chevron（menu-item-chevron）展开时旋转 180°；在 Sidebar 内且侧栏折叠时自动降级为 icon rail（仅图标 + RailTooltip，含子项的目录经右侧浮层展示）。本预览为受控用法：selectedKey 由 state 驱动，点击经 events.onSelect 回写。',
    variants: [
      { name: 'inline 纵向', visual: 'Sider 内纵向列表，选中项主色底', scene: '后台侧边主导航' },
      { name: 'horizontal 横向', visual: 'Header 内横向排列', scene: '顶部模块导航' },
      { name: '分组', visual: '分组标题 + 组内项（相邻同组只出一次标题）', scene: '功能较多的后台菜单分区' },
      { name: '带角标 / 状态点', visual: '右对齐计数徽标 / 危险色圆点', scene: '待办数量、异常提醒' },
      { name: '可折叠目录', visual: 'collapsible 展开收起 + chevron 旋转', scene: '带二级目录的菜单' },
      { name: 'icon rail', visual: '侧栏折叠后仅图标 + hover 提示', scene: '给内容区让出宽度的紧凑模式' },
    ],
    apiProps: [
      { name: 'items', type: 'MenuItem[]', defaultValue: '[]', description: '菜单项（可含表达式）：{ key, label, icon?, badge?, dot?, group?, disabled?, children? }' },
      { name: 'mode', type: "'inline' | 'horizontal'", defaultValue: "'inline'", description: '展示模式：inline 纵向（Sider）/ horizontal 横向（Header）' },
      { name: 'selectedKey', type: 'string', defaultValue: '—', description: '受控选中项 key（可绑 ${state.x}）' },
      { name: 'collapsible', type: 'boolean', defaultValue: 'false', description: '仅 inline：含 children 的目录项可展开 / 收起（点击不触发 onSelect）' },
      { name: 'defaultExpandedKeys', type: 'string[]', defaultValue: '—', description: '初始展开的目录 key（与 selectedKey 祖先链合并；展开状态非受控）' },
      { name: 'onSelect', type: '(key: string) => void', defaultValue: '—', description: '选中变化事件，传出选中项 key（Renderer 绑定 events.onSelect）；目录项 toggle 不触发' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- Menu 是哑渲染组件：items 经表达式注入（如 ${data.menus}），不自动读取路由；选中态用 selectedKey + onSelect 闭环接 navigate 动作。',
      '- 层级不超过两级；需要第三级说明信息架构需要重构，而不是继续嵌套。',
      '- 菜单文案用名词短语（「订单管理」），与页面标题保持一致，便于用户建立位置感。',
      '- 角标只用于需要即时处理的计数；纯装饰信息不放 badge。',
      '- 折叠侧栏场景下菜单自动降级为 icon rail，此时必须保证每个一级项都有 icon。',
    ].join('\n'),
    examplesDo: [
      '后台侧栏：Menu inline + selectedKey 绑路由，onSelect 触发 navigate。',
      '带待办的后台菜单：订单项 badge={12} 展示待处理数量，配置项 disabled 表示无权限。',
    ],
    examplesDont: [
      '用 Menu 做同页内容切换（应使用 Tabs）。',
      '把层级做到三级以上、靠缩进表达（应拆分信息架构或改用 Tree）。',
    ],
  },
  'component.tabs': {
    dsl: {
      "type": "Tabs",
      "props": {
        "items": [
          {
            "key": "overview",
            "label": "概览",
            "children": [
              {
                "type": "Text",
                "props": {
                  "text": "概览页签内容区。",
                  "style": {
                    "display": "block",
                    "padding": 8
                  }
                }
              }
            ]
          },
          {
            "key": "detail",
            "label": "明细",
            "children": [
              {
                "type": "Alert",
                "props": {
                  "variant": "info",
                  "showIcon": true,
                  "message": "页签内容可放任意 DSL 子树。"
                }
              }
            ]
          },
          {
            "key": "setting",
            "label": "设置",
            "children": [
              {
                "type": "Text",
                "props": {
                  "text": "设置页签内容区。",
                  "style": {
                    "display": "block",
                    "padding": 8
                  }
                }
              }
            ]
          }
        ]
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 同层内容视图切换：详情页的「概览 / 明细 / 设置」，切换不离开当前页面与上下文。',
      '- 内容量大但并列关系明确：把长页面切成若干等权页签，降低单屏密度。',
      '- 需要页签栏形态区分主次：default 胶囊（区块内切换）/ line 下划线（页面级导航感）。',
      '',
      '**何时不用**',
      '',
      '- 导航到其他页面或模块：使用 Menu、NavigationMenu，页签不换路由（换路由应改选导航组件）。',
      '- 有先后顺序的流程步骤：使用 Steps（Tabs 各页签等权、无进度语义）。',
      '- 页签数量过多（超过 6~7 个）：改用 Select / Segmented 或拆分页面。',
    ].join('\n'),
    previewNote:
      '静态结构：Tabs 渲染为 data-slot="tabs"（flex flex-col gap-2）→ 页签栏 TabsList（data-slot="tabs-list" data-variant，default 为 bg-muted 胶囊容器 / line 为通栏下划线轨道）+ 触发器 TabsTrigger（data-slot="tabs-trigger"，激活态由 data-active 驱动：default 变体为卡片底 + 边框 + 阴影，line 变体为底部 2px 主色线）+ 内容面板 TabsContent（data-slot="tabs-content"，flex-1）；每个页签内容经 renderChildren 渲染 DSL 子树，内容区 class / 样式由 contentClassName / contentStyle 与 item.className / item.style 合并（item 在后）；未传 activeKey 时缺省激活第一个页签。本条 dsl 复用预览 TABS_NODE（概览 / 明细 / 设置三页签，明细页内放 Alert）。',
    variants: [
      { name: 'default 胶囊', visual: '灰底容器 + 激活项卡片底阴影', scene: '区块内视图切换（卡片、面板里）' },
      { name: 'line 下划线', visual: '通栏下划线轨道 + 激活项主色线', scene: '页面级主视图切换' },
      { name: '受控切换', visual: 'activeKey 绑 state，onChange 回写', scene: '需要与路由 / 外部状态联动的页签' },
      { name: '异质内容', visual: '页签内容放任意 DSL 子树（表格 / 表单 / 图表）', scene: '详情页不同视角的内容组织' },
    ],
    apiProps: [
      { name: 'items', type: 'TabItem[]', defaultValue: '[]', description: '页签定义：{ key, label, children?（DSL 子树）, className?, style? }' },
      { name: 'activeKey', type: 'string', defaultValue: '—', description: '当前激活页签 key（可绑表达式）；缺省激活第一个页签' },
      { name: 'variant', type: "'default' | 'line'", defaultValue: "'default'", description: '页签栏样式：胶囊 / 下划线' },
      { name: 'onChange', type: '(key: string) => void', defaultValue: '—', description: '页签切换事件，传出新激活 key（Renderer 绑定 events.onChange）' },
      { name: 'contentClassName', type: 'string', defaultValue: '—', description: '页签内容区 class（TabsContent 根节点，与内置样式合并）' },
      { name: 'contentStyle', type: 'CSSProperties', defaultValue: '—', description: '页签内容区内联样式（同 contentClassName 挂载规则）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 页签数量 2 ~ 6 个，标签用 2 ~ 4 字名词短语（「概览」「明细」），等长等权排列。',
      '- 页签切换不改变页面 URL 与面包屑；需要路由变化时改用导航组件。',
      '- 各页签内容首屏高度接近，避免切换时页面高度剧烈跳动。',
      '- 页签内容惰性 / 性能敏感时按需在内容区放 Skeleton，避免一次渲染全部面板。',
      '- 与外部状态联动时用 activeKey + onChange 受控（如与 URL query 同步）。',
    ].join('\n'),
    examplesDo: [
      '资源详情页：概览 / 明细 / 设置三页签，各自承载不同视图。',
      '配置面板：activeKey 绑 state，切换页签时按需加载该面板数据。',
    ],
    examplesDont: [
      '用 Tabs 承载「基础信息 / 安全设置」这类会切换路由的页面（应使用 Menu）。',
      '把线性流程（提交 → 审核 → 完成）做成 Tabs（应使用 Steps）。',
    ],
  },
  'component.breadcrumb': {
    dsl: {
      "type": "Breadcrumb",
      "props": {
        "items": [
          {
            "label": "首页",
            "href": "/"
          },
          {
            "label": "组件",
            "href": "/components"
          },
          {
            "label": "面包屑"
          }
        ]
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 表达当前位置与上级路径：详情页、深层级设置的页面顶部。',
      '- 提供快速回跳上级的入口：层级 2 层以上时每级都可点击返回。',
      '- 帮助用户建立信息架构认知（从属关系），尤其在多级目录系统中。',
      '',
      '**何时不用**',
      '',
      '- 平级导航或模块跳转：使用 Menu、NavigationMenu。',
      '- 表达流程进度：使用 Steps；长页面回到顶部：使用 BackTop。',
      '- 单层页面（没有上级）：不渲染 Breadcrumb，避免占位噪声。',
    ].join('\n'),
    previewNote:
      '静态结构：渲染为 <nav aria-label="breadcrumb" data-slot="breadcrumb"> → 列表 BreadcrumbList（data-slot="breadcrumb-list"，项之间插入 BreadcrumbSeparator，默认 ChevronRight 图标、aria-hidden）+ 项 BreadcrumbItem（data-slot="breadcrumb-item"）；非末项且带 href 渲染为链接 BreadcrumbLink（data-slot="breadcrumb-link"，站内路径的普通左键点击走渲染上下文路由，规则同 Link 组件），末项或缺少 href 的项渲染为当前页纯文本 BreadcrumbPage（data-slot="breadcrumb-page"，aria-current="page"）。本条 dsl 复用预览 BREADCRUMB_NODE（首页 / 组件 / 面包屑）。',
    variants: [
      { name: '可点击路径', visual: '上级为链接（hover 变色），末项纯文本', scene: '详情页顶部层级定位' },
      { name: '省略中间层级', visual: '当前适配器无内建省略号（BreadcrumbEllipsis 未在适配器中暴露）', scene: '层级过深时由调用方裁剪 items' },
      { name: '多级深层', visual: '3 级以上，逐级点击回跳', scene: '多级目录、组织 / 项目管理' },
    ],
    apiProps: [
      { name: 'items', type: 'BreadcrumbItemData[]', defaultValue: '[]', description: '路径项（可含表达式解析后的数组）：{ label, href? }；末项始终渲染为当前页纯文本' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 末项不给 href（当前页不自链接），组件会自动渲染为纯文本 + aria-current="page"。',
      '- 层级超过 3 级时省略中间层级（保留首级 + 直接父级），完整路径交给悬停提示或页面标题。',
      '- 每级文案与目标页面标题一致，不用简称造成对不上号。',
      '- 首页作为首级时统一写「首页」并给 href="/"，全站保持一致。',
    ].join('\n'),
    examplesDo: [
      '组件详情页：首页 / 组件 / 面包屑，前两级可点击回跳。',
      '项目设置页：首页 / 项目 / 设置，末项无 href 呈纯文本。',
    ],
    examplesDont: [
      '给末项（当前页）也加 href（当前页自链接会误导用户）。',
      '用 Breadcrumb 做模块间跳转导航（应使用 Menu / NavigationMenu）。',
    ],
  },
  'component.pagination': {
    dsl: {
      "type": "Pagination",
      "props": {
        "total": 95,
        "pageSize": 10,
        "page": "${state.page}"
      },
      "events": {
        "onChange": {
          "action": "setState",
          "params": {
            "page": "${event}"
          }
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 在多页数据之间切换：表格、卡片列表、搜索结果的分页浏览。',
      '- 用户需要定位到具体页或全局页码感知：需要显示「共 N 页」的量级信息时。',
      '- 服务端分页：total + pageSize 来自接口，page 受控并驱动下一次请求。',
      '',
      '**何时不用**',
      '',
      '- 浏览型信息流（下拉加载更多）：使用无限滚动。',
      '- 数据量小（一页内可展示完）：不渲染分页。',
      '- 只需要「上一页 / 下一页」的场景：当前适配器固定渲染完整页码序列，轻量场景可考虑用 Button 组自建。',
    ].join('\n'),
    previewNote:
      '静态结构：渲染为 <nav aria-label="pagination" data-slot="pagination"> → PaginationContent（data-slot="pagination-content"，ul）→ 每项 PaginationItem（data-slot="pagination-item"）。首尾为 PaginationPrevious / PaginationNext（Chevron 图标；sm 断点以上附 Previous / Next 文案，aria-label 为 Go to previous / next page），不可用时 aria-disabled + 禁用样式且点击无效；中间为页码链接 PaginationLink（data-slot="pagination-link"，当前页 data-active + 分页激活令牌描边底色）与省略号 PaginationEllipsis（MoreHorizontal 图标）。页码由 ceil(total / pageSize) 推导（至少 1 页）；页码窗口：总页数 ≤ 7 全部展示，否则按当前页位置取 7 项窗口（当前页靠前 → 1~5 + 省略 + 末页；靠后 → 首页 + 省略 + 末 5 页；居中 → 首页 + 省略 + 当前页±1 + 省略 + 末页）。本预览为受控用法：page 驱动 state，点击经 events.onChange 回写。',
    variants: [
      { name: '受控分页', visual: 'page 由 state 驱动，onChange 回写并触发取数', scene: '服务端分页的表格 / 列表' },
      { name: '非受控分页', visual: '不传 page，组件内部自管理当前页', scene: '纯前端切分已加载数据' },
      { name: '短序列（≤7 页）', visual: '页码全显，无省略号', scene: '数据量中等的列表' },
      { name: '长序列（>7 页）', visual: '省略号 + 7 项窗口滑动', scene: '大数据量结果集' },
    ],
    apiProps: [
      { name: 'total', type: 'number', defaultValue: '0', description: '总条数（可绑表达式解析后的数字）；页数 = ceil(total / pageSize)，至少 1' },
      { name: 'pageSize', type: 'number', defaultValue: '10', description: '每页条数' },
      { name: 'page', type: 'number', defaultValue: '—', description: '受控当前页（可绑 ${state.x}）；缺省内部自管理' },
      { name: 'onChange', type: '(page: number) => void', defaultValue: '—', description: '翻页事件，传出目标页码 number（Renderer 绑定 events.onChange）；上一页 / 下一页与页码点击走同一事件' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 分页状态是单一数据源：受控时由 page 驱动取数，不在组件内外各存一份当前页。',
      '- 改变筛选条件 / 每页条数时把 page 重置为 1，避免落在越界页。',
      '- pageSize 与 total 来自同一份接口响应，页码数量才不会与数据不一致。',
      '- 分页旁给出结果量级（共 N 条 / 每页 M 条），帮助用户判断翻页范围。',
      '- 翻页时列表区域给出加载态，避免用户重复点击翻页。',
    ].join('\n'),
    examplesDo: [
      '表格分页：total={95} pageSize={10} page 绑 state，onChange 触发 setState 并重新取数。',
      '搜索结果：结果数较多时展示分页，同时显示「共 95 条」辅助信息。',
    ],
    examplesDont: [
      '在无限滚动列表底部再放分页（两种浏览模型冲突）。',
      '把 page 作为独立于数据请求的本地状态（翻页后数据与页码不同步）。',
    ],
  },
  'component.dropdown-menu': {
    dsl: {
      "type": "DropdownMenu",
      "props": {
        "items": [
          {
            "label": "重命名",
            "value": "rename",
            "icon": "pencil"
          },
          {
            "label": "分享",
            "value": "share",
            "icon": "share"
          },
          {
            "label": "删除",
            "value": "delete",
            "icon": "trash",
            "danger": true
          }
        ]
      },
      "children": [
        {
          "type": "Button",
          "props": {
            "text": "打开菜单",
            "variant": "default"
          }
        }
      ]
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 从临时操作集合中选择：列表行的「重命名 / 分享 / 删除」、页面右上角的更多操作。',
      '- 操作入口需要收纳：主操作留按钮，次要操作收进下拉，保持界面清爽。',
      '- 需要区分危险操作：danger 项以 destructive 语义呈现，与普通项拉开距离。',
      '',
      '**何时不用**',
      '',
      '- 站点级 / 模块级导航：使用 NavigationMenu、Menu。',
      '- 需要承载复杂内容或交互（表单、多行说明、勾选组）：使用 Popover。',
      '- 只有一个操作：直接放 Button，不必包一层下拉。',
    ].join('\n'),
    previewNote:
      '静态结构：Base UI Menu.Root（data-slot="dropdown-menu"）——children 为触发元素，经 span（data-slot="dropdown-menu-trigger-wrap"）接入 Trigger（以 span 包装避免按钮嵌套按钮）；弹出内容 data-slot="dropdown-menu-content"，菜单项 data-slot="dropdown-menu-item"（danger 项写 data-variant="destructive"，文字与聚焦底色转 destructive；disabled 项 data-disabled 置灰不可点）；项内 icon 渲染于文字前（Icon size="sm"）；点击项触发 onSelect 并传出该项 value。本预览为受控接收用法：选中值经 events.onSelect 写回 state。',
    variants: [
      { name: '默认项', visual: '浮层内一行一项，hover / 聚焦高亮', scene: '重命名、复制链接等常规操作' },
      { name: '危险项', visual: 'destructive 文字色（聚焦时浅红底）', scene: '删除、移除成员等破坏性操作' },
      { name: '带图标项', visual: '图标 + 文案', scene: '操作类型需要快速识别' },
      { name: '禁用项', visual: '置灰不可点（data-disabled）', scene: '无权限或前置条件不满足的操作' },
    ],
    apiProps: [
      { name: 'items', type: 'DropdownMenuItemData[]', defaultValue: '[]', description: '菜单项（可含表达式解析后的数组）：{ label, value, disabled?, danger?, icon? }' },
      { name: 'onSelect', type: '(value: string) => void', defaultValue: '—', description: '选中事件，传出选中项 value（Renderer 绑定 events.onSelect）' },
      { name: 'children', type: 'DslNode[]', defaultValue: '—', description: '触发元素（DSL 子树，经 Renderer children 机制渲染，常为 Button）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：挂在弹出内容根节点（不是触发元素）的 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 触发元素用 Button（default / text 变体），不放裸文本；触发文案表明「更多操作」而非具体某项。',
      '- 危险项固定放最后并保持 destructive 语义；删除类操作仍需二次确认（Popconfirm / Dialog）。',
      '- 项文案用动词短语（「重命名」），不用「操作一 / 操作二」这类占位。',
      '- 菜单项数量控制在 6 项以内，超出说明该拆分为独立页面或面板。',
      '- 选中结果只经 onSelect 传出 value，组件不感知业务含义；由消费方按 value 分发动作。',
    ].join('\n'),
    examplesDo: [
      '列表行操作：Button「更多」+ DropdownMenu（重命名 / 分享 / 删除），value 驱动动作分发。',
      '卡片右上角：图标按钮触发下拉，删除项 danger 且走二次确认。',
    ],
    examplesDont: [
      '用 DropdownMenu 做站点顶部导航（应使用 NavigationMenu）。',
      '把表单或说明性多行内容放进下拉项（应使用 Popover）。',
    ],
  },
  'component.navigation-menu': {
    dsl: {
      "type": "NavigationMenu",
      "props": {
        "items": [
          {
            "label": "产品",
            "children": [
              {
                "label": "动态页面",
                "href": "#",
                "description": "DSL 驱动的页面运行时",
                "icon": "grid"
              },
              {
                "label": "资产库",
                "href": "#",
                "description": "组件与区块资产目录",
                "icon": "package"
              }
            ]
          },
          {
            "label": "文档",
            "href": "#",
            "icon": "file-text"
          },
          {
            "label": "关于",
            "href": "#"
          }
        ]
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 站点级顶部导航：一级导航项 + 带说明的下拉面板（产品 / 方案 / 文档 / 关于）。',
      '- 需要在导航层级展示富信息：子项带标题 + 描述 + 图标的下拉面板。',
      '- 公开站点或门户的全局导航（相比 Menu 更「链接化」，无选中态语义）。',
      '',
      '**何时不用**',
      '',
      '- 应用内带选中态的功能菜单（Sider / Header 内）：使用 Menu（含角标、分组、可折叠目录）。',
      '- 临时操作集合：使用 DropdownMenu。',
      '- 同层内容视图切换：使用 Tabs。',
    ].join('\n'),
    previewNote:
      '静态结构：Base UI NavigationMenu（data-slot="navigation-menu"）→ NavigationMenuList；含 children 的项渲染为触发器（data-slot="navigation-menu-trigger"，右侧 ChevronDown 展开时旋转 180°，打开态 data-open 带主色底）与下拉面板（data-slot="navigation-menu-content"，宽 w-64 的格子列表：每项为 navigation-menu-link = 图标 + 标题 + 描述行）；仅含 href 的项渲染为直链链接（复用 trigger 样式并改回横向 flex-row，与下拉面板内的纵向链接布局区分）。本条目 dsl 取自预览 NavigationPreview（产品 / 文档 / 关于）。',
    variants: [
      { name: '下拉面板项', visual: '触发器 + 面板：图标 + 标题 + 描述', scene: '一级入口下需要说明多个子能力' },
      { name: '直链项', visual: '无下拉，点击直接跳转', scene: '文档、关于等单页入口' },
      { name: '带图标项', visual: '图标 + 文案（触发器与直链均支持）', scene: '提升一级导航的可识别度' },
    ],
    apiProps: [
      { name: 'items', type: 'NavigationMenuItemData[]', defaultValue: '[]', description: '导航项（可含表达式）：{ label, href?, icon?, children? }；含 children 渲染为下拉面板，否则为直链' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 一级项控制在 4 ~ 7 个，超出说明信息架构需要收拢。',
      '- 子项必须写 description：下拉面板的说明行是该组件相对普通菜单的价值所在。',
      '- 含 children 的项不再给 href（避免「既能点开面板又能跳转」的双重语义）；需要落地页时把落地页作为面板首项。',
      '- 一级文案用名词（「产品」「文档」），子项文案描述具体能力。',
      '- 站点导航不放业务状态（角标 / 选中态），状态型菜单交给 Menu。',
    ].join('\n'),
    examplesDo: [
      '站点顶栏：产品（下拉：动态页面 / 资产库）+ 文档 + 关于。',
      '门户导航：下拉面板内每项带一句话描述，帮助用户选择入口。',
    ],
    examplesDont: [
      '用 NavigationMenu 替代应用内带选中态的 Menu（缺少角标 / 分组 / 折叠能力）。',
      '把操作命令（导出、删除）放进导航子项（应使用 DropdownMenu）。',
    ],
  },
};
