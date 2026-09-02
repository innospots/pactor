# @pactor-app/expression

[Pactor](https://github.com/426-330/pactor) 的受控表达式引擎：解析与求值 DSL 中的 `${...}` 表达式。基于受控 AST —— **不使用 `eval` / `new Function`，无法访问全局对象**。

## 安装

```bash
npm install @pactor-app/expression
# 或
pnpm add @pactor-app/expression
```

## 示例

```ts
import { evaluateExpression, resolveTemplate } from '@pactor-app/expression';

const scope = { state: { count: 42, status: 'ACTIVE' } };

// 模板：整体为单个表达式时保留原始类型
resolveTemplate('${state.count}', scope); // 42（number）
resolveTemplate('共 ${state.count} 条', scope); // "共 42 条"

// 表达式求值
evaluateExpression("state.status == 'ACTIVE' && state.count > 0", scope); // true

// 白名单函数
evaluateExpression("!permission('customer:edit')", scope, {
  functions: { permission: (code) => code === 'customer:edit' },
}); // false
```

安全约束：

- 仅支持白名单 AST 节点（字面量 / 标识符 / 成员访问 / 二元 / 逻辑 / 一元 / 三元 / 白名单函数调用 / 对象字面量）
- 赋值、`new`、箭头函数、数组字面量、`obj.method()` 等在 parse 阶段直接抛错
- 标识符仅从调用方传入的作用域解析，`window` / `fetch` 等全局对象不可达
- `__proto__` / `prototype` / `constructor` 键被隔离

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
