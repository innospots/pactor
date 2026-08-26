import { describe, expect, it, vi } from 'vitest';

import type { ChatArtifact } from '../src/index.js';
import { ArtifactStore } from '../src/index.js';

const MARKDOWN_ARTIFACT: ChatArtifact = {
  id: 'a1',
  kind: 'markdown',
  title: '分析报告',
  content: '# 标题',
};

describe('ArtifactStore（spec: chat-artifact-panel / 产出物模型与 ArtifactStore）', () => {
  it('store 开合与订阅：open 通知且 get 返回，close 后 get 为 null 并再次通知（spec scenario）', () => {
    const store = new ArtifactStore();
    const listener = vi.fn();
    const off = store.subscribe(listener);

    expect(store.get()).toBeNull();

    store.open(MARKDOWN_ARTIFACT);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.get()).toEqual(MARKDOWN_ARTIFACT);

    store.close();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(store.get()).toBeNull();

    off();
    store.open(MARKDOWN_ARTIFACT);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('部分更新：update(patch) 只改指定字段，其余不变（spec scenario）', () => {
    const store = new ArtifactStore();
    store.open(MARKDOWN_ARTIFACT);

    store.update({ title: '新标题' });
    const artifact = store.get()!;
    expect(artifact.title).toBe('新标题');
    expect(artifact.id).toBe('a1');
    expect(artifact.kind).toBe('markdown');
    expect(artifact.content).toBe('# 标题');
    // 不可变：新对象引用
    expect(artifact).not.toBe(MARKDOWN_ARTIFACT);
  });

  it('update 在未 open 时告警并忽略；close 幂等不重复通知', () => {
    const store = new ArtifactStore();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    store.update({ title: 'x' });
    expect(warn).toHaveBeenCalled();
    expect(store.get()).toBeNull();

    const listener = vi.fn();
    store.subscribe(listener);
    store.close();
    expect(listener).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('dsl kind 的 content 为 DslNode 普通对象（编译期锁定类型）', () => {
    const dslArtifact: ChatArtifact = {
      id: 'a2',
      kind: 'dsl',
      title: '页面片段',
      content: { type: 'Card', props: { title: '卡片' } },
      meta: { source: 'llm' },
    };
    const store = new ArtifactStore();
    store.open(dslArtifact);
    expect(store.get()?.kind).toBe('dsl');
    expect(store.get()?.content).toEqual({
      type: 'Card',
      props: { title: '卡片' },
    });
  });
});
