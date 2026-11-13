import type { TargetProfile } from './types.js';
export type { RewriteNavigationProfile, TargetProfile } from './types.js';
export { innospotsWebShellV1, innospotsWebShellV2, innospotsWebShellV3, } from './innospots-web-shell.js';
/** 未知 profile 错误（信息中列出可用值） */
export declare class ProfileError extends Error {
}
/** 默认 target：支持模块 server entry 的 Shell 契约版本 */
export declare const DEFAULT_TARGET: string;
/** 全部可用 profile id（用于报错提示与文档） */
export declare function listProfiles(): string[];
/** 按 `name@version` 解析 profile；未知名抛出带可用值列表的 ProfileError */
export declare function getProfile(id: string): TargetProfile;
