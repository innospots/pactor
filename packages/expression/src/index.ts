export type {
  BinaryExpression,
  BinaryOperator,
  CallExpression,
  ConditionalExpression,
  ExpressionNode,
  Identifier,
  Literal,
  LiteralValue,
  LogicalExpression,
  LogicalOperator,
  MemberExpression,
  UnaryExpression,
  UnaryOperator,
} from './ast.js';

export { ExpressionError } from './error.js';

export { parseExpression } from './parser.js';

export { evaluateExpression } from './evaluator.js';
export type {
  EvaluateOptions,
  ExpressionFunction,
  ExpressionScope,
} from './evaluator.js';

export { hasExpression, resolveTemplate } from './template.js';
