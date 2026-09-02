# @pactor-app/schema

[Pactor](https://github.com/426-330/pactor) 的 Schema 校验包：DSL 版本常量、Page DSL 与 DslNode 的 JSON Schema、基于 Ajv 的结构化校验器。

## 安装

```bash
npm install @pactor-app/schema
# 或
pnpm add @pactor-app/schema
```

## 示例

```ts
import { DSL_VERSION, validatePageDsl } from '@pactor-app/schema';

DSL_VERSION; // "1.0"

const result = validatePageDsl(pageDsl);
if (!result.valid) {
  for (const error of result.errors) {
    // { path: "/page/id", message: "...", keyword: "required" }
    console.error(`${error.path}: ${error.message} (${error.keyword})`);
  }
}
```

特点：

- 结构化错误（不暴露 Ajv 原始错误对象），`required` 错误路径精确到缺失字段
- `allErrors` 模式，一次返回全部错误
- `body` 及任意深度 `children` 递归校验
- JSON Schema 可导出复用（服务端 / CLI 校验）

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
