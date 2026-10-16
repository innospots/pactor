// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Composer, type ChatAttachment } from '../src/index.js';

afterEach(cleanup);

function getTextarea(): HTMLTextAreaElement {
  return document.querySelector('.pactor-chat-composer textarea')!;
}

describe('Composer IME 守卫（spec: chat-composer-extensions / IME 合成守卫）', () => {
  it('合成进行中按 Enter 不发送，compositionend 后正常发送（spec: 中文输入不误发送）', () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);
    const textarea = getTextarea();

    fireEvent.compositionStart(textarea);
    fireEvent.change(textarea, { target: { value: '你好' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onSend).not.toHaveBeenCalled();
    // 合成中 Enter 不清空输入
    expect(textarea.value).toBe('你好');

    fireEvent.compositionEnd(textarea);
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onSend).toHaveBeenCalledWith('你好');
  });

  it('keydown.isComposing 兜底：未收到 composition 事件时也不发送', () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);
    const textarea = getTextarea();

    fireEvent.change(textarea, { target: { value: '你好' } });
    fireEvent.keyDown(textarea, { key: 'Enter', isComposing: true });
    expect(onSend).not.toHaveBeenCalled();

    fireEvent.keyDown(textarea, { key: 'Enter', isComposing: false });
    expect(onSend).toHaveBeenCalledWith('你好');
  });
});

describe('Composer 发送按钮状态机（spec: chat-composer-extensions / 发送按钮状态机）', () => {
  it('空文本禁用 → 输入后可用；streaming 时同一按钮元素切换为停止态', () => {
    const onStop = vi.fn();
    const { rerender } = render(<Composer onSend={() => {}} />);
    const button = screen.getByRole('button', { name: '发送' });
    expect(button).toHaveProperty('disabled', true);

    fireEvent.change(getTextarea(), { target: { value: '内容' } });
    expect(button).toHaveProperty('disabled', false);

    // streaming：同一按钮元素切换为停止态（ui ChatInput 状态机）
    rerender(<Composer onSend={() => {}} streaming onStop={onStop} />);
    const stopButton = screen.getByRole('button', { name: '停止生成' });
    expect(stopButton).toBe(button);
    expect(stopButton).toHaveProperty('disabled', false);
    fireEvent.click(stopButton);
    expect(onStop).toHaveBeenCalled();
  });
});

describe('Composer 附件引用卡片（spec: chat-composer-extensions / 附件引用卡片）', () => {
  const image: ChatAttachment = {
    id: 'att-1',
    name: 'photo.png',
    mimeType: 'image/png',
    size: 2048,
    url: 'data:image/png;base64,xxx',
  };
  const pdf: ChatAttachment = {
    id: 'att-2',
    name: 'report.pdf',
    mimeType: 'application/pdf',
    size: 1536,
  };

  it('附件卡片：图标 + 名称 + 大小（ui Attachment 呈现，spec: 渲染附件卡片）', () => {
    render(<Composer attachments={[image, pdf]} onAttachmentsChange={() => {}} />);

    expect(screen.getByText('photo.png')).toBeTruthy();
    expect(screen.getByText('2.0 KB')).toBeTruthy();
    expect(screen.getByText('report.pdf')).toBeTruthy();
    expect(screen.getByText('1.5 KB')).toBeTruthy();
  });

  it('未传 attachments 时不渲染附件区', () => {
    render(<Composer />);
    expect(document.querySelector('[data-slot=attachment]')).toBeNull();
  });

  it('移除按钮：onAttachmentsChange 以移除后的数组被调用（spec: 移除附件）', () => {
    const onAttachmentsChange = vi.fn();
    render(
      <Composer attachments={[image, pdf]} onAttachmentsChange={onAttachmentsChange} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '移除 report.pdf' }));
    expect(onAttachmentsChange).toHaveBeenCalledWith([image]);
  });

  it('点击附件卡片：onAttachmentClick 以该附件被调用', () => {
    const onAttachmentClick = vi.fn();
    render(
      <Composer
        attachments={[pdf]}
        onAttachmentsChange={() => {}}
        onAttachmentClick={onAttachmentClick}
      />,
    );
    fireEvent.click(screen.getByText('report.pdf'));
    expect(onAttachmentClick).toHaveBeenCalledWith(pdf);
  });

  it('粘贴文件交给调用方，包内不上传（spec: 粘贴文件交给调用方）', () => {
    const onAttachFiles = vi.fn();
    render(<Composer onAttachFiles={onAttachFiles} />);
    const file = new File(['data'], 'paste.png', { type: 'image/png' });

    fireEvent.paste(getTextarea(), {
      clipboardData: { files: [file] },
    });
    expect(onAttachFiles).toHaveBeenCalledWith([file]);
  });

  it('未传 onAttachFiles 时粘贴文件不报错', () => {
    render(<Composer />);
    const file = new File(['data'], 'paste.png', { type: 'image/png' });
    expect(() =>
      fireEvent.paste(getTextarea(), { clipboardData: { files: [file] } }),
    ).not.toThrow();
  });

  it('文件选择入口：隐藏 file input 产出 File[] 经 onAttachFiles 回调', () => {
    const onAttachFiles = vi.fn();
    render(<Composer onAttachFiles={onAttachFiles} />);
    const file = new File(['data'], 'pick.png', { type: 'image/png' });

    const fileInput = document.querySelector(
      '.pactor-chat-composer input[type="file"]',
    ) as HTMLInputElement;
    expect(fileInput).toBeTruthy();
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(onAttachFiles).toHaveBeenCalledWith([file]);
  });

  it('拖拽悬停态：dragover 加视觉高亮（ui Composer ring），dragleave 移除', () => {
    render(<Composer onAttachFiles={() => {}} />);
    const composer = document.querySelector('[data-slot=composer]')!;

    fireEvent.dragOver(composer);
    expect(
      composer.querySelector('.ring-2'),
    ).toBeTruthy();
    fireEvent.dragLeave(composer);
    expect(composer.querySelector('.ring-2')).toBeNull();
  });

  it('drop 产出 File[] 经 onAttachFiles 回调', () => {
    const onAttachFiles = vi.fn();
    render(<Composer onAttachFiles={onAttachFiles} />);
    const file = new File(['data'], 'drop.png', { type: 'image/png' });

    fireEvent.drop(document.querySelector('[data-slot=composer]')!, {
      dataTransfer: { files: [file] },
    });
    expect(onAttachFiles).toHaveBeenCalledWith([file]);
  });
});

describe('Composer 工具栏与提及扩展槽（spec: chat-composer-extensions / 工具栏与提及扩展槽）', () => {
  it('注入工具栏控件：toolbarStart / toolbarEnd 渲染在工具栏区（spec: 注入工具栏控件）', () => {
    render(
      <Composer
        toolbarStart={<span data-testid="start-chip">起始槽</span>}
        toolbarEnd={<span data-testid="end-chip">末尾槽</span>}
      />,
    );
    const toolbar = document.querySelector('[data-slot=chat-input] .flex.items-center')!;
    expect(toolbar).toBeTruthy();
    expect(toolbar.contains(screen.getByTestId('start-chip'))).toBe(true);
    expect(toolbar.contains(screen.getByTestId('end-chip'))).toBe(true);
  });

  it('未提供 onPlusMenu 不渲染 "+" 按钮；提供后点击回调带锚点位置（spec: 未提供回调则无入口）', () => {
    const { rerender } = render(<Composer />);
    expect(screen.queryByRole('button', { name: '添加上下文' })).toBeNull();

    const onPlusMenu = vi.fn();
    rerender(<Composer onPlusMenu={onPlusMenu} />);
    fireEvent.click(screen.getByRole('button', { name: '添加上下文' }));
    expect(onPlusMenu).toHaveBeenCalledTimes(1);
    const rect = onPlusMenu.mock.calls[0]![0] as DOMRect;
    expect(typeof rect.top).toBe('number');
    expect(typeof rect.left).toBe('number');
  });

  it('词边界 @ 触发 onMentionTrigger，携带 query 与锚点位置（spec: 提及触发）', () => {
    const onMentionTrigger = vi.fn();
    render(<Composer onMentionTrigger={onMentionTrigger} />);
    const textarea = getTextarea();

    fireEvent.change(textarea, { target: { value: '@abc' } });
    expect(onMentionTrigger).toHaveBeenCalled();
    const calls = onMentionTrigger.mock.calls as [string, DOMRect][];
    const [query, rect] = calls[calls.length - 1]!;
    expect(query).toBe('abc');
    expect(typeof rect.top).toBe('number');
  });

  it('@ 前需为词边界：紧跟字符的 @ 不触发', () => {
    const onMentionTrigger = vi.fn();
    render(<Composer onMentionTrigger={onMentionTrigger} />);
    const textarea = getTextarea();

    fireEvent.change(textarea, { target: { value: '邮箱 a@b' } });
    expect(onMentionTrigger).not.toHaveBeenCalled();

    fireEvent.change(textarea, { target: { value: '联系 @张' } });
    expect(onMentionTrigger).toHaveBeenCalled();
    const calls = onMentionTrigger.mock.calls as [string, DOMRect][];
    expect(calls[calls.length - 1]![0]).toBe('张');
  });
});
