# Design: pactor-prd-experience-distill

## Context

模板既是复制起点，也是页面布局与交互的参考实现，因此它必须先达到“可独立运行、无真实项目残留、无已知骨架缺陷”的基准。旧草案的空皮肤、`grep "{{"`、单一日期范围占位和仅文档化 isOpaque 坑均不能满足该目标。

## Goals / Non-Goals

**Goals**

- 源模板合法、可替换、可检查，临时副本替换后仍可 lint/build/run。
- 默认主题中性且精致，模板页面在布局、间距和组件选择上可作基准。
- 清除真实项目专属内容和已知骨架缺陷。

**Non-Goals**

- 不修改框架 runtime 或组件行为。
- 不重构 provider/route 的 `items[0..7]` 卡片结构。
- 不在本 change 完成全量 references 蒸馏或最终 PRD 生成 E2E。

## Decisions

### D1. 单一占位符清单与安全编码

`template-placeholders.json` 记录 12 个键及冒烟示例值：`APP_NAME`、`APP_TITLE`、`APP_DESCRIPTION`、`DEMO_ACCOUNT_HINT`、管理员/访客的 `DEMO_*_USERNAME/PASSWORD/NAME`、`DEMO_DATE_START`、`DEMO_DATE_END`。

所有占位符以完整双引号字面量出现，例如 `"{{APP_NAME}}"`。`skills/scripts/prd-template.mjs` 提供：

- `render <dir> --values <json-file>`：校验缺失/未知/非字符串值，预计算全部替换后一次性写回；用 `JSON.stringify(value)` 替换包含引号的完整字面量。
- `check <dir> --source`：检查源模板键集合、完整字面量形式和禁止数据。
- `check <dir> --rendered`：检查清单键与旧真实数据零残留。

仅扫描 `.yaml/.yml/.ts/.tsx/.json`，跳过 `.git/node_modules/.next`；普通 JSX `style={{...}}` 和 DSL `${...}` 不参与替换。

### D2. 保留数据形状和授权机制

- 日期继续使用 `{ start, end }`，分别替换两个 ISO 字符串。
- 管理员/访客权限作为模板机制保留，`user:view` 授权检查与管理员权限一致；访客仍用于验证 401。
- `MOCK_USERS` 由两个演示账号派生，保留响应字段、过滤和鉴权，不维护八条真实用户样例。
- 通用业务示例可以保留；真实品牌、历史产品名、账号密码、专属皮肤和调试内容必须清除。

### D3. 中性默认皮肤而非空注册表

新增 `public/skins/neutral.css`，包含完整亮暗色语义令牌、组件级令牌（含 input surface）、图表和反馈色。注册表只含 `neutral`，非法或旧 localStorage 值回退到该项；无皮肤 link 时仍须执行明暗初始化。 Theme Studio 生成的额外皮肤可后续加入，不预置数量要求。

### D4. 标准骨架必须先修正确性

`models/data-list.yaml` 的业务字段 `type` 改为 `kind`，同步字段 name、状态镜像、行数据、筛选和提交体；组件节点的 `type` 不改。以此消除 `request.body` 命中 isOpaque 后同层表达式不求值的问题。

### D5. UI 基线落在标准骨架，不新增样式系统

- 搜索区使用 `Form layout: inline`；上下文字段使用 `Field` 管理 label/hint/error 和间距。
- 页头、分区、双列字段、抽屉底部按钮沿用模板统一的 Flex/Grid/gap 规则，不用临时 CSS 修间距。
- 枚举、数值、日期、层级数据分别使用合适的 Pactor 控件；表格操作保持 `Button variant: link`。
- 登录保持 `Login` 业务组件；dashboard 保持响应式网格。

### D6. 验证在临时副本执行

源模板只保留源码。验证顺序为：源检查 → 复制 → 替换 → rendered 检查 → install/lint/build → 浏览器关键路径。含引号、反斜杠和换行的替换值另做边界演练。

## Risks / Trade-offs

- **占位替换破坏源码** → 完整字面量 + JSON 编码 + 先预计算再写入。
- **清理后仍有隐性引用** → 静态验证检查 import、资源路径、品牌词和禁止路径。
- **模板冒烟不能证明最终生成质量** → 明确交由后续 generated-project-acceptance change，不在本阶段夸大结论。
