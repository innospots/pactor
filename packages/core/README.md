# pactor-core

[Pactor](https://github.com/426-330/pactor) 的核心协议包：DSL 类型定义与通用 Registry。零运行时依赖，与 React 无关，可用于浏览器、Node 与构建工具等任意环境。

## 安装

```bash
npm install pactor-core
# 或
pnpm add pactor-core
```

## 包含内容

- **DSL 节点类型**：`DslNode`、`ActionConfig`、`ConditionConfig`、`PermissionConfig`、`EventMap`
- **DSL 文档结构类型**：`PageDsl`、`FragmentDsl`、`ApplicationDsl`、`DataSourceConfig`、`LifecycleConfig`、`RequiresConfig`
- **`Registry<T>`**：通用注册表（register / get / has / unregister / list），Component / Action / Service / Capability / Expression Function 等 Registry 的共同基座
- **`RUNTIME_SCOPES`**：运行时作用域层级常量（global → app → page → overlay → form → component → row → event）

## 示例

```ts
import { Registry, type DslNode, type PageDsl } from 'pactor-core';

const node: DslNode = {
  type: 'Button',
  props: { text: '保存' },
  events: { onClick: { action: 'submit' } },
  when: "${state.status == 'ACTIVE'}",
};

const components = new Registry<unknown>('ComponentRegistry');
components.register('Button', ButtonRenderer);
components.get('Button'); // ButtonRenderer
components.get('Missing'); // undefined（不抛错）
```

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
