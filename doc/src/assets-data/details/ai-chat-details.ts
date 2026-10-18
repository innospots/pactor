/**
 * AI 与会话分类完整详情（18 个 chat 展示组件，packages/chat 真实实现已核对）。
 * 组件统一实现于 packages/chat/src/components/（自 packages/ui 迁入，
 * 经 @pactor-app/chat/components 导出，DSL 类型经 registerChatComponents
 * 注册），apiProps 均核对自对应 index.tsx；chat 产品层
 * （store / transport / 消息状态机）组合本批组件。
 * - component.chat-message：dsl / artifact 段仍由 chat 产品层
 *   （PartRenderer）承接。
 */
import type { ComponentDetailContent } from './component-details.ts';

export const aiChatDetailContents: Record<string, ComponentDetailContent> = {
  'component.bubble': {
    dsl: {
  "type": "Flex",
  "props": {
    "direction": "vertical",
    "gap": 12
  },
  "children": [
    {
      "type": "Bubble",
      "props": {
        "variant": "muted"
      },
      "children": [
        {
          "type": "Text",
          "props": {
            "text": "你好，我是助手（muted / start）。"
          }
        }
      ]
    },
    {
      "type": "Bubble",
      "props": {
        "align": "end"
      },
      "children": [
        {
          "type": "Text",
          "props": {
            "text": "你好，请帮我写一份月报（default / end）。"
          }
        }
      ]
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 基础对话气泡容器：自定义消息体的底色与左右停靠。',
      '- 承载任意 DSL 子树（文本、Markdown、卡片）作为气泡内容。',
      '',
      '**何时不用**',
      '',
      '- 完整消息（发送方 + 正文段 + 操作）：使用 ChatMessage。',
    ].join('\n'),
    previewNote:
      '静态结构：vendored Bubble（data-slot="bubble"，data-align / data-variant）+ BubbleContent；变体七态（default 主色 / secondary / muted / tinted / outline / ghost 透明 / destructive），align=end 居右。内容经 Renderer children 机制渲染 DSL 子树。',
    variants: [
      { name: 'muted（默认）', visual: 'muted 底色', scene: '助手消息' },
      { name: 'default', visual: '主色底白字', scene: '用户消息' },
      { name: 'ghost', visual: '透明无内边距', scene: '长文 / Markdown 正文' },
      { name: 'outline / destructive', visual: '描边 / 错误色', scene: '系统提示、错误消息' },
    ],
    apiProps: [
      { name: 'align', type: "'start' | 'end'", defaultValue: "'start'", description: '左右停靠' },
      { name: 'variant', type: "'default' | 'secondary' | 'muted' | 'tinted' | 'outline' | 'ghost' | 'destructive'", defaultValue: "'muted'", description: '气泡变体' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: ['- 用户消息 default + end、助手消息 muted/ghost + start，保持同一产品内一致。'].join('\n'),
    examplesDo: ['系统提示：outline 气泡居中承载说明文字。'],
    examplesDont: ['用 Bubble 做普通卡片（应使用 Card）。'],
  },
  'component.sender': {
    dsl: {
  "type": "Flex",
  "props": {
    "direction": "vertical",
    "gap": 12
  },
  "children": [
    {
      "type": "Sender",
      "props": {
        "name": "小 P",
        "role": "AI 助手",
        "time": "10:24"
      }
    },
    {
      "type": "Sender",
      "props": {
        "name": "我",
        "time": "10:25",
        "align": "end"
      }
    }
  ]
},
    whenToUse: ['**何时使用**', '', '- 表示消息发送方和角色信息：头像 + 名称 + 角色 + 时间。', '', '**何时不用**', '', '- 完整消息体：使用 ChatMessage（内部已含 Sender）。'].join('\n'),
    previewNote:
      '静态结构：flex 行（align=end 时 flex-row-reverse）= Avatar（size-7，fallback 取 name 首字符）+ 名称（font-medium）+ 角色 / 时间（text-xs muted）。',
    variants: [
      { name: 'start（默认）', visual: '居左', scene: '助手 / 他人消息' },
      { name: 'end', visual: '居右反转', scene: '用户自己的消息' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '发送方名称' },
      { name: 'avatar', type: 'string', defaultValue: '—', description: '头像图片地址' },
      { name: 'avatarText', type: 'string', defaultValue: 'name 首字符', description: '头像占位文本' },
      { name: 'role', type: 'string', defaultValue: '—', description: '角色说明（如「AI 助手」）' },
      { name: 'time', type: 'string', defaultValue: '—', description: '时间文本（已格式化）' },
      { name: 'align', type: "'start' | 'end'", defaultValue: "'start'", description: '对齐' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: ['- 时间传已格式化文本，组件不做时区 / 格式换算。'].join('\n'),
    examplesDo: ['群聊场景：每条消息顶部 Sender 区分成员。'],
    examplesDont: ['把 Sender 当评论头部用（非会话场景用 Descriptions / Card 头）。'],
  },
  'component.thinking': {
    dsl: {
  "type": "Flex",
  "props": {
    "direction": "vertical",
    "gap": 12
  },
  "children": [
    {
      "type": "Thinking",
      "props": {
        "content": "1. 用户要月报，需要先取数\n2. 调用 search_docs 检索模板\n3. 汇总后输出"
      }
    },
    {
      "type": "Thinking",
      "props": {
        "status": "done",
        "content": "已完成的推理（默认折叠，点击展开）"
      }
    }
  ]
},
    whenToUse: ['**何时使用**', '', '- 表达推理或处理中状态：AI 思考过程的可折叠呈现。', '', '**何时不用**', '', '- 工具调用的参数与结果：使用 ToolCall。', '- 简单的运行状态：使用 AgentStatus。'].join('\n'),
    previewNote:
      '静态结构：卡片（border bg-muted/50）= 头部按钮（brain 图标 thinking 态脉冲 + 标题（缺省「思考中…/思考完成」）+ chevron）+ 可折叠内容区（whitespace-pre-wrap muted）。展开态非受控（defaultExpanded，缺省 thinking 展开 / done 折叠）或受控（expanded + onToggle）。',
    variants: [
      { name: 'thinking', visual: '图标脉冲 + 默认展开', scene: '推理进行中' },
      { name: 'done', visual: '默认折叠', scene: '推理完成可回看' },
    ],
    apiProps: [
      { name: 'content', type: 'string', defaultValue: '—', description: '推理内容' },
      { name: 'status', type: "'thinking' | 'done'", defaultValue: "'thinking'", description: '状态' },
      { name: 'title', type: 'string', defaultValue: '按状态', description: '标题' },
      { name: 'expanded', type: 'boolean', defaultValue: '—', description: '受控展开；提供时切换仅经 onToggle 上报' },
      { name: 'defaultExpanded', type: 'boolean', defaultValue: '按状态', description: '非受控初始展开' },
      { name: 'onToggle', type: 'event', defaultValue: '—', description: '折叠切换，传出目标展开态（${event}）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: ['- 思考内容与正文分离呈现，不混入 markdown 正文段。'].join('\n'),
    examplesDo: ['助手回答前：thinking 态卡片实时展示推理，完成自动可折叠。'],
    examplesDont: ['把 thinking 当普通折叠面板用（应使用 Accordion / Collapsible）。'],
  },
  'component.agent-status': {
    dsl: {
  "type": "Flex",
  "props": {
    "direction": "vertical",
    "gap": 12
  },
  "children": [
    {
      "type": "AgentStatus",
      "props": {
        "status": "running",
        "text": "检索文档",
        "elapsed": 3
      }
    },
    {
      "type": "AgentStatus",
      "props": {
        "status": "waiting",
        "text": "等待用户确认"
      }
    },
    {
      "type": "AgentStatus",
      "props": {
        "status": "done",
        "text": "任务完成"
      }
    },
    {
      "type": "AgentStatus",
      "props": {
        "status": "error",
        "text": "检索超时"
      }
    }
  ]
},
    whenToUse: ['**何时使用**', '', '- 表示智能体的运行和等待状态：执行过程行（含耗时）。', '', '**何时不用**', '', '- 业务状态（审核 / 发布）：使用通用分类 Status。'].join('\n'),
    previewNote:
      '静态结构：flex 行 = 状态图标（running → loader-circle 旋转 text-info；waiting → clock text-warning；done → circle-check text-success；error → circle-x text-destructive）+ 文本 + 可选「已用时 Xs」。',
    variants: [
      { name: 'running', visual: '旋转图标', scene: '执行中' },
      { name: 'waiting', visual: '时钟图标', scene: '排队 / 等待输入' },
      { name: 'done / error', visual: '对勾 / 叉', scene: '完成 / 失败' },
    ],
    apiProps: [
      { name: 'status', type: "'running' | 'waiting' | 'done' | 'error'", defaultValue: "'running'", description: '状态' },
      { name: 'text', type: 'string', defaultValue: '—', description: '状态文本' },
      { name: 'elapsed', type: 'number', defaultValue: '—', description: '耗时（秒）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: ['- running 必须有终态流转（done / error），不长期悬挂。'].join('\n'),
    examplesDo: ['任务面板：AgentStatus 实时展示「检索文档 · 已用时 3s」。'],
    examplesDont: ['用 AgentStatus 表达订单状态（应使用 Status）。'],
  },
  'component.streaming-text': {
    dsl: {
  "type": "Flex",
  "props": {
    "direction": "vertical",
    "gap": 12
  },
  "children": [
    {
      "type": "StreamingText",
      "props": {
        "content": "正在生成回答（数据源推送模式）",
        "streaming": true
      }
    },
    {
      "type": "StreamingText",
      "props": {
        "content": "打字机模式：这段文字会逐字显现，适合回放场景。",
        "typing": true,
        "speed": 3
      }
    }
  ]
},
    whenToUse: ['**何时使用**', '', '- 渐进展示生成中的文本：流式回答、打字机回放。', '', '**何时不用**', '', '- 完整 markdown 排版：StreamingText 是纯文本，格式化内容用 Markdown。'].join('\n'),
    previewNote:
      '静态结构：<span data-slot="streaming-text">（whitespace-pre-wrap）+ 闪烁光标（▍ text-primary animate-pulse，motion-reduce 静止）。两种模式：数据源推送（content 增长 + streaming 光标）与打字机（typing 自揭示完整 content，speed 字符 / 24ms，揭完光标消失）。',
    variants: [
      { name: '数据源推送', visual: 'content 增长 + 光标', scene: '真实流式输出' },
      { name: '打字机', visual: 'typing 自揭示', scene: '演示 / 回放' },
    ],
    apiProps: [
      { name: 'content', type: 'string', defaultValue: "''", description: '文本内容' },
      { name: 'streaming', type: 'boolean', defaultValue: 'false', description: '生成中（尾部光标）' },
      { name: 'typing', type: 'boolean', defaultValue: 'false', description: '打字机模式（自揭示）' },
      { name: 'speed', type: 'number', defaultValue: '2', description: '打字机速度（字符 / 24ms）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: ['- 真实流式用数据源推送模式；typing 仅用于内容已全量的回放。'].join('\n'),
    examplesDo: ['嵌入式问答：回答文本流式追加，streaming 光标提示生成中。'],
    examplesDont: ['对流式的 markdown 内容用 StreamingText（应用 Markdown 渲染完整段）。'],
  },
  'component.suggestion': {
    dsl: {
  "type": "Suggestion",
  "props": {
    "items": [
      "换个角度分析",
      {
        "label": "生成表格",
        "value": "to-table",
        "icon": "list"
      },
      "展开第三点"
    ]
  }
},
    whenToUse: ['**何时使用**', '', '- 提供追问、补全或下一步建议：回答后的引导 chips。', '', '**何时不用**', '', '- 起始任务入口：使用 Welcome / Prompt（卡片式更醒目）。'].join('\n'),
    previewNote:
      '静态结构：flex-wrap chips 组——rounded-full border 小按钮（可选前缀图标），点击经 onSelect 传出 value（对象项缺省取 label）。',
    variants: [
      { name: '纯文本', visual: '文字 chips', scene: '追问建议' },
      { name: '带图标', visual: '图标 + 文字', scene: '动作型建议' },
    ],
    apiProps: [
      { name: 'items', type: 'SuggestionItem[]', defaultValue: '[]', description: '建议项：字符串或 { label, value?, icon? }' },
      { name: 'justify', type: "'start' | 'center'", defaultValue: "'start'", description: '水平对齐' },
      { name: 'onSelect', type: 'event', defaultValue: '—', description: '选择事件，传出 value（${event}）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: ['- 建议 2~4 条，文案是动作而非问题（「总结本文」优于「要总结吗」）。'].join('\n'),
    examplesDo: ['回答末尾：Suggestion 给出「换个角度 / 展开第三点 / 生成表格」。'],
    examplesDont: ['用 Suggestion 做主导航（应使用 Menu / Tabs）。'],
  },
  'component.prompt': {
    dsl: {
  "type": "Flex",
  "props": {
    "gap": 12,
    "style": {
      "maxWidth": 560
    }
  },
  "children": [
    {
      "type": "Prompt",
      "props": {
        "title": "生成月报",
        "description": "汇总本月数据并输出报告",
        "icon": "chart-column"
      }
    },
    {
      "type": "Prompt",
      "props": {
        "title": "翻译文档",
        "description": "中英互译，保留格式",
        "icon": "languages"
      }
    }
  ]
},
    whenToUse: ['**何时使用**', '', '- 展示可复用提示词或任务入口：提示词库、常用任务卡。', '', '**何时不用**', '', '- 轻量追问：使用 Suggestion。', '- 会话空状态整体：使用 Welcome。'].join('\n'),
    previewNote:
      '静态结构：卡片按钮（border p-3 hover:border-primary）= 主色前缀图标 + 标题（font-medium）+ 描述（text-xs muted）；点击经 onSelect 传出 value（缺省取 title）。',
    variants: [
      { name: '带图标', visual: '主色图标 + 标题 + 描述', scene: '任务入口' },
      { name: '禁用', visual: 'opacity-50', scene: '不可用任务' },
    ],
    apiProps: [
      { name: 'title', type: 'string', defaultValue: '—', description: '提示词标题' },
      { name: 'description', type: 'string', defaultValue: '—', description: '补充描述' },
      { name: 'icon', type: 'string', defaultValue: '—', description: '前缀图标名（Icon 白名单）' },
      { name: 'value', type: 'string', defaultValue: 'title', description: '点击传出值' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
      { name: 'onSelect', type: 'event', defaultValue: '—', description: '选择事件（${event}）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: ['- 标题动宾短语，描述说清产出物。'].join('\n'),
    examplesDo: ['提示词库：Prompt 卡片点击填入输入框。'],
    examplesDont: ['把 Prompt 当内容卡片展示信息（它是操作入口）。'],
  },
  'component.welcome': {
    dsl: {
  "type": "Welcome",
  "props": {
    "description": "可以问答、写作、分析你的数据",
    "prompts": [
      {
        "title": "写周报",
        "description": "基于本周工作生成周报",
        "value": "weekly",
        "icon": "file-text"
      },
      {
        "title": "分析数据",
        "description": "解读指标变化原因",
        "value": "analyze",
        "icon": "chart-column"
      }
    ]
  }
},
    whenToUse: ['**何时使用**', '', '- 展示会话空状态、能力和起始任务：新会话落地页。', '', '**何时不用**', '', '- 非会话空状态：使用 Empty / Result。'].join('\n'),
    previewNote:
      '静态结构：居中 hero（主色大图标 + text-xl 主标题 + muted 副标题）+ 起始任务卡片栅格（grid-cols-1 sm:grid-cols-2，复用 Prompt）；点击卡片经 onSelect 传出 value。',
    variants: [
      { name: '默认', visual: '图标 + 标题 + 副标题', scene: '通用空状态' },
      { name: '带起始任务', visual: '2 列 Prompt 栅格', scene: '引导首次任务' },
    ],
    apiProps: [
      { name: 'title', type: 'string', defaultValue: '有什么可以帮你？', description: '主标题' },
      { name: 'description', type: 'string', defaultValue: '—', description: '副标题（能力说明）' },
      { name: 'icon', type: 'string', defaultValue: "'chat'", description: '主图标名（Icon 白名单）' },
      { name: 'prompts', type: 'WelcomePromptItem[]', defaultValue: '[]', description: '起始任务：{ title, description?, icon?, value? }' },
      { name: 'onSelect', type: 'event', defaultValue: '—', description: '起始任务选择事件（${event}）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: ['- 起始任务 2~4 个，选最能体现能力的场景。'].join('\n'),
    examplesDo: ['新会话页：Welcome + 4 个起始任务，点击即发起首轮提问。'],
    examplesDont: ['在消息流中间插入 Welcome（仅用于空状态）。'],
  },
  'component.citation': {
    dsl: {
  "type": "Citation",
  "props": {
    "items": [
      {
        "title": "动态页面设计规范",
        "url": "https://example.com/spec",
        "snippet": "页面以 DSL 描述结构，由运行时渲染为真实组件……"
      },
      {
        "title": "组件注册指南",
        "snippet": "在组件注册表登记适配器后即可在 DSL 中引用。"
      }
    ]
  }
},
    whenToUse: ['**何时使用**', '', '- 标识回答中的来源与引用范围：RAG 回答的出处标记。', '', '**何时不用**', '', '- 普通外链：使用 Link。', '- 长参考文献列表：用 List / Table。'].join('\n'),
    previewNote:
      '静态结构：行内 [n] 编号组（align-super，编号从 start 起）；每个编号经 vendored HoverCard 悬浮展开来源卡（标题 / line-clamp-3 片段 / 链接新窗口打开）。',
    variants: [
      { name: '连续编号', visual: '[1] [2] 上标', scene: '句末出处' },
      { name: '自定义起始', visual: 'start 偏移', scene: '跨消息连续编号' },
    ],
    apiProps: [
      { name: 'items', type: 'CitationItem[]', defaultValue: '[]', description: '来源：{ title, url?, snippet? }' },
      { name: 'start', type: 'number', defaultValue: '1', description: '起始编号' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: ['- 编号与来源一一对应，顺序与正文出现顺序一致。'].join('\n'),
    examplesDo: ['RAG 回答：句末 [1][2] 悬浮查看检索片段与原文链接。'],
    examplesDont: ['用 Citation 做脚注长文（应保持简短来源卡）。'],
  },
  'component.attachment': {
    dsl: {
  "type": "Attachment",
  "props": {
    "items": [
      {
        "id": "f1",
        "name": "需求文档.md",
        "fileSize": 2048
      },
      {
        "id": "f2",
        "name": "演示录屏.mp4",
        "fileSize": 8388608,
        "status": "uploading",
        "progress": 42
      },
      {
        "id": "f3",
        "name": "数据包.zip",
        "fileSize": 102400,
        "status": "error"
      }
    ]
  }
},
    whenToUse: ['**何时使用**', '', '- 展示、上传和管理会话附件：发送前附件列表、消息附件呈现。', '', '**何时不用**', '', '- 完整文件预览：使用 FilePreview。', '- 上传选择器：使用 Upload。'].join('\n'),
    previewNote:
      '静态结构：flex-wrap chip 组（w-56 border 卡片）= 类别图标（复用 FilePreview 的 inferKind）+ 名称 truncate + 大小 + 状态（uploading → loader 旋转 + 进度条；error → 「上传失败」+ 重试按钮）+ 移除按钮；onRemove / onRetry 传出 id（无 id 传下标）。上传与存储由调用方负责。',
    variants: [
      { name: 'done', visual: '图标 + 名称 + 大小', scene: '已就绪附件' },
      { name: 'uploading', visual: '进度条', scene: '上传中' },
      { name: 'error', visual: '失败标记 + 重试', scene: '上传失败可恢复' },
    ],
    apiProps: [
      { name: 'items', type: 'AttachmentItemData[]', defaultValue: '[]', description: '附件：{ id?, name, fileSize?, fileType?, status?, progress? }' },
      { name: 'onRemove', type: 'event', defaultValue: '—', description: '移除事件，传出 id / 下标（${event}）' },
      { name: 'onRetry', type: 'event', defaultValue: '—', description: '重试事件（error 态展示重试钮）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: ['- 状态流转由调用方驱动（上传中 → 完成 / 失败），组件只呈现。'].join('\n'),
    examplesDo: ['Composer 附件区：选择后 uploading 进度，失败可重试或移除。'],
    examplesDont: ['用 Attachment 做网盘文件列表（应使用 List / Table）。'],
  },
  'component.tool-call': {
    dsl: {
  "type": "Flex",
  "props": {
    "direction": "vertical",
    "gap": 12
  },
  "children": [
    {
      "type": "ToolCall",
      "props": {
        "name": "search_docs",
        "status": "running",
        "params": {
          "query": "月报模板",
          "topK": 3
        }
      }
    },
    {
      "type": "ToolCall",
      "props": {
        "name": "calc_sum",
        "status": "done",
        "durationMs": 1200,
        "params": {
          "values": [
            1,
            2,
            3
          ]
        },
        "result": "6"
      }
    }
  ]
},
    whenToUse: ['**何时使用**', '', '- 展示工具调用、参数、进度和结果：Agent 执行轨迹。', '', '**何时不用**', '', '- 推理过程：使用 Thinking。', '- 运行状态一句话：使用 AgentStatus。'].join('\n'),
    previewNote:
      '静态结构：卡片 = 头部按钮（terminal 图标 + 名称 truncate + 状态图标（running 旋转）+ 耗时秒 + chevron）+ 可折叠体（参数 JSON 缩进 pre / 结果 pre）；缺省 running 展开、done / error 折叠。',
    variants: [
      { name: 'running', visual: '旋转图标 + 默认展开', scene: '调用进行中' },
      { name: 'done / error', visual: '默认折叠可回看', scene: '调用完成 / 失败' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '工具名称' },
      { name: 'params', type: 'unknown', defaultValue: '—', description: '调用参数（对象 JSON 缩进展示）' },
      { name: 'status', type: "'running' | 'done' | 'error'", defaultValue: "'done'", description: '状态' },
      { name: 'result', type: 'string', defaultValue: '—', description: '调用结果文本' },
      { name: 'durationMs', type: 'number', defaultValue: '—', description: '耗时（毫秒，展示为秒）' },
      { name: 'defaultExpanded', type: 'boolean', defaultValue: '按状态', description: '非受控初始展开' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: ['- 参数中的敏感字段（令牌 / 密钥）下发前脱敏。'].join('\n'),
    examplesDo: ['Agent 轨迹：search_docs 调用 running 实时展开，完成折叠留痕。'],
    examplesDont: ['把 ToolCall 当日志控制台（应收敛为关键调用）。'],
  },
  'component.chat-message': {
    dsl: {
  "type": "ChatMessage",
  "props": {
    "role": "assistant",
    "agent": {
      "name": "小 P"
    },
    "time": "10:24",
    "parts": [
      {
        "type": "thinking",
        "content": "用户要月报：先检索模板，再汇总数据。"
      },
      {
        "type": "markdown",
        "content": "已为你生成本月月报要点：\n\n- **新增用户** 1,280（+12%）\n- **活跃率** 43%\n\n需要完整报告可以说「展开」。"
      },
      {
        "type": "tool-call",
        "name": "search_docs",
        "status": "done",
        "result": "找到 3 个模板"
      }
    ],
    "actions": [
      {
        "name": "copy",
        "label": "复制",
        "icon": "copy"
      },
      {
        "name": "retry",
        "label": "重新生成",
        "icon": "refresh-ccw"
      }
    ]
  }
},
    whenToUse: ['**何时使用**', '', '- 展示用户、助手或系统消息：会话回放、嵌入式问答、对话式表单。', '', '**何时不用**', '', '- 全局操作反馈：使用反馈分类 Message（二者职责不同）。', '- 完整会话产品（流式 transport / 消息操作闭环 / artifact）：使用 @pactor-app/chat。'].join('\n'),
    previewNote:
      '静态结构：列（user 右对齐）= Sender（头像 / 名称 / 时间，showSender 可关）+ 有序 parts 渲染——text（user 主色气泡 / assistant muted 气泡）、markdown（ghost 气泡 + Markdown）、thinking（Thinking 卡）、tool-call（ToolCall 卡）、tool-result（pre）、status（muted 行）、error（destructive 行）——+ streaming 末尾光标 + 操作行（completed / error 时展示，onAction 传出 name）。parts 与 chat 的 ChatPart 结构对齐（dsl / artifact 段由 chat 产品层承接）。',
    variants: [
      { name: 'user', visual: '主色气泡居右', scene: '用户提问' },
      { name: 'assistant', visual: 'Sender + 多段正文', scene: '助手回答' },
      { name: 'streaming', visual: '末尾光标', scene: '生成中' },
      { name: '带操作', visual: '操作行', scene: '重试 / 复制 / 反馈' },
    ],
    apiProps: [
      { name: 'role', type: "'user' | 'assistant' | 'system'", defaultValue: "'assistant'", description: '角色' },
      { name: 'parts', type: 'ChatMessagePart[]', defaultValue: '[]', description: '有序正文段：text / markdown / thinking / tool-call / tool-result / status / error' },
      { name: 'status', type: "'pending' | 'streaming' | 'completed' | 'error' | 'cancelled'", defaultValue: "'completed'", description: '消息状态' },
      { name: 'agent', type: '{ name, icon? }', defaultValue: '—', description: '助手身份（顶部 Sender 展示）' },
      { name: 'time', type: 'string', defaultValue: '—', description: '时间文本' },
      { name: 'showSender', type: 'boolean', defaultValue: 'true', description: '是否展示发送方行' },
      { name: 'actions', type: 'ChatMessageActionItem[]', defaultValue: '[]', description: '操作：{ name, label?, icon? }' },
      { name: 'onAction', type: 'event', defaultValue: '—', description: '操作事件，传出 name（${event}）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- thinking 与正文分离，操作行仅在 completed / error 出现。',
      '- 消息数据由调用方组装（props 驱动），组件不感知 store。',
    ].join('\n'),
    examplesDo: [
      '会话回放页：历史消息数组逐条 ChatMessage 渲染。',
      '嵌入式问答：用户提问 + 助手回答（thinking → markdown）单轮呈现。',
    ],
    examplesDont: [
      '用 ChatMessage 展示系统全局通知（应使用 Message / Notification）。',
    ],
  },
  'component.message-list': {
    dsl: {
  "type": "MessageList",
  "props": {
    "messages": [
      {
        "id": "m1",
        "role": "user",
        "time": "10:24",
        "parts": [
          {
            "type": "text",
            "content": "帮我总结一下这份文档"
          }
        ]
      },
      {
        "id": "m2",
        "role": "assistant",
        "agent": {
          "name": "小 P"
        },
        "time": "10:24",
        "parts": [
          {
            "type": "markdown",
            "content": "文档要点如下：\n\n1. 动态页面以 DSL 驱动\n2. 组件经注册表扩展"
          }
        ],
        "actions": [
          {
            "name": "copy",
            "label": "复制",
            "icon": "copy"
          }
        ]
      },
      {
        "id": "m3",
        "role": "user",
        "time": "10:26",
        "parts": [
          {
            "type": "text",
            "content": "再压缩成一句话"
          }
        ]
      }
    ]
  }
},
    whenToUse: ['**何时使用**', '', '- 组织连续消息流和滚动定位：会话区消息容器。', '', '**何时不用**', '', '- 单条消息：直接使用 ChatMessage。'].join('\n'),
    previewNote:
      '静态结构：滚动列（overflow-y-auto gap-4，高度由外层约束）逐条渲染 ChatMessage；messages 变化自动滚到底部（autoScroll 可关）；onAction 统一上抛为 { id, action }。',
    variants: [
      { name: '自动滚动（默认）', visual: '新消息滚到底', scene: '实时对话' },
      { name: '关闭自动滚动', visual: 'autoScroll=false', scene: '历史回放' },
    ],
    apiProps: [
      { name: 'messages', type: 'MessageListItem[]', defaultValue: '[]', description: '消息列表（ChatMessage props + 可选 id）' },
      { name: 'autoScroll', type: 'boolean', defaultValue: 'true', description: '消息变化自动滚到底部' },
      { name: 'onAction', type: 'event', defaultValue: '—', description: '消息操作，传出 { id, action }（${event}）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（高度由外层约束）' },
    ],
    guidelines: ['- 必须给滚动高度（外层容器或 style），否则列表随内容撑高失去滚动。'].join('\n'),
    examplesDo: ['问答面板：MessageList（h-96）+ Composer 组成最小会话闭环。'],
    examplesDont: ['不约束高度直接放长消息流（页面整体滚动体验差）。'],
  },
  'component.composer': {
    dsl: {
  "type": "Composer",
  "props": {
    "placeholder": "输入消息，Enter 发送",
    "attachments": [
      {
        "id": "a1",
        "name": "需求文档.md",
        "fileSize": 2048
      },
      {
        "id": "a2",
        "name": "录屏.mp4",
        "status": "uploading",
        "progress": 65
      }
    ]
  }
},
    whenToUse: ['**何时使用**', '', '- 输入提示词、附件和发送操作：会话输入区。', '', '**何时不用**', '', '- 只要输入框结构（自定义工具栏槽）：使用 ChatInput。', '- 完整会话产品输入（transport / 提及）：使用 @pactor-app/chat 的 Composer。'].join('\n'),
    previewNote:
      '静态结构：列 = 附件区（Attachment，attachments 非空时渲染，onRemoveAttachment / onRetryAttachment 透出）+ 输入区（ChatInput：自适应高度、Enter 发送 / Shift+Enter 换行 / IME 保护、非受控发送后自动清空）；loading 禁用发送。',
    variants: [
      { name: '纯输入', visual: 'ChatInput', scene: '常规提问' },
      { name: '带附件', visual: '附件 chips + 输入', scene: '带上下文文件提问' },
    ],
    apiProps: [
      { name: 'value', type: 'string', defaultValue: '—', description: '受控值' },
      { name: 'placeholder', type: 'string', defaultValue: '—', description: '占位提示' },
      { name: 'disabled / loading', type: 'boolean', defaultValue: 'false', description: '禁用 / 发送中（禁用发送）' },
      { name: 'rows', type: 'number', defaultValue: '3', description: '最小行数' },
      { name: 'attachments', type: 'AttachmentItemData[]', defaultValue: '[]', description: '附件列表' },
      { name: 'onRemoveAttachment / onRetryAttachment', type: 'event', defaultValue: '—', description: '附件移除 / 重试，传出 id / 下标' },
      { name: 'onChange', type: 'event', defaultValue: '—', description: '输入事件，传出 string' },
      { name: 'onSubmit', type: 'event', defaultValue: '—', description: '发送事件，传出当前文本（${event}）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: ['- 附件的上传与存储由调用方负责，组件只呈现与上报事件。'].join('\n'),
    examplesDo: ['最小会话页：MessageList + Composer，onSubmit 接入数据源发送。'],
    examplesDont: ['在 Composer 里塞业务提交逻辑（应走 service / action）。'],
  },
  'component.conversation-list': {
    dsl: {
  "type": "ConversationList",
  "props": {
    "searchable": true,
    "activeId": "${state.active}",
    "items": [
      {
        "id": "c1",
        "title": "月报讨论",
        "description": "已生成初稿，待确认口径",
        "time": "09:30"
      },
      {
        "id": "c2",
        "title": "架构评审",
        "description": "方案 B 待补充性能数据",
        "time": "昨天"
      },
      {
        "id": "c3",
        "title": "发布 checklist",
        "description": "剩余 3 项",
        "time": "周一"
      }
    ]
  },
  "events": {
    "onSelect": {
      "action": "setState",
      "params": {
        "active": "${event}"
      }
    }
  }
},
    whenToUse: ['**何时使用**', '', '- 浏览、搜索和管理历史会话：会话侧栏。', '', '**何时不用**', '', '- 通用导航菜单：使用 Menu。'].join('\n'),
    previewNote:
      '静态结构：列 = 可选搜索框（searchable，按 title / description 过滤）+ 会话行（title truncate + description + time，激活 bg-accent，悬浮删除按钮 onDelete 阻止冒泡）；激活态非受控或受控（activeId + onSelect）；空结果显示「无匹配会话」。会话的存储与加载由调用方负责。',
    variants: [
      { name: '基础列表', visual: '标题 + 摘要 + 时间', scene: '会话侧栏' },
      { name: '可搜索', visual: '顶部搜索框', scene: '会话量大时' },
      { name: '可管理', visual: '悬浮删除', scene: '会话管理' },
    ],
    apiProps: [
      { name: 'items', type: 'ConversationItemData[]', defaultValue: '[]', description: '会话：{ id, title, description?, time? }' },
      { name: 'activeId', type: 'string', defaultValue: '—', description: '受控当前会话 id；提供时切换仅经 onSelect 上报' },
      { name: 'searchable', type: 'boolean', defaultValue: 'false', description: '是否展示搜索框' },
      { name: 'onSelect', type: 'event', defaultValue: '—', description: '选择事件，传出会话 id（${event}）' },
      { name: 'onDelete', type: 'event', defaultValue: '—', description: '删除事件（行悬浮删除钮）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: ['- 删除等破坏性操作配合 Popconfirm 二次确认（在 onDelete 闭环里做）。'].join('\n'),
    examplesDo: ['会话侧栏：searchable + activeId 受控，切换加载对应消息流。'],
    examplesDont: ['把 ConversationList 当站点导航（应使用 Menu）。'],
  },
};
