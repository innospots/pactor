---
title: "@pactor/expression"
description: 受控表达式引擎 —— ${...} 模板、受控 AST、白名单函数，禁止 eval
---

`@pactor/expression` 是 DSL 中 `${...}` 表达式的解析与求值引擎。基于受控 AST：**不使用 `eval` / `new Function`，无法访问 window / document / fetch 等全局对象**。

```bash
pnpm add @pactor/expression
```

## 模板求值

`resolveTemplate` 处理 DSL 属性值中的 `${...}`：

```ts
import { resolveTemplate } from '@pactor/expression';

const scope = {
  state: { count: 42, user: { name: 'Alice' } },
};

// 字符串整体恰好是一个表达式：保留原始类型
resolveTemplate('${state.count}', scope);        // 42（number）
resolveTemplate('${state.user}', scope);         // { name: 'Alice' }（object）

// 与其他文本混合：拼接为字符串
resolveTemplate('共 ${state.count} 条', scope);  // "共 42 条"
resolveTemplate('值: ${state.missing}', scope);  // "值: "（null/undefined 渲染为空串）

// 普通字符串：原样返回
resolveTemplate('普通文本', scope);              // "普通文本"
```

`hasExpression(value)` 可快速判断字符串是否包含 `${`。

## 表达式求值

```ts
import { evaluateExpression, parseExpression } from '@pactor/expression';

// 直接求值（源码不含 ${} 定界符）
evaluateExpression("state.status == 'ACTIVE' && state.count > 0", {
  state: { status: 'ACTIVE', count: 3 },
}); // true

evaluateExpression("state.loading ? '加载中' : '完成'", {
  state: { loading: false },
}); // "完成"

// 也可先解析为 AST 再反复求值（避免重复解析）
const ast = parseExpression('state.count * 2');
evaluateExpression(ast, { state: { count: 21 } }); // 42
```

## 支持的语法

| 类别 | 示例 |
| --- | --- |
| 字面量 | `42`、`3.14`、`'str'`、`"str"`、`true`、`false`、`null`、`undefined` |
| 标识符与成员访问 | `state.user.name`、`state.list[0]`、`row['key']` |
| 算术 | `+` `-` `*` `/` `%` |
| 比较 | `==` `!=` `===` `!==` `<` `<=` `>` `>=` |
| 逻辑 | `&&` `||` `!`（短路求值） |
| 条件 | `test ? a : b`（支持嵌套） |
| 白名单函数调用 | `permission('customer:edit')` |

**不支持的语法**（parse 阶段抛出带位置信息的 `ExpressionError`）：赋值、`new`、箭头函数、对象/数组字面量、`obj.method()` 成员方法调用等。

## 作用域

求值只触及调用方传入的作用域对象，标识符从作用域中解析；解析不到的路径返回 `undefined` 而非抛错：

```ts
evaluateExpression('state.user.name', { state: { user: { name: 'Alice' } } }); // "Alice"
evaluateExpression('state.missing.deep', { state: {} });                       // undefined
evaluateExpression('window.location');                                          // undefined（全局不可达）
```

`__proto__` / `prototype` / `constructor` 键被隔离，防止经原型链逃逸。

## 白名单函数

函数调用只允许两种来源，且 callee 必须是直接标识符：

```ts
import { evaluateExpression } from '@pactor/expression';
import { Registry } from '@pactor/core';

// 方式一：Record
evaluateExpression("!permission('customer:edit')", {}, {
  functions: { permission: (code) => code === 'customer:edit' },
}); // false

// 方式二：@pactor/core 的 Registry
const functions = new Registry<ExpressionFunction>('FunctionRegistry');
functions.register('formatDate', (v) => String(v).slice(0, 10));
evaluateExpression('formatDate(data.createdAt)', scope, { functions });
```

- 调用未注册的函数：抛出 `ExpressionError`（受控错误），绝不执行任意代码。
- `state.user.getName()` 形式的成员方法调用：parse 阶段直接拒绝。

## 错误处理

```ts
import { ExpressionError, parseExpression } from '@pactor/expression';

try {
  parseExpression('state.x = 1');
} catch (error) {
  if (error instanceof ExpressionError) {
    console.error(error.message); // 含位置信息，如 "... (at position 8)"
    console.error(error.pos);
  }
}
```
