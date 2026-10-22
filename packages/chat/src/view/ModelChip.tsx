import { Icon } from '@pactor-app/ui/components';
import { useI18n } from '@pactor-app/runtime';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import type { ChatModelOption } from '../model.js';
import { AnchoredPopover } from './AnchoredPopover.js';
import { setChatChromeHandlers } from './chrome/actions.js';
import { ChromeSlot } from './chrome/ChromeSlot.js';
import { buildModelSelectFragment } from './chrome/model-select.js';

/**
 * ModelChip（spec: chat-model-selector，决策 D2）：内建模型选择 chip。
 * 自含弹层锚点状态，供 Composer 工具栏（composer 位）与 WorkspaceHeader
 * （header 位）共用；选中语义（受控/非受控解析）由调用方经
 * useChatModel 解析后传入，本组件纯展示 + 选中回调。
 */
export interface ModelChipProps {
  /** 候选模型列表（非空才应渲染本组件，由调用方保证） */
  models: ChatModelOption[];
  /** 当前选中模型 value（未命中时展示 models[0]） */
  model?: string;
  /** 弹层中选中模型时触发 */
  onModelChange?: (value: string) => void;
}

export function ModelChip({
  models,
  model,
  onModelChange,
}: ModelChipProps): ReactNode {
  const { t } = useI18n();
  const chipRef = useRef<HTMLButtonElement>(null);
  // 弹层锚点：缺省 null 即关闭
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const currentOption = models.find((option) => option.value === model) ?? models[0]!;

  return (
    <>
      <button
        ref={chipRef}
        type="button"
        className="pactor-chat-model-chip"
        title={t('pactor.chat.composer.selectModel')}
        aria-label={t('pactor.chat.composer.selectModel')}
        onClick={() => setAnchor(chipRef.current!.getBoundingClientRect())}
      >
        <span className="pactor-chat-model-chip__label">
          {currentOption.label}
        </span>
        <Icon name="chevrons-up-down" size={12} />
      </button>
      {anchor && (
        <AnchoredPopover
          anchorRect={anchor}
          onClose={() => setAnchor(null)}
          role="listbox"
        >
          {models.map((option) => (
            <button
              key={option.value}
              type="button"
              className="pactor-chat-popover__item"
              role="option"
              aria-selected={option.value === currentOption.value}
              onClick={() => {
                onModelChange?.(option.value);
                setAnchor(null);
              }}
            >
              <span className="pactor-chat-popover__item-label">
                {option.label}
              </span>
              {option.value === currentOption.value && (
                <Icon name="check" size={13} className="pactor-chat-popover__item-check" />
              )}
            </button>
          ))}
        </AnchoredPopover>
      )}
    </>
  );
}

/**
 * ModelSelect（spec: chat-on-ui-components / chat-model-selector）：
 * 模型选择的统一入口——DSL 环境优先经宿主 Select 组件承载
 * （chat.modelChange 接回同一 onModelChange），无 renderer / 类型
 * 缺失时回退 ModelChip（chip + 锚定弹层原视觉）。
 */
export function ModelSelect({
  models,
  model,
  onModelChange,
}: ModelChipProps): ReactNode {
  const changeRef = useRef(onModelChange);
  changeRef.current = onModelChange;
  useEffect(() => {
    setChatChromeHandlers({
      modelChange: (value) => changeRef.current?.(value),
    });
  }, []);

  return (
    <ChromeSlot
      fragment={buildModelSelectFragment({ models, model })}
      fallback={
        <ModelChip models={models} model={model} onModelChange={onModelChange} />
      }
    />
  );
}
