import { useState } from 'react';

import { Avatar } from '../../components/Avatar/index.js';
import { Button } from '../../components/Button/index.js';
import { Icon } from '../../components/Icon/index.js';
import { Text } from '../../components/Text/index.js';
import { RecordingPerspectiveDialog } from './perspective-dialog.js';
import type { RecordingInsight } from './types.js';

export interface RecordingInsightViewProps {
  insight: RecordingInsight;
  onPerspectiveEdit?: () => void;
  onPerspectiveApply?: (value: string) => void;
  onInsightAction?: (key: string) => void;
}

/**
 * AI 解读（RecordingPage insightTabKey 页签内建内容）：视角横幅（AI 判断 +
 * 修改入口——点击打开内建解读身份弹层，多行输入自然语言身份描述，应用身份
 * 经 onPerspectiveApply 传出文本，取消丢弃；文本缺省非受控、可经
 * perspectiveInput 受控）、基础信息、章节速览与解读（时间戳 + 标题 +
 * 正文）、观点分析（发言人头像 + 加粗观点前缀 + 自动识别标签）、底部
 * 操作条；各段提供才展示。
 */
export function RecordingInsightView({
  insight,
  onPerspectiveEdit,
  onPerspectiveApply,
  onInsightAction,
}: RecordingInsightViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  // 解读身份文本：受控 prop 优先，缺省内部维护
  const inputControlled = insight.perspectiveInput !== undefined;
  const [innerInput, setInnerInput] = useState(insight.defaultPerspectiveInput);
  const committedInput = inputControlled ? insight.perspectiveInput : innerInput;
  // 弹层打开期间的草稿，应用才提交
  const [draftInput, setDraftInput] = useState(committedInput);

  const openDialog = (): void => {
    setDraftInput(committedInput);
    setDialogOpen(true);
  };
  const confirmDialog = (): void => {
    if (!inputControlled) setInnerInput(draftInput);
    onPerspectiveApply?.(draftInput ?? '');
    setDialogOpen(false);
  };

  return (
    <div data-slot="recording-insight" className="flex flex-col gap-6">
      {insight.perspectiveTitle !== undefined ? (
        <section
          data-slot="recording-insight-perspective"
          className="flex flex-col gap-2 rounded-lg bg-success/10 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <Icon name="user" size={16} className="shrink-0 text-muted-foreground" />
              <Text text={insight.perspectiveTitle} strong className="truncate" />
            </div>
            {insight.perspectiveActionLabel !== undefined ? (
              <Button
                text={insight.perspectiveActionLabel}
                variant="link"
                size="small"
                className="text-success"
                onClick={() => {
                  onPerspectiveEdit?.();
                  openDialog();
                }}
              />
            ) : null}
          </div>
          {insight.perspectiveHint !== undefined ? (
            <Text text={insight.perspectiveHint} size="small" type="secondary" />
          ) : null}
        </section>
      ) : null}
      {insight.basics !== undefined ? (
        <section className="flex flex-col gap-3">
          <Text text={insight.basicsTitle ?? '基础信息'} strong size="large" />
          <Text text={insight.basics} />
        </section>
      ) : null}
      {insight.chapters !== undefined && insight.chapters.length > 0 ? (
        <section className="flex flex-col gap-3">
          <Text text={insight.chaptersTitle ?? '章节速览与解读'} strong size="large" />
          {insight.chapters.map((chapter, index) => (
            <div
              key={chapter.time ?? index}
              data-slot="recording-insight-chapter"
              className="flex flex-col gap-2 rounded-lg border border-border p-4"
            >
              <div className="flex items-baseline gap-2">
                {chapter.time !== undefined ? (
                  <Text text={chapter.time} size="small" type="secondary" />
                ) : null}
                <Text text={chapter.title} strong size="small" />
              </div>
              <Text text={chapter.content} size="small" />
            </div>
          ))}
        </section>
      ) : null}
      {insight.viewpoints !== undefined && insight.viewpoints.length > 0 ? (
        <section className="flex flex-col gap-3">
          <Text text={insight.viewpointsTitle ?? '观点分析'} strong size="large" />
          {insight.viewpoints.map((viewpoint, index) => (
            <div
              key={viewpoint.speaker ?? index}
              data-slot="recording-insight-viewpoint"
              className="flex flex-col gap-2 rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar fallback={viewpoint.avatarText ?? viewpoint.speaker.charAt(0)} />
                  <Text text={viewpoint.speaker} strong size="small" />
                </div>
                {viewpoint.tag !== '' ? (
                  <Text text={viewpoint.tag ?? '自动识别'} size="small" type="secondary" />
                ) : null}
              </div>
              <p className="text-sm">
                {viewpoint.label !== undefined ? (
                  <strong>{viewpoint.label}：</strong>
                ) : null}
                {viewpoint.content}
              </p>
            </div>
          ))}
        </section>
      ) : null}
      {insight.actions !== undefined && insight.actions.length > 0 ? (
        <div data-slot="recording-insight-actions" className="flex items-center gap-1">
          {insight.actions.map((action) => (
            <Button
              key={action.key}
              icon={action.icon}
              variant="text"
              size="small"
              onClick={() => onInsightAction?.(action.key)}
            />
          ))}
        </div>
      ) : null}
      <RecordingPerspectiveDialog
        open={dialogOpen}
        title={insight.perspectiveDialogTitle ?? '修改解读身份'}
        hint={insight.perspectiveDialogHint ?? '用自然语言说明你在本次会议中的身份与关注点。'}
        value={draftInput}
        placeholder={insight.perspectivePlaceholder}
        cancelLabel={insight.perspectiveCancelLabel ?? '取消'}
        confirmLabel={insight.perspectiveConfirmLabel ?? '应用身份'}
        onChange={setDraftInput}
        onCancel={() => setDialogOpen(false)}
        onConfirm={confirmDialog}
      />
    </div>
  );
}
