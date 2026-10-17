// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ScriptEditor } from '../src/components/ScriptEditor/index.js';
import './setup.js';

const blocksStyles = document.createElement('style');
blocksStyles.textContent = readFileSync(resolve(process.cwd(), 'styles.css'), 'utf8');
document.head.appendChild(blocksStyles);

afterEach(cleanup);

function getModeId(container: HTMLElement): string | undefined {
  const element = container.querySelector('.ace_editor') as
    | (HTMLDivElement & { env?: { editor: { session: { $modeId?: string } } } })
    | null;
  return element?.env?.editor.session.$modeId;
}

describe('ScriptEditor 浏览器行为', () => {
  it('placeholder 渲染在 Ace 正文容器内', async () => {
    const { container } = render(<ScriptEditor placeholder="请输入脚本" />);

    await waitFor(() => {
      expect(container.querySelector('.ace_editor')).not.toBeNull();
    });
    await waitFor(() => {
      const placeholder = container.querySelector('.ace_placeholder');
      expect(placeholder?.textContent).toBe('请输入脚本');
      expect(placeholder?.parentElement?.classList.contains('ace_content')).toBe(true);
    });
  });

  it('placeholder 使用 14px 字号并取消缩放', async () => {
    const { container } = render(<ScriptEditor placeholder="请输入脚本" />);

    await waitFor(() => {
      const placeholder = container.querySelector('.ace_placeholder');
      expect(placeholder).not.toBeNull();
      expect(getComputedStyle(placeholder!).fontSize).toBe('14px');
      expect(getComputedStyle(placeholder!).transform).toBe('none');
    });
  });

  it('初始 language 使用对应的 Ace 语法模式', async () => {
    const { container } = render(<ScriptEditor language="sql" value="SELECT * FROM users" />);

    await waitFor(() => {
      expect(getModeId(container)).toBe('ace/mode/sql');
    });
  });

  it('language 变化后切换 Ace 语法模式', async () => {
    const { container, rerender } = render(<ScriptEditor language="python" value="value = 1" />);

    await waitFor(() => {
      expect(getModeId(container)).toBe('ace/mode/python');
    });
    rerender(<ScriptEditor language="sql" value="SELECT * FROM users" />);

    await waitFor(() => {
      expect(getModeId(container)).toBe('ace/mode/sql');
    });
  });
});
