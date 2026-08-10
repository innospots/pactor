import { Registry } from 'pactor-core';

import type { ExpressionNode } from './ast.js';
import { ExpressionError } from './error.js';
import { parseExpression } from './parser.js';

/** 白名单函数签名 */
export type ExpressionFunction = (...args: unknown[]) => unknown;

/** 求值作用域：由调用方组装的普通对象（state/data/form/row/route/user 等） */
export type ExpressionScope = Record<string, unknown>;

export interface EvaluateOptions {
  /** 额外的白名单函数表（Record 或 pactor-core Registry） */
  functions?: Record<string, ExpressionFunction> | Registry<ExpressionFunction>;
}

/**
 * 禁止作为属性名访问的键，防止经 __proto__ / constructor 逃逸到原型链。
 */
const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** 从对象上安全读取属性：仅自有属性，且拒绝原型链相关键 */
function readProperty(source: unknown, key: string): unknown {
  if (FORBIDDEN_KEYS.has(key)) {
    return undefined;
  }
  if (Array.isArray(source)) {
    if (key === 'length') return source.length;
    const index = Number(key);
    if (Number.isInteger(index)) return source[index];
    return undefined;
  }
  if (isRecord(source)) {
    return Object.prototype.hasOwnProperty.call(source, key)
      ? source[key]
      : undefined;
  }
  return undefined;
}

function resolveFunction(
  name: string,
  scope: ExpressionScope,
  options: EvaluateOptions,
): ExpressionFunction {
  // 1. 白名单函数表（Record 或 Registry）
  const { functions } = options;
  let candidate: unknown;
  if (functions instanceof Registry) {
    candidate = functions.get(name);
  } else if (functions) {
    candidate = readProperty(functions, name);
  }
  // 2. 作用域中显式提供的函数
  if (typeof candidate !== 'function') {
    candidate = readProperty(scope, name);
  }
  if (typeof candidate !== 'function') {
    throw new ExpressionError(`function "${name}" is not registered`);
  }
  return candidate as ExpressionFunction;
}

function evaluateNode(
  node: ExpressionNode,
  scope: ExpressionScope,
  options: EvaluateOptions,
): unknown {
  switch (node.type) {
    case 'Literal':
      return node.value;

    case 'Identifier':
      // 仅从作用域解析；window/fetch 等全局对象不在作用域中，天然不可达
      return readProperty(scope, node.name);

    case 'MemberExpression': {
      const object = evaluateNode(node.object, scope, options);
      if (object === null || object === undefined) {
        return undefined;
      }
      const property = node.computed
        ? evaluateNode(node.property, scope, options)
        : (node.property as { name: string }).name;
      if (typeof property !== 'string' && typeof property !== 'number') {
        return undefined;
      }
      return readProperty(object, String(property));
    }

    case 'UnaryExpression': {
      const argument = evaluateNode(node.argument, scope, options);
      switch (node.operator) {
        case '!':
          return !argument;
        case '-':
          return -(argument as number);
        case '+':
          return +(argument as number);
      }
      break;
    }

    case 'BinaryExpression': {
      const left = evaluateNode(node.left, scope, options);
      const right = evaluateNode(node.right, scope, options);
      switch (node.operator) {
        case '==':
          // eslint-disable-next-line eqeqeq
          return left == right;
        case '!=':
          // eslint-disable-next-line eqeqeq
          return left != right;
        case '===':
          return left === right;
        case '!==':
          return left !== right;
        case '<':
          return (left as number) < (right as number);
        case '<=':
          return (left as number) <= (right as number);
        case '>':
          return (left as number) > (right as number);
        case '>=':
          return (left as number) >= (right as number);
        case '+':
          return (left as number) + (right as number);
        case '-':
          return (left as number) - (right as number);
        case '*':
          return (left as number) * (right as number);
        case '/':
          return (left as number) / (right as number);
        case '%':
          return (left as number) % (right as number);
      }
      break;
    }

    case 'LogicalExpression':
      // 短路求值：右侧仅在需要时求值
      if (node.operator === '&&') {
        const left = evaluateNode(node.left, scope, options);
        return left ? evaluateNode(node.right, scope, options) : left;
      }
      {
        const left = evaluateNode(node.left, scope, options);
        return left ? left : evaluateNode(node.right, scope, options);
      }

    case 'ConditionalExpression':
      return evaluateNode(node.test, scope, options)
        ? evaluateNode(node.consequent, scope, options)
        : evaluateNode(node.alternate, scope, options);

    case 'CallExpression': {
      const fn = resolveFunction(node.callee.name, scope, options);
      const args = node.arguments.map((arg) => evaluateNode(arg, scope, options));
      return fn(...args);
    }
  }
}

/**
 * 解析并求值表达式。
 *
 * @param source 表达式源码（不含 `${}` 定界符）或已解析的 AST
 * @param scope 求值作用域，由调用方组装
 */
export function evaluateExpression(
  source: string | ExpressionNode,
  scope: ExpressionScope = {},
  options: EvaluateOptions = {},
): unknown {
  const node = typeof source === 'string' ? parseExpression(source) : source;
  return evaluateNode(node, scope, options);
}
