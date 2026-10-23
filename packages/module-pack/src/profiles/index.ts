import { innospotsWebShellV1, innospotsWebShellV2 } from './innospots-web-shell.js';
import type { TargetProfile } from './types.js';

export type { RewriteNavigationProfile, TargetProfile } from './types.js';
export { innospotsWebShellV1, innospotsWebShellV2 } from './innospots-web-shell.js';

/** 未知 profile 错误（信息中列出可用值） */
export class ProfileError extends Error {}

const registry = new Map<string, TargetProfile>([
  [`${innospotsWebShellV1.name}@${innospotsWebShellV1.version}`, innospotsWebShellV1],
  [`${innospotsWebShellV2.name}@${innospotsWebShellV2.version}`, innospotsWebShellV2],
]);

/** 默认 target：Shell lazy 端点已修复的契约版本 */
export const DEFAULT_TARGET = `${innospotsWebShellV2.name}@${innospotsWebShellV2.version}`;

/** 全部可用 profile id（用于报错提示与文档） */
export function listProfiles(): string[] {
  return [...registry.keys()];
}

/** 按 `name@version` 解析 profile；未知名抛出带可用值列表的 ProfileError */
export function getProfile(id: string): TargetProfile {
  const profile = registry.get(id);
  if (!profile) {
    throw new ProfileError(`未知 target profile: ${id}（可用: ${listProfiles().join(', ')}）`);
  }
  return profile;
}
