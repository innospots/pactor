import { App } from 'antd';
import { useEffect, type ReactNode } from 'react';

import type { UiBridge } from './actions.js';

export interface InteractionProviderProps {
  /** registerInteractionActions 使用的同一 UiBridge（可变引用） */
  bridge: UiBridge;
  children?: ReactNode;
}

/**
 * InteractionProvider（设计文档第 45 节，决策 D3）：基于 antd `App`
 * 组件捕获 modal / message 实例并注入 UiBridge，供 confirm / message
 * 动作使用（v5+ 静态函数消费不到主题上下文，必须经 React Context
 * 捕获实例）。unmount 时清空引用，动作退化为受控失败。
 */
export function InteractionProvider({
  bridge,
  children,
}: InteractionProviderProps) {
  return (
    <App>
      <UiBridgeInjector bridge={bridge} />
      {children}
    </App>
  );
}

/** 位于 antd App 之内：捕获实例并写入 UiBridge（可变引用） */
function UiBridgeInjector({ bridge }: { bridge: UiBridge }) {
  const { modal, message } = App.useApp();

  useEffect(() => {
    bridge.modal = modal;
    bridge.message = message;
    return () => {
      bridge.modal = undefined;
      bridge.message = undefined;
    };
  }, [bridge, modal, message]);

  return null;
}
