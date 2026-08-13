# Spec: dsl-expression-engine

受控表达式引擎模块（`pactor-expression`），负责 DSL 中 `${...}` 表达式的解析与求值。基于受控 AST，禁止 `eval` / `new Function`，禁止访问任意全局对象。

### Requirement: 模板表达式识别

模块 SHALL 提供从字符串中识别 `${...}` 表达式的能力。当字符串整体恰好是一个 `${...}` 时，求值 MUST 返回表达式的原始类型值（保留 boolean/number/object/array）；当字符串中内嵌一个或多个 `${...}` 与其他文本混合时，MUST 将各表达式结果字符串化后拼接。

#### Scenario: 整体表达式保留原始类型

- **WHEN** 求值 `"${state.count}"` 且 `state.count` 为数字 `42`
- **THEN** 返回数字 `42` 而非字符串 `"42"`

#### Scenario: 混合模板拼接为字符串

- **WHEN** 求值 `"共 ${state.count} 条"` 且 `state.count` 为 `42`
- **THEN** 返回字符串 `"共 42 条"`

#### Scenario: 非表达式字符串原样返回

- **WHEN** 求值不含 `${` 的普通字符串
- **THEN** 原样返回该字符串

### Requirement: 受控 AST 解析

解析器 SHALL 仅支持以下 AST 节点：Literal、Identifier、MemberExpression、BinaryExpression、LogicalExpression、UnaryExpression、ConditionalExpression、CallExpression（白名单函数）、ObjectExpression（对象字面量，键限标识符/字符串，主要作为 `t()` 等白名单函数的参数表）。对不支持的语法（赋值、`new`、箭头函数、数组字面量、序列表达式等）MUST 在 parse 阶段抛出结构化语法错误，MUST NOT 使用 `eval` 或 `new Function`。对象字面量的键为 `__proto__` / `prototype` / `constructor` 时 MUST 在求值阶段抛出受控错误，禁止原型污染。

#### Scenario: 解析二元与逻辑表达式

- **WHEN** 解析 `state.status == 'ACTIVE' && state.count > 0`
- **THEN** 生成合法 AST，且逻辑/比较操作符优先级正确

#### Scenario: 解析三元表达式

- **WHEN** 解析并求值 `state.loading ? '加载中' : '完成'`
- **THEN** 根据 `state.loading` 真假返回对应分支

#### Scenario: 对象字面量作为函数参数

- **WHEN** 求值 `t('welcome', { name: user.name })` 且 `user.name` 为 `'Alice'`
- **THEN** 第二个参数求值为普通对象 `{ name: 'Alice' }`

#### Scenario: 对象字面量原型污染键被拒绝

- **WHEN** 求值 `{ __proto__: { x: 1 } }` 或 `{ constructor: 1 }`
- **THEN** 抛出受控错误，不污染任何对象原型

#### Scenario: 非法语法被拒绝

- **WHEN** 解析包含赋值（如 `state.x = 1`）或 `new` 的表达式
- **THEN** parse 阶段抛出包含位置信息的语法错误

#### Scenario: 不依赖 eval

- **WHEN** 对引擎做静态代码检查或运行时检查
- **THEN** 实现中不存在 `eval(` 与 `new Function` 调用

### Requirement: 作用域解析

求值 SHALL 接收调用方提供的普通对象作为作用域，Identifier 与 MemberExpression 从作用域中解析（如 `state.user.name`、`route.params.id`、`rowIndex`）。解析不存在的路径 MUST 返回 `undefined` 而非抛错。

#### Scenario: 嵌套路径解析

- **WHEN** 作用域为 `{ state: { user: { name: 'Alice' } } }`，求值 `state.user.name`
- **THEN** 返回 `'Alice'`

#### Scenario: 缺失路径返回 undefined

- **WHEN** 求值 `state.missing.deep` 且 `state` 上无 `missing`
- **THEN** 返回 `undefined`，不抛错

### Requirement: 白名单函数调用

模块 SHALL 提供 Function Registry：仅允许调用作用域中显式提供的函数或经 Registry 注册的白名单函数（如 `permission('customer:edit')`）。MUST NOT 允许通过 MemberExpression 链式调用方法（如 `obj.method()`），以防止经由原型链逃逸。

#### Scenario: 调用白名单函数

- **WHEN** 注册/提供 `permission` 函数后求值 `permission('customer:edit')`
- **THEN** 以参数 `'customer:edit'` 调用该函数并返回其结果

#### Scenario: 调用未注册函数被拒绝

- **WHEN** 求值包含未在作用域或 Registry 中声明的函数调用 `hack()`
- **THEN** 求值返回 `undefined` 或抛出受控错误，绝不执行任意代码

#### Scenario: 成员方法调用被拒绝

- **WHEN** 求值 `state.user.getName()` 形式的成员方法调用
- **THEN** 被拒绝（parse 错误或求值为受控失败），不实际调用

### Requirement: 全局对象隔离

表达式 MUST NOT 能访问 `window`、`document`、`globalThis`、`localStorage`、`fetch`、`Function` 等全局对象；求值过程仅可触及调用方传入的作用域。

#### Scenario: 全局标识符不可达

- **WHEN** 求值 `window.location` 或 `fetch('/api')`
- **THEN** 标识符解析为 `undefined`（或受控失败），无法触及真实全局对象

### Requirement: 短路求值

LogicalExpression MUST 短路求值：`&&` 左侧为假时不得求值右侧，`||` 左侧为真时不得求值右侧。

#### Scenario: 逻辑与短路

- **WHEN** 求值 `state.missing && state.missing.deep` 且 `state.missing` 为 `undefined`
- **THEN** 返回 falsy 值且不因访问 `undefined.deep` 抛错

### Requirement: i18n 翻译函数

表达式引擎 SHALL 在 Function Registry 中提供 `t(key)` 与 `t(key, params)` 白名单函数，用于根据当前 locale 翻译文案。`t()` MUST 支持参数插值（`{{name}}`）与回退（当前 locale → defaultLocale → key 本身）。

#### Scenario: 基础翻译

- **WHEN** 作用域提供 `t` 函数，messages 含 `menu.home`，求值 `t('menu.home')`
- **THEN** 返回当前 locale 下 `menu.home` 的翻译值

#### Scenario: 参数插值

- **WHEN** messages 为 `{ 'welcome': 'Hello, {{name}}!' }`，求值 `t('welcome', { name: 'Alice' })`
- **THEN** 返回 `'Hello, Alice!'`

#### Scenario: 缺失 key 回退

- **WHEN** 求值 `t('missing.key')` 且 messages 中不存在该 key
- **THEN** 返回字符串 `'missing.key'`
