/**
 * 受控表达式 AST（设计文档第 16.1 节白名单节点）。
 *
 * 语法子集刻意保持最小：无赋值、无 new、无箭头函数、无数组字面量。
 * 对象字面量（`{ name: state.x }`）仅作为白名单函数的参数载体开放
 * （如 `t('key', { name: user.name })`），键仅允许标识符/字符串。
 * 不支持的语法在 parse 阶段直接抛错，而不是解析后再黑名单过滤。
 */

export type LiteralValue = string | number | boolean | null | undefined;

export interface Literal {
  type: 'Literal';
  value: LiteralValue;
}

export interface Identifier {
  type: 'Identifier';
  name: string;
}

export interface MemberExpression {
  type: 'MemberExpression';
  object: ExpressionNode;
  property: ExpressionNode;
  /** true: a[b]；false: a.b */
  computed: boolean;
}

export type BinaryOperator =
  | '=='
  | '!='
  | '==='
  | '!=='
  | '<'
  | '<='
  | '>'
  | '>='
  | '+'
  | '-'
  | '*'
  | '/'
  | '%';

export interface BinaryExpression {
  type: 'BinaryExpression';
  operator: BinaryOperator;
  left: ExpressionNode;
  right: ExpressionNode;
}

export type LogicalOperator = '&&' | '||';

export interface LogicalExpression {
  type: 'LogicalExpression';
  operator: LogicalOperator;
  left: ExpressionNode;
  right: ExpressionNode;
}

export type UnaryOperator = '!' | '-' | '+';

export interface UnaryExpression {
  type: 'UnaryExpression';
  operator: UnaryOperator;
  argument: ExpressionNode;
}

export interface ConditionalExpression {
  type: 'ConditionalExpression';
  test: ExpressionNode;
  consequent: ExpressionNode;
  alternate: ExpressionNode;
}

/**
 * 白名单函数调用。callee 只允许直接 Identifier（如 `permission('x')`），
 * 不允许成员方法调用（`obj.method()`），防止经原型链逃逸。
 */
export interface CallExpression {
  type: 'CallExpression';
  callee: Identifier;
  arguments: ExpressionNode[];
}

/**
 * 对象字面量（`{ key: value, ... }`）：键为标识符或字符串，
 * 值为任意表达式。主要作为白名单函数的参数表（如 t() 的插值参数）。
 */
export interface ObjectExpression {
  type: 'ObjectExpression';
  properties: Array<{ key: string; value: ExpressionNode }>;
}

export type ExpressionNode =
  | Literal
  | Identifier
  | MemberExpression
  | BinaryExpression
  | LogicalExpression
  | UnaryExpression
  | ConditionalExpression
  | CallExpression
  | ObjectExpression;
