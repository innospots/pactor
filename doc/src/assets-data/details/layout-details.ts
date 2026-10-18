/**
 * 布局分类完整详情（第九批组件，packages/ui 真实实现已核对）。
 * - API 属性与 DSL 结构核对自 packages/ui/src/components/components/ 下同名
 *   目录的 index.tsx：Layout（含 Header / Sider / Content / Footer 子区域）、
 *   Grid / Flex / Resizable（Splitter 与 Resizable 共用同一适配器）、
 *   AspectRatio / ScrollArea；
 * - 运行态预览核对自 doc/src/components/previews/basic-a.tsx（同一文件注册
 *   component.layout / grid / flex / splitter / resizable / aspect-ratio /
 *   scroll-area）；其中 component.layout 的 dsl 复用预览 LAYOUT_NODE、
 *   component.splitter 复用 SPLITTER_NODE、component.resizable 复用
 *   RESIZABLE_NODE（Splitter 的 DSL 类型名同为 Resizable，见该条 previewNote）。
 */
import type { ComponentDetailContent } from './component-details.ts';

export const layoutDetailContents: Record<string, ComponentDetailContent> = {
  'component.layout': {
    dsl: {
  "type": "Layout",
  "children": [
    {
      "type": "Header",
      "children": [
        {
          "type": "Text",
          "props": {
            "text": "Header 顶部区",
            "style": {
              "display": "block",
              "padding": 8
            }
          }
        }
      ]
    },
    {
      "type": "Layout",
      "children": [
        {
          "type": "Sider",
          "props": {
            "width": 120
          },
          "children": [
            {
              "type": "Text",
              "props": {
                "text": "Sider 侧边",
                "style": {
                  "display": "block",
                  "padding": 8
                }
              }
            }
          ]
        },
        {
          "type": "Content",
          "children": [
            {
              "type": "Text",
              "props": {
                "text": "Content 内容区",
                "style": {
                  "display": "block",
                  "padding": 8
                }
              }
            }
          ]
        }
      ]
    },
    {
      "type": "Footer",
      "children": [
        {
          "type": "Text",
          "props": {
            "text": "Footer 底部区",
            "style": {
              "display": "block",
              "padding": 8
            }
          }
        }
      ]
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 组织页面级骨架：顶部区、侧栏、内容区、底部区四大块的一次性声明。',
      '- 嵌套分区：内容区再分一个带侧栏的子 Layout（如「主内容 + 目录」）。',
      '- 需要方向自动推导：直接子节点含 Sider 时自动横排，否则纵向堆叠。',
      '',
      '**何时不用**',
      '',
      '- 只做栅格分列：使用 Grid；一维排列与对齐：使用 Flex。',
      '- 只是限制内容宽度与建立留白：使用 Container。',
      '- 卡片 / 面板内部的局部布局：用 Flex / Grid，Layout 面向页面级分区。',
    ].join('\n'),
    previewNote:
      '静态结构：Layout 渲染为 <div data-slot="layout" data-direction>（flex min-h-0 w-full h-full flex-1，vertical 追加 flex-col、horizontal 追加 flex-row）；方向推导按直接子节点的 DSL 类型：含 Sider → horizontal，否则 vertical，显式 direction 覆盖推导（component 引用解析到命名子树根类型，动态引用按 vertical 处理）。子区域为独立注册类型：Header（data-slot="layout-header"，h-14 横向区，可携品牌 / 下拉 / 横向菜单 / 主题切换 / 用户区 / 语言区）、Sider（data-slot="layout-sider"，width 展开宽度 200 / collapsedWidth 折叠宽度 64 / collapsed 受控折叠 / collapsible 渲染折叠触发器 / onCollapse 回写）、Content（data-slot="layout-content"，flex-1 占满剩余空间）、Footer（data-slot="layout-footer"，居中弱化文本）。',
    variants: [
      { name: '纵向骨架', visual: '无 Sider，Header / Content / Footer 上下堆叠', scene: '常规页面：顶部导航 + 内容 + 页脚' },
      { name: '带侧栏', visual: '子 Layout 含 Sider → 自动横排', scene: '后台工作台、文档站左侧目录' },
      { name: '嵌套分区', visual: 'Layout 内嵌 Layout', scene: '内容区再分「正文 + 右栏」' },
      { name: '可折叠侧栏', visual: 'Sider collapsible + collapsed 受控', scene: '需要给内容区让出宽度的编辑器 / 控制台' },
    ],
    apiProps: [
      { name: 'direction', type: "'horizontal' | 'vertical'", defaultValue: '—（按子节点推导）', description: '主轴方向；缺省含 Sider 推导为 horizontal，否则 vertical，显式提供时覆盖推导' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
      { name: 'dslChildren', type: 'DslChildren', defaultValue: '—', description: '内部：withScope 注册时由 Renderer 注入的原始 DSL 子树（用于方向推导），DSL 侧不书写' },
    ],
    guidelines: [
      '- 页面级分区用 Layout，局部布局用 Flex / Grid：Layout 的 flex-1 / min-h-0 语义只对页面骨架成立。',
      '- 一个页面只用一层页面级 Layout，其余分区靠嵌套子 Layout 表达，避免多层根 Layout 争抢高度。',
      '- 侧栏放在 Layout 的直接子层级才会触发横排推导；隔一层容器（如 Flex 包裹）需显式声明 direction。',
      '- 折叠态用受控写法（collapsed 绑 state + onCollapse 回写），保证折叠与图标模式菜单同步。',
      '- Header / Footer 只放全局操作，区块级标题与操作留在 Content 内部。',
    ].join('\n'),
    examplesDo: [
      '后台工作台：Layout（Header + Layout(Sider + Content) + Footer），Sider 内放 Menu。',
      '文档页：Content 内嵌子 Layout，右栏放 Affix + Anchor 目录。',
    ],
    examplesDont: [
      '用 Layout 做卡片内的两列布局（应使用 Flex / Grid）。',
      '把 Sider 包在 Flex 里再放进 Layout，再指望方向被自动推导（需显式 direction）。',
    ],
  },
  'component.grid': {
    dsl: {
  "type": "Grid",
  "props": {
    "columns": 3,
    "gap": 12
  },
  "children": [
    {
      "type": "Text",
      "props": {
        "text": "",
        "style": {
          "display": "block",
          "height": 48,
          "borderRadius": 6,
          "background": "#dbeafe"
        }
      }
    },
    {
      "type": "Text",
      "props": {
        "text": "",
        "style": {
          "display": "block",
          "height": 48,
          "borderRadius": 6,
          "background": "#dcfce7"
        }
      }
    },
    {
      "type": "Text",
      "props": {
        "text": "",
        "style": {
          "display": "block",
          "height": 48,
          "borderRadius": 6,
          "background": "#fef3c7"
        }
      }
    },
    {
      "type": "Text",
      "props": {
        "text": "",
        "style": {
          "display": "block",
          "height": 48,
          "borderRadius": 6,
          "background": "#fee2e2"
        }
      }
    },
    {
      "type": "Text",
      "props": {
        "text": "",
        "style": {
          "display": "block",
          "height": 48,
          "borderRadius": 6,
          "background": "#ede9fe"
        }
      }
    },
    {
      "type": "Text",
      "props": {
        "text": "",
        "style": {
          "display": "block",
          "height": 48,
          "borderRadius": 6,
          "background": "#cffafe"
        }
      }
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 整页 / 区块级栅格：指标卡片墙、图库、表单双列、仪表盘分块。',
      '- 需要严格等宽分列：每列宽度一致（repeat(columns, minmax(0, 1fr))），不因内容宽度抖动。',
      '- 需要统一栏间距：一档 gap 管住整片区域的间距（或沿用 --grid-gap 令牌）。',
      '',
      '**何时不用**',
      '',
      '- 一维排列与对齐（行内两端对齐、居中、纵向堆叠）：使用 Flex。',
      '- 只是一组相邻元素要一致间距：使用 Space。',
      '- 需要跨列（colspan）/ 每列不等宽 / 断点切换列数：当前适配器只有等分列与固定列数，超出能力时用 Flex 组合或经 style 逃逸口表达。',
    ].join('\n'),
    previewNote:
      '静态结构：渲染为 <div data-slot="grid" data-columns>（class 含 grid）；列数为运行时动态值，经 inline style gridTemplateColumns: repeat(columns, minmax(0, 1fr)) 设置（columns 取下限 1）；每个子节点被包一层 <div data-slot="grid-item">（栅格子项统一承载，便于对齐 / 定位）；gap 未指定时应用默认间距令牌 gap-(--grid-gap)，数字 gap 内联、gap: 0 显式关闭；style 为布局逃逸口（与 columns / gap 生成的样式合并，同键后者优先）。',
    variants: [
      { name: '单列（缺省）', visual: 'columns 缺省 1，纵向等宽堆叠', scene: '移动优先的表单 / 卡片流' },
      { name: '等分多列', visual: '2 ~ 4 等宽列', scene: '指标卡墙、图库、仪表盘分块' },
      { name: '自定义间距', visual: '数字 gap 内联（如 12）或 gap: 0 关闭', scene: '紧凑卡片群、需要无缝拼接的分块' },
    ],
    apiProps: [
      { name: 'columns', type: 'number', defaultValue: '1', description: '列数，每列等宽（取整下限 1）' },
      { name: 'gap', type: 'number', defaultValue: '—（应用 --grid-gap 令牌）', description: '栏间距（px）；gap: 0 显式关闭间距' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（布局逃逸口，与 columns / gap 生成的样式合并，同键后者优先）' },
      { name: 'children', type: 'DslNode[]', defaultValue: '—', description: '栅格内容（DSL 子树；每个子节点包一层 grid-item）' },
    ],
    guidelines: [
      '- 列数按内容最小可用宽度定：卡片类 2 ~ 4 列，表格 / 长文本避免多列。',
      '- 同一区块只用一个 Grid，不在 Grid 内再嵌 Grid 拼「不规则」布局（用 Flex 组合更清晰）。',
      '- 栏间距用同一档（或令牌），不逐格手写 margin。',
      '- 需要响应式列数时，用 style / className 逃逸口声明媒体查询或容器查询，columns 保持基础列数。',
    ].join('\n'),
    examplesDo: [
      '仪表盘：Grid columns=4 平铺指标 Card，gap 走默认令牌。',
      '表单字典区：Grid columns=2 左右等宽字段列。',
    ],
    examplesDont: [
      '用 Grid columns=2 做「左固定 200px + 右自适应」分栏（应使用 Flex + style flex 权重）。',
      '在 Grid 内逐个子项写 margin 制造间距（应统一用 gap）。',
    ],
  },
  'component.flex': {
    dsl: {
  "type": "Flex",
  "props": {
    "justify": "space-between",
    "align": "center",
    "gap": 12,
    "style": {
      "width": "100%"
    }
  },
  "children": [
    {
      "type": "Text",
      "props": {
        "text": "左",
        "style": {
          "display": "block",
          "padding": 16,
          "borderRadius": 8,
          "border": "1px solid var(--border)",
          "background": "#dbeafe"
        }
      }
    },
    {
      "type": "Text",
      "props": {
        "text": "中",
        "style": {
          "display": "block",
          "padding": 16,
          "borderRadius": 8,
          "border": "1px solid var(--border)",
          "background": "#dcfce7"
        }
      }
    },
    {
      "type": "Text",
      "props": {
        "text": "右",
        "style": {
          "display": "block",
          "padding": 16,
          "borderRadius": 8,
          "border": "1px solid var(--border)",
          "background": "#fef3c7"
        }
      }
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 一维排列与对齐：两端对齐（space-between）、居中、纵向堆叠、基线对齐。',
      '- 区块内的工具条 / 操作行：左标题右操作、图标 + 文本组合。',
      '- 需要给子项分配伸缩权重：子项 style 里写 flex 值（配合 style 逃逸口）。',
      '',
      '**何时不用**',
      '',
      '- 只需一组相邻元素的一致间距：使用 Space（语义更窄、只表达间距）。',
      '- 整页 / 区块栅格等宽分列：使用 Grid。',
      '- 面板可拖拽分割：使用 Splitter / Resizable。',
    ].join('\n'),
    previewNote:
      '静态结构：渲染为 <div data-slot="flex">（class flex）；direction=vertical 追加 flex-col；gap 缺省应用默认间距令牌 gap-(--flex-gap)，命名档位 small / middle / large 读 --flex-gap-sm / md / lg 令牌，数字 gap 与 style 合并内联（gap: 0 显式关闭）；justify / align 映射 Tailwind 工具类（justify-start|center|end|between|around|evenly、items-start|center|end|baseline|stretch）。',
    variants: [
      { name: '两端对齐', visual: 'justify="space-between" 撑满主轴', scene: '区块头部：左标题 + 右操作' },
      { name: '居中对齐', visual: 'justify="center" + align="center"', scene: '空态、占位、单行动作区' },
      { name: '纵向堆叠', visual: 'direction="vertical"（flex-col）', scene: '紧凑表单行、卡片内文本块' },
      { name: '命名间距档', visual: 'gap="small" | "middle" | "large" 读令牌', scene: '跟随皮肤 / 密度切换的间距' },
    ],
    apiProps: [
      { name: 'direction', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: '主轴方向（vertical 追加 flex-col）' },
      { name: 'gap', type: "number | 'small' | 'middle' | 'large'", defaultValue: '—（应用 --flex-gap 令牌）', description: '间距：数字按 px 内联，命名档位读 --flex-gap-sm / md / lg 令牌' },
      { name: 'justify', type: "'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'", defaultValue: '—', description: '主轴对齐' },
      { name: 'align', type: "'start' | 'center' | 'end' | 'baseline' | 'stretch'", defaultValue: '—', description: '交叉轴对齐' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（布局逃逸口，如 { flex: 1 }；与数字 gap 合并）' },
      { name: 'children', type: 'DslNode[]', defaultValue: '—', description: '子项（DSL 子树；子项的伸缩权重写在各自 style 上）' },
    ],
    guidelines: [
      '- 间距优先用命名档位（读令牌），皮肤切换时自动跟随；像素值只用于对齐视觉稿。',
      '- 交叉轴对齐显式声明（图标 + 文本常用 align="center"），不依赖默认 stretch。',
      '- 子项需要占满剩余宽度时给子项 style 写 flex，而不是给 Flex 加额外包装层。',
      '- 同一行的 Flex 嵌套不超过两层，层级过深改用 Grid 一次分好。',
    ].join('\n'),
    examplesDo: [
      '卡片头部：Flex justify="space-between" align="center"，左侧标题右侧操作。',
      '空态：Flex direction="vertical" align="center" gap="middle" 居中排图标与文案。',
    ],
    examplesDont: [
      '用 Flex + 手写 margin 替代 Space 表达相邻元素间距。',
      '用 Flex 做整页等宽多列栅格（应使用 Grid）。',
    ],
  },
  'component.row': {
    dsl: {
  "type": "Row",
  "props": {
    "gutter": [
      16,
      12
    ],
    "justify": "center",
    "style": {
      "width": "100%"
    }
  },
  "children": [
    {
      "type": "Col",
      "props": {
        "span": 6
      },
      "children": [
        {
          "type": "Text",
          "props": {
            "text": "Col 1",
            "style": {
              "display": "block",
              "height": 48,
              "borderRadius": 6,
              "background": "#dbeafe",
              "padding": "0 8px"
            }
          }
        }
      ]
    },
    {
      "type": "Col",
      "props": {
        "span": 8
      },
      "children": [
        {
          "type": "Text",
          "props": {
            "text": "Col 2",
            "style": {
              "display": "block",
              "height": 48,
              "borderRadius": 6,
              "background": "#dcfce7",
              "padding": "0 8px"
            }
          }
        }
      ]
    },
    {
      "type": "Col",
      "props": {
        "span": 8
      },
      "children": [
        {
          "type": "Text",
          "props": {
            "text": "Col 3",
            "style": {
              "display": "block",
              "height": 48,
              "borderRadius": 6,
              "background": "#fef3c7",
              "padding": "0 8px"
            }
          }
        }
      ]
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 需要 antd 式 24 分栏栅格：Col 按 span 占比分列，行容器统一 gutter / 对齐。',
      '- 需要响应式断点：Col 的 xs~xxl 档位在断点处切换占位，Row 只做行容器。',
      '- 需要与视觉稿的栅格标注一一对应：设计稿上的 8/8/8、6/12/6 分栏直接翻译为 span。',
      '',
      '**何时不用**',
      '',
      '- 等宽均分且列数简单（3 列指标卡墙）：使用 Grid（语义更窄、写法更短）。',
      '- 一维排列与对齐（工具条两端对齐）：使用 Flex。',
      '- 只做循环渲染的网格列表：使用 For（columns 模式，行作用域注入 ${row}）。',
    ].join('\n'),
    previewNote:
      '静态结构：Row 渲染为 <div data-slot="row">（class flex，flexWrap 按 wrap 配置，justifyContent / alignItems 由 justify / align 映射）；gutter 经 React Context 传给子级 Col（Col 以 padding 对半拆分，Row 根节点负 margin 抵消首尾列留白）；Col 渲染为 <div data-slot="col">（基础占位经 inline style：span 换算 width 百分比、offset 换算 margin-left 百分比、order / pull / push / flex 直写，span 0 为 display:none），响应式档位（xs/sm/md/lg/xl/xxl）经客户端注入的 style 标签媒体查询类实现（!important 覆盖基础内联样式）。',
    variants: [
      { name: 'gutter 栏间距', visual: 'Row gutter=[水平, 垂直]，Col 自动留白', scene: '卡片墙、表单多列，间距统一管理' },
      { name: 'justify / align', visual: 'center / space-between 等 6 档 + top/middle/bottom/stretch', scene: '行内对齐与垂直对齐控制' },
      { name: 'span / offset', visual: 'Col 按 24 分栏占比 + 左侧偏移', scene: '视觉稿栅格标注直译' },
      { name: '响应式断点', visual: 'md: { span: 8 } 在断点处切换占位', scene: '桌面多列、移动端单列' },
    ],
    apiProps: [
      { name: 'gutter', type: 'number | [number, number]', defaultValue: '0', description: '栏间距（px）；数组为 [水平, 垂直]；经上下文传给 Col 对半拆分为 padding' },
      { name: 'justify', type: "'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'", defaultValue: "'start'", description: '水平排列（flex justify-content）' },
      { name: 'align', type: "'top' | 'middle' | 'bottom' | 'stretch'", defaultValue: "'top'", description: '垂直对齐（align-items）' },
      { name: 'wrap', type: 'boolean', defaultValue: 'true', description: '是否换行（flex-wrap）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 一行一组 Col：Row 只做行容器，跨行内容拆多个 Row，不靠 wrap 硬撑不规则布局。',
      '- gutter 用数组分别控制水平 / 垂直间距，比在 Col 上手写 margin 一致且好改。',
      '- 响应式档位按「移动优先」声明：基础 span 给小屏值，md/lg 档位逐级放大。',
    ].join('\n'),
    examplesDo: [
      '详情页双栏：Row gutter={16}，Col span=12 两列表单区。',
      '指标区：Row justify="space-between"，四个 Col span=6 卡片。',
    ],
    examplesDont: [
      '用 Row 表达等宽均分指标墙（应使用 Grid）。',
      '在 Col 内部再手写负 margin 抵消 gutter（gutter 已内建首尾抵消）。',
    ],
  },
  'component.col': {
    dsl: {
  "type": "Row",
  "props": {
    "style": {
      "width": "100%"
    }
  },
  "children": [
    {
      "type": "Col",
      "props": {
        "span": 8
      },
      "children": [
        {
          "type": "Text",
          "props": {
            "text": "span 8",
            "style": {
              "display": "block",
              "height": 48,
              "borderRadius": 6,
              "background": "#dbeafe"
            }
          }
        }
      ]
    },
    {
      "type": "Col",
      "props": {
        "span": 8,
        "offset": 4
      },
      "children": [
        {
          "type": "Text",
          "props": {
            "text": "span 8 + offset 4",
            "style": {
              "display": "block",
              "height": 48,
              "borderRadius": 6,
              "background": "#dcfce7"
            }
          }
        }
      ]
    },
    {
      "type": "Col",
      "props": {
        "span": 4,
        "style": {
          "order": 3
        }
      },
      "children": [
        {
          "type": "Text",
          "props": {
            "text": "order 3",
            "style": {
              "display": "block",
              "height": 48,
              "borderRadius": 6,
              "background": "#fef3c7"
            }
          }
        }
      ]
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 24 分栏占位：span 按 24 分栏换算宽度，offset 平移起始栏位。',
      '- 断点切换布局：xs~xxl 档位在断点处改变占位 / 偏移 / 顺序（响应式详情页、仪表盘）。',
      '- 排列顺序调整：order / push / pull 在不改 DOM 顺序的前提下调整视觉位置。',
      '',
      '**何时不用**',
      '',
      '- 等宽均分：使用 Grid。',
      '- 只是包一层容器加内边距：使用 Container / Space。',
      '- 无栅格语义的独立区块：直接用块级元素或 Flex。',
    ].join('\n'),
    previewNote:
      '静态结构：Col 渲染为 <div data-slot="col">（class min-w-0 防内容撑破栅格 + 响应式媒体查询类）；基础占位 inline style：span → width 百分比、offset → margin-left 百分比、order → order、pull → position relative + right、push → left、flex 数字展开为 0 0 Npx，span 0 为 display none；响应式档位（xs/sm/md/lg/xl/xxl，断点同 antd：xs <576，其余 min-width）number 简写 span 或对象 { span, offset, order, pull, push }，经客户端注入 style 标签（!important 覆盖基础内联样式）；在 Row 内读取 gutter 上下文对半拆分为 padding。',
    variants: [
      { name: 'span 占位', visual: '24 分栏换算宽度（span 6 = 25%）', scene: '视觉稿栅格标注直译' },
      { name: 'offset 偏移', visual: 'margin-left 平移起始栏位', scene: '表单列留白、不对称布局' },
      { name: '响应式断点', visual: 'md / lg 档位切换占位与偏移', scene: '移动单列 → 桌面多列' },
      { name: 'order / push / pull', visual: '不改变 DOM 顺序调整视觉位置', scene: '移动端内容优先排列' },
    ],
    apiProps: [
      { name: 'span', type: 'number（0–24）', defaultValue: '24', description: '栅格占位（24 分栏换算宽度百分比）；0 隐藏' },
      { name: 'offset', type: 'number', defaultValue: '—', description: '左侧偏移栏数（margin-left 百分比）' },
      { name: 'order', type: 'number', defaultValue: '—', description: '排列顺序（CSS order）' },
      { name: 'pull / push', type: 'number', defaultValue: '—', description: '右移 / 左移栏数（position relative + right / left 百分比）' },
      { name: 'flex', type: 'string | number', defaultValue: '—', description: 'flex 值；number 展开为 0 0 Npx' },
      { name: 'xs / sm / md / lg / xl / xxl', type: 'number | { span?, offset?, order?, pull?, push? }', defaultValue: '—', description: '响应式档位（断点同 antd）；number 简写 span' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（与栅格样式合并，同键后者优先）' },
    ],
    guidelines: [
      '- 基础 span 给小屏值、md/lg 档位逐级放大（移动优先），不要在基础值上写死桌面布局。',
      '- 同一行 Col 的 span 之和 ≤ 24（超出自动换行，别靠这个拼不规则布局）。',
      '- 内容放 min-w-0 约束内：长文本 / 表格列内容需自行处理溢出，Col 已内置 min-w-0。',
    ].join('\n'),
    examplesDo: [
      '详情页：Col span=24 md=12 双列表单，移动端自动叠单列。',
      '列表页：Col span=24 md={span: 8, offset: 2} 让主内容区居中偏左。',
    ],
    examplesDont: [
      '用 Col 表达等宽均分（应使用 Grid）。',
      'span 之和超 24 且依赖换行位置做布局（应拆多行 Row）。',
    ],
  },
  'component.splitter': {
    dsl: {
  "type": "Resizable",
  "props": {
    "panels": [
      {
        "defaultSize": 40,
        "children": [
          {
            "type": "Text",
            "props": {
              "text": "左侧面板",
              "style": {
                "display": "block",
                "padding": 8
              }
            }
          }
        ]
      },
      {
        "children": [
          {
            "type": "Text",
            "props": {
              "text": "右侧面板（拖动手柄调整）",
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
      '- 把工作区拆分为多个面板（固定分割条的分栏）：编辑器 + 预览、列表 + 详情、目录 + 正文——分割条常驻在版面骨架中，两侧面板各自独立滚动。',
      '- 分栏需要初始比例预设（defaultSize 百分比），并允许用户按当前任务微调宽窄。',
      '- 面板数量多于两个、或需要上下分区的工作区（direction: vertical）。',
      '',
      '**何时不用**',
      '',
      '- 内容之间的静态分隔线（非版面分栏）：使用 Separator。',
      '- 调整的是单个区域 / 对象的自身尺寸（需要最小 / 最大像素约束）：使用 Resizable。',
      '- 等宽栅格分列：使用 Grid；一维排列：使用 Flex。',
    ].join('\n'),
    previewNote:
      '静态结构：Splitter 的 DSL 类型名为 Resizable（同一适配器，Splitter 是「工作区分栏」用法口径）——panels 逐项渲染为 react-resizable-panels 的 Panel（data-slot="resizable-panel"），相邻面板之间插入带手柄的 ResizableHandle（data-slot="resizable-handle"，内置 GripVertical 抓握图标，纵向时手柄旋转 90°）；外层 PanelGroup 为 data-slot="resizable-panel-group"（flex h-full w-full，vertical 时 flex-col）；面板内的 children 经 renderChildren 渲染 DSL 子树；defaultSize 统一按百分比解释（本预览左右 40% / 剩余）。',
    variants: [
      { name: '左右两栏', visual: '水平分栏 + 竖向拖拽手柄', scene: '列表 + 详情、编辑器 + 预览' },
      { name: '上下面板', visual: 'direction="vertical" 横向手柄', scene: '代码 + 终端、表单 + 结果' },
      { name: '多面板', visual: '3 个及以上面板，多个手柄', scene: '三栏工作台（导航 / 内容 / 检查器）' },
      { name: '带尺寸约束', visual: 'minSizePx / maxSizePx 限制可拖范围', scene: '侧栏不允许被拖到不可用宽度' },
    ],
    apiProps: [
      { name: 'panels', type: 'ResizablePanelData[]', defaultValue: '[]', description: '面板列表：{ children?, defaultSize?（百分比）, defaultSizePx?, minSizePx?, maxSizePx? }（像素优先级高于百分比）' },
      { name: 'direction', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: '排列方向（决定手柄为竖向还是横向）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 面板容器必须有确定高度（父级给高或 h-full），否则分栏高度塌陷。',
      '- 只给第一个面板设 defaultSize 即可，其余按剩余空间自动分配，避免比例之和不为 100 引发跳变。',
      '- 关键操作区（保存、提交）不放在可被拖窄的面板边缘，防止被拖拽挤没。',
      '- 每个面板内容自身负责滚动（内部用 ScrollArea），不要让整个分栏区出现双层滚动条。',
      '- 需要像素级约束（最小可用宽度）时给面板加 minSizePx，而不是靠拖拽经验规避。',
    ].join('\n'),
    examplesDo: [
      '工单详情：左侧列表（defaultSize 40）+ 右侧详情，中间手柄可拖。',
      '编辑器：上代码（defaultSize 60）+ 下控制台，direction="vertical"。',
    ],
    examplesDont: [
      '用 Splitter 表达固定分割条（应使用 Separator）。',
      '面板内再嵌一个同向 Splitter 造成手柄密集成排、拖拽目标难以命中。',
    ],
  },
  'component.resizable': {
    dsl: {
  "type": "Resizable",
  "props": {
    "direction": "vertical",
    "panels": [
      {
        "defaultSize": 30,
        "children": [
          {
            "type": "Text",
            "props": {
              "text": "面板一",
              "style": {
                "display": "block",
                "padding": 8
              }
            }
          }
        ]
      },
      {
        "children": [
          {
            "type": "Text",
            "props": {
              "text": "面板二（纵向排列，手柄可拖拽）",
              "style": {
                "display": "block",
                "padding": 8
              }
            }
          }
        ]
      },
      {
        "defaultSize": 25,
        "children": [
          {
            "type": "Text",
            "props": {
              "text": "面板三",
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
      '- 调整单个区域或对象的尺寸：检查器、底部终端、侧边抽屉式区域。',
      '- 需要像素级尺寸约束：minSizePx / maxSizePx 限定可拖范围，defaultSizePx 给定初始像素尺寸。',
      '- 纵向 / 多面板组合需要自由尺寸分配（不按固定比例）。',
      '',
      '**何时不用**',
      '',
      '- 把工作区拆成左右面板 / 上下分区（固定分割条的分栏口径）：使用 Splitter（同一适配器，语义更贴切）。',
      '- 不需要拖拽的固定分割：使用 Separator。',
      '- 需要收起 / 展开而非拖拽调尺寸：使用 Sider 的 collapsed 受控折叠或 Collapsible。',
    ].join('\n'),
    previewNote:
      '静态结构：本预览为纵向三面板——PanelGroup（data-slot="resizable-panel-group"，vertical 时 flex-col）内依次为 Panel（data-slot="resizable-panel"）+ 手柄（data-slot="resizable-handle"）+ Panel + 手柄 + Panel；每个 Panel 内的 children 经 renderChildren 渲染 DSL 子树；defaultSize 按百分比解释（本预览 30% / 自适应 / 25%），同项提供 defaultSizePx 时像素优先；minSizePx / maxSizePx 以像素串写入手柄约束的最小 / 最大尺寸。',
    variants: [
      { name: '纵向三面板', visual: '上下堆叠 + 两道横向手柄', scene: '代码 / 输出 / 日志三段式工作区' },
      { name: '像素初始尺寸', visual: 'defaultSizePx 指定初始像素宽高', scene: '侧栏需要固定初始宽度而非比例' },
      { name: '尺寸约束', visual: 'minSizePx / maxSizePx 夹逼拖拽范围', scene: '防止区域被拖到不可用或撑破布局' },
      { name: '水平两面板', visual: 'direction 缺省 horizontal', scene: '主区 + 检查器并列' },
    ],
    apiProps: [
      { name: 'panels', type: 'ResizablePanelData[]', defaultValue: '[]', description: '面板列表：{ children?, defaultSize?（百分比 0-100）, defaultSizePx?, minSizePx?, maxSizePx? }' },
      { name: 'direction', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: '排列方向' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 同一面板的 defaultSize 与 defaultSizePx 不要同时给：像素优先，比例会被忽略，容易与预期不符。',
      '- minSizePx 按内容最小可用宽度设定（如表格至少 320px），避免拖到无法阅读。',
      '- 多面板时首尾面板给尺寸、中间面板自适应，比例关系最稳定。',
      '- 尺寸变化不参与数据流：拖拽结果不写回 state（除非产品明确要求记忆布局）。',
    ].join('\n'),
    examplesDo: [
      '开发工作台：上代码（defaultSize 30%）+ 中预览 + 下日志（defaultSize 25%）。',
      '主区 + 右侧检查器：defaultSizePx 320 且 minSizePx 240，保证检查器可用宽度。',
    ],
    examplesDont: [
      '给每个面板都写死百分比且总和不为 100（拖拽后比例跳变）。',
      '在高度不定的容器里使用（分栏区高度塌陷，手柄无法定位）。',
    ],
  },
  'component.aspect-ratio': {
    dsl: {
  "type": "AspectRatio",
  "props": {
    "ratio": "16/9"
  },
  "children": [
    {
      "type": "Text",
      "props": {
        "text": "16 / 9",
        "style": {
          "display": "flex",
          "width": "100%",
          "height": "100%",
          "borderRadius": 8,
          "background": "#dbeafe",
          "alignItems": "center",
          "justifyContent": "center",
          "fontSize": 13,
          "color": "#1e40af"
        }
      }
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 保持媒体或预览画布比例：视频封面、图片缩略图、地图 / 画布容器。',
      '- 需要固定比例占位：内容加载前先按比例撑出骨架，避免加载后布局跳动。',
      '- 图片列表需要统一视觉节奏：每格同比例裁切。',
      '',
      '**何时不用**',
      '',
      '- 高度由内容自然决定的文本块：不需要比例容器。',
      '- 需要按容器宽度自适应列数 / 尺寸的栅格：使用 Grid。',
      '- 需要用户拖拽调整尺寸：使用 Splitter / Resizable。',
    ].join('\n'),
    previewNote:
      '静态结构：纯 CSS 实现（data-slot="aspect-ratio"，class w-full overflow-hidden），ratio 经 inline style aspectRatio: String(ratio) 写入（数字 16/9 或字符串 "16/9" 均可，缺省 1）；宽度由父容器决定、高度按比例推导；子内容不会自动拉伸——需要填满时内容自身声明 width / height 100%（如 Image 的 width / height 或 className）。',
    variants: [
      { name: '16 / 9', visual: '宽屏画布', scene: '视频封面、演示区、横幅' },
      { name: '4 / 3', visual: '经典画幅', scene: '传统图片、幻灯片预览' },
      { name: '1 / 1（缺省）', visual: '正方形', scene: '头像墙、商品图网格、图表画布' },
      { name: '自定义比例', visual: '数字或 "21/9" 等字符串', scene: '超宽 banner、特殊媒体规格' },
    ],
    apiProps: [
      { name: 'ratio', type: 'number | string', defaultValue: '1', description: '宽高比（如 16/9 数字或 "16/9" 字符串）' },
      { name: 'children', type: 'DslNode[]', defaultValue: '—', description: '容器内容（DSL 子树；需自行填满容器才被比例约束）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 同一列表内的比例保持一致，混排比例会让网格看起来错位。',
      '- 内容必须显式填满容器（宽高 100% 或 object-cover），否则比例只约束容器、不约束内容。',
      '- 比例容器外再设最大宽度（如 max-w）以控制整体尺寸，AspectRatio 只管比例。',
      '- 图片类内容配合 preview / object-cover 使用，避免非等比拉伸导致变形。',
    ].join('\n'),
    examplesDo: [
      '课程卡片：AspectRatio ratio="16/9" 内放封面 Image，卡片高度一致。',
      '图表画布：AspectRatio ratio={1} 内放 Chart，按容器宽度自动定高。',
    ],
    examplesDont: [
      '给 AspectRatio 内容不设宽高，却期望它自动铺满（内容会按自身尺寸渲染）。',
      '用 AspectRatio 表达固定像素宽高（直接用 style width / height 更直白）。',
    ],
  },
  'component.scroll-area': {
    dsl: {
      "type": "ScrollArea",
      "props": {
        "maxHeight": 120
      },
      "children": [
        {
          "type": "Flex",
          "props": {
            "direction": "vertical",
            "gap": 4
          },
          "children": [
            {
              "type": "Text",
              "props": {
                "text": "通知消息 1：你提交的报表已通过审批。"
              }
            },
            {
              "type": "Text",
              "props": {
                "text": "通知消息 2：项目「支付重构」已进入测试阶段。"
              }
            },
            {
              "type": "Text",
              "props": {
                "text": "通知消息 3：本周配额已使用 82%。"
              }
            },
            {
              "type": "Text",
              "props": {
                "text": "通知消息 4：新成员已加入协作空间。"
              }
            }
          ]
        }
      ]
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 建立受控滚动区域：面板内部的列表、日志流、通知流、长侧栏。',
      '- 需要限制高度而不撑破外框：maxHeight 触顶后内部滚动。',
      '- 需要自定义滚动条外观（跨浏览器一致）的场景。',
      '',
      '**何时不用**',
      '',
      '- 长页面整体滚动：用窗口滚动（长页面回顶配 BackTop），不要给整页套 ScrollArea。',
      '- 内容不需要滚动（短列表）：直接渲染，滚动容器会带来额外焦点与滚动条开销。',
      '- 虚拟化长列表 / 大数据量：使用 DataTable 等带虚拟化的组件。',
    ].join('\n'),
    previewNote:
      '静态结构：Base UI ScrollArea——根节点 data-slot="scroll-area"（relative overflow-hidden），内容在 viewport（data-slot="scroll-area-viewport"，size-full）内滚动，滚动条为自定义节点（data-slot="scroll-area-scrollbar" + data-slot="scroll-area-thumb"，垂直 w-2 / 水平 h-2，圆角 thumb 取 bg-border）；maxHeight / maxWidth 内联 style（数字按 px，也接受 CSS 长度字符串），未指定时高度由内容决定、不产生滚动；内容超出视口才出现滚动条。',
    variants: [
      { name: '定高滚动', visual: 'maxHeight 限制高度，内部纵向滚动', scene: '通知流、日志面板、长下拉内容' },
      { name: '限宽滚动', visual: 'maxWidth 限制宽度，内部横向滚动', scene: '代码行、宽表格片段' },
      { name: '双向约束', visual: 'maxHeight + maxWidth 同时给出', scene: '缩略图墙、二维内容浏览区' },
      { name: '不定高', visual: '不传尺寸，内容自然撑开', scene: '内容长度可控、仅需统一滚动条外观' },
    ],
    apiProps: [
      { name: 'maxHeight', type: 'number | string', defaultValue: '—', description: '最大高度（px 数字或 CSS 长度）；超出后出现自定义滚动条' },
      { name: 'maxWidth', type: 'number | string', defaultValue: '—', description: '最大宽度（px 数字或 CSS 长度）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（与 maxHeight / maxWidth 合并，同键后者优先）' },
      { name: 'children', type: 'DslNode[]', defaultValue: '—', description: '滚动内容（DSL 子树）' },
    ],
    guidelines: [
      '- 明确滚动归属：一个视觉区域内只留一层滚动（ScrollArea 内部不再嵌滚动容器）。',
      '- 高度上限按容器可用高度给（数字或 100% 系列长度），避免硬编码与视口不匹配。',
      '- 滚动区域内的内容保持可键盘聚焦，滚动条仅作视觉提示。',
      '- 需要「滚到底部自动加载」时配合加载态组件（Skeleton / Spinner）给出反馈。',
    ].join('\n'),
    examplesDo: [
      '侧栏通知：ScrollArea maxHeight={240} 内纵向排列通知条目。',
      '控制台输出：ScrollArea 限高，日志持续追加时区域高度稳定。',
    ],
    examplesDont: [
      '给整个页面内容套 ScrollArea（应交给窗口滚动）。',
      '在 ScrollArea 内再嵌一个 ScrollArea（嵌套滚动，滚轮行为不可预期）。',
    ],
  },
};
