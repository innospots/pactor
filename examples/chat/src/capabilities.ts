import { Registry } from 'pactor-core';
import type { CapabilityHandler, ChatCapabilityRegistry } from 'pactor-chat';

import { showMessage } from './ui-bridge';

/**
 * capability 白名单（examples/chat）：AI DSL 触发业务能力的唯一通道。
 * 执行链：CapabilityRegistry → Permission → Confirmation → Execute。
 */
export function createChatCapabilities(): ChatCapabilityRegistry {
  const registry = new Registry<CapabilityHandler>('ChatCapabilities');

  // 低风险：直接执行
  registry.register('weather.query', {
    execute(params) {
      const city = typeof params['city'] === 'string' ? params['city'] : '杭州';
      return { city, temperature: 26, condition: '多云转晴', humidity: '62%' };
    },
  });

  // 高风险：risk 'high'，需经 ChatView 注入的 confirm 确认后才执行
  registry.register('data.export', {
    risk: 'high',
    execute(params) {
      const result = {
        format: params['format'] ?? 'csv',
        file: `customers-${Date.now()}.${params['format'] ?? 'csv'}`,
        rows: 342,
      };
      // 执行结果反馈（capability 返回值作为动作 data，界面反馈由业务自行处理）
      showMessage('success', `已导出 ${result.rows} 行：${result.file}`);
      return result;
    },
  });

  return registry;
}
