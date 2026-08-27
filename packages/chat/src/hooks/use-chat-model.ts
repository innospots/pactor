import { useState } from 'react';

import type { ChatModelOption } from '../model.js';

/**
 * useChatModel（spec: chat-model-selector，决策 D5/D2）：模型选中态解析。
 *
 * 受控规则（决策 D5）：`model` + `onModelChange` 同时提供即受控
 * （以 props 为准）；仅提供 `models` 时自持选中态（缺省 models[0]）；
 * 未配置 models 时 `currentModel` 为 undefined。
 *
 * ChatView 单独使用时在内部调用本 hook 自持状态；ChatComposition 层
 * 调用后将解析结果同时下发 WorkspaceHeader（header 位，决策 D2）与
 * ChatView（composer 位 + ChatInput.model），两个位置共享同一状态。
 */
export interface UseChatModelOptions {
  models?: ChatModelOption[];
  model?: string;
  onModelChange?: (value: string) => void;
}

export interface UseChatModelResult {
  /** models 非空（chip 渲染与 ChatInput.model 的前提） */
  modelsEnabled: boolean;
  /** 解析后的当前模型 value（受控以 props 为准，非受控缺省 models[0]） */
  currentModel: string | undefined;
  /** 选中变更：非受控自持 + 并行 onModelChange 通知 */
  handleModelChange: (value: string) => void;
}

export function useChatModel({
  models,
  model,
  onModelChange,
}: UseChatModelOptions): UseChatModelResult {
  const modelsEnabled = models !== undefined && models.length > 0;
  const modelControlled = model !== undefined && onModelChange !== undefined;
  const [innerModel, setInnerModel] = useState<string | undefined>(
    () => models?.[0]?.value,
  );
  const currentModel = modelsEnabled
    ? (modelControlled ? model : (innerModel ?? models[0]!.value))
    : undefined;

  const handleModelChange = (value: string): void => {
    if (!modelControlled) {
      setInnerModel(value);
    }
    onModelChange?.(value);
  };

  return { modelsEnabled, currentModel, handleModelChange };
}
