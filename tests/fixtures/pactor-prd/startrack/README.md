# 星轨项目台 PRD

## 1. 产品概述

“星轨项目台”是一个虚构的轻量项目管理后台，帮助小团队查看项目健康度、检索项目并维护项目资料。本需求用于从空目录新建 Pactor 工程；没有原产品代码或视觉稿，视觉以本 PRD、逐页 UI 计划和模板标准骨架为依据。

工程只包含登录、仪表盘、项目列表、项目详情四个页面，不增加供应商、模型路由、页面骨架或独立新建/编辑路由。

## 2. 模板 values

复制模板后，以下 12 个键必须全部写入 flat values JSON，键名和字符串值逐字使用，不增删键：

| Key | 明确值 |
| --- | --- |
| `APP_NAME` | `startrack-project-hub` |
| `APP_TITLE` | `星轨项目台` |
| `APP_DESCRIPTION` | `让项目进度沿清晰轨道持续推进` |
| `DEMO_ACCOUNT_HINT` | `演示账号：startrack-admin / Orbit#2026；startrack-guest / Trail#2026` |
| `DEMO_ADMIN_USERNAME` | `startrack-admin` |
| `DEMO_ADMIN_PASSWORD` | `Orbit#2026` |
| `DEMO_ADMIN_NAME` | `林澈` |
| `DEMO_GUEST_USERNAME` | `startrack-guest` |
| `DEMO_GUEST_PASSWORD` | `Trail#2026` |
| `DEMO_GUEST_NAME` | `周遥` |
| `DEMO_DATE_START` | `2026-10-01` |
| `DEMO_DATE_END` | `2026-10-31` |

浏览器标题、侧边栏品牌和登录品牌区均显示“星轨项目台”；metadata 描述使用上述 `APP_DESCRIPTION`。保留 neutral 默认皮肤并支持明暗切换，不保留任何旧品牌、旧账号或旧皮肤。

## 3. 页面清单与路由

全部为 P0。页面文件名（不含 `.yaml`）、`page.id` 和 sitemap `pages.id` 必须一致；不得注册额外页面。

| Page id | 文件 | Path | Menu id | 菜单可见性 | activeMenu | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| `login` | `pages/login.md` | `/login` | `login` | `hidden: true`，`layout: login`，`public: true` | 无 | 登录线框 |
| `dashboard` | `pages/dashboard.md` | `/` | `home` | 一级可见菜单，标题“工作台”，`layout: admin` | 无 | 仪表盘线框 |
| `project-list` | `pages/project-list.md` | `/projects` | `projects` | 一级可见菜单，标题“项目”，`layout: admin` | 无 | 项目列表线框 |
| `project-detail` | `pages/project-detail.md` | `/projects/:id` | `project-detail` | `hidden: true`，`layout: admin` | `projects` | 项目详情线框 |

路由全集仅为 `/login`、`/`、`/projects`、`/projects/:id`。新建和编辑均使用抽屉，不创建 `/projects/new` 或 `/projects/:id/edit`。登录和详情虽隐藏菜单，但必须能分别经退出/直接访问和项目入口到达；详情保持“项目”菜单高亮。

## 4. 固定数据接口

页面 `dataSources` 一律使用 `type: http`，URL 必须取以下同源路径，不改写为 service，也不增加其他业务接口。登录沿用模板 `/api/auth/login` 与 `/api/auth/logout`，不属于页面 dataSources。

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/api/d/dashboard` | 统计卡片和最近项目，无查询参数 |
| GET | `/api/d/projects?keyword=&status=` | 项目查询；两个参数始终由搜索 Form 状态驱动 |
| GET | `/api/d/projects/:id` | 详情和编辑预填；`:id` 为项目 id，不是 code |
| POST | `/api/d/ops/project-save` | 新建和编辑共用的保存入口 |

### 4.1 项目字段与初始数据

项目 JSON 字段固定为 `id/name/code/status/owner/progress/dueDate/description/updatedAt`。`status` 仅取 `ACTIVE`（进行中）或 `COMPLETED`（已完成），`progress` 为 0–100 的数值。初始两条记录为：

| id | name | code | status | owner | progress | dueDate | description | updatedAt |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `prj-aurora` | 极光移动端 | AURORA | ACTIVE | 林澈 | 68 | 2026-11-15 | 完成星轨项目台移动端的核心协作流程。 | 2026-10-18 09:30 |
| `prj-atlas` | 星图数据迁移 | ATLAS | COMPLETED | 周遥 | 100 | 2026-10-10 | 将历史项目数据迁移到统一星图模型。 | 2026-10-10 18:00 |

### 4.2 响应契约

- Dashboard 返回 `{ "stats": { "total": 2, "active": 1, "completed": 1 }, "recentProjects": [项目...] }`；`recentProjects` 按 `updatedAt` 降序，最多 5 条，统计值始终根据当前内存数据计算。
- 列表返回 `{ "items": [项目...], "total": 数量, "filters": { "status": [{ "label": "全部", "value": "all" }, { "label": "进行中", "value": "ACTIVE" }, { "label": "已完成", "value": "COMPLETED" }] } }`。`keyword` 对 name/code 做不区分大小写的包含匹配，`status=all` 或空值表示不限，其余值精确匹配；两个条件同时生效。
- 详情直接返回单个项目对象；未知 id 返回 HTTP 404 和 `{ "error": "项目不存在" }`。
- 保存请求体为完整表单对象：新建无 `id` 或 `id=""`，编辑带原 `id`；字段为 `id/name/code/status/owner/progress/dueDate/description`。服务端创建或更新内存记录并刷新 `updatedAt`。
- 保存成功的上游响应为 `{ "code": 0, "data": { "ok": true }, "message": "ok" }`，经模板默认拆包后页面只看到 `{ "ok": true }`。只有 HTTP 2xx 且拆包后 `ok == true` 才允许提示“保存成功”、关闭抽屉并刷新当前数据；HTTP 错误、空响应或 `ok != true` 都走失败分支。

## 5. 跨页面交互与状态约束

- 所有页面具备真实 loading/error/empty 状态接线；error 不伪装成 empty，loading 时不闪空态。错误提示用 `Alert` 或等价反馈组件并提供明确“重试”按钮。
- 列表、详情和保存分别覆盖 list-error、detail-error、save-error。重试必须重新发起原请求；保存恢复后可在原抽屉再次提交。
- 保存失败必须显示“保存失败，请保留当前内容后重试”或包含“保存失败”“重试”的明确反馈，抽屉不关闭、表单已输入内容不丢失、不得提前刷新为旧值。
- 列表无结果时使用 `Empty`，文案“没有找到匹配的项目”，主操作“清除筛选”；点击后同时清空 keyword、恢复 status=all 并重新查询。重置按钮执行相同查询状态复位。
- 编辑抽屉预填当前项目全部字段；新建抽屉为空白默认值（status=ACTIVE、progress=0）。新建与编辑在列表页复用同一 Form/Drawer，只允许初始值和标题不同。
- 页面主操作在 1440×900 与 390×844 均可达；390px 不得出现整页横向滚动，表格可在自身区域横向滚动。抽屉在窄屏不得超出视口。
- 亮色和暗色下文本、输入框、表格、Empty、Alert、Drawer 均保持可读；门户浮层也使用语义令牌，不用硬编码死色。
- 文案采用中文，金额、趋势、供应商、路由管理等无关模块不得出现。不要用装饰性图表代替本 PRD 要求的统计和最近项目。

## 6. 分页线框

逐页区域、ASCII 线框、组件和交互见：

- `pages/login.md`
- `pages/dashboard.md`
- `pages/project-list.md`
- `pages/project-detail.md`
