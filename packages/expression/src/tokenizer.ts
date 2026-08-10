import { ExpressionError } from './error.js';

export type TokenType = 'number' | 'string' | 'identifier' | 'punctuator';

export interface Token {
  type: TokenType;
  value: string;
  pos: number;
}

const PUNCTUATORS = [
  '===',
  '!==',
  '&&',
  '||',
  '==',
  '!=',
  '<=',
  '>=',
  '(',
  ')',
  ',',
  '.',
  '?',
  ':',
  '<',
  '>',
  '+',
  '-',
  '*',
  '/',
  '%',
  '!',
  '[',
  ']',
] as const;

const IDENTIFIER_START = /[A-Za-z_$]/;
const IDENTIFIER_PART = /[A-Za-z0-9_$]/;
const DIGIT = /[0-9]/;

/** 将表达式源码切分为 token 序列；非法字符抛出带位置的语法错误 */
export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < source.length) {
    const ch = source[i]!;

    // 空白
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    // 数字字面量（含小数）
    if (DIGIT.test(ch)) {
      const start = i;
      while (i < source.length && DIGIT.test(source[i]!)) i += 1;
      if (source[i] === '.') {
        i += 1;
        while (i < source.length && DIGIT.test(source[i]!)) i += 1;
      }
      tokens.push({ type: 'number', value: source.slice(start, i), pos: start });
      continue;
    }

    // 字符串字面量（单/双引号，支持反斜杠转义）
    if (ch === "'" || ch === '"') {
      const start = i;
      const quote = ch;
      i += 1;
      let value = '';
      let closed = false;
      while (i < source.length) {
        const c = source[i]!;
        if (c === '\\') {
          const next = source[i + 1];
          if (next === undefined) break;
          value += next === 'n' ? '\n' : next === 't' ? '\t' : next;
          i += 2;
          continue;
        }
        if (c === quote) {
          closed = true;
          i += 1;
          break;
        }
        value += c;
        i += 1;
      }
      if (!closed) {
        throw new ExpressionError('unterminated string literal', start);
      }
      tokens.push({ type: 'string', value, pos: start });
      continue;
    }

    // 标识符 / 关键字
    if (IDENTIFIER_START.test(ch)) {
      const start = i;
      while (i < source.length && IDENTIFIER_PART.test(source[i]!)) i += 1;
      tokens.push({ type: 'identifier', value: source.slice(start, i), pos: start });
      continue;
    }

    // 标点 / 操作符（长符号优先）
    const punct = PUNCTUATORS.find((p) => source.startsWith(p, i));
    if (punct) {
      tokens.push({ type: 'punctuator', value: punct, pos: i });
      i += punct.length;
      continue;
    }

    throw new ExpressionError(`unexpected character "${ch}"`, i);
  }

  return tokens;
}
