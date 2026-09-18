import { describe, expect, it, vi } from 'vitest';

import type { ChatArtifact } from '../src/index.js';
import { ArtifactStore, collectArtifacts, isImageArtifact, mergeArtifacts, resolveArtifactFileType } from '../src/index.js';

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

describe('ArtifactStore 多产物列表（tabs / 目录列表视图数据源）', () => {
  const SECOND: ChatArtifact = {
    id: 'a2',
    kind: 'code',
    title: '脚本',
    content: 'echo hi',
    language: 'bash',
  };

  it('open 按 id upsert：新 id 追加进列表，同 id 替换且位置不变', () => {
    const store = new ArtifactStore();
    store.open(MARKDOWN_ARTIFACT);
    store.open(SECOND);
    expect(store.list().map((a) => a.id)).toEqual(['a1', 'a2']);

    const updated = { ...MARKDOWN_ARTIFACT, title: '分析报告 v2' };
    store.open(updated);
    expect(store.list().map((a) => a.id)).toEqual(['a1', 'a2']);
    expect(store.list()[0]!.title).toBe('分析报告 v2');
    // open 同时激活
    expect(store.get()?.id).toBe('a1');
  });

  it('list 返回的数组引用在不变时保持稳定（useSyncExternalStore 快照安全）', () => {
    const store = new ArtifactStore();
    const before = store.list();
    store.open(MARKDOWN_ARTIFACT);
    const after = store.list();
    expect(after).not.toBe(before);
    expect(store.list()).toBe(after);
  });

  it('activate 切换激活项；未知 id 告警并忽略；重复激活不通知', () => {
    const store = new ArtifactStore();
    store.open(MARKDOWN_ARTIFACT);
    store.open(SECOND);
    const listener = vi.fn();
    store.subscribe(listener);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    store.activate('a1');
    expect(store.get()?.id).toBe('a1');
    expect(listener).toHaveBeenCalledTimes(1);

    store.activate('a1');
    expect(listener).toHaveBeenCalledTimes(1);

    store.activate('nope');
    expect(store.get()?.id).toBe('a1');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('close 只清空激活项：面板关闭，列表保留供重开切换', () => {
    const store = new ArtifactStore();
    store.open(MARKDOWN_ARTIFACT);
    store.open(SECOND);
    store.close();
    expect(store.get()).toBeNull();
    expect(store.list().map((a) => a.id)).toEqual(['a1', 'a2']);
    // 重开历史产物
    store.activate('a1');
    expect(store.get()?.id).toBe('a1');
  });

  it('update 只补丁激活项，列表中其余产物不变', () => {
    const store = new ArtifactStore();
    store.open(MARKDOWN_ARTIFACT);
    store.open(SECOND);
    store.update({ title: '脚本 v2' });
    expect(store.list()[0]).toEqual(MARKDOWN_ARTIFACT);
    expect(store.list()[1]!.title).toBe('脚本 v2');
  });
});

describe('collectArtifacts / mergeArtifacts（tabs 数据源归集）', () => {
  const SECOND: ChatArtifact = {
    id: 'a2',
    kind: 'code',
    title: '脚本',
    content: 'echo hi',
  };

  it('collectArtifacts：按消息序归集 ready artifact part，同 id 取最新，streaming 跳过', () => {
    const messages = [
      {
        parts: [
          { type: 'artifact', artifact: MARKDOWN_ARTIFACT, status: 'ready' },
          {
            type: 'artifact',
            artifact: { ...SECOND, title: '脚本 v1' },
            status: 'streaming',
          },
        ],
      },
      {
        parts: [
          { type: 'text', content: '正文' },
          { type: 'artifact', artifact: SECOND, status: 'ready' },
          {
            type: 'artifact',
            artifact: { ...MARKDOWN_ARTIFACT, title: '分析报告 v2' },
            status: 'ready',
          },
        ],
      },
    ];
    const result = collectArtifacts(messages);
    // 首次出现序；a1 取最新版本；streaming 的 v1 被 ready 覆盖
    expect(result.map((a) => a.id)).toEqual(['a1', 'a2']);
    expect(result[0]!.title).toBe('分析报告 v2');
    expect(result[1]!.title).toBe('脚本');
  });

  it('mergeArtifacts：stream 顺序为主，冲突取 store 版本，store 独有追加', () => {
    const stream = [MARKDOWN_ARTIFACT];
    const opened = [
      { ...MARKDOWN_ARTIFACT, title: '分析报告 补丁版' },
      SECOND,
    ];
    const merged = mergeArtifacts(stream, opened);
    expect(merged.map((a) => a.id)).toEqual(['a1', 'a2']);
    expect(merged[0]!.title).toBe('分析报告 补丁版');
  });
});

describe('resolveArtifactFileType / isImageArtifact（常见文件预览）', () => {
  it('显式 fileType 优先：大小写与带点均归一化', () => {
    expect(
      resolveArtifactFileType({ ...MARKDOWN_ARTIFACT, fileType: '.PNG' }),
    ).toBe('png');
    expect(
      resolveArtifactFileType({ ...MARKDOWN_ARTIFACT, fileType: 'Md' }),
    ).toBe('md');
  });

  it('缺省从 title 扩展名推导；无扩展名返回 null', () => {
    expect(
      resolveArtifactFileType({ ...MARKDOWN_ARTIFACT, title: '图表.JPG' }),
    ).toBe('jpg');
    expect(
      resolveArtifactFileType({ ...MARKDOWN_ARTIFACT, title: '无扩展名' }),
    ).toBeNull();
  });

  it('isImageArtifact：常见图片扩展名命中，其余不命中', () => {
    for (const ext of ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp']) {
      expect(
        isImageArtifact({ ...MARKDOWN_ARTIFACT, title: `图.${ext}` }),
      ).toBe(true);
    }
    expect(isImageArtifact({ ...MARKDOWN_ARTIFACT, title: '文档.md' })).toBe(
      false,
    );
    expect(isImageArtifact(MARKDOWN_ARTIFACT)).toBe(false);
  });
});
