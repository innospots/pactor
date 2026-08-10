import { ExpressionError } from './error.js';
import {
  evaluateExpression,
  type EvaluateOptions,
  type ExpressionScope,
} from './evaluator.js';

type Segment =
  | { kind: 'text'; text: string }
  | { kind: 'expr'; source: string; pos: number };

/** 字符串中是否包含 `${...}` 表达式 */
export function hasExpression(value: string): boolean {
  return value.includes('${');
}

/**
 * 将模板字符串切分为文本与表达式片段。
 * 表达式内支持字符串字面量（其中可含 `}` / `${`），未闭合的 `${` 抛错。
 */
function splitTemplate(value: string): Segment[] {
  const segments: Segment[] = [];
  let textStart = 0;
  let i = 0;

  while (i < value.length) {
    if (value[i] === '$' && value[i + 1] === '{') {
      if (i > textStart) {
        segments.push({ kind: 'text', text: value.slice(textStart, i) });
      }
      const exprPos = i;
      i += 2;
      let depth = 1;
      let quote: string | undefined;
      let source = '';
      let closed = false;

      while (i < value.length) {
        const c = value[i]!;
        if (quote !== undefined) {
          if (c === '\\' && i + 1 < value.length) {
            source += c + value[i + 1];
            i += 2;
            continue;
          }
          if (c === quote) {
            quote = undefined;
          }
          source += c;
          i += 1;
          continue;
        }
        if (c === "'" || c === '"') {
          quote = c;
          source += c;
          i += 1;
          continue;
        }
        if (c === '{') {
          depth += 1;
          source += c;
          i += 1;
          continue;
        }
        if (c === '}') {
          depth -= 1;
          if (depth === 0) {
            closed = true;
            i += 1;
            break;
          }
          source += c;
          i += 1;
          continue;
        }
        source += c;
        i += 1;
      }

      if (!closed) {
        throw new ExpressionError('unterminated "${" in template', exprPos);
      }
      segments.push({ kind: 'expr', source, pos: exprPos });
      textStart = i;
      continue;
    }
    i += 1;
  }

  if (textStart < value.length) {
    segments.push({ kind: 'text', text: value.slice(textStart) });
  }
  return segments;
}

function stringify(value: unknown): string {
  return value === null || value === undefined ? '' : String(value);
}

/**
 * 求值 DSL 模板字符串。
 *
 * - 字符串整体恰好是一个 `${...}`：返回表达式的原始类型值
 *   （保留 boolean / number / object / array）。
 * - 内嵌 `${...}` 与其他文本混合：各表达式结果字符串化后拼接，
 *   null / undefined 渲染为空串。
 * - 不含 `${` 的普通字符串：原样返回。
 */
export function resolveTemplate(
  value: string,
  scope: ExpressionScope = {},
  options: EvaluateOptions = {},
): unknown {
  if (!hasExpression(value)) {
    return value;
  }

  const segments = splitTemplate(value);

  if (segments.length === 1 && segments[0]!.kind === 'expr') {
    return evaluateExpression(segments[0].source, scope, options);
  }

  return segments
    .map((segment) =>
      segment.kind === 'text'
        ? segment.text
        : stringify(evaluateExpression(segment.source, scope, options)),
    )
    .join('');
}
