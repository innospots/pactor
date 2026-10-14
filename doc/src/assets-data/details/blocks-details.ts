/**
 * 区块组件完整详情（第十批 9 个组件，@pactor-app/blocks 包真实实现已核对）。
 * - API 属性与结构核对自 packages/blocks/src/components/ 下同名目录的
 *   index.tsx；9 个组件均已从包入口导出并在 register.ts 注册同名 DSL 类型
 *   （Login / EntityCard / CardList / ExpressionEditor / FieldCondition /
 *   RuleConfig / RuleExpression / ScriptEditor）；
 * - 运行态预览核对自 doc/src/components/previews/blocks-a.tsx（同一文件注册
 *   全部 9 个 component.* 预览）。
 */
import type { ComponentDetailContent } from './component-details.ts';

export const blocksDetailContents: Record<string, ComponentDetailContent> = {
  'component.entity-card': {
    dsl: {
      "type": "EntityCard",
      "props": {
        "icon": "cube",
        "title": "客户实体",
        "subtitle": "cust_profile",
        "tags": [
          { "text": "启用", "color": "green" }
        ],
        "description": "客户画像主实体，含基础属性与扩展属性。",
        "meta": "创建于 2026-09-01",
        "actions": [
          { "text": "编辑", "key": "edit" },
          { "text": "删除", "key": "remove", "variant": "text", "danger": true }
        ]
      },
      "events": {
        "onClick": {
          "action": "navigate",
          "params": {
            "to": "/entity/detail"
          }
        },
        "onAction": {
          "action": "setState",
          "params": {
            "lastAction": "edit"
          }
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 列表 / 网格页中展示业务实体摘要：图标（logo）、标题、副文案、状态标签、描述与维护信息。',
      '- 摘要卡需要承载操作入口（编辑、配置、删除等），且操作与整卡点击解耦。',
      '- 作为 CardList 的列表项底层卡片，与其他 blocks 组合组件配合。',
      '',
      '**何时不用**',
      '',
      '- 纯图文卡片、无实体语义（无操作区）：使用基础 Card。',
      '- 只展示数据字段的平铺说明（键值对）：使用 Descriptions。',
    ].join('\n'),
    previewNote:
      '静态结构：三层纵向结构——上层左侧图标（logo 图片优先，其次 icon 白名单图标，底衬 bg-muted 圆角块）+ 标题/副文案，右侧标签组（Tag，EntityCardTag 的 color 映射语义色）；中层描述（line-clamp-2 固定两行截断）与右侧 meta 平铺，仅两者任一存在时渲染；下层操作按钮组（EntityCardAction，居右，footerBackground=true 时带浅底栏背景，负 margin 对齐 Card 内边距），未配置 actions 不渲染。整卡点击与按钮点击解耦（footer 容器 stopPropagation），hoverable 时整卡手型 + hover 高亮。',
    variants: [
      { name: 'icon / logo 图标形态', visual: '白名单图标（bg-muted 圆角底）或 logo 图片（size-9 rounded-md）', scene: '无品牌图片用图标，有 logo 时 logo 优先' },
      { name: '标签组', visual: '上层右侧 Tag 语义色标签组', scene: '状态 / 分类标注（已发布、启用、灰度）' },
      { name: '操作按钮组', visual: '下层居右按钮组，支持 ButtonVariant 与 danger', scene: '实体级操作入口；footerBackground 控制浅底栏' },
      { name: 'hoverable 整卡可点', visual: '手型光标 + hover 边框 / 背景高亮', scene: '点击卡片进入详情页' },
    ],
    apiProps: [
      { name: 'icon', type: 'string', defaultValue: '—', description: '图标名（Icon 白名单）；与 logo 二选一，logo 优先' },
      { name: 'logo', type: 'string', defaultValue: '—', description: 'Logo 图片地址（alt 取 title）' },
      { name: 'title', type: 'string', defaultValue: '—', description: '主标题' },
      { name: 'subtitle', type: 'string', defaultValue: '—', description: '标题下方辅助短文案（版本号、编码等）' },
      { name: 'tags', type: 'EntityCardTag[]', defaultValue: '—', description: '上层右侧标签组：{ text, color? }' },
      { name: 'description', type: 'string', defaultValue: '—', description: '中层描述说明，固定两行高度、超出截断' },
      { name: 'meta', type: 'string', defaultValue: '—', description: '中层右侧维护信息（与描述平铺）' },
      { name: 'actions', type: 'EntityCardAction[]', defaultValue: '—', description: '下层操作按钮组：{ text, key?, variant?, danger? }；key 缺省取 text' },
      { name: 'footerBackground', type: 'boolean', defaultValue: 'true', description: '下层是否带浅底栏背景' },
      { name: 'hoverable', type: 'boolean', defaultValue: 'false', description: '整卡可点：手型 + hover 高亮' },
      { name: 'contentClassName / className / style', type: 'string / CSSProperties', defaultValue: '—', description: '内容区 / 根节点样式' },
      { name: 'onClick', type: '() => void', defaultValue: '—', description: '整卡点击（操作区不触发）' },
      { name: 'onAction', type: '(event: { key: string; text: string; index: number }) => void', defaultValue: '—', description: '操作按钮点击，回传 { key, text, index }' },
    ],
    guidelines: [
      '- 标题 + 描述只放摘要信息，实体详情通过整卡点击进入详情页，不堆砌字段。',
      '- 操作按钮按权重排列，危险操作（danger）与常规操作分组或置于末尾。',
      '- 每个 EntityCardAction 给稳定 key（缺省取 text）：事件编排按 key 分发，文案变更不破坏逻辑。',
      '- 卡片组合场景使用 CardList 统一网格 / 间距 / 空态，不逐卡手写布局。',
    ].join('\n'),
    examplesDo: [
      '实体列表页：CardList 渲染 EntityCard，onItemClick 进详情，操作「编辑 / 删除」经 onItemAction 分发。',
      '卡片墙：tags 标注「已发布 / 草稿」，footerBackground 开启浅底栏承载操作。',
    ],
    examplesDont: [
      '把整页详情字段都塞进 EntityCard（应只放摘要，详情走跳转）。',
      '在操作按钮上嵌套整卡点击语义（footer 已内置事件解耦，不应再包一层 onClick）。',
    ],
  },

  'component.card-list': {
    dsl: {
      "type": "CardList",
      "props": {
        "columns": 3,
        "createText": "新建插件",
        "items": [
          {
            "icon": "code",
            "title": "规则引擎",
            "subtitle": "v1.2.0",
            "tags": [
              { "text": "已发布", "color": "green" }
            ],
            "description": "可视化规则配置与评分引擎。",
            "actions": [
              { "text": "配置", "key": "config" }
            ]
          },
          {
            "icon": "database",
            "title": "数据源管理",
            "subtitle": "v0.9.1",
            "tags": [
              { "text": "灰度", "color": "orange" }
            ],
            "description": "数据源接入与字段元数据维护。",
            "actions": [
              { "text": "配置", "key": "config" }
            ]
          }
        ]
      },
      "events": {
        "onItemClick": {
          "action": "navigate",
          "params": {
            "to": "/plugins/detail"
          }
        },
        "onCreateClick": {
          "action": "navigate",
          "params": {
            "to": "/plugins/create"
          }
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 列表页以响应式网格展示实体摘要卡片（EntityCard），统一列数、间距与空态。',
      '- 列表需要「新建」入口（首格虚线占位卡）与结果计数（共 N 个）。',
      '',
      '**何时不用**',
      '',
      '- 行式表格列表（列对齐、排序、批量操作）：使用 Table。',
      '- 单卡片展示：直接用 EntityCard，不需要列表编排。',
    ].join('\n'),
    previewNote:
      '静态结构：根节点 data-slot="card-list"，内层网格容器 data-slot="card-list-grid"（gridTemplateColumns: repeat(columns, minmax(0,1fr)) + gap）；items 为空且未配置 createText 时渲染 Empty 空态；配置 createText 时首格渲染虚线新建占位卡（居中 icon + 文案，icon 默认 plus）；showCount 时底部渲染「共 N 个」计数（i18n pactor.cardList.total）。列表项事件在 EntityCard 回调上包装，回传 { item, index }；CardListItem 字段与 EntityCard props 同形并带索引签名，可携带额外业务字段原样回传。',
    variants: [
      { name: '正常网格', visual: 'repeat(columns, minmax(0,1fr)) 响应式网格', scene: '实体摘要卡片墙' },
      { name: '新建占位卡', visual: '首格虚线边框卡：居中图标 + createText', scene: '列表内置创建入口' },
      { name: '空态', visual: 'Empty 空态（emptyText 可定制）', scene: '无数据且无新建入口时' },
      { name: '计数条', visual: '底部「共 N 个」', scene: '结果数量反馈（showCount）' },
    ],
    apiProps: [
      { name: 'items', type: 'CardListItem[]', defaultValue: '[]', description: '卡片数据；字段与 EntityCard props 同形，可携带额外业务字段（事件原样回传）' },
      { name: 'columns', type: 'number', defaultValue: '3', description: '网格列数' },
      { name: 'gap', type: 'number', defaultValue: '16', description: '卡片间距（px）' },
      { name: 'createText', type: 'string', defaultValue: '—', description: '配置后首格展示虚线新建占位卡' },
      { name: 'createIcon', type: 'string', defaultValue: "'plus'", description: '新建占位卡图标' },
      { name: 'hoverable', type: 'boolean', defaultValue: 'false', description: '卡片整卡可点（透传 EntityCard）' },
      { name: 'showCount', type: 'boolean', defaultValue: 'false', description: '底部展示「共 N 个」计数' },
      { name: 'emptyText', type: 'string', defaultValue: 'i18n pactor.table.empty', description: '空数据文案' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '根节点样式' },
      { name: 'onItemClick', type: '(event: { item: CardListItem; index: number }) => void', defaultValue: '—', description: '整卡点击' },
      { name: 'onItemAction', type: '(event: { key: string; text: string; item: CardListItem; index: number }) => void', defaultValue: '—', description: '卡内操作按钮点击' },
      { name: 'onCreateClick', type: '() => void', defaultValue: '—', description: '新建占位卡点击' },
    ],
    guidelines: [
      '- 列表事件统一经 onItemClick / onItemAction / onCreateClick 编排，卡片内部不直接写业务逻辑。',
      '- CardListItem 的额外业务字段靠索引签名携带，事件回传完整 item，避免在事件里反查数据源。',
      '- 空态与新建入口互斥展示：有 createText 时渲染占位卡网格，不再显示 Empty。',
    ].join('\n'),
    examplesDo: [
      '插件市场：columns=3 卡片网格 + createText「新建插件」+ showCount。',
      '实体概览：items 携带 entityId 等业务字段，onItemClick 以 item.entityId 跳详情。',
    ],
    examplesDont: [
      '用 CardList 渲染行式表格数据（应使用 Table）。',
      '在 items 里塞展示逻辑所需的大对象（额外字段只放事件参数所需的最小集）。',
    ],
  },

  'component.login': {
    dsl: {
      "type": "Login",
      "props": {
        "layout": "split",
        "brand": {
          "name": "Pactor",
          "title": "资产化开发平台",
          "description": "组件 / 模板 / 规范一站式管理"
        },
        "title": "欢迎回来",
        "subtitle": "使用企业账号登录",
        "registerLink": {
          "text": "立即注册"
        },
        "forgotLink": {
          "text": "忘记密码"
        },
        "footer": "© 2026 Pactor"
      },
      "events": {
        "onSubmit": {
          "action": "setState",
          "params": {
            "loggingIn": true
          }
        },
        "onRegisterClick": {
          "action": "navigate",
          "params": {
            "to": "/register"
          }
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 登录整页：品牌展示区（logo / 名称 / 标语 / 插画）与认证表单（用户名 + 密码）组合。',
      '- 需要多种登录布局形态（分栏 / 居中 / 品牌卡 / 叠加 / 背景）按品牌调性切换。',
      '- 登录请求与后续跳转由页面编排（DSL events），组件只负责结构、校验与值上抛。',
      '',
      '**何时不用**',
      '',
      '- 嵌入卡片 / 弹窗内的小型登录表单（非整页）：使用 Form 自行组合。',
      '- 扫码登录等非常规认证形态（不在本组件范围，见设计文档 10 号变体说明）。',
    ].join('\n'),
    previewNote:
      '静态结构：布局五态——split 分栏（品牌面板 + 认证列，brandRatio 经 --login-grid 变量控制占比、窄屏品牌面板隐藏并改顶部品牌行）、centered 居中（整页渐变背景 + 居中身份 + 认证区 + 页脚）、brand-card（品牌区独立 Card + 裸表单）、overlap（品牌卡与登录卡局部叠加，叠加方向随 brandSide 镜像、品牌卡在右时内容整体右对齐）、backdrop（渐变品牌背景 + 悬浮认证卡）；brandSide 控制品牌区左右方向（split / brand-card / overlap / backdrop 生效，centered 无分栏不适用）；authVariant 三态（split/centered 生效）——plain 裸表单 / card 常规卡片 / float 大尺寸悬浮卡。认证区缺省为 Form name="login"，表单项均经 Field 承载（username / password 两个必填 Input 的 label 与必填标记归 Field、校验由 Input rules 承担，全宽 submit Button 同样置于无 label 的 Field 内与输入项对齐），校验通过后 onSubmit 上抛 { username, password }；children 插槽可整体替换内置表单（如内嵌 Tabs 切换手机验证码 / 账号密码登录），标题 / 副标题与辅助入口保留；registerLink / forgotLink 有 href 渲染 Link、无 href 渲染 button 并触发对应 onXxxClick；品牌 identity 仅配置 logo 或 name 时渲染，插画未传展示内置默认插画、传空串隐藏。',
    variants: [
      { name: 'split 分栏', visual: '品牌面板 + 认证列网格分栏（brandSide / brandRatio 可调）', scene: '常规企业登录页（默认）' },
      { name: 'centered 居中', visual: '整页渐变背景 + 居中认证区', scene: '轻品牌页、移动端优先' },
      { name: 'brand-card 品牌卡', visual: '品牌区独立 Card + 裸表单', scene: '品牌信息强的场景' },
      { name: 'overlap 叠加', visual: '品牌卡与登录卡局部叠加', scene: '视觉层次突出的营销型登录页' },
      { name: 'backdrop 背景', visual: '渐变品牌背景 + 悬浮认证卡', scene: '氛围型登录页' },
      { name: 'authVariant 认证区容器', visual: 'plain 裸表单 / card 卡片 / float 悬浮大卡', scene: '在 split / centered 内微调认证区形态' },
    ],
    apiProps: [
      { name: 'layout', type: "'split' | 'centered' | 'brand-card' | 'overlap' | 'backdrop'", defaultValue: "'split'", description: '结构模式（对应设计文档 01–12 变体编号）' },
      { name: 'brandSide', type: "'left' | 'right'", defaultValue: "'left'", description: '品牌区方向（split / brand-card / overlap / backdrop 生效；centered 无分栏不适用）。right 时品牌区镜像到右侧：split 反向分栏、brand-card 表单居左、overlap 登录卡左置并向右叠加、backdrop 两列镜像；窄屏均为认证区在前' },
      { name: 'brandRatio', type: 'number', defaultValue: '0.5', description: '品牌区分栏占比 0–1（实际钳制 0.2–0.8，仅 split）' },
      { name: 'authVariant', type: "'plain' | 'card' | 'float'", defaultValue: "'card'", description: '认证区容器形态（split / centered 生效）' },
      { name: 'brandPanelBackground', type: 'boolean', defaultValue: 'true', description: 'split 品牌面板是否带渐变背景' },
      { name: 'decor', type: 'boolean', defaultValue: 'true', description: '是否渲染默认背景装饰（圆斑 / 圆环 / 点阵 / 流线）' },
      { name: 'brand', type: 'LoginBrandInfo', defaultValue: '—', description: '品牌区配置：{ logo?, name?, title?, description?, illustration? }；居中布局仅展示 logo + name' },
      { name: 'title / subtitle', type: 'string', defaultValue: 'i18n pactor.login.title', description: '认证区标题 / 说明' },
      { name: 'usernameLabel / usernamePlaceholder', type: 'string', defaultValue: 'i18n pactor.login.*', description: '用户名标签 / 占位' },
      { name: 'passwordLabel / passwordPlaceholder', type: 'string', defaultValue: 'i18n pactor.login.*', description: '密码标签 / 占位' },
      { name: 'submitText', type: 'string', defaultValue: 'i18n pactor.login.submit', description: '提交按钮文案' },
      { name: 'registerLink / forgotLink', type: 'LoginLink', defaultValue: '—', description: '注册 / 找回密码入口：{ text, href? }；有 href 渲染 Link，否则 button + 事件' },
      { name: 'footer', type: 'string', defaultValue: '—', description: '页脚文案（版权 / 协议行）' },
      { name: 'children（插槽）', type: 'DslNode[] / ReactNode', defaultValue: '—', description: '认证区内容插槽：提供时替换内置账号密码表单（标题 / 副标题与辅助入口保留），可内嵌 Tabs 切换手机验证码 / 账号密码等多种登录方式；插槽内表单字段、校验与提交由 DSL 自行编排，onSubmit 不再生效' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '根节点样式' },
      { name: 'onSubmit', type: '(values: Record<string, unknown>) => void', defaultValue: '—', description: '内置表单校验通过后触发，参数 { username, password }；登录请求与跳转由 DSL 编排（使用 children 插槽时不生效）' },
      { name: 'onRegisterClick / onForgotClick', type: '() => void', defaultValue: '—', description: '注册 / 找回密码按钮点击（仅对应 link 无 href 时）' },
    ],
    guidelines: [
      '- 登录请求与跳转一律放 DSL events（onSubmit 之后），组件不内置接口调用。',
      '- 文案优先用 props，缺省走 i18n（pactor.login.*）；品牌信息用 brand 对象整组配置。',
      '- 布局形态（layout）与修饰配置（brandSide / authVariant / decor）正交组合，同一品牌换形态只改一个 prop。',
      '- 注册 / 找回密码入口未配置不渲染辅助行，避免空行占位。',
    ].join('\n'),
    examplesDo: [
      '企业门户：layout=split + brand（logo / name / title）+ registerLink 配置 href 跳注册页。',
      '营销活动页：layout=overlap + float 认证卡 + brand.description 强化品牌文案。',
      '多方式登录：children 插槽内嵌 Tabs（手机验证码 / 账号密码），各自 Form 独立编排提交事件。',
    ],
    examplesDont: [
      '在 onSubmit 内直接发登录请求（应上抛值，由页面 / DSL 编排）。',
      '用 Login 承载注册、找回密码等非登录流程整页（应使用 Form 组合对应页面）。',
    ],
  },

  'component.expression-editor': {
    dsl: {
      "type": "ExpressionEditor",
      "props": {
        "label": "周期表达式",
        "required": true,
        "value": "${state.formula}",
        "valueTemplate": "return ft.period({{start}}, {{end}})",
        "valueMapping": {
          "start": { "label": "起始周期", "type": "number", "default": 1, "required": true },
          "end": { "label": "结束周期", "type": "number", "default": 12, "required": true }
        }
      },
      "events": {
        "onChange": {
          "action": "setState",
          "params": {
            "formula": "${event}"
          }
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 表达式模板含动态占位符（如 `return ft.period(${start}, ${end})`），需要以表单控件结构化编辑占位参数。',
      '- 同一表达式既要结构化编辑、也要直接编辑表达式文本（display / edit 两步编辑）。',
      '- 需要表达式字符串与控件值双向同步：外部赋值（AI 填充、表单回显）反向解析回控件。',
      '',
      '**何时不用**',
      '',
      '- 自由代码 / 脚本输入（语法高亮、函数联想）：使用 ScriptEditor。',
      '- 单行「字段 + 操作符 + 值」条件编辑：使用 FieldCondition。',
      '- 无模板、无占位符的普通文本输入：使用 Input / Textarea。',
    ].join('\n'),
    previewNote:
      '静态结构：根节点为纵向编辑器容器——顶部左侧 label（required 时带 *），右侧按钮随状态切换（display 态出「编辑」，edit 态出「取消 / 确定」，viewOnly / readonly 隐藏）；display 态展示可编辑表达式文本（Textarea，实时 emit）；edit 态按 valueTemplate 的占位符拆分（统一正则 /\\$\\{(\\w+)\\}|\\{\\{(\\w+)\\}\\}/g 同时匹配 ${key} 与 {{key}} 两种写法——DSL props 内联书写时用 {{key}} 避免被表达式引擎提前求值；未在 valueMapping 定义的占位符保留字面量、同 key 去重）渲染子字段控件——type=select 用 SearchableSelect（>10 条启用搜索）、number 用数字输入、fieldCondition 内嵌 FieldCondition（变更经 conditionToStatement 输出语句串、外部值经 statementToCondition 反向回填，用户编辑后不再被覆盖）、其余回退文本输入；确定时逐项执行 validateMappingValue（required 优先、pattern 正则次之），未通过写入 draftErrors 并阻断，同时经 onValidityChange 上报；viewOnly 态以禁用控件形态只读展示解析值；valueTemplate 为空渲染 null。',
    variants: [
      { name: 'display / edit 两步编辑', visual: '表达式文本区 ↔ 结构化子字段表单', scene: '既有表达式文本直编灵活性，又有模板参数控件校验' },
      { name: 'viewOnly 只读展示', visual: '解析值以禁用控件形态呈现，无操作按钮', scene: '详情页复用同一结构回显' },
      { name: 'mapping 控件 type 分发', visual: 'select / number / fieldCondition / 文本输入', scene: '占位参数按配置渲染对应控件' },
      { name: 'readonly 只读文本', visual: '表达式文本只读、隐藏编辑入口', scene: '仅允许直接编辑表达式文本的场景' },
    ],
    apiProps: [
      { name: 'id', type: 'string', defaultValue: '—', description: '根节点 id' },
      { name: 'value', type: 'string', defaultValue: '—', description: '受控值（组合后的表达式字符串）' },
      { name: 'onChange', type: '(value: string) => void', defaultValue: '—', description: '表达式变更回调（display 态实时 emit）' },
      { name: 'valueTemplate', type: 'string', defaultValue: '—', description: '表单值模板（如 "return ft.period(${a}, ${b})"）；空串时渲染 null。占位符支持 ${key} 与 {{key}} 两种写法，DSL props 内联书写时须用 {{key}}（${ 会被 DSL 表达式引擎提前求值）' },
      { name: 'valueMapping', type: 'Record<string, ExpressionMappingItem>', defaultValue: '—', description: '模板占位符（${key} / {{key}}）到控件配置的映射；未映射占位符保留字面量' },
      { name: 'optionSources', type: 'Record<string, unknown>', defaultValue: '—', description: '页面级候选源集合；仅静态 { options } 条目生效，远程 { request } 条目按空候选渲染' },
      { name: 'label', type: 'string | null', defaultValue: '—', description: '字段标签（头部左侧）' },
      { name: 'required', type: 'boolean', defaultValue: 'false', description: '必填标记（label 后显示 *）' },
      { name: 'readonly', type: 'boolean', defaultValue: 'false', description: '表达式文本只读（隐藏编辑按钮）' },
      { name: 'viewOnly', type: 'boolean', defaultValue: 'false', description: '只读展示模式：控件禁用、隐藏编辑 / 确定 / 取消按钮' },
      { name: 'size', type: "'small' | 'middle' | 'large'", defaultValue: "'middle'", description: '控件尺寸令牌：small h-8 / middle h-9（默认）/ large h-10；内部控件同令牌联动，与基础表单控件混排保持一致' },
      { name: 'className', type: 'string', defaultValue: '—', description: '根容器类名' },
      { name: 'onValidityChange', type: '(invalid: boolean) => void', defaultValue: '—', description: '编辑态草稿存在未通过校验项时上报 true，供外层表单提交前阻断' },
    ],
    guidelines: [
      '- 占位符 key 与 valueMapping 一一对应：模板中出现的 ${key} 都应在 mapping 中定义，否则保留字面量造成表达式不完整。',
      '- 校验写在 mapping 的 validation（pattern 正则 + message），编辑态逐项校验，不通过阻断「确定」。',
      '- fieldCondition 类型以表达式字符串双向转换（conditionToStatement / statementToCondition），适合条件参数位。',
      '- 远程 optionSource（{ request }）本期不支持、按空候选渲染；需要远程数据由页面先取数转静态 options。',
      '- 外部程序化赋值会反向解析回控件，赋值格式需与模板一致；解析失败保持现状。',
    ].join('\n'),
    examplesDo: [
      '周期表达式：valueTemplate "return ft.period(${start}, ${end})"，start / end 映射为 number 控件。',
      '带条件的表达式：${filter} 映射 fieldCondition 类型，确定后组合出含条件语句的表达式串。',
      '详情页回显：viewOnly + 相同 valueMapping，复用编辑态的结构化控件形态。',
    ],
    examplesDont: [
      '把自由代码（Python 脚本）放进表达式模板（应使用 ScriptEditor）。',
      '只给 valueTemplate 不给 valueMapping：占位符全部保留字面量，编辑态无控件可填。',
      '对远程 optionSource 期望直接生效（本期按空候选渲染，需页面预取）。',
    ],
  },

  'component.field-condition': {
    dsl: {
      "type": "FieldCondition",
      "props": {
        "value": "${state.condition}",
        "fields": [
          { "featureCode": "age", "featureName": "年龄", "fieldType": "NUMBER" },
          { "featureCode": "name", "featureName": "姓名", "fieldType": "STRING" },
          { "featureCode": "registerTime", "featureName": "注册时间", "fieldType": "DATE" }
        ]
      },
      "events": {
        "onChange": {
          "action": "setState",
          "params": {
            "condition": "${event}"
          }
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 以「字段 + 操作符 + 值」行式 UI 可视化编辑 AND/OR 条件组。',
      '- 作为其他业务组件的内嵌控件（ExpressionEditor 的 fieldCondition 类型控件）。',
      '- 需要条件树与表达式字符串互转（conditionToStatement / statementToCondition）。',
      '',
      '**何时不用**',
      '',
      '- 带权重 / 评分的评分规则条件（每条条件附 score）：使用 RuleConfig。',
      '- 含函数调用、运算符混排的自由表达式：使用 ExpressionEditor 或 RuleExpression。',
    ].join('\n'),
    previewNote:
      '静态结构：根节点为条件组容器——组内 >1 条时顶部展示「且 / 或」relation 切换按钮（AND=蓝 / OR=橙）；每条条件一行：字段（SearchableSelect 选候选字段）→ 操作符（Select，w-28 固定宽，13 个操作符按 fieldType 白名单过滤）→ 值输入（NUMBER→数字 Input、DATE→DatePicker 弹层日历、BETWEEN→双值输入（日期为双 DatePicker）以 ~ 分隔、无值操作符 HASVAL / NOHASVAL / TRUE / FALSE 隐藏值输入）；行内全部控件（字段 / 操作符 / 值输入）统一走 control-size 尺寸令牌、随 size prop 联动（small h-8 / middle h-9 / large h-10），与基础表单控件混排高度一致；行尾删除按钮（组内仅 1 条时隐藏），底部「添加条件」按钮（disabled 时隐藏）。当前实现单层结构：只渲染第一个分组，根 relation 仅用于组间连接；字段变更重置操作符与值，操作符变更在值语义变化时重置 value；statementToCondition 仅支持单层解析（顶层 || 组成单个 OR 组，否则 && 组成 AND 组，支持生成器外层括号与简单 AI 格式），无法解析返回 null。',
    variants: [
      { name: '操作符按字段类型过滤', visual: '13 个操作符，按 fieldType 白名单收敛', scene: 'BOOLEAN 只出 TRUE / FALSE，NUMBER / DATE 才出 BETWEEN，IN / NOT_IN 限 NUMBER / STRING' },
      { name: 'BETWEEN 范围输入', visual: '双值输入，~ 分隔（日期为双 DatePicker）', scene: '数值 / 日期区间条件' },
      { name: '无值操作符', visual: 'HASVAL / NOHASVAL / TRUE / FALSE 隐藏值输入', scene: '只看有无值的存在性条件' },
      { name: 'relation 切换', visual: 'AND=蓝 / OR=橙「且 / 或」', scene: '组内 >1 条时切换连接方式' },
      { name: 'size 尺寸令牌', visual: 'small / middle（默认）/ large 三档，行内控件同档联动', scene: '与基础表单控件混排时对齐页面密度' },
    ],
    apiProps: [
      { name: 'value', type: 'FieldConditionValue', defaultValue: 'defaultFieldConditionValue()', description: '受控条件树：{ relation, children: 分组[] }，每条 { field, term, value? }' },
      { name: 'onChange', type: '(value: FieldConditionValue) => void', defaultValue: '—', description: '条件树变更回调' },
      { name: 'fields', type: 'ConditionFieldOption[]', defaultValue: '[]', description: '候选字段（datasource.json 结构：featureCode / featureName / fieldType / recommended）' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用：隐藏添加 / 删除入口，控件全部禁用' },
      { name: 'size', type: "'small' | 'middle' | 'large'", defaultValue: "'middle'", description: '控件尺寸令牌：small h-8 / middle h-9（默认）/ large h-10；内部控件同令牌联动，与基础表单控件混排保持一致' },
    ],
    guidelines: [
      '- fields 来自 datasource.json 结构，featureCode 唯一；fieldType（DATE / STRING / NUMBER / BOOLEAN）决定操作符白名单，必须准确。',
      '- 条件树 ↔ 语句串互转只支持单层结构：多组嵌套条件暂无法表示，设计时避免深嵌套。',
      '- 表达式回填走 statementToCondition，解析失败返回 null——外部赋值格式要符合「组内 && 、组间 ||」约定。',
    ].join('\n'),
    examplesDo: [
      '筛选器：fields 传数据集字段，用户搭「age > 18 且 status = ACTIVE」。',
      'ExpressionEditor 的条件参数位：fieldCondition 控件输出语句串拼入表达式模板。',
    ],
    examplesDont: [
      '用 FieldCondition 做带评分的规则条件（应使用 RuleConfig）。',
      '依赖多层嵌套条件组（statementToCondition 无法表示，会被解析失败）。',
    ],
  },

  'component.rule-config': {
    dsl: {
      "type": "RuleConfig",
      "props": {
        "value": "${state.rule}"
      },
      "events": {
        "onChange": {
          "action": "setState",
          "params": {
            "rule": "${event}"
          }
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 评分规则配置：整体权重（score）+ 多条带操作符 / 取值 / 评分的条件。',
      '- 以对象值接入 react-hook-form 的场景（配合 isRuleConfigComplete / getIncompleteConditions 做完整性校验）。',
      '',
      '**何时不用**',
      '',
      '- 无评分语义的纯过滤条件：使用 FieldCondition。',
      '- 自由表达式规则：使用 RuleExpression / ExpressionEditor。',
    ].join('\n'),
    previewNote:
      '静态结构：根节点为规则配置容器——顶部「权重」数字输入（1–1000 整数，输入中允许清空、仅合法值实时 commit、失焦回退默认 1）；下方条件列表，每行：操作符 Select（13 个 ConditionOpt：GREATER / GREATER_EQUAL / LESS_EQUAL / LESS / EQUAL / IN / NOT_IN / UNEQUAL / LIKE / NULL / HASVAL / NOTNULL / BETWEEN）→ 值输入（BETWEEN→双 number 输入 ~ 分隔、IN / NOT_IN→TagInput 标签多值（Enter 添加、去重、× 删除）、数值类操作符→number 输入、其余→text 输入、无值操作符 NULL / HASVAL / NOTNULL 不渲染）→ 评分 number 输入；行尾删除按钮。disabled 为只读展示形态（权重 / 操作符文案 + 格式化值 + 评分: x 纯文本）。条件 key 缺失或重复时模块级自增补齐唯一 key；操作符切到 BETWEEN 时 value 重置为 []、其余变更置 undefined；编辑态行内提示「请填写取值 / 请填写评分」（getConditionIssue）。',
    variants: [
      { name: '编辑形态', visual: '权重输入 + 条件行（操作符 / 取值 / 评分）', scene: '表单内配置评分规则' },
      { name: '只读展示形态（disabled）', visual: '权重与条件以纯文本呈现', scene: '详情回显 / 审批只读' },
      { name: '多值取值', visual: 'IN / NOT_IN 渲染 TagInput 标签', scene: '枚举集合条件' },
      { name: '范围取值', visual: 'BETWEEN 双输入 ~ 分隔', scene: '数值区间条件' },
    ],
    apiProps: [
      { name: 'value', type: 'RuleConfigValue', defaultValue: '—', description: '受控值：{ score?: number; ruleConditions: Condition[] }' },
      { name: 'onChange', type: '(value: RuleConfigValue) => void', defaultValue: '—', description: '规则值变更回调' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'true 时为只读展示形态' },
      { name: 'size', type: "'small' | 'middle' | 'large'", defaultValue: "'middle'", description: '控件尺寸令牌：small h-8 / middle h-9（默认）/ large h-10；内部控件同令牌联动，与基础表单控件混排保持一致' },
    ],
    guidelines: [
      '- 接入 react-hook-form 用 validate 组合 isRuleConfigComplete / getIncompleteConditions：对象值对 required 恒为真值，必须显式校验。',
      '- 权重约定 1–1000 整数，超出钳制；条件取值 / 评分成对出现（无值操作符除外）。',
      '- 后端条件 key 缺失 / 重复时组件自动补齐，无需页面预处理。',
      '- BETWEEN 兼容后端逗号字符串 "3,5" 与数组（normalizeBetweenValue），回显无需转格式。',
    ].join('\n'),
    examplesDo: [
      '评分模型表单：RuleConfig 接 react-hook-form，validate 引用 getIncompleteConditions 拦截未完成条件。',
      '详情回显：disabled + 同一 RuleConfigValue 只读展示规则。',
    ],
    examplesDont: [
      '依赖 RHF 的 required 规则判断 RuleConfig 是否填写（对象值恒真，必须用 isRuleConfigComplete）。',
      '用 RuleConfig 配纯筛选条件（应使用 FieldCondition）。',
    ],
  },

  'component.rule-expression': {
    dsl: {
      "type": "RuleExpression",
      "props": {
        "value": "${state.ruleExpr}",
        "placeholder": "输入字段名匹配候选，Enter 选中为 chip",
        "options": [
          { "label": "年龄", "value": "age" },
          { "label": "注册时间", "value": "registerTime" },
          { "label": "订单金额", "value": "orderAmount" }
        ]
      },
      "events": {
        "onChange": {
          "action": "setState",
          "params": {
            "ruleExpr": "${event}"
          }
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 自由文本操作符与特征字段混排的规则表达式输入（如「age > 18 && status == 已激活」中字段以 chip 呈现）。',
      '- 需要同时拿到表达式串、可读串与选中字段数组（RuleExpressionValue 三元组）。',
      '',
      '**何时不用**',
      '',
      '- 结构化「字段 + 操作符 + 值」行编辑：使用 FieldCondition。',
      '- 按模板占位符拆分的表达式：使用 ExpressionEditor。',
    ].join('\n'),
    previewNote:
      '静态结构：根节点为相对定位容器，内层 contentEditable 富文本输入框（role="textbox"、aria-multiline、min-h-9 高度随内容增长，placeholder 经 data-placeholder + empty:before 伪元素实现）；选中的特征字段渲染为不可编辑 chip（span 带 dataset.value / dataset.label，内含删除按钮 aria-label="remove-<value>"）；输入时取光标前尾部词（正则 [\\w一-龥]+$）对 options 的 label 做不区分大小写 includes 匹配，候选列表（onMouseDown preventDefault 防失焦）支持上下键循环、Enter 选中（无候选时换行）；Backspace / Delete 紧贴 chip 时整体删除。序列化：字段 token 与文本 token（操作符）间以空格分隔，expression 用字段 value、expressionLabel 用 label、sourceField 收集全部字段 value；外部值变化经 lastEmittedRef 跳过自身回环后按 sourceField 顺序在 expression 中定位各字段重建 DOM（候选变更时未匹配字段追加为 chip）。',
    variants: [
      { name: 'text token', visual: '自由文本（操作符 / 字面量）', scene: '表达式骨架与操作符输入' },
      { name: 'field chip', visual: '不可编辑芯片（label 展示 + 删除按钮）', scene: '特征字段插槽，整体删除' },
      { name: '候选列表', visual: '尾部词匹配的下拉候选，键盘循环 + Enter 选中', scene: '按 label 模糊匹配特征字段' },
    ],
    apiProps: [
      { name: 'options', type: 'RuleExpressionOption[]', defaultValue: '[]', description: '特征字段候选：{ label, value }；label 用于匹配与展示，value 写入 sourceField' },
      { name: 'value', type: 'RuleExpressionValue | string | null', defaultValue: '—', description: '受控值：{ expression, expressionLabel, sourceField } 或字符串（解析为单个文本 token）' },
      { name: 'onChange', type: '(value: RuleExpressionValue) => void', defaultValue: '—', description: '值变化回调，回传完整三元组' },
      { name: 'placeholder', type: 'string', defaultValue: '—', description: '占位符（空态伪元素展示）' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用：contentEditable 关闭，chip 不渲染删除按钮' },
      { name: 'id', type: 'string', defaultValue: '—', description: '编辑器 DOM 的 id' },
      { name: 'size', type: "'small' | 'middle' | 'large'", defaultValue: "'middle'", description: '控件尺寸令牌：small h-8 / middle h-9（默认）/ large h-10；内部控件同令牌联动，与基础表单控件混排保持一致' },
      { name: 'className', type: 'string', defaultValue: '—', description: '外层容器类名' },
    ],
    guidelines: [
      '- 候选字段的 label 用于用户匹配、value 写入 sourceField：label 要可读且尽量唯一，避免同名前缀误匹配。',
      '- 外部赋值（AI 填充 / 表单重置）按 sourceField 在 expression 中定位回填；两者不一致时以 sourceField 为准。',
      '- 组件仅做输入与序列化，表达式合法性由上层规则引擎校验。',
    ].join('\n'),
    examplesDo: [
      '规则条件输入：options 传特征字段表，用户输入「age > 18 && status == [chip:已激活]」。',
      'AI 回填：外部赋完整 RuleExpressionValue，编辑器按 sourceField 重建 chip 结构。',
    ],
    examplesDont: [
      '期望 RuleExpression 校验表达式语义（只负责输入与三元组输出）。',
      '把 field chip 当普通文本逐字删除（紧贴 chip 时 Backspace 整体删除，符合插槽语义）。',
    ],
  },

  'component.script-editor': {
    dsl: {
      "type": "ScriptEditor",
      "props": {
        "value": "${state.script}",
        "language": "python",
        "height": 200,
        "placeholder": "输入脚本，函数 / 变量自动联想",
        "functions": [
          { "name": "SUM", "description": "求和", "parameters": [{ "name": "field", "type": "string" }] }
        ],
        "variables": [
          { "name": "order_amount", "type": "number", "description": "订单金额" }
        ]
      },
      "events": {
        "onChange": {
          "action": "setState",
          "params": {
            "script": "${event}"
          }
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 表单内脚本 / 代码输入：Python 语法高亮、行号、自动补全。',
      '- 需要自定义函数（snippet 补全，如 SUM(${1:field})）与变量名联想。',
      '',
      '**何时不用**',
      '',
      '- 简短表达式（单行、无语法高亮需求）：使用 Input / Textarea 或 ExpressionEditor。',
      '- 只读代码展示（无编辑需求）：使用 CodeBlock。',
    ].join('\n'),
    previewNote:
      '静态结构：外层容器内嵌 Ace 编辑器（挂载时动态 import ace-builds，规避 SSR；加载失败静默保留空容器）——theme textmate、showPrintMargin=false、highlightActiveLine、tabSize=4 软 Tab、enableLiveAutocompletion + enableSnippets，自定义 completer 由 buildScriptCompletions(functions, variables) 构建（函数以 snippet 补全、变量直接补全名称），worker 关闭（避免 URL 404）；语言模式按需加载，本期仅 python（mode + snippets 一并注册），未知值回退纯文本；受控模式：外部 value 变化仅当与编辑器内容不同才 setValue（避免光标跳动），编辑器 change 经 ref 调用最新 onChange；functions / variables 变化以 setOptions 热更新联想；readonly 时只读 + 外层 bg-muted；空内容时渲染绝对定位占位覆盖层（pointer-events-none）；卸载时 destroy 编辑器。',
    variants: [
      { name: 'python 模式', visual: '语法高亮 + python snippets', scene: '脚本 / 表达式输入（默认）' },
      { name: '纯文本回退', visual: '无高亮纯文本', scene: '未注册的语言值' },
      { name: 'readonly 只读', visual: '只读编辑器 + 灰底', scene: '脚本回显' },
      { name: '自定义联想', visual: '函数 snippet / 变量名补全', scene: '平台函数（SUM / COUNT…）与变量提示' },
    ],
    apiProps: [
      { name: 'id', type: 'string', defaultValue: '—', description: '编辑器容器 DOM 的 id' },
      { name: 'value', type: 'string', defaultValue: '—', description: '受控值（代码内容）' },
      { name: 'onChange', type: '(value: string) => void', defaultValue: '—', description: '内容变化回调（Ace change 事件）' },
      { name: 'placeholder', type: 'string', defaultValue: '—', description: '内容为空时的占位覆盖层' },
      { name: 'language', type: 'string', defaultValue: "'python'", description: '语法模式；未知值回退纯文本' },
      { name: 'functions', type: 'ScriptFunctionDef[]', defaultValue: '—', description: '自定义函数联想：{ name, description?, parameters? }，以 snippet 补全' },
      { name: 'variables', type: 'ScriptVariableDef[]', defaultValue: '—', description: '自定义变量联想：{ name, type?, description? }' },
      { name: 'readonly', type: 'boolean', defaultValue: 'false', description: '只读模式（外层加灰底）' },
      { name: 'height', type: 'number', defaultValue: '160', description: '编辑器高度（px）' },
      { name: 'className', type: 'string', defaultValue: '—', description: '外层容器类名' },
    ],
    guidelines: [
      '- 平台自定义函数经 functions 以 snippet 形式联想（含参数占位符），避免用户记函数签名。',
      '- 语言模式按需注册（MODE_LOADERS），新增语言需同时注册 mode 与 snippets 模块（避免按 URL 404）。',
      '- 受控值变更尽量小步提交：组件已做内容差异比对，外层无需节流。',
    ].join('\n'),
    examplesDo: [
      '指标计算脚本：language=python + functions=[{ name: "SUM", parameters: [{ name: "field" }] }]，输入 SUM( 即得 snippet 补全。',
      '回显只读：readonly + value 展示已保存脚本。',
    ],
    examplesDont: [
      '把 ScriptEditor 用于单行表达式输入（应使用 ExpressionEditor / Input）。',
      '期望未注册的语言自动高亮（本期仅 python，其余回退纯文本）。',
    ],
  },

  'component.site-footer': {
    dsl: {
      "type": "SiteFooter",
      "props": {
        "brand": {
          "name": "Pactor",
          "description": "DSL 驱动的应用构建平台"
        },
        "groups": [
          {
            "title": "产品",
            "links": [
              { "text": "组件库", "href": "/components" },
              { "text": "模板中心", "href": "/templates" }
            ]
          },
          {
            "title": "资源",
            "links": [
              { "text": "反馈问题", "href": "/feedback" }
            ]
          }
        ],
        "copyright": "© 2026 Pactor",
        "bottomLinks": [
          { "text": "隐私协议", "href": "/privacy" },
          { "text": "服务条款" }
        ]
      },
      "events": {
        "onLinkClick": {
          "action": "setState",
          "params": {
            "lastLink": "服务条款"
          }
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 站点 / 应用级页脚：品牌区（logo / 名称 / 描述）+ 多列链接组 + 底部版权栏的组合。',
      '- 需要统一承载「备案号 / 隐私协议 / 服务条款」等法务类辅助链接。',
      '- 作为业务页面外壳的一部分，与登录页、控制台布局配套收尾。',
      '',
      '**何时不用**',
      '',
      '- 页面骨架内嵌的页脚槽位（Layout 的 Footer 子区域）：使用 Layout / Footer，二者职责不同。',
      '- 富交互页脚（订阅表单、二维码、地图等定制区块）：本组件为展示型，不提供插槽。',
    ].join('\n'),
    previewNote:
      '静态结构：根节点为 <footer data-slot="site-footer">（border-t + bg-muted/40）；主区 data-slot="site-footer-main"（max-w-6xl 居中，flex-col / md:flex-row 响应式）左侧品牌列 data-slot="site-footer-brand"（logo 图片 size-8 圆角 + 名称 + 描述，任一存在才渲染），右侧链接组区 data-slot="site-footer-groups"（grid 2/3 列自适应，每组 data-slot="site-footer-group"：标题 + 链接列表）；底部栏 data-slot="site-footer-bottom"（border-t 分隔，copyright 左、bottomLinks 右，窄屏居中堆叠）。链接双形态：有 href 渲染 Link（<a>，SPA 跳转语义），无 href 渲染 button（data-slot="site-footer-link"）并触发 onLinkClick 回传 { key, text }（key 缺省取 text）。brand / groups / copyright+bottomLinks 全部为空时渲染 null。',
    variants: [
      { name: '完整形态', visual: '品牌列 + 链接列组 + 底部版权栏', scene: '官网 / 业务站点标准页脚' },
      { name: '仅底部栏', visual: 'copyright + 辅助链接单行', scene: '控制台页脚（无品牌诉求）' },
      { name: 'href 链接', visual: '渲染 <a>，SPA 站内跳转', scene: '站内页跳转' },
      { name: 'button 链接', visual: '无 href 渲染 button，事件上抛', scene: '需要动作编排的入口（反馈、客服等）' },
      { name: '响应式', visual: '窄屏上下堆叠、底部栏居中；宽屏左右分栏', scene: '移动端浏览' },
    ],
    apiProps: [
      { name: 'brand', type: 'SiteFooterBrand', defaultValue: '—', description: '品牌区配置：{ logo?, name?, description? }；未配置不渲染品牌列' },
      { name: 'groups', type: 'SiteFooterLinkGroup[]', defaultValue: '—', description: '链接列组：{ title, links: { text, href? }[] }；未配置不渲染链接区' },
      { name: 'copyright', type: 'string', defaultValue: '—', description: '底部栏版权文案' },
      { name: 'bottomLinks', type: 'SiteFooterLink[]', defaultValue: '—', description: '底部栏辅助链接（备案号 / 隐私协议 / 服务条款）' },
      { name: 'onLinkClick', type: '(event: { key: string; text: string }) => void', defaultValue: '—', description: '链接点击（仅无 href 的链接），key 缺省取 text（对齐 EntityCardAction 约定）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 与 Layout 子区域 Footer 区分：Layout Footer 是页面骨架槽位，SiteFooter 是独立站点页脚资产。',
      '- 链接列组按信息架构分组（产品 / 资源 / 支持），每组 3–5 条为宜，标题用名词短语。',
      '- 法务类链接（隐私协议 / 服务条款 / 备案号）统一放 bottomLinks，与产品链接分层。',
      '- 无 href 的链接用于动作型入口（打开反馈表单、唤起客服），事件经 onLinkClick 编排，不在组件内写业务。',
    ].join('\n'),
    examplesDo: [
      '官网页脚：brand + 三组链接列（产品 / 资源 / 支持）+ copyright + 备案 / 隐私链接。',
      '控制台收尾：仅 copyright「© 2026 Pactor · 京ICP备XXXXXXXX号」+ 服务条款 bottomLink。',
    ],
    examplesDont: [
      '把 SiteFooter 放进 Layout 的 Footer 槽位表达页面页脚（应使用 Layout / Footer）。',
      '把品牌描述写成长文案（描述是副文案，不超过两行）。',
    ],
  },
};
