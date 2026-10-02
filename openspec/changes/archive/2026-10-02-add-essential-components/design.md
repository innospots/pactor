# Design: add-essential-components

## 组件契约

### 数据录入（8，全部支持 Form 集成：name / label / rules）

| 组件 | 关键 props | 事件值 |
| --- | --- | --- |
| Rate | `count`(5) / `allowHalf` / `value` / `disabled` | onChange → number |
| TimePicker | `format`('HH:mm:ss' 缺省 / 'HH:mm') / `value` / `placeholder` | onChange → 时间字符串 |
| ColorPicker | `value`(hex，支持 3/4/6/8 位) / `presets`(hex[]) / `disabled` | onChange → hex 字符串（a<1 时 8 位） |
| Upload | `multiple` / `accept` / `maxSize` / `maxCount` / `drag` / `tip` / `disabled` | onChange → `Array<{ name, size, type }>` |
| TreeSelect | `options`（嵌套 `{ label, value, children? }`）/ `placeholder` / `searchable` | onChange → 选中 value |
| Cascader | `options`（同 TreeSelect）/ `placeholder` | onChange → 选中路径 value 数组 |
| Transfer | `options`(`{ label, value, disabled? }`) / `titles` | onChange → 目标侧 value 数组 |
| Mentions | `options`(`{ label, value }`) / `trigger`('@') / `rows` / `placeholder` | onChange → string |

### 数据展示（7）

| 组件 | 关键 props | 事件值 |
| --- | --- | --- |
| List | `items`(`{ key?, title, description?, avatar?, extra? }`) / `split` / `bordered` | — |
| Tree | `treeData`(`{ key, title, children? }`) / `expandedKeys` / `selectedKeys` / `checkable` / `checkedKeys` | onSelect / onExpand / onCheck → key 数组 |
| Descriptions | `title` / `items`(`{ label, value }`) / `column`(3) / `bordered` | — |
| Timeline | `items`(`{ content, time?, color?, icon? }`) / `pending` | — |
| Image | `src` / `alt` / `width` / `height` / `fallback` / `preview`(true，点击弹层放大) | — |
| QRCode | `value` / `size`(128) / `color` / `bgColor` / `bordered` | — |
| Segmented | `options`(`{ label, value, icon?, disabled? }`) / `value` / `disabled`（可入 Form） | onChange → value |

### 反馈（7）

| 组件 | 关键 props | 说明 |
| --- | --- | --- |
| Message | `content` / `variant` / `duration` | 声明式触发：content 变为非空即发全局短 toast |
| Notification | `title` / `description` / `variant` / `duration` | 声明式触发：title 变为非空即发富通知 toast |
| Popconfirm | `title` / `description` / `confirmText` / `cancelText` / `danger` + children 触发元素 | onConfirm / onCancel |
| Result | `status`(success/error/info/warning/404/403/500) / `title` / `subTitle` + children 操作区 | — |
| LoadingOverlay | `loading` / `text` + children 被覆盖区块 | — |
| Watermark | `content`(string/string[]) / `rotate` / `gap` + children | SVG data-uri 平铺 |
| Tour | `open` / `steps`(`{ target, title, content }`) / `current` | onChange / onClose |

## 关键决策

1. **Message/Notification 不做命令式组件**：全局反馈已有 `toast` 动作 + Sonner 挂载点 + 交互层 `message` 动作。两个新组件以声明式触发器落地（渲染不可见标记节点），让纯 DSL 可凭 state 变化发反馈；vendored toast 原语扩展 `warning` 变体（原 success/error/info 三态）。
2. **Upload 不含网络层**：组件只管选择、accept/maxSize/maxCount 校验、列表与移除，onChange 传可序列化的文件元数据；实际上传由 DSL events 接动作/服务层（符合「动态 DSL 静态能力」）。
3. **QRCode 引 `qrcode` 依赖**：自实现 QR 编码不现实，`qrcode` 输出 SVG 字符串，适配器渲染为内联 SVG。
4. **TreeSelect/Cascader 自包含**：不依赖本批次 Tree 组件（各自内联树/列渲染），避免批内耦合。
5. **Tour 做轻量版**：steps 按 CSS selector 定位（getBoundingClientRect），目标缺失时居中兜底；不提供滚动跟随与高亮镂空。
6. 全部组件沿用既有约定：单目录 `index.tsx`、中文 JSDoc、`className`/`style` 通用 props、事件传 DSL 语义值、表单组件复制 Slider 的 Form 上下文模式。
