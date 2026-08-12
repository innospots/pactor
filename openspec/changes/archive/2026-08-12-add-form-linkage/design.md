# Design: add-form-linkage

## 决策

### D1：FormHandle 桥接进 RuntimeContext（同 UiBridge 模式）

动作引擎运行在 React 组件树之外，拿不到 Form 实例。在 `RuntimeContext` 增加 `forms: Registry<FormHandle>`（复用 pactor-core Registry，与 services/actions 同模式）：

```ts
interface FormHandle {
  setValues(values: Record<string, unknown>): void;
}
```

Form 组件挂载时 `context.forms.register(name, handle)`、卸载注销。`name` 来自新增的可选 prop（缺省 `'default'`），覆盖"页面表单 + 抽屉表单"多表单场景（同一 RuntimeContext 贯穿页面与其 overlay）。

### D2：`form.setValues` 作为运行时内置动作

注册于 `registerBuiltinActions`（UI 无关）：params.values 经表达式求值后调用目标句柄；句柄未注册（表单未挂载/名称写错）时返回 `{ ok: false, error }` 受控失败，不抛出。

```yaml
- action: form.setValues
  params:
    form: edit            # 可选，缺省 default
    values:
      city: ''            # 值可含表达式
```

### D3：双 kit 各自的落地方式

- **antd**：`form.setFieldsValue(values)`——原生不触发校验、不触发 onValuesChange，天然符合联动语义。
- **Radix**：Form 上下文新增 `setValues(partial)`（与现有 `setValue` 并列），合并进 values state，不走 `onValuesChange` 回调，保持双 kit 语义一致。

### D4：onValuesChange 载荷维持现状

`event` 仍为变化字段单键对象 `{ <field>: <newValue> }`（renderer 只捕获首个回调参数），级联判断足够（`${event.region}`），不做破坏性变更；文档补注此语义。

### D5：overlay 内容响应式（实施中发现并修复）

级联演示暴露缺口：OverlayHost 只订阅 manager 堆栈，content 里绑 state 的表达式（如城市 options）在 setState 后不更新。修复：双 kit OverlayHost 增加 StateStore / DataStore 订阅（同 DslRenderer 的 `useSyncExternalStore` 版本号语义），store 变化即重渲染 overlay 内容；表单组件实例因位置/类型不变而保留内部值，无副作用。

## 影响面

- `pactor-runtime`：`context.ts`（forms 注册表 + FormHandle 类型）、`builtins.ts`（form.setValues）、`index.ts` 导出、单测。
- `pactor-ui-antd`：Form `name` prop + 注册/注销；测试。
- `pactor-ui-radix`：Form `name` prop + 上下文 `setValues` + 注册/注销；测试。
- examples（双工程）：客户编辑 region/city 级联；docs DSL 参考更新。
