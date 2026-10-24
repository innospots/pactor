import { describe, expect, it } from 'vitest';

import {
  DEFAULT_TARGET,
  getProfile,
  innospotsWebShellV1,
  innospotsWebShellV2,
  innospotsWebShellV3,
  listProfiles,
  ProfileError,
} from './profiles/index.js';

describe('target profile 注册表', () => {
  it('默认 target 为 innospots-web-shell@3', () => {
    expect(DEFAULT_TARGET).toBe('innospots-web-shell@3');
    expect(listProfiles()).toContain('innospots-web-shell@1');
    expect(listProfiles()).toContain('innospots-web-shell@2');
    expect(listProfiles()).toContain('innospots-web-shell@3');
  });

  it('@1 强制内联页面（去 lazy），@2/@3 保留 lazy', () => {
    expect(getProfile('innospots-web-shell@1').forceInlinePages).toBe(true);
    expect(getProfile('innospots-web-shell@2').forceInlinePages).toBe(false);
    expect(getProfile('innospots-web-shell@3').forceInlinePages).toBe(false);
  });

  it('只有 @3 支持模块 server entry', () => {
    expect(getProfile('innospots-web-shell@1').moduleServerApi).toBe(false);
    expect(getProfile('innospots-web-shell@2').moduleServerApi).toBe(false);
    expect(getProfile('innospots-web-shell@3').moduleServerApi).toBe(true);
  });

  it('三个版本共有行为：布局内联 / 菜单去 path / 导航与资源重写 / 禁止根 basePath', () => {
    for (const profile of [innospotsWebShellV1, innospotsWebShellV2, innospotsWebShellV3]) {
      expect(profile.inlineStringLayouts).toBe(true);
      expect(profile.stripMenuPaths).toBe(true);
      expect(profile.rewriteNavigation).toEqual({ basePath: true, excludeApiUrls: true });
      expect(profile.rewriteAssetUrls('risk', '0.1.0')).toBe('/modules/risk/0.1.0/');
      expect(profile.forbidRootBasePath).toBe(true);
    }
  });

  it('未知 profile 报错并列出可用值', () => {
    expect(() => getProfile('unknown-shell@9')).toThrowError(ProfileError);
    try {
      getProfile('unknown-shell@9');
      expect.unreachable();
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toContain('unknown-shell@9');
      expect(message).toContain('innospots-web-shell@1');
      expect(message).toContain('innospots-web-shell@2');
      expect(message).toContain('innospots-web-shell@3');
    }
  });
});
