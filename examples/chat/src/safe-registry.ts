import type { Registry } from '@pactor-app/core';
import { createSafeRegistry } from '@pactor-app/chat';
import { createComponentRegistry } from '@pactor-app/ui/components';

/**
 * Safe Registry（examples/chat）：LLM 下发的 DSL 只允许渲染白名单内的组件。
 * 白名单来自 @pactor-app/ui 内置组件；白名单外类型（如 Table、Form）会被
 * guardChatDsl 替换为 ChatDenied 受控占位。
 */
export function createChatSafeRegistry(): Registry<unknown> {
  return createSafeRegistry(createComponentRegistry(), [
    'Flex',
    'Card',
    'Statistic',
    'Alert',
    'Button',
  ]);
}
