import type { DslNode } from '@pactor-app/core';

/**
 * 产出物模型与 ArtifactStore（spec: chat-artifact-panel，设计决策 D1）。
 *
 * 零 React，可纯 Node 测试；状态语义与 ConversationStore 同模式
 * （不可变更新 + subscribe 通知，兼容 useSyncExternalStore）。
 * store 只持当前一个产出物：多产出物 / 历史由业务层自行管理后注入。
 */

/** 产出物：dsl kind 的 content 为 DslNode 普通对象，其余 kind 为字符串 */
export interface ChatArtifact {
  id: string;
  kind: 'markdown' | 'code' | 'text' | 'dsl';
  title: string;
  content: string | DslNode;
  /** code kind 的语言标记（仅作角标展示） */
  language?: string;
  meta?: Record<string, unknown>;
}

/** update 的补丁：id 不可改 */
export type ArtifactPatch = Partial<Omit<ChatArtifact, 'id'>>;

/**
 * ArtifactStore（设计决策 D1）：当前产出物的可变容器。
 * 可注入（services.artifactStore）或由组合层自持（ref 保持）。
 * 对未 open 状态下的 update 宽容：console.warn 并忽略，不抛错。
 */
export class ArtifactStore {
  private artifact: ChatArtifact | null = null;
  private readonly listeners = new Set<() => void>();

  /** 当前产出物（未打开时为 null；引用在不变时保持稳定） */
  get(): ChatArtifact | null {
    return this.artifact;
  }

  /** 打开（或替换）当前产出物 */
  open(artifact: ChatArtifact): void {
    this.artifact = artifact;
    this.notify();
  }

  /** 部分更新当前产出物（id 不可改）；未 open 时告警并忽略 */
  update(patch: ArtifactPatch): void {
    if (!this.artifact) {
      console.warn('[@pactor-app/chat] artifact not open, update ignored');
      return;
    }
    this.artifact = { ...this.artifact, ...patch, id: this.artifact.id };
    this.notify();
  }

  /** 关闭面板（未打开时幂等，不重复通知） */
  close(): void {
    if (this.artifact === null) {
      return;
    }
    this.artifact = null;
    this.notify();
  }

  /** 订阅变更；返回退订函数 */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
