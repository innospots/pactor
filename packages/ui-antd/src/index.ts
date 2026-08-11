// 三层实现 re-export（D1）：公开符号与原 pactor-components /
// pactor-interaction / pactor-layout 完全一致，仅导入路径变化。
// 三层导出符号清单已排查，无重名冲突，可直接 export * 合并。
export * from './components/index.js';
export * from './interaction/index.js';
export * from './layout/index.js';

import { createBuiltinComponentRegistry } from './components/index.js';
import { InteractionProvider, OverlayHost } from './interaction/index.js';
import { createLayoutRegistry } from './layout/index.js';

/**
 * antd UI kit 预设对象（与 pactor-ui-radix 的 radixUiKit 对称）。
 *
 * 用法：`createPactorApplication({ ui: antdUiKit, ... })`。
 * 不传 `ui` 时 pactor-app 的内置默认即 antd 实现，两者行为一致；
 * 预设对象的价值在于显式表达与局部覆盖（`ui: antdUiKit` + 显式
 * 替换某一槽位）。
 *
 * antd v5+ 为 CSS-in-JS，无需导入样式表（如需全局 reset 样式，
 * 业务可自行 `import 'antd/dist/reset.css'`）。
 */
export const antdUiKit = {
  componentRegistry: createBuiltinComponentRegistry,
  layoutRegistry: createLayoutRegistry,
  interactionKit: {
    Provider: InteractionProvider,
    OverlayHost: OverlayHost,
  },
};
