# pactor-components

[Pactor](https://github.com/426-330/pactor) 的内置组件包：V1 基础组件（Page、Grid、Flex、Card、Button、Alert、Statistic、Tabs、Table、Form、Input、Select）的 antd 适配层。DSL 只暴露框架级 props，适配器负责映射到 antd，不透传 antd 专有 API。

## 安装

```bash
npm install pactor-components pactor-runtime antd react
# 或
pnpm add pactor-components pactor-runtime antd react
```

`react >= 18`、`antd >= 5` 为 peer dependency（开发基准为 antd v6）。

## 示例

```tsx
import { createPageRuntime, PageRuntimeView } from 'pactor-runtime';
import { createBuiltinComponentRegistry } from 'pactor-components';

const runtime = createPageRuntime(pageDsl, {
  components: createBuiltinComponentRegistry(),
});

await runtime.initialized;

<PageRuntimeView runtime={runtime} />;
```

也可以注册到已有的 Registry：

```ts
import { registerBuiltinComponents } from 'pactor-components';

registerBuiltinComponents(runtime.context.components);
```

## 组件一览

- **布局与容器**：`Page`（title + 内容区）、`Grid`（columns/gap 均分栏）、`Flex`（direction/gap/justify/align）、`Card`（title/bordered）、`Tabs`（items 的 children 为 DSL 子树，经 Renderer children 机制渲染）。
- **展示**：`Button`（text/variant/danger/size/loading/disabled/submit）、`Alert`（message/description/variant）、`Statistic`（title/value/precision/suffix）。
- **表单**：`Form` 经 React Context 下发表单上下文，Form 内声明 `name` 的 `Input` / `Select` 自动包装为表单项（label/rules 生效）；`submit: true` 的 Button 触发提交，校验通过后以 values 调用 `onSubmit` 事件并把 values 写入 runtime state 的 `form` 路径（`${form.<field>}` 可用）。不在 Form 内或未声明 `name` 时渲染独立受控控件。
- **数据**：`Table`（columns/dataSource/rowKey/loading/pagination），列定义支持 `cell: DslNode` 行模板，单元格经子作用域注入 `{ row, rowIndex }` 渲染。

## 事件值规范化

组件事件回调传递 DSL 层有意义的值而非原生 DOM 事件（Renderer 会把该值放入 `event` 作用域）：`Input.onChange` 传 string、`Select.onChange` 传选中 value、`Form.onSubmit` 传 values、`Table.onChange` 传 pagination 信息、`Tabs.onChange` 传新激活的 key。

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
