import { cn } from "../../../lib/utils.js";
import { Button } from "../../components/Button/index.js";
import { Icon } from "../../components/Icon/index.js";
import { Table } from "../../components/Table/index.js";
import { Text } from "../../components/Text/index.js";
import type { RecordingSummary } from "./types.js";

export interface RecordingSummaryViewProps {
  summary: RecordingSummary;
  onMindmapAction?: () => void;
  onMaterialClick?: (id: string | number) => void;
  /** 当前选中的待办 id 列表（已解析受控 / 非受控） */
  selectedTodoIds?: (string | number)[];
  /** 待办条目点击（切换选中态） */
  onTodoToggle?: (id: string | number) => void;
  onSummaryAction?: (key: string) => void;
}

// 思维导图节点胶囊：中心深色，两侧浅色白底
function MindmapPill({ label, center }: { label: string; center?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-lg px-4 py-1.5 text-sm",
        center
          ? "bg-primary px-5 py-2.5 font-medium text-primary-foreground"
          : "border border-border bg-background",
      )}
    >
      {label}
    </span>
  );
}

const mindmapLine = (
  <div className="h-px w-10 shrink-0" style={{ background: "var(--border)" }} />
);

/**
 * 详细纪要（RecordingPage summaryTabKey 页签内建内容）：思维导图 /
 * 会议概况 / 主要议题 / 评审结论表 / 后续说明 / 相关材料 / 待办事项
 * （点击切换选中态，选中列表由 RecordingPage 维护）/ 底部操作条，
 * 各段提供才展示。
 */
export function RecordingSummaryView({
  summary,
  onMindmapAction,
  onMaterialClick,
  selectedTodoIds,
  onTodoToggle,
  onSummaryAction,
}: RecordingSummaryViewProps) {
  return (
    <div data-slot="recording-summary" className="flex flex-col gap-6">
      {summary.mindmap ? (
        <section className="rounded-lg border border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Text text={summary.mindmapTitle ?? "思维导图"} strong />
            {summary.mindmapActionLabel !== undefined ? (
              <Button
                text={summary.mindmapActionLabel}
                variant="link"
                size="small"
                className="text-success"
                onClick={() => onMindmapAction?.()}
              />
            ) : null}
          </div>
          <div className="mx-4 mb-4 flex items-center justify-center rounded-lg bg-muted p-8">
            <div className="flex flex-col items-start gap-2">
              {(summary.mindmap.left ?? []).map((node) => (
                <MindmapPill key={node} label={node} />
              ))}
            </div>
            {mindmapLine}
            <MindmapPill label={summary.mindmap.center} center />
            {mindmapLine}
            <div className="flex flex-col items-start gap-2">
              {(summary.mindmap.right ?? []).map((node) => (
                <MindmapPill key={node} label={node} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {summary.overview !== undefined ? (
        <section className="flex flex-col gap-3">
          <Text
            text={summary.overviewTitle ?? "会议概况"}
            strong
            size="large"
          />
          <div className="rounded-lg bg-muted p-4">
            <Text text={summary.overview} />
          </div>
        </section>
      ) : null}
      {summary.topics !== undefined && summary.topics.length > 0 ? (
        <section className="flex flex-col gap-3">
          <Text text={summary.topicsTitle ?? "主要议题"} strong size="large" />
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            {summary.topics.map((topic, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-lg border border-border p-4"
              >
                <Text text={topic.title} strong size="small" />
                <Text text={topic.content} size="small" />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {summary.conclusions !== undefined && summary.conclusions.length > 0 ? (
        <section className="rounded-lg border border-border p-4">
          <Text
            text={summary.conclusionsTitle ?? "评审结论与后续安排"}
            strong
            size="small"
          />
          <Table
            className="mt-3"
            columns={[
              { title: "事项", dataIndex: "item" },
              { title: "会议结论", dataIndex: "conclusion" },
              { title: "负责人", dataIndex: "owner" },
            ]}
            dataSource={summary.conclusions.map((row, index) => ({
              id: index,
              ...row,
            }))}
          />
        </section>
      ) : null}
      {summary.followUp !== undefined ? (
        <section className="flex flex-col gap-2 rounded-lg border border-border p-4">
          <Text text={summary.followUpTitle} strong size="small" />
          <Text text={summary.followUp} size="small" />
        </section>
      ) : null}
      {summary.materials !== undefined && summary.materials.length > 0 ? (
        <section className="flex flex-col gap-3">
          <Text
            text={summary.materialsTitle ?? "相关材料"}
            strong
            size="large"
          />
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {summary.materials.map((material, index) => (
              <button
                key={material.id ?? index}
                type="button"
                data-slot="recording-material"
                className="flex cursor-pointer items-center gap-2 px-4 py-3 text-left"
                onClick={() => onMaterialClick?.(material.id ?? index)}
              >
                <Icon
                  name={material.icon ?? "file-text"}
                  size={16}
                  className="text-muted-foreground"
                />
                <Text
                  text={material.title}
                  size="small"
                  className="min-w-0 flex-1 truncate"
                />
                <Text
                  text={material.meta}
                  size="small"
                  type="secondary"
                  className="shrink-0"
                />
                <Icon
                  name="chevron-right"
                  size={14}
                  className="text-muted-foreground"
                />
              </button>
            ))}
          </div>
        </section>
      ) : null}
      {summary.todos !== undefined && summary.todos.length > 0 ? (
        <section className="flex flex-col gap-3">
          <Text text={summary.todosTitle ?? "待办事项"} strong size="large" />
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {summary.todos.map((todo, index) => {
              const todoId = todo.id ?? index;
              const checked =
                selectedTodoIds !== undefined
                  ? selectedTodoIds.includes(todoId)
                  : todo.done === true;
              return (
                <button
                  key={todoId}
                  type="button"
                  data-slot="recording-todo"
                  aria-pressed={checked}
                  className="flex cursor-pointer items-center gap-2 px-4 py-3 text-left"
                  onClick={() => onTodoToggle?.(todoId)}
                >
                  {checked ? (
                    <Icon
                      name="check-circle"
                      size={16}
                      className="shrink-0 text-success"
                    />
                  ) : (
                    <span
                      className="shrink-0 rounded-full border border-border"
                      style={{ width: 16, height: 16 }}
                    />
                  )}
                  <Text
                    text={todo.title}
                    size="small"
                    className="min-w-0 flex-1 truncate"
                  />
                  <Text
                    text={todo.owner}
                    size="small"
                    type="secondary"
                    className="shrink-0"
                  />
                </button>
              );
            })}
          </div>
        </section>
      ) : null}
      {summary.actions !== undefined && summary.actions.length > 0 ? (
        <div
          data-slot="recording-summary-actions"
          className="flex items-center gap-1"
        >
          {summary.actions.map((action) => (
            <Button
              key={action.key}
              icon={action.icon}
              variant="text"
              size="small"
              onClick={() => onSummaryAction?.(action.key)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
