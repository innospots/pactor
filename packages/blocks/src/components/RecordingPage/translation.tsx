import { useState } from 'react';

import { Avatar } from '../../components/Avatar/index.js';
import { Button } from '../../components/Button/index.js';
import { Icon } from '../../components/Icon/index.js';
import { Text } from '../../components/Text/index.js';
import { RecordingLanguageDialog } from './language-dialog.js';
import type { RecordingLanguageChange, RecordingTranslation } from './types.js';

export interface RecordingTranslationViewProps {
  translation: RecordingTranslation;
  onLanguageClick?: () => void;
  onLanguageChange?: (change: RecordingLanguageChange) => void;
  onTranslationAction?: (key: string) => void;
}

/**
 * 翻译（RecordingPage translationTabKey 页签内建内容）：顶部语言选择器
 * （自动判断 → 目标语言；点击打开内建语种弹层——左列原文语言识别 /
 * 右列译文语言选择单选，确定提交 onLanguageChange 并关闭，取消丢弃，
 * 语种缺省非受控、可经 sourceLanguage / targetLanguage 受控），双语对照
 * 段落（左列说话人头像 + 姓名 + 原文，右列译文列标题 + 译文，段落间
 * 分隔线）、底部操作条（actions 提供才渲染）。
 */
export function RecordingTranslationView({
  translation,
  onLanguageClick,
  onLanguageChange,
  onTranslationAction,
}: RecordingTranslationViewProps) {
  const sourceLanguages = translation.sourceLanguages ?? [];
  const targetLanguages = translation.targetLanguages ?? [];
  const dialogEnabled = sourceLanguages.length > 0 || targetLanguages.length > 0;

  const [dialogOpen, setDialogOpen] = useState(false);
  // 语种选中：受控 prop 优先，缺省内部维护（同 RecordingPage 过滤 / 页签模式）
  const sourceControlled = translation.sourceLanguage !== undefined;
  const targetControlled = translation.targetLanguage !== undefined;
  const [innerSource, setInnerSource] = useState<string | undefined>(
    translation.defaultSourceLanguage ?? sourceLanguages[0]?.key,
  );
  const [innerTarget, setInnerTarget] = useState<string | undefined>(
    translation.defaultTargetLanguage ?? targetLanguages[0]?.key,
  );
  const committedSource = sourceControlled ? translation.sourceLanguage : innerSource;
  const committedTarget = targetControlled ? translation.targetLanguage : innerTarget;
  // 弹层打开期间的草稿选择，确定才提交
  const [draftSource, setDraftSource] = useState(committedSource);
  const [draftTarget, setDraftTarget] = useState(committedTarget);

  const openDialog = (): void => {
    setDraftSource(committedSource);
    setDraftTarget(committedTarget);
    setDialogOpen(true);
  };
  const confirmDialog = (): void => {
    if (!sourceControlled) setInnerSource(draftSource);
    if (!targetControlled) setInnerTarget(draftTarget);
    onLanguageChange?.({
      source: draftSource,
      sourceLabel: sourceLanguages.find((item) => item.key === draftSource)?.label,
      target: draftTarget,
      targetLabel: targetLanguages.find((item) => item.key === draftTarget)?.label,
    });
    setDialogOpen(false);
  };

  return (
    <div data-slot="recording-translation" className="flex flex-col gap-4">
      {translation.languageLabel !== undefined ? (
        <div>
          <button
            type="button"
            data-slot="recording-translation-language"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm"
            onClick={() => {
              onLanguageClick?.();
              if (dialogEnabled) openDialog();
            }}
          >
            <Icon name="globe" size={14} />
            {translation.languageLabel}
            <Icon name="chevron-down" size={14} className="text-muted-foreground" />
          </button>
        </div>
      ) : null}
      <div className="flex flex-col divide-y divide-border">
        {(translation.segments ?? []).map((segment, index) => (
          <div
            key={index}
            data-slot="recording-translation-segment"
            className="grid gap-4 py-4"
            style={{ gridTemplateColumns: '1fr 1fr' }}
          >
            <div className="flex min-w-0 flex-col gap-3">
              <div className="flex items-center gap-2">
                <Avatar fallback={segment.avatarText ?? segment.speaker?.charAt(0) ?? '?'} />
                <Text text={segment.speaker} strong size="small" />
              </div>
              <Text text={segment.source} />
            </div>
            <div className="flex min-w-0 flex-col gap-3">
              <Text text={translation.targetLabel ?? '译文'} strong size="small" />
              <Text text={segment.target} />
            </div>
          </div>
        ))}
      </div>
      {translation.actions !== undefined && translation.actions.length > 0 ? (
        <div data-slot="recording-translation-actions" className="flex items-center gap-1">
          {translation.actions.map((action) => (
            <Button
              key={action.key}
              icon={action.icon}
              variant="text"
              size="small"
              onClick={() => onTranslationAction?.(action.key)}
            />
          ))}
        </div>
      ) : null}
      {dialogEnabled ? (
        <RecordingLanguageDialog
          open={dialogOpen}
          title={translation.languageDialogTitle ?? '选择翻译语言'}
          sourceTitle={translation.sourceLanguagesTitle ?? '原文语言识别'}
          targetTitle={translation.targetLanguagesTitle ?? '译文语言选择'}
          sourceLanguages={sourceLanguages}
          targetLanguages={targetLanguages}
          source={draftSource}
          target={draftTarget}
          cancelLabel={translation.cancelLabel ?? '取消'}
          confirmLabel={translation.confirmLabel ?? '确定'}
          onSelectSource={setDraftSource}
          onSelectTarget={setDraftTarget}
          onCancel={() => setDialogOpen(false)}
          onConfirm={confirmDialog}
        />
      ) : null}
    </div>
  );
}
