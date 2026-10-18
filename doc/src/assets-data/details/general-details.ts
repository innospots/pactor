/**
 * 通用分类完整详情（第九批组件 + 按钮族，packages/ui 真实实现已核对）。
 * - API 属性与 DSL 结构核对自 packages/ui/src/components/components/ 下同名
 *   目录的 index.tsx：Icon / Typography / Link / Separator / Avatar / Badge /
 *   Tooltip；
 * - 运行态预览核对自 doc/src/components/previews/basic-a.tsx（同一文件注册
 *   component.icon / typography / link / separator / avatar / badge / tooltip）；
 *   其中 component.link 的 dsl 直接复用预览文件中的 LINK_NODE 常量。
 * - 按钮族 8 个（ButtonGroup / ActionButton / SplitButton / CopyButton /
 *   IconMorph / ConfirmMorph / FloatingButtonGroup / ExpandingButtonGroup）：
 *   API 属性核对自 packages/ui/src/ui/ 下同名组件源码（扩展按钮组件，
 *   交互设计参考 arc-library，Tailwind 实现）；8 个均已有 DSL 适配器
 *   （packages/ui/src/components/components/ 下同名目录，已注册
 *   builtinComponents），DSL 结构核对自对应适配器；
 *   运行态预览见 doc/src/components/previews/buttons-a.tsx。
 */
import type { ComponentDetailContent } from './component-details.ts';

export const generalDetailContents: Record<string, ComponentDetailContent> = {
  'component.button-group': {
    dsl: {
  "type": "Flex",
  "props": {
    "direction": "vertical",
    "gap": 12
  },
  "children": [
    {
      "type": "ButtonGroup",
      "children": [
        {
          "type": "Button",
          "props": {
            "text": "年"
          }
        },
        {
          "type": "Button",
          "props": {
            "text": "季",
            "variant": "primary"
          }
        },
        {
          "type": "Button",
          "props": {
            "text": "月"
          }
        }
      ]
    },
    {
      "type": "ButtonGroup",
      "children": [
        {
          "type": "Button",
          "props": {
            "text": "左对齐"
          }
        },
        {
          "type": "Button",
          "props": {
            "text": "居中"
          }
        },
        {
          "type": "Button",
          "props": {
            "text": "右对齐"
          }
        }
      ]
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 将语义关联的按钮组合为一个相连表面：对齐方式切换（左 / 中 / 右）、视图切换、主操作 + 关联命令。',
      '- 需要强调「同一组互斥或并列操作」的整体性：相连边框消除按钮间距，视觉上是一个控件。',
      '- 作为 SplitButton 等复合按钮的相连容器：主按钮 + 下拉触发按钮共享同一表面。',
      '',
      '**何时不用**',
      '',
      '- 按钮之间无语义关联：用 Space / Flex 的 gap 并列普通 Button，不必强行相连。',
      '- 单选式切换且需要选中态持久指示：使用 Segmented 或 FloatingButtonGroup（ButtonGroup 不含选中态管理）。',
      '- 需要滑动高亮或悬停展开等动态反馈：使用 FloatingButtonGroup / ExpandingButtonGroup。',
    ].join('\n'),
    previewNote:
      '静态结构：渲染为 <div role="group" data-slot="button-group">（flex w-fit items-stretch）；内部按钮经 [data-slot=button] 选择器去圆角，首尾按钮保留外侧圆角（first:rounded-l-md / last:rounded-r-md），相邻按钮 -ml-px 边框重叠，focus-visible 的按钮提升到 z-10 避免焦点环被裁切；纯样式组合，不接管 children 的行为与状态。DSL 适配器（已注册 builtinComponents）children 为若干 Button 节点，渲染为相连按钮组。',
    variants: [
      { name: '并列命令组', visual: '多个描边按钮相连为单一表面', scene: '对齐切换、视图切换、编辑器等成组命令' },
      { name: '主次组合', visual: '主按钮 + 关联次按钮相连', scene: '「保存」+「另存」、SplitButton 的主按钮 + 下拉触发' },
      { name: '焦点提升', visual: 'focus-visible 按钮 z-10 浮出', scene: '键盘遍历组内按钮时焦点环完整可见' },
    ],
    apiProps: [
      { name: 'children', type: 'DslNode[]', defaultValue: '—', description: '组内按钮（DSL 适配器为若干 Button 节点；ui 层为渲染好的 ReactNode）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 组内按钮必须语义关联（同一对象的并列命令），无关操作不放进来。',
      '- 组内按钮取同一尺寸与相近视觉权重；混用尺寸会破坏相连表面的整齐边缘。',
      '- 相连组最多承载 3–4 个按钮，超过时改用工具栏或 DropdownMenu 收拢。',
      '- ButtonGroup 只管样式组合：选中态、加载态由各 Button 自身属性表达。',
    ].join('\n'),
    examplesDo: [
      '文本编辑器：「左对齐 / 居中 / 右对齐」三个 outline 按钮相连。',
      '统计卡片：「年 / 季 / 月」切换，当前档用 primary 变体突出。',
    ],
    examplesDont: [
      '把无关的「保存」与「删除」相连成组（语义无关，应分开摆放）。',
      '用 ButtonGroup 做需要持久选中指示的单选切换（应使用 Segmented / FloatingButtonGroup）。',
    ],
  },
  'component.action-button': {
    dsl: {
  "type": "Flex",
  "props": {
    "gap": 12,
    "align": "center"
  },
  "children": [
    {
      "type": "ActionButton",
      "props": {
        "icon": "save",
        "label": "保存"
      }
    },
    {
      "type": "ActionButton",
      "props": {
        "icon": "download",
        "label": "导出",
        "variant": "outline"
      }
    },
    {
      "type": "ActionButton",
      "props": {
        "icon": "settings",
        "variant": "ghost",
        "tooltip": "偏好设置"
      }
    },
    {
      "type": "ActionButton",
      "props": {
        "icon": "trash",
        "variant": "ghost",
        "tooltip": "删除"
      }
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 工具栏、表头、卡片角落的紧凑操作入口：icon + 可选短 label，默认 sm 尺寸。',
      '- 纯图标操作且需要提示：tooltip 属性一键包裹现有 Tooltip，悬浮 / 聚焦显示说明。',
      '- 需要与 Button 体系完全同肤的小型动作：variant / size 复用 buttonVariants。',
      '',
      '**何时不用**',
      '',
      '- 表单主操作、流程动作：使用 Button（完整文案与尺寸档位）。',
      '- 一组并列视图切换：使用 FloatingButtonGroup 或 Segmented。',
      '- 需要复制反馈 / 二次确认语义：使用 CopyButton / ConfirmMorph。',
    ].join('\n'),
    previewNote:
      '静态结构：buttonVariants 薄封装——渲染为 <button data-slot="action-button">（Base UI Button 原语），内容 = icon 节点 + 可选 <span>label</span>；size 缺省按内容回退（有 label 为 sm，无 label 为 icon-sm 方形）；tooltip 提供时经 TooltipTrigger render 模式包裹现有 Tooltip（浮层 data-slot="tooltip-content"），根节点仍为按钮本体；icon-only 缺 aria-label 时开发环境告警（不抛错）。',
    variants: [
      { name: '图标 + 文字', visual: 'icon 在前、label 在后，sm 尺寸', scene: '工具栏常规操作（「保存」「导出」）' },
      { name: 'icon-only', visual: 'icon-sm 方形按钮', scene: '密集工具栏、卡片角落、表头操作' },
      { name: '带 tooltip', visual: 'hover / 聚焦浮出反色提示气泡', scene: '纯图标操作的可访问名称与含义说明' },
      { name: 'variant 全档位', visual: '与 buttonVariants 六档一致', scene: 'ghost 用于工具栏低干扰、outline 用于表单区次操作' },
    ],
    apiProps: [
      { name: 'icon', type: 'ReactNode', defaultValue: '—（必填）', description: '图标节点（lucide 图标），恒显' },
      { name: 'label', type: 'ReactNode', defaultValue: '—', description: '可选文字；缺省时渲染 icon-only 方形按钮（size 缺省回退 icon-sm）' },
      { name: 'tooltip', type: 'string', defaultValue: '—', description: '可选提示文案，提供时包裹现有 Tooltip，悬浮 / 聚焦显示' },
      { name: 'variant', type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", defaultValue: "'default'", description: '变体，与 buttonVariants 对齐' },
      { name: 'size', type: "'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'", defaultValue: "有 label 为 'sm'，否则 'icon-sm'", description: '尺寸，与 buttonVariants 对齐' },
      { name: 'aria-label', type: 'string', defaultValue: '—', description: 'icon-only 时必填（缺失开发环境告警，不抛错）' },
      { name: 'onClick / disabled', type: '原生 button 属性', defaultValue: '—', description: '点击回调 / 禁用态' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- DSL 已注册 builtinComponents（`type: "ActionButton"`）：icon 传 Icon 白名单名；icon-only 用法给 tooltip 或 ariaLabel，至少其一作为可访问名称。',
      '- icon-only 必须给 aria-label 或 tooltip，二者至少其一作为可访问名称。',
      '- 工具栏内统一用 ghost 或 outline 一档，不混用多种 variant 造成权重混乱。',
      '- label 不超过 4 个字；需要更长说明时放进 tooltip。',
    ].join('\n'),
    examplesDo: [
      '编辑器工具栏：ActionButton icon={保存图标} tooltip="保存（⌘S）" 的 icon-only 按钮。',
      '卡片头部：icon + label「导出」的 sm outline 按钮。',
    ],
    examplesDont: [
      '用 ActionButton 承载表单提交主操作（应使用 Button）。',
      'icon-only 既无 aria-label 也无 tooltip（读屏用户无法得知含义）。',
    ],
  },
  'component.split-button': {
    dsl: {
  "type": "SplitButton",
  "props": {
    "text": "保存",
    "options": [
      {
        "value": "save-draft",
        "label": "存为草稿",
        "icon": "file-text"
      },
      {
        "value": "save-copy",
        "label": "另存副本",
        "icon": "copy"
      },
      {
        "value": "save-template",
        "label": "存为模板",
        "icon": "bookmark"
      }
    ]
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 一个高频主操作 + 若干低频关联变体：「保存」+「存为草稿 / 另存副本」，主操作一键直达，备选经下拉选择。',
      '- 需要压缩工具栏空间：主操作与备选合并为一个相连表面，避免一排近似按钮。',
      '',
      '**何时不用**',
      '',
      '- 备选操作与主操作无关联：拆开为独立 Button 或 DropdownMenu。',
      '- 备选操作同样高频：并列放置独立按钮，不要藏进下拉。',
      '- 纯单选切换：使用 Segmented / FloatingButtonGroup。',
    ].join('\n'),
    previewNote:
      '静态结构：ButtonGroup（data-slot="split-button"）相连表面 = 主操作 Button + DropdownMenu（chevron 触发按钮，aria-label 默认「更多选项」）；主按钮点击走原生 onClick，下拉复用现有 DropdownMenu（data-slot="dropdown-menu-content"），备选操作经 options 声明为 DropdownMenuItem，选中经 onSelect(value) 语义化抛出并自动关闭菜单；variant / size / disabled 同时作用于两段；className / style 作用于 ButtonGroup 根节点。',
    variants: [
      { name: '默认两段式', visual: '主按钮 + chevron 按钮相连', scene: '「保存」主操作 + 保存变体下拉' },
      { name: '变体与尺寸', visual: '两段同 variant / size（buttonVariants 全档位）', scene: 'primary 主流程、outline 表单区、sm 工具栏' },
      { name: '整体禁用', visual: '两段同步禁用', scene: '前置条件未满足时整个入口置灰' },
      { name: '单项禁用', visual: '下拉中个别选项置灰', scene: '某变体在当前上下文不可用' },
    ],
    apiProps: [
      { name: 'children', type: 'ReactNode', defaultValue: '—', description: '主操作按钮文字' },
      { name: 'options', type: 'SplitButtonOption[]', defaultValue: '—（必填）', description: '备选操作：{ value, label, icon?, disabled? }，选中经 onSelect(value) 抛出' },
      { name: 'onSelect', type: '(value: string) => void', defaultValue: '—', description: '选中备选操作回调，携带 option.value' },
      { name: 'onClick', type: 'MouseEventHandler', defaultValue: '—', description: '主操作按钮原生点击（与 onSelect 互不触发）' },
      { name: 'triggerLabel', type: 'string', defaultValue: "'更多选项'", description: '下拉触发按钮的无障碍名（aria-label）' },
      { name: 'variant / size', type: 'buttonVariants 档位', defaultValue: "'default' / 'default'", description: '同时作用于主按钮与下拉触发按钮' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '整体禁用（两段均不可交互）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：作用于 ButtonGroup 根节点' },
    ],
    guidelines: [
      '- DSL 已注册 builtinComponents（`type: "SplitButton"`）：text 为主按钮文字，options 的 icon 传 Icon 白名单名，onSelect 经 events 接收 `${event}` 语义值。',
      '- 主操作必须是最高频路径；备选操作与主操作同源（如同一保存动作的不同形态）。',
      '- 备选项 2–5 个为宜，更多说明信息架构有问题，应收进独立菜单。',
      '- 主操作与备选共享 loading / 成功反馈语义时，由调用方按 value 分支处理 onSelect。',
    ].join('\n'),
    examplesDo: [
      '编辑器：「保存」主按钮 + 下拉「存为草稿 / 另存副本 / 存为模板」。',
      '列表页：「导出」主按钮 + 下拉「导出 CSV / 导出 Excel」。',
    ],
    examplesDont: [
      '把与主操作无关的命令塞进下拉（应使用独立 DropdownMenu）。',
      '主操作本身需要二次确认却无确认流程（危险操作改用 ConfirmMorph）。',
    ],
  },
  'component.copy-button': {
    dsl: {
  "type": "Flex",
  "props": {
    "gap": 12,
    "align": "center"
  },
  "children": [
    {
      "type": "CopyButton",
      "props": {
        "value": "npm install @pactor-app/ui",
        "label": "复制安装命令"
      }
    },
    {
      "type": "CopyButton",
      "props": {
        "value": "https://pactor-docs.xp-java.workers.dev"
      }
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 复制短值到剪贴板并即时确认：安装命令、分享链接、Token、订单号。',
      '- 需要明确的「已复制」反馈：成功后图标 copy → check 形变 + 可选 copiedLabel 文字，resetDelay 后自动还原。',
      '',
      '**何时不用**',
      '',
      '- 复制大段富文本或需要选择范围：提供文本框让用户自行选择复制。',
      '- 非安全上下文（http）环境：组件会走 onError 失败路径，需调用方给出替代方案。',
    ].join('\n'),
    previewNote:
      '静态结构：Button（data-slot="copy-button"，data-state=idle|copied，默认 variant=outline / size=sm）+ IconMorph（morph=copy-check）；点击 → navigator.clipboard.writeText(value) → 成功进入 copied 态（check 图标 + copiedLabel）→ resetDelay（默认 1500ms）后自动还原 idle；成功触发 onCopy(value)；剪贴板不可用（非安全上下文）或写入 reject 时触发 onError 且不进入 copied 态；重复点击清理旧计时器重新计时。',
    variants: [
      { name: '图标 + 文字', visual: 'copy 图标 + label，复制后 check + copiedLabel', scene: '分享区、安装命令行' },
      { name: 'icon-only', visual: '仅 copy/check 图标形变', scene: '表格行内、代码块角落的紧凑复制入口' },
      { name: '失败路径', visual: '保持 idle 态不切换', scene: '非安全上下文或权限拒绝，经 onError 兜底提示' },
    ],
    apiProps: [
      { name: 'value', type: 'string', defaultValue: '—（必填）', description: '待写入剪贴板的文本' },
      { name: 'label', type: 'ReactNode', defaultValue: '—', description: '初始态可选文字（图标恒显）' },
      { name: 'copiedLabel', type: 'ReactNode', defaultValue: '—', description: 'copied 态可选文字，缺省沿用 label' },
      { name: 'resetDelay', type: 'number', defaultValue: '1500', description: 'copied 态自动还原延迟（ms）' },
      { name: 'onCopy', type: '(value: string) => void', defaultValue: '—', description: '写入成功回调，携带 value' },
      { name: 'onError', type: '(error: unknown) => void', defaultValue: '—', description: '剪贴板不可用 / 写入失败回调（不进入 copied 态）' },
      { name: 'variant / size', type: 'buttonVariants 档位', defaultValue: "'outline' / 'sm'", description: '变体与尺寸，与 buttonVariants 对齐' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- DSL 已注册 builtinComponents（`type: "CopyButton"`）：value 支持状态表达式，onCopy / onError 经 events 绑定动作。',
      '- 必须处理 onError：非安全上下文（http）或权限拒绝时给用户可见反馈，不静默失败。',
      '- value 为敏感信息（Token、密钥）时，copiedLabel 不回显内容本身。',
      '- icon-only 用法补 aria-label（如「复制链接」）。',
    ].join('\n'),
    examplesDo: [
      '安装文档：CopyButton value="npm install @pactor-app/ui" label="复制" copiedLabel="已复制"。',
      '分享弹层：链接文本旁的 icon-only CopyButton，onError 时 toast 提示手动复制。',
    ],
    examplesDont: [
      '不提供 onError，失败时用户误以为已复制。',
      '用 CopyButton 复制整篇文档正文（应提供文本选择区域）。',
    ],
  },
  'component.icon-morph': {
    dsl: {
  "type": "Flex",
  "props": {
    "gap": 12,
    "align": "center"
  },
  "children": [
    {
      "type": "Button",
      "props": {
        "text": "切换状态",
        "size": "small"
      },
      "events": {
        "onClick": {
          "action": "setState",
          "params": {
            "morph": "${state.morph == 'a' ? 'b' : 'a'}"
          }
        }
      }
    },
    {
      "type": "IconMorph",
      "props": {
        "morph": "menu-close",
        "state": "${state.morph}"
      }
    },
    {
      "type": "IconMorph",
      "props": {
        "morph": "play-pause",
        "state": "${state.morph}"
      }
    },
    {
      "type": "IconMorph",
      "props": {
        "morph": "plus-minus",
        "state": "${state.morph}"
      }
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 同一入口的两个互斥状态用图标形变表达：菜单开合（menu-close）、播放暂停（play-pause）、复制确认（copy-check）、展开收起（plus-minus）。',
      '- 需要在同一挂载点内完成过渡（不卸载重建），保持视觉连续性。',
      '',
      '**何时不用**',
      '',
      '- 静态语义图标：使用 Icon（无形变开销）。',
      '- 两个以上状态轮转：IconMorph 只有 a / b 两态，多态用条件渲染 Icon。',
    ].join('\n'),
    previewNote:
      '静态结构：渲染为 <span data-slot="icon-morph" data-state=a|b>（relative inline-flex size-4），双图层绝对定位堆叠两个 lucide 图标（aria-hidden，纯装饰）；受控 state 切换时一层 rotate±90 + scale-50 + fade 出、另一层入（transition-all duration-200，motion-reduce 降级为无过渡直切）；morph 查 MORPH_PAIRS 白名单（menu-close / play-pause / copy-check / plus-minus），未知名渲染 CircleQuestionMark 占位（data-unknown）并开发环境告警，不抛错。',
    variants: [
      { name: 'menu-close', visual: 'Menu ↔ X', scene: '导航抽屉开合、菜单展开收起' },
      { name: 'play-pause', visual: 'Play ↔ Pause', scene: '媒体播放控制' },
      { name: 'copy-check', visual: 'Copy ↔ Check', scene: 'CopyButton 的复制确认反馈' },
      { name: 'plus-minus', visual: 'Plus ↔ Minus', scene: '折叠面板开合、数量增减切换' },
      { name: '未知名占位', visual: 'help-circle 占位 + data-unknown', scene: '开发期发现未登记 morph 名' },
    ],
    apiProps: [
      { name: 'morph', type: "'menu-close' | 'play-pause' | 'copy-check' | 'plus-minus'", defaultValue: '—（必填）', description: '预设图标对名（MORPH_PAIRS 白名单）；未知名渲染占位图标并 dev 告警' },
      { name: 'state', type: "'a' | 'b'", defaultValue: '—（必填）', description: "受控状态：'a' 显示对中首图标，'b' 显示次图标" },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（尺寸经 size-* 覆盖）' },
    ],
    guidelines: [
      '- DSL 已注册 builtinComponents（`type: "IconMorph"`）：state 用状态表达式绑定（如 `${state.open ? "a" : "b"}`）。',
      '- state 由父组件受控驱动（如菜单 open 态），组件自身不管理切换。',
      '- 图标对语义必须互斥且可逆（开 / 关、播放 / 暂停），不用于表达进度或流程。',
      '- 需要新增图标对时在 MORPH_PAIRS 登记（静态导入 lucide，可 tree-shake）。',
    ].join('\n'),
    examplesDo: [
      '侧边栏开关：ActionButton 内嵌 IconMorph morph="menu-close" state={open ? "b" : "a"}。',
      '音频卡片：播放中 state="b" 显示 Pause，暂停回 "a"。',
    ],
    examplesDont: [
      '用 IconMorph 表达三种以上状态（应条件渲染 Icon）。',
      '依赖未登记的 morph 名（静默落为占位问号图标）。',
    ],
  },
  'component.confirm-morph': {
    dsl: {
  "type": "Flex",
  "props": {
    "gap": 12,
    "align": "center"
  },
  "children": [
    {
      "type": "ConfirmMorph",
      "props": {
        "label": "删除",
        "confirmLabel": "确认删除",
        "successLabel": "已删除"
      }
    },
    {
      "type": "ConfirmMorph",
      "props": {
        "label": "清空",
        "confirmLabel": "确认清空",
        "variant": "outline"
      }
    }
  ]
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 破坏性操作的轻量二次确认：删除、清空、撤销发布，不想打断流程弹 Dialog。',
      '- 确认后需要执行异步任务并给出结果反馈：onConfirm 返回 Promise 时自动 pending → success / error，error 可原地撤销回 idle。',
      '',
      '**何时不用**',
      '',
      '- 确认需要说明后果详情或附带输入：使用 Dialog / Popconfirm（ConfirmMorph 只有按钮内一行文案）。',
      '- 批量、不可逆且高损失操作：按钮内确认强度不足，应使用 Dialog。',
    ].join('\n'),
    previewNote:
      '静态结构：Button（data-slot="confirm-morph"，data-state=idle|confirming|pending|success|error）内五段内容（idle=label / confirming=confirmLabel，默认 destructive 变体 / pending=Spinner / success=Check+successLabel / error=RotateCcw+undoLabel）在同一 grid 单元堆叠（col-start-1 row-start-1），非激活段 opacity-0 + aria-hidden，宽度恒等于最宽段，状态切换无布局跳动；状态机：idle 点击进入 confirming（confirmTimeout 默认 3000ms 超时回 idle）→ 确认后 onConfirm 返回 Promise 则 pending（resolve→success、reject→error），非 Promise 直接 success；success 停留 resetDelay（默认 1500ms）回 idle；error 段点击即撤销（onUndo）回 idle；带代际标记，超时回退后迟到的 resolve 不会回写状态。',
    variants: [
      { name: 'idle 初始', visual: '普通按钮（variant 可控）', scene: '「删除」「清空」入口常态' },
      { name: 'confirming 待确认', visual: 'destructive 变体 + confirmLabel', scene: '首次点击后的原地确认段，超时自动回退' },
      { name: 'pending 执行中', visual: 'Spinner + 可选 pendingLabel，不可交互', scene: 'onConfirm 异步执行期间' },
      { name: 'success / error', visual: 'Check+已完成 / RotateCcw+撤销', scene: '执行结果反馈；error 点击撤销回 idle' },
    ],
    apiProps: [
      { name: 'label', type: 'ReactNode', defaultValue: '—（必填）', description: 'idle 段文字' },
      { name: 'confirmLabel', type: 'ReactNode', defaultValue: "'确认'", description: 'confirming 段文字' },
      { name: 'pendingLabel', type: 'ReactNode', defaultValue: '—', description: 'pending 段可选文字（Spinner 恒显）' },
      { name: 'successLabel', type: 'ReactNode', defaultValue: "'已完成'", description: 'success 段文字' },
      { name: 'undoLabel', type: 'ReactNode', defaultValue: "'撤销'", description: 'error 段撤销操作文字' },
      { name: 'confirmVariant', type: 'buttonVariants variant', defaultValue: "'destructive'", description: 'confirming 段按钮变体' },
      { name: 'confirmTimeout', type: 'number', defaultValue: '3000', description: 'confirming 超时未确认自动回 idle 的时长（ms）' },
      { name: 'resetDelay', type: 'number', defaultValue: '1500', description: 'success 段停留时长（ms），随后回 idle' },
      { name: 'onConfirm', type: '() => void | Promise<unknown>', defaultValue: '—', description: '确认回调：返回 Promise 时自动 pending，resolve→success、reject→error' },
      { name: 'onUndo', type: '() => void', defaultValue: '—', description: 'error 段撤销回调（点击 error 段按钮触发，随后回 idle）' },
      { name: 'onStateChange', type: '(state: ConfirmMorphState) => void', defaultValue: '—', description: '状态流转回调（idle / confirming / pending / success / error）' },
      { name: 'variant / size', type: 'buttonVariants 档位', defaultValue: "'default' / 'default'", description: 'idle / pending / success 段的变体与尺寸' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- DSL 已注册 builtinComponents（`type: "ConfirmMorph"`）：onConfirm / onUndo 经 events 绑定动作；events 路径确认后直接 success（pending 的 Promise 流转为 ui 层直用能力）。',
      '- confirmLabel 写明动作与后果（「确认删除」），不用裸「确定」。',
      '- onConfirm 返回 Promise 才有 pending / error 语义；同步回调视为立即成功。',
      '- error 撤销（onUndo）只负责回退 UI 状态，业务回滚由调用方自行处理。',
      '- 各段文案长度接近，避免最宽段撑起过宽按钮（宽度取最宽段恒定）。',
    ].join('\n'),
    examplesDo: [
      '列表行内：「删除」→ 点击变 destructive「确认删除」→ onConfirm 调接口 → success「已完成」。',
      '清空回收站：confirmLabel="确认清空"，onConfirm 失败进 error，点击「撤销」回 idle。',
    ],
    examplesDont: [
      '用 ConfirmMorph 承载需要阅读后果说明的高危操作（应使用 Dialog）。',
      'onConfirm 同步返回但仍需表达执行中（应返回 Promise 进入 pending）。',
    ],
  },
  'component.floating-button-group': {
    dsl: {
  "type": "FloatingButtonGroup",
  "props": {
    "value": "${state.view}",
    "options": [
      {
        "value": "list",
        "label": "列表",
        "icon": "list"
      },
      {
        "value": "grid",
        "label": "网格",
        "icon": "grid"
      },
      {
        "value": "chart",
        "label": "图表",
        "icon": "chart"
      }
    ]
  },
  "events": {
    "onSelect": {
      "action": "setState",
      "params": {
        "view": "${event}"
      }
    }
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 托盘式并列切换：列表 / 网格视图、日 / 周 / 月时间粒度、看板模式切换。',
      '- 需要指针滑动高亮的探索感：共享高亮块在 hover 与键盘聚焦的按钮间平滑滑动，受控 value 时恒定指示当前项。',
      '',
      '**何时不用**',
      '',
      '- 表单内单选录入：使用 RadioGroup / Segmented（FloatingButtonGroup 不挂表单语义）。',
      '- 导航页签：使用 Tabs / NavigationMenu。',
    ].join('\n'),
    previewNote:
      '静态结构：托盘容器 <div role="group" data-slot="floating-button-group">（relative inline-flex rounded-full bg-muted p-1）内渲染独立按钮（data-slot="floating-button-group-item"，受控项标 data-active）+ 绝对定位共享高亮块（data-slot="floating-button-group-highlight"，rounded-full bg-card shadow-sm）；高亮块经 ref 测量目标按钮 offsetLeft / offsetWidth，以 transform / width 过渡（duration-200，motion-reduce 降级）在 hover 与 :focus-visible 按钮间滑动，离开组后淡出；受控 value 提供时高亮恒定位于该项；测量为 0（jsdom / 未挂载）时防御跳过不抛错；按钮 active:scale-95 原地按下。',
    variants: [
      { name: '悬停跟随', visual: '高亮块随指针在按钮间滑动', scene: '未受控时的预览式探索' },
      { name: '受控当前项', visual: '高亮恒定位于 value 项', scene: '视图模式、时间粒度的当前选中指示' },
      { name: '键盘可达', visual: ':focus-visible 同样牵引高亮', scene: '键盘 Tab 遍历组内按钮' },
    ],
    apiProps: [
      { name: 'options', type: 'FloatingButtonGroupOption[]', defaultValue: '—（必填）', description: '选项：{ value, label?, icon?, disabled? }' },
      { name: 'value', type: 'string', defaultValue: '—', description: '受控当前项：提供时共享高亮块恒定位于该项' },
      { name: 'onSelect', type: '(value: string) => void', defaultValue: '—', description: '点击选项回调，携带 option.value' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- DSL 已注册 builtinComponents（`type: "FloatingButtonGroup"`）：value 受控可用状态表达式绑定，onSelect 经 events 接收 `${event}` 语义值。',
      '- 选项 2–5 个、label 极短（或纯 icon + aria 语义），托盘宽度随行内内容自适应。',
      '- 受控用法（value + onSelect）是推荐形态：选中结果由调用方持有，组件只做指示。',
      '- 纯 icon 选项补可访问名称（label 缺省时经 aria 属性或外围 Tooltip）。',
    ].join('\n'),
    examplesDo: [
      '资产列表：「列表 / 网格 / 图表」三档切换，value 受控于页面 state。',
      '统计页：「日 / 周 / 月」粒度托盘，悬停预览高亮、点击落定。',
    ],
    examplesDont: [
      '把 FloatingButtonGroup 当表单单选控件提交（应使用 RadioGroup）。',
      '选项超过 6 个导致托盘过宽（应改用 Tabs 或 Select）。',
    ],
  },
  'component.expanding-button-group': {
    dsl: {
  "type": "ExpandingButtonGroup",
  "props": {
    "options": [
      {
        "value": "edit",
        "label": "编辑",
        "icon": "pencil"
      },
      {
        "value": "share",
        "label": "分享",
        "icon": "share"
      },
      {
        "value": "download",
        "label": "下载",
        "icon": "download"
      },
      {
        "value": "delete",
        "label": "删除",
        "icon": "trash",
        "confirm": true,
        "confirmLabel": "确认删除"
      }
    ]
  }
},
    whenToUse: [
      '**何时使用**',
      '',
      '- 空间紧凑但需要可发现性的操作组：卡片角落、列表行尾，常态只显图标，hover / 聚焦原地展开 label。',
      '- 组内含个别危险操作：选项声明 confirm 后首点击进入原地确认态，再次点击才触发回调。',
      '',
      '**何时不用**',
      '',
      '- 空间充足：直接显示 icon + label 的普通按钮组，不必依赖悬停。',
      '- 触屏为主的场景：无悬停态，展开依赖聚焦，关键操作应直接可见。',
    ].join('\n'),
    previewNote:
      '静态结构：<div role="group" data-slot="expanding-button-group"> 内渲染原生 button（data-slot="expanding-button-group-item"），icon 恒显、label 包在 grid 容器内经 grid-template-columns 0fr→1fr 过渡展开（duration-200，motion-reduce 降级），邻位按钮保持图标态自然让位；展开项标 data-expanded；声明 confirm 的选项首点击进入确认态（data-confirming，destructive 底色，label 换为 confirmLabel / 默认「确认」），再次点击 onSelect(value) 恰好一次，移出 / 失焦取消确认态；按钮为原生 button，键盘可达（聚焦同样展开）。',
    variants: [
      { name: '悬停展开', visual: '图标按钮原地拉宽显示 label', scene: '卡片角落「编辑 / 分享 / 删除」操作组' },
      { name: '原地确认', visual: 'confirm 选项变 destructive + 确认文案', scene: '组内危险操作的轻量二次确认' },
      { name: '键盘展开', visual: '聚焦按钮同样展开 label', scene: '键盘遍历操作组' },
    ],
    apiProps: [
      { name: 'options', type: 'ExpandingButtonGroupOption[]', defaultValue: '—（必填）', description: '选项：{ value, label, icon, confirm?, confirmLabel?, disabled? }；confirm 选项需二次点击' },
      { name: 'onSelect', type: '(value: string) => void', defaultValue: '—', description: '选中回调（confirm 选项二次点击后触发），携带 option.value' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- DSL 已注册 builtinComponents（`type: "ExpandingButtonGroup"`）：confirm 选项的二次点击由组件状态机承载，onSelect 经 events 接收语义值。',
      '- 组内 2–4 个选项为宜；label 2–4 字，避免展开时整组让位幅度过大。',
      '- 危险操作必须声明 confirm（如「删除」），普通操作保持单次点击直达。',
      '- 图标本身要能区分（不堆叠近似图形），因为常态只有图标可见。',
    ].join('\n'),
    examplesDo: [
      '文档卡片：「编辑 / 分享 / 删除」图标组，删除项 confirm: true。',
      '列表行尾：hover 行后出现的紧凑操作组，聚焦同样可展开。',
    ],
    examplesDont: [
      '把唯一主操作藏进 ExpandingButtonGroup（主操作应直接可见）。',
      '触屏页面依赖悬停展开表达关键操作含义。',
    ],
  },
  'component.icon': {
    dsl: {
  "type": "Flex",
  "props": {
    "gap": 12,
    "align": "center"
  },
  "children": [
    {
      "type": "Icon",
      "props": {
        "name": "search",
        "size": "small"
      }
    },
    {
      "type": "Icon",
      "props": {
        "name": "settings"
      }
    },
    {
      "type": "Icon",
      "props": {
        "name": "heart",
        "size": "large",
        "color": "#e0245e"
      }
    },
    {
      "type": "Icon",
      "props": {
        "name": "download",
        "size": 28,
        "color": "#1677ff"
      }
    }
  ]
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
  "type": "Flex",
  "props": {
    "direction": "vertical",
    "gap": 12
  },
  "children": [
    {
      "type": "Typography",
      "props": {
        "variant": "h3",
        "text": "三级标题 H3"
      }
    },
    {
      "type": "Typography",
      "props": {
        "variant": "p",
        "text": "正文段落：用于常规阅读文本，行高宽松。"
      }
    },
    {
      "type": "Typography",
      "props": {
        "variant": "muted",
        "text": "弱化文本：用于辅助说明与次要信息。"
      }
    },
    {
      "type": "Typography",
      "props": {
        "variant": "inline-code",
        "text": "const total = 95"
      }
    }
  ]
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
  "type": "Flex",
  "props": {
    "gap": 16
  },
  "children": [
    {
      "type": "Link",
      "props": {
        "href": "/components",
        "text": "站内链接（SPA 导航）"
      }
    },
    {
      "type": "Link",
      "props": {
        "href": "https://example.com",
        "text": "外部链接（新窗口）",
        "target": "_blank"
      }
    }
  ]
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
  "type": "Flex",
  "props": {
    "direction": "vertical",
    "gap": 12
  },
  "children": [
    {
      "type": "Typography",
      "props": {
        "variant": "p",
        "text": "上方内容区块"
      }
    },
    {
      "type": "Separator"
    },
    {
      "type": "Flex",
      "props": {
        "gap": 12,
        "align": "center"
      },
      "children": [
        {
          "type": "Typography",
          "props": {
            "variant": "p",
            "text": "条目一"
          }
        },
        {
          "type": "Separator",
          "props": {
            "orientation": "vertical"
          }
        },
        {
          "type": "Typography",
          "props": {
            "variant": "p",
            "text": "条目二"
          }
        },
        {
          "type": "Separator",
          "props": {
            "orientation": "vertical"
          }
        },
        {
          "type": "Typography",
          "props": {
            "variant": "p",
            "text": "条目三"
          }
        }
      ]
    }
  ]
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
  "type": "Flex",
  "props": {
    "gap": 12,
    "align": "center"
  },
  "children": [
    {
      "type": "Avatar",
      "props": {
        "src": "https://i.pravatar.cc/64",
        "alt": "用户头像"
      }
    },
    {
      "type": "Avatar",
      "props": {
        "src": "https://i.pravatar.cc/64?img=5",
        "alt": "成员头像"
      }
    },
    {
      "type": "Avatar",
      "props": {
        "fallback": "张"
      }
    }
  ]
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
  "type": "Flex",
  "props": {
    "gap": 12,
    "align": "center"
  },
  "children": [
    {
      "type": "Badge",
      "props": {
        "text": "默认"
      }
    },
    {
      "type": "Badge",
      "props": {
        "text": "次要",
        "variant": "secondary"
      }
    },
    {
      "type": "Badge",
      "props": {
        "text": "危险",
        "variant": "destructive"
      }
    },
    {
      "type": "Badge",
      "props": {
        "text": "描边",
        "variant": "outline"
      }
    }
  ]
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
