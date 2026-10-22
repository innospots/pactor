import { describe, expect, it } from 'vitest';

import { I18nError } from './errors.js';
import type { MessageProvider } from './message-provider.js';
import { YamlMessageProvider, type MessageManifest } from './yaml-message-provider.js';

const manifest: MessageManifest = {
  appId: 'console',
  release: 'rel-20261022-01',
  locales: {
    'zh-CN': {
      common: { path: 'locales/zh-CN/common.yaml', version: '12' },
      user: { path: 'locales/zh-CN/user.yaml', version: '7' },
    },
    'en-US': {
      common: { path: 'locales/en-US/common.yaml', version: '12' },
      user: { path: 'locales/en-US/user.yaml', version: '7' },
    },
  },
};

function createProvider(
  files: Record<string, string>,
  options?: { manifest?: unknown; maxFileBytes?: number; maxAliasCount?: number },
): YamlMessageProvider {
  const readFile = async (path: string): Promise<string> => {
    const content = files[path];
    if (content === undefined) {
      throw new Error(`ENOENT: ${path}`);
    }
    return content;
  };
  return new YamlMessageProvider({
    manifest: options?.manifest ?? manifest,
    readFile,
    maxFileBytes: options?.maxFileBytes,
    maxAliasCount: options?.maxAliasCount,
  });
}

const validFiles: Record<string, string> = {
  'locales/zh-CN/common.yaml': 'common.save: 保存\ncommon.cancel: 取消\n',
  'locales/zh-CN/user.yaml': 'user.page.title: 用户管理\nuser.selectedCount: "已选择 {{count}} 项"\n',
  'locales/en-US/common.yaml': 'common.save: Save\ncommon.cancel: Cancel\n',
  'locales/en-US/user.yaml': 'user.page.title: Users\nuser.selectedCount: "Selected: {{count}}"\n',
};

describe('YamlMessageProvider 正常输出', () => {
  it('按 manifest 加载并输出规范化 MessageBundleSet', async () => {
    const provider = createProvider(validFiles);
    const result = await provider.load({
      appId: 'console',
      locale: 'en-US',
      namespaces: ['common', 'user'],
      release: 'rel-20261022-01',
    });
    expect(result).toEqual({
      appId: 'console',
      locale: 'en-US',
      release: 'rel-20261022-01',
      format: 'simple-v1',
      bundles: {
        common: {
          version: '12',
          messages: { 'common.save': 'Save', 'common.cancel': 'Cancel' },
        },
        user: {
          version: '7',
          messages: {
            'user.page.title': 'Users',
            'user.selectedCount': 'Selected: {{count}}',
          },
        },
      },
    });
  });

  it('实现 MessageProvider 契约', () => {
    const provider: MessageProvider = createProvider(validFiles);
    expect(typeof provider.load).toBe('function');
  });

  it('支持部分 namespace 加载与空字符串词条', async () => {
    const provider = createProvider({
      'locales/zh-CN/common.yaml': 'common.save: 保存\ncommon.empty: ""\n',
    });
    const result = await provider.load({
      appId: 'console',
      locale: 'zh-CN',
      namespaces: ['common'],
      release: 'rel-20261022-01',
    });
    expect(result.bundles['common']?.messages).toEqual({
      'common.save': '保存',
      'common.empty': '',
    });
    expect(result.bundles['user']).toBeUndefined();
  });
});

describe('YamlMessageProvider 严格解析', () => {
  const loadCommon = (files: Record<string, string>, options?: Parameters<typeof createProvider>[1]) =>
    createProvider(files, options).load({
      appId: 'console',
      locale: 'zh-CN',
      namespaces: ['common'],
      release: 'rel-20261022-01',
    });

  it('重复 key → MESSAGE_BUNDLE_INVALID', async () => {
    await expect(
      loadCommon({ 'locales/zh-CN/common.yaml': 'common.save: 保存\ncommon.save: 重复\n' }),
    ).rejects.toMatchObject({ code: 'MESSAGE_BUNDLE_INVALID' });
  });

  it('非字符串词条（数字）→ MESSAGE_BUNDLE_INVALID', async () => {
    await expect(
      loadCommon({ 'locales/zh-CN/common.yaml': 'common.save: 保存\ncommon.count: 42\n' }),
    ).rejects.toMatchObject({ code: 'MESSAGE_BUNDLE_INVALID' });
  });

  it('非字符串词条（嵌套对象）→ MESSAGE_BUNDLE_INVALID', async () => {
    await expect(
      loadCommon({
        'locales/zh-CN/common.yaml': 'common:\n  save: 保存\n',
      }),
    ).rejects.toMatchObject({ code: 'MESSAGE_BUNDLE_INVALID' });
  });

  it('损坏的 YAML → MESSAGE_BUNDLE_INVALID', async () => {
    await expect(
      loadCommon({ 'locales/zh-CN/common.yaml': 'common.save: [unclosed\n' }),
    ).rejects.toMatchObject({ code: 'MESSAGE_BUNDLE_INVALID' });
  });

  it('自定义标签 → MESSAGE_BUNDLE_INVALID', async () => {
    await expect(
      loadCommon({
        'locales/zh-CN/common.yaml': "common.save: !!js/function 'function () {}'\n",
      }),
    ).rejects.toMatchObject({ code: 'MESSAGE_BUNDLE_INVALID' });
  });

  it('非法键名 → MESSAGE_BUNDLE_INVALID', async () => {
    await expect(
      loadCommon({ 'locales/zh-CN/common.yaml': 'common..save: 保存\n' }),
    ).rejects.toMatchObject({ code: 'MESSAGE_BUNDLE_INVALID' });
  });

  it('非映射顶层（数组）→ MESSAGE_BUNDLE_INVALID', async () => {
    await expect(
      loadCommon({ 'locales/zh-CN/common.yaml': '- a\n- b\n' }),
    ).rejects.toMatchObject({ code: 'MESSAGE_BUNDLE_INVALID' });
  });

  it('超出大小限制 → MESSAGE_BUNDLE_INVALID', async () => {
    await expect(
      loadCommon(
        { 'locales/zh-CN/common.yaml': 'common.save: 保存\n' },
        { maxFileBytes: 4 },
      ),
    ).rejects.toMatchObject({ code: 'MESSAGE_BUNDLE_INVALID' });
  });

  it('超出别名展开限制 → MESSAGE_BUNDLE_INVALID', async () => {
    await expect(
      loadCommon(
        { 'locales/zh-CN/common.yaml': 'a: &x "v"\nb: *x\nc: *x\n' },
        { maxAliasCount: 1 },
      ),
    ).rejects.toMatchObject({ code: 'MESSAGE_BUNDLE_INVALID' });
  });

  it('文件读取失败 → MESSAGE_FETCH_FAILED', async () => {
    await expect(loadCommon({})).rejects.toMatchObject({ code: 'MESSAGE_FETCH_FAILED' });
  });
});

describe('YamlMessageProvider 清单与冲突', () => {
  const input = {
    appId: 'console',
    locale: 'zh-CN',
    namespaces: ['common'],
    release: 'rel-20261022-01',
  };

  it('namespace 缺失 → NAMESPACE_NOT_FOUND', async () => {
    const provider = createProvider(validFiles);
    await expect(
      provider.load({ ...input, namespaces: ['common', 'missing-ns'] }),
    ).rejects.toMatchObject({ code: 'NAMESPACE_NOT_FOUND' });
  });

  it('locale 不在清单 → NAMESPACE_NOT_FOUND', async () => {
    const provider = createProvider(validFiles);
    await expect(provider.load({ ...input, locale: 'fr-FR' })).rejects.toMatchObject({
      code: 'NAMESPACE_NOT_FOUND',
    });
  });

  it('appId 与清单不一致 → MANIFEST_MISMATCH', async () => {
    const provider = createProvider(validFiles);
    await expect(provider.load({ ...input, appId: 'other' })).rejects.toMatchObject({
      code: 'MANIFEST_MISMATCH',
    });
  });

  it('release 与清单不一致 → MANIFEST_MISMATCH', async () => {
    const provider = createProvider(validFiles);
    await expect(provider.load({ ...input, release: 'rel-old' })).rejects.toMatchObject({
      code: 'MANIFEST_MISMATCH',
    });
  });

  it('namespace 间完整 key 冲突 → MESSAGE_BUNDLE_INVALID', async () => {
    const provider = createProvider({
      'locales/zh-CN/common.yaml': 'shared.key: 来自 common\n',
      'locales/zh-CN/user.yaml': 'shared.key: 来自 user\n',
    });
    await expect(
      provider.load({ ...input, namespaces: ['common', 'user'] }),
    ).rejects.toMatchObject({ code: 'MESSAGE_BUNDLE_INVALID' });
  });

  it('不同 namespace 的相似 key 不冲突', async () => {
    const provider = createProvider({
      'locales/zh-CN/common.yaml': 'common.save: 保存\n',
      'locales/zh-CN/user.yaml': 'user.save: 保存用户\n',
    });
    const result = await provider.load({ ...input, namespaces: ['common', 'user'] });
    expect(Object.keys(result.bundles)).toEqual(['common', 'user']);
  });

  it('清单结构非法 → MANIFEST_INVALID', () => {
    expect(() => createProvider({}, { manifest: { appId: 1 } })).toThrowError(
      expect.objectContaining({ code: 'MANIFEST_INVALID' }),
    );
  });

  it('清单路径含 .. 或绝对路径 → MANIFEST_INVALID', () => {
    const bad = {
      appId: 'console',
      release: 'r1',
      locales: { 'zh-CN': { common: { path: '../secret.yaml', version: '1' } } },
    };
    expect(() => createProvider({}, { manifest: bad })).toThrowError(
      expect.objectContaining({ code: 'MANIFEST_INVALID' }),
    );
    const abs = {
      appId: 'console',
      release: 'r1',
      locales: { 'zh-CN': { common: { path: '/etc/passwd', version: '1' } } },
    };
    expect(() => createProvider({}, { manifest: abs })).toThrowError(
      expect.objectContaining({ code: 'MANIFEST_INVALID' }),
    );
  });

  it('错误实例均为 I18nError', async () => {
    const provider = createProvider({ 'locales/zh-CN/common.yaml': 'a: [x\n' });
    try {
      await provider.load({
        appId: 'console',
        locale: 'zh-CN',
        namespaces: ['common'],
        release: 'rel-20261022-01',
      });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(I18nError);
    }
  });
});
