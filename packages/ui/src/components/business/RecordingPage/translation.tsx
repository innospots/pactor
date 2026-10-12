import { Avatar } from '../../components/Avatar/index.js';
import { Button } from '../../components/Button/index.js';
import { Icon } from '../../components/Icon/index.js';
import { Text } from '../../components/Text/index.js';
import type { RecordingTranslation } from './types.js';

export interface RecordingTranslationViewProps {
  translation: RecordingTranslation;
  onLanguageClick?: () => void;
  onTranslationAction?: (key: string) => void;
}

/**
 * 翻译（RecordingPage translationTabKey 页签内建内容）：顶部语言选择器
 * （自动判断 → 目标语言，点击经 onLanguageClick 传出），双语对照段落
 * （左列说话人头像 + 姓名 + 原文，右列译文列标题 + 译文，段落间分隔线）、
 * 底部操作条（actions 提供才渲染）。
 */
export function RecordingTranslationView({
  translation,
  onLanguageClick,
  onTranslationAction,
}: RecordingTranslationViewProps) {
  return (
    <div data-slot="recording-translation" className="flex flex-col gap-4">
      {translation.languageLabel !== undefined ? (
        <div>
          <button
            type="button"
            data-slot="recording-translation-language"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-sm"
            onClick={() => onLanguageClick?.()}
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
    </div>
  );
}
