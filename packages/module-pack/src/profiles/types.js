/**
 * Target profile：底座（Shell）装配契约的显式化描述。
 *
 * 若干打包转换本质上是当前 Shell 实现的缺陷规避（菜单去 path、布局内联、
 * 去 lazy、basePath 禁止 "/")，而非永恒契约；Shell 修复后应发布新版本
 * profile，模块侧改一行 `target` 即可重新打包，不改动适配器代码。
 */
export {};
