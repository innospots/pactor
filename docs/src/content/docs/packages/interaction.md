---
title: pactor-interaction
description: 交互——Overlay 堆栈管理（OverlayManager）、交互动作（overlay.open / overlay.close / confirm / message）与 React 渲染层（OverlayHost / InteractionProvider）
---

`pactor-interaction` 实现设计文档第 44–49 节的 Interaction/Overlay Runtime：统一的 `overlay.open` / `overlay.close`（Promise 模型）、命名动作结果作用域 `actions.<id>`，以及 antd Modal / Drawer 渲染层。`OverlayManager` 零 React，可纯 Node 测试；React 渲染层独立。

```bash
pnpm add pactor-interaction pactor-runtime antd react
```

`react >= 18`、`antd >= 5` 为 peer dependency（开发基准为 antd v6）。

## 组合结构

`<OverlayHost>` 必须位于 PageRuntime 的 React Context 之内（作为 `PageRuntimeView` 的 children）；`<InteractionProvider>` 基于 antd `App` 捕获 modal / message 实例注入 UiBridge（v5+ 静态函数消费不到主题上下文，必须经 React Context 捕获）。

```tsx
import { createPageRuntime, PageRuntimeView } from 'pactor-runtime';
import { createBuiltinComponentRegistry } from 'pactor-components';
import {
  createUiBridge,
  InteractionProvider,
  OverlayHost,
  OverlayManager,
  registerInteractionActions,
} from 'pactor-interaction';

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

## OverlayManager（零 React）

| 方法 | 说明 |
| --- | --- |
| `open(config, { parentScope? })` | 生成 id、入栈、通知订阅者，返回 Promise；`close` 时以 payload resolve |
| `close(id?, payload?)` | 以 payload 原样 resolve；缺省关闭栈顶；无 payload 为取消语义 `{ success: false }` |
| `stack()` | 当前堆栈快照（打开顺序）；引用在堆栈不变时保持稳定 |
| `parentScopeOf(id)` | 打开时记录的父作用域浅快照（只读约定） |
| `subscribe(listener)` | open / close 时通知，返回退订函数 |

`OverlayConfig`：`type`（`'modal' | 'drawer'`）、`title`、`width`、`content`（内联 DslNode）、`page`（`{ pageId }` 动态页面）、`params`（注入内容作用域）。嵌套即堆栈，连续 `open` 依次压栈。

## 交互动作

`registerInteractionActions(actions, manager, ui)` 注册四个动作（已注册的同名动作不会被覆盖）：

| 动作 | params | 返回 data |
| --- | --- | --- |
| `overlay.open` | `overlay`（配置字段表达式已求值，`content` DslNode 子树保留给渲染层求值） | close payload |
| `overlay.close` | `id`（缺省栈顶）、`payload`（缺省取消语义） | — |
| `confirm` | `title`、`content` | 确认 `true` / 取消 `false` |
| `message` | `type`（success / error / info / warning，缺省 info）、`text` | — |

`confirm` / `message` 经 UiBridge 调用 antd 实例；未挂载 `<InteractionProvider>` 时返回 `{ ok: false }` 受控失败而非抛出。

## 命名动作结果 `actions.<id>`

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

## OverlayHost 渲染

- **Modal / Drawer**：按条目 `type` 渲染，应用 `title` / `width`；UI 取消触发取消语义 close。
- **DSL content**：经 pactor-runtime Renderer 渲染，作用域在页面作用域之上注入 `params`（entry.params）与 `parent`（打开时的父作用域浅快照，只读约定——浅快照共享 state 对象引用，可能反映后续变化）。
- **page overlay**：条目含 `page.pageId` 时经注入的 `resolvePage(pageId)` 加载 PageDsl（可异步，通常包装 pactor-resource loader），创建子 PageRuntime 渲染 body——共享宿主页面的组件 / 服务 / 动作等注册表，`entry.params` 作为子运行时的 `params` 作用域键；条目关闭时 destroy 子运行时（V1 不做缓存）。未注入 `resolvePage` 时渲染受控错误提示而非崩溃。
