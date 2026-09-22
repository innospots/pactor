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
    dsl: {
      "type": "Rate",
      "props": {
        "name": "satisfaction",
        "value": 4,
        "count": 5,
        "allowHalf": true
      },
      "events": {
        "onChange": {
          "action": "setState",
          "params": {
            "satisfaction": "${event}"
          }
        }
      }
    },
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
    dsl: {
      "type": "TimePicker",
      "props": {
        "name": "meetingTime",
        "format": "HH:mm",
        "placeholder": "请选择时间"
      }
    },
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
    dsl: {
      "type": "ColorPicker",
      "props": {
        "name": "brandColor",
        "value": "#1677ff",
        "presets": [
          "#1677ff",
          "#52c41a",
          "#faad14",
          "#ff4d4f"
        ]
      }
    },
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
    dsl: {
      "type": "Upload",
      "props": {
        "name": "attachments",
        "multiple": true,
        "accept": "image/*,.pdf",
        "maxSize": 5242880,
        "maxCount": 3,
        "drag": true,
        "tip": "支持图片与 PDF，单文件不超过 5MB"
      }
    },
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
    dsl: {
      "type": "TreeSelect",
      "props": {
        "name": "department",
        "placeholder": "请选择部门",
        "options": [
          {
            "label": "华东大区",
            "value": "east",
            "children": [
              {
                "label": "杭州分公司",
                "value": "hz"
              },
              {
                "label": "上海分公司",
                "value": "sh"
              }
            ]
          },
          {
            "label": "华南大区",
            "value": "south"
          }
        ]
      }
    },
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
    dsl: {
      "type": "Cascader",
      "props": {
        "name": "region",
        "placeholder": "请选择省市区",
        "options": [
          {
            "label": "浙江省",
            "value": "zj",
            "children": [
              {
                "label": "杭州市",
                "value": "hangzhou",
                "children": [
                  {
                    "label": "西湖区",
                    "value": "xihu"
                  },
                  {
                    "label": "滨江区",
                    "value": "binjiang"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
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
    dsl: {
      "type": "Transfer",
      "props": {
        "name": "owners",
        "titles": [
          "候选成员",
          "已选成员"
        ],
        "options": [
          {
            "label": "陈晨",
            "value": "u-01"
          },
          {
            "label": "林晚",
            "value": "u-02"
          },
          {
            "label": "苏叶",
            "value": "u-03"
          },
          {
            "label": "周屿",
            "value": "u-04"
          }
        ]
      }
    },
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
    dsl: {
      "type": "Mentions",
      "props": {
        "name": "comment",
        "trigger": "@",
        "rows": 3,
        "placeholder": "输入 @ 提及成员",
        "options": [
          {
            "label": "陈晨",
            "value": "chenchen"
          },
          {
            "label": "林晚",
            "value": "linwan"
          }
        ]
      }
    },
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

  'component.input': {
    dsl: {
      "type": "Input",
      "props": {
        "name": "keyword",
        "label": "关键词",
        "placeholder": "请输入关键词",
        "allowClear": true
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 采集单行短文本：姓名、标题、编号、关键词、搜索词。',
      '- 需要掩码输入：type="password" 走原生 password 输入。',
      '- 高频重填的检索类输入：allowClear 在值非空时提供一键清空。',
      '',
      '**何时不用**',
      '',
      '- 多行文本 / 备注说明：使用 Textarea，Input 是单行控件。',
      '- 数值录入（需步进、范围与精度约束）：使用 NumberInput；日期 / 时间：使用 DatePicker / TimePicker。',
      '- 从候选中选值而非自由输入：候选少且固定用 Select，候选多且可搜索用 Combobox。',
    ].join('\n'),
    previewNote:
      '静态结构：Input 为单行文本控件（vendored shadcn Input，data-slot="input"，高 h-9）；allowClear 且值非空且未禁用时，控件外再包一层 flex 行容器承载右侧 × 清除按钮（点击清空并触发 onChange("")），此时独立渲染的 className / style 挂包裹节点；未开启 allowClear 时保持裸控件，className / style 直接挂 input 本身。Form 内声明非空 name 时外层为 data-slot="form-item" 容器（label 经 htmlFor 关联控件 useId + data-slot="form-error" 校验错误行），不走 FieldShell。',
    variants: [
      { name: '默认 text', visual: '单行描边输入框，聚焦 ring 高亮', scene: '常规短文本录入' },
      { name: 'type="password"', visual: '原生掩码输入', scene: '密码、密钥等敏感短文本' },
      { name: 'allowClear 可清空', visual: '值非空时右侧出现 × 按钮', scene: '搜索框、筛选条件等高频重填输入' },
      { name: 'Form 表单项', visual: 'form-item 容器：label + 控件 + 校验错误行', scene: '表单内字段（声明 name 自动注册）' },
      { name: 'disabled 禁用', visual: '半透明不可输入，清除按钮不渲染', scene: '只读回显、流程未就绪' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（Form 内由 label 标签呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则（注册字段时携带，当前支持 required + message）' },
      { name: 'value', type: 'string', defaultValue: '—', description: '受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues）' },
      { name: 'type', type: "'text' | 'password'", defaultValue: "'text'", description: '输入类型：password 时掩码输入' },
      { name: 'placeholder', type: 'string', defaultValue: '—', description: '空态提示文案' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用输入；同时使 allowClear 的清除按钮不渲染' },
      { name: 'allowClear', type: 'boolean', defaultValue: 'false', description: '值为非空且未禁用时显示清除按钮；开启后独立渲染的 className / style 挂控件包裹节点（含清除按钮）' },
      { name: 'onChange', type: '(value: string) => void', defaultValue: '—', description: '输入事件，传出 string（Renderer 绑定 events.onChange；非原生 event）' },
      { name: 'controlClassName', type: 'string', defaultValue: '—', description: '控件本体 class（无论是否在 Form 内都挂 input 节点；Form 内精确设置控件样式如宽度时使用）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（Form 内为 form-item 容器，独立渲染时为控件本身）' },
    ],
    guidelines: [
      '- 单行短文本专用：长文本、备注、富文本一律换 Textarea 或对应组件，不靠 Input 拉伸。',
      '- Form 内必须声明非空 name 才会注册为表单项并参与校验；rules 随字段注册，value 作字段初始值且优先于 Form initialValues。',
      '- placeholder 写「请输入…」并给格式示例（如「请输入订单号，如 PO20260922001」），不用 placeholder 代替 label。',
      '- allowClear 适合高频重填场景；开启后独立渲染的 className / style 挂在包裹节点而非 input 本身，设置宽度等样式时注意作用对象。',
      '- password 仅做输入掩码，不提供强度校验与加密传输，敏感字段需配合服务端安全策略。',
    ].join('\n'),
    examplesDo: [
      '搜索框：allowClear + placeholder「请输入关键词」，onChange 直接驱动列表过滤。',
      'Form 内「项目名称」：name="title" + label + rules 必填，校验失败自动在字段下方展示错误。',
      '密码字段：type="password" 掩码输入，取值时随表单 values 一并提交。',
    ],
    examplesDont: [
      '用 Input 录入备注、摘要等多行长文本（应使用 Textarea）。',
      '用 Input 采集金额 / 数量再自行解析字符串（应使用 NumberInput 获得范围与精度约束）。',
      'Form 内忘记声明 name，字段值不进表单 values，提交时取不到。',
    ],
  },

  'component.textarea': {
    dsl: {
      "type": "Textarea",
      "props": {
        "name": "remark",
        "label": "备注说明",
        "rows": 3,
        "placeholder": "请输入备注说明"
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 采集多行文本：备注、说明、描述、正文草稿。',
      '- 需要固定行高的输入区（rows 指定行数），或由内容自适应高度的轻量文本域。',
      '- Form 内的长文本字段：声明 name 即自动注册并参与校验。',
      '',
      '**何时不用**',
      '',
      '- 单行短文本：使用 Input；数值 / 日期 / 时间：使用 NumberInput / DatePicker / TimePicker。',
      '- 多行中需要引用用户或对象（@ 提及）：使用 Mentions。',
      '- 需要富文本格式（加粗、链接、图片）：Textarea 是纯文本域，改用富文本组件。',
    ].join('\n'),
    previewNote:
      '静态结构：Textarea 为多行文本域（vendored shadcn Textarea，data-slot="textarea"），rows 显式指定行数、缺省由内容自适应。Form 内声明非空 name 时经 FieldShell 包裹——data-slot="form-item" 容器 + label（htmlFor 关联控件 useId）+ 文本域 + data-slot="form-error" 校验错误行；独立渲染时 className / style 直接挂文本域本体。',
    variants: [
      { name: '默认（rows 自适应）', visual: '多行描边文本域，高度随内容增长', scene: '行数不确定的描述类输入' },
      { name: 'rows 固定行数', visual: '按 rows 指定初始高度', scene: '表单布局需要稳定高度（如固定 3 行备注）' },
      { name: 'Form 表单项', visual: 'FieldShell：label + 文本域 + 校验错误行', scene: '表单内长文本字段（声明 name 自动注册）' },
      { name: 'disabled 禁用', visual: '半透明不可输入', scene: '只读回显、流程未就绪' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（FieldShell 呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'value', type: 'string', defaultValue: '—', description: '受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues）' },
      { name: 'placeholder', type: 'string', defaultValue: '—', description: '空态提示文案' },
      { name: 'rows', type: 'number', defaultValue: '—', description: '行数；缺省由内容自适应' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用输入' },
      { name: 'onChange', type: '(value: string) => void', defaultValue: '—', description: '输入事件，传出 string（Renderer 绑定 events.onChange；非原生 event）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（Form 内为 form-item 容器，独立渲染时为文本域本身）' },
    ],
    guidelines: [
      '- 多行纯文本专用；需要格式、链接或图文混排时换富文本组件，不用 Textarea 硬扛。',
      '- rows 只定初始高度，浏览器仍可拖拽调整；需要稳定布局时同时约束容器宽度并确认换行表现。',
      '- 长文本字段配 rules 做必填与长度校验，避免纯前端截断造成静默丢字。',
      '- Form 内声明非空 name 才会注册字段；未声明 name 时仅为受控文本域，值不进表单 values。',
      '- placeholder 给填写提示（如「请描述问题现象与复现步骤」），承载实际约束信息而非重复 label。',
    ].join('\n'),
    examplesDo: [
      '工单表单：rows={4} 的「问题描述」字段，name + rules 必填，校验失败在下方提示。',
      '审核意见：rows={3} 的备注输入，onChange 回写受控 state 并实时统计字数。',
      '只读回显：disabled 展示已提交的备注内容，与编辑态视觉区分。',
    ],
    examplesDont: [
      '用 Textarea 采集单行字段（如姓名、编号），占用垂直空间且无必要（应使用 Input）。',
      '在 Textarea 中期待 @ 提及候选浮层（应使用 Mentions）。',
      '把长文本存进 Input 后靠 CSS 拉高伪装多行输入。',
    ],
  },

  'component.number-input': {
    dsl: {
      "type": "NumberInput",
      "props": {
        "name": "quantity",
        "label": "数量",
        "value": 2,
        "min": 0,
        "max": 10,
        "step": 1
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 采集数值：数量、件数、天数、百分比等需要范围与步进约束的字段。',
      '- 需要钳制边界（min / max）或小数精度（precision 四舍五入）的输入。',
      '- 需要步进微调的数值（右侧上 / 下按钮，步距由 step 决定）。',
      '',
      '**何时不用**',
      '',
      '- 大范围连续取值、强调「比例感」的调参：使用 Slider，NumberInput 侧重精确录入。',
      '- 金额等需要千分位、货币符号与专用格式化的场景：使用业务侧金额组件或格式化展示（Statistic）。',
      '- 编号、手机号等「数字形态的标识」：使用 Input，它们不做数值运算。',
    ].join('\n'),
    previewNote:
      '静态结构：NumberInput 的控件为包裹节点 data-slot="number-input"（relative block），内嵌原生 number input（隐藏浏览器原生步进箭头）+ 右侧绝对定位的竖排双按钮列（上 / 下 Chevron 图标，按 step 增减并以 min / max 钳制；到达边界或 disabled 时对应按钮禁用）。输入过程保留中间文本（如 "-" / "1."），可解析时传出钳制 + precision 规整后的 number，清空传出 undefined。Form 内声明非空 name 时经 FieldShell 包裹（label + 校验错误行）。',
    variants: [
      { name: '默认', visual: '描边数字输入框 + 右侧上 / 下步进按钮', scene: '常规数值录入' },
      { name: 'min / max 钳制', visual: '越界输入被钳制，边界处对应按钮禁用', scene: '有明确取值范围的字段（如 0-100 分）' },
      { name: 'step 自定义步距', visual: '步进按钮按 step 增减', scene: '成组变化的数值（如 5 的倍数、0.1 步进）' },
      { name: 'precision 精度', visual: '输入值按精度四舍五入后提交', scene: '小数位数固定的金额 / 比率' },
      { name: 'Form 表单项', visual: 'FieldShell：label + 控件 + 校验错误行', scene: '表单内数值字段（声明 name 自动注册）' },
      { name: 'disabled 禁用', visual: '输入与步进按钮均禁用', scene: '只读回显、流程未就绪' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（FieldShell 呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'value', type: 'number', defaultValue: '—', description: '受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues）' },
      { name: 'min', type: 'number', defaultValue: '—', description: '最小值（输入越界时钳制）' },
      { name: 'max', type: 'number', defaultValue: '—', description: '最大值（输入越界时钳制）' },
      { name: 'step', type: 'number', defaultValue: '1', description: '步长（步进按钮步距，同时透传原生 input step）' },
      { name: 'precision', type: 'number', defaultValue: '—', description: '小数精度位数；声明后输入值按此精度四舍五入' },
      { name: 'placeholder', type: 'string', defaultValue: '—', description: '空态提示文案' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用输入与步进按钮' },
      { name: 'onChange', type: '(value: number | undefined) => void', defaultValue: '—', description: '输入事件，传出 number，清空时传出 undefined（Renderer 绑定 events.onChange；DSL 语义值）' },
      { name: 'controlClassName', type: 'string', defaultValue: '—', description: '控件本体（input）class（无论是否在 Form 内都挂 input 节点）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（Form 内为 form-item 容器，独立渲染时为控件包裹节点）' },
    ],
    guidelines: [
      '- 有明确取值范围的字段一定给 min / max：钳制发生在输入与步进两条路径上，避免越界值进入表单。',
      '- precision 同时作用于手输与步进结果；金额场景固定 2 位，避免浮点尾数落入表单 values。',
      '- onChange 可能传出 undefined（用户清空）；下游取值需处理空值，不要直接参与算术。',
      '- 值始终是 number 类型（非字符串），表单校验与提交均按数值语义处理。',
      '- 强调比例、连续调参（如音量、透明度）时改用 Slider；NumberInput 适合精确录入。',
    ].join('\n'),
    examplesDo: [
      '购买数量：min={1} max={10} step={1}，步进按钮在边界处自动禁用。',
      '折扣率：precision={2} + min={0} max={1}，输入 0.1234 提交为 0.12。',
      'Form 内「工时」：name + rules 必填，onChange 传出 number 直接参与后端计算。',
    ],
    examplesDont: [
      '用 NumberInput 采集手机号、订单编号等标识（应使用 Input，它们不参与数值运算）。',
      '不给 min / max 就交给后端兜底，用户可提交负数或超大值。',
      '把 onChange 传出的 undefined 当作 0 使用，清空与「填了 0」语义混淆。',
    ],
  },

  'component.select': {
    dsl: {
      "type": "Select",
      "props": {
        "name": "status",
        "label": "状态",
        "placeholder": "选择状态",
        "options": [
          {
            "label": "全部",
            "value": "all"
          },
          {
            "label": "进行中",
            "value": "doing"
          },
          {
            "label": "已完成",
            "value": "done"
          },
          {
            "label": "已归档（禁用）",
            "value": "archived",
            "disabled": true
          }
        ]
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 从少而固定的候选集合中选一个值：状态、类型、优先级、负责人。',
      '- 候选可枚举、无需输入过滤，且下拉列表可完整浏览（建议 10 项以内）。',
      '- 表单内的单选字段：声明 name 即自动注册，参与校验与提交。',
      '',
      '**何时不用**',
      '',
      '- 候选多（数十项以上）或需要输入关键字过滤：使用 Combobox；候选少而固定才用 Select。',
      '- 层级候选数据：使用 Cascader / TreeSelect。',
      '- 选项需平铺对比且数量 2-5 个：使用 RadioGroup（表单内）或 Segmented（视图切换），少一次点击。',
      '- 需要多选：当前实现为单选，多选用 Checkbox 组或 Transfer。',
    ].join('\n'),
    previewNote:
      '静态结构：Select 为触发器（vendored shadcn Select，data-slot="select-trigger"，内 data-slot="select-value" 显示选中项 label 或 placeholder）+ 弹层（data-slot="select-content" 内 data-slot="select-item" 列表，选项级 disabled 灰化不可选）。选中值经 Root 的 items 映射回 label，表单初始值回填、弹层尚未渲染过时触发器同样显示 label。allowClear 且已有选中值且未禁用时，触发器右侧追加 × 清除按钮（点击清空并触发 onChange(undefined)）。Form 内声明非空 name 时外层为 data-slot="form-item" 容器（label 经 htmlFor 关联控件 useId + data-slot="form-error"），不走 FieldShell。',
    variants: [
      { name: '默认（单选）', visual: '描边触发器 + 下拉选项列表', scene: '常规枚举单选' },
      { name: '选项级 disabled', visual: '单个选项灰化不可选', scene: '无权限 / 不可用的候选项（如已归档状态）' },
      { name: 'allowClear 可清空', visual: '已选值时触发器右侧出现 × 按钮', scene: '非必填筛选项，需要回到「未选」态' },
      { name: 'placeholder 空态', visual: '未选时触发器显示弱化提示文案', scene: '非必填字段、需要引导选择的必填字段' },
      { name: 'Form 表单项', visual: 'form-item 容器：label + 触发器 + 校验错误行', scene: '表单内单选字段（声明 name 自动注册）' },
      { name: 'disabled 禁用', visual: '触发器半透明不可点开', scene: '联动未就绪或只读场景' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（Form 内由 label 标签呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'options', type: 'SelectOption[]', defaultValue: '[]', description: '选项列表（可含表达式解析后的数组）；项结构 { label, value: string | number | boolean, disabled? }' },
      { name: 'value', type: 'string | number | boolean', defaultValue: '—', description: '受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues）' },
      { name: 'placeholder', type: 'string', defaultValue: '—', description: '空态提示文案' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用触发器；选项级禁用用 options 项的 disabled' },
      { name: 'allowClear', type: 'boolean', defaultValue: 'false', description: '已选值且未禁用时显示清除按钮（清空为 undefined）' },
      { name: 'onChange', type: '(value: unknown) => void', defaultValue: '—', description: '选中变化事件，传出选中项的原始 value；清空传出 undefined（Renderer 绑定 events.onChange；DSL 语义值）' },
      { name: 'controlClassName', type: 'string', defaultValue: '—', description: '控件本体 class（无论是否在 Form 内都挂控件包裹节点；独立渲染时与 className 同点合并）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（Form 内为 form-item 容器，独立渲染时为控件包裹节点）' },
    ],
    guidelines: [
      '- 候选少且固定用 Select；候选多、需要输入过滤改用 Combobox——不要给 Select 塞几十个选项让用户翻找。',
      '- options 的 value 类型保持一致（string / number / boolean 不混用），否则回填与选中态匹配会错位。',
      '- 选项文案完整可读（如「进行中」而非「3」）；状态码到文案的映射在 options 层完成。',
      '- 禁用选项需说明原因（如「已归档（不可选）」），不要让用户反复尝试点不开的项。',
      '- Form 内声明非空 name 才注册字段；初始值回填依赖 items 映射，options 必须在首次渲染时可用。',
    ].join('\n'),
    examplesDo: [
      '筛选项「状态」：options 枚举全部业务状态，非必填配 allowClear，change 后刷新列表。',
      'Form 内「优先级」：name + label + rules 必填，校验失败在触发器下方提示。',
      '编辑回显：value 传已存状态码，options 就绪时触发器直接显示对应 label。',
    ],
    examplesDont: [
      '用 Select 承载数十上百个候选让用户滚动查找（应使用 Combobox 提供搜索）。',
      '省市区等层级数据用扁平 Select 平铺（应使用 Cascader / TreeSelect 保留层级）。',
      'options 中 value 混用字符串与数字，回填时选中态丢失或匹配到错误项。',
    ],
  },

  'component.combobox': {
    dsl: {
      "type": "Combobox",
      "props": {
        "name": "owner",
        "label": "负责人",
        "searchable": true,
        "placeholder": "搜索并选择成员",
        "options": [
          {
            "label": "张三",
            "value": "zhangsan"
          },
          {
            "label": "李四",
            "value": "lisi"
          },
          {
            "label": "王五",
            "value": "wangwu"
          },
          {
            "label": "赵六",
            "value": "zhaoliu"
          }
        ]
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 候选较多（数十项以上）时需要输入关键字快速定位的单选：成员、客户、标签、字典项。',
      '- 候选项 label 可被关键字匹配（按 label 过滤、按 value 定位），用户记得「大概叫什么」但翻不动列表。',
      '- 表单内声明 name 即自动注册为表单项，参与校验与提交。',
      '',
      '**何时不用**',
      '',
      '- 候选少且固定（10 项以内）、无需搜索：使用 Select，少一次输入成本。',
      '- 层级候选数据：使用 Cascader / TreeSelect；其中 TreeSelect 支持 searchable，按树过滤。',
      '- 需要用户输入任意文本（不在候选中也要保留）：Combobox 是「选值」控件，自由文本用 Input。',
      '- 需要多选：当前实现为单选。',
    ].join('\n'),
    previewNote:
      '静态结构：Combobox 为触发器（data-slot="combobox-trigger"，显示选中项 label；无选中时显示 placeholder 并弱化配色）+ 受控 Popover 弹层（data-slot="combobox-content"，内为 vendored Command：searchable 时顶部渲染 data-slot="command-input" 过滤输入、列表 data-slot="command-list"、无匹配时 data-slot="command-empty" 显示「无匹配结果」）。候选项为 data-slot="command-item"，以 value 作为 Command 值、label 作为 keywords 参与过滤；当前选中项带 data-checked 标记，点击即选中、写值并关闭弹层，禁用项不可选。Form 内声明非空 name 时外层为 data-slot="form-item" 容器（label + 触发器 + data-slot="form-error"）。',
    variants: [
      { name: 'searchable 可搜索（缺省）', visual: '弹层顶部过滤输入，按 label 过滤候选', scene: '候选多，需关键字定位' },
      { name: 'searchable=false 纯下拉', visual: '弹层无过滤输入，等同下拉选择', scene: '候选稍多但无需搜索（10-30 项）' },
      { name: '无匹配结果空态', visual: '弹层内「无匹配结果」提示', scene: '关键字未命中任何候选时的兜底反馈' },
      { name: '选项级 disabled', visual: '候选项灰化不可选', scene: '不可指派 / 已停用的候选对象' },
      { name: 'Form 表单项', visual: 'form-item 容器：label + 触发器 + 校验错误行', scene: '表单内可搜索单选字段（声明 name 自动注册）' },
      { name: 'disabled 禁用', visual: '触发器半透明不可点开', scene: '联动未就绪或只读场景' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（Form 内由 label 标签呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'options', type: 'ComboboxOption[]', defaultValue: '[]', description: '选项列表（可含表达式解析后的数组）；项结构 { label, value: string | number, disabled? }' },
      { name: 'value', type: 'string | number', defaultValue: '—', description: '受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues）' },
      { name: 'placeholder', type: 'string', defaultValue: '—', description: '触发器空态文案，同时作为弹层过滤输入的占位文案' },
      { name: 'searchable', type: 'boolean', defaultValue: 'true', description: '弹层顶部显示过滤输入（按 label / value 匹配）' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用触发器；选项级禁用用 options 项的 disabled' },
      { name: 'onChange', type: '(value: string | number | undefined) => void', defaultValue: '—', description: '选中变化事件，传出选中项的原始 value（Renderer 绑定 events.onChange；DSL 语义值）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（Form 内为 form-item 容器，独立渲染时为触发器）' },
    ],
    guidelines: [
      '- 与 Select 的边界一句话：候选少且固定用 Select，候选多可搜索用 Combobox；两者都是单选值控件。',
      '- 候选 label 是过滤的主依据，需可辨识（成员用「姓名（部门）」而非同名缩写）；value 保持稳定唯一。',
      '- 候选集很大时确认数据已就绪再渲染，避免弹层打开却「无匹配结果」。',
      '- 选中即关闭弹层并立即生效；下游如有关联刷新应放在 onChange 中处理。',
      '- Combobox 无清除按钮（allowClear）；需要「回到未选」时提供一条「全部 / 不限」候选或改用 Select。',
    ].join('\n'),
    examplesDo: [
      '指派负责人：options 为成员列表，searchable 输入姓名过滤，选中即回写 ownerId。',
      'Form 内「所属客户」：name + rules 必填，未选提交时提示「请选择客户」。',
      '编辑回显：value 传已存 value，触发器显示对应 label 而非原始 id。',
    ],
    examplesDont: [
      '十几个固定选项也用 Combobox（应使用 Select，不必让用户额外输入）。',
      '用 Combobox 承载省市区等层级数据（应使用 Cascader / TreeSelect）。',
      '期望 Combobox 支持多选或允许输入候选外的自由文本（当前实现为单选值控件）。',
    ],
  },

  'component.checkbox': {
    dsl: {
      "type": "Checkbox",
      "props": {
        "name": "subscribe",
        "label": "订阅版本更新通知",
        "value": true
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 布尔开关语义的勾选：同意条款、订阅通知、记住选项、启用某能力。',
      '- 一组独立选项中可多选的集合（多个 Checkbox 并列，各自独立提交）。',
      '- 表单内的 boolean 字段：声明 name 即自动注册，值为 true / false。',
      '',
      '**何时不用**',
      '',
      '- 多个互斥选项中选一个：使用 RadioGroup。',
      '- 即时启停某个能力并立即生效（如自动保存）：使用 Switch——多选 Checkbox、单选 RadioGroup、即时启停 Switch。',
      '- 「全选 / 反选」等集合控制：这是业务组合，用 Checkbox 组的半选态自行实现。',
    ].join('\n'),
    previewNote:
      '静态结构：Checkbox 为 inline-flex 包裹：勾选框（data-slot="checkbox" + data-slot="checkbox-indicator" 勾选标记）+ 旁侧 label 文本，label 经 htmlFor 关联控件 useId，点击文字即切换。Form 内声明非空 name 时外层为 data-slot="form-item" 容器（mb-4），label 仍与勾选框同行、不另起表单标签行，校验错误以 data-slot="form-error" 追加在下方。',
    variants: [
      { name: '默认（勾选 / 未勾选）', visual: '方框 + 标签文本，选中时框内显示勾', scene: '布尔选项、多选集合中的单项' },
      { name: '无 label 纯勾选框', visual: '仅方框（label 缺省不渲染）', scene: '表格行选择列、与外部文本配合的紧凑场景' },
      { name: 'Form 表单项', visual: 'form-item 容器：勾选框 + 标签同行，错误行在下方', scene: '表单内 boolean 字段（声明 name 自动注册）' },
      { name: 'disabled 禁用', visual: '半透明不可切换', scene: '只读回显、不可变更的授权项' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项（值为 boolean）' },
      { name: 'label', type: 'string', defaultValue: '—', description: '勾选框旁的标签文本（Form 内仍与勾选框同行，不另起表单标签行）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则（如必勾：required）' },
      { name: 'value', type: 'boolean', defaultValue: '—', description: '受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues）' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用切换' },
      { name: 'onChange', type: '(checked: boolean) => void', defaultValue: '—', description: '勾选变化事件，传出 boolean（Renderer 绑定 events.onChange；DSL 语义值）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（Form 内为 form-item 容器，独立渲染时为控件包裹）' },
    ],
    guidelines: [
      '- 三态边界：多选集合用多个 Checkbox，互斥单选用 RadioGroup，即时启停用 Switch，不要互相替代。',
      '- 未勾选与未填写语义不同：必勾项配 rules.required，校验文案写清后果（如「请先同意服务条款」）。',
      '- 标签文案用肯定句式（「订阅更新通知」而非「不订阅更新通知」），避免双重否定。',
      '- 一个 Checkbox 只表达一个布尔命题；需要「同意 A 且同意 B」时拆成两项。',
      '- Form 内声明非空 name 才注册字段；未声明 name 时仅作独立受控控件使用。',
    ].join('\n'),
    examplesDo: [
      '注册表单：Checkbox「我已阅读并同意服务条款」，name + rules 必填，未勾选提交被拦截。',
      '通知设置：多个 Checkbox 并列（邮件 / 短信 / 站内信），各自独立 name 随表单提交。',
      '只读回显：disabled 展示已确认的选项，用户可见但不可改。',
    ],
    examplesDont: [
      '用 Checkbox 做「启用 / 停用」的即时开关（应使用 Switch）。',
      '用多个 Checkbox 实现互斥单选（应使用 RadioGroup，否则用户可同时勾选）。',
      '必勾项不配校验，用户跳过同意直接提交。',
    ],
  },

  'component.radio-group': {
    dsl: {
      "type": "RadioGroup",
      "props": {
        "name": "period",
        "label": "统计周期",
        "direction": "horizontal",
        "options": [
          {
            "label": "按日",
            "value": "day"
          },
          {
            "label": "按周",
            "value": "week"
          },
          {
            "label": "按月",
            "value": "month"
          }
        ],
        "value": "week"
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 少量（2-5 个）互斥选项中选一个：统计周期、性别、优先级、配送方式。',
      '- 选项需要平铺对比、一次点击完成选择（相比 Select 少一次展开）。',
      '- 表单内的枚举单选字段：声明 name 即自动注册，参与校验与提交。',
      '',
      '**何时不用**',
      '',
      '- 选项较多或需搜索：使用 Select / Combobox；RadioGroup 全部平铺会挤占版面。',
      '- 选项需即时生效、切换的是同区域视图：使用 Segmented（更紧凑，且不承载表单语义）。',
      '- 布尔开关（开 / 关）：使用 Switch 或 Checkbox；RadioGroup 用于「多于两个」的互斥选项。',
      '- 可多选：使用 Checkbox 组。',
    ].join('\n'),
    previewNote:
      '静态结构：RadioGroup 为 data-slot="radio-group" 容器（Base UI 原语），每个选项为 data-slot="radio-group-item" 圆点（选中态显示 data-slot="radio-group-indicator"）+ 旁侧 label，label 经 htmlFor 关联选项自身 id，点击文字即选中该项。direction="horizontal" 时容器叠加 flex flex-wrap 横排（gap-x-6 / gap-y-2），缺省 vertical 竖排；选项级 disabled 与整体 disabled 均使圆点与文字半透明。始终受控：未选中时以空值占位，不命中任何选项。Form 内声明非空 name 时经 FieldShell 包裹（label + 校验错误行）。',
    variants: [
      { name: 'vertical 竖排（缺省）', visual: '选项纵向排列，逐行可点', scene: '选项文案较长、横向空间不足' },
      { name: 'horizontal 横排', visual: 'flex 横排自动换行（gap-x-6）', scene: '2-4 个短文案选项（如「按日 / 按周 / 按月」）' },
      { name: '选项级 disabled', visual: '单个选项半透明不可选', scene: '无权限 / 不可用的候选项' },
      { name: 'Form 表单项', visual: 'FieldShell：label + 选项组 + 校验错误行', scene: '表单内枚举单选字段（声明 name 自动注册）' },
      { name: 'disabled 整体禁用', visual: '全部选项禁用', scene: '只读回显、按当前状态不可变更' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（FieldShell 呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'options', type: 'RadioGroupOption[]', defaultValue: '[]', description: '选项列表（可含表达式解析后的数组）；项结构 { label, value: string | number | boolean, disabled? }' },
      { name: 'direction', type: "'horizontal' | 'vertical'", defaultValue: "'vertical'", description: '选项排列方向' },
      { name: 'value', type: 'string | number | boolean', defaultValue: '—', description: '受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues）' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '整体禁用；选项级禁用用 options 项的 disabled' },
      { name: 'onChange', type: '(value: string | number | boolean) => void', defaultValue: '—', description: '选中变化事件，传出选中项的原始 value（Renderer 绑定 events.onChange；DSL 语义值）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（Form 内为 form-item 容器，独立渲染时为控件包裹）' },
    ],
    guidelines: [
      '- 选项控制在 2-5 个、文案短；更多或更长时改用 Select，避免平铺占满整屏。',
      '- 选项 value 类型保持一致（string / number / boolean 不混用），否则选中态匹配错位。',
      '- direction 按文案长度选：短文案横排更紧凑，长文案竖排更易读；同一表单内保持一致。',
      '- 必选项配 rules.required 并在 label 上标明；不要靠「默认选中第一个」掩盖未填写。',
      '- 与 Segmented 的边界：需要提交进表单、有 name / rules 语义用 RadioGroup；纯视图切换用 Segmented。',
    ].join('\n'),
    examplesDo: [
      '表单「统计周期」：options 三项 + direction="horizontal"，name + rules 必填。',
      '配送方式：竖排选项，每项含一句说明文案，选择后驱动运费计算。',
      '无权限选项：选项级 disabled 并保留可见，让用户理解为何不可选。',
    ],
    examplesDont: [
      '用 RadioGroup 平铺二十个选项（应使用 Select / Combobox）。',
      '用两个选项的 RadioGroup 表达开关语义并期待即时生效（应使用 Switch）。',
      '同一组内选项 value 混用字符串与数字，回填时选中态丢失。',
    ],
  },

  'component.switch': {
    dsl: {
      "type": "Switch",
      "props": {
        "name": "autoSave",
        "label": "开启自动保存",
        "value": true
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 即时启停某项能力或状态：自动保存、消息推送、灰度开关。',
      '- 切换后立即生效、无需二次确认、不需提交按钮的布尔设置。',
      '- 表单内的 boolean 字段：声明 name 即自动注册，值为 true / false。',
      '',
      '**何时不用**',
      '',
      '- 需要用户填写完表单再一起提交的布尔项（如「同意条款」）：使用 Checkbox——多选 Checkbox、单选 RadioGroup、即时启停 Switch。',
      '- 互斥的多个选项中选一个：使用 RadioGroup。',
      '- 破坏性或高影响操作的确认（删除、下线）：使用 Dialog / Popconfirm，不要用 Switch 一键切换。',
    ].join('\n'),
    previewNote:
      '静态结构：Switch 为 inline-flex 包裹：开关轨道（data-slot="switch" + data-slot="switch-thumb" 滑块，切换时滑块平移）+ 旁侧 label 文本，label 经 htmlFor 关联控件 useId，点击文字即切换。Form 内声明非空 name 时外层为 data-slot="form-item" 容器（mb-4），label 与开关同行、不另起表单标签行，校验错误以 data-slot="form-error" 追加在下方。',
    variants: [
      { name: '默认（开 / 关）', visual: '轨道 + 滑块，开启态滑块移至右侧并高亮', scene: '即时启停的设置项' },
      { name: '无 label 纯开关', visual: '仅开关本体（label 缺省不渲染）', scene: '与外部说明文案配合的紧凑场景' },
      { name: 'Form 表单项', visual: 'form-item 容器：开关 + 标签同行，错误行在下方', scene: '表单内 boolean 字段（声明 name 自动注册）' },
      { name: 'disabled 禁用', visual: '半透明不可切换', scene: '权限不足或依赖项未就绪' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项（值为 boolean）' },
      { name: 'label', type: 'string', defaultValue: '—', description: '开关旁的标签文本（Form 内仍与开关同行，不另起表单标签行）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'value', type: 'boolean', defaultValue: '—', description: '受控值（独立渲染时生效，仅 true 视为开启）；Form 内作为字段初始值（优先于 Form initialValues）' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用切换' },
      { name: 'onChange', type: '(checked: boolean) => void', defaultValue: '—', description: '开关变化事件，传出 boolean（Renderer 绑定 events.onChange；DSL 语义值）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（Form 内为 form-item 容器，独立渲染时为控件包裹）' },
    ],
    guidelines: [
      '- 只用 true / false 两态，且切换立即生效：Three-state（未设置）场景请用 RadioGroup 或 Select 显式表达。',
      '- 高影响开关需给出后果说明与撤销路径（如「开启后所有成员可见」），必要时先经 Dialog 确认。',
      '- 依赖未就绪时用 disabled 而非隐藏，并说明原因，避免用户反复寻找入口。',
      '- 标签文案用肯定句式并描述开启后的状态（「开启自动保存」），不要用含义模糊的「模式」。',
      '- Form 内声明非空 name 才注册字段；未声明 name 时为独立受控控件，值不进表单 values。',
    ].join('\n'),
    examplesDo: [
      '设置页「自动保存」：onChange 立即写回接口，切换即生效，无需保存按钮。',
      'Form 内布尔项：name + value 初始值，提交时随表单 values 一并带出。',
      '依赖未就绪：disabled + 旁注「需先选择数据源」，用户理解为何点不动。',
    ],
    examplesDont: [
      '用 Switch 承载「同意用户协议」这类需随表单提交的布尔项（应使用 Checkbox）。',
      '用 Switch 一键删除 / 下线资源，无确认也无撤销路径。',
      '依赖项未就绪时直接隐藏开关，用户以为功能缺失。',
    ],
  },

  'component.slider': {
    dsl: {
      "type": "Slider",
      "props": {
        "name": "threshold",
        "label": "告警阈值",
        "value": 40,
        "min": 0,
        "max": 100,
        "step": 5
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 在一个连续区间内取值的调参场景：阈值、音量、透明度、缩放比例。',
      '- 用户更关注「大致比例」而非精确数值，拖动即可看到结果变化。',
      '- 需要限制取值范围的数值（min / max / step 共同约束）。',
      '',
      '**何时不用**',
      '',
      '- 需要精确录入具体数值（金额、数量、编号）：使用 NumberInput；Slider 依赖指针精度，微调困难。',
      '- 区间选择（开始 - 结束两个端点）：当前实现为单值滑杆，区间用两个 NumberInput 字段或等待区间组件。',
      '- 离散枚举选择：使用 RadioGroup / Select。',
    ].join('\n'),
    previewNote:
      '静态结构：Slider 为 Base UI 单值滑杆（data-slot="slider"）：SliderControl（data-slot="slider-control"）内 Track（data-slot="slider-track"）+ Indicator（data-slot="slider-indicator"，已选区间填充）+ 单个 Thumb（data-slot="slider-thumb"，可拖拽、支持键盘方向键微调）。min / max / step 决定轨道范围与步进；value 非 number 时回退为 min。Form 内声明非空 name 时经 FieldShell 包裹（label + 校验错误行）。',
    variants: [
      { name: '默认（0-100）', visual: '轨道 + 已选填充 + 可拖拽滑块', scene: '无特殊范围的百分比类调参' },
      { name: 'min / max 自定义范围', visual: '轨道按范围映射，拇指位置随之变化', scene: '非 0-100 的取值区间（如温度、额度）' },
      { name: 'step 离散步进', visual: '拖动吸附到 step 的整数倍', scene: '只允许特定档位取值（如 5 的倍数）' },
      { name: 'Form 表单项', visual: 'FieldShell：label + 滑杆 + 校验错误行', scene: '表单内数值字段（声明 name 自动注册）' },
      { name: 'disabled 禁用', visual: '滑杆半透明不可拖动', scene: '只读回显、联动未就绪' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（FieldShell 呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'value', type: 'number', defaultValue: '—', description: '受控值（独立渲染时生效，非 number 时回退为 min）；Form 内作为字段初始值（优先于 Form initialValues）' },
      { name: 'min', type: 'number', defaultValue: '0', description: '最小值' },
      { name: 'max', type: 'number', defaultValue: '100', description: '最大值' },
      { name: 'step', type: 'number', defaultValue: '1', description: '步长（拖动吸附与键盘微调的步距）' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用拖动' },
      { name: 'onChange', type: '(value: number) => void', defaultValue: '—', description: '拖动变化事件，传出 number（Renderer 绑定 events.onChange；DSL 语义值，拖动过程高频触发）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（Form 内为 form-item 容器，独立渲染时为滑杆本身）' },
    ],
    guidelines: [
      '- 拖动过程 onChange 高频触发：联动重活（接口保存、大计算）必须自行节流或改为拖拽结束后提交。',
      '- 必须同时给出当前值的可读回显（如旁侧文本或数字输入），滑杆本身无法表达精确数值。',
      '- min / max / step 与业务约束一致；step 过大时用户无法到达期望值，过小则难以精确停止。',
      '- 精确录入需求交给 NumberInput，Slider 适合「大致比例」；两者可组合（滑杆 + 数字框双向联动）。',
      '- Form 内声明非空 name 才注册字段；未声明 name 时为独立受控滑杆。',
    ].join('\n'),
    examplesDo: [
      '告警阈值：min={0} max={100} step={5}，旁侧文本实时显示「当前值：40」，确认后再保存。',
      '画布缩放：Slider 与 NumberInput 双向联动，拖动看效果、输入定精确值。',
      'Form 内「评分权重」：name + label，rules 限制必填，值以 number 提交。',
    ],
    examplesDont: [
      '用 Slider 录入金额、数量等必须精确的字段（应使用 NumberInput）。',
      '在 onChange 中直接发起保存请求，拖动一次打出数十个请求。',
      '不给当前值回显，用户无法知道拖到了具体哪个数值。',
    ],
  },

  'component.date-picker': {
    dsl: {
      "type": "DatePicker",
      "props": {
        "name": "statDate",
        "label": "统计区间",
        "mode": "range",
        "value": {
          "start": "2026-09-01",
          "end": "2026-09-21"
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 选择单个日期：截止日、生效日、生日（mode 缺省 single，值为 ISO 字符串）。',
      '- 选择日期区间：统计周期、报表时间范围（mode="range"，值为 { start, end }）。',
      '- 需要快捷预设快速定位：range 模式缺省提供「今天 / 本周 / 本月」，也可自定义预设。',
      '',
      '**何时不用**',
      '',
      '- 只选时间点、不含日期：使用 TimePicker；DatePicker 与 TimePicker 分开选日期与时间。',
      '- 需要日期 + 时刻的完整时间戳：组合 DatePicker + TimePicker 两个字段，不要在一个控件内混选。',
      '- 需要面向月 / 季 / 年粒度的选择面板：当前实现为日粒度日历，粒度更粗的选择需业务侧另行处理。',
    ].join('\n'),
    previewNote:
      '静态结构：DatePicker 为触发器（data-slot="datepicker-trigger"，左侧截断文本显示已选值或 placeholder、右侧 Calendar 图标）+ 受控 Popover 弹层（PopoverContent w-auto p-0）。single 为单月日历；range 为左右双面板（data-slot="datepicker-start-panel" / "datepicker-end-panel"，各自受控月份且左右至少相差一个月），选择语义为「任意面板两次点击」：首击设开始日并清空结束日，第二击不早于开始日即提交、早于则重设开始日，已有完整区间再点击即开始新一轮；区间端点与中间日期经 DayPicker modifiers 施加选中 / 过渡样式。presets 快捷栏（data-slot="datepicker-presets"，左列按钮）在 range 模式缺省内置「今天 / 本周 / 本月」，除定位型「今天」外点击即提交区间且不关弹层。Form 内声明非空 name 时外层为 data-slot="form-item" 容器（label + 控件 + data-slot="form-error"）。',
    variants: [
      { name: 'single 单日期（缺省）', visual: '单月日历，点击日期即选中并回填触发器', scene: '截止日、生效日等单个日期字段' },
      { name: 'range 日期区间', visual: '左右双月面板，端点高亮 + 中间区间过渡色', scene: '统计周期、报表时间范围' },
      { name: 'presets 内置预设', visual: '弹层左侧「今天 / 本周 / 本月」快捷列', scene: 'range 模式的高频区间（本周、本月）' },
      { name: 'presets 自定义', visual: '按 { key } / { days } / { range } 自定义快捷项，false 关闭', scene: '业务化区间（如「最近 7 天」「本财年」）' },
      { name: 'Form 表单项', visual: 'form-item 容器：label + 触发器 + 校验错误行', scene: '表单内日期字段（声明 name 自动注册）' },
      { name: 'disabled 禁用', visual: '触发器半透明不可点开', scene: '联动未就绪或只读场景' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（Form 内由 label 标签呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'mode', type: "'single' | 'range'", defaultValue: "'single'", description: '选择模式，决定值的形态（single 为 ISO 字符串，range 为 { start, end }）' },
      { name: 'value', type: 'string | DateRangeValue', defaultValue: '—', description: '受控值：single 为 ISO 日期字符串（yyyy-MM-dd），range 为 { start, end } ISO 对；Form 内作为字段初始值' },
      { name: 'onChange', type: '(value: string | DateRangeValue | undefined) => void', defaultValue: '—', description: '选中 / 范围齐备事件，传出 ISO 字符串或 { start, end }；清除传 undefined（Renderer 绑定 events.onChange）' },
      { name: 'placeholder', type: 'string', defaultValue: '—', description: '空态提示文案；缺省取 i18n key，按 mode 区分 single / range' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用触发器' },
      { name: 'presets', type: 'DatePickerPreset[] | false', defaultValue: '—', description: '快捷预设栏：range 缺省内置三项（今天 / 本周 / 本月），single 不渲染，false 显式关闭；项可为 { key, label? } / { label, days } / { label, range }' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（Form 内为 form-item 容器，独立渲染时为触发器）' },
    ],
    guidelines: [
      '- 值与格式固定为 ISO 字符串 yyyy-MM-dd（range 为 { start, end } 对象），不要传 Date 对象或本地化格式。',
      '- range 模式仅在两端齐备时触发 onChange：单端点期间无值，不要在此期间读取表单值做逻辑判断。',
      '- 日期区间用 mode="range" 而非两个 single 字段；同时需要时刻时用 DatePicker + TimePicker 组合两个字段。',
      '- presets 用于收敛高频区间；range 模式缺省已提供「今天 / 本周 / 本月」，single 模式不渲染预设栏。',
      '- 日历语言随 useI18n().locale 映射（内置 zh-CN / en-US），未知 locale 回退 en-US，交付前确认目标语言。',
    ].join('\n'),
    examplesDo: [
      '报表时间范围：mode="range" + 缺省预设，用户点「本月」即得完整区间，onChange 触发查询。',
      '表单「生效日期」：single 模式 + name + rules 必填，值为 "2026-09-21"。',
      '自定义预设：presets 传 { label: "最近 7 天", days: 7 }，贴合业务高频口径。',
    ],
    examplesDont: [
      '用两个 single DatePicker 拼区间，失去双面板与端点高亮体验（应使用 mode="range"）。',
      '把 range 模式的中间态（只选了开始日）当作有效值提交。',
      '传入 Date 对象或 "2026/09/21" 等非 ISO 字符串，回显失效。',
    ],
  },

  'component.form': {
    dsl: {
      "type": "Form",
      "events": {
        "onSubmit": {
          "action": "setState",
          "params": {
            "result": "${event}"
          }
        }
      },
      "children": [
        {
          "type": "Input",
          "props": {
            "name": "keyword",
            "label": "关键词",
            "placeholder": "输入关键词"
          }
        },
        {
          "type": "Select",
          "props": {
            "name": "status",
            "label": "状态",
            "placeholder": "选择状态",
            "options": [
              {
                "label": "全部",
                "value": "all"
              },
              {
                "label": "进行中",
                "value": "doing"
              },
              {
                "label": "已完成",
                "value": "done"
              }
            ]
          }
        },
        {
          "type": "Button",
          "props": {
            "text": "提交",
            "variant": "primary",
            "submit": true
          }
        }
      ]
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 把多个录入控件组织为一次提交：新增 / 编辑表单、筛选条件、设置面板。',
      '- 需要统一校验与错误汇总：字段声明 rules，提交时集中校验并阻止非法提交。',
      '- 需要表单联动：用 form.setValues 动作批量回填字段（如按模板快速填充）。',
      '',
      '**何时不用**',
      '',
      '- 只有一个输入项且无校验 / 提交流程：直接使用单个控件（Input / Select）+ 按钮，不必引入 Form。',
      '- 纯展示或查询条件即时生效的场景：用条件控件直接触发查询，不必包一层提交语义。',
      '- 需要复杂嵌套 / 动态增删数组字段的可视化表单设计：当前实现为扁平字段集合，复杂编排需业务侧组合。',
    ].join('\n'),
    previewNote:
      '静态结构：Form 渲染为 data-slot="form" 的原生 <form>（layout="inline" 时叠加 flex flex-wrap items-center gap-3），经 React Context 下发 values / errors / setValue / registerField；子级表单控件（Input / Select / Textarea / NumberInput / Checkbox / RadioGroup / Switch / Slider / DatePicker / Calendar / Combobox）声明非空 name 即自动注册为表单项（label / rules 生效，值由 Form 托管）。提交按钮（Button submit:true）触发时统一校验已注册字段的 required 规则，失败渲染 data-slot="form-error" 并阻止提交；通过则把 values 写入 runtime state 的 form 路径（${form.<field>} 可用）并以 values 调用 onSubmit（Renderer 放入 event 作用域）。',
    variants: [
      { name: 'vertical 竖向（缺省）', visual: 'label 在上、控件在下逐行排布', scene: '常规新增 / 编辑表单' },
      { name: 'horizontal 横向', visual: 'label 与控件同行（formItemClass 按布局切换）', scene: '字段少、label 短的表单' },
      { name: 'inline 行内', visual: 'flex 横排自动换行，控件同处一行', scene: '筛选栏、工具栏等紧凑录入区' },
      { name: 'initialValues 初始值', visual: '创建时以 initialValues 初始化 values', scene: '编辑回显（字段级 value 优先于 initialValues）' },
      { name: 'rules 校验', visual: '提交失败时错误文案展示在对应字段下方', scene: '必填 / 格式校验，阻止非法提交' },
      { name: 'onValuesChange 联动', visual: '任一字段变化即回调（changed + 全量 values）', scene: '字段间联动（如选择类型后动态调整提示）' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: "'default'", description: '表单名：form.setValues 联动动作按名寻址，同页多表单需区分命名' },
      { name: 'layout', type: "'horizontal' | 'vertical' | 'inline'", defaultValue: "'vertical'", description: '表单布局' },
      { name: 'initialValues', type: 'Record<string, unknown>', defaultValue: '—', description: '表单初始值（创建时生效；字段级 value 优先于 initialValues[name]）' },
      { name: 'onSubmit', type: '(values: Record<string, unknown>) => void', defaultValue: '—', description: '提交事件（校验通过后触发），参数为表单 values（Renderer 绑定 events.onSubmit）' },
      { name: 'onValuesChange', type: '(changed: Record<string, unknown>, values: Record<string, unknown>) => void', defaultValue: '—', description: '任一字段变化事件，传出本次变化字段与全量 values' },
      { name: 'children', type: 'ReactNode', defaultValue: '—', description: '表单内容：声明了 name 的表单控件自动成为表单项，可混排布局与其他组件' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（挂 <form> 根节点）' },
    ],
    guidelines: [
      '- 子控件必须声明非空 name 才会注册为表单项；未声明 name 的控件不会进入 values，也不会参与校验。',
      '- 初始值优先级：字段级 value > initialValues[name]，且字段级初始值仅首次注册时写入，不会覆盖用户已输入内容。',
      '- 校验当前支持 required + message：自定义文案写进 rule.message，未提供时回退 i18n 必填提示。',
      '- 提交按钮必须是 Button 且 submit:true 才会触发表单提交；普通按钮的 onClick 不经过校验流程。',
      '- 校验通过后 values 会写入 runtime state 的 form 路径（${form.<field>}），同时经 event 传入 onSubmit 作用域。',
      '- 同页多个 Form 通过 name 区分（缺省 default）；form.setValues 联动需按名指定目标表单。',
    ].join('\n'),
    examplesDo: [
      '新增表单：各字段声明 name + rules，底部 Button submit 提交，校验失败错误展示在字段下方。',
      '编辑回显：initialValues 传后端返回的对象，字段级 value 按需覆盖个别字段。',
      '筛选栏：layout="inline" + Input / Select 混排，提交后以 values 驱动列表查询。',
    ],
    examplesDont: [
      '子控件忘记声明 name，提交时 values 为空，拿不到任何输入。',
      '用普通 Button 的 onClick 直接提交数据，绕过统一校验与错误提示。',
      '把字段级 value 当作「外部动态同步」手段——它只在首次注册写入一次，后续外部变化不会回填。',
    ],
  },
};
