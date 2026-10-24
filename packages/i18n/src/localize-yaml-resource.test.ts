import { describe, expect, it, vi } from 'vitest';

import type { LoadMessagesInput, MessageProvider } from './message-provider.js';
import type { MessageBundleSet } from '@pactor-app/core';

import { I18nError } from './errors.js';
import {
  localizeYamlResource,
  parsePageYamlStrict,
  type LocalizeYamlResourceInput,
} from './localize-yaml-resource.js';
import type { AuthorPageDsl } from './dsl-localizer.js';

/** 内存语言包 Provider：locale → namespace → messages */
function memoryProvider(
  data: Record<string, Record<string, Record<string, string>>>,
): MessageProvider & { calls: LoadMessagesInput[] } {
  const calls: LoadMessagesInput[] = [];
  return {
    calls,
    async load(input: LoadMessagesInput): Promise<MessageBundleSet> {
      calls.push(input);
      const bundles: Record<string, { version: string; messages: Record<string, string> }> = {};
      for (const namespace of input.namespaces) {
        const messages = data[input.locale]?.[namespace];
        if (messages === undefined) {
          throw new I18nError('NAMESPACE_NOT_FOUND', `缺少语言包: ${input.locale}/${namespace}`);
        }
        bundles[namespace] = { version: `${input.locale}-${namespace}-v1`, messages };
      }
      return { appId: input.appId, locale: input.locale, release: input.release, format: 'simple-v1', bundles };
    },
  };
}

const PAGE_YAML = `
dsl: "1.0"
page:
  id: editor
  title: 编辑页面
i18n:
  namespaces: [editor, common]
  bindings:
    /page/title:
      key: editor.page.title
body:
  type: Button
  props:
    text:
      $i18n:
        key: common.save
        fallback: 保存
`;

const bundles = {
  'zh-CN': {
    editor: { 'editor.page.title': '编辑页面' },
    common: { 'common.save': '保存' },
  },
  'en-US': {
    editor: { 'editor.page.title': 'Edit page' },
    common: { 'common.save': 'Save' },
  },
  fr: {
    editor: { 'editor.page.title': 'Éditeur' },
    common: { 'common.save': 'Enregistrer' },
  },
  'fr-CA': {
    editor: {},
    common: {},
  },
};

function baseInput(over?: Partial<LocalizeYamlResourceInput>): LocalizeYamlResourceInput {
  return {
    loadText: async () => PAGE_YAML,
    provider: memoryProvider(bundles),
    appId: 'console',
    release: 'rel-1',
    locale: 'en-US',
    defaultLocale: 'zh-CN',
    ...over,
  };
}

describe('localizeYamlResource 编排（设计 6.0.2，缺口 G18）', () => {
  it('完整流程：YAML → 本地化 schema + localization 元信息', async () => {
    const result = await localizeYamlResource(baseInput({ source: 'url-query', explicit: true }));
    expect(result.schema).toEqual({
      dsl: '1.0',
      page: { id: 'editor', title: 'Edit page' },
      body: { type: 'Button', props: { text: 'Save' } },
    });
    expect(result.localization).toEqual({
      locale: 'en-US',
      defaultLocale: 'zh-CN',
      release: 'rel-1',
      source: 'url-query',
      explicit: true,
      bundleVersions: {
        editor: 'en-US-editor-v1',
        common: 'en-US-common-v1',
      },
    });
  });

  it('语言包按 locale 链批量加载，不随组件数量逐个请求', async () => {
    const provider = memoryProvider(bundles);
    await localizeYamlResource(baseInput({ provider }));
    // 多组件页面也只有链长度次调用（en-US + zh-CN 默认语言）
    expect(provider.calls.map((c) => c.locale)).toEqual(['en-US', 'zh-CN']);
    for (const call of provider.calls) {
      expect(call.namespaces).toEqual(['editor', 'common']);
    }
  });

  it('显式语言级回退参与批量加载与查找（fr-CA → fr → zh-CN）', async () => {
    const provider = memoryProvider(bundles);
    const result = await localizeYamlResource(
      baseInput({ provider, locale: 'fr-CA', fallbackLocales: ['fr'] }),
    );
    expect(provider.calls.map((c) => c.locale)).toEqual(['fr-CA', 'fr', 'zh-CN']);
    expect(result.schema.page.title).toBe('Éditeur');
    expect(result.schema.body).toMatchObject({ props: { text: 'Enregistrer' } });
  });

  it('无 namespaces 声明时不请求 Provider，内联 messages 仍可转换', async () => {
    const provider = memoryProvider(bundles);
    const loadSpy = vi.spyOn(provider, 'load');
    const result = await localizeYamlResource(
      baseInput({
        provider,
        loadText: async () => `
dsl: "1.0"
page:
  id: p
body:
  type: Button
  props:
    text:
      $i18n:
        messages:
          en-US: Save
`,
      }),
    );
    expect(loadSpy).not.toHaveBeenCalled();
    expect(result.schema.body).toMatchObject({ props: { text: 'Save' } });
    expect(result.localization.bundleVersions).toEqual({});
  });

  it('裁剪钩子在作者态校验后执行，结果参与转换', async () => {
    const prune = vi.fn((page: AuthorPageDsl): AuthorPageDsl => {
      const clone = JSON.parse(JSON.stringify(page)) as AuthorPageDsl;
      // 裁剪掉 Button 的 text（模拟无权限），bindings 只保留 page.title
      (clone.body as { props: Record<string, unknown> }).props = {};
      return clone;
    });
    const result = await localizeYamlResource(baseInput({ prune }));
    expect(prune).toHaveBeenCalledTimes(1);
    expect(result.schema.page.title).toBe('Edit page');
    expect(result.schema.body).toMatchObject({ props: {} });
  });

  it('作者态校验失败 → PAGE_DSL_INVALID', async () => {
    await expect(
      localizeYamlResource(
        baseInput({
          loadText: async () => `
dsl: "1.0"
page:
  id: p
i18n:
  bindings:
    非法指针:
      key: common.save
`,
        }),
      ),
    ).rejects.toThrowError(expect.objectContaining({ code: 'PAGE_DSL_INVALID' }));
  });

  it('YAML 语法错误 / 重复 key → PAGE_YAML_INVALID', async () => {
    await expect(
      localizeYamlResource(baseInput({ loadText: async () => 'dsl: "1.0"\npage: [broken' })),
    ).rejects.toThrowError(expect.objectContaining({ code: 'PAGE_YAML_INVALID' }));
    await expect(
      localizeYamlResource(
        baseInput({ loadText: async () => 'dsl: "1.0"\npage:\n  id: a\n  id: b\n' }),
      ),
    ).rejects.toThrowError(expect.objectContaining({ code: 'PAGE_YAML_INVALID' }));
  });

  it('bindings 路径重复（YAML 重复键）→ PAGE_YAML_INVALID', async () => {
    await expect(
      localizeYamlResource(
        baseInput({
          loadText: async () => `
dsl: "1.0"
page:
  id: p
  title: t
i18n:
  bindings:
    /page/title:
      key: common.save
    /page/title:
      key: common.save
`,
        }),
      ),
    ).rejects.toThrowError(expect.objectContaining({ code: 'PAGE_YAML_INVALID' }));
  });

  it('加载失败 → PAGE_LOAD_FAILED', async () => {
    await expect(
      localizeYamlResource(
        baseInput({
          loadText: async () => {
            throw new Error('io error');
          },
        }),
      ),
    ).rejects.toThrowError(expect.objectContaining({ code: 'PAGE_LOAD_FAILED' }));
  });

  it('注入的 parseYaml 抛非 I18nError → 包装为 PAGE_YAML_INVALID', async () => {
    await expect(
      localizeYamlResource(
        baseInput({
          parseYaml: () => {
            throw new Error('custom parser boom');
          },
        }),
      ),
    ).rejects.toThrowError(expect.objectContaining({ code: 'PAGE_YAML_INVALID' }));
  });

  it('Provider 失败（namespace 缺失）原样上抛', async () => {
    await expect(
      localizeYamlResource(
        baseInput({
          loadText: async () => `
dsl: "1.0"
page:
  id: p
i18n:
  namespaces: [missing]
`,
        }),
      ),
    ).rejects.toThrowError(expect.objectContaining({ code: 'NAMESPACE_NOT_FOUND' }));
  });

  it('诊断回调透传（缺失词条回退到 fallback）', async () => {
    const diagnostics: unknown[] = [];
    const result = await localizeYamlResource(
      baseInput({
        onDiagnostic: (d) => diagnostics.push(d),
        loadText: async () => `
dsl: "1.0"
page:
  id: p
body:
  type: Button
  props:
    text:
      $i18n:
        key: common.notExist
        fallback: 兜底文案
`,
      }),
    );
    expect(result.schema.body).toMatchObject({ props: { text: '兜底文案' } });
    expect(diagnostics).toContainEqual(
      expect.objectContaining({ type: 'missing-translation', resolution: 'fallback' }),
    );
  });
});

describe('parsePageYamlStrict', () => {
  it('自定义标签被拒绝', () => {
    expect(() => parsePageYamlStrict('dsl: "1.0"\npage: !!js/function "x"\n')).toThrowError(
      expect.objectContaining({ code: 'PAGE_YAML_INVALID' }),
    );
  });
});
