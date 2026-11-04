// @vitest-environment jsdom
/**
 * @pactor-app/file-viewer 契约：
 * - createFileViewerComponent 容器兜底高度 / SSR 守卫 / url 或 file 缺失不挂载 viewer；
 * - 选项合并优先级：内置默认 < 注册期 defaultOptions（preset 等）< 具名 props < options 透传；
 * - registerFileViewerComponents 按 DSL 类型名 FileViewer 注册，注册期绑定 defaultOptions。
 * 底层 @file-viewer/react 以 mock 替身断言 props 透传，不加载真实渲染链。
 */
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const viewerSpy = vi.fn((_props: Record<string, unknown>) => null);

vi.mock('@file-viewer/react', () => ({
  default: (props: Record<string, unknown>) => viewerSpy(props),
}));

import {
  createFileViewerComponent,
  createFileViewerComponentRegistry,
  FileViewer,
} from '../src/index.js';

afterEach(() => {
  cleanup();
  viewerSpy.mockClear();
});

describe('createFileViewerComponent', () => {
  it('url 到达后挂载 viewer，容器带确定高度（viewer 内部 height:100% 依赖它）', () => {
    render(<FileViewer url="/files/a.pdf" />);
    const container = document.querySelector('[data-slot="file-viewer"]') as HTMLElement | null;
    expect(container).not.toBeNull();
    expect(container!.style.height).toBe('480px');
    expect(viewerSpy).toHaveBeenCalledTimes(1);
    expect(viewerSpy.mock.calls[0][0].url).toBe('/files/a.pdf');
  });

  it('无 url 且无 file 时不挂载 viewer', () => {
    render(<FileViewer />);
    expect(viewerSpy).not.toHaveBeenCalled();
  });

  it('选项合并：defaultOptions 覆盖内置默认，options 透传优先级最高', () => {
    const preset = { name: 'preset-office-stub' };
    const Component = createFileViewerComponent({ preset, theme: 'dark' } as never);
    render(
      <Component
        url="/files/a.docx"
        theme="light"
        watermark={{ text: '内部预览' } as never}
        options={{ theme: 'dark', scan: true } as never}
      />,
    );
    const passed = viewerSpy.mock.calls[0][0] as { options: Record<string, unknown> };
    expect(passed.options.preset).toBe(preset);
    expect(passed.options.rendererMode).toBe('replace');
    expect(passed.options.toolbar).toEqual({ position: 'bottom-right' });
    expect(passed.options.watermark).toEqual({ text: '内部预览' });
    // options 透传覆盖具名 props 与 defaultOptions
    expect(passed.options.theme).toBe('dark');
    expect(passed.options.scan).toBe(true);
  });

  it('onEvent 原样透传给底层 viewer', () => {
    const onEvent = vi.fn();
    render(<FileViewer url="/files/a.pdf" onEvent={onEvent} />);
    expect(viewerSpy.mock.calls[0][0].onEvent).toBe(onEvent);
  });

  it('file + name 场景透传 file / name（鉴权 Blob 路径）', () => {
    const blob = new Blob(['x'], { type: 'application/pdf' });
    render(<FileViewer file={blob} name="contract.pdf" />);
    const passed = viewerSpy.mock.calls[0][0];
    expect(passed.file).toBe(blob);
    expect(passed.name).toBe('contract.pdf');
  });
});

describe('registry 注册', () => {
  it('createFileViewerComponentRegistry 注册 DSL 类型名 FileViewer', () => {
    const registry = createFileViewerComponentRegistry();
    expect(registry.get('FileViewer')).toBeTypeOf('function');
  });

  it('registerFileViewerComponents 将注册期 defaultOptions 绑定进组件', () => {
    const preset = { name: 'preset-all-stub' };
    const registry = createFileViewerComponentRegistry({ preset } as never);
    const Component = registry.get('FileViewer') as typeof FileViewer;
    render(<Component url="/files/a.pdf" />);
    const passed = viewerSpy.mock.calls[0][0] as { options: Record<string, unknown> };
    expect(passed.options.preset).toBe(preset);
  });
});
