/**
 * 反馈分类完整详情（第五批组件，packages/ui 真实实现已核对）。
 * - component.message / component.notification：声明式触发器，apiProps 核对自
 *   packages/ui/src/components/components/Message|Notification/index.tsx，
 *   底层 toast 体系核对自 packages/ui/src/ui/toast.tsx 与
 *   packages/ui/src/components/components/Sonner/index.tsx；
 * - component.popconfirm / component.result / component.loading-overlay /
 *   component.watermark / component.tour：apiProps 与 previewNote 核对自
 *   packages/ui/src/components/components/ 下同名目录的 index.tsx。
 */
import type { ComponentDetailContent } from './component-details.ts';

export const feedbackDetailContents: Record<string, ComponentDetailContent> = {
  'component.message': {
    dsl: {
      "type": "Message",
      "props": {
        "content": "保存成功",
        "variant": "success",
        "duration": 3000
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 操作完成后的全局短时反馈：保存成功、提交失败、网络异常等，用户无需处理即可自动消失。',
      '- 反馈轻量、不打断当前流程（非阻断、瞬时），文案一句话说清结果。',
      '- 在 DSL 中以声明方式触发：把 state 中的反馈文案绑定给 content，赋值即弹出。',
      '',
      '**何时不用**',
      '',
      '- 需要标题 + 正文、停留更久的富通知：使用 Notification。',
      '- 需要持续驻留在内容上下文中的提示：使用 Alert（就地持续展示）。',
      '- 需要用户确认后才能继续的操作：使用 Popconfirm 或 Dialog，Message 无交互。',
      '- 会话界面中的用户 / 助手消息：使用 AI 分类的 ChatMessage——本组件是全局操作反馈，二者不是同一资产。',
    ].join('\n'),
    previewNote:
      '静态结构：Message 是声明式全局短反馈触发器，自身只渲染一个 hidden 标记节点 <div data-slot="message" hidden>（通用 class / style 正常挂载其上）。content 引用变化且为非空字符串时（含首次挂载），经模块级共享 ToastManager 的命令式 toast() 发一条全局 toast——右上角视口（fixed top-4 right-4）弹出带语义色条的卡片（variant 映射 border-l-success / destructive / info / warning），附关闭按钮，按 duration 自动消失。',
    variants: [
      { name: 'info 信息（默认）', visual: 'info 语义色条 toast', scene: '中性操作结果（如「已同步」）；variant 缺省即 info' },
      { name: 'success 成功', visual: 'success 语义色条 toast', scene: '操作成功反馈（保存、提交、创建完成）' },
      { name: 'error 错误', visual: 'destructive 语义色条 toast', scene: '操作失败反馈（提交失败、请求异常）' },
      { name: 'warning 警告', visual: 'warning 语义色条 toast', scene: '需要留意但不阻断的提示（如「部分字段未保存」）' },
    ],
    apiProps: [
      { name: 'content', type: 'string', defaultValue: '—', description: '反馈文案：变为非空字符串时（含首次挂载）发一条全局短 toast；触发语义仅依赖 content 引用，variant / duration 变化不重发' },
      { name: 'variant', type: "'success' | 'error' | 'info' | 'warning'", defaultValue: "'info'", description: '语义类型，映射 toast 语义色条' },
      { name: 'duration', type: 'number', defaultValue: '—', description: '自动关闭时长（ms），透传 toast timeout；0 表示不自动关闭' },
      { name: 'className', type: 'string', defaultValue: '—', description: '通用：标记节点 class' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '通用：标记节点内联样式' },
    ],
    guidelines: [
      '- 页面必须挂载 Sonner（全局 toast 挂载点），Message 发出的 toast 才可见；二者共用模块级 ToastManager。',
      '- 这是与命令式 message / toast 动作并存的声明式触发方式：把「待反馈文案」建模为 state，赋值触发、清空（空串）不触发。',
      '- 触发仅依赖 content 引用变化：相同文案重复赋值（引用不变）不会重发；variant / duration 调整不会补发历史反馈。',
      '- 文案一句话、动词结尾（「保存成功」），不放多行说明或操作按钮；富内容改用 Notification。',
      '- 短时反馈不要承载必须被用户看到的关键信息——duration 过后即消失，关键结果用 Result / Alert 呈现。',
      '- 与 AI 分类 ChatMessage 严格区分：会话消息走 ChatMessage，全局操作反馈走 Message。',
    ].join('\n'),
    examplesDo: [
      '表单提交成功后把 state.feedback 置为「保存成功」并绑定 content，toast 弹出后由表单重置逻辑清空。',
      '请求失败的 catch 分支将错误摘要写入 state，variant=error 弹出失败反馈。',
      '同一页面多处操作复用一个 Message：统一把反馈文案写入同一 state 字段，逐条触发。',
    ],
    examplesDont: [
      '用 Message 展示会话聊天消息（应使用 AI 分类的 ChatMessage）。',
      '把必须确认的删除后果写进 Message（应使用 Popconfirm / Dialog）。',
      '在 content 里拼多行长文或期望用户点击其中的操作（toast 无正文区与交互区，应使用 Notification / Dialog）。',
    ],
  },

  'component.notification': {
    dsl: {
      "type": "Notification",
      "props": {
        "title": "版本更新",
        "description": "v2.4 已发布，包含 12 项改进。",
        "variant": "info",
        "duration": 5000
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 信息更丰富的全局通知：需要标题 + 正文的系统通知、异步任务完成提醒、审核结果。',
      '- 用户稍后看到也能理解上下文的通知（标题概括 + description 补充细节）。',
      '- 在 DSL 中以声明方式触发：把通知标题绑定给 title，赋非空值即弹出。',
      '',
      '**何时不用**',
      '',
      '- 一句话的操作结果反馈：使用 Message（更轻，无标题区）。',
      '- 内容上下文中的持续提示：使用 Alert（就地展示，不自动消失）。',
      '- 需要用户立即处理或确认的事项：使用 Dialog；Notification 只有关闭按钮，无操作区。',
    ].join('\n'),
    previewNote:
      '静态结构：Notification 是声明式全局富通知触发器，自身只渲染 hidden 标记节点 <div data-slot="notification" hidden>。title 引用变化且为非空字符串时（含首次挂载），经命令式 toast() 发一条富通知 toast——右上角视口弹出卡片：标题（font-medium）+ 正文 description（text-muted-foreground）+ 语义色条 + 关闭按钮，按 duration 自动消失。',
    variants: [
      { name: 'info 信息（默认）', visual: 'info 语义色条富通知', scene: '系统通知、一般提醒；variant 缺省即 info' },
      { name: 'success 成功', visual: 'success 语义色条富通知', scene: '异步任务完成（如「报表已生成，可前往下载」）' },
      { name: 'error 错误', visual: 'destructive 语义色条富通知', scene: '后台任务失败，附失败原因说明' },
      { name: 'warning 警告', visual: 'warning 语义色条富通知', scene: '配额将满、配置过期等需留意的提醒' },
    ],
    apiProps: [
      { name: 'title', type: 'string', defaultValue: '—', description: '通知标题：变为非空字符串时（含首次挂载）发一条富通知 toast；触发语义仅依赖 title 引用，description / variant / duration 变化不重发' },
      { name: 'description', type: 'string', defaultValue: '—', description: '通知正文（toast description）' },
      { name: 'variant', type: "'success' | 'error' | 'info' | 'warning'", defaultValue: "'info'", description: '语义类型，映射 toast 语义色条' },
      { name: 'duration', type: 'number', defaultValue: '—', description: '自动关闭时长（ms），透传 toast timeout；0 表示不自动关闭' },
      { name: 'className', type: 'string', defaultValue: '—', description: '通用：标记节点 class' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '通用：标记节点内联样式' },
    ],
    guidelines: [
      '- 页面必须挂载 Sonner（全局 toast 挂载点）后通知才可见；与 Message 共用同一 ToastManager 与右上角视口。',
      '- 声明式触发语义：触发仅依赖 title 引用变化——description / variant / duration 变化不重发，title 不变只改正文不会弹出。',
      '- 标题概括结论（「导入完成」），正文写细节（「成功 120 条，失败 3 条」）；正文放不下的内容用 Dialog。',
      '- 重要且需留存查看的通知（如审批结果）应配合可回访的入口，duration 过后 toast 即消失。',
      '- 高频事件不要逐条弹 Notification：合并为一条汇总（如「3 个任务已完成」），避免并发堆叠刷屏。',
    ].join('\n'),
    examplesDo: [
      '异步导出完成后：title「报表已生成」、description 说明文件与有效期，variant=success。',
      '长任务失败：title「数据同步失败」、description 写失败原因与建议操作，variant=error。',
      '系统维护提醒：title「今晚 23:00 例行维护」，duration 适当延长或置 0 让用户手动关闭。',
    ],
    examplesDont: [
      '一句话成功提示也用 Notification（应使用更轻的 Message）。',
      '在 description 里塞入需要用户勾选 / 确认的操作（应使用 Dialog）。',
      '同一事件循环里连续推送多条通知刷屏（应合并为一条汇总通知）。',
    ],
  },

  'component.popconfirm': {
    dsl: {
      "type": "Popconfirm",
      "props": {
        "title": "删除该条记录？",
        "description": "删除后不可恢复。",
        "danger": true
      },
      "children": [
        {
          "type": "Button",
          "props": {
            "text": "删除",
            "danger": true
          }
        }
      ],
      "events": {
        "onConfirm": {
          "action": "setState",
          "params": {
            "deleted": true
          }
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 就近确认轻量危险操作：删除一行、移除标签等，在触发元素旁弹出，二次确认后立即执行。',
      '- 确认成本低、信息少的场景：标题说清后果，用户一眼可判。',
      '- 列表操作列、卡片角落动作等触发点明确的场景。',
      '',
      '**何时不用**',
      '',
      '- 需要填写信息、展示详细后果说明或多步决策的确认：使用 Dialog（阻断式对话框）。',
      '- 纯信息展示、无需确认：使用 Popover 或 Tooltip。',
      '- 批量 / 不可逆且影响面大的操作：使用 Dialog 并明确列出影响范围，Popconfirm 承载不下。',
    ].join('\n'),
    previewNote:
      '静态结构：基于 vendored Popover——children（触发元素）经 PopoverTrigger 包裹（外层套 trigger 包装节点），点击后在触发元素旁弹出 PopoverContent 卡片：标题区（data-slot="popconfirm-title"，font-medium）+ 说明区（data-slot="popconfirm-description"，text-sm text-muted-foreground）+ 右对齐按钮组（outline 取消 + default 确定，danger 时确定按钮为 destructive）。确认或取消后浮层自动关闭并触发对应事件。',
    variants: [
      { name: '默认确认', visual: '标题（+ 说明）+ 取消 / 确定按钮', scene: '一般性二次确认（如「放弃当前编辑？」）' },
      { name: 'danger 危险确认', visual: '确定按钮为 destructive 危险色', scene: '删除、清空等破坏性操作的二次确认' },
      { name: '仅标题', visual: '省略 description，仅一行标题 + 按钮组', scene: '后果不言自明的轻量确认' },
      { name: '标题 + 说明', visual: '标题下附辅助说明文案', scene: '需要补充后果说明（如「删除后不可恢复」）' },
    ],
    apiProps: [
      { name: 'title', type: 'string', defaultValue: '—', description: '确认框标题' },
      { name: 'description', type: 'string', defaultValue: '—', description: '辅助说明文案' },
      { name: 'confirmText', type: 'string', defaultValue: '—', description: '确认按钮文案；缺省取 i18n pactor.alertDialog.confirm（zh-CN「确定」）' },
      { name: 'cancelText', type: 'string', defaultValue: '—', description: '取消按钮文案；缺省取 i18n pactor.alertDialog.cancel（zh-CN「取消」）' },
      { name: 'danger', type: 'boolean', defaultValue: 'false', description: '确认按钮使用危险色（destructive）' },
      { name: 'onConfirm', type: '() => void', defaultValue: '—', description: '确认事件：点击确认按钮触发，且浮层自动关闭' },
      { name: 'onCancel', type: '() => void', defaultValue: '—', description: '取消事件：点击取消按钮触发，且浮层自动关闭' },
      { name: 'children', type: 'ReactNode', defaultValue: '—', description: '触发元素（DSL 子树，经 Renderer children 机制渲染）' },
      { name: 'className', type: 'string', defaultValue: '—', description: '通用：浮层内容根节点 class（与内置样式合并）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '通用：内联样式（同 className 挂载规则）' },
    ],
    guidelines: [
      '- 确认 / 取消点击后浮层均自动关闭，事件在关闭后触发——不要在 onConfirm 里手动管理浮层开关。',
      '- 危险操作必须 danger=true 让确认按钮呈危险色，标题写清后果（「删除后不可恢复」）。',
      '- 确认文案尽量用动词（「删除」「移出」）代替默认「确定」，让用户不看标题也能预判后果。',
      '- 触发元素用 children 渲染（通常为 Button / 文字链），Popconfirm 自身不提供触发样式。',
      '- 与 Dialog 的边界：只需「是 / 否」二选一、信息一两行说清用 Popconfirm；需要表单、长说明或强阻断用 Dialog。',
    ].join('\n'),
    examplesDo: [
      '列表行内 text「删除」按钮外包 Popconfirm：title「确定删除该条目？」、description「删除后不可恢复」、danger、confirmText「删除」。',
      '编辑器离开页面前：title「放弃未保存的修改？」，确认后丢弃草稿并跳转。',
      '取消订阅场景：confirmText「取消订阅」、cancelText「再想想」，文案即操作本身。',
    ],
    examplesDont: [
      '用 Popconfirm 承载包含表单或多段说明的复杂确认（应使用 Dialog）。',
      '危险操作不设 danger，确认按钮与普通确认无异，用户低估后果。',
      '把 Popconfirm 当 Popover 用，展示纯信息内容而无确认诉求。',
    ],
  },

  'component.result': {
    dsl: {
      "type": "Result",
      "props": {
        "status": "success",
        "title": "提交成功",
        "subTitle": "审批流程已发起，预计 2 小时内完成。"
      },
      "children": [
        {
          "type": "Button",
          "props": {
            "text": "返回列表"
          }
        },
        {
          "type": "Button",
          "props": {
            "text": "查看详情",
            "variant": "primary"
          }
        }
      ]
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 汇总任务最终结果并给出后续操作：提交成功、支付完成、审核通过后的整页 / 区块反馈。',
      '- 流程终结页：404 页面不存在、403 无权限、500 服务异常等 HTTP 错误页。',
      '- 需要明确告诉用户「事情结束了、结果是什么、接下来能做什么」。',
      '',
      '**何时不用**',
      '',
      '- 瞬时操作反馈：使用 Message / Notification，Result 是驻留型结果呈现。',
      '- 空数据占位（无搜索结果的列表、空表格）：使用 Empty——Result 强调任务终局，Empty 强调「本来就没有」。',
      '- 过程进行中的状态：使用 Progress / Spinner / LoadingOverlay。',
    ].join('\n'),
    previewNote:
      '静态结构：根节点 <div data-slot="result" data-status=...> 垂直居中排布（flex flex-col items-center gap-2 py-10 text-center）——图标区（data-slot="result-icon"）：success / error / info / warning 渲染 48px 语义色图标（CircleCheck / CircleX / Info / TriangleAlert），404 / 403 / 500 渲染状态码大字（text-5xl 弱色）；其后依次为标题（data-slot="result-title"，text-lg font-medium）、副标题（data-slot="result-subtitle"，text-sm 弱色）、操作区（data-slot="result-extra"，children，通常为按钮组）。',
    variants: [
      { name: 'success 成功', visual: 'CircleCheck 图标 + success 语义色', scene: '提交 / 支付 / 创建成功的结果页，附「返回列表」「查看详情」操作' },
      { name: 'error 失败', visual: 'CircleX 图标 + destructive 语义色', scene: '任务失败结果页，附「重试」操作' },
      { name: 'info 信息（默认）', visual: 'Info 图标 + info 语义色', scene: '中性结果说明；status 缺省即 info' },
      { name: 'warning 警告', visual: 'TriangleAlert 图标 + warning 语义色', scene: '部分成功 / 有保留条件的结果' },
      { name: '404 页面不存在', visual: '状态码大字（无图标）', scene: '路由未匹配的兜底页，附「返回首页」' },
      { name: '403 无权限', visual: '状态码大字（无图标）', scene: '权限不足的访问拦截页，附「申请权限 / 返回」' },
      { name: '500 服务异常', visual: '状态码大字（无图标）', scene: '服务错误页，附「刷新重试」' },
    ],
    apiProps: [
      { name: 'status', type: "'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500'", defaultValue: "'info'", description: '状态；四态语义渲染图标，HTTP 错误页渲染状态码大字' },
      { name: 'title', type: 'string', defaultValue: '—', description: '标题' },
      { name: 'subTitle', type: 'string', defaultValue: '—', description: '副标题（说明原因 / 补充信息）' },
      { name: 'children', type: 'ReactNode', defaultValue: '—', description: '操作区（DSL 子树，经 Renderer children 机制渲染），通常为按钮组' },
      { name: 'className', type: 'string', defaultValue: '—', description: '通用：根节点 class（与内置样式合并）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '通用：根节点内联样式' },
    ],
    guidelines: [
      '- 标题给结论（「支付成功」），副标题给细节（订单号、失败原因），操作区给下一步（返回 / 重试 / 查看）。',
      '- error / 500 必须提供恢复路径：「重试」或「返回」，不要让用户困在结果页。',
      '- 与 Empty 的边界：任务有明确终局结果用 Result；天然无数据的空态用 Empty。',
      '- 整页使用时放在路由页面级；区块级结果（卡片内任务完成）同样适用，但保持上下留白与居中。',
      '- HTTP 错误页（404 / 403 / 500）用对应 status，不要拿 error 冒充——语义与图标体系不同。',
    ].join('\n'),
    examplesDo: [
      '表单提交成功页：status=success、title「提交成功」、subTitle 附工单号，children 放「查看进度」+「返回列表」。',
      '支付失败页：status=error、subTitle 说明失败原因，children 放「重新支付」（primary）+「取消订单」。',
      '路由兜底：status=404、title「页面不存在」、children 放「返回首页」。',
    ],
    examplesDont: [
      '用 Result 做瞬时保存成功提示（应使用 Message）。',
      'error 结果页无任何操作区，用户无法重试或离开。',
      '用 status=error 渲染 404 页面（应使用专用状态码 status）。',
    ],
  },

  'component.loading-overlay': {
    dsl: {
      "type": "LoadingOverlay",
      "props": {
        "loading": true,
        "text": "正在加载数据…"
      },
      "children": [
        {
          "type": "Table",
          "props": {
            "title": "数据表格"
          }
        }
      ]
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 在页面或区块上覆盖统一加载状态：表格刷新、卡片数据加载期间，遮住内容并阻断区块内操作。',
      '- 加载期间原内容需要保留在原地（遮罩层半透明覆盖，内容不被卸载）。',
      '- 无包裹内容时退化为独立 Spinner + 文案的行内加载指示。',
      '',
      '**何时不用**',
      '',
      '- 紧邻内容的局部「处理中」指示（按钮内、行内小图标）：使用 Spinner，二者不是可随意互换的视觉变体。',
      '- 结构已知的首屏加载：使用 Skeleton 占位，减少布局跳动。',
      '- 有明确进度的长任务：使用 Progress，遮罩不表达完成度。',
      '- 全局页面级跳转加载：LoadingOverlay 只覆盖其包裹的区块，不替代路由级加载方案。',
    ].join('\n'),
    previewNote:
      '静态结构：有 children 时根节点为 relative 容器（data-slot="loading-overlay"）包裹原内容；loading=true 时叠加绝对定位遮罩层（data-slot="loading-overlay-mask"，absolute inset-0 z-10、bg-background/70 半透明），居中 24px Spinner + 可选文案；loading=false 时只渲染 children。无 children 时退化为行内形态：loading=true 渲染 inline-flex 的 16px Spinner + 文案，loading=false 渲染 null。',
    variants: [
      { name: '覆盖区块（有 children）', visual: 'relative 容器 + absolute 半透明遮罩（Spinner 居中）', scene: '表格 / 卡片 / 表单区块加载，阻断区块内交互' },
      { name: '独立加载指示（无 children）', visual: 'inline-flex 的 16px Spinner + 文案；loading=false 时不渲染', scene: '无包裹内容的行内加载提示（如按钮旁的「加载中」）' },
      { name: '带文案', visual: 'Spinner 下方 / 旁侧附 text 说明', scene: '加载耗时较长时说明正在做什么（「正在保存…」）' },
    ],
    apiProps: [
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: '是否处于加载态（显示覆盖层）' },
      { name: 'text', type: 'string', defaultValue: '—', description: '加载提示文案' },
      { name: 'children', type: 'ReactNode', defaultValue: '—', description: '被覆盖区块（DSL 子树，经 Renderer children 机制渲染）' },
      { name: 'className', type: 'string', defaultValue: '—', description: '通用：根节点 class（与内置样式合并）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '通用：根节点内联样式' },
    ],
    guidelines: [
      '- 阻断范围说明：遮罩层以 absolute inset-0 覆盖整个 relative 容器并置顶（z-10），加载期间区块内所有点击被遮罩拦截；Spinner 只是局部指示、不阻断周围交互——按是否需要阻断选择。',
      '- 遮罩只覆盖自身包裹的区块：页面级阻断需包裹整个页面容器，勿误以为其会覆盖全屏。',
      '- loading 绑定数据加载状态（如 dataSource 的 pending），请求结束（成功或失败）都要复位，失败时配合 Message / Alert 给出错误。',
      '- 遮罩无取消入口：长任务需要取消时，在区块内自行提供取消按钮（遮罩半透明，下方按钮不可点，需另行设计）。',
      '- 加载期间内容保留在原地（不被卸载），避免遮罩消失后的布局跳动。',
    ].join('\n'),
    examplesDo: [
      '表格区块外包 LoadingOverlay：loading 绑定查询状态，text「正在加载数据…」，查询中表格不可点。',
      '卡片内图表刷新：loading=true 时图表上覆半透明遮罩，数据返回后原图原位更新。',
      '无包裹内容的行内场景：不包 children，loading 时展示「Spinner + 正在提交…」。',
    ],
    examplesDont: [
      '用 LoadingOverlay 替代按钮内的局部 loading（应使用 Button loading / Spinner，遮罩会阻断整个区块）。',
      '首屏结构已知的加载也用遮罩（应使用 Skeleton，避免白屏闪烁）。',
      '请求失败后 loading 未复位，遮罩永久遮挡内容。',
    ],
  },

  'component.watermark': {
    dsl: {
      "type": "Watermark",
      "props": {
        "content": "Pactor 内部资料",
        "rotate": -22,
        "gap": [
          100,
          100
        ],
        "opacity": 0.15
      },
      "children": [
        {
          "type": "Text",
          "props": {
            "text": "被覆盖的正文内容"
          }
        }
      ]
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 在内容表面添加来源或安全标识：截图溯源（用户名 / 工号）、密级标识（「内部资料」）、预览防盗用。',
      '- 覆盖区域内有可交互内容，水印不能影响点击与选择。',
      '- 多行标识：数组形式纵向排列多行文本（如姓名 + 日期）。',
      '',
      '**何时不用**',
      '',
      '- 单纯的品牌露出或装饰：使用 Logo / Typography，水印语义是来源与安全标识。',
      '- 需要真正防止内容外发的场景：水印仅作视觉提示与事后溯源，不构成访问控制，敏感内容仍需权限与脱敏。',
      '- 打印级精确水印：SVG data-uri 平铺为背景，打印表现受浏览器背景打印设置影响。',
    ].join('\n'),
    previewNote:
      '静态结构：根节点 relative 容器（data-slot="watermark"）包裹 children；content 非空时叠加绝对定位层（data-slot="watermark-layer"，absolute inset-0 z-10、pointer-events-none），其 backgroundImage 为内联 SVG data-uri（14px 黑字、按 rotate 旋转、按 gap 计算平铺单元尺寸，background-repeat: repeat 平铺），文本经 XML 转义；多行 content 纵向排列。content 为空（未给或空串）时不渲染水印层。',
    variants: [
      { name: '单行水印', visual: '单行文本按 -22° 旋转平铺', scene: '用户名 / 密级等单一标识' },
      { name: '多行水印', visual: '字符串数组纵向排列后整体旋转平铺', scene: '姓名 + 日期等复合溯源标识' },
      { name: '自定义密度 / 透明度', visual: 'gap 调整平铺间距、opacity 调整深浅', scene: '密集小字防盗用，或浅淡标识不干扰阅读' },
    ],
    apiProps: [
      { name: 'content', type: 'string | string[]', defaultValue: '—', description: '水印文本：字符串或字符串数组（多行纵向排列）；空值不渲染水印层' },
      { name: 'rotate', type: 'number', defaultValue: '-22', description: '旋转角度' },
      { name: 'gap', type: '[number, number]', defaultValue: '[100, 100]', description: '平铺间距 [水平, 垂直]（px），参与计算平铺单元尺寸' },
      { name: 'opacity', type: 'number', defaultValue: '0.15', description: '文本透明度（0~1）' },
      { name: 'children', type: 'ReactNode', defaultValue: '—', description: '被覆盖内容（DSL 子树，经 Renderer children 机制渲染）' },
      { name: 'className', type: 'string', defaultValue: '—', description: '通用：根节点 class（与内置样式合并）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '通用：根节点内联样式' },
    ],
    guidelines: [
      '- 水印层 pointer-events-none，完全不影响覆盖区内点击、选择与滚动——不要用它做交互拦截。',
      '- 溯源水印内容绑定当前用户身份（姓名 / 工号 + 日期），确保截图可追溯到人。',
      '- 透明度保持默认 0.15 左右：过深干扰阅读，过浅失去溯源威慑；密级标识可适当加深。',
      '- 水印文本经 XML 转义后编码进 SVG data-uri，可安全包含特殊字符；但不展示不可信长文本（平铺无截断，过长会溢出单元）。',
      '- 水印是视觉提示，不替代权限控制与数据脱敏：敏感数据本身仍需按安全章节要求处理。',
    ].join('\n'),
    examplesDo: [
      '敏感报表页外包 Watermark：content=[当前用户姓名, 当天日期]，截图可溯源。',
      '「内部资料」密级标识：单行 content + 默认旋转平铺覆盖文档区。',
      '预览防盗用：缩小 gap、提高密度覆盖整份预览稿。',
    ],
    examplesDont: [
      '指望水印阻止数据外发（仅作提示与溯源，权限与脱敏仍需独立实现）。',
      '用很深的 opacity 铺满正文区，正常阅读被干扰。',
      '把长段不可信文本作为 content（平铺无截断，应使用短标识文本）。',
    ],
  },

  'component.tour': {
    dsl: {
      "type": "Tour",
      "props": {
        "open": true,
        "steps": [
          {
            "target": "#top-nav",
            "title": "全局导航",
            "content": "在这里切换资产库五大分类。"
          },
          {
            "target": "#sidebar",
            "title": "侧边导航",
            "content": "分类内的子菜单与条目数。"
          }
        ]
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 分步骤引导用户认识界面：新用户首次进入、重要改版后的功能导览。',
      '- 步骤不多（3~5 步）、每步聚焦一个界面元素的引导任务。',
      '- 需要用户主动开始 / 可随时关闭的轻引导（右上角关闭按钮 + 遮罩）。',
      '',
      '**何时不用**',
      '',
      '- 单个元素的补充说明：使用 Tooltip / Popover，Tour 是多步流程。',
      '- 强制完成的任务教学或带校验的新手任务：Tour 无阻断校验能力，需自行组合 Dialog 等。',
      '- 常驻帮助文档：使用帮助面板 / 文档页，Tour 是一次性引导。',
    ].join('\n'),
    previewNote:
      '静态结构：open=false 或 steps 为空时渲染 null；开启时经 createPortal 挂到 document.body——半透明遮罩（data-slot="tour-mask"，fixed inset-0 z-[90]）+ 当前步骤卡片（data-slot="tour-card"，fixed z-[100]、宽 w-72）：按当前步骤 target（CSS selector）找到元素后以其 getBoundingClientRect 定位在元素下方（bottom+8 / 左对齐）；选择器无匹配时卡片居中兜底（top/left 50% + translate，不抛错）。卡片内含标题（tour-title）+ 关闭按钮（tour-close，X 图标）+ 正文（tour-content）+ 底部「序号 n / 总数」与按钮组：非首步有 outline「上一步」，主按钮末步为「完成」、其余为「下一步」。',
    variants: [
      { name: '定位步骤', visual: '卡片吸附在 target 元素下方', scene: '指向具体功能入口的导览步骤' },
      { name: '居中步骤（兜底）', visual: 'target 缺省或无匹配时卡片屏幕居中', scene: '开场欢迎 / 收尾总结等无具体锚点的步骤' },
      { name: '受控步骤', visual: 'current 由外部状态控制', scene: '需要与页面状态联动（如跳步、按条件分支）的引导' },
      { name: '非受控步骤（默认）', visual: '内部从 0 开始自维护步骤', scene: '常规线性导览；open 重新置 true 时步骤重置为 0' },
    ],
    apiProps: [
      { name: 'open', type: 'boolean', defaultValue: 'false', description: '是否开启引导；重新开启时非受控步骤重置为 0' },
      { name: 'steps', type: 'TourStep[]', defaultValue: '[]', description: '步骤列表；每步 target（CSS selector，无匹配时卡片居中兜底）+ title + content' },
      { name: 'current', type: 'number', defaultValue: '—', description: '受控步骤序号（缺省内部从 0 开始）；越界时钳制到有效范围' },
      { name: 'onChange', type: '(index: number) => void', defaultValue: '—', description: '步骤切换事件：下一步 / 上一步触发，参数为目标序号' },
      { name: 'onClose', type: '() => void', defaultValue: '—', description: '完成（末步「完成」按钮）与关闭（右上角 X）事件' },
      { name: 'className', type: 'string', defaultValue: '—', description: '通用：步骤卡片 class（与内置样式合并）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '通用：步骤卡片内联样式' },
    ],
    guidelines: [
      '- steps.target 是 CSS selector：给被引导元素加稳定 data-* / id 选择器，不要用易变的类名或层级选择器。',
      '- target 无匹配时卡片居中兜底、不抛错：但应监控兜底发生，及时修正失效选择器。',
      '- 步骤控制在 3~5 步，每步一个焦点元素、一句标题 + 一段短说明；长教学拆成多次或改用帮助文档。',
      '- open 受 state 控制：首次进入置 true，onClose（完成或关闭）时置 false 并记录「已引导」，避免每次进入重复弹出。',
      '- 遮罩覆盖全屏（z-[90]）且卡片置顶（z-[100]）：引导期间页面操作被遮罩拦截，不要在其中要求用户操作被遮住的元素。',
      '- 末步按钮固定为「完成」并触发 onClose：完成与中途关闭走同一事件，需区分时在 state 中记录当前步数。',
    ].join('\n'),
    examplesDo: [
      '新用户导览：首步居中欢迎卡（不设 target），随后逐一定位「新建项目」「邀请成员」入口，末步「完成」。',
      '改版功能导览：open 绑定「未看过该版本引导」标记，onClose 后落库标记。',
      '受控联动：current 绑定 state，onChange 更新，按用户角色跳过管理员专属步骤。',
    ],
    examplesDont: [
      'target 使用 nth-child 等脆弱选择器，页面微调后引导错位（应使用稳定 data 属性）。',
      '超过 7~8 步的长引导一口气弹完（用户流失，应拆分或改帮助文档）。',
      '引导期间要求用户点击被遮罩覆盖的元素（操作被拦截，引导卡死）。',
    ],
  },

  'component.alert': {
    dsl: {
      "type": "Alert",
      "props": {
        "variant": "success",
        "showIcon": true,
        "message": "保存成功",
        "description": "所有更改已同步至云端。"
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 在内容上下文中持续显示提示：表单顶部、区块内的常驻说明，用户需要时它仍在原地（不自动消失）。',
      '- 语义明确的四态提示：success / info / warning / error，用图标与语义色区分轻重。',
      '- 需要标题 + 补充说明的静态提示：message 概括结论，description 展开原因。',
      '',
      '**何时不用**',
      '',
      '- 操作完成后的瞬时反馈：使用 Message（自动消失，不占版面）。',
      '- 需要标题 + 正文、停留更久或可关闭的系统通知：使用 Notification。',
      '- 需要用户确认或处理后才能继续的阻断提示：使用 Dialog；Alert 无交互区。',
      '- 需要用户主动关闭的强提醒：使用 Notification，Alert 只做就地陈述。',
    ].join('\n'),
    previewNote:
      '静态结构：根节点 <div data-slot="alert" role="alert"> 为两列网格（grid-cols-[0_1fr]，带图标时经 has-[>svg] 让出图标列），border + rounded-lg + 语义色边框与文字（success / warning / info 读语义令牌，error 映射 vendored destructive）；message 渲染标题行（data-slot="alert-title"，font-medium），description 渲染说明行（data-slot="alert-description"，text-muted-foreground）；showIcon 或 icon 提供时前置 16px 图标（variant 映射 check-circle / info / warning / x-circle）。',
    variants: [
      { name: 'info 信息（默认）', visual: 'info 图标 + info 语义色边框文字', scene: '中性说明、版本更新提示；variant 缺省即 info' },
      { name: 'success 成功', visual: 'check-circle 图标 + success 语义色', scene: '操作成功后的就地确认（如「保存成功」）' },
      { name: 'warning 警告', visual: 'warning 图标 + warning 语义色', scene: '配额将满、配置即将过期等需留意但不阻断的提示' },
      { name: 'error 错误', visual: 'x-circle 图标 + destructive 语义色', scene: '提交失败、校验不通过等阻断性说明' },
      { name: '仅标题 / 标题 + 说明', visual: '省略 description 仅一行；或 message + description 两行', scene: '一句话提示用仅标题；需要展开原因时补说明' },
      { name: '自定义图标', visual: 'icon 指定 Icon 白名单图标名', scene: '语义需更具体时替代默认四态图标（如「锁」「时钟」）' },
    ],
    apiProps: [
      { name: 'message', type: 'string', defaultValue: '—', description: '提示主文案，渲染为 AlertTitle' },
      { name: 'description', type: 'string', defaultValue: '—', description: '辅助说明文案，渲染为 AlertDescription' },
      { name: 'variant', type: "'success' | 'info' | 'warning' | 'error'", defaultValue: "'info'", description: '语义类型；error 映射 vendored destructive 变体，其余读语义令牌' },
      { name: 'showIcon', type: 'boolean', defaultValue: 'false', description: '是否显示图标；true 时按 variant 显示默认图标（check-circle / info / warning / x-circle）' },
      { name: 'icon', type: 'string', defaultValue: '—', description: '自定义图标名（Icon 白名单，kebab-case / PascalCase 均可）；提供时隐含 showIcon' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 标题写结论、说明写细节：message 一句话说清结果，description 补充原因或下一步。',
      '- 语义色含义固定：error 只用于阻断性问题，warning 用于可继续但需留意，避免同页语义漂移。',
      '- 图标仅强化识别、不替代文案：showIcon 打开时正文不必再写「错误：」之类的冗余前缀。',
      '- Alert 常驻不自动消失：内容已处理完的提示要及时从数据源移除，避免陈旧提示长期占版。',
      '- 与 Message / Notification 的分工：操作反馈用 Message（自动消失），系统通知用 Notification，常驻说明用 Alert。',
    ].join('\n'),
    examplesDo: [
      '表单顶部常驻校验失败说明：variant=error、message「提交失败」、description 列出未通过字段。',
      '配额提醒：variant=warning、message「本月 API 调用已达 90%」，常驻到配额恢复。',
      '页面内版本公告：variant=info、message + description 说明变更内容与影响范围。',
    ],
    examplesDont: [
      '用 Alert 做「保存成功」这类瞬时反馈（Alert 会一直占着版面，应使用 Message）。',
      'error 与 warning 混用表达同一含义，削弱语义色的预警效果。',
      '把需要用户确认的操作写进 Alert（Alert 无按钮与交互，应使用 Popconfirm / Dialog）。',
    ],
  },

  'component.dialog': {
    dsl: {
      "type": "Dialog",
      "props": {
        "title": "编辑成员",
        "description": "修改后将立即生效",
        "trigger": { "type": "Button", "props": { "text": "打开对话框", "variant": "primary" } }
      },
      "children": [
        { "type": "Text", "props": { "text": "在这里放置表单或其他内容子树；关闭（X / 遮罩 / Escape）由组件内部状态自管理。" } }
      ]
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 阻断当前流程以确认或完成任务：删除确认、提交前复核等必须先处理完才能继续的操作。',
      '- 承载需要专注的小型表单或决策：信息量与交互控件有限，一屏内可完成。',
      '- 需要明确的「取消 / 确认」二元出口，且弹层期间背景内容不可操作。',
      '',
      '**何时不用**',
      '',
      '- 只需就近的轻量「是 / 否」确认：使用 Popconfirm（不打断页面上下文）。',
      '- 在保留页面上下文的同时展示大表单 / 长详情：使用 Drawer（侧滑，不完全遮挡内容）。',
      '- 纯信息补充、可随时忽略：使用 Popover（不阻断，点击外部即关）。',
      '- 破坏性操作未经确认就直接执行：破坏性操作必须先经 Dialog 或 Popconfirm 二次确认。',
    ].join('\n'),
    previewNote:
      '静态结构：经 Base UI Dialog 原语渲染——trigger 提供时（非受控用法）以 <span data-slot="dialog-trigger-wrap"> 包装 DSL 子树接入 DialogTrigger，点击打开；弹层经 Portal 挂到 body：遮罩（data-slot="dialog-overlay"，fixed inset-0 z-50、半透明覆盖色）+ 内容面板（data-slot="dialog-content"，fixed 居中、max-w-lg、rounded-lg + 边框 + 阴影，右上角内置 X 关闭按钮，data-slot="dialog-close"）；面板内 title / description 渲染标题区（data-slot="dialog-header" 下的 dialog-title / dialog-description，二者均缺省时不渲染），children 紧随其后。X / 遮罩 / Escape 任一途径关闭都走 onOpenChange(false)：非受控时内部状态自管理，受控时只回调 onClose。',
    variants: [
      { name: '非受控（trigger 触发）', visual: 'trigger DSL 子树（通常 Button）点击打开，关闭由内部状态自管理', scene: '触发器与弹层同处的常规用法' },
      { name: '受控 open', visual: 'open 绑定表达式，关闭时经 onClose 写回', scene: '需与页面状态联动（提交成功、路由变化）时关闭弹层' },
      { name: '仅标题', visual: '省略 description，标题区只有一行', scene: '后果自明的确认（如「确认放弃编辑？」）' },
      { name: '标题 + 说明', visual: 'dialog-title + dialog-description 两行', scene: '需要补充后果说明或操作前提' },
      { name: '无标题区（仅内容）', visual: 'title / description 均缺省，不渲染 header', scene: '内容自带标题的纯内容弹层（如预览、代码片段）' },
    ],
    apiProps: [
      { name: 'title', type: 'string', defaultValue: '—', description: '对话框标题，渲染为 DialogTitle' },
      { name: 'description', type: 'string', defaultValue: '—', description: '辅助说明，渲染为 DialogDescription（与 title 同时缺省时不渲染标题区）' },
      { name: 'open', type: 'boolean', defaultValue: '—', description: '受控开关（可绑 ${state.x} 表达式）；缺省时由 trigger 自管理内部状态' },
      { name: 'onClose', type: '() => void', defaultValue: '—', description: '关闭事件（X / 遮罩 / Escape 任一途径关闭时触发；Renderer 绑定 events.onClose）' },
      { name: 'trigger', type: 'DslNode', defaultValue: '—', description: '触发元素（DSL 子树，非受控用法下点击打开）' },
      { name: 'children', type: 'ReactNode', defaultValue: '—', description: '内容（DSL 子树，经 Renderer children 机制渲染）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：弹层内容根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 破坏性操作必须在 Dialog（或 Popconfirm）中二次确认，确认按钮文案写动词（「删除」）而非默认「确定」。',
      '- 标题写问题（「删除这 3 条记录？」）、说明写后果（「删除后不可恢复」）；正文承载表单时保持一屏内可完成。',
      '- 关闭途径（X / 遮罩 / Escape）都会触发 onClose：受控用法必须在此把 open 写回 false，否则弹层关不掉。',
      '- 同一时刻只保留一个 Dialog：不要在 Dialog 内再叠 Dialog，多步流程改为分步或改用 Drawer。',
      '- 弹层期间背景不可操作：不要把必须参照背景内容才能完成的任务放进 Dialog。',
    ].join('\n'),
    examplesDo: [
      '删除确认：title「删除该成员？」、description 说明后果，trigger 为行内「删除」按钮。',
      '提交前复核：弹层内放表单子树，提交成功后经 onClose 关闭并刷新列表。',
      '受控用法：open 绑定表达式、events.onClose 触发 setState 写回 false，供业务在提交成功时主动关闭。',
    ],
    examplesDont: [
      '用 Dialog 承载需要大量滚动与填写的大表单（应使用 Drawer）。',
      '受控用法只绑 open 而不处理 onClose，导致 X 与 Escape 关不掉。',
      '在 Dialog 内再叠一层 Dialog 做二次确认（层级与焦点混乱，应先关闭再确认）。',
    ],
  },

  'component.drawer': {
    dsl: {
      "type": "Drawer",
      "props": {
        "open": true,
        "title": "订单详情",
        "placement": "right"
      },
      "events": {
        "onClose": {
          "action": "setState",
          "params": {
            "drawerOpen": false
          }
        }
      },
      "children": [
        {
          "type": "Text",
          "props": {
            "text": "抽屉内容：订单号、金额、收货地址等详情字段。"
          }
        }
      ]
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 在保留页面上下文的同时展示扩展任务：查看 / 编辑详情、填写较长的表单、批量操作的参数面板。',
      '- 内容量大需要纵向滚动，或希望用户仍能瞥见背后的列表。',
      '- 需要从固定方向滑出的面板：右侧（默认）详情表单、左侧导航 / 目录、上下次要面板。',
      '',
      '**何时不用**',
      '',
      '- 必须阻断当前流程、确认后才能继续的操作：使用 Dialog（居中模态，注意力更集中）。',
      '- 只需就近的轻量确认：使用 Popconfirm；只需上下文补充内容：使用 Popover。',
      '- 页面级常驻的导航 / 目录：使用布局组件，Drawer 是临时面板。',
    ].join('\n'),
    previewNote:
      '静态结构：经 vaul 原语渲染——根节点为受控 Drawer（open 缺省按 false 处理），弹层经 Portal 挂到 body：遮罩（data-slot="drawer-overlay"，fixed inset-0 z-50、半透明覆盖色）+ 抽屉面板（data-slot="drawer-content"，fixed z-50、bg-popover，按 placement 映射 vaul direction 定位：right / left 贴边全高、宽 3/4 且 sm 以上最大 sm，top / bottom 贴边全宽、max-h-[80vh]），bottom 方向额外渲染顶部拖拽把手（h-2 圆条）；title 提供时渲染头部（data-slot="drawer-header" > data-slot="drawer-title"），其后为内容容器（flex-1 overflow-auto p-4）承载 children。遮罩 / Escape / 拖拽关闭经 onOpenChange(false) 触发 onClose。',
    variants: [
      { name: 'right 右侧（默认）', visual: '右侧贴边全高滑出，宽 3/4（sm 以上最大 sm）', scene: '详情查看、编辑表单等最常见用法' },
      { name: 'left 左侧', visual: '左侧贴边全高滑出', scene: '导航、目录、过滤器面板' },
      { name: 'top 顶部', visual: '顶部贴边全宽滑出，max-h-[80vh]', scene: '顶部工具面板、全局筛选' },
      { name: 'bottom 底部', visual: '底部贴边全宽滑出、max-h-[80vh]、带拖拽把手', scene: '移动端友好（可拖拽关闭）、快捷操作面板' },
      { name: '仅标题 / 无标题', visual: 'title 缺省时不渲染头部，内容直接铺满', scene: '内容自带标题或纯容器场景' },
    ],
    apiProps: [
      { name: 'title', type: 'string', defaultValue: '—', description: '抽屉标题，渲染为 DrawerTitle；缺省时不渲染头部' },
      { name: 'open', type: 'boolean', defaultValue: 'false', description: '受控开关（可绑 ${state.x} 表达式）；缺省按 false 处理，组件无 trigger 属性' },
      { name: 'placement', type: "'left' | 'right' | 'top' | 'bottom'", defaultValue: "'right'", description: '滑出方向，映射 vaul direction' },
      { name: 'onClose', type: '() => void', defaultValue: '—', description: '关闭事件（遮罩 / Escape / 拖拽关闭时触发，仅关闭回调；Renderer 绑定 events.onClose）' },
      { name: 'children', type: 'ReactNode', defaultValue: '—', description: '内容（DSL 子树，经 Renderer children 机制渲染，置于 flex-1 overflow-auto p-4 容器内）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：抽屉内容根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- Drawer 无 trigger 属性：始终受控，open 绑状态表达式并在 onClose 写回 false，否则用户关不掉。',
      '- 方向按任务选：详情 / 表单用 right（默认，符合阅读与操作顺序），导航用 left，移动端次要面板用 bottom。',
      '- 内容容器已自带滚动（flex-1 overflow-auto）：长表单直接纵向排布，不要再嵌套滚动容器。',
      '- 抽屉宽度固定（right / left 为 3/4、sm 以上最大 sm）：放不下的宽表改用整页路由或 Dialog 承载。',
      '- 与 Dialog 的分工：需要用户停下来先处理完用 Dialog；边看列表边补详情用 Drawer。',
    ].join('\n'),
    examplesDo: [
      '列表行「查看详情」：placement=right、title 为对象名，内容纵向排布字段说明。',
      '后台配置面板：placement=left 放导航与过滤器，不遮挡主内容区。',
      '移动端快捷操作：placement=bottom（带拖拽把手），下滑即可关闭。',
    ],
    examplesDont: [
      '用 Drawer 承载必须立即处理的确认（应使用 Dialog，居中模态更能拉回注意力）。',
      '声明了 open 却不处理 onClose，抽屉只能靠刷新页面消失。',
      '在抽屉内再嵌入抽屉或 Dialog 做多层叠加（层级混乱，应先关闭再进入）。',
    ],
  },

  'component.popover': {
    dsl: {
      "type": "Popover",
      "props": {
        "content": { "type": "Text", "props": { "text": "浮层内容：可放任意 DSL 子树，点击外部关闭。" } }
      },
      "children": [{ "type": "Button", "props": { "text": "打开浮层", "variant": "default" } }]
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 在触发对象附近展示补充内容：字段说明、术语解释、快捷设置面板、附带的小表单片段。',
      '- 内容可含交互元素（链接、按钮、少量控件），且需要点击外部才关闭的场景。',
      '- 内容比 Tooltip 长、比 Dialog 轻：无需阻断当前流程。',
      '',
      '**何时不用**',
      '',
      '- 纯短文本说明或不可见标签的补充：使用 Tooltip（hover 触发，更轻且不可交互）。',
      '- 需要用户确认后继续的操作：使用 Popconfirm；需要阻断流程：使用 Dialog。',
      '- 承载大表单或长详情：使用 Drawer / Dialog，固定宽度的浮层放不下。',
    ].join('\n'),
    previewNote:
      '静态结构：经 Base UI Popover 原语渲染——children（触发元素）以 <span data-slot="popover-trigger-wrap"> 包装接入 PopoverTrigger，DSL 子树渲染其中，点击切换浮层；浮层经 Portal + Positioner 定位（side=bottom、align=center、sideOffset=4，默认吸附触发元素下方居中），内容面板 data-slot="popover-content"（w-72、rounded-md + 边框 + 阴影、p-4，data-open / data-closed 驱动淡入缩放动画）；content 为 DSL 子树对象时经 renderChildren 渲染，为字符串时直接渲染文本。点击外部、按 Escape 或再次点击触发元素即关闭。',
    variants: [
      { name: 'DSL 子树内容', visual: 'content 传 DslNode 对象，经 Renderer 渲染', scene: '需要结构化内容或交互控件' },
      { name: '纯文本内容', visual: 'content 传字符串，直接渲染文本', scene: '一段补充说明或术语定义' },
      { name: 'Button 触发', visual: 'children 为 Button 子树（span 包装接入 Trigger）', scene: '「打开浮层」式的显式入口' },
      { name: '文字链 / 图标触发', visual: 'children 为 Link / Icon 等轻量元素', scene: '字段说明、术语解释的就近锚点' },
    ],
    apiProps: [
      { name: 'content', type: 'DslNode | string', defaultValue: '—', description: '浮层内容：DSL 子树对象（经 renderChildren 渲染）或纯文本' },
      { name: 'children', type: 'ReactNode', defaultValue: '—', description: '触发元素（DSL 子树，经 Renderer children 机制渲染，外层以 span 包装接入 Trigger）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：浮层内容根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 触发元素由 children 提供（Button / 文字链 / 图标）：Popover 自身不提供触发样式，需要显式可点击的锚点。',
      '- 浮层宽度固定：只放少量字段或一段说明，超出内容改用 Drawer / Dialog。',
      '- 需要确认的内容不要塞进 Popover：确认语义用 Popconfirm，阻断语义用 Dialog。',
      '- 浮层随点击外部关闭：不要用它承载必须被看到或必须留存的信息。',
      '- 与 Tooltip 的边界：Tooltip 只做 hover 级短说明、不可交互；含交互元素的内容一律用 Popover。',
    ].join('\n'),
    examplesDo: [
      '字段旁的「?」图标触发：content 为 Text，说明该字段的口径与取值范围。',
      '快捷设置面板：content 传 DslNode 子树（少量开关 / 输入），点击外部即收起。',
      '表格单元格内文字链触发：展示该条记录的补充备注。',
    ],
    examplesDont: [
      '用 Popover 承载需要确认的删除操作（应使用 Popconfirm）。',
      'content 塞入长表单或大段图文（固定宽度放不下，应使用 Drawer / Dialog）。',
      '用 Popover 替代 Tooltip 做纯 hover 提示（hover 场景应使用 Tooltip）。',
    ],
  },

  'component.progress': {
    dsl: {
      "type": "Progress",
      "props": {
        "value": 70
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 展示任务完成程度：上传 / 下载、导入导出、批量处理的百分比反馈。',
      '- 有明确总量与已完成量、进度可计算的可控任务，用户据此判断还需等待多久。',
      '- 无法估算进度时用不确定态（value 缺省 / null）表示「处理中但无完成度」。',
      '',
      '**何时不用**',
      '',
      '- 只需表示「紧邻内容正在处理」：使用 Spinner（局部指示，不算完成度）。',
      '- 需要覆盖页面或区块并阻断操作：使用 LoadingOverlay（Spinner + 遮罩）。',
      '- 结构已知的加载占位：使用 Skeleton（比进度条更贴近最终版式）。',
      '- 表达评分 / 指标占比等静态数值：使用 Statistic 或图表，Progress 的语义是任务进度。',
    ].join('\n'),
    previewNote:
      '静态结构：根节点 <div data-slot="progress">（relative w-full）内为轨道 + 指示条——轨道（data-slot="progress-track"，h-2 全宽、rounded-full、bg-(--progress-track) 令牌底色、overflow-hidden）内是指示条（data-slot="progress-indicator"，h-full、bg-(--progress-indicator) 令牌前景色，宽度由 Base UI 按 value 百分比设置并带 width 过渡）。value 经适配器钳制到 0~100；undefined / null / 非有限数透传为不确定态，不显示固定比例。',
    variants: [
      { name: '进行中（0 < value < 100）', visual: '指示条按比例填充', scene: '上传 / 导入等可估算进度的任务' },
      { name: '已完成（value = 100）', visual: '指示条铺满轨道', scene: '任务收尾的完成态展示' },
      { name: '不确定态（value 缺省 / null）', visual: '透传 Base UI 不确定态，不显示固定比例', scene: '处理中但总量未知、无法计算百分比' },
      { name: '边界值钳制', visual: '越界值按 0 / 100 展示', scene: '计算误差导致越界时的兜底（如完成数大于总数）' },
    ],
    apiProps: [
      { name: 'value', type: 'number | null', defaultValue: '—', description: '百分比（0-100，可为表达式解析后的数字）；undefined / null 为不确定态；越界值钳制到 0~100' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 有总量就传 value（按已完成 / 总量计算百分比）；无法估算时用不确定态或改用 Spinner，不要造假进度。',
      '- 进度须真实反映任务状态：绑定数据源的完成量，任务结束（成功或失败）都要停止推进并切换为 Result / Alert 反馈。',
      '- 长任务在进度条旁给出文字说明（「已处理 120 / 300」）与可取消入口，只有条形容器用户无法判断还剩多久。',
      '- 与 Spinner / LoadingOverlay 的分工：进度条表达完成程度，Spinner 表达局部处理中，LoadingOverlay 覆盖区块并阻断操作。',
      '- 配色沿用令牌（--progress-track / --progress-indicator），不要用 Progress 表达评分或指标占比。',
    ].join('\n'),
    examplesDo: [
      '文件上传：value 绑定已上传字节百分比，完成后切换为 Result / Alert 反馈结果。',
      '批量导入：value = 已完成数 / 总数，旁侧附「已处理 120 / 300」文案与取消入口。',
      '无法估算时：不传 value（不确定态），配合文案「正在准备数据…」。',
    ],
    examplesDont: [
      '用定时器推进假进度（进度必须真实反映任务状态）。',
      '首屏结构已知的加载也用 Progress（应使用 Skeleton）。',
      '用 Progress 表达评分或完成度指标（应使用 Statistic 或图表）。',
    ],
  },

  'component.skeleton': {
    dsl: {
      "type": "Skeleton",
      "props": {
        "shape": "line",
        "width": "60%"
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 结构已知时的加载占位：首屏卡片、列表行、详情区，占位形状与最终内容一致以抑制布局跳动。',
      '- 需要预告「这里将出现什么」：头像圆 + 文本行的组合比转圈更能说明版式。',
      '- 内容结构固定、加载耗时不确定的区块（字段固定的详情、行数固定的列表）。',
      '',
      '**何时不用**',
      '',
      '- 局部按钮 / 行内的处理中指示：使用 Spinner，骨架表达的是「这里将出现什么」而非「正在处理」。',
      '- 需要阻断区块交互的加载：使用 LoadingOverlay（遮罩 + Spinner）。',
      '- 确定无数据：使用 Empty——骨架屏会让用户以为还在加载。',
      '- 已知极快的局部刷新（骨架只闪一瞬）：直接留白或不做占位，闪烁比空窗更差。',
    ].join('\n'),
    previewNote:
      '静态结构：根节点 <div data-slot="skeleton">（animate-pulse rounded-md bg-muted，纯 CSS 脉冲）；按 shape 叠加默认尺寸：line 映射 h-4 w-full（文本行）、circle 映射 rounded-full（默认 40×40，头像）、rect 映射 h-24 w-full（矩形块）；width / height 覆盖默认尺寸（数字转 px，字符串按 CSS 长度原样下发）。复杂骨架由多个 Skeleton 自行拼装（如 circle 头像 + 多条 line 文本 + rect 块）。',
    variants: [
      { name: 'line 文本行（默认）', visual: 'h-4 全宽圆角条', scene: '段落、标题行占位' },
      { name: 'circle 圆形', visual: 'rounded-full，默认 40×40', scene: '头像、图标占位' },
      { name: 'rect 矩形', visual: 'h-24 全宽圆角块', scene: '图片、图表、卡片封面占位' },
      { name: '自定义尺寸', visual: 'width / height 覆盖默认值（数字或 CSS 长度）', scene: '与真实内容尺寸对齐，避免加载完成后版式跳动' },
      { name: '组合骨架', visual: '多个 Skeleton 拼装（头像 + 文本行 + 矩形块）', scene: '卡片 / 列表行的整块占位' },
    ],
    apiProps: [
      { name: 'shape', type: "'line' | 'circle' | 'rect'", defaultValue: "'line'", description: '形状；分别映射 h-4 w-full / rounded-full（默认 40×40）/ h-24 w-full 默认尺寸' },
      { name: 'width', type: 'number | string', defaultValue: '—', description: '宽度（px 或 CSS 长度），覆盖 shape 默认值' },
      { name: 'height', type: 'number | string', defaultValue: '—', description: '高度（px 或 CSS 长度），覆盖 shape 默认值' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 骨架形状与最终内容对齐（行列数、圆角、尺寸）：加载完成后布局不跳动，这是它优于 Spinner 的核心。',
      '- 只在结构已知时使用：无法预估内容结构就改用 Spinner / LoadingOverlay，猜错的骨架会误导用户。',
      '- 加载很快的局部刷新不要用骨架：一闪而过的灰块会被感知为页面抖动。',
      '- 组合多个 Skeleton 时按真实版式排布（间距、对齐），并保持与数据态一致的行数上限。',
      '- 数据加载失败要切换到 Result / Alert 并提供重试，不要把错误伪装成 Empty，也不要让骨架无限脉冲。',
    ].join('\n'),
    examplesDo: [
      '列表首屏：每行渲染 circle（头像）+ 两条 line（主副标题），行数与分页大小一致。',
      '详情卡片：rect 占位图表区 + 多行 line 占位字段，形状与最终字段一一对应。',
      '个人资料卡：circle 40×40 头像 + width 「60%」的姓名行 + width 「40%」的副标题行。',
    ],
    examplesDont: [
      '确定无数据仍显示 Skeleton（用户以为还在加载，应使用 Empty）。',
      '加载已知极快的局部刷新也用骨架（闪烁比留白更差）。',
      '骨架形状与真实内容差异过大，加载完成后版式大幅跳变。',
    ],
  },

  'component.spinner': {
    dsl: {
      "type": "Spinner",
      "props": {
        "size": "default"
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 紧邻内容的局部处理中指示：按钮内、输入框后、行内的加载图标，只表示「这里在处理」。',
      '- 加载位置与范围明确（就在图标旁），无需遮挡任何内容、也不阻断周围交互。',
      '- 作为无包裹内容时的独立加载指示：LoadingOverlay 无 children 时同样退化为 Spinner + 文案。',
      '',
      '**何时不用**',
      '',
      '- 需要覆盖页面或区块并阻断操作：使用 LoadingOverlay，二者不是可互换的视觉变体。',
      '- 结构已知的加载占位：使用 Skeleton（减少布局跳动）。',
      '- 有明确进度的长任务：使用 Progress（Spinner 不表达完成度）。',
      '- 全局页面级加载 / 路由切换：Spinner 只做局部指示，不替代路由级加载方案。',
    ].join('\n'),
    previewNote:
      '静态结构：渲染为单个旋转图标 <svg data-slot="spinner" role="status" aria-label="Loading">（lucide Loader2Icon，animate-spin 纯 CSS 旋转，无原语依赖）；size 映射尺寸类：sm → size-3（12px）、default → size-4（16px）、lg → size-6（24px）。颜色继承当前文本色（currentColor），会随所在容器自动适配；无内建文案，需要说明时由调用方在旁侧渲染文本。',
    variants: [
      { name: 'sm 小', visual: 'size-3（12px）旋转图标', scene: '按钮内、行内等紧凑位置' },
      { name: 'default 默认', visual: 'size-4（16px）旋转图标', scene: '常规局部加载指示；size 缺省即 default' },
      { name: 'lg 大', visual: 'size-6（24px）旋转图标', scene: '区块中央、加载遮罩内的加载指示' },
    ],
    apiProps: [
      { name: 'size', type: "'sm' | 'default' | 'lg'", defaultValue: "'default'", description: '尺寸，映射 size-3 / size-4 / size-6' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- Spinner 是局部指示器：不阻断交互、不遮挡内容；需要阻断时用 LoadingOverlay。',
      '- 颜色继承 currentColor：放在按钮或弱化文案中会自动适配，不要写死颜色而破坏主题。',
      '- 只表示「处理中」不表示进度：能估算完成度时改用 Progress。',
      '- 长时间处理要配文案（「正在保存…」）或超时提示，只有转圈用户无法判断是否卡死。',
      '- 同一屏内避免多个 Spinner 同时旋转（按钮内与区块遮罩同时出现），会制造「整页都在等」的错觉。',
    ].join('\n'),
    examplesDo: [
      '按钮内加载：内联 size=sm 的 Spinner + 文案「提交中」，按钮置 disabled。',
      '区块中央加载：size=lg 居中渲染，配合一行「正在加载数据…」。',
      '输入框后置校验中：size=sm 紧贴输入框右侧，不遮蔽输入内容。',
    ],
    examplesDont: [
      '用 Spinner 覆盖内容区块充当加载层（不阻断也不遮挡，应使用 LoadingOverlay）。',
      '有明确百分比的长任务用 Spinner（应使用 Progress）。',
      '首屏结构已知的加载用 Spinner 代替骨架（版式跳动更明显）。',
    ],
  },
};
