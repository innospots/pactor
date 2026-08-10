import type { ExpressionScope } from 'pactor-expression';

import type { RuntimeContext } from './context.js';

/**
 * 组装表达式求值作用域（设计文档第 15、16 节，决策 D2）：
 *
 * - `state` / `data` 取 Store 当前值快照
 * - `form` 为 state 的 `form` 路径别名（Form 提交写入 `state.form`，
 *   使 `${form.<field>}` 可用，设计文档第 15 节 form 作用域层级）
 * - 另含 `app` / `page` / `route` / `user` / `params`（route.params 的别名）
 * - 局部作用域（`row` / `rowIndex` / `event` / `item` 等）覆盖同名全局键
 */
export function buildScope(
  context: RuntimeContext,
  local?: ExpressionScope,
): ExpressionScope {
  return {
    app: context.app,
    page: context.page,
    state: context.state.getState(),
    form: context.state.get('form'),
    data: context.data.getAllData(),
    route: context.route,
    user: context.user,
    params: context.route.params,
    ...local,
  };
}
