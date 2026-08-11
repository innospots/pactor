// 三层实现 re-export（D1）：公开符号与原 pactor-components-radix /
// pactor-interaction-radix / pactor-layout-radix 完全一致，仅导入路径变化。
// 三层导出符号清单已排查，无重名冲突，可直接 export * 合并。
export * from './components/index.js';
export * from './interaction/index.js';
export * from './layout/index.js';

import { createRadixComponentRegistry } from './components/index.js';
import {
  RadixInteractionProvider,
  RadixOverlayHost,
} from './interaction/index.js';
import { createRadixLayoutRegistry } from './layout/index.js';

/**
 * Radix UI kit 预设对象：一次性提供 pactor-app `ui` 选项的三个槽位
 * （组件注册表工厂 / 布局注册表工厂 / 交互层组件对），实现整站 Radix 切换：
 *
 * ```ts
 * import { createPactorApplication } from 'pactor-app';
 * import { radixUiKit } from 'pactor-ui-radix';
 * import 'pactor-ui-radix/styles.css';
 *
 * createPactorApplication({
 *   appId: 'risk-admin',
 *   api: { baseURL: '/api/runtime' },
 *   ui: radixUiKit,
 * });
 * ```
 *
 * 细粒度选项（componentRegistry / layoutRegistry / interactionKit）优先级
 * 高于预设对应槽位，可逐槽位覆盖。
 */
export const radixUiKit = {
  componentRegistry: createRadixComponentRegistry,
  layoutRegistry: createRadixLayoutRegistry,
  interactionKit: {
    Provider: RadixInteractionProvider,
    OverlayHost: RadixOverlayHost,
  },
};
