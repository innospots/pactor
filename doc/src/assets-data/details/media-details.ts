/**
 * 媒体与内容分类完整详情（第七批组件，packages/ui 真实实现已核对）。
 * - 11 个组件 apiProps 均核对自 packages/ui/src/components/components/ 下
 *   同名目录的 index.tsx；
 * - component.markdown / component.code-block 复用 @pactor-app/markdown 的
 *   MarkdownDslComponent / CodeBlock（packages/markdown/src/）；
 * - component.document-preview 为通用分页容器（图片页 / 文本页 + 翻页缩放），
 *   不解析 PDF 等二进制格式。
 */
import type { ComponentDetailContent } from './component-details.ts';

export const mediaDetailContents: Record<string, ComponentDetailContent> = {
  'component.image-viewer': {
    dsl: {
  "type": "ImageViewer",
  "props": {
    "src": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22480%22%20height%3D%22180%22%3E%3Crect%20width%3D%22480%22%20height%3D%22180%22%20fill%3D%22%2360a5fa%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%2296%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20fill%3D%22%23ffffff%22%3E%E7%82%B9%E5%87%BB%E6%9F%A5%E7%9C%8B%E7%81%AF%E7%AE%B1%3C%2Ftext%3E%3C%2Fsvg%3E",
    "alt": "示例图片",
    "style": {
      "maxWidth": 360
    }
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 单张图片需要放大查看细节：设计稿、截图、证件照、图表。',
      '- 需要缩放 / 旋转 / 复位的沉浸式查看（灯箱）。',
      '',
      '**何时不用**',
      '',
      '- 纯展示不需要查看交互：使用数据展示分类的 Image。',
      '- 多图浏览与切换：使用 Gallery。',
    ].join('\n'),
    previewNote:
      '静态结构：行内图片 <img data-slot="image-viewer-img">（preview 时 cursor-zoom-in）；点击打开灯箱 <div data-slot="image-lightbox">（fixed inset-0，bg-(--overlay-background) 遮罩）——居中图片（scale / rotate 变换，0.5x~4x，步进 0.5；旋转步进 -90°）+ 底部工具条（放大 / 缩小 / 旋转 / 复位 / 关闭）+ 遮罩点击与 Esc 关闭，关闭触发 onClose。Gallery 复用同一灯箱（追加前后切换与序号）。',
    variants: [
      { name: '行内 + 灯箱', visual: '缩略图点击放大', scene: '详情页附图、设计稿查看' },
      { name: '纯展示', visual: 'preview=false', scene: '只读展示但保留语义' },
    ],
    apiProps: [
      { name: 'src', type: 'string', defaultValue: '—', description: '图片地址' },
      { name: 'alt', type: 'string', defaultValue: '—', description: '替代文本' },
      { name: 'preview', type: 'boolean', defaultValue: 'true', description: '是否允许点击放大查看' },
      { name: 'onClose', type: 'event', defaultValue: '—', description: '灯箱关闭事件（events.onClose）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- alt 必填，描述图片内容而非文件名。',
      '- 灯箱缩放范围 0.5x~4x，超出业务需求时自行裁剪图源而非放宽上限。',
      '- 多图场景改用 Gallery，不并列多个 ImageViewer。',
    ].join('\n'),
    examplesDo: [
      '设计评审页：设计稿缩略图点击放大，灯箱内缩放查看标注细节。',
      '证件审核：证件照放大 + 旋转校正方向后核对。',
    ],
    examplesDont: [
      '用 ImageViewer 做图片列表（应使用 Gallery）。',
      '在行内图上叠加自定义操作按钮（交互应集中在灯箱工具条）。',
    ],
  },
  'component.gallery': {
    dsl: {
  "type": "Gallery",
  "props": {
    "columns": 4,
    "items": [
      {
        "src": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22480%22%20height%3D%22180%22%3E%3Crect%20width%3D%22480%22%20height%3D%22180%22%20fill%3D%22%2360a5fa%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%2296%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20fill%3D%22%23ffffff%22%3E%E5%9B%BE%E4%B8%80%3C%2Ftext%3E%3C%2Fsvg%3E",
        "caption": "晨会现场"
      },
      {
        "src": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22480%22%20height%3D%22180%22%3E%3Crect%20width%3D%22480%22%20height%3D%22180%22%20fill%3D%22%2334d399%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%2296%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20fill%3D%22%23ffffff%22%3E%E5%9B%BE%E4%BA%8C%3C%2Ftext%3E%3C%2Fsvg%3E",
        "caption": "产品评审"
      },
      {
        "src": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22480%22%20height%3D%22180%22%3E%3Crect%20width%3D%22480%22%20height%3D%22180%22%20fill%3D%22%23fbbf24%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%2296%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20fill%3D%22%23ffffff%22%3E%E5%9B%BE%E4%B8%89%3C%2Ftext%3E%3C%2Fsvg%3E",
        "caption": "团建合影"
      },
      {
        "src": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22480%22%20height%3D%22180%22%3E%3Crect%20width%3D%22480%22%20height%3D%22180%22%20fill%3D%22%23f472b6%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%2296%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20fill%3D%22%23ffffff%22%3E%E5%9B%BE%E5%9B%9B%3C%2Ftext%3E%3C%2Fsvg%3E",
        "caption": "发布会"
      }
    ]
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 浏览多张图片或媒体资源：相册、效果图集、活动现场图。',
      '- 缩略图栅格 + 灯箱切换（前后翻页、序号指示）。',
      '',
      '**何时不用**',
      '',
      '- 单图查看：使用 ImageViewer。',
      '- 图文混排的列表：使用 List / Card。',
    ].join('\n'),
    previewNote:
      '静态结构：缩略图栅格（grid-cols-{2|3|4}，aspect-square object-cover，caption 底部一行 truncate）；点击打开与 ImageViewer 共享的灯箱，追加上一张 / 下一张按钮（首末项隐藏对应按钮）与顶部序号指示（index / count），切换图片时自动复位缩放旋转。',
    variants: [
      { name: '三列（默认）', visual: '3 列方形缩略图', scene: '标准相册' },
      { name: '两列 / 四列', visual: '更疏 / 更密栅格', scene: '大图展示 / 高密度浏览' },
      { name: '带说明', visual: '缩略图下一行 caption', scene: '需要图注的图集' },
    ],
    apiProps: [
      { name: 'items', type: 'GalleryItemData[]', defaultValue: '[]', description: '图片列表：{ src, alt?, caption? }' },
      { name: 'columns', type: '2 | 3 | 4', defaultValue: '3', description: '缩略图列数' },
      { name: 'onClose', type: 'event', defaultValue: '—', description: '灯箱关闭事件（events.onClose）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 缩略图统一方形裁切（object-cover），原图在灯箱中完整查看。',
      '- caption 控制在一行内，长文案放详情页。',
      '- 图片超过 20 张时加分页或「加载更多」，不一次渲染全部。',
    ].join('\n'),
    examplesDo: [
      '活动现场图集：四列缩略图 + 灯箱翻页浏览。',
      '效果图库：两列大图 + caption 标注方案名。',
    ],
    examplesDont: [
      '用 Gallery 做头像墙（应使用 Avatar 组）。',
      '缩略图直接链到原图新窗口（失去灯箱切换体验）。',
    ],
  },
  'component.video': {
    dsl: {
  "type": "Video",
  "props": {
    "poster": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22480%22%20height%3D%22180%22%3E%3Crect%20width%3D%22480%22%20height%3D%22180%22%20fill%3D%22%2394a3b8%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%2296%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20fill%3D%22%23ffffff%22%3E%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2%EF%BC%88%E6%9C%AA%E9%85%8D%E7%BD%AE%20src%EF%BC%89%3C%2Ftext%3E%3C%2Fsvg%3E",
    "style": {
      "maxWidth": 480
    }
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 播放视频内容：宣传片、教程、会议录屏。',
      '- 需要封面图、原生控制条的常规播放场景。',
      '',
      '**何时不用**',
      '',
      '- 直播流 / 自定义播放器皮肤：本组件是原生 video 包装，需自建播放器。',
      '- 音频内容：使用 Audio。',
    ].join('\n'),
    previewNote:
      '静态结构：<video data-slot="video">（w-full rounded-md，playsInline）；src / poster / controls（默认 true）/ autoplay / loop / muted 透传原生属性。本预览仅配置 poster 封面（未配置 src）。',
    variants: [
      { name: '控制条播放', visual: '原生 controls', scene: '常规视频内容' },
      { name: '封面占位', visual: 'poster 封面', scene: '未加载时的视觉占位' },
      { name: '静音自动播放', visual: 'autoplay + muted', scene: '背景氛围视频' },
    ],
    apiProps: [
      { name: 'src', type: 'string', defaultValue: '—', description: '视频地址' },
      { name: 'poster', type: 'string', defaultValue: '—', description: '封面图地址' },
      { name: 'controls', type: 'boolean', defaultValue: 'true', description: '是否显示原生控制条' },
      { name: 'autoplay', type: 'boolean', defaultValue: 'false', description: '自动播放（浏览器策略要求同时 muted）' },
      { name: 'loop', type: 'boolean', defaultValue: 'false', description: '循环播放' },
      { name: 'muted', type: 'boolean', defaultValue: 'false', description: '静音' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 自动播放必须同时 muted（浏览器策略），否则被拦截。',
      '- 提供 poster 避免加载期空白。',
      '- 默认全宽渲染，尺寸由外层容器（Grid / Container）约束。',
    ].join('\n'),
    examplesDo: [
      '帮助中心：教程视频 poster 封面 + 控制条播放。',
      '落地页头图：muted + autoplay + loop 背景视频。',
    ],
    examplesDont: [
      '试图用本组件做直播（协议与延迟要求不同）。',
      'autoplay 不带 muted 然后排查「为什么不播」。',
    ],
  },
  'component.audio': {
    dsl: {
  "type": "Audio",
  "props": {
    "style": {
      "maxWidth": 480
    }
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 播放音频内容：播客、录音、语音消息回放。',
      '',
      '**何时不用**',
      '',
      '- 视频内容：使用 Video。',
      '- 需要波形 / 进度可视化的专业音频场景：原生 audio 包装不满足，需自建。',
    ].join('\n'),
    previewNote:
      '静态结构：<audio data-slot="audio">（w-full）；src / controls（默认 true）/ autoplay / loop / muted 透传原生属性。本预览未配置 src，仅展示控制条形态。',
    variants: [
      { name: '控制条播放', visual: '原生 controls 全宽条', scene: '常规音频内容' },
      { name: '循环背景音', visual: 'loop + muted 起步', scene: '氛围音频（谨慎使用）' },
    ],
    apiProps: [
      { name: 'src', type: 'string', defaultValue: '—', description: '音频地址' },
      { name: 'controls', type: 'boolean', defaultValue: 'true', description: '是否显示原生控制条' },
      { name: 'autoplay', type: 'boolean', defaultValue: 'false', description: '自动播放（浏览器策略要求同时 muted）' },
      { name: 'loop', type: 'boolean', defaultValue: 'false', description: '循环播放' },
      { name: 'muted', type: 'boolean', defaultValue: 'false', description: '静音' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 自动播放必须同时 muted（浏览器策略）。',
      '- 页面最多一个自动播放音频，避免声音竞争。',
    ].join('\n'),
    examplesDo: [
      '会议纪要页：录音文件控制条回放。',
      '播客列表项：单集音频内嵌播放。',
    ],
    examplesDont: [
      '页面加载即自动播放有声音频（强干扰且被浏览器拦截）。',
    ],
  },
  'component.file-preview': {
    dsl: {
  "type": "Flex",
  "props": {
    "direction": "vertical",
    "gap": 12
  },
  "children": [
    {
      "type": "FilePreview",
      "props": {
        "name": "发布说明.md",
        "fileSize": 2048,
        "fileType": ".md",
        "src": "#",
        "content": "## v1.20.0\n\n- 新增媒体与内容类组件\n- 修复导航菜单图标换行"
      }
    },
    {
      "type": "FilePreview",
      "props": {
        "name": "架构图.png",
        "fileSize": 156672,
        "fileType": "image/png",
        "src": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22480%22%20height%3D%22180%22%3E%3Crect%20width%3D%22480%22%20height%3D%22180%22%20fill%3D%22%23818cf8%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%2296%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20fill%3D%22%23ffffff%22%3E%E6%9E%B6%E6%9E%84%E5%9B%BE%3C%2Ftext%3E%3C%2Fsvg%3E"
      }
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 预览常见文件及其元信息：附件列表、审批材料、上传结果确认。',
      '- 图片 / 视频 / 音频 / 文本的内嵌预览 + 名称 / 大小 / 类型 / 下载。',
      '',
      '**何时不用**',
      '',
      '- 分页文档阅读：使用 DocumentPreview。',
      '- 纯下载链接列表：用 List / Link 即可。',
    ].join('\n'),
    previewNote:
      '静态结构：卡片（border rounded-md）= 预览体（bg-muted：image → img max-h-72 object-contain；video / audio → 原生播放器；text → pre max-h-72 滚动；other 或无 src → 居中占位图标）+ 元信息行（类别图标 + 名称 truncate + 格式化大小 + 类型 + 下载链接）。类别按 kind 显式指定或按 fileType / name 扩展名推断（inferKind）。',
    variants: [
      { name: '图片', visual: '内嵌图片预览', scene: '设计稿、截图附件' },
      { name: '文本', visual: '等宽文本滚动区', scene: '日志、markdown、配置文件' },
      { name: '视频 / 音频', visual: '原生播放器', scene: '录屏、录音附件' },
      { name: '其他', visual: '图标占位 + 元信息', scene: '压缩包、二进制等不支持内嵌的类型' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '文件名（含扩展名，用于推断与展示）' },
      { name: 'fileSize', type: 'number', defaultValue: '—', description: '文件大小（字节，格式化展示）' },
      { name: 'fileType', type: 'string', defaultValue: '—', description: 'MIME 或扩展名（用于推断）' },
      { name: 'src', type: 'string', defaultValue: '—', description: '文件地址（内嵌预览与下载）' },
      { name: 'content', type: 'string', defaultValue: '—', description: '文本文件内容（text 类内嵌展示）' },
      { name: 'kind', type: "'image' | 'text' | 'video' | 'audio' | 'other'", defaultValue: '推断', description: '显式指定类别（覆盖推断）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 文本预览的 content 由数据源下发，大文件应截断（如前 100KB）。',
      '- 提供 src 即出现下载入口，不希望下载时不要传 src。',
      '- 元信息至少包含名称与大小，类型可省略（图标已表达）。',
    ].join('\n'),
    examplesDo: [
      '审批详情：附件区逐个 FilePreview，图片内嵌、合同 PDF 走元信息 + 下载。',
      '日志排查：text 类展示截取的应用日志。',
    ],
    examplesDont: [
      '把超大文本全量塞进 content（应服务端截断）。',
      '用 FilePreview 播放流媒体视频（应使用 Video）。',
    ],
  },
  'component.document-preview': {
    dsl: {
  "type": "DocumentPreview",
  "props": {
    "pages": [
      {
        "content": "第一章 总则\n\n第一条 为规范动态页面的开发与接入，制定本规范。\n第二条 本规范适用于全部 DSL 页面。"
      },
      {
        "content": "第二章 组件\n\n第三条 页面应优先使用内置组件；自定义组件需注册适配器。\n第四条 涉及状态的组件应支持受控模式。"
      },
      {
        "content": "第三章 附则\n\n第五条 本规范自发布之日起施行。"
      }
    ]
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 阅读分页文档：扫描件、合同条款、分页报告。',
      '- 需要翻页、页码指示与缩放的阅读场景。',
      '',
      '**何时不用**',
      '',
      '- 单文件内嵌预览：使用 FilePreview。',
      '- 长文连续阅读：用 Typography / Markdown 排版，不强制分页。',
      '- PDF 二进制解析：本期不支持（pages 需预先转为图片或文本页）。',
    ].join('\n'),
    previewNote:
      '静态结构：卡片 = 工具条（上一页 / 页码指示 / 下一页 / 分隔线 / 缩小 / 放大，0.5x~2x 步进 0.25）+ 阅读体（bg-muted 滚动区：图片页 img、文本页白底纸张卡片，scale 变换 origin top center）。翻页非受控（内部维护）或受控（currentPage + onChange，仅上报不自行切换）。空 pages 渲染「暂无文档内容」。',
    variants: [
      { name: '文本页', visual: '白底纸张卡片', scene: '条款、规范类文档' },
      { name: '图片页', visual: '扫描件图片', scene: '合同扫描件、票据' },
      { name: '受控翻页', visual: 'currentPage + onChange', scene: '与外部步骤 / 批注联动' },
    ],
    apiProps: [
      { name: 'pages', type: 'DocumentPageData[]', defaultValue: '[]', description: '分页内容：{ src?, content? }（src 优先；不解析 PDF 等二进制）' },
      { name: 'currentPage', type: 'number', defaultValue: '—', description: '受控当前页码（从 1 起）；提供时翻页仅经 onChange 上报' },
      { name: 'onChange', type: 'event', defaultValue: '—', description: '翻页事件，传出目标页码（${event} 取页码）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- PDF 等二进制先在服务端 / 构建期转为图片页或文本页，再交给本组件。',
      '- 文本页内容保持一页一屏的量级，避免单页过长失去分页意义。',
      '- 与批注 / 审核流联动时用受控模式同步当前页。',
    ].join('\n'),
    examplesDo: [
      '合同审核：扫描件图片页逐页翻阅 + 放大核对印章。',
      '规范阅读：文本页分页呈现，受控 currentPage 与目录联动。',
    ],
    examplesDont: [
      '期望组件直接打开 .pdf 文件（需先转页数据）。',
      '把整本长文档塞进单页 content（应拆分多页）。',
    ],
  },
  'component.rich-text': {
    dsl: {
  "type": "RichText",
  "props": {
    "html": "<h3 style=\"margin:0 0 8px\">富文本内容</h3><p style=\"margin:0\">支持 <strong>加粗</strong>、<em>斜体</em>、<a href=\"#\">链接</a> 等内联格式；渲染前经白名单消毒。</p>"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 渲染富文本内容：CMS 下发的 HTML、运营配置的公告、邮件模板预览。',
      '',
      '**何时不用**',
      '',
      '- Markdown 源内容：使用 Markdown（AST 渲染，样式更统一）。',
      '- 用户输入的不可信内容要求高隔离：本组件虽经 DOMPurify 消毒，但仍渲染 HTML，敏感场景优先 Markdown。',
    ].join('\n'),
    previewNote:
      '静态结构：<div data-slot="rich-text">（text-sm leading-relaxed break-words）；html 先经 DOMPurify 白名单消毒（剔除 script / 内联事件 / javascript: URL），再 dangerouslySetInnerHTML 挂载。与 Markdown 的边界：RichText 渲染 HTML（消毒后），Markdown 走 AST 不碰原始 HTML。',
    variants: [
      { name: '基础富文本', visual: '段落 + 内联格式', scene: '公告、简介' },
      { name: '结构化 HTML', visual: '标题 / 列表 / 表格', scene: 'CMS 内容' },
    ],
    apiProps: [
      { name: 'html', type: 'string', defaultValue: '—', description: '富文本 HTML（渲染前经 DOMPurify 消毒）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 内容源必须可信 + 消毒双保险：消毒是底线，不是放任任意 HTML 的理由。',
      '- 富文本内联样式可能与站点皮肤冲突，重要内容优先 Markdown。',
      '- 不支持脚本与交互（消毒会剔除），需要交互的内容改用 DSL 组件。',
    ].join('\n'),
    examplesDo: [
      '系统公告：运营在 CMS 配置的富文本直接渲染。',
      '邮件模板预览：HTML 模板消毒后内嵌展示。',
    ],
    examplesDont: [
      '把富文本当作可执行视图（内嵌脚本会被剔除）。',
      '用户评论区直接用 RichText（优先纯文本或 Markdown）。',
    ],
  },
  'component.markdown': {
    dsl: {
  "type": "Markdown",
  "props": {
    "content": "## 发布清单\n\n- [x] 组件实现\n- [x] 契约测试\n- [ ] 版本发布\n\n`pnpm --filter @pactor-app/ui build`"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 渲染 Markdown 内容：文档、帮助中心、AI 生成文本、发布说明。',
      '- 需要 GFM（表格 / 任务列表）、数学公式（KaTeX）与代码高亮。',
      '',
      '**何时不用**',
      '',
      '- HTML 源内容：使用 RichText。',
      '- 纯代码展示：使用 CodeBlock。',
    ].join('\n'),
    previewNote:
      '静态结构：复用 @pactor-app/markdown 的 MarkdownDslComponent——react-markdown AST 渲染（不渲染原始 HTML，安全边界），支持 GFM（表格 / 任务列表 / 删除线）、KaTeX 数学公式、fenced 代码块经 Prism Light 高亮；链接经 isSafeUrl 校验（javascript: 等被拦截）。',
    variants: [
      { name: '基础排版', visual: '标题 / 列表 / 引用 / 代码', scene: '文档正文' },
      { name: 'GFM 扩展', visual: '表格 / 任务列表', scene: '清单、对比表' },
      { name: '数学公式', visual: 'KaTeX 渲染', scene: '技术文档、公式推导' },
    ],
    apiProps: [
      { name: 'content', type: 'string', defaultValue: '—', description: 'Markdown 内容（表达式由 Renderer 预先解析）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 不可信内容优先 Markdown（AST 渲染无原始 HTML 注入面）。',
      '- 长文档配合 Anchor 做章节定位（标题自动生成层级结构）。',
      '- 代码块语言标注完整（```ts），未注册语言降级为纯文本。',
    ].join('\n'),
    examplesDo: [
      '帮助中心：Markdown 文档直接渲染，代码块自动高亮。',
      'AI 回答：模型输出的 Markdown 流式内容渲染。',
    ],
    examplesDont: [
      '在 Markdown 里塞 HTML 期望原样渲染（AST 模式会忽略 / 转义）。',
    ],
  },
  'component.code-block': {
    dsl: {
  "type": "CodeBlock",
  "props": {
    "language": "ts",
    "code": "interface User {\n  id: string;\n  name: string;\n}\n\nexport function greet(user: User): string {\n  return `你好，${user.name}`;\n}"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 展示带语法高亮的代码：接口示例、配置片段、错误堆栈。',
      '- 需要一键复制的代码分享场景。',
      '',
      '**何时不用**',
      '',
      '- Markdown 文档中的行内代码：由 Markdown 组件的代码块承接。',
      '- 代码编辑：本组件只读，编辑场景需代码编辑器。',
    ].join('\n'),
    previewNote:
      '静态结构：卡片（border rounded-md bg-muted）= 复制按钮（右上角，复制成功变 √ 两秒）+ 高亮体（复用 @pactor-app/markdown 的 Prism Light 高亮器，已注册 bash/css/js/jsx/ts/tsx/json/md/python/yaml 及别名，未注册语言降级纯文本）。',
    variants: [
      { name: '高亮代码', visual: 'Prism one-light 配色', scene: '接口 / 配置示例' },
      { name: '纯文本', visual: '未注册语言降级', scene: '日志、堆栈、任意文本' },
    ],
    apiProps: [
      { name: 'code', type: 'string', defaultValue: "''", description: '代码内容' },
      { name: 'language', type: 'string', defaultValue: "'text'", description: '语言（Prism 注册表；未注册降级纯文本）' },
      { name: 'copyable', type: 'boolean', defaultValue: 'true', description: '是否显示复制按钮' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- language 标注准确，高亮才有意义；不确定就用 text。',
      '- 超长代码（百行以上）考虑折叠或只贴关键片段。',
      '- 密钥 / 令牌等敏感内容不要渲染进代码块。',
    ].join('\n'),
    examplesDo: [
      'API 文档：请求示例 ts/json 高亮 + 一键复制。',
      '错误详情：堆栈文本以 text 语言展示。',
    ],
    examplesDont: [
      '把 CodeBlock 当编辑器（只读组件）。',
      '展示含真实密钥的配置（应脱敏）。',
    ],
  },
  'component.diff-viewer': {
    dsl: {
  "type": "DiffViewer",
  "props": {
    "oldText": "export const title = \"资产库\";\nexport const version = \"1.19.0\";\nexport const stable = false;",
    "newText": "export const title = \"资产库\";\nexport const version = \"1.20.0\";\nexport const stable = true;"
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 比较文本或代码差异：版本对比、配置变更审查、AI 修改建议确认。',
      '- 统一视图（+/- 行）或左右分栏视图（split）。',
      '',
      '**何时不用**',
      '',
      '- 结构化对象对比：先序列化为文本（JSON.stringify 缩进）再比较。',
      '- 大文件三路合并：本组件是只读对比，不做合并。',
    ].join('\n'),
    previewNote:
      '静态结构：等宽字体卡片（font-mono text-xs）；统一视图每行 [+/-/空格] 符号槽 + 文本，add 行 bg-success/10、del 行 bg-destructive/10；分栏视图 del 只占左栏、add 只占右栏（另一侧 bg-muted 占位），same 两栏同行，可带 oldTitle / newTitle 栏头。diff 算法为 LCS 行级比较（diffLines）。',
    variants: [
      { name: '统一视图', visual: '+/- 单列行', scene: '变更量小、顺序重要' },
      { name: '分栏视图', visual: '左右对照', scene: '整段替换、版本对比' },
    ],
    apiProps: [
      { name: 'oldText', type: 'string', defaultValue: "''", description: '旧文本（按行比较）' },
      { name: 'newText', type: 'string', defaultValue: "''", description: '新文本（按行比较）' },
      { name: 'split', type: 'boolean', defaultValue: 'false', description: '左右分栏视图' },
      { name: 'oldTitle / newTitle', type: 'string', defaultValue: '—', description: '分栏视图栏目标题' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 比较粒度为整行，行内差异不单独标注（换行即拆成 del + add）。',
      '- 大文本（数千行以上）LCS 计算成本随乘积增长，应服务端先 diff 或截断。',
      '- 分栏视图务必配 oldTitle / newTitle 标明左右。',
    ].join('\n'),
    examplesDo: [
      '配置变更审查：发布前 old/new 配置分栏对比。',
      'AI 改写确认：原文与改写结果统一视图查看增删。',
    ],
    examplesDont: [
      '用 DiffViewer 做在线合并（只读）。',
      '直接对比两份整库导出（应先限定范围）。',
    ],
  },
  'component.json-viewer': {
    dsl: {
  "type": "JSONViewer",
  "props": {
    "data": {
      "name": "@pactor-app/ui",
      "version": "1.20.0",
      "components": 148,
      "stable": true,
      "deps": {
        "react": "19",
        "tailwind": "4"
      },
      "tags": [
        "dsl",
        "sdui"
      ],
      "extra": null
    },
    "expandedDepth": 1
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 折叠、检查和复制结构化数据：接口响应、状态快照、配置对象。',
      '- 调试面板、开发工具类页面。',
      '',
      '**何时不用**',
      '',
      '- 面向终端用户的数据展示：用 Descriptions / Table。',
      '- 编辑 JSON：本组件只读。',
    ].join('\n'),
    previewNote:
      '静态结构：等宽字体卡片（font-mono text-xs bg-muted）；对象 / 数组节点 <button data-slot="json-toggle">（chevron + 键名，折叠时显示摘要 […] N 项 / {…} N 键），叶子值按类型着色（string → text-success 带引号 / number → text-info / boolean → text-warning / null → text-muted-foreground）；expandedDepth 控制默认展开层数；copyable 根部复制按钮（复制格式化 JSON，成功变 √ 两秒）。',
    variants: [
      { name: '默认展开一层', visual: 'expandedDepth=1', scene: '常规检查' },
      { name: '全折叠', visual: 'expandedDepth=0', scene: '大对象概览' },
      { name: '带复制', visual: '根部复制按钮', scene: '响应导出、分享' },
    ],
    apiProps: [
      { name: 'data', type: 'unknown', defaultValue: '—', description: '结构化数据（对象 / 数组 / 原始值）' },
      { name: 'expandedDepth', type: 'number', defaultValue: '1', description: '默认展开深度（0 全部折叠）' },
      { name: 'copyable', type: 'boolean', defaultValue: 'true', description: '根部是否显示复制按钮' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 大对象先用 expandedDepth=0 给概览，避免首屏渲染整棵树。',
      '- 循环引用 / BigInt 等不可 JSON 序列化的值不支持（复制与摘要基于 JSON 语义）。',
      '- 面向终端用户的信息不要原样倒 JSON（应整理为 Descriptions）。',
    ].join('\n'),
    examplesDo: [
      '调试面板：页面 state 快照折叠检查 + 一键复制。',
      '接口文档：示例响应折叠展示字段结构。',
    ],
    examplesDont: [
      '用 JSONViewer 做业务数据主视图（应使用 Table / Descriptions）。',
      '渲染未脱敏的用户数据（调试信息也需脱敏）。',
    ],
  },
};
