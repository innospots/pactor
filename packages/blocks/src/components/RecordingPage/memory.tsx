import { Button } from '@pactor-app/ui/components';
import { Text } from '@pactor-app/ui/components';
import type { RecordingMemory } from './types.js';

export interface RecordingMemoryViewProps {
  memory: RecordingMemory;
  onMemoryAction?: (key: string) => void;
}

/**
 * 知识记忆（RecordingPage memoryTabKey 页签内建内容）：分组卡片列表
 * （组标题自动拼接条目计数「客观事实 · 4」，条目为标题 + 正文白卡）、
 * 底部操作条（actions 提供才渲染）。
 */
export function RecordingMemoryView({ memory, onMemoryAction }: RecordingMemoryViewProps) {
  return (
    <div data-slot="recording-memory" className="flex flex-col gap-6">
      {(memory.groups ?? []).map((group, groupIndex) => (
        <section key={group.key ?? group.label ?? groupIndex} className="flex flex-col gap-3">
          <Text text={`${group.label} · ${group.items.length}`} strong size="large" />
          {group.items.map((item, index) => (
            <div
              key={index}
              data-slot="recording-memory-item"
              className="flex flex-col gap-2 rounded-lg border border-border p-4"
            >
              <Text text={item.title} strong size="small" />
              <Text text={item.content} size="small" />
            </div>
          ))}
        </section>
      ))}
      {memory.actions !== undefined && memory.actions.length > 0 ? (
        <div data-slot="recording-memory-actions" className="flex items-center gap-1">
          {memory.actions.map((action) => (
            <Button
              key={action.key}
              icon={action.icon}
              variant="text"
              size="small"
              onClick={() => onMemoryAction?.(action.key)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
