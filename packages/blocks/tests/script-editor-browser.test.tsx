// @vitest-environment jsdom
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ScriptEditor } from '../src/components/ScriptEditor/index.js';
import './setup.js';

// 兼容包内 / 仓库根两种 vitest 启动 cwd（jsdom 下 import.meta.url
// 非 file scheme，不可用作路径基准）
const stylesCandidates = [
  resolve(process.cwd(), 'styles.css'),
  resolve(process.cwd(), 'packages/blocks/styles.css'),
];
const stylesPath = stylesCandidates.find((path) => existsSync(path));
if (!stylesPath) {
  throw new Error(`blocks styles.css not found from cwd ${process.cwd()}`);
}
const blocksStyles = document.createElement('style');
blocksStyles.textContent = readFileSync(stylesPath, 'utf8');
document.head.appendChild(blocksStyles);

afterEach(cleanup);

function getEditor(container: HTMLElement): HTMLElement | null {
  return container.querySelector('.cm-editor');
}

function getContent(container: HTMLElement): HTMLElement | null {
  return container.querySelector('.cm-content');
}

describe('ScriptEditor 浏览器行为（CodeMirror 6）', () => {
  it('挂载编辑器并渲染初始值', async () => {
    const { container } = render(<ScriptEditor value="SELECT * FROM users" language="sql" />);

    await waitFor(() => {
      expect(getEditor(container)).not.toBeNull();
    });
    expect(getContent(container)?.textContent).toContain('SELECT * FROM users');
  });

  it('placeholder 渲染在 CM 正文容器内', async () => {
    const { container } = render(<ScriptEditor placeholder="请输入脚本" />);

    await waitFor(() => {
      const placeholder = container.querySelector('.cm-placeholder');
      expect(placeholder?.textContent).toBe('请输入脚本');
    });
    const placeholder = container.querySelector('.cm-placeholder')!;
    expect(placeholder.closest('.cm-content')).not.toBeNull();
  });

  it('placeholder 使用 14px 字号与 muted 颜色（blocks styles.css 契约）', async () => {
    const { container } = render(<ScriptEditor placeholder="请输入脚本" />);

    await waitFor(() => {
      const placeholder = container.querySelector('.cm-placeholder');
      expect(placeholder).not.toBeNull();
    });
    expect(getComputedStyle(container.querySelector('.cm-placeholder')!).fontSize).toBe('14px');
  });

  it('language 写入包裹层 data-language 并随 prop 切换', async () => {
    const { container, rerender } = render(
      <ScriptEditor language="python" value="value = 1" />,
    );

    await waitFor(() => {
      expect(getEditor(container)).not.toBeNull();
    });
    const wrapper = container.querySelector('[data-slot=script-editor]')!;
    expect(wrapper.getAttribute('data-language')).toBe('python');

    rerender(<ScriptEditor language="sql" value="SELECT 1" />);
    await waitFor(() => {
      expect(
        container
          .querySelector('[data-slot=script-editor]')!
          .getAttribute('data-language'),
      ).toBe('sql');
    });
  });

  it('readonly 时内容只读（data-readonly 标记），取消后恢复编辑', async () => {
    const { container, rerender } = render(<ScriptEditor value="a = 1" readonly />);

    await waitFor(() => {
      expect(getEditor(container)).not.toBeNull();
    });
    const wrapper = () => container.querySelector('[data-slot=script-editor]')!;
    expect(wrapper().getAttribute('data-readonly')).toBe('true');
    // 只读保留聚焦/键盘滚动（不用 editable=false）
    expect(getContent(container)?.getAttribute('contenteditable')).toBe('true');

    rerender(<ScriptEditor value="a = 1" />);
    await waitFor(() => {
      expect(wrapper().getAttribute('data-readonly')).toBeNull();
    });
  });

  it('theme 缺省跟随 data-pactor-theme，可显式覆盖', async () => {
    const { container, rerender } = render(<ScriptEditor value="a = 1" />);

    await waitFor(() => {
      expect(getEditor(container)).not.toBeNull();
    });
    const wrapper = () => container.querySelector('[data-slot=script-editor]')!;
    expect(wrapper().getAttribute('data-theme')).toBe('light');

    // 切换到暗色（模拟换肤机制）
    document.documentElement.setAttribute('data-pactor-theme', 'dark');
    await waitFor(() => {
      expect(wrapper().getAttribute('data-theme')).toBe('dark');
    });
    document.documentElement.removeAttribute('data-pactor-theme');

    // 显式 theme 覆盖皮肤跟随
    rerender(<ScriptEditor value="a = 1" theme="light" />);
    document.documentElement.setAttribute('data-pactor-theme', 'dark');
    await waitFor(() => {
      expect(wrapper().getAttribute('data-theme')).toBe('light');
    });
    document.documentElement.removeAttribute('data-pactor-theme');
  });

  it('bordered=false 去边框与圆角（嵌入式场景）', async () => {
    const { container } = render(<ScriptEditor value="a = 1" bordered={false} />);

    await waitFor(() => {
      expect(getEditor(container)).not.toBeNull();
    });
    const wrapper = container.querySelector('[data-slot=script-editor]')!;
    expect(wrapper.className).not.toContain('rounded-md');
    expect(wrapper.className).not.toContain('border');
  });

  it('外部 value 变化同步进编辑器', async () => {
    const { container, rerender } = render(<ScriptEditor value="第一版" />);

    await waitFor(() => {
      expect(getContent(container)?.textContent).toContain('第一版');
    });
    rerender(<ScriptEditor value="第二版" />);
    await waitFor(() => {
      expect(getContent(container)?.textContent).toContain('第二版');
    });
  });
});
