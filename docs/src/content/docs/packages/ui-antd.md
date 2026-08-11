---
title: pactor-ui-antd
description: antd UI kit——内置组件 + 交互（Overlay）+ 应用外壳布局三层实现，以及 antdUiKit 预设对象
---

`pactor-ui-antd` 是 antd 技术栈的 UI kit 单元：内含 components（12 个 V1 DSL 组件的 antd 适配层）、interaction（Overlay 堆栈管理 + 交互动作 + antd 渲染层）、layout（AdminLayout 等应用外壳）三层实现，并导出 `antdUiKit` 预设对象。

```bash
pnpm add pactor-ui-antd antd react react-dom
```

`react >= 18`、`react-dom >= 18`、`antd >= 5` 为 peer dependency（开发基准为 antd v6）。

## 包结构与子路径入口

主入口导出三层全部公开 API 与 `antdUiKit` 预设；三个子路径入口可按层引用：

| 入口 | 内容 |
| --- | --- |
| `pactor-ui-antd` | 三层全部导出 + `antdUiKit` |
| `pactor-ui-antd/components` | 内置组件层（`createBuiltinComponentRegistry` 等） |
| `pactor-ui-antd/interaction` | 交互层（`OverlayManager` / `createUiBridge` / `registerInteractionActions` / `InteractionProvider` / `OverlayHost`） |
| `pactor-ui-antd/layout` | 布局层（`AdminLayout` / 基础布局 / `createLayoutRegistry` / `resolveLayout`） |

## 用法（antdUiKit 预设）

pactor-app 的**内置默认 UI kit 为 Radix**；使用 antd 实现需显式传入 `ui: antdUiKit`：

```tsx
import { createPactorApplication } from 'pactor-app';
import { antdUiKit } from 'pactor-ui-antd';

createPactorApplication({
  appId: 'risk-admin',
  api: { baseURL: '/api/runtime' },
  ui: antdUiKit,
}).mount('#root');
```

预设对象也便于**局部覆盖**——每个槽位的取值优先级为：显式细粒度选项 > `ui` 预设 > 内置 Radix 默认：

```tsx
import { antdUiKit } from 'pactor-ui-antd';

createPactorApplication({
  appId: 'risk-admin',
  ui: antdUiKit,
  // 仅布局换自研，组件与交互层保持 antd
  layoutRegistry: createMyLayoutRegistry,
});
```

## 与 radixUiKit 对称

| | antd kit | Radix kit |
| --- | --- | --- |
| 包 | `pactor-ui-antd` | `pactor-ui-radix` |
| 预设 | `antdUiKit` | `radixUiKit` |
| 样式表 | 无需导入（antd CSS-in-JS） | `import 'pactor-ui-radix/styles.css'` |

切换到 Radix 只需替换 `ui` 与样式导入，DSL 与业务代码零修改。详见 [pactor-ui-radix](/packages/ui-radix/)。

## components 层

12 个 DSL 组件的 antd 适配器。DSL 只暴露框架级 props（如 `variant`），适配器负责映射到 antd props，不把 antd 专有 API 透传为 DSL 协议。

### 注册入口

```tsx
import { createPageRuntime, PageRuntimeView } from 'pactor-runtime';
import { createBuiltinComponentRegistry } from 'pactor-ui-antd/components';

const runtime = createPageRuntime(pageDsl, {
  components: createBuiltinComponentRegistry(), // 注册全部 12 个内置组件
});

await runtime.initialized;
<PageRuntimeView runtime={runtime} />;
```

也可以注册到已有的 Registry：`registerBuiltinComponents(runtime.context.components)`。

### 组件一览

#### 布局与容器

| 组件 | DSL props | 说明 |
| --- | --- | --- |
| `Page` | `title` | 页面容器：可选标题 + 内容区 |
| `Grid` | `columns`（默认 1）、`gap` | children 逐项包 Col（span = 24/columns）均分栏 |
| `Flex` | `direction`、`gap`、`justify`、`align` | 映射 antd Flex |
| `Card` | `title`、`bordered` | `bordered: false` 映射 antd `variant="borderless"` |
| `Tabs` | `items` | `items[].children` 为 DslNode 数组，pane 内容经 Renderer children 机制渲染 |

#### 展示

| 组件 | DSL props | 说明 |
| --- | --- | --- |
| `Button` | `text`、`variant`、`danger`、`size`、`loading`、`disabled`、`submit` | `variant` 映射 antd `type`；`submit: true` 时作为 Form 提交按钮 |
| `Alert` | `message`、`description`、`variant`（success/info/warning/error） | `message` 映射 antd v6 的 `title` |
| `Statistic` | `title`、`value`、`precision`、`suffix` | `value` 可为表达式（如 `${data.summary.total}`） |

#### 表单

- `Form`：创建 antd Form 实例并经 React Context 下发。提交（Form 内 `submit: true` 的 Button）且校验通过时：先把 values 写入 runtime state 的 `form` 路径（`${form.<field>}` 表达式可用），再以 values 触发 `onSubmit` 事件（进入 `event` 作用域）。
- `Input` / `Select`：在 Form 内且声明 `name` 时**自动包装为表单项**（`label` / `rules` 生效）；不在 Form 内或未声明 `name` 时渲染独立受控控件，`onChange` 仅触发事件。
- `rules` 映射 antd 校验规则，当前支持 `required` + `message`；校验失败阻止提交并展示错误。
- `Select` 接受 `options`（`Array<{ label, value }>`，支持表达式解析）。

```yaml
type: Form
events:
  onSubmit: { action: setState, params: { keyword: '${event.keyword}' } }
children:
  - type: Input
    props:
      name: keyword
      label: 关键词
      rules: [{ required: true, message: 必填 }]
  - type: Button
    props: { text: 搜索, submit: true }
```

#### 数据

`Table`：`columns` / `dataSource` / `rowKey`（默认 `'id'`）/ `loading` / `pagination`（`false` 或 `{ pageSize }`）。

列定义支持 `cell: DslNode` 行模板——该列每个单元格经 Renderer 子作用域机制渲染，作用域注入 `row`（当前行记录）与 `rowIndex`：

```yaml
type: Table
props:
  dataSource: '${data.users}'
  columns:
    - { title: 姓名, dataIndex: name }
    - title: 操作
      cell:
        type: Button
        props: { text: 编辑 }
        events:
          onClick: { action: setState, params: { editing: '${row.id}' } }
```

### 事件值规范化

组件事件回调传递 DSL 层有意义的值而非原生 DOM 事件（Renderer 把该值放入 `event` 作用域）：

| 事件 | 传出的值 |
| --- | --- |
| `Input.onChange` | 输入的 string |
| `Select.onChange` | 选中的 value |
| `Form.onSubmit` | 表单 values |
| `Table.onChange` | pagination 信息 |
| `Tabs.onChange` | 新激活的 key |

:::note
内嵌在 props 中的 DslNode 子树（如 Table 的 `cell`、Tabs 的 `items[].children`）不在父作用域提前求值，而是经 `renderChildren` 以组件注入的局部作用域解析——`${row.x}` 等表达式因此可用。
:::

## interaction 层

实现设计文档第 44–49 节的 Interaction/Overlay Runtime：统一的 `overlay.open` / `overlay.close`（Promise 模型）、命名动作结果作用域 `actions.<id>`，以及 antd Modal / Drawer 渲染层。`OverlayManager` 零 React，可纯 Node 测试；React 渲染层独立。

### 组合结构

`<OverlayHost>` 必须位于 PageRuntime 的 React Context 之内（作为 `PageRuntimeView` 的 children）；`<InteractionProvider>` 基于 antd `App` 捕获 modal / message 实例注入 UiBridge（v5+ 静态函数消费不到主题上下文，必须经 React Context 捕获）。

```tsx
import { createPageRuntime, PageRuntimeView } from 'pactor-runtime';
import { createBuiltinComponentRegistry } from 'pactor-ui-antd/components';
import {
  createUiBridge,
  InteractionProvider,
  OverlayHost,
  OverlayManager,
  registerInteractionActions,
} from 'pactor-ui-antd/interaction';

const manager = new OverlayManager();
const ui = createUiBridge();

const runtime = createPageRuntime(pageDsl, {
  components: createBuiltinComponentRegistry(),
});
registerInteractionActions(runtime.context.actions, manager, ui);

await runtime.initialized;

<InteractionProvider bridge={ui}>
  <PageRuntimeView runtime={runtime}>
    <OverlayHost manager={manager} resolvePage={loadPage} />
  </PageRuntimeView>
</InteractionProvider>;
```

### OverlayManager（零 React）

| 方法 | 说明 |
| --- | --- |
| `open(config, { parentScope? })` | 生成 id、入栈、通知订阅者，返回 Promise；`close` 时以 payload resolve |
| `close(id?, payload?)` | 以 payload 原样 resolve；缺省关闭栈顶；无 payload 为取消语义 `{ success: false }` |
| `stack()` | 当前堆栈快照（打开顺序）；引用在堆栈不变时保持稳定 |
| `parentScopeOf(id)` | 打开时记录的父作用域浅快照（只读约定） |
| `subscribe(listener)` | open / close 时通知，返回退订函数 |

`OverlayConfig`：`type`（`'modal' | 'drawer'`）、`title`、`width`、`content`（内联 DslNode）、`page`（`{ pageId }` 动态页面）、`params`（注入内容作用域）。嵌套即堆栈，连续 `open` 依次压栈。

### 交互动作

`registerInteractionActions(actions, manager, ui)` 注册四个动作（已注册的同名动作不会被覆盖）：

| 动作 | params | 返回 data |
| --- | --- | --- |
| `overlay.open` | `overlay`（配置字段表达式已求值，`content` DslNode 子树保留给渲染层求值） | close payload |
| `overlay.close` | `id`（缺省栈顶）、`payload`（缺省取消语义） | — |
| `confirm` | `title`、`content` | 确认 `true` / 取消 `false` |
| `message` | `type`（success / error / info / warning，缺省 info）、`text` | — |

`confirm` / `message` 经 UiBridge 调用 antd 实例；未挂载 `<InteractionProvider>` 时返回 `{ ok: false }` 受控失败而非抛出。

### 命名动作结果 `actions.<id>`

`ActionConfig` 声明 `id` 后，执行结果写入表达式作用域 `actions.<id>`：成功时为动作返回数据（`overlay.open` 的 data 即 close payload），失败时为 `{ ok: false, error }`；未命名动作行为不变。结果为页面级共享（同一 PageRuntime 的所有事件分发读写同一记录），PageRuntime `destroy` 时清理。

```yaml
type: Button
props: { text: 编辑用户 }
events:
  onClick:
    - id: editResult
      action: overlay.open
      params:
        overlay:
          type: modal
          title: 用户详情
          params: { id: 1001 }
          content:
            type: Button
            props: { text: 确认保存, variant: primary }
            events:
              onClick:
                action: overlay.close
                params: { payload: { success: true, id: '${params.id}' } }
    - action: if
      params:
        condition: ${actions.editResult.success}
        then: { action: setState, params: { saved: true } }
        else: { action: message, params: { type: info, text: 已取消 } }
```

:::note
取消语义约定：点击 X / 蒙层 / 取消按钮关闭时，open 的 Promise resolve `{ success: false }`；`overlay.close` 携带的 payload 原样 resolve。DSL 作者经 `${actions.<id>.success}` 判断分支。
:::

### OverlayHost 渲染

- **Modal / Drawer**：按条目 `type` 渲染，应用 `title` / `width`；UI 取消触发取消语义 close。
- **DSL content**：经 pactor-runtime Renderer 渲染，作用域在页面作用域之上注入 `params`（entry.params）与 `parent`（打开时的父作用域浅快照，只读约定——浅快照共享 state 对象引用，可能反映后续变化）。
- **page overlay**：条目含 `page.pageId` 时经注入的 `resolvePage(pageId)` 加载 PageDsl（可异步，通常包装 pactor-resource loader），创建子 PageRuntime 渲染 body——共享宿主页面的组件 / 服务 / 动作等注册表，`entry.params` 作为子运行时的 `params` 作用域键；条目关闭时 destroy 子运行时（V1 不做缓存）。未注入 `resolvePage` 时渲染受控错误提示而非崩溃。

## layout 层

实现设计文档第 5、22–26 节的应用外壳层。布局只管外壳与导航，不感知 PageRuntime；内容区是 children 出口。可复用 pactor-router 的 `MenuRegistry`（可见树 / findById / activeMenu 解析）与 `NavigationBridge`，以及 pactor-permission 的 `filterMenusByPermission`。

### AdminLayout

标准管理后台外壳：`config` 开关控制 `header` / `sidebar` / `tabs` / `breadcrumb` / `footer` 显隐（缺省 header/sidebar 开，tabs/breadcrumb/footer 关）。

```tsx
import { MemoryNavigation, MenuRegistry } from 'pactor-router';
import { AdminLayout } from 'pactor-ui-antd/layout';

const registry = new MenuRegistry(menus);
const bridge = new MemoryNavigation('/');

<AdminLayout
  config={{ tabs: true, breadcrumb: true }}
  brand={{ title: '运营平台' }}
  registry={registry}
  bridge={bridge}
  permissionChecker={permissionStore} // 可选
  headerExtra={<UserMenu />}
>
  {pageContent}
</AdminLayout>;
```

| prop | 说明 |
| --- | --- |
| `config` | 区域开关：`header` / `sidebar` / `tabs` / `breadcrumb` / `footer` |
| `brand` | `{ title, logo? }`，Header 品牌区 |
| `registry` | pactor-router `MenuRegistry` |
| `bridge` | pactor-router `NavigationBridge`，布局内部订阅它解析当前路由 |
| `route?` | 当前 `RouteContext`，优先用于选中态（测试友好）；未传时由 bridge 订阅驱动 |
| `permissionChecker?` | 提供时菜单先经 `filterMenusByPermission` 过滤 |
| `headerExtra?` | Header 右侧插槽（用户区等） |
| `children` | 内容出口 |

#### Sidebar 菜单

MenuRegistry 可见树（hidden 已过滤）递归转换为 antd Menu items：`group` → 子菜单、`page` / `link` → 菜单项、`disabled` 原样传递、`defaultOpen` 归入 `defaultOpenKeys`。选中态取当前路由的 `activeMenu`（隐藏详情页高亮其指向的可见项）。点击 `page` 项经 `bridge.push(path)` 导航；`link` / `external` 项 `window.open` 新窗口打开。菜单点击只经过 NavigationBridge 抽象，不直接依赖具体路由库。

#### Breadcrumb

`breadcrumb: true` 时按 `activeMenu` 的菜单链渲染（`findMenuChain(registry, activeMenuId)`，group → page）。

#### Tabs（访问页签）

`tabs: true` 时订阅 bridge 维护访问页签：导航到 `page` 项新增页签（按 path 去重，首页不可关），点击页签导航回对应路径，关闭当前页签时回退导航到剩余最后一个页签。V1 不做 keepAlive——切换页签会重新渲染页面、丢失页面状态。

### 基础布局

| 布局 | props | 说明 |
| --- | --- | --- |
| `BlankLayout` | `children` | 直接渲染 children（最小页面容器），用于无壳页面与嵌入场景 |
| `LoginLayout` | `variant: 'center' \| 'split'`（缺省 center）、`brand: { title, logo?, description? }`、`children` | center 为居中卡片式品牌区 + 表单出口；split 为左品牌区右表单区。不含认证逻辑 |
| `LandingLayout` | `navbar?`、`footer?`、`children` | 可选顶部导航与底部插槽，children 为主内容区 |

### LayoutRegistry

复用 pactor-core 的 `Registry<ComponentType>`：

```ts
import { createLayoutRegistry, resolveLayout } from 'pactor-ui-antd/layout';

const layouts = createLayoutRegistry(); // 预注册 admin / blank / login / landing
const Layout = resolveLayout(layouts, 'admin'); // 命中返回组件
resolveLayout(layouts, 'unknown'); // 未命中返回 BlankLayout 并 console.warn（不抛错）
layouts.register('workspace', MyWorkspaceLayout); // 业务可注册自定义布局类型
```

:::note
`MenuItem.icon` 字符串到 antd 图标的映射 V1 不做（留待图标协议设计）；响应式折叠 Sidebar 与主题/暗色亦为后续工作（见 design.md Open Questions）。
:::

## 说明

- antd v5+ 为 CSS-in-JS；如需全局 reset 样式可自行 `import 'antd/dist/reset.css'`。
- `antdUiKit` 与 pactor-app 的 `UiKit` 类型编译期兼容；第三方 kit 可按同结构提供自己的预设对象。
