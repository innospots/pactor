// @vitest-environment jsdom
import './setup.js';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  collectDirectoryKeys,
  findFileNode,
  guessLanguage,
  isDraftDirty,
  type FileManagerNode,
} from '../src/components/FileManager/index.js';
import { expectEventState, renderDsl } from './helpers.js';

const files: FileManagerNode[] = [
  {
    key: 'src',
    title: 'src',
    children: [
      {
        key: 'app',
        title: 'App.tsx',
        content: 'export default function App() { return null; }',
      },
      { key: 'main', title: 'main.py', content: "print('hello')" },
    ],
  },
  { key: 'readme', title: 'README.md', content: '# Demo' },
];

function renderFileManager(extraProps: Record<string, unknown> = {}, node: object = {}) {
  return renderDsl({
    type: 'FileManager',
    props: { title: '项目文件', treeTitle: '目录', files, ...extraProps },
    ...node,
  });
}

describe('FileManager', () => {
  it('渲染 Panel 标题 / 树标题 / 树节点，目录默认全部展开', () => {
    renderFileManager();

    expect(screen.getByText('项目文件').getAttribute('data-slot')).toBe('panel-title');
    expect(screen.getByText('目录').getAttribute('data-slot')).toBe(
      'file-manager-nav-title',
    );
    // src 目录默认展开：两个子文件与根级文件均可见
    expect(screen.getByText('App.tsx')).toBeTruthy();
    expect(screen.getByText('main.py')).toBeTruthy();
    expect(screen.getByText('README.md')).toBeTruthy();
  });

  it('未选中文件时右侧渲染空态', () => {
    const { container } = renderFileManager();
    expect(container.querySelector('[data-slot=file-manager-empty]')).not.toBeNull();
    expect(screen.getByText('点击左侧文件查看内容')).toBeTruthy();
  });

  it('点击文件：右侧展示路径 header 与编辑器内容，事件传出 { key, path }', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'FileManager',
      props: { title: '项目文件', files },
      events: {
        onSelect: { action: 'setState', params: { selected: '${event}' } },
      },
    });

    await user.click(screen.getByText('App.tsx'));

    const path = container.querySelector('[data-slot=file-manager-view-path]');
    expect(path?.textContent).toBe('src/App.tsx');
    // CodeMirror 异步挂载
    await waitFor(() => {
      expect(container.querySelector('.cm-editor')).not.toBeNull();
    });
    await expectEventState(context, 'selected', { key: 'app', path: 'src/App.tsx' });
  });

  it('点击目录标题收起/展开子节点', async () => {
    const user = userEvent.setup();
    renderFileManager();

    await user.click(screen.getByText('src'));
    expect(screen.queryByText('App.tsx')).toBeNull();
    await user.click(screen.getByText('src'));
    expect(screen.getByText('App.tsx')).toBeTruthy();
  });

  it('编辑按钮切换只读/编辑模式', async () => {
    const user = userEvent.setup();
    const { container } = renderFileManager();

    await user.click(screen.getByText('README.md'));
    await waitFor(() => {
      expect(container.querySelector('.cm-editor')).not.toBeNull();
    });
    const wrapper = () => container.querySelector('[data-slot=script-editor]');
    // 默认只读（readOnly 语义；contenteditable 保留以支持键盘滚读）
    expect(wrapper()?.getAttribute('data-readonly')).toBe('true');

    await user.click(screen.getByRole('button', { name: /编辑/ }));
    await waitFor(() => {
      expect(wrapper()?.getAttribute('data-readonly')).toBeNull();
    });
    expect(screen.getByRole('button', { name: /完成/ })).toBeTruthy();
  });

  it('草稿守卫：编辑中且内容被修改时切换文件弹确认框，取消则留在当前文件', async () => {
    const user = userEvent.setup();
    const { container } = renderFileManager();

    await user.click(screen.getByText('README.md'));
    await waitFor(() => {
      expect(container.querySelector('.cm-editor')).not.toBeNull();
    });
    // 进入编辑并通过 CodeMirror 派发一次修改（走真实 onChange 链路）
    await user.click(screen.getByRole('button', { name: /编辑/ }));
    const { EditorView } = await import('@codemirror/view');
    const view = EditorView.findFromDOM(
      container.querySelector('.cm-editor') as HTMLElement,
    )!;
    view.dispatch({ changes: { from: 0, insert: '（改）' } });
    await waitFor(() => {
      expect(container.querySelector('[data-slot=file-manager-dirty-dot]')).not.toBeNull();
    });

    // 点击其他文件 → 弹确认框，不切换
    await user.click(screen.getByText('App.tsx'));
    expect(await screen.findByText('放弃未保存的修改？')).toBeTruthy();
    expect(
      container.querySelector('[data-slot=file-manager-view-path]')!.textContent,
    ).toContain('README.md');

    // 取消 → 留在当前文件，草稿保留
    await user.click(screen.getByRole('button', { name: '继续编辑' }));
    await waitFor(() => {
      expect(screen.queryByText('放弃未保存的修改？')).toBeNull();
    });
    expect(container.querySelector('.cm-content')!.textContent).toContain('（改）');
  });

  it('草稿守卫确认：放弃修改后切换到目标文件', async () => {
    const user = userEvent.setup();
    const { container } = renderFileManager();

    await user.click(screen.getByText('README.md'));
    await waitFor(() => {
      expect(container.querySelector('.cm-editor')).not.toBeNull();
    });
    await user.click(screen.getByRole('button', { name: /编辑/ }));
    const { EditorView } = await import('@codemirror/view');
    EditorView.findFromDOM(
      container.querySelector('.cm-editor') as HTMLElement,
    )!.dispatch({ changes: { from: 0, insert: 'x' } });

    await user.click(screen.getByText('App.tsx'));
    await user.click(await screen.findByRole('button', { name: '放弃修改' }));
    await waitFor(() => {
      expect(
        container.querySelector('[data-slot=file-manager-view-path]')!.textContent,
      ).toContain('App.tsx');
    });
  });

  it('编辑中未修改（草稿等于原文）切换文件不拦截', async () => {
    const user = userEvent.setup();
    const { container } = renderFileManager();

    await user.click(screen.getByText('README.md'));
    await waitFor(() => {
      expect(container.querySelector('.cm-editor')).not.toBeNull();
    });
    await user.click(screen.getByRole('button', { name: /编辑/ }));
    await user.click(screen.getByText('App.tsx'));
    expect(screen.queryByText('放弃未保存的修改？')).toBeNull();
    await waitFor(() => {
      expect(
        container.querySelector('[data-slot=file-manager-view-path]')!.textContent,
      ).toContain('App.tsx');
    });
  });

  it('内容区编辑器无边框通栏展示；两侧 header 等高（min-h-12）', async () => {
    const user = userEvent.setup();
    const { container } = renderFileManager();

    await user.click(screen.getByText('README.md'));
    await waitFor(() => {
      expect(container.querySelector('.cm-editor')).not.toBeNull();
    });
    const editorWrapper = container.querySelector('[data-slot=script-editor]')!;
    expect(editorWrapper.className).not.toContain('rounded-md');
    expect(editorWrapper.className).toContain('w-full');
    expect(
      container.querySelector('[data-slot=file-manager-nav-title]')!.className,
    ).toContain('min-h-12');
    expect(
      container.querySelector('[data-slot=file-manager-view-header]')!.className,
    ).toContain('min-h-12');
  });

  it('树节点带目录/文件图标', () => {
    const { container } = renderFileManager();
    const srcRow = container.querySelector('[data-key=src] [data-slot=tree-node-row]')!;
    expect(srcRow.querySelector('svg')).toBeTruthy();
  });

  it('复制按钮带可访问名称', async () => {
    const user = userEvent.setup();
    renderFileManager();
    await user.click(screen.getByText('README.md'));
    expect(screen.getByRole('button', { name: '复制文件内容' })).toBeTruthy();
  });

  it('readonly 全局只读：隐藏编辑按钮', async () => {
    const user = userEvent.setup();
    renderFileManager({ readonly: true });

    await user.click(screen.getByText('README.md'));
    expect(screen.queryByRole('button', { name: /编辑/ })).toBeNull();
  });

  it('通用 props 作用于根节点（Panel）', () => {
    const { container } = renderFileManager({
      className: 'biz-probe',
      style: { maxWidth: 720 },
    });
    const root = container.querySelector('[data-slot=panel]') as HTMLElement;
    expect(root.classList.contains('biz-probe')).toBe(true);
    expect(root.style.maxWidth).toBe('720px');
  });
});

describe('FileManager 纯函数', () => {
  it('collectDirectoryKeys 收集全部目录 key（含嵌套）', () => {
    expect(collectDirectoryKeys(files)).toEqual(['src']);
    expect(
      collectDirectoryKeys([
        { key: 'a', title: 'a', children: [{ key: 'b', title: 'b', children: [] }] },
      ]),
    ).toEqual(['a']);
  });

  it('findFileNode 返回节点与层级拼接路径；path 字段优先', () => {
    expect(findFileNode(files, 'app')).toEqual({
      node: files[0]!.children![0],
      path: 'src/App.tsx',
    });
    expect(
      findFileNode([{ key: 'x', title: 'x.txt', path: '/abs/x.txt' }], 'x')?.path,
    ).toBe('/abs/x.txt');
    expect(findFileNode(files, 'missing')).toBeNull();
  });

  it('guessLanguage 按扩展名映射，未知回退 text', () => {
    expect(guessLanguage('a.ts')).toBe('javascript');
    expect(guessLanguage('a.json')).toBe('json');
    expect(guessLanguage('a.py')).toBe('python');
    expect(guessLanguage('a.md')).toBe('text');
    expect(guessLanguage('Makefile')).toBe('text');
  });

  it('isDraftDirty：仅编辑态且草稿与原文不同为脏', () => {
    expect(isDraftDirty(true, 'abc', 'abc')).toBe(false);
    expect(isDraftDirty(true, 'abc', 'abd')).toBe(true);
    expect(isDraftDirty(true, undefined, 'abc')).toBe(false);
    expect(isDraftDirty(false, 'abc', 'abd')).toBe(false);
  });
});
