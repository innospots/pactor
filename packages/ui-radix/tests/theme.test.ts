/**
 * pactor-ui-radix 主题体系测试（spec：radix-theme）：
 * - token 定义存在：`:root` 中含语义/形状 token（抽样）
 * - dark 皮肤：`[data-pactor-theme='dark']` 块存在且覆盖同名 token
 * - 组件规则区（token 定义块之外）无硬编码 hex 色值（注释除外）
 * - 状态反馈规则存在（hover / data-state 动画 / tabs 激活指示等）
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const packageDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const stylesPath = join(packageDir, 'styles.css');
const css = readFileSync(stylesPath, 'utf8');
/** 去注释后的样式表（注释中的 hex 说明不参与断言） */
const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, '');

/** 提取指定选择器的全部规则声明体并合并（token 块无嵌套花括号） */
function blocksOf(selectorPredicate: (selector: string) => boolean): string {
  const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
  const bodies: string[] = [];
  for (const match of cssNoComments.matchAll(rulePattern)) {
    const selector = match[1] ?? '';
    if (selectorPredicate(selector)) {
      bodies.push(match[2] ?? '');
    }
  }
  return bodies.join('\n');
}

/** 全部 light token 定义（色板 + 语义/形状，分多个 :root 块组织） */
const rootBlocks = blocksOf((s) => s.trim().startsWith(':root'));
/** dark 皮肤 token 覆盖块 */
const darkBlock = blocksOf((s) => s.includes("[data-pactor-theme='dark']"));

describe('设计 token 层', () => {
  it(':root 中含语义 token 与形状 token 定义（抽样）', () => {
    const tokens = [
      '--pcr-accent:',
      '--pcr-bg:',
      '--pcr-fg:',
      '--pcr-border:',
      '--pcr-success:',
      '--pcr-warning:',
      '--pcr-error:',
      '--pcr-info:',
      '--pcr-radius-md:',
      '--pcr-shadow-md:',
      '--pcr-focus-ring:',
      '--pcr-font-family:',
    ];
    for (const token of tokens) {
      expect(rootBlocks, `:root 应定义 ${token}`).toContain(token);
    }
  });

  it(':root 中含色板 token（accent 刻度 / slate 刻度 / 语义实体色）', () => {
    for (const token of [
      '--pcr-accent-1:',
      '--pcr-accent-9:',
      '--pcr-accent-12:',
      '--pcr-slate-1:',
      '--pcr-slate-12:',
      '--pcr-green-9:',
      '--pcr-amber-9:',
      '--pcr-red-9:',
      '--pcr-blue-9:',
    ]) {
      expect(rootBlocks, `:root 应定义 ${token}`).toContain(token);
    }
    // accent 刻度第 9 级（实体色）即品牌主色 #3C47DD
    expect(rootBlocks).toMatch(/--pcr-accent-9:\s*#3c47dd/i);
  });

  it('组件规则区（token 定义块之外）无硬编码 hex 色值', () => {
    // 逐条规则检查：token 定义块（:root / [data-pactor-theme]）之外
    // 的声明体不允许出现 hex 色值
    const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
    const offenders: string[] = [];
    for (const match of cssNoComments.matchAll(rulePattern)) {
      const selector = match[1] ?? '';
      const body = match[2] ?? '';
      if (
        selector.trim().startsWith(':root') ||
        selector.includes('data-pactor-theme')
      ) {
        continue;
      }
      const hex = body.match(/#[0-9a-fA-F]{3,8}\b/);
      if (hex) {
        offenders.push(`${selector.trim()} -> ${hex[0]}`);
      }
    }
    expect(
      offenders,
      `组件规则区存在硬编码 hex：${offenders.join('; ')}`,
    ).toEqual([]);
  });
});

describe('内置 dark 皮肤', () => {
  it("[data-pactor-theme='dark'] 块存在且覆盖同名语义 token 与色板 token", () => {
    expect(darkBlock.length).toBeGreaterThan(0);
    for (const token of [
      '--pcr-bg:',
      '--pcr-fg:',
      '--pcr-accent:',
      '--pcr-border:',
      '--pcr-success:',
      '--pcr-error:',
      '--pcr-focus-ring:',
      '--pcr-shadow-md:',
      '--pcr-slate-1:',
      '--pcr-accent-9:',
    ]) {
      expect(darkBlock, `dark 块应覆盖 ${token}`).toContain(token);
    }
  });
});

describe('默认皮肤状态反馈', () => {
  it('按钮 / Tabs / 弹层动画 / 菜单 / Toast / 表格等状态规则存在', () => {
    expect(cssNoComments).toContain('.pcr-btn-primary:hover');
    expect(cssNoComments).toContain('.pcr-btn:focus-visible');
    expect(cssNoComments).toContain('.pcr-btn:disabled');
    expect(cssNoComments).toContain(".pcr-tabs-trigger[data-state='active']");
    expect(cssNoComments).toContain(".pcr-modal-content[data-state='open']");
    expect(cssNoComments).toContain('.pcr-menu-item-active');
    expect(cssNoComments).toContain('.pcr-toast-success');
    expect(cssNoComments).toContain('.pcr-toast-error');
    expect(cssNoComments).toContain('.pcr-toast-info');
    expect(cssNoComments).toContain('.pcr-toast-warning');
    expect(cssNoComments).toContain('.pcr-table-table tbody tr:hover');
  });
});
