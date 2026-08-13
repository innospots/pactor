import type {
  BinaryOperator,
  ExpressionNode,
  LogicalOperator,
  UnaryOperator,
} from './ast.js';
import { ExpressionError } from './error.js';
import { tokenize, type Token } from './tokenizer.js';

/**
 * Recursive descent parser。
 *
 * 优先级（低 → 高）：
 *   conditional → logicalOr → logicalAnd → equality → relational
 *   → additive → multiplicative → unary → member/call → primary
 */
export function parseExpression(source: string): ExpressionNode {
  const parser = new Parser(tokenize(source));
  const node = parser.parseConditional();
  parser.expectEnd();
  return node;
}

class Parser {
  private index = 0;

  constructor(private readonly tokens: Token[]) {}

  private peek(): Token | undefined {
    return this.tokens[this.index];
  }

  private next(): Token {
    const token = this.tokens[this.index];
    if (!token) {
      throw new ExpressionError('unexpected end of expression');
    }
    this.index += 1;
    return token;
  }

  private isPunctuator(value: string): boolean {
    const token = this.peek();
    return token?.type === 'punctuator' && token.value === value;
  }

  private eatPunctuator(value: string): boolean {
    if (this.isPunctuator(value)) {
      this.index += 1;
      return true;
    }
    return false;
  }

  private expectPunctuator(value: string): void {
    const token = this.peek();
    if (!this.eatPunctuator(value)) {
      throw new ExpressionError(`expected "${value}" but got "${token?.value ?? 'end of expression'}"`, token?.pos);
    }
  }

  expectEnd(): void {
    const token = this.peek();
    if (token) {
      throw new ExpressionError(`unexpected token "${token.value}"`, token.pos);
    }
  }

  parseConditional(): ExpressionNode {
    const test = this.parseLogicalOr();
    if (this.eatPunctuator('?')) {
      const consequent = this.parseConditional();
      this.expectPunctuator(':');
      const alternate = this.parseConditional();
      return { type: 'ConditionalExpression', test, consequent, alternate };
    }
    return test;
  }

  private parseLogicalOr(): ExpressionNode {
    return this.parseBinaryChain(
      () => this.parseLogicalAnd(),
      ['||'],
      'LogicalExpression',
    );
  }

  private parseLogicalAnd(): ExpressionNode {
    return this.parseBinaryChain(
      () => this.parseEquality(),
      ['&&'],
      'LogicalExpression',
    );
  }

  private parseEquality(): ExpressionNode {
    return this.parseBinaryChain(
      () => this.parseRelational(),
      ['==', '!=', '===', '!=='],
      'BinaryExpression',
    );
  }

  private parseRelational(): ExpressionNode {
    return this.parseBinaryChain(
      () => this.parseAdditive(),
      ['<', '<=', '>', '>='],
      'BinaryExpression',
    );
  }

  private parseAdditive(): ExpressionNode {
    return this.parseBinaryChain(
      () => this.parseMultiplicative(),
      ['+', '-'],
      'BinaryExpression',
    );
  }

  private parseMultiplicative(): ExpressionNode {
    return this.parseBinaryChain(
      () => this.parseUnary(),
      ['*', '/', '%'],
      'BinaryExpression',
    );
  }

  private parseBinaryChain(
    parseOperand: () => ExpressionNode,
    operators: string[],
    kind: 'BinaryExpression' | 'LogicalExpression',
  ): ExpressionNode {
    let left = parseOperand();
    for (;;) {
      const token = this.peek();
      if (token?.type !== 'punctuator' || !operators.includes(token.value)) {
        return left;
      }
      this.next();
      const right = parseOperand();
      if (kind === 'LogicalExpression') {
        left = {
          type: 'LogicalExpression',
          operator: token.value as LogicalOperator,
          left,
          right,
        };
      } else {
        left = {
          type: 'BinaryExpression',
          operator: token.value as BinaryOperator,
          left,
          right,
        };
      }
    }
  }

  private parseUnary(): ExpressionNode {
    const token = this.peek();
    if (
      token?.type === 'punctuator' &&
      (token.value === '!' || token.value === '-' || token.value === '+')
    ) {
      this.next();
      return {
        type: 'UnaryExpression',
        operator: token.value as UnaryOperator,
        argument: this.parseUnary(),
      };
    }
    return this.parseMemberOrCall();
  }

  private parseMemberOrCall(): ExpressionNode {
    let node = this.parsePrimary();

    for (;;) {
      if (this.eatPunctuator('.')) {
        const property = this.next();
        if (property.type !== 'identifier') {
          throw new ExpressionError(
            `expected property name after "." but got "${property.value}"`,
            property.pos,
          );
        }
        node = {
          type: 'MemberExpression',
          object: node,
          property: { type: 'Identifier', name: property.value },
          computed: false,
        };
        continue;
      }
      if (this.eatPunctuator('[')) {
        const property = this.parseConditional();
        this.expectPunctuator(']');
        node = {
          type: 'MemberExpression',
          object: node,
          property,
          computed: true,
        };
        continue;
      }
      if (this.isPunctuator('(')) {
        // 仅允许直接 Identifier 调用；成员方法调用被拒绝，防止原型链逃逸
        if (node.type !== 'Identifier') {
          throw new ExpressionError(
            'member method calls are not allowed; only whitelisted functions can be called',
            this.peek()?.pos,
          );
        }
        this.next(); // '('
        const args: ExpressionNode[] = [];
        if (!this.isPunctuator(')')) {
          for (;;) {
            args.push(this.parseConditional());
            if (!this.eatPunctuator(',')) break;
          }
        }
        this.expectPunctuator(')');
        node = { type: 'CallExpression', callee: node, arguments: args };
        continue;
      }
      return node;
    }
  }

  private parsePrimary(): ExpressionNode {
    const token = this.next();

    if (token.type === 'number') {
      return { type: 'Literal', value: Number(token.value) };
    }
    if (token.type === 'string') {
      return { type: 'Literal', value: token.value };
    }
    if (token.type === 'identifier') {
      switch (token.value) {
        case 'true':
          return { type: 'Literal', value: true };
        case 'false':
          return { type: 'Literal', value: false };
        case 'null':
          return { type: 'Literal', value: null };
        case 'undefined':
          return { type: 'Literal', value: undefined };
        default:
          return { type: 'Identifier', name: token.value };
      }
    }
    if (token.type === 'punctuator' && token.value === '(') {
      const node = this.parseConditional();
      this.expectPunctuator(')');
      return node;
    }
    if (token.type === 'punctuator' && token.value === '{') {
      // 对象字面量：键为标识符或字符串，值为任意表达式（如 t() 的插值参数表）
      const properties: Array<{ key: string; value: ExpressionNode }> = [];
      if (!this.isPunctuator('}')) {
        for (;;) {
          const keyToken = this.next();
          if (keyToken.type !== 'identifier' && keyToken.type !== 'string') {
            throw new ExpressionError(
              `expected object key but got "${keyToken.value}"`,
              keyToken.pos,
            );
          }
          this.expectPunctuator(':');
          properties.push({
            key: keyToken.value,
            value: this.parseConditional(),
          });
          if (!this.eatPunctuator(',')) break;
        }
      }
      this.expectPunctuator('}');
      return { type: 'ObjectExpression', properties };
    }

    throw new ExpressionError(`unexpected token "${token.value}"`, token.pos);
  }
}
