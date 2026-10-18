/**
 * 数据展示分类完整详情（第五批组件，packages/ui 真实实现已核对）。
 * API 属性逐一提炼自 packages/ui/src/components/components/ 下对应适配器
 * （List / Tree / Descriptions / Timeline / Image / QRCode / Segmented 的 Props JSDoc）。
 */

import type { ComponentDetailContent } from './component-details.ts';

export const dataDisplayDetailContents: Record<string, ComponentDetailContent> = {
  'component.list': {
    dsl: {
      "type": "List",
      "props": {
        "items": [
          {
            "key": "1",
            "title": "订单 #PO20260922001",
            "description": "金额 ¥1,280.00 · 已支付"
          },
          {
            "key": "2",
            "title": "订单 #PO20260922002",
            "description": "金额 ¥356.00 · 待审核"
          }
        ],
        "split": true
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 纵向展示同类对象集合：成员、文件、动态、消息摘要等结构一致的条目。',
      '- 条目以浏览、识别为主：标题 + 辅助描述 + 头像 / 缩略图 + 行尾元信息。',
      '- 内容区或卡片内的轻量列表，行数有限、无复杂行内操作。',
      '',
      '**何时不用**',
      '',
      '- 承载一个独立主题或对象摘要：使用 Card；List 表达的是集合而非单个对象。',
      '- 需要按行列对齐、排序、筛选或行内密集操作结构化数据：使用 Table；高密度编辑与虚拟化使用 DataTable。',
      '- 展示层级数据：使用 Tree；按时间顺序展示事件：使用 Timeline。',
      '- 超大数据量的连续滚动：List 不分页不虚拟化，应使用带加载策略的专业列表方案。',
    ].join('\n'),
    previewNote:
      '静态结构：List 渲染为 <ul> 根节点（data-slot="list"），每行 <li> 为 flex 三段式——左侧可选圆形 avatar（avatar 值匹配 http(s):/data:/路径协议时渲染 36px 圆形 <img>，否则渲染同尺寸圆形占位文本块）、中部 title（font-medium）与可选 description（弱化色，均单行 truncate 截断）、右侧可选 extra 弱化文本。split（缺省 true）以 divide-y 实现行间分隔线，bordered 为根节点外边框与圆角；items 为空时复用 Empty 原语渲染「暂无数据」空态（bordered 仍生效）。',
    variants: [
      { name: '默认（split）', visual: '行间细分隔线的纵向列表', scene: '常规对象集合，缺省形态' },
      { name: 'split=false 无分隔', visual: '无分隔线的紧凑行', scene: '行数少或依靠留白分组的轻量列表' },
      { name: 'bordered 带边框', visual: '外边框 + 圆角容器', scene: '独立成块的列表区，需与页面背景区分边界' },
      { name: '带头像（图片）', visual: '36px 圆形图片', scene: '成员、联系人等有人格化头像的条目' },
      { name: '带头像（占位文本）', visual: '36px 圆形灰底文本块', scene: '无图时用首字 / 缩写占位（如「张」「API」）' },
      { name: '空态', visual: 'Empty 原语「暂无数据」', scene: 'items 为空或数据未返回时的兜底呈现' },
    ],
    apiProps: [
      { name: 'items', type: 'ListItemData[]', defaultValue: '[]', description: '列表数据（可含表达式解析后的数组）；项结构 { key?, title, description?, avatar?, extra? }；为空时渲染空态' },
      { name: 'split', type: 'boolean', defaultValue: 'true', description: '行间分隔线' },
      { name: 'bordered', type: 'boolean', defaultValue: 'false', description: '外边框（含圆角）；空态同样生效' },
      { name: 'className', type: 'string', defaultValue: '—', description: '通用：根节点 class（与内置样式合并）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '通用：根节点内联样式' },
    ],
    guidelines: [
      '- 行结构固定为三段：avatar（可选）→ title + description → extra（可选）；title 为主文本、description 与 extra 为弱化辅文本，均单行截断，长内容靠详情页承载。',
      '- avatar 按值形态判定：图片地址（http(s):/data:/相对路径）渲染图片，其余文本渲染圆形占位块；同列表内保持一致形态。',
      '- extra 仅承载字符串元信息（时间、数量、状态短文案），不放操作按钮；行内操作场景改用 Table。',
      '- items 为空时必须呈现空态，不留空白区域；空态下 bordered 边框保留，避免容器塌陷。',
      '- List 无内置分页 / 加载更多 / 虚拟化，数据量受控（建议数十行内）；行间分隔（split）缺省开启，密集列表保持默认。',
    ].join('\n'),
    examplesDo: [
      '成员列表：avatar 传头像图片地址，title 姓名，description 角色，extra 展示加入时间。',
      '接口资源列表：avatar 传「API」占位文本，split + bordered 组成独立资源区块。',
      '数据未返回：items 传空数组，自动呈现「暂无数据」空态，容器边框不塌。',
    ],
    examplesDont: [
      '在 extra 中塞入操作按钮或长段文本（extra 仅字符串元信息；操作列表改用 Table）。',
      '用 List 展示层级数据或时间线（应分别使用 Tree / Timeline）。',
      '同列表内混用图片头像与文本占位头像，或关闭 split 后条目过密无法分辨行边界。',
    ],
  },

  'component.tree': {
    dsl: {
      "type": "Tree",
      "props": {
        "treeData": [
          {
            "key": "org",
            "title": "组织架构",
            "children": [
              {
                "key": "dev",
                "title": "研发部",
                "children": [
                  {
                    "key": "frontend",
                    "title": "前端组"
                  },
                  {
                    "key": "backend",
                    "title": "后端组"
                  }
                ]
              },
              {
                "key": "design",
                "title": "设计部"
              }
            ]
          }
        ],
        "defaultExpandedKeys": [
          "org",
          "dev"
        ],
        "checkable": true
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 展示和操作层级数据：组织架构、目录、分类、地区等多级结构。',
      '- 需要逐层展开 / 收起浏览父子关系，或按节点单选定位。',
      '- 需要对层级节点做独立勾选（如权限点、资源多选），父节点以半选反映子孙勾选。',
      '',
      '**何时不用**',
      '',
      '- 仅折叠 / 展开平级分组内容、不表达层级数据：使用 Accordion。',
      '- 平级视图或模式切换：使用 Segmented 或 Tabs，Tree 不承载内容面板切换。',
      '- 行列对齐的批量数据操作：使用 Table（树表联动场景 Tree 仅作层级侧栏）。',
      '- 线性步骤或流程进度：使用 Steps / Timeline。',
    ].join('\n'),
    previewNote:
      '静态结构：Tree 为自实现树（非第三方原语），根节点 role="tree"，节点 role="treeitem"。每行 flex：含子节点时渲染 switcher 按钮（chevron-right 图标，展开时 rotate-90 旋转，transition-transform 过渡），无子节点渲染同宽占位；checkable 时在图标后渲染 Checkbox；标题文本 truncate。按深度缩进（paddingLeft = depth × 16 + 4 px）；选中行 bg-accent 加粗；禁用节点（整树 disabled 或节点级 disabled）半透明且不可点。勾选为独立勾选（不联动父子），父节点在子孙存在勾选时显示半选（indeterminate）。展开 / 选中 / 勾选均支持受控（传 expandedKeys / selectedKeys / checkedKeys）与非受控（default*Keys 初始化内部状态）。',
    variants: [
      { name: '默认（可选择）', visual: 'chevron 展开 + 缩进层级，选中行高亮', scene: '目录、分类浏览与单选定位' },
      { name: 'checkable 可勾选', visual: '节点前复选框，支持半选', scene: '权限配置、资源多选等层级勾选' },
      { name: '受控模式', visual: 'expandedKeys / selectedKeys / checkedKeys 外部驱动', scene: '与外部状态联动（如树表联动、搜索结果定位展开）' },
      { name: '非受控模式', visual: 'defaultExpandedKeys / defaultSelectedKeys / defaultCheckedKeys 初始化', scene: '独立展示，交互状态由组件自管' },
      { name: '禁用态', visual: '整树或节点级半透明、不可交互', scene: '只读查看或无权限节点的展示' },
    ],
    apiProps: [
      { name: 'treeData', type: 'TreeNodeData[]', defaultValue: '[]', description: '树数据（可含表达式解析后的数组）；节点结构 { key, title, children?, disabled? }' },
      { name: 'expandedKeys', type: 'string[]', defaultValue: '—', description: '受控展开 keys；传入即受控，需配合 onExpand 更新' },
      { name: 'defaultExpandedKeys', type: 'string[]', defaultValue: '—', description: '非受控初始展开 keys' },
      { name: 'selectedKeys', type: 'string[]', defaultValue: '—', description: '受控选中 keys；传入即受控，需配合 onSelect 更新' },
      { name: 'defaultSelectedKeys', type: 'string[]', defaultValue: '—', description: '非受控初始选中 keys' },
      { name: 'checkable', type: 'boolean', defaultValue: 'false', description: '节点前显示勾选框；勾选为独立勾选，父节点按子孙勾选状态显示半选' },
      { name: 'checkedKeys', type: 'string[]', defaultValue: '—', description: '受控勾选 keys；传入即受控，需配合 onCheck 更新' },
      { name: 'defaultCheckedKeys', type: 'string[]', defaultValue: '—', description: '非受控初始勾选 keys' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '整树禁用；节点级禁用用 treeData 节点的 disabled' },
      { name: 'onSelect', type: '(keys: string[]) => void', defaultValue: '—', description: '选中事件，传出选中 keys 数组（单选语义，数组含当前选中节点 key）' },
      { name: 'onExpand', type: '(keys: string[]) => void', defaultValue: '—', description: '展开事件，传出最新展开 keys 数组' },
      { name: 'onCheck', type: '(keys: string[]) => void', defaultValue: '—', description: '勾选事件，传出最新勾选 keys 数组' },
      { name: 'className', type: 'string', defaultValue: '—', description: '通用：根节点 class（与内置样式合并）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '通用：根节点内联样式' },
    ],
    guidelines: [
      '- 节点 key 必须全局唯一且稳定，作为展开 / 选中 / 勾选三类状态的唯一标识。',
      '- 受控与非受控二选一：传 expandedKeys / selectedKeys / checkedKeys 即受控，必须在对应事件中回写；只用 default*Keys 时组件自管状态。',
      '- 选中为单选语义（点击标题选中当前节点）；需要多选时开启 checkable 而非依赖 selected。',
      '- 勾选为独立勾选：勾选父节点不会自动勾选子孙，父节点仅以半选提示子孙存在勾选，业务侧按 checkedKeys 自行解释。',
      '- 节点级禁用（节点 disabled）用于无权限或不可选分支；整树只读用 disabled 整体禁用。',
      '- 层级缩进固定 16px / 级，标题超长 truncate，重要完整名称通过详情区或 Tooltip 补充。',
    ].join('\n'),
    examplesDo: [
      '组织选择：checkable + defaultExpandedKeys 展开前两级，onCheck 收集勾选 keys 提交权限配置。',
      '树表联动：selectedKeys 受控，onSelect 回写并刷新右侧 Table 数据。',
      '目录浏览：非受控模式，用户自行展开收起，点击标题定位资源。',
    ],
    examplesDont: [
      '用 Tree 折叠平级的内容分组（无父子数据语义，应使用 Accordion）。',
      '传入受控 keys 却不处理对应事件回写，导致状态卡住无法交互。',
      '预期勾选父节点自动级联勾选子孙（实现为独立勾选，需业务侧自行处理级联）。',
    ],
  },

  'component.descriptions': {
    dsl: {
      "type": "Descriptions",
      "props": {
        "title": "客户信息",
        "column": 2,
        "items": [
          {
            "label": "客户名称",
            "value": "杭州云杉科技有限公司"
          },
          {
            "label": "联系人",
            "value": "陈晨"
          },
          {
            "label": "联系电话",
            "value": "0571-8800-1234"
          },
          {
            "label": "状态",
            "value": "合作中"
          }
        ]
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 详情页展示单个对象的标签—值属性：订单信息、用户资料、配置摘要。',
      '- 只读呈现成组字段，列数固定、无需行内操作。',
      '- 详情区顶部需要小标题统领一组属性。',
      '',
      '**何时不用**',
      '',
      '- 多对象按行列对比或批量操作：使用 Table；Descriptions 只服务单对象。',
      '- 需要编辑录入：使用 Form 系组件，Descriptions 为纯展示。',
      '- 展示集合条目：使用 List；展示层级或时间序列：使用 Tree / Timeline。',
    ].join('\n'),
    previewNote:
      '静态结构：Descriptions 根节点 data-slot="descriptions"，可选 title（text-base font-medium，mb-3）下接 CSS Grid（gridTemplateColumns 按 column 均分，缺省 3 列）。无边框形态每项为 label（弱化色）+ value 的行内 flex 对；bordered 形态为边框栅格（gap-px 露底边线 + 圆角外框），每项 label 固定 128px 宽灰底单元格、value 为弹性单元格。value 支持 string | number。',
    variants: [
      { name: '默认（无边框）', visual: 'label + value 行内排列，列间留白栅格', scene: '轻量摘要、卡片内属性组' },
      { name: 'bordered 带边框', visual: '单元格边框栅格，label 灰底固定列宽', scene: '正式详情页，属性多且需明确边界' },
      { name: 'column 列数', visual: 'grid 按 column 均分（缺省 3）', scene: '按容器宽度与字段密度调整列数' },
      { name: '带标题', visual: '属性组上方小标题', scene: '详情页多组属性分区（如「基础信息」「支付信息」）' },
    ],
    apiProps: [
      { name: 'title', type: 'string', defaultValue: '—', description: '标题；缺省不渲染标题区' },
      { name: 'items', type: 'DescriptionsItemData[]', defaultValue: '[]', description: '描述项列表（可含表达式解析后的数组）；项结构 { label, value: string | number }' },
      { name: 'column', type: 'number', defaultValue: '3', description: '每行列数（grid 均分）' },
      { name: 'bordered', type: 'boolean', defaultValue: 'false', description: '带边框样式：label 固定宽灰底单元格 + 边框栅格' },
      { name: 'className', type: 'string', defaultValue: '—', description: '通用：根节点 class（与内置样式合并）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '通用：根节点内联样式' },
    ],
    guidelines: [
      '- 仅承载单对象的只读属性；value 为 string | number，复杂内容（链接、图片、操作）不放进来。',
      '- column 按容器宽度与字段数量设定：宽容器 3-4 列，窄容器 1-2 列；同一详情页多组 Descriptions 保持列数一致。',
      '- label 用名词短语、不带冒号；同组 label 长度尽量接近，bordered 下 label 列宽固定 128px，超长提前精简。',
      '- 属性较多时用 title 分组（基础信息 / 联系信息 / 其他），而非一组塞数十项。',
      '- 值为空时显式给占位（如「—」），不省略条目造成栅格错位。',
    ].join('\n'),
    examplesDo: [
      '订单详情：title「订单信息」，bordered + column={3} 展示订单号、金额、状态等 6-9 项。',
      '用户资料卡：无边框 column={2}，label「邮箱」「手机」配只读值。',
      '多组详情：两个 Descriptions 分别以「基础信息」「配置信息」为 title 顺序排布。',
    ],
    examplesDont: [
      '用 Descriptions 平铺多个同类对象（应使用 Table；它只表达单对象）。',
      '把可编辑字段塞进 Descriptions（录入场景应使用 Form）。',
      'column 设得过大导致 label/value 挤压换行，或同页各组列数不一致。',
    ],
  },

  'component.timeline': {
    dsl: {
      "type": "Timeline",
      "props": {
        "items": [
          {
            "content": "提交采购申请",
            "time": "09-20 10:24"
          },
          {
            "content": "主管审批通过",
            "time": "09-20 14:02"
          },
          {
            "content": "财务付款中",
            "time": "09-21 09:15"
          }
        ],
        "pending": "待收货确认"
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 按时间顺序展示事件流：物流轨迹、操作记录、版本发布、审批历史。',
      '- 事件以「内容 + 时间」为主，需要表达先后次序而非当前进度。',
      '- 末尾需要挂一个「进行中」占位节点提示流程未完结。',
      '',
      '**何时不用**',
      '',
      '- 表达分步任务进度与当前所处步骤（含完成 / 进行 / 失败态）：使用 Steps；Timeline 记录的是已发生事件。',
      '- 展示同类对象集合：使用 List；层级关系：使用 Tree。',
      '- 高频实时数据流：Timeline 无虚拟化与滚动加载，长流水需分页或截断。',
    ].join('\n'),
    previewNote:
      '静态结构：Timeline 渲染为 <ul>（data-slot="timeline"），节点 <li> 为 flex 行——左侧节点位（有 icon 时渲染 Icon 白名单图标，否则渲染 8px 圆形圆点，缺省品牌色、可被 color 覆盖）+ 右侧 content 与可选 time（弱化小字）。非末节点以绝对定位竖线连接（top 对齐圆点下缘）。pending 为 true 时末尾追加默认文案「进行中」节点，传字符串则用自定义文案；pending 节点为普通圆点样式。',
    variants: [
      { name: '默认', visual: '品牌色圆点 + 内容 + 可选时间', scene: '常规事件流（操作记录、物流轨迹）' },
      { name: '自定义圆点颜色', visual: '节点 color 覆盖圆点色', scene: '按事件性质着色（成功绿、异常红）' },
      { name: '图标节点', visual: '节点位渲染 Icon 白名单图标', scene: '关键里程碑区别于普通节点' },
      { name: 'pending 进行中', visual: '末尾追加「进行中」或自定义文案节点', scene: '流程未完结的占位提示（如「等待配送」）' },
    ],
    apiProps: [
      { name: 'items', type: 'TimelineItemData[]', defaultValue: '[]', description: '节点列表（可含表达式解析后的数组）；项结构 { content, time?, color?, icon? }' },
      { name: 'pending', type: 'boolean | string', defaultValue: 'false', description: '末尾追加「进行中」节点：true 用默认文案，字符串为自定义文案' },
      { name: 'className', type: 'string', defaultValue: '—', description: '通用：根节点 class（与内置样式合并）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '通用：根节点内联样式' },
    ],
    guidelines: [
      '- 节点按时间顺序组织（通常最新在上或最旧在上，全页统一），content 为一句话事件描述，time 用统一时间格式。',
      '- icon 与 color 用于标记关键节点，同一条时间线上着色语义保持一致（如红色固定表示异常）。',
      '- pending 节点只表示「未完结」，不承载操作；流程结束后移除 pending。',
      '- 节点内容过长截断或换行由容器控制，正文详情用链接 / 弹层承接，不在节点内堆长文。',
      '- 仅竖向排布；需要横向步骤或进度语义时改用 Steps。',
    ].join('\n'),
    examplesDo: [
      '物流详情：items 按时间倒序展示「已揽收 → 运输中 → 派送中」，pending="等待签收"。',
      '审批记录：通过节点 color 标绿、驳回节点标红并配 icon，time 展示操作时间。',
      '发布历史：里程碑版本用 icon 节点，常规迭代用默认圆点。',
    ],
    examplesDont: [
      '用 Timeline 表达「当前进行到哪一步」的进度语义（应使用 Steps）。',
      '同一条时间线内颜色语义混乱（同一红色一会儿表示错误一会儿表示强调）。',
      '节点内塞入大段正文或操作按钮组（详情与操作应收纳到链接 / 弹层）。',
    ],
  },

  'component.image': {
    dsl: {
      "type": "Image",
      "props": {
        "src": "https://example.com/report-cover.png",
        "alt": "报表封面",
        "width": 240,
        "preview": true
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 内容区展示单张图片：封面、配图、证件照、商品图。',
      '- 需要点击放大查看的基础预览（弹层居中大图，可关闭）。',
      '- 需要明确尺寸约束与加载失败兜底（占位块 / 自定义 fallback）。',
      '',
      '**何时不用**',
      '',
      '- 多图浏览、缩放、旋转、切换等完整看图体验：使用 ImageViewer；Image 仅提供单图基础预览。',
      '- 图片集合画廊：使用 Gallery / Carousel 类组件。',
      '- 用户头像：使用 Avatar；列表内缩略图：使用 List 的 avatar 通道。',
    ].join('\n'),
    previewNote:
      '静态结构：Image 渲染单个 <img>（data-slot="image"，rounded-md，数值 width / height 透传为 HTML 属性，字符串长度走内联样式）。preview 缺省 true：图片带 cursor-zoom-in，点击经 vendored Dialog 打开预览弹层（sm:max-w-3xl 居中容器，大图 max-h-[80vh] object-contain，DialogTitle 以 sr-only 提供无障碍标题，取 alt 或「图片预览」）。src 为空或 onError 触发时渲染 fallback——缺省为 96px 灰色圆角占位块 + image 图标，可传 ReactNode 自定义；fallback 容器同样应用宽高样式。',
    variants: [
      { name: '默认（可预览）', visual: '圆角图片，点击经 Dialog 弹层放大', scene: '详情页、内容区需要看大图的配图' },
      { name: 'preview=false 关闭预览', visual: '纯展示图片，无点击行为', scene: '装饰性图片、卡片封面等无需放大场景' },
      { name: 'fallback 兜底', visual: '灰色占位块 + 图标（可自定义内容）', scene: 'src 为空或加载失败的兜底呈现' },
      { name: '固定尺寸', visual: 'width / height 约束（数值 px 或 CSS 长度）', scene: '布局需要占位稳定、避免加载抖动的场景' },
    ],
    apiProps: [
      { name: 'src', type: 'string', defaultValue: '—', description: '图片地址；为空时直接渲染 fallback' },
      { name: 'alt', type: 'string', defaultValue: "''", description: '替代文本；同时作为预览弹层的无障碍标题' },
      { name: 'width', type: 'number | string', defaultValue: '—', description: '宽度：数值按 px 透传 width 属性，字符串按 CSS 长度走内联样式' },
      { name: 'height', type: 'number | string', defaultValue: '—', description: '高度：规则同 width' },
      { name: 'fallback', type: 'ReactNode', defaultValue: '—', description: '加载失败或 src 为空时显示的内容；缺省为图标 + 灰色占位块' },
      { name: 'preview', type: 'boolean', defaultValue: 'true', description: '点击经 Dialog 弹层放大预览；false 时纯展示' },
      { name: 'className', type: 'string', defaultValue: '—', description: '通用：根节点 class（与内置样式合并）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '通用：根节点内联样式（与 width / height 合并，style 优先）' },
    ],
    guidelines: [
      '- alt 必填语义化描述：既是加载失败 / 读屏的替代文本，也是预览弹层的无障碍标题；装饰图可留空但需确认无信息损失。',
      '- 布局敏感区域显式给 width / height 占位，避免图片加载完成前后的布局抖动。',
      '- preview 缺省开启；纯装饰或已有点击行为的图片显式关闭，避免双重交互。',
      '- 预览仅为单图放大（Dialog 弹层、可关闭），不提供缩放 / 旋转 / 多图切换；这些需求引导至 ImageViewer。',
      '- 失败兜底走 fallback：缺省占位块可接受时不必自定义；自定义 fallback 应保持与图片相同的尺寸约束。',
    ].join('\n'),
    examplesDo: [
      '商品详情：width={320} 固定主图尺寸，保留默认 preview，alt 写商品名。',
      '证件材料：加载失败用自定义 fallback 提示「图片加载失败，请刷新」，避免空白。',
      '卡片封面：preview={false} 纯展示，点击行为交由卡片自身跳转。',
    ],
    examplesDont: [
      '用 Image 拼凑多图画廊或期望缩放切换（应使用 ImageViewer / Gallery）。',
      'alt 留空或写「图片」等无信息文案，读屏与失败场景丢失上下文。',
      '不给尺寸约束导致图片加载时内容区跳动，或 preview 图片上再叠加自定义点击冲突。',
    ],
  },

  'component.qrcode': {
    dsl: {
      "type": "QRCode",
      "props": {
        "value": "https://pactor.example.com/invite/8f2k",
        "size": 128,
        "bordered": true
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 将短文本编码为可扫码图形：分享链接、下载地址、登录凭证、凭证编号。',
      '- 移动端接力场景：桌面端展示二维码，手机扫码继续流程。',
      '- 需要控制码体尺寸、配色与边框的嵌入式展示。',
      '',
      '**何时不用**',
      '',
      '- 承载长文或复杂结构化数据：二维码容量有限且不可读，长内容用链接承接。',
      '- 需要用户直接阅读 / 复制内容：二维码不替代文本，应同时给出原文。',
      '- 展示条形码等其他码制：QRCode 仅生成 QR 码。',
    ].join('\n'),
    previewNote:
      '静态结构：QRCode 以 qrcode 包在 effect 中生成内联 SVG（toString(value, { type: "svg", margin: 0 })），自生成的可信 SVG 字符串经 dangerouslySetInnerHTML 注入容器，容器按 size（缺省 128px）定宽高；bordered 时外层加圆角边框与内边距。value 为空或生成失败时渲染同尺寸灰色占位块 + image 图标。color / bgColor 经 hex 校验（# 开头的 3 / 4 / 6 / 8 位，可带透明度位）后透传为码体 dark / light 色，非法值回退生成库内建黑 / 白默认。',
    variants: [
      { name: '默认', visual: '128px 黑码白底内联 SVG', scene: '常规分享 / 跳转编码' },
      { name: 'bordered 带边框', visual: '圆角边框 + 内边距', scene: '独立展示的码块，与白底内容区区分' },
      { name: '自定义尺寸', visual: 'size 控制边长（px）', scene: '卡片角标小码或海报级大码' },
      { name: '自定义配色', visual: 'color / bgColor（hex，可带透明度位）', scene: '品牌色码体；需保证扫码对比度' },
      { name: '占位态', visual: '同尺寸灰底占位块 + 图标', scene: 'value 为空或生成失败' },
    ],
    apiProps: [
      { name: 'value', type: 'string', defaultValue: '—', description: '编码内容；为空时渲染占位块' },
      { name: 'size', type: 'number', defaultValue: '128', description: '尺寸（px），同时约束 SVG 容器与占位块' },
      { name: 'color', type: 'string', defaultValue: '—', description: '码体颜色：仅接受 # 开头 hex（3 / 4 / 6 / 8 位，可带透明度位），非法值回退生成库内建黑色' },
      { name: 'bgColor', type: 'string', defaultValue: '—', description: '背景色：格式同 color，非法值回退生成库内建白色' },
      { name: 'bordered', type: 'boolean', defaultValue: 'false', description: '带边框与内边距' },
      { name: 'className', type: 'string', defaultValue: '—', description: '通用：根节点 class（与内置样式合并）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '通用：根节点内联样式' },
    ],
    guidelines: [
      '- value 保持短小（链接 / 编号级），内容越长码点越密，过小尺寸下难以识别；size 与内容长度匹配。',
      '- 安全要求：二维码旁必须展示编码后的真实目标（如完整链接文本），用户跳转前可核对；不展示「只码无文」的不可核验入口。',
      '- 自定义 color / bgColor 必须保持深浅对比（码深底浅），低对比或反色组合会导致扫码失败；非法 hex 静默回退默认色，配置后应确认生效。',
      '- 二维码不替代可复制文本：重要链接同时提供文本与复制入口。',
      '- value 动态变化时组件自动重新生成；空 value 期间呈现占位块，避免闪现错误码。',
    ].join('\n'),
    examplesDo: [
      '分享弹层：value 传分享链接，码下方附链接文本与「复制链接」按钮，bordered 独立成块。',
      '移动端接力：详情页侧栏 size={96} 小码，文案提示「扫码在手机上继续」。',
      '品牌活动页：color 传品牌主色 hex、bgColor 留白，实测扫码可用后上线。',
    ],
    examplesDont: [
      '只展示二维码不给出编码目标文本，用户无法核对跳转去向（违反安全要求）。',
      '把整段长文 / JSON 编码进 QRCode，码点过密无法识别。',
      '用低对比配色（浅色码浅底）或 rgb() 等非 hex 值配置颜色（非法值会被回退）。',
    ],
  },

  'component.segmented': {
    dsl: {
      "type": "Segmented",
      "props": {
        "name": "period",
        "value": "month",
        "options": [
          {
            "label": "日",
            "value": "day"
          },
          {
            "label": "周",
            "value": "week"
          },
          {
            "label": "月",
            "value": "month"
          },
          {
            "label": "年",
            "value": "year"
          }
        ]
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 在少量（2-5 个）互斥视图、模式或维度间切换：列表 / 网格、日 / 周 / 月、全部 / 未读。',
      '- 切换立即生效、只改变同区域内容的呈现方式，不切换页面上下文。',
      '- Form 内作为单选字段（声明 name 即自动注册，参与校验与提交）。',
      '',
      '**何时不用**',
      '',
      '- 选项多、需承载复杂内容面板或路由语义（可分享、可深链的标签页）：使用 Tabs。',
      '- 表单内长列表单选：使用 RadioGroup / Select；Segmented 选项需短文案平铺。',
      '- 二元开关（开 / 关）：使用 Switch；多选：使用 Checkbox 组。',
      '- 触发动作而非切换状态：使用 Button。',
    ].join('\n'),
    previewNote:
      '静态结构：Segmented 渲染 role="radiogroup" 的药丸容器（rounded-full 灰底 + p-1），选项为 role="radio" 的 pill 按钮；选中项高亮由独立的滑动指示块（data-slot="segmented-indicator"，absolute 白底圆角块 + shadow-sm）承载，切换时指示块经 left/width 过渡平滑滑向新选中项（motion-safe 生效，尊重减弱动态偏好），选中文字加粗、未选中弱化文字；选项可前置 Icon 白名单图标，选项级 disabled 或整体 disabled 半透明禁用。Form 集成同 Slider 模式：在 Form 内声明非空 name 即经 registerField 注册（携带 rules，value 作为字段初始值、优先于 Form initialValues），外层包 FieldShell 呈现 label 与校验错误，className / style 挂到 form-item 容器；独立渲染时 value 为受控值、onChange 传出选中项 value（DSL 语义值），className / style 挂控件本身。',
    variants: [
      { name: '默认（文本选项）', visual: '药丸容器 + 文本 pill，选中白底浮起', scene: '视图 / 维度切换（如「列表 | 网格」）' },
      { name: '图标选项', visual: '选项前置 Icon 白名单图标', scene: '图标增强辨识的模式切换（如视图形态）' },
      { name: 'Form 表单项', visual: 'FieldShell 包裹：label + 控件 + 校验错误', scene: '表单内单选字段（声明 name 自动注册）' },
      { name: '受控 / 非受控', visual: 'value 受控或内部状态自管', scene: '独立渲染时与外部状态联动或自管' },
      { name: '禁用态', visual: '整体或选项级半透明禁用', scene: '暂不可用的模式或权限受限选项' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明 name 即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（仅 Form 内生效）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则（注册字段时携带）' },
      { name: 'options', type: 'SegmentedOption[]', defaultValue: '[]', description: '选项列表（可含表达式解析后的数组）；项结构 { label, value: string | number, icon?, disabled? }' },
      { name: 'value', type: 'string | number', defaultValue: '—', description: '受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues）' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '整体禁用；选项级禁用用 options 项的 disabled' },
      { name: 'onChange', type: '(value: string | number) => void', defaultValue: '—', description: '选中变化事件，传出选中项的 value' },
      { name: 'className', type: 'string', defaultValue: '—', description: '通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件本身）' },
      { name: 'style', type: 'CSSProperties', defaultValue: '—', description: '通用：根节点内联样式（同 className 的挂载规则）' },
    ],
    guidelines: [
      '- 选项控制在 2-5 个、label 为 1-4 字短文案；超出或需要内容面板 / 路由语义时改用 Tabs。',
      '- value 与选项 value 严格同型（string | number 不混用），否则选中态匹配失败。',
      '- Form 内使用必须声明非空 name；rules 随字段注册，value 作初始值且优先于 Form initialValues。',
      '- 独立渲染受控场景：传 value 并在 onChange 回写；不传 value 时组件自管内部状态。',
      '- 切换应立即反映到关联内容；切换代价高（重新拉取大量数据）的场景用 Tabs + 显式加载态更合适。',
      '- 禁用整体用 disabled，个别选项不可用用选项级 disabled，并对禁用原因给出上下文提示。',
    ].join('\n'),
    examplesDo: [
      '看板顶部：options「日 / 周 / 月」，onChange 切换图表统计维度，value 受控同步查询参数。',
      'Form 内「通知方式」：name="notify" + label + rules 必填，随表单校验提交。',
      '视图切换：选项配 icon（list / grid 图标），纯展示切换无路由跳转。',
    ],
    examplesDont: [
      '用 Segmented 做页面级标签导航或承载路由语义（应使用 Tabs）。',
      '塞入 7、8 个长文案选项导致 pill 挤压换行（应改用 Select / RadioGroup）。',
      '受控传入 value 却不处理 onChange 回写，或选项 value 字符串数字混用导致选中态丢失。',
    ],
  },

  'component.card': {
    dsl: {
      "type": "Card",
      "props": {
        "title": "月度运营报告",
        "rounded": "lg",
        "bordered": true
      },
      "children": [
        {
          "type": "Text",
          "props": {
            "text": "2026-08 月报已生成，覆盖 12 项核心指标，较上月提升 8.4%。",
            "type": "secondary"
          }
        }
      ]
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 承载一个独立主题或对象摘要：单条记录、一个模块、一张看板的入口。',
      '- 需要在页面中划分出边界清晰的内容块（标题 + 内容 + 操作）。',
      '- 卡片网格中的单元容器：每张卡片一个对象，卡片间并列浏览。',
      '',
      '**何时不用**',
      '',
      '- 展示同类对象的集合列表：单对象用 Card，同构集合用 List 或 Table。',
      '- 仅需分组留白而无独立主题：使用 Space / Flex 或分割线，不必都套卡片。',
      '- 页面级区块框架（含侧栏、头部）：使用布局类组件（Page / Layout / Container）。',
    ].join('\n'),
    previewNote:
      '静态结构：Card 渲染为 data-slot="card" 容器（gap-4 py-4，rounded 缺省 lg，即 --radius 基准圆角）；有 title 时渲染 data-slot="card-header"（内 data-slot="card-title"）与 data-slot="card-content"，无 title 时仅渲染内容区，两者均带 px-4 水平内边距；bordered=false 时追加 border-transparent shadow-none 去边框与阴影。children 为 DSL 子树（可混排文案、按钮等）。',
    variants: [
      { name: '带标题（缺省）', visual: '标题行 + 内容区（header / content 分区）', scene: '有明确主题的独立内容块' },
      { name: '无标题纯容器', visual: '仅内容区，无 header', scene: '内容自带标题或仅作留白分组' },
      { name: 'bordered=false 无边框', visual: '去边框与阴影，仅保留圆角与背景', scene: '与页面背景同层、靠留白分隔的轻量卡片' },
      { name: 'rounded 圆角档位', visual: 'none / sm / md / lg / xl / 2xl / 3xl 七档', scene: '按产品视觉规范调整圆角（缺省 lg）' },
    ],
    apiProps: [
      { name: 'title', type: 'string', defaultValue: '—', description: '卡片标题；缺省不渲染标题区' },
      { name: 'bordered', type: 'boolean', defaultValue: 'true', description: '是否有边框；false 去边框与阴影' },
      { name: 'rounded', type: "CardRounded（'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'）", defaultValue: "'lg'", description: '圆角档位，lg 即 --radius 基准值' },
      { name: 'children', type: 'ReactNode', defaultValue: '—', description: '卡片内容（DSL 子树），渲染于 data-slot="card-content" 内' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（style 常作布局逃逸口，如 { flex: 1 }）' },
    ],
    guidelines: [
      '- 一张卡片只表达一个主题或对象；同屏多卡片保持结构一致（都有标题或都无标题）。',
      '- 卡片内主操作每张最多一个（primary 按钮），其余降级为文字按钮或链接。',
      '- 嵌套卡片不超过一层，深层嵌套改用分割线与留白表达层级。',
      '- 卡片网格中避免内容高度差异过大导致视觉参差；必要时约束内容行数或统一高度来源。',
      '- 无边框卡片（bordered=false）需确保背景与页面有足够对比，否则容器边界会消失。',
    ].join('\n'),
    examplesDo: [
      '看板卡片：title「月度运营报告」+ 摘要文案 + primary「查看详情」按钮。',
      '卡片网格：每张卡片一个对象（rounded="lg" + bordered），网格内结构统一。',
      '轻量分组：bordered=false 在设置页中作分组容器，靠留白区分区块。',
    ],
    examplesDont: [
      '用 Card 展示同类对象的集合列表（应使用 List / Table，Card 表达单个对象）。',
      '卡片内堆叠多个不同主题的内容块，标题无法概括内容。',
      '给所有容器都套一层 Card，页面被边框切碎、层级反而模糊。',
    ],
  },

  'component.table': {
    dsl: {
      "type": "Table",
      "props": {
        "columns": [
          {
            "title": "名称",
            "dataIndex": "name"
          },
          {
            "title": "负责人",
            "dataIndex": "owner"
          },
          {
            "title": "状态",
            "dataIndex": "status",
            "align": "center"
          }
        ],
        "dataSource": [
          {
            "id": 1,
            "name": "月度运营报告",
            "owner": "张三",
            "status": "已发布"
          },
          {
            "id": 2,
            "name": "客户分层方案",
            "owner": "李四",
            "status": "草稿"
          },
          {
            "id": 3,
            "name": "Q3 投放复盘",
            "owner": "王五",
            "status": "审核中"
          },
          {
            "id": 4,
            "name": "渠道增长分析",
            "owner": "赵六",
            "status": "已发布"
          }
        ],
        "pagination": {
          "pageSize": 5
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 展示同构集合的结构化数据，需要按行列对齐阅读与比较：订单、成员、任务列表。',
      '- 列定义稳定、需要按列对齐（数值右对齐、状态居中）与统一列宽。',
      '- 数据量中等并需要简单分页（pagination.pageSize）或加载态（loading）。',
      '',
      '**何时不用**',
      '',
      '- 单对象的字段集：使用 Descriptions，Table 表达的是集合而非单个对象。',
      '- 高密度编辑、列筛选 / 排序、虚拟化大数据网格：使用 DataTable。',
      '- 条目以浏览识别为主、无需列对齐：使用 List，纵向列表更轻。',
      '- 层级数据：使用 Tree；纯展示的指标单值：使用 Statistic。',
    ].join('\n'),
    previewNote:
      '静态结构：Table 根节点 data-slot="dsl-table"（relative），内为 vendored 表格原语（TableHeader / TableBody / TableRow / TableHead / TableCell）；列按 columns 顺序渲染，align 同时作用于表头与单元格（left 为默认不加类），width 透传为列宽。单元格默认取 row[dataIndex]（对象值经 JSON 序列化）或按 column.cell 子树经 Renderer 注入 { row, rowIndex } 渲染。loading 时叠加 data-slot="table-loading" 遮罩（bg-card/60 居中提示）；无数据行渲染 data-slot="table-empty"「暂无数据」；pagination.pageSize 存在时底部渲染 data-slot="table-pagination" 页码按钮（当前页实心）。',
    variants: [
      { name: '默认（无分页）', visual: '表头 + 数据行，全量渲染', scene: '数据量小、需一屏看完的表格' },
      { name: 'pagination 分页', visual: '底部页码按钮，按 pageSize 切片（当前页实心）', scene: '行数超过一屏的常规业务表格' },
      { name: 'align 列对齐', visual: 'align=center / right 同时作用于表头与单元格', scene: '状态列居中、数值列右对齐的可读性优化' },
      { name: 'cell 自定义单元格', visual: '按 column.cell 子树渲染，作用域含 row / rowIndex', scene: '单元格内需要标签、按钮或条件样式' },
      { name: 'loading 加载中', visual: '半透明遮罩 + 居中加载文案覆盖表格', scene: '数据请求中，保持表头结构稳定' },
      { name: '空态', visual: '「暂无数据」占满整行（colSpan 跨全部列）', scene: 'dataSource 为空或筛选无结果' },
    ],
    apiProps: [
      { name: 'columns', type: 'TableColumn[]', defaultValue: '[]', description: '列定义（可含表达式解析后的数组）；项结构 { title?, dataIndex?, width?, align?, cell? }，cell 为行模板 DSL 子树' },
      { name: 'dataSource', type: 'Record<string, unknown>[]', defaultValue: '[]', description: '数据行（通常为 ${data.xxx} 表达式解析结果）' },
      { name: 'rowKey', type: 'string', defaultValue: "'id'", description: '行 key 字段；缺失时回退行序号' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: '加载中：叠加遮罩并展示加载文案' },
      { name: 'pagination', type: 'false | { pageSize?: number }', defaultValue: '—', description: '分页配置：false 关闭（不渲染页码）；{ pageSize } 开启并按页切片；不传时全量渲染' },
      { name: 'onChange', type: '(pagination: TablePaginationInfo) => void', defaultValue: '—', description: '翻页事件，传出 { current, pageSize, total }（Renderer 绑定 events.onChange）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 列顺序按阅读优先级排列：标识列在左、数值与状态居中或右对齐、操作列在右。',
      '- align 与 width 配合使用：数值列右对齐便于纵向比较，状态列居中，长文本列给足宽度并截断。',
      '- 分页为客户端切片：数据量较大时先经 data 源分页取数，避免一次性把全量数据塞进 dataSource。',
      '- 空态必须可见：无数据时 Table 自带「暂无数据」占位，不要额外叠加 Empty 造成双重空态。',
      '- 需要排序、列筛选或高密度编辑时改用 DataTable，不要在 Table 上自行拼装交互。',
    ].join('\n'),
    examplesDo: [
      '订单列表：columns 定义订单号 / 金额（right）/ 状态（center），pagination { pageSize: 10 }。',
      '任务表格：状态列用 cell 子树渲染 Tag，作用域取 ${row.status} 与 ${rowIndex}。',
      '请求中：loading=true 覆盖表格，表头保持可见，减少布局跳动。',
    ],
    examplesDont: [
      '用 Table 展示单个对象的字段集（应使用 Descriptions）。',
      '需要列排序 / 筛选 / 虚拟化仍用 Table（应使用 DataTable）。',
      'dataSource 一次塞入上千行并期待 Table 自行虚拟化（实现为客户端分页，无虚拟滚动）。',
    ],
  },

  'component.statistic': {
    dsl: {
      "type": "Statistic",
      "props": {
        "title": "本月销售额",
        "value": 128640.5,
        "precision": 2,
        "suffix": "元"
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 突出显示单个指标数值：销售额、活跃用户、转化率、库存量。',
      '- 看板 / 概览页的指标行，多组 Statistic 并列形成指标带。',
      '- 需要固定小数位（precision）与单位后缀（suffix）的统一格式化展示。',
      '',
      '**何时不用**',
      '',
      '- 需要「单值 + 变化」的趋势信息（同比 / 环比、迷你趋势图）：使用图表分类的 MetricCard（指标卡）；Statistic 只渲染一个数值。',
      '- 多个对象按行列对比：使用 Table；单对象的字段集：使用 Descriptions。',
      '- 需要用户编辑该数值：使用 NumberInput，Statistic 为纯展示。',
    ].join('\n'),
    previewNote:
      '静态结构：Statistic 根节点 data-slot="statistic"；有 title 时渲染 data-slot="statistic-title"（text-sm 弱化色），下方 data-slot="statistic-value"（text-2xl font-bold tabular-nums）渲染数值——value 为 number 且显式给 precision 时按 toFixed(precision) 格式化，否则原样输出（string 值不做格式化）；suffix 以 ml-1 的小号弱化文本紧随数值之后。',
    variants: [
      { name: '默认（整数）', visual: '标题 + 大号粗体数值', scene: '计数型指标（用户数、订单数）' },
      { name: 'precision 小数位', visual: '数值按 toFixed(precision) 输出', scene: '金额、比率等固定小数位的指标' },
      { name: 'suffix 后缀', visual: '数值后跟随小号弱化单位文本', scene: '带单位 / 百分号的指标（元、人、%）' },
      { name: '无标题', visual: '仅数值行（title 缺省不渲染）', scene: '标题由外层容器统一提供的紧凑布局' },
      { name: 'string 值直出', visual: '字符串原样渲染，不做格式化', scene: '已是格式化结果的文本（如「1.2 万」）' },
    ],
    apiProps: [
      { name: 'title', type: 'string', defaultValue: '—', description: '指标标题；缺省不渲染标题区' },
      { name: 'value', type: 'number | string', defaultValue: '—', description: '指标数值（通常为表达式解析后的数字）；string 值原样渲染、不套 precision' },
      { name: 'precision', type: 'number', defaultValue: '—', description: '小数精度：仅当 value 为 number 且显式声明时按 toFixed 格式化' },
      { name: 'suffix', type: 'string', defaultValue: '—', description: '后缀（如单位），渲染在数值之后的小号弱化文本' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 同一指标带内的 Statistic 保持一致的 title 风格、precision 与 suffix 单位口径。',
      '- 只展示数值本身；同比 / 环比、趋势线与涨跌色属于指标卡（MetricCard）的职责。',
      '- precision 只作用于 number 值：需要「1.2 万」这类预格式化文案时改传 string，并把单位写进字符串或 suffix。',
      '- 数值位数可能很长（金额、大数）时注意容器宽度与换行，tabular-nums 已对齐数字宽度。',
      '- title 用名词短语（「本月销售额」），不要写成句子或带句末标点。',
    ].join('\n'),
    examplesDo: [
      '概览指标带：三个 Statistic 并列（销售额 precision=2 suffix="元" / 活跃用户 suffix="人"）。',
      '预格式化：value 传 "1.2 万" 字符串，避免精度与单位在组件层二次加工。',
      '卡片内指标：配合 Card 组成指标卡块，title 概括口径与周期。',
    ],
    examplesDont: [
      '用 Statistic 表达同比变化与趋势（应使用图表分类的 MetricCard 指标卡）。',
      '给 string 值再传 precision 期待补零（string 值原样输出，不套格式化）。',
      '把可编辑数值放进 Statistic（展示组件不承载录入，应使用 NumberInput）。',
    ],
  },

  'component.calendar': {
    dsl: {
      "type": "Calendar",
      "props": {
        "name": "checkDate",
        "label": "核对日期",
        "mode": "single",
        "value": "2026-09-21"
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 需要常驻可见的月历视图：日程安排、排班、内容日历、日期概览。',
      '- 日期选择需要「看着日历选」而非弹层一闪而过（与 DatePicker 的触发器形态互补）。',
      '- 表单内的日期字段，且布局允许日历常驻：声明 name 即自动注册为表单项。',
      '',
      '**何时不用**',
      '',
      '- 常规表单中的日期字段、版面紧凑：使用 DatePicker（触发器 + Popover 弹层）。',
      '- 需要选择日期区间（开始 - 结束）：使用 DatePicker 的 mode="range" 双面板；Calendar 当前仅支持 single。',
      '- 需要时间点或日期时间的完整录入：使用 TimePicker 或 DatePicker + TimePicker 组合。',
    ].join('\n'),
    previewNote:
      '静态结构：Calendar 直接渲染 vendored react-day-picker 月历（无自定义 data-slot，容器 bg-card p-3、宽 w-fit）：顶部月份标题与左右导航箭头（outline 圆形按钮），下方星期表头 + 日期网格按钮；选中日经 DayPicker selected 样式（--calendar-selected-* 令牌）高亮，hover 走 --calendar-day-hover-*，showOutsideDays 缺省 true 以弱化样式补齐当月之外日期。值为 ISO 字符串（yyyy-MM-dd），onChange 同样传出 ISO 字符串，清除传 undefined。Form 内声明非空 name 时外层为 data-slot="form-item" 容器（label + 日历 + data-slot="form-error"），不走 FieldShell。',
    variants: [
      { name: '默认（single 单选）', visual: '单月日历网格，点击日期即选中高亮', scene: '常驻日历视图、表单内日期字段' },
      { name: '已选值回显', visual: 'value 传入的日期带选中样式', scene: '编辑回显、按当前日期定位' },
      { name: '无选中值', visual: '未选时不命中任何日期', scene: '初始化状态、允许留空的字段' },
      { name: 'Form 表单项', visual: 'form-item 容器：label + 日历 + 校验错误行', scene: '表单内日期字段（声明 name 自动注册）' },
      { name: 'disabled 禁用', visual: '全部日期不可点击', scene: '只读回显、条件未满足' },
    ],
    apiProps: [
      { name: 'name', type: 'string', defaultValue: '—', description: '字段名；在 Form 内声明即自动成为表单项' },
      { name: 'label', type: 'string', defaultValue: '—', description: '表单项标签（Form 内由 label 标签呈现）' },
      { name: 'rules', type: 'FieldRule[]', defaultValue: '—', description: '校验规则' },
      { name: 'mode', type: "'single'", defaultValue: "'single'", description: '选择模式（当前仅支持 single）' },
      { name: 'value', type: 'string', defaultValue: '—', description: '受控值（ISO 日期字符串 yyyy-MM-dd）；Form 内作为字段初始值（优先于 Form initialValues）' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用全部日期选择' },
      { name: 'onChange', type: '(value: string | undefined) => void', defaultValue: '—', description: '选中日期事件，传出 ISO 日期字符串，清除传 undefined（Renderer 绑定 events.onChange；DSL 语义值）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式（Form 内为 form-item 容器，独立渲染时为日历本身）' },
    ],
    guidelines: [
      '- 值与格式固定为 ISO 字符串 yyyy-MM-dd：不要传 Date 对象，也不要传本地化格式字符串。',
      '- Calendar 常驻占位较大（整月网格），仅适合布局宽裕的场景；表单常规字段用 DatePicker 更省版面。',
      '- 区间选择走 DatePicker 的 mode="range"，Calendar 当前无区间能力，不要用两个 Calendar 自行拼装。',
      '- 日历语言随 useI18n().locale 映射 date-fns locale（内置 zh-CN / en-US），交付前确认目标语言。',
      '- Form 内声明非空 name 才注册字段；未声明 name 时为独立受控日历。',
    ].join('\n'),
    examplesDo: [
      '排班页面：Calendar 常驻展示整月，点击日期切换当日排班明细。',
      'Form 内「核对日期」：name + rules 必填，提交时值为 "2026-09-21"。',
      '编辑回显：value 传已存日期，日历打开即定位到该月并高亮选中日。',
    ],
    examplesDont: [
      '在紧凑表单里塞常驻 Calendar 挤占版面（应使用 DatePicker 弹层形态）。',
      '用 Calendar 期望选择日期区间（区间应使用 DatePicker mode="range"）。',
      '传入 Date 对象或 "2026/09/21" 等非 ISO 字符串导致选中态失效。',
    ],
  },

  'component.accordion': {
    dsl: {
      "type": "Accordion",
      "props": {
        "items": [
          {
            "key": "intro",
            "title": "产品简介",
            "children": [
              {
                "type": "Text",
                "props": {
                  "text": "Pactor 是一套 DSL 驱动的动态页面框架。"
                }
              }
            ]
          },
          {
            "key": "usage",
            "title": "使用方式",
            "children": [
              {
                "type": "Text",
                "props": {
                  "text": "以 YAML/JSON 描述页面结构，经运行时渲染为真实组件。"
                }
              }
            ]
          },
          {
            "key": "faq",
            "title": "常见问题",
            "children": [
              {
                "type": "Text",
                "props": {
                  "text": "表达式、数据源与动作均可组合使用，详见使用文档。"
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
      '- 内容分组收纳：把平级的长内容折叠成若干面板，默认收起以节省纵向空间。',
      '- 用户按需展开阅读的辅助信息：帮助说明、常见问题、配置分组。',
      '- 面板之间是并列关系（无父子层级），需要单开或多开。',
      '',
      '**何时不用**',
      '',
      '- 层级数据（父子节点、逐级展开）：使用 Tree——层级数据用 Tree，内容分组收纳用 Accordion。',
      '- 同区域视图切换、每次只看一个视图：使用 Tabs（Accordion 强调收纳，Tabs 强调切换）。',
      '- 表单内需要展示大量可折叠字段组且需校验：当前实现不承载表单语义，改用业务侧折叠表单结构。',
    ].join('\n'),
    previewNote:
      '静态结构：Accordion 为 data-slot="accordion" 折叠组，每项 data-slot="accordion-item" = 触发行 data-slot="accordion-trigger"（标题 + 行尾 chevron 图标，展开时旋转）+ 内容区 data-slot="accordion-content"；内容区为 items[].children DSL 子树，经 Renderer children 机制渲染。items[].key 作为项 value：multiple 时使用 Base UI multiple 模式（可多项同开），否则 single 模式（点击已展开项即可收起，天然允许全部收起）。',
    variants: [
      { name: 'single 单开（缺省）', visual: '同时最多展开一个面板', scene: '内容较长、希望用户聚焦当前面板' },
      { name: 'multiple 多开', visual: '多个面板可同时展开', scene: '面板内容短、需对照阅读（如多项说明）' },
      { name: 'DSL 子树面板', visual: '面板内容由 DSL 节点渲染（可含任意组件）', scene: '面板内需要放表格、表单等复杂内容' },
      { name: '全部收起', visual: 'single 模式下可点开项收起至零展开', scene: '初始不展开任何面板的节省空间形态' },
    ],
    apiProps: [
      { name: 'items', type: 'AccordionItemData[]', defaultValue: '[]', description: '面板列表（可含表达式解析后的数组）；项结构 { key, title, children?: DslNode[] }' },
      { name: 'collapsible', type: 'boolean', defaultValue: '—', description: '允许收起全部面板（契约兼容字段；Base UI single 模式天然允许收起）' },
      { name: 'multiple', type: 'boolean', defaultValue: 'false', description: '允许多个面板同时展开' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 面板 key 必须唯一且稳定，作为展开状态的标识；重复 key 会导致面板联动错乱。',
      '- title 用简短名词短语概括面板内容；面板内容本身不要再重复标题信息。',
      '- 需对照阅读的短内容用 multiple 多开；长内容用缺省单开，减少来回滚动。',
      '- 面板数量控制在 3-8 个；更多时先分组或改用其他导航结构，避免长列表折叠堆叠。',
      '- 内容需在折叠状态下也可被检索到时（如 FAQ 搜索），考虑把关键信息摘要提到 title 中。',
    ].join('\n'),
    examplesDo: [
      '帮助中心：items 分「产品简介 / 使用方式 / 常见问题」，缺省单开节省空间。',
      '配置说明分组：multiple 多开，用户可一边看说明一边对照另一组配置。',
      '面板内复杂内容：children 传 DSL 子树（Table、Form 等），与页面其他部分同一渲染路径。',
    ],
    examplesDont: [
      '用 Accordion 表达层级父子数据（应使用 Tree）。',
      '用 Accordion 做同区域视图切换并期待路由 / 深链语义（应使用 Tabs）。',
      'items 使用重复 key，展开一个面板却联动影响其他面板。',
    ],
  },

  'component.carousel': {
    dsl: {
      "type": "Carousel",
      "props": {
        "loop": true,
        "autoplay": 3000,
        "items": [
          {
            "src": "https://example.com/banner-ops.png",
            "alt": "运营看板"
          },
          {
            "src": "https://example.com/banner-growth.png",
            "alt": "增长分析"
          },
          {
            "src": "https://example.com/banner-insight.png",
            "alt": "客户洞察"
          }
        ]
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 同一位置轮播多张内容：运营 Banner、活动位、图片展示区。',
      '- 每屏一个焦点内容、用户顺序浏览即可，不需要并排比较。',
      '- 图片素材或 DSL 子树需要按序轮播（items 两种形态可混排）。',
      '',
      '**何时不用**',
      '',
      '- 需要并排比较、全部可见：使用 Gallery 或 Grid 平铺，轮播会隐藏大部分内容。',
      '- 单张图片展示：直接使用 Image；放大与切换查看：使用 ImageViewer。',
      '- 内容需要被检索 / 深链定位：轮播项默认不可直达，应改用列表 + 详情页。',
    ].join('\n'),
    previewNote:
      '静态结构：Carousel 基于 vendored embla（data-slot="carousel"）：根容器内为 data-slot="carousel-viewport" 视口，逐项 data-slot="carousel-item"；items 元素为图片对象 { src, alt } 时渲染 w-full object-cover 圆角 <img>，为 DSL 节点时经 renderChildren 渲染。左右两侧为 data-slot="carousel-previous" / "carousel-next" 圆形导航按钮。loop 映射 embla loop；autoplay 以定时器驱动 scrollNext（true 用间隔 3000ms，数字为间隔毫秒数），抵达末尾时 loop 开启则回绕、否则停在末页。',
    variants: [
      { name: '默认（手动切换）', visual: '单屏一项 + 左右圆形导航按钮', scene: '用户自主浏览的图片 / 内容轮播' },
      { name: 'loop 循环', visual: '末项之后回到首项', scene: '数量不多、希望连续浏览的轮播' },
      { name: 'autoplay 自动播放', visual: '按间隔自动切换到下一项（true 为 3000ms）', scene: '展示型 Banner，无需用户操作' },
      { name: 'DSL 子树项', visual: '轮播项由 DSL 节点渲染（非图片）', scene: '轮播内需要卡片、图文组合等复杂内容' },
    ],
    apiProps: [
      { name: 'items', type: 'CarouselItemData[]', defaultValue: '[]', description: '轮播项：图片 { src, alt? } 对象或 DSL 子树（经 renderChildren 渲染），可混排' },
      { name: 'loop', type: 'boolean', defaultValue: 'false', description: '循环滚动；同时作用于手动切换与 autoplay 的回绕行为' },
      { name: 'autoplay', type: 'boolean | number', defaultValue: '—', description: '自动播放：true 用默认间隔 3000ms，数字为间隔毫秒数；不传则不自动播放' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 轮播项数量控制在 3-5 个：隐藏内容越多，用户越可能完全错过；必要时提供指示或缩略导航。',
      '- autoplay 间隔不宜过快（建议 ≥3000ms），且必须让用户能暂停或手动切换；正文信息不要只放在自动轮播中。',
      '- 图片项务必提供 alt（缺省为空字符串），既是无障碍替代文本也是加载失败时的上下文。',
      '- 切换是瞬时的，无过渡时长配置；不要用轮播承载必须被完整阅读的内容。',
      '- items 混排图片与 DSL 子树时保证每项高度一致，否则容器高度会随项跳动。',
    ].join('\n'),
    examplesDo: [
      '首页 Banner：3 张运营图 + loop + autoplay={5000}，用户可点箭头手动切换。',
      '图文推荐位：items 传 DSL 子树（Image + Text + Button 组合），与页面同一渲染路径。',
      '内容区展示：loop 开启但关闭 autoplay，由用户自主浏览。',
    ],
    examplesDont: [
      '用轮播承载需要被检索 / 深链定位的内容（应改用列表 + 详情页）。',
      'autoplay 间隔设为 1000ms 且不可暂停，用户来不及阅读。',
      '轮播项高度不一致又不给约束，切换时容器高度反复跳动。',
    ],
  },

  'component.empty': {
    dsl: {
      "type": "Empty",
      "props": {
        "title": "暂无订单",
        "description": "创建第一个订单后，可在这里查看进度。"
      },
      "children": [
        {
          "type": "Button",
          "props": {
            "text": "新建订单",
            "variant": "primary",
            "size": "small"
          },
          "events": {
            "onClick": {
              "action": "navigate",
              "params": { "to": "/orders/new" }
            }
          }
        }
      ]
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 确定无数据可展示时的占位：筛选无结果、列表为空、尚未创建任何内容。',
      '- 需要引导用户下一步动作：children 传操作按钮（「新建记录」「清除筛选」）。',
      '- 需要给出无数据原因的说明（description），避免用户以为页面出错。',
      '',
      '**何时不用**',
      '',
      '- 数据正在加载、结构已知：使用 Skeleton（骨架屏）——确定无数据用 Empty，加载中结构占位用 Skeleton。',
      '- 请求失败或无权访问：使用 Result / Alert 类反馈组件，Empty 只表达「没有数据」而非「出错了」。',
      '- 局部无数据的极简场景（表格空行、下拉无匹配）：组件内部已有的空态足以承担，不必再套 Empty。',
    ].join('\n'),
    previewNote:
      '静态结构：Empty 渲染为 data-slot="empty" 居中容器：data-slot="empty-header" 内可选 data-slot="empty-title"（标题）与 data-slot="empty-description"（辅助说明，弱化色文本）；children 存在时另渲染 data-slot="empty-content" 操作区，为 DSL 子树经 Renderer children 机制渲染（如「新建记录」按钮）。title / description 均缺省时不渲染对应节点。',
    variants: [
      { name: '标题 + 说明（缺省）', visual: '居中标题 + 弱化说明文案', scene: '告知无数据并解释原因' },
      { name: '带操作区', visual: '说明下方追加 children 操作按钮', scene: '引导用户下一步（新建、清除筛选）' },
      { name: '仅标题', visual: '只有一行标题（description 缺省）', scene: '紧凑容器内的极简空态' },
      { name: '仅说明', visual: '只有描述文案（title 缺省）', scene: '标题已由外层容器提供的场景' },
    ],
    apiProps: [
      { name: 'title', type: 'string', defaultValue: '—', description: '空状态标题；缺省不渲染' },
      { name: 'description', type: 'string', defaultValue: '—', description: '辅助说明文案（弱化色）；缺省不渲染' },
      { name: 'children', type: 'ReactNode', defaultValue: '—', description: '操作区（DSL 子树经 Renderer children 机制渲染）；缺省不渲染操作区' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 区分三种状态：加载中用 Skeleton、确定无数据用 Empty、请求失败用 Result / Alert——不要把失败伪装成空数据。',
      '- description 说明「为什么没有」与「怎么办」（如「当前筛选条件下没有匹配的记录，可调整条件后重试」）。',
      '- 操作区只给一个主行动（清除筛选 / 新建），多个入口会稀释引导效果；CTA 必须接真实事件，navigate 目标需在 sitemap 可达。',
      '- 空态文案与上下文一致：不同筛选条件导致的空态应带上当前条件的关键信息。',
      '- 表格、下拉等组件自带空态时不要叠加 Empty，避免双重占位与视觉噪音。',
    ].join('\n'),
    examplesDo: [
      '列表无结果：title「暂无数据」+ description 说明筛选条件 + children「清除筛选」按钮。',
      '尚无内容：description「还没有创建任何报表」+ primary「新建记录」引导创建。',
      '加载失败区分：失败场景改用 Result 并给重试入口，不混用 Empty。',
    ],
    examplesDont: [
      '数据仍在加载时就展示 Empty，用户以为真的没有数据（应使用 Skeleton）。',
      '请求失败 / 无权限时展示 Empty，掩盖了真实错误并缺少重试入口。',
      '在 Table 空态上再套一层 Empty，出现两处「暂无数据」。',
    ],
  },

  'component.data-table': {
    dsl: {
      "type": "DataTable",
      "props": {
        "columns": [
          {
            "key": "name",
            "title": "页面"
          },
          {
            "key": "visits",
            "title": "访问量",
            "sortable": true
          },
          {
            "key": "trend",
            "title": "趋势"
          }
        ],
        "rows": [
          {
            "id": 1,
            "name": "首页",
            "visits": 12840,
            "trend": "上升"
          },
          {
            "id": 2,
            "name": "列表页",
            "visits": 8932,
            "trend": "持平"
          },
          {
            "id": 3,
            "name": "详情页",
            "visits": 6420,
            "trend": "上升"
          },
          {
            "id": 4,
            "name": "设置页",
            "visits": 2180,
            "trend": "下降"
          },
          {
            "id": 5,
            "name": "帮助中心",
            "visits": 1546,
            "trend": "持平"
          }
        ],
        "pagination": {
          "pageSize": 3
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 在一个表格内同时需要排序、列筛选与分页：运营数据表、明细查询结果。',
      '- 高密度数据浏览：列较多、行较多，用户需要快速定位与排序比较。',
      '- 需要在表头以输入框做列级筛选（客户端包含匹配）而非跳转筛选表单。',
      '',
      '**何时不用**',
      '',
      '- 只需展示与简单分页、无需排序筛选：使用 Table，结构更轻。',
      '- 单对象的字段集：使用 Descriptions；条目浏览型集合：使用 List。',
      '- 需要真正的虚拟化、行内编辑与列拖拽等大数据网格能力：当前实现为客户端排序 / 筛选 / 分页，无虚拟滚动，超大结果集应在数据源侧分页。',
    ].join('\n'),
    previewNote:
      '静态结构：DataTable 根节点 data-slot="data-table"（relative），表格结构与 Table 一致（TableHeader / TableBody / TableRow / TableHead / TableCell）。sortable 列表头渲染 data-slot="data-table-sort" 按钮（未排序显示 ArrowUpDown 弱化图标，升 / 降序显示对应箭头），点击在 asc / desc 间切换并重置到第一页；filterable 列表头追加 data-slot="data-table-filter" 窄高筛选输入（客户端按单元格文本包含匹配，多列筛选同时生效）。单元格按 column.children（别名 renderChildren）子树经 Renderer 注入 { row, rowIndex } 渲染，否则取 row[column.key]（对象 JSON 序列化）。无数据行渲染 data-slot="table-empty"「暂无数据」；pagination.pageSize 存在时底部渲染 data-slot="table-pagination" 页码按钮。',
    variants: [
      { name: '默认（无分页）', visual: '表头 + 全量数据行', scene: '行数可控的明细表' },
      { name: 'pagination 分页', visual: '底部页码按钮，按 pageSize 切片', scene: '数据量超过一屏的查询结果' },
      { name: 'sortable 排序', visual: '表头排序按钮 + 升降序箭头，点击切换并回到第一页', scene: '按数值或文本列快速排序比较' },
      { name: 'filterable 列筛选', visual: '表头下方窄高筛选输入，实时包含匹配', scene: '列级快速过滤（名称、负责人等）' },
      { name: '自定义单元格', visual: '按 column.children 子树渲染，作用域含 row / rowIndex', scene: '单元格内渲染标签、进度等复合内容' },
      { name: '空态', visual: '「暂无数据」占满整行', scene: 'rows 为空或筛选后无匹配' },
    ],
    apiProps: [
      { name: 'columns', type: 'DataTableColumn[]', defaultValue: '[]', description: '列定义；项结构 { key, title?, sortable?, filterable?, children?: DslNode[], renderChildren?: DslNode[] }' },
      { name: 'rows', type: 'Record<string, unknown>[]', defaultValue: '[]', description: '数据行（通常为 ${data.xxx} 表达式解析结果）' },
      { name: 'rowKey', type: 'string', defaultValue: "'id'", description: '行 key 字段；缺失时回退行序号' },
      { name: 'pagination', type: 'false | { pageSize?: number }', defaultValue: '—', description: '分页配置：false 关闭（不渲染页码）；{ pageSize } 开启并按页切片' },
      { name: 'sort', type: 'DataTableSort（{ key, order }）', defaultValue: '—', description: '受控初始排序（order 为 asc / desc）；后续点击表头由组件内部维护' },
      { name: 'onSort', type: '(sort: DataTableSort) => void', defaultValue: '—', description: '排序变化事件，传出 { key, order }（Renderer 绑定 events.onSort）' },
      { name: 'onPageChange', type: '(page: number) => void', defaultValue: '—', description: '翻页事件，传出页码 number（Renderer 绑定 events.onPageChange）' },
      { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', description: '通用：根节点 class 合并 / 内联样式' },
    ],
    guidelines: [
      '- 只有需要排序 / 筛选 / 分页组合能力时才用 DataTable；纯展示集合用 Table 更低成本。',
      '- 排序为客户端实现：数值列按数值比较，其余按字符串 localeCompare；大数据集应在数据源侧排序分页。',
      '- filterable 为客户端「包含匹配」且多列同时生效，适合快速定位；复杂筛选条件仍走筛选表单 + 数据源。',
      '- 排序、筛选、翻页都会重置到第一页，联动数据源时把 onSort / onPageChange 的参数透传给查询。',
      '- 列 key 必须唯一且与行字段名一致（无 children 模板时按 key 取值），否则单元格为空。',
    ].join('\n'),
    examplesDo: [
      '访问量明细：columns 给 visits 开 sortable，点击表头按数值升降序，onSort 透传查询参数。',
      '列级筛选：名称列 filterable，输入关键字实时过滤；配合 pagination 控制单页行数。',
      '复合单元格：趋势列用 children 子树渲染 Tag，作用域取 ${row.trend} 着色。',
    ],
    examplesDont: [
      '只需要展示与简单分页也用 DataTable（应使用 Table，减少不必要的交互面）。',
      '把上万行数据一次性塞入 rows 期待虚拟化（实现无虚拟滚动，应在数据源侧分页）。',
      '列 key 与行字段名不一致又未提供 children 模板，单元格渲染为空。',
    ],
  },
};
