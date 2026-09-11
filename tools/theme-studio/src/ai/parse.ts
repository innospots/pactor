/**
 * 生成结果解析（spec: theme-studio-ai-generate / 生成结果解析与应用）：
 * 从模型输出提取 css 代码块，逐行解析 `--token: value` 声明，
 * 以 tokens.ts 清单为白名单过滤（清单外令牌一律丢弃），
 * 拆分 `:root` 亮色块与 `[data-pactor-theme='dark']` 暗色块。
 */
import { TOKEN_NAMES } from '../tokens';

export interface ParsedSkin {
  light: Record<string, string>;
  dark: Record<string, string>;
}

const WHITELIST = new Set(TOKEN_NAMES);

/** 提取 ```css 代码块；无代码块标记时以全文为候选 */
export function extractCss(text: string): string | null {
  const block = /```(?:css)?\s*\n([\s\S]*?)```/.exec(text);
  const candidate = block ? block[1]! : text;
  return candidate.includes('--') ? candidate : null;
}

/** 提取某个选择器块（brace 配对），不存在返回空串 */
function extractBlock(css: string, selector: string): string {
  const start = css.indexOf(selector);
  if (start < 0) {
    return '';
  }
  const open = css.indexOf('{', start);
  if (open < 0) {
    return '';
  }
  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') {
      depth += 1;
    } else if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        return css.slice(open + 1, i);
      }
    }
  }
  return '';
}

/** 解析块内自定义属性声明，白名单过滤 */
function parseDeclarations(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    const name = match[1]!;
    if (WHITELIST.has(name)) {
      out[name] = match[2]!.trim();
    }
  }
  return out;
}

/**
 * 解析模型输出为亮/暗两组令牌；解析不到任何有效亮色令牌时返回 null。
 * 暗色块允许缺省（前端回退内置暗色兜底）。
 */
export function parseSkinCss(text: string): ParsedSkin | null {
  const css = extractCss(text);
  if (!css) {
    return null;
  }
  const light = parseDeclarations(extractBlock(css, ':root'));
  if (Object.keys(light).length === 0) {
    return null;
  }
  const dark = parseDeclarations(extractBlock(css, "[data-pactor-theme='dark']"));
  return { light, dark };
}
