# Pactor 完整页面示例索引

本目录中的 YAML 都是**完整 Page DSL 文件**，不是组件片段。它们均以 `dsl: '1.0'`、`page`、`state` / `dataSources` / `body` 为根，覆盖页面结构、数据绑定、交互动作、加载/错误/空态和权限入口。复制到业务工程后，替换接口、服务和业务字段即可。

当前基线已经过以下离线检查：

- YAML 1.2 解析通过
- `@pactor-app/schema` 的 Page DSL Schema 校验通过
- 所有 `${...}` 表达式通过 `@pactor-app/expression` 语法解析

示例中的 `/api/...`、`project.list`、`task.save` 等是**宿主契约占位符**。Pactor Runtime 不会自动提供这些接口或服务，业务工程必须实现，或替换为现有接口名称。

## 1. 按任务选择示例

| 任务 / 页面类型 | 完整示例 | 在线说明 |
| --- | --- | --- |
| 搜索、筛选、服务端分页、批量选择 | [`search-list.page.yaml`](search-list.page.yaml) | [搜索列表模板](https://pactor.innospots.com/templates/search-list/) |
| 基础列表、客户端分页、行操作、删除确认 | [`customer-list.page.yaml`](customer-list.page.yaml) | [Table](https://pactor.innospots.com/components/data-display/table/) |
| 详情、Descriptions、Tabs、Timeline | [`record-detail.page.yaml`](record-detail.page.yaml) | [Tab 详情](https://pactor.innospots.com/templates/detail-tabs/) · [纵向详情](https://pactor.innospots.com/templates/detail-sections/) |
| 独立新建/编辑表单页 | [`record-edit.page.yaml`](record-edit.page.yaml) | [表单页模板](https://pactor.innospots.com/templates/form-page/) |
| Dialog 内新建/编辑表单 | [`dialog-form.page.yaml`](dialog-form.page.yaml) | [弹窗模板](https://pactor.innospots.com/templates/modal-confirm/) · [Dialog](https://pactor.innospots.com/components/feedback/dialog/) |
| Drawer 内编辑表单、默认 footer 提交 | [`drawer-form.page.yaml`](drawer-form.page.yaml) | [侧滑层模板](https://pactor.innospots.com/templates/drawer-form/) · [Drawer](https://pactor.innospots.com/components/feedback/drawer/) |
| 登录页 | [`login.page.yaml`](login.page.yaml) | [登录布局](https://pactor.innospots.com/templates/login-layouts/) · [Login](https://pactor.innospots.com/components/blocks/login/) |
| 注册页（Login + 自定义 Form） | [`register.page.yaml`](register.page.yaml) | [Login](https://pactor.innospots.com/components/blocks/login/) · [Form](https://pactor.innospots.com/components/data-entry/form/) |
| AI 对话 | [`chat.page.yaml`](chat.page.yaml) | [聊天页模板](https://pactor.innospots.com/templates/chat-page/) · [AI Chat](https://pactor.innospots.com/components/ai-chat/) |
| 顶部导航、章节菜单、站点页脚 | [`navigation.page.yaml`](navigation.page.yaml) | [NavigationMenu](https://pactor.innospots.com/components/navigation/navigation-menu/) · [Menu](https://pactor.innospots.com/components/navigation/menu/) |
| 指标卡、趋势图、分类对比 | [`dashboard.page.yaml`](dashboard.page.yaml) | [仪表盘模板](https://pactor.innospots.com/templates/dashboard/) |
| 卡片列表、整卡点击、卡内操作 | [`card-list.page.yaml`](card-list.page.yaml) | [卡片列表模板](https://pactor.innospots.com/templates/card-list/) · [CardList](https://pactor.innospots.com/components/blocks/card-list/) |
| 树形主从、选择节点、右侧表单 | [`tree-master-detail.page.yaml`](tree-master-detail.page.yaml) | [树形主从模板](https://pactor.innospots.com/templates/tree-master-detail/) · [Tree](https://pactor.innospots.com/components/data-display/tree/) |

## 2. 宿主注册基线

默认 UI 组件由 `createComponentRegistry()` 提供。业务区块、图表和聊天必须显式合并注册表并导入样式：

```tsx
import { createPactorApplication } from '@pactor-app/app';
import { createComponentRegistry } from '@pactor-app/ui/components';
import { registerBlockComponents } from '@pactor-app/blocks';
import { registerChartComponents } from '@pactor-app/chart';
import { registerChatComponents, registerChatComponent } from '@pactor-app/chat';

import '@pactor-app/ui/styles.css';
import '@pactor-app/blocks/styles.css';
import '@pactor-app/chart/styles.css';
import '@pactor-app/chat/styles.css';

function createRegistry() {
  const registry = createComponentRegistry();
  registerBlockComponents(registry);
  registerChartComponents(registry);
  registerChatComponents(registry);
  registerChatComponent(registry);
  return registry;
}

createPactorApplication({
  appId: 'example-app',
  componentRegistry: createRegistry,
}).mount('#root');
```

| 示例 | 默认 UI | Blocks | Charts | Chat | 额外宿主能力 |
| --- | :---: | :---: | :---: | :---: | --- |
| `search-list` | 是 | — | — | — | 客户列表 HTTP API |
| `customer-list` | 是 | — | — | — | 客户 HTTP API |
| `record-detail` | 是 | — | — | — | 项目详情与删除 API |
| `record-edit` | 是 | — | — | — | 项目详情 API、`project.update` |
| `dialog-form` | 是 | — | — | — | `project.list`、`project.save` |
| `drawer-form` | 是 | — | — | — | `task.list`、`task.save` |
| `login` | 是 | 是 | — | — | `auth.login`、登录态写入、`login` layout |
| `register` | 是 | 是 | — | — | `auth.register`、`login` layout |
| `chat` | 是 | — | — | 是 | `ChatServicesProvider` + `transport` |
| `navigation` | 是 | 是 | — | — | `blank` / `landing` layout |
| `dashboard` | 是 | — | 是 | — | 看板 HTTP API、`analytics:view` |
| `card-list` | 是 | 是 | — | — | 项目列表/归档 HTTP API |
| `tree-master-detail` | 是 | — | — | — | 导航树/节点 API、`navigation.save` |

`ChatServicesProvider` 的最小接线示例：

```tsx
import {
  ChatServicesProvider,
  type ChatEvent,
  type ChatTransport,
} from '@pactor-app/chat';

// 服务端按 NDJSON 逐行返回 ChatEvent；也可改用 SSE/WebSocket 适配。
const transport: ChatTransport = {
  async *send(input, options) {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
      signal: options?.signal,
    });
    if (!response.ok || response.body === null) {
      throw new Error(`Chat request failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (line.trim() !== '') yield JSON.parse(line) as ChatEvent;
      }
      if (done) break;
    }
    if (buffer.trim() !== '') yield JSON.parse(buffer) as ChatEvent;
  },
};

function Root() {
  return (
    <ChatServicesProvider
      value={{
        transport,
        callService: async (name, params) => {
          const response = await fetch(`/api/chat/services/${name}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(params ?? {}),
          });
          if (!response.ok) throw new Error(`Service failed: ${name}`);
          return response.json();
        },
      }}
    >
      {/* Pactor app mount / router */}
    </ChatServicesProvider>
  );
}
```

## 3. 路由与布局映射

示例页面文件本身不注册路由。宿主需要把它们加入 `sitemap.pages` + `menus`，或加入 `StaticDslLoader.pages` + `bootstrap.menus`。

| 示例 | 建议 path | 全局 layout | 菜单策略 |
| --- | --- | --- | --- |
| `search-list` | `/customers` | `admin` | 可见 |
| `customer-list` | `/customers-basic` | `admin` | 可见或仅作参考 |
| `record-detail` | `/projects/:id` | `admin` | hidden，`activeMenu` 指向项目列表 |
| `record-edit` | `/projects/:id/edit` | `admin` | hidden，`activeMenu` 指向项目列表 |
| `dialog-form` | `/projects` | `admin` | 可见 |
| `drawer-form` | `/tasks` | `admin` | 可见 |
| `login` | `/login` | `login` | 可见或公开路由 |
| `register` | `/register` | `login` | 可见或公开路由 |
| `chat` | `/chat` | `chat` 或 `blank` | 可见 |
| `navigation` | `/docs` | `blank` / `landing` | 可见 |
| `dashboard` | `/dashboard` | `admin` | 可见 |
| `card-list` | `/project-gallery` | `admin` | 可见 |
| `tree-master-detail` | `/system/navigation` | `admin` | 可见 |

```yaml
pages:
  - { id: search-list, path: /customers, title: 客户列表, version: 1, lazy: true }
  - { id: record-detail, path: /projects/:id, title: 项目详情, version: 1, lazy: true }
  - { id: record-edit, path: /projects/:id/edit, title: 编辑项目, version: 1, lazy: true }
  - { id: login, path: /login, title: 登录, version: 1, lazy: true }
  - { id: register, path: /register, title: 注册, version: 1, lazy: true }
  - { id: chat, path: /chat, title: AI 助手, version: 1, lazy: true }

menus:
  - id: projects
    type: group
    title: 项目管理
    children:
      - { id: nav-projects, type: page, pageId: search-list, title: 客户列表 }
      - { id: nav-project-detail, type: page, pageId: record-detail, title: 项目详情, hidden: true, activeMenu: nav-projects }
      - { id: nav-project-edit, type: page, pageId: record-edit, title: 编辑项目, hidden: true, activeMenu: nav-projects }
```

`activeMenu` 指向菜单 id，不是 page id。`params.id` 来自路由 `:id`。

## 4. 数据与交互契约

### 4.1 `search-list.page.yaml`

- 结构：面包屑 → 标题/新建 → 错误重试 → 查询 Form → 数据 Table → 服务端 Pagination。
- 数据：`GET /api/customers`，响应 `{ list: Customer[], total: number }`。
- 交互：查询 `setState → reload`；重置 `form.setValues → resetState → reload`；分页/每页条数回写 state 后由 `onChange` 统一 reload；多选回写 `selectedKeys`；删除先 `confirm` 再请求。
- 状态：`Table.loading`、`emptyText`、`Alert + retry`、权限 disabled。
- 必读文档：[Form](https://pactor.innospots.com/components/data-entry/form/) · [Table](https://pactor.innospots.com/components/data-display/table/) · [Pagination](https://pactor.innospots.com/components/navigation/pagination/)

### 4.2 `customer-list.page.yaml`

- 结构：与搜索列表相似，但使用客户端分页和返回数组的数据源，适合作为最小列表基线。
- 数据：`GET /api/customers`，响应 `Customer[]`。
- 交互：查询、重置、查看、编辑、删除确认、重试。
- 选型：需要服务端分页时优先 `search-list.page.yaml`。

### 4.3 `record-detail.page.yaml`

- 结构：面包屑 → 标题/状态/操作 → 错误态 → Tabs（基本信息 / 动态记录）→ 删除确认。
- 数据：`GET /api/projects/:id`，返回项目对象，可选 `timeline: TimelineItem[]`。
- 交互：编辑跳转 `/projects/:id/edit`；删除调用 `DELETE /api/projects/:id`；成功后返回列表；失败保留详情并提示。
- 宿主：详情或删除接口返回非 2xx 时必须进入 `dataStatus.record.error`，页面会显示对应错误；业务需自行把 404 映射为可读消息。
- 必读文档：[Descriptions](https://pactor.innospots.com/components/data-display/descriptions/) · [Tabs](https://pactor.innospots.com/components/navigation/tabs/) · [Timeline](https://pactor.innospots.com/components/data-display/timeline/)

### 4.4 `record-edit.page.yaml`

- 结构：面包屑 → 页头 → 错误/重试 → Card → `Form` → 取消/保存。
- 数据：`GET /api/projects/:id`；保存服务 `project.update(data)`。
- 关键点：Form 只在详情加载完成且存在时挂载，使用 `initialValues: ${data.record}`；字段使用 `name + label + rules`；提交中禁用保存；失败将服务错误写入 `saveError` 并保留输入。
- 必读文档：[Form](https://pactor.innospots.com/components/data-entry/form/) · [DatePicker](https://pactor.innospots.com/components/data-entry/date-picker/) · [Row / Col](https://pactor.innospots.com/components/layout/row/)

### 4.5 `dialog-form.page.yaml`

- 结构：列表保持可见 → 受控 `Dialog` → `Form` → 取消/保存。
- 数据：`project.list()` 返回 `Project[]`；`project.save(data)` 同时处理新建和编辑。
- 关键点：新建/编辑先把字段值写入 `state.dialogValues` 并打开 Dialog，Form 挂载时读 `initialValues`；不要在同一条打开链路里提前调用 `form.setValues`，因为此时 Form 可能尚未挂载。Dialog 无默认 footer，所以按钮放在 Form 内；提交成功后 `setState(dialogOpen=false) + reload`。
- 必读文档：[Dialog](https://pactor.innospots.com/components/feedback/dialog/) · [Form](https://pactor.innospots.com/components/data-entry/form/)

### 4.6 `drawer-form.page.yaml`

- 结构：列表保持可见 → 受控 `Drawer` → `Form`，默认 footer 为取消/保存。
- 数据：`task.list()` 返回 `Task[]`；`task.save(data)` 新建/更新。
- 关键点：打开前把编辑值写入 `state.drawerValues`，Form 挂载时读 `initialValues`；footer 位于 `<form>` DOM 外，`onOk` 必须执行 `form.submit` 并指定 `form: taskDrawer`；`onClose` 统一关闭；保存失败把错误写入 `saveError`，Drawer 内 Alert 展示。
- 必读文档：[Drawer](https://pactor.innospots.com/components/feedback/drawer/) · [Form](https://pactor.innospots.com/components/data-entry/form/)

### 4.7 `login.page.yaml`

- 结构：`login` 全局布局 → `Login` 业务区块 → 账号/密码 → 辅助链接。
- 数据：`auth.login({ username, password })`，成功时需要由宿主持久化 token、用户与权限。
- 交互：成功 `message + navigate`；失败提示并保留输入。
- 必读文档：[Login](https://pactor.innospots.com/components/blocks/login/) · [登录布局](https://pactor.innospots.com/templates/login-layouts/)

### 4.8 `register.page.yaml`

- 结构：没有独立 `Register` 类型，使用 `Login + children Form`。
- 数据：`auth.register({ username, email, password })`。
- 校验：DSL 当前只执行必填规则，且布尔 `false` 不会被 `required` 判为空；示例用 `state.agreed` 禁用提交。`password === confirmPassword` 这类跨字段规则也必须在服务端或宿主 Form 扩展中复验。
- 必读文档：[Login](https://pactor.innospots.com/components/blocks/login/) · [Input](https://pactor.innospots.com/components/data-entry/input/) · [Checkbox](https://pactor.innospots.com/components/data-entry/checkbox/)

### 4.9 `chat.page.yaml`

- 结构：`Chat` 一等 DSL 组件，包含空态问候、建议、模型、上下文、工作空间 footer、消息动作和产物面板。
- 宿主：必须用 `ChatServicesProvider` 注入 `transport`；`contexts[].service` 通过 `callService(name, params)` 解析。
- 数据：模型值、会话 id、路由 query 与面板 state 可替换为真实服务；不要尝试在 DSL 中注入函数。
- 必读文档：[聊天页模板](https://pactor.innospots.com/templates/chat-page/) · [AI Chat](https://pactor.innospots.com/components/ai-chat/) · [Chat 源码](https://github.com/innospots/pactor/blob/main/packages/chat/src/view/Chat.tsx)

### 4.10 `navigation.page.yaml`

- 结构：`Layout > Header + NavigationMenu + Content + SiteFooter`，正文内部使用 `Menu` 维护章节。
- 布局：注册到 `blank` 或 `landing`；不要重复全局 `PageOutlet`。
- 交互：顶部导航使用 href 链接；侧边 `Menu.onSelect` 同时回写 `activeSection` 并 `navigate`。
- 依赖：`SiteFooter` 来自 `@pactor-app/blocks`。
- 必读文档：[NavigationMenu](https://pactor.innospots.com/components/navigation/navigation-menu/) · [Menu](https://pactor.innospots.com/components/navigation/menu/) · [SiteFooter](https://pactor.innospots.com/components/blocks/site-footer/)

### 4.11 `dashboard.page.yaml`

- 结构：页头/时间范围/刷新 → 指标带（MetricCard）→ 趋势（LineChart）→ 渠道对比（ColumnChart）→ 运营提醒（Timeline）。
- 数据：`GET /api/dashboard/overview?start=...&end=...`，返回：

```json
{
  "updatedAt": "2026-10-27 10:30",
  "metrics": {
    "revenue": 1280000,
    "revenueTrend": 12.4,
    "newCustomers": 386,
    "newCustomersTrend": 8.1,
    "conversionRate": 18.6,
    "conversionTrend": -1.8,
    "averageOrderValue": 328.5,
    "averageOrderTrend": 3.2
  },
  "trend": [
    { "date": "2026-10-01", "revenue": 42000, "orders": 180 }
  ],
  "channels": [
    { "channel": "自然搜索", "visitors": 3200, "conversions": 620 }
  ],
  "events": [
    { "content": "投放计划已更新", "time": "10:20" }
  ]
}
```

- 状态：加载骨架、错误重试、无指标空态、图表无数据空态；时间范围变化后 reload。
- 依赖：必须注册 `@pactor-app/chart` 并导入图表样式。
- 必读文档：[MetricCard](https://pactor.innospots.com/components/charts/metric-card/) · [LineChart](https://pactor.innospots.com/components/charts/line-chart/) · [ColumnChart](https://pactor.innospots.com/components/charts/column-chart/)

### 4.12 `card-list.page.yaml`

- 结构：面包屑 → 页头新建 → 查询 Form → 错误重试 → `CardList`。
- 数据：`GET /api/projects?keyword=&owner=`，返回 `ProjectCard[]`；单项字段与 `EntityCard` 同形。
- 交互：新建占位卡打开新建路由；整卡点击进入详情；卡内 `open`/`archive` 动作分流；归档先确认再 POST。
- 依赖：必须注册 `@pactor-app/blocks`。
- 响应式：`CardList.columns` 是固定列数；窄屏产品应选择 1 列，或在宿主扩展响应式列策略。
- 必读文档：[CardList](https://pactor.innospots.com/components/blocks/card-list/) · [EntityCard](https://pactor.innospots.com/components/blocks/entity-card/)

### 4.13 `tree-master-detail.page.yaml`

- 结构：页头/刷新 → 左 `Tree` + 搜索 → 右节点 Form → 撤销/保存。
- 数据：`GET /api/navigation/tree?keyword=` 返回 `TreeNode[]`；`GET /api/navigation/:key` 返回节点；`navigation.save(data)` 保存。
- 关键点：`Tree.selectedKeys` / `expandedKeys` 受控闭环；选择节点后 reload 详情；详情加载时 Form 卸载，完成后用 `initialValues` 挂载，避免旧节点值残留。
- 必读文档：[Tree](https://pactor.innospots.com/components/data-display/tree/) · [Row / Col](https://pactor.innospots.com/components/layout/row/) · [树形主从模板](https://pactor.innospots.com/templates/tree-master-detail/)

## 5. 复制后检查

1. 替换 `page.id`、文件名、路由 path 和菜单 id；`page.id` 必须全局唯一。
2. 替换 API、service 名称、响应字段和数据源类型，不要保留示例占位接口。
3. 按页面需要补齐宿主服务、HTTP Adapter、权限码和后端授权。
4. 单页运行 `npx pactor validate <file...>`；全部页面运行 `npx pactor lint <dsl-directory>`。
5. 在真实浏览器检查 1440×900 与 390×844：路由、菜单、表单校验、请求、空/错态、浮层关闭和键盘操作。
6. DSL 校验不覆盖组件 props；改动 props 时对照 [`../component-contracts.md`](../component-contracts.md) 和对应在线文档。
