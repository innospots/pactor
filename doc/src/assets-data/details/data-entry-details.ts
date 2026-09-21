/**
 * 数据录入分类完整详情（第五批组件，packages/ui 真实实现已核对）。
 * API 属性逐一提炼自 packages/ui 各适配器源码：
 * - component.rate：packages/ui/src/components/components/Rate/index.tsx
 * - component.time-picker：packages/ui/src/components/components/TimePicker/index.tsx
 * - component.color-picker：packages/ui/src/components/components/ColorPicker/index.tsx
 * - component.upload：packages/ui/src/components/components/Upload/index.tsx
 * - component.tree-select：packages/ui/src/components/components/TreeSelect/index.tsx
 * - component.cascader：packages/ui/src/components/components/Cascader/index.tsx
 * - component.transfer：packages/ui/src/components/components/Transfer/index.tsx
 * - component.mentions：packages/ui/src/components/components/Mentions/index.tsx
 * 全部组件支持 Form 集成（Form 内声明 name 自动成为表单项，经 FieldShell 呈现
 * label 与校验错误）；事件均传出 DSL 语义值（可序列化基本类型）。
 */
import type { ComponentDetailContent } from './component-details.ts';

export const dataEntryDetailContents: Record<string, ComponentDetailContent> = {
  'component.rate': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 输入用户对内容、商品、服务的满意度或质量评分（如 1-5 星）。',
      '- 评论、反馈表单中的轻量评分字段；精度要求不高、强调直观表达。',
      '- 半星精度场景（allowHalf）满足更细的评分粒度。',
      '',
      '**何时不用**',
      '',
      '- 精确数值输入或大范围连续取值：使用 NumberInput 或 Slider——Rate 语义是「评分」，值域小且离散。',
      '- 单纯展示评分结果（不允许修改）：使用数据展示组件渲染，不要把 Rate 只读使用。',
      '- 二元的好 / 不好反馈：使用 RadioGroup 或 Switch 更直白。',
    ].join('\n'),
    previewNote:
      '静态结构：Rate 渲染为 data-slot="rate" 的 radiogroup 容器，内部每星为 data-slot="rate-star" 节点——lucide Star 图标叠加透明 button 点击区（allowHalf 时拆为左 / 右两个半区，分别得 x.5 与整数）；选中星以 warning 色填充，半星以左半裁剪层呈现。Form 内声明 name 时外层包 FieldShell（label + 校验错误），控件本体为内联星组。',
    variants: [
      { name: '整数评分（缺省）', visual: 'count 颗星，点击整星得整数分', scene: '常规 1-5 星满意度评价' },
      { name: 'allowHalf 半星', visual: '每星拆左 / 右两个点击区，可出现半星填充', scene: '需要 0.5 步进精度的评分（如课程、酒店）' },
      { name: 'count 自定义星数', visual: '星数按 count 渲染，缺省 5', scene: '非 5 档评分体系（如 10 分制拆 10 星）' },
      { name: 'disabled 禁用', visual: '星组半透明，点击区禁用', scene: '历史评分回显、无权限修改' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（FieldShell 呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'value', type: 'number', defaultValue: '—', description: '受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues）' },
      { name: 'count', type: 'number', defaultValue: '5', description: '星总数' },
      { name: 'allowHalf', type: 'boolean', defaultValue: 'false', description: '允许半星：点击星左半得 x.5，右半得整数' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用，星组半透明且不可点击' },
      { name: 'onChange', type: '(value: number) => void', defaultValue: '—', description: '评分变化事件，传出 number（DSL 语义值）' },
      { name: 'className', type: 'string', defaultValue: '—', description: '根节点 class（Form 内为 form-item 容器，独立渲染时为控件本身）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '根节点内联样式（同 className 的挂载规则）' },
    ],
    guidelines: [
      '- 评分值域保持小而离散；count 缺省 5，非必要不改动，避免与常见 5 星心智冲突。',
      '- 需要 0.5 步进再开 allowHalf；开了就不要在展示层四舍五入成整数。',
      '- Form 内声明 name 后配合 rules 做必填校验（如评价提交必须打分）。',
      '- onChange 传出 number；半星场景值为 x.5，落库字段需支持小数。',
      '- 不用 Rate 做只读展示：展示场景禁用交互语义，避免用户误以为可改。',
    ].join('\n'),
    examplesDo: [
      '评价表单：Rate 声明 name 与必填 rules，提交时校验「请打分」。',
      '酒店评分：allowHalf 开启，用户可打 4.5 分，onChange 传出 4.5。',
      '只读回显：disabled 渲染历史评分，配合文字「4.5 分」辅助说明。',
    ],
    examplesDont: [
      '用 Rate 录入价格、数量等精确数值（应使用 NumberInput / Slider）。',
      '把 Rate 当展示组件长期 disabled 使用，用户反复点击无响应。',
      'allowHalf 评分落库到整数字段，0.5 分被静默截断。',
    ],
  },

  'component.time-picker': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 录入一天内的时间点：营业时间、预约时段、定时任务的执行时刻。',
      '- format 为 HH:mm 时只需到分钟精度；含秒场景使用缺省 HH:mm:ss。',
      '',
      '**何时不用**',
      '',
      '- 选择日期或日期 + 时间：使用 DatePicker；TimePicker 不含日期维度。',
      '- 选择时间区间（开始 - 结束）：当前实现为单时间点，区间用两个 TimePicker 字段或等待区间组件。',
      '- 相对时长（如「30 分钟后」）：使用 NumberInput + 单位说明。',
    ].join('\n'),
    previewNote:
      '静态结构：TimePicker 为 input 风格触发器（data-slot="timepicker-trigger"，右侧 Clock 图标）+ 受控 Popover 弹层（data-slot="timepicker-panel"）；弹层内为时 / 分（/秒）三列滚动列表（data-slot 分别为 timepicker-hour-column / timepicker-minute-column / timepicker-second-column，format 为 HH:mm 时无秒列），列内点选更新待选值；底部操作行左侧「此刻」（取当前时间）、右侧「确定」（提交并关闭）。Form 内声明 name 时外层包 FieldShell（label + 校验错误）。',
    variants: [
      { name: 'HH:mm:ss 含秒（缺省）', visual: '时 / 分 / 秒三列，值形如 13:45:00', scene: '需要秒级精度的时刻（定时任务、日志时间）' },
      { name: 'HH:mm 无秒', visual: '时 / 分两列，值形如 13:45', scene: '常规业务时刻（营业时间、预约）' },
      { name: 'placeholder 空态', visual: '未选时触发器显示弱提示（缺省「请选择时间」）', scene: '非必填时间字段' },
      { name: 'disabled 禁用', visual: '触发器半透明不可点开', scene: '联动未就绪或只读场景' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（FieldShell 呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'value', type: 'string', defaultValue: '—', description: '受控值（时间字符串，如 "13:45:00"）；Form 内作为字段初始值' },
      { name: 'format', type: "'HH:mm:ss' | 'HH:mm'", defaultValue: "'HH:mm:ss'", description: '输出格式；HH:mm 时弹层无秒列、值无秒' },
      { name: 'placeholder', type: 'string', defaultValue: "'请选择时间'", description: '空态提示文案' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用触发器' },
      { name: 'onChange', type: '(value: string) => void', defaultValue: '—', description: '时间变化事件，传出按 format 格式化的时间字符串（DSL 语义值）' },
      { name: 'className', type: 'string', defaultValue: '—', description: '根节点 class（Form 内为 form-item 容器，独立渲染时为触发器）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '根节点内联样式（同 className 的挂载规则）' },
    ],
    guidelines: [
      '- 值始终为字符串（HH:mm:ss 或 HH:mm），落库与回显保持同一 format，不要混用。',
      '- 弹层内点选只是待选值，「确定」才提交；「此刻」仅把待选值设为当前时间，仍需确定。',
      '- 开始 / 结束时间用两个字段并在 rules 或提交逻辑中校验先后顺序，组件本身不做区间约束。',
      '- 与 DatePicker 组合表示完整日期时间；不要把时间字符串拼接进日期字段自行解析。',
      '- Form 内声明 name 走 FieldShell，label 与错误提示由表单统一管理。',
    ].join('\n'),
    examplesDo: [
      '营业时间设置：两个 TimePicker（format HH:mm）分别录入开始 / 结束，提交时校验先后。',
      '定时任务：缺省 HH:mm:ss 精确到秒，「此刻」快速填入当前时间后微调。',
      'Form 内声明 name + 必填 rules，未选时间提交时给出错误提示。',
    ],
    examplesDont: [
      '用 TimePicker 选择日期（应使用 DatePicker）。',
      '同一字段时而 HH:mm 时而 HH:mm:ss 回显，值格式不一致导致解析失败。',
      '把两个独立时间字段硬拼成一个字符串存区间，失去校验与比较能力。',
    ],
  },

  'component.color-picker': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 允许用户自由选色：主题色、标签色、图表配色、富文本文字色。',
      '- 需要透明度（alpha）的颜色：遮罩、高亮底色，a<1 时值自动为 8 位 hex。',
      '- 提供 presets 预设色板收敛可选范围（如品牌色 + 功能色）。',
      '',
      '**何时不用**',
      '',
      '- 有限的固定色集合选择（如 8 个标签色）：使用 RadioGroup / Select 配合色块更轻量。',
      '- 只需展示颜色而不允许修改：使用色块展示，不使用取色器。',
    ].join('\n'),
    previewNote:
      '静态结构：ColorPicker 为 input 风格触发器（data-slot="colorpicker-trigger"，前置 data-slot="colorpicker-swatch" 棋盘格色板 + 当前 hex 文本）+ 受控 Popover 弹层（data-slot="colorpicker-panel"）。弹层为 react-color Sketch 风格面板：饱和度 / 明度二维面板（data-slot="colorpicker-saturation"）、色相与透明度滑杆（colorpicker-hue / colorpicker-alpha，透明度滑杆叠棋盘格）、当前色预览块（colorpicker-preview）、hex 文本输入（Enter 提交，非法值显示 data-slot="colorpicker-error" 错误行）与 R / G / B / A 四通道数字输入（Enter 或失焦提交）、presets 预设色板（colorpicker-presets，命中当前值加 ring 高亮）。拖拽过程实时提交 onChange；Form 内声明 name 时外层包 FieldShell（label + 校验错误）。',
    variants: [
      { name: '基础取色（无预设）', visual: '完整 Sketch 面板：二维面板 + 双滑杆 + 通道输入', scene: '自由选色，如自定义主题色' },
      { name: 'presets 预设色板', visual: '面板底部追加预设色块行', scene: '收敛到品牌 / 功能色集合，兼顾自定义' },
      { name: '透明度取色', visual: '透明度滑杆与棋盘格底纹，值输出 8 位 hex', scene: '遮罩、半透明高亮等需要 alpha 的颜色' },
      { name: 'placeholder 空态', visual: '未选时触发器显示弱提示（缺省「请选择颜色」）', scene: '非必填颜色字段' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（FieldShell 呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'value', type: 'string', defaultValue: '—', description: '受控值（hex 颜色，支持 3/4/6/8 位，如 #1677ff、#1677ffcc）；Form 内作为字段初始值' },
      { name: 'presets', type: 'string[]', defaultValue: '—', description: '预设色板（hex 数组），面板底部渲染色块行' },
      { name: 'placeholder', type: 'string', defaultValue: "'请选择颜色'", description: '空态提示文案' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用触发器' },
      { name: 'onChange', type: '(value: string) => void', defaultValue: '—', description: '颜色变化事件，传出 hex 字符串（透明度小于 1 时为 8 位 hex，DSL 语义值）' },
      { name: 'className', type: 'string', defaultValue: '—', description: '根节点 class（Form 内为 form-item 容器，独立渲染时为触发器）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '根节点内联样式（同 className 的挂载规则）' },
    ],
    guidelines: [
      '- 值统一为 hex 字符串：6 位（a=1）或 8 位（a<1）；消费方按长度判断透明度，不要再拼 rgb()。',
      '- 输入值宽容（3/4/6/8 位 hex 均可解析并归一化为小写展开），但输出始终是 6/8 位规范形。',
      '- 面板内拖拽为实时提交：onChange 会高频触发，联动重活（如接口保存）需自行节流。',
      '- presets 用于收敛选择范围；纯固定集合场景改用 RadioGroup / Select 色块更合适。',
      '- 含透明度的颜色展示时叠棋盘格底纹表达透明区域，消费端回显也应如此。',
    ].join('\n'),
    examplesDo: [
      '主题设置：presets 给品牌色板，用户也可在二维面板自定义，onChange 高频更新实时预览。',
      '高亮遮罩：拖透明度滑杆得到 8 位 hex（如 #1677ff80），直接用于样式。',
      'Form 内声明 name + 必填 rules，未选色提交时提示。',
    ],
    examplesDont: [
      '用 ColorPicker 让用户在 8 个固定标签色中选一个（应使用 RadioGroup / Select 色块）。',
      '把 8 位 hex 截断成 6 位存储，透明度信息被静默丢弃。',
      '在 onChange 里每次触发都直接请求保存接口，拖拽一次发出数十个请求。',
    ],
  },

  'component.upload': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 表单中采集文件：头像、附件、合同、导入数据文件。',
      '- 单文件用按钮形态（缺省），批量或多文件用 drag 拖拽区 + multiple。',
      '',
      '**何时不用**',
      '',
      '- 需要组件直接上传到服务端：Upload 是纯 UI 组件，不发起任何网络请求；上传动作由调用方在 onChange 后自行实现。',
      '- 展示 / 预览已上传文件：使用数据展示或文件预览类组件。',
      '- 仅需文件下载入口：使用 Link / Button。',
    ].join('\n'),
    previewNote:
      '静态结构：Upload 根节点 data-slot="upload"，内含隐藏 file input（data-slot="upload-input"）与选择区——按钮形态 data-slot="upload-button"（图标 + 「选择文件」）或 drag 形态 data-slot="upload-dragger"（虚线拖拽区，「点击或拖拽文件到此区域」，支持拖入）；选择区下方依次渲染 data-slot="upload-tip" 辅助说明、data-slot="upload-rejected" 拒绝计数（「已忽略 N 个不符合要求的文件」）与 data-slot="upload-list" 文件列表（每行：文件名 + 格式化大小 + 移除按钮）。选择时按 accept / maxSize / maxCount 校验，不合规文件不进列表。Form 内声明 name 时外层包 FieldShell（label + 校验错误）。',
    variants: [
      { name: '按钮形态（缺省）', visual: '描边按钮「选择文件」+ 下方文件列表', scene: '单文件或低频上传，如头像、单个附件' },
      { name: 'drag 拖拽区', visual: '虚线大区域，点击或拖入文件', scene: '多文件批量上传，配合 multiple 使用' },
      { name: 'multiple 多选', visual: '列表累积追加，直至 maxCount', scene: '附件集合、批量导入' },
      { name: 'tip 辅助说明', visual: '选择区下方弱提示文案', scene: '说明类型与大小限制（如「仅 PNG/JPG，不超过 2MB」）' },
      { name: 'disabled 禁用', visual: '选择区与移除按钮均禁用', scene: '只读回显、流程未就绪' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（FieldShell 呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'value', type: 'UploadFileMeta[]', defaultValue: '—', description: '受控值（文件元数据数组）；Form 内作为字段初始值' },
      { name: 'multiple', type: 'boolean', defaultValue: 'false', description: '允许多选；开启后新文件追加进列表，否则替换' },
      { name: 'accept', type: 'string', defaultValue: '—', description: '接受的文件类型（同原生 input accept：扩展名 / MIME / image/* 等，逗号分隔）' },
      { name: 'maxSize', type: 'number', defaultValue: '—', description: '单文件大小上限（字节），超出不进列表' },
      { name: 'maxCount', type: 'number', defaultValue: '—', description: '文件总数上限，超出不进列表' },
      { name: 'drag', type: 'boolean', defaultValue: 'false', description: '拖拽区形态（点击或拖入文件选择）' },
      { name: 'tip', type: 'string', defaultValue: '—', description: '选择区下方的辅助说明文案' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用选择与移除' },
      { name: 'onChange', type: '(value: UploadFileMeta[]) => void', defaultValue: '—', description: '文件列表变化事件，传出可序列化元数据数组 Array<{ name, size, type }>（DSL 语义值，不携带 File 本体）' },
      { name: 'className', type: 'string', defaultValue: '—', description: '根节点 class（Form 内为 form-item 容器，独立渲染时为控件根节点）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '根节点内联样式（同 className 的挂载规则）' },
    ],
    guidelines: [
      '- Upload 是纯 UI 组件：只产出元数据数组，不发起网络上传；实际上传、进度与失败重试由调用方在 onChange 后实现。',
      '- 客户端校验只做体验层拦截：accept 按扩展名 / MIME 前缀 / 完整 MIME 匹配，maxSize / maxCount 超限文件不进列表并计数提示；扩展名与 MIME 均可伪造，服务端必须复检扩展名、MIME、文件头与大小。',
      '- 用 tip 明示限制（类型、大小、数量），与 accept / maxSize / maxCount 配置保持一致，减少被拒绝的挫败感。',
      '- multiple 缺省 false：单文件场景新选择替换旧文件；需要累积才开启并配 maxCount。',
      '- onChange 传出的 UploadFileMeta 可序列化（name / size / type），适合进表单值与 DSL 状态；不要试图从中取 File 对象。',
    ].join('\n'),
    examplesDo: [
      '头像上传：按钮形态 + accept="image/*" + maxSize 2MB，tip 写明限制，onChange 后由调用方上传。',
      '批量附件：drag + multiple + maxCount 5，拖拽区收集，列表逐项可移除。',
      'Form 内声明 name + 必填 rules，未选文件提交时提示「请上传附件」。',
    ],
    examplesDont: [
      '以为配置 accept 就完成安全校验，服务端不再复检（扩展名 / MIME 均可伪造）。',
      '期望组件自动上传到服务器（Upload 不发起任何网络请求，需调用方实现）。',
      '限制条件只写代码不写 tip，用户反复选择被拒却不知道为什么。',
    ],
  },

  'component.tree-select': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 从层级候选项中选择单个节点：组织架构、分类树、目录归属。',
      '- 树节点均可选（父节点也是合法值），且需要展开 / 收起浏览或按 label 搜索。',
      '',
      '**何时不用**',
      '',
      '- 只有叶子才是合法值、强调逐级下钻：使用 Cascader（值是路径数组）。',
      '- 扁平候选列表：使用 Select，不必引入树结构。',
      '- 需要多选：当前实现为单选，多选用 Checkbox 组或其他多选组件。',
    ].join('\n'),
    previewNote:
      '静态结构：TreeSelect 为 input 风格触发器（data-slot="treeselect-trigger"，显示选中节点 label，缺省「请选择」）+ 受控 Popover 弹层；searchable 时弹层顶部为过滤输入（按 label 过滤，命中节点的祖先保留展开），下方为 data-slot="treeselect-tree" 内联树（自实现）：每个节点 data-slot="treeselect-node"，含子节点的节点前置 ChevronRight 展开 / 收起按钮（展开时旋转 90°），按深度缩进，选中节点高亮；打开弹层时自动展开到当前选中节点。单选，选中即关闭弹层。Form 内声明 name 时外层包 FieldShell（label + 校验错误）。',
    variants: [
      { name: '基础树选择', visual: '弹层内联树，可展开 / 收起逐级浏览', scene: '层级不深、节点可浏览的场景' },
      { name: 'searchable 搜索', visual: '弹层顶部过滤输入，按 label 过滤并保留祖先展开', scene: '树较大、需要快速定位节点' },
      { name: 'placeholder 空态', visual: '未选时触发器显示弱提示（缺省「请选择」）', scene: '非必填层级字段' },
      { name: 'disabled 禁用', visual: '触发器半透明不可点开', scene: '联动未就绪或只读场景' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（FieldShell 呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'options', type: 'TreeSelectOption[]', defaultValue: '[]', description: '嵌套选项树（{ label, value, children? }）' },
      { name: 'value', type: 'string | number', defaultValue: '—', description: '受控值（选中节点 value）；Form 内作为字段初始值' },
      { name: 'placeholder', type: 'string', defaultValue: "'请选择'", description: '空态提示文案' },
      { name: 'searchable', type: 'boolean', defaultValue: 'false', description: '弹层顶部显示过滤输入（按 label 过滤，命中节点的祖先保留展开）' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用触发器' },
      { name: 'onChange', type: '(value: string | number) => void', defaultValue: '—', description: '选中变化事件，传出选中节点 value（DSL 语义值）' },
      { name: 'className', type: 'string', defaultValue: '—', description: '根节点 class（Form 内为 form-item 容器，独立渲染时为触发器）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '根节点内联样式（同 className 的挂载规则）' },
    ],
    guidelines: [
      '- 与 Cascader 的边界：TreeSelect 值是单个节点 value（父节点可选），Cascader 值是路径数组且叶子才完成选择；按数据语义选型。',
      '- 树超过两级或节点较多时开 searchable，让用户按 label 过滤而非逐级翻找。',
      '- options 的 value 在整棵树内必须唯一，否则选中回显会命中第一个匹配节点。',
      '- 父节点是否可选取决于业务：实现上任意节点点击即选中并关闭弹层，不要假设父节点仅用于展开。',
      '- 打开弹层自动展开到当前选中节点；value 必须能在 options 中找到，否则触发器回退空态。',
    ].join('\n'),
    examplesDo: [
      '部门归属：options 为组织架构树，选中任意层级部门，Form 内 name + 必填 rules。',
      '分类选择：searchable 开启，输入关键字过滤命中节点及其祖先。',
      '回显编辑：value 传入已存节点 value，打开弹层自动展开到该节点。',
    ],
    examplesDont: [
      '用 TreeSelect 做省市区选择且只存叶子（应使用 Cascader，保留完整路径）。',
      '树内 value 重复，回显命中错误节点。',
      '扁平十几个选项也套树结构（应使用 Select，减少层级负担）。',
    ],
  },

  'component.cascader': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 按层级逐步完成选择且路径本身有语义：省 / 市 / 区、类目 / 子类目。',
      '- 各级选项数量中等、需要逐列下钻浏览；只有叶子节点完成选择。',
      '',
      '**何时不用**',
      '',
      '- 需要选中中间层级（父节点即合法值）：使用 TreeSelect（单值）。',
      '- 扁平候选：使用 Select；层级数据但候选巨大需搜索：TreeSelect + searchable 更合适（Cascader 无搜索）。',
      '- 多选路径：当前实现为单选路径。',
    ].join('\n'),
    previewNote:
      '静态结构：Cascader 为 input 风格触发器（data-slot="cascader-trigger"，文本以 ` / ` 连接路径各级 label，缺省「请选择」）+ 受控 Popover 弹层（data-slot="cascader-panel"）：多列并排（每列 data-slot="cascader-column"，宽 40、独立滚动），点击含 children 的节点开下一列（行尾 ChevronRight 指示），点击叶子提交并关闭弹层；列内当前路径节点高亮。打开弹层时以已提交路径初始化下钻位置。Form 内声明 name 时外层包 FieldShell（label + 校验错误）。',
    variants: [
      { name: '基础级联', visual: '多列逐级下钻，叶子完成选择', scene: '省市区、类目等固定层级数据' },
      { name: '路径回显', visual: '触发器文本以「 / 」连接各级 label', scene: '编辑场景回显已存路径 value 数组' },
      { name: 'placeholder 空态', visual: '未选时触发器显示弱提示（缺省「请选择」）', scene: '非必填层级字段' },
      { name: 'disabled 禁用', visual: '触发器半透明不可点开', scene: '联动未就绪或只读场景' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（FieldShell 呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'options', type: 'CascaderOption[]', defaultValue: '[]', description: '嵌套选项（{ label, value, children? }；含 children 的节点点开下一列，叶子完成选择）' },
      { name: 'value', type: 'Array<string | number>', defaultValue: '—', description: '受控值（路径 value 数组）；Form 内作为字段初始值' },
      { name: 'placeholder', type: 'string', defaultValue: "'请选择'", description: '空态提示文案' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用触发器' },
      { name: 'onChange', type: '(value: Array<string | number>) => void', defaultValue: '—', description: '选中叶子事件，传出路径 value 数组（DSL 语义值）' },
      { name: 'className', type: 'string', defaultValue: '—', description: '根节点 class（Form 内为 form-item 容器，独立渲染时为触发器）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '根节点内联样式（同 className 的挂载规则）' },
    ],
    guidelines: [
      '- 值是完整路径 value 数组（如 ["zhejiang", "hangzhou", "xihu"]），不是叶子单值；落库与回显保持数组形态。',
      '- 与 TreeSelect 的边界：Cascader 只有叶子完成选择、保留路径；TreeSelect 任意节点可选、只存单值。',
      '- 路径中任一 value 在 options 中未命中则回显为空；options 变更后注意存量值的有效性。',
      '- 层级不宜过深（2-4 级最佳）：每级一列，过深横向展开体验差。',
      '- Cascader 无搜索能力；候选巨大需搜索定位时改用 TreeSelect + searchable。',
    ].join('\n'),
    examplesDo: [
      '省市区选择：三级 options，选中叶子传出完整路径数组，触发器回显「浙江 / 杭州 / 西湖」。',
      '商品类目：两级类目下钻，Form 内 name + 必填 rules，未选到叶子不提交。',
      '编辑回显：value 传入已存路径数组，打开弹层自动定位到对应列。',
    ],
    examplesDont: [
      '需要选中间层级（如只选到省）却用 Cascader（叶子才完成选择，应使用 TreeSelect）。',
      '把路径数组 join 成字符串存储后拆不回原值类型（string / number 混淆导致回显失效）。',
      '六级以上深层级仍用 Cascader 逐列下钻，用户迷失在多列中。',
    ],
  },

  'component.transfer': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 在两个集合之间移动条目：从候选集挑选成员、权限项、字段子集。',
      '- 候选数量较多且需要直观对照「已选 / 未选」两栏，批量勾选移动。',
      '',
      '**何时不用**',
      '',
      '- 少量选项（十几个以内）的多选：使用 Checkbox 组或 Select 多选，Transfer 的双栏结构过重。',
      '- 需要排序已选集合：当前实现不含排序能力，仅维护目标侧集合。',
      '- 层级数据选择：使用 TreeSelect / Cascader。',
    ].join('\n'),
    previewNote:
      '静态结构：Transfer 根节点 data-slot="transfer"，左右两个面板（data-slot 分别为 transfer-left-panel / transfer-right-panel）加中间竖排两个移动按钮（「移到右侧」「移到左侧」，无勾选时禁用）。每个面板：列头为全选 checkbox（仅作用于该列可用项）+ 标题 + 计数（「N 项」），列体为 checkbox 列表（禁用项半透明不可勾）。勾选后点移动按钮批量迁移并清空该侧勾选；disabled 的选项不参与移动。Form 内声明 name 时外层包 FieldShell（label + 校验错误）。',
    variants: [
      { name: '基础穿梭', visual: '左右两栏 + 中间移动按钮，titles 缺省「列表 1 / 列表 2」', scene: '通用候选 → 目标集合挑选' },
      { name: 'titles 自定义标题', visual: '列头标题按业务命名', scene: '语义化双栏（如「可选权限 / 已授权限」）' },
      { name: '选项级 disabled', visual: '单个选项半透明不可勾选、不参与移动', scene: '必备项 / 无权限项锁定在某侧' },
      { name: 'disabled 整体禁用', visual: '全部勾选与移动按钮禁用', scene: '只读回显已选集合' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（FieldShell 呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'options', type: 'TransferOption[]', defaultValue: '[]', description: '全部选项（{ label, value, disabled? }；左列 = 未进目标侧的项，右列 = 目标侧的项）' },
      { name: 'value', type: 'Array<string | number>', defaultValue: '—', description: '受控值（目标侧 value 数组）；Form 内作为字段初始值' },
      { name: 'titles', type: '[string, string]', defaultValue: "['列表 1', '列表 2']", description: '左右两列标题' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '整体禁用（勾选与移动均不可用）' },
      { name: 'onChange', type: '(value: Array<string | number>) => void', defaultValue: '—', description: '移动变化事件，传出目标侧 value 数组（DSL 语义值）' },
      { name: 'className', type: 'string', defaultValue: '—', description: '根节点 class（Form 内为 form-item 容器，独立渲染时为控件根节点）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '根节点内联样式（同 className 的挂载规则）' },
    ],
    guidelines: [
      '- 值与 onChange 只表达目标侧（右列）value 数组；左列由 options 减去目标侧推导，不要单独维护。',
      '- titles 按业务语义命名（如「候选成员 / 已选成员」），不要沿用缺省「列表 1 / 列表 2」上线。',
      '- 勾选是中间态，点移动按钮才提交 onChange；移动后该侧勾选自动清空。',
      '- 选项级 disabled 用于锁定必备项；整体 disabled 用于只读回显。',
      '- 候选少量时不要上 Transfer：双栏结构在十几个选项内反而降低效率，用 Checkbox 组。',
    ].join('\n'),
    examplesDo: [
      '权限配置：options 为全部权限点，titles ["未授权", "已授权"]，批量勾选后点箭头移动。',
      '报表字段挑选：几十个字段中选展示列，Form 内 name + 至少选一项 rules。',
      '必备项锁定：核心字段选项 disabled，始终留在目标侧不可移出。',
    ],
    examplesDont: [
      '8 个选项的多选也上 Transfer（应使用 Checkbox 组）。',
      '用缺省标题「列表 1 / 列表 2」直接上线，用户不理解两栏语义。',
      '试图用 Transfer 对已选集合排序（实现不含排序能力）。',
    ],
  },

  'component.mentions': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 多行输入中引用用户或对象：评论 @ 人、任务指派、文档引用。',
      '- 候选集合固定（同事列表、资源列表），输入触发字符即时过滤选择。',
      '',
      '**何时不用**',
      '',
      '- 纯文本多行输入无引用需求：使用 Textarea。',
      '- 只需要从候选中选一个值而不需要内联文本：使用 Select / Combobox。',
      '- 需要富文本样式（加粗、链接等）：Mentions 是纯文本 textarea，使用富文本组件。',
    ].join('\n'),
    previewNote:
      '静态结构：Mentions 为相对定位容器包裹 shadcn Textarea（data-slot="mentions"）；输入 trigger 字符（缺省 @）且光标在其后无空白查询串时，下方弹出候选浮层（data-slot="mentions-popup"，绝对定位下拉列表），按查询串过滤候选的 label / value；↑/↓ 移动高亮、Enter 或点击选中后在光标处插入 `trigger + value + 空格` 并复位光标，Esc 或失焦关闭。onChange 传出完整字符串。Form 内声明 name 时外层包 FieldShell（label + 校验错误）。',
    variants: [
      { name: '缺省 @ 提及', visual: '输入 @ 弹候选浮层，选中插入 @value + 空格', scene: '评论、消息中提及成员' },
      { name: 'trigger 自定义触发符', visual: '按自定义字符触发（如 # 引用话题）', scene: '对象引用、话题标签等场景' },
      { name: 'rows 多行高度', visual: 'textarea 行数可调', scene: '长文本输入（评论正文、描述）' },
      { name: 'disabled 禁用', visual: 'textarea 禁用', scene: '只读回显或流程未就绪' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（FieldShell 呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'options', type: 'MentionOption[]', defaultValue: '[]', description: '候选列表（{ label, value }；按查询串过滤 label / value）' },
      { name: 'trigger', type: 'string', defaultValue: "'@'", description: '触发字符' },
      { name: 'rows', type: 'number', defaultValue: '—', description: '文本域行数' },
      { name: 'placeholder', type: 'string', defaultValue: '—', description: '空态提示文案' },
      { name: 'value', type: 'string', defaultValue: '—', description: '受控值（完整字符串）；Form 内作为字段初始值' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用输入' },
      { name: 'onChange', type: '(value: string) => void', defaultValue: '—', description: '输入变化事件，传出完整字符串（DSL 语义值）' },
      { name: 'className', type: 'string', defaultValue: '—', description: '根节点 class（Form 内为 form-item 容器，独立渲染时为控件包裹节点）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '根节点内联样式（同 className 的挂载规则）' },
    ],
    guidelines: [
      '- 值始终是完整纯文本字符串；选中候选插入 `trigger + value + 空格`，value 即落库文本，解析提及由调用方按 trigger 规则提取。',
      '- 候选 value 不应含空白：查询串含空白即视为提及结束，value 带空格会导致插入后无法回认。',
      '- options 的 label 用于展示与过滤，value 用于插入；二者语义分清（如 label 显示姓名、value 插入账号）。',
      '- 候选为空时不弹浮层；保证 options 已加载再让用户输入，避免「输入 @ 无反应」。',
      '- 键盘操作完整：↑/↓ 高亮、Enter 选中、Esc 关闭；不要额外劫持这些按键。',
    ].join('\n'),
    examplesDo: [
      '评论输入：options 为团队成员（label 姓名 / value 账号），输入 @ 过滤，选中插入「@zhangsan 」。',
      '话题引用：trigger 设为 #，输入 # 引用话题对象。',
      'Form 内声明 name + 必填 rules，评论为空时提交提示。',
    ],
    examplesDont: [
      '用 Mentions 做单值选择（应使用 Select / Combobox，Mentions 产出的是整段文本）。',
      '候选 value 含空格，插入后立即被视为提及结束，无法回认解析。',
      '期望组件自动发通知给被 @ 的人（组件只产出文本，通知逻辑由调用方实现）。',
    ],
  },
};
