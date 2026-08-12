---
title: pactor-ui-radix
description: Radix UI kit——内置组件 + 交互（Overlay）+ 应用外壳布局三层 Radix 实现（与 pactor-ui-antd 契约一致、不依赖 antd），radixUiKit 预设对象 + 合并样式表
---

`pactor-ui-radix` 是 Radix 技术栈的 UI kit 单元：内含 components / interaction / layout 三层实现，与 [pactor-ui-antd](/packages/ui-antd/)（antd 版）**契约一致**——props 契约类型直接 `import type` 自 `pactor-ui-antd` 对应层、DSL 类型名集合相同、事件值语义相同，同一份 DSL 切换 UI 库零修改。本包导出 `radixUiKit` 预设对象与合并样式表。

- `Select` / `Tabs` / `Form` 基于 `@radix-ui/react-select` / `@radix-ui/react-tabs` / `@radix-ui/react-form`；modal 基于 `@radix-ui/react-dialog`；菜单组折叠基于 `@radix-ui/react-accordion`；
- 其余组件 / 布局 / drawer / confirm / toast 为带 `.pcr-*` 语义 class 的原生元素或自绘实现；
- **不依赖 antd**（源码与构建产物均无 `from 'antd'` 引用）。

```bash
pnpm add pactor-ui-radix pactor-app react react-dom react-router-dom
```

`react >= 18`、`react-dom >= 18` 为 peer dependency。

:::note
本包的 dependencies 含 `pactor-ui-antd`：契约类型为 type-only 引用（不产生运行时代码引入），交互核心（`OverlayManager` / `createUiBridge` / `registerInteractionActions`）直接复用其 interaction 层而非重复实现。因此安装时 pnpm 可能对 `pactor-ui-antd` 的 `antd` peer 给出警告——peer 不会自动安装，未实际引入 antd 渲染代码时可忽略（决策 D3）。
:::

## 包结构与子路径入口

| 入口 | 内容 |
| --- | --- |
| `pactor-ui-radix` | 三层全部导出 + `radixUiKit` |
| `pactor-ui-radix/components` | 内置组件层（`createRadixComponentRegistry` 等） |
| `pactor-ui-radix/interaction` | 交互层（`RadixInteractionProvider` / `RadixOverlayHost`） |
| `pactor-ui-radix/layout` | 布局层（`RadixAdminLayout` 等 / `createRadixLayoutRegistry`） |
| `pactor-ui-radix/styles.css` | 三层合并样式表（单文件） |

## 默认 UI kit

**Radix 是 pactor-app 的内置默认**：不传任何 UI 选项时，组件、外壳布局、弹层与消息链路全部使用本包实现。

:::caution[样式表必须导入]
Radix 套件无内建样式（Primitives 无样式原语），无论是否显式传 `ui`，**都必须导入合并样式表**，否则界面无样式：

```ts
import 'pactor-ui-radix/styles.css';
```
:::

```ts
import { createPactorApplication } from 'pactor-app';
import 'pactor-ui-radix/styles.css';

createPactorApplication({
  appId: 'risk-admin',
  api: { baseURL: '/api/runtime' },
}).mount('#root');
```

## 预设对象 radixUiKit

`radixUiKit` 一次提供三个槽位（显式表达或局部覆盖场景使用）：

| 槽位 | 值 | 来源层 |
| --- | --- | --- |
| `componentRegistry` | `createRadixComponentRegistry` | components |
| `layoutRegistry` | `createRadixLayoutRegistry` | layout |
| `interactionKit` | `{ Provider: RadixInteractionProvider, OverlayHost: RadixOverlayHost }` | interaction |

```ts
createPactorApplication({
  appId: 'risk-admin',
  ui: radixUiKit, // 与不传 ui 的默认行为一致
});
```

antd 侧有对称的 [pactor-ui-antd](/packages/ui-antd/)（`antdUiKit` 预设）——传入 `ui: antdUiKit` 即整站切换为 antd 实现。

## 进阶：细粒度选项覆盖预设

每个槽位独立合并，优先级为：**显式细粒度选项 > `ui` 预设 > 内置 Radix 默认**。例如在预设基础上只覆盖布局层：

```ts
createPactorApplication({
  appId: 'risk-admin',
  ui: radixUiKit,
  layoutRegistry: createMyLayoutRegistry, // 布局用显式值，组件与交互层仍为 Radix 预设
});
```

也可以完全不使用预设，按层渐进切换（如只切组件层）：直接传 `componentRegistry` / `layoutRegistry` / `interactionKit` 细粒度选项即可：

```ts
import { createPactorApplication } from 'pactor-app';
import { createRadixComponentRegistry } from 'pactor-ui-radix/components';
import { createRadixLayoutRegistry } from 'pactor-ui-radix/layout';
import {
  RadixInteractionProvider,
  RadixOverlayHost,
} from 'pactor-ui-radix/interaction';
import 'pactor-ui-radix/styles.css';

createPactorApplication({
  appId: 'risk-admin',
  api: { baseURL: '/api/runtime' },
  componentRegistry: createRadixComponentRegistry,
  layoutRegistry: createRadixLayoutRegistry,
  interactionKit: {
    Provider: RadixInteractionProvider,
    OverlayHost: RadixOverlayHost,
  },
});
```

`options.components` 与运行期 `registerComponent` 仍叠加在所选注册表之上：业务自定义组件与 Radix 内置组件可同页使用。

## 样式表

三层样式（组件 / 布局 / 交互）合并为单文件样式表，全部为 `.pcr-*` 语义 class，基于 token 化主题体系（色板 → 语义 → 形状三层 CSS 变量，组件规则只引用语义 token）：

```ts
import 'pactor-ui-radix/styles.css';
```

内置默认亮色皮肤与暗色皮肤（`<html data-pactor-theme="dark">`，可挂任意容器）。换肤三方式——覆盖 CSS 变量（只改主色亦可）、`data-pactor-theme='dark'`、直接覆盖 `.pcr-*` class——以及完整 token 清单和 Radix Colors 定制工具的配合，见[主题与换肤](/guides/theming/)。

class 前缀：组件层 `.pcr-page` / `.pcr-grid` / `.pcr-btn` 等；布局层 `.pcr-admin-*` / `.pcr-menu-*` / `.pcr-breadcrumb-*` / `.pcr-tab*` / `.pcr-login-*` / `.pcr-landing-*` / `.pcr-blank-layout`；交互层 `.pcr-modal-*` / `.pcr-drawer-*` / `.pcr-confirm-*` / `.pcr-toast-*`。

## components 层

12 个 V1 DSL 组件的 Radix Primitives 实现。

### 独立使用

以 `createRadixComponentRegistry()` 替代 `createBuiltinComponentRegistry()`：

```tsx
import { createPageRuntime, PageRuntimeView } from 'pactor-runtime';
import { createRadixComponentRegistry } from 'pactor-ui-radix/components';
import 'pactor-ui-radix/styles.css';

const runtime = createPageRuntime(pageDsl, {
  components: createRadixComponentRegistry(),
});

await runtime.initialized;
<PageRuntimeView runtime={runtime} />;
```

也可以注册到已有的 Registry：`registerRadixComponents(runtime.context.components)`。

### 契约一致性

| 维度 | 说明 |
| --- | --- |
| 类型名集合 | 与 antd 版完全一致：Page / Grid / Flex / Card / Button / Alert / Statistic / Tabs / Form / Input / Select / Table |
| props 类型 | 直接 `import type` 自 `pactor-ui-antd/components`，类型名一致 |
| 事件值语义 | `Input.onChange` 传 string、`Select.onChange` 传选中 value、`Form.onSubmit` 传 values、`Button.onClick` 触发 |
| Form 协同 | Context 下发；Form 内声明 `name` 的 Input/Select 自动成为表单项（label + `rules.required/message`）；校验失败阻止提交并展示错误；提交成功写 runtime state 的 `form` 路径（`${form.<field>}` 可用） |
| Table 行模板 | `cell` 经 renderChildren 注入 `{ row, rowIndex }` |

一致性由契约测试锁定（两注册表 `list()` 集合相等 + 关键行为场景双实现运行）。

### 边界说明

- Radix Form 的校验模型与 antd 不同，当前对齐到 `required + message`；高级校验（pattern 等）未实现。
- Table 为原生 table 的极简实现，分页仅支持 `pageSize`；企业级表格仍建议使用 antd kit。
- chat 视图（Collapse / Alert / Spin）仍为 antd 外观。

## interaction 层

`RadixOverlayHost` 与 `RadixInteractionProvider`：modal 基于 `@radix-ui/react-dialog`；drawer（Radix 无对应原语）、confirm 确认框与 toast 消息栈为自绘实现。

### 独立使用

与 antd 版组合结构相同：`RadixOverlayHost` 必须位于 PageRuntime 的 React Context 之内；`RadixInteractionProvider` 在 mount 时向 UiBridge 注入自绘实现、unmount 清空。非 UI 部分（`OverlayManager` / 交互动作 / `UiBridge`）复用 `pactor-ui-antd` 的 interaction 层：

```tsx
import { createPageRuntime, PageRuntimeView } from 'pactor-runtime';
import {
  createUiBridge,
  OverlayManager,
  registerInteractionActions,
} from 'pactor-ui-antd/interaction';
import {
  RadixInteractionProvider,
  RadixOverlayHost,
} from 'pactor-ui-radix/interaction';
import 'pactor-ui-radix/styles.css';

const manager = new OverlayManager();
const ui = createUiBridge();

const runtime = createPageRuntime(pageDsl, { components });
registerInteractionActions(runtime.context.actions, manager, ui);

await runtime.initialized;

<RadixInteractionProvider bridge={ui}>
  <PageRuntimeView runtime={runtime}>
    <RadixOverlayHost manager={manager} resolvePage={loadPage} />
  </PageRuntimeView>
</RadixInteractionProvider>;
```

### 契约一致性

| 维度 | 说明 |
| --- | --- |
| props 类型 | `OverlayHostProps` / `InteractionProviderProps` / `ResolvePageFn` 直接 `import type` 自 `pactor-ui-antd/interaction` |
| 取消语义 | X / 遮罩 / Escape → open Promise resolve `{ success: false }` |
| content 作用域 | 经当前 Renderer `renderChildren` 渲染，注入 `{ params, parent }` |
| page overlay | 经 `resolvePage` 加载并创建共享宿主 registries 的子 PageRuntime；未注入时渲染受控错误提示 |
| confirm | 门户确认对话框，onOk / onCancel 回调后关闭 |
| message | toast 栈固定右上角，约 3s 自动消失 |

一致性由契约测试锁定（props 类型断言 + overlay-host / overlay-actions 关键场景双实现行为对齐）。

### 边界说明

- Drawer / Toast / Confirm 为自绘实现，可访问性与动画细节弱于 antd；modal 经 Radix Dialog 获得基础 a11y（焦点管理 / Escape / 遮罩）。
- 非 UI 部分（OverlayManager / 动作）直接复用 `pactor-ui-antd` 的 interaction 层，无需重复引入。

## layout 层

`RadixAdminLayout` 与 Radix 版 Blank / Login / Landing 外壳。菜单组折叠基于 `@radix-ui/react-accordion`，其余为带 `.pcr-*` 语义 class 的原生元素；复用 `pactor-ui-antd` layout 层的 `findMenuChain` / `collectDefaultOpenKeys`（antd 无关工具；`buildMenuItems` 返回类型耦合 antd `MenuProps`，Radix 版等价自实现可见菜单树）。

### 独立使用

```tsx
import { resolveLayout } from 'pactor-ui-antd/layout';
import { createRadixLayoutRegistry } from 'pactor-ui-radix/layout';
import 'pactor-ui-radix/styles.css';

const layoutRegistry = createRadixLayoutRegistry();
const Layout = resolveLayout(layoutRegistry, 'admin');
```

也可以注册到已有的 LayoutRegistry：`registerRadixLayouts(registry)`。

### 契约一致性

| 维度 | 说明 |
| --- | --- |
| props 类型 | `AdminLayoutProps` / `BlankLayoutProps` / `LoginLayoutProps` / `LandingLayoutProps` 直接 `import type` 自 `pactor-ui-antd/layout` |
| 布局开关 | `config.header / sidebar` 缺省开，`tabs / breadcrumb / footer` 缺省关；`mode`（top-side / top-bottom / side-full / two-column）、`fixedHeader` / `fixedSider`（缺省 true，显式 false 关闭）、`collapsible` / `collapsed`、`breakpoint` 与 antd 版契约一致（`data-mode` + `.pcr-admin-layout--*` 修饰 class） |
| 菜单 | 可见树渲染（group 折叠 / page / link / disabled）；`permissionChecker` 过滤；`activeMenu` 高亮；page → `bridge.push`，link / external → `window.open` |
| 选中态来源 | route props 优先，bridge 订阅兜底 |
| Breadcrumb | 按 `findMenuChain` 菜单链渲染 |
| Tabs | 访问页签：去重、点击导航、关闭当前回退最后一个、首页不可关 |
| 注册表 | 类型名 admin / blank / login / landing 与 antd 版一致；未知类型经 `resolveLayout` 回退 BlankLayout 并告警 |

一致性由契约测试锁定（props 类型断言 + admin-layout / basic-layouts 关键场景双实现行为对齐）。

### 边界说明

- 无响应式折叠与菜单图标体系（与 antd 版边界一致）。
- group 折叠由 Radix Accordion 提供基础 a11y；菜单项为原生 button。

## 聚合 re-export

三层公开 API 均可直接从主入口导入，便于统一引用：

```ts
import {
  createRadixComponentRegistry,
  createRadixLayoutRegistry,
  RadixInteractionProvider,
  RadixOverlayHost,
  // ...以及三层其余全部导出
} from 'pactor-ui-radix';
```
