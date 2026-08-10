# Design: add-interaction-module

## Context

设计文档第 44–49 节定义 Interaction/Overlay Runtime：统一 `overlay.open` / `overlay.close`，Promise 模型（open 返回 Promise，close payload 为 resolve 值），Overlay Context 作用域（params + parent 只读快照），page overlay 动态加载（第 46 节）。现状：pactor-runtime 的 Action 引擎可注册自定义动作；pactor-components 提供 Form 等组件；第 48 节的 `actions.<id>` 结果引用尚无支撑。

约束：

- 统一 `overlay.open`，不维护 openModal/openDrawer 等多个底层动作（第 45 节）。
- antd message/Modal.confirm 不使用静态函数（v5+ 废弃且消费不到主题上下文），经 React Context 捕获 API 实例。
- OverlayManager 零 React，可纯 Node 测试；React 渲染层独立文件。

## Goals / Non-Goals

**Goals:**

- OverlayManager：堆栈、open→Promise、close(payload) resolve、嵌套、订阅。
- `<OverlayHost>`：antd Modal/Drawer 渲染；content DslNode 经 runtime Renderer + `{ params, parent }` 作用域；page overlay 经注入 `resolvePage` 加载并渲染（子运行时或主体渲染，取实现简单者）。
- 动作：overlay.open / overlay.close / confirm / message 注册到 ActionRegistry。
- core `ActionConfig.id` + runtime 引擎命名结果作用域 `actions.<id>`。
- 测试与文档。

**Non-Goals:**

- form.open 语法糖与 fields/submit/success 声明式表单弹层（第 47 节）——V1 用"modal/drawer + Form DSL + 普通动作"组合表达。
- popover/dropdown/context-menu/fullscreen/bottom-sheet 等类型。
- Overlay 生命周期事件（onOpen/onClose 回调）、拖拽、最大化。
- Fragment 引用解析（`type: Fragment`，留待 components/resource 集成）。

## Decisions

### D1: OverlayManager（零 React）

```ts
interface OverlayConfig {
  type: 'modal' | 'drawer';
  title?: string;
  width?: number | string;
  content?: DslNode;            // 内联 DSL
  page?: { pageId: string };    // 动态页面
  params?: Record<string, unknown>;
}
interface OverlayEntry extends OverlayConfig { id: string; }
class OverlayManager {
  open(config, options?: { parentScope?: Record<string, unknown> }): Promise<unknown>
  close(idOrPayload?, payload?): void   // 缺省关闭栈顶
  stack(): OverlayEntry[]
  parentScopeOf(id): Record<string, unknown> | undefined
  subscribe(listener): () => void
}
```

- open 生成 id、入栈、通知；返回 Promise，close 时以 payload resolve（缺省 payload 为 `{ success: false }` 的取消语义——约定：点击 X/蒙层关闭 resolve `{ success: false }`，`overlay.close` 动作携带的 payload 原样 resolve）。
- 嵌套即堆栈，antd 多实例渲染天然支持。

### D2: 命名动作结果作用域（core + runtime 扩展）

- core：`ActionConfig` 加 `id?: string`。
- runtime 引擎：执行完成（含 skipped/失败）后，若动作有 `id`，把结果数据写入 context 级 `actionResults` 记录：`actions.<id>` = 成功时的 `result.data`（overlay.open 的 data 即 close payload）；失败时写入 `{ ok: false, error }` 结构。buildScope 增加 `actions` 键。未命名动作行为不变。
- PageRuntime 每次事件分发共享同一 actionResults（页面级），destroy 时清理。

### D3: 动作注册与 UI 桥

`registerInteractionActions(actions, manager, ui)`：
- `overlay.open`：params.overlay（表达式已求值）→ manager.open → resolve 值作为动作 data 返回。
- `overlay.close`：params.id / params.payload → manager.close。
- `confirm`：params.title/content → `ui.modal.confirm()` → data 为 boolean。
- `message`：params.type/text → `ui.message[type](text)`。
- `ui` 为 `{ modal, message }`，由 `<InteractionProvider>`（antd App 组件捕获实例）注入到 manager 旁路的 UiBridge（简单可变引用，Provider mount 时赋值）。

### D4: OverlayHost 渲染

- `<OverlayHost manager resolvePage?>`：订阅 manager.stack，逐个渲染 antd Modal（`open` + `onCancel` → 取消语义 close）/ Drawer。
- content 渲染：经 pactor-runtime 的渲染入口（读其公开 API，优先复用 `<DslRenderer>` 或 PageRuntimeView 的局部渲染能力；缺公开途径时在 runtime 做最小补充导出），作用域 = 当前页面 scope + `{ params: entry.params, parent: manager.parentScopeOf(id) }`。
- page 类型：`resolvePage(pageId)`（注入函数，通常包装 pactor-resource loader）→ 得 PageDsl → 创建子 PageRuntime（其 params 并入 scope 的 `params` 键）渲染 body；unmount 时 destroy 子运行时。V1 允许 `resolvePage` 未注入时渲染受控错误提示而非崩溃。
- OverlayHost 需位于 PageRuntime 的 React Context 之内才能渲染 DSL——组合方式：PageRuntimeView 预留 children/slot 或宿主手动嵌套；文档示例说明放在 PageRuntimeView 内部（若 runtime 不支持则在 runtime 做最小补充支持）。

### D5: 依赖与包结构

dependencies：`pactor-core`、`pactor-runtime`（workspace:*）；peerDependencies：`react >=18`、`antd >=5`；devDependencies：antd + react 测试栈 + `pactor-components`（端到端测试用 Button/Form）。源码：`manager.ts`、`actions.ts`、`host.tsx`、`provider.tsx`、`index.ts`。

## Risks / Trade-offs

- [OverlayHost 依赖 runtime 的局部渲染公开 API，可能需要 runtime 补充导出] → 允许最小补充（向后兼容），汇报注明。
- [取消语义（X/蒙层）与成功语义靠 payload 约定，DSL 作者需知晓] → 文档明确：取消 resolve `{ success: false }`；`actions.<id>.success` 判分支。
- [page overlay 创建子 PageRuntime 的成本与生命周期] → close 时 destroy；V1 不做缓存。
- [antd App 上下文要求宿主包裹 InteractionProvider] → 文档明确组合结构；未提供 ui 时 confirm/message 动作返回受控失败。

## Migration Plan

无（core/runtime 扩展均向后兼容）。顺序：core/runtime 扩展 → OverlayManager → actions → host/provider → 端到端测试 → 文档。

## Open Questions

- `parent` 快照是引用还是深拷贝：V1 用打开时刻的浅快照（引用共享 state 对象可能反映后续变化），文档注明只读约定。
- form.open 语法糖在 pactor-app 或本包后续迭代评估。
