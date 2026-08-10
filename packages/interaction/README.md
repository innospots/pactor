# pactor-interaction

[Pactor](https://github.com/426-330/pactor) 的交互包：Overlay 堆栈管理（`OverlayManager`，零 React）、交互动作（`overlay.open` / `overlay.close` / `confirm` / `message`）与 React 渲染层（`<OverlayHost>` / `<InteractionProvider>`，antd Modal / Drawer）。

## 安装

```bash
npm install pactor-interaction pactor-runtime antd react
# 或
pnpm add pactor-interaction pactor-runtime antd react
```

`react >= 18`、`antd >= 5` 为 peer dependency（开发基准为 antd v6）。

## 示例

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
    {/* 必须位于 PageRuntimeView 之内（Renderer 上下文） */}
    <OverlayHost manager={manager} resolvePage={loadPage} />
  </PageRuntimeView>
</InteractionProvider>;
```

DSL 侧：

```yaml
type: Button
props: { text: 编辑 }
events:
  onClick:
    - id: editResult
      action: overlay.open
      params:
        overlay:
          type: modal
          title: 用户详情
          content:
            type: Button
            props: { text: 确认 }
            events:
              onClick:
                action: overlay.close
                params: { payload: { success: true } }
    - action: if
      params:
        condition: ${actions.editResult.success}
        then: { action: setState, params: { saved: true } }
        else: { action: message, params: { type: info, text: 已取消 } }
```

## API 一览

- **`OverlayManager`**（零 React，可纯 Node 测试）：`open(config, { parentScope? })` 入栈并返回 Promise；`close(id?, payload?)` 以 payload resolve（缺省关闭栈顶，取消语义 resolve `{ success: false }`）；`stack()` / `parentScopeOf(id)` / `subscribe(listener)`。
- **`registerInteractionActions(actions, manager, ui)`**：注册 `overlay.open` / `overlay.close` / `confirm` / `message` 四个动作；`confirm` / `message` 经 UiBridge 调用 antd 实例，未挂载 `<InteractionProvider>` 时返回受控失败。
- **`<InteractionProvider bridge>`**：基于 antd `App` 捕获 modal / message 实例注入 UiBridge。
- **`<OverlayHost manager resolvePage?>`**：订阅堆栈渲染 antd Modal / Drawer；`content`（DslNode）经 runtime Renderer 渲染，作用域注入 `{ params, parent }`；`page: { pageId }` 经注入的 `resolvePage` 加载为子 PageRuntime 渲染，关闭时销毁。

## 命名动作结果

`ActionConfig` 声明 `id` 后，结果写入作用域 `actions.<id>`：成功时为动作返回数据（`overlay.open` 的 data 即 close payload），失败时为 `{ ok: false, error }`。约定：UI 取消（X / 蒙层）resolve `{ success: false }`；`overlay.close` 携带的 payload 原样 resolve。

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
