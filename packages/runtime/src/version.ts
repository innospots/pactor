import { version } from '../package.json';

/**
 * 当前 Runtime 版本（构建时从 package.json 注入）。
 * 用于 Page DSL `requires.runtime` 的版本兼容性校验。
 */
export const RUNTIME_VERSION: string = version;
