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
};
