// 三层实现 re-export（components / layout / interaction），
// 三层导出符号清单已排查，无重名冲突，可直接 export * 合并。
export * from './components/index.js';
export * from './layout/index.js';
export * from './interaction/index.js';

import { createShadcnComponentRegistry } from './components/index.js';
import {
  ShadcnInteractionProvider,
  ShadcnOverlayHost,
} from './interaction/index.js';
import { createShadcnLayoutRegistry } from './layout/index.js';

/**
 * shadcn UI kit 预设对象：一次性提供 @pactor-app/app `ui` 选项的三个槽位
 * （组件注册表工厂 / 布局注册表工厂 / 交互层组件对），实现整站 shadcn 切换：
 *
 * ```ts
 * import { createPactorApplication } from '@pactor-app/app';
 * import { shadcnUiKit } from '@pactor-app/ui';
 * import '@pactor-app/ui/styles.css';
 *
 * createPactorApplication({
 *   appId: 'risk-admin',
 *   api: { baseURL: '/api/runtime' },
 *   ui: shadcnUiKit,
 * });
 * ```
 *
 * 细粒度选项（componentRegistry / layoutRegistry / interactionKit）优先级
 * 高于预设对应槽位，可逐槽位覆盖。
 */
export const shadcnUiKit = {
  componentRegistry: createShadcnComponentRegistry,
  layoutRegistry: createShadcnLayoutRegistry,
  interactionKit: {
    Provider: ShadcnInteractionProvider,
    OverlayHost: ShadcnOverlayHost,
  },
};
